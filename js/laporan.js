// ==========================================
// COZYCS FARM - MODUL LAPORAN & EKSPOR DATA (WITH DASHBOARD LOG & CROSS-BROWSER FIX)
// ==========================================

var laporan = (function() {

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Pusat Laporan & Unduhan Data',
            'module_subtitle': 'Unduh dan cetak rekapitulasi data dari seluruh modul operasional Cozycs Farm.',
            'lbl_export_csv': 'Unduh CSV / Excel',
            'lbl_print': 'Cetak / Simpan PDF',
            'lbl_total_records': 'Total Data',
            'unit_records': 'Data',
            'no_data_export': 'Tidak ada data untuk diunduh pada modul ini.',
            'toast_exported': 'Berhasil mengunduh laporan CSV untuk modul ',
            'mod_greenhouse': 'Master Greenhouse',
            'desc_greenhouse': 'Data spesifikasi fasilitas, luas area, tandon, dan status operasional GH.',
            'mod_tanaman': 'Monitoring Tanaman',
            'desc_tanaman': 'Data riwayat perkembangan, varietas, tinggi, daun, dan populasi.',
            'mod_buah': 'Pemeliharaan Buah',
            'desc_buah': 'Data penyortiran, pembesaran, kondisi netting, dan estimasi bobot.',
            'mod_gudang': 'Inventaris & Gudang',
            'desc_gudang': 'Master stok nutrisi, pestisida, alat, serta riwayat mutasi stok.',
            'mod_hama': 'Hama & Penyakit',
            'desc_hama': 'Catatan inspeksi OPT, gejala penyakit, dan tindakan penanganan.',
            'mod_jadwal': 'Jadwal & Agenda',
            'desc_jadwal': 'Rekap agenda tugas operasional harian, prioritas, dan status.',
            'mod_keuangan': 'Keuangan & Cashflow',
            'desc_keuangan': 'Laporan pemasukan, pengeluaran, serta estimasi laba bersih kebun.'
        },
        'en': {
            'module_title': 'Reports & Data Download Center',
            'module_subtitle': 'Download and print data summaries from all Cozycs Farm operational modules.',
            'lbl_export_csv': 'Download CSV / Excel',
            'lbl_print': 'Print / Save PDF',
            'lbl_total_records': 'Total Records',
            'unit_records': 'Items',
            'no_data_export': 'No data available to export for this module.',
            'toast_exported': 'Successfully downloaded CSV report for ',
            'mod_greenhouse': 'Greenhouse Master',
            'desc_greenhouse': 'Data on facility specs, area size, tanks, and GH operational status.',
            'mod_tanaman': 'Crop Monitoring',
            'desc_tanaman': 'Growth history data, varieties, height, leaf count, and population.',
            'mod_buah': 'Fruit Maintenance',
            'desc_buah': 'Sorting, sizing data, netting condition, and weight estimation.',
            'mod_gudang': 'Warehouse & Inventory',
            'desc_gudang': 'Master stock of nutrients, pesticides, tools, and stock mutation history.',
            'mod_hama': 'Pest & Disease',
            'desc_hama': 'Pest inspection records, disease symptoms, and treatment actions.',
            'mod_jadwal': 'Schedule & Agenda',
            'desc_jadwal': 'Summary of daily operational agenda, priorities, and status.',
            'mod_keuangan': 'Finance & Cash Flow',
            'desc_keuangan': 'Income, expense reports, and farm net profit estimation.'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    // Pemetaan Key Storage untuk Setiap Modul
    function getModuleStorageKey(modName) {
        if (typeof Storage !== 'undefined' && Storage.KEYS) {
            var keyMap = {
                'greenhouse': Storage.KEYS.GREENHOUSE || 'cozycs_greenhouse',
                'tanaman': Storage.KEYS.TANAMAN || 'cozycs_tanaman',
                'buah': Storage.KEYS.BUAH || 'cozycs_buah',
                'gudang': Storage.KEYS.GUDANG || 'cozycs_gudang',
                'hama': Storage.KEYS.HAMA || 'cozycs_hama',
                'jadwal': Storage.KEYS.JADWAL || 'cozycs_jadwal',
                'keuangan': Storage.KEYS.KEUANGAN || 'cozycs_keuangan'
            };
            return keyMap[modName] || ('cozycs_' + modName);
        }
        return 'cozycs_' + modName;
    }

    function getModuleData(modName) {
        var key = getModuleStorageKey(modName);
        if (typeof Storage !== 'undefined' && Storage.getAll) {
            return Storage.getAll(key) || [];
        }
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch(e) {
            return [];
        }
    }

    // HELPER CATAT LOG AKTIVITAS DAHBOARD
    function catatAktivitasDasbor(judul, deskripsi) {
        if (typeof Storage !== 'undefined' && Storage.add) {
            var keyAktivitas = (Storage.KEYS && Storage.KEYS.AKTIVITAS) ? Storage.KEYS.AKTIVITAS : 'cozycs_aktivitas';
            var now = new Date();
            var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            
            Storage.add(keyAktivitas, {
                judul: judul,
                deskripsi: deskripsi,
                tanggal: now.toISOString().split('T')[0],
                jam: timeStr,
                kategori: 'Laporan',
                icon: 'fas fa-file-download',
                color: '#2E7D32'
            });
        }
    }

    function render() {
        var modules = [
            { id: 'greenhouse', icon: 'fa-warehouse', color: '#2E7D32', titleKey: 'mod_greenhouse', descKey: 'desc_greenhouse' },
            { id: 'tanaman', icon: 'fa-seedling', color: '#388E3C', titleKey: 'mod_tanaman', descKey: 'desc_tanaman' },
            { id: 'buah', icon: 'fa-apple-alt', color: '#E65100', titleKey: 'mod_buah', descKey: 'desc_buah' },
            { id: 'gudang', icon: 'fa-boxes', color: '#F57F17', titleKey: 'mod_gudang', descKey: 'desc_gudang' },
            { id: 'hama', icon: 'fa-bug', color: '#C62828', titleKey: 'mod_hama', descKey: 'desc_hama' },
            { id: 'jadwal', icon: 'fa-calendar-alt', color: '#0277BD', titleKey: 'mod_jadwal', descKey: 'desc_jadwal' },
            { id: 'keuangan', icon: 'fa-wallet', color: '#1B5E20', titleKey: 'mod_keuangan', descKey: 'desc_keuangan' }
        ];

        var cardsHtml = '';
        modules.forEach(function(m) {
            var dataCount = getModuleData(m.id).length;

            cardsHtml += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 16px; margin-bottom: 14px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 36px; height: 36px; border-radius: 8px; background: var(--inner-card-bg, #f5f5f5); display: flex; align-items: center; justify-content: center;">
                                <i class="fas ${m.icon}" style="color: ${m.color}; font-size: 18px;"></i>
                            </div>
                            <div>
                                <strong style="font-size: 15px; color: var(--text-color, #222);">${t(m.titleKey)}</strong>
                                <div style="font-size: 11px; color: #888;">${t('lbl_total_records')}: <strong>${dataCount} ${t('unit_records')}</strong></div>
                            </div>
                        </div>
                    </div>

                    <div style="font-size: 12px; color: #777; margin-bottom: 12px; line-height: 1.4;">
                        ${t(m.descKey)}
                    </div>

                    <div style="display: flex; gap: 8px; border-top: 1px dashed var(--border-color, #eee); padding-top: 10px;">
                        <button onclick="laporan.exportCSV('${m.id}')" class="btn" style="flex: 1; background: #2E7D32; color: #fff; border: none; padding: 8px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <i class="fas fa-file-excel"></i> ${t('lbl_export_csv')}
                        </button>
                        <button onclick="laporan.printModule('${m.id}')" class="btn" style="background: var(--inner-card-bg, #f0f0f0); color: var(--text-color, #333); border: 1px solid var(--border-color, #ccc); padding: 8px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-print"></i> ${t('lbl_print')}
                        </button>
                    </div>
                </div>
            `;
        });

        return `
            <div class="dashboard-container" style="padding-bottom: 30px;">
                <div class="section-title" style="font-size: 15px; font-weight: 800; color: #2E7D32; margin-bottom: 4px;">
                    <i class="fas fa-file-download" style="color: #2E7D32;"></i> ${t('module_title')}
                </div>
                <div style="font-size: 12px; color: #888; margin-bottom: 16px;">
                    ${t('module_subtitle')}
                </div>

                ${cardsHtml}
            </div>
        `;
    }

    // FUNGSI EKSPOR KE CSV (EXCEL FRIENDLY)
    function exportCSV(modName) {
        var data = getModuleData(modName);

        if (!data || data.length === 0) {
            if (typeof Helper !== 'undefined' && Helper.showToast) {
                Helper.showToast(t('no_data_export'), 'error');
            } else {
                alert(t('no_data_export'));
            }
            return;
        }

        var headers = Object.keys(data[0]);
        var csvRows = [];

        // Add Header
        csvRows.push(headers.join(','));

        // Add Rows
        data.forEach(function(row) {
            var values = headers.map(function(header) {
                var val = row[header] === undefined || row[header] === null ? '' : row[header];
                if (typeof val === 'object') {
                    val = JSON.stringify(val);
                }
                var escaped = ('' + val).replace(/"/g, '""');
                return '"' + escaped + '"';
            });
            csvRows.push(values.join(','));
        });

        var csvString = csvRows.join('\n');
        var blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');

        var filename = 'CozycsFarm_' + modName.toUpperCase() + '_' + new Date().toISOString().split('T')[0] + '.csv';
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Catat Log ke Dasbor
        catatAktivitasDasbor('Unduh Laporan CSV', 'Modul ' + modName.toUpperCase() + ' (' + data.length + ' ' + t('unit_records') + ')');

        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast(t('toast_exported') + modName, 'success');
        }
    }

    // FUNGSI CETAK LAPORAN (PRINT WINDOW)
    function printModule(modName) {
        var data = getModuleData(modName);

        if (!data || data.length === 0) {
            if (typeof Helper !== 'undefined' && Helper.showToast) {
                Helper.showToast(t('no_data_export'), 'error');
            } else {
                alert(t('no_data_export'));
            }
            return;
        }

        var headers = Object.keys(data[0]);

        var tableHeaderHtml = '<tr>' + headers.map(function(h) {
            return '<th style="border:1px solid #ddd; padding:8px; background:#f2f2f2; font-size:12px; text-align:left;">' + h.toUpperCase() + '</th>';
        }).join('') + '</tr>';
        
        var tableBodyHtml = '';
        data.forEach(function(row) {
            tableBodyHtml += '<tr>' + headers.map(function(h) {
                var cell = row[h] !== undefined && row[h] !== null ? row[h] : '-';
                if (typeof cell === 'object') {
                    cell = JSON.stringify(cell);
                }
                return '<td style="border:1px solid #ddd; padding:8px; font-size:11px;">' + cell + '</td>';
            }).join('') + '</tr>';
        });

        var printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) {
            alert('Pop-up terblokir oleh browser. Harap izinkan pop-up untuk mencetak laporan.');
            return;
        }

        printWindow.document.write('<html><head><title>Laporan ' + modName.toUpperCase() + ' - Cozycs Farm</title>');
        printWindow.document.write('<style>body{font-family:Arial,sans-serif;padding:20px;} table{width:100%;border-collapse:collapse;margin-top:15px;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h2>COZYCS FARM - LAPORAN OPERASIONAL</h2>');
        printWindow.document.write('<h4>Modul: ' + modName.toUpperCase() + ' | Tanggal Cetak: ' + new Date().toLocaleDateString('id-ID') + '</h4>');
        printWindow.document.write('<table>' + tableHeaderHtml + tableBodyHtml + '</table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();

        // Catat Log ke Dasbor
        catatAktivitasDasbor('Cetak Laporan PDF', 'Modul ' + modName.toUpperCase() + ' (' + data.length + ' ' + t('unit_records') + ')');

        setTimeout(function() {
            printWindow.print();
        }, 500);
    }

    function init() {
        // Module Initialization
    }

    return {
        render: render,
        init: init,
        exportCSV: exportCSV,
        printModule: printModule
    };

})();

window.laporan = laporan;
