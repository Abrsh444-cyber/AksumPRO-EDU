const CACHE_NAME = 'aksum-vip-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/data.ts',
  '/src/types.ts',
  '/public/manifest.json'
];

// Install Event: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching Core Offline Assets');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[Service Worker] Pre-cache warning: some initial assets skipped', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing ancient cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Cache first with Network Fallback (perfect for study materials to work absolute offline!)
self.addEventListener('fetch', (event) => {
  // Only cache GET requests (exclude API POST requests like gemini chat or custom question generator)
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  // Exclude third party api domains or chrome extensions
  if (!url.origin.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in the background to update cache (Stale-While-Revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* Ignore network errors offline */});
        
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // Cache the dynamically loaded assets
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline Fallback for html pages
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
