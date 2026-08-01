// ==========================================
// COZYCS FARM - MODUL NUTRISI & PPM (CRUD)
// ==========================================

var nutrisi = (function() {

    // Fungsi pembantu untuk mengambil kunci storage dengan aman
    function getKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.NUTRISI) {
            return Storage.KEYS.NUTRISI;
        }
        return 'cozycs_nutrisi';
    }

    // Fungsi pembantu pembaca nilai elemen aman
    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    // Fungsi pembantu pengisi nilai elemen aman
    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val;
    }

    // Fungsi untuk mengisi opsi dropdown ID GH dari data Greenhouse
    function populateGhDropdown() {
        var selectEl = document.getElementById('nutrisiGh');
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

        var optionsHtml = '<option value="">-- Pilih Greenhouse --</option>';
        if (Array.isArray(dataGh) && dataGh.length > 0) {
            dataGh.forEach(function(gh) {
                if (gh && gh.kode) {
                    optionsHtml += `<option value="${gh.kode}">${gh.kode} - ${gh.nama || 'GH'}</option>`;
                }
            });
        } else {
            optionsHtml += '<option value="GH-01">GH-01 (Default)</option>';
        }

        selectEl.innerHTML = optionsHtml;
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-tint" style="color: #0277BD;"></i> Cek & Kontrol Nutrisi (PPM & pH)</div>
                
                <!-- Form Input Data Nutrisi -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #0277BD; margin-bottom: 12px;" id="formTitleNutrisi">Catat Cek Nutrisi Harian</div>
                    <form id="formNutrisi">
                        <input type="hidden" id="nutrisiId">
                        
                        <!-- ID GH (Dropdown Konek ke Modul Greenhouse) & Tanggal Cek -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">ID GH</label>
                                <select id="nutrisiGh" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="">-- Pilih Greenhouse --</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Pengecekan</label>
                                <input type="date" id="nutrisiDate" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Waktu Cek -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Waktu Cek</label>
                            <select id="nutrisiTimeSlot" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                <option value="Pagi">Pagi</option>
                                <option value="Sore">Sore</option>
                            </select>
                        </div>

                        <!-- HST & Fase Tanaman -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">HST</label>
                                <input type="number" id="nutrisiHst" placeholder="Contoh: 15" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Fase Tanaman</label>
                                <select id="nutrisiFase" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Vegetatif Awal">Vegetatif Awal</option>
                                    <option value="Vegetatif Pertumbuhan">Vegetatif Pertumbuhan</option>
                                    <option value="Pembungaan / Polinasi">Pembungaan / Polinasi</option>
                                    <option value="Pembesaran Buah">Pembesaran Buah</option>
                                    <option value="Pematangan Buah">Pematangan Buah</option>
                                </select>
                            </div>
                        </div>

                        <!-- PPM Aktual & Target PPM -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">PPM Aktual</label>
                                <input type="number" id="nutrisiPpm" required placeholder="Contoh: 1000" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Target PPM</label>
                                <input type="number" id="nutrisiTargetPpm" required placeholder="Contoh: 1200" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- pH Aktual & Aksi Koreksi pH -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">pH Aktual</label>
                                <input type="text" id="nutrisiPh" required placeholder="Contoh: 6.5" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Aksi Koreksi pH</label>
                                <select id="nutrisiPhAction" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Aman / Tanpa Koreksi">Aman / Tanpa Koreksi</option>
                                    <option value="Tambah pH Up">Tambah pH Up</option>
                                    <option value="Tambah pH Down">Tambah pH Down</option>
                                </select>
                            </div>
                        </div>

                        <!-- Suhu Air & Suhu Ruangan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Suhu Air Tandon (°C)</label>
                                <input type="text" id="nutrisiWaterTemp" placeholder="Contoh: 26°C" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Suhu Ruangan (°C)</label>
                                <input type="text" id="nutrisiRoomTemp" placeholder="Contoh: 30°C" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan Tambahan</label>
                            <textarea id="nutrisiDesc" rows="2" placeholder="Catatan penambahan A/B mix, air baku, dll..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #0277BD; color: #fff; padding: 10px; border: none; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> Simpan Catatan Nutrisi</button>
                            <button type="button" id="btnCancelNutrisiEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Card Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #0277BD;"></i> Riwayat & Rekap Kontrol Nutrisi</div>
                <div id="containerNutrisiCards"></div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        var form = document.getElementById('formNutrisi');
        var btnCancel = document.getElementById('btnCancelNutrisiEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('nutrisiId');
                var gh = getVal('nutrisiGh');
                var date = getVal('nutrisiDate');
                var timeSlot = getVal('nutrisiTimeSlot');
                var hst = getVal('nutrisiHst');
                var fase = getVal('nutrisiFase');
                var ppm = getVal('nutrisiPpm');
                var targetPpm = getVal('nutrisiTargetPpm');
                var ph = getVal('nutrisiPh');
                var phAction = getVal('nutrisiPhAction');
                var waterTemp = getVal('nutrisiWaterTemp');
                var roomTemp = getVal('nutrisiRoomTemp');
                var desc = getVal('nutrisiDesc');

                var payload = {
                    gh: gh || '-',
                    date: date,
                    timeSlot: timeSlot || 'Pagi',
                    hst: hst || '-',
                    fase: fase || 'Vegetatif Pertumbuhan',
                    ppm: ppm || '-',
                    targetPpm: targetPpm || '-',
                    ph: ph || '-',
                    phAction: phAction || 'Aman / Tanpa Koreksi',
                    waterTemp: waterTemp || '-',
                    roomTemp: roomTemp || '-',
                    desc: desc,
                    title: 'GH: ' + (gh || '-') + ' | PPM: ' + ppm + ' | pH: ' + ph
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
                        Helper.showToast('Data berhasil disimpan!', 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('nutrisiId', '');
                var titleEl = document.getElementById('formTitleNutrisi');
                if (titleEl) titleEl.innerText = 'Catat Cek Nutrisi Harian';
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('nutrisiId', '');
                var titleEl = document.getElementById('formTitleNutrisi');
                if (titleEl) titleEl.innerText = 'Catat Cek Nutrisi Harian';
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerNutrisiCards');
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
            container.innerHTML = '<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada catatan nutrisi tercatat.</div>';
            return;
        }

        data.sort(function(a, b) {
            var dateA = a && a.date ? new Date(a.date) : new Date(0);
            var dateB = b && b.date ? new Date(b.date) : new Date(0);
            return dateB - dateA;
        });

        var html = '';
        data.forEach(function(item) {
            if (!item) return;

            var valGh = item.gh ? item.gh : '-';
            var valHst = item.hst ? item.hst : '-';
            var valFase = item.fase ? item.fase : '-';
            var valPpm = item.ppm ? item.ppm : '-';
            var valTargetPpm = item.targetPpm ? item.targetPpm : '-';
            var valPh = item.ph ? item.ph : '-';
            var valPhAction = item.phAction ? item.phAction : '-';
            var valWater = item.waterTemp ? item.waterTemp : '-';
            var valRoom = item.roomTemp ? item.roomTemp : (item.ghTemp ? item.ghTemp : '-');
            var valDesc = item.desc ? item.desc : '';

            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card: Tanggal, ID GH & Waktu -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${item.date || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                            <span style="background: #E1F5FE; color: #0277BD; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 4px;">${item.timeSlot || 'Pagi'}</span>
                        </div>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Kiri Atas: PPM -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">PPM</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-water" style="color: #0277BD; width: 14px;"></i> <strong>${valPpm} PPM</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-bullseye" style="color: #388E3C; width: 14px;"></i> <strong>Target: ${valTargetPpm}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Kanan Atas: pH & Koreksi -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">pH & Koreksi</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-vial" style="color: #E65100; width: 14px;"></i> <strong>pH ${valPh}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-tools" style="color: #C62828; width: 14px;"></i> <strong>${valPhAction}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Kiri Bawah: HST & Fase -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">HST & Fase</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-calendar-day" style="color: #6A1B9A; width: 14px;"></i> <strong>HST ${valHst}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-leaf" style="color: #2E7D32; width: 14px;"></i> <strong>${valFase}</strong></div>
                            </div>
                        </div>

                       <!-- 4. Kanan Bawah: Suhu Air & Ruangan -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Suhu Air & Ruangan</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-thermometer-half" style="color: #0288D1; width: 14px;"></i> <strong>Air: ${valWater}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-home" style="color: #F57F17; width: 14px;"></i> <strong>Ruang: ${valRoom}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan -->
                    ${valDesc ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${valDesc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #eee; padding-top: 8px; margin-top: 4px;">
                        <span onclick="nutrisi.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="nutrisi.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
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

        setVal('nutrisiId', item.id || '');
        setVal('nutrisiGh', item.gh === '-' ? '' : (item.gh || ''));
        setVal('nutrisiDate', item.date || '');
        setVal('nutrisiTimeSlot', item.timeSlot || 'Pagi');
        setVal('nutrisiHst', item.hst === '-' ? '' : (item.hst || ''));
        setVal('nutrisiFase', item.fase || 'Vegetatif Pertumbuhan');
        setVal('nutrisiPpm', item.ppm === '-' ? '' : (item.ppm || ''));
        setVal('nutrisiTargetPpm', item.targetPpm === '-' ? '' : (item.targetPpm || ''));
        setVal('nutrisiPh', item.ph === '-' ? '' : (item.ph || ''));
        setVal('nutrisiPhAction', item.phAction || 'Aman / Tanpa Koreksi');
        setVal('nutrisiWaterTemp', item.waterTemp === '-' ? '' : (item.waterTemp || ''));
        setVal('nutrisiRoomTemp', item.roomTemp === '-' ? '' : (item.roomTemp || item.ghTemp || ''));
        setVal('nutrisiDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleNutrisi');
        if (titleEl) titleEl.innerText = 'Edit Data Nutrisi';
        
        var btnCancel = document.getElementById('btnCancelNutrisiEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm('Apakah kamu yakin ingin menghapus data nutrisi ini?')) {
            try {
                var storageKey = getKey();
                if (typeof Storage !== 'undefined' && Storage.remove) {
                    Storage.remove(storageKey, id);
                }
            } catch(e) {}
            loadTable();
        }
    }

    return {
        render: render,
        init: init,
        editItem: editItem,
        deleteItem: deleteItem
    };

})();
