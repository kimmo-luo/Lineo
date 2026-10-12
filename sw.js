/*
 * Lineo – service worker.
 *
 * Strategia "verkko ensin": kun yhteys on, ohjelman tiedostot haetaan aina
 * tuoreina (GitHubiin tehty päivitys näkyy siis seuraavalla avauskerralla
 * ilman versionumeroiden kasvattamista). Haetut tiedostot tallennetaan
 * välimuistiin, josta ne tarjoillaan, kun verkkoa ei ole tai se on hidas.
 *
 * Kuvia ei koskaan lähetetä minnekään: worker käsittelee vain ohjelman
 * omia tiedostoja ja tekoälykirjaston lataukset (GET-pyynnöt).
 */
'use strict';

var CACHE = 'lineo-v19';
// Tekoälykirjasto (transformers.js + ONNX Runtime) jsDelivristä. Osoitteissa on
// tarkka versionumero, joten tiedosto ei koskaan muutu: välimuisti ensin.
// (Mallin painot transformers.js tallentaa itse selaimen välimuistiin.)
var LIB_CACHE = 'lineo-lib-v1';
var LIB_HOSTS = ['cdn.jsdelivr.net'];
var NETWORK_TIMEOUT_MS = 4000;

var APP_SHELL = [
  './',
  'index.html',
  'manifest.json',
  'css/app.css',
  'js/i18n.js',
  'js/app.js',
  'js/edge-core.js',
  'js/vector.js',
  'js/sam.js',
  'js/brush.js',
  'js/select.js',
  'js/filters.js',
  'js/files.js',
  'shared/lineo-theme.css',
  'shared/lineo-logo.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-192.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(APP_SHELL.map(function (url) {
        return new Request(url, { cache: 'reload' });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key.indexOf('lineo-') === 0 && key !== CACHE && key !== LIB_CACHE) return caches.delete(key);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function fromNetwork(request) {
  // no-cache ohittaa selaimen HTTP-välimuistin vanhentuneet kopiot (esim. GitHub Pagesin 10 min).
  return fetch(request, { cache: 'no-cache' }).then(function (response) {
    if (response && response.ok && response.type === 'basic') {
      var copy = response.clone();
      caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
    }
    return response;
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request, { ignoreSearch: request.mode === 'navigate' }).then(function (hit) {
      if (hit || request.mode !== 'navigate') return hit;
      return cache.match('./').then(function (root) { return root || cache.match('index.html'); });
    });
  });
}

function libraryFetch(request) {
  return caches.open(LIB_CACHE).then(function (cache) {
    return cache.match(request).then(function (hit) {
      if (hit) return hit;
      return fetch(request).then(function (response) {
        if (response && response.ok) cache.put(request, response.clone());
        return response;
      });
    });
  });
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;
  var url = new URL(request.url);
  if (LIB_HOSTS.indexOf(url.hostname) !== -1 && /@\d+\.\d+\.\d+/.test(url.pathname)) {
    event.respondWith(libraryFetch(request));
    return;
  }
  if (url.origin !== self.location.origin) return;

  event.respondWith(new Promise(function (resolve) {
    var settled = false;
    function done(response) {
      if (!settled && response) { settled = true; resolve(response); }
    }

    var network = fromNetwork(request);

    // Hidas verkko: näytetään välimuistin versio, verkko päivittää välimuistin taustalla.
    var timer = setTimeout(function () {
      fromCache(request).then(done);
    }, NETWORK_TIMEOUT_MS);

    network.then(function (response) {
      clearTimeout(timer);
      if (response.ok || response.type === 'opaqueredirect') { done(response); return; }
      return fromCache(request).then(function (hit) { done(hit || response); });
    }).catch(function () {
      clearTimeout(timer);
      return fromCache(request).then(function (hit) {
        done(hit || new Response('Ei verkkoyhteyttä', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }));
      });
    });
  }));
});
