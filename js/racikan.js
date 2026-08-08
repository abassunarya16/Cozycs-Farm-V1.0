// ==========================================
// COZYCS FARM - MODUL KALKULATOR RACIKAN AB MIX
// (WITH REAL-TIME DRAFT AUTO-SAVE, CUSTOM MODAL & DATA PROTECTION)
// ==========================================

var racikan = (function() {

    var STORAGE_KEY_TEMPLATES = 'cozycs_racikan_templates';
    var STORAGE_KEY_DRAFT = 'cozycs_racikan_draft'; // Storage khusus draf input aktif
    var isProcessingStok = false;
    var pendingDeductItems = [];

    var LIST_PUPUK = [
        "CALNIT",
        "KNO3",
        "Fe EDDHA",
        "Mag-S",
        "MKP",
        "MAP",
        "SOP/ZK",
        "ZA",
        "FLEX-G",
        "VITAFLEX",
        "Lainnya"
    ];

    var state = {
        editingId: null,
        racikName: '',
        volStock: '',
        itemsA: [],
        itemsB: []
    };

    var i18nDict = {
        'id': {
            'module_title': 'Kalkulator Meracik AB Mix',
            'lbl_racik_name': 'Nama Racikan Nutrisi',
            'ph_racik_name': 'Contoh: Racikan Vegetatif 20 Liter',
            'lbl_vol_stock': 'Target Volume Pekatan (Liter)',
            'title_pekat_a': 'Komposisi Pekatan A',
            'title_pekat_b': 'Komposisi Pekatan B',
            'btn_add_a': '+ Tambah Bahan A',
            'btn_add_b': '+ Tambah Bahan B',
            'lbl_summary_title': 'Ringkasan Kebutuhan & Estimasi Biaya',
            'lbl_total_a': 'TOTAL BOBOT A',
            'lbl_total_b': 'TOTAL BOBOT B',
            'lbl_grand_total_cost': 'ESTIMASI TOTAL BIAYA RACIKAN:',
            'btn_save_template': 'Simpan Template Racikan',
            'btn_update_template': 'Perbarui Template Racikan',
            'btn_apply_gudang': 'Potong Stok Bahan dari Gudang',
            'title_saved_templates': 'Daftar Template Racikan Tersimpan',
            'no_templates': 'Belum ada template racikan yang tersimpan.',
            'toast_saved': 'Template racikan berhasil disimpan!',
            'toast_deleted': 'Template racikan berhasil dihapus.',
            'toast_applied': 'Stok bahan racikan berhasil dipotong dari Gudang!',
            'confirm_delete_tpl': 'Apakah kamu yakin ingin menghapus template racikan ini?'
        },
        'en': {
            'module_title': 'AB Mix Compounding Calculator',
            'lbl_racik_name': 'Nutrient Formula Name',
            'ph_racik_name': 'e.g., Vegetative Formula 20 Liters',
            'lbl_vol_stock': 'Target Concentrate Volume (Liters)',
            'title_pekat_a': 'Stock A Composition',
            'title_pekat_b': 'Stock B Composition',
            'btn_add_a': '+ Add Stock A Material',
            'btn_add_b': '+ Add Stock B Material',
            'lbl_summary_title': 'Requirement Summary & Estimated Cost',
            'lbl_total_a': 'TOTAL BOBOT A',
            'lbl_total_b': 'TOTAL BOBOT B',
            'lbl_grand_total_cost': 'ESTIMATED TOTAL COMPOUNDING COST:',
            'btn_save_template': 'Save Recipe Template',
            'btn_update_template': 'Update Recipe Template',
            'btn_apply_gudang': 'Deduct Raw Materials from Warehouse',
            'title_saved_templates': 'Saved Recipe Templates',
            'no_templates': 'No saved recipe templates found.',
            'toast_saved': 'Recipe template saved successfully!',
            'toast_deleted': 'Recipe template deleted successfully.',
            'toast_applied': 'Raw materials deducted from Warehouse successfully!',
            'confirm_delete_tpl': 'Are you sure you want to delete this recipe template?'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    // HELPER AUTO-SAVE DRAF OTOMATIS
    function saveDraftToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(state));
        } catch(e) {
            console.error('Gagal menyimpan draf racikan ke localStorage', e);
        }
    }

    function loadDraftFromStorage() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY_DRAFT);
            if (raw) {
                var parsed = JSON.parse(raw);
                state.editingId = parsed.editingId || null;
                state.racikName = parsed.racikName || '';
                state.volStock = parsed.volStock || '';
                state.itemsA = parsed.itemsA || [];
                state.itemsB = parsed.itemsB || [];
            }
        } catch(e) {
            console.error('Gagal memuat draf racikan dari localStorage', e);
        }
    }

    function clearDraftStorage() {
        try {
            localStorage.removeItem(STORAGE_KEY_DRAFT);
        } catch(e) {}
    }

    function getSavedTemplates() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY_TEMPLATES);
            return raw ? JSON.parse(raw) : [];
        } catch(e) {
            return [];
        }
    }

    function saveTemplatesToStorage(list) {
        try {
            localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(list));
        } catch(e) {
            console.error('Gagal menyimpan template ke localStorage', e);
        }
    }

    function render() {
        loadDraftFromStorage(); // Pastikan draf termuat saat HTML dibuat

        return `
            <div class="dashboard-container">
                <div class="section-title">
                    <i class="fas fa-calculator" style="color: #2E7D32;"></i> ${t('module_title')}
                </div>

                <!-- 1. FORM SETUP UTAMA -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="display: flex; flex-direction: column; gap: 14px;">
                        <div>
                            <label style="font-size: 12px; font-weight: 700; color: #2E7D32; display: block; margin-bottom: 6px;">${t('lbl_racik_name')}</label>
                            <input type="text" id="racikNamaTpl" value="${state.racikName}" placeholder="${t('ph_racik_name')}" oninput="racikan.updateRacikName(this.value)" style="width: 100%; height: 42px; padding: 10px 12px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; background: var(--card-bg, #fff); color: var(--text-color, #333); font-weight: 600; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="font-size: 12px; font-weight: 700; color: #2E7D32; display: block; margin-bottom: 6px;">${t('lbl_vol_stock')}</label>
                            <input type="number" id="racikVolStock" value="${state.volStock}" placeholder="Contoh: 20" oninput="racikan.changeVolume(this.value)" style="width: 100%; height: 42px; padding: 10px 12px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; background: var(--card-bg, #fff); color: var(--text-color, #333); font-weight: bold; box-sizing: border-box;">
                        </div>
                    </div>
                </div>

                <!-- 2. TABEL BAHAN PEKATAN A & B -->
                <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px;">
                    
                    <!-- PEKATAN A -->
                    <div style="background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); padding: 14px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="font-size: 14px; font-weight: 700; color: #C62828; display: flex; align-items: center; gap: 6px;">
                                <i class="fas fa-flask"></i> ${t('title_pekat_a')}
                            </div>
                            <button type="button" onclick="racikan.addItem('A')" style="background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
                                ${t('btn_add_a')}
                            </button>
                        </div>
                        <div id="containerPekatanA"></div>
                    </div>

                    <!-- PEKATAN B -->
                    <div style="background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); padding: 14px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="font-size: 14px; font-weight: 700; color: #0277BD; display: flex; align-items: center; gap: 6px;">
                                <i class="fas fa-flask"></i> ${t('title_pekat_b')}
                            </div>
                            <button type="button" onclick="racikan.addItem('B')" style="background: #E1F5FE; color: #0277BD; border: 1px solid #B3E5FC; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
                                ${t('btn_add_b')}
                            </button>
                        </div>
                        <div id="containerPekatanB"></div>
                    </div>
                </div>

                <!-- 3. RINGKASAN BIAYA & TOTAL RACIKAN -->
                <div style="background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); padding: 16px; margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-coins"></i> ${t('lbl_summary_title')}
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;" id="summaryCardsContainer">
                        <!-- Summary Cards -->
                    </div>

                    <div style="background: var(--inner-card-bg, #E8F5E9); border: 1px solid #A5D6A7; padding: 12px; border-radius: 8px; text-align: center; margin-bottom: 14px;">
                        <div style="font-size: 11px; font-weight: 700; color: #1B5E20; text-transform: uppercase;">${t('lbl_grand_total_cost')}</div>
                        <div id="grandTotalCostVal" style="font-size: 20px; font-weight: 800; color: #2E7D32; margin-top: 2px;">Rp0</div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button type="button" onclick="racikan.simpanTemplate()" id="btnSaveTemplate" style="width: 100%; background: #1565C0; color: #fff; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <i class="fas fa-save"></i> <span id="lblBtnSaveTpl">${state.editingId ? t('btn_update_template') : t('btn_save_template')}</span>
                        </button>
                        
                        <button type="button" id="btnPotongGudang" onclick="racikan.potongStokGudang()" style="width: 100%; background: #2E7D32; color: #fff; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <i class="fas fa-boxes"></i> ${t('btn_apply_gudang')}
                        </button>
                    </div>
                </div>

                <!-- 4. DAFTAR TEMPLATE RACIKAN TERSIMPAN -->
                <div style="background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); padding: 16px; margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-list-alt"></i> ${t('title_saved_templates')}
                    </div>

                    <div id="containerSavedTemplates">
                        <!-- Saved Templates List -->
                    </div>
                </div>

                <!-- 5. CUSTOM PROFESSIONAL MODAL POPUP -->
                <div id="racikConfirmModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 99999; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box; backdrop-filter: blur(3px);">
                    <div style="background: var(--card-bg, #fff); width: 100%; max-width: 420px; border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 1px solid var(--border-color, #eee);">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <div style="background: #E8F5E9; color: #2E7D32; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
                                <i class="fas fa-boxes"></i>
                            </div>
                            <div>
                                <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: var(--text-color, #222);">Konfirmasi Potong Stok</h3>
                                <div style="font-size: 11px; color: #777; margin-top: 2px;">Gudang Utama • Cozycs Farm</div>
                            </div>
                        </div>

                        <p style="font-size: 13px; color: var(--text-color, #444); margin-bottom: 12px; line-height: 1.4;">
                            Apakah kamu yakin ingin memotong stok gudang sesuai racikan ini?
                        </p>

                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 12px; border-radius: 10px; max-height: 220px; overflow-y: auto; font-size: 12px; color: var(--text-color, #333); margin-bottom: 16px; border: 1px solid var(--border-color, #eee);">
                            <div style="font-size: 11px; font-weight: 700; color: #2E7D32; margin-bottom: 8px; text-transform: uppercase;">Detail Bahan yang Akan Dipotong:</div>
                            <div id="racikModalItemList" style="display: flex; flex-direction: column; gap: 6px;"></div>
                        </div>

                        <div style="display: flex; gap: 10px;">
                            <button type="button" onclick="racikan.closeConfirmModal()" style="flex: 1; background: var(--inner-card-bg, #f0f0f0); color: var(--text-color, #444); border: 1px solid var(--border-color, #ccc); padding: 10px; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer;">
                                Batal
                            </button>
                            <button type="button" onclick="racikan.executePotongStok()" id="btnExecuteDeduct" style="flex: 1; background: #2E7D32; color: #fff; border: none; padding: 10px; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer;">
                                Ya, Potong Stok
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function init() {
        loadDraftFromStorage();

        var nameEl = document.getElementById('racikNamaTpl');
        if (nameEl) nameEl.value = state.racikName;

        var volEl = document.getElementById('racikVolStock');
        if (volEl) volEl.value = state.volStock;

        renderTables();
        renderSavedTemplatesList();
    }

    function updateRacikName(val) {
        state.racikName = val || '';
        saveDraftToStorage();
    }

    function changeVolume(val) {
        state.volStock = val;
        saveDraftToStorage();
        calculateSummary();
    }

    function addItem(group) {
        var defaultName = (group === 'A') ? "CALNIT" : "MKP";
        var newItem = {
            name: defaultName,
            amount: '',
            pricePerUnit: ''
        };
        if (group === 'A') state.itemsA.push(newItem);
        else state.itemsB.push(newItem);

        saveDraftToStorage();
        renderTables();
    }

    function removeItem(group, index) {
        if (group === 'A') state.itemsA.splice(index, 1);
        else state.itemsB.splice(index, 1);

        saveDraftToStorage();
        renderTables();
    }

    function updateItem(group, index, field, value) {
        var targetArr = (group === 'A') ? state.itemsA : state.itemsB;
        if (!targetArr[index]) return;

        if (field === 'amount' || field === 'pricePerUnit') {
            targetArr[index][field] = value === '' ? '' : parseFloat(value);
        } else {
            targetArr[index][field] = value;
        }

        saveDraftToStorage();

        var item = targetArr[index];
        var amt = parseFloat(item.amount) || 0;
        var price = parseFloat(item.pricePerUnit) || 0;
        var subtotal = (amt / 1000) * price;

        var subtotalEl = document.getElementById('subtotal_' + group + '_' + index);
        if (subtotalEl) {
            subtotalEl.innerText = 'Rp' + Math.round(subtotal).toLocaleString('id-ID');
        }

        calculateSummary();
    }

    function renderTables() {
        var containerA = document.getElementById('containerPekatanA');
        if (containerA) {
            containerA.innerHTML = buildTableHTML('A', state.itemsA);
        }

        var containerB = document.getElementById('containerPekatanB');
        if (containerB) {
            containerB.innerHTML = buildTableHTML('B', state.itemsB);
        }

        calculateSummary();
    }

    function buildTableHTML(group, items) {
        if (items.length === 0) {
            return `<div style="text-align: center; color: #888; font-size: 12px; padding: 14px; background: var(--inner-card-bg, #f9f9f9); border-radius: 8px; border: 1px dashed var(--border-color, #ccc);">Belum ada bahan di Pekatan ${group}. Klik tombol di atas untuk menambah.</div>`;
        }

        var html = `<div style="display: flex; flex-direction: column; gap: 8px;">`;

        items.forEach(function(item, idx) {
            var optionsPupuk = LIST_PUPUK.map(function(p) {
                var selected = (p === item.name) ? 'selected' : '';
                return `<option value="${p}" ${selected}>${p}</option>`;
            }).join('');

            var amt = parseFloat(item.amount) || 0;
            var price = parseFloat(item.pricePerUnit) || 0;
            var subtotal = (amt / 1000) * price;
            var subtotalFormatted = 'Rp' + Math.round(subtotal).toLocaleString('id-ID');

            html += `
                <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #eee); display: grid; grid-template-columns: 2.2fr 1.2fr 1.5fr 1.2fr 24px; gap: 6px; align-items: end;">
                    <div>
                        <label style="font-size: 10px; color: #777; font-weight: 600; display: block; margin-bottom: 3px;">Nama Pupuk</label>
                        <select onchange="racikan.updateItem('${group}', ${idx}, 'name', this.value)" style="width: 100%; padding: 7px 4px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; font-size: 11px; background: var(--card-bg, #fff); color: var(--text-color, #333); box-sizing: border-box;">
                            ${optionsPupuk}
                        </select>
                    </div>

                    <div>
                        <label style="font-size: 10px; color: #777; font-weight: 600; display: block; margin-bottom: 3px;">Berat (Gram)</label>
                        <input type="number" id="input_amount_${group}_${idx}" value="${item.amount}" placeholder="0" oninput="racikan.updateItem('${group}', ${idx}, 'amount', this.value)" style="width: 100%; padding: 7px 4px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; font-size: 11px; background: var(--card-bg, #fff); color: var(--text-color, #333); box-sizing: border-box;">
                    </div>

                    <div>
                        <label style="font-size: 10px; color: #777; font-weight: 600; display: block; margin-bottom: 3px;">Harga/Kg</label>
                        <input type="number" value="${item.pricePerUnit}" placeholder="0" oninput="racikan.updateItem('${group}', ${idx}, 'pricePerUnit', this.value)" style="width: 100%; padding: 7px 4px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; font-size: 11px; background: var(--card-bg, #fff); color: var(--text-color, #333); box-sizing: border-box;">
                    </div>

                    <div>
                        <label style="font-size: 10px; color: #777; font-weight: 600; display: block; margin-bottom: 3px;">Subtotal</label>
                        <div id="subtotal_${group}_${idx}" style="font-size: 11px; font-weight: 700; color: #2E7D32; padding: 7px 0; text-align: right; white-space: nowrap;">
                            ${subtotalFormatted}
                        </div>
                    </div>

                    <div style="text-align: center; padding-bottom: 6px;">
                        <i class="fas fa-trash-alt" onclick="racikan.removeItem('${group}', ${idx})" style="color: #C62828; cursor: pointer; font-size: 14px;" title="Hapus"></i>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        return html;
    }

    function calculateSummary() {
        var totalGramA = 0;
        var totalCostA = 0;
        state.itemsA.forEach(function(item) {
            var amt = parseFloat(item.amount) || 0;
            var price = parseFloat(item.pricePerUnit) || 0;
            totalGramA += amt;
            totalCostA += (amt / 1000) * price;
        });

        var totalGramB = 0;
        var totalCostB = 0;
        state.itemsB.forEach(function(item) {
            var amt = parseFloat(item.amount) || 0;
            var price = parseFloat(item.pricePerUnit) || 0;
            totalGramB += amt;
            totalCostB += (amt / 1000) * price;
        });

        var grandTotalCost = totalCostA + totalCostB;
        var formatRp = function(v) { return 'Rp' + Math.round(v).toLocaleString('id-ID'); };

        var summaryContainer = document.getElementById('summaryCardsContainer');
        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-color, #eee);">
                    <div style="font-size: 10px; font-weight: 700; color: #C62828; text-transform: uppercase;">${t('lbl_total_a')}</div>
                    <div style="font-size: 14px; font-weight: 800; color: var(--text-color, #222); margin-top: 2px;">${(totalGramA/1000).toFixed(2)} Kg <span style="font-size: 10px; color: #777;">(${totalGramA.toLocaleString('id-ID')} g)</span></div>
                    <div style="font-size: 11px; font-weight: 700; color: #C62828; margin-top: 4px;">Subtotal: ${formatRp(totalCostA)}</div>
                </div>
                <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-color, #eee);">
                    <div style="font-size: 10px; font-weight: 700; color: #0277BD; text-transform: uppercase;">${t('lbl_total_b')}</div>
                    <div style="font-size: 14px; font-weight: 800; color: var(--text-color, #222); margin-top: 2px;">${(totalGramB/1000).toFixed(2)} Kg <span style="font-size: 10px; color: #777;">(${totalGramB.toLocaleString('id-ID')} g)</span></div>
                    <div style="font-size: 11px; font-weight: 700; color: #0277BD; margin-top: 4px;">Subtotal: ${formatRp(totalCostB)}</div>
                </div>
            `;
        }

        var grandEl = document.getElementById('grandTotalCostVal');
        if (grandEl) {
            grandEl.innerText = formatRp(grandTotalCost);
        }
    }

    function simpanTemplate() {
        var nameInput = state.racikName.trim();
        if (!nameInput) {
            alert('Harap isi Nama Racikan Nutrisi terlebih dahulu.');
            return;
        }

        if (state.itemsA.length === 0 && state.itemsB.length === 0) {
            alert('Harap tambahkan setidaknya satu bahan pupuk pada Pekatan A atau B.');
            return;
        }

        var templates = getSavedTemplates();

        if (state.editingId) {
            var idx = templates.findIndex(function(t) { return t.id === state.editingId; });
            if (idx !== -1) {
                templates[idx].name = nameInput;
                templates[idx].volStock = state.volStock;
                templates[idx].itemsA = JSON.parse(JSON.stringify(state.itemsA));
                templates[idx].itemsB = JSON.parse(JSON.stringify(state.itemsB));
                templates[idx].updatedAt = new Date().toISOString().split('T')[0];
            }
        } else {
            var newTpl = {
                id: 'RACIK-' + Date.now(),
                name: nameInput,
                volStock: state.volStock,
                itemsA: JSON.parse(JSON.stringify(state.itemsA)),
                itemsB: JSON.parse(JSON.stringify(state.itemsB)),
                createdAt: new Date().toISOString().split('T')[0]
            };
            templates.unshift(newTpl);
        }

        saveTemplatesToStorage(templates);

        // CATAT LOG KE AKTIVITAS TERAKHIR DASBOR
        if (typeof Storage !== 'undefined' && Storage.add) {
            var keyAktivitas = (Storage.KEYS && Storage.KEYS.AKTIVITAS) ? Storage.KEYS.AKTIVITAS : 'cozycs_aktivitas';
            var now = new Date();
            var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            
            Storage.add(keyAktivitas, {
                judul: 'Menyimpan Racikan Nutrisi',
                deskripsi: 'Menyimpan template "' + nameInput + '" (' + (state.volStock || 0) + ' Liter)',
                tanggal: now.toISOString().split('T')[0],
                jam: timeStr,
                kategori: 'Nutrisi',
                icon: 'fas fa-calculator',
                color: '#2E7D32'
            });
        }

        if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
            Helper.showToast(t('toast_saved'), 'success');
        }

        resetForm();
        renderSavedTemplatesList();
    }

    function resetForm() {
        state.editingId = null;
        state.racikName = '';
        state.volStock = '';
        state.itemsA = [];
        state.itemsB = [];

        clearDraftStorage();

        var nameEl = document.getElementById('racikNamaTpl');
        if (nameEl) nameEl.value = '';

        var volEl = document.getElementById('racikVolStock');
        if (volEl) volEl.value = '';

        var lblBtn = document.getElementById('lblBtnSaveTpl');
        if (lblBtn) lblBtn.innerText = t('btn_save_template');

        renderTables();
    }

    function applyTemplate(id) {
        var templates = getSavedTemplates();
        var tpl = templates.find(function(item) { return item.id === id; });
        if (!tpl) return;

        state.editingId = null;
        state.racikName = tpl.name;
        state.volStock = tpl.volStock;
        state.itemsA = JSON.parse(JSON.stringify(tpl.itemsA || []));
        state.itemsB = JSON.parse(JSON.stringify(tpl.itemsB || []));

        saveDraftToStorage();

        var nameEl = document.getElementById('racikNamaTpl');
        if (nameEl) nameEl.value = state.racikName;

        var volEl = document.getElementById('racikVolStock');
        if (volEl) volEl.value = state.volStock;

        var lblBtn = document.getElementById('lblBtnSaveTpl');
        if (lblBtn) lblBtn.innerText = t('btn_save_template');

        renderTables();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function editTemplate(id) {
        var templates = getSavedTemplates();
        var tpl = templates.find(function(item) { return item.id === id; });
        if (!tpl) return;

        state.editingId = tpl.id;
        state.racikName = tpl.name;
        state.volStock = tpl.volStock;
        state.itemsA = JSON.parse(JSON.stringify(tpl.itemsA || []));
        state.itemsB = JSON.parse(JSON.stringify(tpl.itemsB || []));

        saveDraftToStorage();

        var nameEl = document.getElementById('racikNamaTpl');
        if (nameEl) nameEl.value = state.racikName;

        var volEl = document.getElementById('racikVolStock');
        if (volEl) volEl.value = state.volStock;

        var lblBtn = document.getElementById('lblBtnSaveTpl');
        if (lblBtn) lblBtn.innerText = t('btn_update_template');

        renderTables();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteTemplate(id) {
        if (confirm(t('confirm_delete_tpl'))) {
            var templates = getSavedTemplates();
            var filtered = templates.filter(function(item) { return item.id !== id; });
            saveTemplatesToStorage(filtered);

            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast(t('toast_deleted'), 'error');
            }

            renderSavedTemplatesList();
        }
    }

    function renderSavedTemplatesList() {
        var container = document.getElementById('containerSavedTemplates');
        if (!container) return;

        var templates = getSavedTemplates();

        if (templates.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #888; font-size: 12px; padding: 16px;">${t('no_templates')}</div>`;
            return;
        }

        var html = `<div style="display: flex; flex-direction: column; gap: 10px;">`;

        templates.forEach(function(tpl) {
            var totalGramA = 0, costA = 0;
            (tpl.itemsA || []).forEach(function(i) {
                var amt = parseFloat(i.amount) || 0;
                totalGramA += amt;
                costA += (amt / 1000) * (parseFloat(i.pricePerUnit) || 0);
            });

            var totalGramB = 0, costB = 0;
            (tpl.itemsB || []).forEach(function(i) {
                var amt = parseFloat(i.amount) || 0;
                totalGramB += amt;
                costB += (amt / 1000) * (parseFloat(i.pricePerUnit) || 0);
            });

            var grandTotal = costA + costB;

            html += `
                <div style="background: var(--inner-card-bg, #f9f9f9); padding: 12px; border-radius: 10px; border: 1px solid var(--border-color, #eee); display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                    <div>
                        <strong style="font-size: 14px; color: var(--text-color, #222);">${tpl.name}</strong>
                        <div style="font-size: 11px; color: #666; margin-top: 2px;">
                            Target Pekatan: <strong>${tpl.volStock || 0} Liter</strong> | Total Bobot: <strong>${((totalGramA + totalGramB)/1000).toFixed(2)} Kg</strong>
                        </div>
                        <div style="font-size: 12px; font-weight: 700; color: #2E7D32; margin-top: 4px;">
                            Estimasi Biaya: Rp${Math.round(grandTotal).toLocaleString('id-ID')}
                        </div>
                    </div>

                    <div style="display: flex; gap: 6px;">
                        <button type="button" onclick="racikan.applyTemplate('${tpl.id}')" style="background: #2E7D32; color: #fff; border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
                            Gunakan
                        </button>
                        <button type="button" onclick="racikan.editTemplate('${tpl.id}')" style="background: #1565C0; color: #fff; border: none; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button type="button" onclick="racikan.deleteTemplate('${tpl.id}')" style="background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    function potongStokGudang() {
        if (isProcessingStok) return;

        if (typeof gudang === 'undefined' || typeof gudang.potongStokOtomatis !== 'function') {
            alert('Modul Gudang belum terhubung.');
            return;
        }

        var validItems = [];
        var allItems = state.itemsA.concat(state.itemsB);

        allItems.forEach(function(item) {
            var amt = parseFloat(item.amount) || 0;
            if (amt > 0) {
                validItems.push({ name: item.name, gram: amt, kg: amt / 1000 });
            }
        });

        if (validItems.length === 0) {
            alert('Belum ada racikan bahan bernilai positif untuk dipotong.');
            return;
        }

        pendingDeductItems = validItems;

        var listContainer = document.getElementById('racikModalItemList');
        if (listContainer) {
            var listHtml = '';
            validItems.forEach(function(v) {
                listHtml += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed var(--border-color, #e0e0e0);">
                        <span style="font-weight: 600;">• ${v.name}</span>
                        <span style="font-weight: 700; color: #C62828;">${v.kg.toFixed(2)} Kg <span style="font-size: 10px; color: #777;">(${v.gram.toLocaleString('id-ID')} Gram)</span></span>
                    </div>
                `;
            });
            listContainer.innerHTML = listHtml;
        }

        var modal = document.getElementById('racikConfirmModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    function closeConfirmModal() {
        var modal = document.getElementById('racikConfirmModal');
        if (modal) {
            modal.style.display = 'none';
        }
        pendingDeductItems = [];
    }

    function executePotongStok() {
        if (isProcessingStok || pendingDeductItems.length === 0) return;

        isProcessingStok = true;
        var btnEl = document.getElementById('btnExecuteDeduct');
        if (btnEl) {
            btnEl.disabled = true;
            btnEl.innerText = 'Memproses...';
        }

        var count = 0;
        pendingDeductItems.forEach(function(item) {
            var success = gudang.potongStokOtomatis(item.name, item.kg, 'Kalkulator Racik AB Mix', 'Gudang Utama', 'Admin');
            if (success) count++;
        });

        closeConfirmModal();

        if (count > 0) {
            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast(t('toast_applied'), 'success');
            } else {
                alert(t('toast_applied'));
            }
        }

        setTimeout(function() {
            isProcessingStok = false;
            if (btnEl) {
                btnEl.disabled = false;
                btnEl.innerText = 'Ya, Potong Stok';
            }
        }, 1500);
    }

    return {
        render: render,
        init: init,
        updateRacikName: updateRacikName,
        changeVolume: changeVolume,
        addItem: addItem,
        removeItem: removeItem,
        updateItem: updateItem,
        simpanTemplate: simpanTemplate,
        applyTemplate: applyTemplate,
        editTemplate: editTemplate,
        deleteTemplate: deleteTemplate,
        potongStokGudang: potongStokGudang,
        closeConfirmModal: closeConfirmModal,
        executePotongStok: executePotongStok
    };

})();

window.racikan = racikan;
