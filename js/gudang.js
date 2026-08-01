// ==========================================
// COZYCS FARM - GUDANG & STOK MODULE
// ==========================================

var gudang = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-warehouse"></i> Manajemen Gudang & Stok</div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #666;">Pantau ketersediaan pupuk AB Mix, pestisida, dan alat farm.</div>
                    <button class="btn btn-primary" id="btnTambahGudang" style="font-size: 13px; padding: 10px 16px; width: auto;">
                        <i class="fas fa-plus"></i> Tambah Barang
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Nama Barang</th>
                                <th>Kategori</th>
                                <th>Jumlah / Stok</th>
                                <th>Satuan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="gudangTableBody">
                            <!-- Data akan dimuat otomatis -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadGudangData();

        var btnTambah = document.getElementById('btnTambahGudang');
        if (btnTambah) {
            btnTambah.addEventListener('click', function() {
                Helper.showToast('Fitur tambah barang gudang segera hadir!', 'success');
            });
        }
    }

    function loadGudangData() {
        var tbody = document.getElementById('gudangTableBody');
        if (!tbody) return;

        var list = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.GUDANG) : [];

        // Data dummy awal jika masih kosong
        if (list.length === 0) {
            list = [
                { id: 'g_1', nama: 'Pupuk AB Mix Cair / Pekat', kategori: 'Nutrisi', jumlah: '5', satuan: 'Jerigen (5L)' },
                { id: 'g_2', nama: 'Fungisida Mancozeb', kategori: 'Pestisida', jumlah: '2', satuan: 'Pack (1kg)' }
            ];
            if (typeof Storage !== 'undefined') {
                Storage.saveAll(Storage.KEYS.GUDANG, list);
            }
        }

        tbody.innerHTML = list.map(function(item) {
            return `
                <tr>
                    <td><strong>${item.nama}</strong></td>
                    <td>${item.kategori}</td>
                    <td><strong>${item.jumlah}</strong></td>
                    <td>${item.satuan}</td>
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
