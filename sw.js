// sw.js  —  Third Space Cellar Tools
// ----------------------------------
// bump this string any time you change filenames in FILES[]
const CACHE = 'cellar-tools-v5'; // update w/ multiple cards

const FILES = [
  '.',               // index.html
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Install: cache the core shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();         // activate this worker immediately
});

// Activate: take control of all pages + clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE && caches.delete(k)))
    )
  );
  self.clients.claim();       // refreshes tabs to the new worker
});

// Fetch: cache-first, network fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(
      resp => resp || fetch(event.request)
    )
  );
});
