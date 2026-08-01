// ==========================================
// COZYCS FARM - MODUL DATABASE TANAMAN (CRUD)
// ==========================================

var tanaman = (function() {

    // Helper internal kunci penyimpanan agar 100% aman & anti-crash
    function getStorageKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.TANAMAN) {
            return Storage.KEYS.TANAMAN;
        }
        return 'cozycs_tanaman';
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-seedling" style="color: #2E7D32;"></i> Database & Data Tanaman</div>
                
                <!-- Form Input / Edit Data Tanaman -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;" id="formTitleTanaman">Tambah Data Tanaman</div>
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
                                <label style="font-size: 12px; font-weight: 600; color: #555;">2. ID Greenhouse (GH)</label>
                                <input type="text" id="tanamanGhId" placeholder="Contoh: GH-01" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
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
                                <input type="number" id="tanamanTalang" placeholder="Contoh: 1" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">4. Lubang</label>
                                <input type="number" id="tanamanLubang" placeholder="Contoh: 12" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 6. Tanggal Semai & 7. Tanggal Tanam -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">6. Tanggal Semai</label>
                                <input type="date" id="tanamanTglSemai" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">7. Tanggal Tanam</label>
                                <input type="date" id="tanamanTglTanam" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 8. HST & 9. HSP -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">8. HST (Hari Setelah Tanam)</label>
                                <input type="number" id="tanamanHst" placeholder="Contoh: 25" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">9. HSP (Hari Setelah Polinasi)</label>
                                <input type="number" id="tanamanHsp" placeholder="Contoh: 10" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 10. Status Tanaman & 11. Status Polinasi -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">10. Status Tanaman</label>
                                <select id="tanamanStatus" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Hidup">Hidup</option>
                                    <option value="Sakit">Sakit</option>
                                    <option value="Mati">Mati</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">11. Status Polinasi</label>
                                <select id="tanamanStatusPolinasi" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Belum Polinasi">Belum Polinasi</option>
                                    <option value="Proses Polinasi">Proses Polinasi</option>
                                    <option value="Sudah Polinasi">Sudah Polinasi</option>
                                </select>
                            </div>
                        </div>

                        <!-- 12. Status Buah & 13. Status Panen -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">12. Status Buah</label>
                                <select id="tanamanStatusBuah" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Belum Ada">Belum Ada</option>
                                    <option value="Pentil / Seleksi">Pentil / Seleksi</option>
                                    <option value="Pembesaran">Pembesaran</option>
                                    <option value="Netting">Netting</option>
                                    <option value="Pematangan">Pematangan</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">13. Status Panen</label>
                                <select id="tanamanStatusPanen" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Belum Panen">Belum Panen</option>
                                    <option value="Siap Panen">Siap Panen</option>
                                    <option value="Panen">Panen</option>
                                </select>
                            </div>
                        </div>

                        <!-- 14. Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">14. Catatan</label>
                            <textarea id="tanamanDesc" rows="2" placeholder="Catatan khusus kondisi tanaman..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #2E7D32;"><i class="fas fa-save"></i> Simpan Data Tanaman</button>
                            <button type="button" id="btnCancelTanamanEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data / Card List Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #2E7D32;"></i> Rekap Database Tanaman</div>
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

                var idEl = document.getElementById('tanamanId');
                var dateEl = document.getElementById('tanamanDate');
                var ghIdEl = document.getElementById('tanamanGhId');
                var talangEl = document.getElementById('tanamanTalang');
                var lubangEl = document.getElementById('tanamanLubang');
                var varietasEl = document.getElementById('tanamanVarietas');
                var tglSemaiEl = document.getElementById('tanamanTglSemai');
                var tglTanamEl = document.getElementById('tanamanTglTanam');
                var hstEl = document.getElementById('tanamanHst');
                var hspEl = document.getElementById('tanamanHsp');
                var statusEl = document.getElementById('tanamanStatus');
                var statusPolinasiEl = document.getElementById('tanamanStatusPolinasi');
                var statusPanenEl = document.getElementById('tanamanStatusPanen');
                var statusBuahEl = document.getElementById('tanamanStatusBuah');
                var descEl = document.getElementById('tanamanDesc');

                var payload = {
                    date: dateEl ? dateEl.value : '',
                    ghId: (ghIdEl && ghIdEl.value) ? ghIdEl.value : '-',
                    talang: (talangEl && talangEl.value) ? talangEl.value : '-',
                    lubang: (lubangEl && lubangEl.value) ? lubangEl.value : '-',
                    varietas: (varietasEl && varietasEl.value) ? varietasEl.value : '-',
                    tglSemai: (tglSemaiEl && tglSemaiEl.value) ? tglSemaiEl.value : '-',
                    tglTanam: (tglTanamEl && tglTanamEl.value) ? tglTanamEl.value : '-',
                    hst: (hstEl && hstEl.value) ? hstEl.value : '0',
                    hsp: (hspEl && hspEl.value) ? hspEl.value : '0',
                    statusTanaman: statusEl ? statusEl.value : 'Hidup',
                    statusPolinasi: statusPolinasiEl ? statusPolinasiEl.value : 'Belum Polinasi',
                    statusPanen: statusPanenEl ? statusPanenEl.value : 'Belum Panen',
                    statusBuah: statusBuahEl ? statusBuahEl.value : 'Belum Ada',
                    desc: descEl ? descEl.value : ''
                };

                var key = getStorageKey();
                var id = idEl ? idEl.value : '';

                if (id) {
                    payload.id = id;
                    if (typeof Storage !== 'undefined' && Storage.update) {
                        Storage.update(key, payload);
                    }
                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast('Data tanaman berhasil diperbarui!', 'success');
                    }
                } else {
                    if (typeof Storage !== 'undefined' && Storage.add) {
                        Storage.add(key, payload);
                    }
                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast('Data tanaman berhasil ditambahkan!', 'success');
                    }
                }

                form.reset();
                if (idEl) idEl.value = '';
                var titleEl = document.getElementById('formTitleTanaman');
                if (titleEl) titleEl.innerText = 'Tambah Data Tanaman';
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
                if (titleEl) titleEl.innerText = 'Tambah Data Tanaman';
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerTanamanCards');
        if (!container) return;

        var key = getStorageKey();
        var data = [];
        if (typeof Storage !== 'undefined' && Storage.getAll) {
            data = Storage.getAll(key) || [];
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
                    <!-- Header Card: Tanggal Penginputan & Varietas -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${item.date || '-'}</strong>
                            <span style="background: #E8F5E9; color: #2E7D32; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">${item.varietas || '-'}</span>
                        </div>
                    </div>

                    <!-- Grid 4 Kotak (2x2) Ukuran Sama Rata -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Kiri Atas: ID GH, Talang & Lubang -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Lokasi & Penempatan</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-warehouse" style="color: #2E7D32; width: 14px;"></i> <strong>GH: ${item.ghId || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-th" style="color: #E65100; width: 14px;"></i> <strong>Talang ${item.talang || '-'} / Lubang ${item.lubang || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Kanan Atas: Tanggal Semai, Tanam, HST & HSP -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Umur & Tanggal</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-clock" style="color: #0277BD; width: 14px;"></i> <strong>HST: ${item.hst || '0'} | HSP: ${item.hsp || '0'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-calendar-alt" style="color: #6A1B9A; width: 14px;"></i> <strong>Tanam: ${item.tglTanam || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Kiri Bawah: Status Tanaman & Polinasi -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Kondisi & Polinasi</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-heartbeat" style="color: #388E3C; width: 14px;"></i> <strong>Tanaman: ${item.statusTanaman || 'Hidup'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-microscope" style="color: #C2185B; width: 14px;"></i> <strong>Polinasi: ${item.statusPolinasi || 'Belum'}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Kanan Bawah: Status Buah & Panen -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Buah & Panen</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-apple-alt" style="color: #F57F17; width: 14px;"></i> <strong>Buah: ${item.statusBuah || '-'}</strong></div>
 
