// Service Worker version
const CACHE_NAME = 'mopiq-cache-v1';

// キャッシュするファイルのリスト
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // 必要に応じて他のアセットを追加
];

// Service Workerのインストール時の処理
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチイベントの処理
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュが見つかればそれを返す
        if (response) {
          return response;
        }
        // キャッシュが見つからなければネットワークリクエストを行う
        return fetch(event.request);
      })
  );
});
