// ==========================================
// COZYCS FARM - MODUL MONITORING TANAMAN (WITH AUTO-DRAFT, DASHBOARD LOG & AUTO-GENERATE 360 LUBANG)
// ==========================================

var tanaman = (function() {

    // VARIABEL STATE UNTUK PENCARIAN & PAGINASI
    var searchQuery = '';
    var currentPage = 1;
    var itemsPerPage = 20;

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Monitoring Siklus & Pertumbuhan Tanaman',
            'form_title_add': 'Catat Perkembangan Tanaman',
            'form_title_edit': 'Edit Data Perkembangan Tanaman',
            'lbl_gh': 'ID GH',
            'select_gh': '-- Pilih Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Tanggal Monitoring',
            'lbl_gutter': 'Posisi Talang / Baris',
            'ph_gutter': 'Contoh: Talang 1 - Line A',
            'lbl_variety': 'Varietas Melon',
            'ph_variety': 'Contoh: Intanon / Dalmatian / Golden',
            'lbl_petugas': 'Penanggung Jawab',
            'ph_petugas': 'Contoh: Rizky',
            'default_petugas': 'Penanggung Jawab',
            'lbl_phase': 'Fase Pertumbuhan',
            'opt_phase_nursery': 'Semaian (0-10 HST)',
            'opt_phase_veg': 'Vegetatif (11-25 HST)',
            'opt_phase_flowering': 'Generatif / Bunga (26-40 HST)',
            'opt_phase_fruiting': 'Pembesaran Buah (41-65 HST)',
            'opt_phase_harvest': 'Pematangan / Panen (66+ HST)',
            'lbl_height': 'Rata-rata Tinggi (cm)',
            'ph_height': 'Contoh: 120',
            'lbl_leaves': 'Jumlah Daun (Lembar)',
            'ph_leaves': 'Contoh: 18',
            'lbl_stem': 'Diameter Batang (mm)',
            'ph_stem': 'Contoh: 8.5',
            'lbl_population': 'Populasi Sehat (Pohon)',
            'ph_population': 'Contoh: 250',
            'lbl_desc': 'Catatan Fisik & Perlakuan',
            'ph_desc': 'Warna daun, cabang air, topping, penyerbukan...',
            'btn_save': 'Simpan Data Tanaman',
            'btn_cancel': 'Batal',
            'recap_title': 'Riwayat Pertumbuhan Tanaman',
            'no_data': 'Belum ada catatan perkembangan tanaman.',
            'card_lbl_loc_variety': 'Varietas & Lokasi',
            'card_lbl_metrics': 'Metrik Pertumbuhan',
            'card_lbl_pop_petugas': 'Populasi & Petugas',
            'card_lbl_status': 'Status Siklus',
            'unit_cm': 'cm',
            'unit_leaves': 'Daun',
            'unit_mm': 'mm',
            'unit_trees': 'Pohon',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Data perkembangan tanaman berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus data tanaman ini?',
            'toast_deleted': 'Data perkembangan tanaman berhasil dihapus',
            'ph_search': '🔍 Cari varietas, GH, talang, atau petugas...',
            'btn_prev': '⬅️ Sebelum',
            'btn_next': 'Selanjutnya ➡️',
            'page_lbl': 'Halaman',
            'total_lbl': 'Total Data',
            // TERJEMAHAN OPSI BARU (AUTO-GENERATE & EDIT LUBANG)
            'btn_generate_batch': '⚡ Generate 360 Lubang Tanam',
            'confirm_generate': 'Apakah kamu yakin ingin memuat 360 data lubang tanam otomatis untuk Greenhouse ini?',
            'toast_generated': 'Berhasil membuat 360 data lubang tanam!',
            'modal_quick_edit_title': 'Update Performa Tanaman Spesifik'
        },
        'en': {
            'module_title': 'Crop Cycle & Growth Monitoring',
            'form_title_add': 'Record Plant Growth',
            'form_title_edit': 'Edit Plant Growth Data',
            'lbl_gh': 'GH ID',
            'select_gh': '-- Select Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Monitoring Date',
            'lbl_gutter': 'Gutter / Row Position',
            'ph_gutter': 'e.g., Gutter 1 - Line A',
            'lbl_variety': 'Melon Variety',
            'ph_variety': 'e.g., Intanon / Dalmatian / Golden',
            'lbl_petugas': 'Person in Charge',
            'ph_petugas': 'e.g., Rizky',
            'default_petugas': 'Person in Charge',
            'lbl_phase': 'Growth Phase',
            'opt_phase_nursery': 'Nursery Stage (0-10 DAP)',
            'opt_phase_veg': 'Vegetative Stage (11-25 DAP)',
            'opt_phase_flowering': 'Flowering Stage (26-40 DAP)',
            'opt_phase_fruiting': 'Fruit Sizing Stage (41-65 DAP)',
            'opt_phase_harvest': 'Ripening / Harvest Stage (66+ DAP)',
            'lbl_height': 'Avg. Height (cm)',
            'ph_height': 'e.g., 120',
            'lbl_leaves': 'Leaf Count (Leaves)',
            'ph_leaves': 'e.g., 18',
            'lbl_stem': 'Stem Diameter (mm)',
            'ph_stem': 'e.g., 8.5',
            'lbl_population': 'Healthy Population (Trees)',
            'ph_population': 'e.g., 250',
            'lbl_desc': 'Physical Notes & Treatment',
            'ph_desc': 'Leaf color, side shoots, topping, pollination...',
            'btn_save': 'Save Crop Data',
            'btn_cancel': 'Cancel',
            'recap_title': 'Plant Growth History',
            'no_data': 'No plant growth records found.',
            'card_lbl_loc_variety': 'Variety & Location',
            'card_lbl_metrics': 'Growth Metrics',
            'card_lbl_pop_petugas': 'Population & PIC',
            'card_lbl_status': 'Cycle Status',
            'unit_cm': 'cm',
            'unit_leaves': 'Leaves',
            'unit_mm': 'mm',
            'unit_trees': 'Trees',
            'lbl_notes': 'Notes',
            'toast_saved': 'Plant growth data saved successfully!',
            'confirm_delete': 'Are you sure you want to delete this plant data?',
            'toast_deleted': 'Plant growth data deleted successfully',
            'ph_search': '🔍 Search variety, GH, gutter, or PIC...',
            'btn_prev': '⬅️ Prev',
            'btn_next': 'Next ➡️',
            'page_lbl': 'Page',
            'total_lbl': 'Total Items',
            'btn_generate_batch': '⚡ Generate 360 Plant Holes',
            'confirm_generate': 'Are you sure you want to generate 360 plant hole records for this Greenhouse?',
            'toast_generated': 'Successfully generated 360 plant hole records!',
            'modal_quick_edit_title': 'Update Specific Plant Performance'
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
        var dataGh = [];

        try {
            if (typeof Storage !== 'undefined' && Storage.getAll) {
                dataGh = Storage.getAll(keyGh) || [];
            }
        } catch(e) {
            dataGh = [];
        }

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

    // ==========================================
    // LOGIKA OPSIONAL BARU: GENERATE BATCH 360 LUBANG TANAM
    // ==========================================
    function generateBatch360() {
        var gh = getVal('tanamanGh') || 'GH-01';
        var tanggal = getVal('tanamanTanggal') || '2026-08-13';
        var varietas = getVal('tanamanVarietas') || 'Inthanon';
        var petugas = getVal('tanamanPetugas') || t('default_petugas');

        if (!confirm(t('confirm_generate'))) return;

        var storageKey = getKey();
        var totalInput = 0;

        // Loop 6 Jalur x 2 Talang x 30 Lubang = 360 Lubang Tanam
        for (var j = 1; j <= 6; j++) {
            for (var tIdx = 1; tIdx <= 2; tIdx++) {
                for (var l = 1; l <= 30; l++) {
                    var padLubang = l < 10 ? '0' + l : '' + l;
                    var kodeTalangFormat = 'J' + j + '-T' + tIdx + '-L' + padLubang; // Contoh: J1-T1-L01

                    var payload = {
                        gh: gh,
                        tanggal: tanggal,
                        varietas: varietas,
                        talang: kodeTalangFormat,
                        fase: t('opt_phase_nursery'),
                        petugas: petugas,
                        tinggi: 0,
                        daun: 0,
                        batang: 0,
                        populasi: 1, // 1 Pohon per lubang
                        desc: 'Inisialisasi Otomatis Batch Tanam 360 Lubang'
                    };

                    if (typeof Storage !== 'undefined' && Storage.add) {
                        Storage.add(storageKey, payload);
                        totalInput++;
                    }
                }
            }
        }

        // Catat Log Aktivitas Ke Dasbor Utama
        if (typeof Storage !== 'undefined' && Storage.add) {
            var keyAktivitas = (Storage.KEYS && Storage.KEYS.AKTIVITAS) ? Storage.KEYS.AKTIVITAS : 'cozycs_aktivitas';
            var now = new Date();
            var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

            Storage.add(keyAktivitas, {
                judul: 'Generate Batch 360 Lubang',
                deskripsi: gh + ' - Inisialisasi ' + totalInput + ' Lubang Tanam (' + varietas + ')',
                tanggal: tanggal,
                jam: timeStr,
                kategori: 'Tanaman',
                icon: 'fas fa-th',
                color: '#2E7D32'
            });
        }

        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast(t('toast_generated'), 'success');
        }

        loadTable();
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-seedling" style="color: #2E7D32;"></i> ${t('module_title')}</div>
                
                <!-- Form Input Data Perkembangan Tanaman -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="font-size: 14px; font-weight: 700; color: #2E7D32;" id="formTitleTanaman">${t('form_title_add')}</div>
                        <!-- Tombol Pintas Generate 360 Lubang -->
                        <button type="button" onclick="tanaman.generateBatch360()" style="background: #E8F5E9; color: #2E7D32; border: 1px solid #2E7D32; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
                            <i class="fas fa-bolt"></i> ${t('btn_generate_batch')}
                        </button>
                    </div>

                    <form id="formTanaman">
                        <input type="hidden" id="tanamanId">
                        
                        <!-- ID GH & Tanggal Monitoring -->
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

                        <!-- Varietas & Posisi Talang -->
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

                        <!-- Metrik Pertumbuhan -->
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

                        <!-- Catatan -->
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
                
                <!-- Kotak Pencarian Khusus Modul Tanaman -->
                <div style="margin-bottom: 14px;">
                    <input type="text" id="inputSearchTanaman" 
                           placeholder="${t('ph_search')}" 
                           oninput="tanaman.handleSearch(this.value)"
                           value="${searchQuery}"
                           style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color, #ccc); font-size: 13px; box-sizing: border-box; background: var(--card-bg, #fff); color: var(--text-color, #222);">
                </div>

                <!-- Rekap Data Cards Grid 2x2 -->
                <div id="containerTanamanCards"></div>

                <!-- Kontrol Navigasi Paginasi -->
                <div id="paginationTanamanControls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; margin-bottom: 20px; font-size: 12px;"></div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        // 1. KEMBALIKAN DRAF TERAKHIR DARI LOCALSTORAGE
        if (typeof restoreFormDraftGlobal === 'function') {
            restoreFormDraftGlobal('formTanaman');
        }

        var form = document.getElementById('formTanaman');
        var btnCancel = document.getElementById('btnCancelTanamanEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('tanamanId');
                var gh = getVal('tanamanGh');
                var tanggal = getVal('tanamanTanggal');
                var varietas = getVal('tanamanVarietas');
                var talang = getVal('tanamanTalang');
                var fase = getVal('tanamanFase');
                var petugas = getVal('tanamanPetugas');
                var tinggi = parseFloat(getVal('tanamanTinggi')) || 0;
                var daun = parseFloat(getVal('tanamanDaun')) || 0;
                var batang = parseFloat(getVal('tanamanBatang')) || 0;
                var populasi = parseFloat(getVal('tanamanPopulasi')) || 0;
                var desc = getVal('tanamanDesc');

                var payload = {
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

                    // 2. CATAT LOG KE AKTIVITAS TERAKHIR DASBOR
                    if (typeof Storage !== 'undefined' && Storage.add) {
                        var keyAktivitas = (Storage.KEYS && Storage.KEYS.AKTIVITAS) ? Storage.KEYS.AKTIVITAS : 'cozycs_aktivitas';
                        var now = new Date();
                        var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

                        Storage.add(keyAktivitas, {
                            judul: id ? 'Perbarui Data Tanaman' : 'Monitoring Pertumbuhan Tanaman',
                            deskripsi: (gh || 'GH') + ' - ' + (varietas || 'Melon') + ' (' + (fase || 'Vegetatif') + ') - Populasi: ' + populasi + ' Pohon',
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

        var data = [];
        try {
            var storageKey = getKey();
            if (typeof Storage !== 'undefined' && Storage.getAll) {
                data = Storage.getAll(storageKey) || [];
            }
        } catch(e) {
            data = [];
        }

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data')}</div>`;
            if (pageEl) pageEl.innerHTML = '';
            return;
        }

        // 1. Urutkan dari tanggal terbaru
        data.sort(function(a, b) {
            var dateA = a && a.tanggal ? new Date(a.tanggal) : new Date(0);
            var dateB = b && b.tanggal ? new Date(b.tanggal) : new Date(0);
            return dateB - dateA;
        });

        // 2. Filter data berdasarkan kata kunci pencarian
        var filteredData = data.filter(function(item) {
            if (!searchQuery) return true;
            var kw = searchQuery.toLowerCase();
            var varietas = (item.varietas || '').toLowerCase();
            var gh = (item.gh || '').toLowerCase();
            var talang = (item.talang || '').toLowerCase();
            var petugas = (item.petugas || '').toLowerCase();
            var fase = (item.fase || '').toLowerCase();
            var desc = (item.desc || '').toLowerCase();
            return varietas.includes(kw) || gh.includes(kw) || talang.includes(kw) || petugas.includes(kw) || fase.includes(kw) || desc.includes(kw);
        });

        if (filteredData.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data')}</div>`;
            if (pageEl) pageEl.innerHTML = '';
            return;
        }

        // 3. Paginasi: potong array data sesuai halaman aktif
        var totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        var pageData = filteredData.slice(startIndex, endIndex);

        // 4. Render HTML Kartu
        var html = '';
        pageData.forEach(function(item) {
            if (!item) return;

            var valGh = item.gh ? item.gh : '-';
            var valVarietas = item.varietas ? item.varietas : '-';
            var valTalang = item.talang ? item.talang : '-';
            var valFase = item.fase ? item.fase : '-';
            var valTinggi = item.tinggi ? item.tinggi : '-';
            var valDaun = item.daun ? item.daun : '-';
            var valBatang = item.batang ? item.batang : '-';
            var valPopulasi = item.populasi ? item.populasi : '-';
            var valDesc = item.desc ? item.desc : '';

            var badgeBg = '#E8F5E9';
            var badgeColor = '#2E7D32';
            if (valFase.indexOf('Pembesaran') !== -1 || valFase.indexOf('Fruiting') !== -1) {
                badgeBg = '#FFF3E0';
                badgeColor = '#E65100';
            } else if (valFase.indexOf('Panen') !== -1 || valFase.indexOf('Harvest') !== -1) {
                badgeBg = '#FFEBEE';
                badgeColor = '#C62828';
            } else if (valFase.indexOf('Generatif') !== -1 || valFase.indexOf('Flowering') !== -1) {
                badgeBg = '#F3E5F5';
                badgeColor = '#6A1B9A';
            }

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <!-- Header Card: Tanggal, ID GH & Badge Fase -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: var(--text-color, #222);">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                        </div>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${valFase}</span>
                    </div>

                    <!-- Grid 4 Kotak (2x2) Standard Rekapan -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Varietas & Lokasi Talang -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_loc_variety')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-leaf" style="color: #2E7D32; width: 14px;"></i> <strong>${valVarietas}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-th" style="color: #0277BD; width: 14px;"></i> <strong>${valTalang}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Metrik Pertumbuhan -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_metrics')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-ruler-vertical" style="color: #E65100; width: 14px;"></i> <strong>${valTinggi} ${t('unit_cm')} | ${valDaun} ${t('unit_leaves')}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-arrows-alt-h" style="color: #6A1B9A; width: 14px;"></i> <strong>Ø ${valBatang} ${t('unit_mm')}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Populasi & Penanggung Jawab -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_pop_petugas')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-tree" style="color: #2E7D32; width: 14px;"></i> <strong>${valPopulasi} ${t('unit_trees')}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-user-check" style="color: #0288D1; width: 14px;"></i> <strong>${item.petugas || t('default_petugas')}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Status Siklus -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_status')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: #2E7D32; line-height: 1.4;">
                                <div><i class="fas fa-heartbeat" style="color: #C62828; width: 14px;"></i> <strong>Monitoring Aktif</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan -->
                    ${valDesc ? `<div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); background: var(--inner-card-bg, #fdfdfd); padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">${t('lbl_notes')}: ${valDesc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                        <span onclick="tanaman.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="tanaman.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // 5. Render Tombol Paginasi
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
        var item = null;
        try {
            if (typeof Storage !== 'undefined' && Storage.getById) {
                item = Storage.getById(storageKey, id);
            }
        } catch(e) {}

        if (!item) return;

        populateGhDropdown();

        setVal('tanamanId', item.id || '');
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
        changePage: changePage,
        generateBatch360: generateBatch360
    };

})();

window.tanaman = tanaman;
