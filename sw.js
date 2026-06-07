const CACHE_NAME = "ufest-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./info.json",
  "./assets/css/style.css",
  "./assets/css/info.css",
  "./assets/css/lineup.css",
  "./assets/js/script.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(req, copy))
          .catch(() => {});
        return res;
      });
    }),
  );
});
