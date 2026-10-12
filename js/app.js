/* Lineo – käyttöliittymä: tasot, piirto, valinnat, muunnos, rajaus, automaattiset ääriviivat, tekoälyrajaus, vektoriviivojen muokkaus, vienti. */
(function () {
  'use strict';

  // Työskentelykoon yläraja (pidempi sivu). Isommat kuvat skaalataan alas,
  // jotta reunantunnistus pysyy nopeana ja muistia riittää.
  // Puhelimissa ja tableteissa muistia on vähemmän, joten raja on pienempi.
  var IS_TOUCH = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var MAX_SIDE = IS_TOUCH ? 3072 : 4096;

  var $ = function (id) { return document.getElementById(id); };

  var els = {
    workspace: $('workspace'),
    view: $('view'),
    empty: $('empty-state'),
    dropOverlay: $('drop-overlay'),
    fileInput: $('file-input'),
    fileName: $('file-name'),
    btnOpen: $('btn-open'),
    btnOpenEmpty: $('btn-open-empty'),
    btnExport: $('btn-export'),
    busy: $('busy'),
    detail: $('detail'),
    thickness: $('thickness'),
    noise: $('noise'),
    lineColor: $('line-color'),
    origOpacity: $('orig-opacity'),
    layerList: $('layer-list'),
    statusSize: $('status-size'),
    btnFit: $('btn-fit'),
    btnPanel: $('btn-panel'),
    statusEdges: $('status-edges'),
    toasts: $('toasts'),
    toolbar: $('toolbar'),
    btnUndo: $('btn-undo'),
    btnRedo: $('btn-redo'),
    aiStatus: $('ai-status'),
    aiStatusText: $('ai-status-text'),
    aiProgress: $('ai-progress'),
    aiSection: $('ai-section'),
    aiAdd: $('ai-add'),
    aiRemove: $('ai-remove'),
    aiDone: $('ai-done'),
    aiCancel: $('ai-cancel'),
    aiMethod: $('ai-method'),
    aiTolerance: $('ai-tolerance'),
    aiToleranceField: $('ai-tolerance-field'),
    vectorSection: $('vector-section'),
    vecWidth: $('vec-width'),
    vecColor: $('vec-color'),
    vecDetail: $('vec-detail'),
    vecCount: $('vec-count'),
    vecHint: $('vec-hint'),
    nodeTools: $('node-tools'),
    nodeDelete: $('node-delete'),
    nodeToggle: $('node-toggle'),
    paintSection: $('paint-section'),
    paintTitle: $('paint-title'),
    brushSize: $('brush-size'),
    brushHardness: $('brush-hardness'),
    brushHardnessField: $('brush-hardness-field'),
    brushStab: $('brush-stab'),
    brushColor: $('brush-color'),
    brushColorField: $('brush-color-field'),
    contourControls: $('contour-controls'),
    contourEdited: $('contour-edited'),
    contourReset: $('contour-reset'),
    layerAdd: $('layer-add'),
    layerUp: $('layer-up'),
    layerDown: $('layer-down'),
    layerLock: $('layer-lock'),
    layerDelete: $('layer-delete'),
    layerOpacity: $('layer-opacity'),
    brushSizeField: $('brush-size-field'),
    brushStabField: $('brush-stab-field'),
    paintHint: $('paint-hint'),
    fillSection: $('fill-section'),
    fillTitle: $('fill-title'),
    gradientFields: $('gradient-fields'),
    bucketFields: $('bucket-fields'),
    gradType: $('grad-type'),
    gradMode: $('grad-mode'),
    gradColor2: $('grad-color2'),
    gradColor2Field: $('grad-color2-field'),
    fillSource: $('fill-source'),
    fillTol: $('fill-tol'),
    fillGrow: $('fill-grow'),
    selectSection: $('select-section'),
    selInfo: $('sel-info'),
    selNew: $('sel-new'),
    selAdd: $('sel-add'),
    selSub: $('sel-sub'),
    wandFields: $('wand-fields'),
    wandSource: $('wand-source'),
    wandTol: $('wand-tol'),
    wandContig: $('wand-contig'),
    selAll: $('sel-all'),
    selNone: $('sel-none'),
    selInvert: $('sel-invert'),
    selGrowAmount: $('sel-grow-amount'),
    selExpand: $('sel-expand'),
    selContract: $('sel-contract'),
    selCopy: $('sel-copy'),
    selCut: $('sel-cut'),
    selDelete: $('sel-delete'),
    selFill: $('sel-fill'),
    transformSection: $('transform-section'),
    tfAngle: $('tf-angle'),
    tfRatio: $('tf-ratio'),
    tfFlipH: $('tf-flip-h'),
    tfFlipV: $('tf-flip-v'),
    tfRot90: $('tf-rot90'),
    tfApply: $('tf-apply'),
    tfCancel: $('tf-cancel'),
    cropSection: $('crop-section'),
    cropInfo: $('crop-info'),
    cropRatio: $('crop-ratio'),
    cropApply: $('crop-apply'),
    cropCancel: $('crop-cancel'),
    cropBg: $('crop-bg'),
    btnEdit: $('btn-edit'),
    editMenu: $('edit-menu'),
    canvasModal: $('canvas-modal'),
    canvasCurrent: $('canvas-current'),
    canvasW: $('canvas-w'),
    canvasH: $('canvas-h'),
    canvasLink: $('canvas-link'),
    canvasAnchor: $('canvas-anchor'),
    canvasBg: $('canvas-bg'),
    canvasApply: $('canvas-apply'),
    canvasCancel: $('canvas-cancel'),
    btnAdjust: $('btn-adjust'),
    adjustMenu: $('adjust-menu'),
    adjustSection: $('adjust-section'),
    adjustTitle: $('adjust-title'),
    adjApply: $('adj-apply'),
    adjCancel: $('adj-cancel'),
    lvChannel: $('lv-channel'),
    lvInWhite: $('lv-inwhite'),
    lvHist: $('lv-hist'),
    lvAuto: $('lv-auto'),
    lvReset: $('lv-reset'),
    cvCanvas: $('cv-canvas'),
    cvChannel: $('cv-channel'),
    cvReset: $('cv-reset'),
    pickerSection: $('picker-section'),
    pickSource: $('pick-source'),
    pickSize: $('pick-size'),
    pickSwatch: $('pick-swatch'),
    pickHex: $('pick-hex'),
    contourStyles: $('contour-styles'),
    vectorStyles: $('vector-styles'),
    vecStyleAll: $('vec-style-all'),
    btnFile: $('btn-file'),
    fileMenu: $('file-menu'),
    paletteInput: $('palette-input'),
    vecToSel: $('vec-to-sel'),
    exportModal: $('export-modal'),
    exContent: $('ex-content'),
    exBg: $('ex-bg'),
    exBgColor: $('ex-bgcolor'),
    exSize: $('ex-size'),
    exFormat: $('ex-format'),
    exQuality: $('ex-quality'),
    exInfo: $('ex-info'),
    exCutSource: $('ex-cut-source'),
    exCutCrop: $('ex-cut-crop'),
    exCutLines: $('ex-cut-lines'),
    exDownload: $('ex-download'),
    exCancel: $('ex-cancel'),
    keysModal: $('keys-modal'),
    keysClose: $('keys-close')
  };

  var doc = null;          // { width, height, layers: [...] }, tasot alhaalta ylös
  var baseName = 'kuva';

  // ---------- Ilmoitukset ----------

  function toast(msg, isError) {
    var t = document.createElement('div');
    t.className = 'lineo-toast' + (isError ? ' is-error' : '');
    t.textContent = msg;
    els.toasts.appendChild(t);
    setTimeout(function () { t.remove(); }, isError ? 6000 : 3500);
  }

  // ---------- Reunantunnistuksen ajaja (Web Worker, varalla pääsäie) ----------

  // Säädintä raahatessa lasketaan ensin kevyt esikatselu, irrottaessa täysi tarkkuus.
  var PREVIEW_SIDE = 1200;

  var engine = (function () {
    var worker = null, cores = null;
    var busy = false, pending = null, nextId = 1, onResult = null;
    var images = null, lastJob = null;

    function startLocal() {
      worker = null;
      cores = { full: LineoEdgeCore(), preview: LineoEdgeCore() };
      if (images) {
        cores.full.setImage(images.full.data, images.full.width, images.full.height);
        if (images.preview) cores.preview.setImage(images.preview.data, images.preview.width, images.preview.height);
      }
    }

    try {
      var src = LineoEdgeCore.toString() + '\n' + LineoEdgeWorkerMain.toString() +
        '\nLineoEdgeWorkerMain(self, LineoEdgeCore);';
      var url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
      worker = new Worker(url);
      worker.onmessage = function (e) { finish(e.data); };
      worker.onerror = function (e) {
        console.warn('Worker epäonnistui, käytetään pääsäiettä', e);
        startLocal();
        busy = false;
        if (lastJob) request(lastJob.params, lastJob.preview);
      };
    } catch (err) {
      console.warn('Worker ei käytettävissä, käytetään pääsäiettä', err);
      startLocal();
    }

    function send(target, imageData) {
      if (worker) {
        var copy = new Uint8ClampedArray(imageData.data);
        worker.postMessage({ type: 'image', target: target, buffer: copy.buffer, width: imageData.width, height: imageData.height }, [copy.buffer]);
      } else {
        cores[target].setImage(imageData.data, imageData.width, imageData.height);
      }
    }

    // preview-kuva on valinnainen (vain isoille kuville).
    function setImage(full, preview) {
      images = { full: full, preview: preview || null };
      pending = null;
      send('full', full);
      if (preview) send('preview', preview);
    }

    function request(params, preview) {
      var job = { params: params, preview: !!(preview && images && images.preview) };
      lastJob = job;
      if (busy) { pending = job; return; }
      busy = true;
      setBusy(true);
      var id = nextId++, target = job.preview ? 'preview' : 'full';
      if (worker) {
        worker.postMessage({ type: 'run', id: id, target: target, params: params });
      } else {
        setTimeout(function () {
          try {
            var r = cores[target].run(params);
            finish({ type: 'result', id: id, target: target, buffer: r.rgba.buffer, width: r.width, height: r.height, edgePixels: r.edgePixels, ms: r.ms });
          } catch (err) {
            finish({ type: 'error', id: id, message: String(err.message || err) });
          }
        }, 0);
      }
    }

    function finish(msg) {
      busy = false;
      if (pending) {
        // Uudempi pyyntö odottaa – näytetään silti välitulos, jotta säädin tuntuu elävältä.
        var job = pending; pending = null;
        if (msg.type === 'result' && onResult) onResult(msg);
        request(job.params, job.preview);
        return;
      }
      setBusy(false);
      if (msg.type === 'error') { toast('Reunantunnistus epäonnistui: ' + msg.message, true); return; }
      if (onResult) onResult(msg);
    }

    return {
      setImage: setImage,
      request: request,
      set onResult(fn) { onResult = fn; }
    };
  })();

  function setBusy(on) { els.busy.hidden = !on; }

  // ---------- Parametrit ----------

  function hexToRgb(hex) {
    var v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }

  function readParams() {
    return {
      detail: +els.detail.value,
      thickness: +els.thickness.value,
      noise: +els.noise.value,
      color: hexToRgb(els.lineColor.value)
    };
  }

  function updateRangeFill(input) {
    var min = +input.min, max = +input.max;
    input.style.setProperty('--fill', ((input.value - min) / (max - min) * 100) + '%');
  }

  function updateOutputs() {
    $('detail-out').textContent = els.detail.value;
    $('thickness-out').textContent = (+els.thickness.value).toFixed(1).replace('.', ',') + ' px';
    $('noise-out').textContent = els.noise.value;
    $('orig-opacity-out').textContent = els.origOpacity.value + ' %';
    $('vec-width-out').textContent = (+els.vecWidth.value).toFixed(1).replace('.', ',') + ' px';
    $('vec-detail-out').textContent = els.vecDetail.value;
    $('ai-tolerance-out').textContent = els.aiTolerance.value;
    $('layer-opacity-out').textContent = els.layerOpacity.value + ' %';
    $('brush-size-out').textContent = sizeFromSlider(+els.brushSize.value) + ' px';
    $('brush-hardness-out').textContent = els.brushHardness.value + ' %';
    $('brush-stab-out').textContent = els.brushStab.value;
    $('fill-tol-out').textContent = els.fillTol.value;
    $('fill-grow-out').textContent = els.fillGrow.value + ' px';
    $('wand-tol-out').textContent = els.wandTol.value;
    $('sel-grow-out').textContent = els.selGrowAmount.value + ' px';
    $('tf-angle-out').textContent = els.tfAngle.value + '°';
    [els.fillTol, els.fillGrow, els.wandTol, els.selGrowAmount, els.tfAngle].forEach(updateRangeFill);
    [els.detail, els.thickness, els.noise, els.origOpacity, els.vecWidth, els.vecDetail, els.aiTolerance,
      els.layerOpacity, els.brushSize, els.brushHardness, els.brushStab].forEach(updateRangeFill);
  }

  function requestContours(preview) {
    if (!doc || !doc.contourOn || getLayer('contour').edited) return;
    var p = readParams();
    p.scale = Math.max(1, Math.max(doc.width, doc.height) / 1600);
    if (preview && doc.previewScale < 1) {
      // Paksuus, sumennus ja minimipituus ovat pikseleinä, joten esikatselussa ne skaalataan.
      p.thickness = Math.max(0.5, p.thickness * doc.previewScale);
      p.scale *= doc.previewScale;
    }
    engine.request(p, preview);
  }

  var previewCanvas = null;

  engine.onResult = function (msg) {
    if (!doc) return;
    var layer = getLayer('contour');
    if (layer.edited) return;   // käsin muokattua tasoa ei ylikirjoiteta
    var ctx = layer.canvas.getContext('2d');
    var img = new ImageData(new Uint8ClampedArray(msg.buffer), msg.width, msg.height);
    if (contourStyle === 'pencil') LineoFilters.pencilGrain(img.data, img.width, img.height);
    if (msg.target === 'preview') {
      if (!doc.preview || msg.width !== doc.preview.width || msg.height !== doc.preview.height) return;
      if (!previewCanvas || previewCanvas.width !== msg.width || previewCanvas.height !== msg.height) {
        previewCanvas = makeCanvas(msg.width, msg.height);
      }
      previewCanvas.getContext('2d').putImageData(img, 0, 0);
      ctx.clearRect(0, 0, doc.width, doc.height);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(previewCanvas, 0, 0, doc.width, doc.height);
      doc.contourIsPreview = true;
      els.statusEdges.textContent = 'esikatselu · ' + msg.ms + ' ms';
    } else {
      if (msg.width !== doc.width || msg.height !== doc.height) return;
      ctx.putImageData(img, 0, 0);
      doc.contourIsPreview = false;
      els.statusEdges.textContent = msg.edgePixels.toLocaleString('fi-FI') + ' reunapikseliä · ' + msg.ms + ' ms';
    }
    render();
    scheduleThumbs();
  };

  // ---------- Dokumentti ja tasot ----------
  //
  // Taso: { id, kind: 'raster' | 'vector', name, visible, opacity, ... }
  //   raster: canvas
  //   vector: paths, stroke { width, color }, loops (alkuperäinen rajaus), detail

  function makeCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }

  function getLayer(id) {
    if (!doc) return null;
    for (var i = 0; i < doc.layers.length; i++) if (doc.layers[i].id === id) return doc.layers[i];
    return null;
  }

  function activeLayer() { return doc ? getLayer(doc.activeId) : null; }
  function activeVector() { var L = activeLayer(); return L && L.kind === 'vector' ? L : null; }

  function defaultLineWidth() {
    return doc ? Math.max(1, Math.round(Math.max(doc.width, doc.height) / 800 * 2) / 2) : 2;
  }

  // Näyttää avatun dokumentin (kuva tai projekti): käyttöliittymä valmiiksi.
  function showDocument(label, sizeText) {
    clearHistory();
    selection = null;
    els.empty.hidden = true;
    els.toolbar.hidden = false;
    els.btnExport.disabled = false;
    els.btnEdit.disabled = false;
    els.btnAdjust.disabled = false;
    doc.label = label;
    updateFileLabel();
    els.statusSize.textContent = sizeText;
    els.statusEdges.textContent = '';
    buildLayerList();
    updateContextPanel();
    fitView();
    if (tool === 'ai') aiPrepare();
  }

  async function openFile(file) {
    if (!file) return;
    if (/\.lineo$/i.test(file.name)) { return openProjectFile(file); }
    if (!/^image\//.test(file.type)) { toast('Tiedosto ei ole kuva: ' + file.name, true); return; }
    if (!confirmDiscard()) return;

    var bmp;
    try {
      bmp = await createImageBitmap(file);
    } catch (err) {
      toast('Kuvaa ei voitu avata (' + file.name + ').', true);
      return;
    }

    var w = bmp.width, h = bmp.height, scaled = false, fullW = w, fullH = h;
    var s = Math.min(1, MAX_SIDE / Math.max(w, h));
    if (s < 1) { w = Math.round(w * s); h = Math.round(h * s); scaled = true; }

    var orig = makeCanvas(w, h);
    var octx = orig.getContext('2d', { willReadFrequently: true });
    octx.imageSmoothingQuality = 'high';
    octx.drawImage(bmp, 0, 0, w, h);
    if (bmp.close) bmp.close();

    aiReset();
    tf = null; crop = null; shapePreview = null; sel = null; adj = null; contourStyle = null; penSession = null;
    // Kuva näkyy aluksi sellaisenaan: ei ääriviivoja eikä himmennystä, ennen kuin käyttäjä pyytää ääriviivat.
    els.origOpacity.value = 100;
    doc = {
      contourOn: false,
      key: 'img' + Date.now(),
      width: w,
      height: h,
      activeId: 'contour',
      vectorCount: 0,
      rasterCount: 0,
      dirty: false,
      label: file.name,
      fileHandle: null,
      // Pienennetyn kuvan alkuperäinen tiedosto säilytetään, jotta vienti alkuperäisessä koossa onnistuu.
      src: scaled ? { file: file, kx: fullW / w, ky: fullH / h, fullW: fullW, fullH: fullH, ox: 0, oy: 0, bg: 'transparent', ops: [] } : null,
      layers: [
        // Alkuperäinen on aina suojattu: tekoäly ja reunantunnistus käyttävät sitä lähteenä.
        { id: 'original', kind: 'raster', name: 'Alkuperäinen', canvas: orig, visible: true, opacity: +els.origOpacity.value / 100, locked: true },
        { id: 'contour', kind: 'raster', name: 'Ääriviivat', canvas: makeCanvas(w, h), visible: true, opacity: 1, locked: false, edited: false }
      ]
    };
    baseName = file.name.replace(/\.[^.]+$/, '') || 'kuva';

    // Viivan oletuspaksuus kuvan koon mukaan, jotta viiva näkyy myös koko kuvan näkymässä.
    els.thickness.value = defaultLineWidth();
    els.vecWidth.value = defaultLineWidth();
    resetPaintDefaults();
    updateOutputs();

    showDocument(file.name, w + ' × ' + h + ' px' + (scaled ? ' (pienennetty työskentelykokoon)' : ''));
    if (scaled) toast('Iso kuva (' + fullW + ' × ' + fullH + ' px) pienennettiin työskentelykokoon ' + w + ' × ' + h + ' px. Alkuperäinen koko säilyy: valitse viennissä "Alkuperäinen koko".');

    prepareEngine();
  }

  // Ottaa automaattiset ääriviivat käyttöön (ensimmäisellä kerralla alkuperäinen himmennetään, jotta viivat erottuvat).
  function contoursOn() {
    if (!doc || doc.contourOn) return;
    doc.contourOn = true;
    var orig = getLayer('original');
    if (orig.opacity >= 1) {
      orig.opacity = 0.35;
      els.origOpacity.value = 35;
      syncOpacityUI(orig);
      render();
    }
    updateContextPanel();
  }

  // Poistaa automaattiset ääriviivat: kuva palaa sellaisenaan (alkuperäinen 100 %). Kumottavissa.
  function removeContours() {
    if (!doc || !doc.contourOn) return;
    settle();
    var L = getLayer('contour'), orig = getLayer('original');
    var snap = copyCanvas(L.canvas), wasEdited = !!L.edited, wasOpacity = orig.opacity, wasStyle = contourStyle;
    function off() {
      var x = L.canvas.getContext('2d');
      x.setTransform(1, 0, 0, 1, 0, 0);
      x.clearRect(0, 0, doc.width, doc.height);
      L.edited = false;
      doc.contourOn = false;
      doc.contourIsPreview = false;
      contourStyle = null;
      orig.opacity = 1;
      els.origOpacity.value = 100;
      syncOpacityUI(orig);
      updateStyleButtons();
      updateContextPanel();
      render(); scheduleThumbs();
    }
    off();
    pushHistory({
      bytes: layerBytes(),
      undo: function () {
        var x = L.canvas.getContext('2d');
        x.clearRect(0, 0, doc.width, doc.height);
        x.drawImage(snap, 0, 0);
        L.edited = wasEdited;
        doc.contourOn = true;
        contourStyle = wasStyle;
        orig.opacity = wasOpacity;
        els.origOpacity.value = Math.round(wasOpacity * 100);
        syncOpacityUI(orig);
        updateStyleButtons();
        updateContextPanel();
        render(); scheduleThumbs();
      },
      redo: off
    });
  }

  // Uusi: palaa tyhjään aloitusnäkymään, josta voi avata uuden kuvan.
  function newDocument() {
    if (!confirmDiscard()) return;
    closeMenu();
    if (tool !== 'hand') setTool('hand');
    settle();
    aiReset();
    doc = null; tf = null; crop = null; sel = null; adj = null; shapePreview = null; selOffset = null; contourStyle = null; penSession = null;
    clearHistory();
    els.empty.hidden = false;
    els.toolbar.hidden = true;
    els.btnExport.disabled = true;
    els.btnEdit.disabled = true;
    els.btnAdjust.disabled = true;
    els.fileName.textContent = '';
    els.fileName.classList.remove('is-dirty');
    els.statusSize.textContent = 'Ei kuvaa';
    els.statusEdges.textContent = '';
    setBusy(false);
    buildLayerList();
    updateLayerActions();
    updateContextPanel();
    updateZoomLabel();
    render();
  }

  // Antaa reunantunnistukselle alkuperäisen kuvan (ja kevyen esikatseluversion isoille kuville).
  function prepareEngine() {
    var w = doc.width, h = doc.height, origLayer = getLayer('original').canvas;
    // Läpinäkyvät alueet (esim. kankaan laajennus) tulkitaan valkoisiksi, jottei niihin synny viivoja.
    var orig = makeCanvas(w, h);
    var octx = orig.getContext('2d', { willReadFrequently: true });
    octx.fillStyle = '#fff';
    octx.fillRect(0, 0, w, h);
    octx.drawImage(origLayer, 0, 0);
    var ps = Math.min(1, PREVIEW_SIDE / Math.max(w, h));
    var previewData = null;
    doc.previewScale = 1;
    doc.preview = null;
    if (ps < 0.75) {
      var pw = Math.round(w * ps), ph = Math.round(h * ps);
      var pc = makeCanvas(pw, ph), pctx = pc.getContext('2d', { willReadFrequently: true });
      pctx.imageSmoothingQuality = 'high';
      pctx.drawImage(orig, 0, 0, pw, ph);
      previewData = pctx.getImageData(0, 0, pw, ph);
      doc.previewScale = pw / w;
      doc.preview = { width: pw, height: ph };
    }
    engine.setImage(octx.getImageData(0, 0, w, h), previewData);
  }

  function addLayer(layer, index) {
    if (index == null || index > doc.layers.length) index = doc.layers.length;
    doc.layers.splice(index, 0, layer);
    doc.activeId = layer.id;
    buildLayerList();
    updateContextPanel();
    render();
  }

  function removeLayer(layer) {
    var i = doc.layers.indexOf(layer);
    if (i < 0) return -1;
    doc.layers.splice(i, 1);
    if (doc.activeId === layer.id) {
      var below = doc.layers[Math.min(i, doc.layers.length) - 1];
      doc.activeId = below ? below.id : 'contour';
    }
    if (selection && selection.layer === layer) selection = null;
    buildLayerList();
    updateContextPanel();
    render();
    return i;
  }

  function setActive(id) {
    if (!doc || doc.activeId === id) return;
    settle();
    doc.activeId = id;
    selection = null;
    buildLayerList();
    updateContextPanel();
    render();
  }

  function layerBytes() { return doc.width * doc.height * 4; }

  // Tasojen toiminnot kertovat syyn, jos ne eivät onnistu.
  var lastNotice = { msg: '', time: 0 };
  function notice(msg) {
    var now = Date.now();
    if (msg === lastNotice.msg && now - lastNotice.time < 2500) return;
    lastNotice = { msg: msg, time: now };
    toast(msg);
  }

  function isProtected(L) { return L.id === 'original' || L.id === 'contour'; }

  // Uusi tyhjä rasteritaso aktiivisen tason päälle.
  function newRasterLayer(atTop) {
    if (!doc) return null;
    settle();
    doc.rasterCount++;
    var layer = {
      id: 'r' + Date.now() + doc.rasterCount,
      kind: 'raster',
      name: 'Taso ' + doc.rasterCount,
      canvas: makeCanvas(doc.width, doc.height),
      visible: true,
      opacity: 1,
      locked: false
    };
    var index = atTop === true ? doc.layers.length : doc.layers.indexOf(activeLayer()) + 1;
    addLayer(layer, index);
    pushHistory({
      bytes: layerBytes(),
      undo: function () { removeLayer(layer); },
      redo: function () { addLayer(layer, index); }
    });
    scheduleThumbs();
    return layer;
  }

  function deleteActiveLayer() {
    settle();
    var L = activeLayer();
    if (!L) return;
    if (isProtected(L)) { notice('Alkuperäistä ja ääriviivatasoa ei voi poistaa. Voit piilottaa ne silmäkuvakkeesta.'); return; }
    if (L.locked) { notice('Taso on lukittu. Avaa lukitus ennen poistoa.'); return; }
    var index = removeLayer(L);
    pushHistory({
      bytes: L.kind === 'raster' ? layerBytes() : 0,
      undo: function () { addLayer(L, index); },
      redo: function () { removeLayer(L); }
    });
  }

  // dir: +1 = ylöspäin (kohti taulukon loppua), -1 = alaspäin
  function moveActiveLayer(dir) {
    settle();
    var L = activeLayer();
    if (!L) return;
    var from = doc.layers.indexOf(L), to = from + dir;
    if (to < 0 || to >= doc.layers.length) return;
    placeLayer(L, to);
    pushHistory({
      undo: function () { placeLayer(L, from); },
      redo: function () { placeLayer(L, to); }
    });
  }

  function placeLayer(L, index) {
    var i = doc.layers.indexOf(L);
    if (i < 0) return;
    doc.layers.splice(i, 1);
    doc.layers.splice(index, 0, L);
    buildLayerList();
    updateContextPanel();
    render();
  }

  function toggleLock(L) {
    if (!L) return;
    settle();
    if (L.id === 'original') { notice('Alkuperäinen kuva on aina suojattu. Piirrä uudelle tasolle.'); return; }
    L.locked = !L.locked;
    if (L.locked && selection && selection.layer === L) selection = null;
    buildLayerList();
    updateContextPanel();
    render();
  }

  // Tason läpinäkyvyys: liukusäätimen veto on yksi kumottava askel.
  var opacityBefore = null;
  function opacityInput(L, pct) {
    if (!L) return;
    if (!opacityBefore || opacityBefore.layer !== L) opacityBefore = { layer: L, value: L.opacity };
    L.opacity = pct / 100;
    syncOpacityUI(L);
    render();
  }
  function opacityChange() {
    if (!opacityBefore) return;
    var L = opacityBefore.layer, before = opacityBefore.value, after = L.opacity;
    opacityBefore = null;
    if (before === after) return;
    pushHistory({
      undo: function () { L.opacity = before; syncOpacityUI(L); render(); },
      redo: function () { L.opacity = after; syncOpacityUI(L); render(); }
    });
  }
  function syncOpacityUI(L) {
    if (L.metaEl && L.kind === 'raster') L.metaEl.textContent = Math.round(L.opacity * 100) + '%';
    if (L.id === 'original') els.origOpacity.value = Math.round(L.opacity * 100);
    if (L === activeLayer()) els.layerOpacity.value = Math.round(L.opacity * 100);
    updateOutputs();
  }

  // Vektoritason muutoksen jälkeen: välimuistissa oleva Path2D uusiksi.
  function touchVector(layer) {
    layer.p2d = null;
    render();
    scheduleThumbs();
    if (layer === activeVector()) els.vecCount.textContent = LineoVector.countNodes(layer.paths) + ' pistettä';
  }

  function vectorPath2D(layer) {
    if (!layer.p2d) layer.p2d = LineoVector.buildPath2D(layer.paths);
    return layer.p2d;
  }

  function strokeVector(ctx, paths, p2d, stroke) {
    var path = p2d || LineoVector.buildPath2D(paths), w = stroke.width;
    ctx.strokeStyle = stroke.color;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    if (stroke.pencil) {
      // Lyijykynä: kaksi hieman eri tavoin katkeilevaa, vaaleaa kierrosta päällekkäin.
      ctx.save();
      var a = ctx.globalAlpha;
      ctx.lineWidth = w;
      ctx.globalAlpha = a * 0.6;
      ctx.setLineDash([w * 7, w * 0.5, w * 3, w * 0.8]);
      ctx.stroke(path);
      ctx.lineWidth = w * 0.7;
      ctx.globalAlpha = a * 0.55;
      ctx.setLineDash([w * 4, w * 0.6, w * 9, w * 0.4]);
      ctx.lineDashOffset = w * 2.3;
      ctx.stroke(path);
      ctx.restore();
      return;
    }
    ctx.lineWidth = w;
    ctx.stroke(path);
  }

  // ---------- Kumoa / tee uudelleen ----------

  var history = { undo: [], redo: [] };

  function clearHistory() {
    history.undo = [];
    history.redo = [];
    updateUndoButtons();
  }

  // Siveltimenvedot ja poistetut tasot vievät muistia: vanhimmat unohdetaan, kun raja ylittyy.
  var HISTORY_BYTES = IS_TOUCH ? 150e6 : 450e6;

  function pushHistory(entry) {
    if (!entry.soft) markDirty();
    history.undo.push(entry);
    history.redo = [];
    var total = 0;
    history.undo.forEach(function (e) { total += e.bytes || 0; });
    while (history.undo.length > 1 && (history.undo.length > 200 || total > HISTORY_BYTES)) {
      total -= history.undo.shift().bytes || 0;
    }
    updateUndoButtons();
  }

  function undo() {
    if (adj) { endAdjust(false); return; }
    if (penSession) { penUndoPoint(); return; }
    if (tf) { endTransform(false); return; }
    if (tool === 'crop') leaveModal();
    if (ai.points.length) { aiUndoPoint(); return; }
    var e = history.undo.pop();
    if (!e) return;
    if (!e.soft) markDirty();
    e.undo();
    history.redo.push(e);
    selection = null;
    updateUndoButtons();
    updateContextPanel();
  }

  function redo() {
    if (adj) endAdjust(false);
    if (tf) endTransform(false);
    if (tool === 'crop') leaveModal();
    var e = history.redo.pop();
    if (!e) return;
    if (!e.soft) markDirty();
    e.redo();
    history.undo.push(e);
    selection = null;
    updateUndoButtons();
    updateContextPanel();
  }

  function updateUndoButtons() {
    els.btnUndo.disabled = !history.undo.length && !ai.points.length;
    els.btnRedo.disabled = !history.redo.length;
  }

  function pathsEntry(layer, before) {
    var after = LineoVector.clonePaths(layer.paths);
    return {
      undo: function () { layer.paths = LineoVector.clonePaths(before); touchVector(layer); },
      redo: function () { layer.paths = LineoVector.clonePaths(after); touchVector(layer); }
    };
  }

  // ---------- Näkymä ----------

  // view.scale = näyttölaitteen pikseliä per kuvapikseli, x/y = kuvan vasen yläkulma kankaalla.
  var view = { scale: 1, x: 0, y: 0, fitted: true };
  var MIN_ZOOM = 0.02, MAX_ZOOM = 32;   // CSS-pikseleinä suhteessa kuvapikseliin
  var vctx = els.view.getContext('2d');
  var checker = null;

  function dpr() { return window.devicePixelRatio || 1; }

  function makeChecker() {
    var c = makeCanvas(16, 16), x = c.getContext('2d');
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, 16, 16);
    x.fillStyle = '#e3e3e3'; x.fillRect(0, 0, 8, 8); x.fillRect(8, 8, 8, 8);
    return vctx.createPattern(c, 'repeat');
  }

  function resizeCanvas() {
    var r = els.workspace.getBoundingClientRect();
    var oldW = els.view.width, oldH = els.view.height;
    els.view.width = Math.max(1, Math.round(r.width * dpr()));
    els.view.height = Math.max(1, Math.round(r.height * dpr()));
    if (!doc || view.fitted) { fitView(); return; }
    // Käyttäjän oma zoomaus säilyy, ikkunan keskikohta pysyy paikallaan.
    view.x += (els.view.width - oldW) / 2;
    view.y += (els.view.height - oldH) / 2;
    clampView();
    render();
  }

  function fitView() {
    if (!doc) { updateZoomLabel(); render(); return; }
    var pad = (els.view.width < 600 * dpr() ? 12 : 32) * dpr();
    // Kelluva työkalurivi ei saa peittää kuvan reunaa (kahvat): varataan sille tilaa.
    var narrow = window.innerWidth <= 720, bar = 64 * dpr();
    var padL = narrow ? pad : Math.max(pad, bar), padB = narrow ? Math.max(pad, bar) : pad;
    var cw = els.view.width - padL - pad, ch = els.view.height - pad - padB;
    view.scale = Math.max(0.001, Math.min(cw / doc.width, ch / doc.height));
    view.x = Math.round(padL + (cw - doc.width * view.scale) / 2);
    view.y = Math.round(pad + (ch - doc.height * view.scale) / 2);
    view.fitted = true;
    updateZoomLabel();
    render();
  }

  function updateZoomLabel() {
    els.btnFit.hidden = !doc;
    if (doc) els.btnFit.textContent = 'Zoom ' + Math.round(view.scale / dpr() * 100) + ' %';
  }

  // Kuva ei pääse karkaamaan kokonaan näkyvistä.
  function clampView() {
    var m = 48 * dpr();
    var w = doc.width * view.scale, h = doc.height * view.scale;
    view.x = Math.min(els.view.width - m, Math.max(m - w, view.x));
    view.y = Math.min(els.view.height - m, Math.max(m - h, view.y));
  }

  // Zoomaa kankaan pisteen (px, py) ympäri.
  function zoomAt(px, py, factor) {
    if (!doc) return;
    var ns = Math.min(MAX_ZOOM * dpr(), Math.max(MIN_ZOOM * dpr(), view.scale * factor));
    var f = ns / view.scale;
    view.x = px - (px - view.x) * f;
    view.y = py - (py - view.y) * f;
    view.scale = ns;
    view.fitted = false;
    clampView();
    updateZoomLabel();
    render();
  }

  function panBy(dx, dy) {
    if (!doc) return;
    view.x += dx;
    view.y += dy;
    view.fitted = false;
    clampView();
    render();
  }

  function zoomTo100(px, py) {
    zoomAt(px, py, dpr() / view.scale);
  }

  function toDoc(p) { return { x: (p.x - view.x) / view.scale, y: (p.y - view.y) / view.scale }; }
  function toScreen(x, y) { return { x: x * view.scale + view.x, y: y * view.scale + view.y }; }

  var renderQueued = false;
  function render() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(function () {
      renderQueued = false;
      drawView();
    });
  }

  function drawView() {
    var c = els.view;
    vctx.setTransform(1, 0, 0, 1, 0, 0);
    vctx.clearRect(0, 0, c.width, c.height);
    if (!doc) return;
    if (!checker) checker = makeChecker();

    var w = doc.width * view.scale, h = doc.height * view.scale;
    vctx.fillStyle = 'rgba(0,0,0,.35)';
    vctx.fillRect(view.x - 1, view.y - 1, w + 2, h + 2);
    vctx.fillStyle = checker;
    vctx.fillRect(view.x, view.y, w, h);

    vctx.imageSmoothingEnabled = view.scale < 2;
    vctx.imageSmoothingQuality = 'high';
    for (var i = 0; i < doc.layers.length; i++) {
      var L = doc.layers[i];
      if (!L.visible || L.opacity <= 0) continue;
      vctx.globalAlpha = L.opacity;
      if (L.kind === 'vector') {
        vctx.save();
        vctx.beginPath();
        vctx.rect(view.x, view.y, w, h);
        vctx.clip();
        vctx.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
        strokeVector(vctx, L.paths, vectorPath2D(L), L.stroke);
        vctx.restore();
      } else if (adj && adj.layer === L) {
        vctx.drawImage(adj.preview, view.x, view.y, w, h);
      } else {
        vctx.drawImage(L.canvas, view.x, view.y, w, h);
      }
    }
    vctx.globalAlpha = 1;

    drawAiOverlay();
    drawEditOverlay();
    drawSelectionOverlay();
    drawTransformOverlay();
    drawCropOverlay();
    drawBrushCursor();
  }

  // ---------- Tasopaneeli ----------

  var ICON_EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var ICON_EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18M10.6 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6A17.4 17.4 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
  var ICON_LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  function buildLayerList() {
    els.layerList.innerHTML = '';
    if (!doc) {
      els.layerList.innerHTML = '<li class="layer-empty">Avaa kuva aloittaaksesi.</li>';
      return;
    }
    // Ylin taso ensin, kuten Photoshopissa.
    for (var i = doc.layers.length - 1; i >= 0; i--) {
      (function (L) {
        var li = document.createElement('li');
        li.className = 'layer-item' + (L.id === doc.activeId ? ' is-active' : '') + (L.visible ? '' : ' is-hidden') + (L.locked ? ' is-locked' : '');
        li.addEventListener('click', function () { setActive(L.id); });

        var eye = document.createElement('button');
        eye.className = 'lineo-icon-btn';
        eye.title = L.visible ? 'Piilota taso' : 'Näytä taso';
        eye.innerHTML = L.visible ? ICON_EYE : ICON_EYE_OFF;
        eye.addEventListener('click', function (e) {
          e.stopPropagation();
          L.visible = !L.visible;
          buildLayerList();
          render();
        });

        var thumb = makeCanvas(80, 60);
        thumb.className = 'layer-thumb';
        L.thumb = thumb;
        drawThumb(L);

        var name = document.createElement('span');
        name.className = 'layer-name';
        name.textContent = L.name;

        var meta = document.createElement('span');
        meta.className = 'layer-meta';
        meta.textContent = L.kind === 'vector' ? 'vektori' : Math.round(L.opacity * 100) + '%';
        L.metaEl = meta;

        li.append(eye, thumb, name, meta);

        if (L.locked) {
          var lock = document.createElement('button');
          lock.className = 'lineo-icon-btn layer-lock';
          lock.title = L.id === 'original' ? 'Alkuperäinen on suojattu' : 'Taso on lukittu – avaa napauttamalla';
          lock.innerHTML = ICON_LOCK;
          lock.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleLock(L);
          });
          li.appendChild(lock);
        }
        els.layerList.appendChild(li);
      })(doc.layers[i]);
    }
  }

  function drawThumb(L) {
    if (!L.thumb) return;
    var t = L.thumb, x = t.getContext('2d');
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.clearRect(0, 0, t.width, t.height);
    var s = Math.min(t.width / doc.width, t.height / doc.height);
    var w = doc.width * s, h = doc.height * s;
    if (L.kind === 'vector') {
      x.setTransform(s, 0, 0, s, (t.width - w) / 2, (t.height - h) / 2);
      strokeVector(x, L.paths, vectorPath2D(L), { width: Math.max(L.stroke.width, 1.5 / s), color: L.stroke.color });
    } else {
      x.imageSmoothingQuality = 'high';
      x.drawImage(L.canvas, (t.width - w) / 2, (t.height - h) / 2, w, h);
    }
  }

  var thumbTimer = 0;
  function scheduleThumbs() {
    clearTimeout(thumbTimer);
    thumbTimer = setTimeout(function () { if (doc) doc.layers.forEach(drawThumb); }, 150);
  }

  // ---------- Sivupaneelin tilannekohtaiset osiot ----------

  function updateContextPanel() {
    var vec = activeVector();
    els.aiSection.hidden = !(doc && tool === 'ai');
    els.paintSection.hidden = !(doc && (isPaintTool(tool) || isFillTool(tool)));
    els.fillSection.hidden = !(doc && isFillTool(tool));
    els.gradientFields.hidden = tool !== 'gradient';
    els.bucketFields.hidden = tool !== 'bucket';
    els.selectSection.hidden = !(doc && (isSelectTool(tool) || tool === 'move'));
    els.wandFields.hidden = tool !== 'wand';
    els.transformSection.hidden = !(doc && tool === 'transform' && tf);
    els.cropSection.hidden = !(doc && tool === 'crop' && crop);
    // Automaattisten ääriviivojen säätimet ja alkuperäisen läpinäkyvyys näkyvät vasta, kun ääriviivat on luotu.
    var cOn = !!(doc && doc.contourOn);
    // Automaattisten ääriviivojen osio näkyy vasta, kun valitaan ääriviivatyökalu (kynä P, tekoäly W) tai ääriviivataso.
    var showContour = !!(doc && (tool === 'ai' || tool === 'edit' || (cOn && doc.activeId === 'contour')));
    // Automaattiset ääriviivat poistettiin käyttöliittymästä (kynä ja tekoäly riittävät); osiot pysyvät piilossa.
    $('contour-section').hidden = true;
    $('start-hint').hidden = !(doc && tool === 'hand' && !cOn && !doc.layers.some(function (l) { return l.kind === 'vector'; }));
    $('contour-start').hidden = !(doc && !cOn);
    els.contourControls.hidden = !cOn;
    $('contour-remove').hidden = !cOn;
    $('orig-section').hidden = true;
    els.adjustSection.hidden = !(doc && adj);
    els.pickerSection.hidden = !(doc && tool === 'picker');
    updateStyleButtons();
    els.selInfo.textContent = sel ? sel.w + ' × ' + sel.h + ' px' : 'ei valintaa';
    updateCropInfo();
    els.vectorSection.hidden = !(doc && (vec || tool === 'ai'));
    els.nodeTools.hidden = !vec;
    els.vecHint.hidden = !vec;
    els.vecDetail.parentElement.hidden = !(vec && vec.loops);
    if (vec) {
      els.vecWidth.value = vec.stroke.width;
      els.vecColor.value = vec.stroke.color;
      els.vecDetail.value = vec.detail;
      els.vecCount.textContent = LineoVector.countNodes(vec.paths) + ' pistettä';
    } else {
      els.vecCount.textContent = '';
    }
    // Lukittua vektoritasoa ei muokata (tekoälytyökalussa säätimet kuuluvat uudelle rajaukselle).
    var vecLocked = !!(vec && vec.locked && tool !== 'ai');
    [els.vecWidth, els.vecColor, els.vecDetail].forEach(function (el) { el.disabled = vecLocked; });
    var hasNode = !!(selection && selection.layer === vec) && !vecLocked;
    els.nodeDelete.disabled = !hasNode;
    els.nodeToggle.disabled = !hasNode;
    updateLayerActions();
    updateContourPanel();
    els.aiDone.disabled = !(ai.paths && ai.paths.length);
    els.aiCancel.disabled = !ai.points.length;
    els.aiToleranceField.hidden = els.aiMethod.value !== 'color';
    updateOutputs();
    updateUndoButtons();
  }

  function updateLayerActions() {
    var L = activeLayer();
    var i = L ? doc.layers.indexOf(L) : -1;
    els.layerAdd.disabled = !doc;
    els.layerUp.disabled = !L || i >= doc.layers.length - 1;
    els.layerDown.disabled = !L || i <= 0;
    els.layerLock.disabled = !L;
    els.layerLock.setAttribute('aria-pressed', String(!!(L && L.locked)));
    els.layerLock.title = L && L.locked ? 'Avaa tason lukitus' : 'Lukitse taso (ei voi piirtää, muokata eikä poistaa)';
    els.layerDelete.disabled = !L || isProtected(L);
    els.layerOpacity.disabled = !L;
    if (L) els.layerOpacity.value = Math.round(L.opacity * 100);
    $('layer-opacity-out').textContent = els.layerOpacity.value + ' %';
    updateRangeFill(els.layerOpacity);
  }

  // Käsin muokattu ääriviivataso: automaattiset säätimet lukitaan, jottei muokkaus katoa.
  function updateContourPanel() {
    var edited = !!(doc && getLayer('contour').edited);
    els.contourControls.classList.toggle('is-disabled', edited);
    els.contourEdited.hidden = !edited;
  }

  function recomputeContours() {
    var L = doc && getLayer('contour');
    if (!L || !L.edited) return;
    contoursOn();
    var snap = makeCanvas(doc.width, doc.height);
    snap.getContext('2d').drawImage(L.canvas, 0, 0);
    L.edited = false;
    pushHistory({
      bytes: layerBytes(),
      undo: function () {
        var x = L.canvas.getContext('2d');
        x.clearRect(0, 0, doc.width, doc.height);
        x.drawImage(snap, 0, 0);
        L.edited = true;
        render(); scheduleThumbs();
      },
      redo: function () { L.edited = false; requestContours(false); }
    });
    updateContextPanel();
    requestContours(false);
  }

  // ---------- Työkalut ----------

  var tool = 'hand';
  var spaceDown = false;

  function setTool(name) {
    if (name === tool) return;
    if (penSession && name !== 'edit' && name !== 'hand') finishPen();   // käsi vain katselua varten: viiva jää kesken ja jatkuu paluussa
    if (tool === 'ai' && ai.points.length) aiCommit();
    if (tool === 'transform') endTransform(true);
    if (tool === 'crop') crop = null;
    shapePreview = null;
    if (name === 'transform' && !startTransform()) return;
    if (name === 'transform' || name === 'crop') returnTool = tool === 'transform' || tool === 'crop' ? 'hand' : tool;
    tool = name;
    if (tool === 'crop' && doc) startCrop(true);
    if (tool === 'crop' || tool === 'transform') revealPanel();
    if (tool !== 'edit') selection = null;
    Array.prototype.forEach.call(els.toolbar.querySelectorAll('[data-tool]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-tool') === tool));
    });
    Array.prototype.slice.call(els.view.classList).forEach(function (c) {
      if (c.indexOf('tool-') === 0) els.view.classList.remove(c);
    });
    els.view.classList.add('tool-' + tool);
    if (isPaintTool(tool)) loadPaintUI();
    if (tool === 'ai') aiPrepare();
    if (tool === 'edit' && !activeVector()) {
      // Valitaan ylin vektoritaso muokattavaksi.
      for (var i = doc ? doc.layers.length - 1 : -1; i >= 0; i--) {
        if (doc.layers[i].kind === 'vector') { setActive(doc.layers[i].id); break; }
      }
    }
    updateContextPanel();
    render();
  }

  // ---------- Piirtotyökalut: sivellin, tussi, pyyhekumi ----------

  var PAINT_TOOLS = { brush: 'Sivellin', pen: 'Tussi', eraser: 'Pyyhekumi' };
  function isPaintTool(t) { return !!PAINT_TOOLS[t]; }

  // Jokaisella työkalulla omat asetukset (koko kuvapikseleinä). Väri on yhteinen.
  var paint = {
    brush: { size: 24, hardness: 50, stab: 0 },
    pen: { size: 4, hardness: 100, stab: 30 },
    eraser: { size: 24, hardness: 80, stab: 0 }
  };
  var SIZE_MAX = 500;
  // Koko-liukusäädin on logaritminen, jotta pienet koot ovat helppo säätää myös puhelimella.
  function sizeFromSlider(v) { return Math.max(1, Math.min(SIZE_MAX, Math.round(Math.pow(SIZE_MAX, v / 100)))); }
  function sliderFromSize(sz) { return Math.log(Math.max(1, sz)) / Math.log(SIZE_MAX) * 100; }

  // Oletuskoot kuvan koon mukaan, jotta viiva näkyy myös koko kuvan näkymässä.
  function resetPaintDefaults() {
    var pen = Math.max(2, Math.round(defaultLineWidth() * 1.5));
    paint.pen.size = Math.min(SIZE_MAX, pen);
    paint.brush.size = Math.min(SIZE_MAX, pen * 4);
    paint.eraser.size = Math.min(SIZE_MAX, pen * 4);
    if (isPaintTool(tool) || isFillTool(tool)) loadPaintUI();
  }

  function loadPaintUI() {
    var fill = isFillTool(tool);
    els.brushSizeField.hidden = fill;
    els.brushStabField.hidden = fill;
    els.paintHint.hidden = fill;
    els.brushColorField.hidden = tool === 'eraser';
    if (fill) {
      els.paintTitle.textContent = 'Väri';
      els.brushHardnessField.hidden = true;
    } else {
      var st = paint[tool];
      els.paintTitle.textContent = PAINT_TOOLS[tool];
      els.brushSize.value = sliderFromSize(st.size);
      els.brushHardness.value = st.hardness;
      els.brushStab.value = st.stab;
      els.brushHardnessField.hidden = tool === 'pen';
    }
    els.fillTitle.textContent = tool === 'gradient' ? 'Liukuväri' : 'Täyttö';
    els.gradColor2Field.hidden = els.gradMode.value === 'transparent';
    updateOutputs();
  }

  function stepBrushSize(dir) {
    if (!isPaintTool(tool)) return;
    var st = paint[tool];
    var next = dir > 0 ? Math.max(st.size + 1, Math.round(st.size * 1.15)) : Math.min(st.size - 1, Math.round(st.size / 1.15));
    st.size = Math.max(1, Math.min(SIZE_MAX, next));
    loadPaintUI();
    render();
  }

  // Piirtokohde: aktiivinen taso, jos sille saa piirtää. Muuten kerrotaan miksi ei.
  // strict = ei luoda uutta tasoa (esim. sisällön poisto), vaan ilmoitetaan miksi ei voi.
  function paintTarget(strict) {
    var L = activeLayer();
    if (!L) return null;
    // Alkuperäiseen ja vektoritasolle ei voi maalata: piirto menee automaattisesti uudelle tasolle päällimmäiseksi.
    var emptyContour = L.id === 'contour' && !doc.contourOn && !L.edited;   // ääriviivoja ei ole vielä luotu
    if (L.id === 'original' || L.kind !== 'raster' || emptyContour) {
      if (strict) {
        notice(L.id === 'original' ? 'Alkuperäinen kuva on suojattu. Kopioi valinta uudelle tasolle (Ctrl+J) ja muokkaa sitä.'
          : emptyContour ? 'Ääriviivoja ei ole vielä luotu.' : 'Tämä on vektoritaso. Valitse rasteritaso.');
        return null;
      }
      var fresh = newRasterLayer(true);
      notice('Piirrät uudelle tasolle (' + fresh.name + '), koska ' + (L.id === 'original' ? 'alkuperäinen kuva on suojattu'
        : emptyContour ? 'ääriviivoja ei ole vielä luotu' : 'vektoritasolle ei voi maalata') + '.');
      return fresh;
    }
    if (L.locked) { notice('Taso on lukittu. Avaa lukitus Tasot-osiosta.'); return null; }
    if (!L.visible) { notice('Taso on piilotettu. Näytä se silmäkuvakkeesta ennen piirtämistä.'); return null; }
    if (L.id === 'contour' && !L.edited) {
      if (!els.busy.hidden) { notice('Ääriviivoja lasketaan vielä – odota hetki.'); return null; }
      if (doc.contourIsPreview) { requestContours(false); notice('Ääriviivoja lasketaan vielä – odota hetki.'); return null; }
    }
    return L;
  }

  function strokePressure(e) {
    return e.pointerType === 'pen' ? (e.pressure > 0 ? e.pressure : 0.5) : 1;
  }

  function startStroke(e, p, base) {
    var L = paintTarget();
    if (!L) return Object.assign(base, { type: 'pan' });
    var st = paint[tool];
    var backup = makeCanvas(L.canvas.width, L.canvas.height);
    backup.getContext('2d').drawImage(L.canvas, 0, 0);
    var ctx = L.canvas.getContext('2d');
    var g = Object.assign(base, {
      type: 'paint', layer: L, backup: backup, prevEdited: !!L.edited, moved: true,
      pressure: strokePressure(e)
    });
    claimContour(L);
    g.sel = sel;
    g.stroke = LineoBrush.createStroke(ctx, {
      size: st.size,
      hardness: tool === 'pen' ? 100 : st.hardness,
      color: els.brushColor.value,
      erase: tool === 'eraser',
      rope: st.stab / 100 * 70 * dpr() / view.scale,
      pressure: e.pointerType === 'pen'
    });
    var d = toDoc(p);
    g.stroke.begin(d.x, d.y, g.pressure);
    render();
    return g;
  }

  // Käsin muokattua ääriviivatasoa ei enää lasketa automaattisesti uusiksi.
  function claimContour(L) {
    if (L.id !== 'contour' || L.edited) return;
    L.edited = true;
    updateContextPanel();
    toast('Ääriviivatasoa muokataan käsin, joten automaattiset säätimet lukittiin. "Laske ääriviivat uudelleen" tai kumoa palauttaa ne.');
  }

  function clampBox(x, y, w, h) {
    var x0 = Math.max(0, Math.floor(x)), y0 = Math.max(0, Math.floor(y));
    var x1 = Math.min(doc.width, Math.ceil(x + w)), y1 = Math.min(doc.height, Math.ceil(y + h));
    return x1 > x0 && y1 > y0 ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
  }

  // Muuttuneen alueen kumoamisaskel (ennen/jälkeen-kuvat) rasteritasolle.
  function patchEntry(L, box, before, after, wasEdited, extra) {
    var isContour = L.id === 'contour';
    return {
      bytes: box.w * box.h * 8,
      undo: function () { putPatch(L, before, box); if (isContour) L.edited = wasEdited; if (extra) extra.undo(); render(); scheduleThumbs(); },
      redo: function () { putPatch(L, after, box); if (isContour) L.edited = true; if (extra) extra.redo(); render(); scheduleThumbs(); }
    };
  }

  // Muuttaa tason pikseleitä alueella box: fn(ctx) piirtää, muutos tallentuu yhtenä kumottavana askeleena.
  function editPixels(L, box, fn, extra) {
    var ctx = L.canvas.getContext('2d');
    var wasEdited = !!L.edited;
    var before = ctx.getImageData(box.x, box.y, box.w, box.h);
    claimContour(L);
    fn(ctx);
    var after = ctx.getImageData(box.x, box.y, box.w, box.h);
    pushHistory(patchEntry(L, box, before, after, wasEdited, extra));
    render();
    scheduleThumbs();
    updateContextPanel();
  }

  // Piirtää sisällön (drawContent piirtää box-koordinaatistoon) tasolle maskin läpi. region = valinnan
  // kaltainen peitto (tai null = koko kuva).
  function paintThroughMask(L, region, drawContent) {
    var box = region ? clampBox(region.x, region.y, region.w, region.h) : { x: 0, y: 0, w: doc.width, h: doc.height };
    if (!box) return;
    editPixels(L, box, function (ctx) {
      var tmp = makeCanvas(box.w, box.h), t = tmp.getContext('2d');
      drawContent(t, box);
      if (region) {
        t.globalCompositeOperation = 'destination-in';
        t.drawImage(selMaskCanvas(region), region.x - box.x, region.y - box.y);
      }
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.drawImage(tmp, box.x, box.y);
      ctx.restore();
    });
  }

  // Valinta rajaa siveltimen jäljen: valinnan ulkopuolella taso palautetaan vetoa edeltäneeseen tilaan.
  function constrainStroke(g, box) {
    if (!g.sel || !box) return;
    var s = g.sel, ctx = g.layer.canvas.getContext('2d');
    var cur = makeCanvas(box.w, box.h), cx = cur.getContext('2d');
    cx.drawImage(g.layer.canvas, -box.x, -box.y);
    cx.globalCompositeOperation = 'destination-in';
    cx.drawImage(selMaskCanvas(s), s.x - box.x, s.y - box.y);
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.w, box.h);
    ctx.clip();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.clearRect(box.x, box.y, box.w, box.h);
    ctx.drawImage(g.backup, 0, 0);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(selMaskCanvas(s), s.x, s.y);
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(cur, box.x, box.y);
    ctx.restore();
  }

  function paintMove(g, e, p) {
    var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
    if (!evs || !evs.length) evs = [e];
    for (var i = 0; i < evs.length; i++) {
      var d = toDoc(canvasPoint(evs[i]));
      g.pressure = strokePressure(evs[i]);
      g.stroke.move(d.x, d.y, g.pressure);
    }
    constrainStroke(g, g.stroke.takeDirty());
    render();
    scheduleThumbs();
  }

  function putPatch(L, data, box) {
    L.canvas.getContext('2d').putImageData(data, box.x, box.y);
  }

  // Valmis veto yhdeksi kumottavaksi askeleeksi: vain muuttunut alue tallennetaan.
  function commitStroke(g, p) {
    if (!g || !g.stroke) return;
    var d = p ? toDoc(p) : null;
    var box = g.stroke.end(d ? d.x : null, d ? d.y : null, g.pressure);
    constrainStroke(g, g.stroke.takeDirty());
    g.stroke = null;
    var L = g.layer, wasEdited = g.prevEdited;
    if (box) {
      var before = g.backup.getContext('2d').getImageData(box.x, box.y, box.w, box.h);
      var after = L.canvas.getContext('2d').getImageData(box.x, box.y, box.w, box.h);
      pushHistory(patchEntry(L, box, before, after, wasEdited));
    }
    g.backup = null;
    render();
    scheduleThumbs();
    updateContextPanel();
  }

  // Keskeytys (esim. toinen sormi koskettaa): veto perutaan jälkiä jättämättä.
  function cancelStroke(g) {
    if (!g || !g.stroke) return;
    g.stroke.abort();
    g.stroke = null;
    var x = g.layer.canvas.getContext('2d');
    x.clearRect(0, 0, g.layer.canvas.width, g.layer.canvas.height);
    x.drawImage(g.backup, 0, 0);
    g.backup = null;
    if (g.layer.id === 'contour') g.layer.edited = g.prevEdited;
    updateContextPanel();
    render();
  }

  var hover = null;   // hiiren/kynän paikka kankaalla siveltimen ympyrää varten

  function drawBrushCursor() {
    if (!doc || !isPaintTool(tool) || !hover || spaceDown) return;
    var r = Math.max(1.5 * dpr(), paint[tool].size / 2 * view.scale);
    vctx.save();
    vctx.setTransform(1, 0, 0, 1, 0, 0);
    vctx.beginPath();
    vctx.arc(hover.x, hover.y, r, 0, Math.PI * 2);
    vctx.lineWidth = 3 * dpr();
    vctx.strokeStyle = 'rgba(0,0,0,.55)';
    vctx.stroke();
    vctx.lineWidth = 1 * dpr();
    vctx.strokeStyle = '#fff';
    vctx.stroke();
    vctx.restore();
  }

  // ---------- Valinnat ----------
  //
  // Valinta (LineoSelect): rajattu alfamaski, tai null. Piirto, täyttö, liukuväri, siirto ja poisto
  // rajautuvat valintaan. Valinnan muutokset ovat kumottavia.

  var sel = null;
  var selModeUI = 'new';
  var shapePreview = null;   // kesken oleva rajaus tai liukuväri
  var selOffset = null;      // valinnan ääriviivan siirto kesken
  var returnTool = 'hand';   // työkalu, johon palataan muunnoksen / rajauksen jälkeen

  function isSelectTool(t) { return t === 'rect' || t === 'lasso' || t === 'wand'; }
  function isFillTool(t) { return t === 'bucket' || t === 'gradient'; }

  function selMaskCanvas(s) {
    if (s._canvas) return s._canvas;
    var c = makeCanvas(s.w, s.h), x = c.getContext('2d'), img = x.createImageData(s.w, s.h), d = img.data;
    for (var i = 0, j = 3; i < s.a.length; i++, j += 4) d[j] = s.a[i];
    x.putImageData(img, 0, 0);
    s._canvas = c;
    return c;
  }

  function selPath(s) {
    if (s._path) return s._path;
    var segs = LineoSelect.outlineSegments(s), p = new Path2D();
    for (var i = 0; i < segs.length; i += 4) {
      p.moveTo(segs[i], segs[i + 1]);
      p.lineTo(segs[i + 2], segs[i + 3]);
    }
    s._path = p;
    return p;
  }

  function applySel(s) {
    var old = sel;
    sel = s;
    if (old && old !== s) { old._canvas = null; old._path = null; }
    selOffset = null;
    updateContextPanel();
    render();
  }

  function setSelection(next) {
    if (!doc) return;
    next = next ? LineoSelect.clip(next, doc.width, doc.height) : null;
    var prev = sel;
    if (prev === next) return;
    applySel(next);
    pushHistory({
      soft: true,
      bytes: next ? next.a.length : 0,
      undo: function () { applySel(prev); },
      redo: function () { applySel(next); }
    });
  }

  // Shift = lisää, Alt = vähennä, Shift+Alt = leikkaus. Muuten paneelin valinta.
  function modeFor(g) {
    if (g.shift && g.alt) return 'int';
    if (g.shift) return 'add';
    if (g.alt) return 'sub';
    return selModeUI;
  }

  function setSelModeUI(mode) {
    selModeUI = mode;
    [['new', els.selNew], ['add', els.selAdd], ['sub', els.selSub]].forEach(function (m) {
      m[1].classList.toggle('is-on', m[0] === mode);
      m[1].setAttribute('aria-pressed', String(m[0] === mode));
    });
  }

  function drawLayerTo(ctx, L) {
    if (L.kind === 'vector') strokeVector(ctx, L.paths, vectorPath2D(L), L.stroke);
    else ctx.drawImage(L.canvas, 0, 0);
  }

  // Pikselit, joista taikasauva ja täyttö hakevat alueen.
  function sampleSource(kind) {
    var W = doc.width, H = doc.height, c, x;
    if (kind === 'original') {
      x = getLayer('original').canvas.getContext('2d', { willReadFrequently: true });
      return { data: x.getImageData(0, 0, W, H).data, w: W, h: H };
    }
    c = makeCanvas(W, H);
    x = c.getContext('2d');
    if (kind === 'active') {
      var A = activeLayer();
      if (!A) return null;
      drawLayerTo(x, A);
    } else {
      doc.layers.forEach(function (L) {
        if (L.id === 'original' || !L.visible || L.opacity <= 0) return;
        x.globalAlpha = L.opacity;
        drawLayerTo(x, L);
      });
    }
    return { data: x.getImageData(0, 0, W, H).data, w: W, h: H };
  }

  function inDoc(d) { return d.x >= 0 && d.y >= 0 && d.x < doc.width && d.y < doc.height; }

  function doWand(p, mode) {
    var d = toDoc(p);
    if (!inDoc(d)) return;
    var src = sampleSource(els.wandSource.value);
    if (!src) return;
    var region = LineoSelect.similarRegion(src.data, src.w, src.h, d.x, d.y, +els.wandTol.value, els.wandContig.value === '1');
    var next = LineoSelect.fromMask(region, src.w, src.h);
    if (!next && mode === 'new') { setSelection(null); return; }
    setSelection(LineoSelect.combine(sel, next, mode));
  }

  function rasterizeLasso(pts) {
    var minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
    pts.forEach(function (q) {
      minx = Math.min(minx, q.x); maxx = Math.max(maxx, q.x);
      miny = Math.min(miny, q.y); maxy = Math.max(maxy, q.y);
    });
    var box = clampBox(minx, miny, maxx - minx, maxy - miny);
    if (!box) return null;
    var c = makeCanvas(box.w, box.h), x = c.getContext('2d', { willReadFrequently: true });
    x.translate(-box.x, -box.y);
    x.beginPath();
    pts.forEach(function (q, i) { if (i) x.lineTo(q.x, q.y); else x.moveTo(q.x, q.y); });
    x.closePath();
    x.fillStyle = '#000';
    x.fill();
    var data = x.getImageData(0, 0, box.w, box.h).data, a = new Uint8Array(box.w * box.h);
    for (var i = 0; i < a.length; i++) a[i] = data[i * 4 + 3];
    return LineoSelect.fromAlpha(a, box.x, box.y, box.w, box.h);
  }

  // Suorakulmio, lasso ja valinnan ääriviivan siirto (raahaus valinnan sisältä).
  function startSelectShape(e, p, base) {
    var d0 = toDoc(p), mode = modeFor(base);
    var g = Object.assign(base, { type: 'select' });
    g.cancel = function () { shapePreview = null; selOffset = null; render(); };

    if (mode === 'new' && sel && LineoSelect.contains(sel, d0.x, d0.y)) {
      var orig = sel, fx = 0, fy = 0;
      g.onMove = function (pt, ev, dx, dy) {
        fx += dx; fy += dy;
        selOffset = { dx: Math.round(fx), dy: Math.round(fy) };
        render();
      };
      g.commit = function (pt, moved) {
        var o = selOffset;
        selOffset = null;
        if (moved && o && (o.dx || o.dy)) setSelection(LineoSelect.shift(orig, o.dx, o.dy));
        else render();
      };
      return g;
    }

    function finishTap() {
      shapePreview = null;
      if (mode === 'new' && sel) setSelection(null); else render();
    }

    if (tool === 'rect') {
      g.onMove = function (pt) {
        var d = toDoc(pt);
        shapePreview = { type: 'rect', x0: d0.x, y0: d0.y, x1: d.x, y1: d.y };
        render();
      };
      g.commit = function (pt, moved) {
        var sp = shapePreview;
        shapePreview = null;
        if (!moved || !sp) { finishTap(); return; }
        var r = LineoSelect.rect(Math.min(sp.x0, sp.x1), Math.min(sp.y0, sp.y1), Math.abs(sp.x1 - sp.x0), Math.abs(sp.y1 - sp.y0), doc.width, doc.height);
        setSelection(LineoSelect.combine(sel, r, mode));
      };
    } else {
      var pts = [d0];
      g.onMove = function (pt) {
        var d = toDoc(pt), last = pts[pts.length - 1];
        if (Math.hypot(d.x - last.x, d.y - last.y) * view.scale >= 2 * dpr()) pts.push(d);
        shapePreview = { type: 'lasso', pts: pts };
        render();
      };
      g.commit = function (pt, moved) {
        shapePreview = null;
        if (!moved || pts.length < 3) { finishTap(); return; }
        setSelection(LineoSelect.combine(sel, rasterizeLasso(pts), mode));
      };
    }
    return g;
  }

  function selectAll() { if (doc) setSelection(LineoSelect.rect(0, 0, doc.width, doc.height, doc.width, doc.height)); }
  function selectNone() { if (doc) setSelection(null); }
  function selectInvert() { if (doc) setSelection(LineoSelect.invert(sel, doc.width, doc.height)); }
  function selectGrow(dir) {
    if (!sel) { notice('Ei valintaa.'); return; }
    setSelection(LineoSelect.grow(sel, dir * +els.selGrowAmount.value, doc.width, doc.height));
  }

  function needSelection() {
    if (sel) return true;
    notice('Ei valintaa. Tee ensin valinta.');
    return false;
  }

  // Kopioi (tai leikkaa) valitut pikselit uudelle tasolle aktiivisen tason päälle.
  function selectionToLayer(cut) {
    if (!doc || !needSelection()) return;
    var src = activeLayer();
    // Vektorikohteesta tehty valinta kopioi kohteen pikselit alkuperäisestä kuvasta.
    if (src && src.kind === 'vector') { src = getLayer('original'); notice('Kopioidaan kohde alkuperäisestä kuvasta.'); }
    if (!src || src.kind !== 'raster') { notice('Valitse rasteritaso, josta pikselit kopioidaan.'); return; }
    if (!src.visible) { notice('Taso on piilotettu.'); return; }
    var s = sel;
    var nc = makeCanvas(doc.width, doc.height), x = nc.getContext('2d');
    x.drawImage(src.canvas, 0, 0);
    x.globalCompositeOperation = 'destination-in';
    x.drawImage(selMaskCanvas(s), s.x, s.y);
    if (cut && !paintTarget(true)) return;
    doc.rasterCount++;
    var layer = { id: 'r' + Date.now() + doc.rasterCount, kind: 'raster', name: 'Taso ' + doc.rasterCount, canvas: nc, visible: true, opacity: 1, locked: false };
    var index = doc.layers.indexOf(activeLayer()) + 1;
    if (cut) deleteSelection();
    addLayer(layer, index);
    pushHistory({ bytes: layerBytes(), undo: function () { removeLayer(layer); }, redo: function () { addLayer(layer, index); } });
    scheduleThumbs();
    notice('Valinta ' + (cut ? 'leikattiin' : 'kopioitiin') + ' uudelle tasolle (' + layer.name + ').');
  }

  function deleteSelection() {
    if (!doc || !needSelection()) return;
    var L = paintTarget(true);
    if (!L) return;
    var s = sel, box = clampBox(s.x, s.y, s.w, s.h);
    if (!box) return;
    editPixels(L, box, function (ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
      ctx.drawImage(selMaskCanvas(s), s.x, s.y);
      ctx.restore();
    });
  }

  // ---------- Täyttö ja liukuväri ----------

  function fillSelection() {
    if (!doc) return;
    var L = paintTarget(false);
    if (!L) return;
    var color = els.brushColor.value;
    paintThroughMask(L, sel, function (t, box) {
      t.fillStyle = color;
      t.fillRect(0, 0, box.w, box.h);
    });
  }

  function doBucket(p) {
    var d = toDoc(p);
    if (!inDoc(d)) return;
    var src = sampleSource(els.fillSource.value);
    if (!src) return;
    var L = paintTarget(false);
    if (!L) return;
    var mask = LineoSelect.similarRegion(src.data, src.w, src.h, d.x, d.y, +els.fillTol.value, true);
    var region = LineoSelect.fromMask(mask, src.w, src.h);
    if (!region) return;
    if (+els.fillGrow.value) region = LineoSelect.grow(region, +els.fillGrow.value, doc.width, doc.height);
    if (sel) region = LineoSelect.combine(sel, region, 'int');
    if (!region) { notice('Napautettu alue on valinnan ulkopuolella.'); return; }
    var color = els.brushColor.value;
    paintThroughMask(L, region, function (t, box) {
      t.fillStyle = color;
      t.fillRect(0, 0, box.w, box.h);
    });
  }

  function hexAlpha(hex, a) {
    var c = hexToRgb(hex);
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
  }

  function startGradient(e, p, base) {
    var a = toDoc(p), b = a;
    var g = Object.assign(base, { type: 'gradient' });
    g.cancel = function () { shapePreview = null; render(); };
    g.onMove = function (pt) {
      b = toDoc(pt);
      shapePreview = { type: 'grad', a: a, b: b };
      render();
    };
    g.commit = function (pt, moved) {
      shapePreview = null;
      render();
      if (!moved || Math.hypot(b.x - a.x, b.y - a.y) < 2) return;
      var L = paintTarget(false);
      if (!L) return;
      var c1 = els.brushColor.value, c2 = els.gradColor2.value;
      var toClear = els.gradMode.value === 'transparent', radial = els.gradType.value === 'radial';
      paintThroughMask(L, sel, function (t, box) {
        var ax = a.x - box.x, ay = a.y - box.y, bx = b.x - box.x, by = b.y - box.y;
        var gr = radial ? t.createRadialGradient(ax, ay, 0, ax, ay, Math.hypot(bx - ax, by - ay))
          : t.createLinearGradient(ax, ay, bx, by);
        gr.addColorStop(0, c1);
        gr.addColorStop(1, toClear ? hexAlpha(c1, 0) : c2);
        t.fillStyle = gr;
        t.fillRect(0, 0, box.w, box.h);
      });
    };
    return g;
  }

  // ---------- Kelluva sisältö: siirto ja muunnos ----------

  function copyCanvas(c) {
    var n = makeCanvas(c.width, c.height);
    n.getContext('2d').drawImage(c, 0, 0);
    return n;
  }

  // Tason näkyvän sisällön suorakulmio (ei-läpinäkyvät pikselit), tai null jos taso on tyhjä.
  function contentBox(L) {
    var W = L.canvas.width, H = L.canvas.height;
    var d = L.canvas.getContext('2d').getImageData(0, 0, W, H).data;
    var x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (var y = 0; y < H; y++) {
      var row = y * W * 4 + 3;
      for (var x = 0; x < W; x++) {
        if (d[row + x * 4]) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          y1 = y;
        }
      }
    }
    return x1 < 0 ? null : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  }

  // Irrottaa valitut pikselit (tai koko tason sisällön) kelluvaksi. copy = alkuperäinen jää paikalleen.
  function beginFloat(L, copy) {
    var box = sel ? clampBox(sel.x, sel.y, sel.w, sel.h) : contentBox(L);
    if (!box) return null;
    var fl = makeCanvas(box.w, box.h), fx = fl.getContext('2d');
    fx.drawImage(L.canvas, -box.x, -box.y);
    if (sel) {
      fx.globalCompositeOperation = 'destination-in';
      fx.drawImage(selMaskCanvas(sel), sel.x - box.x, sel.y - box.y);
    }
    var backup = copyCanvas(L.canvas), base = backup;
    if (!copy) {
      base = copyCanvas(L.canvas);
      var bx = base.getContext('2d');
      if (sel) {
        bx.globalCompositeOperation = 'destination-out';
        bx.drawImage(selMaskCanvas(sel), sel.x, sel.y);
      } else {
        bx.clearRect(0, 0, doc.width, doc.height);
      }
    }
    return { layer: L, box: box, float: fl, backup: backup, base: base, wasEdited: !!L.edited, selBefore: sel, place: function () {} };
  }

  function renderFloat(fs) {
    var ctx = fs.layer.canvas.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, doc.width, doc.height);
    ctx.drawImage(fs.base, 0, 0);
    fs.place(ctx);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(fs.float, fs.box.x, fs.box.y);
    ctx.restore();
    render();
    scheduleThumbs();
  }

  function cancelFloat(fs) {
    var ctx = fs.layer.canvas.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, doc.width, doc.height);
    ctx.drawImage(fs.backup, 0, 0);
    ctx.restore();
    if (fs.layer.id === 'contour') fs.layer.edited = fs.wasEdited;
    updateContextPanel();
    render();
    scheduleThumbs();
  }

  // corners = muunnetut kulmapisteet (muuttuneen alueen laskemiseen)
  function commitFloat(fs, corners, selAfter) {
    var minx = fs.box.x, miny = fs.box.y, maxx = fs.box.x + fs.box.w, maxy = fs.box.y + fs.box.h;
    corners.forEach(function (c) {
      minx = Math.min(minx, c.x); maxx = Math.max(maxx, c.x);
      miny = Math.min(miny, c.y); maxy = Math.max(maxy, c.y);
    });
    var ub = clampBox(minx - 2, miny - 2, maxx - minx + 4, maxy - miny + 4);
    var L = fs.layer, selBefore = fs.selBefore;
    if (ub) {
      var before = fs.backup.getContext('2d').getImageData(ub.x, ub.y, ub.w, ub.h);
      var after = L.canvas.getContext('2d').getImageData(ub.x, ub.y, ub.w, ub.h);
      pushHistory(patchEntry(L, ub, before, after, fs.wasEdited, {
        undo: function () { applySel(selBefore); },
        redo: function () { applySel(selAfter); }
      }));
    }
    applySel(selAfter);
    render();
    scheduleThumbs();
  }

  // Vektoritason tila (polut ja alkuperäinen rajaus) kumoamista ja muunnosta varten.
  function cloneLoops(loops) {
    return loops ? loops.map(function (l) { return l.map(function (q) { return q.o ? { x: q.x, y: q.y, o: 1 } : { x: q.x, y: q.y }; }); }) : null;
  }
  function vectorState(L) { return { paths: LineoVector.clonePaths(L.paths), loops: cloneLoops(L.loops) }; }
  function applyVectorState(L, st) {
    L.paths = LineoVector.clonePaths(st.paths);
    L.loops = cloneLoops(st.loops);
    touchVector(L);
  }
  function vectorEntry(L, before) {
    var after = vectorState(L);
    return {
      undo: function () { applyVectorState(L, before); selection = null; updateContextPanel(); },
      redo: function () { applyVectorState(L, after); selection = null; updateContextPanel(); }
    };
  }
  // Asettaa tasolle polut = fn sovellettuna tilan pisteisiin.
  function mapVector(L, st, fn) {
    var paths = LineoVector.clonePaths(st.paths);
    paths.forEach(function (path) {
      path.nodes.forEach(function (n) {
        var a = fn(n.x, n.y), i = fn(n.ix, n.iy), o = fn(n.ox, n.oy);
        n.x = a.x; n.y = a.y; n.ix = i.x; n.iy = i.y; n.ox = o.x; n.oy = o.y;
      });
    });
    L.paths = paths;
    L.loops = st.loops ? st.loops.map(function (l) { return l.map(function (q) { var r = fn(q.x, q.y); if (q.o) r.o = 1; return r; }); }) : null;
    touchVector(L);
  }
  function vectorBounds(L) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    L.paths.forEach(function (path) {
      path.nodes.forEach(function (n) {
        [[n.x, n.y], [n.ix, n.iy], [n.ox, n.oy]].forEach(function (q) {
          x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]);
          y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]);
        });
      });
    });
    if (!isFinite(x0)) return null;
    return { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
  }

  // Tason muokkauskelpoisuus siirtoon ja muunnokseen (vektoritaso kelpaa, alkuperäinen ei).
  function movableLayer() {
    var L = activeLayer();
    if (!L) return null;
    if (L.id === 'original') { notice('Alkuperäinen kuva on suojattu. Kopioi valinta uudelle tasolle (Ctrl+J) ja siirrä tai muunna sitä.'); return null; }
    if (L.kind === 'vector') {
      if (L.locked) { notice('Taso on lukittu. Avaa lukitus Tasot-osiosta.'); return null; }
      if (!L.visible) { notice('Taso on piilotettu.'); return null; }
      return L;
    }
    return paintTarget(true);
  }

  // Siirrä (V): valitut pikselit, tai koko taso ilman valintaa. Alt-veto kopioi. Vektoritaso siirtyy kokonaan.
  function startMove(e, p, base) {
    var L = movableLayer();
    if (!L) return Object.assign(base, { type: 'pan' });
    var g = Object.assign(base, { type: 'float' }), fx = 0, fy = 0;
    if (L.kind === 'vector') {
      var before = null;
      g.onMove = function (pt, ev, dx, dy) {
        if (!before) before = vectorState(L);
        fx += dx; fy += dy;
        mapVector(L, before, function (x, y) { return { x: x + fx, y: y + fy }; });
      };
      g.commit = function () { if (before) pushHistory(vectorEntry(L, before)); };
      g.cancel = function () { if (before) applyVectorState(L, before); };
      return g;
    }
    var fs = null;
    g.onMove = function (pt, ev, dx, dy) {
      if (!fs) {
        fs = beginFloat(L, !!base.alt);
        if (!fs) { notice('Ei siirrettävää: taso on tyhjä tai valinta on kuvan ulkopuolella.'); return; }
        claimContour(L);
        fs.dx = 0; fs.dy = 0;
        fs.place = function (ctx) { ctx.translate(fs.dx, fs.dy); };
      }
      fx += dx; fy += dy;
      fs.dx = Math.round(fx); fs.dy = Math.round(fy);
      renderFloat(fs);
    };
    g.commit = function () {
      if (!fs) return;
      if (!fs.dx && !fs.dy) { cancelFloat(fs); return; }
      var b = fs.box, dx = fs.dx, dy = fs.dy;
      var after = fs.selBefore ? LineoSelect.clip(LineoSelect.shift(fs.selBefore, dx, dy), doc.width, doc.height) : null;
      commitFloat(fs, [{ x: b.x + dx, y: b.y + dy }, { x: b.x + b.w + dx, y: b.y + b.h + dy }], after);
    };
    g.cancel = function () { if (fs) cancelFloat(fs); };
    return g;
  }

  // ---------- Muunnos (T) ----------

  var tf = null;   // { layer, fs, orig, box, c, p: {tx, ty, rot, sx, sy}, selBefore }

  function tfPlace(ctx) {
    var c = tf.c, p = tf.p;
    ctx.translate(c.x + p.tx, c.y + p.ty);
    ctx.rotate(p.rot);
    ctx.scale(p.sx, p.sy);
    ctx.translate(-c.x, -c.y);
  }

  function tfMap(x, y) {
    var c = tf.c, p = tf.p, dx = (x - c.x) * p.sx, dy = (y - c.y) * p.sy;
    var cs = Math.cos(p.rot), sn = Math.sin(p.rot);
    return { x: c.x + p.tx + dx * cs - dy * sn, y: c.y + p.ty + dx * sn + dy * cs };
  }

  function tfCorners() {
    var b = tf.box;
    return [tfMap(b.x, b.y), tfMap(b.x + b.w, b.y), tfMap(b.x + b.w, b.y + b.h), tfMap(b.x, b.y + b.h)];
  }

  function tfIsIdentity() {
    var p = tf.p;
    return !p.tx && !p.ty && !p.rot && p.sx === 1 && p.sy === 1;
  }

  function tfLive() {
    if (!tf) return;
    if (tf.fs) {
      renderFloat(tf.fs);
    } else {
      mapVector(tf.layer, tf.orig, function (x, y) { var q = tfMap(x, y); return q; });
    }
    updateTfUI();
    render();
  }

  function updateTfUI() {
    if (!tf) return;
    var deg = Math.round(tf.p.rot * 180 / Math.PI) % 360;
    if (deg > 180) deg -= 360;
    if (deg <= -180) deg += 360;
    els.tfAngle.value = deg;
    $('tf-angle-out').textContent = deg + '°';
    updateRangeFill(els.tfAngle);
  }

  function startTransform() {
    var L = movableLayer();
    if (!L) return false;
    var box, fs = null, orig = null;
    if (L.kind === 'vector') {
      box = vectorBounds(L);
      if (!box) { notice('Tasolla ei ole muunnettavaa.'); return false; }
      orig = vectorState(L);
    } else {
      fs = beginFloat(L, false);
      if (!fs) { notice('Ei muunnettavaa: taso on tyhjä tai valinta on kuvan ulkopuolella.'); return false; }
      claimContour(L);
      box = fs.box;
    }
    tf = { layer: L, fs: fs, orig: orig, box: box, c: { x: box.x + box.w / 2, y: box.y + box.h / 2 },
      p: { tx: 0, ty: 0, rot: 0, sx: 1, sy: 1 }, selBefore: sel };
    if (fs) fs.place = tfPlace;
    updateTfUI();
    return true;
  }

  function transformSelection(t) {
    if (!t.selBefore) return null;
    var cs = tfCorners(), minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
    cs.forEach(function (q) {
      minx = Math.min(minx, q.x); maxx = Math.max(maxx, q.x);
      miny = Math.min(miny, q.y); maxy = Math.max(maxy, q.y);
    });
    var box = clampBox(minx, miny, maxx - minx, maxy - miny);
    if (!box) return null;
    var c = makeCanvas(box.w, box.h), x = c.getContext('2d', { willReadFrequently: true });
    x.translate(-box.x, -box.y);
    tfPlace(x);
    x.imageSmoothingQuality = 'high';
    x.drawImage(selMaskCanvas(t.selBefore), t.selBefore.x, t.selBefore.y);
    var data = x.getImageData(0, 0, box.w, box.h).data, a = new Uint8Array(box.w * box.h);
    for (var i = 0; i < a.length; i++) a[i] = data[i * 4 + 3];
    return LineoSelect.fromAlpha(a, box.x, box.y, box.w, box.h);
  }

  function endTransform(commit) {
    if (!tf) return;
    var t = tf, changed = !tfIsIdentity();
    if (t.fs) {
      if (!commit || !changed) {
        tf = null;
        cancelFloat(t.fs);
      } else {
        var corners = tfCorners(), selAfter = transformSelection(t);
        tf = null;
        commitFloat(t.fs, corners, selAfter);
      }
    } else {
      tf = null;
      if (commit && changed) pushHistory(vectorEntry(t.layer, t.orig));
      else applyVectorState(t.layer, t.orig);
    }
    updateContextPanel();
    render();
  }

  function leaveModal() {
    if (tool === 'transform' || tool === 'crop') setTool(returnTool && returnTool !== tool ? returnTool : 'hand');
  }

  // Muunnoskahvat näytön koordinaateissa
  var TF_HANDLES = [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [1, 0], [0, 1], [-1, 0]];

  function tfHandleScreen(hx, hy) {
    var b = tf.box, q = tfMap(tf.c.x + hx * b.w / 2, tf.c.y + hy * b.h / 2);
    return toScreen(q.x, q.y);
  }

  function tfRotateHandleScreen() {
    var s0 = toScreen(tf.c.x + tf.p.tx, tf.c.y + tf.p.ty), s1 = tfHandleScreen(0, -1);
    var dx = s1.x - s0.x, dy = s1.y - s0.y, len = Math.hypot(dx, dy) || 1;
    var off = 30 * dpr();
    return { x: s1.x + dx / len * off, y: s1.y + dy / len * off, from: s1 };
  }

  function startTfGesture(e, p, base) {
    if (!tf) return Object.assign(base, { type: 'pan' });
    var r = hitRadius() * 1.2, g = Object.assign(base, { type: 'tf' });
    var rp = tfRotateHandleScreen();
    g.cancel = function () { /* muunnos jää voimaan, kunnes käyttäjä hyväksyy tai peruu */ };
    g.commit = function () { updateContextPanel(); };

    if (Math.hypot(rp.x - p.x, rp.y - p.y) <= r) {
      g.onMove = function (pt, ev) {
        var d = toDoc(pt), C = { x: tf.c.x + tf.p.tx, y: tf.c.y + tf.p.ty };
        var ang = Math.atan2(d.y - C.y, d.x - C.x) + Math.PI / 2 + (tf.p.sy < 0 ? Math.PI : 0);
        if (ev.shiftKey) ang = Math.round(ang / (Math.PI / 12)) * (Math.PI / 12);
        tf.p.rot = ang;
        tfLive();
      };
      return g;
    }
    for (var i = 0; i < TF_HANDLES.length; i++) {
      var hx = TF_HANDLES[i][0], hy = TF_HANDLES[i][1], hs = tfHandleScreen(hx, hy);
      if (Math.hypot(hs.x - p.x, hs.y - p.y) > r) continue;
      var b = tf.box, A = tfMap(tf.c.x - hx * b.w / 2, tf.c.y - hy * b.h / 2);
      var sx0 = tf.p.sx, sy0 = tf.p.sy;
      (function (hx, hy, A, sx0, sy0) {
        g.onMove = function (pt, ev) {
          var P = toDoc(pt), p = tf.p, w = b.w, h = b.h;
          var cs = Math.cos(p.rot), sn = Math.sin(p.rot);
          var vx = P.x - A.x, vy = P.y - A.y;
          var ux = vx * cs + vy * sn, uy = -vx * sn + vy * cs;
          var nsx = sx0, nsy = sy0;
          if (hx) nsx = ux / (hx * w);
          if (hy) nsy = uy / (hy * h);
          var keep = (els.tfRatio.value === 'keep') !== !!ev.shiftKey;
          if (keep && hx && hy) {
            var d0x = hx * w * sx0, d0y = hy * h * sy0;
            var f = (ux * d0x + uy * d0y) / (d0x * d0x + d0y * d0y);
            nsx = sx0 * f; nsy = sy0 * f;
          }
          if (Math.abs(nsx) < 0.02) nsx = 0.02 * (nsx < 0 ? -1 : 1);
          if (Math.abs(nsy) < 0.02) nsy = 0.02 * (nsy < 0 ? -1 : 1);
          var ax = -hx * w / 2 * nsx, ay = -hy * h / 2 * nsy;
          p.sx = nsx; p.sy = nsy;
          p.tx = A.x - tf.c.x - (ax * cs - ay * sn);
          p.ty = A.y - tf.c.y - (ax * sn + ay * cs);
          tfLive();
        };
      })(hx, hy, A, sx0, sy0);
      return g;
    }
    // Laatikon sisältä: siirto
    var d = toDoc(p), c = tf.c, tp = tf.p;
    var vx = d.x - c.x - tp.tx, vy = d.y - c.y - tp.ty, cs = Math.cos(tp.rot), sn = Math.sin(tp.rot);
    var lx = (vx * cs + vy * sn) / tp.sx, ly = (-vx * sn + vy * cs) / tp.sy;
    if (Math.abs(lx) <= tf.box.w / 2 && Math.abs(ly) <= tf.box.h / 2) {
      g.onMove = function (pt, ev, dx, dy) {
        tf.p.tx += dx; tf.p.ty += dy;
        tfLive();
      };
      return g;
    }
    return Object.assign(base, { type: 'pan' });
  }

  // ---------- Rajaus (C) ----------

  var crop = null;   // { x0, y0, x1, y1 } kuvakoordinaateissa

  function startCrop(zoomOut) {
    crop = { x0: 0, y0: 0, x1: doc.width, y1: doc.height };
    els.cropRatio.value = 'free';
    updateCropInfo();
    // Annetaan tilaa vetää rajaus kuvan ulkopuolelle (kangas kasvaa).
    if (zoomOut && view.fitted) zoomAt(els.view.width / 2, els.view.height / 2, 0.7);
  }

  function cropRatioValue() { return els.cropRatio.value === 'free' ? 0 : +els.cropRatio.value; }

  function updateCropInfo() {
    if (!crop || !doc) { els.cropInfo.textContent = ''; return; }
    var grows = crop.x0 < -0.5 || crop.y0 < -0.5 || crop.x1 > doc.width + 0.5 || crop.y1 > doc.height + 0.5;
    els.cropInfo.textContent = Math.round(crop.x1 - crop.x0) + ' × ' + Math.round(crop.y1 - crop.y0) + ' px' + (grows ? ' · kangas kasvaa' : '');
  }

  // Rajaus saa ulottua kuvan ulkopuolelle: yhden kuvan verran kummallekin puolelle.
  function cropClamp(v, max) { return Math.max(-max, Math.min(max * 2, v)); }

  // hx, hy: vedettävä kahva (0 = ei vaikuta akseliin); anchorX/Y: vastakkainen kulma
  function cropDrag(base, hx, hy, P) {
    var W = doc.width, H = doc.height, R = cropRatioValue();
    var c = { x0: base.x0, y0: base.y0, x1: base.x1, y1: base.y1 };
    var px = cropClamp(P.x, W), py = cropClamp(P.y, H);
    if (hx < 0) c.x0 = px; else if (hx > 0) c.x1 = px;
    if (hy < 0) c.y0 = py; else if (hy > 0) c.y1 = py;
    var x0 = Math.min(c.x0, c.x1), x1 = Math.max(c.x0, c.x1), y0 = Math.min(c.y0, c.y1), y1 = Math.max(c.y0, c.y1);
    if (R) {
      var w = x1 - x0, h = y1 - y0;
      if (hx && hy) {
        // Kulma: vastakas kulma pysyy paikallaan, pienempi mitta ratkaisee.
        if (w / Math.max(h, 1e-6) > R) w = h * R; else h = w / R;
        var ax = hx > 0 ? x0 : x1, ay = hy > 0 ? y0 : y1;
        x0 = hx > 0 ? ax : ax - w; x1 = hx > 0 ? ax + w : ax;
        y0 = hy > 0 ? ay : ay - h; y1 = hy > 0 ? ay + h : ay;
      } else {
        // Reuna: toinen mitta mukautuu keskeltä.
        var cx = (base.x0 + base.x1) / 2, cy = (base.y0 + base.y1) / 2;
        if (hx) {
          h = w / R;
          var maxh = 2 * Math.min(cy + H, 2 * H - cy);
          if (h > maxh) { h = maxh; w = h * R; if (hx > 0) x1 = x0 + w; else x0 = x1 - w; }
          y0 = cy - h / 2; y1 = cy + h / 2;
        } else {
          w = h * R;
          var maxw = 2 * Math.min(cx + W, 2 * W - cx);
          if (w > maxw) { w = maxw; h = w / R; if (hy > 0) y1 = y0 + h; else y0 = y1 - h; }
          x0 = cx - w / 2; x1 = cx + w / 2;
        }
      }
    }
    crop = { x0: x0, y0: y0, x1: x1, y1: y1 };
    updateCropInfo();
    render();
  }

  function cropFitRatio() {
    var R = cropRatioValue();
    if (!crop || !R) return;
    var w = crop.x1 - crop.x0, h = crop.y1 - crop.y0, cx = (crop.x0 + crop.x1) / 2, cy = (crop.y0 + crop.y1) / 2;
    if (w / h > R) w = h * R; else h = w / R;
    crop = { x0: cx - w / 2, y0: cy - h / 2, x1: cx + w / 2, y1: cy + h / 2 };
    updateCropInfo();
    render();
  }

  function cropHandleScreen(hx, hy) {
    return toScreen(hx < 0 ? crop.x0 : hx > 0 ? crop.x1 : (crop.x0 + crop.x1) / 2, hy < 0 ? crop.y0 : hy > 0 ? crop.y1 : (crop.y0 + crop.y1) / 2);
  }

  function startCropGesture(e, p, base) {
    if (!crop) return Object.assign(base, { type: 'pan' });
    var g = Object.assign(base, { type: 'crop' }), r = hitRadius() * 1.2;
    g.cancel = function () {};
    g.commit = function () { updateCropInfo(); render(); };
    for (var i = 0; i < TF_HANDLES.length; i++) {
      var hx = TF_HANDLES[i][0], hy = TF_HANDLES[i][1], hs = cropHandleScreen(hx, hy);
      if (Math.hypot(hs.x - p.x, hs.y - p.y) > r) continue;
      var start = { x0: crop.x0, y0: crop.y0, x1: crop.x1, y1: crop.y1 };
      (function (hx, hy, start) {
        g.onMove = function (pt) { cropDrag(start, hx, hy, toDoc(pt)); };
      })(hx, hy, start);
      return g;
    }
    var d = toDoc(p);
    if (d.x >= crop.x0 && d.x <= crop.x1 && d.y >= crop.y0 && d.y <= crop.y1) {
      g.onMove = function (pt, ev, dx, dy) {
        var w = crop.x1 - crop.x0, h = crop.y1 - crop.y0;
        var nx = Math.max(-doc.width, Math.min(doc.width * 2 - w, crop.x0 + dx)), ny = Math.max(-doc.height, Math.min(doc.height * 2 - h, crop.y0 + dy));
        crop = { x0: nx, y0: ny, x1: nx + w, y1: ny + h };
        render();
      };
      return g;
    }
    // Uusi rajaus vetämällä
    var a = { x: cropClamp(d.x, doc.width), y: cropClamp(d.y, doc.height) };
    g.onMove = function (pt) {
      var q = toDoc(pt);
      var hx = q.x >= a.x ? 1 : -1, hy = q.y >= a.y ? 1 : -1;
      cropDrag({ x0: a.x, y0: a.y, x1: a.x, y1: a.y }, hx, hy, q);
    };
    return g;
  }

  // Koko dokumentin tila (tasojen koot ja sisällöt) rajauksen kumoamista varten.
  function docSnapshot() {
    return {
      w: doc.width, h: doc.height,
      src: doc.src ? { ox: doc.src.ox, oy: doc.src.oy, bg: doc.src.bg } : null,
      layers: doc.layers.map(function (L) {
        return L.kind === 'raster' ? { L: L, canvas: L.canvas } : { L: L, paths: LineoVector.clonePaths(L.paths), loops: cloneLoops(L.loops) };
      })
    };
  }

  function snapshotBytes(st) {
    var n = 0;
    st.layers.forEach(function (e) { if (e.canvas) n += e.canvas.width * e.canvas.height * 4; });
    return n;
  }

  function applySnapshot(st) {
    aiReset();
    tf = null; crop = null; shapePreview = null; sel = null; selOffset = null; penSession = null;
    doc.width = st.w; doc.height = st.h;
    if (st.src && doc.src) { doc.src.ox = st.src.ox; doc.src.oy = st.src.oy; doc.src.bg = st.src.bg; }
    doc.key = 'img' + Date.now() + Math.random();
    st.layers.forEach(function (e) {
      if (e.canvas) e.L.canvas = e.canvas;
      else { e.L.paths = LineoVector.clonePaths(e.paths); e.L.loops = cloneLoops(e.loops); e.L.p2d = null; }
    });
    previewCanvas = null;
    doc.contourIsPreview = false;
    prepareEngine();
    if (!getLayer('contour').edited) requestContours(false);
    els.statusSize.textContent = doc.width + ' × ' + doc.height + ' px';
    buildLayerList();
    updateContextPanel();
    fitView();
    scheduleThumbs();
    if (tool === 'crop') startCrop();
  }

  // Suurin sallittu kankaan koko (muistia: jokainen taso on oma bittikartta).
  var MAX_PIXELS = IS_TOUCH ? 10e6 : 20e6;
  var MAX_CANVAS_SIDE = 12000;

  // Uusi kangas = suorakulmio (x, y, w, h) vanhan kankaan koordinaateissa. Voi ulottua kuvan ulkopuolelle,
  // jolloin kangas kasvaa: alkuperäinen kuva täytetään bg-värillä (transparent | white | black), muut tasot jäävät läpinäkyviksi.
  function reframe(x, y, w, h, bg) {
    if (w < 1 || h < 1) return false;
    if (w > MAX_CANVAS_SIDE || h > MAX_CANVAS_SIDE || w * h > MAX_PIXELS) {
      notice('Kangas on liian suuri. Enintään ' + Math.round(MAX_PIXELS / 1e6) + ' megapikseliä (nyt ' + (w * h / 1e6).toFixed(1).replace('.', ',') + ').');
      return false;
    }
    settle();
    var before = docSnapshot();
    var grows = x < 0 || y < 0 || x + w > doc.width || y + h > doc.height;
    var after = {
      w: w, h: h,
      src: doc.src ? { ox: doc.src.ox + x, oy: doc.src.oy + y, bg: grows && bg !== 'transparent' ? bg : doc.src.bg } : null,
      layers: doc.layers.map(function (L) {
        if (L.kind === 'raster') {
          var nc = makeCanvas(w, h);
          var nx = nc.getContext('2d', L.id === 'original' ? { willReadFrequently: true } : undefined);
          if (L.id === 'original' && bg !== 'transparent') {
            nx.fillStyle = bg === 'black' ? '#000' : '#fff';
            nx.fillRect(0, 0, w, h);
          }
          nx.drawImage(L.canvas, -x, -y);
          return { L: L, canvas: nc };
        }
        var st = vectorState(L), fake = { paths: null, loops: null };
        mapVector(fake, st, function (px, py) { return { x: px - x, y: py - y }; });
        return { L: L, paths: fake.paths, loops: fake.loops };
      })
    };
    applySnapshot(after);
    pushHistory({
      bytes: snapshotBytes(before) + snapshotBytes(after),
      undo: function () { applySnapshot(before); },
      redo: function () { applySnapshot(after); }
    });
    return true;
  }

  function applyCrop() {
    if (!doc || !crop) return;
    var x = Math.round(crop.x0), y = Math.round(crop.y0);
    var w = Math.round(crop.x1) - x, h = Math.round(crop.y1) - y;
    if (w < 4 || h < 4) { notice('Rajattava alue on liian pieni.'); return; }
    if (x === 0 && y === 0 && w === doc.width && h === doc.height) { leaveModal(); return; }
    if (reframe(x, y, w, h, els.cropBg.value)) leaveModal();
  }

  // ---------- Kankaan koko ----------

  var canvasAnchor = { x: 0.5, y: 0.5 };

  function buildAnchorGrid() {
    els.canvasAnchor.innerHTML = '';
    var marks = ['↖', '↑', '↗', '←', '•', '→', '↙', '↓', '↘'];
    for (var i = 0; i < 9; i++) {
      (function (i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = marks[i];
        b.setAttribute('data-ax', (i % 3) / 2);
        b.setAttribute('data-ay', Math.floor(i / 3) / 2);
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () { setCanvasAnchor((i % 3) / 2, Math.floor(i / 3) / 2); });
        els.canvasAnchor.appendChild(b);
      })(i);
    }
  }

  function setCanvasAnchor(ax, ay) {
    canvasAnchor = { x: ax, y: ay };
    Array.prototype.forEach.call(els.canvasAnchor.children, function (b) {
      b.setAttribute('aria-pressed', String(+b.getAttribute('data-ax') === ax && +b.getAttribute('data-ay') === ay));
    });
  }

  function openCanvasDialog() {
    if (!doc) return;
    settle();
    if (tool === 'crop') leaveModal();
    els.canvasCurrent.textContent = 'Nykyinen koko: ' + doc.width + ' × ' + doc.height + ' px';
    els.canvasW.value = doc.width;
    els.canvasH.value = doc.height;
    els.canvasLink.value = 'free';
    els.canvasBg.value = 'transparent';
    setCanvasAnchor(0.5, 0.5);
    els.canvasModal.hidden = false;
    els.canvasW.focus();
    els.canvasW.select();
  }

  function closeCanvasDialog() {
    els.canvasModal.hidden = true;
    // Kohdistus pois piilotetusta kentästä, jotta pikanäppäimet toimivat heti.
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  function applyCanvasDialog() {
    if (!doc) return;
    var w = Math.round(+els.canvasW.value), h = Math.round(+els.canvasH.value);
    if (!(w >= 1) || !(h >= 1)) { notice('Anna leveys ja korkeus pikseleinä.'); return; }
    if (w === doc.width && h === doc.height) { closeCanvasDialog(); return; }
    var ox = Math.round((w - doc.width) * canvasAnchor.x), oy = Math.round((h - doc.height) * canvasAnchor.y);
    if (reframe(-ox, -oy, w, h, els.canvasBg.value)) {
      closeCanvasDialog();
      notice('Kangas on nyt ' + w + ' × ' + h + ' px.');
    }
  }

  // ---------- Kopioi, leikkaa, liitä ----------
  //
  // Ohjelmalla on oma leikepöytä (clip), johon Ctrl+C / Ctrl+X tallentaa pikselit paikkatietoineen.
  // Kopio kirjoitetaan myös järjestelmän leikepöydälle (jos selain sallii), jotta sen voi liittää muihin ohjelmiin.
  // Liittäessä tunnistetaan, onko leikepöydän kuva ohjelman oma kopio vai uudempi muualta tullut kuva.

  var clip = null;   // { canvas, x, y }

  function renderLayerCanvas(L) {
    if (L.kind === 'raster') return L.canvas;
    var c = makeCanvas(doc.width, doc.height);
    drawLayerTo(c.getContext('2d'), L);
    return c;
  }

  function copyToClip() {
    if (!doc) return false;
    settle();
    var L = activeLayer();
    if (!L) return false;
    var src = renderLayerCanvas(L), box;
    if (sel) {
      box = clampBox(sel.x, sel.y, sel.w, sel.h);
    } else {
      box = L.kind === 'raster' ? contentBox(L) : contentBox({ canvas: src });
    }
    if (!box) { notice(sel ? 'Valinta on kuvan ulkopuolella.' : 'Taso on tyhjä, ei kopioitavaa.'); return false; }
    var c = makeCanvas(box.w, box.h), x = c.getContext('2d');
    x.drawImage(src, -box.x, -box.y);
    if (sel) {
      x.globalCompositeOperation = 'destination-in';
      x.drawImage(selMaskCanvas(sel), sel.x - box.x, sel.y - box.y);
    }
    clip = { canvas: c, x: box.x, y: box.y };
    writeSystemClipboard(c);
    return true;
  }

  function writeSystemClipboard(canvas) {
    try {
      if (!navigator.clipboard || !navigator.clipboard.write || typeof ClipboardItem === 'undefined') return;
      var item = new ClipboardItem({ 'image/png': new Promise(function (resolve, reject) {
        canvas.toBlob(function (b) { if (b) resolve(b); else reject(new Error('toBlob')); }, 'image/png');
      }) });
      navigator.clipboard.write([item]).catch(function () { /* selain ei salli: ohjelman oma kopio riittää */ });
    } catch (err) { /* sama */ }
  }

  function copySelection() {
    if (copyToClip()) notice(sel ? 'Valinta kopioitu.' : 'Taso kopioitu.');
  }

  function cutSelection() {
    if (!doc) return;
    if (!copyToClip()) return;
    var L = activeLayer();
    if (L.kind !== 'raster') { notice('Vektoritasoa ei voi leikata, mutta se kopioitiin.'); return; }
    if (sel) { deleteSelection(); return; }
    var target = paintTarget(true);
    if (!target) return;
    editPixels(target, { x: 0, y: 0, w: doc.width, h: doc.height }, function (ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, doc.width, doc.height);
      ctx.restore();
    });
  }

  // Lisää kuvan uudeksi tasoksi aktiivisen tason päälle (kuva sijoitetaan kohtaan x, y).
  function pasteCanvasAsLayer(source, x, y, text) {
    settle();
    var nc = makeCanvas(doc.width, doc.height);
    nc.getContext('2d').drawImage(source, x, y);
    doc.rasterCount++;
    var layer = { id: 'r' + Date.now() + doc.rasterCount, kind: 'raster', name: 'Taso ' + doc.rasterCount, canvas: nc, visible: true, opacity: 1, locked: false };
    var index = doc.layers.indexOf(activeLayer()) + 1;
    addLayer(layer, index);
    pushHistory({ bytes: layerBytes(), undo: function () { removeLayer(layer); }, redo: function () { addLayer(layer, index); } });
    scheduleThumbs();
    notice(text + ' (' + layer.name + ').');
  }

  function pasteInternal() {
    if (!doc) return;
    if (!clip) { notice('Ei liitettävää. Kopioi ensin jotain (Ctrl+C).'); return; }
    pasteCanvasAsLayer(clip.canvas, clip.x, clip.y, 'Liitetty samaan kohtaan');
  }

  // Muualta tullut kuva: uudelle tasolle keskelle, tarvittaessa kankaaseen sopivaksi pienennettynä.
  function pasteExternal(bitmap) {
    var w = bitmap.width, h = bitmap.height, s = Math.min(1, doc.width / w, doc.height / h);
    var c = makeCanvas(Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s)));
    var x = c.getContext('2d');
    x.imageSmoothingQuality = 'high';
    x.drawImage(bitmap, 0, 0, c.width, c.height);
    pasteCanvasAsLayer(c, Math.round((doc.width - c.width) / 2), Math.round((doc.height - c.height) / 2),
      s < 1 ? 'Kuva pienennettiin kankaaseen sopivaksi ja liitettiin keskelle' : 'Kuva liitettiin keskelle');
  }

  // Vertaa kahta kuvaa pienennettyinä: onko leikepöydän kuva ohjelman oma kopio?
  function sameImage(a, b) {
    if (a.width !== b.width || a.height !== b.height) return false;
    function small(src) {
      var c = makeCanvas(16, 16), x = c.getContext('2d', { willReadFrequently: true });
      x.drawImage(src, 0, 0, 16, 16);
      return x.getImageData(0, 0, 16, 16).data;
    }
    var da = small(a), db = small(b), diff = 0;
    for (var i = 0; i < da.length; i++) diff += Math.abs(da[i] - db[i]);
    return diff / da.length < 6;
  }

  async function handlePastedImage(blob, name) {
    var bmp = null;
    try { bmp = await createImageBitmap(blob); } catch (err) { /* ei kuva */ }
    if (!bmp) { if (clip && doc) pasteInternal(); return; }
    if (!doc) {
      if (bmp.close) bmp.close();
      openFile(new File([blob], name && name !== 'image.png' ? name : 'liitetty-kuva.png', { type: blob.type || 'image/png' }));
      return;
    }
    if (clip && sameImage(clip.canvas, bmp)) pasteInternal();
    else pasteExternal(bmp);
    if (bmp.close) bmp.close();
  }

  // Valikon Liitä: lukee järjestelmän leikepöydän, ja jos siellä ei ole kuvaa, liittää ohjelman oman kopion.
  async function pasteFromMenu() {
    if (!doc) return;
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        var items = await navigator.clipboard.read();
        for (var i = 0; i < items.length; i++) {
          var type = items[i].types.filter(function (t) { return /^image\//.test(t); })[0];
          if (type) { await handlePastedImage(await items[i].getType(type), 'liitetty-kuva.png'); return; }
        }
      }
    } catch (err) { /* lupaa ei annettu tai ei tuettu: käytetään omaa kopiota */ }
    pasteInternal();
  }

  // ---------- Muokkaa-valikko ----------

  function menuAction(name) {
    closeMenu();
    if (!doc) return;
    if (name === 'copy') copySelection();
    else if (name === 'cut') cutSelection();
    else if (name === 'paste') pasteFromMenu();
    else if (name === 'select-all') selectAll();
    else if (name === 'deselect') selectNone();
    else if (name === 'invert') selectInvert();
    else if (name === 'canvas') openCanvasDialog();
  }

  // Valikot (Muokkaa, Säädöt): yksi auki kerrallaan.
  function openMenu(which) {
    closeMenu();
    var m = which === 'adjust' ? [els.adjustMenu, els.btnAdjust] : which === 'file' ? [els.fileMenu, els.btnFile] : [els.editMenu, els.btnEdit];
    if (which === 'file') {
      Array.prototype.forEach.call(els.fileMenu.querySelectorAll('[data-file]'), function (b) {
        var needsDoc = /^(save|save-as|export)$/.test(b.getAttribute('data-file'));
        b.disabled = needsDoc && !doc;
      });
    }
    m[0].hidden = false;
    m[1].setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    els.editMenu.hidden = true;
    els.adjustMenu.hidden = true;
    els.fileMenu.hidden = true;
    els.btnEdit.setAttribute('aria-expanded', 'false');
    els.btnAdjust.setAttribute('aria-expanded', 'false');
    els.btnFile.setAttribute('aria-expanded', 'false');
  }

  function fileAction(name) {
    closeMenu();
    if (name === 'new') newDocument();
    else if (name === 'open') pickFile();
    else if (name === 'save') saveProject(false);
    else if (name === 'save-as') saveProject(true);
    else if (name === 'export') openExportDialog();
    else if (name === 'palette-export') exportPalette();
    else if (name === 'palette-import') els.paletteInput.click();
    else if (name === 'keys') openKeysDialog();
  }

  // ---------- Valinnan, muunnoksen ja rajauksen piirto ----------

  function strokeDouble(path, dashed) {
    var lw = dpr() / view.scale;
    vctx.lineWidth = lw * 2;
    vctx.strokeStyle = 'rgba(0,0,0,.75)';
    vctx.setLineDash([]);
    vctx.stroke(path);
    vctx.lineWidth = lw;
    vctx.strokeStyle = '#fff';
    vctx.setLineDash(dashed ? [4 * lw, 4 * lw] : []);
    vctx.stroke(path);
  }

  function drawSelectionOverlay() {
    if (!doc) return;
    vctx.save();
    vctx.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    if (sel) {
      if (selOffset) vctx.translate(selOffset.dx, selOffset.dy);
      strokeDouble(selPath(sel), true);
    }
    if (shapePreview) {
      var sp = shapePreview, path = new Path2D();
      if (sp.type === 'rect') {
        path.rect(Math.min(sp.x0, sp.x1), Math.min(sp.y0, sp.y1), Math.abs(sp.x1 - sp.x0), Math.abs(sp.y1 - sp.y0));
      } else if (sp.type === 'lasso') {
        sp.pts.forEach(function (q, i) { if (i) path.lineTo(q.x, q.y); else path.moveTo(q.x, q.y); });
      } else if (sp.type === 'grad') {
        path.moveTo(sp.a.x, sp.a.y);
        path.lineTo(sp.b.x, sp.b.y);
        path.arc(sp.a.x, sp.a.y, 4 * dpr() / view.scale, 0, Math.PI * 2);
        path.moveTo(sp.b.x + 4 * dpr() / view.scale, sp.b.y);
        path.arc(sp.b.x, sp.b.y, 4 * dpr() / view.scale, 0, Math.PI * 2);
      }
      strokeDouble(path, sp.type !== 'grad');
    }
    vctx.restore();
  }

  function drawHandle(x, y, r, round) {
    vctx.beginPath();
    if (round) vctx.arc(x, y, r, 0, Math.PI * 2); else vctx.rect(x - r, y - r, r * 2, r * 2);
    vctx.fillStyle = '#fff';
    vctx.fill();
    vctx.lineWidth = 1.5 * dpr();
    vctx.strokeStyle = '#ff8a3d';
    vctx.stroke();
  }

  function drawTransformOverlay() {
    if (!tf || tool !== 'transform') return;
    var cs = tfCorners().map(function (q) { return toScreen(q.x, q.y); });
    vctx.save();
    vctx.setTransform(1, 0, 0, 1, 0, 0);
    vctx.beginPath();
    cs.forEach(function (q, i) { if (i) vctx.lineTo(q.x, q.y); else vctx.moveTo(q.x, q.y); });
    vctx.closePath();
    vctx.lineWidth = 3 * dpr(); vctx.strokeStyle = 'rgba(0,0,0,.6)'; vctx.stroke();
    vctx.lineWidth = 1 * dpr(); vctx.strokeStyle = '#fff'; vctx.stroke();
    var rp = tfRotateHandleScreen(), r = (IS_TOUCH ? 7 : 5) * dpr();
    vctx.beginPath(); vctx.moveTo(rp.from.x, rp.from.y); vctx.lineTo(rp.x, rp.y);
    vctx.lineWidth = 1 * dpr(); vctx.strokeStyle = '#fff'; vctx.stroke();
    TF_HANDLES.forEach(function (h) { var s = tfHandleScreen(h[0], h[1]); drawHandle(s.x, s.y, r, false); });
    drawHandle(rp.x, rp.y, r, true);
    vctx.restore();
  }

  function drawCropOverlay() {
    if (!crop || tool !== 'crop') return;
    var a = toScreen(crop.x0, crop.y0), b = toScreen(crop.x1, crop.y1);
    var ix = view.x, iy = view.y, iw = doc.width * view.scale, ih = doc.height * view.scale;
    var cw = els.view.width, ch = els.view.height;
    vctx.save();
    vctx.setTransform(1, 0, 0, 1, 0, 0);
    // Rajauksen ulkopuoli tummennetaan koko näkymässä
    vctx.fillStyle = 'rgba(0,0,0,.55)';
    vctx.fillRect(0, 0, cw, Math.max(0, a.y));
    vctx.fillRect(0, b.y, cw, Math.max(0, ch - b.y));
    vctx.fillRect(0, a.y, Math.max(0, a.x), b.y - a.y);
    vctx.fillRect(b.x, a.y, Math.max(0, cw - b.x), b.y - a.y);
    // Rajauksen sisällä oleva kuvan ulkopuolinen alue (uusi kangas) vaaleaksi raidoitukseksi
    vctx.save();
    vctx.beginPath();
    vctx.rect(a.x, a.y, b.x - a.x, b.y - a.y);
    vctx.rect(ix, iy, iw, ih);
    vctx.clip('evenodd');
    vctx.fillStyle = 'rgba(120,170,255,.22)';
    vctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
    vctx.restore();
    vctx.lineWidth = 1 * dpr();
    vctx.strokeStyle = 'rgba(255,255,255,.45)';
    vctx.beginPath();
    for (var i = 1; i < 3; i++) {
      vctx.moveTo(a.x + (b.x - a.x) * i / 3, a.y); vctx.lineTo(a.x + (b.x - a.x) * i / 3, b.y);
      vctx.moveTo(a.x, a.y + (b.y - a.y) * i / 3); vctx.lineTo(b.x, a.y + (b.y - a.y) * i / 3);
    }
    vctx.stroke();
    vctx.strokeStyle = '#fff';
    vctx.lineWidth = 1.5 * dpr();
    vctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
    var r = (IS_TOUCH ? 7 : 5) * dpr();
    TF_HANDLES.forEach(function (h) { var s = cropHandleScreen(h[0], h[1]); drawHandle(s.x, s.y, r, false); });
    vctx.restore();
  }

  // ---------- Ääriviivatyylit ----------

  var contourStyle = null;   // 'thin' | 'comic' | 'pencil' | null

  // Tyylien arvot kuvan koon mukaan (viivan oletuspaksuus skaalautuu kuvan mukana).
  function styleSpec(name) {
    var base = defaultLineWidth();
    function half(v) { return Math.round(v * 2) / 2; }
    if (name === 'thin') return { detail: 55, noise: 40, color: '#111111', width: Math.max(0.5, half(base * 0.6)) };
    if (name === 'comic') return { detail: 35, noise: 55, color: '#000000', width: Math.min(24, Math.max(1, half(base * 3))) };
    return { detail: 65, noise: 25, color: '#3a3a3a', width: Math.max(0.5, half(base * 0.8)), pencil: true };
  }

  function updateStyleButtons() {
    var vec = activeVector();
    [[els.contourStyles, contourStyle], [els.vectorStyles, vec ? vec.styleName || null : null]].forEach(function (g) {
      Array.prototype.forEach.call(g[0].children, function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-style') === g[1]));
      });
    });
  }

  // Automaattiset ääriviivat: tyyli asettaa säätimet. Saman tyylin uudelleen painaminen poistaa tyylin (lyijykynän raekuvio).
  function applyContourStyle(name) {
    if (!doc || getLayer('contour').edited) return;
    contoursOn();
    if (contourStyle === name) { contourStyle = null; }
    else {
      var sp = styleSpec(name);
      els.detail.value = sp.detail;
      els.noise.value = sp.noise;
      els.thickness.value = sp.width;
      els.lineColor.value = sp.color;
      contourStyle = name;
    }
    updateOutputs();
    updateStyleButtons();
    requestContours(false);
  }

  function vectorStyleState(L) { return { stroke: Object.assign({}, L.stroke), name: L.styleName || null }; }
  function setVectorStyleState(L, st) { L.stroke = Object.assign({}, st.stroke); L.styleName = st.name; touchVector(L); }

  // Vektorikohteiden tyyli: aktiiviselle tai kaikille kohteille yhtenä kumottavana askeleena.
  function applyVectorStyle(name, all) {
    if (!doc) return;
    var targets = all ? doc.layers.filter(function (L) { return L.kind === 'vector' && !L.locked; }) : [activeVector()].filter(function (L) { return L && !L.locked; });
    if (!targets.length) { notice(all ? 'Ei muokattavia vektorikohteita.' : 'Valitse (lukitsematon) vektorikohde.'); return; }
    var sp = styleSpec(name), changes = targets.map(function (L) {
      var before = vectorStyleState(L);
      setVectorStyleState(L, { stroke: { width: sp.width, color: sp.color, pencil: !!sp.pencil }, name: name });
      return { L: L, before: before, after: vectorStyleState(L) };
    });
    pushHistory({
      undo: function () { changes.forEach(function (c) { setVectorStyleState(c.L, c.before); }); updateContextPanel(); },
      redo: function () { changes.forEach(function (c) { setVectorStyleState(c.L, c.after); }); updateContextPanel(); }
    });
    updateContextPanel();
  }

  // ---------- Oma paletti ----------

  var PALETTE_KEY = 'lineo-palette';
  var DEFAULT_PALETTE = ['#111111', '#ffffff', '#e03131', '#1971c2', '#2f9e44', '#f08c00'];
  var paletteRemoving = false;

  function isHex(v) { return typeof v === 'string' && /^#[0-9a-f]{6}$/.test(v); }

  function loadPalette() {
    try {
      var v = JSON.parse(localStorage.getItem(PALETTE_KEY));
      if (Array.isArray(v)) return v.filter(isHex).slice(0, 48);
    } catch (err) { /* ei tallennusta: oletuspaletti */ }
    return DEFAULT_PALETTE.slice();
  }
  var palette = loadPalette();

  function savePalette() {
    try { localStorage.setItem(PALETTE_KEY, JSON.stringify(palette)); } catch (err) { /* ei tallennusta */ }
  }

  // Paletin kohteet: mihin väriin napautus vaikuttaa.
  function paletteInput(target) {
    return target === 'vec' ? els.vecColor : target === 'line' ? els.lineColor : els.brushColor;
  }

  function setTargetColor(target, hex) {
    var input = paletteInput(target);
    input.value = hex;
    // Sama polku kuin käsin valitulla värillä: vektorin historia ja ääriviivojen laskenta toimivat.
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function renderPalettes() {
    Array.prototype.forEach.call(document.querySelectorAll('.palette-box'), function (box) {
      var target = box.getAttribute('data-target'), el = box.querySelector('.palette');
      el.innerHTML = '';
      el.classList.toggle('is-removing', paletteRemoving);
      if (!palette.length) {
        var empty = document.createElement('span');
        empty.className = 'palette-empty';
        empty.textContent = 'Paletti on tyhjä. Lisää nykyinen väri +-napilla.';
        el.appendChild(empty);
      }
      palette.forEach(function (hex) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'swatch';
        b.title = hex;
        b.style.background = hex;
        b.setAttribute('aria-label', hex);
        b.addEventListener('click', function () {
          if (paletteRemoving) {
            palette = palette.filter(function (c) { return c !== hex; });
            savePalette();
            renderPalettes();
          } else {
            setTargetColor(target, hex);
          }
        });
        el.appendChild(b);
      });
      var rm = box.querySelector('[data-pal="remove"]');
      rm.setAttribute('aria-pressed', String(paletteRemoving));
    });
  }

  function addToPalette(hex) {
    hex = String(hex).toLowerCase();
    if (!isHex(hex)) return;
    if (palette.indexOf(hex) === -1) {
      if (palette.length >= 48) palette.shift();
      palette.push(hex);
      savePalette();
    }
    renderPalettes();
  }

  // ---------- Pipetti ----------

  function toHex(r, g, b) {
    return '#' + [r, g, b].map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join('');
  }

  // Väri pisteestä (x, y): lähde original | active | visible, säde r (0 = yksi piste, 1 = 3×3, 2 = 5×5).
  // Läpinäkyvä kohta tulkitaan valkoiseksi.
  function sampleColor(x, y, source, r) {
    x = Math.floor(x); y = Math.floor(y);
    var n = 2 * r + 1, c = makeCanvas(n, n), cx = c.getContext('2d', { willReadFrequently: true });
    cx.fillStyle = '#fff';
    cx.fillRect(0, 0, n, n);
    cx.translate(r - x, r - y);
    if (source === 'original') {
      cx.drawImage(getLayer('original').canvas, 0, 0);
    } else if (source === 'active') {
      var A = activeLayer();
      if (!A) return null;
      drawLayerTo(cx, A);
    } else {
      doc.layers.forEach(function (L) {
        if (!L.visible || L.opacity <= 0) return;
        cx.globalAlpha = L.opacity;
        drawLayerTo(cx, L);
      });
    }
    var d = cx.getImageData(0, 0, n, n).data, sr = 0, sg = 0, sb = 0, k = n * n;
    for (var i = 0; i < d.length; i += 4) { sr += d[i]; sg += d[i + 1]; sb += d[i + 2]; }
    return toHex(sr / k, sg / k, sb / k);
  }

  function pickAt(pt) {
    var d = toDoc(pt);
    if (!inDoc(d)) return;
    var hex = sampleColor(d.x, d.y, els.pickSource.value, +els.pickSize.value);
    if (!hex) return;
    els.brushColor.value = hex;
    els.pickSwatch.style.background = hex;
    els.pickHex.textContent = hex;
  }

  function startPick(e, p, base) {
    var g = Object.assign(base, { type: 'pick' });
    pickAt(p);
    g.onMove = function (pt) { pickAt(pt); };
    g.commit = function () {};
    g.cancel = function () {};
    return g;
  }

  // ---------- Säädöt ja suotimet ----------
  //
  // Säätö kohdistuu aktiiviseen rasteritasoon (tai valintaan). Alkuperäistäkin saa säätää: silloin ääriviivat
  // lasketaan uudelleen ja tekoälyn analyysi tehdään uudestaan. Esikatselu lasketaan kevennetystä kopiosta.

  var adj = null;   // { op, layer, scale, sw, sh, baseCanvas, baseData, preview, params, hist, dirty }
  var ADJ_TITLES = { bc: 'Kirkkaus / kontrasti', hs: 'Sävy / kylläisyys', levels: 'Levels', curves: 'Käyrät', blur: 'Sumennus', sharpen: 'Terävöinti' };
  var ADJ_PREVIEW_SIDE = 1000;
  var CHANNELS = ['rgb', 'r', 'g', 'b'];

  function settle() {
    if (penSession) finishPen();
    if (tf) endTransform(true);
    if (adj) endAdjust(false);
  }

  function defaultLevels() { return { ib: 0, g: 1, iw: 255, ob: 0, ow: 255 }; }
  function defaultCurve() { return [{ x: 0, y: 0 }, { x: 255, y: 255 }]; }

  function defaultParams(op) {
    if (op === 'bc') return { brightness: 0, contrast: 0 };
    if (op === 'hs') return { hue: 0, sat: 0, light: 0 };
    if (op === 'levels') return { channel: 'rgb', rgb: defaultLevels(), r: defaultLevels(), g: defaultLevels(), b: defaultLevels() };
    if (op === 'curves') return { channel: 'rgb', rgb: defaultCurve(), r: defaultCurve(), g: defaultCurve(), b: defaultCurve() };
    if (op === 'blur') return { radius: 4 };
    if (op === 'sharpen') return { amount: 100, radius: 1.5, threshold: 0 };
    return {};
  }

  function isLevelsIdentity(l) { return l.ib === 0 && l.g === 1 && l.iw === 255 && l.ob === 0 && l.ow === 255; }
  function isCurveIdentity(c) { return c.length === 2 && c[0].y === 0 && c[1].y === 255; }

  function paramsAreIdentity(op, p) {
    if (op === 'bc') return !p.brightness && !p.contrast;
    if (op === 'hs') return !p.hue && !p.sat && !p.light;
    if (op === 'levels') return CHANNELS.every(function (c) { return isLevelsIdentity(p[c]); });
    if (op === 'curves') return CHANNELS.every(function (c) { return isCurveIdentity(p[c]); });
    if (op === 'sharpen') return !p.amount;
    return false;
  }

  function channelLUTs(p, make) {
    var master = make(p.rgb);
    return ['r', 'g', 'b'].map(function (c) { return LineoFilters.composeLUT(make(p[c]), master); });
  }

  // Suorittaa säädön RGBA-datalle. scale = esikatselun pienennys (pikselimääräiset parametrit skaalataan).
  function runAdjust(op, p, data, w, h, scale) {
    if (op === 'bc') LineoFilters.brightnessContrast(data, p.brightness, p.contrast);
    else if (op === 'hs') LineoFilters.hueSaturation(data, p.hue, p.sat, p.light);
    else if (op === 'gray') LineoFilters.grayscale(data);
    else if (op === 'invert') LineoFilters.invert(data);
    else if (op === 'blur') LineoFilters.blur(data, w, h, p.radius * scale);
    else if (op === 'sharpen') LineoFilters.sharpen(data, w, h, p.amount / 100, p.radius * scale, p.threshold);
    else if (op === 'levels' || op === 'curves') {
      var l = channelLUTs(p, op === 'levels'
        ? function (s) { return LineoFilters.levelsLUT(s.ib, s.g, s.iw, s.ob, s.ow); }
        : function (pts) { return LineoFilters.curveLUT(pts); });
      LineoFilters.applyLUT(data, l[0], l[1], l[2]);
    }
  }

  // Tason kelpoisuus säädölle. Alkuperäinen kelpaa (muut suojaukset kuten piirrossa).
  function adjustTarget() {
    var L = activeLayer();
    if (!L) return null;
    if (L.kind !== 'raster') { notice('Säädöt toimivat pikselitasoilla. Vektorikohteen värin ja paksuuden säädät Vektoriviiva-osiosta.'); return null; }
    if (L.id === 'original') {
      if (!L.visible) { notice('Taso on piilotettu.'); return null; }
      return L;
    }
    return paintTarget(true);
  }

  function originalChanged() {
    aiReset();
    doc.key = 'img' + Date.now() + Math.random();
    previewCanvas = null;
    prepareEngine();
    if (!getLayer('contour').edited) requestContours(false);
    scheduleThumbs();
    updateContextPanel();
  }

  // Lopullinen säätö täydessä tarkkuudessa (valinta rajaa vaikutuksen).
  function applyFull(op, params, L) {
    var W = L.canvas.width, H = L.canvas.height;
    var box = sel ? clampBox(sel.x, sel.y, sel.w, sel.h) : { x: 0, y: 0, w: W, h: H };
    if (!box) { notice('Valinta on kuvan ulkopuolella.'); return; }
    var pad = op === 'blur' || op === 'sharpen' ? Math.ceil(params.radius * 3) + 2 : 0;
    var pb = clampBox(box.x - pad, box.y - pad, box.w + pad * 2, box.h + pad * 2);
    var isOrig = L.id === 'original', s = sel;
    // Alkuperäisen säädöt muistetaan, jotta ne voi toistaa täysikokoiselle kuvalle viennissä.
    var rec = isOrig && doc.src ? { op: op, params: JSON.parse(JSON.stringify(params)), sel: s, geom: { ox: doc.src.ox, oy: doc.src.oy } } : null;
    editPixels(L, pb, function (ctx) {
      var id = ctx.getImageData(pb.x, pb.y, pb.w, pb.h);
      runAdjust(op, params, id.data, pb.w, pb.h, 1);
      if (!s) { ctx.putImageData(id, pb.x, pb.y); return; }
      var proc = makeCanvas(pb.w, pb.h), pc = proc.getContext('2d');
      pc.putImageData(id, 0, 0);
      pc.globalCompositeOperation = 'destination-in';
      pc.drawImage(selMaskCanvas(s), s.x - pb.x, s.y - pb.y);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.drawImage(selMaskCanvas(s), s.x, s.y);
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(proc, pb.x, pb.y);
      ctx.restore();
    }, isOrig ? {
      undo: function () { originalChanged(); if (rec) { var i = doc.src.ops.indexOf(rec); if (i >= 0) doc.src.ops.splice(i, 1); } },
      redo: function () { originalChanged(); if (rec && doc.src.ops.indexOf(rec) < 0) doc.src.ops.push(rec); }
    } : null);
    if (rec) doc.src.ops.push(rec);
    if (isOrig) originalChanged();
  }

  // Säädöt ilman asetuksia (mustavalkoinen, käänteiset värit) tehdään heti.
  function runDirect(op) {
    settle();
    var L = adjustTarget();
    if (L) applyFull(op, {}, L);
  }

  // Puhelimessa paneeli voi olla piilossa tai vierittynyt: nostetaan uusi tila (säätö, muunnos, rajaus) näkyviin.
  function revealPanel() {
    document.body.classList.remove('panel-collapsed');
    els.btnPanel.setAttribute('aria-expanded', 'true');
    var sp = $('side-panel');
    if (sp) sp.scrollTop = 0;
  }

  function startAdjust(op) {
    if (!doc) return;
    if (op === 'gray' || op === 'invert') { runDirect(op); return; }
    settle();
    if (tool === 'crop') leaveModal();
    if (adj) endAdjust(false);
    var L = adjustTarget();
    if (!L) return;
    var W = L.canvas.width, H = L.canvas.height, scale = Math.min(1, ADJ_PREVIEW_SIDE / Math.max(W, H));
    var sw = Math.max(1, Math.round(W * scale)), sh = Math.max(1, Math.round(H * scale));
    var base = makeCanvas(sw, sh), bx = base.getContext('2d', { willReadFrequently: true });
    bx.imageSmoothingQuality = 'high';
    bx.drawImage(L.canvas, 0, 0, sw, sh);
    var data = bx.getImageData(0, 0, sw, sh);
    adj = { op: op, layer: L, scale: sw / W, sw: sw, sh: sh, baseCanvas: base, baseData: data, preview: makeCanvas(sw, sh),
      params: defaultParams(op), hist: LineoFilters.histogram(data.data), dirty: false };
    els.adjustTitle.textContent = ADJ_TITLES[op];
    Array.prototype.forEach.call(els.adjustSection.querySelectorAll('.adj-block'), function (b) { b.hidden = b.id !== 'adj-' + op; });
    syncAdjustUI();
    updateContextPanel();
    revealPanel();
    adjRender();
  }

  function endAdjust(commit) {
    if (!adj) return;
    var a = adj;
    adj = null;
    updateContextPanel();
    if (commit && !paramsAreIdentity(a.op, a.params)) applyFull(a.op, a.params, a.layer);
    render();
  }

  function adjSchedule() {
    if (!adj || adj.dirty) return;
    adj.dirty = true;
    requestAnimationFrame(function () { if (adj && adj.dirty) adjRender(); });
  }

  function adjRender() {
    if (!adj) return;
    adj.dirty = false;
    var a = adj, out = a.preview.getContext('2d');
    var img = new ImageData(new Uint8ClampedArray(a.baseData.data), a.sw, a.sh);
    runAdjust(a.op, a.params, img.data, a.sw, a.sh, a.scale);
    out.globalCompositeOperation = 'source-over';
    out.clearRect(0, 0, a.sw, a.sh);
    if (!sel) {
      out.putImageData(img, 0, 0);
    } else {
      var proc = makeCanvas(a.sw, a.sh), pc = proc.getContext('2d'), mask = makeCanvas(a.sw, a.sh);
      pc.putImageData(img, 0, 0);
      mask.getContext('2d').drawImage(selMaskCanvas(sel), sel.x * a.scale, sel.y * a.scale, sel.w * a.scale, sel.h * a.scale);
      pc.globalCompositeOperation = 'destination-in';
      pc.drawImage(mask, 0, 0);
      out.drawImage(a.baseCanvas, 0, 0);
      out.globalCompositeOperation = 'destination-out';
      out.drawImage(mask, 0, 0);
      out.globalCompositeOperation = 'lighter';
      out.drawImage(proc, 0, 0);
      out.globalCompositeOperation = 'source-over';
    }
    if (a.op === 'levels') drawHistogram();
    if (a.op === 'curves') drawCurve();
    render();
  }

  // Liukusäätimet <-> parametrit
  var ADJ_SLIDERS = {
    bc: [['adj-brightness', 'brightness', ''], ['adj-contrast', 'contrast', '']],
    hs: [['adj-hue', 'hue', '°'], ['adj-sat', 'sat', ''], ['adj-light', 'light', '']],
    blur: [['adj-blur-radius', 'radius', ' px']],
    sharpen: [['adj-sharp-amount', 'amount', ' %'], ['adj-sharp-radius', 'radius', ' px'], ['adj-sharp-threshold', 'threshold', '']]
  };
  var LV_SLIDERS = [['lv-inblack', 'ib'], ['lv-gamma', 'g'], ['lv-inwhite', 'iw'], ['lv-outblack', 'ob'], ['lv-outwhite', 'ow']];

  function fmtNum(v) { return String(v).replace('.', ','); }

  function syncAdjustUI() {
    if (!adj) return;
    var p = adj.params;
    (ADJ_SLIDERS[adj.op] || []).forEach(function (s) {
      var input = $(s[0]);
      input.value = p[s[1]];
      $(s[0] + '-out').textContent = fmtNum(p[s[1]]) + s[2];
      updateRangeFill(input);
    });
    if (adj.op === 'levels') {
      els.lvChannel.value = p.channel;
      var l = p[p.channel];
      LV_SLIDERS.forEach(function (s) {
        var input = $(s[0]), v = s[1] === 'g' ? Math.round(l.g * 100) : l[s[1]];
        input.value = v;
        $(s[0] + '-out').textContent = s[1] === 'g' ? (v / 100).toFixed(2).replace('.', ',') : v;
        updateRangeFill(input);
      });
    }
    if (adj.op === 'curves') els.cvChannel.value = p.channel;
  }

  function readAdjustUI() {
    if (!adj) return;
    var p = adj.params;
    (ADJ_SLIDERS[adj.op] || []).forEach(function (s) {
      p[s[1]] = +$(s[0]).value;
      $(s[0] + '-out').textContent = fmtNum(p[s[1]]) + s[2];
      updateRangeFill($(s[0]));
    });
    if (adj.op === 'levels') {
      var l = p[p.channel];
      LV_SLIDERS.forEach(function (s) { l[s[1]] = s[1] === 'g' ? +$(s[0]).value / 100 : +$(s[0]).value; });
      // Mustan ja valkoisen väliin jää aina tilaa
      if (l.ib >= l.iw) { if (document.activeElement === els.lvInWhite) l.iw = Math.min(255, l.ib + 1); else l.ib = Math.max(0, l.iw - 1); }
      syncAdjustUI();
    }
  }

  function drawHistogram() {
    var c = els.lvHist, x = c.getContext('2d'), a = adj, p = a.params, ch = p.channel, l = p[ch];
    var h = a.hist[ch], max = 1, i;
    for (i = 0; i < 256; i++) max = Math.max(max, h[i]);
    x.clearRect(0, 0, c.width, c.height);
    x.fillStyle = ch === 'r' ? '#d9534f' : ch === 'g' ? '#4cc38a' : ch === 'b' ? '#5b9bff' : '#9aa0a6';
    for (i = 0; i < 256; i++) {
      var bh = Math.sqrt(h[i] / max) * (c.height - 12);
      x.fillRect(i, c.height - 12 - bh, 1, bh);
    }
    function tri(pos, color) {
      x.fillStyle = color;
      x.beginPath(); x.moveTo(pos, c.height - 10); x.lineTo(pos - 5, c.height); x.lineTo(pos + 5, c.height); x.closePath(); x.fill();
    }
    tri(l.ib, '#000'); tri(l.iw, '#fff');
    var mid = l.ib + (l.iw - l.ib) * Math.pow(0.5, 1 / l.g);
    tri(mid, '#888');
  }

  // Käyräeditori
  var cvDrag = null;

  function drawCurve() {
    var c = els.cvCanvas, x = c.getContext('2d'), a = adj, p = a.params, pts = p[p.channel], i;
    x.clearRect(0, 0, 256, 256);
    var h = a.hist[p.channel], max = 1;
    for (i = 0; i < 256; i++) max = Math.max(max, h[i]);
    x.fillStyle = 'rgba(150,155,165,.25)';
    for (i = 0; i < 256; i++) { var bh = Math.sqrt(h[i] / max) * 256; x.fillRect(i, 256 - bh, 1, bh); }
    x.strokeStyle = 'rgba(255,255,255,.12)'; x.lineWidth = 1;
    for (i = 1; i < 4; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, 256); x.moveTo(0, i * 64); x.lineTo(256, i * 64); x.stroke(); }
    var lut = LineoFilters.curveLUT(pts);
    x.strokeStyle = p.channel === 'r' ? '#ff6b6b' : p.channel === 'g' ? '#4cc38a' : p.channel === 'b' ? '#5b9bff' : '#ffffff';
    x.lineWidth = 2;
    x.beginPath();
    for (i = 0; i < 256; i++) { var yy = 255 - lut[i]; if (i) x.lineTo(i, yy); else x.moveTo(i, yy); }
    x.stroke();
    pts.forEach(function (q) {
      x.fillStyle = '#fff'; x.strokeStyle = '#ff8a3d'; x.lineWidth = 2;
      x.fillRect(q.x - 4, 255 - q.y - 4, 8, 8); x.strokeRect(q.x - 4, 255 - q.y - 4, 8, 8);
    });
  }

  function cvPoint(e) {
    var r = els.cvCanvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * 256, y: 255 - (e.clientY - r.top) / r.height * 256, k: 256 / r.width };
  }

  function cvNearest(pts, q, radius) {
    var best = -1, bd = radius;
    pts.forEach(function (p, i) { var d = Math.hypot(p.x - q.x, 255 - p.y - (255 - q.y)); if (d <= bd) { bd = d; best = i; } });
    return best;
  }

  function startCurves() {
    els.cvCanvas.addEventListener('pointerdown', function (e) {
      if (!adj || adj.op !== 'curves') return;
      e.preventDefault();
      try { els.cvCanvas.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
      var q = cvPoint(e), pts = adj.params[adj.params.channel], idx = cvNearest(pts, q, 14 * q.k);
      if (idx < 0) {
        var x = Math.max(1, Math.min(254, Math.round(q.x)));
        var at = 0;
        while (at < pts.length && pts[at].x < x) at++;
        if (at < pts.length && pts[at].x === x) return;
        pts.splice(at, 0, { x: x, y: Math.max(0, Math.min(255, Math.round(q.y))) });
        idx = at;
      }
      cvDrag = idx;
      adjSchedule();
    });
    els.cvCanvas.addEventListener('pointermove', function (e) {
      if (cvDrag === null || !adj) return;
      var q = cvPoint(e), pts = adj.params[adj.params.channel], p = pts[cvDrag];
      p.y = Math.max(0, Math.min(255, Math.round(q.y)));
      if (cvDrag > 0 && cvDrag < pts.length - 1) {
        p.x = Math.max(pts[cvDrag - 1].x + 1, Math.min(pts[cvDrag + 1].x - 1, Math.round(q.x)));
      }
      adjSchedule();
    });
    function end() { cvDrag = null; }
    els.cvCanvas.addEventListener('pointerup', end);
    els.cvCanvas.addEventListener('pointercancel', end);
    els.cvCanvas.addEventListener('dblclick', function (e) {
      if (!adj || adj.op !== 'curves') return;
      var q = cvPoint(e), pts = adj.params[adj.params.channel], idx = cvNearest(pts, q, 14 * q.k);
      if (idx > 0 && idx < pts.length - 1) { pts.splice(idx, 1); adjSchedule(); }
    });
  }

  // ---------- Projekti: tallennus ja avaus ----------
  //
  // Projektitiedosto (.lineo) sisältää kaikki tasot (pikselit PNG:nä, vektorit ja asetukset JSON:na) sekä
  // isoilla kuvilla alkuperäisen tiedoston, jotta vienti alkuperäisessä koossa onnistuu myös uudelleen avattuna.

  function updateFileLabel() {
    els.fileName.textContent = doc ? (doc.label || '') : '';
    els.fileName.classList.toggle('is-dirty', !!(doc && doc.dirty));
  }
  function markDirty() { if (doc && !doc.dirty) { doc.dirty = true; updateFileLabel(); } }
  function markClean() { if (doc) { doc.dirty = false; updateFileLabel(); } }

  function confirmDiscard() {
    return !doc || !doc.dirty || window.confirm('Tallentamattomat muutokset menetetään. Jatketaanko?');
  }

  function canvasBlob(c, type, quality) {
    return new Promise(function (resolve, reject) {
      c.toBlob(function (b) { if (b) resolve(b); else reject(new Error('Kuvan muunnos tiedostoksi epäonnistui (liian suuri?)')); }, type, quality);
    });
  }

  function downloadBlob(blob, name) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 10000);
  }

  async function buildProjectBlob() {
    settle();
    var blobs = [], layers = [], i;
    for (i = 0; i < doc.layers.length; i++) {
      var L = doc.layers[i];
      var e = { id: L.id, kind: L.kind, name: L.name, visible: L.visible, opacity: L.opacity, locked: !!L.locked };
      if (L.kind === 'raster') {
        e.edited = !!L.edited;
        blobs.push({ name: 'layer:' + L.id, type: 'image/png', data: await canvasBlob(L.canvas, 'image/png') });
      } else {
        e.paths = L.paths; e.loops = L.loops; e.detail = L.detail; e.stroke = L.stroke; e.styleName = L.styleName || null;
      }
      layers.push(e);
    }
    var src = null;
    if (doc.src) {
      var ops = [];
      for (i = 0; i < doc.src.ops.length; i++) {
        var r = doc.src.ops[i], o = { op: r.op, params: r.params, geom: r.geom, sel: null };
        if (r.sel) {
          o.sel = { x: r.sel.x, y: r.sel.y, w: r.sel.w, h: r.sel.h };
          blobs.push({ name: 'opsel:' + i, type: 'image/png', data: await canvasBlob(selMaskCanvas(r.sel), 'image/png') });
        }
        ops.push(o);
      }
      src = { kx: doc.src.kx, ky: doc.src.ky, fullW: doc.src.fullW, fullH: doc.src.fullH, ox: doc.src.ox, oy: doc.src.oy, bg: doc.src.bg, ops: ops };
      blobs.push({ name: 'source', type: doc.src.file.type || 'application/octet-stream', data: doc.src.file });
    }
    var header = {
      app: 'Lineo', version: 1, name: baseName, width: doc.width, height: doc.height, activeId: doc.activeId,
      vectorCount: doc.vectorCount, rasterCount: doc.rasterCount, layers: layers, src: src, palette: palette,
      settings: {
        detail: +els.detail.value, thickness: +els.thickness.value, noise: +els.noise.value, lineColor: els.lineColor.value,
        origOpacity: +els.origOpacity.value, vecWidth: +els.vecWidth.value, vecColor: els.vecColor.value, contourStyle: contourStyle,
        contourOn: !!doc.contourOn
      }
    };
    return LineoFiles.packProject(header, blobs);
  }

  async function saveProject(asNew) {
    if (!doc) return;
    settle();
    var name = baseName + '.lineo', handle = doc.fileHandle || null;
    var blob = null;
    try {
      if (typeof window.showSaveFilePicker === 'function' && (asNew || !handle)) {
        handle = await window.showSaveFilePicker({
          suggestedName: name,
          types: [{ description: 'Lineo-projekti', accept: { 'application/octet-stream': ['.lineo'] } }]
        });
      }
      blob = await buildProjectBlob();
      if (handle) {
        var w = await handle.createWritable();
        await w.write(blob);
        await w.close();
        doc.fileHandle = handle;
        doc.label = handle.name;
        baseName = handle.name.replace(/\.[^.]+$/, '') || baseName;
        markClean();
        toast('Tallennettu: ' + handle.name);
        return;
      }
      downloadBlob(blob, name);
      markClean();
      toast('Projekti ladattiin: ' + name + '. Avaa se myöhemmin Tiedosto-valikon Avaa-toiminnolla.');
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      console.warn('Tallennus epäonnistui', err);
      if (blob) {
        // Suora tallennus ei onnistunut (esim. lupa): ladataan tiedosto tavallisesti.
        downloadBlob(blob, name);
        markClean();
        toast('Projekti ladattiin: ' + name);
      } else {
        toast('Tallennus epäonnistui: ' + (err && err.message || err), true);
      }
    }
  }

  async function openProjectFile(file) {
    if (!confirmDiscard()) return;
    var pk;
    try { pk = LineoFiles.unpackProject(await file.arrayBuffer()); }
    catch (err) { toast('Projektia ei voitu avata: ' + err.message, true); return; }
    var h = pk.header;
    var layers = [];
    try {
      var W = h.width, H = h.height;
      for (var i = 0; i < h.layers.length; i++) {
        var e = h.layers[i];
        var L = { id: e.id, kind: e.kind, name: e.name, visible: e.visible !== false, opacity: e.opacity == null ? 1 : e.opacity, locked: !!e.locked };
        if (e.kind === 'raster') {
          var c = makeCanvas(W, H), x = c.getContext('2d', e.id === 'original' ? { willReadFrequently: true } : undefined);
          var bmp = await createImageBitmap(pk.blob('layer:' + e.id));
          x.drawImage(bmp, 0, 0);
          if (bmp.close) bmp.close();
          L.canvas = c;
          if (e.id === 'contour') L.edited = !!e.edited;
        } else {
          L.paths = e.paths; L.loops = e.loops || null; L.detail = e.detail; L.stroke = e.stroke; L.styleName = e.styleName || null;
        }
        layers.push(L);
      }
      if (!layers.some(function (l) { return l.id === 'original'; }) || !layers.some(function (l) { return l.id === 'contour'; })) {
        throw new Error('tasot puuttuvat');
      }
      var src = null;
      if (h.src && pk.has('source')) {
        src = { file: pk.blob('source'), kx: h.src.kx, ky: h.src.ky, fullW: h.src.fullW, fullH: h.src.fullH, ox: h.src.ox || 0, oy: h.src.oy || 0, bg: h.src.bg || 'transparent', ops: [] };
        for (var j = 0; j < h.src.ops.length; j++) {
          var o = h.src.ops[j], rec = { op: o.op, params: o.params, geom: o.geom, sel: null };
          if (o.sel) {
            var mc = makeCanvas(o.sel.w, o.sel.h), mx = mc.getContext('2d', { willReadFrequently: true });
            var mb = await createImageBitmap(pk.blob('opsel:' + j));
            mx.drawImage(mb, 0, 0);
            if (mb.close) mb.close();
            var md = mx.getImageData(0, 0, o.sel.w, o.sel.h).data, a = new Uint8Array(o.sel.w * o.sel.h);
            for (var q = 0; q < a.length; q++) a[q] = md[q * 4 + 3];
            rec.sel = { x: o.sel.x, y: o.sel.y, w: o.sel.w, h: o.sel.h, a: a };
          }
          src.ops.push(rec);
        }
      }
    } catch (err) {
      console.warn(err);
      toast('Projektitiedosto on vioittunut: ' + (err && err.message || err), true);
      return;
    }

    aiReset();
    tf = null; crop = null; shapePreview = null; sel = null; adj = null; penSession = null;
    var st = h.settings || {};
    contourStyle = st.contourStyle || null;
    doc = {
      key: 'img' + Date.now() + Math.random(), width: h.width, height: h.height,
      activeId: layers.some(function (l) { return l.id === h.activeId; }) ? h.activeId : 'contour',
      vectorCount: h.vectorCount || 0, rasterCount: h.rasterCount || 0, layers: layers, src: src,
      dirty: false, label: file.name, fileHandle: null,
      contourOn: st.contourOn !== false   // vanhoissa projekteissa ääriviivat ovat aina päällä
    };
    baseName = h.name || file.name.replace(/\.[^.]+$/, '') || 'kuva';
    resetPaintDefaults();
    if (st.detail != null) els.detail.value = st.detail;
    if (st.thickness != null) els.thickness.value = st.thickness;
    if (st.noise != null) els.noise.value = st.noise;
    if (isHex(st.lineColor)) els.lineColor.value = st.lineColor;
    if (st.origOpacity != null) els.origOpacity.value = st.origOpacity;
    if (st.vecWidth != null) els.vecWidth.value = st.vecWidth;
    if (isHex(st.vecColor)) els.vecColor.value = st.vecColor;
    updateOutputs();
    if (Array.isArray(h.palette)) {
      h.palette.forEach(function (c) { if (isHex(c) && palette.indexOf(c) === -1) palette.push(c); });
      palette = palette.slice(0, 48);
      savePalette();
      renderPalettes();
    }
    showDocument(file.name, doc.width + ' × ' + doc.height + ' px' + (src ? ' (alkuperäinen ' + src.fullW + ' × ' + src.fullH + ' px tallessa)' : ''));
    prepareEngine();
    previewCanvas = null;
    toast('Projekti avattu: ' + file.name);
  }

  // ---------- Vienti ----------

  var EXPORT_KEY = 'lineo-export';
  var MAX_EXPORT_PIXELS = IS_TOUCH ? 25e6 : 64e6;
  var FULL_CONTOUR_PIXELS = IS_TOUCH ? 12e6 : 36e6;

  function loadExportSettings() {
    try { var v = JSON.parse(localStorage.getItem(EXPORT_KEY)); if (v && typeof v === 'object') return v; } catch (err) { /* ei tallennusta */ }
    return {};
  }
  function saveExportSettings(o) {
    try { localStorage.setItem(EXPORT_KEY, JSON.stringify({ content: o.content, bg: o.bgChoice, bgColor: o.bgColor, size: o.size, format: o.format, quality: o.quality, cutCrop: o.cutCrop, cutLines: o.cutLines })); } catch (err) { /* ei tallennusta */ }
  }

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // Viennin mitat: size = orig (alkuperäinen koko, jos tiedossa) | work | half
  function exportDims(size) {
    var W = doc.width, H = doc.height, useOrig = size === 'orig' && !!doc.src, ow, oh;
    if (useOrig) { ow = Math.round(W * doc.src.kx); oh = Math.round(H * doc.src.ky); }
    else { var f = size === 'half' ? 0.5 : 1; ow = Math.max(1, Math.round(W * f)); oh = Math.max(1, Math.round(H * f)); }
    return { useOrig: useOrig, ow: ow, oh: oh, sx: ow / W, sy: oh / H };
  }

  function exportCutLayers(o) {
    if (o.cutSource === 'selection') return [];
    return doc.layers.filter(function (L) { return L.kind === 'vector' && (o.cutSource === 'vectors' ? L.visible : L.id === o.cutSource); });
  }

  function fillPathsCanvas(ctx, layers, sx, sy) {
    ctx.save();
    ctx.scale(sx, sy);
    ctx.fillStyle = '#000';
    layers.forEach(function (L) { ctx.fill(vectorPath2D(L), 'evenodd'); });
    ctx.restore();
  }

  // Alkuperäinen kuva täydessä koossa: alkuperäinen tiedosto, sama rajaus ja samat säädöt kuin työkopiossa.
  async function renderOriginalFull(ex) {
    var S = doc.src, oc = makeCanvas(ex.ow, ex.oh), x = oc.getContext('2d', { willReadFrequently: true });
    if (S.bg !== 'transparent') {
      x.fillStyle = S.bg === 'black' ? '#000' : '#fff';
      x.fillRect(0, 0, ex.ow, ex.oh);
    }
    var bmp = await createImageBitmap(S.file);
    x.drawImage(bmp, Math.round(-S.ox * S.kx), Math.round(-S.oy * S.ky));
    if (bmp.close) bmp.close();
    for (var i = 0; i < S.ops.length; i++) {
      var rec = S.ops[i];
      var id = x.getImageData(0, 0, ex.ow, ex.oh);
      runAdjust(rec.op, rec.params, id.data, ex.ow, ex.oh, S.kx);
      if (!rec.sel) { x.putImageData(id, 0, 0); continue; }
      var proc = makeCanvas(ex.ow, ex.oh), pc = proc.getContext('2d'), mask = makeCanvas(ex.ow, ex.oh);
      pc.putImageData(id, 0, 0);
      mask.getContext('2d').drawImage(selMaskCanvas(rec.sel), (rec.sel.x + rec.geom.ox - S.ox) * S.kx, (rec.sel.y + rec.geom.oy - S.oy) * S.ky, rec.sel.w * S.kx, rec.sel.h * S.ky);
      pc.globalCompositeOperation = 'destination-in';
      pc.drawImage(mask, 0, 0);
      x.save();
      x.globalCompositeOperation = 'destination-out';
      x.drawImage(mask, 0, 0);
      x.globalCompositeOperation = 'lighter';
      x.drawImage(proc, 0, 0);
      x.restore();
      await sleep(0);
    }
    return oc;
  }

  // Automaattiset ääriviivat täydessä koossa (jos tasoa ei ole muokattu käsin), muuten työkopio skaalattuna.
  async function renderContourFull(ex, origFull) {
    var id = origFull.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, ex.ow, ex.oh);
    await sleep(30);
    var core = LineoEdgeCore();
    core.setImage(id.data, ex.ow, ex.oh);
    var p = readParams();
    p.thickness = p.thickness * ex.sx;
    p.scale = Math.max(1, Math.max(ex.ow, ex.oh) / 1600);
    var r = core.run(p);
    if (contourStyle === 'pencil') LineoFilters.pencilGrain(r.rgba, ex.ow, ex.oh);
    var c = makeCanvas(ex.ow, ex.oh);
    c.getContext('2d').putImageData(new ImageData(r.rgba, ex.ow, ex.oh), 0, 0);
    return c;
  }

  function strokeScaled(ctx, L, ex, alpha) {
    ctx.save();
    ctx.scale(ex.sx, ex.sy);
    ctx.globalAlpha = alpha;
    strokeVector(ctx, L.paths, vectorPath2D(L), L.stroke);
    ctx.restore();
  }

  // o: { content: both | lines | cutout, size, bg ('transparent' | '#rrggbb'), cutSource, cutCrop, cutLines, format }
  async function renderExportCanvas(o) {
    var ex = exportDims(o.size);
    if (ex.ow * ex.oh > MAX_EXPORT_PIXELS) throw new Error('Kuva olisi liian suuri (' + (ex.ow * ex.oh / 1e6).toFixed(0) + ' megapikseliä). Valitse pienempi koko.');
    var out = makeCanvas(ex.ow, ex.oh), x = out.getContext('2d');
    var needOrig = o.content === 'both' || o.content === 'cutout';
    var contour = getLayer('contour');
    var wantContour = o.content !== 'cutout' && doc.contourOn && contour.visible && contour.opacity > 0;
    var fullContour = wantContour && ex.useOrig && !contour.edited && ex.ow * ex.oh <= FULL_CONTOUR_PIXELS;
    var origCanvas = null;
    if (ex.useOrig && (needOrig || fullContour)) origCanvas = await renderOriginalFull(ex);
    else if (needOrig) {
      origCanvas = makeCanvas(ex.ow, ex.oh);
      var ox = origCanvas.getContext('2d');
      ox.imageSmoothingQuality = 'high';
      ox.drawImage(getLayer('original').canvas, 0, 0, ex.ow, ex.oh);
    }

    if (o.content === 'cutout') {
      var cutLayers = exportCutLayers(o), M = makeCanvas(ex.ow, ex.oh), mx = M.getContext('2d'), bbox;
      if (o.cutSource === 'selection') {
        if (!sel) throw new Error('Ei valintaa. Tee valinta tai valitse kohteeksi vektorikohde.');
        mx.drawImage(selMaskCanvas(sel), sel.x * ex.sx, sel.y * ex.sy, sel.w * ex.sx, sel.h * ex.sy);
        bbox = { x: sel.x * ex.sx, y: sel.y * ex.sy, w: sel.w * ex.sx, h: sel.h * ex.sy };
      } else {
        if (!cutLayers.length) throw new Error('Kohdetta ei löytynyt.');
        fillPathsCanvas(mx, cutLayers, ex.sx, ex.sy);
        var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        cutLayers.forEach(function (L) {
          var b = vectorBounds(L);
          if (!b) return;
          var pad = L.stroke.width / 2 + 2;
          x0 = Math.min(x0, (b.x - pad) * ex.sx); y0 = Math.min(y0, (b.y - pad) * ex.sy);
          x1 = Math.max(x1, (b.x + b.w + pad) * ex.sx); y1 = Math.max(y1, (b.y + b.h + pad) * ex.sy);
        });
        bbox = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
      }
      x.drawImage(origCanvas, 0, 0);
      x.globalCompositeOperation = 'destination-in';
      x.drawImage(M, 0, 0);
      x.globalCompositeOperation = 'source-over';
      if (o.cutLines) cutLayers.forEach(function (L) { strokeScaled(x, L, ex, 1); });
      if (o.cutCrop) {
        var bx = Math.max(0, Math.floor(bbox.x)), by = Math.max(0, Math.floor(bbox.y));
        var bw = Math.min(ex.ow, Math.ceil(bbox.x + bbox.w)) - bx, bh = Math.min(ex.oh, Math.ceil(bbox.y + bbox.h)) - by;
        if (bw < 1 || bh < 1) throw new Error('Kohde on kuvan ulkopuolella.');
        var C = makeCanvas(bw, bh);
        C.getContext('2d').drawImage(out, -bx, -by);
        out = C;
      }
      return finishExportCanvas(out, o);
    }

    var contourCanvas = null;
    if (wantContour) contourCanvas = fullContour ? await renderContourFull(ex, origCanvas) : contour.canvas;
    if (o.content === 'lines' && o.bg !== 'transparent') { x.fillStyle = o.bg; x.fillRect(0, 0, ex.ow, ex.oh); }
    doc.layers.forEach(function (L) {
      if (L.id === 'original') {
        if (o.content === 'both') x.drawImage(origCanvas, 0, 0);   // alkuperäinen aina täydellä näkyvyydellä
        return;
      }
      if (!L.visible || L.opacity <= 0) return;
      if (L.id === 'contour') {
        if (!contourCanvas) return;   // ääriviivoja ei ole luotu
        x.globalAlpha = L.opacity;
        x.drawImage(contourCanvas, 0, 0, ex.ow, ex.oh);
        x.globalAlpha = 1;
      } else if (L.kind === 'vector') {
        strokeScaled(x, L, ex, L.opacity);
      } else {
        x.globalAlpha = L.opacity;
        x.drawImage(L.canvas, 0, 0, ex.ow, ex.oh);
        x.globalAlpha = 1;
      }
    });
    return finishExportCanvas(out, o);
  }

  // Tausta lisätään viimeiseksi alle (leikkaus ja JPG). Pelkissä ääriviivoissa tausta piirrettiin jo aiemmin.
  function finishExportCanvas(c, o) {
    var bg = o.content === 'both' ? 'transparent' : o.bg;
    var already = o.content === 'lines' && bg !== 'transparent';
    if (o.format === 'jpg' && bg === 'transparent') bg = '#ffffff';   // JPG ei tue läpinäkyvyyttä
    if (bg === 'transparent' || already) return c;
    var f = makeCanvas(c.width, c.height), x = f.getContext('2d');
    x.fillStyle = bg;
    x.fillRect(0, 0, f.width, f.height);
    x.drawImage(c, 0, 0);
    return f;
  }

  function exportSvgBlob(o) {
    var ex = exportDims(o.size);
    var layers = doc.layers.filter(function (L) { return L.kind === 'vector' && L.visible && L.opacity > 0; })
      .map(function (L) { return { paths: L.paths, stroke: L.stroke, opacity: L.opacity }; });
    if (!layers.length) throw new Error('Ei vektoriääriviivoja. SVG sisältää vain tekoälyllä tai käsin tehdyt vektorikohteet (ei automaattisia ääriviivoja).');
    return new Blob([LineoFiles.buildSvg({ width: doc.width, height: doc.height, outWidth: ex.ow, outHeight: ex.oh, bg: o.bg, layers: layers })], { type: 'image/svg+xml' });
  }

  function exportFileName(o) {
    var part = o.format === 'svg' ? '-aariviivat' : o.content === 'both' ? '-aariviivoilla' : o.content === 'lines' ? '-aariviivat' : '-kohde';
    return baseName + part + '.' + (o.format === 'jpg' ? 'jpg' : o.format);
  }

  function waitContourReady() {
    return new Promise(function (resolve) {
      var t0 = Date.now();
      if (doc.contourIsPreview) requestContours(false);
      (function poll() {
        var ready = !doc.contourIsPreview && els.busy.hidden;
        if (ready || Date.now() - t0 > 20000) resolve(); else setTimeout(poll, 100);
      })();
    });
  }

  function readExportUI() {
    var choice = els.exBg.value, bg = choice === 'white' ? '#ffffff' : choice === 'black' ? '#000000' : choice === 'custom' ? els.exBgColor.value : 'transparent';
    return {
      content: els.exContent.value, bg: bg, bgChoice: choice, bgColor: els.exBgColor.value, size: els.exSize.value,
      format: els.exFormat.value, quality: +els.exQuality.value, cutSource: els.exCutSource.value,
      cutCrop: els.exCutCrop.value === '1', cutLines: els.exCutLines.value === '1'
    };
  }

  function updateExportUI() {
    var f = els.exFormat.value;
    if (f === 'svg') els.exContent.value = 'lines';
    els.exContent.disabled = f === 'svg';
    var content = els.exContent.value;
    $('ex-cut-block').hidden = content !== 'cutout';
    $('ex-bg-block').hidden = content === 'both';
    els.exBgColor.hidden = els.exBg.value !== 'custom';
    $('ex-quality-block').hidden = f !== 'jpg';
    $('ex-quality-out').textContent = els.exQuality.value;
    updateRangeFill(els.exQuality);
    var ex = exportDims(els.exSize.value), notes = [];
    notes.push('Tulos: ' + (content === 'cutout' ? 'enintään ' : '') + ex.ow + ' × ' + ex.oh + ' px (' + (ex.ow * ex.oh / 1e6).toFixed(1).replace('.', ',') + ' Mpx).');
    if (ex.ow * ex.oh > MAX_EXPORT_PIXELS) notes.push('Liian suuri: valitse pienempi koko.');
    if (f === 'svg') notes.push('SVG sisältää vain vektoriääriviivat (tekoälyrajaukset ja käsin muokatut kohteet), ei automaattisia ääriviivoja.');
    if (f === 'jpg' && (content === 'cutout' || content === 'lines') && els.exBg.value === 'transparent') notes.push('JPG ei tue läpinäkyvyyttä: tausta on valkoinen.');
    if (f !== 'svg' && ex.useOrig && content !== 'cutout' && !getLayer('contour').edited) notes.push('Ääriviivat lasketaan täydessä koossa, mikä voi kestää hetken.');
    if (f !== 'svg' && ex.useOrig && getLayer('contour').edited) notes.push('Käsin muokattu ääriviivataso skaalataan alkuperäiseen kokoon (ei lasketa uudelleen).');
    els.exInfo.textContent = notes.join(' ');
  }

  function openExportDialog() {
    if (!doc) return;
    settle();
    if (tool === 'crop') leaveModal();
    var st = loadExportSettings();
    // Koko
    els.exSize.innerHTML = '';
    function addOpt(sel, value, text) { var o = document.createElement('option'); o.value = value; o.textContent = text; sel.appendChild(o); }
    if (doc.src) addOpt(els.exSize, 'orig', 'Alkuperäinen koko (' + Math.round(doc.width * doc.src.kx) + ' × ' + Math.round(doc.height * doc.src.ky) + ' px)');
    addOpt(els.exSize, 'work', 'Työkoko (' + doc.width + ' × ' + doc.height + ' px)');
    addOpt(els.exSize, 'half', 'Puolet (' + Math.round(doc.width / 2) + ' × ' + Math.round(doc.height / 2) + ' px)');
    // Kohde
    els.exCutSource.innerHTML = '';
    if (sel) addOpt(els.exCutSource, 'selection', 'Nykyinen valinta');
    var vecs = doc.layers.filter(function (L) { return L.kind === 'vector'; });
    vecs.slice().reverse().forEach(function (L) { addOpt(els.exCutSource, L.id, L.name); });
    if (vecs.length > 1) addOpt(els.exCutSource, 'vectors', 'Kaikki näkyvät kohteet yhdessä');
    if (!els.exCutSource.options.length) addOpt(els.exCutSource, 'selection', 'Ei kohteita: tee valinta tai tekoälyrajaus');
    var activeVec = activeVector();
    if (activeVec) els.exCutSource.value = activeVec.id;
    // Tallennetut valinnat
    if (st.content) els.exContent.value = st.content;
    if (st.bg) els.exBg.value = st.bg;
    if (isHex(st.bgColor)) els.exBgColor.value = st.bgColor;
    els.exSize.value = st.size && Array.prototype.some.call(els.exSize.options, function (o) { return o.value === st.size; }) ? st.size : els.exSize.options[0].value;
    if (st.format) els.exFormat.value = st.format;
    if (st.quality) els.exQuality.value = st.quality;
    if (st.cutCrop != null) els.exCutCrop.value = st.cutCrop ? '1' : '0';
    if (st.cutLines != null) els.exCutLines.value = st.cutLines ? '1' : '0';
    updateExportUI();
    els.exportModal.hidden = false;
    els.exContent.focus();
  }

  function closeExportDialog() {
    els.exportModal.hidden = true;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  async function doExport() {
    if (!doc) return;
    var o = readExportUI();
    saveExportSettings(o);
    els.exDownload.disabled = true;
    notice('Viedään kuvaa…');
    try {
      await waitContourReady();
      var blob;
      if (o.format === 'svg') blob = exportSvgBlob(o);
      else {
        var canvas = await renderExportCanvas(o);
        blob = await canvasBlob(canvas, o.format === 'jpg' ? 'image/jpeg' : 'image/png', o.quality / 100);
      }
      var name = exportFileName(o);
      downloadBlob(blob, name);
      toast('Ladattu: ' + name);
      closeExportDialog();
    } catch (err) {
      console.warn('Vienti epäonnistui', err);
      toast('Vienti epäonnistui: ' + (err && err.message || err), true);
    } finally {
      els.exDownload.disabled = false;
    }
  }

  // ---------- Valinta vektorikohteesta ----------

  function selectionFromVector(L, mode) {
    var b = vectorBounds(L);
    if (!b) return;
    var box = clampBox(b.x - 1, b.y - 1, b.w + 2, b.h + 2);
    if (!box) { notice('Kohde on kuvan ulkopuolella.'); return; }
    var c = makeCanvas(box.w, box.h), x = c.getContext('2d', { willReadFrequently: true });
    x.translate(-box.x, -box.y);
    x.fillStyle = '#000';
    x.fill(vectorPath2D(L), 'evenodd');
    var d = x.getImageData(0, 0, box.w, box.h).data, a = new Uint8Array(box.w * box.h);
    for (var i = 0; i < a.length; i++) a[i] = d[i * 4 + 3];
    setSelection(LineoSelect.combine(sel, LineoSelect.fromAlpha(a, box.x, box.y, box.w, box.h), mode));
    notice('Valinta tehty kohteesta ' + L.name + '. Ctrl+J kopioi sen uudelle tasolle.');
  }

  // ---------- Paletin vienti ja tuonti, pikanäppäimet ----------

  function exportPalette() {
    downloadBlob(new Blob([JSON.stringify({ app: 'Lineo', type: 'palette', colors: palette }, null, 2)], { type: 'application/json' }), 'lineo-paletti.json');
    toast('Paletti ladattu.');
  }

  async function importPalette(file) {
    try {
      var data = JSON.parse(await file.text());
      var colors = (Array.isArray(data) ? data : data && data.colors || []).map(function (c) { return String(c).toLowerCase(); }).filter(isHex);
      if (!colors.length) throw new Error('väripaletti puuttuu');
      var added = 0;
      colors.forEach(function (c) { if (palette.indexOf(c) === -1) { palette.push(c); added++; } });
      palette = palette.slice(0, 48);
      savePalette();
      renderPalettes();
      toast('Paletti tuotu: ' + added + ' uutta väriä.');
    } catch (err) {
      toast('Palettia ei voitu tuoda: ' + (err && err.message || err), true);
    }
  }

  function openKeysDialog() {
    els.keysModal.hidden = false;
    $('keys-close').focus();
  }
  function closeKeysDialog() {
    els.keysModal.hidden = true;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  // ---------- Kynä (P): viivojen piirto pisteillä ----------
  //
  // Klikkaa tyhjää aloittaaksesi uuden viivan (oma vektoritasonsa, kuten tekoälyrajauksessa). Jokainen klikkaus lisää pisteen;
  // raahaus tekee pisteestä kaaren (kahvat). Ensimmäisen pisteen klikkaus sulkee viivan, viimeisen pisteen klikkaus tai Enter lopettaa.
  // Shift + klikkaus tyhjään lisää viivan aktiiviseen vektoritasoon. Valmista viivaa muokataan samalla työkalulla.

  var penSession = null;   // { layer, path, newLayer, before }
  var penResume = null;    // { layer, path }: viiva, jota taivutettiin kesken piirron; seuraava tyhjään klikkaus jatkaa sitä

  function penNode(x, y) { return { x: x, y: y, ix: x, iy: y, ox: x, oy: y, corner: true }; }

  function penBegin(d, addToActive) {
    var node = penNode(d.x, d.y), path = { closed: false, nodes: [node] };
    var L = addToActive ? activeVector() : null;
    if (L && !L.locked) {
      var before = LineoVector.clonePaths(L.paths);
      L.paths.push(path);
      penSession = { layer: L, path: path, newLayer: false, before: before };
    } else {
      doc.vectorCount++;
      L = {
        id: 'v' + Date.now() + doc.vectorCount, kind: 'vector', name: 'Viiva ' + doc.vectorCount, visible: true, opacity: 1, locked: false,
        paths: [path], loops: null, detail: 50, styleName: null,
        stroke: { width: +els.vecWidth.value, color: els.vecColor.value }
      };
      addLayer(L);
      penSession = { layer: L, path: path, newLayer: true, before: null };
    }
    selection = { layer: L, path: L.paths.indexOf(path), node: 0 };
    touchVector(L);
    updateContextPanel();
    return node;
  }

  function penDiscard() {
    var s = penSession;
    penSession = null;
    if (!s) return;
    if (s.newLayer) removeLayer(s.layer);
    else { var i = s.layer.paths.indexOf(s.path); if (i >= 0) s.layer.paths.splice(i, 1); touchVector(s.layer); }
    selection = null;
    updateContextPanel();
    render();
  }

  // Lopettaa viivan ja tallentaa sen kumottavaksi askeleeksi. Yksi piste ei ole viiva.
  function finishPen(explicit) {
    var s = penSession;
    if (!s) return;
    penResume = null;
    if (s.path.nodes.length < 2) { penDiscard(); return; }
    penSession = null;
    // Viiva jää jatkettavaksi (taivutus, työkalun vaihto, viimeisen pisteen klikkaus), ellei sitä lopeteta Enterillä/Escillä tai sulkemalla.
    if (!explicit && !s.path.closed) penResume = { layer: s.layer, path: s.path };
    var L = s.layer;
    var entry;
    if (s.newLayer) {
      var index = doc.layers.indexOf(L);
      entry = { undo: function () { removeLayer(L); }, redo: function () { addLayer(L, index); } };
    } else {
      entry = pathsEntry(L, s.before);
    }
    if (s.extra) {
      // Yhdistetty toisen tason viiva: molemmat muutokset kumotaan yhdellä askeleella.
      var e1 = entry, e2 = s.extra;
      entry = { undo: function () { e2.undo(); e1.undo(); }, redo: function () { e2.redo(); e1.redo(); } };
    }
    pushHistory(entry);
    selection = null;
    touchVector(L);
    updateContextPanel();
    scheduleThumbs();
  }

  // Ctrl+Z kesken piirron poistaa viimeisen pisteen.
  function penUndoPoint() {
    var s = penSession;
    if (!s) return;
    s.path.nodes.pop();
    if (s.path.nodes.length < 1) { penDiscard(); return; }
    selection = { layer: s.layer, path: s.layer.paths.indexOf(s.path), node: s.path.nodes.length - 1 };
    touchVector(s.layer);
    updateContextPanel();
  }

  // Osoittimen painallus kesken piirron: sulje, lopeta tai lisää piste (raahaus muotoilee kaaren).
  function penDown(e, p, base) {
    var s = penSession, nodes = s.path.nodes, d = toDoc(p), r = hitRadius() / view.scale;
    function near(n) { return Math.hypot(n.x - d.x, n.y - d.y) <= r; }
    if (nodes.length >= 3 && near(nodes[0])) {
      s.path.closed = true;
      finishPen();
      return Object.assign(base, { type: 'pan' });
    }
    if (nodes.length >= 2 && near(nodes[nodes.length - 1])) {
      finishPen();
      return Object.assign(base, { type: 'pan' });
    }
    return penPlace(d, base);
  }

  // Klikkaus olemassa olevan viivan tai pisteen päälle kesken piirron lopettaa piirron ja siirtyy muokkaamaan (taivutus, pisteen siirto).
  // Sulkeva ja lopettava klikkaus (ensimmäinen/viimeinen piste) kuuluvat silti piirrolle.
  function penDefersToEdit(e, p) {
    if (e.button !== 0) return false;
    var s = penSession, nodes = s.path.nodes, d = toDoc(p), r = hitRadius() / view.scale;
    function near(n) { return Math.hypot(n.x - d.x, n.y - d.y) <= r; }
    if (nodes.length >= 3 && near(nodes[0])) return false;
    if (nodes.length >= 2 && near(nodes[nodes.length - 1])) return false;
    // Toisen avoimen viivan päätepisteen klikkaus yhdistää viivat yhdeksi.
    var other = null;
    doc.layers.forEach(function (L) {
      if (other || L.kind !== 'vector' || !L.visible || L.locked) return;
      L.paths.forEach(function (q) {
        if (other || q === s.path || q.closed || !q.nodes.length) return;
        if (near(q.nodes[q.nodes.length - 1])) other = { layer: L, path: q, fromStart: false };
        else if (near(q.nodes[0])) other = { layer: L, path: q, fromStart: true };
      });
    });
    if (other) { penJoin(other.layer, other.path, other.fromStart); return true; }
    // Toisen viivan (tai muodon) pisteen klikkaus: viiva päättyy täsmälleen siihen pisteeseen.
    var target = null;
    doc.layers.forEach(function (L) {
      if (target || L.kind !== 'vector' || !L.visible) return;
      L.paths.forEach(function (q) {
        if (target || q === s.path) return;
        q.nodes.forEach(function (n) { if (!target && near(n)) target = n; });
      });
    });
    if (target) {
      s.path.nodes.push(penNode(target.x, target.y));
      finishPen(true);
      return true;
    }
    if (nodes.length < 2) return false;
    if (!hitTest(p)) return false;
    finishPen();
    return true;
  }

  // Kääntää polun suunnan (pisteet ja kahvat), jotta viivaa voi jatkaa sen alkupäästä.
  function reversePath(path) {
    path.nodes.reverse();
    path.nodes.forEach(function (n) {
      var ix = n.ix, iy = n.iy;
      n.ix = n.ox; n.iy = n.oy; n.ox = ix; n.oy = iy;
    });
  }

  // Napautus avoimen viivan päätepisteeseen (ei raahausta): seuraava tyhjään klikkaus jatkaa viivaa siitä päästä.
  function armEndpoint() {
    if (tool !== 'edit' || penSession || !selection) return;
    var path = selection.layer.paths[selection.path];
    if (!path || path.nodes.length < 1) return;
    var last = path.nodes.length - 1;
    if (path.closed || (selection.node !== 0 && selection.node !== last)) {
      // Keskipiste tai suljetun muodon piste: seuraava klikkaus aloittaa siitä uuden haaran (oma viiva samalle tasolle).
      penResume = { layer: selection.layer, path: path, branch: selection.node };
      return;
    }
    penResume = { layer: selection.layer, path: path, fromStart: selection.node === 0 && last > 0 };
  }

  function armEndpointAt(L, d) {
    var r = hitRadius() / view.scale;
    L.paths.forEach(function (q) {
      if (!q.nodes.length) return;
      var a = q.nodes[0], z = q.nodes[q.nodes.length - 1];
      if (!q.closed && Math.hypot(z.x - d.x, z.y - d.y) <= r) penResume = { layer: L, path: q, fromStart: false };
      else if (!q.closed && Math.hypot(a.x - d.x, a.y - d.y) <= r) penResume = { layer: L, path: q, fromStart: true };
      else q.nodes.forEach(function (n, i) { if (Math.hypot(n.x - d.x, n.y - d.y) <= r) penResume = { layer: L, path: q, branch: i }; });
    });
  }

  // Kesken piirron toisen viivan päätepisteen klikkaus: viivat yhdistetään yhdeksi (kumottavissa yhtenä askeleena).
  // Toinen viiva voi olla myös toisella vektoritasolla; jos taso jää tyhjäksi, se poistetaan.
  function penJoin(OL, other, fromStart) {
    var s = penSession, L = s.layer;
    var otherBefore = OL !== L ? LineoVector.clonePaths(OL.paths) : null;
    if (!fromStart) reversePath(other);   // toisen viivan klikattu pää tulee jatkoksi
    s.path.nodes = s.path.nodes.concat(other.nodes);
    OL.paths.splice(OL.paths.indexOf(other), 1);
    if (OL !== L) {
      if (!OL.paths.length) {
        var oi = doc.layers.indexOf(OL);
        removeLayer(OL);
        s.extra = {
          undo: function () { OL.paths = LineoVector.clonePaths(otherBefore); addLayer(OL, oi); touchVector(OL); },
          redo: function () { removeLayer(OL); }
        };
      } else {
        s.extra = pathsEntry(OL, otherBefore);
      }
    }
    finishPen();
    selection = null;
    touchVector(L);
    updateContextPanel();
    render();
  }

  function penPlace(d, base) {
    var s = penSession, L = s.layer, n = penNode(d.x, d.y);
    s.path.nodes.push(n);
    selection = { layer: L, path: L.paths.indexOf(s.path), node: s.path.nodes.length - 1 };
    touchVector(L);
    var g = Object.assign(base, { type: 'pen' });
    g.onMove = function (pt) {
      var q = toDoc(pt);
      n.ox = q.x; n.oy = q.y; n.ix = 2 * n.x - q.x; n.iy = 2 * n.y - q.y; n.corner = false;
      touchVector(L);
    };
    g.commit = function () { updateContextPanel(); };
    g.cancel = function () {
      if (penSession && penSession.path.nodes[penSession.path.nodes.length - 1] === n) penUndoPoint();
    };
    return g;
  }

  // Tyhjän kohdan klikkaus: uusi viiva (Shift = aktiiviseen tasoon).
  function penStartAt(e, p, base) {
    var d = toDoc(p);
    if (!inDoc(d)) return Object.assign(base, { type: 'pan' });
    var av = activeVector();
    if (e.shiftKey && av && av.locked) { notice('Taso on lukittu. Avaa lukitus Tasot-osiosta.'); return Object.assign(base, { type: 'pan' }); }
    var rs = penResume;
    penResume = null;
    if (rs && rs.branch != null && !e.shiftKey && doc.layers.indexOf(rs.layer) >= 0 && doc.activeId === rs.layer.id && !rs.layer.locked &&
        rs.layer.paths.indexOf(rs.path) >= 0 && rs.path.nodes[rs.branch]) {
      // Valitusta pisteestä lähtee uusi viiva, joka alkaa täsmälleen pisteen kohdalta.
      var from = rs.path.nodes[rs.branch], bp = { closed: false, nodes: [penNode(from.x, from.y)] };
      penSession = { layer: rs.layer, path: bp, newLayer: false, before: LineoVector.clonePaths(rs.layer.paths) };
      rs.layer.paths.push(bp);
      return penPlace(d, base);
    }
    if (rs && !e.shiftKey && doc.layers.indexOf(rs.layer) >= 0 && doc.activeId === rs.layer.id && !rs.layer.locked &&
        rs.layer.paths.indexOf(rs.path) >= 0 && !rs.path.closed && rs.path.nodes.length) {
      // Taivutuksen jälkeen uusi piste jatkaa samaa viivaa sen viimeisestä pisteestä.
      penSession = { layer: rs.layer, path: rs.path, newLayer: false, before: LineoVector.clonePaths(rs.layer.paths) };
      if (rs.fromStart) reversePath(rs.path);
      return penPlace(d, base);
    }
    penBegin(d, e.shiftKey);
    return penFirstGesture(base);
  }

  // Ensimmäisen pisteen raahaus muotoilee sen kahvoja.
  function penFirstGesture(base) {
    var s = penSession, L = s.layer, n = s.path.nodes[0];
    var g = Object.assign(base, { type: 'pen' });
    g.onMove = function (pt) {
      var q = toDoc(pt);
      n.ox = q.x; n.oy = q.y; n.ix = 2 * n.x - q.x; n.iy = 2 * n.y - q.y; n.corner = false;
      touchVector(L);
    };
    g.commit = function () { updateContextPanel(); };
    g.cancel = function () { penDiscard(); };
    return g;
  }

  // ---------- Tekoälyrajaus ----------

  var AI_SIDE = 1024;   // analysoitavan kuvan pidempi sivu
  var ai = { points: [], mask: null, mw: 0, mh: 0, maskCanvas: null, loops: null, paths: null, busy: false, again: false };
  var aiImage = null;   // { data: ImageData, scale, key }

  function aiReset() {
    ai.points = [];
    ai.mask = null; ai.maskCanvas = null; ai.loops = null; ai.paths = null;
    ai.again = false;
    if (doc) updateContextPanel();
  }

  function aiSource() {
    if (aiImage && aiImage.key === doc.key) return aiImage;
    var s = Math.min(1, AI_SIDE / Math.max(doc.width, doc.height));
    var w = Math.max(1, Math.round(doc.width * s)), h = Math.max(1, Math.round(doc.height * s));
    var c = makeCanvas(w, h), x = c.getContext('2d', { willReadFrequently: true });
    x.imageSmoothingQuality = 'high';
    x.drawImage(getLayer('original').canvas, 0, 0, w, h);
    aiImage = { data: x.getImageData(0, 0, w, h), scale: w / doc.width, key: doc.key };
    return aiImage;
  }

  function aiMethod() { return els.aiMethod.value; }

  // Ladataan malli ja analysoidaan kuva valmiiksi heti, kun työkalu valitaan.
  function aiPrepare() {
    if (!doc || aiMethod() === 'color') return;
    var src = aiSource();
    if (LineoSam.isEncoded(src.key)) return;
    aiStatus(LineoSam.isLoaded ? 'Analysoidaan kuvaa…' : 'Ladataan tekoälymallia…', LineoSam.isLoaded ? -1 : 0);
    LineoSam.setImage(src.data, src.key).then(function () {
      aiStatus(null);
    }, aiFailed);
  }

  function aiFailed(err) {
    console.warn('Tekoälyrajaus epäonnistui', err);
    aiStatus(null);
    ai.busy = false;
    if (aiMethod() === 'color') return;
    els.aiMethod.value = 'color';
    updateContextPanel();
    var why = String(err && err.message || err || '').slice(0, 160);
    var errBox = $('ai-error');
    if (errBox) { errBox.textContent = 'Tekoäly ei latautunut: ' + (why || 'tuntematon virhe') + '. Tarkista verkkoyhteys ja että selain sallii jsdelivr.net- ja huggingface.co -osoitteet. Valitse Menetelmä-valikosta tekoäly uudelleen yrittääksesi.'; errBox.hidden = false; }
    toast('Tekoälymallia ei saatu käyttöön' + (why ? ' (' + why + ')' : '') + '. Käytetään värialueen rajausta. Tekoäly tarvitsee verkkoyhteyden ensimmäisellä käyttökerralla; voit vaihtaa menetelmän takaisin tekoälyyn Menetelmä-valikosta.', true);
    if (ai.points.length) aiRun();
  }

  var dlFiles = {};
  LineoSam.onProgress = function (p) {
    if (!p.file) return;
    if (p.status === 'initiate') dlFiles[p.file] = dlFiles[p.file] || { loaded: 0, total: 0 };
    var f = dlFiles[p.file] = dlFiles[p.file] || { loaded: 0, total: 0 };
    if (p.total) f.total = p.total;
    if (p.loaded) f.loaded = p.loaded;
    if (p.status === 'done') f.loaded = f.total;
    var loaded = 0, total = 0;
    Object.keys(dlFiles).forEach(function (k) { loaded += dlFiles[k].loaded; total += dlFiles[k].total; });
    if (total > 0 && loaded < total) {
      var mb = function (v) { return (v / 1048576).toFixed(1).replace('.', ','); };
      aiStatus('Ladataan tekoälymallia… ' + Math.floor(loaded / total * 100) + ' % (' + mb(loaded) + ' / ' + mb(total) + ' Mt)', loaded / total);
    } else if (total > 0) {
      aiStatus('Analysoidaan kuvaa…', -1);
    }
  };

  // text = null piilottaa. progress 0–1 tai -1 = odota (liikkuva palkki).
  function aiStatus(text, progress) {
    if (text == null) { els.aiStatus.hidden = true; return; }
    els.aiStatus.hidden = false;
    els.aiStatusText.textContent = text;
    els.aiStatus.classList.toggle('is-indeterminate', progress < 0);
    els.aiProgress.style.width = progress >= 0 ? Math.round(progress * 100) + '%' : '';
  }

  function aiAddPoint(docPt, negative) {
    var src = aiSource();
    if (docPt.x < 0 || docPt.y < 0 || docPt.x > doc.width || docPt.y > doc.height) return;
    if (!ai.points.length && negative) return;   // ensimmäinen klikkaus valitsee kohteen
    ai.points.push({ x: docPt.x * src.scale, y: docPt.y * src.scale, positive: !negative });
    updateUndoButtons();
    aiRun();
  }

  function aiUndoPoint() {
    ai.points.pop();
    if (!ai.points.length) { aiReset(); render(); return; }
    aiRun();
  }

  function aiRun() {
    if (ai.busy) { ai.again = true; return; }
    if (!ai.points.length) { aiReset(); render(); return; }
    ai.busy = true;
    ai.again = false;
    var src = aiSource();
    var points = ai.points.slice();
    var job;
    if (aiMethod() === 'color') {
      job = new Promise(function (resolve) {
        setTimeout(function () { resolve(colorRegions(src, points)); }, 0);
      });
    } else {
      if (!LineoSam.isEncoded(src.key)) aiStatus(LineoSam.isLoaded ? 'Analysoidaan kuvaa…' : 'Ladataan tekoälymallia…', LineoSam.isLoaded ? -1 : 0);
      job = LineoSam.setImage(src.data, src.key).then(function () {
        aiStatus(null);
        return samRegions(points, src.key);
      });
    }
    job.then(function (r) {
      ai.busy = false;
      if (!doc || src.key !== doc.key || !ai.points.length) return;
      aiSetRegions(r.list, r.width, r.height);
      if (ai.again) aiRun();
    }, aiFailed);
  }

  // Tekoäly: jokainen lisäklikkaus rajataan omana alueenaan (yksi maalialue = yksi muoto). Poistoklikkaukset
  // annetaan mallille jokaisen rajauksen yhteydessä. Rajaukset ovat välimuistissa, joten uusi klikkaus laskee vain yhden.
  var samCache = { key: null, masks: {} };
  function samRegions(points, key) {
    if (samCache.key !== key) samCache = { key: key, masks: {} };
    var negs = points.filter(function (p) { return !p.positive; });
    var negKey = negs.map(function (p) { return Math.round(p.x) + ',' + Math.round(p.y); }).join(';');
    var list = [], w = 1, h = 1;
    return points.filter(function (p) { return p.positive; }).reduce(function (chain, p) {
      return chain.then(function () {
        var k = Math.round(p.x) + ',' + Math.round(p.y) + '|' + negKey;
        var cached = samCache.masks[k];
        return (cached ? Promise.resolve(cached) : LineoSam.decode([p].concat(negs), key).then(function (r) {
          samCache.masks[k] = r;
          return r;
        })).then(function (r) { w = r.width; h = r.height; list.push(r.mask); });
      });
    }, Promise.resolve()).then(function () { return { list: list, width: w, height: h }; });
  }

  // Värialue: jokainen lisäpiste on oma alueensa, poistopisteiden alueet vähennetään kaikista.
  function colorRegions(src, points) {
    var d = src.data, w = d.width, h = d.height, tol = +els.aiTolerance.value;
    var neg = new Uint8Array(w * h);
    points.forEach(function (p) {
      if (p.positive) return;
      var region = LineoVector.colorRegion(d.data, w, h, p.x, p.y, tol);
      for (var i = 0; i < neg.length; i++) if (region[i]) neg[i] = 1;
    });
    var list = points.filter(function (p) { return p.positive; }).map(function (p) {
      var region = LineoVector.colorRegion(d.data, w, h, p.x, p.y, tol), m = new Uint8Array(w * h);
      for (var i = 0; i < m.length; i++) m[i] = region[i] && !neg[i] ? 1 : 0;
      return m;
    });
    return { list: list, width: w, height: h };
  }

  // Useampi alue: vierekkäisten alueiden väliin jäävä kapea sauma jaetaan lähimmälle alueelle, jolloin
  // naapurialueiden reunat osuvat samaan kohtaan ja niiden väliin piirtyy yksi rajaviiva.
  function partitionRegions(list, w, h) {
    var n = w * h, union = new Uint8Array(n), label = new Int16Array(n), queue = new Int32Array(n), qh = 0, qt = 0, i, k;
    for (k = 0; k < list.length; k++) {
      var m = list[k];
      for (i = 0; i < n; i++) if (m[i]) { union[i] = 1; if (!label[i]) { label[i] = k + 1; queue[qt++] = i; } }
    }
    closeMask(union, w, h, Math.max(2, Math.round(Math.max(w, h) / 256)));
    while (qh < qt) {
      var c = queue[qh++], x = c % w, l = label[c];
      var nb = [x > 0 ? c - 1 : -1, x < w - 1 ? c + 1 : -1, c - w, c + w];
      for (var j = 0; j < 4; j++) {
        var q = nb[j];
        if (q >= 0 && q < n && union[q] && !label[q]) { label[q] = l; queue[qt++] = q; }
      }
    }
    var parts = list.map(function () { return new Uint8Array(n); });
    for (i = 0; i < n; i++) if (label[i]) parts[label[i] - 1][i] = 1;
    return { union: union, parts: parts, label: label };
  }

  // Morfologinen sulkeminen (laajennus + kavennus) r pikselin säteellä: täyttää alueiden väliset kapeat raot.
  function closeMask(mask, w, h, r) {
    var tmp = new Uint8Array(w * h);
    function pass(src, dst, horizontal, grow) {
      var len = horizontal ? w : h, lines = horizontal ? h : w;
      for (var l = 0; l < lines; l++) {
        for (var i = 0; i < len; i++) {
          var hit = grow ? 0 : 1;
          for (var k = Math.max(0, i - r), e = Math.min(len - 1, i + r); k <= e; k++) {
            var v = src[horizontal ? l * w + k : k * w + l];
            if (grow ? v : !v) { hit = grow ? 1 : 0; break; }
          }
          dst[horizontal ? l * w + i : i * w + l] = hit;
        }
      }
    }
    pass(mask, tmp, true, true); pass(tmp, mask, false, true);
    pass(mask, tmp, true, false); pass(tmp, mask, false, false);
    return mask;
  }

  function aiSetRegions(list, w, h) {
    if (!list.length) { aiSetMask(new Uint8Array(w * h), w, h); return; }
    if (list.length === 1) { aiSetMask(list[0], w, h); return; }
    var pr = partitionRegions(list, w, h), scale = doc.width / w;
    // Ulkoreuna kerran koko yhdistetylle alueelle, alueiden väliset rajat kukin kerran avoimina viivoina.
    var loops = LineoVector.maskToLoops(pr.union, w, h, scale);
    pr.parts.forEach(function (m, k) {
      LineoVector.maskToLoops(m, w, h, 1).forEach(function (loop) {
        borderRuns(loop, k + 1, pr.label, pr.union, w, h).forEach(function (run) {
          loops.push(run.map(function (q, i) { var r = { x: q.x * scale, y: q.y * scale }; if (!i) r.o = 1; return r; }));
        });
      });
    });
    aiSetMask(pr.union, w, h, loops);
  }

  // Alueen reunasta ne pätkät, jotka ovat yhdistetyn alueen sisällä (raja naapurialueeseen). Raja otetaan vain
  // suuremman järjestysnumeron alueelta, jotta sama raja ei tule kahdesti.
  function borderRuns(loop, own, label, union, w, h) {
    var n = loop.length, keep = new Uint8Array(n), i;
    for (i = 0; i < n; i++) {
      var cx = Math.round(loop[i].x), cy = Math.round(loop[i].y), inside = true, lower = false;
      for (var dy = -2; dy <= 2 && inside; dy++) {
        for (var dx = -2; dx <= 2; dx++) {
          var x = cx + dx, y = cy + dy;
          if (x < 0 || y < 0 || x >= w || y >= h || !union[y * w + x]) { inside = false; break; }
          var l = label[y * w + x];
          if (l && l < own) lower = true;
        }
      }
      keep[i] = inside && lower ? 1 : 0;
    }
    var runs = [], start = -1;
    for (i = 0; i < n; i++) if (!keep[i]) { start = i; break; }
    if (start < 0) return [loop.concat([loop[0]])];   // koko reuna on sisäraja (alue toisen sisällä)
    // Pätkiä jatketaan muutama piste kumpaankin suuntaan, jotta raja ulottuu ulkoreunaan asti.
    var cur = [], EXT = 3;
    function flush(endIdx) {
      if (cur.length >= 3) {
        var a = cur[0], run = [];
        for (var e = EXT; e >= 1; e--) run.push(loop[(a - e + n) % n]);
        cur.forEach(function (k) { run.push(loop[k]); });
        for (e = 1; e <= EXT; e++) run.push(loop[(endIdx + e - 1) % n]);
        runs.push(run);
      }
      cur = [];
    }
    for (var j = 1; j <= n; j++) {
      var idx = (start + j) % n;
      if (keep[idx]) cur.push(idx);
      else flush(idx);
    }
    flush((start + n + 1) % n);
    return runs;
  }

  function aiSetMask(mask, w, h, loops) {
    ai.mask = mask; ai.mw = w; ai.mh = h;
    // Läpikuultava korostus rajatulle alueelle
    var c = ai.maskCanvas && ai.maskCanvas.width === w && ai.maskCanvas.height === h ? ai.maskCanvas : makeCanvas(w, h);
    var x = c.getContext('2d'), img = x.createImageData(w, h), px = img.data;
    for (var i = 0, j = 0; i < mask.length; i++, j += 4) {
      if (mask[i]) { px[j] = 255; px[j + 1] = 138; px[j + 2] = 61; px[j + 3] = 90; }
    }
    x.putImageData(img, 0, 0);
    ai.maskCanvas = c;
    var scale = doc.width / w;
    ai.loops = loops || LineoVector.maskToLoops(mask, w, h, scale);
    ai.paths = LineoVector.loopsToPaths(ai.loops, +els.vecDetail.value, Math.hypot(doc.width, doc.height));
    updateContextPanel();
    render();
  }

  function aiCommit() {
    if (!ai.paths || !ai.paths.length) { aiReset(); render(); return; }
    doc.vectorCount++;
    var layer = {
      id: 'v' + Date.now() + doc.vectorCount,
      kind: 'vector',
      name: 'Kohde ' + doc.vectorCount,
      visible: true,
      opacity: 1,
      paths: ai.paths,
      loops: ai.loops,
      detail: +els.vecDetail.value,
      stroke: { width: +els.vecWidth.value, color: els.vecColor.value }
    };
    aiReset();
    addLayer(layer);
    pushHistory({
      undo: function () { removeLayer(layer); },
      redo: function () { addLayer(layer); }
    });
    scheduleThumbs();
    toast(layer.name + ' lisättiin omalle tasolleen. Kynällä (P) voit viimeistellä sen.');
  }

  function aiCancel() {
    aiReset();
    render();
  }

  function drawAiOverlay() {
    if (tool !== 'ai' || !ai.points.length) return;
    var w = doc.width * view.scale, h = doc.height * view.scale;
    if (ai.maskCanvas) {
      vctx.imageSmoothingEnabled = true;
      vctx.drawImage(ai.maskCanvas, view.x, view.y, w, h);
    }
    if (ai.paths && ai.paths.length) {
      vctx.save();
      vctx.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
      strokeVector(vctx, ai.paths, null, { width: +els.vecWidth.value, color: els.vecColor.value });
      vctx.restore();
    }
    var src = aiSource(), r = (IS_TOUCH ? 9 : 7) * dpr();
    ai.points.forEach(function (p) {
      var s = toScreen(p.x / src.scale, p.y / src.scale);
      vctx.beginPath();
      vctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      vctx.fillStyle = p.positive ? '#4cc38a' : '#ef5b5b';
      vctx.fill();
      vctx.lineWidth = 2 * dpr();
      vctx.strokeStyle = '#fff';
      vctx.stroke();
      vctx.beginPath();
      vctx.moveTo(s.x - r * 0.5, s.y); vctx.lineTo(s.x + r * 0.5, s.y);
      if (p.positive) { vctx.moveTo(s.x, s.y - r * 0.5); vctx.lineTo(s.x, s.y + r * 0.5); }
      vctx.stroke();
    });
  }

  // ---------- Pisteiden muokkaus ----------

  var selection = null;   // { layer, path, node } valittu ankkuripiste

  function hitRadius() { return (IS_TOUCH ? 16 : 8) * dpr(); }

  // Osuma kankaan pisteessä p: kahva, piste tai viiva.
  function hitTest(p) {
    var r = hitRadius(), layer = activeVector();
    function near(x, y) { var s = toScreen(x, y); return Math.hypot(s.x - p.x, s.y - p.y) <= r; }
    if (layer && layer.visible) {
      if (selection && selection.layer === layer) {
        var sn = layer.paths[selection.path].nodes[selection.node];
        if (!sn.corner || sn.ix !== sn.x || sn.iy !== sn.y) {
          if (near(sn.ox, sn.oy) && (sn.ox !== sn.x || sn.oy !== sn.y)) return { type: 'handle', which: 'o', layer: layer, path: selection.path, node: selection.node };
          if (near(sn.ix, sn.iy) && (sn.ix !== sn.x || sn.iy !== sn.y)) return { type: 'handle', which: 'i', layer: layer, path: selection.path, node: selection.node };
        }
      }
      for (var pi = 0; pi < layer.paths.length; pi++) {
        var nodes = layer.paths[pi].nodes;
        for (var ni = 0; ni < nodes.length; ni++) {
          if (near(nodes[ni].x, nodes[ni].y)) return { type: 'node', layer: layer, path: pi, node: ni };
        }
      }
    }
    var d = toDoc(p), tol = r / view.scale;
    // Viiva: ensin aktiivinen taso, sitten muut näkyvät vektoritasot ylhäältä alas.
    var order = doc.layers.slice().reverse().filter(function (L) { return L.kind === 'vector' && L.visible; });
    if (layer) order.sort(function (a, b) { return (b === layer) - (a === layer); });
    for (var li = 0; li < order.length; li++) {
      var L = order[li], reach = tol + L.stroke.width / 2;
      for (var k = 0; k < L.paths.length; k++) {
        var hit = LineoVector.nearestOnPath(L.paths[k], d.x, d.y);
        if (hit && hit.dist <= reach) return { type: 'segment', layer: L, path: k, seg: hit.seg, t: hit.t };
      }
    }
    return null;
  }

  function drawEditOverlay() {
    if (tool !== 'edit') return;
    var layer = activeVector();
    if (!layer || !layer.visible) return;
    var r = (IS_TOUCH ? 5 : 3.5) * dpr();
    // Kun pisteet ovat ruudulla tiheässä (zoomattu kauas), merkit pienenevät, jotta kuva näkyy.
    var gap = 0, gaps = 0;
    layer.paths.forEach(function (path) {
      for (var i = 1; i < path.nodes.length; i++) {
        gap += Math.hypot(path.nodes[i].x - path.nodes[i - 1].x, path.nodes[i].y - path.nodes[i - 1].y);
        gaps++;
      }
    });
    if (gaps) r = Math.max(1.5 * dpr(), Math.min(r, gap / gaps * view.scale * 0.18));
    vctx.save();
    vctx.lineWidth = 1 * dpr();
    // Ohut korostusviiva, jotta muokattava polku erottuu
    vctx.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    vctx.lineWidth = 1 * dpr() / view.scale;
    vctx.strokeStyle = '#ff8a3d';
    vctx.stroke(vectorPath2D(layer));
    if (penSession && penSession.layer === layer) {
      // Kesken oleva viiva: kuminauha viimeisestä pisteestä osoittimeen ja ensimmäisen pisteen sulkurengas
      var pn = penSession.path.nodes, ln = pn[pn.length - 1];
      if (hover && !spaceDown) {
        var hd = toDoc(hover);
        vctx.setLineDash([4 / view.scale * dpr(), 4 / view.scale * dpr()]);
        vctx.beginPath(); vctx.moveTo(ln.ox, ln.oy); vctx.lineTo(hd.x, hd.y);
        vctx.lineWidth = 1 * dpr() / view.scale; vctx.strokeStyle = '#ffffff'; vctx.stroke();
        vctx.setLineDash([]);
      }
      if (pn.length >= 3) {
        vctx.beginPath(); vctx.arc(pn[0].x, pn[0].y, 9 * dpr() / view.scale, 0, Math.PI * 2);
        vctx.lineWidth = 1.5 * dpr() / view.scale; vctx.strokeStyle = '#4cc38a'; vctx.stroke();
      }
    }
    vctx.setTransform(1, 0, 0, 1, 0, 0);
    vctx.lineWidth = 1.25 * dpr();
    layer.paths.forEach(function (path, pi) {
      path.nodes.forEach(function (n, ni) {
        var s = toScreen(n.x, n.y);
        var sel = selection && selection.layer === layer && selection.path === pi && selection.node === ni;
        if (sel) {
          [['ix', 'iy'], ['ox', 'oy']].forEach(function (k) {
            if (n[k[0]] === n.x && n[k[1]] === n.y) return;
            var hs = toScreen(n[k[0]], n[k[1]]);
            vctx.strokeStyle = '#ff8a3d';
            vctx.beginPath(); vctx.moveTo(s.x, s.y); vctx.lineTo(hs.x, hs.y); vctx.stroke();
            vctx.beginPath(); vctx.arc(hs.x, hs.y, r, 0, Math.PI * 2);
            vctx.fillStyle = '#fff'; vctx.fill(); vctx.stroke();
          });
        }
        vctx.fillStyle = sel ? '#ff8a3d' : '#fff';
        vctx.strokeStyle = '#ff8a3d';
        if (n.corner) {
          vctx.beginPath();
          vctx.moveTo(s.x, s.y - r * 1.25); vctx.lineTo(s.x + r * 1.25, s.y); vctx.lineTo(s.x, s.y + r * 1.25); vctx.lineTo(s.x - r * 1.25, s.y);
          vctx.closePath();
          vctx.fill(); vctx.stroke();
        } else {
          vctx.fillRect(s.x - r, s.y - r, r * 2, r * 2);
          vctx.strokeRect(s.x - r, s.y - r, r * 2, r * 2);
        }
      });
    });
    vctx.restore();
  }

  function selectedNode() {
    if (!selection) return null;
    var path = selection.layer.paths[selection.path];
    return path ? path.nodes[selection.node] : null;
  }

  function deleteSelectedNode() {
    var layer = activeVector();
    if (!selection || selection.layer !== layer || layer.locked) return;
    var before = LineoVector.clonePaths(layer.paths);
    var path = layer.paths[selection.path];
    path.nodes.splice(selection.node, 1);
    if (path.nodes.length < 3) layer.paths.splice(selection.path, 1);
    selection = null;
    pushHistory(pathsEntry(layer, before));
    touchVector(layer);
    updateContextPanel();
  }

  function toggleSelectedNode() {
    var layer = activeVector(), n = selectedNode();
    if (!n || selection.layer !== layer || layer.locked) return;
    var before = LineoVector.clonePaths(layer.paths);
    if (n.corner) LineoVector.smoothNode(layer.paths[selection.path], selection.node);
    else LineoVector.cornerNode(n);
    pushHistory(pathsEntry(layer, before));
    touchVector(layer);
  }

  // ---------- Vienti ----------

  // ---------- Tapahtumat ----------

  function pickFile() { els.fileInput.click(); }

  els.btnOpen.addEventListener('click', pickFile);
  els.btnOpenEmpty.addEventListener('click', pickFile);
  els.fileInput.addEventListener('change', function () {
    openFile(els.fileInput.files[0]);
    els.fileInput.value = '';
  });
  els.btnExport.addEventListener('click', openExportDialog);

  [els.detail, els.thickness, els.noise].forEach(function (input) {
    // input = raahaus käynnissä → esikatselu, change = säädin irrotettu → täysi tarkkuus
    input.addEventListener('input', function () { contoursOn(); updateOutputs(); requestContours(true); });
    input.addEventListener('change', function () { contoursOn(); requestContours(false); });
  });
  els.lineColor.addEventListener('input', function () { contoursOn(); requestContours(false); });
  $('contour-create').addEventListener('click', function () { contoursOn(); requestContours(false); });
  $('contour-remove-btn').addEventListener('click', removeContours);
  // Osiot voi piilottaa hetkeksi napauttamalla otsikkoa
  ['contour-head', 'orig-head'].forEach(function (id) {
    var head = $(id);
    function toggle() {
      var collapsed = head.parentElement.classList.toggle('is-collapsed');
      head.setAttribute('aria-expanded', String(!collapsed));
    }
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  els.origOpacity.addEventListener('input', function () {
    updateOutputs();
    if (doc) opacityInput(getLayer('original'), +els.origOpacity.value);
  });
  els.origOpacity.addEventListener('change', opacityChange);

  els.layerOpacity.addEventListener('input', function () {
    updateOutputs();
    opacityInput(activeLayer(), +els.layerOpacity.value);
  });
  els.layerOpacity.addEventListener('change', opacityChange);

  els.layerAdd.addEventListener('click', function () { newRasterLayer(); });
  els.layerUp.addEventListener('click', function () { moveActiveLayer(1); });
  els.layerDown.addEventListener('click', function () { moveActiveLayer(-1); });
  els.layerLock.addEventListener('click', function () { toggleLock(activeLayer()); });
  els.layerDelete.addEventListener('click', deleteActiveLayer);
  els.contourReset.addEventListener('click', recomputeContours);

  // Siveltimen asetukset tallentuvat aktiiviselle työkalulle.
  els.brushSize.addEventListener('input', function () {
    if (isPaintTool(tool)) paint[tool].size = sizeFromSlider(+els.brushSize.value);
    updateOutputs();
    render();
  });
  els.brushHardness.addEventListener('input', function () {
    if (isPaintTool(tool)) paint[tool].hardness = +els.brushHardness.value;
    updateOutputs();
  });
  els.brushStab.addEventListener('input', function () {
    if (isPaintTool(tool)) paint[tool].stab = +els.brushStab.value;
    updateOutputs();
  });

  // Vektoriviivan tyyli: muutos näkyy heti, kumottavissa yhtenä askeleena.
  var styleBefore = null;
  function vecStyleInput() {
    updateOutputs();
    var L = activeVector();
    if (L && L.locked) L = null;
    if (L) {
      if (!styleBefore) styleBefore = Object.assign({}, L.stroke);
      L.stroke = Object.assign({}, L.stroke, { width: +els.vecWidth.value, color: els.vecColor.value });
      touchVector(L);
    } else {
      render();
    }
  }
  function vecStyleChange() {
    var L = activeVector();
    if (L && styleBefore) {
      var before = styleBefore, after = Object.assign({}, L.stroke);
      pushHistory({
        undo: function () { L.stroke = Object.assign({}, before); touchVector(L); updateContextPanel(); },
        redo: function () { L.stroke = Object.assign({}, after); touchVector(L); updateContextPanel(); }
      });
    }
    styleBefore = null;
  }
  els.vecWidth.addEventListener('input', vecStyleInput);
  els.vecWidth.addEventListener('change', vecStyleChange);
  els.vecColor.addEventListener('input', vecStyleInput);
  els.vecColor.addEventListener('change', vecStyleChange);

  // Muodon tarkkuus: polut lasketaan uudelleen alkuperäisestä rajauksesta.
  var detailBefore = null;
  els.vecDetail.addEventListener('input', function () {
    updateOutputs();
    var L = activeVector();
    if (L && L.locked) L = null;
    if (L && L.loops) {
      if (!detailBefore) detailBefore = { paths: LineoVector.clonePaths(L.paths), detail: L.detail };
      L.detail = +els.vecDetail.value;
      L.paths = LineoVector.loopsToPaths(L.loops, L.detail, Math.hypot(doc.width, doc.height));
      selection = null;
      touchVector(L);
    } else if (ai.loops) {
      ai.paths = LineoVector.loopsToPaths(ai.loops, +els.vecDetail.value, Math.hypot(doc.width, doc.height));
      render();
    }
  });
  els.vecDetail.addEventListener('change', function () {
    var L = activeVector();
    if (L && detailBefore) {
      var before = detailBefore, after = { paths: LineoVector.clonePaths(L.paths), detail: L.detail };
      pushHistory({
        undo: function () { L.paths = LineoVector.clonePaths(before.paths); L.detail = before.detail; touchVector(L); updateContextPanel(); },
        redo: function () { L.paths = LineoVector.clonePaths(after.paths); L.detail = after.detail; touchVector(L); updateContextPanel(); }
      });
      updateContextPanel();
    }
    detailBefore = null;
  });

  els.nodeDelete.addEventListener('click', deleteSelectedNode);
  els.nodeToggle.addEventListener('click', toggleSelectedNode);

  // Vienti, pikanäppäimet, paletin tuonti, valinta kohteesta
  els.exDownload.addEventListener('click', doExport);
  els.exCancel.addEventListener('click', closeExportDialog);
  els.exportModal.addEventListener('click', function (e) { if (e.target === els.exportModal) closeExportDialog(); });
  els.exportModal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); closeExportDialog(); }
  });
  [els.exContent, els.exBg, els.exBgColor, els.exSize, els.exFormat, els.exQuality].forEach(function (el) {
    el.addEventListener('input', updateExportUI);
    el.addEventListener('change', updateExportUI);
  });
  els.keysClose.addEventListener('click', closeKeysDialog);
  els.keysModal.addEventListener('click', function (e) { if (e.target === els.keysModal) closeKeysDialog(); });
  els.keysModal.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); closeKeysDialog(); } });
  els.paletteInput.addEventListener('change', function () {
    if (els.paletteInput.files[0]) importPalette(els.paletteInput.files[0]);
    els.paletteInput.value = '';
  });
  els.vecToSel.addEventListener('click', function (e) {
    var L = activeVector();
    if (L) selectionFromVector(L, e.shiftKey ? 'add' : 'new');
  });
  window.addEventListener('beforeunload', function (e) {
    if (doc && doc.dirty) { e.preventDefault(); e.returnValue = ''; }
  });

  // Säädöt: liukusäätimet, levels, käyrät
  els.adjApply.addEventListener('click', function () { endAdjust(true); });
  els.adjCancel.addEventListener('click', function () { endAdjust(false); });
  Object.keys(ADJ_SLIDERS).forEach(function (op) {
    ADJ_SLIDERS[op].forEach(function (sl) {
      $(sl[0]).addEventListener('input', function () { readAdjustUI(); adjSchedule(); });
    });
  });
  LV_SLIDERS.forEach(function (sl) {
    $(sl[0]).addEventListener('input', function () { readAdjustUI(); adjSchedule(); });
  });
  els.lvChannel.addEventListener('change', function () { if (adj) { adj.params.channel = els.lvChannel.value; syncAdjustUI(); adjSchedule(); } });
  els.cvChannel.addEventListener('change', function () { if (adj) { adj.params.channel = els.cvChannel.value; adjSchedule(); } });
  els.lvReset.addEventListener('click', function () {
    if (!adj) return;
    adj.params[adj.params.channel] = defaultLevels();
    syncAdjustUI(); adjSchedule();
  });
  els.lvAuto.addEventListener('click', function () {
    if (!adj) return;
    var ch = adj.params.channel, a = LineoFilters.autoLevels(adj.hist[ch], 0.005);
    adj.params[ch] = Object.assign(defaultLevels(), { ib: a.inBlack, iw: a.inWhite });
    syncAdjustUI(); adjSchedule();
  });
  els.cvReset.addEventListener('click', function () {
    if (!adj) return;
    adj.params[adj.params.channel] = defaultCurve();
    adjSchedule();
  });
  startCurves();

  // Ääriviivatyylit, paletit
  Array.prototype.forEach.call(els.contourStyles.children, function (b) {
    b.addEventListener('click', function () { applyContourStyle(b.getAttribute('data-style')); });
  });
  Array.prototype.forEach.call(els.vectorStyles.children, function (b) {
    b.addEventListener('click', function () { applyVectorStyle(b.getAttribute('data-style'), false); });
  });
  els.vecStyleAll.addEventListener('click', function () {
    var name = null;
    Array.prototype.forEach.call(els.vectorStyles.children, function (b) { if (b.getAttribute('aria-pressed') === 'true') name = b.getAttribute('data-style'); });
    if (!name) { notice('Valitse ensin tyyli (Ohut tussi, Paksu sarjakuva tai Lyijykynä).'); return; }
    applyVectorStyle(name, true);
  });
  Array.prototype.forEach.call(document.querySelectorAll('.palette-box'), function (box) {
    var target = box.getAttribute('data-target');
    box.querySelector('[data-pal="add"]').addEventListener('click', function () { addToPalette(paletteInput(target).value); });
    box.querySelector('[data-pal="remove"]').addEventListener('click', function () { paletteRemoving = !paletteRemoving; renderPalettes(); });
  });
  renderPalettes();

  // Muokkaa-valikko ja Kankaan koko -ikkuna
  buildAnchorGrid();
  els.btnEdit.addEventListener('click', function (e) {
    e.stopPropagation();
    if (els.editMenu.hidden) openMenu('edit'); else closeMenu();
  });
  els.btnFile.addEventListener('click', function (e) {
    e.stopPropagation();
    if (els.fileMenu.hidden) openMenu('file'); else closeMenu();
  });
  Array.prototype.forEach.call(els.fileMenu.querySelectorAll('[data-file]'), function (b) {
    b.addEventListener('click', function () { fileAction(b.getAttribute('data-file')); });
  });
  els.btnAdjust.addEventListener('click', function (e) {
    e.stopPropagation();
    if (els.adjustMenu.hidden) openMenu('adjust'); else closeMenu();
  });
  Array.prototype.forEach.call(els.adjustMenu.querySelectorAll('[data-adjust]'), function (b) {
    b.addEventListener('click', function () { closeMenu(); startAdjust(b.getAttribute('data-adjust')); });
  });
  Array.prototype.forEach.call(els.editMenu.querySelectorAll('[data-action]'), function (b) {
    b.addEventListener('click', function () { menuAction(b.getAttribute('data-action')); });
  });
  document.addEventListener('click', function (e) {
    if ((!els.editMenu.hidden && !els.editMenu.contains(e.target)) || (!els.adjustMenu.hidden && !els.adjustMenu.contains(e.target)) ||
        (!els.fileMenu.hidden && !els.fileMenu.contains(e.target))) closeMenu();
  });
  els.canvasApply.addEventListener('click', applyCanvasDialog);
  els.canvasCancel.addEventListener('click', closeCanvasDialog);
  els.canvasModal.addEventListener('click', function (e) { if (e.target === els.canvasModal) closeCanvasDialog(); });
  els.canvasModal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); closeCanvasDialog(); }
    else if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') { e.preventDefault(); applyCanvasDialog(); }
  });
  function canvasRatioSync(from) {
    if (els.canvasLink.value !== 'keep' || !doc) return;
    if (from === 'w') els.canvasH.value = Math.max(1, Math.round(+els.canvasW.value * doc.height / doc.width));
    else els.canvasW.value = Math.max(1, Math.round(+els.canvasH.value * doc.width / doc.height));
  }
  els.canvasW.addEventListener('input', function () { canvasRatioSync('w'); });
  els.canvasH.addEventListener('input', function () { canvasRatioSync('h'); });
  els.canvasLink.addEventListener('change', function () { canvasRatioSync('w'); });

  // Valinnat, täyttö, muunnos, rajaus
  [['new', els.selNew], ['add', els.selAdd], ['sub', els.selSub]].forEach(function (m) {
    m[1].addEventListener('click', function () { setSelModeUI(m[0]); });
  });
  els.selAll.addEventListener('click', selectAll);
  els.selNone.addEventListener('click', selectNone);
  els.selInvert.addEventListener('click', selectInvert);
  els.selExpand.addEventListener('click', function () { selectGrow(1); });
  els.selContract.addEventListener('click', function () { selectGrow(-1); });
  els.selCopy.addEventListener('click', function () { selectionToLayer(false); });
  els.selCut.addEventListener('click', function () { selectionToLayer(true); });
  els.selDelete.addEventListener('click', deleteSelection);
  els.selFill.addEventListener('click', fillSelection);
  [els.fillTol, els.fillGrow, els.wandTol, els.selGrowAmount].forEach(function (el) {
    el.addEventListener('input', updateOutputs);
  });
  els.gradMode.addEventListener('change', function () { els.gradColor2Field.hidden = els.gradMode.value === 'transparent'; });

  els.tfAngle.addEventListener('input', function () {
    if (!tf) return;
    tf.p.rot = +els.tfAngle.value * Math.PI / 180;
    $('tf-angle-out').textContent = els.tfAngle.value + '°';
    updateRangeFill(els.tfAngle);
    tfLive();
  });
  els.tfFlipH.addEventListener('click', function () { if (tf) { tf.p.sx = -tf.p.sx; tfLive(); } });
  els.tfFlipV.addEventListener('click', function () { if (tf) { tf.p.sy = -tf.p.sy; tfLive(); } });
  els.tfRot90.addEventListener('click', function () { if (tf) { tf.p.rot += Math.PI / 2; tfLive(); } });
  els.tfApply.addEventListener('click', function () { endTransform(true); leaveModal(); });
  els.tfCancel.addEventListener('click', function () { endTransform(false); leaveModal(); });
  els.cropRatio.addEventListener('change', cropFitRatio);
  els.cropApply.addEventListener('click', applyCrop);
  els.cropCancel.addEventListener('click', leaveModal);

  // Tekoälyrajauksen napit
  var aiNegativeMode = false;
  function setAiMode(negative) {
    aiNegativeMode = negative;
    els.aiAdd.classList.toggle('is-on', !negative);
    els.aiRemove.classList.toggle('is-on', negative);
    els.aiAdd.setAttribute('aria-pressed', String(!negative));
    els.aiRemove.setAttribute('aria-pressed', String(negative));
  }
  els.aiAdd.addEventListener('click', function () { setAiMode(false); });
  els.aiRemove.addEventListener('click', function () { setAiMode(true); });
  els.aiDone.addEventListener('click', aiCommit);
  els.aiCancel.addEventListener('click', aiCancel);
  els.aiMethod.addEventListener('change', function () {
    if (els.aiMethod.value !== 'color') LineoSam.setModel(els.aiMethod.value);
    dlFiles = {};
    if ($('ai-error')) $('ai-error').hidden = true;
    updateContextPanel();
    aiPrepare();
    if (ai.points.length) aiRun();
  });
  els.aiTolerance.addEventListener('input', function () { updateOutputs(); });
  els.aiTolerance.addEventListener('change', function () { if (ai.points.length && aiMethod() === 'color') aiRun(); });

  Array.prototype.forEach.call(els.toolbar.querySelectorAll('[data-tool]'), function (b) {
    b.addEventListener('click', function () { setTool(b.getAttribute('data-tool')); });
  });
  els.btnUndo.addEventListener('click', undo);
  els.btnRedo.addEventListener('click', redo);

  // Raahaa ja pudota
  var dragDepth = 0;
  function hasFiles(e) { return e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types, 'Files') !== -1; }
  window.addEventListener('dragenter', function (e) {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth++;
    els.dropOverlay.classList.add('is-active');
  });
  window.addEventListener('dragover', function (e) {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });
  window.addEventListener('dragleave', function (e) {
    if (!hasFiles(e)) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) els.dropOverlay.classList.remove('is-active');
  });
  window.addEventListener('drop', function (e) {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth = 0;
    els.dropOverlay.classList.remove('is-active');
    var files = e.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
      if (/^image\//.test(files[i].type) || /\.lineo$/i.test(files[i].name)) { openFile(files[i]); return; }
    }
    toast('Pudotettu tiedosto ei ole kuva eikä Lineo-projekti.', true);
  });

  // Liitä leikepöydältä (Ctrl+V): muualta tullut kuva tai ohjelman oma kopio, kumpi on uudempi.
  window.addEventListener('paste', function (e) {
    if (isTyping(e)) return;
    var items = e.clipboardData && e.clipboardData.items;
    if (items) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].kind === 'file' && /^image\//.test(items[i].type)) {
          var f = items[i].getAsFile();
          if (f) {
            e.preventDefault();
            handlePastedImage(f, f.name);
            return;
          }
        }
      }
    }
    if (doc && clip) { e.preventDefault(); pasteInternal(); }
  });

  function isTyping(e) {
    var t = e.target;
    return t && (t.tagName === 'INPUT' && t.type !== 'range' && t.type !== 'color' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  }

  window.addEventListener('keydown', function (e) {
    var mod = e.ctrlKey || e.metaKey;
    var k = e.key.toLowerCase();
    var cx = els.view.width / 2, cy = els.view.height / 2;
    if (mod && k === 'o') { e.preventDefault(); pickFile(); }
    else if (mod && e.altKey && k === 'n') { e.preventDefault(); newDocument(); }
    else if (mod && k === 's') { e.preventDefault(); if (doc) saveProject(e.shiftKey); }
    else if (mod && k === 'e' && !e.shiftKey && !e.altKey) { e.preventDefault(); if (doc) openExportDialog(); }
    else if ((e.key === '?' || k === 'f1') && !isTyping(e)) { e.preventDefault(); openKeysDialog(); }
    else if (mod && k === '0') { e.preventDefault(); fitView(); }
    else if (mod && k === '1') { e.preventDefault(); zoomTo100(cx, cy); }
    else if (mod && (k === '+' || k === '=')) { e.preventDefault(); zoomAt(cx, cy, 1.25); }
    else if (mod && k === '-') { e.preventDefault(); zoomAt(cx, cy, 0.8); }
    else if (mod && k === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
    else if (mod && (k === 'y' || k === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
    else if (mod && e.altKey && k === 'c' && doc && !isTyping(e)) { e.preventDefault(); openCanvasDialog(); }
    else if (mod && !e.altKey && k === 'c' && doc && !isTyping(e)) { e.preventDefault(); copySelection(); }
    else if (mod && !e.altKey && k === 'x' && doc && !isTyping(e)) { e.preventDefault(); cutSelection(); }
    else if (mod && !e.shiftKey && k === 'i' && doc && !isTyping(e)) { e.preventDefault(); startAdjust('invert'); }
    else if (mod && k === 'u' && doc && !isTyping(e)) { e.preventDefault(); startAdjust('hs'); }
    else if (mod && k === 'l' && doc && !isTyping(e)) { e.preventDefault(); startAdjust('levels'); }
    else if (mod && k === 'm' && doc && !isTyping(e)) { e.preventDefault(); startAdjust('curves'); }
    else if (mod && k === 'a' && doc && !isTyping(e)) { e.preventDefault(); selectAll(); }
    else if (mod && k === 'd' && doc && !isTyping(e)) { e.preventDefault(); selectNone(); }
    else if (mod && e.shiftKey && k === 'i' && doc && !isTyping(e)) { e.preventDefault(); selectInvert(); }
    else if (mod && k === 'j' && doc && !isTyping(e)) { e.preventDefault(); selectionToLayer(false); }
    else if (e.altKey && !mod && (k === 'backspace' || k === 'delete') && doc && !isTyping(e)) { e.preventDefault(); fillSelection(); }
    // [ ja ] muuttavat siveltimen kokoa (suomalaisella näppäimistöllä AltGr-yhdistelmä, siksi muokkausnäppäimiä ei tutkita)
    else if ((e.key === '[' || e.key === ']') && doc && !isTyping(e) && isPaintTool(tool)) { e.preventDefault(); stepBrushSize(e.key === ']' ? 1 : -1); }
    else if (mod || e.altKey || isTyping(e) || !doc) { return; }
    else if (k === ' ') {
      e.preventDefault();
      if (!spaceDown) { spaceDown = true; els.view.classList.add('is-space'); }
    }
    else if (k === 'h') setTool('hand');
    else if (k === 'w') setTool(e.shiftKey ? 'wand' : 'ai');
    else if (k === 'i') setTool('picker');
    else if (k === 'x') { var c1 = els.brushColor.value; els.brushColor.value = els.gradColor2.value; els.gradColor2.value = c1; }
    else if (k === 'd') { els.brushColor.value = '#000000'; els.gradColor2.value = '#ffffff'; }
    else if (k === 'm') setTool('rect');
    else if (k === 'l') setTool('lasso');
    else if (k === 'v') setTool('move');
    else if (k === 'k') setTool('bucket');
    else if (k === 'g') setTool('gradient');
    else if (k === 't') setTool('transform');
    else if (k === 'c') setTool('crop');
    else if (k === 'p') setTool('edit');
    else if (k === 'b') setTool('brush');
    else if (k === 'n') setTool('pen');
    else if (k === 'e') setTool('eraser');
    else if (penSession && (k === 'enter' || k === 'escape')) { e.preventDefault(); finishPen(true); }
    else if (penResume && (k === 'enter' || k === 'escape')) { e.preventDefault(); penResume = null; }
    else if (penSession && (k === 'backspace' || k === 'delete')) { e.preventDefault(); penUndoPoint(); }
    else if (k === 'enter' && adj) { e.preventDefault(); endAdjust(true); }
    else if (k === 'enter' && tool === 'ai') { e.preventDefault(); aiCommit(); }
    else if (k === 'enter' && tool === 'transform') { e.preventDefault(); endTransform(true); leaveModal(); }
    else if (k === 'enter' && tool === 'crop') { e.preventDefault(); applyCrop(); }
    else if (k === 'escape') {
      if (adj) endAdjust(false);
      else if (tool === 'transform') { endTransform(false); leaveModal(); }
      else if (tool === 'crop') leaveModal();
      else if (tool === 'ai' && ai.points.length) aiCancel();
      else if (selection) { selection = null; updateContextPanel(); render(); }
    }
    else if ((k === 'delete' || k === 'backspace') && tool === 'edit' && selection) { e.preventDefault(); deleteSelectedNode(); }
    else if ((k === 'delete' || k === 'backspace') && sel && tool !== 'transform' && tool !== 'crop') { e.preventDefault(); deleteSelection(); }
  });
  window.addEventListener('keyup', function (e) {
    if (e.key === ' ') { spaceDown = false; els.view.classList.remove('is-space'); }
  });
  window.addEventListener('blur', function () { spaceDown = false; els.view.classList.remove('is-space'); });

  // ---------- Osoitin: työkalut, zoomaus ja liikuttelu (hiiri, kosketuslevy, sormet) ----------

  var pointers = new Map();
  var gesture = null;
  var lastTap = { time: 0, x: 0, y: 0 };
  var MOVE_SLOP = 6;

  function canvasPoint(e) {
    var r = els.view.getBoundingClientRect();
    return { x: (e.clientX - r.left) * dpr(), y: (e.clientY - r.top) * dpr() };
  }

  function startPinch() {
    var pts = Array.from(pointers.values());
    if (gesture && gesture.type === 'paint') cancelStroke(gesture);
    else if (gesture && gesture.cancel && gesture.type !== 'tf' && gesture.type !== 'crop') gesture.cancel();
    else finishToolGesture(gesture);
    gesture = {
      type: 'pinch',
      dist: Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y),
      mid: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }
    };
  }

  // Lopettaa kesken olevan pisteen/kahvan raahauksen ja kirjaa sen historiaan.
  function finishToolGesture(g) {
    if (g && g.type === 'paint') { commitStroke(g, null); return; }
    if (g && g.commit) { g.commit(g.last, g.moved); return; }
    if (g && (g.type === 'node' || g.type === 'handle') && g.changed) {
      g.changed = false;
      pushHistory(pathsEntry(g.layer, g.before));
      updateContextPanel();
    }
  }

  els.view.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  els.view.addEventListener('pointerdown', function (e) {
    if (!doc) return;
    if (e.pointerType === 'mouse' && e.button > 2) return;
    e.preventDefault();
    try { els.view.setPointerCapture(e.pointerId); } catch (err) { /* osoitin ehti jo poistua */ }
    var p = canvasPoint(e);
    pointers.set(e.pointerId, p);
    if (pointers.size >= 2) { startPinch(); return; }

    var base = { start: p, last: p, moved: false, button: e.button, alt: e.altKey, shift: e.shiftKey };
    if (spaceDown || e.button === 1 || tool === 'hand' || adj) {
      gesture = Object.assign(base, { type: 'pan', tapZoom: tool === 'hand' });
    } else if (tool === 'picker' || (e.altKey && e.button === 0 && ((isPaintTool(tool) && tool !== 'eraser') || isFillTool(tool)))) {
      gesture = e.button === 0 ? startPick(e, p, base) : Object.assign(base, { type: 'pan' });
    } else if (isPaintTool(tool)) {
      if (e.button !== 0) { gesture = Object.assign(base, { type: 'pan' }); }
      else gesture = startStroke(e, p, base);
    } else if (tool === 'rect' || tool === 'lasso') {
      gesture = e.button === 0 ? startSelectShape(e, p, base) : Object.assign(base, { type: 'pan' });
    } else if (tool === 'wand') {
      gesture = Object.assign(base, { type: 'aitap', tap: function (pt) { doWand(pt, modeFor(base)); } });
    } else if (tool === 'bucket') {
      gesture = Object.assign(base, { type: 'aitap', tap: doBucket });
    } else if (tool === 'gradient') {
      gesture = e.button === 0 ? startGradient(e, p, base) : Object.assign(base, { type: 'pan' });
    } else if (tool === 'move') {
      gesture = e.button === 0 ? startMove(e, p, base) : Object.assign(base, { type: 'pan' });
    } else if (tool === 'transform') {
      gesture = startTfGesture(e, p, base);
    } else if (tool === 'crop') {
      gesture = startCropGesture(e, p, base);
    } else if (tool === 'ai') {
      gesture = Object.assign(base, { type: 'aitap' });
    } else if (tool === 'edit' && penSession && !penDefersToEdit(e, p)) {
      gesture = e.button === 0 ? penDown(e, p, base) : Object.assign(base, { type: 'pan' });
    } else if (tool === 'edit') {
      var hit = hitTest(p);
      if (hit && hit.layer.locked && hit.layer === activeVector()) {
        notice('Taso on lukittu. Avaa lukitus Tasot-osiosta, jos haluat muokata sitä.');
        gesture = Object.assign(base, { type: 'pan' });
      } else if (hit && hit.type === 'segment' && hit.layer !== activeVector()) {
        // Klikkaus toisen tason viivaan valitsee sen tason; jos kohdassa on avoimen viivan pää, viivaa voi jatkaa siitä.
        setActive(hit.layer.id);
        armEndpointAt(hit.layer, toDoc(p));
        gesture = Object.assign(base, { type: 'pan' });
      } else if (hit && hit.type === 'segment') {
        var before = LineoVector.clonePaths(hit.layer.paths);
        var ni = LineoVector.insertNode(hit.layer.paths[hit.path], hit.seg, hit.t);
        selection = { layer: hit.layer, path: hit.path, node: ni };
        touchVector(hit.layer);
        updateContextPanel();
        gesture = Object.assign(base, { type: 'node', layer: hit.layer, before: before, changed: true });
      } else if (hit && hit.type === 'node') {
        var same = selection && selection.layer === hit.layer && selection.path === hit.path && selection.node === hit.node;
        selection = { layer: hit.layer, path: hit.path, node: hit.node };
        updateContextPanel();
        render();
        gesture = Object.assign(base, { type: 'node', layer: hit.layer, before: LineoVector.clonePaths(hit.layer.paths), changed: false, reselect: same });
      } else if (hit && hit.type === 'handle') {
        gesture = Object.assign(base, { type: 'handle', which: hit.which, layer: hit.layer, before: LineoVector.clonePaths(hit.layer.paths), changed: false });
      } else if (e.button !== 0) {
        gesture = Object.assign(base, { type: 'pan', deselect: true });
      } else {
        // Tyhjä kohta: aloita uusi viiva (kynä).
        if (selection) selection = null;
        gesture = penStartAt(e, p, base);
      }
    }
    els.view.classList.add('is-grabbing');
  });

  els.view.addEventListener('pointermove', function (e) {
    if (!pointers.has(e.pointerId) || !gesture) return;
    var p = canvasPoint(e);
    pointers.set(e.pointerId, p);
    if (gesture.type === 'pinch') {
      var pts = Array.from(pointers.values());
      if (pts.length < 2) return;
      var dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      var mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      if (gesture.dist > 0) zoomAt(mid.x, mid.y, dist / gesture.dist);
      panBy(mid.x - gesture.mid.x, mid.y - gesture.mid.y);
      gesture.dist = dist;
      gesture.mid = mid;
      return;
    }
    if (gesture.type === 'paint') {
      if (gesture.stroke) paintMove(gesture, e, p);
      gesture.last = p;
      return;
    }
    if (!gesture.moved) {
      // Pieni värinä ei vielä ole raahausta; kun kynnys ylittyy, liike lasketaan alusta asti.
      if (Math.hypot(p.x - gesture.start.x, p.y - gesture.start.y) <= MOVE_SLOP * dpr()) return;
      gesture.moved = true;
    }
    var dx = (p.x - gesture.last.x) / view.scale, dy = (p.y - gesture.last.y) / view.scale;

    if (gesture.onMove) {
      gesture.onMove(p, e, dx, dy);
      gesture.last = p;
      return;
    }

    if (gesture.type === 'pan' || gesture.type === 'aitap') {
      // Tekoälytyökalussa raahaus liikuttaa näkymää, napautus lisää pisteen.
      if (gesture.moved) panBy(p.x - gesture.last.x, p.y - gesture.last.y);
    } else if (gesture.type === 'node' && gesture.moved) {
      var n = selectedNode();
      n.x += dx; n.y += dy; n.ix += dx; n.iy += dy; n.ox += dx; n.oy += dy;
      gesture.changed = true;
      touchVector(gesture.layer);
    } else if (gesture.type === 'handle' && gesture.moved) {
      var node = selectedNode(), d = toDoc(p);
      var o = gesture.which === 'o' ? ['ox', 'oy', 'ix', 'iy'] : ['ix', 'iy', 'ox', 'oy'];
      node[o[0]] = d.x; node[o[1]] = d.y;
      if (e.altKey || gesture.alt) node.corner = true;
      if (!node.corner) {
        // Sileä piste: vastakkainen kahva pysyy samalla suoralla, pituus säilyy.
        var len = Math.hypot(node[o[2]] - node.x, node[o[3]] - node.y);
        var vx = d.x - node.x, vy = d.y - node.y, vl = Math.hypot(vx, vy) || 1;
        if (len < 0.01) len = vl;
        node[o[2]] = node.x - vx / vl * len;
        node[o[3]] = node.y - vy / vl * len;
      }
      gesture.changed = true;
      touchVector(gesture.layer);
    }
    gesture.last = p;
  });

  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    var p = pointers.get(e.pointerId);
    var g = gesture;
    pointers.delete(e.pointerId);
    if (pointers.size) {
      // Nipistyksestä jäi yksi sormi: jatketaan liikuttelulla.
      var rest = Array.from(pointers.values())[0];
      gesture = { type: 'pan', start: rest, last: rest, moved: true };
      return;
    }
    gesture = null;
    els.view.classList.remove('is-grabbing');
    if (!g || e.type !== 'pointerup') { finishToolGesture(g); return; }

    if (g.type === 'paint') { commitStroke(g, p); return; }
    if (g.commit) { g.commit(p, g.moved); return; }
    if (g.type === 'node' || g.type === 'handle') {
      if (g.changed) { pushHistory(pathsEntry(g.layer, g.before)); updateContextPanel(); }
      if (g.type === 'node' && !g.moved && g.reselect && isDoubleTap(p)) toggleSelectedNode();
      else if (!g.moved) { rememberTap(p); if (g.type === 'node') armEndpoint(); }
      return;
    }
    if (g.moved) return;
    if (g.type === 'aitap') {
      if (g.tap) g.tap(p);
      else aiAddPoint(toDoc(p), aiNegativeMode || g.alt || g.button === 2);
      return;
    }
    if (g.type === 'pan') {
      if (g.deselect && selection) { selection = null; updateContextPanel(); render(); }
      if (g.tapZoom && isDoubleTap(p)) {
        if (view.fitted) zoomTo100(p.x, p.y); else fitView();
      } else {
        rememberTap(p);
        // Käsityökalulla napautus viivaan tai piirrokseen valitsee sen tason, jolloin sen asetuksia (esim. viivan paksuutta) voi muokata.
        if (g.tapZoom && g.button !== 2) {
          var picked = layerAtPoint(p);
          if (picked && picked.id !== doc.activeId) { setActive(picked.id); notice('Valittu: ' + picked.name); }
        }
      }
    }
  }

  // Päällimmäinen taso, jonka viiva tai piirros on napautetussa kohdassa (vektoriviiva tai ei-läpinäkyvä pikseli lähellä).
  function layerAtPoint(p) {
    var h = hitTest(p);
    if (h && h.layer && h.layer.visible) return h.layer;
    var d = toDoc(p), r = Math.max(2, Math.round(hitRadius() / view.scale));
    var x0 = Math.max(0, Math.round(d.x) - r), y0 = Math.max(0, Math.round(d.y) - r);
    var w = Math.min(doc.width, Math.round(d.x) + r + 1) - x0, hh = Math.min(doc.height, Math.round(d.y) + r + 1) - y0;
    if (w <= 0 || hh <= 0) return null;
    for (var i = doc.layers.length - 1; i >= 0; i--) {
      var L = doc.layers[i];
      if (L.kind !== 'raster' || !L.visible || L.id === 'original' || L.id === 'contour' || !L.canvas) continue;
      var a = L.canvas.getContext('2d').getImageData(x0, y0, w, hh).data;
      for (var k = 3; k < a.length; k += 4) if (a[k] > 24) return L;
    }
    return null;
  }

  function rememberTap(p) { lastTap = { time: Date.now(), x: p.x, y: p.y }; }
  function isDoubleTap(p) {
    var hit = Date.now() - lastTap.time < 320 && Math.hypot(p.x - lastTap.x, p.y - lastTap.y) < 30 * dpr();
    lastTap.time = 0;
    return hit;
  }

  els.view.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    hover = canvasPoint(e);
    if (isPaintTool(tool)) render();
  });
  els.view.addEventListener('pointerleave', function () {
    hover = null;
    if (isPaintTool(tool)) render();
  });

  els.view.addEventListener('pointerup', endPointer);
  els.view.addEventListener('pointercancel', endPointer);

  els.view.addEventListener('wheel', function (e) {
    if (!doc) return;
    e.preventDefault();
    var p = canvasPoint(e);
    var dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1);
    var dx = e.deltaX * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1);
    if (e.ctrlKey || e.metaKey || !e.deltaX && Math.abs(dy) >= 40 && !e.shiftKey) {
      // Rulla tai kosketuslevyn nipistys (ctrlKey) zoomaa kursorin kohdalta.
      zoomAt(p.x, p.y, Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0015)));
    } else {
      // Kosketuslevyn kahden sormen vieritys liikuttaa kuvaa.
      panBy(-(e.shiftKey ? dy : dx) * dpr(), -(e.shiftKey ? 0 : dy) * dpr());
    }
  }, { passive: false });

  // Safari: estetään koko sivun zoomaus nipistäessä, kuva zoomataan itse.
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (type) {
    document.addEventListener(type, function (e) { e.preventDefault(); }, { passive: false });
  });

  els.btnFit.addEventListener('click', fitView);

  // ---------- Sivupaneeli puhelimessa ----------

  els.btnPanel.addEventListener('click', function () {
    var collapsed = document.body.classList.toggle('panel-collapsed');
    els.btnPanel.setAttribute('aria-expanded', String(!collapsed));
  });

  // ---------- Asennettu sovellus: kuvien avaus käyttöjärjestelmästä ----------

  if ('launchQueue' in window && window.launchQueue && window.launchQueue.setConsumer) {
    window.launchQueue.setConsumer(async function (params) {
      if (params.files && params.files.length) {
        var fh = params.files[0], f = await fh.getFile();
        await openFile(f);
        if (doc && /\.lineo$/i.test(f.name) && fh.createWritable) doc.fileHandle = fh;   // Ctrl+S tallentaa samaan tiedostoon
      }
    });
  }

  // ---------- Service worker: toimii ilman verkkoa ----------
  // Ei file://-osoitteessa: silloin ohjelma toimii suoraan tiedostoista ilman sitä.

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(function (err) {
        console.warn('Service workerin rekisteröinti epäonnistui', err);
      });
    });
  }

  new ResizeObserver(resizeCanvas).observe(els.workspace);

  updateOutputs();
  buildLayerList();
  updateLayerActions();
  resizeCanvas();

  // Testejä varten
  window.Lineo = {
    openFile: openFile,
    setTool: setTool,
    undo: undo,
    redo: redo,
    toDoc: toDoc,
    toScreen: toScreen,
    get doc() { return doc; },
    get ai() { return ai; },
    get selection() { return selection; },
    get paint() { return paint; },
    get sel() { return sel; },
    get tf() { return tf; },
    get crop() { return crop; },
    get clip() { return clip; },
    get adj() { return adj; },
    renderExportCanvas: renderExportCanvas,
    buildProjectBlob: buildProjectBlob,
    selectionFromVector: selectionFromVector,
    exportSvgBlob: exportSvgBlob,
    updateFileLabel: updateFileLabel,
    get palette() { return palette; },
    get contourStyle() { return contourStyle; },
    startAdjust: startAdjust,
    setSelection: setSelection,
    selectAll: selectAll
  };
})();
