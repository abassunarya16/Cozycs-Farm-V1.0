// ==========================================
// COZYCS FARM - MODUL JADWAL & RIWAYAT SPRAY (CRUD)
// ==========================================

var spray = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-spray-can" style="color: #6A1B9A;"></i> Jadwal & Riwayat Spray</div>
                
                <!-- Form Input / Edit Data Spray -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #6A1B9A; margin-bottom: 12px;" id="formTitleSpray">Tambah Jadwal / Aksi Spray</div>
                    <form id="formSpray">
                        <input type="hidden" id="sprayId">
                        
                        <!-- 1. Tanggal Pelaksanaan di Paling Atas -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Pelaksanaan</label>
                            <input type="date" id="sprayDate" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                        </div>

                        <!-- 2. Waktu Penyemprotan (Pagi / Sore) -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Waktu Penyemprotan</label>
                            <select id="sprayTimeSlot" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                <option value="Pagi (06:00 - 08:00)">Pagi (06:00 - 08:00)</option>
                                <option value="Sore (16:00 - 17:30)">Sore (16:00 - 17:30)</option>
                            </select>
                        </div>

                        <!-- 3. Nama Produk Terpisah (Bubuk & Cairan) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Nama Produk (Bubuk)</label>
                                <input type="text" id="sprayProductBubuk" placeholder="Contoh: Antracol" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Nama Produk (Cairan)</label>
                                <input type="text" id="sprayProductCairan" placeholder="Contoh: Demolish" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 4. Jenis Penyemprotan Terpisah (2 Kolom Grid) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Fungisida & Insektisida</label>
                                <input type="text" id="sprayTypeFungInsek" placeholder="Contoh: Antracol / Demolish" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Fertilizer / Pupuk Daun</label>
                                <input type="text" id="sprayTypeFertilizer" placeholder="Contoh: Gandasil D" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 5. Dosis Terpisah (Gram & ml) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Dosis (Gram)</label>
                                <input type="text" id="sprayDoseGram" placeholder="Contoh: 2 gram / 16L" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Dosis (ml)</label>
                                <input type="text" id="sprayDoseMl" placeholder="Contoh: 15 ml / 16L" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 6. Sasaran Hama & Penyakit -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Pengendalian Hama</label>
                                <input type="text" id="sprayTargetHama" placeholder="Contoh: Thrips, Kutu kebul" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Pengendalian Penyakit</label>
                                <input type="text" id="sprayTargetPenyakit" placeholder="Contoh: Powdery mildew, Busuk" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 7. Catatan Tambahan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan Tambahan (Opsional)</label>
                            <textarea id="sprayDesc" rows="2" placeholder="Catatan khusus pelaksanaan..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #6A1B9A;"><i class="fas fa-save"></i> Simpan Jadwal Spray</button>
                            <button type="button" id="btnCancelSprayEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data / Card List Menyamping -->
                <div class="section-title"><i class="fas fa-list" style="color: #6A1B9A;"></i> Rekap Riwayat & Jadwal Spray</div>
                <div id="containerSprayCards">
                    <!-- Diisi dinamis oleh JavaScript -->
                </div>
            </div>
        `;
    }

    function init() {
        loadTable();

        var form = document.getElementById('formSpray');
        var btnCancel = document.getElementById('btnCancelSprayEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = document.getElementById('sprayId').value;
                var date = document.getElementById('sprayDate').value;
                var timeSlot = document.getElementById('sprayTimeSlot').value;
                var productBubuk = document.getElementById('sprayProductBubuk').value;
                var productCairan = document.getElementById('sprayProductCairan').value;
                var typeFungInsek = document.getElementById('sprayTypeFungInsek').value;
                var typeFertilizer = document.getElementById('sprayTypeFertilizer').value;
                var doseGram = document.getElementById('sprayDoseGram').value;
                var doseMl = document.getElementById('sprayDoseMl').value;
                var targetHama = document.getElementById('sprayTargetHama').value;
                var targetPenyakit = document.getElementById('sprayTargetPenyakit').value;
                var desc = document.getElementById('sprayDesc').value;

                var payload = {
                    date: date,
                    timeSlot: timeSlot,
                    productBubuk: productBubuk || '-',
                    productCairan: productCairan || '-',
                    typeFungInsek: typeFungInsek || '-',
                    typeFertilizer: typeFertilizer || '-',
                    doseGram: doseGram || '-',
                    doseMl: doseMl || '-',
                    targetHama: targetHama || '-',
                    targetPenyakit: targetPenyakit || '-',
                    desc: desc,
                    module: 'spray',
                    icon: 'fa-spray-can',
                    color: '#6A1B9A',
                    bg: '#F3E5F5'
                };

                if (id) {
                    payload.id = id;
                    Storage.update(Storage.KEYS.SPRAY, payload);
                    syncToSchedules(payload);

                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast('Jadwal spray berhasil diperbarui!', 'success');
                    }
                } else {
                    var added = Storage.add(Storage.KEYS.SPRAY, payload);
                    if (added) {
                        syncToSchedules(added);
                    }

                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast('Jadwal spray berhasil ditambahkan!', 'success');
                    }
                }

                form.reset();
                document.getElementById('sprayId').value = '';
                document.getElementById('formTitleSpray').innerText = 'Tambah Jadwal / Aksi Spray';
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                form.reset();
                document.getElementById('sprayId').value = '';
                document.getElementById('formTitleSpray').innerText = 'Tambah Jadwal / Aksi Spray';
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerSprayCards');
        if (!container) return;

        var data = Storage.getAll(Storage.KEYS.SPRAY);
        if (data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada jadwal spray tercatat.</div>`;
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
                    <!-- Header Card: Tanggal & Waktu -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${item.date}</strong>
                            <span style="background: #F3E5F5; color: #6A1B9A; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">${item.timeSlot || ''}</span>
                        </div>
                    </div>

                    <!-- Grid 2x2 Rekap Kartu -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        <!-- Kiri Atas: Nama Produk (Bubuk & Cairan) -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Nama Produk</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-box" style="color: #8D6E63; width: 14px;"></i> <strong>${item.productBubuk || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-wine-bottle" style="color: #0288D1; width: 14px;"></i> <strong>${item.productCairan || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- Kanan Atas: Dosis (Gram & ml) -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Dosis Aplikasi</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-weight-hanging" style="color: #6A1B9A; width: 14px;"></i> <strong>${item.doseGram || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-flask" style="color: #0277BD; width: 14px;"></i> <strong>${item.doseMl || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- Kiri Bawah: Jenis Penyemprotan (Fungisida/Insektisida & Fertilizer) -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Jenis Penyemprotan</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-shield-alt" style="color: #C2185B; width: 14px;"></i> <strong>${item.typeFungInsek || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-seedling" style="color: #2E7D32; width: 14px;"></i> <strong>${item.typeFertilizer || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- Kanan Bawah: Sasaran Hama & Penyakit -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Sasaran Hama & Penyakit</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-bug" style="color: #D32F2F; width: 14px;"></i> <strong>${item.targetHama}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-shield-virus" style="color: #7B1FA2; width: 14px;"></i> <strong>${item.targetPenyakit}</strong></div>
                            </div>
                        </div>
                    </div>

                    <!-- Catatan Tambahan -->
                    ${item.desc ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${item.desc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja (Ikon Pensil di Kiri, Ikon Tong Sampah di Kanan Tanpa Kotak) -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #eee; padding-top: 8px; margin-top: 4px;">
                        <span onclick="spray.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="spray.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function editItem(id) {
        var item = Storage.getById(Storage.KEYS.SPRAY, id);
        if (!item) return;

        document.getElementById('sprayId').value = item.id;
        document.getElementById('sprayDate').value = item.date;
        document.getElementById('sprayTimeSlot').value = item.timeSlot || 'Pagi (06:00 - 08:00)';
        document.getElementById('sprayProductBubuk').value = (item.productBubuk && item.productBubuk !== '-') ? item.productBubuk : '';
        document.getElementById('sprayProductCairan').value = (item.productCairan && item.productCairan !== '-') ? item.productCairan : '';
        document.getElementById('sprayTypeFungInsek').value = (item.typeFungInsek && item.typeFungInsek !== '-') ? item.typeFungInsek : '';
        document.getElementById('sprayTypeFertilizer').value = (item.typeFertilizer && item.typeFertilizer !== '-') ? item.typeFertilizer : '';
        document.getElementById('sprayDoseGram').value = (item.doseGram && item.doseGram !== '-') ? item.doseGram : '';
        document.getElementById('sprayDoseMl').value = (item.doseMl && item.doseMl !== '-') ? item.doseMl : '';
        document.getElementById('sprayTargetHama').value = item.targetHama === '-' ? '' : item.targetHama;
        document.getElementById('sprayTargetPenyakit').value = item.targetPenyakit === '-' ? '' : item.targetPenyakit;
        document.getElementById('sprayDesc').value = item.desc || '';

        document.getElementById('formTitleSpray').innerText = 'Edit Jadwal Spray';
        
        var btnCancel = document.getElementById('btnCancelSprayEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm('Apakah kamu yakin ingin menghapus jadwal spray ini?')) {
            Storage.remove(Storage.KEYS.SPRAY, id);
            removeFromSchedules(id);
            loadTable();
            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast('Jadwal spray berhasil dihapus', 'error');
            }
        }
    }

    function syncToSchedules(item) {
        var schedules = Storage.getAll('cozycs_schedules');
        var schedulePayload = Object.assign({}, item, {
            title: 'Spray: ' + (item.productBubuk !== '-' ? item.productBubuk : '') + ' ' + (item.productCairan !== '-' ? item.productCairan : '')
        });
        
        var index = schedules.findIndex(function(s) { return s.id === item.id; });
        if (index >= 0) {
            schedules[index] = schedulePayload;
        } else {
            schedules.unshift(schedulePayload);
        }
        Storage.saveAll('cozycs_schedules', schedules);
    }

  
