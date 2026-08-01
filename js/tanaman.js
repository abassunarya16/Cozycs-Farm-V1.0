// ==========================================
// COZYCS FARM - TANAMAN & HST MODULE
// ==========================================

var tanaman = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-seedling"></i> Manajemen Tanaman & HST</div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #666;">Pantau umur tanaman dan status kesehatan per pohon/jalur.</div>
                    <button class="btn btn-primary" id="btnTambahTanaman" style="font-size: 13px; padding: 10px 16px; width: auto;">
                        <i class="fas fa-plus"></i> Tambah Tanaman
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Kode / Baris</th>
                                <th>Varietas</th>
                                <th>Tgl Tanam</th>
                                <th>HST</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="tanamanTableBody">
                            <!-- Data akan dimuat otomatis -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadTanamanData();

        var btnTambah = document.getElementById('btnTambahTanaman');
        if (btnTambah) {
            btnTambah.addEventListener('click', function() {
                Helper.showToast('Fitur tambah tanaman segera hadir!', 'success');
            });
        }
    }

    function loadTanamanData() {
        var tbody = document.getElementById('tanamanTableBody');
        if (!tbody) return;

        var list = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.TANAMAN) : [];

        // Data dummy awal jika masih kosong
        if (list.length === 0) {
            list = [
                { id: 't_1', kode: 'A-01', varietas: 'Golden Aroma', tanggalTanam: '2026-07-01', status: 'Hidup' },
                { id: 't_2', kode: 'A-02', varietas: 'Inthanon', tanggalTanam: '2026-07-01', status: 'Hidup' },
                { id: 't_3', kode: 'B-01', varietas: 'Glamour', tanggalTanam: '2026-07-05', status: 'Hidup' }
            ];
            if (typeof Storage !== 'undefined') {
                Storage.saveAll(Storage.KEYS.TANAMAN, list);
            }
        }

        tbody.innerHTML = list.map(function(item) {
            // Hitung HST (Hari Setelah Tanam)
            var tglTanam = new Date(item.tanggalTanam);
            var today = new Date();
            var diffTime = Math.abs(today - tglTanam);
            var hst = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            var badgeClass = item.status === 'Hidup' ? 'badge-success' : 'badge-danger';

            return `
                <tr>
                    <td><strong>${item.kode}</strong></td>
                    <td>${item.varietas}</td>
                    <td>${Helper.formatDate(item.tanggalTanam)}</td>
                    <td><strong>${hst} HST</strong></td>
                    <td><span class="badge ${badgeClass}">${item.status}</span></td>
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
