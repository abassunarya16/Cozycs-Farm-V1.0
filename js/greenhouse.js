// ==========================================
// COZYCS FARM - GREENHOUSE MODULE
// ==========================================

var greenhouse = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-house-chimney-window"></i> Manajemen Greenhouse</div>
                
                <div style="background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #e8e8e8; margin-bottom: 16px;">
                    <div style="font-size: 15px; font-weight: 700; color: #1B5E20; margin-bottom: 8px;">Greenhouse Utama - Cozycs Farm</div>
                    <div style="font-size: 13px; color: #666; margin-bottom: 16px;">
                        Lokasi: Pesawaran, Lampung<br>
                        Komoditas: Melon Hidroponik Premium
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-primary" id="btnTambahGH" style="font-size: 13px; padding: 10px 16px;">
                            <i class="fas fa-plus"></i> Tambah Zona / Instalasi
                        </button>
                    </div>
                </div>

                <div class="section-title" style="margin-top: 20px;"><i class="fas fa-list"></i> Daftar Zona Greenhouse</div>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Nama Zona</th>
                                <th>Kapasitas</th>
                                <th>Sistem</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="greenhouseTableBody">
                            <!-- Data akan dimuat otomatis -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadGreenhouseData();
        
        var btnTambah = document.getElementById('btnTambahGH');
        if (btnTambah) {
            btnTambah.addEventListener('click', function() {
                Helper.showToast('Fitur tambah zona greenhouse segera hadir!', 'success');
            });
        }
    }

    function loadGreenhouseData() {
        var tbody = document.getElementById('greenhouseTableBody');
        if (!tbody) return;

        var list = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.GREENHOUSE) : [];

        // Jika data masih kosong, buatkan data default
        if (list.length === 0) {
            list = [
                { id: 'gh_1', nama: 'Zona Utama A', kapasitas: '100 Tanaman', sistem: 'Drip Irrigation', status: 'Aktif' },
                { id: 'gh_2', nama: 'Zona Pembibitan B', kapasitas: '50 Tanaman', sistem: 'NFT / Wick', status: 'Aktif' }
            ];
            if (typeof Storage !== 'undefined') {
                Storage.saveAll(Storage.KEYS.GREENHOUSE, list);
            }
        }

        tbody.innerHTML = list.map(function(item) {
            return `
                <tr>
                    <td><strong>${item.nama}</strong></td>
                    <td>${item.kapasitas}</td>
                    <td>${item.sistem}</td>
                    <td><span class="badge badge-success">${item.status}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-action btn-edit" title="Edit"><i class="fas fa-edit"></i></button>
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
