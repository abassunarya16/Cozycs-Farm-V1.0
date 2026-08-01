// ==========================================
// COZYCS FARM - LAPORAN & STATISTIK MODULE
// ==========================================

var laporan = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-chart-line"></i> Laporan & Rekapitulasi Farm</div>
                
                <div style="font-size: 13px; color: #666; margin-bottom: 16px;">
                    Ringkasan performa budidaya melon hidroponik di Cozycs Farm.
                </div>

                <!-- Kartu Rekapitulasi -->
                <div class="stats-grid" id="laporanStatsGrid">
                    <!-- Diisi otomatis oleh JavaScript -->
                </div>

                <!-- Tabel Riwayat Ringkas -->
                <div class="section-title" style="margin-top: 24px;"><i class="fas fa-clipboard-list"></i> Ringkasan Panen & Produksi</div>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Periode</th>
                                <th>Total Panen (Buah)</th>
                                <th>Rata-rata Berat</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="laporanTableBody">
                            <!-- Diisi otomatis oleh JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadLaporanData();
    }

    function loadLaporanData() {
        var grid = document.getElementById('laporanStatsGrid');
        var tbody = document.getElementById('laporanTableBody');
        
        var tanamanList = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.TANAMAN) : [];
        var panenList = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.PANEN) : [];

        var totalTanaman = tanamanList.length;
        var totalPanen = panenList.length;

        if (grid) {
            grid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-icon" style="background: #E8F5E9; color: #2E7D32;"><i class="fas fa-seedling"></i></div>
                    <div class="stat-info">
                        <span class="stat-value">${totalTanaman}</span>
                        <span class="stat-label">Total Bibit / Tanaman</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #F3E5F5; color: #6A1B9A;"><i class="fas fa-box"></i></div>
                    <div class="stat-info">
                        <span class="stat-value">${totalPanen}</span>
                        <span class="stat-label">Buah Dipanen</span>
                    </div>
                </div>
            `;
        }

        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td>Musim Tanam 2026 / Periode 1</td>
                    <td><strong>${totalPanen} Buah</strong></td>
                    <td>1.7 kg</td>
                    <td><span class="badge badge-success">Selesai / Sukses</span></td>
                </tr>
            `;
        }
    }

    return {
        render: render,
        init: init
    };

})();
