// ==========================================
// COZYCS FARM - MODUL PEMANGKASAN & PRUNING (WITH AUTO-DRAFT & DASHBOARD LOG)
// ==========================================

var pruning = (function() {

    // VARIABEL STATE UNTUK PENCARIAN & PAGINASI
    var searchQuery = '';
    var currentPage = 1;
    var itemsPerPage = 20;

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Pemangkasan & Pruning Tanaman',
            'form_title_add': 'Catat Aktivitas Pruning',
            'form_title_edit': 'Edit Data Pruning',
            'lbl_gh': 'ID GH',
            'select_gh': '-- Pilih Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Tanggal Pelaksanaan',
            'lbl_gutter': 'Posisi Talang / Baris',
            'ph_gutter': 'Contoh: Talang 1 - 6',
            'lbl_petugas': 'Penanggung Jawab',
            'ph_petugas': 'Contoh: Rizky',
            'default_petugas': 'Penanggung Jawab',
            'lbl_type': 'Jenis Pruning',
            'opt_type_side': 'Pemangkasan Tunas Air (Bawah)',
            'opt_type_top': 'Potong Pucuk Utama (Toping Utama)',
            'opt_type_leaf': 'Pruning Daun Tua / Sakit (Bawah)',
            'opt_type_branch': 'Pemangkasan Cabang Buah',
            'lbl_target': 'Target Ruas / Posisi Daun',
            'ph_target': 'Contoh: Ruas 1 - 8 / Daun Tua Bawah',
            'lbl_count': 'Jumlah Pohon (Batang)',
            'ph_count': 'Contoh: 200',
            'lbl_sanitation': 'Aplikasi Sanitasi Luka',
            'opt_sani_fungi': 'Oles Fungisida (Antracol/Nativo)',
            'opt_sani_air': 'Spray Kering Angin',
            'opt_sani_none': 'Tanpa Treatment Khusus',
            'lbl_desc': 'Catatan Tambahan',
            'ph_desc': 'Catatan kondisi luka potongan, kebersihan daun afkir, dll...',
            'btn_save': 'Simpan Data Pruning',
            'btn_cancel': 'Batal',
            'recap_title': 'Riwayat Pelaksanaan Pruning',
            'no_data': 'Belum ada catatan aktivitas pruning.',
            'card_lbl_loc_target': 'Lokasi & Target',
            'card_lbl_pop_sani': 'Populasi & Sanitasi',
            'card_lbl_petugas': 'Penanggung Jawab',
            'card_lbl_category': 'Kategori Modul',
            'card_val_category': 'Sanitasi Tajuk',
            'unit_stem': 'Batang',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Data pruning berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus data pruning ini?',
            'toast_deleted': 'Data pruning berhasil dihapus',
            'ph_search': '🔍 Cari tanggal, GH, talang, petugas, jenis pruning, atau sanitasi...',
            'btn_prev': '⬅️ Sebelum',
            'btn_next': 'Selanjutnya ➡️',
            'page_lbl': 'Halaman',
            'total_lbl': 'Total Data'
        },
        'en': {
            'module_title': 'Plant Pruning & Trimming',
            'form_title_add': 'Record Pruning Activity',
            'form_title_edit': 'Edit Pruning Data',
            'lbl_gh': 'GH ID',
            'select_gh': '-- Select Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Execution Date',
            'lbl_gutter': 'Gutter / Row Position',
            'ph_gutter': 'e.g., Gutter 1 - 6',
            'lbl_petugas': 'Person in Charge',
            'ph_petugas': 'e.g., Rizky',
            'default_petugas': 'Person in Charge',
            'lbl_type': 'Pruning Type',
            'opt_type_side': 'Side Shoot Pruning (Lower)',
            'opt_type_top': 'Main Shoot Topping',
            'opt_type_leaf': 'Old / Diseased Leaf Pruning (Lower)',
            'opt_type_branch': 'Fruit Branch Pruning',
            'lbl_target': 'Target Internode / Leaf Position',
            'ph_target': 'e.g., Node 1 - 8 / Lower Old Leaves',
            'lbl_count': 'Total Plants (Stems)',
            'ph_count': 'e.g., 200',
            'lbl_sanitation': 'Wound Sanitation Application',
            'opt_sani_fungi': 'Apply Fungicide (Antracol/Nativo)',
            'opt_sani_air': 'Air Dry Spray',
            'opt_sani_none': 'No Special Treatment',
            'lbl_desc': 'Additional Notes',
            'ph_desc': 'Notes on cut wound condition, rejected leaf cleanliness, etc...',
            'btn_save': 'Save Pruning Data',
            'btn_cancel': 'Cancel',
            'recap_title': 'Pruning Execution History',
            'no_data': 'No pruning activity records found.',
            'card_lbl_loc_target': 'Location & Target',
            'card_lbl_pop_sani': 'Population & Sanitation',
            'card_lbl_petugas': 'Person in Charge',
            'card_lbl_category': 'Module Category',
            'card_val_category': 'Canopy Sanitation',
            'unit_stem': 'Stems',
            'lbl_notes': 'Notes',
            'toast_saved': 'Pruning data saved successfully!',
            'confirm_delete': 'Are you sure you want to delete this pruning data?',
            'toast_deleted': 'Pruning data deleted successfully',
            'ph_search': '🔍 Search date, GH, gutter, PIC, pruning type, or sanitation...',
            'btn_prev': '⬅️ Prev',
            'btn_next': 'Next ➡️',
            'page_lbl': 'Page',
            'total_lbl': 'Total Items'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function getKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.PRUNING) {
            return Storage.KEYS.PRUNING;
        }
        return 'cozycs_pruning';
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
        var selectEl = document.getElementById('pruningGh');
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

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-cut" style="color: #D81B60;"></i> ${t('module_title')}</div>
                
                <!-- Form Input Data Pruning -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #D81B60; margin-bottom: 12px;" id="formTitlePruning">${t('form_title_add')}</div>
                    <form id="formPruning">
                        <input type="hidden" id="pruningId">
                        
                        <!-- ID GH & Tanggal Pelaksanaan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gh')}</label>
                                <select id="pruningGh" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="">${t('select_gh')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date')}</label>
                                <input type="date" id="pruningTanggal" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Posisi Talang & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gutter')}</label>
                                <input type="text" id="pruningTalang" placeholder="${t('ph_gutter')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_petugas')}</label>
                                <input type="text" id="pruningPetugas" placeholder="${t('ph_petugas')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Jenis Pruning & Target Ruas / Daun -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_type')}</label>
                                <select id="pruningJenis" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Pemangkasan Tunas Air (Bawah)">${t('opt_type_side')}</option>
                                    <option value="Potong Pucuk Utama (Toping Utama)">${t('opt_type_top')}</option>
                                    <option value="Pruning Daun Tua / Sakit (Bawah)">${t('opt_type_leaf')}</option>
                                    <option value="Pemangkasan Cabang Buah">${t('opt_type_branch')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_target')}</label>
                                <input type="text" id="pruningTargetRuas" placeholder="${t('ph_target')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Jumlah Pohon Dikerjakan & Sanitasi Bekas Potongan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_count')}</label>
                                <input type="number" id="pruningJumlahPohon" placeholder="${t('ph_count')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_sanitation')}</label>
                                <select id="pruningSanitasi" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Oles Fungisida (Antracol/Nativo)">${t('opt_sani_fungi')}</option>
                                    <option value="Spray Kering Angin">${t('opt_sani_air')}</option>
                                    <option value="Tanpa Treatment Khusus">${t('opt_sani_none')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label>
                            <textarea id="pruningDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #D81B60; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelPruningEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Title -->
                <div class="section-title"><i class="fas fa-list" style="color: #D81B60;"></i> ${t('recap_title')}</div>
                
                <!-- Kotak Pencarian Khusus Modul Pruning -->
                <div style="margin-bottom: 14px;">
                    <input type="text" id="inputSearchPruning" 
                           placeholder="${t('ph_search')}" 
                           oninput="pruning.handleSearch(this.value)"
                           value="${searchQuery}"
                           style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color, #ccc); font-size: 13px; box-sizing: border-box; background: var(--card-bg, #fff); color: var(--text-color, #222);">
                </div>

                <!-- Rekap Data Pruning Cards Grid 2x2 -->
                <div id="containerPruningCards"></div>

                <!-- Kontrol Navigasi Paginasi -->
                <div id="paginationPruningControls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; margin-bottom: 20px; font-size: 12px;"></div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        // 1. KEMBALIKAN DRAF TERAKHIR DARI LOCALSTORAGE
        if (typeof restoreFormDraftGlobal === 'function') {
            restoreFormDraftGlobal('formPruning');
        }

        var form = document.getElementById('formPruning');
        var btnCancel = document.getElementById('btnCancelPruningEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('pruningId');
                var gh = getVal('pruningGh');
                var tanggal = getVal('pruningTanggal');
                var talang = getVal('pruningTalang');
                var petugas = getVal('pruningPetugas');
                var jenis = getVal('pruningJenis');
                var targetRuas = getVal('pruningTargetRuas');
                var jumlahPohon = parseFloat(getVal('pruningJumlahPohon')) || 0;
                var sanitasi = getVal('pruningSanitasi');
                var desc = getVal('pruningDesc');

                var payload = {
                    gh: gh || '-',
                    tanggal: tanggal,
                    talang: talang || '-',
                    petugas: petugas || t('default_petugas'),
                    jenis: jenis || t('opt_type_side'),
                    targetRuas: targetRuas || '-',
                    jumlahPohon: jumlahPohon,
                    sanitasi: sanitasi || t('opt_sani_none'),
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
                            judul: id ? 'Perbarui Data Pruning' : 'Pemangkasan & Pruning',
                            deskripsi: (gh || 'GH') + ' - ' + (jenis || 'Pruning') + ' (' + jumlahPohon + ' Batang) - Talang: ' + (talang || '-'),
                            tanggal: tanggal || now.toISOString().split('T')[0],
                            jam: timeStr,
                            kategori: 'Pruning',
                            icon: 'fas fa-cut',
                            color: '#D81B60'
                        });
                    }

                    if (typeof Helper !== 'undefined' && Helper.showToast) {
                        Helper.showToast(t('toast_saved'), 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('pruningId', '');
                var titleEl = document.getElementById('formTitlePruning');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('pruningId', '');
                var titleEl = document.getElementById('formTitlePruning');
                if (titleEl) titleEl.innerText = t('form_title_add');
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerPruningCards');
        var pageEl = document.getElementById('paginationPruningControls');
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
            var gh = (item.gh || '').toLowerCase();
            var tanggal = (item.tanggal || '').toLowerCase();
            var talang = (item.talang || '').toLowerCase();
            var petugas = (item.petugas || '').toLowerCase();
            var jenis = (item.jenis || '').toLowerCase();
            var targetRuas = (item.targetRuas || '').toLowerCase();
            var sanitasi = (item.sanitasi || '').toLowerCase();
            var desc = (item.desc || '').toLowerCase();
            return gh.includes(kw) || tanggal.includes(kw) || talang.includes(kw) || petugas.includes(kw) || jenis.includes(kw) || targetRuas.includes(kw) || sanitasi.includes(kw) || desc.includes(kw);
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
            var valTalang = item.talang ? item.talang : '-';
            var valJenis = item.jenis ? item.jenis : '-';
            var valTarget = item.targetRuas ? item.targetRuas : '-';
            var valPohon = item.jumlahPohon ? item.jumlahPohon : 0;
            var valSanitasi = item.sanitasi ? item.sanitasi : '-';
            var valDesc = item.desc ? item.desc : '';

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <!-- Header Card: Tanggal, ID GH & Jenis Pruning -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: var(--text-color, #222);">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                        </div>
                        <span style="background: #FCE4EC; color: #D81B60; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${valJenis}</span>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Lokasi & Target Ruas -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_loc_target')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-th" style="color: #0277BD; width: 14px;"></i> <strong>${valTalang}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-align-center" style="color: #D81B60; width: 14px;"></i> <strong>${valTarget}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Populasi & Sanitasi -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_pop_sani')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-seedling" style="color: #2E7D32; width: 14px;"></i> <strong>${valPohon} ${t('unit_stem')}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-first-aid" style="color: #E65100; width: 14px;"></i> <strong>${valSanitasi}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Penanggung Jawab -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_petugas')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-user-check" style="color: #0288D1; width: 14px;"></i> <strong>${item.petugas || t('default_petugas')}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Kategori Pemeliharaan -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_category')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: #D81B60; line-height: 1.4;">
                                <div><i class="fas fa-cut" style="color: #D81B60; width: 14px;"></i> <strong>${t('card_val_category')}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan -->
                    ${valDesc ? `<div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); background: var(--inner-card-bg, #fdfdfd); padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">${t('lbl_notes')}: ${valDesc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                        <span onclick="pruning.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="pruning.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // 5. Render Tombol Paginasi
        if (pageEl) {
            if (totalPages > 1) {
                pageEl.innerHTML = `
                    <button onclick="pruning.changePage(-1)" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_prev')}
                    </button>
                    <span style="font-weight: bold; color: var(--text-color, #555);">
                        ${t('page_lbl')} ${currentPage} / ${totalPages} (${filteredData.length} ${t('unit_stem')})
                    </span>
                    <button onclick="pruning.changePage(1)" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
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

        setVal('pruningId', item.id || '');
        setVal('pruningGh', item.gh === '-' ? '' : (item.gh || ''));
        setVal('pruningTanggal', item.tanggal || '');
        setVal('pruningTalang', item.talang === '-' ? '' : (item.talang || ''));
        setVal('pruningPetugas', item.petugas === t('default_petugas') ? '' : (item.petugas || ''));
        setVal('pruningJenis', item.jenis || t('opt_type_side'));
        setVal('pruningTargetRuas', item.targetRuas === '-' ? '' : (item.targetRuas || ''));
        setVal('pruningJumlahPohon', item.jumlahPohon || '');
        setVal('pruningSanitasi', item.sanitasi || t('opt_sani_fungi'));
        setVal('pruningDesc', item.desc || '');

        var titleEl = document.getElementById('formTitlePruning');
        if (titleEl) titleEl.innerText = t('form_title_edit');
        
        var btnCancel = document.getElementById('btnCancelPruningEdit');
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
        changePage: changePage
    };

})();

window.pruning = pruning;
