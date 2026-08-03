// ==========================================
// COZYCS FARM - SETTING MODULE
// ==========================================

var setting = (function() {

    function render() {
        var appVer = (typeof Helper !== 'undefined' && Helper.VERSION) ? Helper.VERSION : (typeof APP_VERSION !== 'undefined' ? APP_VERSION : '1.0');

        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-cog"></i> Pengaturan & Sistem Farm</div>
                <div style="font-size: 13px; color: #666; margin-bottom: 16px;">
                    Kelola data cadangan, memori lokal, dan konfigurasi aplikasi.
                </div>

                <!-- Bagian Memori & Backup -->
                <div style="background: #fff; border-radius: 12px; padding: 16px; border: 1px solid #e8e8e8; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #444; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <span>Memori Lokal Digunakan:</span>
                        <strong id="storageUsageInfo" style="color: #2E7D32;">Menghitung...</strong>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-primary" id="btnExportData" style="font-size: 12px; padding: 10px; background: #2E7D32;">
                            <i class="fas fa-download"></i> Backup Data
                        </button>
                        <button class="btn btn-primary" id="btnResetData" style="font-size: 12px; padding: 10px; background: #C62828;">
                            <i class="fas fa-trash-alt"></i> Reset Sistem
                        </button>
                    </div>
                </div>

                <!-- Bagian Tentang Aplikasi & Cek Pembaruan -->
                <div style="background: #fff; border-radius: 12px; padding: 16px; border: 1px solid #e8e8e8;">
                    <div style="font-size: 13px; font-weight: 700; color: #1B5E20; margin-bottom: 8px;">Tentang Aplikasi</div>
                    <div style="font-size: 12px; color: #555; line-height: 1.5; margin-bottom: 14px;">
                        <strong>Cozycs Farm v${appVer}</strong><br>
                        Sistem Manajemen Melon Hidroponik Premium berbasis PWA (Offline-First).<br>
                        Lokasi Greenhouse: Pesawaran, Lampung.
                    </div>

                    <!-- Tombol Cek Pembaruan Manual -->
                    <button class="btn" id="btnCheckUpdate" style="width: 100%; font-size: 12px; padding: 10px; background: #F5F5F5; color: #2E7D32; border: 1px solid #2E7D32; font-weight: 700; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <i class="fas fa-sync-alt" id="iconCheckUpdate"></i> Cek Pembaruan Aplikasi
                    </button>
                </div>
            </div>
        `;
    }

    function init() {
        // 1. Tampilkan Penggunaan Memori
        var infoEl = document.getElementById('storageUsageInfo');
        if (infoEl && typeof Storage !== 'undefined') {
            infoEl.textContent = Storage.getStorageUsage();
        }

        // 2. Event Backup Data
        var btnExport = document.getElementById('btnExportData');
        if (btnExport) {
            btnExport.addEventListener('click', function() {
                try {
                    var backupObj = {};
                    for (var key in Storage.KEYS) {
                        if (Storage.KEYS.hasOwnProperty(key)) {
                            var sKey = Storage.KEYS[key];
                            backupObj[sKey] = Storage.getAll(sKey);
                        }
                    }
                    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
                    var downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", "cozycs_farm_backup_" + Helper.getTodayDate() + ".json");
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    Helper.showToast('Berhasil mengunduh cadangan data!', 'success');
                } catch (e) {
                    Helper.showToast('Gagal mencadangkan data', 'error');
                }
            });
        }

        // 3. Event Reset Data
        var btnReset = document.getElementById('btnResetData');
        if (btnReset) {
            btnReset.addEventListener('click', function() {
                if (confirm('PERINGATAN: Semua data farm akan dihapus permanen! Yakin ingin melanjutkan?')) {
                    localStorage.clear();
                    Storage.init();
                    Helper.showToast('Semua data berhasil direset.', 'success');
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                }
            });
        }

        // 4. Event Cek Pembaruan Manual
        var btnCheckUpdate = document.getElementById('btnCheckUpdate');
        if (btnCheckUpdate) {
            btnCheckUpdate.addEventListener('click', function() {
                if (!('serviceWorker' in navigator)) {
                    Helper.showToast('Browser tidak mendukung pembaruan otomatis', 'error');
                    return;
                }

                var icon = document.getElementById('iconCheckUpdate');
                if (icon) icon.classList.add('fa-spin'); // Efek ikon berputar

                Helper.showToast('Memeriksa pembaruan ke server...', 'success');

                navigator.serviceWorker.ready.then(function(reg) {
                    // Cek jika sudah ada SW baru yang gantung (waiting)
                    if (reg.waiting) {
                        if (icon) icon.classList.remove('fa-spin');
                        if (typeof showUpdateToast === 'function') {
                            showUpdateToast(reg.waiting);
                        } else {
                            Helper.showToast('Pembaruan tersedia! Silakan muat ulang aplikasi.', 'success');
                        }
                        return;
                    }

                    // Paksa browser cek berkas sw.js di server
                    reg.update().then(function() {
                        setTimeout(function() {
                            if (icon) icon.classList.remove('fa-spin');

                            if (reg.waiting || reg.installing) {
                                Helper.showToast('Versi baru ditemukan! Menyiapkan pembaruan...', 'success');
                                if (reg.waiting && typeof showUpdateToast === 'function') {
                                    showUpdateToast(reg.waiting);
                                }
                            } else {
                                var currentVer = (typeof Helper !== 'undefined' && Helper.VERSION) ? Helper.VERSION : '1.0';
                                Helper.showToast('Cozycs Farm sudah versi terbaru (v' + currentVer + ')', 'success');
                            }
                        }, 1500);
                    }).catch(function(err) {
                        if (icon) icon.classList.remove('fa-spin');
                        Helper.showToast('Gagal memeriksa pembaruan. Cek koneksi internet.', 'error');
                    });
                });
            });
        }
    }

    return {
        render: render,
        init: init
    };

})();
