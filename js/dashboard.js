// ==========================================
// COZYCS FARM - DASHBOARD MODULE (BERSIH)
// ==========================================

var dashboard = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <!-- Welcome Card -->
                <div class="welcome-card">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <div style="font-size: 13px; opacity: 0.9; margin-bottom: 2px;"><i class="fas fa-sun"></i> Selamat Pagi</div>
                            <div style="font-size: 18px; font-weight: 700;">Semoga panen melimpah hari ini!</div>
                        </div>
                        <div style="text-align: right; font-size: 12px; opacity: 0.9;">
                            <div><i class="fas fa-calendar-alt"></i> ${Helper.formatDate(Helper.getTodayDate())}</div>
                            <div style="margin-top: 2px;"><i class="fas fa-map-marker-alt"></i> Metro, Lampung</div>
                        </div>
                    </div>
                </div>

                <!-- Section: Statistik Utama -->
                <div class="section-title"><i class="fas fa-chart-pie"></i> Ringkasan Farm</div>
                
                <div class="stats-grid" id="dashboardStatsGrid">
                    <!-- Data Statistik akan diisi otomatis oleh JavaScript -->
                </div>

                <!-- Quick Actions / Menu Cepat -->
                <div class="section-title" style="margin-top: 24px;"><i class="fas fa-bolt"></i> Aksi Cepat</div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
                    <button class="btn btn-primary" data-page="tanaman" style="justify-content: flex-start; padding: 14px;">
                        <i class="fas fa-seedling" style="font-size: 18px;"></i> Kelola Tanaman
                    </button>
                    <button class="btn btn-primary" data-page="nutrisi" style="justify-content: flex-start; padding: 14px; background-color: #1B5E20;">
                        <i class="fas fa-flask" style="font-size: 18px;"></i> Cek Nutrisi PPM
                    </button>
                </div>
            </div>
        `;
    }

    function init() {
        loadDashboardStats();
    }

    function loadDashboardStats() {
        var grid = document.getElementById('dashboardStatsGrid');
        if (!grid) return;

        // Ambil data dari storage lokal
        var tanamanList = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.TANAMAN) : [];
        var polinasiList = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.POLINASI) : [];
        var buahList = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.BUAH) : [];
        var panenList = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.PANEN) : [];
        var jadwalList = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.JADWAL) : [];

        var totalTanaman = tanamanList.length;
        var tanamanHidup = tanamanList.filter(function(t) { return t.status !== 'Mati'; }).length;
        var totalPolinasi = polinasiList.length;
        var fixBuah = buahList.filter(function(b) { return b.status === 'Fix' || b.status === 'Lolos'; }).length;
        
        var today = Helper.getTodayDate();
        var panenHariIni = panenList.filter(function(p) { return p.tanggal === today; }).length;
        var tugasPending = jadwalList.filter(function(j) { return !j.completed; }).length;

        grid.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon" style="background: #E8F5E9; color: #2E7D32;"><i class="fas fa-seedling"></i></div>
                <div class="stat-info">
                    <span class="stat-value">${totalTanaman}</span>
                    <span class="stat-label">Total Tanaman</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #FFF3E0; color: #E65100;"><i class="fas fa-heart"></i></div>
                <div class="stat-info">
                    <span class="stat-value">${tanamanHidup}</span>
                    <span class="stat-label">Tanaman Hidup</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #E3F2FD; color: #1565C0;"><i class="fas fa-feather"></i></div>
                <div class="stat-info">
                    <span class="stat-value">${totalPolinasi}</span>
                    <span class="stat-label">Sudah Polinasi</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #FFEBEE; color: #C62828;"><i class="fas fa-apple-alt"></i></div>
                <div class="stat-info">
                    <span class="stat-value">${fixBuah}</span>
                    <span class="stat-label">Fix Buah</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #F3E5F5; color: #6A1B9A;"><i class="fas fa-box"></i></div>
                <div class="stat-info">
                    <span class="stat-value">${panenHariIni}</span>
                    <span class="stat-label">Panen Hari Ini</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #E0F2F1; color: #00695C;"><i class="fas fa-tasks"></i></div>
                <div class="stat-info">
                    <span class="stat-value">${tugasPending}</span>
                    <span class="stat-label">Tugas Pending</span>
                </div>
            </div>
        `;
    }

    return {
        render: render,
        init: init
    };

})();
