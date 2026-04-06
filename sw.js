const CACHE_NAME = 'pick3geny-v2';
const GHPATH = '/Pick3geny-/';

self.addEventListener('install', event => {
  self.skipWaiting();
  console.log('✅ Service Worker installed');
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  console.log('✅ Service Worker activated');
});

self.addEventListener('fetch', event => {
  // בקשות חיצוניות - תן להן לעבור
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // ניווטים (עמודים)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => 
        caches.match(GHPATH + 'index.html')
      )
    );
    return;
  }

  // שאר הקבצים - Cache First
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
