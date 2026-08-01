// ==========================================
// COZYCS FARM - MODUL MANAJEMEN TANAMAN (CRUD)
// ==========================================

var tanaman = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-seedling" style="color: #2E7D32;"></i> Monitoring & Data Tanaman</div>
                
                <!-- Form Input / Edit Data Tanaman -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;" id="formTitleTanaman">Catat Perkembangan Tanaman</div>
                    <form id="formTanaman">
                        <input type="hidden" id="tanamanId">
                        
                        <!-- 1. Tanggal Penginputan -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">1. Tanggal Penginputan</label>
                            <input type="date" id="tanamanDate" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                        </div>

                        <!-- 2. ID GH & 5. Varietas -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">2. ID GH</label>
                                <input type="text" id="tanamanBlok" placeholder="Contoh: GH-01" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">5. Varietas Melon</label>
                                <input type="text" id="tanamanVarietas" required placeholder="Contoh: Intanon" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 3. Talang & 4. Lubang -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">3. Talang</label>
                                <input type="number" id="tanamanHidup" placeholder="Contoh: 1" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">4. Lubang</label>
                                <input type="number" id="tanamanMati" placeholder="Contoh: 12" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 6. Tanggal Semai & 7. Tanggal Tanam -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">6. Tanggal Semai</label>
                                <input type="date" id="tanamanTinggi" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">7. Tanggal Tanam</label>
                                <input type="date" id="tanamanDaun" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 8. HST & 9. HSP -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">8. HST</label>
                                <input type="number" id="tanamanBuah" placeholder="Contoh: 25" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">9. HSP</label>
                                <input type="number" id="tanamanHsp" placeholder="Contoh: 10" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 10. Status Tanaman & 11. Status Polinasi -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">10. Status Tanaman</label>
                                <select id="tanamanVigor" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Hidup">Hidup</option>
                                    <option value="Sakit">Sakit</option>
                                    <option value="Mati">Mati</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">11. Status Polinasi</label>
                                <select id="tanamanPolinasi" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Belum Polinasi">Belum Polinasi</option>
                                    <option value="Proses Polinasi">Proses Polinasi</option>
                                    <option value="Sudah Polinasi">Sudah Polinasi</option>
                                </select>
                            </div>
                        </div>

                        <!-- 12. Status Panen & 13. Status Buah -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">12. Status Panen</label>
                                <select id="tanamanPanen" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Belum Panen">Belum Panen</option>
                                    <option value="Siap Panen">Siap Panen</option>
                                    <option value="Panen">Panen</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">13. Status Buah</label>
                                <select id="tanamanStatusBuah" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Belum Ada">Belum Ada</option>
                                    <option value="Pentil / Seleksi">Pentil / Seleksi</option>
                                    <option value="Pembesaran">Pembesaran</option>
                                    <option value="Netting">Netting</option>
                                    <option value="Pematangan">Pematangan</option>
                                </select>
                            </div>
                        </div>

                        <!-- 14. Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">14. Catatan</label>
                            <textarea id="tanamanDesc" rows="2" placeholder="Catatan perkembangan tanaman..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #2E7D32;"><i class="fas fa-save"></i> Simpan Data Tanaman</button>
                            <button type="button" id="btnCancelTanamanEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data / Card List Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #2E7D32;"></i> Rekap Data & Perkembangan Tanaman</div>
                <div id="containerTanamanCards">
                    <!-- Diisi dinamis oleh JavaScript -->
                </div>
            </div>
        `;
    }

    function init() {
        loadTable();

        var form = document.getElementById('formTanaman');
        var btnCancel = document.getElementById('btnCancelTanamanEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Pemeriksaan elemen secara aman (Defensive)
                var getVal = function(id) {
                    var el = document.getElementById(id);
                    return el ? el.value : '';
                };

                var id = getVal('tanamanId');
                var date = getVal('tanamanDate');
                var varietas = getVal('tanamanVarietas');
                var blok = getVal('tanamanBlok');
                var hidup = getVal('tanamanHidup');
                var mati = getVal('tanamanMati');
                var tinggi = getVal('tanamanTinggi');
                var daun = getVal('tanamanDaun');
                var buah = getVal('tanamanBuah');
                var hsp = getVal('tanamanHsp');
                var vigor = getVal('tanamanVigor');
                var polinasi = getVal('tanamanPolinasi');
                var panen = getVal('tanamanPanen');
                var statusBuah = getVal('tanamanStatusBuah');
                var desc = getVal('tanamanDesc');

                var payload = {
                    date: date,
                    varietas: varietas || '-',
                    blok: blok || '-',
                    hidup: hidup || '-',
                    mati: mati || '-',
                    tinggi: tinggi || '-',
                    daun: daun || '-',
                    buah: buah || '-',
                    hsp: hsp || '-',
                    vigor: vigor || 'Hidup',
                    polinasi: polinasi || 'Belum Polinasi',
                    panen: panen || 'Belum Panen',
                    statusBuah: statusBuah || 'Belum Ada',
                    desc: desc
                };

                if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.TANAMAN) {
                    if (id) {
                        payload.id = id;
                        Storage.update(Storage.KEYS.TANAMAN, payload);

                        if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                            Helper.showToast('Data tanaman berhasil diperbarui!', 'success');
                        }
                    } else {
                        Storage.add(Storage.KEYS.TANAMAN, payload);

                        if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                            Helper.showToast('Data tanaman berhasil ditambahkan!', 'success');
                        }
                    }
                }

                form.reset();
                var idEl = document.getElementById('tanamanId');
                if (idEl) idEl.value = '';
                var titleEl = document.getElementById('formTitleTanaman');
                if (titleEl) titleEl.innerText = 'Catat Perkembangan Tanaman';
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                var idEl = document.getElementById('tanamanId');
                if (idEl) idEl.value = '';
                var titleEl = document.getElementById('formTitleTanaman');
                if (titleEl) titleEl.innerText = 'Catat Perkembangan Tanaman';
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerTanamanCards');
        if (!container) return;

        var data = [];
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.TANAMAN) {
            data = Storage.getAll(Storage.KEYS.TANAMAN) || [];
        }

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada data tanaman tercatat.</div>`;
            return;
        }

        // Urutkan dari tanggal terbaru
        data.sort(function(a, b) {
            return new Date(b.date || 0) - new Date(a.date || 0);
        });

        var html = '';
        data.forEach(function(item) {
            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${item.date || '-'}</strong>
                            <span style="background: #E8F5E9; color: #2E7D32; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">${item.varietas || '-'}</span>
                        </div>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Varietas & GH -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Varietas & GH</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-seedling" style="color: #2E7D32; width: 14px;"></i> <strong>${item.varietas || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-warehouse" style="color: #E65100; width: 14px;"></i> <strong>GH: ${item.blok || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Talang & Lubang -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Talang & Lubang</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-th" style="color: #0277BD; width: 14px;"></i> <strong>Talang: ${item.hidup || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-circle" style="color: #C62828; width: 14px;"></i> <strong>Lubang: ${item.mati || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Umur Tanaman -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Umur Tanaman</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-clock" style="color: #0288D1; width: 14px;"></i> <strong>HST: ${item.buah || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-history" style="color: #4CAF50; width: 14px;"></i> <strong>HSP: ${item.hsp || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Kondisi & Status -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Kondisi & Status</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-heartbeat" style="color: #F57F17; width: 14px;"></i> <strong>${item.vigor || 'Hidup'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-apple-alt" style="color: #D32F2F; width: 14px;"></i> <strong>${item.statusBuah || '-'}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan -->
                    ${item.desc ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${item.desc}</div>` : ''}

                    <!-- Tombol Aksi -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #eee; padding-top: 8px; margin-top: 4px;">
                        <span onclick="tanaman.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="tanaman.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
