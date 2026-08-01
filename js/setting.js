// ==========================================
// COZYCS FARM - PENGATURAN APLIKASI MODULE
// ==========================================

var setting = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-cog"></i> Pengaturan Aplikasi</div>
                
                <div style="background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #e8e8e8; margin-bottom: 16px;">
                    <div style="font-size: 15px; font-weight: 700; color: #1B5E20; margin-bottom: 8px;">Cozycs Farm - Melon Hidroponik</div>
                    <div style="font-size: 13px; color: #666; line-height: 1.5; margin-bottom: 16px;">
                        Aplikasi manajemen pertanian hidroponik berbasis web offline-first.<br>
                        Lokasi Farm: Pesawaran, Lampung.
                    </div>
                    <div style="font-size: 13px; color: #444; border-top: 1px solid #eee; padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <span>Penggunaan Memori Lokal:</span>
                        <strong id="storageUsageInfo" style="color: #2E7D32;">Menghitung...</strong>
                    </div>
                </div>

                <div class="section-title" style="margin-top: 20px;"><i class="fas fa-tools"></i> Tindakan Data</div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button class="btn btn-primary" id="btnExportData" style="justify-content: flex-start; background: #2E7D32;">
                        <i class="fas fa-download"></i> Ekspor Cadangan Data (Backup)
                    </button>
                    <button class="btn btn-primary" id="btnResetData" style="justify-content: flex-start; background: #C62828;">
                        <i class="fas fa-trash-alt"></i> Reset Semua Data Farm
                    </button>
                </div>
            </div>
        `;
    }

    function init() {
        updateStorageInfo();

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

    function updateStorageInfo() {
        var infoEl = document.getElementById('storageUsageInfo');
        if (infoEl && typeof Storage !== 'undefined') {
            infoEl.textContent = Storage.getStorageUsage();
        }
    }

    return {
        render: render,
        init: init
    };

})();
