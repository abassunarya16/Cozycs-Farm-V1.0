// ==========================================
// COZYCS FARM - SELEKSI BUAH MODULE
// ==========================================

var buah = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-apple-alt"></i> Seleksi & Pemeliharaan Buah</div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #666;">Pilih buah terbaik per tanaman untuk hasil panen optimal.</div>
                    <button class="btn btn-primary" id="btnTambahBuah" style="font-size: 13px; padding: 10px 16px; width: auto;">
                        <i class="fas fa-plus"></i> Tambah Seleksi Buah
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Kode Tanaman</th>
                                <th>Tgl Seleksi</th>
                                <th>Posisi Buah</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="buahTableBody">
                            <!-- Data akan dimuat otomatis -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadBuahData();

        var btnTambah = document.getElementById('btnTambahBuah');
        if (btnTambah) {
            btnTambah.addEventListener('click', function() {
                Helper.showToast('Fitur tambah seleksi buah segera hadir!', 'success');
            });
        }
    }

    function loadBuahData() {
        var tbody = document.getElementById('buahTableBody');
        if (!tbody) return;

        var list = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.BUAH) : [];

        // Data dummy awal jika masih kosong
        if (list.length === 0) {
            list = [
                { id: 'b_1', kodeTanaman: 'A-01', tanggalSeleksi: '2026-07-28', posisi: 'Ruas 10', status: 'Fix' },
                { id: 'b_2', kodeTanaman: 'A-02', tanggalSeleksi: '2026-07-29', posisi: 'Ruas 11', status: 'Fix' }
            ];
            if (typeof Storage !== 'undefined') {
                Storage.saveAll(Storage.KEYS.BUAH, list);
            }
        }

        tbody.innerHTML = list.map(function(item) {
            return `
                <tr>
                    <td><strong>${item.kodeTanaman}</strong></td>
                    <td>${Helper.formatDate(item.tanggalSeleksi)}</td>
                    <td>${item.posisi}</td>
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
