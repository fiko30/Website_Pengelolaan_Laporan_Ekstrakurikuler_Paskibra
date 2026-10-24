/**
 * =========================================================================
 * SERVICE WORKER - PWA PASKIBRA GARATIKA SMKN 40 JAKARTA
 * Mendukung instalasi aplikasi (PWA), caching offline, dan performa tinggi
 * =========================================================================
 */

const CACHE_NAME = 'garatika-pwa-v2026.1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo-paskibra.png',
  './logo-smk40.png',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './css/style.css',
  './css/responsif.css',
  './css/flatpickr-monthSelect.css',
  './css/modul/variabel_dan_dasar.css',
  './css/modul/tata_letak_aplikasi.css',
  './css/modul/komponen_ui.css',
  './css/modul/halaman_login.css',
  './css/modul/dashboard_dan_pimpinan.css',
  './css/modul/tabel_dan_divisi.css',
  './css/modul/form_laporan.css',
  './css/modul/kop_surat_dan_cetak.css',
  './css/modul/integrasi_drive_dan_database.css',
  './js/data.js',
  './js/vendor/flatpickr-monthSelect.js',
  './js/modul/penyimpanan.js',
  './js/modul/navigasi_tampilan.js',
  './js/modul/autentikasi.js',
  './js/modul/dashboard.js',
  './js/modul/manajemen_anggota.js',
  './js/modul/manajemen_divisi.js',
  './js/modul/manajemen_pengurus.js',
  './js/modul/laporan_divisi.js',
  './js/modul/cetak_kop_surat.js',
  './js/modul/integrasi_drive.js',
  './js/modul/aplikasi_utama.js'
];

// 1. Install Event: Cache Core App Shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA Pre-cache partial warning:', err);
      });
    })
  );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Intelligent Strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Jangan tangani non-GET atau request ke Google Apps Script (selalu realtime)
  if (request.method !== 'GET' || url.hostname.includes('script.google.com')) {
    return;
  }

  // Strategi Cache-First untuk aset statis lokal & CDN
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Ambil versi terbaru di background (Stale-While-Revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Jika belum ada di cache, ambil dari jaringan
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
            return networkResponse;
          }

          // Simpan salinan ke cache
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Offline fallback untuk navigasi HTML
          if (request.mode === 'navigate') {
            return caches.match('./index.html') || caches.match('./');
          }
        });
    })
  );
});
