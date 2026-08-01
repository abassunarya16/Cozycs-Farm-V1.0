// ==========================================
// COZYCS FARM - MAIN APP ENTRY POINT
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('[App] Cozycs Farm 1.0 starting...');

    // 1. Inisialisasi Storage & Database Lokal
    if (typeof Storage !== 'undefined' && typeof Storage.init === 'function') {
        Storage.init();
    }

    // 2. Inisialisasi Router & Navigasi
    if (typeof Router !== 'undefined' && typeof Router.init === 'function') {
        Router.init();
    }

    // 3. Inisialisasi Notifikasi & Tugas
    if (typeof Notification !== 'undefined' && typeof Notification.init === 'function') {
        Notification.init();
    }

    // 4. Daftarkan Service Worker (PWA)
    registerServiceWorker();

    // 5. Jalankan Animasi Splash Screen (Loading Pembuka)
    runSplashScreen();
});

// Fungsi untuk mendaftarkan Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('[App] ServiceWorker registered with scope:', registration.scope);
            })
            .catch(function(error) {
                console.error('[App] ServiceWorker registration failed:', error);
            });
    }
}

// Fungsi animasi Splash Screen yang elegan
function runSplashScreen() {
    var splash = document.getElementById('splashScreen');
    var appContainer = document.getElementById('appContainer');
    var loaderBar = document.getElementById('splashLoaderBar');
    var loadingText = document.getElementById('splashLoadingText');

    if (!splash || !appContainer) return;

    var progress = 0;
    var interval = setInterval(function() {
        progress += Math.floor(Math.random() * 20) + 15;
        if (progress > 100) progress = 100;

        if (loaderBar) loaderBar.style.width = progress + '%';
        if (loadingText) loadingText.textContent = 'MEMUAT ' + progress + '%';

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(function() {
                splash.classList.add('hide');
                appContainer.style.display = 'block';
                setTimeout(function() {
                    splash.style.display = 'none';
                }, 600);
            }, 300);
        }
    }, 150);
}
