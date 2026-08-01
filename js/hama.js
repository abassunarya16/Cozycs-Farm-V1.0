// ==========================================
// COZYCS FARM - HAMA & PENYAKIT MODULE
// ==========================================

var hama = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-bug"></i> Pemantauan Hama & Penyakit</div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #666;">Catat gejala serangan hama/penyakit dan tindakan penanganannya.</div>
                    <button class="btn btn-primary" id="btnTambahHama" style="font-size: 13px; padding: 10px 16px; width: auto;">
                        <i class="fas fa-plus"></i> Catat Hama / Penyakit
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Zona / Tanaman</th>
                                <th>Jenis Hama / Penyakit</th>
                                <th>Tingkat Parah</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="hamaTableBody">
                            <!-- Data akan dimuat otomatis -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadHamaData();

        var btnTambah = document.getElementById('btnTambahHama');
        if (btnTambah) {
            btnTambah.addEventListener('click', function() {
                Helper.showToast('Fitur catat hama & penyakit segera hadir!', 'success');
            });
        }
    }

    function loadHamaData() {
        var tbody = document.getElementById('hamaTableBody');
        if (!tbody) return;

        var list = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.HAMA) : [];

        // Data dummy awal jika masih kosong
        if (list.length === 0) {
            list = [
                { id: 'h_1', tanggal: '2026-07-22', lokasi: 'Zona Utama A', jenis: 'Kutu Kebang (Whitefly)', tingkat: 'Ringan', status: 'Teratasi' },
                { id: 'h_2', tanggal: '2026-07-29', lokasi: 'Zona Pembibitan B', jenis: 'Embun Tepung (Powdery Mildew)', tingkat: 'Sedang', status: 'Penanganan' }
            ];
            if (typeof Storage !== 'undefined') {
                Storage.saveAll(Storage.KEYS.HAMA, list);
            }
        }

        tbody.innerHTML = list.map(function(item) {
            var badgeClass = item.status === 'Teratasi' ? 'badge-success' : 'badge-warning';

            return `
                <tr>
                    <td>${Helper.formatDate(item.tanggal)}</td>
                    <td><strong>${item.lokasi}</strong></td>
                    <td>${item.jenis}</td>
                    <td>${item.tingkat}</td>
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
