const CACHE_NAME = 'pick3geny-v5';

const FILES_TO_CACHE = [
  '/Pick3geny-/',
  '/Pick3geny-/index.html',
  '/Pick3geny-/manifest.json',
  '/Pick3geny-/icon-192.png',
  '/Pick3geny-/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // ניווטים (דפים)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/Pick3geny-/index.html')
      )
    );
    return;
  }

  // קבצים רגילים
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
