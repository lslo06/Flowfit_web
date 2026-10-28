const CACHE_NAME = "flowfit-shell-v2";
const BASE = "/app/";
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll([BASE, `${BASE}manifest.webmanifest`, `${BASE}icons/flowfit-icon-192.png`])));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(BASE, response.clone()));
      return response;
    }).catch(() => caches.match(BASE)));
    return;
  }
  if (url.pathname.startsWith("/icons/") || url.pathname.startsWith("/assets/") || url.pathname === "/manifest.webmanifest" || ["script", "style", "image", "font"].includes(request.destination)) {
    event.respondWith(caches.match(request).then(async cached => {
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    }));
  }
});
