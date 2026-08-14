// ==========================================
// COZYCS FARM - MODUL MONITORING & PERAWATAN TANAMAN PRESISI
// (UNIFIED LIFE-CYCLE: VEGETATIF, PRUNING RUAS, POLINASI, SELEKSI BUAH & °BRIX)
// ==========================================

var tanaman = (function() {

    // VARIABEL STATE UNTUK PENCARIAN, SORTING, PAGINASI & SELEKSI MASSAL
    var searchQuery = '';
    var sortBy = 'tanggal_desc';
    var currentPage = 1;
    var itemsPerPage = 20;
    var selectedItemIds = [];

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Monitoring & Perawatan Tanaman Presisi',
            'form_title_add': 'Catat Rekam Jejak / Perawatan Tanaman',
            'form_title_edit': 'Edit Data Rekam Jejak Tanaman',
            'lbl_gh': 'ID Greenhouse',
            'select_gh': '-- Pilih Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_tgl_tanam': 'Tanggal Tanam Awal',
            'lbl_date': 'Tanggal Kegiatan / Cek',
            'lbl_hst': 'HST (Hari Setelah Tanam)',
            'lbl_category': 'Kategori Perawatan / Kegiatan',
            
            'opt_cat_growth': '1. Vegetatif & Growth (0-25 HST)',
            'opt_cat_pruning': '2. Pruning & Ruas Target (20-30 HST)',
            'opt_cat_polinasi': '3. Polinasi & Fruit Set (26-40 HST)',
            'opt_cat_buah': '4. Pembesaran & °Brix (41-70+ HST)',

            'lbl_gutter': 'Posisi Talang / Lubang',
            'ph_gutter': 'Contoh: J1-T1-L05',
            'lbl_variety': 'Varietas Melon',
            'ph_variety': 'Contoh: Inthanon / Dalmatian / Golden',
            'lbl_petugas': 'Penanggung Jawab / PIC',
            'ph_petugas': 'Contoh: Rizky',
            'default_petugas': 'Petugas Kebun',
            'lbl_phase': 'Fase Tanam Otomatis',
            'opt_phase_nursery': 'Semaian (0-10 HST)',
            'opt_phase_veg': 'Vegetatif (11-25 HST)',
            'opt_phase_flowering': 'Generatif / Bunga (26-40 HST)',
            'opt_phase_fruiting': 'Pembesaran Buah (41-65 HST)',
            'opt_phase_harvest': 'Pematangan / Panen (66+ HST)',
            
            // METRIK GROWTH
            'lbl_height': 'Tinggi Tanaman (cm)',
            'ph_height': 'Contoh: 120',
            'lbl_leaves': 'Jumlah Daun (Lembar)',
            'ph_leaves': 'Contoh: 18',
            'lbl_stem': 'Diameter Batang (mm)',
            'ph_stem': 'Contoh: 8.5',
            'lbl_population': 'Populasi (Pohon)',
            'ph_population': 'Contoh: 1',

            // METRIK PRUNING & RUAS
            'lbl_ruas_target': 'Posisi Ruas Cabang / Bunga',
            'ph_ruas_target': 'Contoh: Ruas 9 s/d 12',
            'lbl_prune_type': 'Tipe Perlakuan Pruning',
            'ph_prune_type': 'Contoh: Rempes Cabang Air Ruas 1-8 / Topping Daun 30',

            // METRIK POLINASI
            'lbl_flower_num': 'Posisi Ruas Bunga Dikawinkan',
            'ph_flower_num': 'Contoh: Ruas Ke-10',
            'lbl_pol_status': 'Hasil Polinasi / Fruit Set',
            'opt_pol_success': 'Berhasil / Calon Buah Jadi',
            'opt_pol_fail': 'Gagal / Rontok',

            // METRIK BUAH & BRIX
            'lbl_fruit_weight': 'Estimasi / Bobot Buah (Gram)',
            'ph_fruit_weight': 'Contoh: 1250',
            'lbl_fruit_brix': 'Kadar Gula (°Brix)',
            'ph_fruit_brix': 'Contoh: 14.5',
            'lbl_netting': 'Kualitas Jaring (Netting)',
            'opt_net_low': 'Mulai Pembentukan Net (20%)',
            'opt_net_mid': 'Net Tebal Merata (60%)',
            'opt_net_full': 'Net sempurna & Rapat (100%)',

            'lbl_desc': 'Catatan Khusus & Pengamatan',
            'ph_desc': 'Catatan defisiensi, kondisi fisik, perlakuan khusus...',
            'btn_save': 'Simpan Rekam Jejak',
            'btn_cancel': 'Batal',
            'recap_title': 'Riwayat Rekam Jejak Siklus Tanaman',
            'no_data': 'Belum ada catatan kegiatan perawatan tanaman.',
            'card_lbl_loc_variety': 'Varietas & Lokasi',
            'card_lbl_metrics': 'Metrik Pertumbuhan / Hasil',
            'card_lbl_pop_petugas': 'Kategori & PIC',
            'card_lbl_status': 'Fase & Timbal Balik',
            'unit_cm': 'cm',
            'unit_leaves': 'Daun',
            'unit_mm': 'mm',
            'unit_trees': 'Pohon',
            'unit_gram': 'g',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Data rekam jejak tanaman berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus catatan rekam jejak ini?',
            'toast_deleted': 'Catatan berhasil dihapus',
            'ph_search': 'Cari varietas, GH, talang, ruas, kategori...',
            'btn_prev': 'Sebelumnya',
            'btn_next': 'Selanjutnya',
            'page_lbl': 'Halaman',
            'total_lbl': 'Total Data',
            'btn_generate_batch': 'Generate Custom Lubang',
            
            'opt_sort_newest': 'Terbaru ➔ Terlama',
            'opt_sort_oldest': 'Terlama ➔ Terbaru',
            'opt_sort_talang_asc': 'Talang / Lubang (A-Z)',
            'opt_sort_variety_asc': 'Varietas Melon (A-Z)',
            'opt_sort_variety_desc': 'Varietas Melon (Z-A)',
            'opt_sort_gh_asc': 'Greenhouse (GH-01, GH-02)'
        },
        'en': {
            'module_title': 'Precision Crop Life-Cycle Monitoring',
            'form_title_add': 'Record Crop Care & Growth Track',
            'form_title_edit': 'Edit Crop Record',
            'lbl_gh': 'Greenhouse ID',
            'select_gh': '-- Select Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_tgl_tanam': 'Planting Date',
            'lbl_date': 'Check Date',
            'lbl_hst': 'DAP (Days After Planting)',
            'lbl_category': 'Care Category',
            
            'opt_cat_growth': '1. Vegetative & Growth (0-25 DAP)',
            'opt_cat_pruning': '2. Pruning & Node Target (20-30 DAP)',
            'opt_cat_polinasi': '3. Pollination & Fruit Set (26-40 DAP)',
            'opt_cat_buah': '4. Sizing & °Brix (41-70+ DAP)',

            'lbl_gutter': 'Gutter / Hole Position',
            'ph_gutter': 'e.g., J1-T1-L05',
            'lbl_variety': 'Melon Variety',
            'ph_variety': 'e.g., Inthanon / Dalmatian / Golden',
            'lbl_petugas': 'PIC',
            'ph_petugas': 'e.g., Rizky',
            'default_petugas': 'Field Officer',
            'lbl_phase': 'Auto Phase Stage',
            'opt_phase_nursery': 'Nursery (0-10 DAP)',
            'opt_phase_veg': 'Vegetative (11-25 DAP)',
            'opt_phase_flowering': 'Generative / Flowering (26-40 DAP)',
            'opt_phase_fruiting': 'Fruit Sizing (41-65 DAP)',
            'opt_phase_harvest': 'Ripening / Harvest (66+ DAP)',

            'lbl_height': 'Height (cm)',
            'ph_height': 'e.g., 120',
            'lbl_leaves': 'Leaf Count',
            'ph_leaves': 'e.g., 18',
            'lbl_stem': 'Stem Diameter (mm)',
            'ph_stem': 'e.g., 8.5',
            'lbl_population': 'Population (Trees)',
            'ph_population': 'e.g., 1',

            'lbl_ruas_target': 'Node / Branch Position',
            'ph_ruas_target': 'e.g., Node 9 to 12',
            'lbl_prune_type': 'Pruning Action Type',
            'ph_prune_type': 'e.g., Trim side shoots node 1-8 / Top leaf 30',

            'lbl_flower_num': 'Pollinated Node Position',
            'ph_flower_num': 'e.g., Node 10',
            'lbl_pol_status': 'Fruit Set Status',
            'opt_pol_success': 'Success / Fruit Set',
            'opt_pol_fail': 'Failed / Dropped',

            'lbl_fruit_weight': 'Fruit Weight (Grams)',
            'ph_fruit_weight': 'e.g., 1250',
            'lbl_fruit_brix': 'Brix Degree (°Brix)',
            'ph_fruit_brix': 'e.g., 14.5',
            'lbl_netting': 'Netting Quality',
            'opt_net_low': 'Net Starting (20%)',
            'opt_net_mid': 'Dense Netting (60%)',
            'opt_net_full': 'Full & Perfect Netting (100%)',

            'lbl_desc': 'Observation Notes',
            'ph_desc': 'Notes on deficiency, physical condition, treatment...',
            'btn_save': 'Save Life-Cycle Record',
            'btn_cancel': 'Cancel',
            'recap_title': 'Plant Life-Cycle Timeline Log',
            'no_data': 'No plant care records found.',
            'card_lbl_loc_variety': 'Variety & Location',
            'card_lbl_metrics': 'Growth Metrics / Result',
            'card_lbl_pop_petugas': 'Category & PIC',
            'card_lbl_status': 'Phase & Feedback',
            'unit_cm': 'cm',
            'unit_leaves': 'Leaves',
            'unit_mm': 'mm',
            'unit_trees': 'Trees',
            'unit_gram': 'g',
            'lbl_notes': 'Notes',
            'toast_saved': 'Record saved successfully!',
            'confirm_delete': 'Are you sure you want to delete this record?',
            'toast_deleted': 'Record deleted successfully',
            'ph_search': 'Search variety, GH, gutter, node, category...',
            'btn_prev': 'Previous',
            'btn_next': 'Next',
            'page_lbl': 'Page',
            'total_lbl': 'Total Data',
            'btn_generate_batch': 'Generate Custom Holes',
            
            'opt_sort_newest': 'Newest ➔ Oldest',
            'opt_sort_oldest': 'Oldest ➔ Newest',
            'opt_sort_talang_asc': 'Gutter / Hole (A-Z)',
            'opt_sort_variety_asc': 'Variety (A-Z)',
            'opt_sort_variety_desc': 'Variety (Z-A)',
            'opt_sort_gh_asc': 'Greenhouse (GH-01, GH-02)'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function getKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.TANAMAN) {
            return Storage.KEYS.TANAMAN;
        }
        return 'cozycs_tanaman';
    }

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
            console.error('[Tanaman] Gagal membaca data ' + key, e);
        }
        return [];
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val;
    }

    // ==========================================
    // RENDER MARKUP DYNAMIC MODULE (SPA ROUTER COMPATIBILITY)
    // ==========================================
    function render() {
        return `
            <div id="page-tanaman-content" class="module-page" style="padding: 16px;">
                <div id="titleFormTanaman" style="font-size: 16px; font-weight: 800; color: #1B5E20; margin-bottom: 12px;">
                    ${t('module_title')}
                </div>
                
                <!-- CONTAINER UTAMA UNTUK DAFTAR & FORM REKAP TANAMAN -->
                <div id="recapTanamanList"></div>
            </div>
        `;
    }

    // ==========================================
    // HELPER KALKULASI HST DINAMIS (KALENDER MURNI MIDNIGHT NORMALIZATION)
    // ==========================================
    function parseLocalDate(dateStr) {
        if (!dateStr) return null;
        if (dateStr instanceof Date) {
            var d = new Date(dateStr.getTime());
            d.setHours(0, 0, 0, 0);
            return d;
        }
        var str = String(dateStr).trim().split('T')[0];
        
        if (str.includes('-') || str.includes('/')) {
            var parts = str.split(/[-/]/);
            if (parts.length === 3) {
                var p1 = parseInt(parts[0], 10);
                var p2 = parseInt(parts[1], 10);
                var p3 = parseInt(parts[2], 10);

                if (p1 > 1000) { // Format YYYY-MM-DD
                    return new Date(p1, Math.max(0, p2 - 1), p3, 0, 0, 0, 0);
                } else if (p3 > 1000) { // Format DD-MM-YYYY
                    return new Date(p3, Math.max(0, p2 - 1), p1, 0, 0, 0, 0);
                }
            }
        }

        var parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
            parsed.setHours(0, 0, 0, 0);
            return parsed;
        }
        return null;
    }

    function hitungHST(tglTanam, tglCek) {
        if (!tglTanam) return 0;
        
        var tanamDate = parseLocalDate(tglTanam);
        var checkDate = tglCek ? parseLocalDate(tglCek) : parseLocalDate(new Date());

        if (!tanamDate || !checkDate) return 0;
        if (checkDate < tanamDate) return 0;

        var diffTime = checkDate.getTime() - tanamDate.getTime();
        var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 ? diffDays : 0;
    }

    function deteksiFaseOtomatis(hst) {
        if (hst <= 10) return t('opt_phase_nursery');
        if (hst <= 25) return t('opt_phase_veg');
        if (hst <= 40) return t('opt_phase_flowering');
        if (hst <= 65) return t('opt_phase_fruiting');
        return t('opt_phase_harvest');
    }

    function updateHstDisplay() {
        var tglTanam = getVal('tanamanTglTanam');
        var tglCek = getVal('tanamanTanggal');
        var hstEl = document.getElementById('textHstDisplay');
        var faseSelect = document.getElementById('tanamanFase');

        if (tglTanam) {
            var hst = hitungHST(tglTanam, tglCek || new Date());
            if (hstEl) hstEl.innerText = hst + ' HST';
            var faseAuto = deteksiFaseOtomatis(hst);
            if (faseSelect) faseSelect.value = faseAuto;
        } else {
            if (hstEl) hstEl.innerText = '0 HST';
        }
    }

    function populateGhDropdown() {
        var selectEl = document.getElementById('tanamanGh');
        if (!selectEl) return;

        var keyGh = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GREENHOUSE) ? Storage.KEYS.GREENHOUSE : 'cozycs_greenhouse';
        var dataGh = getData(keyGh);

        var optionsHtml = `<option value="">${t('select_gh')}</option>`;
        if (Array.isArray(dataGh) && dataGh.length > 0) {
            dataGh.forEach(function(gh) {
                if (gh && gh.kode) {
                    optionsHtml += `<option value="${gh.kode}">${gh.kode} - ${gh.nama || 'GH'}</option>`;
                }
            });
        } else {
            optionsHtml += `<option value="GH-01">${t('gh_default')}</option>`;
        }

        selectEl.innerHTML = optionsHtml;
    }

    function toggleKategoriFields(cat) {
        var secGrowth = document.getElementById('secMetrikGrowth');
        var secPruning = document.getElementById('secMetrikPruning');
        var secPolinasi = document.getElementById('secMetrikPolinasi');
        var secBuah = document.getElementById('secMetrikBuah');

        if (secGrowth) secGrowth.style.display = (cat === 'Growth' || !cat) ? 'grid' : 'none';
        if (secPruning) secPruning.style.display = (cat === 'Pruning') ? 'block' : 'none';
        if (secPolinasi) secPolinasi.style.display = (cat === 'Polinasi') ? 'grid' : 'none';
        if (secBuah) secBuah.style.display = (cat === 'Buah') ? 'grid' : 'none';
    }

    function openGenerateModal() {
        var modalEl = document.getElementById('modalGenerateCustom');
        if (modalEl) {
            modalEl.style.display = 'flex';
            updateTotalPreview();
        }
    }

    function closeGenerateModal() {
        var modalEl = document.getElementById('modalGenerateCustom');
        if (modalEl) modalEl.style.display = 'none';
    }

    function updateTotalPreview() {
        var j = parseInt(getVal('genJalur')) || 0;
        var tVal = parseInt(getVal('genTalang')) || 0;
        var l = parseInt(getVal('genLubang')) || 0;
        var total = j * tVal * l;
        
        var previewEl = document.getElementById('textTotalGeneratePreview');
        if (previewEl) {
            previewEl.innerText = total + ' Lubang Tanam';
        }
    }

    function processGenerateCustom() {
        var gh = getVal('tanamanGh') || 'GH-01';
        var tglTanam = getVal('tanamanTglTanam') || new Date().toISOString().split('T')[0];
        var tanggal = getVal('tanamanTanggal') || new Date().toISOString().split('T')[0];
        var varietas = getVal('tanamanVarietas') || 'Inthanon';
        var petugas = getVal('tanamanPetugas') || t('default_petugas');

        var totalJalur = parseInt(getVal('genJalur')) || 0;
        var totalTalang = parseInt(getVal('genTalang')) || 0;
        var totalLubang = parseInt(getVal('genLubang')) || 0;

        if (totalJalur <= 0 || totalTalang <= 0 || totalLubang <= 0) {
            alert('Harap isi jumlah Jalur, Talang, dan Lubang dengan benar!');
            return;
        }

        var totalExpected = totalJalur * totalTalang * totalLubang;
        if (!confirm('Generate otomatis ' + totalExpected + ' data lubang tanam untuk ' + gh + '?')) return;

        var storageKey = getKey();

        for (var j = 1; j <= totalJalur; j++) {
            for (var tIdx = 1; tIdx <= totalTalang; tIdx++) {
                for (var l = 1; l <= totalLubang; l++) {
                    var padLubang = l < 10 ? '0' + l : '' + l;
                    var kodeTalangFormat = 'J' + j + '-T' + tIdx + '-L' + padLubang;

                    var payload = {
                        gh: gh,
                        kategori: 'Growth',
                        tglTanam: tglTanam,
                        tanggal: tanggal,
                        hst: hitungHST(tglTanam, tanggal),
                        varietas: varietas,
                        talang: kodeTalangFormat,
                        fase: t('opt_phase_nursery'),
                        petugas: petugas,
                        tinggi: 0,
                        daun: 0,
                        batang: 0,
                        populasi: 1,
                        desc: 'Inisialisasi Custom Batch Tanam'
                    };

                    if (typeof Storage !== 'undefined' && Storage.add) {
                        Storage.add(storageKey, payload);
                    }
                }
            }
        }

        closeGenerateModal();
        loadTable();
        window.dispatchEvent(new Event('cozycs_data_changed'));
    }

    function showHistoryModal(kodeTalang, kodeGh) {
        var storageKey = getKey();
        var allData = getData(storageKey);

        var historyList = allData.filter(function(item) {
            return (item.talang === kodeTalang) && (item.gh === kodeGh);
        });

        historyList.sort(function(a, b) {
            return new Date(a.tanggal) - new Date(b.tanggal);
        });

        if (historyList.length === 0) {
            alert('Belum ada riwayat rekam jejak untuk ' + kodeTalang);
            return;
        }

        var htmlContent = `
            <div style="margin-bottom: 12px; font-size: 13px; color: #555;">
                <i class="fas fa-seedling" style="color: #2E7D32;"></i> Lokasi: <strong>${kodeGh} - ${kodeTalang}</strong> | Varietas: <strong>${historyList[0].varietas || '-'}</strong>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; max-height: 380px; overflow-y: auto; padding-right: 4px;">
        `;

        historyList.forEach(function(h) {
            var kat = h.kategori || 'Growth';
            var badgeBg = '#E8F5E9';
            var badgeColor = '#2E7D32';
            var detailText = '';

            // KALKULASI HST DINAMIS PADA RIWAYAT LOG
            var hstHistory = hitungHST(h.tglTanam || h.tanggal, h.tanggal || new Date());

            if (kat === 'Pruning') {
                badgeBg = '#E1F5FE'; badgeColor = '#0288D1';
                detailText = `<div>Perlakuan: <strong>${h.tipePruning || 'Rempes Cabang Air'}</strong></div><div>Ruas Target: <strong>${h.ruasTarget || '-'}</strong></div>`;
            } else if (kat === 'Polinasi') {
                badgeBg = '#FFF3E0'; badgeColor = '#E65100';
                detailText = `<div>Ruas Kawin: <strong>${h.posisiBunga || '-'}</strong> | Status: <strong>${h.statusPolinasi || 'Sukses'}</strong></div>`;
            } else if (kat === 'Buah') {
                badgeBg = '#F3E5F5'; badgeColor = '#6A1B9A';
                detailText = `<div>Bobot: <strong>${h.bobotBuah || 0} Gram</strong> | Kadar Gula: <strong>${h.brixBuah || 0}° Brix</strong></div>`;
            } else {
                detailText = `<div>Tinggi: <strong>${h.tinggi || 0} cm</strong> | Daun: <strong>${h.daun || 0} lmbr</strong> | Ø <strong>${h.batang || 0} mm</strong></div>`;
            }

            htmlContent += `
                <div style="background: var(--inner-card-bg, #f9f9f9); border-left: 4px solid ${badgeColor}; border-radius: 8px; padding: 10px; font-size: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <strong style="color: ${badgeColor};"><i class="far fa-calendar-alt"></i> ${h.tanggal || '-'} <span style="background:#2E7D32; color:#fff; padding:1px 6px; border-radius:4px; font-size:10px; margin-left:4px;">${hstHistory} HST</span></strong>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; font-weight: bold; padding: 2px 8px; border-radius: 4px; font-size: 10px;">${kat}</span>
                    </div>
                    <div style="background: #fff; padding: 6px; border-radius: 6px; border: 1px solid #eee; margin-bottom: 6px; font-size: 11px;">
                        ${detailText}
                    </div>
                    ${h.desc ? `<div style="color: #666; font-style: italic; font-size: 10.5px;"><i class="far fa-comment-alt"></i> ${h.desc}</div>` : ''}
                </div>
            `;
        });

        htmlContent += `</div>`;

        var modalEl = document.getElementById('modalHistoryLogContainer');
        if (modalEl) {
            var bodyEl = document.getElementById('modalHistoryLogBody');
            if (bodyEl) bodyEl.innerHTML = htmlContent;
            modalEl.style.display = 'flex';
        } else {
            alert('Riwayat Rekam Jejak ' + kodeTalang + ':\n' + historyList.map(function(x){ return x.tanggal + ' (' + x.kategori + ') - ' + (x.desc || ''); }).join('\n'));
        }
    }

    function closeHistoryModal() {
        var modalEl = document.getElementById('modalHistoryLogContainer');
        if (modalEl) modalEl.style.display = 'none';
    }

    // ==========================================
    // RENDER & SIMPAN FORM DATA TANAMAN
    // ==========================================
    function saveData() {
        var id = getVal('tanamanId');
        var gh = getVal('tanamanGh') || 'GH-01';
        var tglTanam = getVal('tanamanTglTanam');
        var tanggal = getVal('tanamanTanggal') || new Date().toISOString().split('T')[0];
        var kat = getVal('tanamanKategori') || 'Growth';
        var talang = getVal('tanamanTalang');
        var varietas = getVal('tanamanVarietas') || 'Inthanon';
        var petugas = getVal('tanamanPetugas') || t('default_petugas');
        var fase = getVal('tanamanFase') || deteksiFaseOtomatis(hitungHST(tglTanam, tanggal));

        if (!tglTanam) {
            alert('Harap isi Tanggal Tanam Awal!');
            return;
        }

        var payload = {
            gh: gh,
            kategori: kat,
            tglTanam: tglTanam,
            tanggal: tanggal,
            hst: hitungHST(tglTanam, tanggal),
            talang: talang,
            varietas: varietas,
            petugas: petugas,
            fase: fase,
            tinggi: parseFloat(getVal('tanamanTinggi')) || 0,
            daun: parseInt(getVal('tanamanDaun')) || 0,
            batang: parseFloat(getVal('tanamanBatang')) || 0,
            populasi: parseInt(getVal('tanamanPopulasi')) || 1,
            ruasTarget: getVal('tanamanRuasTarget'),
            tipePruning: getVal('tanamanTipePruning'),
            posisiBunga: getVal('tanamanPosisiBunga'),
            statusPolinasi: getVal('tanamanStatusPolinasi'),
            bobotBuah: parseFloat(getVal('tanamanBobotBuah')) || 0,
            brixBuah: parseFloat(getVal('tanamanBrixBuah')) || 0,
            netting: getVal('tanamanNetting'),
            desc: getVal('tanamanDesc')
        };

        var key = getKey();
        if (id) {
            if (typeof Storage !== 'undefined' && Storage.update) {
                Storage.update(key, id, payload);
            }
        } else {
            if (typeof Storage !== 'undefined' && Storage.add) {
                Storage.add(key, payload);
            }
        }

        resetForm();
        loadTable();
        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast(t('toast_saved'));
        }
        window.dispatchEvent(new Event('cozycs_data_changed'));
    }

    function resetForm() {
        setVal('tanamanId', '');
        setVal('tanamanGh', 'GH-01');
        
        var todayStr = new Date().toISOString().split('T')[0];
        setVal('tanamanTglTanam', todayStr);
        setVal('tanamanTanggal', todayStr);
        setVal('tanamanKategori', 'Growth');
        setVal('tanamanTalang', '');
        setVal('tanamanVarietas', '');
        setVal('tanamanPetugas', t('default_petugas'));
        
        setVal('tanamanTinggi', '');
        setVal('tanamanDaun', '');
        setVal('tanamanBatang', '');
        setVal('tanamanPopulasi', '1');
        
        setVal('tanamanRuasTarget', '');
        setVal('tanamanTipePruning', '');
        
        setVal('tanamanPosisiBunga', '');
        setVal('tanamanStatusPolinasi', t('opt_pol_success'));
        
        setVal('tanamanBobotBuah', '');
        setVal('tanamanBrixBuah', '');
        setVal('tanamanNetting', t('opt_net_low'));
        
        setVal('tanamanDesc', '');

        toggleKategoriFields('Growth');
        updateHstDisplay();

        var titleEl = document.getElementById('titleFormTanaman');
        if (titleEl) titleEl.innerText = t('form_title_add');
    }

    function editData(id) {
        var key = getKey();
        var item = null;

        if (typeof Storage !== 'undefined' && Storage.getById) {
            item = Storage.getById(key, id);
        } else {
            var list = getData(key);
            item = list.find(function(x) { return x.id === id; });
        }

        if (!item) return;

        setVal('tanamanId', item.id);
        setVal('tanamanGh', item.gh || 'GH-01');
        setVal('tanamanTglTanam', item.tglTanam || item.tanggal || new Date().toISOString().split('T')[0]);
        setVal('tanamanTanggal', item.tanggal || new Date().toISOString().split('T')[0]);
        setVal('tanamanKategori', item.kategori || 'Growth');
        setVal('tanamanTalang', item.talang || '');
        setVal('tanamanVarietas', item.varietas || '');
        setVal('tanamanPetugas', item.petugas || t('default_petugas'));
        setVal('tanamanFase', item.fase || deteksiFaseOtomatis(item.hst));

        setVal('tanamanTinggi', item.tinggi || '');
        setVal('tanamanDaun', item.daun || '');
        setVal('tanamanBatang', item.batang || '');
        setVal('tanamanPopulasi', item.populasi || '1');

        setVal('tanamanRuasTarget', item.ruasTarget || '');
        setVal('tanamanTipePruning', item.tipePruning || '');

        setVal('tanamanPosisiBunga', item.posisiBunga || '');
        setVal('tanamanStatusPolinasi', item.statusPolinasi || t('opt_pol_success'));

        setVal('tanamanBobotBuah', item.bobotBuah || '');
        setVal('tanamanBrixBuah', item.brixBuah || '');
        setVal('tanamanNetting', item.netting || t('opt_net_low'));

        setVal('tanamanDesc', item.desc || '');

        toggleKategoriFields(item.kategori || 'Growth');
        updateHstDisplay();

        var titleEl = document.getElementById('titleFormTanaman');
        if (titleEl) titleEl.innerText = t('form_title_edit');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteData(id) {
        if (!confirm(t('confirm_delete'))) return;
        var key = getKey();
        if (typeof Storage !== 'undefined' && Storage.delete) {
            Storage.delete(key, id);
        }
        loadTable();
        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast(t('toast_deleted'));
        }
        window.dispatchEvent(new Event('cozycs_data_changed'));
    }

    // ==========================================
    // RENDER LIST KARTU TANAMAN & DYNAMIC HST
    // ==========================================
    function loadTable() {
        var elContainer = document.getElementById('recapTanamanList');
        if (!elContainer) return;

        var key = getKey();
        var rawList = getData(key);

        if (!Array.isArray(rawList) || rawList.length === 0) {
            elContainer.innerHTML = `
                <div style="text-align: center; padding: 24px; color: #888; font-size: 13px;">
                    <i class="fas fa-seedling" style="font-size: 32px; color: #ccc; margin-bottom: 8px; display: block;"></i>
                    ${t('no_data')}
                </div>
            `;
            return;
        }

        // FILTER SEARCH QUERY
        var filtered = rawList.filter(function(item) {
            if (!item) return false;
            if (!searchQuery) return true;
            var q = searchQuery.toLowerCase();
            var text = (item.varietas || '') + ' ' + (item.gh || '') + ' ' + (item.talang || '') + ' ' + 
                       (item.kategori || '') + ' ' + (item.petugas || '') + ' ' + (item.desc || '');
            return text.toLowerCase().includes(q);
        });

        // SORTING
        filtered.sort(function(a, b) {
            if (sortBy === 'oldest') {
                return new Date(a.tanggal || 0) - new Date(b.tanggal || 0);
            } else if (sortBy === 'talang_asc') {
                return String(a.talang || '').localeCompare(String(b.talang || ''));
            } else if (sortBy === 'variety_asc') {
                return String(a.varietas || '').localeCompare(String(b.varietas || ''));
            } else if (sortBy === 'variety_desc') {
                return String(b.varietas || '').localeCompare(String(a.varietas || ''));
            } else if (sortBy === 'gh_asc') {
                return String(a.gh || '').localeCompare(String(b.gh || ''));
            } else {
                return new Date(b.tanggal || 0) - new Date(a.tanggal || 0);
            }
        });

        // PAGINASI
        var totalItems = filtered.length;
        var totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startIdx = (currentPage - 1) * itemsPerPage;
        var paginatedItems = filtered.slice(startIdx, startIdx + itemsPerPage);

        var html = '';
        paginatedItems.forEach(function(item) {
            html += renderCard(item);
        });

        // PAGINATION FOOTER CONTROL
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding: 10px; background: #fff; border-radius: 12px; border: 1px solid #E0E0E0; font-size: 11px;">
                <button onclick="tanaman.changePage(-1)" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:default;"' : ''} style="background: #2E7D32; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                    <i class="fas fa-chevron-left"></i> ${t('btn_prev')}
                </button>

                <span style="font-weight: 700; color: #444;">
                    ${t('page_lbl')} <strong>${currentPage}</strong> / ${totalPages} (${t('total_lbl')}: ${totalItems})
                </span>

                <button onclick="tanaman.changePage(1)" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:default;"' : ''} style="background: #2E7D32; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                    ${t('btn_next')} <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        elContainer.innerHTML = html;
    }

    // ==========================================
    // RENDER KARTU TANAMAN SINGLE ITEM
    // ==========================================
    function renderCard(item) {
        if (!item) return '';

        var kat = item.kategori || 'Growth';
        var katBadgeBg = '#E8F5E9';
        var katBadgeColor = '#2E7D32';

        if (kat === 'Pruning') { katBadgeBg = '#E1F5FE'; katBadgeColor = '#0288D1'; }
        else if (kat === 'Polinasi') { katBadgeBg = '#FFF3E0'; katBadgeColor = '#E65100'; }
        else if (kat === 'Buah') { katBadgeBg = '#F3E5F5'; katBadgeColor = '#6A1B9A'; }

        // KALKULASI HST RIIL BERDASARKAN TANGGAL TANAM AWAL DAN TANGGAL SEKARANG
        var tglTanamAwal = item.tglTanam || item.tanggal;
        var hstRill = hitungHST(tglTanamAwal, new Date());

        var metricsContent = '';
        if (kat === 'Pruning') {
            metricsContent = `
                <div style="font-size: 11px; color: #333;">
                    <div>⚙️ Perlakuan: <strong>${item.tipePruning || 'Pruning Cabang'}</strong></div>
                    <div>🎯 Target: <strong>${item.ruasTarget || 'Ruas 9-12'}</strong></div>
                </div>
            `;
        } else if (kat === 'Polinasi') {
            metricsContent = `
                <div style="font-size: 11px; color: #333;">
                    <div>🌺 Bunga Kawin: <strong>${item.posisiBunga || 'Ruas 10'}</strong></div>
                    <div>⚡ Status: <strong style="color:${item.statusPolinasi === 'Gagal' ? '#C62828' : '#2E7D32'};">${item.statusPolinasi || 'Berhasil'}</strong></div>
                </div>
            `;
        } else if (kat === 'Buah') {
            metricsContent = `
                <div style="font-size: 11px; color: #333;">
                    <div>⚖️ Bobot: <strong>${item.bobotBuah || 0} ${t('unit_gram')}</strong></div>
                    <div>🍬 Brix: <strong>${item.brixBuah || 0}° Brix</strong></div>
                    <div>🕸️ Net: <strong>${item.netting || 'Merata'}</strong></div>
                </div>
            `;
        } else {
            metricsContent = `
                <div style="display: flex; gap: 8px; font-size: 11px; color: #333;">
                    <span>📏 <strong>${item.tinggi || 0} ${t('unit_cm')}</strong></span> | 
                    <span>🍃 <strong>${item.daun || 0} ${t('unit_leaves')}</strong></span> | 
                    <span>↔️ <strong>Ø ${item.batang || 0} ${t('unit_mm')}</strong></span>
                </div>
            `;
        }

        var isChecked = selectedItemIds.includes(item.id);

        return `
            <div style="background: #ffffff; border-radius: 14px; border: 1px solid #E0E0E0; padding: 14px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                
                <!-- CARD HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} onclick="tanaman.toggleSelectItem('${item.id}')" style="width: 16px; height: 16px; cursor: pointer;">
                        <span style="font-size: 12px; font-weight: 800; color: #1B5E20;">
                            📅 ${item.tanggal || '-'}
                        </span>
                        <span style="background: #2E7D32; color: #ffffff; font-weight: 800; padding: 2px 8px; border-radius: 8px; font-size: 10px;">
                            ${hstRill} HST
                        </span>
                    </div>

                    <span style="background: ${katBadgeBg}; color: ${katBadgeColor}; font-weight: 800; padding: 3px 10px; border-radius: 10px; font-size: 10px; text-transform: uppercase;">
                        ${kat}
                    </span>
                </div>

                <!-- CARD GRID CONTENT -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; background: #F9F9F9; padding: 10px; border-radius: 10px; border: 1px solid #EEEEEE; margin-bottom: 10px;">
                    <div>
                        <div style="font-size: 9px; font-weight: 700; color: #777; text-transform: uppercase;">${t('card_lbl_loc_variety')}</div>
                        <div style="font-size: 11px; font-weight: 800; color: #1B5E20; margin-top: 2px;">
                            🌱 ${item.varietas || 'Melon'}
                        </div>
                        <div style="font-size: 10px; font-weight: 700; color: #0277BD; margin-top: 2px;">
                            🏢 ${item.gh || 'GH-01'} - ${item.talang || '-'}
                        </div>
                    </div>

                    <div>
                        <div style="font-size: 9px; font-weight: 700; color: #777; text-transform: uppercase;">${t('card_lbl_metrics')}</div>
                        <div style="margin-top: 2px;">
                            ${metricsContent}
                        </div>
                    </div>

                    <div>
                        <div style="font-size: 9px; font-weight: 700; color: #777; text-transform: uppercase;">${t('card_lbl_pop_petugas')}</div>
                        <div style="font-size: 10.5px; color: #444; margin-top: 2px;">
                            👤 ${item.petugas || t('default_petugas')}
                        </div>
                    </div>

                    <div>
                        <div style="font-size: 9px; font-weight: 700; color: #777; text-transform: uppercase;">${t('card_lbl_status')}</div>
                        <div style="font-size: 10.5px; color: #2E7D32; font-weight: 700; margin-top: 2px;">
                            ❤️ ${item.fase || deteksiFaseOtomatis(hstRill)}
                        </div>
                    </div>
                </div>

                ${item.desc ? `
                    <div style="font-size: 10.5px; color: #555; background: #FFFDE7; padding: 6px 10px; border-radius: 8px; border: 1px solid #FFE082; margin-bottom: 10px;">
                        <strong>Catatan:</strong> ${item.desc}
                    </div>
                ` : ''}

                <!-- CARD ACTIONS -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #E0E0E0; padding-top: 8px;">
                    <button onclick="tanaman.showHistoryModal('${item.talang}', '${item.gh}')" style="background: #E8F5E9; color: #2E7D32; border: 1px solid #C8E6C9; padding: 4px 10px; border-radius: 6px; font-size: 10.5px; font-weight: bold; cursor: pointer;">
                        <i class="fas fa-history"></i> Timeline Siklus
                    </button>

                    <div style="display: flex; gap: 6px;">
                        <button onclick="tanaman.editData('${item.id}')" style="background: #FFF3E0; color: #E65100; border: 1px solid #FFE0B2; padding: 4px 10px; border-radius: 6px; font-size: 10.5px; font-weight: bold; cursor: pointer;">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="tanaman.deleteData('${item.id}')" style="background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2; padding: 4px 10px; border-radius: 6px; font-size: 10.5px; font-weight: bold; cursor: pointer;">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </div>

            </div>
        `;
    }

    // ==========================================
    // SELEKSI MASSAL, FILTER, & PAGINASI CONTROLLER
    // ==========================================
    function toggleSelectItem(id) {
        var idx = selectedItemIds.indexOf(id);
        if (idx > -1) {
            selectedItemIds.splice(idx, 1);
        } else {
            selectedItemIds.push(id);
        }
        loadTable();
    }

    function toggleSelectAll(checkboxEl) {
        var key = getKey();
        var rawList = getData(key);
        if (checkboxEl.checked) {
            selectedItemIds = rawList.map(function(item) { return item.id; });
        } else {
            selectedItemIds = [];
        }
        loadTable();
    }

    function deleteSelectedItems() {
        if (selectedItemIds.length === 0) {
            alert('Pilih minimal satu data tanaman untuk dihapus!');
            return;
        }

        if (!confirm('Apakah kamu yakin ingin menghapus ' + selectedItemIds.length + ' data tanaman terpilih?')) return;

        var key = getKey();
        selectedItemIds.forEach(function(id) {
            if (typeof Storage !== 'undefined' && Storage.delete) {
                Storage.delete(key, id);
            }
        });

        selectedItemIds = [];
        loadTable();
        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast(t('toast_deleted'));
        }
        window.dispatchEvent(new Event('cozycs_data_changed'));
    }

    function changePage(delta) {
        currentPage += delta;
        loadTable();
    }

    function handleSearch(e) {
        searchQuery = e.target.value || '';
        currentPage = 1;
        loadTable();
    }

    function handleSort(e) {
        sortBy = e.target.value || 'tanggal_desc';
        currentPage = 1;
        loadTable();
    }

    // ==========================================
    // INITIALIZATION & EVENT LISTENERS
    // ==========================================
    function init() {
        populateGhDropdown();
        resetForm();
        loadTable();
        setupEventListeners();
    }

    function setupEventListeners() {
        var elSearch = document.getElementById('tanamanSearchInput');
        if (elSearch) elSearch.addEventListener('input', handleSearch);

        var elSort = document.getElementById('tanamanSortSelect');
        if (elSort) elSort.addEventListener('change', handleSort);

        var elTglTanam = document.getElementById('tanamanTglTanam');
        if (elTglTanam) elTglTanam.addEventListener('change', updateHstDisplay);

        var elTanggal = document.getElementById('tanamanTanggal');
        if (elTanggal) elTanggal.addEventListener('change', updateHstDisplay);

        var elKat = document.getElementById('tanamanKategori');
        if (elKat) {
            elKat.addEventListener('change', function(e) {
                toggleKategoriFields(e.target.value);
            });
        }

        window.removeEventListener('cozycs_data_changed', loadTable);
        window.addEventListener('cozycs_data_changed', loadTable);
    }

    return {
        render: render,
        init: init,
        saveData: saveData,
        resetForm: resetForm,
        editData: editData,
        deleteData: deleteData,
        showHistoryModal: showHistoryModal,
        closeHistoryModal: closeHistoryModal,
        openGenerateModal: openGenerateModal,
        closeGenerateModal: closeGenerateModal,
        updateTotalPreview: updateTotalPreview,
        processGenerateCustom: processGenerateCustom,
        toggleSelectItem: toggleSelectItem,
        toggleSelectAll: toggleSelectAll,
        deleteSelectedItems: deleteSelectedItems,
        changePage: changePage,
        loadTable: loadTable
    };

})();

window.tanaman = tanaman;
