const CACHE_NAME = 'nueva-era-cache-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'sw.js'
];

// Instalar el Service Worker y almacenar archivos básicos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activar el Service Worker y limpiar cachés antiguas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Responder desde el caché o buscar en la red si no está disponible
self.addEventListener('fetch', (e) => {
  // Ignorar peticiones de la transmisión de audio por streaming
  if (e.request.url.includes('stream') || e.request.url.includes('radiosenlinea')) {
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
