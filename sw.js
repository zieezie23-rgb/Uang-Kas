const CACHE = "buku-kas-tik-v16";
const APP_SHELL = ["./", "./index.html", "./manifest.json", "./assets/icon.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Panggilan database (Google Apps Script / JSONP): jangan di-cache, URL-nya unik tiap panggilan.
  if (url.hostname === "script.google.com" || url.hostname.endsWith(".googleusercontent.com")) return;
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin) {
    // File aplikasi: tampilkan dari cache dulu (cepat), perbarui diam-diam di belakang layar.
    // Versi baru otomatis dipakai pada pembukaan berikutnya.
    event.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(req, { ignoreSearch: true }).then(cached => {
          const network = fetch(req).then(res => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          }).catch(() => null);

          if (cached) { event.waitUntil(network); return cached; }
          return network.then(res => res ||
            (req.mode === "navigate" ? cache.match("./index.html") : null) ||
            new Response("", { status: 503, statusText: "Offline" }));
        })
      )
    );
    return;
  }

  // Library & font dari CDN: simpan permanen, ambil dari cache dulu.
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && (res.ok || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy));
        }
        return res;
      }).catch(() => new Response("", { status: 503, statusText: "Offline" }));
    })
  );
});
