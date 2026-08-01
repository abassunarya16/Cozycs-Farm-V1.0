// ==========================================
// COZYCS FARM - NUTRISI & PPM MODULE
// ==========================================

var nutrisi = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-flask"></i> Pemantauan Nutrisi, PPM & pH</div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #666;">Catat kepekatan nutrisi harian untuk menjaga kesehatan tanaman melon.</div>
                    <button class="btn btn-primary" id="btnTambahNutrisi" style="font-size: 13px; padding: 10px 16px; width: auto;">
                        <i class="fas fa-plus"></i> Catat Nutrisi
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Zona / Tandon</th>
                                <th>PPM</th>
                                <th>pH</th>
                                <th>Keterangan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="nutrisiTableBody">
                            <!-- Data akan dimuat otomatis -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadNutrisiData();

        var btnTambah = document.getElementById('btnTambahNutrisi');
        if (btnTambah) {
            btnTambah.addEventListener('click', function() {
                Helper.showToast('Fitur catat nutrisi segera hadir!', 'success');
            });
        }
    }

    function loadNutrisiData() {
        var tbody = document.getElementById('nutrisiTableBody');
        if (!tbody) return;

        var list = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.NUTRISI) : [];

        // Data dummy awal jika masih kosong
        if (list.length === 0) {
            list = [
                { id: 'n_1', tanggal: '2026-08-01', zona: 'Zona Utama A', ppm: '1200', ph: '6.2', keterangan: 'Kondisi stabil' },
                { id: 'n_2', tanggal: '2026-07-31', zona: 'Zona Utama A', ppm: '1150', ph: '6.1', keterangan: 'Tambah stok AB Mix' }
            ];
            if (typeof Storage !== 'undefined') {
                Storage.saveAll(Storage.KEYS.NUTRISI, list);
            }
        }

        tbody.innerHTML = list.map(function(item) {
            return `
                <tr>
                    <td>${Helper.formatDate(item.tanggal)}</td>
                    <td><strong>${item.zona}</strong></td>
                    <td><strong>${item.ppm} PPM</strong></td>
                    <td>${item.ph} pH</td>
                    <td>${item.keterangan}</td>
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
