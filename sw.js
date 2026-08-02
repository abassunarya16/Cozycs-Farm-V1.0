// ==========================================
// COZYCS FARM - SERVICE WORKER (OFFLINE MODE)
// ==========================================

// UBAH NAMA VERSI INI SETIAP KALI ADA PERUBAHAN KODE DI GITHUB UNTUK MEMICU UPDATE TOAST
var CACHE_NAME = 'cozycs-farm-v1.5';

var urlsToCache = [
    './',
    'index.html',
    'manifest.json',
    'css/style.css',
    'css/sidebar.css',
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
    'js/notifikasi.js',
    'js/jadwal.js',
    'js/panen.js',
    'js/laporan.js',
    'js/gudang.js',
    'js/keuangan.js',
    'js/setting.js',
    'img/logo-cozycs.png',
    'img/favicon.png',
    'img/icon-app-white-192.png',
    'img/icon-app-white-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// ========================================
// 1. INSTALL - Cache semua aset
// ========================================
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[SW] Menyimpan cache aset farm terbaru...');
                return cache.addAll(urlsToCache);
            })
    );
    // CATATAN: self.skipWaiting() sengaja tidak dipasang di sini
    // agar Service Worker baru menunggu sampai pengguna menekan tombol "PERBARUI" di layar.
});

// ========================================
// 2. AKTIVASI - Hapus cache versi lama & klaim klien
// ========================================
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

// ========================================
// 3. FETCH - Cache first, network fallback
// ========================================
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
    );
});

// ========================================
// 4. MESSAGE - Dijalankan HANYA saat pengguna mengklik tombol "PERBARUI"
// ========================================
self.addEventListener('message', function(event) {
    if (event.data) {
        // Menerima dua format perintah: 'SKIP_WAITING' & 'skipWaiting'
        var action = event.data.type || event.data.action || '';
        
        if (action === 'SKIP_WAITING' || action === 'skipWaiting') {
            console.log('[SW] ⏩ User klik PERBARUI, SW baru diaktifkan!');
            self.skipWaiting();
        }
    }
});

console.log('[SW] 🌱 Cozycs Farm Service Worker Siap!');
