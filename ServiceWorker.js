const cacheName = "DefaultCompany-AvvaiAR-1.0.2";
const contentToCache = [
    "Build/e4a6e6b77b1faad062e91410467ff07a.loader.js",
    "Build/e76c6326329409e4ed890c342c3ecaf7.framework.js",
    "Build/90bf61f5fde52d0d087ea1f802a07604.data",
    "Build/6fa4e8b75b6a10d7e5ff340024a52dbb.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
