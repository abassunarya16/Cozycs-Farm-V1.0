// ==========================================
// COZYCS FARM - EXECUTIVE DASHBOARD (REVISI BANNERS & TOGGLE AIRFLOW)
// ==========================================

var dashboard = (function() {

    var selectedGh = 'ALL';
    var isIotCollapsed = false;
    var isAirflowOn = true; // State toggle switch Airflow Fan

    function render() {
        return `
            <div class="dashboard-container" style="padding-bottom: 30px;">
                
                <!-- 1. SWITCHER / FILTER GREENHOUSE -->
                <div style="background: #fff; padding: 10px 12px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">Pilih Tampilan Greenhouse:</div>
                    <div id="dashGhSwitcher" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;"></div>
                </div>

                <!-- 2. KARTU INFORMASI GH BANNER -->
                <div id="dashGhInfoBanner" style="margin-bottom: 16px;"></div>

                <!-- 3. MONITORING AIR DAN LINGKUNGAN -->
                <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 13px; font-weight: 700; color: #0277BD;"><i class="fas fa-tint" style="margin-right: 4px;"></i> Monitoring Air Dan Lingkungan</span>
                            <span style="font-size: 9px; background: #E1F5FE; color: #0277BD; padding: 2px 6px; border-radius: 8px; font-weight: bold;">Real-time</span>
                        </div>
                        
                        <button onclick="dashboard.toggleIotSection()" title="Toggle Monitoring" style="width: 28px; height: 28px; border-radius: 50%; background: #F0F4F8; border: 1px solid #D0D7DE; color: #0277BD; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0;">
                            <i id="iconToggleIot" class="fas ${isIotCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}" style="font-size: 12px;"></i>
                        </button>
                    </div>

                    <div id="wrapperIotContent" style="display: ${isIotCollapsed ? 'none' : 'block'}; margin-top: 14px; transition: all 0.3s ease;">
                        <div style="font-size: 11px; font-weight: 700; color: #555; margin-bottom: 8px; text-transform: uppercase;">💧 Parameter Air Tandon</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px;" id="dashIotWaterCards"></div>

                        <div style="font-size: 11px; font-weight: 700; color: #555; margin-bottom: 8px; text-transform: uppercase;">☀️ Parameter Lingkungan</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;" id="dashIotEnvCards"></div>
                    </div>
                </div>

                <!-- 4. EXECUTIVE SUMMARY -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px;" id="dashExecutiveSummary"></div>

                <!-- 5. AGENDA HARI INI -->
                <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 13px; font-weight: 700; color: #1B5E20;"><i class="fas fa-tasks" style="color: #2E7D32; margin-right: 6px;"></i> Agenda Hari Ini</span>
                        <span style="font-size: 10px; color: #777;" id="dashTodayDate">Hari Ini</span>
                    </div>
                    <div id="dashTodayAgendaList"></div>
                </div>

                <!-- 6. PROGRESS MUSIM & ESTIMASI OMZET -->
                <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 16px;">
                    <div style="font-size: 13px; font-weight: 700; color: #2E7D32; margin-bottom: 10px;"><i class="fas fa-seedling" style="margin-right: 6px;"></i> Progress Musim & Estimasi Hasil</div>
                    <div id="dashProgressMusim"></div>
                </div>

                <!-- 7. AKTIVITAS TERAKHIR -->
                <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px;">
                    <div style="font-size: 13px; font-weight: 700; color: #424242; margin-bottom: 10px;"><i class="fas fa-history" style="color: #0277BD; margin-right: 6px;"></i> Aktivitas Terakhir (Audit Log)</div>
                    <div id="dashRecentActivities" style="display: flex; flex-direction: column; gap: 8px;"></div>
                </div>

                <!-- 8. QUICK ACTION BUTTONS -->
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
        loadProgressMusim();
        loadRecentActivities();
    }

    function toggleIotSection() {
        isIotCollapsed = !isIotCollapsed;
        var contentEl = document.getElementById('wrapperIotContent');
        var iconEl = document.getElementById('iconToggleIot');

        if (contentEl) contentEl.style.display = isIotCollapsed ? 'none' : 'block';
        if (iconEl) iconEl.className = isIotCollapsed ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    }

    // Toggle Airflow Fan (Klik Switch tanpa teks ON/OFF)
    function toggleAirflow() {
        isAirflowOn = !isAirflowOn;
        loadIotEnvData();
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

    // REVISI POIN 2 & 3: HST FORMAT & TANPA ICON DI TULISAN FASE/STATUS
    function loadGhInfoBanner() {
        var el = document.getElementById('dashGhInfoBanner');
        if (!el) return;

        var dataGh = getData('cozycs_greenhouse');
        var dataTanaman = getData('cozycs_tanaman');

        var currentGh = dataGh.find(function(g) { return g.kode === selectedGh; });
        var currentTanaman = dataTanaman.find(function(t) { return t.gh === selectedGh; });

        var titleZona = selectedGh === 'ALL' ? 'Cozycs Farm (Semua GH)' : (selectedGh + ' - ' + (currentGh ? (currentGh.nama || 'GH') : 'Greenhouse'));
        
        var varietasText = 'Melon Premium';
        var hstText = '45 HST';
        var statusText = 'Saatnya Pembesaran Buah';
        
        if (selectedGh === 'GH-01') {
            varietasText = 'Melon Diva 099';
            hstText = '65 HST';
            statusText = 'Saatnya Panen';
        } else if (selectedGh === 'GH-02') {
            varietasText = 'Melon Diva 095';
            hstText = '30 HST';
            statusText = 'Saatnya Polinasi';
        } else if (currentTanaman) {
            varietasText = currentTanaman.varietas || 'Melon Premium';
            hstText = (currentTanaman.hst || '30') + ' HST';
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
                        <div style="font-size: 13px; font-weight: 600; color: #2E7D32; margin-bottom: 2px;">${varietasText} (${hstText})</div>
                        <!-- MURNI TULISAN TANPA EMOJI / ICON -->
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

    // REVISI POIN 4: TOGGLE SWITCH PADA AIRFLOW FAN (TANPA TULISAN ON/OFF)
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

            <!-- TOGGLE SWITCH INTERAKTIF TANPA TULISAN ON/OFF -->
            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: ${isAirflowOn ? '#EDE7F6' : '#F5F5F5'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.3s ease;">
                        <i class="fas fa-fan" style="color: ${isAirflowOn ? '#512DA8' : '#9E9E9E'}; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">Airflow</div>
                        <div style="font-size: 15px; font-weight: 800; color: ${isAirflowOn ? '#111' : '#888'};">Kipas GH</div>
                    </div>
                </div>
                
                <!-- STYLING TOGGLE PILL MINIMALIS (KLIKABLE) -->
                <div style="display: flex; align-items: center;">
                    <div onclick="dashboard.toggleAirflow()" title="Klik untuk saklar Airflow" style="width: 38px; height: 20px; background: ${isAirflowOn ? '#4CAF50' : '#CCCCCC'}; border-radius: 12px; position: relative; cursor: pointer; transition: background 0.3s ease; box-shadow: inset 0 1px 3px rgba(0,0,0,0.15);">
                        <div style="width: 16px; height: 16px; background: #ffffff; border-radius: 50%; position: absolute; top: 2px; left: ${isAirflowOn ? '20px' : '2px'}; transition: left 0.3s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
                    </div>
                </div>
            </div>
        `;
    }

    // REVISI POIN 1: TEKS "Kapasitas Awal"
    function loadExecutiveSummary() {
        var el = document.getElementById('dashExecutiveSummary');
        if (!el) return;

        var dataGh = getData('cozycs_greenhouse');
        var dataTanaman = getData('cozycs_tanaman');
        var dataBuah = getData('cozycs_buah');
        var dataPolinasi = getData('cozycs_polinasi');

        // 1. Tanaman Aktif
        var totalTanaman = 0;
        var filteredGhList = (selectedGh === 'ALL') ? dataGh : dataGh.filter(function(g) { return g.kode === selectedGh; });
        filteredGhList.forEach(function(g) {
            totalTanaman += (parseFloat(g.populasi) || parseFloat(g.kapasitas) || 490);
        });
        if (totalTanaman === 0) totalTanaman = (selectedGh === 'ALL') ? 980 : 490;

        // 2. Tanaman Hidup
        var tanamanHidup = 0;
        var filteredTanaman = (selectedGh === 'ALL') ? dataTanaman : dataTanaman.filter(function(t) { return t.gh === selectedGh; });
        filteredTanaman.forEach(function(t) {
            tanamanHidup += (parseFloat(t.populasi) || parseFloat(t.jumlah) || 0);
        });
        if (tanamanHidup === 0) tanamanHidup = Math.round(totalTanaman * 0.98);

        // 3. Buah Fix
        var buahFix = 0;
        var filteredBuah = (selectedGh === 'ALL') ? dataBuah : dataBuah.filter(function(b) { return b.gh === selectedGh; });
        filteredBuah.forEach(function(b) {
            buahFix += (parseFloat(b.jumlahFix) || parseFloat(b.jumlah) || 0);
        });
        if (buahFix === 0) buahFix = Math.round(tanamanHidup * 0.95);

        // 4. Estimasi Panen
        var tglPanenStr = '20 Ags 2026';
        var totalEstimasiKg = 0;
        var filteredPolinasi = (selectedGh === 'ALL') ? dataPolinasi : dataPolinasi.filter(function(p) { return p.gh === selectedGh; });
        
        filteredPolinasi.forEach(function(p) {
            var jumlahBunga = parseFloat(p.berhasil) || parseFloat(p.jumlah) || 0;
            totalEstimasiKg += (jumlahBunga * 1.5);
            if (p.tglPanen) tglPanenStr = p.tglPanen;
        });

        if (totalEstimasiKg === 0) {
            totalEstimasiKg = (selectedGh === 'ALL') ? 1420 : 710;
        }

        el.innerHTML = `
            <!-- Grid 1: Tanaman Aktif (Kapasitas Awal) -->
            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">🌱 Tanaman Aktif</div>
                <div style="font-size: 15px; font-weight: 800; color: #2E7D32; margin-top: 4px;">${totalTanaman} Batang</div>
                <div style="font-size: 10px; color: #555; font-weight: 600; margin-top: 2px;">Kapasitas Awal</div>
            </div>

            <!-- Grid 2: Tanaman Hidup -->
            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">🌿 Tanaman Hidup</div>
                <div style="font-size: 15px; font-weight: 800; color: #0277BD; margin-top: 4px;">${tanamanHidup} Pohon</div>
                <div style="font-size: 10px; color: #555; font-weight: 600; margin-top: 2px;">Populasi Aktif</div>
            </div>

            <!-- Grid 3: Buah Fix -->
            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">🍈 Buah Fix</div>
                <div style="font-size: 15px; font-weight: 800; color: #E65100; margin-top: 4px;">${buahFix} Buah</div>
                <div style="font-size: 10px; color: #555; font-weight: 600; margin-top: 2px;">Seleksi Lolos</div>
            </div>

            <!-- Grid 4: Estimasi Panen -->
            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">📅 Estimasi Panen</div>
                <div style="font-size: 13px; font-weight: 800; color: #2E7D32; margin-top: 4px;">${tglPanenStr}</div>
                <div style="font-size: 10px; color: #555; font-weight: 600; margin-top: 2px;">Est. ${totalEstimasiKg} Kg</div>
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
                { id: 'def_1', title: 'Nutrisi ' + (selectedGh === 'ALL' ? 'GH01' : selectedGh) + ' - Cek PPM & pH', status: 'Selesai', date: todayStr },
                { id: 'def_2', title: 'Spray ' + (selectedGh === 'ALL' ? 'GH02' : selectedGh) + ' - Fungisida / Insektisida', status: 'Belum Dikerjakan', date: todayStr },
                { id: 'def_3', title: 'Seleksi Buah & Binding Tali ' + (selectedGh === 'ALL' ? 'GH01' : selectedGh), status: 'Belum Dikerjakan', date: todayStr }
            ];
        }

        var limitedTasks = todayTasks.slice(0, 10);

        var html = '';
        limitedTasks.forEach(function(item) {
            var isDone = item.status === 'Selesai';
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #eee;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" ${isDone ? 'checked' : ''} onchange="dashboard.toggleTask('${item.id}')" style="width: 16px; height: 16px; cursor: pointer;">
                        <span style="font-size: 12px; font-weight: 600; color: ${isDone ? '#888888' : '#222222'};">
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
        toggleAirflow: toggleAirflow,
        toggleTask: toggleTask
    };

})();
