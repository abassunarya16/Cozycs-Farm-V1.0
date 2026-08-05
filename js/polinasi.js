// ==========================================
// COZYCS FARM - MODUL POLINASI & SELEKSI BUAH (CRUD BILINGUAL & DARK MODE)
// ==========================================

var polinasi = (function() {

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Monitoring Polinasi & Perkawinan Bunga',
            'form_title_add': 'Catat Aktivitas Polinasi Baru',
            'form_title_edit': 'Edit Data Polinasi',
            'lbl_gh': 'ID GH',
            'select_gh': '-- Pilih Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Tanggal Polinasi',
            'lbl_gutter': 'Posisi Talang / Baris',
            'ph_gutter': 'Contoh: Talang 1 - 6',
            'lbl_petugas': 'Penanggung Jawab',
            'ph_petugas': 'Contoh: Rizky',
            'default_petugas': 'Penanggung Jawab',
            'lbl_count_pollinated': 'Bunga Dipolinasi (Butir)',
            'ph_count_pollinated': 'Contoh: 200',
            'lbl_count_successful': 'Buah Jadi / Pentil (Butir)',
            'ph_count_successful': 'Contoh: 180 (Diisi saat H+5)',
            'lbl_method': 'Metode Polinasi',
            'opt_method_male': 'Manual (Bunga Jantan)',
            'opt_method_brush': 'Manual (Kuas / Cottonbud)',
            'opt_method_insect': 'Serangga / Lebah',
            'opt_method_serum': 'Serum',
            'lbl_target_fruit': 'Target Dipelihara / Pohon',
            'opt_target_1': '1 Buah / Pohon',
            'opt_target_2': '2 Buah / Pohon',
            'lbl_desc': 'Catatan Tambahan',
            'ph_desc': 'Catatan kondisi bunga, cuaca saat polinasi, dll...',
            'btn_save': 'Simpan Data Polinasi',
            'btn_cancel': 'Batal',
            'recap_title': 'Riwayat & Evaluasi Polinasi',
            'no_data': 'Belum ada catatan polinasi tercatat.',
            'not_calculated': 'Belum Dihitung',
            'success_rate': '% Sukses',
            'card_lbl_loc_total': 'Lokasi & Total',
            'card_lbl_fruit_target': 'Buah Jadi & Target',
            'card_lbl_est_harvest': 'Est. Panen (+50 HSP)',
            'card_lbl_petugas': 'Penanggung Jawab',
            'unit_flower': 'Bunga',
            'unit_fruit_let': 'Pentil',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Data polinasi berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus data polinasi ini?',
            'toast_deleted': 'Data polinasi berhasil dihapus'
        },
        'en': {
            'module_title': 'Pollination & Flower Mating Monitoring',
            'form_title_add': 'Record New Pollination Activity',
            'form_title_edit': 'Edit Pollination Data',
            'lbl_gh': 'GH ID',
            'select_gh': '-- Select Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Pollination Date',
            'lbl_gutter': 'Gutter / Row Position',
            'ph_gutter': 'e.g., Gutter 1 - 6',
            'lbl_petugas': 'Person in Charge',
            'ph_petugas': 'e.g., Rizky',
            'default_petugas': 'Person in Charge',
            'lbl_count_pollinated': 'Pollinated Flowers (Units)',
            'ph_count_pollinated': 'e.g., 200',
            'lbl_count_successful': 'Successful Fruitlets (Units)',
            'ph_count_successful': 'e.g., 180 (Filled at Day+5)',
            'lbl_method': 'Pollination Method',
            'opt_method_male': 'Manual (Male Flower)',
            'opt_method_brush': 'Manual (Brush / Cotton Swab)',
            'opt_method_insect': 'Insect / Bees',
            'opt_method_serum': 'Serum',
            'lbl_target_fruit': 'Target Retained / Tree',
            'opt_target_1': '1 Fruit / Tree',
            'opt_target_2': '2 Fruits / Tree',
            'lbl_desc': 'Additional Notes',
            'ph_desc': 'Notes on flower condition, weather during pollination, etc...',
            'btn_save': 'Save Pollination Data',
            'btn_cancel': 'Cancel',
            'recap_title': 'Pollination History & Evaluation',
            'no_data': 'No pollination records found.',
            'not_calculated': 'Not Calculated',
            'success_rate': '% Success',
            'card_lbl_loc_total': 'Location & Total',
            'card_lbl_fruit_target': 'Successful Fruit & Target',
            'card_lbl_est_harvest': 'Est. Harvest (+50 DAS)',
            'card_lbl_petugas': 'Person in Charge',
            'unit_flower': 'Flowers',
            'unit_fruit_let': 'Fruitlets',
            'lbl_notes': 'Notes',
            'toast_saved': 'Pollination data saved successfully!',
            'confirm_delete': 'Are you sure you want to delete this pollination data?',
            'toast_deleted': 'Pollination data deleted successfully'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function getKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.POLINASI) {
            return Storage.KEYS.POLINASI;
        }
        return 'cozycs_polinasi';
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
        var selectEl = document.getElementById('polinasiGh');
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
                <div class="section-title"><i class="fas fa-microscope" style="color: #C2185B;"></i> ${t('module_title')}</div>
                
                <!-- Form Input Data Polinasi -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #C2185B; margin-bottom: 12px;" id="formTitlePolinasi">${t('form_title_add')}</div>
                    <form id="formPolinasi">
                        <input type="hidden" id="polinasiId">
                        
                        <!-- ID GH & Tanggal Polinasi -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gh')}</label>
                                <select id="polinasiGh" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="">${t('select_gh')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date')}</label>
                                <input type="date" id="polinasiTanggal" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Talang / Baris & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gutter')}</label>
                                <input type="text" id="polinasiTalang" placeholder="${t('ph_gutter')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_petugas')}</label>
                                <input type="text" id="polinasiPetugas" placeholder="${t('ph_petugas')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Jumlah Bunga Dipolinasi & Buah Jadi (Pentil) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_count_pollinated')}</label>
                                <input type="number" id="polinasiJumlah" required placeholder="${t('ph_count_pollinated')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_count_successful')}</label>
                                <input type="number" id="polinasiBerhasil" placeholder="${t('ph_count_successful')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Metode Polinasi (Termasuk Serum) & Target Buah / Pohon -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_method')}</label>
                                <select id="polinasiMetode" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Manual (Bunga Jantan)">${t('opt_method_male')}</option>
                                    <option value="Manual (Kuas / Cottonbud)">${t('opt_method_brush')}</option>
                                    <option value="Serangga / Lebah">${t('opt_method_insect')}</option>
                                    <option value="Serum">${t('opt_method_serum')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_target_fruit')}</label>
                                <select id="polinasiTargetPohon" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="1 Buah / Pohon">${t('opt_target_1')}</option>
                                    <option value="2 Buah / Pohon">${t('opt_target_2')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label>
                            <textarea id="polinasiDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #C2185B; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelPolinasiEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Polinasi Cards Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #C2185B;"></i> ${t('recap_title')}</div>
                <div id="containerPolinasiCards"></div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        var form = document.getElementById('formPolinasi');
        var btnCancel = document.getElementById('btnCancelPolinasiEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('polinasiId');
                var gh = getVal('polinasiGh');
                var tanggal = getVal('polinasiTanggal');
                var talang = getVal('polinasiTalang');
                var petugas = getVal('polinasiPetugas');
                var jumlah = parseFloat(getVal('polinasiJumlah')) || 0;
                var berhasil = parseFloat(getVal('polinasiBerhasil')) || 0;
                var metode = getVal('polinasiMetode');
                var targetPohon = getVal('polinasiTargetPohon');
                var desc = getVal('polinasiDesc');

                // Hitung Estimasi Panen (+50 hari dari polinasi)
                var expPanen = '-';
                if (tanggal) {
                    var d = new Date(tanggal);
                    d.setDate(d.getDate() + 50);
                    expPanen = d.toISOString().split('T')[0];
                }

                var payload = {
                    gh: gh || '-',
                    tanggal: tanggal,
                    talang: talang || '-',
                    petugas: petugas || t('default_petugas'),
                    jumlah: jumlah,
                    berhasil: berhasil,
                    metode: metode || t('opt_method_male'),
                    targetPohon: targetPohon || t('opt_target_1'),
                    estimasiPanen: expPanen,
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
                setVal('polinasiId', '');
                var titleEl = document.getElementById('formTitlePolinasi');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('polinasiId', '');
                var titleEl = document.getElementById('formTitlePolinasi');
                if (titleEl) titleEl.innerText = t('form_title_add');
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerPolinasiCards');
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
            var valJumlah = item.jumlah ? item.jumlah : 0;
            var valBerhasil = item.berhasil ? item.berhasil : 0;
            var valDesc = item.desc ? item.desc : '';

            // Hitung Presentase Keberhasilan (%)
            var rateText = t('not_calculated');
            var rateColor = '#777';
            if (valJumlah > 0 && item.berhasil !== undefined && item.berhasil !== '') {
                var rate = Math.round((valBerhasil / valJumlah) * 100);
                rateText = rate + t('success_rate');
                rateColor = rate >= 80 ? '#2E7D32' : (rate >= 50 ? '#E65100' : '#C62828');
            }

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <!-- Header Card: Tanggal, ID GH & Rate -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: var(--text-color, #222);">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                        </div>
                        <span style="background: #FCE4EC; color: ${rateColor}; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${rateText}</span>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Lokasi & Jumlah Polinasi -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_loc_total')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-th" style="color: #E65100; width: 14px;"></i> <strong>${valTalang}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-seedling" style="color: #C2185B; width: 14px;"></i> <strong>${valJumlah} ${t('unit_flower')}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Buah Jadi & Target -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_fruit_target')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-check-circle" style="color: #2E7D32; width: 14px;"></i> <strong>${valBerhasil} ${t('unit_fruit_let')}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-bullseye" style="color: #0277BD; width: 14px;"></i> <strong>${item.targetPohon || t('opt_target_1')}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Estimasi Panen -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_est_harvest')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: #2E7D32; line-height: 1.4;">
                                <div><i class="fas fa-calendar-alt" style="color: #2E7D32; width: 14px;"></i> <strong>${item.estimasiPanen || '-'}</strong></div>
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
                        <span onclick="polinasi.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="polinasi.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
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

        setVal('polinasiId', item.id || '');
        setVal('polinasiGh', item.gh === '-' ? '' : (item.gh || ''));
        setVal('polinasiTanggal', item.tanggal || '');
        setVal('polinasiTalang', item.talang === '-' ? '' : (item.talang || ''));
        setVal('polinasiPetugas', item.petugas === t('default_petugas') ? '' : (item.petugas || ''));
        setVal('polinasiJumlah', item.jumlah || '');
        setVal('polinasiBerhasil', item.berhasil || '');
        setVal('polinasiMetode', item.metode || t('opt_method_male'));
        setVal('polinasiTargetPohon', item.targetPohon || t('opt_target_1'));
        setVal('polinasiDesc', item.desc || '');

        var titleEl = document.getElementById('formTitlePolinasi');
        if (titleEl) titleEl.innerText = t('form_title_edit');
        
        var btnCancel = document.getElementById('btnCancelPolinasiEdit');
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

window.polinasi = polinasi;
