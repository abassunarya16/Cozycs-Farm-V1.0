// ==========================================
// COZYCS FARM - MODUL MANAJEMEN GREENHOUSE (WITH AUTO-DRAFT & DASHBOARD LOG)
// ==========================================

var greenhouse = (function() {

    // VARIABEL STATE UNTUK PENCARIAN & PAGINASI
    var searchQuery = '';
    var currentPage = 1;
    var itemsPerPage = 20;

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Master Data Greenhouse',
            'form_title_add': 'Registrasi Data Greenhouse',
            'form_title_edit': 'Edit Data Greenhouse',
            'lbl_code': 'Kode GH',
            'ph_code': 'Contoh: GH-01',
            'lbl_name': 'Nama Greenhouse',
            'ph_name': 'Contoh: GH Utama Intanon',
            'lbl_status': 'Status Operasional',
            'opt_status_active': 'Aktif / Berjalan',
            'opt_status_prep': 'Persiapan / Sterilisasi',
            'opt_status_rest': 'Masa Rehat / Kosong',
            'opt_status_maintenance': 'Perawatan / Perbaikan',
            'lbl_system': 'Tipe Sistem',
            'opt_sys_drip': 'Fertigasi Tetes / Drip',
            'opt_sys_dutch': 'Dutch Bucket',
            'opt_sys_nft_dft': 'NFT / DFT',
            'opt_sys_other': 'Lainnya',
            'lbl_gutters': 'Jumlah Talang / Line',
            'ph_gutters': 'Contoh: 10',
            'lbl_holes': 'Total Lubang Tanam',
            'ph_holes': 'Contoh: 250',
            'lbl_area': 'Luas Area (m²)',
            'ph_area': 'Contoh: 200',
            'lbl_tank': 'Kapasitas Tandon (Liter)',
            'ph_tank': 'Contoh: 1000',
            'lbl_uv': 'Plastik UV',
            'ph_uv': 'Contoh: UV 14% Vatan',
            'lbl_insect_net': 'Insect Net',
            'ph_insect_net': 'Contoh: 40 Mesh',
            'lbl_date_op': 'Tanggal Operasi GH',
            'lbl_date_plant': 'Tanggal Tanam Perdana',
            'lbl_date_harvest': 'Target Tanggal Panen',
            'lbl_desc': 'Catatan GH',
            'ph_desc': 'Catatan fasilitas, sterilisasi, perbaikan...',
            'btn_save': 'Simpan Data GH',
            'btn_cancel': 'Batal',
            'recap_title': 'Daftar & Status Greenhouse',
            'no_data': 'Belum ada data greenhouse tercatat.',
            'card_lbl_cap_system': 'Kapasitas & Sistem',
            'card_lbl_dim_fac': 'Dimensi & Fasilitas',
            'card_lbl_date_op': 'Tanggal Operasi',
            'card_lbl_crop_cycle': 'Siklus Tanam',
            'unit_gutters': 'Talang',
            'unit_holes': 'Lubang',
            'lbl_operating': 'Beroperasi:',
            'lbl_planting': 'Tanam:',
            'lbl_target': 'Target:',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Data greenhouse berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus data greenhouse ini?',
            'toast_deleted': 'Data greenhouse berhasil dihapus',
            'ph_search': '🔍 Cari kode, nama, status, sistem, atau catatan GH...',
            'btn_prev': '⬅️ Sebelum',
            'btn_next': 'Selanjutnya ➡️',
            'page_lbl': 'Halaman',
            'total_lbl': 'Total Data'
        },
        'en': {
            'module_title': 'Greenhouse Master Data',
            'form_title_add': 'Register New Greenhouse',
            'form_title_edit': 'Edit Greenhouse Data',
            'lbl_code': 'GH Code',
            'ph_code': 'e.g., GH-01',
            'lbl_name': 'Greenhouse Name',
            'ph_name': 'e.g., GH Utama Intanon',
            'lbl_status': 'Operational Status',
            'opt_status_active': 'Active / Running',
            'opt_status_prep': 'Preparation / Sterilization',
            'opt_status_rest': 'Rest Period / Empty',
            'opt_status_maintenance': 'Maintenance / Repair',
            'lbl_system': 'System Type',
            'opt_sys_drip': 'Drip Fertigation',
            'opt_sys_dutch': 'Dutch Bucket',
            'opt_sys_nft_dft': 'NFT / DFT',
            'opt_sys_other': 'Others',
            'lbl_gutters': 'Number of Gutters / Lines',
            'ph_gutters': 'e.g., 10',
            'lbl_holes': 'Total Planting Holes',
            'ph_holes': 'e.g., 250',
            'lbl_area': 'Area Size (m²)',
            'ph_area': 'e.g., 200',
            'lbl_tank': 'Water Tank Capacity (Liters)',
            'ph_tank': 'e.g., 1000',
            'lbl_uv': 'UV Plastic',
            'ph_uv': 'e.g., UV 14% Vatan',
            'lbl_insect_net': 'Insect Net',
            'ph_insect_net': 'e.g., 40 Mesh',
            'lbl_date_op': 'GH Operation Date',
            'lbl_date_plant': 'First Planting Date',
            'lbl_date_harvest': 'Target Harvest Date',
            'lbl_desc': 'GH Notes',
            'ph_desc': 'Facility notes, sterilization, repairs...',
            'btn_save': 'Save GH Data',
            'btn_cancel': 'Cancel',
            'recap_title': 'Greenhouse List & Status',
            'no_data': 'No greenhouse data recorded yet.',
            'card_lbl_cap_system': 'Capacity & System',
            'card_lbl_dim_fac': 'Dimensions & Facilities',
            'card_lbl_date_op': 'Operation Date',
            'card_lbl_crop_cycle': 'Crop Cycle',
            'unit_gutters': 'Gutters',
            'unit_holes': 'Holes',
            'lbl_operating': 'Operating:',
            'lbl_planting': 'Planting:',
            'lbl_target': 'Target:',
            'lbl_notes': 'Notes',
            'toast_saved': 'Greenhouse data saved successfully!',
            'confirm_delete': 'Are you sure you want to delete this greenhouse data?',
            'toast_deleted': 'Greenhouse data deleted successfully',
            'ph_search': '🔍 Search code, name, status, system, or GH notes...',
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
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GREENHOUSE) {
            return Storage.KEYS.GREENHOUSE;
        }
        return 'cozycs_greenhouse';
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val;
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-warehouse" style="color: #2E7D32;"></i> ${t('module_title')}</div>
                
                <!-- Form Input / Edit Data Greenhouse -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;" id="formTitleGh">${t('form_title_add')}</div>
                    <form id="formGh">
                        <input type="hidden" id="ghId">
                        
                        <!-- Kode & Nama GH -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_code')}</label>
                                <input type="text" id="ghKode" required placeholder="${t('ph_code')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_name')}</label>
                                <input type="text" id="ghNama" required placeholder="${t('ph_name')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <!-- Status Operasional & Tipe Hidroponik -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_status')}</label>
                                <select id="ghStatus" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                                    <option value="Aktif / Berjalan">${t('opt_status_active')}</option>
                                    <option value="Persiapan / Sterilisasi">${t('opt_status_prep')}</option>
                                    <option value="Masa Rehat / Kosong">${t('opt_status_rest')}</option>
                                    <option value="Perawatan / Perbaikan">${t('opt_status_maintenance')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_system')}</label>
                                <select id="ghSistem" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                                    <option value="Fertigasi Tetes / Drip">${t('opt_sys_drip')}</option>
                                    <option value="Dutch Bucket">${t('opt_sys_dutch')}</option>
                                    <option value="NFT / DFT">${t('opt_sys_nft_dft')}</option>
                                    <option value="Lainnya">${t('opt_sys_other')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Kapasitas & Dimensi Fisik -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gutters')}</label>
                                <input type="number" id="ghTalang" placeholder="${t('ph_gutters')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_holes')}</label>
                                <input type="number" id="ghLubang" placeholder="${t('ph_holes')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_area')}</label>
                                <input type="number" id="ghLuas" placeholder="${t('ph_area')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_tank')}</label>
                                <input type="number" id="ghTandon" placeholder="${t('ph_tank')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <!-- Spesifikasi Atap & Jaring -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_uv')}</label>
                                <input type="text" id="ghUv" placeholder="${t('ph_uv')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_insect_net')}</label>
                                <input type="text" id="ghInsect" placeholder="${t('ph_insect_net')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <!-- Tanggal Operasi & Periode Tanam -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date_op')}</label>
                            <input type="date" id="ghTglOperasi" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date_plant')}</label>
                                <input type="date" id="ghTglTanam" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date_harvest')}</label>
                                <input type="date" id="ghTglPanen" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label>
                            <textarea id="ghDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #2E7D32; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelGhEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Title -->
                <div class="section-title"><i class="fas fa-list" style="color: #2E7D32;"></i> ${t('recap_title')}</div>
                
                <!-- Kotak Pencarian Khusus Modul Greenhouse -->
                <div style="margin-bottom: 14px;">
                    <input type="text" id="inputSearchGh" 
                           placeholder="${t('ph_search')}" 
                           oninput="greenhouse.handleSearch(this.value)"
                           value="${searchQuery}"
                           style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color, #ccc); font-size: 13px; box-sizing: border-box; background: var(--card-bg, #fff); color: var(--text-color, #222);">
                </div>

                <!-- Rekap Data / Card List Grid 2x2 -->
                <div id="containerGhCards"></div>

                <!-- Kontrol Navigasi Paginasi -->
                <div id="paginationGhControls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; margin-bottom: 20px; font-size: 12px;"></div>
            </div>
        `;
    }

    function init() {
        loadTable();

        // 1. KEMBALIKAN DRAF TERAKHIR DARI LOCALSTORAGE
        if (typeof restoreFormDraftGlobal === 'function') {
            restoreFormDraftGlobal('formGh');
        }

        var form = document.getElementById('formGh');
        var btnCancel = document.getElementById('btnCancelGhEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('ghId');
                var kode = getVal('ghKode');
                var nama = getVal('ghNama');
                var status = getVal('ghStatus');
                var sistem = getVal('ghSistem');
                var talang = getVal('ghTalang');
                var lubang = getVal('ghLubang');
                var luas = getVal('ghLuas');
                var tandon = getVal('ghTandon');
                var uv = getVal('ghUv');
                var insect = getVal('ghInsect');
                var tglOperasi = getVal('ghTglOperasi');
                var tglTanam = getVal('ghTglTanam');
                var tglPanen = getVal('ghTglPanen');
                var desc = getVal('ghDesc');

                var payload = {
                    kode: kode || '-',
                    nama: nama || '-',
                    status: status || t('opt_status_active'),
                    sistem: sistem || t('opt_sys_drip'),
                    talang: talang || '-',
                    lubang: lubang || '-',
                    luas: luas || '-',
                    tandon: tandon || '-',
                    uv: uv || '-',
                    insect: insect || '-',
                    tglOperasi: tglOperasi || '-',
                    tglTanam: tglTanam || '-',
                    tglPanen: tglPanen || '-',
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
                            judul: id ? 'Perbarui Data GH' : 'Registrasi GH Baru',
                            deskripsi: (kode || 'GH') + ' - ' + (nama || 'Greenhouse') + ' (' + (status || 'Aktif') + ')',
                            tanggal: now.toISOString().split('T')[0],
                            jam: timeStr,
                            kategori: 'Greenhouse',
                            icon: 'fas fa-warehouse',
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
                setVal('ghId', '');
                var titleEl = document.getElementById('formTitleGh');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('ghId', '');
                var titleEl = document.getElementById('formTitleGh');
                if (titleEl) titleEl.innerText = t('form_title_add');
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerGhCards');
        var pageEl = document.getElementById('paginationGhControls');
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

        var filteredData = data.filter(function(item) {
            if (!searchQuery) return true;
            var kw = searchQuery.toLowerCase();
            var kode = (item.kode || '').toLowerCase();
            var nama = (item.nama || '').toLowerCase();
            var status = (item.status || '').toLowerCase();
            var sistem = (item.sistem || '').toLowerCase();
            var talang = (item.talang || '').toString().toLowerCase();
            var lubang = (item.lubang || '').toString().toLowerCase();
            var luas = (item.luas || '').toString().toLowerCase();
            var tandon = (item.tandon || '').toString().toLowerCase();
            var uv = (item.uv || '').toLowerCase();
            var insect = (item.insect || '').toLowerCase();
            var desc = (item.desc || '').toLowerCase();
            return kode.includes(kw) || nama.includes(kw) || status.includes(kw) || sistem.includes(kw) || talang.includes(kw) || lubang.includes(kw) || luas.includes(kw) || tandon.includes(kw) || uv.includes(kw) || insect.includes(kw) || desc.includes(kw);
        });

        if (filteredData.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data')}</div>`;
            if (pageEl) pageEl.innerHTML = '';
            return;
        }

        var totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        var pageData = filteredData.slice(startIndex, endIndex);

        var html = '';
        pageData.forEach(function(item) {
            if (!item) return;
            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 15px; color: #2E7D32;">${item.kode || '-'}</strong>
                            <span style="font-size: 13px; font-weight: 600; color: var(--text-color, #333); margin-left: 6px;">${item.nama || '-'}</span>
                        </div>
                        <span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">${item.status || '-'}</span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_cap_system')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-th" style="color: #0277BD; width: 14px;"></i> <strong>${item.talang || '-'} ${t('unit_gutters')} / ${item.lubang || '-'} ${t('unit_holes')}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-cogs" style="color: #E65100; width: 14px;"></i> <strong>${item.sistem || '-'}</strong></div>
                            </div>
                        </div>

                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_dim_fac')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-ruler-combined" style="color: #388E3C; width: 14px;"></i> <strong>${item.luas || '-'} m² | ${item.tandon || '-'}L</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-shield-alt" style="color: #6A1B9A; width: 14px;"></i> <strong>${item.uv || '-'} | ${item.insect || '-'}</strong></div>
                            </div>
                        </div>

                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_date_op')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-calendar-check" style="color: #2E7D32; width: 14px;"></i> <strong>${t('lbl_operating')} ${item.tglOperasi || '-'}</strong></div>
                            </div>
                        </div>

                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_crop_cycle')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-seedling" style="color: #F57F17; width: 14px;"></i> <strong>${t('lbl_planting')} ${item.tglTanam || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-shopping-basket" style="color: #C62828; width: 14px;"></i> <strong>${t('lbl_target')} ${item.tglPanen || '-'}</strong></div>
                            </div>
                        </div>
                    </div>

                    ${item.desc ? `<div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); background: var(--inner-card-bg, #fdfdfd); padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">${t('lbl_notes')}: ${item.desc}</div>` : ''}

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                        <span onclick="greenhouse.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="greenhouse.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        if (pageEl) {
            if (totalPages > 1) {
                pageEl.innerHTML = `
                    <button onclick="greenhouse.changePage(-1)" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_prev')}
                    </button>
                    <span style="font-weight: bold; color: var(--text-color, #555);">
                        ${t('page_lbl')} ${currentPage} / ${totalPages} (${filteredData.length} data)
                    </span>
                    <button onclick="greenhouse.changePage(1)" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
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

        setVal('ghId', item.id || '');
        setVal('ghKode', item.kode === '-' ? '' : (item.kode || ''));
        setVal('ghNama', item.nama === '-' ? '' : (item.nama || ''));
        setVal('ghStatus', item.status || 'Aktif / Berjalan');
        setVal('ghSistem', item.sistem || 'Fertigasi Tetes / Drip');
        setVal('ghTalang', item.talang === '-' ? '' : (item.talang || ''));
        setVal('ghLubang', item.lubang === '-' ? '' : (item.lubang || ''));
        setVal('ghLuas', item.luas === '-' ? '' : (item.luas || ''));
        setVal('ghTandon', item.tandon === '-' ? '' : (item.tandon || ''));
        setVal('ghUv', item.uv === '-' ? '' : (item.uv || ''));
        setVal('ghInsect', item.insect === '-' ? '' : (item.insect || ''));
        setVal('ghTglOperasi', item.tglOperasi === '-' ? '' : (item.tglOperasi || ''));
        setVal('ghTglTanam', item.tglTanam === '-' ? '' : (item.tglTanam || ''));
        setVal('ghTglPanen', item.tglPanen === '-' ? '' : (item.tglPanen || ''));
        setVal('ghDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleGh');
        if (titleEl) titleEl.innerText = t('form_title_edit');
        
        var btnCancel = document.getElementById('btnCancelGhEdit');
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

window.greenhouse = greenhouse;
