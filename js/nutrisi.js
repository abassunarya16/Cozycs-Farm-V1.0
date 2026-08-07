// ==========================================
// COZYCS FARM - MODUL NUTRISI & PPM (CRUD BILINGUAL, SEARCH & PAGINATION)
// ==========================================

var nutrisi = (function() {

    // VARIABEL STATE UNTUK PENCARIAN & PAGINASI
    var searchQuery = '';
    var currentPage = 1;
    var itemsPerPage = 20; // Dibatasi 20 data per halaman

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Cek & Kontrol Nutrisi (PPM & pH)',
            'form_title_add': 'Catat Cek Nutrisi Harian',
            'form_title_edit': 'Edit Data Nutrisi',
            'lbl_gh': 'ID GH',
            'select_gh': '-- Pilih Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Tanggal Pengecekan',
            'lbl_time_slot': 'Waktu Cek',
            'opt_morning': 'Pagi',
            'opt_afternoon': 'Sore',
            'lbl_hst': 'HST',
            'ph_hst': 'Contoh: 15',
            'lbl_fase': 'Fase Tanaman',
            'opt_fase_veg_early': 'Vegetatif Awal',
            'opt_fase_veg_growth': 'Vegetatif Pertumbuhan',
            'opt_fase_flower': 'Pembungaan / Polinasi',
            'opt_fase_fruit_grow': 'Pembesaran Buah',
            'opt_fase_fruit_ripe': 'Pematangan Buah',
            'lbl_ppm_actual': 'PPM Aktual',
            'ph_ppm_actual': 'Contoh: 1000',
            'lbl_ppm_target': 'Target PPM',
            'ph_ppm_target': 'Contoh: 1200',
            'lbl_ph_actual': 'pH Aktual',
            'ph_ph_actual': 'Contoh: 6.5',
            'lbl_ph_action': 'Aksi Koreksi pH',
            'opt_ph_safe': 'Aman / Tanpa Koreksi',
            'opt_ph_up': 'Tambah pH Up',
            'opt_ph_down': 'Tambah pH Down',
            'lbl_water_temp': 'Suhu Air Tandon (°C)',
            'ph_water_temp': 'Contoh: 26°C',
            'lbl_room_temp': 'Suhu Ruangan (°C)',
            'ph_room_temp': 'Contoh: 30°C',
            'lbl_desc': 'Catatan Tambahan',
            'ph_desc': 'Catatan penambahan A/B mix, air baku, dll...',
            'btn_save': 'Simpan Catatan Nutrisi',
            'btn_cancel': 'Batal',
            'recap_title': 'Riwayat & Rekap Kontrol Nutrisi',
            'no_data': 'Belum ada catatan nutrisi tercatat.',
            'card_lbl_ppm': 'PPM',
            'card_lbl_target_ppm': 'Target:',
            'card_lbl_ph_action': 'pH & Koreksi',
            'card_lbl_hst_fase': 'HST & Fase',
            'card_lbl_temp': 'Suhu Air & Ruangan',
            'lbl_water': 'Air:',
            'lbl_room': 'Ruang:',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Data berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus data nutrisi ini?',
            'toast_deleted': 'Data nutrisi berhasil dihapus',
            'ph_search': '🔍 Cari tanggal, GH, PPM, pH, atau fase...',
            'btn_prev': '⬅️ Sebelum',
            'btn_next': 'Selanjutnya ➡️',
            'page_lbl': 'Halaman',
            'total_lbl': 'Total Data'
        },
        'en': {
            'module_title': 'Nutrition Check & Control (PPM & pH)',
            'form_title_add': 'Record Daily Nutrition Check',
            'form_title_edit': 'Edit Nutrition Data',
            'lbl_gh': 'GH ID',
            'select_gh': '-- Select Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Check Date',
            'lbl_time_slot': 'Check Time',
            'opt_morning': 'Morning',
            'opt_afternoon': 'Afternoon',
            'lbl_hst': 'DAP (Days After Planting)',
            'ph_hst': 'e.g., 15',
            'lbl_fase': 'Plant Phase',
            'opt_fase_veg_early': 'Early Vegetative',
            'opt_fase_veg_growth': 'Vegetative Growth',
            'opt_fase_flower': 'Flowering / Pollination',
            'opt_fase_fruit_grow': 'Fruit Enlargement',
            'opt_fase_fruit_ripe': 'Fruit Ripening',
            'lbl_ppm_actual': 'Actual PPM',
            'ph_ppm_actual': 'e.g., 1000',
            'lbl_ppm_target': 'Target PPM',
            'ph_ppm_target': 'e.g., 1200',
            'lbl_ph_actual': 'Actual pH',
            'ph_ph_actual': 'e.g., 6.5',
            'lbl_ph_action': 'pH Correction Action',
            'opt_ph_safe': 'Safe / No Correction',
            'opt_ph_up': 'Add pH Up',
            'opt_ph_down': 'Add pH Down',
            'lbl_water_temp': 'Water Temp (°C)',
            'ph_water_temp': 'e.g., 26°C',
            'lbl_room_temp': 'Room Temp (°C)',
            'ph_room_temp': 'e.g., 30°C',
            'lbl_desc': 'Additional Notes',
            'ph_desc': 'Notes on A/B mix additions, raw water, etc...',
            'btn_save': 'Save Nutrition Record',
            'btn_cancel': 'Cancel',
            'recap_title': 'Nutrition Control History & Summary',
            'no_data': 'No nutrition records found.',
            'card_lbl_ppm': 'PPM',
            'card_lbl_target_ppm': 'Target:',
            'card_lbl_ph_action': 'pH & Correction',
            'card_lbl_hst_fase': 'DAP & Phase',
            'card_lbl_temp': 'Water & Room Temp',
            'lbl_water': 'Water:',
            'lbl_room': 'Room:',
            'lbl_notes': 'Notes',
            'toast_saved': 'Data saved successfully!',
            'confirm_delete': 'Are you sure you want to delete this nutrition data?',
            'toast_deleted': 'Nutrition data deleted successfully',
            'ph_search': '🔍 Search date, GH, PPM, pH, or phase...',
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
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.NUTRISI) {
            return Storage.KEYS.NUTRISI;
        }
        return 'cozycs_nutrisi';
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
        var selectEl = document.getElementById('nutrisiGh');
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
                <div class="section-title"><i class="fas fa-tint" style="color: #0277BD;"></i> ${t('module_title')}</div>
                
                <!-- Form Input Data Nutrisi -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #0277BD; margin-bottom: 12px;" id="formTitleNutrisi">${t('form_title_add')}</div>
                    <form id="formNutrisi">
                        <input type="hidden" id="nutrisiId">
                        
                        <!-- ID GH & Tanggal Cek -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gh')}</label>
                                <select id="nutrisiGh" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="">${t('select_gh')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date')}</label>
                                <input type="date" id="nutrisiDate" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Waktu Cek -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_time_slot')}</label>
                            <select id="nutrisiTimeSlot" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                <option value="Pagi">${t('opt_morning')}</option>
                                <option value="Sore">${t('opt_afternoon')}</option>
                            </select>
                        </div>

                        <!-- HST & Fase Tanaman -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_hst')}</label>
                                <input type="number" id="nutrisiHst" placeholder="${t('ph_hst')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_fase')}</label>
                                <select id="nutrisiFase" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Vegetatif Awal">${t('opt_fase_veg_early')}</option>
                                    <option value="Vegetatif Pertumbuhan">${t('opt_fase_veg_growth')}</option>
                                    <option value="Pembungaan / Polinasi">${t('opt_fase_flower')}</option>
                                    <option value="Pembesaran Buah">${t('opt_fase_fruit_grow')}</option>
                                    <option value="Pematangan Buah">${t('opt_fase_fruit_ripe')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- PPM Aktual & Target PPM -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_ppm_actual')}</label>
                                <input type="number" id="nutrisiPpm" required placeholder="${t('ph_ppm_actual')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_ppm_target')}</label>
                                <input type="number" id="nutrisiTargetPpm" required placeholder="${t('ph_ppm_target')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- pH Aktual & Aksi Koreksi pH -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_ph_actual')}</label>
                                <input type="text" id="nutrisiPh" required placeholder="${t('ph_ph_actual')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_ph_action')}</label>
                                <select id="nutrisiPhAction" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Aman / Tanpa Koreksi">${t('opt_ph_safe')}</option>
                                    <option value="Tambah pH Up">${t('opt_ph_up')}</option>
                                    <option value="Tambah pH Down">${t('opt_ph_down')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Suhu Air & Suhu Ruangan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_water_temp')}</label>
                                <input type="text" id="nutrisiWaterTemp" placeholder="${t('ph_water_temp')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_room_temp')}</label>
                                <input type="text" id="nutrisiRoomTemp" placeholder="${t('ph_room_temp')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label>
                            <textarea id="nutrisiDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #0277BD; color: #fff; padding: 10px; border: none; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelNutrisiEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Title -->
                <div class="section-title"><i class="fas fa-list" style="color: #0277BD;"></i> ${t('recap_title')}</div>
                
                <!-- Kotak Pencarian Khusus Modul Nutrisi -->
                <div style="margin-bottom: 14px;">
                    <input type="text" id="inputSearchNutrisi" 
                           placeholder="${t('ph_search')}" 
                           oninput="nutrisi.handleSearch(this.value)"
                           value="${searchQuery}"
                           style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color, #ccc); font-size: 13px; box-sizing: border-box; background: var(--card-bg, #fff); color: var(--text-color, #222);">
                </div>

                <!-- Rekap Data Card Grid 2x2 -->
                <div id="containerNutrisiCards"></div>

                <!-- Kontrol Navigasi Paginasi -->
                <div id="paginationNutrisiControls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; margin-bottom: 20px; font-size: 12px;"></div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        var form = document.getElementById('formNutrisi');
        var btnCancel = document.getElementById('btnCancelNutrisiEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('nutrisiId');
                var gh = getVal('nutrisiGh');
                var date = getVal('nutrisiDate');
                var timeSlot = getVal('nutrisiTimeSlot');
                var hst = getVal('nutrisiHst');
                var fase = getVal('nutrisiFase');
                var ppm = getVal('nutrisiPpm');
                var targetPpm = getVal('nutrisiTargetPpm');
                var ph = getVal('nutrisiPh');
                var phAction = getVal('nutrisiPhAction');
                var waterTemp = getVal('nutrisiWaterTemp');
                var roomTemp = getVal('nutrisiRoomTemp');
                var desc = getVal('nutrisiDesc');

                var payload = {
                    gh: gh || '-',
                    date: date,
                    timeSlot: timeSlot || t('opt_morning'),
                    hst: hst || '-',
                    fase: fase || t('opt_fase_veg_growth'),
                    ppm: ppm || '-',
                    targetPpm: targetPpm || '-',
                    ph: ph || '-',
                    phAction: phAction || t('opt_ph_safe'),
                    waterTemp: waterTemp || '-',
                    roomTemp: roomTemp || '-',
                    desc: desc,
                    title: 'GH: ' + (gh || '-') + ' | PPM: ' + ppm + ' | pH: ' + ph
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

                        // --- AUTOCUT STOK GUDANG OTOMATIS ---
                        if (typeof gudang !== 'undefined' && typeof gudang.potongStokOtomatis === 'function') {
                            gudang.potongStokOtomatis('AB Mix', 1, 'Nutrisi', gh || '-', 'Operator');
                        }
                    }
                    if (typeof Helper !== 'undefined' && Helper.showToast) {
                        Helper.showToast(t('toast_saved'), 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('nutrisiId', '');
                var titleEl = document.getElementById('formTitleNutrisi');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('nutrisiId', '');
                var titleEl = document.getElementById('formTitleNutrisi');
                if (titleEl) titleEl.innerText = t('form_title_add');
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerNutrisiCards');
        var pageEl = document.getElementById('paginationNutrisiControls');
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
            var dateA = a && a.date ? new Date(a.date) : new Date(0);
            var dateB = b && b.date ? new Date(b.date) : new Date(0);
            return dateB - dateA;
        });

        // 2. Filter data berdasarkan kata kunci pencarian
        var filteredData = data.filter(function(item) {
            if (!searchQuery) return true;
            var kw = searchQuery.toLowerCase();
            var gh = (item.gh || '').toLowerCase();
            var date = (item.date || '').toLowerCase();
            var timeSlot = (item.timeSlot || '').toLowerCase();
            var hst = (item.hst || '').toString().toLowerCase();
            var fase = (item.fase || '').toLowerCase();
            var ppm = (item.ppm || '').toString().toLowerCase();
            var ph = (item.ph || '').toString().toLowerCase();
            var phAction = (item.phAction || '').toLowerCase();
            var desc = (item.desc || '').toLowerCase();
            return gh.includes(kw) || date.includes(kw) || timeSlot.includes(kw) || hst.includes(kw) || fase.includes(kw) || ppm.includes(kw) || ph.includes(kw) || phAction.includes(kw) || desc.includes(kw);
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
            var valHst = item.hst ? item.hst : '-';
            var valFase = item.fase ? item.fase : '-';
            var valPpm = item.ppm ? item.ppm : '-';
            var valTargetPpm = item.targetPpm ? item.targetPpm : '-';
            var valPh = item.ph ? item.ph : '-';
            var valPhAction = item.phAction ? item.phAction : '-';
            var valWater = item.waterTemp ? item.waterTemp : '-';
            var valRoom = item.roomTemp ? item.roomTemp : (item.ghTemp ? item.ghTemp : '-');
            var valDesc = item.desc ? item.desc : '';

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <!-- Header Card: Tanggal, ID GH & Waktu -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: var(--text-color, #222);">${item.date || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                            <span style="background: #E1F5FE; color: #0277BD; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 4px;">${item.timeSlot || t('opt_morning')}</span>
                        </div>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Kiri Atas: PPM -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_ppm')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-water" style="color: #0277BD; width: 14px;"></i> <strong>${valPpm} PPM</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-bullseye" style="color: #388E3C; width: 14px;"></i> <strong>${t('card_lbl_target_ppm')} ${valTargetPpm}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Kanan Atas: pH & Koreksi -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_ph_action')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-vial" style="color: #E65100; width: 14px;"></i> <strong>pH ${valPh}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-tools" style="color: #C62828; width: 14px;"></i> <strong>${valPhAction}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Kiri Bawah: HST & Fase -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_hst_fase')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-calendar-day" style="color: #6A1B9A; width: 14px;"></i> <strong>${t('lbl_hst')} ${valHst}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-leaf" style="color: #2E7D32; width: 14px;"></i> <strong>${valFase}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Kanan Bawah: Suhu Air & Ruangan -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_temp')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-thermometer-half" style="color: #0288D1; width: 14px;"></i> <strong>${t('lbl_water')} ${valWater}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-home" style="color: #F57F17; width: 14px;"></i> <strong>${t('lbl_room')} ${valRoom}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan -->
                    ${valDesc ? `<div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); background: var(--inner-card-bg, #fdfdfd); padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">${t('lbl_notes')}: ${valDesc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                        <span onclick="nutrisi.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="nutrisi.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // 5. Render Tombol Paginasi
        if (pageEl) {
            if (totalPages > 1) {
                pageEl.innerHTML = `
                    <button onclick="nutrisi.changePage(-1)" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_prev')}
                    </button>
                    <span style="font-weight: bold; color: var(--text-color, #555);">
                        ${t('page_lbl')} ${currentPage} / ${totalPages} (${filteredData.length} data)
                    </span>
                    <button onclick="nutrisi.changePage(1)" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
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

        setVal('nutrisiId', item.id || '');
        setVal('nutrisiGh', item.gh === '-' ? '' : (item.gh || ''));
        setVal('nutrisiDate', item.date || '');
        setVal('nutrisiTimeSlot', item.timeSlot || t('opt_morning'));
        setVal('nutrisiHst', item.hst === '-' ? '' : (item.hst || ''));
        setVal('nutrisiFase', item.fase || t('opt_fase_veg_growth'));
        setVal('nutrisiPpm', item.ppm === '-' ? '' : (item.ppm || ''));
        setVal('nutrisiTargetPpm', item.targetPpm === '-' ? '' : (item.targetPpm || ''));
        setVal('nutrisiPh', item.ph === '-' ? '' : (item.ph || ''));
        setVal('nutrisiPhAction', item.phAction || t('opt_ph_safe'));
        setVal('nutrisiWaterTemp', item.waterTemp === '-' ? '' : (item.waterTemp || ''));
        setVal('nutrisiRoomTemp', item.roomTemp === '-' ? '' : (item.roomTemp || item.ghTemp || ''));
        setVal('nutrisiDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleNutrisi');
        if (titleEl) titleEl.innerText = t('form_title_edit');
        
        var btnCancel = document.getElementById('btnCancelNutrisiEdit');
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

    // FUNGSI PENANGAN INPUT SEARCH & NAVIGASI HALAMAN
    function handleSearch(val) {
        searchQuery = val || '';
        currentPage = 1; // Reset ke halaman 1 saat pencarian berubah
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

window.nutrisi = nutrisi;
