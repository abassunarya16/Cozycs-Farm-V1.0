// ==========================================
// COZYCS FARM - MODUL KALKULATOR RACIKAN AB MIX
// (FITUR CUSTOM BAHAN, DUAL FASE VEGETATIF/GENERATIF & ESTIMASI HARGA)
// ==========================================

var racikan = (function() {

    // DAFTAR PILIHAN PUPUK UMUM HIKROPONIK
    var LIST_PUPUK = [
        "Kalsium Nitrat (Calsinit)",
        "Kalium Nitrat (KNO3) Pekatan A",
        "Kalium Nitrat (KNO3) Pekatan B",
        "MKP (Mono Kalium Phosphate)",
        "Kalium Sulfat (K2SO4)",
        "Magnesium Sulfat (MgSO4)",
        "Fe EDTA / Besi Chelate",
        "Librel / Mikro Mix Trace",
        "Amonium Nitrat",
        "Asam Borat (Boron)",
        "Zinc Sulfat (ZnSO4)",
        "Mangan Sulfat (MnSO4)",
        "Cuprum Sulfat (CuSO4)",
        "Lainnya (Custom)"
    ];

    // DATA PRESET DEFAULT RACIKAN (UNTUK 20 LITER PEKATAN)
    var PRESETS = {
        'veg': {
            name: 'Fase Vegetatif',
            pekatA: [
                { name: 'Kalsium Nitrat (Calsinit)', amount: 1100, unit: 'Gram', pricePerUnit: 25000 },
                { name: 'Kalium Nitrat (KNO3) Pekatan A', amount: 350, unit: 'Gram', pricePerUnit: 45000 },
                { name: 'Fe EDTA / Besi Chelate', amount: 40, unit: 'Gram', pricePerUnit: 150000 }
            ],
            pekatB: [
                { name: 'MKP (Mono Kalium Phosphate)', amount: 300, unit: 'Gram', pricePerUnit: 55000 },
                { name: 'Kalium Nitrat (KNO3) Pekatan B', amount: 450, unit: 'Gram', pricePerUnit: 45000 },
                { name: 'Kalium Sulfat (K2SO4)', amount: 250, unit: 'Gram', pricePerUnit: 35000 },
                { name: 'Magnesium Sulfat (MgSO4)', amount: 650, unit: 'Gram', pricePerUnit: 15000 },
                { name: 'Librel / Mikro Mix Trace', amount: 35, unit: 'Gram', pricePerUnit: 120000 }
            ]
        },
        'gen': {
            name: 'Fase Generatif',
            pekatA: [
                { name: 'Kalsium Nitrat (Calsinit)', amount: 1200, unit: 'Gram', pricePerUnit: 25000 },
                { name: 'Kalium Nitrat (KNO3) Pekatan A', amount: 500, unit: 'Gram', pricePerUnit: 45000 },
                { name: 'Fe EDTA / Besi Chelate', amount: 50, unit: 'Gram', pricePerUnit: 150000 }
            ],
            pekatB: [
                { name: 'MKP (Mono Kalium Phosphate)', amount: 400, unit: 'Gram', pricePerUnit: 55000 },
                { name: 'Kalium Nitrat (KNO3) Pekatan B', amount: 600, unit: 'Gram', pricePerUnit: 45000 },
                { name: 'Kalium Sulfat (K2SO4)', amount: 350, unit: 'Gram', pricePerUnit: 35000 },
                { name: 'Magnesium Sulfat (MgSO4)', amount: 750, unit: 'Gram', pricePerUnit: 15000 },
                { name: 'Librel / Mikro Mix Trace', amount: 40, unit: 'Gram', pricePerUnit: 120000 }
            ]
        }
    };

    // STATE KARTU BANTU RACIKAN CURRENT
    var state = {
        volStock: 20,
        currentPreset: 'veg',
        itemsA: JSON.parse(JSON.stringify(PRESETS['veg'].pekatA)),
        itemsB: JSON.parse(JSON.stringify(PRESETS['veg'].pekatB))
    };

    // KAMUS TERJEMAHAN DUAL BAHASA
    var i18nDict = {
        'id': {
            'module_title': 'Kalkulator Meracik AB Mix',
            'lbl_preset': 'Pilih Preset Fase Tanaman',
            'lbl_vol_stock': 'Target Volume Pekatan (Liter)',
            'preset_veg': '🌱 Fase Vegetatif (Pertumbuhan)',
            'preset_gen': '🍈 Fase Generatif (Pembentukan & Pembesaran Buah)',
            'preset_custom': '⚙ Custom / Manual Input',
            'title_pekat_a': 'Komposisi Pekatan A',
            'title_pekat_b': 'Komposisi Pekatan B',
            'btn_add_a': '+ Tambah Bahan A',
            'btn_add_b': '+ Tambah Bahan B',
            'lbl_summary_title': 'Ringkasan Kebutuhan & Estimasi Biaya Racikan',
            'lbl_total_a': 'Total Berat Stok A:',
            'lbl_total_b': 'Total Berat Stok B:',
            'lbl_cost_a': 'Biaya Bahan Stok A:',
            'lbl_cost_b': 'Biaya Bahan Stok B:',
            'lbl_grand_total_cost': 'ESTIMASI TOTAL BIAYA RACIKAN:',
            'btn_apply_gudang': 'Potong Stok Bahan dari Gudang',
            'toast_applied': 'Stok bahan racikan berhasil dipotong dari Gudang!'
        },
        'en': {
            'module_title': 'AB Mix Fertilizer Compounding Calculator',
            'lbl_preset': 'Crop Stage Preset',
            'lbl_vol_stock': 'Target Concentrate Volume (Liters)',
            'preset_veg': '🌱 Vegetative Stage (Growth)',
            'preset_gen': '🍈 Generative Stage (Fruiting & Bulking)',
            'preset_custom': '⚙ Custom / Manual Input',
            'title_pekat_a': 'Stock A Composition',
            'title_pekat_b': 'Stock B Composition',
            'btn_add_a': '+ Add Stock A Material',
            'btn_add_b': '+ Add Stock B Material',
            'lbl_summary_title': 'Requirement Summary & Estimated Cost',
            'lbl_total_a': 'Total Weight Stock A:',
            'lbl_total_b': 'Total Weight Stock B:',
            'lbl_cost_a': 'Stock A Raw Material Cost:',
            'lbl_cost_b': 'Stock B Raw Material Cost:',
            'lbl_grand_total_cost': 'ESTIMATED TOTAL COMPOUNDING COST:',
            'btn_apply_gudang': 'Deduct Raw Materials from Warehouse',
            'toast_applied': 'Raw materials deducted from Warehouse successfully!'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title">
                    <i class="fas fa-calculator" style="color: #2E7D32;"></i> ${t('module_title')}
                </div>

                <!-- 1. FORM SETUP UTAMA -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div>
                            <label style="font-size: 12px; font-weight: 700; color: #2E7D32;">${t('lbl_preset')}</label>
                            <select id="racikPreset" onchange="racikan.changePreset(this.value)" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333); font-weight: 600;">
                                <option value="veg">${t('preset_veg')}</option>
                                <option value="gen">${t('preset_gen')}</option>
                                <option value="custom">${t('preset_custom')}</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size: 12px; font-weight: 700; color: #2E7D32;">${t('lbl_vol_stock')}</label>
                            <input type="number" id="racikVolStock" value="${state.volStock}" oninput="racikan.changeVolume(this.value)" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333); font-weight: bold;">
                        </div>
                    </div>
                </div>

                <!-- 2. TABEL BANYAK BAHAN PEKATAN A & B -->
                <div style="display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 20px;">
                    
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
                        <!-- Summary Cards dynamically updated -->
                    </div>

                    <div style="background: var(--inner-card-bg, #E8F5E9); border: 1px solid #A5D6A7; padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 11px; font-weight: 700; color: #1B5E20; text-transform: uppercase;">${t('lbl_grand_total_cost')}</div>
                        <div id="grandTotalCostVal" style="font-size: 20px; font-weight: 800; color: #2E7D32; margin-top: 2px;">Rp0</div>
                    </div>
                </div>

                <!-- 4. TOMBOL POTONG STOK GUDANG OTOMATIS -->
                <button type="button" onclick="racikan.potongStokGudang()" style="width: 100%; background: #2E7D32; color: #fff; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-boxes"></i> ${t('btn_apply_gudang')}
                </button>
            </div>
        `;
    }

    function init() {
        renderTables();
    }

    function changePreset(presetKey) {
        state.currentPreset = presetKey;
        if (presetKey !== 'custom' && PRESETS[presetKey]) {
            state.itemsA = JSON.parse(JSON.stringify(PRESETS[presetKey].pekatA));
            state.itemsB = JSON.parse(JSON.stringify(PRESETS[presetKey].pekatB));
        }
        renderTables();
    }

    function changeVolume(val) {
        var newVol = parseFloat(val) || 0;
        if (newVol > 0 && state.volStock > 0 && state.currentPreset !== 'custom') {
            var ratio = newVol / state.volStock;
            
            state.itemsA.forEach(function(item) {
                item.amount = Math.round(item.amount * ratio);
            });
            state.itemsB.forEach(function(item) {
                item.amount = Math.round(item.amount * ratio);
            });
        }
        state.volStock = newVol;
        renderTables();
    }

    function addItem(group) {
        var newItem = {
            name: LIST_PUPUK[0],
            amount: 100,
            unit: 'Gram',
            pricePerUnit: 25000
        };
        if (group === 'A') state.itemsA.push(newItem);
        else state.itemsB.push(newItem);

        state.currentPreset = 'custom';
        var selEl = document.getElementById('racikPreset');
        if (selEl) selEl.value = 'custom';

        renderTables();
    }

    function removeItem(group, index) {
        if (group === 'A') state.itemsA.splice(index, 1);
        else state.itemsB.splice(index, 1);

        state.currentPreset = 'custom';
        var selEl = document.getElementById('racikPreset');
        if (selEl) selEl.value = 'custom';

        renderTables();
    }

    function updateItem(group, index, field, value) {
        var targetArr = (group === 'A') ? state.itemsA : state.itemsB;
        if (!targetArr[index]) return;

        if (field === 'amount' || field === 'pricePerUnit') {
            targetArr[index][field] = parseFloat(value) || 0;
        } else {
            targetArr[index][field] = value;
        }

        state.currentPreset = 'custom';
        var selEl = document.getElementById('racikPreset');
        if (selEl) selEl.value = 'custom';

        renderTables();
    }

    function renderTables() {
        // RENDER TABLE A
        var containerA = document.getElementById('containerPekatanA');
        if (containerA) {
            containerA.innerHTML = buildTableHTML('A', state.itemsA);
        }

        // RENDER TABLE B
        var containerB = document.getElementById('containerPekatanB');
        if (containerB) {
            containerB.innerHTML = buildTableHTML('B', state.itemsB);
        }

        // RECALCULATE SUMMARY
        calculateSummary();
    }

    function buildTableHTML(group, items) {
        if (items.length === 0) {
            return `<div style="text-align: center; color: #888; font-size: 12px; padding: 12px;">Belum ada bahan di Pekatan ${group}.</div>`;
        }

        var html = `<div style="display: flex; flex-direction: column; gap: 8px;">`;

        items.forEach(function(item, idx) {
            var optionsPupuk = LIST_PUPUK.map(function(p) {
                var selected = (p === item.name) ? 'selected' : '';
                return `<option value="${p}" ${selected}>${p}</option>`;
            }).join('');

            // Subtotal biaya per item
            var gramVal = (item.unit === 'Kg') ? (item.amount * 1000) : item.amount;
            var subtotal = (gramVal / 1000) * item.pricePerUnit;

            html += `
                <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #eee); display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 24px; gap: 6px; align-items: center;">
                    <!-- Nama Bahan -->
                    <div>
                        <label style="font-size: 10px; color: #777; font-weight: 600;">Nama Pupuk</label>
                        <select onchange="racikan.updateItem('${group}', ${idx}, 'name', this.value)" style="width: 100%; padding: 6px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; font-size: 11px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            ${optionsPupuk}
                        </select>
                    </div>

                    <!-- Jumlah/Berat -->
                    <div>
                        <label style="font-size: 10px; color: #777; font-weight: 600;">Berat</label>
                        <input type="number" value="${item.amount}" oninput="racikan.updateItem('${group}', ${idx}, 'amount', this.value)" style="width: 100%; padding: 6px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; font-size: 11px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                    </div>

                    <!-- Satuan -->
                    <div>
                        <label style="font-size: 10px; color: #777; font-weight: 600;">Satuan</label>
                        <select onchange="racikan.updateItem('${group}', ${idx}, 'unit', this.value)" style="width: 100%; padding: 6px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; font-size: 11px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            <option value="Gram" ${item.unit === 'Gram' ? 'selected' : ''}>Gram</option>
                            <option value="Kg" ${item.unit === 'Kg' ? 'selected' : ''}>Kg</option>
                        </select>
                    </div>

                    <!-- Harga / Kg (Rp) -->
                    <div>
                        <label style="font-size: 10px; color: #777; font-weight: 600;">Harga/Kg (Rp)</label>
                        <input type="number" value="${item.pricePerUnit}" oninput="racikan.updateItem('${group}', ${idx}, 'pricePerUnit', this.value)" style="width: 100%; padding: 6px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; font-size: 11px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                    </div>

                    <!-- Tombol Hapus -->
                    <div style="text-align: center; margin-top: 12px;">
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
            var g = (item.unit === 'Kg') ? (item.amount * 1000) : item.amount;
            totalGramA += g;
            totalCostA += (g / 1000) * item.pricePerUnit;
        });

        var totalGramB = 0;
        var totalCostB = 0;
        state.itemsB.forEach(function(item) {
            var g = (item.unit === 'Kg') ? (item.amount * 1000) : item.amount;
            totalGramB += g;
            totalCostB += (g / 1000) * item.pricePerUnit;
        });

        var grandTotalCost = totalCostA + totalCostB;

        var formatRp = function(v) { return 'Rp' + Math.round(v).toLocaleString('id-ID'); };

        var summaryContainer = document.getElementById('summaryCardsContainer');
        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #eee);">
                    <div style="font-size: 10px; font-weight: 700; color: #C62828;">TOTAL BOHOT A</div>
                    <div style="font-size: 14px; font-weight: 800; color: var(--text-color, #222);">${(totalGramA/1000).toFixed(2)} Kg <span style="font-size: 10px; color: #777;">(${totalGramA.toLocaleString('id-ID')} g)</span></div>
                    <div style="font-size: 11px; font-weight: 700; color: #C62828; margin-top: 4px;">Subtotal: ${formatRp(totalCostA)}</div>
                </div>
                <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #eee);">
                    <div style="font-size: 10px; font-weight: 700; color: #0277BD;">TOTAL BOBOT B</div>
                    <div style="font-size: 14px; font-weight: 800; color: var(--text-color, #222);">${(totalGramB/1000).toFixed(2)} Kg <span style="font-size: 10px; color: #777;">(${totalGramB.toLocaleString('id-ID')} g)</span></div>
                    <div style="font-size: 11px; font-weight: 700; color: #0277BD; margin-top: 4px;">Subtotal: ${formatRp(totalCostB)}</div>
                </div>
            `;
        }

        var grandEl = document.getElementById('grandTotalCostVal');
        if (grandEl) {
            grandEl.innerText = formatRp(grandTotalCost);
        }
    }

    function potongStokGudang() {
        if (typeof gudang === 'undefined' || typeof gudang.potongStokOtomatis !== 'function') {
            alert('Modul Gudang belum terhubung.');
            return;
        }

        var allItems = state.itemsA.concat(state.itemsB);
        if (allItems.length === 0) {
            alert('Belum ada racikan bahan untuk dipotong.');
            return;
        }

        allItems.forEach(function(item) {
            var kg = (item.unit === 'Kg') ? item.amount : (item.amount / 1000);
            gudang.potongStokOtomatis(item.name, kg, 'Kalkulator Racik AB Mix', 'Gudang Utama', 'Admin');
        });

        if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
            Helper.showToast(t('toast_applied'), 'success');
        } else {
            alert(t('toast_applied'));
        }
    }

    return {
        render: render,
        init: init,
        changePreset: changePreset,
        changeVolume: changeVolume,
        addItem: addItem,
        removeItem: removeItem,
        updateItem: updateItem,
        potongStokGudang: potongStokGudang
    };

})();

window.racikan = racikan;
