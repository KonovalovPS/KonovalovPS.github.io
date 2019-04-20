if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/scripts/serviceWorker.js').then(function(reg) {
      // регистрация сработала
      console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch(function(error) {
      // регистрация прошла неудачно
      console.log('Registration failed with 2 ' + error);
    }) 
  }else {
    console.log('No service-worker on this browser');
  }

  this.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('v1').then(function(cache) {
        return cache.addAll([
          '/index.html',
          ''
        ]);
      })
    );
  });

  this.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
    );
  });