// ==========================================
// COZYCS FARM - PENGATURAN & MENU UTAMA MODULE
// ==========================================

var setting = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-bars"></i> Menu & Modul Operasional Farm</div>
                <div style="font-size: 13px; color: #666; margin-bottom: 16px;">
                    Akses cepat ke seluruh modul manajemen hidroponik Cozycs Farm.
                </div>

                <!-- Manajemen Area & Tanaman -->
                <div class="menu-category-title"><i class="fas fa-seedling"></i> Area & Tanaman</div>
                <div class="menu-grid">
                    <button class="menu-card-btn" data-page="greenhouse">
                        <i class="fas fa-warehouse" style="color: #2E7D32;"></i>
                        <span>Greenhouse</span>
                    </button>
                    <button class="menu-card-btn" data-page="tanaman">
                        <i class="fas fa-seedling" style="color: #2E7D32;"></i>
                        <span>Data Tanaman</span>
                    </button>
                    <button class="menu-card-btn" data-page="polinasi">
                        <i class="fas fa-heart" style="color: #E65100;"></i>
                        <span>Polinasi Bunga</span>
                    </button>
                    <button class="menu-card-btn" data-page="buah">
                        <i class="fas fa-apple-alt" style="color: #1565C0;"></i>
                        <span>Seleksi Buah</span>
                    </button>
                </div>

                <!-- Perawatan & Perlindungan -->
                <div class="menu-category-title"><i class="fas fa-shield-alt"></i> Perawatan & Perlindungan</div>
                <div class="menu-grid">
                    <button class="menu-card-btn" data-page="nutrisi">
                        <i class="fas fa-flask" style="color: #0277BD;"></i>
                        <span>Nutrisi & PPM</span>
                    </button>
                    <button class="menu-card-btn" data-page="pruning">
                        <i class="fas fa-cut" style="color: #4E342E;"></i>
                        <span>Pruning / Rempes</span>
                    </button>
                    <button class="menu-card-btn" data-page="hama">
                        <i class="fas fa-bug" style="color: #C62828;"></i>
                        <span>Deteksi Hama</span>
                    </button>
                    <button class="menu-card-btn" data-page="spray">
                        <i class="fas fa-spray-can" style="color: #6A1B9A;"></i>
                        <span>Jadwal Spray</span>
                    </button>
                </div>

                <!-- Manajemen Bisnis & Panen -->
                <div class="menu-category-title"><i class="fas fa-chart-line"></i> Panen & Bisnis</div>
                <div class="menu-grid">
                    <button class="menu-card-btn" data-page="jadwal">
                        <i class="fas fa-calendar-alt" style="color: #EF6C00;"></i>
                        <span>Jadwal Harian</span>
                    </button>
                    <button class="menu-card-btn" data-page="panen">
                        <i class="fas fa-box" style="color: #6A1B9A;"></i>
                        <span>Data Panen</span>
                    </button>
                    <button class="menu-card-btn" data-page="gudang">
                        <i class="fas fa-boxes" style="color: #37474F;"></i>
                        <span>Stok Gudang</span>
                    </button>
                    <button class="menu-card-btn" data-page="laporan">
                        <i class="fas fa-file-invoice" style="color: #00695C;"></i>
                        <span>Laporan Farm</span>
                    </button>
                </div>

                <!-- Informasi Sistem & Backup Data -->
                <div class="section-title" style="margin-top: 24px;"><i class="fas fa-cog"></i> Sistem & Pengaturan</div>
                <div style="background: #fff; border-radius: 12px; padding: 16px; border: 1px solid #e8e8e8; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #444; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <span>Memori Lokal Digunakan:</span>
                        <strong id="storageUsageInfo" style="color: #2E7D32;">Menghitung...</strong>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-primary" id="btnExportData" style="font-size: 12px; padding: 10px; background: #2E7D32;">
                            <i class="fas fa-download"></i> Backup
                        </button>
                        <button class="btn btn-primary" id="btnResetData" style="font-size: 12px; padding: 10px; background: #C62828;">
                            <i class="fas fa-trash-alt"></i> Reset
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function init() {
        var infoEl = document.getElementById('storageUsageInfo');
        if (infoEl && typeof Storage !== 'undefined') {
            infoEl.textContent = Storage.getStorageUsage();
        }

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
    }

    return {
        render: render,
        init: init
    };

})();
