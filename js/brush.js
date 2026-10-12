/*
 * Lineo – sivellin, tussi ja pyyhekumi.
 *
 * Viiva piirretään leimaamalla pyöreä kärki tasaisin välein pyyhkäisyn reunalle.
 * Mukana: pehmeä kärki (kovuus), stabilointi (viivaimen "naru"), kaareva viiva
 * hiiren/sormen pisteiden välillä ja kynän paine.
 *
 * Käyttö:
 *   var s = LineoBrush.createStroke(ctx, { size, hardness, color, erase, rope, pressure });
 *   s.begin(x, y, paine); s.move(x, y, paine); ...; var alue = s.end(x, y, paine);
 * Koordinaatit ovat tason pikseleitä. end() palauttaa muuttuneen alueen {x, y, w, h}.
 */
var LineoBrush = (function () {
  'use strict';

  function hexToRgb(hex) {
    var v = parseInt(String(hex).slice(1), 16) || 0;
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }

  // Pehmeä kärki esipiirrettynä: täysi väri keskellä, reunaa kohti pehmeä häivytys.
  function makeSoftTip(diameter, hardness, rgb) {
    var d = Math.max(2, Math.min(1024, Math.ceil(diameter)));
    var c = document.createElement('canvas');
    c.width = c.height = d;
    var x = c.getContext('2d'), r = d / 2;
    var h = Math.max(0, Math.min(0.99, hardness / 100));
    var g = x.createRadialGradient(r, r, 0, r, r, r);
    var col = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',';
    g.addColorStop(0, col + '1)');
    if (h > 0) g.addColorStop(h, col + '1)');
    // Kosinikäyrä sileämpi kuin suora häivytys
    for (var i = 1; i <= 8; i++) {
      var t = i / 8;
      g.addColorStop(h + (1 - h) * t, col + (0.5 * (1 + Math.cos(Math.PI * t))).toFixed(3) + ')');
    }
    x.fillStyle = g;
    x.fillRect(0, 0, d, d);
    return c;
  }

  // opts: size (px), hardness (0–100), color (#rrggbb), erase (bool),
  //       rope (stabilointinarun pituus tason pikseleinä, 0 = ei stabilointia),
  //       pressure (bool: paine muuttaa kokoa)
  function createStroke(ctx, opts) {
    var size = Math.max(0.5, opts.size);
    var hard = opts.hardness >= 100;
    var rgb = hexToRgb(opts.color);
    var rope = Math.max(0, opts.rope || 0);
    var usePressure = !!opts.pressure;
    var tip = hard ? null : makeSoftTip(size, opts.hardness, opts.erase ? [0, 0, 0] : rgb);
    var cw = ctx.canvas.width, ch = ctx.canvas.height;

    var bx = 0, by = 0;          // narun pää eli sivellin
    var pts = [];                // sivellinpisteet (stabiloitu reitti)
    var carry = 0;               // matka edellisestä leimasta
    var dirty = null;
    var batch = null;           // viimeisen takeDirty-kutsun jälkeen muuttunut alue
    var active = false;

    function sizeAt(pr) {
      return usePressure ? size * (0.2 + 0.8 * Math.max(0, Math.min(1, pr))) : size;
    }
    function spacingAt(pr) { return Math.max(0.6, sizeAt(pr) * 0.07); }

    function stamp(x, y, pr) {
      var d = sizeAt(pr), r = d / 2;
      if (hard) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.drawImage(tip, x - r, y - r, d, d);
      }
      var m = r + 2;
      dirty = grow(dirty, x, y, m);
      batch = grow(batch, x, y, m);
    }

    function grow(b, x, y, m) {
      if (!b) return { x0: x - m, y0: y - m, x1: x + m, y1: y + m };
      if (x - m < b.x0) b.x0 = x - m;
      if (y - m < b.y0) b.y0 = y - m;
      if (x + m > b.x1) b.x1 = x + m;
      if (y + m > b.y1) b.y1 = y + m;
      return b;
    }

    function clampBox(d) {
      if (!d) return null;
      var x0 = Math.max(0, Math.floor(d.x0)), y0 = Math.max(0, Math.floor(d.y0));
      var x1 = Math.min(cw, Math.ceil(d.x1)), y1 = Math.min(ch, Math.ceil(d.y1));
      return x1 > x0 && y1 > y0 ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
    }

    // Leimat tasaisin välein suoralle pätkälle; jäännösmatka siirtyy seuraavalle.
    function line(x0, y0, p0, x1, y1, p1) {
      var dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
      if (len === 0) return;
      var t = Math.max(0, spacingAt(p0) - carry), last = -1;
      while (t <= len) {
        var u = t / len, pr = p0 + (p1 - p0) * u;
        stamp(x0 + dx * u, y0 + dy * u, pr);
        last = t;
        t += spacingAt(pr);
      }
      carry = last < 0 ? carry + len : len - last;
    }

    // Toisen asteen Bézier-kaari pilkottuna lyhyiksi suoriksi.
    function curve(x0, y0, p0, cx, cy, x1, y1, p1) {
      var approx = Math.hypot(cx - x0, cy - y0) + Math.hypot(x1 - cx, y1 - cy);
      var n = Math.max(1, Math.ceil(approx / Math.max(2, spacingAt(p0) * 2)));
      var px = x0, py = y0, pp = p0;
      for (var i = 1; i <= n; i++) {
        var t = i / n, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
        var x = a * x0 + b * cx + c * x1, y = a * y0 + b * cy + c * y1;
        var pr = p0 + (p1 - p0) * t;
        line(px, py, pp, x, y, pr);
        px = x; py = y; pp = pr;
      }
    }

    function mid(a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, p: (a.p + b.p) / 2 }; }

    function addPoint(p) {
      pts.push(p);
      var n = pts.length;
      if (n === 2) {
        var m = mid(pts[0], pts[1]);
        line(pts[0].x, pts[0].y, pts[0].p, m.x, m.y, m.p);
      } else if (n > 2) {
        var m1 = mid(pts[n - 3], pts[n - 2]), m2 = mid(pts[n - 2], pts[n - 1]);
        curve(m1.x, m1.y, m1.p, pts[n - 2].x, pts[n - 2].y, m2.x, m2.y, m2.p);
      }
    }

    // Stabilointi: sivellin seuraa osoitinta narun päässä.
    function follow(x, y) {
      if (rope <= 0) { bx = x; by = y; return; }
      var dx = x - bx, dy = y - by, dist = Math.hypot(dx, dy);
      if (dist > rope) {
        bx += dx / dist * (dist - rope);
        by += dy / dist * (dist - rope);
      }
    }

    return {
      begin: function (x, y, pr) {
        pr = pr == null ? 1 : pr;
        ctx.save();
        ctx.globalCompositeOperation = opts.erase ? 'destination-out' : 'source-over';
        ctx.globalAlpha = 1;
        ctx.fillStyle = opts.erase ? '#000' : opts.color;
        bx = x; by = y;
        pts = [{ x: x, y: y, p: pr }];
        carry = 0;
        active = true;
        stamp(x, y, pr);    // pelkkä napautus jättää pisteen
      },
      move: function (x, y, pr) {
        if (!active) return;
        pr = pr == null ? 1 : pr;
        var ox = bx, oy = by;
        follow(x, y);
        if (bx === ox && by === oy && pts.length > 1) return;
        addPoint({ x: bx, y: by, p: pr });
      },
      end: function (x, y, pr) {
        if (!active) return null;
        pr = pr == null ? 1 : pr;
        // Viiva jatkuu osoittimen viimeiseen kohtaan asti.
        if (x != null && (x !== bx || y !== by)) { bx = x; by = y; addPoint({ x: x, y: y, p: pr }); }
        var last = pts[pts.length - 1], n = pts.length;
        if (n > 1) {
          var m = mid(pts[n - 2], last);
          line(m.x, m.y, m.p, last.x, last.y, last.p);
        }
        ctx.restore();
        active = false;
        return clampBox(dirty);
      },
      // Alue, joka on muuttunut edellisen kutsun jälkeen (valintaan rajaamista varten).
      takeDirty: function () {
        var b = clampBox(batch);
        batch = null;
        return b;
      },
      // Keskeytys: palauttaa piirtotilan, kutsuja palauttaa kuvan itse.
      abort: function () {
        if (active) { ctx.restore(); active = false; }
      }
    };
  }

  return { createStroke: createStroke };
})();
