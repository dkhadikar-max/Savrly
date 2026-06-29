const CACHE = 'savrly-v1';

const PRECACHE = [
  '/',
  '/images/savrly-logo.png',
  '/images/sav-logo.png',
  '/images/hero-banner.jpg',
  '/images/map-bg.jpg',
  '/images/savrly_logo_reveal.gif',
  '/images/savrly_logo_spinner.gif',
  '/images/rest-biryani.jpg',
  '/images/rest-burger.jpg',
  '/images/rest-chinese.jpg',
  '/images/rest-coffee.jpg',
  '/images/rest-dessert.jpg',
  '/images/rest-fastfood.jpg',
  '/images/rest-healthy.jpg',
  '/images/rest-icecream.jpg',
  '/images/rest-latenight.jpg',
  '/images/rest-pizza.jpg',
  '/images/rest-southindian.jpg',
  '/images/rest-sushi.jpg',
  '/images/food-pizza.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-only for external APIs (Overpass, BigDataCloud)
  if (url.hostname !== self.location.hostname) {
    event.respondWith(fetch(request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // Cache-first for images
  if (url.pathname.startsWith('/images/')) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(request, clone));
        return res;
      }))
    );
    return;
  }

  // Network-first for JS/CSS bundles (get latest on each visit)
  if (url.pathname.match(/\.(js|css)$/)) {
    event.respondWith(
      fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(request, clone));
        return res;
      }).catch(() => caches.match(request))
    );
    return;
  }

  // For HTML navigation requests — network first, fall back to cached '/'
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
