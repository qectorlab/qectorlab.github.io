const CACHE_NAME = 'qector-v1';
const FILES = ['/', '/assets/style.css', '/assets/nav.js', '/assets/logo.svg', '/manifest.webmanifest'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
