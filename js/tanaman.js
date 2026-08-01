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
                        
                        <!-- Tanggal Penginputan -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Penginputan</label>
                            <input type="date" id="tanamanDate" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                        </div>

                        <!-- ID GH & Varietas -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">ID GH</label>
                                <input type="text" id="tanamanGh" placeholder="Contoh: GH-01" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Varietas</label>
                                <input type="text" id="tanamanVarietas" required placeholder="Contoh: Intanon" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Talang & Lubang -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Talang</label>
                                <input type="number" id="tanamanTalang" placeholder="Contoh: 1" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Lubang</label>
                                <input type="number" id="tanamanLubang" placeholder="Contoh: 12" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Tanggal Semai & Tanggal Tanam -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Semai</label>
                                <input type="date" id="tanamanTglSemai" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Tanam</label>
                                <input type="date" id="tanamanTglTanam" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- HST & HSP -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">HST</label>
                                <input type="number" id="tanamanHst" placeholder="Contoh: 25" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">HSP</label>
                                <input type="number" id="tanamanHsp" placeholder="Contoh: 10" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Status Tanaman & Status Polinasi -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Status Tanaman</label>
                                <select id="tanamanStatus" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Hidup">Hidup</option>
                                    <option value="Sakit">Sakit</option>
                                    <option value="Mati">Mati</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Status Polinasi</label>
                                <select id="tanamanPolinasi" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Belum Polinasi">Belum Polinasi</option>
                                    <option value="Proses Polinasi">Proses Polinasi</option>
                                    <option value="Sudah Polinasi">Sudah Polinasi</option>
                                </select>
                            </div>
                        </div>

                        <!-- Status Panen & Status Buah -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Status Panen</label>
                                <select id="tanamanPanen" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Belum Panen">Belum Panen</option>
                                    <option value="Siap Panen">Siap Panen</option>
                                    <option value="Panen">Panen</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Status Buah</label>
                                <select id="tanamanBuah" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Belum Ada">Belum Ada</option>
                                    <option value="Pentil / Seleksi">Pentil / Seleksi</option>
                                    <option value="Pembesaran">Pembesaran</option>
                                    <option value="Netting">Netting</option>
                                    <option value="Pematangan">Pematangan</option>
                                </select>
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan</label>
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

                var id = document.getElementById('tanamanId').value;
                var date = document.getElementById('tanamanDate').value;
                var gh = document.getElementById('tanamanGh').value;
                var varietas = document.getElementById('tanamanVarietas').value;
                var talang = document.getElementById('tanamanTalang').value;
                var lubang = document.getElementById('tanamanLubang').value;
                var tglSemai = document.getElementById('tanamanTglSemai').value;
                var tglTanam = document.getElementById('tanamanTglTanam').value;
                var hst = document.getElementById('tanamanHst').value;
                var hsp = document.getElementById('tanamanHsp').value;
                var status = document.getElementById('tanamanStatus').value;
                var polinasi = document.getElementById('tanamanPolinasi').value;
                var panen = document.getElementById('tanamanPanen').value;
                var buah = document.getElementById('tanamanBuah').value;
                var desc = document.getElementById('tanamanDesc').value;

                var payload = {
                    date: date,
                    gh: gh || '-',
                    varietas: varietas || '-',
                    talang: talang || '-',
                    lubang: lubang || '-',
                    tglSemai: tglSemai || '-',
                    tglTanam: tglTanam || '-',
                    hst: hst || '-',
                    hsp: hsp || '-',
                    status: status || 'Hidup',
                    polinasi: polinasi || 'Belum Polinasi',
                    panen: panen || 'Belum Panen',
                    buah: buah || 'Belum Ada',
                    desc: desc
                };

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

                form.reset();
                document.getElementById('tanamanId').value = '';
                document.getElementById('formTitleTanaman').innerText = 'Catat Perkembangan Tanaman';
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                form.reset();
                document.getElementById('tanamanId').value = '';
                document.getElementById('formTitleTanaman').innerText = 'Catat Perkembangan Tanaman';
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerTanamanCards');
        if (!container) return;

        var data = Storage.getAll(Storage.KEYS.TANAMAN);
        if (data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada data tanaman tercatat.</div>`;
            return;
        }

        // Urutkan dari tanggal terbaru
        data.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        var html = '';
        data.forEach(function(item) {
            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card: Tanggal Penginputan -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${item.date}</strong>
                            <span style="background: #E8F5E9; color: #2E7D32; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">${item.varietas}</span>
                        </div>
                    </div>

                    <!-- Grid 4 Kotak (2x2) Ukuran Sama Rata -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Kiri Atas: ID GH & Posisi -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Lokasi & Penempatan</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-warehouse" style="color: #2E7D32; width: 14px;"></i> <strong>GH: ${item.gh}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-th" style="color: #E65100; width: 14px;"></i> <strong>Talang ${item.talang} / Lubang ${item.lubang}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Kanan Atas: Umur Tanaman -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Umur & Tanggal</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-clock" style="color: #0277BD; width: 14px;"></i> <strong>HST: ${item.hst} | HSP: ${item.hsp}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-calendar-alt" style="color: #6A1B9A; width: 14px;"></i> <strong>Tanam: ${item.tglTanam}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Kiri Bawah: Status Tanaman & Polinasi -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Kondisi & Polinasi</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-heartbeat" style="color: #388E3C; width: 14px;"></i> <strong>Tanaman: ${item.status}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-microscope" style="color: #C2185B; width: 14px;"></i> <strong>Polinasi: ${item.polinasi}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Kanan Bawah: Buah & Panen -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Buah & Panen</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-apple-alt" style="color: #F57F17; width: 14px;"></i> <strong>Buah: ${item.buah}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-shopping-basket" style="color: #1976D2; width: 14px;"></i> <strong>Panen: ${item.panen}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan (Jika Ada) -->
                    ${item.desc ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${item.desc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
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
        var item = Storage.getById(Storage.KEYS.TANAMAN, id);
        if (!item) return;

        document.getElementById('tanamanId').value = item.id;
        document.getElementById('tanamanDate').value = item.date;
        document.getElementById('tanamanGh').value = item.gh === '-'
