// ==========================================
// COZYCS FARM - MODUL DASHBOARD UTAMA & UNIFIED MONITORING
// (CONNECTED WITH: TANAMAN, GUDANG, GREENHOUSE & AKTIVITAS)
// ==========================================

var dashboard = (function() {

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Pusat Kontrol & Dasbor Utama',
            'stat_populasi': 'POPULASI TANAMAN',
            'stat_nilai_gudang': 'NILAI INVENTARIS',
            'stat_stok_kritis': 'STOK KRITIS',
            'stat_gh_aktif': 'GREENHOUSE AKTIF',
            'unit_trees': 'Pohon',
            'unit_items': 'Item',
            'unit_gh': 'Lokasi',
            'title_fase_tanaman': 'Sebaran Fase Pertumbuhan Tanaman',
            'title_peringatan_stok': 'Peringatan Stok & Nutrisi Kritis',
            'title_aktivitas_terakhir': 'Aktivitas Kebun Terakhir',
            'no_activities': 'Belum ada catatan aktivitas kebun.',
            'no_alerts': 'Semua persediaan stok & nutrisi dalam kondisi aman.',
            'lbl_estimasi_panen': 'Proyeksi Panen Terdekat',
            'lbl_pekatan_ab': 'Status Pekatan AB Mix',
            'btn_quick_tanaman': '+ Catat Perawatan',
            'btn_quick_gudang': '+ Restock Gudang'
        },
        'en': {
            'module_title': 'Main Command Center & Dashboard',
            'stat_populasi': 'PLANT POPULATION',
            'stat_nilai_gudang': 'INVENTORY VALUE',
            'stat_stok_kritis': 'CRITICAL STOCK',
            'stat_gh_aktif': 'ACTIVE GREENHOUSES',
            'unit_trees': 'Trees',
            'unit_items': 'Items',
            'unit_gh': 'Locations',
            'title_fase_tanaman': 'Growth Phase Distribution',
            'title_peringatan_stok': 'Stock & Nutrition Alerts',
            'title_aktivitas_terakhir': 'Recent Farm Activities',
            'no_activities': 'No recent farm activity logs.',
            'no_alerts': 'All stock and nutrition levels are in safe condition.',
            'lbl_estimasi_panen': 'Upcoming Harvest Projection',
            'lbl_pekatan_ab': 'AB Mix Concentrate Status',
            'btn_quick_tanaman': '+ Record Care',
            'btn_quick_gudang': '+ Restock Inventory'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    // HELPER PEMBACA DATA MULTI-FALLBACK
    function getData(key) {
        try {
            if (typeof Storage !== 'undefined' && typeof Storage.getAll === 'function') {
                var res = Storage.getAll(key);
                if (Array.isArray(res) && res.length > 0) return res;
            }
            var raw = localStorage.getItem(key);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch(e) {
            console.error('[Dashboard] Gagal membaca data ' + key, e);
        }
        return [];
    }

    function roundNumber(val) {
        var num = parseFloat(val) || 0;
        return parseFloat(num.toFixed(2));
    }

    function formatRupiah(val) {
        return 'Rp' + Math.round(val).toLocaleString('id-ID');
    }

    // ==========================================
    // RENDER TAMPILAN DASBOR
    // ==========================================
    function render() {
        return `
            <div class="dashboard-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div class="section-title" style="margin-bottom: 0;">
                        <i class="fas fa-chart-line" style="color: #2E7D32;"></i> ${t('module_title')}
                    </div>
                </div>

                <!-- 1. KARTU STATISTIK UTAMA KEBUN (4 GRID) -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;" id="dashStatCards">
                    <!-- Dynamic Stat Cards Hydrated by JS -->
                </div>

                <!-- 2. WIDGET SEBARAN FASE TANAMAN & PROYEKSI PANEN -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 14px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-seedling"></i> ${t('title_fase_tanaman')}
                    </div>
                    <div id="dashFaseDistributionContainer"></div>
                </div>

                <!-- 3. WIDGET PERINGATAN STOK GUDANG & NUTRISI KRITIS -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 14px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #C62828; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-exclamation-triangle"></i> ${t('title_peringatan_stok')}
                    </div>
                    <div id="dashAlertsContainer"></div>
                </div>

                <!-- 4. LOG AKTIVITAS TERAKHIR (REAL-TIME ACTIVITY FEED) -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 14px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #0277BD; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <span><i class="fas fa-history"></i> ${t('title_aktivitas_terakhir')}</span>
                    </div>
                    <div id="dashActivityFeedContainer"></div>
                </div>
            </div>
        `;
    }

    // ==========================================
    // LOGIKA KALKULASI DATA REAL-TIME & CROSS-MODULE
    // ==========================================
    function loadDashboardData() {
        loadStatCards();
        loadFaseDistribution();
        loadAlerts();
        loadActivityFeed();
    }

    function loadStatCards() {
        var container = document.getElementById('dashStatCards');
        if (!container) return;

        // A. Ambil Data Tanaman
        var keyTanaman = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.TANAMAN) ? Storage.KEYS.TANAMAN : 'cozycs_tanaman';
        var dataTanaman = getData(keyTanaman);
        var totalPopulasi = 0;

        // Ambil populasi unik per talang
        var uniqueTalang = {};
        dataTanaman.forEach(function(item) {
            if (item && item.talang && item.talang !== '-') {
                var pop = parseFloat(item.populasi) || 1;
                uniqueTalang[item.gh + '_' + item.talang] = pop;
            }
        });
        Object.keys(uniqueTalang).forEach(function(k) {
            totalPopulasi += uniqueTalang[k];
        });

        // B. Ambil Data Gudang (Hitung Nilai & Stok Kritis)
        var keyGudang = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GUDANG) ? Storage.KEYS.GUDANG : 'cozycs_gudang';
        var dataGudang = getData(keyGudang);
        
        var nilaiPersediaan = 0;
        var stokKritisCount = 0;

        dataGudang.forEach(function(item) {
            if (item && item.id && typeof item.nama === 'string' && item.nama.trim() !== '') {
                var stok = roundNumber(item.stok);
                var harga = parseFloat(item.harga) || 0;
                var stokMin = roundNumber(item.stokMin);

                if (stok > 0 && harga > 0) {
                    nilaiPersediaan += (stok * harga);
                }
                if (stok <= stokMin) {
                    stokKritisCount++;
                }
            }
        });

        // C. Ambil Data Greenhouse
        var keyGh = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GREENHOUSE) ? Storage.KEYS.GREENHOUSE : 'cozycs_greenhouse';
        var dataGh = getData(keyGh);
        var totalGh = dataGh.length > 0 ? dataGh.length : 1;

        container.innerHTML = `
            <div style="background: linear-gradient(135deg, #ffffff 0%, #f4fbf7 100%); padding: 14px 16px; border-radius: 14px; border: 1px solid #d4edda; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase;">${t('stat_populasi')}</div>
                        <div style="font-size: 18px; font-weight: 800; color: #2E7D32; margin-top: 4px;">${totalPopulasi} <span style="font-size: 12px; font-weight: 600;">${t('unit_trees')}</span></div>
                    </div>
                    <div style="background: #E8F5E9; color: #2E7D32; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-seedling"></i>
                    </div>
                </div>
            </div>

            <div style="background: linear-gradient(135deg, #ffffff 0%, #f2f9ff 100%); padding: 14px 16px; border-radius: 14px; border: 1px solid #cce5ff; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase;">${t('stat_nilai_gudang')}</div>
                        <div style="font-size: 17px; font-weight: 800; color: #0277BD; margin-top: 4px;">${formatRupiah(nilaiPersediaan)}</div>
                    </div>
                    <div style="background: #E1F5FE; color: #0277BD; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-wallet"></i>
                    </div>
                </div>
            </div>

            <div style="background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%); padding: 14px 16px; border-radius: 14px; border: 1px solid #ffcdd2; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase;">${t('stat_stok_kritis')}</div>
                        <div style="font-size: 18px; font-weight: 800; color: #C62828; margin-top: 4px;">${stokKritisCount} <span style="font-size: 12px; font-weight: 600;">${t('unit_items')}</span></div>
                    </div>
                    <div style="background: #FFEBEE; color: #C62828; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                </div>
            </div>

            <div style="background: linear-gradient(135deg, #ffffff 0%, #fef8ec 100%); padding: 14px 16px; border-radius: 14px; border: 1px solid #ffe8cc; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase;">${t('stat_gh_aktif')}</div>
                        <div style="font-size: 18px; font-weight: 800; color: #E65100; margin-top: 4px;">${totalGh} <span style="font-size: 12px; font-weight: 600;">${t('unit_gh')}</span></div>
                    </div>
                    <div style="background: #FFF3E0; color: #E65100; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-warehouse"></i>
                    </div>
                </div>
            </div>
        `;
    }

    function loadFaseDistribution() {
        var container = document.getElementById('dashFaseDistributionContainer');
        if (!container) return;

        var keyTanaman = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.TANAMAN) ? Storage.KEYS.TANAMAN : 'cozycs_tanaman';
        var dataTanaman = getData(keyTanaman);

        var countVeg = 0, countGen = 0, countFruit = 0, countHarvest = 0;

        dataTanaman.forEach(function(item) {
            var fase = String(item.fase || '').toLowerCase();
            if (fase.includes('semaian') || fase.includes('vegetatif')) countVeg++;
            else if (fase.includes('generatif') || fase.includes('bunga')) countGen++;
            else if (fase.includes('pembesaran') || fase.includes('buah')) countFruit++;
            else if (fase.includes('panen') || fase.includes('pematangan')) countHarvest++;
            else countVeg++;
        });

        var total = (countVeg + countGen + countFruit + countHarvest) || 1;
        var pVeg = Math.round((countVeg / total) * 100);
        var pGen = Math.round((countGen / total) * 100);
        var pFruit = Math.round((countFruit / total) * 100);
        var pHarvest = Math.round((countHarvest / total) * 100);

        container.innerHTML = `
            <div style="display: flex; height: 12px; border-radius: 6px; overflow: hidden; margin-bottom: 12px; background: #eee;">
                <div style="width: ${pVeg}%; background: #2E7D32;" title="Vegetatif: ${pVeg}%"></div>
                <div style="width: ${pGen}%; background: #F57F17;" title="Polinasi/Generatif: ${pGen}%"></div>
                <div style="width: ${pFruit}%; background: #0277BD;" title="Pembesaran Buah: ${pFruit}%"></div>
                <div style="width: ${pHarvest}%; background: #6A1B9A;" title="Panen: ${pHarvest}%"></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="width: 10px; height: 10px; border-radius: 3px; background: #2E7D32;"></span>
                    <span>Vegetatif: <strong>${countVeg}</strong> (${pVeg}%)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="width: 10px; height: 10px; border-radius: 3px; background: #F57F17;"></span>
                    <span>Polinasi: <strong>${countGen}</strong> (${pGen}%)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="width: 10px; height: 10px; border-radius: 3px; background: #0277BD;"></span>
                    <span>Pembesaran Buah: <strong>${countFruit}</strong> (${pFruit}%)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="width: 10px; height: 10px; border-radius: 3px; background: #6A1B9A;"></span>
                    <span>Pematangan/Panen: <strong>${countHarvest}</strong> (${pHarvest}%)</span>
                </div>
            </div>
        `;
    }

    function loadAlerts() {
        var container = document.getElementById('dashAlertsContainer');
        if (!container) return;

        var keyGudang = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GUDANG) ? Storage.KEYS.GUDANG : 'cozycs_gudang';
        var dataGudang = getData(keyGudang);

        var criticalItems = dataGudang.filter(function(item) {
            if (!item || !item.nama) return false;
            var stok = roundNumber(item.stok);
            var stokMin = roundNumber(item.stokMin);
            return stok <= stokMin;
        });

        if (criticalItems.length === 0) {
            container.innerHTML = `
                <div style="font-size: 12px; color: #2E7D32; background: #E8F5E9; padding: 10px 12px; border-radius: 8px; border: 1px solid #C8E6C9; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-check-circle"></i> ${t('no_alerts')}
                </div>
            `;
            return;
        }

        var html = '<div style="display: flex; flex-direction: column; gap: 6px;">';
        criticalItems.slice(0, 5).forEach(function(item) {
            var stok = roundNumber(item.stok);
            html += `
                <div style="background: #FFEBEE; border-left: 4px solid #C62828; padding: 8px 10px; border-radius: 6px; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #C62828;">${item.nama}</strong>
                        <span style="color: #555; font-size: 10px;"> (${item.kategori || 'Gudang'})</span>
                    </div>
                    <div style="font-weight: bold; color: #C62828;">
                        Sisa: ${stok} ${item.satuan || ''} (Min: ${item.stokMin || 0})
                    </div>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    }

    function loadActivityFeed() {
        var container = document.getElementById('dashActivityFeedContainer');
        if (!container) return;

        var keyAktivitas = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.AKTIVITAS) ? Storage.KEYS.AKTIVITAS : 'cozycs_aktivitas';
        var dataAktivitas = getData(keyAktivitas);

        if (!Array.isArray(dataAktivitas) || dataAktivitas.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; font-size: 12px; padding: 10px;">${t('no_activities')}</div>`;
            return;
        }

        var html = '<div style="display: flex; flex-direction: column; gap: 8px;">';
        dataAktivitas.slice(0, 5).forEach(function(act) {
            var color = act.color || '#2E7D32';
            var icon = act.icon || 'fas fa-tasks';
            html += `
                <div style="background: var(--inner-card-bg, #f9f9f9); padding: 8px 12px; border-radius: 8px; border-left: 3.5px solid ${color}; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: var(--text-color, #222);">${act.judul || 'Aktivitas'}</strong>
                        <div style="font-size: 11px; color: #666; margin-top: 2px;">${act.deskripsi || '-'}</div>
                    </div>
                    <div style="font-size: 10px; color: #888; text-align: right; min-width: 75px;">
                        <div>${act.tanggal || ''}</div>
                        <div style="font-weight: 600;">${act.jam || ''}</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    }

    function init() {
        loadDashboardData();

        // MENDENGARKAN PERUBAHAN DATA DARI SELURUH MODUL APLIKASI
        window.addEventListener('cozycs_data_changed', function() {
            loadDashboardData();
        });
    }

    return {
        render: render,
        init: init,
        loadDashboardData: loadDashboardData
    };

})();

window.dashboard = dashboard;
