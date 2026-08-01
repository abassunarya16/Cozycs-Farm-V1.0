// ==========================================
// COZYCS FARM - POLINASI MODULE
// ==========================================

var polinasi = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-feather"></i> Pencatatan Polinasi Bunga</div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #666;">Catat tanggal penyerbukan dan tentukan ruas bunga yang ideal.</div>
                    <button class="btn btn-primary" id="btnTambahPolinasi" style="font-size: 13px; padding: 10px 16px; width: auto;">
                        <i class="fas fa-plus"></i> Tambah Polinasi
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Kode Tanaman</th>
                                <th>Tgl Polinasi</th>
                                <th>No. Ruas</th>
                                <th>Petugas</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="polinasiTableBody">
                            <!-- Data akan dimuat otomatis -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadPolinasiData();

        var btnTambah = document.getElementById('btnTambahPolinasi');
        if (btnTambah) {
            btnTambah.addEventListener('click', function() {
                Helper.showToast('Fitur tambah polinasi segera hadir!', 'success');
            });
        }
    }

    function loadPolinasiData() {
        var tbody = document.getElementById('polinasiTableBody');
        if (!tbody) return;

        var list = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.POLINASI) : [];

        // Data dummy awal jika masih kosong
        if (list.length === 0) {
            list = [
                { id: 'p_1', kodeTanaman: 'A-01', tanggalPolinasi: '2026-07-20', ruas: 'Ruas 10', petugas: 'Abas', status: 'Berhasil' },
                { id: 'p_2', kodeTanaman: 'A-02', tanggalPolinasi: '2026-07-21', ruas: 'Ruas 11', petugas: 'Abas', status: 'Berhasil' }
            ];
            if (typeof Storage !== 'undefined') {
                Storage.saveAll(Storage.KEYS.POLINASI, list);
            }
        }

        tbody.innerHTML = list.map(function(item) {
            return `
                <tr>
                    <td><strong>${item.kodeTanaman}</strong></td>
                    <td>${Helper.formatDate(item.tanggalPolinasi)}</td>
                    <td>${item.ruas}</td>
                    <td>${item.petugas}</td>
                    <td><span class="badge badge-success">${item.status}</span></td>
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
