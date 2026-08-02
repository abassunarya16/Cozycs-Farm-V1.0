// ==========================================
// COZYCS FARM - EXECUTIVE DECISION DASHBOARD (REVISI JUDUL & MINIMALIST TOGGLE)
// ==========================================

var dashboard = (function() {

    var selectedGh = 'ALL';
    var isIotCollapsed = false;

    function render() {
        return `
            <div class="dashboard-container" style="padding-bottom: 30px;">
                <!-- HEADER TITLE -->
                <div class="section-title" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span><i class="fas fa-chart-line" style="color: #2E7D32;"></i> Command & Decision Center</span>
                    <span style="font-size: 11px; background: #E8F5E9; color: #2E7D32; padding: 4px 10px; border-radius: 20px; font-weight: 600;">Owner View</span>
                </div>

                <!-- SWITCHER / FILTER GREENHOUSE -->
                <div style="background: #fff; padding: 10px 12px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">Pilih Tampilan Greenhouse:</div>
                    <div id="dashGhSwitcher" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;"></div>
                </div>

                <!-- KARTU INFORMASI GH BANNER -->
                <div id="dashGhInfoBanner" style="margin-bottom: 16px;"></div>

                <!-- ========================================== -->
                <!-- MONITORING AIR DAN LINGKUNGAN (REVISI JUDUL & MINIMALIST CHEVRON) -->
                <!-- ========================================== -->
                <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Monitoring dengan Tombol Chevron Minimalis Tanpa Teks -->
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 13px; font-weight: 700; color: #0277BD;"><i class="fas fa-tint" style="margin-right: 4px;"></i> Monitoring Air Dan Lingkungan</span>
                            <span style="font-size: 9px; background: #E1F5FE; color: #0277BD; padding: 2px 6px; border-radius: 8px; font-weight: bold;">Real-time</span>
                        </div>
                        
                        <!-- Tombol Chevron Toggle Minimalis -->
                        <button onclick="dashboard.toggleIotSection()" title="Toggle Monitoring" style="width: 28px; height: 28px; border-radius: 50%; background: #F0F4F8; border: 1px solid #D0D7DE; color: #0277BD; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0;">
                            <i id="iconToggleIot" class="fas ${isIotCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}" style="font-size: 12px;"></i>
                        </button>
                    </div>

                    <!-- WRAPPER CONTENT MONITORING -->
                    <div id="wrapperIotContent" style="display: ${isIotCollapsed ? 'none' : 'block'}; margin-top: 14px; transition: all 0.3s ease;">
                        
                        <!-- 1. PARAMETER AIR TANDON -->
                        <div style="font-size: 11px; font-weight: 700; color: #555; margin-bottom: 8px; text-transform: uppercase;">💧 Parameter Air Tandon</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px;" id="dashIotWaterCards"></div>

                        <!-- 2. PARAMETER LINGKUNGAN (NAMA REVISI) -->
                        <div style="font-size: 11px; font-weight: 700; color: #555; margin-bottom: 8px; text-transform: uppercase;">☀️ Parameter Lingkungan</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;" id="dashIotEnvCards"></div>

                    </div>
                </div>

                <!-- EXECUTIVE SUMMARY -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px;" id="dashExecutiveSummary"></div>

                <!-- AGENDA HARI INI -->
                <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 13px; font-weight: 700; color: #1B5E20;"><i class="fas fa-tasks" style="color: #2E7D32; margin-right: 6px;"></i> Agenda Hari Ini</span>
                        <span style="font-size: 10px; color: #777;" id="dashTodayDate">Hari Ini</span>
                    </div>
                    <div id="dashTodayAgendaList"></div>
                </div>

                <!-- STATUS GREENHOUSE REAL-TIME -->
                <div class="section-title" style="font-size: 13px; margin-bottom: 8px;"><i class="fas fa-warehouse" style="color: #0277BD;"></i> Status Operasional Greenhouse</div>
                <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 16px;" id="dashGreenhouseStatusList"></div>

                <!-- WARNING CENTER -->
                <div style="background: #FFF5F5; padding: 14px; border-radius: 12px; border: 1px solid #FFCDD2; margin-bottom: 16px;">
                    <div style="font-size: 13px; font-weight: 700; color: #C62828; margin-bottom: 10px;"><i class="fas fa-exclamation-triangle" style="margin-right: 6px;"></i> Warning & Alert Center</div>
                    <div id="dashWarningList" style="display: flex; flex-direction: column; gap: 8px;"></div>
                </div>

                <!-- PROGRESS MUSIM & ESTIMASI OMZET -->
                <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 16px;">
                    <div style="font-size: 13px; font-weight: 700; color: #2E7D32; margin-bottom: 10px;"><i class="fas fa-seedling" style="margin-right: 6px;"></i> Progress Musim & Estimasi Hasil</div>
                    <div id="dashProgressMusim"></div>
                </div>

                <!-- GRAFIK PANEN PROGRESS BAR -->
                <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 16px;">
                    <div style="font-size: 13px; font-weight: 700; color: #0277BD; margin-bottom: 10px;"><i class="fas fa-chart-bar" style="margin-right: 6px;"></i> Target vs Realisasi Panen</div>
                    <div id="dashPanenProgress"></div>
                </div>

                <!-- RINGKASAN GUDANG & KEUANGAN -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
                    <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8; cursor: pointer;" onclick="window.location.hash='#gudang'">
                        <div style="font-size: 11px; font-weight: 700; color: #E65100; margin-bottom: 6px;"><i class="fas fa-boxes"></i> Stok Gudang</div>
                        <div id="dashGudangSummary" style="font-size: 12px;"></div>
                    </div>
                    <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8;">
                        <div style="font-size: 11px; font-weight: 700; color: #2E7D32; margin-bottom: 6px;"><i class="fas fa-wallet"></i> Keuangan</div>
                        <div id="dashKeuanganSummary" style="font-size: 12px;"></div>
                    </div>
                </div>

                <!-- AKTIVITAS TERAKHIR -->
                <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px;">
                    <div style="font-size: 13px; font-weight: 700; color: #424242; margin-bottom: 10px;"><i class="fas fa-history" style="color: #0277BD; margin-right: 6px;"></i> Aktivitas Terakhir (Audit Log)</div>
                    <div id="dashRecentActivities" style="display: flex; flex-direction: column; gap: 8px;"></div>
                </div>

                <!-- QUICK ACTION BUTTONS -->
                <div style="background: #F5F5F5; padding: 12px; border-radius: 12px; border: 1px solid #e0e0e0;">
                    <div style="font-size: 11px; font-weight: 700; color: #616161; margin-bottom: 8px; text-transform: uppercase;">Quick Action / Input Cepat</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
                        <button onclick="window.location.hash='#nutrisi'" style="padding: 8px 4px; border-radius: 8px; border: 1px solid #B3E5FC; background: #E1F5FE; color: #0277BD; font-weight: bold; font-size: 11px; cursor: pointer;"><i class="fas fa-plus"></i> Nutrisi</button>
                        <button onclick="window.location.hash='#spray'" style="padding: 8px 4px; border-radius: 8px; border: 1px solid #E1BEE7; background: #F3E5F5; color: #6A1B9A; font-weight: bold; font-size: 11px; cursor: pointer;"><i class="fas fa-plus"></i> Spray</button>
                        <button onclick="window.location.hash='#gudang'" style="padding: 8px 4px; border-radius: 8px; border: 1px solid #FFE0B2; background: #FFF3E0; color: #E65100; font-weight: bold; font-size: 11px; cursor: pointer;"><i class="fas fa-plus"></i> Gudang</button>
                        <button onclick="window.location.hash='#panen'" style="padding: 8px 4px; border-radius: 8px; border: 1px solid #C8E6C9; background: #E8F5E9; color: #2E7D32; font-weight: bold; font-size: 11px; cursor: pointer;"><i class="fas fa-plus"></i> Panen</button>
                        <button onclick="window.location.hash='#jadwal'" style="padding: 8px 4px; border-radius: 8px; border: 1px solid #D1C4E9; background: #EDE7F6; color: #512DA8; font-weight: bold; font-size: 11px; cursor: pointer;"><i class="fas fa-plus"></i> Jadwal</button>
                        <button onclick="window.location.hash='#hama'" style="padding: 8px 4px; border-radius: 8px; border: 1px solid #FFCDD2; background: #FFEBEE; color: #C62828; font-weight: bold; font-size: 11px; cursor: pointer;"><i class="fas fa-plus"></i> Hama</button>
                    </div>
                </div>
            </div>
        `;
    }

    function init() {
        renderGhSwitcher();
        refreshAllDashboardData();
    }

    function refreshAllDashboardData() {
        loadGhInfoBanner();
        loadIotWaterData();
        loadIotEnvData();
        loadExecutiveSummary();
        loadTodayAgenda();
        loadGreenhouseStatus();
        loadWarningCenter();
        loadProgressMusim();
        loadPanenProgress();
        loadGudangSummary();
        loadKeuanganSummary();
        loadRecentActivities();
    }

    // TOGGLE MINIMALIS CHEVRON SAJA
    function toggleIotSection() {
        isIotCollapsed = !isIotCollapsed;
        var contentEl = document.getElementById('wrapperIotContent');
        var iconEl = document.getElementById('iconToggleIot');

        if (contentEl) contentEl.style.display = isIotCollapsed ? 'none' : 'block';
        if (iconEl) iconEl.className = isIotCollapsed ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    }

    function getData(key) {
        try {
            if (typeof Storage !== 'undefined' && Storage.getAll) {
                return Storage.getAll(key) || [];
            }
        } catch(e) {}
        return [];
    }

    function renderGhSwitcher() {
        var el = document.getElementById('dashGhSwitcher');
        if (!el) return;

        var dataGh = getData('cozycs_greenhouse');
        if (dataGh.length === 0) {
            dataGh = [
                { kode: 'GH-01', nama: 'Melon Intanon' },
                { kode: 'GH-02', nama: 'Melon Talent' }
            ];
        }

        var html = `
            <button onclick="dashboard.selectGhFilter('ALL')" style="padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; border: none; cursor: pointer; white-space: nowrap; ${selectedGh === 'ALL' ? 'background: #2E7D32; color: #fff;' : 'background: #f0f0f0; color: #555;'}">
                🌐 Semua GH
            </button>
        `;

        dataGh.forEach(function(gh) {
            var isSelected = selectedGh === gh.kode;
            html += `
                <button onclick="dashboard.selectGhFilter('${gh.kode}')" style="padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; border: none; cursor: pointer; white-space: nowrap; ${isSelected ? 'background: #2E7D32; color: #fff;' : 'background: #f0f0f0; color: #555;'}">
                    🏡 ${gh.kode}
                </button>
            `;
        });

        el.innerHTML = html;
    }

    function selectGhFilter(kodeGh) {
        selectedGh = kodeGh;
        renderGhSwitcher();
        refreshAllDashboardData();
    }

    function loadGhInfoBanner() {
        var el = document.getElementById('dashGhInfoBanner');
        if (!el) return;

        var dataGh = getData('cozycs_greenhouse');
        var dataTanaman = getData('cozycs_tanaman');

        var currentGh = dataGh.find(function(g) { return g.kode === selectedGh; });
        var currentTanaman = dataTanaman.find(function(t) { return t.gh === selectedGh; });

        var titleZona = selectedGh === 'ALL' ? 'Cozycs Farm (Semua GH)' : (selectedGh + ' - ' + (currentGh ? (currentGh.nama || 'GH') : 'Greenhouse'));
        
        var varietasText = 'Melon Premium';
        var hstText = '45';
        var statusText = 'Saatnya Pembesaran Buah';
        
        if (selectedGh === 'GH-01') {
            varietasText = 'Melon Diva 099';
            hstText = '65';
            statusText = 'Saatnya Panen 🍈';
        } else if (selectedGh === 'GH-02') {
            varietasText = 'Melon Diva 095';
            hstText = '30';
            statusText = 'Saatnya Polinasi 🌸';
        } else if (currentTanaman) {
            varietasText = currentTanaman.varietas || 'Melon Premium';
            hstText = currentTanaman.hst || '30';
            statusText = currentTanaman.status || 'Saatnya Pemeliharaan';
        }

        var melonImgUrl = (currentGh && currentGh.fotoUrl) ? currentGh.fotoUrl : 'https://cdn-icons-png.flaticon.com/512/2909/2909787.png';

        el.innerHTML = `
            <div style="background: #F4F6F8; border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.03); border: 1px solid #EAEAEA;">
                <div style="display: flex; align-items: center; gap: 14px;">
                    <div style="width: 58px; height: 58px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.06); flex-shrink: 0; padding: 6px;">
                        <img src="${melonImgUrl}" alt="Melon" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div>
                        <div style="font-size: 15px; font-weight: 800; color: #111; margin-bottom: 2px;">${titleZona}</div>
                        <div style="font-size: 13px; font-weight: 600; color: #2E7D32; margin-bottom: 2px;">${varietasText} (${hstText} hari)</div>
                        <div style="font-size: 12px; font-weight: 700; color: #00897B;">${statusText}</div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button onclick="window.location.hash='#tanaman'" title="Detail Tanaman" style="width: 36px; height: 36px; border-radius: 50%; background: #fff; border: 1px solid #E0E0E0; color: #2E7D32; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                        <i class="fas fa-seedling" style="font-size: 15px;"></i>
                    </button>
                    <button onclick="window.location.hash='#greenhouse'" title="Pengaturan GH" style="width: 36px; height: 36px; border-radius: 50%; background: #fff; border: 1px solid #E0E0E0; color: #0277BD; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                        <i class="fas fa-sliders-h" style="font-size: 15px;"></i>
                    </button>
                </div>
            </div>
        `;
    }

    function loadIotWaterData() {
        var el = document.getElementById('dashIotWaterCards');
        if (!el) return;

        var dataNutrisi = getData('cozycs_nutrisi');
        var filteredNutrisi = (selectedGh === 'ALL') ? dataNutrisi : dataNutrisi.filter(function(n) { return n.gh === selectedGh; });
        var latest = filteredNutrisi.pop() || {};

        var valPpm = latest.ppm || (selectedGh === 'GH-02' ? '950' : '1180');
        var valPh = latest.ph || '6.1';
        var valWaterTemp = latest.waterTemp || '26.5°C';

        el.innerHTML = `
            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #E8F5E9; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-seedling" style="color: #2E7D32; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">Nutrisi</div>
                        <div style="font-size: 18px; font-weight: 800; color: #111;">${valPpm} <span style="font-size: 10px; font-weight: 600; color: #888;">ppm</span></div>
                    </div>
                </div>
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">Baik</span></div>
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #E1F5FE; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-vial" style="color: #0288D1; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">pH Air</div>
                        <div style="font-size: 18px; font-weight: 800; color: #111;">${valPh} <span style="font-size: 10px; font-weight: 600; color: #888;">pH</span></div>
                    </div>
                </div>
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">Optimal</span></div>
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #E0F7FA; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-thermometer-half" style="color: #00838F; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">Suhu Air</div>
                        <div style="font-size: 18px; font-weight: 800; color: #111;">${valWaterTemp}</div>
                    </div>
                </div>
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">Sejuk</span></div>
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #E1F5FE; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-water" style="color: #0277BD; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">Tandon Air</div>
                        <div style="font-size: 18px; font-weight: 800; color: #111;">85 <span style="font-size: 10px; font-weight: 600; color: #888;">%</span></div>
                    </div>
                </div>
                <div><span style="background: #E1F5FE; color: #0277BD; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">Cukup</span></div>
            </div>
        `;
    }

    function loadIotEnvData() {
        var el = document.getElementById('dashIotEnvCards');
        if (!el) return;

        var dataNutrisi = getData('cozycs_nutrisi');
        var filteredNutrisi = (selectedGh === 'ALL') ? dataNutrisi : dataNutrisi.filter(function(n) { return n.gh === selectedGh; });
        var latest = filteredNutrisi.pop() || {};

        var valRoomTemp = latest.roomTemp || (selectedGh === 'GH-02' ? '32.0°C' : '29.5°C');

        el.innerHTML = `
            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #FFF3E0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-temperature-high" style="color: #E65100; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">Suhu Udara</div>
                        <div style="font-size: 18px; font-weight: 800; color: #111;">${valRoomTemp}</div>
                    </div>
                </div>
                <div><span style="background: #FFF3E0; color: #E65100; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">Hangat</span></div>
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #E3F2FD; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-tint-slash" style="color: #1E88E5; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">Kelembaban</div>
                        <div style="font-size: 18px; font-weight: 800; color: #111;">68 <span style="font-size: 10px; font-weight: 600; color: #888;">%</span></div>
                    </div>
                </div>
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">Ideal</span></div>
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #FFFDE7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-sun" style="color: #F57F17; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">Cahaya</div>
                        <div style="font-size: 18px; font-weight: 800; color: #111;">35k <span style="font-size: 10px; font-weight: 600; color: #888;">Lux</span></div>
                    </div>
                </div>
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">Sangat Baik</span></div>
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #EDE7F6; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-fan" style="color: #512DA8; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">Airflow</div>
                        <div style="font-size: 18px; font-weight: 800; color: #111;">Aktif</div>
                    </div>
                </div>
                <div><span style="background: #EDE7F6; color: #512DA8; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">ON</span></div>
            </div>
        `;
    }

    function loadExecutiveSummary() {
        var el = document.getElementById('dashExecutiveSummary');
        if (!el) return;

        var dataGh = getData('cozycs_greenhouse');
        var dataGudang = getData('cozycs_gudang');
        var dataPolinasi = getData('cozycs_polinasi');

        var totalTanaman = 0;
        var filteredGhList = (selectedGh === 'ALL') ? dataGh : dataGh.filter(function(g) { return g.kode === selectedGh; });

        if (filteredGhList.length === 0 && selectedGh !== 'ALL') {
            filteredGhList = [{ kode: selectedGh, populasi: 490 }];
        } else if (filteredGhList.length === 0 && selectedGh === 'ALL') {
            filteredGhList = [{ kode: 'GH-01', populasi: 490 }, { kode: 'GH-02', populasi: 490 }];
        }

        filteredGhList.forEach(function(g) {
            totalTanaman += (parseFloat(g.populasi) || parseFloat(g.kapasitas) || 490);
        });

        var nilaiGudang = 0;
        dataGudang.forEach(function(b) {
            nilaiGudang += ((parseFloat(b.stok) || 0) * (parseFloat(b.harga) || 0));
        });

        var totalEstimasiPanenKg = 0;
        var filteredPolinasi = (selectedGh === 'ALL') ? dataPolinasi : dataPolinasi.filter(function(p) { return p.gh === selectedGh; });
        
        filteredPolinasi.forEach(function(p) {
            var jumlahBunga = parseFloat(p.berhasil) || parseFloat(p.jumlah) || 0;
            totalEstimasiPanenKg += (jumlahBunga * 1.5);
        });

        if (totalEstimasiPanenKg === 0) {
            totalEstimasiPanenKg = selectedGh === 'ALL' ? 1820 : 910;
        }

        var formatRupiah = function(val) {
            return 'Rp' + val.toLocaleString('id-ID');
        };

        el.innerHTML = `
            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">🌱 Tanaman (${selectedGh})</div>
                <div style="font-size: 16px; font-weight: bold; color: #2E7D32; margin-top: 2px;">${totalTanaman} Batang</div>
            </div>
            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">🏡 GH Dipilih</div>
                <div style="font-size: 16px; font-weight: bold; color: #0277BD; margin-top: 2px;">${selectedGh === 'ALL' ? dataGh.length || 2 : selectedGh}</div>
            </div>
            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">📦 Nilai Gudang</div>
                <div style="font-size: 13px; font-weight: bold; color: #E65100; margin-top: 2px;">${formatRupiah(nilaiGudang > 0 ? nilaiGudang : 18250000)}</div>
            </div>
            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">🍈 Est. Panen</div>
                <div style="font-size: 16px; font-weight: bold; color: #2E7D32; margin-top: 2px;">${totalEstimasiPanenKg} Kg</div>
            </div>
        `;
    }

    function loadTodayAgenda() {
        var el = document.getElementById('dashTodayAgendaList');
        var dateEl = document.getElementById('dashTodayDate');
        if (!el) return;

        var todayStr = new Date().toISOString().split('T')[0];
        if (dateEl) dateEl.innerText = todayStr;

        var schedules = getData('cozycs_schedules');
        var todayTasks = schedules.filter(function(s) {
            var matchDate = (s.date === todayStr || s.tanggal === todayStr);
            var matchGh = (selectedGh === 'ALL') || (s.gh === selectedGh) || (s.gh === 'Seluruh Farm');
            return matchDate && matchGh;
        });

        if (todayTasks.length === 0) {
            todayTasks = [
                { id: 'def_1', title: 'Nutrisi ' + (selectedGh === 'ALL' ? 'GH01' : selectedGh) + ' - Cek PPM & pH', status: 'Selesai', gh: selectedGh },
                { id: 'def_2', title: 'Spray ' + (selectedGh === 'ALL' ? 'GH02' : selectedGh) + ' - Fungisida / Insektisida', status: 'Belum Dikerjakan', gh: selectedGh }
            ];
        }

        var html = '';
        todayTasks.forEach(function(item) {
            var isDone = item.status === 'Selesai';
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #eee;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" ${isDone ? 'checked' : ''} onchange="dashboard.toggleTask('${item.id}')" style="width: 16px; height: 16px; cursor: pointer;">
                        <span style="font-size: 12px; font-weight: 600; text-decoration: ${isDone ? 'line-through' : 'none'}; color: ${isDone ? '#888' : '#222'};">
                            ${item.title || item.judul || 'Agenda Kegiatan'}
                        </span>
                    </div>
                    <span style="font-size: 10px; background: ${isDone ? '#E8F5E9' : '#FFF3E0'}; color: ${isDone ? '#2E7D32' : '#E65100'}; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                        ${isDone ? 'DONE' : 'PENDING'}
                    </span>
                </div>
            `;
        });

        el.innerHTML = html;
    }

    function loadGreenhouseStatus() {
        var el = document.getElementById('dashGreenhouseStatusList');
        if (!el) return;

        var dataGh = getData('cozycs_greenhouse');
        var dataNutrisi = getData('cozycs_nutrisi');

        if (dataGh.length === 0) {
            dataGh = [
                { kode: 'GH-01', nama: 'Melon Intanon', fase: 'Pembesaran Buah', hst: 43 },
                { kode: 'GH-02', nama: 'Melon Talent', fase: 'Vegetatif Pertumbuhan', hst: 18 }
            ];
        }

        var filteredGh = (selectedGh === 'ALL') ? dataGh : dataGh.filter(function(g) { return g.kode === selectedGh; });

        if (filteredGh.length === 0) {
            filteredGh = [{ kode: selectedGh, nama: 'Melon Special', fase: 'Pembesaran Buah', hst: 30 }];
        }

        var html = '';
        filteredGh.forEach(function(gh) {
            var nut = dataNutrisi.filter(function(n) { return n.gh === gh.kode; }).pop() || {};

            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${gh.kode}</strong>
                            <span style="font-size: 11px; color: #666; margin-left: 6px;">(${gh.nama || 'GH'})</span>
                        </div>
                        <span style="font-size: 10px; background: #E8F5E9; color: #2E7D32; padding: 2px 8px; border-radius: 6px; font-weight: bold;">
                            Fase: ${gh.fase || 'Pembesaran'}
                        </span>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; text-align: center; background: #F9F9F9; padding: 8px; border-radius: 8px;">
                        <div>
                            <div style="font-size: 9px; color: #777;">PPM</div>
                            <div style="font-size: 12px; font-weight: bold; color: #0277BD;">${nut.ppm || '1180'}</div>
                        </div>
                        <div>
                            <div style="font-size: 9px; color: #777;">pH</div>
                            <div style="font-size: 12px; font-weight: bold; color: #E65100;">${nut.ph || '6.1'}</div>
                        </div>
                        <div>
                            <div style="font-size: 9px; color: #777;">HST</div>
                            <div style="font-size: 12px; font-weight: bold; color: #222;">${gh.hst || '43'}</div>
                        </div>
                        <div>
                            <div style="font-size: 9px; color: #777;">STATUS</div>
                            <div style="font-size: 11px; font-weight: bold; color: #2E7D32;">Normal</div>
                        </div>
                    </div>
                </div>
            `;
        });

        el.innerHTML = html;
    }

    function loadWarningCenter() {
        var el = document.getElementById('dashWarningList');
        if (!el) return;

        var gudang = getData('cozycs_gudang');
        var hama = getData('cozycs_hama');

        var warnings = [];

        if (selectedGh === 'ALL') {
            gudang.forEach(function(g) {
                if ((parseFloat(g.stok) || 0) <= (parseFloat(g.stokMin) || 0)) {
                    warnings.push(`🔴 <strong>${g.nama}</strong> sisa ${g.stok} ${g.satuan} di Gudang (Perlu Restock!)`);
                }
            });
        }

        var filteredHama = (selectedGh === 'ALL') ? hama : hama.filter(function(h) { return h.gh === selectedGh; });
        filteredHama.forEach(function(h) {
            if (h.tingkat && h.tingkat.indexOf('Ringan') === -1) {
                warnings.push(`🟡 Temuan <strong>${h.nama}</strong> di ${h.gh || selectedGh} (${h.tingkat})`);
            }
        });

        if (warnings.length === 0) {
            if (selectedGh === 'GH-01' || selectedGh === 'ALL') {
                warnings.push('🔴 pH Air Tandon GH-01 sedikit terlalu tinggi (6.8)');
            }
            if (selectedGh === 'GH-02' || selectedGh === 'ALL') {
                warnings.push('🟡 Thrips terdeteksi di GH-02 (Baris B)');
            }
            if (warnings.length === 0) {
                warnings.push('🟢 Semua parameter aman untuk ' + selectedGh);
            }
        }

        var html = '';
        warnings.forEach(function(w) {
            html += `<div style="font-size: 12px; color: #222; line-height: 1.4;">${w}</div>`;
        });

        el.innerHTML = html;
    }

    function loadProgressMusim() {
        var el = document.getElementById('dashProgressMusim');
        if (!el) return;

        var estimasiKg = (selectedGh === 'ALL') ? 1820 : 910;
        var hargaPerKg = 20000;
        var estimasiOmzet = estimasiKg * hargaPerKg;

        el.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                <span><strong>Musim 4 (${selectedGh})</strong>: Ripening (${selectedGh === 'GH-02' ? '45%' : '82%'})</span>
                <span style="font-weight: bold; color: #2E7D32;">Est. Omzet: Rp${estimasiOmzet.toLocaleString('id-ID')}</span>
            </div>
            <div style="width: 100%; background: #E0E0E0; height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 8px;">
                <div style="width: ${selectedGh === 'GH-02' ? '45%' : '82%'}; background: #2E7D32; height: 100%;"></div>
            </div>
            <div style="font-size: 10px; color: #666;">*Kalkulasi: ${estimasiKg} Kg × Rp${hargaPerKg.toLocaleString('id-ID')}/Kg</div>
        `;
    }

    function loadPanenProgress() {
        var el = document.getElementById('dashPanenProgress');
        if (!el) return;

        var targetKg = (selectedGh === 'ALL') ? 600 : 300;
        var panenReal = (selectedGh === 'ALL') ? 420 : 210;
        var percentage = Math.round((panenReal / targetKg) * 100);

        el.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 6px;">
                <span>Panen ${selectedGh}: ${panenReal} Kg / ${targetKg} Kg</span>
                <span style="color: #0277BD;">${percentage}%</span>
            </div>
            <div style="width: 100%; background: #E0E0E0; height: 12px; border-radius: 6px; overflow: hidden;">
                <div style="width: ${percentage}%; background: #0277BD; height: 100%;"></div>
            </div>
        `;
    }

    function loadGudangSummary() {
        var el = document.getElementById('dashGudangSummary');
        if (!el) return;

        var gudang = getData('cozycs_gudang');
        var totalItem = gudang.length || 68;
        var kritis = 0;

        gudang.forEach(function(g) {
            if ((parseFloat(g.stok) || 0) <= (parseFloat(g.stokMin) || 0)) kritis++;
        });

        el.innerHTML = `
            <div style="color: #333;">Total: <strong>${totalItem} Item</strong></div>
            <div style="color: #C62828; font-weight: bold; margin-top: 2px;">Kritis: ${kritis > 0 ? kritis : 2} Barang</div>
        `;
    }

    function loadKeuanganSummary() {
        var el = document.getElementById('dashKeuanganSummary');
        if (!el) return;

        var omzetText = selectedGh === 'ALL' ? 'Rp21.0M' : 'Rp10.5M';
        var labaText = selectedGh === 'ALL' ? 'Rp8.7M' : 'Rp4.3M';

        el.innerHTML = `
            <div style="color: #333;">Omzet: <strong>${omzetText}</strong></div>
            <div style="color: #2E7D32; font-weight: bold; margin-top: 2px;">Laba: ${labaText}</div>
        `;
    }

    function loadRecentActivities() {
        var el = document.getElementById('dashRecentActivities');
        if (!el) return;

        var logs = [
            { time: '09.30', gh: 'GH-01', text: 'Tambah Nutrisi GH-01 (PPM 1180)' },
            { time: '09.15', gh: 'GH-02', text: 'Aplikasi Spray Insektisida GH-02' },
            { time: '08.40', gh: 'ALL', text: 'Input Stok Masuk Gudang (AB Mix 10 Kg)' },
            { time: '08.10', gh: 'GH-01', text: 'Pencatatan Hasil Panen GH-01 (120 Kg)' }
        ];

        var filteredLogs = (selectedGh === 'ALL') ? logs : logs.filter(function(l) { return l.gh === selectedGh || l.gh === 'ALL'; });

        var html = '';
        filteredLogs.forEach(function(l) {
            html += `
                <div style="display: flex; gap: 10px; font-size: 11px; align-items: center; border-bottom: 1px dashed #f0f0f0; padding-bottom: 4px;">
                    <span style="font-weight: bold; color: #0277BD; width: 40px;">${l.time}</span>
                    <span style="color: #333;">${l.text}</span>
                </div>
            `;
        });

        el.innerHTML = html;
    }

    function toggleTask(id) {
        var schedules = getData('cozycs_schedules');
        var item = schedules.find(function(s) { return s.id === id; });
        if (item) {
            item.status = (item.status === 'Selesai') ? 'Belum Dikerjakan' : 'Selesai';
            if (typeof Storage !== 'undefined' && Storage.saveAll) {
                Storage.saveAll('cozycs_schedules', schedules);
            }
        }
        loadTodayAgenda();
    }

    return {
        render: render,
        init: init,
        selectGhFilter: selectGhFilter,
        toggleIotSection: toggleIotSection,
        toggleTask: toggleTask
    };

})();
