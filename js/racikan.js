// ==========================================
// COZYCS FARM - MODUL KALKULATOR RACIKAN AB MIX 3.0
// (BERDASARKAN SPREADSHEET MENGHITUNG RACIKAN AB MIX BUAH)
// ==========================================

var racikan = (function() {

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Kalkulator Racik AB Mix Buah 3.0',
            'lbl_preset': 'Preset Fase Tanaman Melon',
            'lbl_vol_stock': 'Volume Pekatan Stok A & B (Liter)',
            'lbl_vol_tandon': 'Volume Air Tandon / Aplikasi (Liter)',
            'lbl_target_ppm': 'Target PPM Nutrisi',
            'preset_custom': '-- Custom / Manual --',
            'preset_veg': 'Fase Vegetatif (800 - 1000 PPM)',
            'preset_polinasi': 'Fase Polinasi & Pembentukan Buah (1200 - 1400 PPM)',
            'preset_pembesaran': 'Fase Pembesaran Buah (1500 - 1800 PPM)',
            'preset_ripening': 'Fase Pematangan / Manis (1800 - 2200 PPM)',
            'title_pekat_a': 'Bahan Pekatan A (Terlarut)',
            'title_pekat_b': 'Bahan Pekatan B (Terlarut)',
            'title_ppm_breakdown': 'Rincian Hasil PPM Unsur Nutrisi',
            'col_bahan': 'Nama Bahan Baku',
            'col_gram': 'Berat (Gram)',
            'col_ppm_elem': 'Unsur',
            'col_ppm_val': 'Nilai PPM',
            'btn_apply_gudang': 'Potong Stok Gudang Otomatis',
            'toast_applied': 'Stok bahan racikan berhasil dipotong dari Gudang!'
        },
        'en': {
            'module_title': 'AB Mix Fruit Calculator 3.0',
            'lbl_preset': 'Melon Crop Stage Preset',
            'lbl_vol_stock': 'Stock A & B Volume (Liters)',
            'lbl_vol_tandon': 'Mixing Tank Volume (Liters)',
            'lbl_target_ppm': 'Target PPM',
            'preset_custom': '-- Custom / Manual --',
            'preset_veg': 'Vegetative Stage (800 - 1000 PPM)',
            'preset_polinasi': 'Pollination & Fruit Set (1200 - 1400 PPM)',
            'preset_pembesaran': 'Fruit Swelling Stage (1500 - 1800 PPM)',
            'preset_ripening': 'Ripening / Sweetening (1800 - 2200 PPM)',
            'title_pekat_a': 'Stock A Raw Materials',
            'title_pekat_b': 'Stock B Raw Materials',
            'title_ppm_breakdown': 'Nutrient PPM Breakdown',
            'col_bahan': 'Material Name',
            'col_gram': 'Weight (Grams)',
            'col_ppm_elem': 'Element',
            'col_ppm_val': 'PPM Value',
            'btn_apply_gudang': 'Auto-Deduct Warehouse Stock',
            'toast_applied': 'Raw materials deducted from Warehouse successfully!'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    // BASE FORMULA CONSTANTS (FORMULA STANDARD FOR 20L CONCENTRATE / 1000L WATER AT ~1400 PPM)
    var BASE_FORMULA = {
        volStockBase: 20,     // 20 Liter
        volTandonBase: 1000,  // 1000 Liter
        basePPM: 1400,
        pekatA: [
            { id: 'calsinit', name: 'Kalsium Nitrat (Calsinit / CaNO3)', baseGram: 1100, ratioPPM: { 'Ca': 210, 'N-NO3': 155 } },
            { id: 'kno3_a', name: 'Kalium Nitrat (KNO3) - Pekatan A', baseGram: 350, ratioPPM: { 'K': 150, 'N-NO3': 48 } },
            { id: 'fe_edta', name: 'Fe EDTA / Fe DTPA (Besi Chelated)', baseGram: 40, ratioPPM: { 'Fe': 5 } }
        ],
        pekatB: [
            { id: 'mkp', name: 'MKP (Mono Kalium Phosphate)', baseGram: 300, ratioPPM: { 'P': 150, 'K': 100 } },
            { id: 'kno3_b', name: 'Kalium Nitrat (KNO3) - Pekatan B', baseGram: 450, ratioPPM: { 'K': 195, 'N-NO3': 60 } },
            { id: 'k2so4', name: 'Kalium Sulfat (K2SO4)', baseGram: 250, ratioPPM: { 'K': 110, 'S': 45 } },
            { id: 'mgso4', name: 'Magnesium Sulfat (MgSO4 / Garam Inggris)', baseGram: 650, ratioPPM: { 'Mg': 65, 'S': 85 } },
            { id: 'mikro_mix', name: 'Librel / Mikro Mix (Mn, B, Zn, Cu, Mo)', baseGram: 35, ratioPPM: { 'Mikro': 8 } }
        ]
    };

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title">
                    <i class="fas fa-calculator" style="color: #2E7D32;"></i> ${t('module_title')}
                </div>

                <!-- 1. INPUT PARAMETER FORM -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <!-- Preset Selection -->
                    <div style="margin-bottom: 12px;">
                        <label style="font-size: 12px; font-weight: 700; color: #2E7D32;">${t('lbl_preset')}</label>
                        <select id="racikPreset" onchange="racikan.applyPreset(this.value)" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333); font-weight: 600;">
                            <option value="custom">${t('preset_custom')}</option>
                            <option value="900">${t('preset_veg')}</option>
                            <option value="1300" selected>${t('preset_polinasi')}</option>
                            <option value="1650">${t('preset_pembesaran')}</option>
                            <option value="1950">${t('preset_ripening')}</option>
                        </select>
                    </div>

                    <!-- Grid Input Variable -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                        <div>
                            <label style="font-size: 11px; font-weight: 600; color: #555;">${t('lbl_vol_stock')}</label>
                            <input type="number" id="racikVolStock" value="20" oninput="racikan.calculate()" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                        </div>
                        <div>
                            <label style="font-size: 11px; font-weight: 600; color: #555;">${t('lbl_vol_tandon')}</label>
                            <input type="number" id="racikVolTandon" value="1000" oninput="racikan.calculate()" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                        </div>
                        <div>
                            <label style="font-size: 11px; font-weight: 600; color: #555;">${t('lbl_target_ppm')}</label>
                            <input type="number" id="racikTargetPPM" value="1300" oninput="racikan.calculate()" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333); font-weight: bold; color: #2E7D32;">
                        </div>
                    </div>
                </div>

                <!-- 2. HASIL GRAMASI PEKATAN A & PEKATAN B -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                    <!-- PEKATAN A -->
                    <div style="background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); padding: 14px;">
                        <div style="font-size: 13px; font-weight: 700; color: #C62828; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-flask"></i> ${t('title_pekat_a')}
                        </div>
                        <div id="tablePekatanA"></div>
                    </div>

                    <!-- PEKATAN B -->
                    <div style="background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); padding: 14px;">
                        <div style="font-size: 13px; font-weight: 700; color: #0277BD; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-flask"></i> ${t('title_pekat_b')}
                        </div>
                        <div id="tablePekatanB"></div>
                    </div>
                </div>

                <!-- 3. RINCIAN ESTIMASI PPM UNSUR -->
                <div style="background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); padding: 16px; margin-bottom: 20px;">
                    <div style="font-size: 13px; font-weight: 700; color: #2E7D32; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-chart-pie"></i> ${t('title_ppm_breakdown')}
                    </div>
                    <div id="tablePPMBreakdown"></div>
                </div>

                <!-- 4. TOMBOL POTONG STOK GUDANG OTOMATIS -->
                <button type="button" onclick="racikan.potongStokGudang()" style="width: 100%; background: #2E7D32; color: #fff; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-boxes"></i> ${t('btn_apply_gudang')}
                </button>
            </div>
        `;
    }

    function init() {
        calculate();
    }

    function applyPreset(val) {
        if (val !== 'custom') {
            var targetEl = document.getElementById('racikTargetPPM');
            if (targetEl) targetEl.value = val;
            calculate();
        }
    }

    function calculate() {
        var volStock = parseFloat(document.getElementById('racikVolStock')?.value) || 20;
        var volTandon = parseFloat(document.getElementById('racikVolTandon')?.value) || 1000;
        var targetPPM = parseFloat(document.getElementById('racikTargetPPM')?.value) || 1300;

        // MULTIPLIER SCALING FACTOR
        var scaleFactor = (volStock / BASE_FORMULA.volStockBase) * (targetPPM / BASE_FORMULA.basePPM);

        // CALC PEKATAN A
        var htmlA = `<table style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee; text-align: left; color: #777;">
                <th style="padding: 6px 0;">${t('col_bahan')}</th>
                <th style="padding: 6px 0; text-align: right;">${t('col_gram')}</th>
            </tr>`;
        
        var totalGramA = 0;
        var calculatedItemsA = [];

        BASE_FORMULA.pekatA.forEach(function(item) {
            var gram = Math.round(item.baseGram * scaleFactor);
            totalGramA += gram;
            calculatedItemsA.push({ name: item.name, gram: gram });

            htmlA += `
                <tr style="border-bottom: 1px dashed #f0f0f0;">
                    <td style="padding: 8px 0; color: var(--text-color, #333); font-weight: 600;">${item.name}</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #C62828;">${gram.toLocaleString('id-ID')} g</td>
                </tr>
            `;
        });

        htmlA += `
            <tr style="font-weight: bold; background: var(--inner-card-bg, #f9f9f9);">
                <td style="padding: 8px 6px; color: var(--text-color, #222);">TOTAL STOK A</td>
                <td style="padding: 8px 6px; text-align: right; color: #C62828; font-size: 13px;">${totalGramA.toLocaleString('id-ID')} g (${(totalGramA/1000).toFixed(2)} Kg)</td>
            </tr>
        </table>`;

        var elA = document.getElementById('tablePekatanA');
        if (elA) elA.innerHTML = htmlA;

        // CALC PEKATAN B
        var htmlB = `<table style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee; text-align: left; color: #777;">
                <th style="padding: 6px 0;">${t('col_bahan')}</th>
                <th style="padding: 6px 0; text-align: right;">${t('col_gram')}</th>
            </tr>`;
        
        var totalGramB = 0;
        var calculatedItemsB = [];

        BASE_FORMULA.pekatB.forEach(function(item) {
            var gram = Math.round(item.baseGram * scaleFactor);
            totalGramB += gram;
            calculatedItemsB.push({ name: item.name, gram: gram });

            htmlB += `
                <tr style="border-bottom: 1px dashed #f0f0f0;">
                    <td style="padding: 8px 0; color: var(--text-color, #333); font-weight: 600;">${item.name}</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0277BD;">${gram.toLocaleString('id-ID')} g</td>
                </tr>
            `;
        });

        htmlB += `
            <tr style="font-weight: bold; background: var(--inner-card-bg, #f9f9f9);">
                <td style="padding: 8px 6px; color: var(--text-color, #222);">TOTAL STOK B</td>
                <td style="padding: 8px 6px; text-align: right; color: #0277BD; font-size: 13px;">${totalGramB.toLocaleString('id-ID')} g (${(totalGramB/1000).toFixed(2)} Kg)</td>
            </tr>
        </table>`;

        var elB = document.getElementById('tablePekatanB');
        if (elB) elB.innerHTML = htmlB;

        // PPM BREAKDOWN
        var ppmRatioFactor = (targetPPM / BASE_FORMULA.basePPM);
        var ppmMap = {
            'N-Nitrat (N-NO3)': Math.round(263 * ppmRatioFactor),
            'Kalium (K)': Math.round(555 * ppmRatioFactor),
            'Kalsium (Ca)': Math.round(210 * ppmRatioFactor),
            'Fosfat (P)': Math.round(150 * ppmRatioFactor),
            'Magnesium (Mg)': Math.round(65 * ppmRatioFactor),
            'Sulfur (S)': Math.round(130 * ppmRatioFactor),
            'Besi (Fe)': Math.round(5 * ppmRatioFactor),
            'Unsur Mikro (Trace)': Math.round(8 * ppmRatioFactor)
        };

        var htmlPPM = `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">`;
        for (var elem in ppmMap) {
            htmlPPM += `
                <div style="background: var(--inner-card-bg, #f9f9f9); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color, #eee); display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                    <span style="color: #555; font-weight: 600;">${elem}</span>
                    <strong style="color: #2E7D32;">${ppmMap[elem]} PPM</strong>
                </div>
            `;
        }
        htmlPPM += `</div>`;

        var elPPM = document.getElementById('tablePPMBreakdown');
        if (elPPM) elPPM.innerHTML = htmlPPM;

        window.lastRacikanData = {
            itemsA: calculatedItemsA,
            itemsB: calculatedItemsB
        };
    }

    function potongStokGudang() {
        if (!window.lastRacikanData || typeof gudang === 'undefined' || typeof gudang.potongStokOtomatis !== 'function') {
            alert('Modul Gudang belum siap atau fungsi pemotongan stok belum terhubung.');
            return;
        }

        var allItems = window.lastRacikanData.itemsA.concat(window.lastRacikanData.itemsB);
        var countSuccess = 0;

        allItems.forEach(function(item) {
            var kg = item.gram / 1000;
            var success = gudang.potongStokOtomatis(item.name, kg, 'Kalkulator Racik AB Mix', 'Gudang Utama', 'Admin');
            if (success) countSuccess++;
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
        applyPreset: applyPreset,
        calculate: calculate,
        potongStokGudang: potongStokGudang
    };

})();

window.racikan = racikan;
