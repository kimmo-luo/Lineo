/*
 * Lineo – vektoriääriviivat.
 *
 * Rajausmaski (0/1-pikselit) → reunaviivat (marching squares) → yksinkertaistus
 * (Ramer–Douglas–Peucker) → Bézier-käyrät, joissa on muokattavat pisteet ja kahvat.
 *
 * Polku: { closed: true, nodes: [{ x, y, ix, iy, ox, oy, corner }] }
 *   x, y   = ankkuripiste kuvan koordinaateissa
 *   ix, iy = sisääntulokahva (edellisestä pisteestä tuleva käyrä)
 *   ox, oy = ulosmenokahva (seuraavaan pisteeseen lähtevä käyrä)
 *   corner = terävä kulma: kahvoja ei peilata toisiinsa
 */
var LineoVector = (function () {
  'use strict';

  // ---------- Maskin siivous ----------

  // Merkitsee 4-yhtenäiset alueet. Palauttaa { labels, areas, touchesBorder }.
  function labelComponents(mask, w, h, value) {
    var labels = new Int32Array(w * h);
    var areas = [0], border = [false];
    var stack = new Int32Array(Math.max(1024, w * h >> 2));
    var next = 1;
    for (var s = 0; s < w * h; s++) {
      if (labels[s] || mask[s] !== value) continue;
      var id = next++, area = 0, edge = false, sp = 0;
      labels[s] = id;
      stack[sp++] = s;
      while (sp) {
        var p = stack[--sp], x = p % w, y = (p - x) / w;
        area++;
        if (x === 0 || y === 0 || x === w - 1 || y === h - 1) edge = true;
        var nb = [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1];
        for (var k = 0; k < 4; k++) {
          var q = nb[k];
          if (q >= 0 && !labels[q] && mask[q] === value) {
            labels[q] = id;
            if (sp >= stack.length) { var b = new Int32Array(stack.length * 2); b.set(stack); stack = b; }
            stack[sp++] = q;
          }
        }
      }
      areas.push(area);
      border.push(edge);
    }
    return { labels: labels, areas: areas, touchesBorder: border };
  }

  // Poistaa pienet irralliset palat ja täyttää pienet reiät.
  function cleanMask(mask, w, h) {
    var out = new Uint8Array(w * h), i;
    var fg = labelComponents(mask, w, h, 1);
    var largest = 0;
    for (i = 1; i < fg.areas.length; i++) largest = Math.max(largest, fg.areas[i]);
    var minArea = Math.max(24, largest * 0.02);
    for (i = 0; i < w * h; i++) {
      var l = fg.labels[i];
      if (l && fg.areas[l] >= minArea) out[i] = 1;
    }
    var bg = labelComponents(out, w, h, 0);
    var minHole = Math.max(24, largest * 0.004);
    for (i = 0; i < w * h; i++) {
      var b = bg.labels[i];
      if (b && !bg.touchesBorder[b] && bg.areas[b] < minHole) out[i] = 1;
    }
    return out;
  }

  // ---------- Marching squares ----------

  // Pehmennetty kenttä: 3×3-keskiarvo, jotta porrasreuna muuttuu sileäksi viivaksi.
  function smoothField(mask, w, h) {
    // Reunoille 1 px nollakehys, jotta kaikki viivat sulkeutuvat.
    var W = w + 2, H = h + 2, f = new Float32Array(W * H), g = new Float32Array(W * H), x, y;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) f[(y + 1) * W + x + 1] = mask[y * w + x];
    for (y = 1; y < H - 1; y++) {
      for (x = 1; x < W - 1; x++) {
        var i = y * W + x;
        g[i] = (f[i - W - 1] + f[i - W] + f[i - W + 1] + f[i - 1] + f[i] + f[i + 1] + f[i + W - 1] + f[i + W] + f[i + W + 1]) / 9;
      }
    }
    return { f: g, W: W, H: H };
  }

  // Palauttaa suljetut viivat [{x,y}] maskin koordinaateissa.
  function traceContours(mask, w, h) {
    var sf = smoothField(mask, w, h), f = sf.f, W = sf.W, H = sf.H, T = 0.5;
    var segs = new Map(); // reunan avain → [toinen pää, piste]
    function edgePoint(x, y, e) {
      // e: 0 ylä, 1 oikea, 2 ala, 3 vasen (solun (x,y) reunat)
      var a, b, ax, ay, bx, by;
      if (e === 0) { ax = x; ay = y; bx = x + 1; by = y; }
      else if (e === 1) { ax = x + 1; ay = y; bx = x + 1; by = y + 1; }
      else if (e === 2) { ax = x; ay = y + 1; bx = x + 1; by = y + 1; }
      else { ax = x; ay = y; bx = x; by = y + 1; }
      a = f[ay * W + ax]; b = f[by * W + bx];
      var t = (T - a) / (b - a);
      if (!(t >= 0 && t <= 1)) t = 0.5;
      // Kentän piste fx = maskin pikselin (fx-1) keskikohta = jatkuva koordinaatti fx-0,5.
      return { x: ax + (bx - ax) * t - 0.5, y: ay + (by - ay) * t - 0.5 };
    }
    function key(x, y, e) {
      // Jaettu reuna saa saman avaimen molemmista soluista.
      if (e === 0) return 'h' + x + ',' + y;
      if (e === 2) return 'h' + x + ',' + (y + 1);
      if (e === 3) return 'v' + x + ',' + y;
      return 'v' + (x + 1) + ',' + y;
    }
    // Suunnattu janataulukko: sisäpuoli aina samalla puolella → viivat yhtenäisessä kierrossa.
    var TABLE = {
      1: [[3, 2]], 2: [[2, 1]], 3: [[3, 1]], 4: [[1, 0]], 5: [[3, 0], [1, 2]], 6: [[2, 0]], 7: [[3, 0]],
      8: [[0, 3]], 9: [[0, 2]], 10: [[0, 1], [2, 3]], 11: [[0, 1]], 12: [[1, 3]], 13: [[1, 2]], 14: [[2, 3]]
    };
    var starts = [];
    for (var y = 0; y < H - 1; y++) {
      for (var x = 0; x < W - 1; x++) {
        var tl = f[y * W + x] > T, tr = f[y * W + x + 1] > T, br = f[(y + 1) * W + x + 1] > T, bl = f[(y + 1) * W + x] > T;
        var c = (tl ? 8 : 0) | (tr ? 4 : 0) | (br ? 2 : 0) | (bl ? 1 : 0);
        var list = TABLE[c];
        if (!list) continue;
        for (var k = 0; k < list.length; k++) {
          var e0 = list[k][0], e1 = list[k][1];
          var k0 = key(x, y, e0), k1 = key(x, y, e1);
          segs.set(k0, { to: k1, p: edgePoint(x, y, e0) });
          starts.push(k0);
        }
      }
    }
    var loops = [], used = new Set();
    for (var s = 0; s < starts.length; s++) {
      var start = starts[s];
      if (used.has(start)) continue;
      var loop = [], cur = start, guard = 0;
      while (cur && !used.has(cur) && guard++ < 1e7) {
        used.add(cur);
        var seg = segs.get(cur);
        if (!seg) break;
        loop.push(seg.p);
        cur = seg.to;
      }
      if (loop.length >= 3) loops.push(loop);
    }
    return loops;
  }

  function polygonArea(pts) {
    var a = 0;
    for (var i = 0, n = pts.length; i < n; i++) {
      var p = pts[i], q = pts[(i + 1) % n];
      a += p.x * q.y - q.x * p.y;
    }
    return a / 2;
  }

  // ---------- Yksinkertaistus ----------

  function rdp(pts, a, b, eps, keep) {
    var ax = pts[a].x, ay = pts[a].y, bx = pts[b].x, by = pts[b].y;
    var dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy, maxD = -1, idx = -1;
    for (var i = a + 1; i < b; i++) {
      var px = pts[i].x - ax, py = pts[i].y - ay, d;
      if (len2 === 0) d = px * px + py * py;
      else { var c = px * dy - py * dx; d = c * c / len2; }
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > eps * eps) {
      keep[idx] = 1;
      rdp(pts, a, idx, eps, keep);
      rdp(pts, idx, b, eps, keep);
    }
  }

  function simplifyClosed(pts, eps) {
    var n = pts.length;
    if (n < 4) return pts.slice();
    // Jaetaan silmukka kahteen osaan kaukaisimpien pisteiden kohdalta.
    var far = 0, best = -1;
    for (var i = 1; i < n; i++) {
      var d = (pts[i].x - pts[0].x) * (pts[i].x - pts[0].x) + (pts[i].y - pts[0].y) * (pts[i].y - pts[0].y);
      if (d > best) { best = d; far = i; }
    }
    var ring = pts.concat([pts[0]]);
    var keep = new Uint8Array(n + 1);
    keep[0] = keep[far] = keep[n] = 1;
    rdp(ring, 0, far, eps, keep);
    rdp(ring, far, n, eps, keep);
    var out = [];
    for (i = 0; i < n; i++) if (keep[i]) out.push({ x: ring[i].x, y: ring[i].y });
    return out;
  }

  // ---------- Bézier-sovitus ----------

  // Catmull-Rom → kuutiollinen Bézier. Jyrkät käännökset jäävät teräviksi kulmiksi.
  function fitNodes(pts, closed) {
    var n = pts.length, nodes = [];
    for (var i = 0; i < n; i++) {
      var p = pts[i];
      var prev = pts[(i - 1 + n) % n], next = pts[(i + 1) % n];
      var node = { x: p.x, y: p.y, ix: p.x, iy: p.y, ox: p.x, oy: p.y, corner: false };
      if (closed || (i > 0 && i < n - 1)) {
        var v1x = p.x - prev.x, v1y = p.y - prev.y, v2x = next.x - p.x, v2y = next.y - p.y;
        var l1 = Math.hypot(v1x, v1y), l2 = Math.hypot(v2x, v2y);
        var cos = l1 && l2 ? (v1x * v2x + v1y * v2y) / (l1 * l2) : 1;
        if (cos < 0.2) {   // suunta kääntyy yli ~78° → kulma
          node.corner = true;
        } else {
          var tx = next.x - prev.x, ty = next.y - prev.y, tl = Math.hypot(tx, ty) || 1;
          node.ix = p.x - tx / tl * l1 / 3; node.iy = p.y - ty / tl * l1 / 3;
          node.ox = p.x + tx / tl * l2 / 3; node.oy = p.y + ty / tl * l2 / 3;
        }
      }
      nodes.push(node);
    }
    return nodes;
  }

  // Maski → siistityt reunaviivat kuvan koordinaateissa (scale = maskin pikseli → kuvan pikseli).
  function maskToLoops(mask, w, h, scale) {
    scale = scale || 1;
    var loops = traceContours(cleanMask(mask, w, h), w, h);
    var maxArea = 0, areas = loops.map(function (l) { var a = Math.abs(polygonArea(l)); maxArea = Math.max(maxArea, a); return a; });
    var out = [];
    loops.forEach(function (loop, i) {
      if (areas[i] < maxArea * 0.002 || areas[i] < 12) return;
      out.push(loop.map(function (p) { return { x: p.x * scale, y: p.y * scale }; }));
    });
    return out;
  }

  // Reunaviivat → muokattavat Bézier-polut. detail 0–100: kuinka tarkasti käyrä
  // seuraa rajausta (enemmän pisteitä). diag = kuvan lävistäjä pikseleinä.
  function loopsToPaths(loops, detail, diag) {
    if (detail == null) detail = 50;
    var eps = Math.max(0.35, (diag / 900) * (3.2 - detail * 0.028));
    var paths = [];
    loops.forEach(function (loop) {
      if (loop[0] && loop[0].o) {
        // Avoin viiva (esim. kahden rajatun alueen välinen raja): päät pysyvät paikallaan.
        var keep = new Uint8Array(loop.length), open = [];
        keep[0] = keep[loop.length - 1] = 1;
        if (loop.length > 2) rdp(loop, 0, loop.length - 1, eps, keep);
        for (var i = 0; i < loop.length; i++) if (keep[i]) open.push({ x: loop[i].x, y: loop[i].y });
        if (open.length >= 2) paths.push({ closed: false, nodes: fitNodes(open, false) });
        return;
      }
      var pts = simplifyClosed(loop, eps);
      if (pts.length >= 3) paths.push({ closed: true, nodes: fitNodes(pts, true) });
    });
    return paths;
  }

  function maskToPaths(mask, w, h, opts) {
    opts = opts || {};
    var scale = opts.scale || 1;
    return loopsToPaths(maskToLoops(mask, w, h, scale), opts.detail, Math.hypot(w, h) * scale);
  }

  // ---------- Piirto ----------

  function buildPath2D(paths) {
    var p2 = new Path2D();
    paths.forEach(function (path) { appendPath(p2, path); });
    return p2;
  }

  function appendPath(ctx, path) {
    var nodes = path.nodes, n = nodes.length;
    if (!n) return;
    ctx.moveTo(nodes[0].x, nodes[0].y);
    var last = path.closed ? n : n - 1;
    for (var i = 0; i < last; i++) {
      var a = nodes[i], b = nodes[(i + 1) % n];
      ctx.bezierCurveTo(a.ox, a.oy, b.ix, b.iy, b.x, b.y);
    }
    if (path.closed) ctx.closePath();
  }

  // ---------- Geometria muokkausta varten ----------

  function bezPoint(a, b, t) {
    var mt = 1 - t;
    var x = mt * mt * mt * a.x + 3 * mt * mt * t * a.ox + 3 * mt * t * t * b.ix + t * t * t * b.x;
    var y = mt * mt * mt * a.y + 3 * mt * mt * t * a.oy + 3 * mt * t * t * b.iy + t * t * t * b.y;
    return { x: x, y: y };
  }

  // Lähin kohta polun käyrällä: { seg, t, x, y, dist }
  function nearestOnPath(path, px, py) {
    var nodes = path.nodes, n = nodes.length, best = null;
    var last = path.closed ? n : n - 1;
    for (var i = 0; i < last; i++) {
      var a = nodes[i], b = nodes[(i + 1) % n];
      var steps = 24, bt = 0, bd = Infinity;
      for (var s = 0; s <= steps; s++) {
        var q = bezPoint(a, b, s / steps), d = (q.x - px) * (q.x - px) + (q.y - py) * (q.y - py);
        if (d < bd) { bd = d; bt = s / steps; }
      }
      // Tarkennus puolitushaulla
      var lo = Math.max(0, bt - 1 / steps), hi = Math.min(1, bt + 1 / steps);
      for (var r = 0; r < 12; r++) {
        var t1 = lo + (hi - lo) / 3, t2 = hi - (hi - lo) / 3;
        var q1 = bezPoint(a, b, t1), q2 = bezPoint(a, b, t2);
        var d1 = (q1.x - px) * (q1.x - px) + (q1.y - py) * (q1.y - py);
        var d2 = (q2.x - px) * (q2.x - px) + (q2.y - py) * (q2.y - py);
        if (d1 < d2) hi = t2; else lo = t1;
      }
      var t = (lo + hi) / 2, qp = bezPoint(a, b, t), dist = Math.hypot(qp.x - px, qp.y - py);
      if (!best || dist < best.dist) best = { seg: i, t: t, x: qp.x, y: qp.y, dist: dist };
    }
    return best;
  }

  // Lisää pisteen janalle seg kohtaan t muuttamatta käyrän muotoa (de Casteljau).
  function insertNode(path, seg, t) {
    var nodes = path.nodes, n = nodes.length;
    var a = nodes[seg], b = nodes[(seg + 1) % n];
    function lerp(p, q) { return { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t }; }
    var p0 = { x: a.x, y: a.y }, p1 = { x: a.ox, y: a.oy }, p2 = { x: b.ix, y: b.iy }, p3 = { x: b.x, y: b.y };
    var q0 = lerp(p0, p1), q1 = lerp(p1, p2), q2 = lerp(p2, p3);
    var r0 = lerp(q0, q1), r1 = lerp(q1, q2), s = lerp(r0, r1);
    a.ox = q0.x; a.oy = q0.y;
    b.ix = q2.x; b.iy = q2.y;
    var node = { x: s.x, y: s.y, ix: r0.x, iy: r0.y, ox: r1.x, oy: r1.y, corner: false };
    nodes.splice(seg + 1, 0, node);
    return seg + 1;
  }

  // Tekee pisteestä sileän: kahvat naapurien suuntaisesti (Catmull-Rom).
  function smoothNode(path, idx) {
    var nodes = path.nodes, n = nodes.length, p = nodes[idx];
    var prev = nodes[(idx - 1 + n) % n], next = nodes[(idx + 1) % n];
    if (!path.closed && (idx === 0 || idx === n - 1)) return;
    var tx = next.x - prev.x, ty = next.y - prev.y, tl = Math.hypot(tx, ty) || 1;
    var l1 = Math.hypot(p.x - prev.x, p.y - prev.y), l2 = Math.hypot(next.x - p.x, next.y - p.y);
    p.ix = p.x - tx / tl * l1 / 3; p.iy = p.y - ty / tl * l1 / 3;
    p.ox = p.x + tx / tl * l2 / 3; p.oy = p.y + ty / tl * l2 / 3;
    p.corner = false;
  }

  function cornerNode(node) {
    node.ix = node.x; node.iy = node.y;
    node.ox = node.x; node.oy = node.y;
    node.corner = true;
  }

  function clonePaths(paths) {
    return paths.map(function (p) {
      return { closed: p.closed, nodes: p.nodes.map(function (n) { return Object.assign({}, n); }) };
    });
  }

  function countNodes(paths) {
    var c = 0;
    paths.forEach(function (p) { c += p.nodes.length; });
    return c;
  }

  // ---------- Varatapa ilman tekoälyä: värialueen rajaus ----------

  // Täyttää klikatusta pisteestä samanväriset, yhtenäiset pikselit. rgba = kuvan data.
  function colorRegion(rgba, w, h, sx, sy, tolerance) {
    var out = new Uint8Array(w * h);
    sx = Math.max(0, Math.min(w - 1, Math.round(sx)));
    sy = Math.max(0, Math.min(h - 1, Math.round(sy)));
    // Värin vertailu klikkauspisteen ympäristön keskiarvoon (5×5), ettei yksittäinen pikseli ratkaise.
    var r = 0, g = 0, b = 0, c = 0;
    for (var yy = -2; yy <= 2; yy++) for (var xx = -2; xx <= 2; xx++) {
      var px = Math.max(0, Math.min(w - 1, sx + xx)), py = Math.max(0, Math.min(h - 1, sy + yy)), j = (py * w + px) * 4;
      r += rgba[j]; g += rgba[j + 1]; b += rgba[j + 2]; c++;
    }
    r /= c; g /= c; b /= c;
    var tol2 = tolerance * tolerance * 3;
    var stack = new Int32Array(Math.max(1024, w * h >> 2)), sp = 0, s = sy * w + sx;
    out[s] = 1; stack[sp++] = s;
    while (sp) {
      var p = stack[--sp], x = p % w, y = (p - x) / w;
      var nb = [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1];
      for (var k = 0; k < 4; k++) {
        var q = nb[k];
        if (q < 0 || out[q]) continue;
        var i = q * 4, dr = rgba[i] - r, dg = rgba[i + 1] - g, db = rgba[i + 2] - b;
        if (dr * dr + dg * dg + db * db <= tol2) {
          out[q] = 1;
          if (sp >= stack.length) { var bigger = new Int32Array(stack.length * 2); bigger.set(stack); stack = bigger; }
          stack[sp++] = q;
        }
      }
    }
    return out;
  }

  return {
    cleanMask: cleanMask,
    traceContours: traceContours,
    simplifyClosed: simplifyClosed,
    fitNodes: fitNodes,
    maskToLoops: maskToLoops,
    loopsToPaths: loopsToPaths,
    maskToPaths: maskToPaths,
    buildPath2D: buildPath2D,
    appendPath: appendPath,
    nearestOnPath: nearestOnPath,
    insertNode: insertNode,
    smoothNode: smoothNode,
    cornerNode: cornerNode,
    clonePaths: clonePaths,
    countNodes: countNodes,
    colorRegion: colorRegion
  };
})();
