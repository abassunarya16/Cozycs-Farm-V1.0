// ==========================================
// COZYCS FARM - MODUL PEMANGKASAN & PRUNING (CRUD)
// ==========================================

var pruning = (function() {

    function getKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.PRUNING) {
            return Storage.KEYS.PRUNING;
        }
        return 'cozycs_pruning';
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
        var selectEl = document.getElementById('pruningGh');
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
                <div class="section-title"><i class="fas fa-cut" style="color: #D81B60;"></i> Pemangkasan & Pruning Tanaman</div>
                
                <!-- Form Input Data Pruning -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #D81B60; margin-bottom: 12px;" id="formTitlePruning">Catat Aktivitas Pruning</div>
                    <form id="formPruning">
                        <input type="hidden" id="pruningId">
                        
                        <!-- ID GH & Tanggal Pelaksanaan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">ID GH</label>
                                <select id="pruningGh" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="">-- Pilih Greenhouse --</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Pelaksanaan</label>
                                <input type="date" id="pruningTanggal" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Posisi Talang & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Posisi Talang / Baris</label>
                                <input type="text" id="pruningTalang" placeholder="Contoh: Talang 1 - 6" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Penanggung Jawab</label>
                                <input type="text" id="pruningPetugas" placeholder="Contoh: Rizky" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Jenis Pruning & Target Ruas / Daun -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Jenis Pruning</label>
                                <select id="pruningJenis" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Pemangkasan Tunas Air (Bawah)">Pemangkasan Tunas Air (Bawah)</option>
                                    <option value="Potong Pucuk Utama (Toping Utama)">Potong Pucuk Utama (Toping Utama)</option>
                                    <option value="Pruning Daun Tua / Sakit (Bawah)">Pruning Daun Tua / Sakit (Bawah)</option>
                                    <option value="Pemangkasan Cabang Buah">Pemangkasan Cabang Buah</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Target Ruas / Posisi Daun</label>
                                <input type="text" id="pruningTargetRuas" placeholder="Contoh: Ruas 1 - 8 / Daun Tua Bawah" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Jumlah Pohon Dikerjakan & Sanitasi Bekas Potongan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Jumlah Pohon (Batang)</label>
                                <input type="number" id="pruningJumlahPohon" placeholder="Contoh: 200" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Aplikasi Sanitasi Luka</label>
                                <select id="pruningSanitasi" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Oles Fungisida (Antracol/Nativo)">Oles Fungisida (Antracol/Nativo)</option>
                                    <option value="Spray Kering Angin">Spray Kering Angin</option>
                                    <option value="Tanpa Treatment Khusus">Tanpa Treatment Khusus</option>
                                </select>
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan Tambahan</label>
                            <textarea id="pruningDesc" rows="2" placeholder="Catatan kondisi luka potongan, kebersihan daun afkir, dll..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #D81B60; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> Simpan Data Pruning</button>
                            <button type="button" id="btnCancelPruningEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Pruning Cards Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #D81B60;"></i> Riwayat Pelaksanaan Pruning</div>
                <div id="containerPruningCards"></div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        var form = document.getElementById('formPruning');
        var btnCancel = document.getElementById('btnCancelPruningEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('pruningId');
                var gh = getVal('pruningGh');
                var tanggal = getVal('pruningTanggal');
                var talang = getVal('pruningTalang');
                var petugas = getVal('pruningPetugas');
                var jenis = getVal('pruningJenis');
                var targetRuas = getVal('pruningTargetRuas');
                var jumlahPohon = parseFloat(getVal('pruningJumlahPohon')) || 0;
                var sanitasi = getVal('pruningSanitasi');
                var desc = getVal('pruningDesc');

                var payload = {
                    gh: gh || '-',
                    tanggal: tanggal,
                    talang: talang || '-',
                    petugas: petugas || 'Penanggung Jawab',
                    jenis: jenis || 'Pemangkasan Tunas Air',
                    targetRuas: targetRuas || '-',
                    jumlahPohon: jumlahPohon,
                    sanitasi: sanitasi || 'Tanpa Treatment Khusus',
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
                        Helper.showToast('Data pruning berhasil disimpan!', 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('pruningId', '');
                var titleEl = document.getElementById('formTitlePruning');
                if (titleEl) titleEl.innerText = 'Catat Aktivitas Pruning';
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('pruningId', '');
                var titleEl = document.getElementById('formTitlePruning');
                if (titleEl) titleEl.innerText = 'Catat Aktivitas Pruning';
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerPruningCards');
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
            container.innerHTML = '<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada catatan aktivitas pruning.</div>';
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
            var valJenis = item.jenis ? item.jenis : '-';
            var valTarget = item.targetRuas ? item.targetRuas : '-';
            var valPohon = item.jumlahPohon ? item.jumlahPohon : 0;
            var valSanitasi = item.sanitasi ? item.sanitasi : '-';
            var valDesc = item.desc ? item.desc : '';

            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card: Tanggal, ID GH & Jenis Pruning -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                        </div>
                        <span style="background: #FCE4EC; color: #D81B60; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${valJenis}</span>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Lokasi & Target Ruas -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Lokasi & Target</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-th" style="color: #0277BD; width: 14px;"></i> <strong>${valTalang}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-align-center" style="color: #D81B60; width: 14px;"></i> <strong>${valTarget}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Populasi & Sanitasi -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Populasi & Sanitasi</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-seedling" style="color: #2E7D32; width: 14px;"></i> <strong>${valPohon} Batang</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-first-aid" style="color: #E65100; width: 14px;"></i> <strong>${valSanitasi}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Penanggung Jawab -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Penanggung Jawab</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-user-check" style="color: #0288D1; width: 14px;"></i> <strong>${item.petugas || 'Penanggung Jawab'}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Kategori Pemeliharaan -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Kategori Modul</div>
                            <div style="font-size: 12px; font-weight: bold; color: #D81B60; line-height: 1.4;">
                                <div><i class="fas fa-cut" style="color: #D81B60; width: 14px;"></i> <strong>Sanitasi Tajuk</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan -->
                    ${valDesc ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${valDesc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #eee; padding-top: 8px; margin-top: 4px;">
                        <span onclick="pruning.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="pruning.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
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

        setVal('pruningId', item.id || '');
        setVal('pruningGh', item.gh === '-' ? '' : (item.gh || ''));
        setVal('pruningTanggal', item.tanggal || '');
        setVal('pruningTalang', item.talang === '-' ? '' : (item.talang || ''));
        setVal('pruningPetugas', item.petugas === 'Penanggung Jawab' ? '' : (item.petugas || ''));
        setVal('pruningJenis', item.jenis || 'Pemangkasan Tunas Air (Bawah)');
        setVal('pruningTargetRuas', item.targetRuas === '-' ? '' : (item.targetRuas || ''));
        setVal('pruningJumlahPohon', item.jumlahPohon || '');
        setVal('pruningSanitasi', item.sanitasi || 'Oles Fungisida (Antracol/Nativo)');
        setVal('pruningDesc', item.desc || '');

        var titleEl = document.getElementById('formTitlePruning');
        if (titleEl) titleEl.innerText = 'Edit Data Pruning';
        
        var btnCancel = document.getElementById('btnCancelPruningEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm('Apakah kamu yakin ingin menghapus data pruning ini?')) {
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
