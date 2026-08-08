// ==========================================
// COZYCS FARM - MODUL PEMELIHARAAN & PEMBESARAN BUAH (WITH AUTO-DRAFT & DASHBOARD LOG)
// ==========================================

var buah = (function() {

    // VARIABEL STATE UNTUK PENCARIAN & PAGINASI
    var searchQuery = '';
    var currentPage = 1;
    var itemsPerPage = 20;

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Pemeliharaan & Pembesaran Buah',
            'form_title_add': 'Catat Pemeliharaan Buah',
            'form_title_edit': 'Edit Data Pemeliharaan Buah',
            'lbl_gh': 'ID GH',
            'select_gh': '-- Pilih Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Tanggal Tindakan',
            'lbl_gutter': 'Posisi Talang / Baris',
            'ph_gutter': 'Contoh: Talang 1 - 4',
            'lbl_petugas': 'Penanggung Jawab',
            'ph_petugas': 'Contoh: Rizky',
            'default_petugas': 'Penanggung Jawab',
            'lbl_action': 'Jenis Tindakan',
            'opt_act_hang': 'Gantung Buah (Tali Hook)',
            'opt_act_prune': 'Seleksi Buah Akhir (Pruning)',
            'opt_act_net': 'Pemasangan Net Protection',
            'opt_act_monitor': 'Monitoring Pembesaran Buah',
            'lbl_netting': 'Kondisi Netting / Kulit',
            'opt_net_smooth': 'Mulus (Belum Pembentukan Net)',
            'opt_net_cracked': 'Net Mulai Retak / Pecah',
            'opt_net_dense': 'Net Rapat & Tebal',
            'opt_net_yellow': 'Kuning Sempurna (Non-Net)',
            'lbl_est_weight': 'Est. Bobot Rata-Rata (Kg)',
            'ph_est_weight': 'Contoh: 1.2',
            'lbl_rejected': 'Buah Cacat / Afkir (Pcs)',
            'ph_rejected': 'Contoh: 2 (Pecah/Lalat)',
            'lbl_desc': 'Catatan Tambahan',
            'ph_desc': 'Catatan fisik, gejala cracking, sunburn, dll...',
            'btn_save': 'Simpan Data Buah',
            'btn_cancel': 'Batal',
            'recap_title': 'Riwayat Pemeliharaan Buah',
            'no_data': 'Belum ada catatan pemeliharaan buah.',
            'card_lbl_loc_netting': 'Lokasi & Netting',
            'card_lbl_weight_reject': 'Est. Bobot & Afkir',
            'card_lbl_petugas': 'Penanggung Jawab',
            'card_lbl_stage': 'Status Perkembangan',
            'val_fruit_enlargement': 'Fase Pembesaran',
            'unit_kg_fruit': 'Kg/buah',
            'unit_pcs': 'Pcs',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Data pemeliharaan buah berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus data pemeliharaan buah ini?',
            'toast_deleted': 'Data pemeliharaan buah berhasil dihapus',
            'ph_search': '🔍 Cari tindakan, GH, talang, netting, atau petugas...',
            'btn_prev': '⬅️ Sebelum',
            'btn_next': 'Selanjutnya ➡️',
            'page_lbl': 'Halaman',
            'total_lbl': 'Total Data'
        },
        'en': {
            'module_title': 'Fruit Maintenance & Sizing',
            'form_title_add': 'Record Fruit Maintenance',
            'form_title_edit': 'Edit Fruit Maintenance Data',
            'lbl_gh': 'GH ID',
            'select_gh': '-- Select Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Action Date',
            'lbl_gutter': 'Gutter / Row Position',
            'ph_gutter': 'e.g., Gutter 1 - 4',
            'lbl_petugas': 'Person in Charge',
            'ph_petugas': 'e.g., Rizky',
            'default_petugas': 'Person in Charge',
            'lbl_action': 'Action Type',
            'opt_act_hang': 'Fruit Hanging (Hook Rope)',
            'opt_act_prune': 'Final Fruit Pruning',
            'opt_act_net': 'Net Protection Installation',
            'opt_act_monitor': 'Fruit Sizing Monitoring',
            'lbl_netting': 'Netting / Skin Condition',
            'opt_net_smooth': 'Smooth (Pre-Netting)',
            'opt_net_cracked': 'Net Cracking / Forming',
            'opt_net_dense': 'Dense & Thick Net',
            'opt_net_yellow': 'Perfect Yellow (Non-Net)',
            'lbl_est_weight': 'Est. Avg Weight (Kg)',
            'ph_est_weight': 'e.g., 1.2',
            'lbl_rejected': 'Defective / Rejected Fruit (Pcs)',
            'ph_rejected': 'e.g., 2 (Cracked/Fly)',
            'lbl_desc': 'Additional Notes',
            'ph_desc': 'Physical notes, cracking symptoms, sunburn, etc...',
            'btn_save': 'Save Fruit Data',
            'btn_cancel': 'Cancel',
            'recap_title': 'Fruit Maintenance History',
            'no_data': 'No fruit maintenance records found.',
            'card_lbl_loc_netting': 'Location & Netting',
            'card_lbl_weight_reject': 'Est. Weight & Reject',
            'card_lbl_petugas': 'Person in Charge',
            'card_lbl_stage': 'Development Status',
            'val_fruit_enlargement': 'Fruit Enlargement Stage',
            'unit_kg_fruit': 'Kg/fruit',
            'unit_pcs': 'Pcs',
            'lbl_notes': 'Notes',
            'toast_saved': 'Fruit maintenance data saved successfully!',
            'confirm_delete': 'Are you sure you want to delete this fruit maintenance data?',
            'toast_deleted': 'Fruit maintenance data deleted successfully',
            'ph_search': '🔍 Search action, GH, gutter, netting, or PIC...',
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
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.BUAH) {
            return Storage.KEYS.BUAH;
        }
        return 'cozycs_buah';
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
        var selectEl = document.getElementById('buahGh');
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
                <div class="section-title"><i class="fas fa-apple-alt" style="color: #E65100;"></i> ${t('module_title')}</div>
                
                <!-- Form Input Data Pemeliharaan Buah -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #E65100; margin-bottom: 12px;" id="formTitleBuah">${t('form_title_add')}</div>
                    <form id="formBuah">
                        <input type="hidden" id="buahId">
                        
                        <!-- ID GH & Tanggal Monitoring -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gh')}</label>
                                <select id="buahGh" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="">${t('select_gh')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date')}</label>
                                <input type="date" id="buahTanggal" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Posisi Talang & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gutter')}</label>
                                <input type="text" id="buahTalang" placeholder="${t('ph_gutter')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_petugas')}</label>
                                <input type="text" id="buahPetugas" placeholder="${t('ph_petugas')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Jenis Tindakan / Pemeliharaan & Status Netting -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_action')}</label>
                                <select id="buahTindakan" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Gantung Buah (Tali Hook)">${t('opt_act_hang')}</option>
                                    <option value="Seleksi Buah Akhir (Pruning)">${t('opt_act_prune')}</option>
                                    <option value="Pemasangan Net Protection">${t('opt_act_net')}</option>
                                    <option value="Monitoring Pembesaran Buah">${t('opt_act_monitor')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_netting')}</label>
                                <select id="buahNetting" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Mulus (Belum Pembentukan Net)">${t('opt_net_smooth')}</option>
                                    <option value="Net Mulai Retak / Pecah">${t('opt_net_cracked')}</option>
                                    <option value="Net Rapat & Tebal">${t('opt_net_dense')}</option>
                                    <option value="Kuning Sempurna (Non-Net)">${t('opt_net_yellow')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Estimasi Bobot Rata-Rata & Jumlah Buah Afkir/Cacat -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_est_weight')}</label>
                                <input type="number" step="any" id="buahEstBobot" placeholder="${t('ph_est_weight')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_rejected')}</label>
                                <input type="number" id="buahAfkir" placeholder="${t('ph_rejected')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label>
                            <textarea id="buahDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #E65100; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelBuahEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Title -->
                <div class="section-title"><i class="fas fa-list" style="color: #E65100;"></i> ${t('recap_title')}</div>
                
                <!-- Kotak Pencarian Khusus Modul Buah -->
                <div style="margin-bottom: 14px;">
                    <input type="text" id="inputSearchBuah" 
                           placeholder="${t('ph_search')}" 
                           oninput="buah.handleSearch(this.value)"
                           value="${searchQuery}"
                           style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color, #ccc); font-size: 13px; box-sizing: border-box; background: var(--card-bg, #fff); color: var(--text-color, #222);">
                </div>

                <!-- Rekap Data Buah Cards Grid 2x2 -->
                <div id="containerBuahCards"></div>

                <!-- Kontrol Navigasi Paginasi -->
                <div id="paginationBuahControls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; margin-bottom: 20px; font-size: 12px;"></div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        // 1. KEMBALIKAN DRAF TERAKHIR DARI LOCALSTORAGE
        if (typeof restoreFormDraftGlobal === 'function') {
            restoreFormDraftGlobal('formBuah');
        }

        var form = document.getElementById('formBuah');
        var btnCancel = document.getElementById('btnCancelBuahEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('buahId');
                var gh = getVal('buahGh');
                var tanggal = getVal('buahTanggal');
                var talang = getVal('buahTalang');
                var petugas = getVal('buahPetugas');
                var tindakan = getVal('buahTindakan');
                var netting = getVal('buahNetting');
                var estBobot = parseFloat(getVal('buahEstBobot')) || 0;
                var afkir = parseFloat(getVal('buahAfkir')) || 0;
                var desc = getVal('buahDesc');

                var payload = {
                    gh: gh || '-',
                    tanggal: tanggal,
                    talang: talang || '-',
                    petugas: petugas || t('default_petugas'),
                    tindakan: tindakan || t('opt_act_monitor'),
                    netting: netting || t('opt_net_smooth'),
                    estBobot: estBobot,
                    afkir: afkir,
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
                            judul: 'Pemeliharaan Buah',
                            deskripsi: tindakan + ' di ' + (gh || 'GH') + ' (' + (talang || 'Talang') + ')',
                            tanggal: tanggal || now.toISOString().split('T')[0],
                            jam: timeStr,
                            kategori: 'Tanaman',
                            icon: 'fas fa-apple-alt',
                            color: '#E65100'
                        });
                    }

                    if (typeof Helper !== 'undefined' && Helper.showToast) {
                        Helper.showToast(t('toast_saved'), 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('buahId', '');
                var titleEl = document.getElementById('formTitleBuah');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('buahId', '');
                var titleEl = document.getElementById('formTitleBuah');
                if (titleEl) titleEl.innerText = t('form_title_add');
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerBuahCards');
        var pageEl = document.getElementById('paginationBuahControls');
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

        data.sort(function(a, b) {
            var dateA = a && a.tanggal ? new Date(a.tanggal) : new Date(0);
            var dateB = b && b.tanggal ? new Date(b.tanggal) : new Date(0);
            return dateB - dateA;
        });

        var filteredData = data.filter(function(item) {
            if (!searchQuery) return true;
            var kw = searchQuery.toLowerCase();
            var gh = (item.gh || '').toLowerCase();
            var tanggal = (item.tanggal || '').toLowerCase();
            var talang = (item.talang || '').toLowerCase();
            var petugas = (item.petugas || '').toLowerCase();
            var tindakan = (item.tindakan || '').toLowerCase();
            var netting = (item.netting || '').toLowerCase();
            var desc = (item.desc || '').toLowerCase();
            return gh.includes(kw) || tanggal.includes(kw) || talang.includes(kw) || petugas.includes(kw) || tindakan.includes(kw) || netting.includes(kw) || desc.includes(kw);
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

            var valGh = item.gh ? item.gh : '-';
            var valTalang = item.talang ? item.talang : '-';
            var valTindakan = item.tindakan ? item.tindakan : '-';
            var valNetting = item.netting ? item.netting : '-';
            var valBobot = item.estBobot ? item.estBobot : '-';
            var valAfkir = item.afkir ? item.afkir : 0;
            var valDesc = item.desc ? item.desc : '';

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: var(--text-color, #222);">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                        </div>
                        <span style="background: #FFF3E0; color: #E65100; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${valTindakan}</span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_loc_netting')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-th" style="color: #0277BD; width: 14px;"></i> <strong>${valTalang}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-braille" style="color: #E65100; width: 14px;"></i> <strong>${valNetting}</strong></div>
                            </div>
                        </div>

                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_weight_reject')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-weight" style="color: #2E7D32; width: 14px;"></i> <strong>${valBobot} ${t('unit_kg_fruit')}</strong></div>
                                <div style="margin-top: 3px; color: ${valAfkir > 0 ? '#C62828' : 'var(--text-color, #333)'};"><i class="fas fa-times-circle" style="color: #C62828; width: 14px;"></i> <strong>Afkir: ${valAfkir} ${t('unit_pcs')}</strong></div>
                            </div>
                        </div>

                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_petugas')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-user-check" style="color: #0288D1; width: 14px;"></i> <strong>${item.petugas || t('default_petugas')}</strong></div>
                            </div>
                        </div>

                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_stage')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: #2E7D32; line-height: 1.4;">
                                <div><i class="fas fa-seedling" style="color: #2E7D32; width: 14px;"></i> <strong>${t('val_fruit_enlargement')}</strong></div>
                            </div>
                        </div>
                    </div>

                    ${valDesc ? `<div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); background: var(--inner-card-bg, #fdfdfd); padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">${t('lbl_notes')}: ${valDesc}</div>` : ''}

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                        <span onclick="buah.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="buah.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        if (pageEl) {
            if (totalPages > 1) {
                pageEl.innerHTML = `
                    <button onclick="buah.changePage(-1)" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_prev')}
                    </button>
                    <span style="font-weight: bold; color: var(--text-color, #555);">
                        ${t('page_lbl')} ${currentPage} / ${totalPages} (${filteredData.length} ${t('unit_pcs')})
                    </span>
                    <button onclick="buah.changePage(1)" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
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

        setVal('buahId', item.id || '');
        setVal('buahGh', item.gh === '-' ? '' : (item.gh || ''));
        setVal('buahTanggal', item.tanggal || '');
        setVal('buahTalang', item.talang === '-' ? '' : (item.talang || ''));
        setVal('buahPetugas', item.petugas === t('default_petugas') ? '' : (item.petugas || ''));
        setVal('buahTindakan', item.tindakan || t('opt_act_hang'));
        setVal('buahNetting', item.netting || t('opt_net_smooth'));
        setVal('buahEstBobot', item.estBobot || '');
        setVal('buahAfkir', item.afkir || '');
        setVal('buahDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleBuah');
        if (titleEl) titleEl.innerText = t('form_title_edit');
        
        var btnCancel = document.getElementById('btnCancelBuahEdit');
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

window.buah = buah;
