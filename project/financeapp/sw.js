 const CACHE_NAME = "finance-pwa-v1";

const FILES = [
"/",
"/index.html",
"/manifest.json",
"https://cdn.jsdelivr.net/npm/chart.js",
"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
];

self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll(FILES))
);
});

self.addEventListener("fetch", event => {
event.respondWith(
caches.match(event.request)
.then(response => response || fetch(event.request))
);
});