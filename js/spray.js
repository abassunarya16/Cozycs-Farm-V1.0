// ==========================================
// COZYCS FARM - PENYEMPROTAN (SPRAY) MODULE
// ==========================================

var spray = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-spray-can"></i> Jadwal & Riwayat Penyemprotan</div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #666;">Catat penggunaan pestisida, fungisida, atau vitamin daun.</div>
                    <button class="btn btn-primary" id="btnTambahSpray" style="font-size: 13px; padding: 10px 16px; width: auto;">
                        <i class="fas fa-plus"></i> Tambah Catatan Spray
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Nama Obat / Formula</th>
                                <th>Dosis / Takaran</th>
                                <th>Sasaran</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="sprayTableBody">
                            <!-- Data akan dimuat otomatis -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadSprayData();

        var btnTambah = document.getElementById('btnTambahSpray');
        if (btnTambah) {
            btnTambah.addEventListener('click', function() {
                Helper.showToast('Fitur tambah catatan spray segera hadir!', 'success');
            });
        }
    }

    function loadSprayData() {
        var tbody = document.getElementById('sprayTableBody');
        if (!tbody) return;

        var list = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.SPRAY) : [];

        // Data dummy awal jika masih kosong
        if (list.length === 0) {
            list = [
                { id: 's_1', tanggal: '2026-07-23', namaObat: 'Fungisida Mancozeb', dosis: '2 gram / liter', sasaran: 'Pencegahan Jamur' },
                { id: 's_2', tanggal: '2026-07-30', namaObat: 'Insektisida Abamectin', dosis: '1 ml / liter', sasaran: 'Kutu Kebul & Thrips' }
            ];
            if (typeof Storage !== 'undefined') {
                Storage.saveAll(Storage.KEYS.SPRAY, list);
            }
        }

        tbody.innerHTML = list.map(function(item) {
            return `
                <tr>
                    <td>${Helper.formatDate(item.tanggal)}</td>
                    <td><strong>${item.namaObat}</strong></td>
                    <td>${item.dosis}</td>
                    <td>${item.sasaran}</td>
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
