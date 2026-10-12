/*
 * Lineo – tekoälyrajaus (Segment Anything) selaimessa.
 *
 * Malli ajetaan transformers.js-kirjastolla Web Workerissa. Kirjasto ja mallin
 * painot ladataan kerran verkosta (jsDelivr ja Hugging Face), minkä jälkeen ne ovat
 * selaimen välimuistissa. Kuva ei lähde koneelta: koko laskenta tehdään täällä.
 *
 * Kulku: load() → setImage() (kuvan analyysi eli "embedding", kerran kuvaa kohden)
 * → decode(points) jokaisella klikkauksella (nopea, ~0,1–0,5 s).
 */
var LineoSam = (function () {
  'use strict';

  var TRANSFORMERS_URL = (window.LineoConfig && window.LineoConfig.transformersUrl) ||
    'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js';

  var MODELS = {
    fast: { id: 'Xenova/slimsam-77-uniform', label: 'Nopea (SlimSAM)' },
    accurate: { id: 'Xenova/sam-vit-base', label: 'Tarkka (SAM ViT-B)' }
  };

  // Ajetaan workerissa. Saa transformers.js-moduulin parametrina.
  function workerMain(scope, T) {
    var model = null, processor = null, modelId = null;
    var inputs = null, embeddings = null, imageKey = null;

    // file://-sivulta luodussa workerissa ei ole käytettävissä Cache-rajapintaa.
    T.env.allowLocalModels = false;
    if (scope.origin === 'null' || typeof caches === 'undefined') T.env.useBrowserCache = false;

    function post(msg, transfer) { scope.postMessage(msg, transfer || []); }

    async function load(id) {
      if (model && modelId === id) return;
      model = null; processor = null; embeddings = null; imageKey = null;
      var progress = function (p) {
        if (p.status === 'progress' || p.status === 'done' || p.status === 'initiate') {
          post({ type: 'progress', file: p.file, loaded: p.loaded || 0, total: p.total || 0, status: p.status });
        }
      };
      model = await T.SamModel.from_pretrained(id, { dtype: 'q8', device: 'wasm', progress_callback: progress });
      processor = await T.AutoProcessor.from_pretrained(id, { progress_callback: progress });
      modelId = id;
    }

    scope.onmessage = async function (e) {
      var m = e.data;
      try {
        if (m.type === 'load') {
          await load(m.modelId);
          post({ type: 'loaded', id: m.id });
        } else if (m.type === 'image') {
          await load(m.modelId);
          var t0 = Date.now();
          var image = new T.RawImage(new Uint8ClampedArray(m.buffer), m.width, m.height, 4).rgb();
          inputs = await processor(image);
          embeddings = await model.get_image_embeddings(inputs);
          imageKey = m.key;
          post({ type: 'encoded', id: m.id, key: m.key, ms: Date.now() - t0 });
        } else if (m.type === 'decode') {
          if (!embeddings || imageKey !== m.key) throw new Error('Kuvaa ei ole analysoitu');
          var t1 = Date.now();
          var pts = m.points.map(function (p) { return [p.x, p.y]; });
          var labels = m.points.map(function (p) { return p.positive ? 1 : 0; });
          var input_points = processor.reshape_input_points([[pts]], inputs.original_sizes, inputs.reshaped_input_sizes);
          // Muoto [1, 1, n] kuten input_points [1, 1, n, 2]; 1 = kohde, 0 = tausta.
          var input_labels = new T.Tensor('int64', BigInt64Array.from(labels.map(function (l) { return BigInt(l); })), [1, 1, labels.length]);
          var out = await model(Object.assign({}, embeddings, { input_points: input_points, input_labels: input_labels }));
          var masks = await processor.post_process_masks(out.pred_masks, inputs.original_sizes, inputs.reshaped_input_sizes);
          var scores = out.iou_scores.data;
          var best = 0;
          for (var i = 1; i < scores.length; i++) if (scores[i] > scores[best]) best = i;
          var dims = masks[0].dims, h = dims[dims.length - 2], w = dims[dims.length - 1];
          var mask = new Uint8Array(masks[0].data.subarray(best * w * h, (best + 1) * w * h));
          post({ type: 'mask', id: m.id, key: m.key, width: w, height: h, buffer: mask.buffer, score: scores[best], ms: Date.now() - t1 }, [mask.buffer]);
        }
      } catch (err) {
        post({ type: 'error', id: m.id, message: String(err && err.message || err) });
      }
    };
  }

  var worker = null, nextId = 1, waiting = new Map(), onProgress = null;
  var state = { loaded: false, loading: null, encodedKey: null, encoding: null, modelKey: 'fast' };

  function ensureWorker() {
    if (worker) return worker;
    // Dynaaminen import: epäonnistuessaan se kertoo todellisen syyn (staattinen import antaa vain "Script error").
    var src = 'import(' + JSON.stringify(TRANSFORMERS_URL) + ').then(function (T) {\n(' + workerMain.toString() + ')(self, T);\n}, function (err) {\n' +
      'self.postMessage({ type: "fatal", message: ' + JSON.stringify(LineoI18n.t('sam.libFail')) + ' + (err && err.message || err) });\n});';
    var url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
    worker = new Worker(url, { type: 'module' });
    worker.onmessage = function (e) {
      var m = e.data;
      if (m.type === 'progress') { waiting.forEach(function (w) { if (w.poke) w.poke(); }); if (onProgress) onProgress(m); return; }
      if (m.type === 'fatal') {
        var fe = new Error(m.message);
        waiting.forEach(function (w) { w.reject(fe); });
        waiting.clear();
        worker.terminate();
        worker = null;
        state.loaded = false; state.loading = null; state.encodedKey = null; state.encoding = null;
        return;
      }
      var w = waiting.get(m.id);
      if (!w) return;
      waiting.delete(m.id);
      if (m.type === 'error') w.reject(new Error(m.message)); else w.resolve(m);
    };
    worker.onerror = function (e) {
      // Moduulin lataus epäonnistui (esim. ei verkkoa ensimmäisellä kerralla).
      var err = new Error(e && e.message ? e.message : LineoI18n.t('sam.loadFail'));
      waiting.forEach(function (w) { w.reject(err); });
      waiting.clear();
      worker.terminate();
      worker = null;
      state.loaded = false; state.loading = null; state.encodedKey = null; state.encoding = null;
    };
    return worker;
  }

  // Lataus ja kuvan analyysi voivat jäädä jumiin ilman virhettä: jos mikään ei etene aikarajassa, kerrotaan se virheenä.
  var STALL_MS = { load: 90000, image: 240000 };

  function call(msg, transfer) {
    return new Promise(function (resolve, reject) {
      var id = nextId++, timer = null, limit = STALL_MS[msg.type];
      msg.id = id;
      function stop() { if (timer) clearTimeout(timer); }
      function arm() {
        if (!limit) return;
        stop();
        timer = setTimeout(function () {
          waiting.delete(id);
          reject(new Error(LineoI18n.t(msg.type === 'load' ? 'sam.stuckLoad' : 'sam.stuckEncode', { s: Math.round(limit / 1000) })));
          if (worker) { worker.terminate(); worker = null; }
          state.loaded = false; state.loading = null; state.encodedKey = null; state.encoding = null;
          waiting.forEach(function (w) { w.reject(new Error(LineoI18n.t('sam.aborted'))); });
          waiting.clear();
        }, limit);
      }
      waiting.set(id, {
        resolve: function (v) { stop(); resolve(v); },
        reject: function (e) { stop(); reject(e); },
        poke: arm
      });
      arm();
      try { ensureWorker().postMessage(msg, transfer || []); }
      catch (err) { stop(); waiting.delete(id); reject(err); }
    });
  }

  function modelId() { return MODELS[state.modelKey].id; }

  function load() {
    if (state.loaded) return Promise.resolve();
    if (!state.loading) {
      var key = state.modelKey;
      var p = state.loading = call({ type: 'load', modelId: modelId() }).then(function () {
        // Malli on voitu vaihtaa latauksen aikana: vanha lataus ei merkitse uutta valmiiksi.
        if (state.modelKey === key) state.loaded = true;
      }, function (err) {
        if (state.loading === p) state.loading = null;
        throw err;
      });
    }
    return state.loading;
  }

  // imageData: ImageData (pienennetty, pidempi sivu ≤ 1024). key tunnistaa kuvan.
  function setImage(imageData, key) {
    if (state.encodedKey === key) return Promise.resolve();
    if (state.encoding && state.encoding.key === key) return state.encoding.promise;
    var copy = new Uint8ClampedArray(imageData.data);
    var model = state.modelKey;
    var p = load().then(function () {
      return call({ type: 'image', modelId: modelId(), key: key, buffer: copy.buffer, width: imageData.width, height: imageData.height }, [copy.buffer]);
    }).then(function () {
      if (state.modelKey === model) state.encodedKey = key;
      state.encoding = null;
    }, function (err) {
      state.encoding = null;
      throw err;
    });
    state.encoding = { key: key, promise: p };
    return p;
  }

  // points: [{ x, y, positive }] analysoidun kuvan pikseleinä. → { mask, width, height, score }
  function decode(points, key) {
    return call({ type: 'decode', key: key, points: points }).then(function (m) {
      return { mask: new Uint8Array(m.buffer), width: m.width, height: m.height, score: m.score, ms: m.ms };
    });
  }

  function setModel(key) {
    if (!MODELS[key] || key === state.modelKey) return;
    state.modelKey = key;
    state.loaded = false; state.loading = null; state.encodedKey = null; state.encoding = null;
  }

  return {
    MODELS: MODELS,
    load: load,
    setImage: setImage,
    decode: decode,
    setModel: setModel,
    get modelKey() { return state.modelKey; },
    get isLoaded() { return state.loaded; },
    isEncoded: function (key) { return state.encodedKey === key; },
    set onProgress(fn) { onProgress = fn; }
  };
})();
