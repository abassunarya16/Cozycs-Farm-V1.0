// ==========================================
// COZYCS FARM - MODUL MANAJEMEN TANAMAN (CRUD)
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
        var greenhouse = [];
        if (typeof Storage !== 'undefined' && Storage.getAll && Storage.KEYS && Storage.KEYS.GREENHOUSE) {
            greenhouse = Storage.getAll(Storage.KEYS.GREENHOUSE) || [];
        }

        var ghOptionsHtml = '<option value="">Pilih Greenhouse</option>';
        greenhouse.forEach(function(g) {
            ghOptionsHtml += `<option value="${g.id}">${g.kode || ''} - ${g.nama || ''}</option>`;
        });

        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-seedling" style="color: #2E7D32;"></i> Database & Data Tanaman</div>
                
                <!-- Form Input / Edit Data Tanaman -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;" id="formTitleTanaman">Tambah Data Tanaman</div>
                    <form id="formTanaman">
                        <input type="hidden" id="tanamanId">
                        
                        <!-- 1. Greenhouse & Varietas -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Greenhouse</label>
                                <select id="tanamanGhId" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    ${ghOptionsHtml}
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Varietas Melon</label>
                                <input type="text" id="tanamanVarietas" required placeholder="Contoh: Intanon" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 2. Posisi Talang & Lubang Tanam -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Nomor Talang</label>
                                <input type="number" id="tanamanTalang" placeholder="Contoh: 1" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Nomor Lubang</label>
                                <input type="number" id="tanamanLubang" placeholder="Contoh: 12" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 3. Tanggal Semai & Tanggal Tanam -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Semai</label>
                                <input type="date" id="tanamanTglSemai" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Tanam</label>
                                <input type="date" id="tanamanTglTanam" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 4. Status Tanaman & Status Polinasi -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Kondisi / Status Tanaman</label>
                                <select id="tanamanStatus" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Sehat">💚 Sehat</option>
                                    <option value="Sakit">⚠️ Sakit / Layu</option>
                                    <option value="Mati">❌ Mati</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Status Polinasi & Buah</label>
                                <select id="tanamanStatusPolinasi" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Belum Polinasi">Belum Polinasi</option>
                                    <option value="Sudah Polinasi">Sudah Polinasi</option>
                                    <option value="Buah Jadi">Buah Jadi</option>
                                    <option value="Siap Panen">Siap Panen</option>
                                    <option value="Panen">Panen</option>
                                </select>
                            </div>
                        </div>

                        <!-- 5. Catatan Tambahan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan Khusus (Opsional)</label>
                            <textarea id="tanamanCatatan" rows="2" placeholder="Catatan khusus kondisi tanaman..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
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
                var ghIdEl = document.getElementById('tanamanGhId');
                var varietasEl = document.getElementById('tanamanVarietas');
                var talangEl = document.getElementById('tanamanTalang');
                var lubangEl = document.getElementById('tanamanLubang');
                var tglSemaiEl = document.getElementById('tanamanTglSemai');
                var tglTanamEl = document.getElementById('tanamanTglTanam');
                var statusEl = document.getElementById('tanamanStatus');
                var statusPolinasiEl = document.getElementById('tanamanStatusPolinasi');
                var catatanEl = document.getElementById('tanamanCatatan');

                var talangVal = (talangEl && talangEl.value) ? parseInt(talangEl.value) || 0 : 0;
                var lubangVal = (lubangEl && lubangEl.value) ? parseInt(lubangEl.value) || 0 : 0;

                // Hitung HST (Hari Setelah Tanam)
                var hstVal = 0;
                if (tglTanamEl && tglTanamEl.value) {
                    var diffTime = Math.abs(new Date() - new Date(tglTanamEl.value));
                    hstVal = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                }

                var payload = {
                    greenhouse_id: ghIdEl ? ghIdEl.value : '',
                    varietas: (varietasEl && varietasEl.value) ? varietasEl.value : '-',
                    talang: talangVal,
                    lubang: lubangVal,
                    tanggal_semai: (tglSemaiEl && tglSemaiEl.value) ? tglSemaiEl.value : '-',
                    tanggal_tanam: (tglTanamEl && tglTanamEl.value) ? tglTanamEl.value : '-',
                    hst: hstVal,
                    status_tanaman: (statusEl && statusEl.value) ? statusEl.value : 'Sehat',
                    status_polinasi: (statusPolinasiEl && statusPolinasiEl.value) ? statusPolinasiEl.value : 'Belum Polinasi',
                    catatan: catatanEl ? catatanEl.value : '',
                    date: (tglTanamEl && tglTanamEl.value) ? tglTanamEl.value : new Date().toISOString().split('T')[0]
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
                    payload.id = 'T' + String(talangVal).padStart(2, '0') + '-L' + String(lubangVal).padStart(2, '0') + '-' + Math.floor(100 + Math.random() * 900);
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

        var greenhouse = [];
        if (typeof Storage !== 'undefined' && Storage.getAll && Storage.KEYS && Storage.KEYS.GREENHOUSE) {
            greenhouse = Storage.getAll(Storage.KEYS.GREENHOUSE) || [];
        }

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada data tanaman tercatat.</div>`;
            return;
        }

        // Urutkan dari tanggal tanam terbaru
        data.sort(function(a, b) {
            return new Date(b.tanggal_tanam || 0) - new Date(a.tanggal_tanam || 0);
        });

        var html = '';
        data.forEach(function(item) {
            var gh = greenhouse.find(function(g) { return g.id === item.greenhouse_id; });
            var ghCode = gh ? (gh.kode || gh.nama || '-') : '-';

            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card: ID & Varietas -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #1B5E20;">${item.id || 'Tanaman'}</strong>
                            <span style="background: #E8F5E9; color: #2E7D32; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">${item.varietas || '-'}</span>
                        </div>
                    </div>

                    <!-- Grid 4 Kotak (2x2) Ukuran Sama Rata -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Kiri Atas: Greenhouse & Lokasi -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Greenhouse & Lokasi</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-warehouse" style="color: #2E7D32; width: 14px;"></i> <strong>GH: ${ghCode}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-th" style="color: #E65100; width: 14px;"></i> <strong>Talang ${item.talang || '-'} / Lbg ${item.lubang || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Kanan Atas: HST & Umur -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Umur Tanaman</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-clock" style="color: #0277BD; width: 14px;"></i> <strong>HST ${item.hst || 0} Hari</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-calendar-alt" style="color: #6A1B9A; width: 14px;"></i> <strong>Tanam: ${item.tanggal_tanam || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Kiri Bawah: Status Tanaman -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Kondisi Tanaman</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-heartbeat" style="color: #388E3C; width: 14px;"></i> <strong>${item.status_tanaman || 'Sehat'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-seedling" style="color: #4CAF50; width: 14px;"></i> <strong>Semai: ${item.tanggal_semai || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Kanan Bawah: Status Polinasi & Buah -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Status Polinasi & Buah</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-apple-alt" style="color: #F57F17; width: 14px;"></i> <strong>${item.status_polinasi || 'Belum Polinasi'}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan (Jika Ada) -->
                    ${item.catatan ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${item.catatan}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja (Ikon Pensil di Kiri, Ikon Tong Sampah di Kanan Tanpa Kotak) -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #eee; padding-top: 8px; margin-top: 4px;">
                        <span onclick="tanaman.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="tanaman.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function editItem(id) {
        var key = getStorageKey();
        var item = null;
        if (typeof Storage !== 'undefined' && Storage.getById) {
            item = Storage.getById(key, id);
        }
        if (!item) return;

        var idEl = document.getElementById('tanamanId');
        var ghIdEl = document.getElementById('tanamanGhId');
        var varietasEl = document.getElementById('tanamanVarietas');
        var talangEl = document.getElementById('tanamanTalang');
        var lubangEl = document.getElementById('tanamanLubang');
        var tglSemaiEl = document.getElementById('tanamanTglSemai');
        var tglTanamEl = document.getElementById('tanamanTglTanam');
        var statusEl = document.getElementById('tanamanStatus');
        var statusPolinasiEl = document.getElementById('tanamanStatusPolinasi');
        var catatanEl = document.getElementById('tanamanCatatan');

        if (idEl) idEl.v
