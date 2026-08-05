// ==========================================
// COZYCS FARM - MODUL MONITORING HAMA & PENYAKIT (CRUD BILINGUAL & DARK MODE)
// ==========================================

var hama = (function() {

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Monitoring Hama & Penyakit',
            'form_title_add': 'Catat Temuan Hama / Penyakit',
            'form_title_edit': 'Edit Data Hama / Penyakit',
            'lbl_gh': 'ID GH',
            'select_gh': '-- Pilih Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Tanggal Pengecekan',
            'lbl_gutter': 'Posisi Talang / Baris',
            'ph_gutter': 'Contoh: Talang 3 - Baris B',
            'lbl_petugas': 'Penanggung Jawab',
            'ph_petugas': 'Contoh: Rizky',
            'default_petugas': 'Penanggung Jawab',
            'lbl_category': 'Kategori Gangguan',
            'opt_cat_pest': 'Hama (Serangga/Kutu)',
            'opt_cat_disease': 'Penyakit (Jamur/Bakteri/Virus)',
            'opt_cat_deficiency': 'Defisiensi Nutrisi',
            'opt_cat_physiological': 'Fisiologis (Cracking/Sunburn)',
            'lbl_name': 'Nama Hama / Gejala',
            'ph_name': 'Contoh: Thrips / Powdery Mildew',
            'lbl_severity': 'Tingkat Keparahan',
            'opt_sev_light': 'Ringan (Spot Lokal)',
            'opt_sev_medium': 'Sedang (Meluas Sederhana)',
            'opt_sev_heavy': 'Berat (Sangat Masif)',
            'lbl_affected_trees': 'Tanaman Terkena (Pohon)',
            'ph_affected_trees': 'Contoh: 5',
            'lbl_action': 'Rencana Tindakan Penanganan',
            'opt_act_spray': 'Spray Pestisida (Konek Modul Spray)',
            'opt_act_prune': 'Pruning / Buang Bagian Terserang',
            'opt_act_eradicate': 'Eradikasi / Cabut Pohon',
            'opt_act_nutrition': 'Penyesuaian Nutrisi / pH',
            'opt_act_observe': 'Observasi Lanjutan',
            'lbl_desc': 'Catatan Gejala & Keterangan',
            'ph_desc': 'Catatan warna daun, bercak putih, posisi di bawah daun, dll...',
            'btn_save': 'Simpan Catatan Hama',
            'btn_cancel': 'Batal',
            'recap_title': 'Riwayat Monitoring & Temuan Hama',
            'no_data': 'Belum ada temuan hama atau penyakit tercatat.',
            'card_lbl_finding_type': 'Temuan & Jenis',
            'card_lbl_loc_impact': 'Lokasi & Dampak',
            'card_lbl_action': 'Rencana Tindakan',
            'card_lbl_petugas': 'Penanggung Jawab',
            'unit_trees': 'Pohon',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Data temuan hama berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus data hama ini?',
            'toast_deleted': 'Data temuan hama berhasil dihapus'
        },
        'en': {
            'module_title': 'Pest & Disease Monitoring',
            'form_title_add': 'Record Pest / Disease Finding',
            'form_title_edit': 'Edit Pest / Disease Data',
            'lbl_gh': 'GH ID',
            'select_gh': '-- Select Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Check Date',
            'lbl_gutter': 'Gutter / Row Position',
            'ph_gutter': 'e.g., Gutter 3 - Row B',
            'lbl_petugas': 'Person in Charge',
            'ph_petugas': 'e.g., Rizky',
            'default_petugas': 'Person in Charge',
            'lbl_category': 'Disorder Category',
            'opt_cat_pest': 'Pests (Insects/Mites)',
            'opt_cat_disease': 'Diseases (Fungi/Bacteria/Viruses)',
            'opt_cat_deficiency': 'Nutrient Deficiency',
            'opt_cat_physiological': 'Physiological (Cracking/Sunburn)',
            'lbl_name': 'Pest Name / Symptom',
            'ph_name': 'e.g., Thrips / Powdery Mildew',
            'lbl_severity': 'Severity Level',
            'opt_sev_light': 'Light (Local Spot)',
            'opt_sev_medium': 'Moderate (Moderate Spread)',
            'opt_sev_heavy': 'Severe (Massive Spread)',
            'lbl_affected_trees': 'Affected Plants (Stems)',
            'ph_affected_trees': 'e.g., 5',
            'lbl_action': 'Action / Treatment Plan',
            'opt_act_spray': 'Pesticide Spray (Connect Spray Module)',
            'opt_act_prune': 'Prune / Remove Infected Parts',
            'opt_act_eradicate': 'Eradication / Uproot Plant',
            'opt_act_nutrition': 'Nutrient / pH Adjustment',
            'opt_act_observe': 'Further Observation',
            'lbl_desc': 'Symptom Notes & Description',
            'ph_desc': 'Notes on leaf color, white spots, underside leaf position, etc...',
            'btn_save': 'Save Pest Record',
            'btn_cancel': 'Cancel',
            'recap_title': 'Pest Finding & Monitoring History',
            'no_data': 'No pest or disease findings recorded yet.',
            'card_lbl_finding_type': 'Finding & Type',
            'card_lbl_loc_impact': 'Location & Impact',
            'card_lbl_action': 'Treatment Plan',
            'card_lbl_petugas': 'Person in Charge',
            'unit_trees': 'Trees',
            'lbl_notes': 'Notes',
            'toast_saved': 'Pest finding data saved successfully!',
            'confirm_delete': 'Are you sure you want to delete this pest data?',
            'toast_deleted': 'Pest finding data deleted successfully'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function getKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.HAMA) {
            return Storage.KEYS.HAMA;
        }
        return 'cozycs_hama';
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val;
    }

    // Fungsi untuk mengisi opsi dropdown ID GH dari data Greenhouse
    function populateGhDropdown() {
        var selectEl = document.getElementById('hamaGh');
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
                <div class="section-title"><i class="fas fa-bug" style="color: #D32F2F;"></i> ${t('module_title')}</div>
                
                <!-- Form Input Data Hama & Penyakit -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #D32F2F; margin-bottom: 12px;" id="formTitleHama">${t('form_title_add')}</div>
                    <form id="formHama">
                        <input type="hidden" id="hamaId">
                        
                        <!-- ID GH & Tanggal Pengecekan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gh')}</label>
                                <select id="hamaGh" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="">${t('select_gh')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date')}</label>
                                <input type="date" id="hamaTanggal" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Posisi Talang & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gutter')}</label>
                                <input type="text" id="hamaTalang" placeholder="${t('ph_gutter')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_petugas')}</label>
                                <input type="text" id="hamaPetugas" placeholder="${t('ph_petugas')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Kategori Masalah & Nama Hama/Penyakit -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_category')}</label>
                                <select id="hamaKategori" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Hama (Serangga/Kutu)">${t('opt_cat_pest')}</option>
                                    <option value="Penyakit (Jamur/Bakteri/Virus)">${t('opt_cat_disease')}</option>
                                    <option value="Defisiensi Nutrisi">${t('opt_cat_deficiency')}</option>
                                    <option value="Fisiologis (Cracking/Sunburn)">${t('opt_cat_physiological')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_name')}</label>
                                <input type="text" id="hamaNama" required placeholder="${t('ph_name')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Tingkat Keparahan & Jumlah Tanaman Terkena -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_severity')}</label>
                                <select id="hamaTingkat" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Ringan (Spot Lokal)">${t('opt_sev_light')}</option>
                                    <option value="Sedang (Meluas Sederhana)">${t('opt_sev_medium')}</option>
                                    <option value="Berat (Sangat Masif)">${t('opt_sev_heavy')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_affected_trees')}</label>
                                <input type="number" id="hamaJumlahPohon" placeholder="${t('ph_affected_trees')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Rencana Tindakan Penanganan -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_action')}</label>
                            <select id="hamaTindakan" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                <option value="Spray Pestisida (Konek Modul Spray)">${t('opt_act_spray')}</option>
                                <option value="Pruning / Buang Bagian Terserang">${t('opt_act_prune')}</option>
                                <option value="Eradikasi / Cabut Pohon">${t('opt_act_eradicate')}</option>
                                <option value="Penyesuaian Nutrisi / pH">${t('opt_act_nutrition')}</option>
                                <option value="Observasi Lanjutan">${t('opt_act_observe')}</option>
                            </select>
                        </div>

                        <!-- Catatan Gejala -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label>
                            <textarea id="hamaDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #D32F2F; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelHamaEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Hama Cards Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #D32F2F;"></i> ${t('recap_title')}</div>
                <div id="containerHamaCards"></div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        var form = document.getElementById('formHama');
        var btnCancel = document.getElementById('btnCancelHamaEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('hamaId');
                var gh = getVal('hamaGh');
                var tanggal = getVal('hamaTanggal');
                var talang = getVal('hamaTalang');
                var petugas = getVal('hamaPetugas');
                var kategori = getVal('hamaKategori');
                var nama = getVal('hamaNama');
                var tingkat = getVal('hamaTingkat');
                var jumlahPohon = parseFloat(getVal('hamaJumlahPohon')) || 0;
                var tindakan = getVal('hamaTindakan');
                var desc = getVal('hamaDesc');

                var payload = {
                    gh: gh || '-',
                    tanggal: tanggal,
                    talang: talang || '-',
                    petugas: petugas || t('default_petugas'),
                    kategori: kategori || t('opt_cat_pest'),
                    nama: nama || '-',
                    tingkat: tingkat || t('opt_sev_light'),
                    jumlahPohon: jumlahPohon,
                    tindakan: tindakan || t('opt_act_observe'),
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

                    if (typeof Helper !== 'undefined' && Helper.showToast) {
                        Helper.showToast(t('toast_saved'), 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('hamaId', '');
                var titleEl = document.getElementById('formTitleHama');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('hamaId', '');
                var titleEl = document.getElementById('formTitleHama');
                if (titleEl) titleEl.innerText = t('form_title_add');
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerHamaCards');
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
            return;
        }

        data.sort(function(a, b) {
            var dateA = a && a.tanggal ? new Date(a.tanggal) : new Date(0);
            var dateB = b && b.tanggal ? new Date(b.tanggal) : new Date(0);
            return dateB - dateA;
        });

        var html = '';
        data.forEach(function(item) {
            if (!item) return;

            var valGh = item.gh ? item.gh : '-';
            var valTalang = item.talang ? item.talang : '-';
            var valNama = item.nama ? item.nama : '-';
            var valKategori = item.kategori ? item.kategori : '-';
            var valTingkat = item.tingkat ? item.tingkat : t('opt_sev_light');
            var valPohon = item.jumlahPohon ? item.jumlahPohon : 0;
            var valTindakan = item.tindakan ? item.tindakan : '-';
            var valDesc = item.desc ? item.desc : '';

            // Warna badge berdasarkan tingkat keparahan
            var badgeBg = '#FFEBEE';
            var badgeColor = '#C62828';
            if (valTingkat.indexOf('Ringan') !== -1 || valTingkat.indexOf('Light') !== -1) {
                badgeBg = '#FFF3E0';
                badgeColor = '#E65100';
            } else if (valTingkat.indexOf('Sedang') !== -1 || valTingkat.indexOf('Moderate') !== -1) {
                badgeBg = '#FFF8E1';
                badgeColor = '#F57F17';
            }

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <!-- Header Card: Tanggal, ID GH & Nama Hama -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: var(--text-color, #222);">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                        </div>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${valTingkat}</span>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Hama & Kategori -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_finding_type')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-bug" style="color: #D32F2F; width: 14px;"></i> <strong>${valNama}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-tags" style="color: #6A1B9A; width: 14px;"></i> <strong>${valKategori}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Lokasi & Populasi Terkena -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_loc_impact')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-th" style="color: #0277BD; width: 14px;"></i> <strong>${valTalang}</strong></div>
                                <div style="margin-top: 3px; color: #C62828;"><i class="fas fa-exclamation-triangle" style="color: #C62828; width: 14px;"></i> <strong>${valPohon} ${t('unit_trees')}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Rencana Penanganan -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_action')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: #2E7D32; line-height: 1.4;">
                                <div><i class="fas fa-tools" style="color: #2E7D32; width: 14px;"></i> <strong>${valTindakan}</strong></div>
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
                        <span onclick="hama.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="hama.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
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

        setVal('hamaId', item.id || '');
        setVal('hamaGh', item.gh === '-' ? '' : (item.gh || ''));
        setVal('hamaTanggal', item.tanggal || '');
        setVal('hamaTalang', item.talang === '-' ? '' : (item.talang || ''));
        setVal('hamaPetugas', item.petugas === t('default_petugas') ? '' : (item.petugas || ''));
        setVal('hamaKategori', item.kategori || t('opt_cat_pest'));
        setVal('hamaNama', item.nama === '-' ? '' : (item.nama || ''));
        setVal('hamaTingkat', item.tingkat || t('opt_sev_light'));
        setVal('hamaJumlahPohon', item.jumlahPohon || '');
        setVal('hamaTindakan', item.tindakan || t('opt_act_spray'));
        setVal('hamaDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleHama');
        if (titleEl) titleEl.innerText = t('form_title_edit');
        
        var btnCancel = document.getElementById('btnCancelHamaEdit');
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

    return {
        render: render,
        init: init,
        editItem: editItem,
        deleteItem: deleteItem
    };

})();

window.hama = hama;
