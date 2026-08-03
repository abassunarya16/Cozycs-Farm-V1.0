// ==========================================
// COZYCS FARM - EXECUTIVE DASHBOARD (FULL DYNAMIC & ZERO MOCK)
// ==========================================

var dashboard = (function() {

    var selectedGh = 'ALL';
    var isIotCollapsed = false;
    var isAirflowOn = false;
    var clockInterval = null;

    // Default Cuaca Pesawaran (Diisi otomatis oleh API Open-Meteo)
    var pesawaranWeather = {
        temp: '-°C',
        humidity: '-%',
        icon: '⛅'
    };

    function render() {
        return `
            <div class="dashboard-container" style="padding-bottom: 30px;">
                
                <!-- 0. WELCOME BANNER, REAL-TIME CLOCK & WEATHER -->
                <div id="dashWelcomeBanner" style="margin-bottom: 12px;"></div>

                <!-- 1. SWITCHER / FILTER GREENHOUSE -->
                <div style="background: #fff; padding: 10px 12px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">Pilih Tampilan Greenhouse:</div>
                    <div id="dashGhSwitcher" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;"></div>
                </div>

                <!-- 2. KARTU INFORMASI GH BANNER -->
                <div id="dashGhInfoBanner" style="margin-bottom: 16px;"></div>

                <!-- 3. MONITORING AIR DAN LINGKUNGAN (SENSOR LOG) -->
                <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 13px; font-weight: 700; color: #0277BD;"><i class="fas fa-tint" style="margin-right: 4px;"></i> Monitoring Air Dan Lingkungan</span>
                            <span style="font-size: 9px; background: #E1F5FE; color: #0277BD; padding: 2px 6px; border-radius: 8px; font-weight: bold;">Terbaru</span>
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

                <!-- 4. EXECUTIVE SUMMARY (POPULASI & EST. PANEN) -->
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

                <!-- 7. AKTIVITAS TERAKHIR (LOG) -->
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
        startLiveClock();
        fetchPesawaranWeather();
    }

    function getData(key) {
        try {
            if (typeof Storage !== 'undefined' && Storage.getAll) {
                return Storage.getAll(key) || [];
            }
        } catch(e) {}
        return [];
    }

    function startLiveClock() {
        if (clockInterval) clearInterval(clockInterval);

        clockInterval = setInterval(function() {
            var dateTimeEl = document.getElementById('liveDateTime');
            var greetingEl = document.getElementById('liveGreetingText');

            if (dateTimeEl && typeof Helper !== 'undefined' && Helper.getFullDateTime) {
                dateTimeEl.textContent = Helper.getFullDateTime();
            }
            if (greetingEl && typeof Helper !== 'undefined' && Helper.getGreeting) {
                greetingEl.textContent = Helper.getGreeting().text;
            }
        }, 10000);
    }

    function fetchPesawaranWeather() {
        var apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=-5.4287&longitude=105.1800&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FJakarta';

        fetch(apiUrl)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data && data.current) {
                    var temp = Math.round(data.current.temperature_2m) + '°C';
                    var humidity = Math.round(data.current.relative_humidity_2m) + '%';
                    var icon = parseWeatherIcon(data.current.weather_code);

                    pesawaranWeather = { temp: temp, humidity: humidity, icon: icon };

                    var tempEl = document.getElementById('liveWeatherTemp');
                    var humEl = document.getElementById('liveWeatherHumidity');
                    var iconEl = document.getElementById('liveWeatherIcon');

                    if (tempEl) tempEl.textContent = temp;
                    if (humEl) humEl.textContent = humidity;
                    if (iconEl) iconEl.textContent = icon;
                }
            })
            .catch(function(err) {});
    }

    function parseWeatherIcon(code) {
        if (code === 0) return '☀️';
        if (code >= 1 && code <= 3) return '⛅';
        if (code === 45 || code === 48) return '🌫️';
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return '🌧️';
        if (code >= 95 && code <= 99) return '⛈️';
        return '⛅';
    }

    function refreshAllDashboardData() {
        loadWelcomeBanner();
        loadGhInfoBanner();
        loadIotWaterData();
        loadIotEnvData();
        loadExecutiveSummary();
        loadTodayAgenda();
        loadProgressMusim();
        loadRecentActivities();
    }

    function loadWelcomeBanner() {
        var el = document.getElementById('dashWelcomeBanner');
        if (!el) return;

        var greeting = (typeof Helper !== 'undefined' && Helper.getGreeting) ? Helper.getGreeting() : { text: 'Selamat Sore', icon: '⛅' };
        var dateTimeStr = (typeof Helper !== 'undefined' && Helper.getFullDateTime) ? Helper.getFullDateTime() : 'Senin, 03 Agu 2026 | 15:29 WIB';

        el.innerHTML = `
            <div style="background: #ffffff; border-radius: 16px; padding: 16px; border: 1px solid #e8e8e8; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 46px; height: 46px; border-radius: 50%; background: #E8F5E9; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; border: 1px solid #C8E6C9;">
                            👨‍🌾
                        </div>
                        <div>
                            <div id="liveGreetingText" style="font-size: 16px; font-weight: 800; color: #1B5E20; line-height: 1.2;">
                                ${greeting.text}
                            </div>
                            <div style="font-size: 11px; color: #666; margin-top: 3px;">
                                Semoga panen melimpah hari ini!
                            </div>
                        </div>
                    </div>

                    <div style="text-align: right; flex-shrink: 0;">
                        <div id="liveWeatherIcon" style="font-size: 22px; line-height: 1;">${pesawaranWeather.icon}</div>
                        <div id="liveWeatherTemp" style="font-size: 15px; font-weight: 800; color: #222; margin-top: 2px;">
                            ${pesawaranWeather.temp}
                        </div>
                        <div id="liveWeatherHumidity" style="font-size: 10px; color: #888; font-weight: 600;">
                            ${pesawaranWeather.humidity}
                        </div>
                    </div>
                </div>

                <div style="border-top: 1px dashed #E0E0E0; margin-bottom: 10px;"></div>

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #555;">
                    <div style="display: flex; align-items: center; gap: 6px; font-weight: 600;">
                        <i class="far fa-calendar-alt" style="color: #2E7D32; font-size: 12px;"></i>
                        <span id="liveDateTime">${dateTimeStr}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px; color: #D32F2F; font-weight: 700;">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Pesawaran</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderGhSwitcher() {
        var el = document.getElementById('dashGhSwitcher');
        if (!el) return;

        var dataGh = getData('cozycs_greenhouse');

        var html = `
            <button onclick="dashboard.selectGhFilter('ALL')" style="padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; border: none; cursor: pointer; white-space: nowrap; ${selectedGh === 'ALL' ? 'background: #2E7D32; color: #fff;' : 'background: #f0f0f0; color: #555;'}">
                🌐 Semua GH
            </button>
        `;

        if (dataGh.length > 0) {
            dataGh.forEach(function(gh) {
                var isSelected = selectedGh === gh.kode;
                html += `
                    <button onclick="dashboard.selectGhFilter('${gh.kode}')" style="padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; border: none; cursor: pointer; white-space: nowrap; ${isSelected ? 'background: #2E7D32; color: #fff;' : 'background: #f0f0f0; color: #555;'}">
                        🏡 ${gh.kode || gh.nama}
                    </button>
                `;
            });
        }

        el.innerHTML = html;
    }

    function selectGhFilter(kodeGh) {
        selectedGh = kodeGh;
        renderGhSwitcher();
        refreshAllDashboardData();
    }

    // BANNER DATA GREENHOUSE DINAMIS
    function loadGhInfoBanner() {
        var el = document.getElementById('dashGhInfoBanner');
        if (!el) return;

        var dataGh = getData('cozycs_greenhouse');
        var dataTanaman = getData('cozycs_tanaman');
        var melonImgUrl = 'https://cdn-icons-png.flaticon.com/512/2909/2909787.png';

        if (dataGh.length === 0) {
            el.innerHTML = `
                <div style="background: #F5F5F5; border-radius: 16px; padding: 14px 16px; text-align: center; border: 1px dashed #CCC; color: #777; font-size: 12px;">
                    <i class="fas fa-warehouse" style="font-size: 20px; color: #888; margin-bottom: 6px; display: block;"></i>
                    Belum ada Greenhouse terdaftar. Silakan tambahkan data di modul <strong>Greenhouse</strong>.
                </div>
            `;
            return;
        }

        if (selectedGh === 'ALL') {
            var listGhHtml = '';
            dataGh.forEach(function(g) {
                var currentTanaman = dataTanaman.find(function(t) { return t.gh === g.kode || t.ghId === g.id; });
                var varietas = (currentTanaman && currentTanaman.varietas) ? currentTanaman.varietas : (g.nama || 'Tanpa Varietas');
                var hst = (currentTanaman && (currentTanaman.hst !== undefined)) ? currentTanaman.hst + ' HST' : '0 HST';

                listGhHtml += `
                    <div style="font-size: 12px; font-weight: 600; color: #2E7D32; display: flex; align-items: center; gap: 6px; margin-top: 3px;">
                        <span>🏡</span>
                        <span>${g.kode || g.nama}: ${varietas} (${hst})</span>
                    </div>
                `;
            });

            el.innerHTML = `
                <div style="background: #F4F6F8; border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.03); border: 1px solid #EAEAEA;">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="width: 58px; height: 58px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.06); flex-shrink: 0; padding: 6px;">
                            <img src="${melonImgUrl}" alt="Melon" style="width: 100%; height: 100%; object-fit: contain;">
                        </div>
                        <div>
                            <div style="font-size: 15px; font-weight: 800; color: #111; margin-bottom: 2px;">Cozycs Farm (Semua GH)</div>
                            ${listGhHtml}
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button onclick="window.location.hash='#tanaman'" title="Detail Tanaman" style="width: 36px; height: 36px; border-radius: 50%; background: #fff; border: 1px solid #E0E0E0; color: #2E7D32; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <i class="fas fa-seedling" style="font-size: 15px;"></i>
                        </button>
                        <button onclick="window.location.hash='#greenhouse'" title="Pengaturan GH" style="width: 36px; height: 36px; border-radius: 50%; background: #fff; border: 1px solid #E0E0E0; color: #0277BD; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <i class="fas fa-sliders-h" style="font-size: 15px;"></i>
                        </button>
                    </div>
                </div>
            `;
        } else {
            var currentGh = dataGh.find(function(g) { return g.kode === selectedGh; });
            var currentTanaman = dataTanaman.find(function(t) { return t.gh === selectedGh || t.ghId === (currentGh ? currentGh.id : ''); });

            var titleZona = selectedGh + ' - ' + (currentGh ? (currentGh.nama || 'Greenhouse') : 'Greenhouse');
            var varietasText = (currentTanaman && currentTanaman.varietas) ? currentTanaman.varietas : 'Belum Ada Tanaman';
            var hstText = (currentTanaman && currentTanaman.hst !== undefined) ? currentTanaman.hst + ' HST' : '0 HST';
            var statusText = (currentTanaman && currentTanaman.status) ? currentTanaman.status : 'Fase Pertumbuhan';
            var singleMelonImg = (currentGh && currentGh.fotoUrl) ? currentGh.fotoUrl : melonImgUrl;

            el.innerHTML = `
                <div style="background: #F4F6F8; border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.03); border: 1px solid #EAEAEA;">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="width: 58px; height: 58px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.06); flex-shrink: 0; padding: 6px;">
                            <img src="${singleMelonImg}" alt="Melon" style="width: 100%; height: 100%; object-fit: contain;">
                        </div>
                        <div>
                            <div style="font-size: 15px; font-weight: 800; color: #111; margin-bottom: 2px;">${titleZona}</div>
                            <div style="font-size: 13px; font-weight: 600; color: #2E7D32; margin-bottom: 2px;">${varietasText} (${hstText})</div>
                            <div style="font-size: 12px; font-weight: 700; color: #00897B;">${statusText}</div>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button onclick="window.location.hash='#tanaman'" title="Detail Tanaman" style="width: 36px; height: 36px; border-radius: 50%; background: #fff; border: 1px solid #E0E0E0; color: #2E7D32; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <i class="fas fa-seedling" style="font-size: 15px;"></i>
                        </button>
                        <button onclick="window.location.hash='#greenhouse'" title="Pengaturan GH" style="width: 36px; height: 36px; border-radius: 50%; background: #fff; border: 1px solid #E0E0E0; color: #0277BD; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <i class="fas fa-sliders-h" style="font-size: 15px;"></i>
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // SENSOR PARAMETER AIR TANDON DINAMIS (DARI MODUL NUTRISI)
    function loadIotWaterData() {
        var el = document.getElementById('dashIotWaterCards');
        if (!el) return;

        var dataNutrisi = getData('cozycs_nutrisi');
        var filteredNutrisi = (selectedGh === 'ALL') ? dataNutrisi : dataNutrisi.filter(function(n) { return n.gh === selectedGh; });
        var latest = filteredNutrisi.length > 0 ? filteredNutrisi[filteredNutrisi.length - 1] : {};

        var valPpm = (latest.ppm !== undefined && latest.ppm !== '') ? latest.ppm : '0';
        var valPh = (latest.ph !== undefined && latest.ph !== '') ? latest.ph : '0.0';
        var valWaterTemp = (latest.waterTemp !== undefined && latest.waterTemp !== '') ? latest.waterTemp + '°C' : '0°C';
        var valTandon = (latest.tandon !== undefined && latest.tandon !== '') ? latest.tandon : '0';

        var statusPpm = (valPpm > 0) ? 'Tercatat' : 'Belum Ada';
        var statusPh = (valPh > 0) ? 'Tercatat' : 'Belum Ada';

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
                <div><span style="background: ${valPpm > 0 ? '#E8F5E9' : '#F5F5F5'}; color: ${valPpm > 0 ? '#2E7D32' : '#888'}; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${statusPpm}</span></div>
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
                <div><span style="background: ${valPh > 0 ? '#E8F5E9' : '#F5F5F5'}; color: ${valPh > 0 ? '#2E7D32' : '#888'}; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${statusPh}</span></div>
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
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">Tercatat</span></div>
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #E1F5FE; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-water" style="color: #0277BD; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">Tandon Air</div>
                        <div style="font-size: 18px; font-weight: 800; color: #111;">${valTandon} <span style="font-size: 10px; font-weight: 600; color: #888;">%</span></div>
                    </div>
                </div>
                <div><span style="background: #E1F5FE; color: #0277BD; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">Level Air</span></div>
            </div>
        `;
    }

    // PARAMETER LINGKUNGAN DINAMIS
    function loadIotEnvData() {
        var el = document.getElementById('dashIotEnvCards');
        if (!el) return;

        var dataNutrisi = getData('cozycs_nutrisi');
        var filteredNutrisi = (selectedGh === 'ALL') ? dataNutrisi : dataNutrisi.filter(function(n) { return n.gh === selectedGh; });
        var latest = filteredNutrisi.length > 0 ? filteredNutrisi[filteredNutrisi.length - 1] : {};

        var valRoomTemp = (latest.roomTemp !== undefined && latest.roomTemp !== '') ? latest.roomTemp + '°C' : '0°C';
        var valHumidity = (latest.humidity !== undefined && latest.humidity !== '') ? latest.humidity : '0';
        var valLux = (latest.lux !== undefined && latest.lux !== '') ? latest.lux : '0';

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
                <div><span style="background: #FFF3E0; color: #E65100; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">Suhu Ruang</span></div>
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #E3F2FD; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-tint-slash" style="color: #1E88E5; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">Kelembaban</div>
                        <div style="font-size: 18px; font-weight: 800; color: #111;">${valHumidity} <span style="font-size: 10px; font-weight: 600; color: #888;">%</span></div>
                    </div>
                </div>
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">RH GH</span></div>
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #FFFDE7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-sun" style="color: #F57F17; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">Cahaya</div>
                        <div style="font-size: 18px; font-weight: 800; color: #111;">${valLux} <span style="font-size: 10px; font-weight: 600; color: #888;">Lux</span></div>
                    </div>
                </div>
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">Intensitas</span></div>
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: ${isAirflowOn ? '#EDE7F6' : '#F5F5F5'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.3s ease;">
                        <i class="fas fa-fan" style="color: ${isAirflowOn ? '#512DA8' : '#9E9E9E'}; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">Airflow</div>
                        <div style="font-size: 15px; font-weight: 800; color: ${isAirflowOn ? '#2E7D32' : '#C62828'}; transition: color 0.3s ease;">
                            ${isAirflowOn ? 'Aktif' : 'Tidak Aktif'}
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; align-items: center;">
                    <div onclick="dashboard.toggleAirflow()" title="Klik untuk ubah status Airflow" style="width: 38px; height: 20px; background: ${isAirflowOn ? '#4CAF50' : '#CCCCCC'}; border-radius: 12px; position: relative; cursor: pointer; transition: background 0.3s ease; box-shadow: inset 0 1px 3px rgba(0,0,0,0.15);">
                        <div style="width: 16px; height: 16px; background: #ffffff; border-radius: 50%; position: absolute; top: 2px; left: ${isAirflowOn ? '20px' : '2px'}; transition: left 0.3s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
                    </div>
                </div>
            </div>
        `;
    }

    // EXECUTIVE SUMMARY (PERHITUNGAN REAL DARI MODUL LAIN)
    function loadExecutiveSummary() {
        var el = document.getElementById('dashExecutiveSummary');
        if (!el) return;

        var dataGh = getData('cozycs_greenhouse');
        var dataTanaman = getData('cozycs_tanaman');
        var dataBuah = getData('cozycs_buah');
        var dataPolinasi = getData('cozycs_polinasi');

        // 1. Total Kapasitas Awal Tanaman
        var totalTanaman = 0;
        var filteredGhList = (selectedGh === 'ALL') ? dataGh : dataGh.filter(function(g) { return g.kode === selectedGh; });
        filteredGhList.forEach(function(g) {
            totalTanaman += (parseFloat(g.populasi) || parseFloat(g.kapasitas) || 0);
        });

        // 2. Total Tanaman Hidup
        var tanamanHidup = 0;
        var filteredTanaman = (selectedGh === 'ALL') ? dataTanaman : dataTanaman.filter(function(t) { return t.gh === selectedGh; });
        filteredTanaman.forEach(function(t) {
            tanamanHidup += (parseFloat(t.populasi) || parseFloat(t.jumlah) || 0);
        });

        // 3. Total Buah Fix
        var buahFix = 0;
        var filteredBuah = (selectedGh === 'ALL') ? dataBuah : dataBuah.filter(function(b) { return b.gh === selectedGh; });
        filteredBuah.forEach(function(b) {
            buahFix += (parseFloat(b.jumlahFix) || parseFloat(b.jumlah) || 0);
        });

        // 4. Estimasi Tanggal & Bobot Panen
        var tglPanenStr = '-';
        var totalEstimasiKg = 0;
        var filteredPolinasi = (selectedGh === 'ALL') ? dataPolinasi : dataPolinasi.filter(function(p) { return p.gh === selectedGh; });
        
        filteredPolinasi.forEach(function(p) {
            var jumlahBunga = parseFloat(p.berhasil) || parseFloat(p.jumlah) || 0;
            totalEstimasiKg += (jumlahBunga * 1.5); // Asumsi rata-rata 1.5kg/buah
            if (p.tglPanen) tglPanenStr = p.tglPanen;
        });

        el.innerHTML = `
            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">🌱 Tanaman Aktif</div>
                <div style="font-size: 15px; font-weight: 800; color: #2E7D32; margin-top: 4px;">${totalTanaman} Batang</div>
                <div style="font-size: 10px; color: #555; font-weight: 600; margin-top: 2px;">Kapasitas Awal</div>
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">🌿 Tanaman Hidup</div>
                <div style="font-size: 15px; font-weight: 800; color: #0277BD; margin-top: 4px;">${tanamanHidup} Pohon</div>
                <div style="font-size: 10px; color: #555; font-weight: 600; margin-top: 2px;">Populasi Aktif</div>
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">🍈 Buah Fix</div>
                <div style="font-size: 15px; font-weight: 800; color: #E65100; margin-top: 4px;">${buahFix} Buah</div>
                <div style="font-size: 10px; color: #555; font-weight: 600; margin-top: 2px;">Seleksi Lolos</div>
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">📅 Estimasi Panen</div>
                <div style="font-size: 13px; font-weight: 800; color: #2E7D32; margin-top: 4px;">${tglPanenStr}</div>
                <div style="font-size: 10px; color: #555; font-weight: 600; margin-top: 2px;">Est. ${totalEstimasiKg} Kg</div>
            </div>
        `;
    }

    // AGENDA HARI INI DINAMIS (DARI MODUL JADWAL)
    function loadTodayAgenda() {
        var el = document.getElementById('dashTodayAgendaList');
        var dateEl = document.getElementById('dashTodayDate');
        if (!el) return;

        var now = new Date();
        var todayStr = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);
        if (dateEl) dateEl.innerText = (typeof Helper !== 'undefined' && Helper.formatDate) ? Helper.formatDate(todayStr) : todayStr;

        var schedules = getData('cozycs_schedules');
        
        var todayTasks = schedules.filter(function(s) {
            var matchDate = (s.date === todayStr || s.tanggal === todayStr);
            var matchGh = (selectedGh === 'ALL') || (s.gh === selectedGh) || (s.gh === 'Seluruh Farm');
            return matchDate && matchGh;
        });

        if (todayTasks.length === 0) {
            el.innerHTML = `
                <div style="text-align: center; padding: 12px; color: #888; font-size: 12px;">
                    <i class="far fa-calendar-check" style="font-size: 18px; color: #2E7D32; margin-bottom: 4px; display: block;"></i>
                    Tidak ada agenda kegiatan untuk hari ini.
                </div>
            `;
            return;
        }

        var html = '';
        todayTasks.slice(0, 10).forEach(function(item) {
            var isDone = item.status === 'Selesai';
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #eee;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" ${isDone ? 'checked' : ''} onchange="dashboard.toggleTask('${item.id}')" style="width: 16px; height: 16px; cursor: pointer;">
                        <span style="font-size: 12px; font-weight: 600; color: ${isDone ? '#888888' : '#222222'}; text-decoration: ${isDone ? 'line-through' : 'none'};">
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

    // PROGRESS MUSIM & ESTIMASI OMZET DINAMIS
    function loadProgressMusim() {
        var el = document.getElementById('dashProgressMusim');
        if (!el) return;

        var dataTanaman = getData('cozycs_tanaman');
        var dataPolinasi = getData('cozycs_polinasi');

        var totalBatang = 0;
        var maxHst = 0;
        var filteredTanaman = (selectedGh === 'ALL') ? dataTanaman : dataTanaman.filter(function(t) { return t.gh === selectedGh; });
        
        filteredTanaman.forEach(function(t) {
            totalBatang += (parseFloat(t.populasi) || parseFloat(t.jumlah) || 0);
            var hstVal = parseFloat(t.hst) || 0;
            if (hstVal > maxHst) maxHst = hstVal;
        });

        var totalPolinasi = 0;
        var filteredPolinasi = (selectedGh === 'ALL') ? dataPolinasi : dataPolinasi.filter(function(p) { return p.gh === selectedGh; });
        filteredPolinasi.forEach(function(p) {
            totalPolinasi += (parseFloat(p.berhasil) || parseFloat(p.jumlah) || 0);
        });

        // Kalkulasi persentase HST (Target Panen = 80 HST)
        var percentHst = Math.min(Math.round((maxHst / 80) * 100), 100);
        var estimasiKg = totalPolinasi > 0 ? (totalPolinasi * 1.5) : (totalBatang * 1.5);
        var hargaPerKg = 20000;
        var estimasiOmzet = estimasiKg * hargaPerKg;

        el.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                <span><strong>Progress Musim (${selectedGh})</strong>: ${percentHst}% (${maxHst} HST)</span>
                <span style="font-weight: bold; color: #2E7D32;">Est. Omzet: Rp ${estimasiOmzet.toLocaleString('id-ID')}</span>
            </div>
            <div style="width: 100%; background: #E0E0E0; height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 8px;">
                <div style="width: ${percentHst}%; background: #2E7D32; height: 100%; transition: width 0.3s ease;"></div>
            </div>
            <div style="font-size: 10px; color: #666;">*Kalkulasi: ${estimasiKg} Kg × Rp ${hargaPerKg.toLocaleString('id-ID')}/Kg</div>
        `;
    }

    // AUDIT LOG ACTIVITAS TERAKHIR DINAMIS
    function loadRecentActivities() {
        var el = document.getElementById('dashRecentActivities');
        if (!el) return;

        var logs = getData('cozycs_logs');
        var filteredLogs = (selectedGh === 'ALL') ? logs : logs.filter(function(l) { return l.gh === selectedGh || l.gh === 'ALL'; });

        if (filteredLogs.length === 0) {
            el.innerHTML = `<div style="font-size: 11px; color: #888; text-align: center; padding: 8px 0;">Belum ada riwayat aktivitas tercatat.</div>`;
            return;
        }

        var html = '';
        filteredLogs.slice(-5).reverse().forEach(function(l) {
            html += `
                <div style="display: flex; gap: 10px; font-size: 11px; align-items: center; border-bottom: 1px dashed #f0f0f0; padding-bottom: 4px;">
                    <span style="font-weight: bold; color: #0277BD; width: 45px;">${l.jam || l.time || '-'}</span>
                    <span style="color: #333;">${l.text || l.kegiatan || '-'}</span>
                </div>
            `;
        });

        el.innerHTML = html;
    }

    function toggleIotSection() {
        isIotCollapsed = !isIotCollapsed;
        var contentEl = document.getElementById('wrapperIotContent');
        var iconEl = document.getElementById('iconToggleIot');

        if (contentEl) contentEl.style.display = isIotCollapsed ? 'none' : 'block';
        if (iconEl) iconEl.className = isIotCollapsed ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    }

    function toggleAirflow() {
        isAirflowOn = !isAirflowOn;
        loadIotEnvData();
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
