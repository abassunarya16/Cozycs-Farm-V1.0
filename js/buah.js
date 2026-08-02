// ==========================================
// COZYCS FARM - MODUL PEMELIHARAAN & PEMBESARAN BUAH (CRUD)
// ==========================================

var buah = (function() {

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

    // Fungsi untuk mengisi opsi dropdown ID GH dari data Greenhouse
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
                <div class="section-title"><i class="fas fa-apple-alt" style="color: #E65100;"></i> Pemeliharaan & Pembesaran Buah</div>
                
                <!-- Form Input Data Pemeliharaan Buah -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #E65100; margin-bottom: 12px;" id="formTitleBuah">Catat Pemeliharaan Buah</div>
                    <form id="formBuah">
                        <input type="hidden" id="buahId">
                        
                        <!-- ID GH & Tanggal Monitoring -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">ID GH</label>
                                <select id="buahGh" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="">-- Pilih Greenhouse --</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Tindakan</label>
                                <input type="date" id="buahTanggal" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Posisi Talang & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Posisi Talang / Baris</label>
                                <input type="text" id="buahTalang" placeholder="Contoh: Talang 1 - 4" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Penanggung Jawab</label>
                                <input type="text" id="buahPetugas" placeholder="Contoh: Rizky" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Jenis Tindakan / Pemeliharaan & Status Netting -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Jenis Tindakan</label>
                                <select id="buahTindakan" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Gantung Buah (Tali Hook)">Gantung Buah (Tali Hook)</option>
                                    <option value="Seleksi Buah Akhir (Pruning)">Seleksi Buah Akhir (Pruning)</option>
                                    <option value="Pemasangan Net Protection">Pemasangan Net Protection</option>
                                    <option value="Monitoring Pembesaran Buah">Monitoring Pembesaran Buah</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Kondisi Netting / Kulit</label>
                                <select id="buahNetting" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Mulus (Belum Pembentukan Net)">Mulus (Belum Pembentukan Net)</option>
                                    <option value="Net Mulai Retak / Pecah">Net Mulai Retak / Pecah</option>
                                    <option value="Net Rapat & Tebal">Net Rapat & Tebal</option>
                                    <option value="Kuning Sempurna (Non-Net)">Kuning Sempurna (Non-Net)</option>
                                </select>
                            </div>
                        </div>

                        <!-- Estimasi Bobot Rata-Rata & Jumlah Buah Afkir/Cacat -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Est. Bobot Rata-Rata (Kg)</label>
                                <input type="number" step="any" id="buahEstBobot" placeholder="Contoh: 1.2" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Buah Cacat / Afkir (Pcs)</label>
                                <input type="number" id="buahAfkir" placeholder="Contoh: 2 (Pecah/Lalat)" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan Tambahan</label>
                            <textarea id="buahDesc" rows="2" placeholder="Catatan fisik, gejala cracking, sunburn, dll..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #E65100; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> Simpan Data Buah</button>
                            <button type="button" id="btnCancelBuahEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Buah Cards Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #E65100;"></i> Riwayat Pemeliharaan Buah</div>
                <div id="containerBuahCards"></div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

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
                    petugas: petugas || 'Penanggung Jawab',
                    tindakan: tindakan || 'Monitoring Pembesaran Buah',
                    netting: netting || 'Mulus',
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

                    if (typeof Helper !== 'undefined' && Helper.showToast) {
                        Helper.showToast('Data pemeliharaan buah berhasil disimpan!', 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('buahId', '');
                var titleEl = document.getElementById('formTitleBuah');
                if (titleEl) titleEl.innerText = 'Catat Pemeliharaan Buah';
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('buahId', '');
                var titleEl = document.getElementById('formTitleBuah');
                if (titleEl) titleEl.innerText = 'Catat Pemeliharaan Buah';
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerBuahCards');
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
            container.innerHTML = '<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada catatan pemeliharaan buah.</div>';
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
            var valTindakan = item.tindakan ? item.tindakan : '-';
            var valNetting = item.netting ? item.netting : '-';
            var valBobot = item.estBobot ? item.estBobot : '-';
            var valAfkir = item.afkir ? item.afkir : 0;
            var valDesc = item.desc ? item.desc : '';

            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card: Tanggal, ID GH & Jenis Tindakan -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                        </div>
                        <span style="background: #FFF3E0; color: #E65100; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${valTindakan}</span>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Lokasi & Netting -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Lokasi & Netting</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-th" style="color: #0277BD; width: 14px;"></i> <strong>${valTalang}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-braille" style="color: #E65100; width: 14px;"></i> <strong>${valNetting}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Est. Bobot & Afkir -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Est. Bobot & Afkir</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-weight" style="color: #2E7D32; width: 14px;"></i> <strong>${valBobot} Kg/buah</strong></div>
                                <div style="margin-top: 3px; color: ${valAfkir > 0 ? '#C62828' : '#333'};"><i class="fas fa-times-circle" style="color: #C62828; width: 14px;"></i> <strong>Afkir: ${valAfkir} Pcs</strong></div>
                            </div>
                        </div>

                        <!-- 3. Penanggung Jawab -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Penanggung Jawab</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-user-check" style="color: #0288D1; width: 14px;"></i> <strong>${item.petugas || 'Penanggung Jawab'}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Modul Terkait -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Status Perkembangan</div>
                            <div style="font-size: 12px; font-weight: bold; color: #2E7D32; line-height: 1.4;">
                                <div><i class="fas fa-seedling" style="color: #2E7D32; width: 14px;"></i> <strong>Fase Pembesaran</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan -->
                    ${valDesc ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${valDesc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #eee; padding-top: 8px; margin-top: 4px;">
                        <span onclick="buah.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="buah.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
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

        setVal('buahId', item.id || '');
        setVal('buahGh', item.gh === '-' ? '' : (item.gh || ''));
        setVal('buahTanggal', item.tanggal || '');
        setVal('buahTalang', item.talang === '-' ? '' : (item.talang || ''));
        setVal('buahPetugas', item.petugas === 'Penanggung Jawab' ? '' : (item.petugas || ''));
        setVal('buahTindakan', item.tindakan || 'Gantung Buah (Tali Hook)');
        setVal('buahNetting', item.netting || 'Mulus (Belum Pembentukan Net)');
        setVal('buahEstBobot', item.estBobot || '');
        setVal('buahAfkir', item.afkir || '');
        setVal('buahDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleBuah');
        if (titleEl) titleEl.innerText = 'Edit Data Pemeliharaan Buah';
        
        var btnCancel = document.getElementById('btnCancelBuahEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm('Apakah kamu yakin ingin menghapus data pemeliharaan buah ini?')) {
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
