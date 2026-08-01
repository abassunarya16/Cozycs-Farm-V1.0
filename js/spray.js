// ==========================================
// COZYCS FARM - MODUL JADWAL SPRAY (CRUD)
// ==========================================

var spray = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-spray-can" style="color: #6A1B9A;"></i> Jadwal & Riwayat Spray</div>
                
                <!-- Form Input / Edit Data Spray -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #1B5E20; margin-bottom: 12px;" id="formTitleSpray">Tambah Jadwal / Aksi Spray</div>
                    <form id="formSpray">
                        <input type="hidden" id="sprayId">
                        
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Nama Produk / Pestisida / Fungisida</label>
                            <input type="text" id="sprayProduct" required placeholder="Contoh: Dithane M-45 / Confidor" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                        </div>

                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Dosis</label>
                            <input type="text" id="sprayDose" required placeholder="Contoh: 2 gram / liter air" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Sasaran Hama & Penyakit</label>
                                <select id="sprayTarget" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Pencegahan Umum / Rutin">Pencegahan Umum / Rutin</option>
                                    <option value="Kutu Kebul (Whitefly)">Kutu Kebul (Whitefly)</option>
                                    <option value="Thrips & Tungau">Thrips & Tungau</option>
                                    <option value="Ulat Penggerek Daun/Buah">Ulat Penggerek Daun/Buah</option>
                                    <option value="Jamur / Embun Tepung (Powdery Mildew)">Jamur / Embun Tepung (Powdery Mildew)</option>
                                    <option value="Busuk Batang / Akar (Phytophthora)">Busuk Batang / Akar (Phytophthora)</option>
                                    <option value="Bercak Daun Alternaria">Bercak Daun Alternaria</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Waktu Penyemprotan</label>
                                <select id="sprayTimeSlot" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Pagi (06:00 - 08:00)">Pagi (06:00 - 08:00)</option>
                                    <option value="Sore (16:00 - 17:30)">Sore (16:00 - 17:30)</option>
                                </select>
                            </div>
                        </div>

                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Pelaksanaan</label>
                            <input type="date" id="sprayDate" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                        </div>

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

                <!-- Rekap Data / Tabel Daftar Spray -->
                <div class="section-title"><i class="fas fa-list" style="color: #6A1B9A;"></i> Rekap Riwayat & Jadwal Spray</div>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Produk & Dosis</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="tableSprayBody">
                            <!-- Diisi dinamis oleh JavaScript -->
                        </tbody>
                    </table>
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
                var product = document.getElementById('sprayProduct').value;
                var dose = document.getElementById('sprayDose').value;
                var target = document.getElementById('sprayTarget').value;
                var timeSlot = document.getElementById('sprayTimeSlot').value;
                var date = document.getElementById('sprayDate').value;
                var desc = document.getElementById('sprayDesc').value;

                var payload = {
                    title: product,
                    dose: dose,
                    target: target,
                    timeSlot: timeSlot,
                    desc: desc,
                    date: date,
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
        var tbody = document.getElementById('tableSprayBody');
        if (!tbody) return;

        var data = Storage.getAll(Storage.KEYS.SPRAY);
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #777; padding: 20px;">Belum ada jadwal spray tercatat.</td></tr>`;
            return;
        }

        var html = '';
        data.forEach(function(item) {
            html += `
                <tr>
                    <td>
                        <strong>${item.date}</strong>
                        <div style="font-size: 10px; color: #6A1B9A; font-weight: 600; margin-top: 2px;">${item.timeSlot || ''}</div>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: #222; font-size: 13px;">${item.title}</div>
                        <div style="font-size: 12px; color: #444; margin-top: 1px;">Dosis: <strong>${item.dose}</strong></div>
                        <div style="font-size: 11px; color: #666; margin-top: 2px;"><i class="fas fa-bug" style="color: #C62828;"></i> Sasaran: ${item.target || '-'}</div>
                        ${item.desc ? '<div style="font-size: 11px; color: #777; margin-top: 2px; font-style: italic;">Note: ' + item.desc + '</div>' : ''}
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-action btn-edit" onclick="spray.editItem('${item.id}')" title="Edit"><i class="fas fa-pen"></i></button>
                            <button class="btn-action btn-delete" onclick="spray.deleteItem('${item.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    function editItem(id) {
        var item = Storage.getById(Storage.KEYS.SPRAY, id);
        if (!item) return;

        document.getElementById('sprayId').value = item.id;
        document.getElementById('sprayProduct').value = item.title;
        document.getElementById('sprayDose').value = item.dose || '';
        document.getElementById('sprayTarget').value = item.target || 'Pencegahan Umum / Rutin';
        document.getElementById('sprayTimeSlot').value = item.timeSlot || 'Pagi (06:00 - 08:00)';
        document.getElementById('sprayDate').value = item.date;
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
            title: 'Spray: ' + item.title + ' (Sasaran: ' + item.target + ')'
        });
        
        var index = schedules.findIndex(function(s) { return s.id === item.id; });
        if (index >= 0) {
            schedules[index] = schedulePayload;
        } else {
            schedules.unshift(schedulePayload);
        }
        Storage.saveAll('cozycs_schedules', schedules);
    }

    function removeFromSchedules(id) {
        var schedules = Storage.getAll('cozycs_schedules');
        var filtered = schedules.filter(function(s) { return s.id !== id; });
        Storage.saveAll('cozycs_schedules', filtered);
    }

    return {
        render: render,
        init: init,
        editItem: editItem,
        deleteItem: deleteItem
    };

})();
             
