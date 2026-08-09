// ==========================================
// COZYCS FARM - MODUL UNIFIED MONITORING & PERAWATAN TANAMAN
// (INTEGRATING: GROWTH, POLINASI, PRUNING & SELEKSI BUAH - CLEAN TEXT ONLY)
// ==========================================

var tanaman = (function() {

    // VARIABEL STATE UNTUK PENCARIAN, SORTING & PAGINASI
    var searchQuery = '';
    var sortBy = 'tanggal_desc'; // Default: Terbaru ke Terlama
    var currentPage = 1;
    var itemsPerPage = 20;

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Database & Perawatan Tanaman Terpadu',
            'form_title_add': 'Catat Perawatan / Perkembangan Tanaman',
            'form_title_edit': 'Edit Data Perawatan Tanaman',
            'lbl_gh': 'ID GH',
            'select_gh': '-- Pilih Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Tanggal Kegiatan',
            'lbl_category': 'Kategori Perawatan',
            
            'opt_cat_growth': 'Monitoring Pertumbuhan',
            'opt_cat_polinasi': 'Polinasi Bunga',
            'opt_cat_pruning': 'Pruning',
            'opt_cat_buah': 'Monitoring Pembuahan',

            'lbl_gutter': 'Posisi Talang / Lubang',
            'ph_gutter': 'Contoh: J1-T1-L01 atau Line A',
            'lbl_variety': 'Varietas Melon',
            'ph_variety': 'Contoh: Inthanon / Dalmatian / Golden',
            'lbl_petugas': 'Penanggung Jawab',
            'ph_petugas': 'Contoh: Rizky',
            'default_petugas': 'Penanggung Jawab',
            'lbl_phase': 'Fase Pertumbuhan',
            'opt_phase_nursery': 'Semaian (0-10 HST)',
            'opt_phase_veg': 'Vegetatif (11-25 HST)',
            'opt_phase_flowering': 'Generatif / Bunga (26-40 HST)',
            'opt_phase_fruiting': 'Pembesaran Buah (41-65 HST)',
            'opt_phase_harvest': 'Pematangan / Panen (66+ HST)',
            'lbl_height': 'Tinggi Tanaman (cm)',
            'ph_height': 'Contoh: 120',
            'lbl_leaves': 'Jumlah Daun (Lembar)',
            'ph_leaves': 'Contoh: 18',
            'lbl_stem': 'Diameter Batang (mm)',
            'ph_stem': 'Contoh: 8.5',
            'lbl_population': 'Populasi (Pohon)',
            'ph_population': 'Contoh: 1',
            'lbl_flower_num': 'Posisi Daun / Cabang Bunga',
            'ph_flower_num': 'Contoh: Cabang Daun Ke-9 s/d 13',
            'lbl_pol_status': 'Hasil Polinasi',
            'opt_pol_success': 'Berhasil / Jadi Calon Buah',
            'opt_pol_fail': 'Gagal / Rontok',
            'lbl_prune_type': 'Tipe Pruning',
            'ph_prune_type': 'Contoh: Potong Cabang Air / Daun Tua Bawah',
            'lbl_fruit_weight': 'Bobot Buah (Gram)',
            'ph_fruit_weight': 'Contoh: 850',
            'lbl_fruit_brix': 'Kadar Gula (°Brix)',
            'ph_fruit_brix': 'Contoh: 14',
            'lbl_desc': 'Catatan Tambahan & Detail Perlakuan',
            'ph_desc': 'Tulis detail pengamatan atau perlakuan...',
            'btn_save': 'Simpan Data Perawatan',
            'btn_cancel': 'Batal',
            'recap_title': 'Riwayat Rekam Jejak Tanaman',
            'no_data': 'Belum ada catatan kegiatan perawatan tanaman.',
            'card_lbl_loc_variety': 'Varietas & Lokasi',
            'card_lbl_metrics': 'Metrik / Hasil',
            'card_lbl_pop_petugas': 'Kategori & Petugas',
            'card_lbl_status': 'Status Log',
            'unit_cm': 'cm',
            'unit_leaves': 'Daun',
            'unit_mm': 'mm',
            'unit_trees': 'Pohon',
            'unit_gram': 'g',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Data perawatan tanaman berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus catatan kegiatan ini?',
            'toast_deleted': 'Data perawatan berhasil dihapus',
            'ph_search': 'Cari varietas, GH, talang, kategori...',
            'btn_prev': 'Sebelumnya',
            'btn_next': 'Selanjutnya',
            'page_lbl': 'Halaman',
            'total_lbl': 'Total Data',
            'btn_generate_batch': 'Generate Custom Lubang',
            'confirm_generate': 'Apakah kamu yakin ingin memuat data lubang tanam otomatis untuk Greenhouse ini?',
            'toast_generated': 'Berhasil membuat data lubang tanam!',

            // LABEL URUTKAN (SIMPEL TANPA IKON/EMOJI)
            'opt_sort_newest': 'Terbaru ➔ Terlama',
            'opt_sort_oldest': 'Terlama ➔ Terbaru',
            'opt_sort_talang_asc': 'Talang / Lubang (A-Z)',
            'opt_sort_variety_asc': 'Varietas Melon (A-Z)',
            'opt_sort_variety_desc': 'Varietas Melon (Z-A)',
            'opt_sort_gh_asc': 'Greenhouse (GH-01, GH-02)'
        },
        'en': {
            'module_title': 'Unified Crop Database & Care',
            'form_title_add': 'Record Crop Care / Growth',
            'form_title_edit': 'Edit Crop Care Record',
            'lbl_gh': 'GH ID',
            'select_gh': '-- Select Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Activity Date',
            'lbl_category': 'Care Category',
            
            'opt_cat_growth': 'Growth Monitoring',
            'opt_cat_polinasi': 'Flower Pollination',
            'opt_cat_pruning': 'Pruning',
            'opt_cat_buah': 'Fruit Monitoring',

            'lbl_gutter': 'Gutter / Hole Position',
            'ph_gutter': 'e.g., J1-T1-L01 or Line A',
            'lbl_variety': 'Melon Variety',
            'ph_variety': 'e.g., Inthanon / Dalmatian / Golden',
            'lbl_petugas': 'Person in Charge',
            'ph_petugas': 'e.g., Rizky',
            'default_petugas': 'Person in Charge',
            'lbl_phase': 'Growth Phase',
            'opt_phase_nursery': 'Nursery Stage (0-10 DAP)',
            'opt_phase_veg': 'Vegetative Stage (11-25 DAP)',
            'opt_phase_flowering': 'Flowering Stage (26-40 DAP)',
            'opt_phase_fruiting': 'Fruit Sizing Stage (41-65 DAP)',
            'opt_phase_harvest': 'Ripening / Harvest Stage (66+ DAP)',
            'lbl_height': 'Plant Height (cm)',
            'ph_height': 'e.g., 120',
            'lbl_leaves': 'Leaf Count (Leaves)',
            'ph_leaves': 'e.g., 18',
            'lbl_stem': 'Stem Diameter (mm)',
            'ph_stem': 'e.g., 8.5',
            'lbl_population': 'Population (Trees)',
            'ph_population': 'e.g., 1',
            'lbl_flower_num': 'Leaf / Node Position',
            'ph_flower_num': 'e.g., Node 9 to 13',
            'lbl_pol_status': 'Pollination Result',
            'opt_pol_success': 'Successful / Fruit Set',
            'opt_pol_fail': 'Failed / Dropped',
            'lbl_prune_type': 'Pruning Type',
            'ph_prune_type': 'e.g., Trim side shoots / bottom leaves',
            'lbl_fruit_weight': 'Fruit Weight (Grams)',
            'ph_fruit_weight': 'e.g., 850',
            'lbl_fruit_brix': 'Sugar Content (°Brix)',
            'ph_fruit_brix': 'e.g., 14',
            'lbl_desc': 'Additional Notes & Treatment Details',
            'ph_desc': 'Write detailed observation or treatment...',
            'btn_save': 'Save Care Record',
            'btn_cancel': 'Cancel',
            'recap_title': 'Plant Activity History Log',
            'no_data': 'No plant care records found.',
            'card_lbl_loc_variety': 'Variety & Location',
            'card_lbl_metrics': 'Metrics / Result',
            'card_lbl_pop_petugas': 'Category & PIC',
            'card_lbl_status': 'Log Status',
            'unit_cm': 'cm',
            'unit_leaves': 'Leaves',
            'unit_mm': 'mm',
            'unit_trees': 'Trees',
            'unit_gram': 'g',
            'lbl_notes': 'Notes',
            'toast_saved': 'Crop care record saved successfully!',
            'confirm_delete': 'Are you sure you want to delete this activity record?',
            'toast_deleted': 'Care record deleted successfully',
            'ph_search': 'Search variety, GH, gutter, category...',
            'btn_prev': 'Previous',
            'btn_next': 'Next',
            'page_lbl': 'Page',
            'total_lbl': 'Total Items',
            'btn_generate_batch': 'Generate Custom Holes',
            'confirm_generate': 'Are you sure you want to generate plant hole records for this Greenhouse?',
            'toast_generated': 'Successfully generated plant hole records!',

            // SORT LABELS (CLEAN TEXT ONLY)
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

    // FUNGSI PEMBACA DATA MULTI-FALLBACK (SANGAT AMAN)
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
        var secPolinasi = document.getElementById('secMetrikPolinasi');
        var secPruning = document.getElementById('secMetrikPruning');
        var secBuah = document.getElementById('secMetrikBuah');

        if (secGrowth) secGrowth.style.display = (cat === 'Growth' || !cat) ? 'grid' : 'none';
        if (secPolinasi) secPolinasi.style.display = (cat === 'Polinasi') ? 'grid' : 'none';
        if (secPruning) secPruning.style.display = (cat === 'Pruning') ? 'block' : 'none';
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
        var totalInput = 0;

        for (var j = 1; j <= totalJalur; j++) {
            for (var tIdx = 1; tIdx <= totalTalang; tIdx++) {
                for (var l = 1; l <= totalLubang; l++) {
                    var padLubang = l < 10 ? '0' + l : '' + l;
                    var kodeTalangFormat = 'J' + j + '-T' + tIdx + '-L' + padLubang;

                    var payload = {
                        gh: gh,
                        kategori: 'Growth',
                        tanggal: tanggal,
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
                        totalInput++;
                    }
                }
            }
        }

        if (typeof Storage !== 'undefined' && Storage.add) {
            var keyAktivitas = (Storage.KEYS && Storage.KEYS.AKTIVITAS) ? Storage.KEYS.AKTIVITAS : 'cozycs_aktivitas';
            var now = new Date();
            var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

            Storage.add(keyAktivitas, {
                judul: 'Generate Custom Batch',
                deskripsi: gh + ' - Inisialisasi ' + totalInput + ' Lubang (' + varietas + ')',
                tanggal: tanggal,
                jam: timeStr,
                kategori: 'Tanaman',
                icon: 'fas fa-bolt',
                color: '#2E7D32'
            });
        }

        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast('Berhasil memuat ' + totalInput + ' data lubang tanam!', 'success');
        }

        closeGenerateModal();
        loadTable();
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

            if (kat === 'Polinasi') {
                badgeBg = '#FFF3E0'; badgeColor = '#E65100';
                detailText = `<div>Posisi: <strong>${h.posisiBunga || '-'}</strong> | Status: <strong>${h.statusPolinasi || 'Sukses'}</strong></div>`;
            } else if (kat === 'Pruning') {
                badgeBg = '#E1F5FE'; badgeColor = '#0288D1';
                detailText = `<div>Perlakuan: <strong>${h.tipePruning || 'Rempes Cabang Air'}</strong></div>`;
            } else if (kat === 'Buah') {
                badgeBg = '#F3E5F5'; badgeColor = '#6A1B9A';
                detailText = `<div>Bobot: <strong>${h.bobotBuah || 0} Gram</strong> | Brix: <strong>${h.brixBuah || 0}°</strong></div>`;
            } else {
                detailText = `<div>Tinggi: <strong>${h.tinggi || 0} cm</strong> | Daun: <strong>${h.daun || 0} lmbr</strong> | Ø <strong>${h.batang || 0} mm</strong></div>`;
            }

            htmlContent += `
                <div style="background: var(--inner-card-bg, #f9f9f9); border-left: 4px solid ${badgeColor}; border-radius: 8px; padding: 10px; font-size: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <strong style="color: ${badgeColor};"><i class="far fa-calendar-alt"></i> ${h.tanggal || '-'}</strong>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; font-weight: bold; padding: 2px 8px; border-radius: 4px; font-size: 10px;">${kat}</span>
                    </div>
                    <div style="background: #fff; padding: 6px; border-radius: 6px; border: 1px solid #eee; margin-bottom: 6px; font-size: 11px;">
                        ${detailText}
                    </div>
                    ${h.desc ? `<div style="color: #555; font-style: italic;"><i class="far fa-sticky-note"></i> ${h.desc}</div>` : ''}
                </div>
            `;
        });

        htmlContent += `</div>`;

        var modalBody = document.getElementById('bodyModalHistoryTanaman');
        var modalTitle = document.getElementById('titleModalHistoryTanaman');
        
        if (modalTitle) modalTitle.innerText = 'Riwayat Rekam Jejak ' + kodeTalang;
        if (modalBody) modalBody.innerHTML = htmlContent;

        var modalEl = document.getElementById('modalHistoryTanaman');
        if (modalEl) modalEl.style.display = 'flex';
    }

    function closeHistoryModal() {
        var modalEl = document.getElementById('modalHistoryTanaman');
        if (modalEl) modalEl.style.display = 'none';
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-seedling" style="color: #2E7D32;"></i> ${t('module_title')}</div>
                
                <!-- Form Terpadu Perawatan Tanaman -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="font-size: 14px; font-weight: 700; color: #2E7D32;" id="formTitleTanaman">${t('form_title_add')}</div>
                        <button type="button" onclick="tanaman.openGenerateModal()" style="background: #E8F5E9; color: #2E7D32; border: 1px solid #2E7D32; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
                            ${t('btn_generate_batch')}
                        </button>
                    </div>

                    <form id="formTanaman">
                        <input type="hidden" id="tanamanId">
                        
                        <!-- Kategori Perawatan (Dropdown Tanpa Ikon) -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #2E7D32;">${t('lbl_category')}</label>
                            <select id="tanamanKategori" onchange="tanaman.toggleKategoriFields(this.value)" style="width: 100%; padding: 10px; border: 1.5px solid #2E7D32; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #E8F5E9; font-weight: bold; color: #2E7D32;">
                                <option value="Growth">${t('opt_cat_growth')}</option>
                                <option value="Polinasi">${t('opt_cat_polinasi')}</option>
                                <option value="Pruning">${t('opt_cat_pruning')}</option>
                                <option value="Buah">${t('opt_cat_buah')}</option>
                            </select>
                        </div>

                        <!-- ID GH & Tanggal Kegiatan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gh')}</label>
                                <select id="tanamanGh" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="">${t('select_gh')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date')}</label>
                                <input type="date" id="tanamanTanggal" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Varietas & Posisi Talang/Lubang -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_variety')}</label>
                                <input type="text" id="tanamanVarietas" required placeholder="${t('ph_variety')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gutter')}</label>
                                <input type="text" id="tanamanTalang" placeholder="${t('ph_gutter')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Fase Pertumbuhan & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_phase')}</label>
                                <select id="tanamanFase" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Semaian (0-10 HST)">${t('opt_phase_nursery')}</option>
                                    <option value="Vegetatif (11-25 HST)">${t('opt_phase_veg')}</option>
                                    <option value="Generatif / Bunga (26-40 HST)">${t('opt_phase_flowering')}</option>
                                    <option value="Pembesaran Buah (41-65 HST)">${t('opt_phase_fruiting')}</option>
                                    <option value="Pematangan / Panen (66+ HST)">${t('opt_phase_harvest')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_petugas')}</label>
                                <input type="text" id="tanamanPetugas" placeholder="${t('ph_petugas')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- METRIK A: MONITORING PERTUMBUHAN -->
                        <div id="secMetrikGrowth">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                                <div>
                                    <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_height')}</label>
                                    <input type="number" step="any" id="tanamanTinggi" placeholder="${t('ph_height')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                                </div>
                                <div>
                                    <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_leaves')}</label>
                                    <input type="number" id="tanamanDaun" placeholder="${t('ph_leaves')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                                <div>
                                    <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_stem')}</label>
                                    <input type="number" step="any" id="tanamanBatang" placeholder="${t('ph_stem')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                                </div>
                                <div>
                                    <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_population')}</label>
                                    <input type="number" id="tanamanPopulasi" placeholder="${t('ph_population')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                                </div>
                            </div>
                        </div>

                        <!-- METRIK B: POLINASI BUNGA -->
                        <div id="secMetrikPolinasi" style="display: none; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_flower_num')}</label>
                                <input type="text" id="tanamanPosisiBunga" placeholder="${t('ph_flower_num')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_pol_status')}</label>
                                <select id="tanamanStatusPolinasi" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Sukses">${t('opt_pol_success')}</option>
                                    <option value="Gagal">${t('opt_pol_fail')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- METRIK C: PRUNING -->
                        <div id="secMetrikPruning" style="display: none; margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_prune_type')}</label>
                            <input type="text" id="tanamanTipePruning" placeholder="${t('ph_prune_type')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                        </div>

                        <!-- METRIK D: MONITORING PEMBUAHAN -->
                        <div id="secMetrikBuah" style="display: none; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_fruit_weight')}</label>
                                <input type="number" id="tanamanBobotBuah" placeholder="${t('ph_fruit_weight')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_fruit_brix')}</label>
                                <input type="number" step="any" id="tanamanBrixBuah" placeholder="${t('ph_fruit_brix')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Catatan Tambahan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label>
                            <textarea id="tanamanDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #2E7D32; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelTanamanEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Title -->
                <div class="section-title"><i class="fas fa-list" style="color: #2E7D32;"></i> ${t('recap_title')}</div>
                
                <!-- BAR KONTROL: PENCARIAN & DROPDOWN SORTING (CLEAN TEXT) -->
                <div style="display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap;">
                    <div style="flex: 2; min-width: 180px;">
                        <input type="text" id="inputSearchTanaman" 
                               placeholder="${t('ph_search')}" 
                               oninput="tanaman.handleSearch(this.value)"
                               value="${searchQuery}"
                               style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color, #ccc); font-size: 13px; box-sizing: border-box; background: var(--card-bg, #fff); color: var(--text-color, #222);">
                    </div>
                    <div style="flex: 1; min-width: 140px;">
                        <select id="selectSortTanaman" onchange="tanaman.handleSort(this.value)"
                                style="width: 100%; padding: 10px 10px; border-radius: 10px; border: 1.5px solid #2E7D32; font-size: 12px; box-sizing: border-box; background: #E8F5E9; color: #2E7D32; font-weight: bold; cursor: pointer;">
                            <option value="tanggal_desc" ${sortBy === 'tanggal_desc' ? 'selected' : ''}>${t('opt_sort_newest')}</option>
                            <option value="tanggal_asc" ${sortBy === 'tanggal_asc' ? 'selected' : ''}>${t('opt_sort_oldest')}</option>
                            <option value="talang_asc" ${sortBy === 'talang_asc' ? 'selected' : ''}>${t('opt_sort_talang_asc')}</option>
                            <option value="varietas_asc" ${sortBy === 'varietas_asc' ? 'selected' : ''}>${t('opt_sort_variety_asc')}</option>
                            <option value="varietas_desc" ${sortBy === 'varietas_desc' ? 'selected' : ''}>${t('opt_sort_variety_desc')}</option>
                            <option value="gh_asc" ${sortBy === 'gh_asc' ? 'selected' : ''}>${t('opt_sort_gh_asc')}</option>
                        </select>
                    </div>
                </div>

                <!-- Rekap Data Cards Grid 2x2 -->
                <div id="containerTanamanCards"></div>

                <!-- Kontrol Navigasi Paginasi -->
                <div id="paginationTanamanControls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; margin-bottom: 20px; font-size: 12px;"></div>

                <!-- Modal Pop-up Custom Generate -->
                <div id="modalGenerateCustom" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 16px; box-sizing: border-box;">
                    <div style="background: var(--card-bg, #fff); border-radius: 12px; width: 100%; max-width: 400px; padding: 20px; border: 1px solid var(--border-color, #ccc);">
                        <div style="font-size: 15px; font-weight: 700; color: #2E7D32; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                            <span>Custom Auto-Generate</span>
                            <span onclick="tanaman.closeGenerateModal()" style="cursor: pointer; color: #888; font-size: 18px;">&times;</span>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">Jumlah Jalur</label>
                                <input type="number" id="genJalur" value="6" oninput="tanaman.updateTotalPreview()" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">Talang / Jalur</label>
                                <input type="number" id="genTalang" value="2" oninput="tanaman.updateTotalPreview()" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">Lubang / Talang</label>
                                <input type="number" id="genLubang" value="30" oninput="tanaman.updateTotalPreview()" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <div style="background: #E8F5E9; padding: 10px; border-radius: 8px; text-align: center; margin-bottom: 16px;">
                            <div style="font-size: 11px; color: #555;">Total Data Yang Akan Dibuat:</div>
                            <div id="textTotalGeneratePreview" style="font-size: 16px; font-weight: bold; color: #2E7D32; margin-top: 2px;">360 Lubang Tanam</div>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="button" onclick="tanaman.processGenerateCustom()" style="flex: 1; background: #2E7D32; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                                Proses Generate
                            </button>
                            <button type="button" onclick="tanaman.closeGenerateModal()" style="background: #e0e0e0; color: #333; border: none; padding: 10px 14px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Modal Pop-up Timeline Rekam Jejak -->
                <div id="modalHistoryTanaman" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 16px; box-sizing: border-box;">
                    <div style="background: var(--card-bg, #fff); border-radius: 12px; width: 100%; max-width: 450px; padding: 18px; border: 1px solid var(--border-color, #ccc); box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                        <div style="font-size: 15px; font-weight: 700; color: #2E7D32; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                            <span id="titleModalHistoryTanaman">Riwayat Rekam Jejak</span>
                            <span onclick="tanaman.closeHistoryModal()" style="cursor: pointer; color: #888; font-size: 20px;">&times;</span>
                        </div>

                        <div id="bodyModalHistoryTanaman">
                            <!-- Konten Timeline Riwayat Diisi Lewat JavaScript -->
                        </div>

                        <div style="margin-top: 14px; text-align: right;">
                            <button type="button" onclick="tanaman.closeHistoryModal()" style="background: #2E7D32; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        if (typeof restoreFormDraftGlobal === 'function') {
            restoreFormDraftGlobal('formTanaman');
        }

        var form = document.getElementById('formTanaman');
        var btnCancel = document.getElementById('btnCancelTanamanEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('tanamanId');
                var kat = getVal('tanamanKategori') || 'Growth';
                var gh = getVal('tanamanGh');
                var tanggal = getVal('tanamanTanggal');
                var varietas = getVal('tanamanVarietas');
                var talang = getVal('tanamanTalang');
                var fase = getVal('tanamanFase');
                var petugas = getVal('tanamanPetugas');
                
                var tinggi = parseFloat(getVal('tanamanTinggi')) || 0;
                var daun = parseFloat(getVal('tanamanDaun')) || 0;
                var batang = parseFloat(getVal('tanamanBatang')) || 0;
                var populasi = parseFloat(getVal('tanamanPopulasi')) || 1;
                
                var posisiBunga = getVal('tanamanPosisiBunga');
                var statusPolinasi = getVal('tanamanStatusPolinasi');
                var tipePruning = getVal('tanamanTipePruning');
                var bobotBuah = parseFloat(getVal('tanamanBobotBuah')) || 0;
                var brixBuah = parseFloat(getVal('tanamanBrixBuah')) || 0;
                
                var desc = getVal('tanamanDesc');

                var payload = {
                    kategori: kat,
                    gh: gh || '-',
                    tanggal: tanggal,
                    varietas: varietas || '-',
                    talang: talang || '-',
                    fase: fase || t('opt_phase_veg'),
                    petugas: petugas || t('default_petugas'),
                    tinggi: tinggi,
                    daun: daun,
                    batang: batang,
                    populasi: populasi,
                    posisiBunga: posisiBunga,
                    statusPolinasi: statusPolinasi,
                    tipePruning: tipePruning,
                    bobotBuah: bobotBuah,
                    brixBuah: brixBuah,
                    desc: desc
                };

                try {
                    var storageKey = getKey();
                    if (id) {
                        payload.id = id;
                        if (typeof Storage !== 'undefined' && Storage.update) {
                            Storage.update(storageKey, payload);
                        }
                    } else {
                        if (typeof Storage !== 'undefined' && Storage.add) {
                            Storage.add(storageKey, payload);
                        }
                    }

                    if (typeof Storage !== 'undefined' && Storage.add) {
                        var keyAktivitas = (Storage.KEYS && Storage.KEYS.AKTIVITAS) ? Storage.KEYS.AKTIVITAS : 'cozycs_aktivitas';
                        var now = new Date();
                        var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

                        Storage.add(keyAktivitas, {
                            judul: id ? 'Perbarui Data Perawatan' : 'Catat Perawatan (' + kat + ')',
                            deskripsi: (gh || 'GH') + ' - ' + (talang || 'Talang') + ' [' + kat + ']',
                            tanggal: tanggal || now.toISOString().split('T')[0],
                            jam: timeStr,
                            kategori: 'Tanaman',
                            icon: 'fas fa-seedling',
                            color: '#2E7D32'
                        });
                    }

                    if (typeof Helper !== 'undefined' && Helper.showToast) {
                        Helper.showToast(t('toast_saved'), 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('tanamanId', '');
                toggleKategoriFields('Growth');
                var titleEl = document.getElementById('formTitleTanaman');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('tanamanId', '');
                toggleKategoriFields('Growth');
                var titleEl = document.getElementById('formTitleTanaman');
                if (titleEl) titleEl.innerText = t('form_title_add');
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerTanamanCards');
        var pageEl = document.getElementById('paginationTanamanControls');
        if (!container) return;

        var storageKey = getKey();
        var data = getData(storageKey);

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data')}</div>`;
            if (pageEl) pageEl.innerHTML = '';
            return;
        }

        // 1. FILTERING DATA BERDASARKAN QUERY PENCARIAN
        var filteredData = data.filter(function(item) {
            if (!searchQuery) return true;
            var kw = searchQuery.toLowerCase();
            var varietas = (item.varietas || '').toLowerCase();
            var gh = (item.gh || '').toLowerCase();
            var talang = (item.talang || '').toLowerCase();
            var petugas = (item.petugas || '').toLowerCase();
            var kat = (item.kategori || '').toLowerCase();
            var desc = (item.desc || '').toLowerCase();
            return varietas.includes(kw) || gh.includes(kw) || talang.includes(kw) || petugas.includes(kw) || kat.includes(kw) || desc.includes(kw);
        });

        if (filteredData.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data')}</div>`;
            if (pageEl) pageEl.innerHTML = '';
            return;
        }

        // 2. SORTING / PENGURUTAN DATA LENGKAP
        filteredData.sort(function(a, b) {
            if (sortBy === 'tanggal_asc') {
                return (new Date(a.tanggal || 0)) - (new Date(b.tanggal || 0));
            } else if (sortBy === 'tanggal_desc') {
                return (new Date(b.tanggal || 0)) - (new Date(a.tanggal || 0));
            } else if (sortBy === 'varietas_asc') {
                return (a.varietas || '').localeCompare(b.varietas || '', undefined, {numeric: true, sensitivity: 'base'});
            } else if (sortBy === 'varietas_desc') {
                return (b.varietas || '').localeCompare(a.varietas || '', undefined, {numeric: true, sensitivity: 'base'});
            } else if (sortBy === 'talang_asc') {
                return (a.talang || '').localeCompare(b.talang || '', undefined, {numeric: true, sensitivity: 'base'});
            } else if (sortBy === 'gh_asc') {
                return (a.gh || '').localeCompare(b.gh || '', undefined, {numeric: true, sensitivity: 'base'});
            }
            return 0;
        });

        // 3. PAGINASI DATA
        var totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        var pageData = filteredData.slice(startIndex, endIndex);

        var html = '';
        pageData.forEach(function(item) {
            if (!item) return;

            var valKat = item.kategori || 'Growth';
            var valGh = item.gh ? item.gh : '-';
            var valVarietas = item.varietas ? item.varietas : '-';
            var valTalang = item.talang ? item.talang : '-';
            var valFase = item.fase ? item.fase : '-';
            var valDesc = item.desc ? item.desc : '';

            var badgeBg = '#E8F5E9';
            var badgeColor = '#2E7D32';
            if (valKat === 'Polinasi') { badgeBg = '#FFF3E0'; badgeColor = '#E65100'; }
            else if (valKat === 'Pruning') { badgeBg = '#E1F5FE'; badgeColor = '#0288D1'; }
            else if (valKat === 'Buah') { badgeBg = '#F3E5F5'; badgeColor = '#6A1B9A'; }

            var metricsHtml = '';
            if (valKat === 'Polinasi') {
                metricsHtml = `<div><i class="fas fa-heart" style="color: #E65100; width: 14px;"></i> <strong>${item.posisiBunga || 'Bunga Betina'}</strong></div>
                               <div style="margin-top: 3px;"><i class="fas fa-check-circle" style="color: #2E7D32; width: 14px;"></i> <strong>${item.statusPolinasi || 'Sukses'}</strong></div>`;
            } else if (valKat === 'Pruning') {
                metricsHtml = `<div><i class="fas fa-cut" style="color: #0288D1; width: 14px;"></i> <strong>Pruning / Rempes</strong></div>
                               <div style="margin-top: 3px;"><i class="fas fa-info-circle" style="color: #555; width: 14px;"></i> <strong>${item.tipePruning || 'Cabang Air'}</strong></div>`;
            } else if (valKat === 'Buah') {
                metricsHtml = `<div><i class="fas fa-weight" style="color: #6A1B9A; width: 14px;"></i> <strong>${item.bobotBuah || 0} ${t('unit_gram')}</strong></div>
                               <div style="margin-top: 3px;"><i class="fas fa-percentage" style="color: #E65100; width: 14px;"></i> <strong>${item.brixBuah || 0}° Brix</strong></div>`;
            } else {
                metricsHtml = `<div><i class="fas fa-ruler-vertical" style="color: #E65100; width: 14px;"></i> <strong>${item.tinggi || 0} ${t('unit_cm')} | ${item.daun || 0} ${t('unit_leaves')}</strong></div>
                               <div style="margin-top: 3px;"><i class="fas fa-arrows-alt-h" style="color: #6A1B9A; width: 14px;"></i> <strong>Ø ${item.batang || 0} ${t('unit_mm')}</strong></div>`;
            }

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: var(--text-color, #222);">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                        </div>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${valKat}</span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_loc_variety')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-leaf" style="color: #2E7D32; width: 14px;"></i> <strong>${valVarietas}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-th" style="color: #0277BD; width: 14px;"></i> <strong>${valTalang}</strong></div>
                            </div>
                        </div>

                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_metrics')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                ${metricsHtml}
                            </div>
                        </div>

                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_pop_petugas')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-user-check" style="color: #0288D1; width: 14px;"></i> <strong>${item.petugas || t('default_petugas')}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-clock" style="color: #E65100; width: 14px;"></i> <strong>${valFase}</strong></div>
                            </div>
                        </div>

                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_status')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: #2E7D32; line-height: 1.4;">
                                <div><i class="fas fa-heartbeat" style="color: #C62828; width: 14px;"></i> <strong>Tercatat Rapi</strong></div>
                            </div>
                        </div>

                    </div>

                    ${valDesc ? `<div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); background: var(--inner-card-bg, #fdfdfd); padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">${t('lbl_notes')}: ${valDesc}</div>` : ''}

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                        <span onclick="tanaman.showHistoryModal('${valTalang}', '${valGh}')" title="Lihat Riwayat Rekam Jejak" style="cursor: pointer; color: #0277BD; font-size: 13px; padding: 4px; font-weight: bold;">
                            <i class="fas fa-history"></i> Riwayat Rekam Jejak
                        </span>
                        <div>
                            <span onclick="tanaman.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px; margin-right: 8px;"><i class="fas fa-pen"></i></span>
                            <span onclick="tanaman.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        if (pageEl) {
            if (totalPages > 1) {
                pageEl.innerHTML = `
                    <button onclick="tanaman.changePage(-1)" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_prev')}
                    </button>
                    <span style="font-weight: bold; color: var(--text-color, #555);">
                        ${t('page_lbl')} ${currentPage} / ${totalPages} (${filteredData.length} ${t('unit_trees')})
                    </span>
                    <button onclick="tanaman.changePage(1)" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_next')}
                    </button>
                `;
            } else {
                pageEl.innerHTML = `<span style="color: #777; font-size: 11px;">${t('total_lbl')}: ${filteredData.length} data</span>`;
            }
        }
    }

    function editItem(id) {
        var storageKey = getKey();
        var allData = getData(storageKey);
        var item = allData.find(function(x) { return x && x.id === id; });
        if (!item && typeof Storage !== 'undefined' && Storage.getById) {
            item = Storage.getById(storageKey, id);
        }

        if (!item) return;

        populateGhDropdown();

        setVal('tanamanId', item.id || '');
        setVal('tanamanKategori', item.kategori || 'Growth');
        toggleKategoriFields(item.kategori || 'Growth');

        setVal('tanamanGh', item.gh === '-' ? '' : (item.gh || ''));
        setVal('tanamanTanggal', item.tanggal || '');
        setVal('tanamanVarietas', item.varietas === '-' ? '' : (item.varietas || ''));
        setVal('tanamanTalang', item.talang === '-' ? '' : (item.talang || ''));
        setVal('tanamanFase', item.fase || t('opt_phase_veg'));
        setVal('tanamanPetugas', item.petugas === t('default_petugas') ? '' : (item.petugas || ''));
        
        setVal('tanamanTinggi', item.tinggi || '');
        setVal('tanamanDaun', item.daun || '');
        setVal('tanamanBatang', item.batang || '');
        setVal('tanamanPopulasi', item.populasi || '');

        setVal('tanamanPosisiBunga', item.posisiBunga || '');
        setVal('tanamanStatusPolinasi', item.statusPolinasi || 'Sukses');
        setVal('tanamanTipePruning', item.tipePruning || '');
        setVal('tanamanBobotBuah', item.bobotBuah || '');
        setVal('tanamanBrixBuah', item.brixBuah || '');

        setVal('tanamanDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleTanaman');
        if (titleEl) titleEl.innerText = t('form_title_edit');
        
        var btnCancel = document.getElementById('btnCancelTanamanEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm(t('confirm_delete'))) {
            try {
                var storageKey = getKey();
                if (typeof Storage !== 'undefined' && Storage.remove) {
                    Storage.remove(storageKey, id);
                } else {
                    var list = getData(storageKey);
                    var filtered = list.filter(function(item) { return item && item.id !== id; });
                    localStorage.setItem(storageKey, JSON.stringify(filtered));
                }
            } catch(e) {}
            loadTable();
            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast(t('toast_deleted'), 'error');
            }
        }
    }

    function handleSearch(val) {
        searchQuery = val || '';
        currentPage = 1;
        loadTable();
    }

    function handleSort(val) {
        sortBy = val || 'tanggal_desc';
        currentPage = 1;
        loadTable();
    }

    function changePage(direction) {
        currentPage += direction;
        loadTable();
    }

    return {
        render: render,
        init: init,
        editItem: editItem,
        deleteItem: deleteItem,
        handleSearch: handleSearch,
        handleSort: handleSort,
        changePage: changePage,
        toggleKategoriFields: toggleKategoriFields,
        openGenerateModal: openGenerateModal,
        closeGenerateModal: closeGenerateModal,
        updateTotalPreview: updateTotalPreview,
        processGenerateCustom: processGenerateCustom,
        showHistoryModal: showHistoryModal,
        closeHistoryModal: closeHistoryModal
    };

})();

window.tanaman = tanaman;
