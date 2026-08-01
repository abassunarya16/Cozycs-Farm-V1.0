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
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Jenis Pestisida / Fungisida / Pupuk</label>
                            <input type="text" id="sprayName" required placeholder="Contoh: Fungisida Dithane M-45" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                        </div>

                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Pelaksanaan</label>
                            <input type="date" id="sprayDate" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                        </div>

                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Dosis & Catatan</label>
                            <textarea id="sprayDesc" rows="2" placeholder="Contoh: 2 gram per liter air, semprot merata ke daun bagian bawah..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
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
                                <th>Jenis / Dosis</th>
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
                var name = document.getElementById('sprayName').value;
                var date = document.getElementById('sprayDate').value;
                var desc = document.getElementById('sprayDesc').value;

                var payload = {
                    title: 'Spray: ' + name,
                    desc: desc || 'Penyemprotan rutin tanaman hidroponik.',
                    date: date,
                    module: 'spray',
                    icon: 'fa-spray-can',
                    color: '#6A1B9A',
                    bg: '#F3E5F5'
                };

                if (id) {
                    // Update data yang sudah ada menggunakan Storage master
                    payload.id = id;
                    Storage.update(Storage.KEYS.SPRAY, payload);
                    
                    // Sinkronisasi juga ke tabel schedules alarm
                    syncToSchedules(payload);

                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast('Jadwal spray berhasil diperbarui!', 'success');
                    }
                } else {
                    // Tambah data baru menggunakan Storage master
                    var added = Storage.add(Storage.KEYS.SPRAY, payload);
                    if (added) {
                        // Sinkronisasi ke tabel schedules alarm
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

        // Mengambil data dari master Storage.KEYS.SPRAY
        var data = Storage.getAll(Storage.KEYS.SPRAY);
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #777; padding: 20px;">Belum ada jadwal spray tercatat.</td></tr>`;
            return;
        }

        var html = '';
        data.forEach(function(item) {
            html += `
                <tr>
                    <td><strong>${item.date}</strong></td>
                    <td>
                        <div style="font-weight: 600; color: #222;">${item.title}</div>
                        <div style="font-size: 11px; color: #666; margin-top: 2px;">${item.desc || '-'}</div>
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

        // Ekstrak nama asli dari title "Spray: [Nama]"
        var cleanName = item.title.replace('Spray: ', '');

        document.getElementById('sprayId').value = item.id;
        document.getElementById('sprayName').value = cleanName;
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
            
            // Hapus juga dari master schedules alarm
            removeFromSchedules(id);

            loadTable();
            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast('Jadwal spray berhasil dihapus', 'error');
            }
        }
    }

    // Sinkronisasi ke master schedules untuk alarm H-1
    function syncToSchedules(item) {
        var schedules = Storage.getAll('cozycs_schedules');
        var index = schedules.findIndex(function(s) { return s.id === item.id; });
        if (index >= 0) {
            schedules[index] = item;
        } else {
            schedules.unshift(item);
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
