// ==========================================
// COZYCS FARM - JADWAL & TUGAS MODULE
// ==========================================

var jadwal = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-tasks"></i> Jadwal & Tugas Farm</div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #666;">Kelola daftar tugas harian dan pengingat perawatan tanaman.</div>
                    <button class="btn btn-primary" id="btnTambahJadwal" style="font-size: 13px; padding: 10px 16px; width: auto;">
                        <i class="fas fa-plus"></i> Tambah Tugas
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Nama Tugas</th>
                                <th>Kategori</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="jadwalTableBody">
                            <!-- Data akan dimuat otomatis -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadJadwalData();

        var btnTambah = document.getElementById('btnTambahJadwal');
        if (btnTambah) {
            btnTambah.addEventListener('click', function() {
                Helper.showToast('Fitur tambah tugas segera hadir!', 'success');
            });
        }
    }

    function loadJadwalData() {
        var tbody = document.getElementById('jadwalTableBody');
        if (!tbody) return;

        var list = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.JADWAL) : [];

        // Data dummy awal jika masih kosong
        if (list.length === 0) {
            list = [
                { id: 'j_1', tanggal: '2026-08-01', namaTugas: 'Cek PPM & pH Tandon Utama', kategori: 'Nutrisi', completed: false },
                { id: 'j_2', tanggal: '2026-08-02', namaTugas: 'Penyemprotan Fungisida Preventif', kategori: 'Spray', completed: false }
            ];
            if (typeof Storage !== 'undefined') {
                Storage.saveAll(Storage.KEYS.JADWAL, list);
            }
        }

        tbody.innerHTML = list.map(function(item) {
            var statusBadge = item.completed 
                ? '<span class="badge badge-success">Selesai</span>' 
                : '<span class="badge badge-warning">Pending</span>';

            return `
                <tr>
                    <td>${Helper.formatDate(item.tanggal)}</td>
                    <td><strong>${item.namaTugas}</strong></td>
                    <td>${item.kategori}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-action btn-edit" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="btn-action btn-delete" title="Hapus"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    return {
        render: render,
        init: init
    };

})();
