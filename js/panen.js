// ==========================================
// COZYCS FARM - DATA PANEN MODULE
// ==========================================

var panen = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-box"></i> Pencatatan Hasil Panen</div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #666;">Catat berat buah, tingkat kemanisan (°Brix), dan grade penjualan.</div>
                    <button class="btn btn-primary" id="btnTambahPanen" style="font-size: 13px; padding: 10px 16px; width: auto;">
                        <i class="fas fa-plus"></i> Catat Panen Baru
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Kode / Tanaman</th>
                                <th>Berat (kg)</th>
                                <th>Brix (°Brix)</th>
                                <th>Grade</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="panenTableBody">
                            <!-- Data akan dimuat otomatis -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadPanenData();

        var btnTambah = document.getElementById('btnTambahPanen');
        if (btnTambah) {
            btnTambah.addEventListener('click', function() {
                Helper.showToast('Fitur catat panen segera hadir!', 'success');
            });
        }
    }

    function loadPanenData() {
        var tbody = document.getElementById('panenTableBody');
        if (!tbody) return;

        var list = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.PANEN) : [];

        // Data dummy awal jika masih kosong
        if (list.length === 0) {
            list = [
                { id: 'pn_1', tanggal: '2026-07-15', kode: 'A-01', berat: '1.8 kg', brix: '14.5 °Brix', grade: 'Grade A' },
                { id: 'pn_2', tanggal: '2026-07-15', kode: 'A-02', berat: '1.6 kg', brix: '14.0 °Brix', grade: 'Grade A' }
            ];
            if (typeof Storage !== 'undefined') {
                Storage.saveAll(Storage.KEYS.PANEN, list);
            }
        }

        tbody.innerHTML = list.map(function(item) {
            return `
                <tr>
                    <td>${Helper.formatDate(item.tanggal)}</td>
                    <td><strong>${item.kode}</strong></td>
                    <td>${item.berat}</td>
                    <td>${item.brix}</td>
                    <td><span class="badge badge-success">${item.grade}</span></td>
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
