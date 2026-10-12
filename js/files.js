/*
 * Lineo – tiedostomuodot (ilman käyttöliittymää).
 *
 * Projektitiedosto (.lineo): "LINEOPJ1" + 4 tavua (otsakkeen pituus, little-endian) + JSON-otsake
 * + datalohkot peräkkäin. Otsakkeen blobs-taulukko kertoo kunkin lohkon nimen, tyypin, paikan ja pituuden.
 * Tasojen pikselit ovat PNG-lohkoja, vektorit ja asetukset JSON:ssa. Mitään ei pakata erikseen (PNG on jo pakattu).
 *
 * SVG: vektoriääriviivat Bézier-poluiksi (sama solmurakenne kuin vector.js:ssä).
 */
var LineoFiles = (function () {
  'use strict';

  var MAGIC = 'LINEOPJ1';

  function byteLength(d) { return d.size !== undefined ? d.size : d.byteLength; }

  // blobs: [{ name, type, data: Blob | Uint8Array | ArrayBuffer }]
  function packProject(header, blobs) {
    var offset = 0;
    var meta = blobs.map(function (b) {
      var len = byteLength(b.data), m = { name: b.name, type: b.type || '', offset: offset, length: len };
      offset += len;
      return m;
    });
    var h = Object.assign({}, header, { blobs: meta });
    var hb = new TextEncoder().encode(JSON.stringify(h));
    var lenBytes = new Uint8Array(4);
    new DataView(lenBytes.buffer).setUint32(0, hb.length, true);
    var parts = [new TextEncoder().encode(MAGIC), lenBytes, hb].concat(blobs.map(function (b) { return b.data; }));
    return new Blob(parts, { type: 'application/octet-stream' });
  }

  // buf: ArrayBuffer. Palauttaa { header, blob(nimi) } tai heittää virheen.
  function unpackProject(buf) {
    var u8 = new Uint8Array(buf);
    if (u8.length < 12 || new TextDecoder().decode(u8.subarray(0, 8)) !== MAGIC) throw new Error('Ei Lineo-projekti');
    var hl = new DataView(buf, 8, 4).getUint32(0, true);
    if (12 + hl > u8.length) throw new Error('Projektitiedosto on vioittunut');
    var header = JSON.parse(new TextDecoder().decode(u8.subarray(12, 12 + hl)));
    var base = 12 + hl;
    return {
      header: header,
      has: function (name) { return header.blobs.some(function (m) { return m.name === name; }); },
      blob: function (name) {
        var m = header.blobs.filter(function (x) { return x.name === name; })[0];
        if (!m) return null;
        if (base + m.offset + m.length > u8.length) throw new Error('Projektitiedosto on vioittunut');
        return new Blob([u8.subarray(base + m.offset, base + m.offset + m.length)], { type: m.type });
      }
    };
  }

  function num(v) { return String(Math.round(v * 100) / 100); }

  // Yksi polku SVG:n d-attribuutiksi.
  function pathToD(path) {
    var nodes = path.nodes, n = nodes.length;
    if (!n) return '';
    var d = 'M' + num(nodes[0].x) + ' ' + num(nodes[0].y);
    var last = path.closed ? n : n - 1;
    for (var i = 0; i < last; i++) {
      var a = nodes[i], b = nodes[(i + 1) % n];
      d += 'C' + num(a.ox) + ' ' + num(a.oy) + ' ' + num(b.ix) + ' ' + num(b.iy) + ' ' + num(b.x) + ' ' + num(b.y);
    }
    return d + (path.closed ? 'Z' : '');
  }

  function isHex(c) { return /^#[0-9a-fA-F]{6}$/.test(c); }

  // o: { width, height (työkoko, viewBox), outWidth, outHeight, bg ('transparent' | '#rrggbb'),
  //      layers: [{ paths, stroke: { width, color, pencil }, opacity }] }
  function buildSvg(o) {
    var s = '<?xml version="1.0" encoding="UTF-8"?>\n';
    s += '<svg xmlns="http://www.w3.org/2000/svg" width="' + o.outWidth + '" height="' + o.outHeight + '" viewBox="0 0 ' + o.width + ' ' + o.height + '">\n';
    if (o.bg && o.bg !== 'transparent' && isHex(o.bg)) s += '  <rect width="' + o.width + '" height="' + o.height + '" fill="' + o.bg + '"/>\n';
    o.layers.forEach(function (L, i) {
      var color = isHex(L.stroke.color) ? L.stroke.color : '#000000', w = L.stroke.width;
      var d = L.paths.map(pathToD).join('');
      if (!d) return;
      var attrs = ' fill="none" stroke="' + color + '" stroke-width="' + num(w) + '" stroke-linecap="round" stroke-linejoin="round"';
      var op = L.opacity == null ? 1 : L.opacity;
      if (L.stroke.pencil) {
        attrs += ' stroke-opacity="' + num(op * 0.75) + '" stroke-dasharray="' + [w * 7, w * 0.5, w * 3, w * 0.8].map(num).join(' ') + '"';
      } else if (op < 1) {
        attrs += ' stroke-opacity="' + num(op) + '"';
      }
      s += '  <path id="kohde-' + (i + 1) + '"' + attrs + ' d="' + d + '"/>\n';
    });
    return s + '</svg>\n';
  }

  return { packProject: packProject, unpackProject: unpackProject, pathToD: pathToD, buildSvg: buildSvg };
})();

if (typeof module !== 'undefined') module.exports = LineoFiles;
