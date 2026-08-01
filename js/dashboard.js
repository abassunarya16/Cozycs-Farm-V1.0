// ==========================================
// COZYCS FARM - DASHBOARD MODULE (UPDATED)
// ==========================================

var dashboard = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <!-- Perbarui Header Kanan: Tambah Ikon Notifikasi -->
                <style>
                    /* Penyesuaian khusus header action untuk ikon notifikasi */
                    .app-header {
                        position: relative;
                    }
                    .header-notif-btn {
                        background: #f1f6f2;
                        border: none;
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #1B5E20;
                        cursor: pointer;
                        position: relative;
                        transition: background 0.2s;
                    }
                    .header-notif-btn:hover {
                        background: #E8F5E9;
                    }
                    .notif-badge {
                        position: absolute;
                        top: 4px;
                        right: 4px;
                        width: 8px;
                        height: 8px;
                        background: #C62828;
                        border-radius: 50%;
                    }
                </style>
                <script>
                    // Update header action container secara dinamis jika diperlukan
                    setTimeout(function() {
                        var headerActions = document.querySelector('.header-actions');
                        if (headerActions && !document.getElementById('btnHeaderNotif')) {
                            headerActions.innerHTML = \`
                                <button class="header-notif-btn" id="btnHeaderNotif" title="Notifikasi & Alarm">
                                    <i class="fas fa-bell"></i>
                                    <span class="notif-badge"></span>
                                </button>
                                <div id="toastContainer" class="toast-container"></div>
                            \`;
                            
                            document.getElementById('btnHeaderNotif').addEventListener('click', function() {
                                Helper.showToast('Alarm: Jadwal penyemprotan pestisida berikutnya dalam 2 hari!', 'error');
                            });
                        }
                    }, 50);
                </script>

                <!-- Ucapan & Waktu -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div>
                        <div style="font-size: 13px; font-weight: 600; color: #2E7D32;" id="greetingText">
                            <i class="fas fa-sun"></i> Selamat Pagi
                        </div>
                        <div style="font-size: 15px; font-weight: 700; color: #111; margin-top: 2px;">
                            Semoga panen melimpah hari ini!
                        </div>
                    </div>
                    <div style="text-align: right; font-size: 11px; color: #666;">
                        <div style="font-weight: 600; color: #333;" id="currentDateText">01 Agu 2026</div>
                        <div style="margin-top: 2px;"><i class="fas fa-map-marker-alt" style="color: #C62828;"></i> Pesawaran, Lampung</div>
                    </div>
                </div>

                <!-- Kartu Statistik Utama -->
                <div class="stats-grid" id="dashboardStatsGrid">
                    <!-- Diisi otomatis oleh JavaScript -->
                </div>

                <!-- Ganti Aksi Cepat dengan Monitoring Sensor & Target Hari Ini -->
                <div class="section-title" style="margin-top: 20px;"><i class="fas fa-sliders-h"></i> Monitoring Sensor & Target Hari Ini</div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                    <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 10px; padding: 12px; text-align: center; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                        <div style="font-size: 10px; color: #777; font-weight: 600;">TARGET PPM</div>
                        <div style="font-size: 16px; font-weight: 700; color: #1B5E20; margin-top: 4px;">1,050 - 1,200</div>
                        <div style="font-size: 10px; color: #2E7D32; margin-top: 2px; background: #E8F5E9; padding: 2px 4px; border-radius: 4px;">Fase Vegetatif</div>
                    </div>
                    <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 10px; padding: 12px; text-align: center; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                        <div style="font-size: 10px; color: #777; font-weight: 600;">TARGET pH</div>
                        <div style="font-size: 16px; font-weight: 700; color: #1565C0; margin-top: 4px;">5.5 - 6.5</div>
                        <div style="font-size: 10px; color: #1565C0; margin-top: 2px; background: #E3F2FD; padding: 2px 4px; border-radius: 4px;">Optimal Serap</div>
                    </div>
                    <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 10px; padding: 12px; text-align: center; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                        <div style="font-size: 10px; color: #777; font-weight: 600;">SUHU AIR</div>
                        <div style="font-size: 16px; font-weight: 700; color: #E65100; margin-top: 4px;">24°C - 26°C</div>
                        <div style="font-size: 10px; color: #E65100; margin-top: 2px; background: #FFF3E0; padding: 2px 4px; border-radius: 4px;">Normal GH</div>
                    </div>
                </div>

                <!-- Ringkasan / Aktivitas Terakhir -->
                <div class="section-title"><i class="fas fa-clipboard-list"></i> Aktivitas & Perawatan Terakhir</div>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Kegiatan</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="dashboardActivityTable">
                            <tr>
                                <td>Hari ini</td>
                                <td>Pengecekan Tandon & PPM AB Mix</td>
                                <td><span class="badge badge-success">Selesai</span></td>
                            </tr>
                            <tr>
                                <td>Kemarin</td>
                                <td>Penyemprotan Preventif Hama</td>
                                <td><span class="badge badge-success">Selesai</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadDashboardData();
    }

    function loadDashboardData() {
        var grid = document.getElementById('dashboardStatsGrid');
        
        var tanamanList = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.TANAMAN) : [];
        var panenList = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.PANEN) : [];

        var totalTanaman = tanamanList.length > 0 ? tanamanList.length : 7;
        var totalPanen = panenList.length;

        if (grid) {
            grid.innerHTML = `
                <div class="stat-card" data-page="tanaman" style="cursor: pointer;">
                    <div class="stat-icon" style="background: #E8F5E9; color: #2E7D32;"><i class="fas fa-seedling"></i></div>
                    <div class="stat-info">
                        <span class="stat-value">${totalTanaman}</span>
                        <span class="stat-label">Total Tanaman</span>
                    </div>
                </div>
                <div class="stat-card" data-page="polinasi" style="cursor: pointer;">
                    <div class="stat-icon" style="background: #FFF3E0; color: #E65100;"><i class="fas fa-heart"></i></div>
                    <div class="stat-info">
                        <span class="stat-value">3</span>
                        <span class="stat-label">Sudah Polinasi</span>
                    </div>
                </div>
                <div class="stat-card" data-page="buah" style="cursor: pointer;">
                    <div class="stat-icon" style="background: #E3F2FD; color: #1565C0;"><i class="fas fa-apple-alt"></i></div>
                    <div class="stat-info">
                        <span class="stat-value">0</span>
                        <span class="stat-label">Fix Buah</span>
                    </div>
                </div>
                <div class="stat-card" data-page="panen" style="cursor: pointer;">
                    <div class="stat-icon" style="background: #F3E5F5; color: #6A1B9A;"><i class="fas fa-box"></i></div>
                    <div class="stat-info">
                        <span class="stat-value">${totalPanen}</span>
                        <span class="stat-label">Panen Hari Ini</span>
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
