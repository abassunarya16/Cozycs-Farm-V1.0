// ==========================================
// COZYCS FARM - MODUL JADWAL & RIWAYAT SPRAY (WITH AUTO-DRAFT & DASHBOARD LOG)
// ==========================================

var spray = (function() {

    // VARIABEL STATE UNTUK PENCARIAN & PAGINASI
    var searchQuery = '';
    var currentPage = 1;
    var itemsPerPage = 20;

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Jadwal & Riwayat Spray',
            'form_title_add': 'Tambah Jadwal / Aksi Spray',
            'form_title_edit': 'Edit Jadwal Spray',
            'lbl_gh': 'ID GH',
            'select_gh': '-- Pilih Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Tanggal Pelaksanaan',
            'lbl_time_slot': 'Waktu Penyemprotan',
            'opt_morning': 'Pagi (06:00 - 08:00)',
            'opt_afternoon': 'Sore (16:00 - 17:30)',
            'lbl_prod_bubuk': 'Nama Produk (Bubuk)',
            'ph_prod_bubuk': 'Contoh: Antracol',
            'lbl_prod_cairan': 'Nama Produk (Cairan)',
            'ph_prod_cairan': 'Contoh: Demolish',
            'lbl_type_fung_insek': 'Fungisida & Insektisida',
            'ph_type_fung_insek': 'Contoh: Antracol / Demolish',
            'lbl_type_fertilizer': 'Fertilizer / Pupuk Daun',
            'ph_type_fertilizer': 'Contoh: Gandasil D',
            'lbl_dose_gram': 'Dosis (Gram)',
            'ph_dose_gram': 'Contoh: 2 gram / 16L',
            'lbl_dose_ml': 'Dosis (ml)',
            'ph_dose_ml': 'Contoh: 15 ml / 16L',
            'lbl_target_hama': 'Pengendalian Hama',
            'ph_target_hama': 'Contoh: Thrips, Kutu kebul',
            'lbl_target_penyakit': 'Pengendalian Penyakit',
            'ph_target_penyakit': 'Contoh: Powdery mildew, Busuk',
            'lbl_desc': 'Catatan Tambahan (Opsional)',
            'ph_desc': 'Catatan khusus pelaksanaan...',
            'btn_save': 'Simpan Jadwal Spray',
            'btn_cancel': 'Batal',
            'recap_title': 'Rekap Riwayat & Jadwal Spray',
            'no_data': 'Belum ada jadwal spray tercatat.',
            'lbl_product': 'Nama Produk',
            'lbl_dose': 'Dosis Aplikasi',
            'lbl_spray_type': 'Jenis Penyemprotan',
            'lbl_target': 'Sasaran Hama & Penyakit',
            'lbl_notes': 'Catatan',
            'toast_updated': 'Jadwal spray berhasil diperbarui!',
            'toast_added': 'Jadwal spray berhasil ditambahkan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus jadwal spray ini?',
            'toast_deleted': 'Jadwal spray berhasil dihapus',
            'ph_search': '🔍 Cari tanggal, GH, produk, jenis, atau target spray...',
            'btn_prev': '⬅️ Sebelum',
            'btn_next': 'Selanjutnya ➡️',
            'page_lbl': 'Halaman',
            'total_lbl': 'Total Data'
        },
        'en': {
            'module_title': 'Spray Schedule & History',
            'form_title_add': 'Add Spray Schedule / Action',
            'form_title_edit': 'Edit Spray Schedule',
            'lbl_gh': 'GH ID',
            'select_gh': '-- Select Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Execution Date',
            'lbl_time_slot': 'Spraying Time',
            'opt_morning': 'Morning (06:00 - 08:00)',
            'opt_afternoon': 'Afternoon (16:00 - 17:30)',
            'lbl_prod_bubuk': 'Product Name (Powder)',
            'ph_prod_bubuk': 'e.g., Antracol',
            'lbl_prod_cairan': 'Product Name (Liquid)',
            'ph_prod_cairan': 'e.g., Demolish',
            'lbl_type_fung_insek': 'Fungicide & Insecticide',
            'ph_type_fung_insek': 'e.g., Antracol / Demolish',
            'lbl_type_fertilizer': 'Fertilizer / Foliar Fertilizer',
            'ph_type_fertilizer': 'e.g., Gandasil D',
            'lbl_dose_gram': 'Dosage (Gram)',
            'ph_dose_gram': 'e.g., 2 grams / 16L',
            'lbl_dose_ml': 'Dosage (ml)',
            'ph_dose_ml': 'e.g., 15 ml / 16L',
            'lbl_target_hama': 'Pest Control',
            'ph_target_hama': 'e.g., Thrips, Whiteflies',
            'lbl_target_penyakit': 'Disease Control',
            'ph_target_penyakit': 'e.g., Powdery mildew, Rot',
            'lbl_desc': 'Additional Notes (Optional)',
            'ph_desc': 'Special execution notes...',
            'btn_save': 'Save Spray Schedule',
            'btn_cancel': 'Cancel',
            'recap_title': 'Spray History & Schedule Recap',
            'no_data': 'No spray schedules recorded yet.',
            'lbl_product': 'Product Name',
            'lbl_dose': 'Application Dosage',
            'lbl_spray_type': 'Spraying Type',
            'lbl_target': 'Target Pests & Diseases',
            'lbl_notes': 'Notes',
            'toast_updated': 'Spray schedule updated successfully!',
            'toast_added': 'Spray schedule added successfully!',
            'confirm_delete': 'Are you sure you want to delete this spray schedule?',
            'toast_deleted': 'Spray schedule deleted successfully',
            'ph_search': '🔍 Search date, GH, product, type, or spray target...',
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

    function getStorageKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.SPRAY) {
            return Storage.KEYS.SPRAY;
        }
        return 'cozycs_spray';
    }

    function populateGhDropdown() {
        var selectEl = document.getElementById('sprayGh');
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
                <div class="section-title"><i class="fas fa-spray-can" style="color: #6A1B9A;"></i> ${t('module_title')}</div>
                
                <!-- Form Input / Edit Data Spray -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #6A1B9A; margin-bottom: 12px;" id="formTitleSpray">${t('form_title_add')}</div>
                    <form id="formSpray">
                        <input type="hidden" id="sprayId">
                        
                        <!-- ID GH & Tanggal Pelaksanaan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gh')}</label>
                                <select id="sprayGh" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="">${t('select_gh')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date')}</label>
                                <input type="date" id="sprayDate" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Waktu Penyemprotan (Pagi / Sore) -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_time_slot')}</label>
                            <select id="sprayTimeSlot" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                <option value="Pagi (06:00 - 08:00)">${t('opt_morning')}</option>
                                <option value="Sore (16:00 - 17:30)">${t('opt_afternoon')}</option>
                            </select>
                        </div>

                        <!-- Nama Produk Terpisah (Bubuk & Cairan) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_prod_bubuk')}</label>
                                <input type="text" id="sprayProductBubuk" placeholder="${t('ph_prod_bubuk')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_prod_cairan')}</label>
                                <input type="text" id="sprayProductCairan" placeholder="${t('ph_prod_cairan')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Jenis Penyemprotan Terpisah -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_type_fung_insek')}</label>
                                <input type="text" id="sprayTypeFungInsek" placeholder="${t('ph_type_fung_insek')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_type_fertilizer')}</label>
                                <input type="text" id="sprayTypeFertilizer" placeholder="${t('ph_type_fertilizer')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Dosis Terpisah (Gram & ml) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_dose_gram')}</label>
                                <input type="text" id="sprayDoseGram" placeholder="${t('ph_dose_gram')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_dose_ml')}</label>
                                <input type="text" id="sprayDoseMl" placeholder="${t('ph_dose_ml')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Sasaran Hama & Penyakit -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_target_hama')}</label>
                                <input type="text" id="sprayTargetHama" placeholder="${t('ph_target_hama')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_target_penyakit')}</label>
                                <input type="text" id="sprayTargetPenyakit" placeholder="${t('ph_target_penyakit')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Catatan Tambahan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label>
                            <textarea id="sprayDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #6A1B9A;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelSprayEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Title -->
                <div class="section-title"><i class="fas fa-list" style="color: #6A1B9A;"></i> ${t('recap_title')}</div>
                
                <!-- Kotak Pencarian Khusus Modul Spray -->
                <div style="margin-bottom: 14px;">
                    <input type="text" id="inputSearchSpray" 
                           placeholder="${t('ph_search')}" 
                           oninput="spray.handleSearch(this.value)"
                           value="${searchQuery}"
                           style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color, #ccc); font-size: 13px; box-sizing: border-box; background: var(--card-bg, #fff); color: var(--text-color, #222);">
                </div>

                <!-- Rekap Data / Card List Grid 2x2 -->
                <div id="containerSprayCards"></div>

                <!-- Kontrol Navigasi Paginasi -->
                <div id="paginationSprayControls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; margin-bottom: 20px; font-size: 12px;"></div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        // 1. KEMBALIKAN DRAF TERAKHIR DARI LOCALSTORAGE
        if (typeof restoreFormDraftGlobal === 'function') {
            restoreFormDraftGlobal('formSpray');
        }

        var form = document.getElementById('formSpray');
        var btnCancel = document.getElementById('btnCancelSprayEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var idEl = document.getElementById('sprayId');
                var ghEl = document.getElementById('sprayGh');
                var dateEl = document.getElementById('sprayDate');
                var timeSlotEl = document.getElementById('sprayTimeSlot');
                var productBubukEl = document.getElementById('sprayProductBubuk');
                var productCairanEl = document.getElementById('sprayProductCairan');
                var typeFungInsekEl = document.getElementById('sprayTypeFungInsek');
                var typeFertilizerEl = document.getElementById('sprayTypeFertilizer');
                var doseGramEl = document.getElementById('sprayDoseGram');
                var doseMlEl = document.getElementById('sprayDoseMl');
                var targetHamaEl = document.getElementById('sprayTargetHama');
                var targetPenyakitEl = document.getElementById('sprayTargetPenyakit');
                var descEl = document.getElementById('sprayDesc');

                var payload = {
                    gh: (ghEl && ghEl.value) ? ghEl.value : '-',
                    date: dateEl ? dateEl.value : '',
                    timeSlot: timeSlotEl ? timeSlotEl.value : t('opt_morning'),
                    productBubuk: (productBubukEl && productBubukEl.value) ? productBubukEl.value : '-',
                    productCairan: (productCairanEl && productCairanEl.value) ? productCairanEl.value : '-',
                    typeFungInsek: (typeFungInsekEl && typeFungInsekEl.value) ? typeFungInsekEl.value : '-',
                    typeFertilizer: (typeFertilizerEl && typeFertilizerEl.value) ? typeFertilizerEl.value : '-',
                    doseGram: (doseGramEl && doseGramEl.value) ? doseGramEl.value : '-',
                    doseMl: (doseMlEl && doseMlEl.value) ? doseMlEl.value : '-',
                    targetHama: (targetHamaEl && targetHamaEl.value) ? targetHamaEl.value : '-',
                    targetPenyakit: (targetPenyakitEl && targetPenyakitEl.value) ? targetPenyakitEl.value : '-',
                    desc: descEl ? descEl.value : '',
                    module: 'spray',
                    icon: 'fa-spray-can',
                    color: '#6A1B9A',
                    bg: '#F3E5F5'
                };

                var key = getStorageKey();
                var id = idEl ? idEl.value : '';

                if (id) {
                    payload.id = id;
                    if (typeof Storage !== 'undefined' && Storage.update) {
                        Storage.update(key, payload);
                    }
                    syncToSchedules(payload);

                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast(t('toast_updated'), 'success');
                    }
                } else {
                    var added = null;
                    if (typeof Storage !== 'undefined' && Storage.add) {
                        added = Storage.add(key, payload);
                    }
                    if (added) {
                        syncToSchedules(added);
                    }

                    // --- AUTOCUT STOK GUDANG OTOMATIS ---
                    if (typeof gudang !== 'undefined' && typeof gudang.potongStokOtomatis === 'function') {
                        var ghVal = (ghEl && ghEl.value) ? ghEl.value : '-';

                        var produkBubuk = (productBubukEl && productBubukEl.value) ? productBubukEl.value.trim() : '';
                        var dosisGram = parseFloat(doseGramEl ? doseGramEl.value : 0) || 0;
                        if (produkBubuk && produkBubuk !== '-') {
                            gudang.potongStokOtomatis(produkBubuk, dosisGram || 1, 'Spray', ghVal, 'Operator');
                        }

                        var produkCairan = (productCairanEl && productCairanEl.value) ? productCairanEl.value.trim() : '';
                        var dosisMl = parseFloat(doseMlEl ? doseMlEl.value : 0) || 0;
                        if (produkCairan && produkCairan !== '-') {
                            gudang.potongStokOtomatis(produkCairan, dosisMl || 1, 'Spray', ghVal, 'Operator');
                        }
                    }

                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast(t('toast_added'), 'success');
                    }
                }

                // 2. CATAT LOG KE AKTIVITAS TERAKHIR DASBOR
                if (typeof Storage !== 'undefined' && Storage.add) {
                    var keyAktivitas = (Storage.KEYS && Storage.KEYS.AKTIVITAS) ? Storage.KEYS.AKTIVITAS : 'cozycs_aktivitas';
                    var now = new Date();
                    var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
                    
                    var prodSummary = (payload.productBubuk !== '-' ? payload.productBubuk : '') + (payload.productCairan !== '-' ? (' ' + payload.productCairan) : '');
                    if (!prodSummary.trim()) prodSummary = 'Spray Rutin';

                    Storage.add(keyAktivitas, {
                        judul: id ? 'Perbarui Jadwal Spray' : 'Pencatatan Jadwal Spray',
                        deskripsi: (payload.gh || 'GH') + ' - ' + prodSummary.trim() + ' (' + (payload.timeSlot || 'Spray') + ')',
                        tanggal: payload.date || now.toISOString().split('T')[0],
                        jam: timeStr,
                        kategori: 'Spray',
                        icon: 'fas fa-spray-can',
                        color: '#6A1B9A'
                    });
                }

                form.reset();
                if (idEl) idEl.value = '';
                var titleEl = document.getElementById('formTitleSpray');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                var idEl = document.getElementById('sprayId');
                if (idEl) idEl.value = '';
                var titleEl = document.getElementById('formTitleSpray');
                if (titleEl) titleEl.innerText = t('form_title_add');
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerSprayCards');
        var pageEl = document.getElementById('paginationSprayControls');
        if (!container) return;

        var key = getStorageKey();
        var data = [];
        if (typeof Storage !== 'undefined' && Storage.getAll) {
            data = Storage.getAll(key) || [];
        }

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data')}</div>`;
            if (pageEl) pageEl.innerHTML = '';
            return;
        }

        // 1. Urutkan dari tanggal terbaru
        data.sort(function(a, b) {
            return new Date(b.date || 0) - new Date(a.date || 0);
        });

        // 2. Filter data berdasarkan kata kunci pencarian
        var filteredData = data.filter(function(item) {
            if (!searchQuery) return true;
            var kw = searchQuery.toLowerCase();
            var gh = (item.gh || '').toLowerCase();
            var date = (item.date || '').toLowerCase();
            var timeSlot = (item.timeSlot || '').toLowerCase();
            var productBubuk = (item.productBubuk || '').toLowerCase();
            var productCairan = (item.productCairan || '').toLowerCase();
            var typeFungInsek = (item.typeFungInsek || '').toLowerCase();
            var typeFertilizer = (item.typeFertilizer || '').toLowerCase();
            var targetHama = (item.targetHama || '').toLowerCase();
            var targetPenyakit = (item.targetPenyakit || '').toLowerCase();
            var desc = (item.desc || '').toLowerCase();
            return gh.includes(kw) || date.includes(kw) || timeSlot.includes(kw) || productBubuk.includes(kw) || productCairan.includes(kw) || typeFungInsek.includes(kw) || typeFertilizer.includes(kw) || targetHama.includes(kw) || targetPenyakit.includes(kw) || desc.includes(kw);
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
            var valGh = item.gh ? item.gh : '-';
            var displayBubuk = item.productBubuk || item.title || '-';
            var displayCairan = item.productCairan || '-';
            var displayFungInsek = item.typeFungInsek || item.sprayType || '-';
            var displayFertilizer = item.typeFertilizer || '-';

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <!-- Header Card: Tanggal, ID GH & Waktu -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: var(--text-color, #222);">${item.date || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                            <span style="background: #F3E5F5; color: #6A1B9A; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 4px;">${item.timeSlot || ''}</span>
                        </div>
                    </div>

                    <!-- Grid 4 Kotak (2x2) Ukuran Sama Rata -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Kiri Atas: Nama Produk (Bubuk & Cairan) -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('lbl_product')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-box" style="color: #8D6E63; width: 14px;"></i> <strong>${displayBubuk}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-wine-bottle" style="color: #0288D1; width: 14px;"></i> <strong>${displayCairan}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Kanan Atas: Dosis (Gram & ml) -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('lbl_dose')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-weight-hanging" style="color: #6A1B9A; width: 14px;"></i> <strong>${item.doseGram || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-flask" style="color: #0277BD; width: 14px;"></i> <strong>${item.doseMl || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Kiri Bawah: Jenis Penyemprotan -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('lbl_spray_type')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-shield-alt" style="color: #C2185B; width: 14px;"></i> <strong>${displayFungInsek}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-seedling" style="color: #2E7D32; width: 14px;"></i> <strong>${displayFertilizer}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Kanan Bawah: Sasaran Hama & Penyakit -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('lbl_target')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-bug" style="color: #D32F2F; width: 14px;"></i> <strong>${item.targetHama || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-shield-virus" style="color: #7B1FA2; width: 14px;"></i> <strong>${item.targetPenyakit || '-'}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan (Jika Ada) -->
                    ${item.desc ? `<div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); background: var(--inner-card-bg, #fdfdfd); padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">${t('lbl_notes')}: ${item.desc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                        <span onclick="spray.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="spray.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // 5. Render Tombol Paginasi
        if (pageEl) {
            if (totalPages > 1) {
                pageEl.innerHTML = `
                    <button onclick="spray.changePage(-1)" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_prev')}
                    </button>
                    <span style="font-weight: bold; color: var(--text-color, #555);">
                        ${t('page_lbl')} ${currentPage} / ${totalPages} (${filteredData.length} data)
                    </span>
                    <button onclick="spray.changePage(1)" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_next')}
                    </button>
                `;
            } else {
                pageEl.innerHTML = `<span style="color: #777; font-size: 11px;">${t('total_lbl')}: ${filteredData.length} data</span>`;
            }
        }
    }

    function editItem(id) {
        var key = getStorageKey();
        var item = null;
        if (typeof Storage !== 'undefined' && Storage.getById) {
            item = Storage.getById(key, id);
        }
        if (!item) return;

        populateGhDropdown();

        var idEl = document.getElementById('sprayId');
        var ghEl = document.getElementById('sprayGh');
        var dateEl = document.getElementById('sprayDate');
        var timeSlotEl = document.getElementById('sprayTimeSlot');
        var productBubukEl = document.getElementById('sprayProductBubuk');
        var productCairanEl = document.getElementById('sprayProductCairan');
        var typeFungInsekEl = document.getElementById('sprayTypeFungInsek');
        var typeFertilizerEl = document.getElementById('sprayTypeFertilizer');
        var doseGramEl = document.getElementById('sprayDoseGram');
        var doseMlEl = document.getElementById('sprayDoseMl');
        var targetHamaEl = document.getElementById('sprayTargetHama');
        var targetPenyakitEl = document.getElementById('sprayTargetPenyakit');
        var descEl = document.getElementById('sprayDesc');

        if (idEl) idEl.value = item.id || '';
        if (ghEl) ghEl.value = item.gh === '-' ? '' : (item.gh || '');
        if (dateEl) dateEl.value = item.date || '';
        if (timeSlotEl) timeSlotEl.value = item.timeSlot || t('opt_morning');
        if (productBubukEl) productBubukEl.value = (item.productBubuk && item.productBubuk !== '-') ? item.productBubuk : (item.title || '');
        if (productCairanEl) productCairanEl.value = (item.productCairan && item.productCairan !== '-') ? item.productCairan : '';
        if (typeFungInsekEl) typeFungInsekEl.value = (item.typeFungInsek && item.typeFungInsek !== '-') ? item.typeFungInsek : (item.sprayType || '');
        if (typeFertilizerEl) typeFertilizerEl.value = (item.typeFertilizer && item.typeFertilizer !== '-') ? item.typeFertilizer : '';
        if (doseGramEl) doseGramEl.value = (item.doseGram && item.doseGram !== '-') ? item.doseGram : '';
        if (doseMlEl) doseMlEl.value = (item.doseMl && item.doseMl !== '-') ? item.doseMl : '';
        if (targetHamaEl) targetHamaEl.value = (item.targetHama && item.targetHama !== '-') ? item.targetHama : '';
        if (targetPenyakitEl) targetPenyakitEl.value = (item.targetPenyakit && item.targetPenyakit !== '-') ? item.targetPenyakit : '';
        if (descEl) descEl.value = item.desc || '';

        var titleEl = document.getElementById('formTitleSpray');
        if (titleEl) titleEl.innerText = t('form_title_edit');
        
        var btnCancel = document.getElementById('btnCancelSprayEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm(t('confirm_delete'))) {
            var key = getStorageKey();
            if (typeof Storage !== 'undefined' && Storage.remove) {
                Storage.remove(key, id);
            }
            removeFromSchedules(id);
            loadTable();
            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast(t('toast_deleted'), 'error');
            }
        }
    }

    function syncToSchedules(item) {
        if (typeof Storage === 'undefined' || !Storage.getAll || !Storage.saveAll) return;
        var schedules = Storage.getAll('cozycs_schedules') || [];
        var prodText = (item.productBubuk && item.productBubuk !== '-' ? item.productBubuk : '') + ' ' + (item.productCairan && item.productCairan !== '-' ? item.productCairan : '');
        var ghText = (item.gh && item.gh !== '-') ? ('[' + item.gh + '] ') : '';
        var schedulePayload = Object.assign({}, item, {
            title: 'Spray ' + ghText + ': ' + (prodText.trim() ? prodText : 'Aktivitas Spray')
        });
        
        var index = schedules.findIndex(function(s) { return s.id === item.id; });
        if (index >= 0) {
            schedules[index] = schedulePayload;
        } else {
            schedules.unshift(schedulePayload);
        }
        Storage.saveAll('cozycs_schedules', schedules);
    }

    function removeFromSchedules(id) {
        if (typeof Storage === 'undefined' || !Storage.getAll || !Storage.saveAll) return;
        var schedules = Storage.getAll('cozycs_schedules') || [];
        var filtered = schedules.filter(function(s) { return s.id !== id; });
        Storage.saveAll('cozycs_schedules', filtered);
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

window.spray = spray;
