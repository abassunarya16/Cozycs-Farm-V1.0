// ==========================================
// COZYCS FARM - MODUL POLINASI & SELEKSI BUAH (CRUD)
// ==========================================

var polinasi = (function() {

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
                <div class="section-title"><i class="fas fa-microscope" style="color: #C2185B;"></i> Monitoring Polinasi & Perkawinan Bunga</div>
                
                <!-- Form Input Data Polinasi -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #C2185B; margin-bottom: 12px;" id="formTitlePolinasi">Catat Aktivitas Polinasi Baru</div>
                    <form id="formPolinasi">
                        <input type="hidden" id="polinasiId">
                        
                        <!-- ID GH & Tanggal Polinasi -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">ID GH</label>
                                <select id="polinasiGh" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="">-- Pilih Greenhouse --</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Polinasi</label>
                                <input type="date" id="polinasiTanggal" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Talang / Baris & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Posisi Talang / Baris</label>
                                <input type="text" id="polinasiTalang" placeholder="Contoh: Talang 1 - 6" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Penanggung Jawab</label>
                                <input type="text" id="polinasiPetugas" placeholder="Contoh: Rizky" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Jumlah Bunga Dipolinasi & Buah Jadi (Pentil) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Bunga Dipolinasi (Butir)</label>
                                <input type="number" id="polinasiJumlah" required placeholder="Contoh: 200" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Buah Jadi / Pentil (Butir)</label>
                                <input type="number" id="polinasiBerhasil" placeholder="Contoh: 180 (Diisi saat H+5)" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Metode Polinasi (Termasuk Serum) & Target Buah / Pohon -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Metode Polinasi</label>
                                <select id="polinasiMetode" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Manual (Bunga Jantan)">Manual (Bunga Jantan)</option>
                                    <option value="Manual (Kuas / Cottonbud)">Manual (Kuas / Cottonbud)</option>
                                    <option value="Serangga / Lebah">Serangga / Lebah</option>
                                    <option value="Serum">Serum</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Target Dipelihara / Pohon</label>
                                <select id="polinasiTargetPohon" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="1 Buah / Pohon">1 Buah / Pohon</option>
                                    <option value="2 Buah / Pohon">2 Buah / Pohon</option>
                                </select>
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan Tambahan</label>
                            <textarea id="polinasiDesc" rows="2" placeholder="Catatan kondisi bunga, cuaca saat polinasi, dll..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #C2185B; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> Simpan Data Polinasi</button>
                            <button type="button" id="btnCancelPolinasiEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Polinasi Cards Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #C2185B;"></i> Riwayat & Evaluasi Polinasi</div>
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
                    petugas: petugas || 'Penanggung Jawab',
                    jumlah: jumlah,
                    berhasil: berhasil,
                    metode: metode || 'Manual',
                    targetPohon: targetPohon || '1 Buah / Pohon',
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
                        Helper.showToast('Data polinasi berhasil disimpan!', 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('polinasiId', '');
                var titleEl = document.getElementById('formTitlePolinasi');
                if (titleEl) titleEl.innerText = 'Catat Aktivitas Polinasi Baru';
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('polinasiId', '');
                var titleEl = document.getElementById('formTitlePolinasi');
                if (titleEl) titleEl.innerText = 'Catat Aktivitas Polinasi Baru';
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
            container.innerHTML = '<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada catatan polinasi tercatat.</div>';
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
            var rateText = 'Belum Dihitung';
            var rateColor = '#777';
            if (valJumlah > 0 && item.berhasil !== undefined && item.berhasil !== '') {
                var rate = Math.round((valBerhasil / valJumlah) * 100);
                rateText = rate + '% Sukses';
                rateColor = rate >= 80 ? '#2E7D32' : (rate >= 50 ? '#E65100' : '#C62828');
            }

            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card: Tanggal, ID GH & Rate -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                        </div>
                        <span style="background: #FCE4EC; color: ${rateColor}; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${rateText}</span>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Lokasi & Jumlah Polinasi -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Lokasi & Total</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-th" style="color: #E65100; width: 14px;"></i> <strong>${valTalang}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-seedling" style="color: #C2185B; width: 14px;"></i> <strong>${valJumlah} Bunga</strong></div>
                            </div>
                        </div>

                        <!-- 2. Buah Jadi & Target -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Buah Jadi & Target</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-check-circle" style="color: #2E7D32; width: 14px;"></i> <strong>${valBerhasil} Pentil</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-bullseye" style="color: #0277BD; width: 14px;"></i> <strong>${item.targetPohon || '1 Buah/Pohon'}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Estimasi Panen -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Est. Panen (+50 HSP)</div>
                            <div style="font-size: 12px; font-weight: bold; color: #2E7D32; line-height: 1.4;">
                                <div><i class="fas fa-calendar-alt" style="color: #2E7D32; width: 14px;"></i> <strong>${item.estimasiPanen || '-'}</strong></div>
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
        setVal('polinasiPetugas', item.petugas === 'Penanggung Jawab' ? '' : (item.petugas || ''));
        setVal('polinasiJumlah', item.jumlah || '');
        setVal('polinasiBerhasil', item.berhasil || '');
        setVal('polinasiMetode', item.metode || 'Manual (Bunga Jantan)');
        setVal('polinasiTargetPohon', item.targetPohon || '1 Buah / Pohon');
        setVal('polinasiDesc', item.desc || '');

        var titleEl = document.getElementById('formTitlePolinasi');
        if (titleEl) titleEl.innerText = 'Edit Data Polinasi';
        
        var btnCancel = document.getElementById('btnCancelPolinasiEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm('Apakah kamu yakin ingin menghapus data polinasi ini?')) {
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
