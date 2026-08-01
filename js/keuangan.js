// ==========================================
// COZYCS FARM - KEUANGAN & PEMBUKUAN MODULE
// ==========================================

var keuangan = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-wallet"></i> Keuangan & Arus Kas Farm</div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #666;">Kelola catatan pemasukan hasil panen dan pengeluaran operasional.</div>
                    <button class="btn btn-primary" id="btnTambahKeuangan" style="font-size: 13px; padding: 10px 16px; width: auto;">
                        <i class="fas fa-plus"></i> Tambah Transaksi
                    </button>
                </div>

                <!-- Kartu Ringkasan Keuangan -->
                <div class="stats-grid" id="keuanganStatsGrid" style="margin-bottom: 20px;">
                    <!-- Diisi otomatis oleh JavaScript -->
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Keterangan</th>
                                <th>Jenis</th>
                                <th>Jumlah (Rp)</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="keuanganTableBody">
                            <!-- Data akan dimuat otomatis -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadKeuanganData();

        var btnTambah = document.getElementById('btnTambahKeuangan');
        if (btnTambah) {
            btnTambah.addEventListener('click', function() {
                Helper.showToast('Fitur tambah transaksi keuangan segera hadir!', 'success');
            });
        }
    }

    function loadKeuanganData() {
        var tbody = document.getElementById('keuanganTableBody');
        var grid = document.getElementById('keuanganStatsGrid');
        if (!tbody) return;

        var list = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.KEUANGAN) : [];

        // Data dummy awal jika masih kosong
        if (list.length === 0) {
            list = [
                { id: 'k_1', tanggal: '2026-07-16', keterangan: 'Penjualan Melon Grade A (Musim 1)', jenis: 'Masuk', jumlah: 750000 },
                { id: 'k_2', tanggal: '2026-07-01', keterangan: 'Pembelian Pupuk AB Mix 1 Set', jenis: 'Keluar', jumlah: 250000 }
            ];
            if (typeof Storage !== 'undefined') {
                Storage.saveAll(Storage.KEYS.KEUANGAN, list);
            }
        }

        var totalMasuk = 0;
        var totalKeluar = 0;

        tbody.innerHTML = list.map(function(item) {
            if (item.jenis === 'Masuk') {
                totalMasuk += Number(item.jumlah);
            } else {
                totalKeluar += Number(item.jumlah);
            }

            var badgeClass = item.jenis === 'Masuk' ? 'badge-success' : 'badge-danger';

            return `
                <tr>
                    <td>${Helper.formatDate(item.tanggal)}</td>
                    <td><strong>${item.keterangan}</strong></td>
                    <td><span class="badge ${badgeClass}">${item.jenis}</span></td>
                    <td><strong>${Helper.formatRupiah(item.jumlah)}</strong></td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-action btn-edit" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="btn-action btn-delete" title="Hapus"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        var saldoAkhir = totalMasuk - totalKeluar;

        if (grid) {
            grid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-icon" style="background: #E8F5E9; color: #2E7D32;"><i class="fas fa-arrow-down"></i></div>
                    <div class="stat-info">
                        <span class="stat-value" style="font-size: 16px;">${Helper.formatRupiah(totalMasuk)}</span>
                        <span class="stat-label">Total Pemasukan</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #FFEBEE; color: #C62828;"><i class="fas fa-arrow-up"></i></div>
                    <div class="stat-info">
                        <span class="stat-value" style="font-size: 16px;">${Helper.formatRupiah(totalKeluar)}</span>
                        <span class="stat-label">Total Pengeluaran</span>
                    </div>
                </div>
                <div class="stat-card" style="grid-column: span 2;">
                    <div class="stat-icon" style="background: #E3F2FD; color: #1565C0;"><i class="fas fa-wallet"></i></div>
                    <div class="stat-info">
                        <span class="stat-value" style="font-size: 18px; color: ${saldoAkhir >= 0 ? '#2E7D32' : '#C62828'};">${Helper.formatRupiah(saldoAkhir)}</span>
                        <span class="stat-label">Saldo Bersih Farm</span>
                    </div>
                </div>
            `;
        }
    }

    return {
        render: render,
        init: init
    };

})();
