// ==========================================
// COZYCS FARM - DATA PANEN MODULE (CRUD & ERP CONNECTED)
// ==========================================

var panen = (function() {

    // Helper internal kunci storage aman
    function getKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.PANEN) {
            return Storage.KEYS.PANEN;
        }
        return 'cozycs_panen';
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
        var selectEl = document.getElementById('panenGh');
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
                <div class="section-title"><i class="fas fa-shopping-basket" style="color: #2E7D32;"></i> Pencatatan & Hasil Panen Melon</div>
                
                <!-- Form Input / Edit Data Panen -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;" id="formTitlePanen">Catat Hasil Panen Baru</div>
                    <form id="formPanen">
                        <input type="hidden" id="panenId">
                        
                        <!-- ID GH & Tanggal Panen -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">ID GH</label>
                                <select id="panenGh" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="">-- Pilih Greenhouse --</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Panen</label>
                                <input type="date" id="panenTanggal" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Varietas Melon & Petugas Panen -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Varietas Melon</label>
                                <input type="text" id="panenVarietas" required placeholder="Contoh: Intanon" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Petugas / Penanggung Jawab</label>
                                <input type="text" id="panenPetugas" placeholder="Contoh: Rizky / Team GH" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Jumlah Buah & Total Berat -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Jumlah Buah (Pcs/Butir)</label>
                                <input type="number" id="panenJumlahPcs" required placeholder="Contoh: 150" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Total Berat Panen (Kg)</label>
                                <input type="number" step="any" id="panenBeratTotal" required placeholder="Contoh: 245.5" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Tingkat Kemanisan (°Brix) & Grade Utama -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Kadar Manis (°Brix)</label>
                                <input type="number" step="any" id="panenBrix" placeholder="Contoh: 14.5" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Kategori Grade Dominan</label>
                                <select id="panenGrade" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Grade A Super">Grade A Super</option>
                                    <option value="Grade A">Grade A</option>
                                    <option value="Grade B">Grade B</option>
                                    <option value="Off-Grade / Afkir">Off-Grade / Afkir</option>
                                </select>
                            </div>
                        </div>

                        <!-- Detail Hasil Grading (Kg) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">Grade A (Kg)</label>
                                <input type="number" step="any" id="panenGradeAKg" placeholder="200" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">Grade B (Kg)</label>
                                <input type="number" step="any" id="panenGradeBKg" placeholder="35" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">Afkir (Kg)</label>
                                <input type="number" step="any" id="panenAfkirKg" placeholder="10.5" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan Kualitas Panen</label>
                            <textarea id="panenDesc" rows="2" placeholder="Catatan fisik net, bentuk buah, cracking, dll..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #2E7D32; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> Simpan Data Panen</button>
                            <button type="button" id="btnCancelPanenEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Panen Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #2E7D32;"></i> Riwayat & Hasil Panen Cozycs Farm</div>
                <div id="containerPanenCards"></div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        var form = document.getElementById('formPanen');
        var btnCancel = document.getElementById('btnCancelPanenEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('panenId');
                var gh = getVal('panenGh');
                var tanggal = getVal('panenTanggal');
                var varietas = getVal('panenVarietas');
                var petugas = getVal('panenPetugas');
                var pcs = parseFloat(getVal('panenJumlahPcs')) || 0;
                var beratTotal = parseFloat(getVal('panenBeratTotal')) || 0;
                var brix = getVal('panenBrix');
                var grade = getVal('panenGrade');
                var gradeAKg = parseFloat(getVal('panenGradeAKg')) || 0;
                var gradeBKg = parseFloat(getVal('panenGradeBKg')) || 0;
                var afkirKg = parseFloat(getVal('panenAfkirKg')) || 0;
                var desc = getVal('panenDesc');

                var payload = {
                    gh: gh || '-',
                    tanggal: tanggal,
                    varietas: varietas || '-',
                    petugas: petugas || 'Team Panen',
                    pcs: pcs,
                    beratTotal: beratTotal,
                    brix: brix || '-',
                    grade: grade || 'Grade A',
                    gradeAKg: gradeAKg,
                    gradeBKg: gradeBKg,
                    afkirKg: afkirKg,
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

                        // --- AUTOCUT & MASUK STOK GUDANG OTOMATIS ---
                        // Tambahkan Stok Buah Hasil Panen ke Gudang Inventaris
                        if (typeof Storage !== 'undefined') {
                            var keyGudang = (Storage.KEYS && Storage.KEYS.GUDANG) ? Storage.KEYS.GUDANG : 'cozycs_gudang';
                            var dataGudang = Storage.getAll(keyGudang) || [];
                            
                            var namaBarangGudang = 'Melon ' + varietas + ' (Panen ' + (gh || 'GH') + ')';
                            var itemGudang = dataGudang.find(function(b) {
                                return b.nama.toLowerCase().trim() === namaBarangGudang.toLowerCase().trim();
                            });

                            if (itemGudang) {
                                itemGudang.stok = (parseFloat(itemGudang.stok) || 0) + beratTotal;
                                Storage.update(keyGudang, itemGudang);
                            } else {
                                Storage.add(keyGudang, {
                                    tglBeli: tanggal,
                                    kategori: 'Lainnya',
                                    nama: namaBarangGudang,
                                    merek: 'Cozycs Farm',
                                    stok: beratTotal,
                                    satuan: 'Kg',
                                    stokMin: 10,
                                    harga: 25000,
                                    supplier: 'Panen Internal GH',
                                    lokasi: 'Gudang Utama - Cold Space',
                                    expired: '-',
                                    desc: 'Hasil Panen dari ' + (gh || 'GH') + ' | ' + pcs + ' Pcs | Brix: ' + brix + '°',
                                    status: 'Aktif'
                                });
                            }
                        }
                    }

                    if (typeof Helper !== 'undefined' && Helper.showToast) {
                        Helper.showToast('Data panen berhasil disimpan!', 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('panenId', '');
                var titleEl = document.getElementById('formTitlePanen');
                if (titleEl) titleEl.innerText = 'Catat Hasil Panen Baru';
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('panenId', '');
                var titleEl = document.getElementById('formTitlePanen');
                if (titleEl) titleEl.innerText = 'Catat Hasil Panen Baru';
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerPanenCards');
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
            container.innerHTML = '<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada data panen tercatat.</div>';
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
            var valVarietas = item.varietas ? item.varietas : '-';
            var valBerat = item.beratTotal ? item.beratTotal : '-';
            var valPcs = item.pcs ? item.pcs : '-';
            var valBrix = item.brix ? item.brix : '-';
            var valGrade = item.grade ? item.grade : 'Grade A';
            var valDesc = item.desc ? item.desc : '';

            // Hitung rata-rata berat per buah
            var avgWeight = (parseFloat(item.beratTotal) > 0 && parseFloat(item.pcs) > 0) ? (item.beratTotal / item.pcs).toFixed(2) : '-';

            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card: Tanggal, ID GH & Varietas -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                            <span style="background: #E8F5E9; color: #2E7D32; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 4px;">${valVarietas}</span>
                        </div>
                        <span style="background: #FFF3E0; color: #E65100; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${valGrade}</span>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Total Hasil Panen -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Total Hasil Panen</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-weight" style="color: #2E7D32; width: 14px;"></i> <strong>${valBerat} Kg</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-cubes" style="color: #0277BD; width: 14px;"></i> <strong>${valPcs} Buah / Pcs</strong></div>
                            </div>
                        </div>

                        <!-- 2. Kualitas Buah -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Kualitas & Manis</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-fire" style="color: #E65100; width: 14px;"></i> <strong>${valBrix} °Brix</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-balance-scale" style="color: #6A1B9A; width: 14px;"></i> <strong>Avg: ${avgWeight} Kg/buah</strong></div>
                            </div>
                        </div>

                        <!-- 3. Rincian Grading (Kg) -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Rincian Grading</div>
                            <div style="font-size: 11px; font-weight: bold; color: #333; line-height: 1.4;">
                                <div>A: <strong>${item.gradeAKg || 0} Kg</strong> | B: <strong>${item.gradeBKg || 0} Kg</strong></div>
                                <div style="margin-top: 3px; color: #C62828;">Afkir: <strong>${item.afkirKg || 0} Kg</strong></div>
                            </div>
                        </div>

                        <!-- 4. Petugas -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Petugas Panen</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-user-check" style="color: #0288D1; width: 14px;"></i> <strong>${item.petugas || 'Team Panen'}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan -->
                    ${valDesc ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${valDesc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #eee; padding-top: 8px; margin-top: 4px;">
                        <span onclick="panen.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="panen.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
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

        setVal('panenId', item.id || '');
        setVal('panenGh', item.gh === '-' ? '' : (item.gh || ''));
        setVal('panenTanggal', item.tanggal || '');
        setVal('panenVarietas', item.varietas === '-' ? '' : (item.varietas || ''));
        setVal('panenPetugas', item.petugas === 'Team Panen' ? '' : (item.petugas || ''));
        setVal('panenJumlahPcs', item.pcs || '');
        setVal('panenBeratTotal', item.beratTotal || '');
        setVal('panenBrix', item.brix === '-' ? '' : (item.brix || ''));
        setVal('panenGrade', item.grade || 'Grade A');
        setVal('panenGradeAKg', item.gradeAKg || '');
        setVal('panenGradeBKg', item.gradeBKg || '');
        setVal('panenAfkirKg', item.afkirKg || '');
        setVal('panenDesc', item.desc || '');

        var titleEl = document.getElementById('formTitlePanen');
        if (titleEl) titleEl.innerText = 'Edit Data Hasil Panen';
        
        var btnCancel = document.getElementById('btnCancelPanenEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm('Apakah kamu yakin ingin menghapus data panen ini?')) {
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
