// ==========================================
// COZYCS FARM - PLANT MODULE (FULL BILINGUAL & DARK MODE)
// ==========================================

var tanaman = (function() {

    // KAMUS TERJEMAHAN MODUL TANAMAN
    var i18nDict = {
        'id': {
            'module_title': 'Monitoring & Data Tanaman',
            'form_title': 'Catat Perkembangan Tanaman',
            'lbl_date': 'Tanggal Penginputan',
            'lbl_gh': 'ID GH',
            'select_gh': '-- Pilih Greenhouse --',
            'lbl_variety': 'Varietas',
            'ph_variety': 'Contoh: Intanon',
            'lbl_gutter': 'Talang',
            'ph_gutter': 'Contoh: 1',
            'lbl_hole': 'Lubang',
            'ph_hole': 'Contoh: 12',
            'lbl_sow_date': 'Tanggal Semai',
            'lbl_plant_date': 'Tanggal Tanam',
            'lbl_dap': 'HST (Hari Setelah Tanam)',
            'lbl_das': 'HSP (Hari Setelah Semai)',
            'lbl_plant_status': 'Status Tanaman',
            'opt_alive': 'Hidup',
            'opt_dead': 'Mati',
            'lbl_pollin_status': 'Status Polinasi',
            'opt_not_pollin': 'Belum Polinasi',
            'opt_pollin': 'Sudah Polinasi',
            'lbl_harvest_status': 'Status Panen',
            'opt_not_harvest': 'Belum Panen',
            'opt_harvested': 'Sudah Panen',
            'lbl_fruit_status': 'Status Buah',
            'opt_no_fruit': 'Belum Ada',
            'opt_has_fruit': 'Ada Buah',
            'lbl_notes': 'Catatan',
            'ph_notes': 'Catatan perkembangan tanaman...',
            'btn_save': 'Simpan Data Tanaman',
            'list_title': 'Daftar & Populasit Tanaman',
            'no_data': 'Belum ada data tanaman tercatat.'
        },
        'en': {
            'module_title': 'Plant Monitoring & Data',
            'form_title': 'Record Plant Growth',
            'lbl_date': 'Entry Date',
            'lbl_gh': 'GH ID',
            'select_gh': '-- Select Greenhouse --',
            'lbl_variety': 'Variety',
            'ph_variety': 'e.g., Intanon',
            'lbl_gutter': 'Gutter',
            'ph_gutter': 'e.g., 1',
            'lbl_hole': 'Hole',
            'ph_hole': 'e.g., 12',
            'lbl_sow_date': 'Sowing Date',
            'lbl_plant_date': 'Planting Date',
            'lbl_dap': 'DAP (Days After Planting)',
            'lbl_das': 'DAS (Days After Sowing)',
            'lbl_plant_status': 'Plant Status',
            'opt_alive': 'Alive',
            'opt_dead': 'Dead',
            'lbl_pollin_status': 'Pollination Status',
            'opt_not_pollin': 'Not Pollinated',
            'opt_pollin': 'Pollinated',
            'lbl_harvest_status': 'Harvest Status',
            'opt_not_harvest': 'Not Harvested',
            'opt_harvested': 'Harvested',
            'lbl_fruit_status': 'Fruit Status',
            'opt_no_fruit': 'None',
            'opt_has_fruit': 'Fruit Available',
            'lbl_notes': 'Notes',
            'ph_notes': 'Plant growth notes...',
            'btn_save': 'Save Plant Data',
            'list_title': 'Plant List & Population',
            'no_data': 'No plant records found.'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function render() {
        var todayStr = (typeof Helper !== 'undefined' && Helper.getTodayDate) ? Helper.getTodayDate() : new Date().toISOString().split('T')[0];
        var dataGh = (typeof Storage !== 'undefined' && Storage.getAll) ? Storage.getAll('cozycs_greenhouse') : [];

        var optionGhHtml = `<option value="">${t('select_gh')}</option>`;
        dataGh.forEach(function(g) {
            optionGhHtml += `<option value="${g.kode || g.id}">${g.kode} - ${g.nama || 'GH'}</option>`;
        });

        return `
            <div class="dashboard-container" style="padding-bottom: 40px;">
                
                <!-- HEADER MODUL -->
                <div style="font-size: 16px; font-weight: 800; color: var(--text-color, #111); margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-seedling" style="color: #2E7D32;"></i>
                    <span>${t('module_title')}</span>
                </div>

                <!-- FORM INPUT TANAMAN -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 16px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;">${t('form_title')}</div>
                    
                    <form id="formTanaman" onsubmit="tanaman.simpanData(event)">
                        
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 11px; font-weight: 700; color: #666; display: block; margin-bottom: 4px;">${t('lbl_date')}</label>
                            <input type="date" id="tglInputTanaman" value="${todayStr}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 13px;">
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 12px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #666; display: block; margin-bottom: 4px;">${t('lbl_gh')}</label>
                                <select id="ghTanaman" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 13px;">
                                    ${optionGhHtml}
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #666; display: block; margin-bottom: 4px;">${t('lbl_variety')}</label>
                                <input type="text" id="varietasTanaman" placeholder="${t('ph_variety')}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 13px;">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 12px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #666; display: block; margin-bottom: 4px;">${t('lbl_gutter')}</label>
                                <input type="number" id="talangTanaman" placeholder="${t('ph_gutter')}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 13px;">
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #666; display: block; margin-bottom: 4px;">${t('lbl_hole')}</label>
                                <input type="number" id="lubangTanaman" placeholder="${t('ph_hole')}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 13px;">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 12px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #666; display: block; margin-bottom: 4px;">${t('lbl_sow_date')}</label>
                                <input type="date" id="tglSemaiTanaman" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 13px;">
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #666; display: block; margin-bottom: 4px;">${t('lbl_plant_date')}</label>
                                <input type="date" id="tglTanamTanaman" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 13px;">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 12px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #666; display: block; margin-bottom: 4px;">${t('lbl_plant_status')}</label>
                                <select id="statusTanaman" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 13px;">
                                    <option value="Hidup">${t('opt_alive')}</option>
                                    <option value="Mati">${t('opt_dead')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #666; display: block; margin-bottom: 4px;">${t('lbl_pollin_status')}</label>
                                <select id="statusPolinasi" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 13px;">
                                    <option value="Belum Polinasi">${t('opt_not_pollin')}</option>
                                    <option value="Sudah Polinasi">${t('opt_pollin')}</option>
                                </select>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 12px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #666; display: block; margin-bottom: 4px;">${t('lbl_harvest_status')}</label>
                                <select id="statusPanen" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 13px;">
                                    <option value="Belum Panen">${t('opt_not_harvest')}</option>
                                    <option value="Sudah Panen">${t('opt_harvested')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #666; display: block; margin-bottom: 4px;">${t('lbl_fruit_status')}</label>
                                <select id="statusBuah" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 13px;">
                                    <option value="Belum Ada">${t('opt_no_fruit')}</option>
                                    <option value="Ada Buah">${t('opt_has_fruit')}</option>
                                </select>
                            </div>
                        </div>

                        <div style="margin-bottom: 16px;">
                            <label style="font-size: 11px; font-weight: 700; color: #666; display: block; margin-bottom: 4px;">${t('lbl_notes')}</label>
                            <textarea id="catatanTanaman" rows="2" placeholder="${t('ph_notes')}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 13px;"></textarea>
                        </div>

                        <button type="submit" style="width: 100%; padding: 12px; background: #2E7D32; color: #fff; border: none; border-radius: 10px; font-weight: 800; font-size: 13px; cursor: pointer;">
                            <i class="fas fa-save" style="margin-right: 6px;"></i> ${t('btn_save')}
                        </button>
                    </form>
                </div>

                <!-- DAFTAR TANAMAN -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 16px; border: 1px solid var(--border-color, #e8e8e8);">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;">${t('list_title')}</div>
                    <div id="listDataTanaman"></div>
                </div>

            </div>
        `;
    }

    function init() {
        loadDataTanaman();
    }

    function loadDataTanaman() {
        var el = document.getElementById('listDataTanaman');
        if (!el) return;

        var list = (typeof Storage !== 'undefined' && Storage.getAll) ? Storage.getAll('cozycs_tanaman') : [];

        if (list.length === 0) {
            el.innerHTML = `<div style="font-size: 12px; color: #888; text-align: center; padding: 16px 0;">${t('no_data')}</div>`;
            return;
        }

        var html = '';
        list.reverse().forEach(function(item, idx) {
            html += `
                <div style="padding: 10px; border-bottom: 1px solid var(--border-color, #eee); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 13px; font-weight: 800; color: var(--text-color, #222);">${item.varietas || 'Melon'} (${item.gh || 'GH'})</div>
                        <div style="font-size: 11px; color: #666;">Talang ${item.talang || '-'} / Lubang ${item.lubang || '-'} • Status: ${item.status || 'Hidup'}</div>
                    </div>
                </div>
            `;
        });
        el.innerHTML = html;
    }

    function simpanData(e) {
        e.preventDefault();
        var isEn = (localStorage.getItem('cozycs_lang') === 'en');

        var data = {
            id: Date.now(),
            tglInput: document.getElementById('tglInputTanaman').value,
            gh: document.getElementById('ghTanaman').value,
            varietas: document.getElementById('varietasTanaman').value,
            talang: document.getElementById('talangTanaman').value,
            lubang: document.getElementById('lubangTanaman').value,
            tglSemai: document.getElementById('tglSemaiTanaman').value,
            tglTanam: document.getElementById('tglTanamTanaman').value,
            status: document.getElementById('statusTanaman').value,
            polinasi: document.getElementById('statusPolinasi').value,
            panen: document.getElementById('statusPanen').value,
            buah: document.getElementById('statusBuah').value,
            catatan: document.getElementById('catatanTanaman').value
        };

        if (typeof Storage !== 'undefined' && Storage.save) {
            Storage.save('cozycs_tanaman', data);
        }

        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast(isEn ? 'Plant data saved successfully!' : 'Data tanaman berhasil disimpan!', 'success');
        }

        loadDataTanaman();
    }

    return {
        render: render,
        init: init,
        simpanData: simpanData
    };

})();

window.tanaman = tanaman;
