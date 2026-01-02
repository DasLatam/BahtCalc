const CACHE_NAME = 'baht-calc-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instalación: Guardamos los archivos en caché
self.addEventListener('install', event => {
  // Esta línea fuerza al SW a activarse inmediatamente sin esperar a que cierres la pestaña
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación: Borramos cachés viejas (v1, v2...) para liberar espacio y evitar errores
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepción de peticiones: Servir desde caché si existe (funciona Offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en caché, lo devuelve. Si no, lo busca en internet.
        return response || fetch(event.request);
      })
  );
});