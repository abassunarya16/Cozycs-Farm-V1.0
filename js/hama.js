// ==========================================
// COZYCS FARM - MODUL MONITORING HAMA & PENYAKIT (CRUD)
// ==========================================

var hama = (function() {

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
                <div class="section-title"><i class="fas fa-bug" style="color: #D32F2F;"></i> Monitoring Hama & Penyakit</div>
                
                <!-- Form Input Data Hama & Penyakit -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #D32F2F; margin-bottom: 12px;" id="formTitleHama">Catat Temuan Hama / Penyakit</div>
                    <form id="formHama">
                        <input type="hidden" id="hamaId">
                        
                        <!-- ID GH & Tanggal Pengecekan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">ID GH</label>
                                <select id="hamaGh" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="">-- Pilih Greenhouse --</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Pengecekan</label>
                                <input type="date" id="hamaTanggal" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Posisi Talang & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Posisi Talang / Baris</label>
                                <input type="text" id="hamaTalang" placeholder="Contoh: Talang 3 - Baris B" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Penanggung Jawab</label>
                                <input type="text" id="hamaPetugas" placeholder="Contoh: Rizky" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Kategori Masalah & Nama Hama/Penyakit -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Kategori Gangguan</label>
                                <select id="hamaKategori" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Hama (Serangga/Kutu)">Hama (Serangga/Kutu)</option>
                                    <option value="Penyakit (Jamur/Bakteri/Virus)">Penyakit (Jamur/Bakteri/Virus)</option>
                                    <option value="Defisiensi Nutrisi">Defisiensi Nutrisi</option>
                                    <option value="Fisiologis (Cracking/Sunburn)">Fisiologis (Cracking/Sunburn)</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Nama Hama / Gejala</label>
                                <input type="text" id="hamaNama" required placeholder="Contoh: Thrips / Powdery Mildew" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Tingkat Keparahan & Jumlah Tanaman Terkena -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tingkat Keparahan</label>
                                <select id="hamaTingkat" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Ringan (Spot Lokal)">Ringan (Spot Lokal)</option>
                                    <option value="Sedang (Meluas Sederhana)">Sedang (Meluas Sederhana)</option>
                                    <option value="Berat (Sangat Masif)">Berat (Sangat Masif)</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanaman Terkena (Pohon)</label>
                                <input type="number" id="hamaJumlahPohon" placeholder="Contoh: 5" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Rencana Tindakan Penanganan -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Rencana Tindakan Penanganan</label>
                            <select id="hamaTindakan" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                <option value="Spray Pestisida (Konek Modul Spray)">Spray Pestisida (Konek Modul Spray)</option>
                                <option value="Pruning / Buang Bagian Terserang">Pruning / Buang Bagian Terserang</option>
                                <option value="Eradikasi / Cabut Pohon">Eradikasi / Cabut Pohon</option>
                                <option value="Penyesuaian Nutrisi / pH">Penyesuaian Nutrisi / pH</option>
                                <option value="Observasi Lanjutan">Observasi Lanjutan</option>
                            </select>
                        </div>

                        <!-- Catatan Gejala -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan Gejala & Keterangan</label>
                            <textarea id="hamaDesc" rows="2" placeholder="Catatan warna daun, bercak putih, posisi di bawah daun, dll..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #D32F2F; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> Simpan Catatan Hama</button>
                            <button type="button" id="btnCancelHamaEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Hama Cards Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #D32F2F;"></i> Riwayat Monitoring & Temuan Hama</div>
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
                    petugas: petugas || 'Penanggung Jawab',
                    kategori: kategori || 'Hama (Serangga/Kutu)',
                    nama: nama || '-',
                    tingkat: tingkat || 'Ringan',
                    jumlahPohon: jumlahPohon,
                    tindakan: tindakan || 'Observasi Lanjutan',
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
                        Helper.showToast('Data temuan hama berhasil disimpan!', 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('hamaId', '');
                var titleEl = document.getElementById('formTitleHama');
                if (titleEl) titleEl.innerText = 'Catat Temuan Hama / Penyakit';
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('hamaId', '');
                var titleEl = document.getElementById('formTitleHama');
                if (titleEl) titleEl.innerText = 'Catat Temuan Hama / Penyakit';
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
            container.innerHTML = '<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada temuan hama atau penyakit tercatat.</div>';
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
            var valTingkat = item.tingkat ? item.tingkat : 'Ringan';
            var valPohon = item.jumlahPohon ? item.jumlahPohon : 0;
            var valTindakan = item.tindakan ? item.tindakan : '-';
            var valDesc = item.desc ? item.desc : '';

            // Warna badge berdasarkan tingkat keparahan
            var badgeBg = '#FFEBEE';
            var badgeColor = '#C62828';
            if (valTingkat.indexOf('Ringan') !== -1) {
                badgeBg = '#FFF3E0';
                badgeColor = '#E65100';
            } else if (valTingkat.indexOf('Sedang') !== -1) {
                badgeBg = '#FFF8E1';
                badgeColor = '#F57F17';
            }

            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card: Tanggal, ID GH & Nama Hama -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                        </div>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${valTingkat}</span>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Hama & Kategori -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Temuan & Jenis</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-bug" style="color: #D32F2F; width: 14px;"></i> <strong>${valNama}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-tags" style="color: #6A1B9A; width: 14px;"></i> <strong>${valKategori}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Lokasi & Populasi Terkena -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Lokasi & Dampak</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-th" style="color: #0277BD; width: 14px;"></i> <strong>${valTalang}</strong></div>
                                <div style="margin-top: 3px; color: #C62828;"><i class="fas fa-exclamation-triangle" style="color: #C62828; width: 14px;"></i> <strong>${valPohon} Pohon</strong></div>
                            </div>
                        </div>

                        <!-- 3. Rencana Penanganan -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Rencana Tindakan</div>
                            <div style="font-size: 12px; font-weight: bold; color: #2E7D32; line-height: 1.4;">
                                <div><i class="fas fa-tools" style="color: #2E7D32; width: 14px;"></i> <strong>${valTindakan}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Penanggung Jawab -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Penanggung Jawab</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-user-check" style="color: #0288D1; width: 14px;"></i> <strong>${item.petugas || 'Penanggung Jawab'}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan -->
                    ${valDesc ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${valDesc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #eee; padding-top: 8px; margin-top: 4px;">
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
        setVal('hamaPetugas', item.petugas === 'Penanggung Jawab' ? '' : (item.petugas || ''));
        setVal('hamaKategori', item.kategori || 'Hama (Serangga/Kutu)');
        setVal('hamaNama', item.nama === '-' ? '' : (item.nama || ''));
        setVal('hamaTingkat', item.tingkat || 'Ringan (Spot Lokal)');
        setVal('hamaJumlahPohon', item.jumlahPohon || '');
        setVal('hamaTindakan', item.tindakan || 'Spray Pestisida (Konek Modul Spray)');
        setVal('hamaDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleHama');
        if (titleEl) titleEl.innerText = 'Edit Data Hama / Penyakit';
        
        var btnCancel = document.getElementById('btnCancelHamaEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm('Apakah kamu yakin ingin menghapus data hama ini?')) {
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
