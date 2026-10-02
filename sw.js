/* 房子快跑 / 小屎快跑 —— 离线缓存（PWA） */
const CACHE = 'fangzi-v1';
const ASSETS = [
  './',
  './ultra-run.html',
  './xiaoshi-run.html',
  './three.min.js',
  './face.jpg', './face-thumb.jpg',
  './face2.jpg', './face2-thumb.jpg',
  './vo-fangzi.wav', './vo-xiaoshi.wav', './vo-hit.mp3',
  './bgm.m4a',
  './manifest.webmanifest', './manifest-xiaoshi.webmanifest',
  './icon-96.png', './icon-192.png', './icon-512.png', './icon-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(ASSETS.map(u => c.add(u))))   // 单个失败不影响安装
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;
  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./ultra-run.html'));
    })
  );
});
