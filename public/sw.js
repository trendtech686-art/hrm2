/* eslint-disable no-undef */
// ERP HRM – minimal PWA service worker.
// Strategy overview:
//   • Static assets under /_next/static and icons  → cache-first (forever, SWR update)
//   • Navigation requests (HTML pages)              → network-first, fall back to /offline.html
//   • API/data requests (/api/*, POST/PUT/DELETE)   → bypass cache entirely (never cache)
//   • Everything else                               → stale-while-revalidate
//
// The cache version is bumped by Next.js build output hashes; bump CACHE_VERSION to force
// all clients to drop stale caches after a major deploy.

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `erp-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `erp-runtime-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Core assets pre-cached on install so the app shell shows up offline.
const PRECACHE_URLS = [
  OFFLINE_URL,
  '/manifest.json',
  '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => undefined),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((n) => n !== STATIC_CACHE && n !== RUNTIME_CACHE)
          .map((n) => caches.delete(n)),
      );
      if (self.registration && self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.enable();
        } catch (_) {
          // navigationPreload is optional
        }
      }
      await self.clients.claim();
    })(),
  );
});

// Allow the page to trigger an immediate activation after an update.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING' || (event.data && event.data.type === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/apple-touch-icon.png' ||
    url.pathname === '/favicon.ico'
  );
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/') || url.pathname.startsWith('/trpc/');
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirstNavigation(event) {
  try {
    const preload = await event.preloadResponse;
    if (preload) return preload;
    const response = await fetch(event.request);
    return response;
  } catch (_) {
    const cache = await caches.open(STATIC_CACHE);
    const fallback = await cache.match(OFFLINE_URL);
    return (
      fallback ||
      new Response('<h1>Mất kết nối</h1><p>Vui lòng thử lại.</p>', {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    );
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok && request.method === 'GET') {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  return cached || networkPromise;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return; // never cache writes
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isApiRequest(url)) return; // let the network handle data

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(event));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

// ───────────────────── Push notifications ─────────────────────
// Payload contract (from lib/web-push.ts):
//   { title, body, url?, icon?, badge?, tag?, data? }
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload = {};
  try {
    payload = event.data.json();
  } catch (_) {
    payload = { title: 'ERP', body: event.data.text() };
  }

  const title = payload.title || 'ERP';
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/icon-192.png',
    badge: payload.badge || '/icon-192.png',
    tag: payload.tag || undefined,
    renotify: Boolean(payload.tag),
    data: { url: payload.url || '/', ...(payload.data || {}) },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Focus an existing window if the same URL is already open; otherwise open a
// new one. This mirrors "native-app" click behaviour users expect.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of allClients) {
        try {
          const clientUrl = new URL(client.url);
          if (clientUrl.pathname === targetUrl || client.url.endsWith(targetUrl)) {
            await client.focus();
            return;
          }
        } catch (_) {
          // ignore malformed URLs
        }
      }
      if (self.clients.openWindow) {
        await self.clients.openWindow(targetUrl);
      }
    })(),
  );
});
