/*
 * Lineo – automaattiset ääriviivat (reunantunnistus).
 *
 * Putki: harmaasävy → Gaussin sumennus (kohinan poisto) → Sobel-gradientti
 * → ei-maksimien vaimennus → hystereesikynnystys (tarkkuus) → pienten
 * palojen poisto → etäisyysmuunnos (viivan paksuus, pehmeät reunat).
 *
 * Välivaiheet tallennetaan välimuistiin, joten pelkän paksuuden tai värin
 * muutos on lähes välitön ja tarkkuuden muutos nopea. Funktio LineoEdgeCore
 * muutetaan tekstiksi ja ajetaan Blob-workerissa (toimii myös file://-osoitteesta).
 */
function LineoEdgeCore() {
  'use strict';

  var W = 0, H = 0, gray = null;
  var gradCache = { sigma: -1, nms: null };
  var edgeCache = { key: '', edges: null, count: 0 };
  var distCache = { key: '', dist: null };

  function setImage(rgba, w, h) {
    W = w; H = h;
    var n = w * h;
    gray = new Float32Array(n);
    for (var i = 0, j = 0; i < n; i++, j += 4) {
      var lum = 0.299 * rgba[j] + 0.587 * rgba[j + 1] + 0.114 * rgba[j + 2];
      var a = rgba[j + 3] / 255;
      // Läpinäkyvät alueet tulkitaan valkoiseksi paperiksi.
      gray[i] = 255 - a * (255 - lum);
    }
    gradCache = { sigma: -1, nms: null };
    edgeCache = { key: '', edges: null, count: 0 };
    distCache = { key: '', dist: null };
  }

  // --- Sumennus: kolme laatikkosumennusta ≈ Gaussin sumennus, O(n) ---

  function boxesForGauss(sigma, n) {
    var wIdeal = Math.sqrt((12 * sigma * sigma / n) + 1);
    var wl = Math.floor(wIdeal);
    if (wl % 2 === 0) wl--;
    var wu = wl + 2;
    var mIdeal = (12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4);
    var m = Math.round(mIdeal);
    var radii = [];
    for (var i = 0; i < n; i++) radii.push(((i < m ? wl : wu) - 1) / 2);
    return radii;
  }

  function boxBlurH(src, dst, r) {
    var inv = 1 / (r + r + 1), last = W - 1;
    for (var y = 0; y < H; y++) {
      var row = y * W, val = 0, k;
      for (k = -r; k <= r; k++) val += src[row + (k < 0 ? 0 : k > last ? last : k)];
      for (var x = 0; x < W; x++) {
        dst[row + x] = val * inv;
        var add = x + r + 1, sub = x - r;
        val += src[row + (add > last ? last : add)] - src[row + (sub < 0 ? 0 : sub)];
      }
    }
  }

  // Pystysumennus riveittäin: sarakekohtaiset juoksevat summat pitävät muistihaut peräkkäisinä.
  function boxBlurV(src, dst, r) {
    var inv = 1 / (r + r + 1), last = H - 1;
    var sums = new Float32Array(W), x, k;
    for (k = -r; k <= r; k++) {
      var row = (k < 0 ? 0 : k > last ? last : k) * W;
      for (x = 0; x < W; x++) sums[x] += src[row + x];
    }
    for (var y = 0; y < H; y++) {
      var o = y * W, add = y + r + 1, sub = y - r;
      var ao = (add > last ? last : add) * W, so = (sub < 0 ? 0 : sub) * W;
      for (x = 0; x < W; x++) {
        dst[o + x] = sums[x] * inv;
        sums[x] += src[ao + x] - src[so + x];
      }
    }
  }

  function gaussBlur(src, sigma) {
    var a = new Float32Array(src), b = new Float32Array(src.length);
    var radii = boxesForGauss(sigma, 3);
    for (var i = 0; i < radii.length; i++) {
      if (radii[i] < 1) continue;
      boxBlurH(a, b, radii[i]);
      boxBlurV(b, a, radii[i]);
    }
    return a;
  }

  // --- Gradientti + ei-maksimien vaimennus ---

  // Sobel-gradientin suuruus ja suunta neljään luokkaan pyöristettynä.
  function sobel(b, mag, dir) {
    for (var y = 1; y < H - 1; y++) {
      for (var x = 1; x < W - 1; x++) {
        var i = y * W + x;
        var tl = b[i - W - 1], t = b[i - W], tr = b[i - W + 1];
        var l = b[i - 1], r = b[i + 1];
        var bl = b[i + W - 1], bo = b[i + W], br = b[i + W + 1];
        var gx = (tr + 2 * r + br) - (tl + 2 * l + bl);
        var gy = (bl + 2 * bo + br) - (tl + 2 * t + tr);
        mag[i] = Math.sqrt(gx * gx + gy * gy);
        var ax = gx < 0 ? -gx : gx, ay = gy < 0 ? -gy : gy;
        if (ay <= ax * 0.41421356) dir[i] = 0;          // vaakasuora gradientti
        else if (ay >= ax * 2.41421356) dir[i] = 2;     // pystysuora gradientti
        else dir[i] = (gx * gy > 0) ? 1 : 3;            // vinot
      }
    }
  }

  function computeGradient(sigma) {
    if (gradCache.sigma === sigma && gradCache.nms) return gradCache;
    var b = sigma > 0.3 ? gaussBlur(gray, sigma) : gray;
    var n = W * H;
    var mag = new Float32Array(n);
    var dir = new Uint8Array(n);
    sobel(b, mag, dir);
    b = null;

    var nms = new Float32Array(n);
    var x, y, i;
    for (y = 1; y < H - 1; y++) {
      for (x = 1; x < W - 1; x++) {
        i = y * W + x;
        var m = mag[i];
        if (m < 1) continue;
        var n1, n2;
        switch (dir[i]) {
          case 0: n1 = mag[i - 1]; n2 = mag[i + 1]; break;
          case 2: n1 = mag[i - W]; n2 = mag[i + W]; break;
          case 1: n1 = mag[i - W - 1]; n2 = mag[i + W + 1]; break;
          default: n1 = mag[i - W + 1]; n2 = mag[i + W - 1]; break;
        }
        if (m >= n1 && m > n2) nms[i] = m;
      }
    }
    mag = null; dir = null;

    gradCache = { sigma: sigma, nms: nms };
    edgeCache = { key: '', edges: null, count: 0 };
    distCache = { key: '', dist: null };
    return gradCache;
  }

  // Tarkkuus 0–100 → pienin sävyero (harmaasävyinä 0–255), joka lasketaan reunaksi.
  // Sobelin vaste sumennetulle askelreunalle on ≈ 3,19 · kontrasti / σ, joten
  // kynnys muunnetaan gradienttiyksiköiksi kokonaissumennuksen avulla. Näin tulos
  // ei riipu kuvan koosta (esikatselu = täysi tarkkuus) eikä kohinan poistosta.
  function thresholds(detail, sigma, s) {
    var contrast = 80 * Math.pow(3 / 80, detail / 100);    // 80 … 3 sävyä
    var sigmaTot = Math.sqrt(sigma * sigma + 0.64 * s * s);
    var high = Math.min(4, 3.19 / sigmaTot) * contrast;
    return { high: high, low: high * 0.4 };
  }

  // --- Hystereesi + lyhyiden palojen poisto ---

  function traceEdges(nms, high, low, minLen) {
    var n = W * H;
    var state = new Uint8Array(n);     // 0 = ei, 1 = reuna, 2 = hylätty
    var members = new Int32Array(n);
    var stack = new Int32Array(1 << 16);
    var offs = [-W - 1, -W, -W + 1, -1, 1, W - 1, W, W + 1];
    var count = 0;
    for (var s = 0; s < n; s++) {
      if (state[s] !== 0 || nms[s] < high) continue;
      var sp = 0, mc = 0;
      stack[sp++] = s; state[s] = 1;
      while (sp > 0) {
        var p = stack[--sp];
        members[mc++] = p;
        for (var k = 0; k < 8; k++) {
          var q = p + offs[k];
          if (state[q] === 0 && nms[q] >= low) {
            state[q] = 1;
            if (sp >= stack.length) {
              var bigger = new Int32Array(stack.length * 2);
              bigger.set(stack);
              stack = bigger;
            }
            stack[sp++] = q;
          }
        }
      }
      if (mc < minLen) {
        for (var m = 0; m < mc; m++) state[members[m]] = 2;
      } else {
        count += mc;
      }
    }
    for (var i = 0; i < n; i++) if (state[i] !== 1) state[i] = 0;
    return { edges: state, count: count };
  }

  // --- Rajattu euklidinen etäisyysmuunnos ---
  // Viivan paksuus on enintään 24 px, joten etäisyydet tarvitaan vain
  // MAX_DIST pikseliin asti. Ensin pystyetäisyys sarakkeittain (riveittäin
  // läpikäyden), sitten tarkka 2D-etäisyys d² = min(dx² + pystyetäisyys²).

  var MAX_DIST = 14;

  function distanceTransform(edges) {
    var n = W * H, C = MAX_DIST, x, y, i;
    var vd = new Uint8Array(n);
    // Ylhäältä alas
    for (x = 0; x < W; x++) vd[x] = edges[x] ? 0 : C;
    for (y = 1; y < H; y++) {
      var o = y * W, po = o - W;
      for (x = 0; x < W; x++) {
        i = o + x;
        if (edges[i]) vd[i] = 0;
        else { var up = vd[po + x] + 1; vd[i] = up < C ? up : C; }
      }
    }
    // Alhaalta ylös
    for (y = H - 2; y >= 0; y--) {
      var o2 = y * W, no = o2 + W;
      for (x = 0; x < W; x++) {
        var dn = vd[no + x] + 1;
        if (dn < vd[o2 + x]) vd[o2 + x] = dn;
      }
    }
    // Vaakasuunta: jokainen lähellä reunaa oleva sarakepiste leimaa naapurinsa.
    var BIG = C * C + 1;
    var dist = new Uint16Array(n).fill(BIG);
    for (y = 0; y < H; y++) {
      var ro = y * W;
      for (x = 0; x < W; x++) {
        var v = vd[ro + x];
        if (v >= C) continue;
        var v2 = v * v;
        var x0 = x - C < 0 ? 0 : x - C, x1 = x + C >= W ? W - 1 : x + C;
        for (var xx = x0; xx <= x1; xx++) {
          var dx = xx - x, cand = dx * dx + v2;
          if (cand < dist[ro + xx]) dist[ro + xx] = cand;
        }
      }
    }
    return dist;
  }

  // --- Ajo ---

  function run(p) {
    if (!gray) throw new Error('Ei kuvaa');
    var t0 = Date.now();
    // Isoissa kuvissa sumennus ja palojen minimipituus skaalautuvat kuvan koon mukaan.
    // p.scale annetaan esikatselulle, jotta se vastaa täyden resoluution tulosta.
    var s = p.scale || Math.max(1, Math.max(W, H) / 1600);
    var sigma = Math.round((0.6 + p.noise * 0.034) * s * 100) / 100;
    var minLen = Math.round(p.noise * p.noise * 0.014 * s);   // 0 … 140 px

    var g = computeGradient(sigma);
    var th = thresholds(p.detail, sigma, s);
    var key = sigma + '|' + th.high.toFixed(3) + '|' + minLen;
    if (edgeCache.key !== key) {
      var tr = traceEdges(g.nms, th.high, th.low, minLen);
      edgeCache = { key: key, edges: tr.edges, count: tr.count };
      distCache = { key: '', dist: null };
    }
    if (distCache.key !== key) {
      distCache = { key: key, dist: distanceTransform(edgeCache.edges) };
    }

    var dist = distCache.dist, n = W * H;
    var out = new Uint8ClampedArray(n * 4);
    var rr = p.thickness / 2 + 0.5, lim = rr * rr;
    var cr = p.color[0], cg = p.color[1], cb = p.color[2];
    for (var i = 0, j = 0; i < n; i++, j += 4) {
      var d2 = dist[i];
      if (d2 >= lim) continue;
      var a = rr - Math.sqrt(d2);
      out[j] = cr; out[j + 1] = cg; out[j + 2] = cb;
      out[j + 3] = a >= 1 ? 255 : a * 255;
    }
    return { rgba: out, width: W, height: H, edgePixels: edgeCache.count, ms: Date.now() - t0 };
  }

  return { setImage: setImage, run: run };
}

// Workerissa on kaksi ydintä: täysi resoluutio ja kevyt esikatselu liukusäätimen raahausta varten.
function LineoEdgeWorkerMain(scope, makeCore) {
  var cores = { full: makeCore(), preview: makeCore() };
  scope.onmessage = function (e) {
    var m = e.data;
    try {
      var core = cores[m.target];
      if (m.type === 'image') {
        core.setImage(new Uint8ClampedArray(m.buffer), m.width, m.height);
      } else if (m.type === 'run') {
        var r = core.run(m.params);
        scope.postMessage({
          type: 'result', id: m.id, target: m.target, buffer: r.rgba.buffer,
          width: r.width, height: r.height, edgePixels: r.edgePixels, ms: r.ms
        }, [r.rgba.buffer]);
      }
    } catch (err) {
      scope.postMessage({ type: 'error', id: m.id, message: String(err && err.message || err) });
    }
  };
}
