const CACHE_VERSION = "trueroute-v4";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/prices",
  "/emergency",
  "/map",
  "/translate",
  "/places",
  "/chat",
  "/profile",
  "/submit-price",
];

const OFFLINE_API = ["/api/offline-bundle"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET") return;

  if (OFFLINE_API.some((p) => url.pathname === p)) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        try {
          const res = await fetch(request);
          if (res.ok) cache.put(request, res.clone());
          return res;
        } catch {
          const cached = await cache.match(request);
          if (cached) return cached;
          return new Response(JSON.stringify({ error: "offline" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        }
      })
    );
    return;
  }

  if (url.pathname === "/api/health") {
    event.respondWith(fetch(request));
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then(
          (r) =>
            r ||
            new Response(JSON.stringify({ offline: true }), {
              status: 503,
              headers: { "Content-Type": "application/json" },
            })
        )
      )
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return (await caches.match("/offline.html")) || new Response("Offline", { status: 503 });
        })
    );
    return;
  }

  if (
    url.origin === self.location.origin &&
    (url.pathname.match(/\.(js|css|png|jpg|svg|woff2?)$/) || url.pathname.startsWith("/_next/"))
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
            }
            return res;
          })
      )
    );
  }
});
