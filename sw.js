// Pick3Geny Service Worker v2
const CACHE = 'pick3geny-v2';
const FILES = [
  '/Pick3geny-/',
  '/Pick3geny-/index.html',
  '/Pick3geny-/manifest.json',
  '/Pick3geny-/icon-192.png',
  '/Pick3geny-/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request)
        .then(res => {
          if(res && res.status === 200 && res.type === 'basic'){
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
      )
      .catch(() => caches.match('/Pick3geny-/index.html'))
  );
});
