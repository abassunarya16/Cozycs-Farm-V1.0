// ==========================================
// COZYCS FARM - SERVICE WORKER (OFFLINE MODE)
// ==========================================

var CACHE_NAME = 'cozycs-farm-v1';
var urlsToCache = [
    'index.html',
    'manifest.json',
    'css/style.css',
    'js/helper.js',
    'js/storage.js',
    'js/chart.js',
    'js/dashboard.js',
    'js/greenhouse.js',
    'js/tanaman.js',
    'js/polinasi.js',
    'js/buah.js',
    'js/nutrisi.js',
    'js/pruning.js',
    'js/hama.js',
    'js/spray.js',
    'js/jadwal.js',
    'js/panen.js',
    'js/laporan.js',
    'js/gudang.js',
    'js/keuangan.js',
    'js/setting.js',
    'img/logo-cozycs.png',
    'img/favicon.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install Service Worker & Cache Aset
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[ServiceWorker] Menyimpan cache aset farm...');
                return cache.addAll(urlsToCache);
            })
    );
});

// Aktivasi & Bersihkan Cache Lama
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[ServiceWorker] Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch / Tangkap Permintaan Jaringan
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Kembalikan dari cache jika ada, jika tidak ambil dari internet
                return response || fetch(event.request);
            })
    );
});
