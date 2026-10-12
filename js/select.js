/*
 * Lineo – valinnan laskenta (ilman käyttöliittymää).
 *
 * Valinta on rajattu alfamaski: { x, y, w, h, a } missä a on Uint8Array (0–255, w*h) ja (x, y) on
 * maskin vasen yläkulma kuvassa. Tyhjä valinta on null. Valintaa ei muuteta paikallaan: jokainen
 * toiminto palauttaa uuden, joten kumoa/tee uudelleen voi säilyttää viitteitä.
 */
var LineoSelect = (function () {
  'use strict';

  // Koko kuvan kokoisesta maskista (w*h, arvo > 0 = valittu) rajattu valinta.
  function fromMask(mask, W, H) {
    var x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (var y = 0; y < H; y++) {
      var row = y * W;
      for (var x = 0; x < W; x++) {
        if (mask[row + x]) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          y1 = y;
        }
      }
    }
    if (x1 < 0) return null;
    var w = x1 - x0 + 1, h = y1 - y0 + 1, a = new Uint8Array(w * h);
    for (var yy = 0; yy < h; yy++) {
      for (var xx = 0; xx < w; xx++) {
        var v = mask[(y0 + yy) * W + x0 + xx];
        a[yy * w + xx] = v ? (v === 1 ? 255 : v) : 0;
      }
    }
    return { x: x0, y: y0, w: w, h: h, a: a };
  }

  // Rajattu alfamaski (esim. canvasista luettu) → valinta, jonka reunat on trimmattu tyhjästä.
  function fromAlpha(a, x, y, w, h) {
    var x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (var j = 0; j < h; j++) {
      for (var i = 0; i < w; i++) {
        if (a[j * w + i]) {
          if (i < x0) x0 = i;
          if (i > x1) x1 = i;
          if (j < y0) y0 = j;
          y1 = j;
        }
      }
    }
    if (x1 < 0) return null;
    var nw = x1 - x0 + 1, nh = y1 - y0 + 1;
    if (nw === w && nh === h) return { x: x, y: y, w: w, h: h, a: a };
    var out = new Uint8Array(nw * nh);
    for (var yy = 0; yy < nh; yy++) {
      out.set(a.subarray((y0 + yy) * w + x0, (y0 + yy) * w + x0 + nw), yy * nw);
    }
    return { x: x + x0, y: y + y0, w: nw, h: nh, a: out };
  }

  function rect(x, y, w, h, W, H) {
    var x0 = Math.max(0, Math.round(x)), y0 = Math.max(0, Math.round(y));
    var x1 = Math.min(W, Math.round(x + w)), y1 = Math.min(H, Math.round(y + h));
    if (x1 <= x0 || y1 <= y0) return null;
    var rw = x1 - x0, rh = y1 - y0, a = new Uint8Array(rw * rh);
    a.fill(255);
    return { x: x0, y: y0, w: rw, h: rh, a: a };
  }

  function contains(sel, px, py) {
    if (!sel) return false;
    var x = Math.floor(px) - sel.x, y = Math.floor(py) - sel.y;
    return x >= 0 && y >= 0 && x < sel.w && y < sel.h && sel.a[y * sel.w + x] > 127;
  }

  // mode: 'new' | 'add' | 'sub' | 'int' (leikkaus)
  function combine(base, next, mode) {
    if (mode === 'new') return next;
    if (!base) return mode === 'add' ? next : null;
    if (!next) return mode === 'int' ? null : base;
    var x0, y0, x1, y1;
    if (mode === 'int') {
      // Leikkaus: pienempi arvo kummastakin
      x0 = Math.max(base.x, next.x); y0 = Math.max(base.y, next.y);
      x1 = Math.min(base.x + base.w, next.x + next.w); y1 = Math.min(base.y + base.h, next.y + next.h);
      if (x1 <= x0 || y1 <= y0) return null;
      var iw = x1 - x0, ih = y1 - y0, ia = new Uint8Array(iw * ih);
      for (var iy = 0; iy < ih; iy++) {
        for (var ix = 0; ix < iw; ix++) {
          var va = base.a[(y0 + iy - base.y) * base.w + (x0 + ix - base.x)];
          var vb = next.a[(y0 + iy - next.y) * next.w + (x0 + ix - next.x)];
          ia[iy * iw + ix] = va < vb ? va : vb;
        }
      }
      return fromAlpha(ia, x0, y0, iw, ih);
    }
    if (mode === 'add') {
      x0 = Math.min(base.x, next.x); y0 = Math.min(base.y, next.y);
      x1 = Math.max(base.x + base.w, next.x + next.w); y1 = Math.max(base.y + base.h, next.y + next.h);
    } else {
      x0 = base.x; y0 = base.y; x1 = base.x + base.w; y1 = base.y + base.h;
    }
    var w = x1 - x0, h = y1 - y0, out = new Uint8Array(w * h);
    var y, x;
    for (y = 0; y < base.h; y++) {
      out.set(base.a.subarray(y * base.w, (y + 1) * base.w), (base.y + y - y0) * w + (base.x - x0));
    }
    for (y = 0; y < next.h; y++) {
      var oy = next.y + y - y0;
      if (oy < 0 || oy >= h) continue;
      for (x = 0; x < next.w; x++) {
        var ox = next.x + x - x0;
        if (ox < 0 || ox >= w) continue;
        var n = next.a[y * next.w + x];
        if (!n) continue;
        var i = oy * w + ox;
        if (mode === 'add') { if (n > out[i]) out[i] = n; }
        else out[i] = Math.round(out[i] * (255 - n) / 255);
      }
    }
    return fromAlpha(out, x0, y0, w, h);
  }

  function invert(sel, W, H) {
    var out = new Uint8Array(W * H);
    out.fill(255);
    if (sel) {
      for (var y = 0; y < sel.h; y++) {
        var gy = sel.y + y;
        if (gy < 0 || gy >= H) continue;
        for (var x = 0; x < sel.w; x++) {
          var gx = sel.x + x;
          if (gx < 0 || gx >= W) continue;
          out[gy * W + gx] = 255 - sel.a[y * sel.w + x];
        }
      }
    }
    return fromAlpha(out, 0, 0, W, H);
  }

  function shift(sel, dx, dy) {
    return sel ? { x: sel.x + dx, y: sel.y + dy, w: sel.w, h: sel.h, a: sel.a } : null;
  }

  // Valinta kuvan rajojen sisään.
  function clip(sel, W, H) {
    if (!sel) return null;
    if (sel.x >= 0 && sel.y >= 0 && sel.x + sel.w <= W && sel.y + sel.h <= H) return sel;
    var x0 = Math.max(0, sel.x), y0 = Math.max(0, sel.y);
    var x1 = Math.min(W, sel.x + sel.w), y1 = Math.min(H, sel.y + sel.h);
    if (x1 <= x0 || y1 <= y0) return null;
    var w = x1 - x0, h = y1 - y0, out = new Uint8Array(w * h);
    for (var y = 0; y < h; y++) {
      var from = (y0 + y - sel.y) * sel.w + (x0 - sel.x);
      out.set(sel.a.subarray(from, from + w), y * w);
    }
    return { x: x0, y: y0, w: w, h: h, a: out };
  }

  // Laajennus (n > 0) tai supistus (n < 0) n pikselillä, neljän naapurin askelin.
  function grow(sel, n, W, H) {
    if (!sel || !n) return sel;
    var steps = Math.abs(n), expand = n > 0;
    var pad = expand ? steps : 0;
    var w = sel.w + pad * 2, h = sel.h + pad * 2;
    var cur = new Uint8Array(w * h), nxt, x, y;
    for (y = 0; y < sel.h; y++) cur.set(sel.a.subarray(y * sel.w, (y + 1) * sel.w), (y + pad) * w + pad);
    nxt = new Uint8Array(w * h);
    for (var s = 0; s < steps; s++) {
      for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
          var i = y * w + x, v = cur[i];
          var l = x > 0 ? cur[i - 1] : 0, r = x < w - 1 ? cur[i + 1] : 0;
          var u = y > 0 ? cur[i - w] : 0, d = y < h - 1 ? cur[i + w] : 0;
          nxt[i] = expand ? Math.max(v, l, r, u, d) : Math.min(v, l, r, u, d);
        }
      }
      var t = cur; cur = nxt; nxt = t;
    }
    return clip(fromAlpha(cur, sel.x - pad, sel.y - pad, w, h), W, H);
  }

  // Samanväristen pikselien alue. Vertailu klikkauspisteen väriin: suurin kanavaero (RGBA) <= tol.
  // contiguous = vain yhtenäinen alue klikatusta pisteestä, muuten koko kuvasta.
  // Palauttaa koko kuvan kokoisen maskin (Uint8Array, 255 = mukana).
  function similarRegion(rgba, W, H, sx, sy, tol, contiguous) {
    var out = new Uint8Array(W * H);
    sx = Math.max(0, Math.min(W - 1, Math.floor(sx)));
    sy = Math.max(0, Math.min(H - 1, Math.floor(sy)));
    var s0 = (sy * W + sx) * 4;
    var r0 = rgba[s0], g0 = rgba[s0 + 1], b0 = rgba[s0 + 2], a0 = rgba[s0 + 3];
    function match(p) {
      var i = p * 4;
      var dr = rgba[i] - r0, dg = rgba[i + 1] - g0, db = rgba[i + 2] - b0, da = rgba[i + 3] - a0;
      if (dr < 0) dr = -dr; if (dg < 0) dg = -dg; if (db < 0) db = -db; if (da < 0) da = -da;
      // Läpinäkyvillä pikseleillä väri ei merkitse: vertaillaan vain alfaa.
      if (a0 < 8 && rgba[i + 3] < 8) return true;
      return dr <= tol && dg <= tol && db <= tol && da <= tol;
    }
    var p, i2;
    if (!contiguous) {
      for (p = 0, i2 = W * H; p < i2; p++) if (match(p)) out[p] = 255;
      return out;
    }
    var stack = new Int32Array(Math.max(1024, (W * H) >> 3)), sp = 0;
    var start = sy * W + sx;
    out[start] = 255;
    stack[sp++] = start;
    while (sp) {
      p = stack[--sp];
      var x = p % W, y = (p - x) / W, q;
      for (var k = 0; k < 4; k++) {
        if (k === 0) { if (x === 0) continue; q = p - 1; }
        else if (k === 1) { if (x === W - 1) continue; q = p + 1; }
        else if (k === 2) { if (y === 0) continue; q = p - W; }
        else { if (y === H - 1) continue; q = p + W; }
        if (out[q] || !match(q)) continue;
        out[q] = 255;
        if (sp >= stack.length) { var bigger = new Int32Array(stack.length * 2); bigger.set(stack); stack = bigger; }
        stack[sp++] = q;
      }
    }
    return out;
  }

  // Valinnan reuna pikselirajoina (yhdistetyt suorat pätkät). Kutsuja piirtää tulokset.
  // Palauttaa taulukon [x0, y0, x1, y1, ...] kuvakoordinaateissa.
  function outlineSegments(sel) {
    var segs = [], w = sel.w, h = sel.h, a = sel.a, ox = sel.x, oy = sel.y;
    function inside(x, y) { return x >= 0 && y >= 0 && x < w && y < h && a[y * w + x] > 127; }
    var vstart = new Int32Array(w + 1).fill(-1);
    var y, x;
    for (y = 0; y <= h; y++) {
      // Vaakareunat rivien y-1 ja y välissä
      var run = -1;
      for (x = 0; x <= w; x++) {
        var e = x < w && inside(x, y - 1) !== inside(x, y);
        if (e && run < 0) run = x;
        else if (!e && run >= 0) { segs.push(ox + run, oy + y, ox + x, oy + y); run = -1; }
      }
      // Pystyreunat sarakerajoilla (pystypätkät yhdistetään riveittäin)
      if (y < h) {
        for (x = 0; x <= w; x++) {
          var v = inside(x - 1, y) !== inside(x, y);
          if (v && vstart[x] < 0) vstart[x] = y;
          else if (!v && vstart[x] >= 0) { segs.push(ox + x, oy + vstart[x], ox + x, oy + y); vstart[x] = -1; }
        }
      }
    }
    for (x = 0; x <= w; x++) {
      if (vstart[x] >= 0) segs.push(ox + x, oy + vstart[x], ox + x, oy + h);
    }
    return segs;
  }

  return {
    fromMask: fromMask,
    fromAlpha: fromAlpha,
    rect: rect,
    contains: contains,
    combine: combine,
    invert: invert,
    shift: shift,
    clip: clip,
    grow: grow,
    similarRegion: similarRegion,
    outlineSegments: outlineSegments
  };
})();

if (typeof module !== 'undefined') module.exports = LineoSelect;
