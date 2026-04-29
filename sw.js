// Service Worker for CareLink
// 提供离线支持和快速加载

const CACHE_NAME = 'carelink-v1';
const urlsToCache = [
  './',
  'index.html',
  'styles_unified.css',
  'app.js',
  'assets/logo.png',
  'assets/cute_grandpa_avatar_1775137046957.png',
  'assets/cute_uncle_avatar.png',
  'assets/cute_aunt_avatar.png',
  'assets/cute_daughter_avatar.png',
  'assets/cute_son_avatar.png'
];

// 安装 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] 缓存文件');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('[ServiceWorker] 缓存某些文件失败:', err);
        });
      })
  );
});

// 激活 Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 网络请求处理
self.addEventListener('fetch', event => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    // 先从网络获取
    fetch(event.request)
      .then(response => {
        // 将响应保存到缓存
        if (response.ok) {
          const cache = caches.open(CACHE_NAME);
          cache.then(cache => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败，使用缓存
        return caches.match(event.request)
          .then(response => {
            return response || new Response('离线模式 - 文件未缓存');
          });
      })
  );
});
