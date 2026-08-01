// ==========================================
// COZYCS FARM - MODUL NUTRISI & PPM (CRUD)
// ==========================================

var nutrisi = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-tint" style="color: #0277BD;"></i> Cek & Kontrol Nutrisi (PPM & pH)</div>
                
                <!-- Form Input / Edit Data Nutrisi -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #0277BD; margin-bottom: 12px;" id="formTitleNutrisi">Catat Cek Nutrisi Harian</div>
                    <form id="formNutrisi">
                        <input type="hidden" id="nutrisiId">
                        
                        <!-- 1. Tanggal Pelaksanaan -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Pengecekan</label>
                            <input type="date" id="nutrisiDate" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                        </div>

                        <!-- 2. Waktu Cek -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Waktu Cek</label>
                            <select id="nutrisiTimeSlot" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                <option value="Pagi">Pagi</option>
                                <option value="Sore">Sore</option>
                            </select>
                        </div>

                        <!-- 3. HST & Fase Tanaman -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">HST (Hari Setelah Tanam)</label>
                                <input type="number" id="nutrisiHst" placeholder="Contoh: 15" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Fase Tanaman</label>
                                <select id="nutrisiFase" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Vegetatif Awal (Bibit/Pindahan)">Vegetatif Awal</option>
                                    <option value="Vegetatif Pertumbuhan">Vegetatif Pertumbuhan</option>
                                    <option value="Pembungaan / Polinasi">Pembungaan / Polinasi</option>
                                    <option value="Pembesaran Buah">Pembesaran Buah</option>
                                    <option value="Pematangan Buah / Ripening">Pematangan Buah</option>
                                </select>
                            </div>
                        </div>

                        <!-- 4. PPM & Target PPM -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">PPM Aktual (Tercatat)</label>
                                <input type="number" id="nutrisiPpm" required placeholder="Contoh: 1000" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Target PPM</label>
                                <input type="number" id="nutrisiTargetPpm" required placeholder="Contoh: 1200" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 5. pH & Koreksi pH -->
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

                        <!-- 6. Suhu Air & Suhu Ruangan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Suhu Air Tandon (°C) [Opsional]</label>
                                <input type="text" id="nutrisiWaterTemp" placeholder="Contoh: 26°C" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Suhu Ruangan (°C) [Opsional]</label>
                                <input type="text" id="nutrisiRoomTemp" placeholder="Contoh: 30°C" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 7. Catatan Tambahan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan Tambahan (Jumlah Nutrisi Ditambahkan, dll.)</label>
                            <textarea id="nutrisiDesc" rows="2" placeholder="Contoh: Tambah nutrisi A&B mix 200ml..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #0277BD;"><i class="fas fa-save"></i> Simpan Catatan Nutrisi</button>
                            <button type="button" id="btnCancelNutrisiEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data / Card List Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #0277BD;"></i> Riwayat & Rekap Kontrol Nutrisi</div>
                <div id="containerNutrisiCards">
                    <!-- Diisi dinamis oleh JavaScript -->
                </div>
            </div>
        `;
    }

    function init() {
        loadTable();

        var form = document.getElementById('formNutrisi');
        var btnCancel = document.getElementById('btnCancelNutrisiEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = document.getElementById('nutrisiId').value;
                var date = document.getElementById('nutrisiDate').value;
                var timeSlot = document.getElementById('nutrisiTimeSlot').value;
                var hst = document.getElementById('nutrisiHst').value;
                var fase = document.getElementById('nutrisiFase').value;
                var ppm = document.getElementById('nutrisiPpm').value;
                var targetPpm = document.getElementById('nutrisiTargetPpm').value;
                var ph = document.getElementById('nutrisiPh').value;
                var phAction = document.getElementById('nutrisiPhAction').value;
                var waterTemp = document.getElementById('nutrisiWaterTemp').value;
                var roomTemp = document.getElementById('nutrisiRoomTemp').value;
                var desc = document.getElementById('nutrisiDesc').value;

                var payload = {
                    date: date,
                    timeSlot: timeSlot,
                    hst: hst || '-',
                    fase: fase || '-',
                    ppm: ppm || '-',
                    targetPpm: targetPpm || '-',
                    ph: ph || '-',
                    phAction: phAction || 'Aman / Tanpa Koreksi',
                    waterTemp: waterTemp || '-',
                    roomTemp: roomTemp || '-',
                    desc: desc,
                    title: `PPM: ${ppm} (Target: ${targetPpm}) | pH: ${ph}`
                };

                if (id) {
                    payload.id = id;
                    Storage.update(Storage.KEYS.NUTRISI, payload);

                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast('Data nutrisi berhasil diperbarui!', 'success');
                    }
                } else {
                    Storage.add(Storage.KEYS.NUTRISI, payload);

                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast('Data nutrisi berhasil ditambahkan!', 'success');
                    }
                }

                form.reset();
                document.getElementById('nutrisiId').value = '';
                document.getElementById('formTitleNutrisi').innerText = 'Catat Cek Nutrisi Harian';
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                form.reset();
                document.getElementById('nutrisiId').value = '';
                document.getElementById('formTitleNutrisi').innerText = 'Catat Cek Nutrisi Harian';
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerNutrisiCards');
        if (!container) return;

        var data = Storage.getAll(Storage.KEYS.NUTRISI);
        if (data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada catatan nutrisi tercatat.</div>`;
            return;
        }

        // Urutkan dari tanggal terbaru
        data.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        var html = '';
        data.forEach(function(item) {
            // Kompatibilitas data lama jika tersimpan dengan field roomTemp / ghTemp
            var displayRoomTemp = item.roomTemp || item.ghTemp || '-';

            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card: Tanggal & Waktu Cek -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${item.date}</strong>
                            <span style="background: #E1F5FE; color: #0277BD; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">${item.timeSlot || ''}</span>
                        </div>
                    </div>

                    <!-- Grid 4 Kotak (2x2) Ukuran Sama Rata -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Kiri Atas: PPM (Tanpa Kata Air) -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">PPM</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-water" style="color: #0277BD; width: 14px;"></i> <strong>${item.ppm}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-bullseye" style="color: #388E3C; width: 14px;"></i> <strong>Target: ${item.targetPpm}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Kanan Atas: pH & Koreksi -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">pH & Koreksi</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-vial" style="color: #E65100; width: 14px;"></i> <strong>pH ${item.ph}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-tools" style="color: #C62828; width: 14px;"></i> <strong>${item.phAction}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Kiri Bawah: HST & Fase -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">HST & Fase</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-calendar-day" style="color: #6A1B9A; width: 14px;"></i> <strong>HST ${item.hst}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-leaf" style="color: #2E7D32; width: 14px;"></i> <strong>${item.fase}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Kanan Bawah: Suhu Air & Suhu Ruangan -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Suhu Air & Ruangan</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-thermometer-half" style="color: #0288D1; width: 14px;"></i> <strong>Air: ${item.waterTemp}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-home" style="color: #F57F17; width: 14px;"></i> <strong>Ruang: ${displayRoomTemp}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan (Jika Ada) -->
                    ${item.desc ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${item.desc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja (Ikon Pensil di Kiri, Ikon Tong Sampah di Kanan Tanpa Kotak) -->
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
        var item = Storage.getById(Storage.KEYS.NUTRISI, id);
        if (!item) return;

        document.getElementById('nutrisiId').value = item.id;
        document.getElementById('nutrisiDate').value = item.date;
        document.getElementById('nutrisiTimeSlot').value = item.timeSlot || 'Pagi';
        document.getElementById('nutrisiHst').value = (item.hst && item.hst !== '-') ? item.hst : '';
        document.getElementById('nutrisiFase').value = (item.fase && item.fase !== '-') ? item.fase : 'Vegetatif Pertumbuhan';
        document.getElementById('nutrisiPpm').value = (item.ppm && item.ppm !== '-') ? item.ppm : '';
        document.getElementById('nutrisiTargetPpm').value = (item.targetPpm && item.targetPpm !== '-') ? item.targetPpm : '';
        document.getElementById('nutrisiPh').value = (item.ph && item.ph !== '-') ? item.ph : '';
        document.getElementById('nutrisiPhAction').value = (item.phAction && item.phAction !== '-') ? item.phAction : 'Aman / Tanpa Koreksi';
        document.getElementById('nutrisiWaterTemp').value = (item.waterTemp && item.waterTemp !== '-') ? item.waterTemp : '';
        document.getElementById('nutrisiRoomTemp').value = (item.roomTemp || item.ghTemp) ? (item.roomTemp || item.ghTemp) : '';
        document.getElementById('nutrisiDesc').value = item.desc || '';
        document.getElementById('formTitleNutrisi').innerText = 'Edit Data Nutrisi';
        
        var btnCancel = document.getElementById('btnCancelNutrisiEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm('Apakah kamu yakin ingin menghapus data nutrisi ini?')) {
            Storage.remove(Storage.KEYS.NUTRISI, id);
            loadTable();
            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast('Data nutrisi berhasil dihapus', 'error');
            }
        }
    }

    
