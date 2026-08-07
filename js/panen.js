// ==========================================
// COZYCS FARM - DATA PANEN MODULE (CRUD & ERP CONNECTED - BILINGUAL, SEARCH & PAGINATION)
// ==========================================

var panen = (function() {

    // VARIABEL STATE UNTUK PENCARIAN & PAGINASI
    var searchQuery = '';
    var currentPage = 1;
    var itemsPerPage = 20; // Dibatasi 20 data per halaman

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Pencatatan & Hasil Panen Melon',
            'form_title_add': 'Catat Hasil Panen Baru',
            'form_title_edit': 'Edit Data Hasil Panen',
            'lbl_gh': 'ID GH',
            'select_gh': '-- Pilih Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Tanggal Panen',
            'lbl_variety': 'Varietas Melon',
            'ph_variety': 'Contoh: Intanon',
            'lbl_petugas': 'Penanggung Jawab',
            'ph_petugas': 'Contoh: Rizky',
            'default_petugas': 'Team Panen',
            'lbl_pcs': 'Jumlah Buah (Pcs/Butir)',
            'ph_pcs': 'Contoh: 150',
            'lbl_total_weight': 'Total Berat Panen (Kg)',
            'ph_total_weight': 'Contoh: 245.5',
            'lbl_brix': 'Kadar Manis (°Brix)',
            'ph_brix': 'Contoh: 14.5',
            'lbl_grade': 'Kategori Grade Dominan',
            'opt_grade_super': 'Grade A Super',
            'opt_grade_a': 'Grade A',
            'opt_grade_b': 'Grade B',
            'opt_grade_afkir': 'Off-Grade / Afkir',
            'lbl_grade_a_kg': 'Grade A (Kg)',
            'lbl_grade_b_kg': 'Grade B (Kg)',
            'lbl_afkir_kg': 'Afkir (Kg)',
            'lbl_desc': 'Catatan Kualitas Panen',
            'ph_desc': 'Catatan fisik net, bentuk buah, cracking, dll...',
            'btn_save': 'Simpan Data Panen',
            'btn_cancel': 'Batal',
            'recap_title': 'Riwayat & Hasil Panen Cozycs Farm',
            'no_data': 'Belum ada data panen tercatat.',
            'card_lbl_total_harvest': 'Total Hasil Panen',
            'card_lbl_quality_brix': 'Kualitas & Manis',
            'card_lbl_grading_breakdown': 'Rincian Grading',
            'card_lbl_petugas': 'Penanggung Jawab',
            'unit_kg': 'Kg',
            'unit_pcs': 'Buah / Pcs',
            'lbl_avg_weight': 'Avg:',
            'unit_kg_per_fruit': 'Kg/buah',
            'lbl_afkir': 'Afkir:',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Data panen berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus data panen ini?',
            'toast_deleted': 'Data panen berhasil dihapus',
            'ph_search': '🔍 Cari tanggal, GH, varietas, grade, petugas, atau catatan...',
            'btn_prev': '⬅️ Sebelum',
            'btn_next': 'Selanjutnya ➡️',
            'page_lbl': 'Halaman',
            'total_lbl': 'Total Data'
        },
        'en': {
            'module_title': 'Melon Harvest Recording & Results',
            'form_title_add': 'Record New Harvest',
            'form_title_edit': 'Edit Harvest Data',
            'lbl_gh': 'GH ID',
            'select_gh': '-- Select Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Harvest Date',
            'lbl_variety': 'Melon Variety',
            'ph_variety': 'e.g., Intanon',
            'lbl_petugas': 'Person in Charge',
            'ph_petugas': 'e.g., Rizky',
            'default_petugas': 'Harvest Team',
            'lbl_pcs': 'Fruit Count (Pcs/Units)',
            'ph_pcs': 'e.g., 150',
            'lbl_total_weight': 'Total Harvest Weight (Kg)',
            'ph_total_weight': 'e.g., 245.5',
            'lbl_brix': 'Sweetness Level (°Brix)',
            'ph_brix': 'e.g., 14.5',
            'lbl_grade': 'Dominant Grade Category',
            'opt_grade_super': 'Grade A Super',
            'opt_grade_a': 'Grade A',
            'opt_grade_b': 'Grade B',
            'opt_grade_afkir': 'Off-Grade / Reject',
            'lbl_grade_a_kg': 'Grade A (Kg)',
            'lbl_grade_b_kg': 'Grade B (Kg)',
            'lbl_afkir_kg': 'Reject (Kg)',
            'lbl_desc': 'Harvest Quality Notes',
            'ph_desc': 'Notes on net condition, fruit shape, cracking, etc...',
            'btn_save': 'Save Harvest Data',
            'btn_cancel': 'Cancel',
            'recap_title': 'Cozycs Farm Harvest History & Yield Results',
            'no_data': 'No harvest data recorded yet.',
            'card_lbl_total_harvest': 'Total Harvest Yield',
            'card_lbl_quality_brix': 'Quality & Sweetness',
            'card_lbl_grading_breakdown': 'Grading Breakdown',
            'card_lbl_petugas': 'Person in Charge',
            'unit_kg': 'Kg',
            'unit_pcs': 'Fruit / Pcs',
            'lbl_avg_weight': 'Avg:',
            'unit_kg_per_fruit': 'Kg/fruit',
            'lbl_afkir': 'Reject:',
            'lbl_notes': 'Notes',
            'toast_saved': 'Harvest data saved successfully!',
            'confirm_delete': 'Are you sure you want to delete this harvest data?',
            'toast_deleted': 'Harvest data deleted successfully',
            'ph_search': '🔍 Search date, GH, variety, grade, PIC, or notes...',
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
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.PANEN) {
            return Storage.KEYS.PANEN;
        }
        return 'cozycs_panen';
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
        var selectEl = document.getElementById('panenGh');
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
                <div class="section-title"><i class="fas fa-shopping-basket" style="color: #2E7D32;"></i> ${t('module_title')}</div>
                
                <!-- Form Input / Edit Data Panen -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;" id="formTitlePanen">${t('form_title_add')}</div>
                    <form id="formPanen">
                        <input type="hidden" id="panenId">
                        
                        <!-- ID GH & Tanggal Panen -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gh')}</label>
                                <select id="panenGh" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="">${t('select_gh')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date')}</label>
                                <input type="date" id="panenTanggal" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Varietas Melon & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_variety')}</label>
                                <input type="text" id="panenVarietas" required placeholder="${t('ph_variety')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_petugas')}</label>
                                <input type="text" id="panenPetugas" placeholder="${t('ph_petugas')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Jumlah Buah & Total Berat -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_pcs')}</label>
                                <input type="number" id="panenJumlahPcs" required placeholder="${t('ph_pcs')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_total_weight')}</label>
                                <input type="number" step="any" id="panenBeratTotal" required placeholder="${t('ph_total_weight')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Tingkat Kemanisan (°Brix) & Grade Utama -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_brix')}</label>
                                <input type="number" step="any" id="panenBrix" placeholder="${t('ph_brix')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_grade')}</label>
                                <select id="panenGrade" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Grade A Super">${t('opt_grade_super')}</option>
                                    <option value="Grade A">${t('opt_grade_a')}</option>
                                    <option value="Grade B">${t('opt_grade_b')}</option>
                                    <option value="Off-Grade / Afkir">${t('opt_grade_afkir')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Detail Hasil Grading (Kg) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">${t('lbl_grade_a_kg')}</label>
                                <input type="number" step="any" id="panenGradeAKg" placeholder="200" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">${t('lbl_grade_b_kg')}</label>
                                <input type="number" step="any" id="panenGradeBKg" placeholder="35" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">${t('lbl_afkir_kg')}</label>
                                <input type="number" step="any" id="panenAfkirKg" placeholder="10.5" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label>
                            <textarea id="panenDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #2E7D32; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelPanenEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Title -->
                <div class="section-title"><i class="fas fa-list" style="color: #2E7D32;"></i> ${t('recap_title')}</div>
                
                <!-- Kotak Pencarian Khusus Modul Panen -->
                <div style="margin-bottom: 14px;">
                    <input type="text" id="inputSearchPanen" 
                           placeholder="${t('ph_search')}" 
                           oninput="panen.handleSearch(this.value)"
                           value="${searchQuery}"
                           style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color, #ccc); font-size: 13px; box-sizing: border-box; background: var(--card-bg, #fff); color: var(--text-color, #222);">
                </div>

                <!-- Rekap Data Panen Grid 2x2 -->
                <div id="containerPanenCards"></div>

                <!-- Kontrol Navigasi Paginasi -->
                <div id="paginationPanenControls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; margin-bottom: 20px; font-size: 12px;"></div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        var form = document.getElementById('formPanen');
        var btnCancel = document.getElementById('btnCancelPanenEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('panenId');
                var gh = getVal('panenGh');
                var tanggal = getVal('panenTanggal');
                var varietas = getVal('panenVarietas');
                var petugas = getVal('panenPetugas');
                var pcs = parseFloat(getVal('panenJumlahPcs')) || 0;
                var beratTotal = parseFloat(getVal('panenBeratTotal')) || 0;
                var brix = getVal('panenBrix');
                var grade = getVal('panenGrade');
                var gradeAKg = parseFloat(getVal('panenGradeAKg')) || 0;
                var gradeBKg = parseFloat(getVal('panenGradeBKg')) || 0;
                var afkirKg = parseFloat(getVal('panenAfkirKg')) || 0;
                var desc = getVal('panenDesc');

                var payload = {
                    gh: gh || '-',
                    tanggal: tanggal,
                    varietas: varietas || '-',
                    petugas: petugas || t('default_petugas'),
                    pcs: pcs,
                    beratTotal: beratTotal,
                    brix: brix || '-',
                    grade: grade || 'Grade A',
                    gradeAKg: gradeAKg,
                    gradeBKg: gradeBKg,
                    afkirKg: afkirKg,
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

                        // --- AUTOCUT & MASUK STOK GUDANG OTOMATIS ---
                        // Tambahkan Stok Buah Hasil Panen ke Gudang Inventaris
                        if (typeof Storage !== 'undefined') {
                            var keyGudang = (Storage.KEYS && Storage.KEYS.GUDANG) ? Storage.KEYS.GUDANG : 'cozycs_gudang';
                            var dataGudang = Storage.getAll(keyGudang) || [];
                            
                            var namaBarangGudang = 'Melon ' + varietas + ' (Panen ' + (gh || 'GH') + ')';
                            var itemGudang = dataGudang.find(function(b) {
                                return b.nama.toLowerCase().trim() === namaBarangGudang.toLowerCase().trim();
                            });

                            if (itemGudang) {
                                itemGudang.stok = (parseFloat(itemGudang.stok) || 0) + beratTotal;
                                Storage.update(keyGudang, itemGudang);
                            } else {
                                Storage.add(keyGudang, {
                                    tglBeli: tanggal,
                                    kategori: 'Lainnya',
                                    nama: namaBarangGudang,
                                    merek: 'Cozycs Farm',
                                    stok: beratTotal,
                                    satuan: 'Kg',
                                    stokMin: 10,
                                    harga: 25000,
                                    supplier: 'Panen Internal GH',
                                    lokasi: 'Gudang Utama - Cold Space',
                                    expired: '-',
                                    desc: 'Hasil Panen dari ' + (gh || 'GH') + ' | ' + pcs + ' Pcs | Brix: ' + brix + '°',
                                    status: 'Aktif'
                                });
                            }
                        }
                    }

                    if (typeof Helper !== 'undefined' && Helper.showToast) {
                        Helper.showToast(t('toast_saved'), 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('panenId', '');
                var titleEl = document.getElementById('formTitlePanen');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('panenId', '');
                var titleEl = document.getElementById('formTitlePanen');
                if (titleEl) titleEl.innerText = t('form_title_add');
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerPanenCards');
        var pageEl = document.getElementById('paginationPanenControls');
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
            var varietas = (item.varietas || '').toLowerCase();
            var petugas = (item.petugas || '').toLowerCase();
            var pcs = (item.pcs || '').toString().toLowerCase();
            var beratTotal = (item.beratTotal || '').toString().toLowerCase();
            var brix = (item.brix || '').toString().toLowerCase();
            var grade = (item.grade || '').toLowerCase();
            var desc = (item.desc || '').toLowerCase();
            return gh.includes(kw) || tanggal.includes(kw) || varietas.includes(kw) || petugas.includes(kw) || pcs.includes(kw) || beratTotal.includes(kw) || brix.includes(kw) || grade.includes(kw) || desc.includes(kw);
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
            var valBerat = item.beratTotal ? item.beratTotal : '-';
            var valPcs = item.pcs ? item.pcs : '-';
            var valBrix = item.brix ? item.brix : '-';
            var valGrade = item.grade ? item.grade : 'Grade A';
            var valDesc = item.desc ? item.desc : '';

            // Hitung rata-rata berat per buah
            var avgWeight = (parseFloat(item.beratTotal) > 0 && parseFloat(item.pcs) > 0) ? (item.beratTotal / item.pcs).toFixed(2) : '-';

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <!-- Header Card: Tanggal, ID GH & Varietas -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: var(--text-color, #222);">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                            <span style="background: #E8F5E9; color: #2E7D32; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 4px;">${valVarietas}</span>
                        </div>
                        <span style="background: #FFF3E0; color: #E65100; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${valGrade}</span>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Total Hasil Panen -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_total_harvest')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-weight" style="color: #2E7D32; width: 14px;"></i> <strong>${valBerat} ${t('unit_kg')}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-cubes" style="color: #0277BD; width: 14px;"></i> <strong>${valPcs} ${t('unit_pcs')}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Kualitas Buah -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_quality_brix')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-fire" style="color: #E65100; width: 14px;"></i> <strong>${valBrix} °Brix</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-balance-scale" style="color: #6A1B9A; width: 14px;"></i> <strong>${t('lbl_avg_weight')} ${avgWeight} ${t('unit_kg_per_fruit')}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Rincian Grading (Kg) -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_grading_breakdown')}</div>
                            <div style="font-size: 11px; font-weight: bold; color: var(--text-color, #333); line-height: 1.4;">
                                <div>A: <strong>${item.gradeAKg || 0} ${t('unit_kg')}</strong> | B: <strong>${item.gradeBKg || 0} ${t('unit_kg')}</strong></div>
                                <div style="margin-top: 3px; color: #C62828;">${t('lbl_afkir')} <strong>${item.afkirKg || 0} ${t('unit_kg')}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Penanggung Jawab -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_petugas')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-user-check" style="color: #0288D1; width: 14px;"></i> <strong>${item.petugas || t('default_petugas')}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan -->
                    ${valDesc ? `<div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); background: var(--inner-card-bg, #fdfdfd); padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">${t('lbl_notes')}: ${valDesc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                        <span onclick="panen.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="panen.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // 5. Render Tombol Paginasi
        if (pageEl) {
            if (totalPages > 1) {
                pageEl.innerHTML = `
                    <button onclick="panen.changePage(-1)" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_prev')}
                    </button>
                    <span style="font-weight: bold; color: var(--text-color, #555);">
                        ${t('page_lbl')} ${currentPage} / ${totalPages} (${filteredData.length} data)
                    </span>
                    <button onclick="panen.changePage(1)" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
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

        setVal('panenId', item.id || '');
        setVal('panenGh', item.gh === '-' ? '' : (item.gh || ''));
        setVal('panenTanggal', item.tanggal || '');
        setVal('panenVarietas', item.varietas === '-' ? '' : (item.varietas || ''));
        setVal('panenPetugas', item.petugas === t('default_petugas') ? '' : (item.petugas || ''));
        setVal('panenJumlahPcs', item.pcs || '');
        setVal('panenBeratTotal', item.beratTotal || '');
        setVal('panenBrix', item.brix === '-' ? '' : (item.brix || ''));
        setVal('panenGrade', item.grade || 'Grade A');
        setVal('panenGradeAKg', item.gradeAKg || '');
        setVal('panenGradeBKg', item.gradeBKg || '');
        setVal('panenAfkirKg', item.afkirKg || '');
        setVal('panenDesc', item.desc || '');

        var titleEl = document.getElementById('formTitlePanen');
        if (titleEl) titleEl.innerText = t('form_title_edit');
        
        var btnCancel = document.getElementById('btnCancelPanenEdit');
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

window.panen = panen;
