const CACHE = 'travesias-v2';
const FILES = [
  '/TRAVESIA/',
  '/TRAVESIA/index.html',
  '/TRAVESIA/travesias.html',
  '/TRAVESIA/manifest.json'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(cache){
      return cache.addAll(FILES).catch(function(err){
        console.log('Cache partial fail:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){return k!==CACHE;})
          .map(function(k){return caches.delete(k);})
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(response){
        const clone = response.clone();
        caches.open(CACHE).then(function(cache){cache.put(e.request, clone);});
        return response;
      }).catch(function(){
        return caches.match('/TRAVESIA/travesias.html');
      });
    })
  );
});
