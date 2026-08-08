// ==========================================
// COZYCS FARM - MAIN APP ENTRY POINT
// (WITH INTEGRATED GLOBAL FORM DRAFT AUTO-SAVE & AUTO-RESTORE)
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

    // 4. Inisialisasi Sistem Draf Auto-Save & Auto-Restore Form Global
    initGlobalDraftSystem();

    // 5. Daftarkan Service Worker (PWA)
    registerServiceWorker();

    // 6. Jalankan Animasi Splash Screen (Loading Pembuka)
    runSplashScreen();
});

// ==========================================
// SISTEM GLOBAL AUTO-SAVE & AUTO-RESTORE DRAF FORM
// ==========================================
function initGlobalDraftSystem() {
    // A. Dengarkan input & change pada SELURUH form di aplikasi
    document.addEventListener('input', function(e) {
        var form = e.target.closest('form');
        if (form && form.id) {
            saveFormDraftGlobal(form.id);
        }
    });

    document.addEventListener('change', function(e) {
        var form = e.target.closest('form');
        if (form && form.id) {
            saveFormDraftGlobal(form.id);
        }
    });

    // B. Hapus draf otomatis saat form berhasil di-submit
    document.addEventListener('submit', function(e) {
        var form = e.target;
        if (form && form.id) {
            clearFormDraftGlobal(form.id);
        }
    });

    // C. Amati perubahan tampilan/modul agar form baru yang dirender otomatis memulihkan drafnya
    var appContainer = document.getElementById('appContainer');
    if (appContainer && window.MutationObserver) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    var forms = appContainer.querySelectorAll('form[id]');
                    forms.forEach(function(f) {
                        window.restoreFormDraftGlobal(f.id);
                    });
                }
            });
        });
        observer.observe(appContainer, { childList: true, subtree: true });
    }
}

// Simpan isi form ke localStorage
function saveFormDraftGlobal(formId) {
    var form = document.getElementById(formId);
    if (!form) return;

    var formData = {};
    var inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(function(input) {
        if (input.id && input.type !== 'password' && input.type !== 'file' && input.type !== 'hidden') {
            formData[input.id] = input.value;
        }
    });

    try {
        localStorage.setItem('cozycs_global_draft_' + formId, JSON.stringify(formData));
    } catch(e) {}
}

// Pulihkan isi form dari localStorage
window.restoreFormDraftGlobal = function(formId) {
    var form = document.getElementById(formId);
    if (!form) return;

    try {
        var rawData = localStorage.getItem('cozycs_global_draft_' + formId);
        if (!rawData) return;

        var formData = JSON.parse(rawData);
        Object.keys(formData).forEach(function(inputId) {
            var input = document.getElementById(inputId);
            if (input && formData[inputId] !== undefined && formData[inputId] !== '') {
                input.value = formData[inputId];
            }
        });
    } catch(e) {}
};

// Hapus draf form tertentu
window.clearFormDraftGlobal = function(formId) {
    try {
        localStorage.removeItem('cozycs_global_draft_' + formId);
    } catch(e) {}
};

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
                
                // Pulihkan draf pada form aktif saat aplikasi selesai dimuat
                var activeForms = appContainer.querySelectorAll('form[id]');
                activeForms.forEach(function(f) {
                    window.restoreFormDraftGlobal(f.id);
                });

                setTimeout(function() {
                    splash.style.display = 'none';
                }, 600);
            }, 300);
        }
    }, 150);
    }
