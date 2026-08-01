// ==========================================
// COZYCS FARM - PRUNING / PEREMPELAN MODULE
// ==========================================

var pruning = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-cut"></i> Jadwal & Catatan Pruning</div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #666;">Catat kegiatan perempelan tunas air dan daun tua secara berkala.</div>
                    <button class="btn btn-primary" id="btnTambahPruning" style="font-size: 13px; padding: 10px 16px; width: auto;">
                        <i class="fas fa-plus"></i> Tambah Catatan Pruning
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Kode Tanaman</th>
                                <th>Jenis Pruning</th>
                                <th>Petugas</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="pruningTableBody">
                            <!-- Data akan dimuat otomatis -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadPruningData();

        var btnTambah = document.getElementById('btnTambahPruning');
        if (btnTambah) {
            btnTambah.addEventListener('click', function() {
                Helper.showToast('Fitur tambah catatan pruning segera hadir!', 'success');
            });
        }
    }

    function loadPruningData() {
        var tbody = document.getElementById('pruningTableBody');
        if (!tbody) return;

        var list = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.PRUNING) : [];

        // Data dummy awal jika masih kosong
        if (list.length === 0) {
            list = [
                { id: 'pr_1', tanggal: '2026-07-25', kodeTanaman: 'A-01', jenis: 'Perempelan Tunas Air (Bawah)', petugas: 'Abas' },
                { id: 'pr_2', tanggal: '2026-07-27', kodeTanaman: 'A-02', jenis: 'Pemangkasan Daun Tua', petugas: 'Abas' }
            ];
            if (typeof Storage !== 'undefined') {
                Storage.saveAll(Storage.KEYS.PRUNING, list);
            }
        }

        tbody.innerHTML = list.map(function(item) {
            return `
                <tr>
                    <td>${Helper.formatDate(item.tanggal)}</td>
                    <td><strong>${item.kodeTanaman}</strong></td>
                    <td>${item.jenis}</td>
                    <td>${item.petugas}</td>
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
