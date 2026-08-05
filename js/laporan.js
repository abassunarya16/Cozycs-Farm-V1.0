// ==========================================
// COZYCS FARM - MODUL LAPORAN & BACKUP DATA
// (FULL BILINGUAL & DARK MODE SUPPORT)
// ==========================================

var laporan = (function() {

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Laporan & Backup Data Kebun',
            'card_sec_title': 'Pusat Keamanan Data Kebun',
            'card_sec_desc': 'Selalu unduh file backup secara berkala (terutama setelah selesai menginput data harian) agar catatan Nutrisi, Spray, dan Jadwal kebunmu tetap aman dan bisa dipulihkan kapan saja.',
            'card_file_title': 'Manajemen File Cadangan (.JSON)',
            'btn_download': 'Unduh Backup',
            'btn_restore': 'Pulihkan Data',
            'summary_title': 'Ringkasan Rekap Kebun',
            'lbl_total_nutrisi': 'Total Cek Nutrisi',
            'lbl_total_spray': 'Total Aksi Spray',
            'unit_records': 'Catatan',
            'unit_schedules': 'Jadwal',
            'toast_download_success': 'Backup data berhasil diunduh!',
            'toast_restore_success': 'Data kebun berhasil dipulihkan!',
            'err_download': 'Gagal mengunduh backup: ',
            'err_invalid_format': 'Format file backup tidak valid!',
            'err_restore': 'Gagal memulihkan data. Pastikan file berformat JSON Cozycs Farm yang benar.\nError: '
        },
        'en': {
            'module_title': 'Farm Reports & Data Backup',
            'card_sec_title': 'Farm Data Security Center',
            'card_sec_desc': 'Always download backup files regularly (especially after entering daily data) so that your Nutrition, Spray, and Schedule records stay safe and recoverable at any time.',
            'card_file_title': 'Backup File Management (.JSON)',
            'btn_download': 'Download Backup',
            'btn_restore': 'Restore Data',
            'summary_title': 'Farm Summary Recap',
            'lbl_total_nutrisi': 'Total Nutrition Checks',
            'lbl_total_spray': 'Total Spray Actions',
            'unit_records': 'Records',
            'unit_schedules': 'Schedules',
            'toast_download_success': 'Data backup downloaded successfully!',
            'toast_restore_success': 'Farm data restored successfully!',
            'err_download': 'Failed to download backup: ',
            'err_invalid_format': 'Invalid backup file format!',
            'err_restore': 'Failed to restore data. Make sure it is a valid Cozycs Farm JSON file.\nError: '
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-file-alt" style="color: #2E7D32;"></i> ${t('module_title')}</div>
                
                <!-- Card Informasi Keamanan Data -->
                <div style="background: #E8F5E9; border: 1px solid #C8E6C9; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 6px;"><i class="fas fa-shield-alt"></i> ${t('card_sec_title')}</div>
                    <div style="font-size: 12px; color: #2e4d30; line-height: 1.5;">
                        ${t('card_sec_desc')}
                    </div>
                </div>

                <!-- Tombol Aksi Backup & Restore -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: var(--text-color, #333); margin-bottom: 12px;">${t('card_file_title')}</div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <!-- Tombol Download Backup -->
                        <button type="button" onclick="laporan.downloadBackup()" style="background: #2E7D32; color: #fff; border: none; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <i class="fas fa-download"></i> ${t('btn_download')}
                        </button>

                        <!-- Tombol Upload Restore -->
                        <label style="background: #0277BD; color: #fff; border: none; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; text-align: center;">
                            <i class="fas fa-upload"></i> ${t('btn_restore')}
                            <input type="file" id="restoreFile" accept=".json" style="display: none;" onchange="laporan.restoreBackup(event)">
                        </label>
                    </div>
                </div>

                <!-- Ringkasan Statistik Laporan -->
                <div class="section-title"><i class="fas fa-chart-pie" style="color: #2E7D32;"></i> ${t('summary_title')}</div>
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

        var keyNutrisi = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.NUTRISI) ? Storage.KEYS.NUTRISI : 'cozycs_nutrisi';
        var keySpray = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.SPRAY) ? Storage.KEYS.SPRAY : 'cozycs_spray';

        var nutrisiData = (typeof Storage !== 'undefined' && Storage.getAll) ? (Storage.getAll(keyNutrisi) || []) : [];
        var sprayData = (typeof Storage !== 'undefined' && Storage.getAll) ? (Storage.getAll(keySpray) || []) : [];

        container.innerHTML = `
            <div style="background: var(--card-bg, #fff); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">
                <div style="font-size: 11px; color: #777; font-weight: 600; text-transform: uppercase;">${t('lbl_total_nutrisi')}</div>
                <div style="font-size: 20px; font-weight: bold; color: #0277BD; margin-top: 4px;">${nutrisiData.length} <span style="font-size: 12px; font-weight: normal; color: #777;">${t('unit_records')}</span></div>
            </div>
            <div style="background: var(--card-bg, #fff); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">
                <div style="font-size: 11px; color: #777; font-weight: 600; text-transform: uppercase;">${t('lbl_total_spray')}</div>
                <div style="font-size: 20px; font-weight: bold; color: #6A1B9A; margin-top: 4px;">${sprayData.length} <span style="font-size: 12px; font-weight: normal; color: #777;">${t('unit_schedules')}</span></div>
            </div>
        `;
    }

    // Fungsi Mengunduh File Backup JSON
    function downloadBackup() {
        try {
            var keyNutrisi = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.NUTRISI) ? Storage.KEYS.NUTRISI : 'cozycs_nutrisi';
            var keySpray = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.SPRAY) ? Storage.KEYS.SPRAY : 'cozycs_spray';
            var keyGh = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GREENHOUSE) ? Storage.KEYS.GREENHOUSE : 'cozycs_greenhouse';
            var keyTanaman = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.TANAMAN) ? Storage.KEYS.TANAMAN : 'cozycs_tanaman';
            var keyPolinasi = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.POLINASI) ? Storage.KEYS.POLINASI : 'cozycs_polinasi';
            var keyPruning = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.PRUNING) ? Storage.KEYS.PRUNING : 'cozycs_pruning';
            var keyPanen = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.PANEN) ? Storage.KEYS.PANEN : 'cozycs_panen';
            var keyGudang = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GUDANG) ? Storage.KEYS.GUDANG : 'cozycs_gudang';

            var backupData = {
                version: "1.1",
                app: "Cozycs Farm Management",
                exportDate: new Date().toISOString(),
                data: {
                    nutrisi: (typeof Storage !== 'undefined' && Storage.getAll) ? Storage.getAll(keyNutrisi) : [],
                    spray: (typeof Storage !== 'undefined' && Storage.getAll) ? Storage.getAll(keySpray) : [],
                    schedules: (typeof Storage !== 'undefined' && Storage.getAll) ? Storage.getAll('cozycs_schedules') : [],
                    greenhouse: (typeof Storage !== 'undefined' && Storage.getAll) ? Storage.getAll(keyGh) : [],
                    tanaman: (typeof Storage !== 'undefined' && Storage.getAll) ? Storage.getAll(keyTanaman) : [],
                    polinasi: (typeof Storage !== 'undefined' && Storage.getAll) ? Storage.getAll(keyPolinasi) : [],
                    pruning: (typeof Storage !== 'undefined' && Storage.getAll) ? Storage.getAll(keyPruning) : [],
                    panen: (typeof Storage !== 'undefined' && Storage.getAll) ? Storage.getAll(keyPanen) : [],
                    gudang: (typeof Storage !== 'undefined' && Storage.getAll) ? Storage.getAll(keyGudang) : []
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
                Helper.showToast(t('toast_download_success'), 'success');
            }
        } catch (err) {
            alert(t('err_download') + err.message);
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
                    throw new Error(t('err_invalid_format'));
                }

                var keyNutrisi = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.NUTRISI) ? Storage.KEYS.NUTRISI : 'cozycs_nutrisi';
                var keySpray = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.SPRAY) ? Storage.KEYS.SPRAY : 'cozycs_spray';
                var keyGh = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GREENHOUSE) ? Storage.KEYS.GREENHOUSE : 'cozycs_greenhouse';
                var keyTanaman = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.TANAMAN) ? Storage.KEYS.TANAMAN : 'cozycs_tanaman';
                var keyPolinasi = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.POLINASI) ? Storage.KEYS.POLINASI : 'cozycs_polinasi';
                var keyPruning = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.PRUNING) ? Storage.KEYS.PRUNING : 'cozycs_pruning';
                var keyPanen = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.PANEN) ? Storage.KEYS.PANEN : 'cozycs_panen';
                var keyGudang = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GUDANG) ? Storage.KEYS.GUDANG : 'cozycs_gudang';

                // Masukkan kembali ke localStorage melalui Storage helper
                if (typeof Storage !== 'undefined' && Storage.saveAll) {
                    if (jsonContent.data.nutrisi) Storage.saveAll(keyNutrisi, jsonContent.data.nutrisi);
                    if (jsonContent.data.spray) Storage.saveAll(keySpray, jsonContent.data.spray);
                    if (jsonContent.data.schedules) Storage.saveAll('cozycs_schedules', jsonContent.data.schedules);
                    if (jsonContent.data.greenhouse) Storage.saveAll(keyGh, jsonContent.data.greenhouse);
                    if (jsonContent.data.tanaman) Storage.saveAll(keyTanaman, jsonContent.data.tanaman);
                    if (jsonContent.data.polinasi) Storage.saveAll(keyPolinasi, jsonContent.data.polinasi);
                    if (jsonContent.data.pruning) Storage.saveAll(keyPruning, jsonContent.data.pruning);
                    if (jsonContent.data.panen) Storage.saveAll(keyPanen, jsonContent.data.panen);
                    if (jsonContent.data.gudang) Storage.saveAll(keyGudang, jsonContent.data.gudang);
                }

                if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                    Helper.showToast(t('toast_restore_success'), 'success');
                } else {
                    alert(t('toast_restore_success'));
                }

                loadSummary();
                event.target.value = ''; // Reset input file
            } catch (err) {
                alert(t('err_restore') + err.message);
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

window.laporan = laporan;
