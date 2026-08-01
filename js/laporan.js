// ==========================================
// COZYCS FARM - MODUL LAPORAN & BACKUP DATA
// ==========================================

var laporan = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-file-alt" style="color: #2E7D32;"></i> Laporan & Backup Data Kebun</div>
                
                <!-- Card Informasi Keamanan Data -->
                <div style="background: #E8F5E9; border: 1px solid #C8E6C9; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 6px;"><i class="fas fa-shield-alt"></i> Pusat Keamanan Data Kebun</div>
                    <div style="font-size: 12px; color: #333; line-height: 1.5;">
                        Selalu unduh file backup secara berkala (terutama setelah selesai menginput data harian) agar catatan Nutrisi, Spray, dan Jadwal kebunmu tetap aman dan bisa dipulihkan kapan saja.
                    </div>
                </div>

                <!-- Tombol Aksi Backup & Restore -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #333; margin-bottom: 12px;">Manajemen File Cadangan (.JSON)</div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <!-- Tombol Download Backup -->
                        <button type="button" onclick="laporan.downloadBackup()" style="background: #2E7D32; color: #fff; border: none; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <i class="fas fa-download"></i> Unduh Backup
                        </button>

                        <!-- Tombol Upload Restore -->
                        <label style="background: #0277BD; color: #fff; border: none; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; text-align: center;">
                            <i class="fas fa-upload"></i> Pulihkan Data
                            <input type="file" id="restoreFile" accept=".json" style="display: none;" onchange="laporan.restoreBackup(event)">
                        </label>
                    </div>
                </div>

                <!-- Ringkasan Statistik Laporan -->
                <div class="section-title"><i class="fas fa-chart-pie" style="color: #2E7D32;"></i> Ringkasan Rekap Kebun</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;" id="summaryCardsReport">
                    <!-- Diisi dinamis oleh JavaScript -->
                </div>
            </div>
        `;
    }

    function init() {
        loadSummary();
    }

    function loadSummary() {
        var container = document.getElementById('summaryCardsReport');
        if (!container) return;

        var nutrisiData = Storage.getAll(Storage.KEYS.NUTRISI);
        var sprayData = Storage.getAll(Storage.KEYS.SPRAY);
        var schedulesData = Storage.getAll('cozycs_schedules');

        container.innerHTML = `
            <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="font-size: 11px; color: #777; font-weight: 600; text-transform: uppercase;">Total Cek Nutrisi</div>
                <div style="font-size: 20px; font-weight: bold; color: #0277BD; margin-top: 4px;">${nutrisiData.length} <span style="font-size: 12px; font-weight: normal; color: #555;">Catatan</span></div>
            </div>
            <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="font-size: 11px; color: #777; font-weight: 600; text-transform: uppercase;">Total Aksi Spray</div>
                <div style="font-size: 20px; font-weight: bold; color: #6A1B9A; margin-top: 4px;">${sprayData.length} <span style="font-size: 12px; font-weight: normal; color: #555;">Jadwal</span></div>
            </div>
        `;
    }

    // Fungsi Mengunduh File Backup JSON
    function downloadBackup() {
        try {
            var backupData = {
                version: "1.0",
                app: "Cozycs Farm Management",
                exportDate: new Date().toISOString(),
                data: {
                    nutrisi: Storage.getAll(Storage.KEYS.NUTRISI),
                    spray: Storage.getAll(Storage.KEYS.SPRAY),
                    schedules: Storage.getAll('cozycs_schedules')
                }
            };

            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
            var downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `cozycs_farm_backup_${new Date().toISOString().slice(0,10)}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();

            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast('Backup data berhasil diunduh!', 'success');
            }
        } catch (err) {
            alert('Gagal mengunduh backup: ' + err.message);
        }
    }

    // Fungsi Memulihkan Data dari File JSON
    function restoreBackup(event) {
        var file = event.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var jsonContent = JSON.parse(e.target.result);
                
                if (!jsonContent.data) {
                    throw new Error('Format file backup tidak valid!');
                }

                // Masukkan kembali ke localStorage melalui Storage helper
                if (jsonContent.data.nutrisi) {
                    Storage.saveAll(Storage.KEYS.NUTRISI, jsonContent.data.nutrisi);
                }
                if (jsonContent.data.spray) {
                    Storage.saveAll(Storage.KEYS.SPRAY, jsonContent.data.spray);
                }
                if (jsonContent.data.schedules) {
                    Storage.saveAll('cozycs_schedules', jsonContent.data.schedules);
                }

                if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                    Helper.showToast('Data kebun berhasil dipulihkan!', 'success');
                } else {
                    alert('Data kebun berhasil dipulihkan!');
                }

                loadSummary();
                event.target.value = ''; // Reset input file
            } catch (err) {
                alert('Gagal memulihkan data. Pastikan file berformat JSON Cozycs Farm yang benar.\nError: ' + err.message);
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    }

    return {
        render: render,
        init: init,
        downloadBackup: downloadBackup,
        restoreBackup: restoreBackup
    };

})();
