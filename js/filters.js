/*
 * Lineo – säädöt ja suotimet (pikselilaskenta ilman käyttöliittymää).
 *
 * Kaikki funktiot muokkaavat RGBA-dataa (Uint8ClampedArray, ei-esikerrottu) paikallaan.
 * Esikatselua varten isoista kuvista tehdään pienennetty kopio, jolloin pikselimääräiset
 * parametrit (sumennuksen säde) skaalataan scale-arvolla.
 */
var LineoFilters = (function () {
  'use strict';

  function clamp8(v) { return v < 0 ? 0 : v > 255 ? 255 : v; }

  // ---------- Hakutaulukot (kirkkaus/kontrasti, levels, käyrät) ----------

  function applyLUT(d, lr, lg, lb) {
    for (var i = 0; i < d.length; i += 4) {
      d[i] = lr[d[i]];
      d[i + 1] = lg[d[i + 1]];
      d[i + 2] = lb[d[i + 2]];
    }
  }

  // Kirkkaus ja kontrasti, molemmat −100…100 (Photoshopin vanha tapa).
  function brightnessContrastLUT(brightness, contrast) {
    var lut = new Uint8ClampedArray(256);
    var c = contrast * 2.55;
    var f = (259 * (c + 255)) / (255 * (259 - c));
    var b = brightness * 2.55;
    for (var v = 0; v < 256; v++) lut[v] = Math.round(f * (v - 128) + 128 + b);
    return lut;
  }

  // Levels: tulomusta/-valkoinen, gamma (1 = ei muutosta), lähtömusta/-valkoinen
  function levelsLUT(inBlack, gamma, inWhite, outBlack, outWhite) {
    var lut = new Uint8ClampedArray(256);
    var range = Math.max(1, inWhite - inBlack), g = 1 / Math.max(0.01, gamma);
    for (var v = 0; v < 256; v++) {
      var t = Math.max(0, Math.min(1, (v - inBlack) / range));
      lut[v] = Math.round(outBlack + Math.pow(t, g) * (outWhite - outBlack));
    }
    return lut;
  }

  // Käyrä pisteistä [{x, y}] (x kasvava, 0…255): monotoninen kuutiointerpolointi.
  function curveLUT(points) {
    var n = points.length, lut = new Uint8ClampedArray(256), i;
    if (n < 2) { for (i = 0; i < 256; i++) lut[i] = i; return lut; }
    var xs = points.map(function (p) { return p.x; }), ys = points.map(function (p) { return p.y; });
    var dx = [], m = [], t = [];
    for (i = 0; i < n - 1; i++) { dx[i] = xs[i + 1] - xs[i]; m[i] = (ys[i + 1] - ys[i]) / dx[i]; }
    t[0] = m[0]; t[n - 1] = m[n - 2];
    for (i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    for (i = 0; i < n - 1; i++) {
      if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
      var a = t[i] / m[i], b = t[i + 1] / m[i], h = a * a + b * b;
      if (h > 9) { var s = 3 / Math.sqrt(h); t[i] = s * a * m[i]; t[i + 1] = s * b * m[i]; }
    }
    var seg = 0;
    for (var x = 0; x < 256; x++) {
      if (x <= xs[0]) { lut[x] = ys[0]; continue; }
      if (x >= xs[n - 1]) { lut[x] = ys[n - 1]; continue; }
      while (seg < n - 2 && x > xs[seg + 1]) seg++;
      var u = (x - xs[seg]) / dx[seg], u2 = u * u, u3 = u2 * u;
      var v = (2 * u3 - 3 * u2 + 1) * ys[seg] + (u3 - 2 * u2 + u) * dx[seg] * t[seg] +
        (-2 * u3 + 3 * u2) * ys[seg + 1] + (u3 - u2) * dx[seg] * t[seg + 1];
      lut[x] = Math.round(v);
    }
    return lut;
  }

  function composeLUT(first, second) {
    var out = new Uint8ClampedArray(256);
    for (var v = 0; v < 256; v++) out[v] = second[first[v]];
    return out;
  }

  function identityLUT() {
    var l = new Uint8ClampedArray(256);
    for (var i = 0; i < 256; i++) l[i] = i;
    return l;
  }

  // ---------- Värisäädöt ----------

  function brightnessContrast(d, brightness, contrast) {
    var l = brightnessContrastLUT(brightness, contrast);
    applyLUT(d, l, l, l);
  }

  // Sävy −180…180 astetta, kylläisyys −100…100, vaaleus −100…100 (HSL).
  function hueSaturation(d, hue, sat, light) {
    var hs = hue / 360, sf = sat / 100, lf = light / 100;
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, h = 0, s = 0;
      if (max !== min) {
        var dd = max - min;
        s = l > 0.5 ? dd / (2 - max - min) : dd / (max + min);
        if (max === r) h = (g - b) / dd + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / dd + 2;
        else h = (r - g) / dd + 4;
        h /= 6;
      }
      h = (h + hs) % 1; if (h < 0) h += 1;
      s = sf >= 0 ? s + (1 - s) * sf : s * (1 + sf);
      l = lf >= 0 ? l + (1 - l) * lf : l * (1 + lf);
      var rr, gg, bb;
      if (s === 0) { rr = gg = bb = l; }
      else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
        rr = hue2rgb(p, q, h + 1 / 3); gg = hue2rgb(p, q, h); bb = hue2rgb(p, q, h - 1 / 3);
      }
      d[i] = Math.round(rr * 255); d[i + 1] = Math.round(gg * 255); d[i + 2] = Math.round(bb * 255);
    }
  }
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  function grayscale(d) {
    for (var i = 0; i < d.length; i += 4) {
      var y = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
      d[i] = d[i + 1] = d[i + 2] = y;
    }
  }

  function invert(d) {
    for (var i = 0; i < d.length; i += 4) { d[i] = 255 - d[i]; d[i + 1] = 255 - d[i + 1]; d[i + 2] = 255 - d[i + 2]; }
  }

  // Histogrammi (näkyville, alfalla painotettuna): { rgb, r, g, b } (Uint32Array 256)
  function histogram(d) {
    var h = { rgb: new Uint32Array(256), r: new Uint32Array(256), g: new Uint32Array(256), b: new Uint32Array(256) };
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 8) continue;
      h.r[d[i]]++; h.g[d[i + 1]]++; h.b[d[i + 2]]++;
      h.rgb[Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])]++;
    }
    return h;
  }

  // Automaattinen levels: leikataan clip (0…1) osuus kummastakin päästä.
  function autoLevels(hist, clip) {
    var total = 0, i;
    for (i = 0; i < 256; i++) total += hist[i];
    if (!total) return { inBlack: 0, inWhite: 255 };
    var lim = total * clip, acc = 0, lo = 0, hi = 255;
    for (i = 0; i < 256; i++) { acc += hist[i]; if (acc > lim) { lo = i; break; } }
    acc = 0;
    for (i = 255; i >= 0; i--) { acc += hist[i]; if (acc > lim) { hi = i; break; } }
    if (hi - lo < 2) { lo = 0; hi = 255; }
    return { inBlack: lo, inWhite: hi };
  }

  // ---------- Sumennus ja terävöinti ----------

  // Laatikkosumennuksen leveydet gaussin approksimaatiolle (3 kierrosta).
  function boxSizes(sigma, n) {
    var wIdeal = Math.sqrt(12 * sigma * sigma / n + 1);
    var wl = Math.floor(wIdeal); if (wl % 2 === 0) wl--;
    var wu = wl + 2;
    var mIdeal = (12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4);
    var m = Math.round(mIdeal), sizes = [];
    for (var i = 0; i < n; i++) sizes.push(i < m ? wl : wu);
    return sizes;
  }

  // Laatikkosumennuksen yksi kierros (vaaka tai pysty) 4 kanavalle. Reunat toistetaan.
  function boxPass(src, dst, w, h, r, horizontal) {
    var len = horizontal ? w : h, lines = horizontal ? h : w;
    var stride = horizontal ? 4 : w * 4, lineStride = horizontal ? w * 4 : 4;
    var div = 2 * r + 1;
    for (var ln = 0; ln < lines; ln++) {
      var base = ln * lineStride;
      for (var c = 0; c < 4; c++) {
        var first = src[base + c];
        var sum = (r + 1) * first, i;
        for (i = 1; i < r; i++) sum += src[base + Math.min(i, len - 1) * stride + c];
        for (i = 0; i < len; i++) {
          sum += src[base + Math.min(i + r, len - 1) * stride + c];
          dst[base + i * stride + c] = sum / div;
          sum -= i - r < 0 ? first : src[base + (i - r) * stride + c];
        }
      }
    }
  }

  function blurPremultiplied(buf, w, h, radius) {
    if (radius < 0.3) return;
    var sizes = boxSizes(radius, 3), tmp = new Float32Array(buf.length);
    for (var i = 0; i < 3; i++) {
      var r = (sizes[i] - 1) / 2;
      boxPass(buf, tmp, w, h, r, true);
      boxPass(tmp, buf, w, h, r, false);
    }
  }

  // Esikerrotun datan Float32-kopio, sumennus, takaisin ei-esikerrottuna.
  function blur(d, w, h, radius) {
    if (radius < 0.3) return;
    var n = d.length, f = new Float32Array(n), i;
    for (i = 0; i < n; i += 4) {
      var a = d[i + 3] / 255;
      f[i] = d[i] * a; f[i + 1] = d[i + 1] * a; f[i + 2] = d[i + 2] * a; f[i + 3] = d[i + 3];
    }
    blurPremultiplied(f, w, h, radius);
    for (i = 0; i < n; i += 4) {
      var al = f[i + 3] / 255;
      if (al <= 0.0001) { d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0; continue; }
      d[i] = clamp8(Math.round(f[i] / al)); d[i + 1] = clamp8(Math.round(f[i + 1] / al));
      d[i + 2] = clamp8(Math.round(f[i + 2] / al)); d[i + 3] = clamp8(Math.round(f[i + 3]));
    }
  }

  // Unsharp mask: amount (0…5, 1 = 100 %), radius px, threshold 0…255
  function sharpen(d, w, h, amount, radius, threshold) {
    var copy = new Uint8ClampedArray(d);
    blur(copy, w, h, radius);
    for (var i = 0; i < d.length; i += 4) {
      for (var c = 0; c < 3; c++) {
        var diff = d[i + c] - copy[i + c];
        if (Math.abs(diff) > threshold) d[i + c] = clamp8(Math.round(d[i + c] + amount * diff));
      }
    }
  }

  // ---------- Lyijykynän pinta ----------

  function hash2(x, y) {
    var h = (x * 374761393 + y * 668265263) | 0;
    h = (h ^ (h >>> 13)) * 1274126177 | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  }

  // Himmentää viivojen läpinäkyvyyttä rakeisella, hieman vinoon suuntautuneella kuviolla.
  function pencilGrain(d, w, h) {
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4;
        if (!d[i + 3]) continue;
        var n1 = hash2(x >> 1, y >> 1), n2 = hash2((x + y) >> 2, (x - y) >> 3);
        var g = 0.35 + 0.65 * (0.55 * n1 + 0.45 * n2);
        d[i + 3] = Math.round(d[i + 3] * g);
      }
    }
  }

  return {
    brightnessContrastLUT: brightnessContrastLUT,
    levelsLUT: levelsLUT,
    curveLUT: curveLUT,
    composeLUT: composeLUT,
    identityLUT: identityLUT,
    applyLUT: applyLUT,
    brightnessContrast: brightnessContrast,
    hueSaturation: hueSaturation,
    grayscale: grayscale,
    invert: invert,
    histogram: histogram,
    autoLevels: autoLevels,
    blur: blur,
    sharpen: sharpen,
    pencilGrain: pencilGrain
  };
})();

if (typeof module !== 'undefined') module.exports = LineoFilters;
