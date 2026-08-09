// ==========================================
// COZYCS FARM - EXECUTIVE DASHBOARD (TIMESTAMPED MONITORING EDITION)
// ==========================================

var dashboard = (function() {

    var selectedGh = 'ALL';
    var isIotCollapsed = false;
    var isAirflowOn = false;
    var clockInterval = null;

    var currentLocation = {
        lat: parseFloat(localStorage.getItem('cozycs_user_lat')) || -5.4287,
        lon: parseFloat(localStorage.getItem('cozycs_user_lon')) || 105.1800,
        city: localStorage.getItem('cozycs_user_city') || 'Pesawaran'
    };

    var pesawaranWeather = {
        temp: '-°C',
        humidity: '-%',
        icon: '⛅'
    };

    var i18nDict = {
        'id': {
            'greeting_sub': 'Semoga panen melimpah hari ini!',
            'select_gh': 'Pilih Greenhouse',
            'see_all': 'Lihat Semua',
            'all_gh': '🌐 Semua GH',
            'water_env_mon': 'Monitoring Air Dan Lingkungan',
            'water_param': '💧 Parameter Air Tandon',
            'env_param': '☀️ Parameter Lingkungan',
            'nutrition': 'Nutrisi',
            'ph_water': 'pH Air',
            'water_temp': 'Suhu Air',
            'tandon_water': 'Tandon Air',
            'room_temp': 'Suhu Udara',
            'humidity': 'Kelembaban',
            'light': 'Cahaya',
            'airflow': 'Airflow',
            'recorded': 'Tercatat',
            'no_data': 'Belum Ada',
            'water_level': 'Level Air',
            'room_temp_lbl': 'Suhu Ruang',
            'rh_gh': 'RH GH',
            'intensity': 'Intensitas',
            'active': 'Aktif',
            'inactive': 'Tidak Aktif',
            'today_agenda': 'Agenda Hari Ini',
            'today': 'Hari Ini',
            'no_agenda': 'Tidak ada agenda kegiatan untuk hari ini.',
            'season_progress': 'Progress Musim & Analisis Fase Tanam',
            'recent_act': 'Aktivitas Terakhir (Audit Log)',
            'no_logs': 'Belum ada riwayat aktivitas tercatat.',
            'quick_action': 'Quick Action / Input Cepat',
            'btn_nutrition': '+ Nutrisi',
            'btn_spray': '+ Spray',
            'btn_warehouse': '+ Gudang',
            'btn_harvest': '+ Panen',
            'btn_schedule': '+ Jadwal',
            'btn_pests': '+ Hama'
        },
        'en': {
            'greeting_sub': 'May your harvest be abundant today!',
            'select_gh': 'Select Greenhouse',
            'see_all': 'See All',
            'all_gh': '🌐 All GH',
            'water_env_mon': 'Water & Environment Monitoring',
            'water_param': '💧 Water Tank Parameters',
            'env_param': '☀️ Environment Parameters',
            'nutrition': 'Nutrition',
            'ph_water': 'Water pH',
            'water_temp': 'Water Temp',
            'tandon_water': 'Water Tank',
            'room_temp': 'Air Temp',
            'humidity': 'Humidity',
            'light': 'Light',
            'airflow': 'Airflow',
            'recorded': 'Recorded',
            'no_data': 'No Data',
            'water_level': 'Water Level',
            'room_temp_lbl': 'Room Temp',
            'rh_gh': 'GH RH',
            'intensity': 'Intensity',
            'active': 'Active',
            'inactive': 'Inactive',
            'today_agenda': "Today's Agenda",
            'today': 'Today',
            'no_agenda': 'No scheduled activities for today.',
            'season_progress': 'Season Progress & Growth Phase Analysis',
            'recent_act': 'Recent Activities (Audit Log)',
            'no_logs': 'No activity logs recorded yet.',
            'quick_action': 'Quick Action / Fast Input',
            'btn_nutrition': '+ Nutrition',
            'btn_spray': '+ Spray',
            'btn_warehouse': '+ Stock',
            'btn_harvest': '+ Harvest',
            'btn_schedule': '+ Schedule',
            'btn_pests': '+ Pests'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function parseLocalDate(dateStr) {
        if (!dateStr) return null;
        if (dateStr instanceof Date) {
            var d = new Date(dateStr.getTime());
            d.setHours(0, 0, 0, 0);
            return d;
        }
        var cleanStr = String(dateStr).split('T')[0];
        var parts = cleanStr.split('-');
        if (parts.length === 3) {
            var y = parseInt(parts[0], 10);
            var m = parseInt(parts[1], 10) - 1;
            var day = parseInt(parts[2], 10);
            return new Date(y, m, day, 0, 0, 0, 0);
        }
        var parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
            parsed.setHours(0, 0, 0, 0);
            return parsed;
        }
        return null;
    }

    function getData(key) {
        try {
            var altKeys = [key];
            if (key === 'cozycs_greenhouse') altKeys.push('cozycs_gh', 'cozycs_greenhouses', 'greenhouses');
            if (key === 'cozycs_schedules') altKeys.push('cozycs_jadwal', 'schedules', 'jadwal');

            for (var i = 0; i < altKeys.length; i++) {
                var k = altKeys[i];
                var raw = localStorage.getItem(k);
                if (raw) {
                    var parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                }
            }

            if (typeof Storage !== 'undefined' && typeof Storage.getAll === 'function') {
                for (var j = 0; j < altKeys.length; j++) {
                    var res = Storage.getAll(altKeys[j]);
                    if (Array.isArray(res) && res.length > 0) return res;
                }
            }
        } catch(e) {
            console.error('[Dashboard] Gagal membaca data ' + key, e);
        }
        return [];
    }

    function sortGhList(list) {
        if (!Array.isArray(list)) return [];
        return list.slice().sort(function(a, b) {
            var nameA = String(a.nama || a.kode || a.id || '').toLowerCase();
            var nameB = String(b.nama || b.kode || b.id || '').toLowerCase();

            var getRank = function(str) {
                if (str.includes('utama') || str.includes('gh 1') || str.includes('gh1')) return 1;
                if (str.includes('kedua') || str.includes('gh 2') || str.includes('gh2')) return 2;
                if (str.includes('ketiga') || str.includes('gh 3') || str.includes('gh3')) return 3;
                if (str.includes('keempat') || str.includes('gh 4') || str.includes('gh4')) return 4;
                return 99;
            };

            var rankA = getRank(nameA);
            var rankB = getRank(nameB);

            if (rankA !== rankB) return rankA - rankB;
            return nameA.localeCompare(nameB);
        });
    }

    // HELPER: FORMAT WAKTU/TANGGAL PERUBAHAN SECARA SPESIFIK
    function formatLastUpdated(item) {
        if (!item || Object.keys(item).length === 0) return 'Belum Ada Data';

        var dateStr = item.updatedAt || item.timestamp || item.createdAt || item.tanggal || item.tgl;
        var jamStr = item.jam || item.waktu;

        if (!dateStr && !jamStr) return 'Tercatat';

        var timeText = jamStr || '';

        if (dateStr) {
            var d = parseLocalDate(dateStr);
            if (!d) {
                var parsed = new Date(dateStr);
                if (!isNaN(parsed.getTime())) d = parsed;
            }

            if (d) {
                var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
                var day = d.getDate();
                var month = monthNames[d.getMonth()];

                if (!timeText && String(dateStr).includes('T')) {
                    try {
                        var dt = new Date(dateStr);
                        if (!isNaN(dt.getTime())) {
                            var h = String(dt.getHours()).padStart(2, '0');
                            var m = String(dt.getMinutes()).padStart(2, '0');
                            timeText = h + ':' + m;
                        }
                    } catch(e) {}
                }

                return timeText ? (day + ' ' + month + ', ' + timeText) : (day + ' ' + month);
            }
        }

        return jamStr ? ('Jam ' + jamStr) : 'Terbaru';
    }

    function render() {
        return `
            <style>
                @keyframes spinIcon { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .spinning { animation: spinIcon 0.8s linear infinite; }
                .dash-card-shadow { box-shadow: 0 4px 14px rgba(0,0,0,0.05); }
            </style>

            <div class="dashboard-container" style="padding-bottom: 30px;">
                
                <!-- 0. WELCOME BANNER -->
                <div id="dashWelcomeBanner" style="margin-bottom: 14px;"></div>

                <!-- 1. GRID MATRIX GREENHOUSE (2 KOLOM) -->
                <div id="dashSwipeableGhContainer" style="margin-bottom: 16px;"></div>

                <!-- 2. MONITORING AIR DAN LINGKUNGAN -->
                <div class="dash-card-shadow" style="background: linear-gradient(135deg, #E0F7FA 0%, #E1F5FE 100%); padding: 15px; border-radius: 16px; border: 1px solid #B2EBF2; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 13px; font-weight: 800; color: #006064;"><i class="fas fa-tint" style="margin-right: 4px; color: #0288D1;"></i> ${t('water_env_mon')}</span>
                            <span id="dashIotLastUpdated" style="font-size: 9px; background: #00838F; color: #FFF; padding: 2px 7px; border-radius: 10px; font-weight: bold;">-</span>
                        </div>
                        
                        <button onclick="dashboard.toggleIotSection()" title="Toggle Monitoring" style="width: 28px; height: 28px; border-radius: 50%; background: #FFF; border: 1px solid #B2EBF2; color: #0277BD; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0;">
                            <i id="iconToggleIot" class="fas ${isIotCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}" style="font-size: 12px;"></i>
                        </button>
                    </div>

                    <div id="wrapperIotContent" style="display: ${isIotCollapsed ? 'none' : 'block'}; margin-top: 14px; transition: all 0.3s ease;">
                        <div style="font-size: 11px; font-weight: 800; color: #00838F; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">${t('water_param')}</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px;" id="dashIotWaterCards"></div>

                        <div style="font-size: 11px; font-weight: 800; color: #00838F; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">${t('env_param')}</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;" id="dashIotEnvCards"></div>
                    </div>
                </div>

                <!-- 3. PROGRESS MUSIM & ANALISIS FASE TANAM -->
                <div class="dash-card-shadow" style="background: linear-gradient(135deg, #FFF8E1 0%, #F1F8E9 100%); padding: 15px; border-radius: 16px; border: 1px solid #FFE082; margin-bottom: 16px;">
                    <div style="font-size: 13px; font-weight: 800; color: #E65100; margin-bottom: 10px;"><i class="fas fa-seedling" style="color: #2E7D32; margin-right: 6px;"></i> ${t('season_progress')}</div>
                    <div id="dashProgressMusim"></div>
                </div>

                <!-- 4. AGENDA HARI INI -->
                <div class="dash-card-shadow" style="background: linear-gradient(135deg, #E8F8F5 0%, #E8F5E9 100%); padding: 15px; border-radius: 16px; border: 1px solid #A3E4D7; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 13px; font-weight: 800; color: #117A65;"><i class="fas fa-tasks" style="color: #2E7D32; margin-right: 6px;"></i> ${t('today_agenda')}</span>
                        <span style="font-size: 10px; color: #16A085; font-weight: bold;" id="dashTodayDate">${t('today')}</span>
                    </div>
                    <div id="dashTodayAgendaList"></div>
                </div>

                <!-- 5. AKTIVITAS TERAKHIR (AUDIT LOG) -->
                <div class="dash-card-shadow" style="background: linear-gradient(135deg, #E1F5FE 0%, #EDE7F6 100%); padding: 15px; border-radius: 16px; border: 1px solid #B3E5FC; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="font-size: 13px; font-weight: 800; color: #283593;"><i class="fas fa-history" style="color: #0277BD; margin-right: 6px;"></i> ${t('recent_act')}</div>
                        <button id="btnManualRefreshLog" onclick="dashboard.manualRefreshLogs()" style="background: #FFF; border: 1px solid #B3E5FC; color: #0277BD; font-size: 11px; padding: 4px 10px; border-radius: 8px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 4px;">
                            <i id="iconRefreshBtn" class="fas fa-sync-alt"></i> Refresh
                        </button>
                    </div>
                    <div id="dashRecentActivities" style="display: flex; flex-direction: column; gap: 8px;"></div>
                </div>

                <!-- 6. QUICK ACTION BUTTONS -->
                <div class="dash-card-shadow" style="background: linear-gradient(135deg, #F5F5F5 0%, #E8EAF6 100%); padding: 14px; border-radius: 16px; border: 1px solid #C5CAE9;">
                    <div style="font-size: 11px; font-weight: 800; color: #3F51B5; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">${t('quick_action')}</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                        <button onclick="navigateTo('nutrisi')" style="padding: 10px 4px; border-radius: 10px; border: 1px solid #B3E5FC; background: #FFF; color: #0277BD; font-weight: bold; font-size: 11px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">${t('btn_nutrition')}</button>
                        <button onclick="navigateTo('spray')" style="padding: 10px 4px; border-radius: 10px; border: 1px solid #E1BEE7; background: #FFF; color: #6A1B9A; font-weight: bold; font-size: 11px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">${t('btn_spray')}</button>
                        <button onclick="navigateTo('gudang')" style="padding: 10px 4px; border-radius: 10px; border: 1px solid #FFE0B2; background: #FFF; color: #E65100; font-weight: bold; font-size: 11px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">${t('btn_warehouse')}</button>
                        <button onclick="navigateTo('panen')" style="padding: 10px 4px; border-radius: 10px; border: 1px solid #C8E6C9; background: #FFF; color: #2E7D32; font-weight: bold; font-size: 11px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">${t('btn_harvest')}</button>
                        <button onclick="navigateTo('jadwal')" style="padding: 10px 4px; border-radius: 10px; border: 1px solid #D1C4E9; background: #FFF; color: #512DA8; font-weight: bold; font-size: 11px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">${t('btn_schedule')}</button>
                        <button onclick="navigateTo('hama')" style="padding: 10px 4px; border-radius: 10px; border: 1px solid #FFCDD2; background: #FFF; color: #C62828; font-weight: bold; font-size: 11px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">${t('btn_pests')}</button>
                    </div>
                </div>
            </div>
        `;
    }

    function init() {
        refreshAllDashboardData();
        startLiveClock();
        fetchWeatherByCoords(currentLocation.lat, currentLocation.lon, currentLocation.city);
        setupEventListeners();
    }

    function setupEventListeners() {
        window.removeEventListener('storage', refreshAllDashboardData);
        window.addEventListener('storage', refreshAllDashboardData);

        window.removeEventListener('cozycs_data_changed', refreshAllDashboardData);
        window.addEventListener('cozycs_data_changed', refreshAllDashboardData);

        window.removeEventListener('focus', refreshAllDashboardData);
        window.addEventListener('focus', refreshAllDashboardData);

        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    function handleVisibilityChange() {
        if (!document.hidden) {
            refreshAllDashboardData();
        }
    }

    function logActivity(title, desc, gh, type) {
        try {
            var logs = getData('cozycs_aktivitas');
            var now = new Date();
            var hours = String(now.getHours()).padStart(2, '0');
            var mins = String(now.getMinutes()).padStart(2, '0');
            var jamStr = hours + ':' + mins;
            
            var newEntry = {
                id: 'log_' + Date.now(),
                timestamp: now.toISOString(),
                jam: jamStr,
                tanggal: now.toISOString().split('T')[0],
                judul: title || 'Aktivitas Baru',
                deskripsi: desc || '',
                gh: gh || 'ALL',
                type: type || 'GENERAL'
            };

            logs.unshift(newEntry);
            if (logs.length > 100) logs = logs.slice(0, 100);

            localStorage.setItem('cozycs_aktivitas', JSON.stringify(logs));
            if (typeof Storage !== 'undefined' && Storage.saveAll) {
                Storage.saveAll('cozycs_aktivitas', logs);
            }

            window.dispatchEvent(new Event('cozycs_data_changed'));
        } catch(e) {
            console.error('[Dashboard] Gagal mencatat log aktivitas', e);
        }
    }

    function manualRefreshLogs() {
        var iconEl = document.getElementById('iconRefreshBtn');
        if (iconEl) iconEl.classList.add('spinning');
        
        refreshAllDashboardData();

        setTimeout(function() {
            if (iconEl) iconEl.classList.remove('spinning');
        }, 600);
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
                var isEn = (localStorage.getItem('cozycs_lang') === 'en');
                var g = Helper.getGreeting();
                var text = g.text;
                if (isEn) {
                    if (text.includes('Pagi')) text = 'Good Morning';
                    else if (text.includes('Siang')) text = 'Good Afternoon';
                    else if (text.includes('Sore')) text = 'Good Afternoon';
                    else text = 'Good Evening';
                }
                greetingEl.textContent = text;
            }
        }, 10000);
    }

    function detectUserLocation() {
        if (!navigator.geolocation) return;
        var locIconEl = document.getElementById('btnGpsTargetIcon');
        if (locIconEl) locIconEl.className = 'fas fa-spinner fa-spin';

        navigator.geolocation.getCurrentPosition(
            function(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + lon + '&localityLanguage=id')
                    .then(function(res) { return res.json(); })
                    .then(function(geoData) {
                        var cityName = geoData.city || geoData.locality || geoData.principalSubdivision || 'My Location';
                        cityName = cityName.replace(/Kota |Kabupaten /gi, '');
                        currentLocation = { lat: lat, lon: lon, city: cityName };
                        localStorage.setItem('cozycs_user_lat', lat);
                        localStorage.setItem('cozycs_user_lon', lon);
                        localStorage.setItem('cozycs_user_city', cityName);
                        fetchWeatherByCoords(lat, lon, cityName);
                    })
                    .finally(function() {
                        if (locIconEl) locIconEl.className = 'fas fa-crosshairs';
                    });
            },
            function(error) { if (locIconEl) locIconEl.className = 'fas fa-crosshairs'; },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    function fetchWeatherByCoords(lat, lon, cityName) {
        var apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FJakarta';
        fetch(apiUrl)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data && data.current) {
                    var temp = Math.round(data.current.temperature_2m) + '°C';
                    var humidity = Math.round(data.current.relative_humidity_2m) + '%';
                    pesawaranWeather = { temp: temp, humidity: humidity, icon: '⛅' };
                    var tempEl = document.getElementById('liveWeatherTemp');
                    var humEl = document.getElementById('liveWeatherHumidity');
                    var cityEl = document.getElementById('liveLocationName');
                    if (tempEl) tempEl.textContent = temp;
                    if (humEl) humEl.textContent = humidity;
                    if (cityEl) cityEl.textContent = cityName;
                }
            })
            .catch(function(err) {});
    }

    function refreshAllDashboardData() {
        loadWelcomeBanner();
        renderSwipeableGhCards();
        loadIotWaterData();
        loadIotEnvData();
        loadProgressMusim();
        loadTodayAgenda();
        loadRecentActivities();
    }

    function loadWelcomeBanner() {
        var el = document.getElementById('dashWelcomeBanner');
        if (!el) return;

        var isEn = (localStorage.getItem('cozycs_lang') === 'en');
        var greeting = (typeof Helper !== 'undefined' && Helper.getGreeting) ? Helper.getGreeting() : { text: 'Selamat Pagi' };
        var greetingText = greeting.text;
        if (isEn) {
            if (greetingText.includes('Pagi')) greetingText = 'Good Morning';
            else if (greetingText.includes('Siang')) greetingText = 'Good Afternoon';
            else if (greetingText.includes('Sore')) greetingText = 'Good Afternoon';
            else greetingText = 'Good Evening';
        }

        var dateTimeStr = (typeof Helper !== 'undefined' && Helper.getFullDateTime) ? Helper.getFullDateTime() : '';

        el.innerHTML = `
            <div class="dash-card-shadow" style="background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%); border-radius: 16px; padding: 16px; border: 1px solid #C8E6C9;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 46px; height: 46px; border-radius: 50%; background: #FFF; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; border: 1px solid #C8E6C9; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                            👨‍🌾
                        </div>
                        <div>
                            <div id="liveGreetingText" style="font-size: 16px; font-weight: 800; color: #1B5E20; line-height: 1.2;">
                                ${greetingText}
                            </div>
                            <div style="font-size: 11px; color: #388E3C; margin-top: 3px; font-weight: 600;">
                                ${t('greeting_sub')}
                            </div>
                        </div>
                    </div>

                    <div style="text-align: right; flex-shrink: 0;">
                        <div id="liveWeatherIcon" style="font-size: 22px; line-height: 1;">${pesawaranWeather.icon}</div>
                        <div id="liveWeatherTemp" style="font-size: 15px; font-weight: 800; color: #2E7D32; margin-top: 2px;">
                            ${pesawaranWeather.temp}
                        </div>
                        <div id="liveWeatherHumidity" style="font-size: 10px; color: #558B2F; font-weight: 700;">
                            ${pesawaranWeather.humidity}
                        </div>
                    </div>
                </div>

                <div style="border-top: 1px dashed #A5D6A7; margin-bottom: 10px;"></div>

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #2E7D32;">
                    <div style="display: flex; align-items: center; gap: 6px; font-weight: 700;">
                        <i class="far fa-calendar-alt" style="color: #2E7D32; font-size: 12px;"></i>
                        <span id="liveDateTime">${dateTimeStr}</span>
                    </div>

                    <div style="display: flex; align-items: center; gap: 5px; color: #C62828; font-weight: 800;">
                        <i class="fas fa-map-marker-alt"></i>
                        <span id="liveLocationName">${currentLocation.city}</span>
                        <button onclick="dashboard.detectUserLocation()" title="GPS Location" style="background: #FFEBEE; border: 1px solid #FFCDD2; color: #D32F2F; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0;">
                            <i id="btnGpsTargetIcon" class="fas fa-crosshairs" style="font-size: 11px;"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderSwipeableGhCards() {
        var el = document.getElementById('dashSwipeableGhContainer');
        if (!el) return;

        var rawGh = getData('cozycs_greenhouse');
        var dataGh = sortGhList(rawGh);
        var dataTanaman = getData('cozycs_tanaman');
        var dataPolinasi = getData('cozycs_polinasi');
        var dataBuah = getData('cozycs_buah');

        if (dataGh.length === 0) {
            el.innerHTML = `
                <div style="background: rgba(255,255,255,0.85); border-radius: 16px; padding: 14px; text-align: center; border: 1px dashed #CCC; color: #777; font-size: 12px;">
                    <i class="fas fa-warehouse" style="font-size: 20px; color: #888; margin-bottom: 6px; display: block;"></i>
                    Belum ada Greenhouse terdaftar.
                </div>
            `;
            return;
        }

        var todayMurni = parseLocalDate(new Date());

        var uniqueHolesALL = new Set();
        var tPolALL = 0;
        var tBuahALL = 0;

        dataTanaman.forEach(function(t) {
            if (t.talang && t.talang !== '-') {
                uniqueHolesALL.add((t.gh || 'GH') + '_' + t.talang);
            }
            if (t.kategori === 'Polinasi' && (t.statusPolinasi === 'Sukses' || !t.statusPolinasi)) {
                tPolALL += 1;
            }
            if (t.kategori === 'Buah') {
                tBuahALL += 1;
            }
        });

        dataPolinasi.forEach(function(p) { tPolALL += (parseFloat(p.berhasil) || parseFloat(p.jumlah) || 0); });
        dataBuah.forEach(function(b) { tBuahALL += (parseFloat(b.jumlahFix) || parseFloat(b.jumlah) || 0); });

        var tPopALL = uniqueHolesALL.size > 0 ? uniqueHolesALL.size : dataTanaman.length;
        var isAllActive = (selectedGh === 'ALL');

        var html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 0 4px;">
                <div style="font-size: 13px; font-weight: 800; color: #1B5E20;"><i class="fas fa-th-large" style="margin-right: 6px; color: #2E7D32;"></i> Monitoring Greenhouse</div>
                <span style="font-size: 10px; color: #2E7D32; font-weight: bold; background: #E8F5E9; padding: 2px 8px; border-radius: 10px;">${dataGh.length} GH Aktif</span>
            </div>

            <div onclick="dashboard.selectGhFilter('ALL')" style="background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%); border-radius: 14px; padding: 12px 14px; color: #fff; margin-bottom: 10px; box-shadow: 0 4px 12px rgba(27,94,32,0.25); cursor: pointer; border: ${isAllActive ? '2px solid #FFD54F' : '2px solid transparent'}; position: relative; overflow: hidden; transition: all 0.2s ease;">
                <i class="fas fa-globe-asia" style="position: absolute; right: -8px; bottom: -8px; font-size: 60px; opacity: 0.12;"></i>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; position: relative; z-index: 2;">
                    <div style="font-size: 14px; font-weight: 800;">🌐 Cozycs Farm (Semua GH)</div>
                    <span style="font-size: 9px; background: ${isAllActive ? '#FFC107' : 'rgba(255,255,255,0.22)'}; color: ${isAllActive ? '#000' : '#FFF'}; font-weight: bold; padding: 2px 8px; border-radius: 10px; backdrop-filter: blur(4px);">
                        ${isAllActive ? 'AKTIF' : 'PILIH'}
                    </span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; background: rgba(0,0,0,0.18); padding: 8px; border-radius: 10px; backdrop-filter: blur(2px); position: relative; z-index: 2;">
                    <div style="text-align: center;">
                        <div style="font-size: 9px; color: rgba(255,255,255,0.85);">Total Pop</div>
                        <div style="font-size: 13px; font-weight: 800;">${tPopALL} <span style="font-size: 8px; font-weight: normal;">Phn</span></div>
                    </div>
                    <div style="text-align: center; border-left: 1px solid rgba(255,255,255,0.2); border-right: 1px solid rgba(255,255,255,0.2);">
                        <div style="font-size: 9px; color: rgba(255,255,255,0.85);">Polinasi</div>
                        <div style="font-size: 13px; font-weight: 800;">${tPolALL > 0 ? tPolALL : '-'} <span style="font-size: 8px; font-weight: normal;">Phn</span></div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 9px; color: #FFD54F; font-weight: bold;">Buah Fix</div>
                        <div style="font-size: 13px; font-weight: 800; color: #FFF;">${tBuahALL > 0 ? tBuahALL : '-'} <span style="font-size: 8px; font-weight: normal;">Buh</span></div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        `;

        var themes = [
            { bg: 'linear-gradient(135deg, #0277BD 0%, #00838F 100%)', shadow: 'rgba(2,119,189,0.25)' },
            { bg: 'linear-gradient(135deg, #E65100 0%, #F57C00 100%)', shadow: 'rgba(230,81,0,0.25)' },
            { bg: 'linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%)', shadow: 'rgba(106,27,154,0.25)' },
            { bg: 'linear-gradient(135deg, #006064 0%, #00838F 100%)', shadow: 'rgba(0,96,100,0.25)' }
        ];

        dataGh.forEach(function(g, index) {
            var gId = g.kode || g.id;
            var isActive = (selectedGh === gId);
            var theme = themes[index % themes.length];

            var filteredTanaman = dataTanaman.filter(function(t) { return t.gh === gId || t.ghId === gId; });

            var uniqueHoles = new Set();
            filteredTanaman.forEach(function(t) {
                if (t.talang && t.talang !== '-') uniqueHoles.add(t.talang);
            });
            var tPop = uniqueHoles.size > 0 ? uniqueHoles.size : filteredTanaman.length;

            var subtitle = 'Masa Sterilisasi';
            var gDates = parseGhDates(g);
            var tTanamGH = gDates.tanam || parseLocalDate(filteredTanaman[0] ? filteredTanaman[0].tanggal : null);

            if (tTanamGH) {
                var varietasName = (filteredTanaman[0] && filteredTanaman[0].varietas) ? filteredTanaman[0].varietas : (g.varietas || 'Melon');
                if (todayMurni < tTanamGH) {
                    var hMinus = Math.round((tTanamGH - todayMurni) / (1000 * 60 * 60 * 24));
                    subtitle = varietasName + ' (H-' + hMinus + ')';
                } else {
                    var hst = Math.max(0, Math.floor((todayMurni - tTanamGH) / (1000 * 60 * 60 * 24)));
                    subtitle = varietasName + ' (' + hst + ' HST)';
                }
            } else if (g.varietas) {
                subtitle = g.varietas + ' (0 HST)';
            }

            var tPol = 0;
            var tBuah = 0;

            filteredTanaman.forEach(function(t) {
                if (t.kategori === 'Polinasi' && (t.statusPolinasi === 'Sukses' || !t.statusPolinasi)) tPol += 1;
                if (t.kategori === 'Buah') tBuah += 1;
            });

            var filteredPol = dataPolinasi.filter(function(p) { return p.gh === gId || p.ghId === gId; });
            filteredPol.forEach(function(p) { tPol += (parseFloat(p.berhasil) || parseFloat(p.jumlah) || 0); });
            
            var filteredBuah = dataBuah.filter(function(b) { return b.gh === gId || b.ghId === gId; });
            filteredBuah.forEach(function(b) { tBuah += (parseFloat(b.jumlahFix) || parseFloat(b.jumlah) || 0); });

            html += `
                <div onclick="dashboard.selectGhFilter('${gId}')" style="background: ${theme.bg}; border-radius: 14px; padding: 12px; color: #fff; box-shadow: 0 4px 10px ${theme.shadow}; cursor: pointer; border: ${isActive ? '2px solid #FFD54F' : '2px solid transparent'}; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s ease;">
                    <i class="fas fa-leaf" style="position: absolute; right: -8px; bottom: -8px; font-size: 55px; opacity: 0.12; transform: rotate(-20deg);"></i>
                    
                    <div style="position: relative; z-index: 2;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                            <div style="font-size: 13px; font-weight: 800; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                🏡 ${g.nama || gId}
                            </div>
                            <span style="font-size: 8px; background: ${isActive ? '#FFC107' : 'rgba(255,255,255,0.25)'}; color: ${isActive ? '#000' : '#FFF'}; font-weight: bold; padding: 1px 5px; border-radius: 6px; flex-shrink: 0; margin-left: 4px;">
                                ${isActive ? 'AKTIF' : 'PILIH'}
                            </span>
                        </div>

                        <div style="font-size: 10px; font-weight: 600; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 8px; display: inline-block; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
                            ${subtitle}
                        </div>
                    </div>

                    <div style="background: rgba(0,0,0,0.18); padding: 6px 8px; border-radius: 8px; display: flex; flex-direction: column; gap: 4px; backdrop-filter: blur(2px); position: relative; z-index: 2;">
                        <div style="display: flex; justify-content: space-between; font-size: 10px;">
                            <span style="color: rgba(255,255,255,0.85);">Populasi:</span>
                            <strong style="color: #FFF;">${tPop} Phn</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 10px;">
                            <span style="color: rgba(255,255,255,0.85);">Polinasi:</span>
                            <strong style="color: #FFF;">${tPol > 0 ? tPol + ' Phn' : '-'}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 10px;">
                            <span style="color: #FFD54F; font-weight: bold;">Buah Fix:</span>
                            <strong style="color: #FFD54F;">${tBuah > 0 ? tBuah + ' Buh' : '-'}</strong>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        el.innerHTML = html;
    }

    function selectGhFilter(kodeGh) {
        selectedGh = kodeGh;
        refreshAllDashboardData();
    }

    function loadIotWaterData() {
        var el = document.getElementById('dashIotWaterCards');
        var lastUpdatedEl = document.getElementById('dashIotLastUpdated');
        if (!el) return;

        var dataNutrisi = getData('cozycs_nutrisi');
        var filteredNutrisi = (selectedGh === 'ALL') ? dataNutrisi : dataNutrisi.filter(function(n) { return (n.gh === selectedGh || n.ghId === selectedGh); });
        var latest = filteredNutrisi.length > 0 ? filteredNutrisi[filteredNutrisi.length - 1] : {};

        // UPDATE BADGE TANGGAL/WAKTU PERUBAHAN TERAKHIR
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = formatLastUpdated(latest);
        }

        var valPpm = (latest.ppm !== undefined && latest.ppm !== '') ? latest.ppm : '0';
        var valPh = (latest.ph !== undefined && latest.ph !== '') ? latest.ph : '0.0';
        var valWaterTemp = (latest.waterTemp !== undefined && latest.waterTemp !== '') ? latest.waterTemp + '°C' : '0°C';
        var valTandon = (latest.tandon !== undefined && latest.tandon !== '') ? latest.tandon : '0';

        var statusPpm = (valPpm > 0) ? t('recorded') : t('no_data');
        var statusPh = (valPh > 0) ? t('recorded') : t('no_data');

        el.innerHTML = `
            <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 12px; border: 1px solid #B2EBF2; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #E8F5E9; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-seedling" style="color: #2E7D32; font-size: 20px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">${t('nutrition')}</div>
                        <div style="font-size: 17px; font-weight: 800; color: #006064;">${valPpm} <span style="font-size: 10px; font-weight: 600; color: #777;">ppm</span></div>
                    </div>
                </div>
                <div><span style="background: ${valPpm > 0 ? '#E8F5E9' : '#F5F5F5'}; color: ${valPpm > 0 ? '#2E7D32' : '#888'}; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${statusPpm}</span></div>
            </div>

            <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 12px; border: 1px solid #B2EBF2; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #E1F5FE; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-vial" style="color: #0288D1; font-size: 20px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">${t('ph_water')}</div>
                        <div style="font-size: 17px; font-weight: 800; color: #006064;">${valPh} <span style="font-size: 10px; font-weight: 600; color: #777;">pH</span></div>
                    </div>
                </div>
                <div><span style="background: ${valPh > 0 ? '#E8F5E9' : '#F5F5F5'}; color: ${valPh > 0 ? '#2E7D32' : '#888'}; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${statusPh}</span></div>
            </div>

            <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 12px; border: 1px solid #B2EBF2; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #E0F7FA; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-thermometer-half" style="color: #00838F; font-size: 20px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">${t('water_temp')}</div>
                        <div style="font-size: 17px; font-weight: 800; color: #006064;">${valWaterTemp}</div>
                    </div>
                </div>
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${t('recorded')}</span></div>
            </div>

            <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 12px; border: 1px solid #B2EBF2; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #E1F5FE; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-water" style="color: #0277BD; font-size: 20px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">${t('tandon_water')}</div>
                        <div style="font-size: 17px; font-weight: 800; color: #006064;">${valTandon} <span style="font-size: 10px; font-weight: 600; color: #777;">%</span></div>
                    </div>
                </div>
                <div><span style="background: #E1F5FE; color: #0277BD; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${t('water_level')}</span></div>
            </div>
        `;
    }

    function loadIotEnvData() {
        var el = document.getElementById('dashIotEnvCards');
        if (!el) return;

        var dataNutrisi = getData('cozycs_nutrisi');
        var filteredNutrisi = (selectedGh === 'ALL') ? dataNutrisi : dataNutrisi.filter(function(n) { return (n.gh === selectedGh || n.ghId === selectedGh); });
        var latest = filteredNutrisi.length > 0 ? filteredNutrisi[filteredNutrisi.length - 1] : {};

        var valRoomTemp = (latest.roomTemp !== undefined && latest.roomTemp !== '') ? latest.roomTemp + '°C' : '0°C';
        var valHumidity = (latest.humidity !== undefined && latest.humidity !== '') ? latest.humidity : '0';
        var valLux = (latest.lux !== undefined && latest.lux !== '') ? latest.lux : '0';

        el.innerHTML = `
            <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 12px; border: 1px solid #B2EBF2; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #FFF3E0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-temperature-high" style="color: #E65100; font-size: 20px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">${t('room_temp')}</div>
                        <div style="font-size: 17px; font-weight: 800; color: #006064;">${valRoomTemp}</div>
                    </div>
                </div>
                <div><span style="background: #FFF3E0; color: #E65100; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${t('room_temp_lbl')}</span></div>
            </div>

            <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 12px; border: 1px solid #B2EBF2; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #E3F2FD; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-tint-slash" style="color: #1E88E5; font-size: 20px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">${t('humidity')}</div>
                        <div style="font-size: 17px; font-weight: 800; color: #006064;">${valHumidity} <span style="font-size: 10px; font-weight: 600; color: #777;">%</span></div>
                    </div>
                </div>
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${t('rh_gh')}</span></div>
            </div>

            <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 12px; border: 1px solid #B2EBF2; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #FFFDE7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-sun" style="color: #F57F17; font-size: 20px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">${t('light')}</div>
                        <div style="font-size: 17px; font-weight: 800; color: #006064;">${valLux} <span style="font-size: 10px; font-weight: 600; color: #777;">Lux</span></div>
                    </div>
                </div>
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${t('intensity')}</span></div>
            </div>

            <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 12px; border: 1px solid #B2EBF2; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: ${isAirflowOn ? '#EDE7F6' : '#F5F5F5'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.3s ease;">
                        <i class="fas fa-fan" style="color: ${isAirflowOn ? '#512DA8' : '#9E9E9E'}; font-size: 20px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">${t('airflow')}</div>
                        <div style="font-size: 15px; font-weight: 800; color: ${isAirflowOn ? '#2E7D32' : '#C62828'}; transition: color 0.3s ease;">
                            ${isAirflowOn ? t('active') : t('inactive')}
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; align-items: center;">
                    <div onclick="dashboard.toggleAirflow()" style="width: 38px; height: 20px; background: ${isAirflowOn ? '#4CAF50' : '#CCCCCC'}; border-radius: 12px; position: relative; cursor: pointer; transition: background 0.3s ease;">
                        <div style="width: 16px; height: 16px; background: #ffffff; border-radius: 50%; position: absolute; top: 2px; left: ${isAirflowOn ? '20px' : '2px'}; transition: left 0.3s ease;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    function loadTodayAgenda() {
        var el = document.getElementById('dashTodayAgendaList');
        var dateEl = document.getElementById('dashTodayDate');
        if (!el) return;

        var todayStr = (typeof Helper !== 'undefined' && Helper.getTodayDate) ? Helper.getTodayDate() : new Date().toISOString().split('T')[0];
        if (dateEl) dateEl.innerText = (typeof Helper !== 'undefined' && Helper.formatDate) ? Helper.formatDate(todayStr) : todayStr;

        var schedules = getData('cozycs_schedules');

        var todayTasks = schedules.filter(function(s) {
            var sDate = s.date || s.tanggal || '';
            var matchDate = (sDate === todayStr);
            var sGh = s.gh || s.greenhouse || 'ALL';
            var matchGh = (selectedGh === 'ALL') || (sGh === selectedGh) || (sGh === 'ALL');
            return matchDate && matchGh;
        });

        if (todayTasks.length === 0) {
            el.innerHTML = `
                <div style="text-align: center; padding: 12px; color: #16A085; font-size: 12px; font-weight: 600;">
                    <i class="far fa-calendar-check" style="font-size: 20px; color: #2E7D32; margin-bottom: 4px; display: block;"></i>
                    ${t('no_agenda')}
                </div>
            `;
            return;
        }

        var html = '';
        todayTasks.slice(0, 10).forEach(function(item, idx) {
            var isDone = (item.status === 'Selesai' || item.status === 'DONE' || item.completed === true);
            var taskId = item.id || idx;
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: rgba(255,255,255,0.7); border-radius: 8px; margin-bottom: 6px; border: 1px solid #A3E4D7;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" ${isDone ? 'checked' : ''} onchange="dashboard.toggleTask('${taskId}')" style="width: 16px; height: 16px; cursor: pointer;">
                        <span style="font-size: 12px; font-weight: 600; color: ${isDone ? '#888888' : '#117A65'}; text-decoration: ${isDone ? 'line-through' : 'none'};">
                            ${item.title || item.judul || item.kegiatan || item.nama || 'Agenda'}
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

    function parseGhDates(gh) {
        if (!gh) return { tanam: null, target: null };
        var targetStr = gh.target || gh.targetPanen || gh.tglTarget || gh.estimasiPanen || 
                        gh.tglPanen || gh.siklusTarget || gh.targetDate || gh.tanggalTarget || 
                        gh.tanggalPanen || gh.target_panen || gh.tgl_target || gh.estimasi_panen || 
                        gh.estPanen || gh.tgl_estimasi;

        var tanamStr = gh.tanam || gh.tglTanam || gh.tanggalTanam || gh.beroperasi || 
                       gh.siklusTanam || gh.tanamDate || gh.tgl_tanam || gh.tanggal_tanam || 
                       gh.tgl_mulai || gh.mulaiTanam;

        if (gh.siklus && typeof gh.siklus === 'object') {
            targetStr = targetStr || gh.siklus.target || gh.siklus.targetPanen || gh.siklus.estimasiPanen;
            tanamStr = tanamStr || gh.siklus.tanam || gh.siklus.tglTanam || gh.siklus.tanggalTanam;
        }

        return {
            tanam: parseLocalDate(tanamStr),
            target: parseLocalDate(targetStr)
        };
    }

    function loadProgressMusim() {
        var el = document.getElementById('dashProgressMusim');
        if (!el) return;

        var dataGh = sortGhList(getData('cozycs_greenhouse'));
        var dataTanaman = getData('cozycs_tanaman');
        var dataBuah = getData('cozycs_buah');

        var today = parseLocalDate(new Date());

        var targetGhList = (selectedGh === 'ALL') 
            ? dataGh 
            : dataGh.filter(function(g) { return (g.kode === selectedGh || g.id === selectedGh || g.nama === selectedGh); });

        var filteredTanaman = (selectedGh === 'ALL') 
            ? dataTanaman 
            : dataTanaman.filter(function(t) { return (t.gh === selectedGh || t.ghId === selectedGh); });

        var explicitTanamDate = null;
        var explicitHarvestDate = null;

        for (var i = 0; i < targetGhList.length; i++) {
            var gDates = parseGhDates(targetGhList[i]);
            if (gDates.target) explicitHarvestDate = gDates.target;
            if (gDates.tanam) explicitTanamDate = gDates.tanam;
            if (explicitHarvestDate && explicitTanamDate) break;
        }

        if (!explicitTanamDate || !explicitHarvestDate) {
            filteredTanaman.forEach(function(t) {
                var tglT = parseLocalDate(t.tanggal || t.tanam || t.tglTanam);
                var tglH = parseLocalDate(t.target || t.targetPanen || t.tglTarget || t.estimasiPanen);
                if (tglT && !explicitTanamDate) explicitTanamDate = tglT;
                if (tglH && !explicitHarvestDate) explicitHarvestDate = tglH;
            });
        }

        if (!explicitTanamDate && filteredTanaman.length === 0 && targetGhList.length === 0) {
            el.innerHTML = `
                <div style="background: rgba(255,255,255,0.8); padding: 12px; border-radius: 10px; text-align: center; color: #888; font-size: 11px; border: 1px dashed #FFE082;">
                    Belum ada tanaman aktif di <strong>${selectedGh}</strong>.
                </div>
            `;
            return;
        }

        var totalTargetDays = 65; 
        if (explicitHarvestDate && explicitTanamDate && explicitHarvestDate > explicitTanamDate) {
            totalTargetDays = Math.round((explicitHarvestDate - explicitTanamDate) / (1000 * 60 * 60 * 24));
        }

        var isBelumTanam = false;
        var daysToTanam = 0;
        var maxHst = 0;

        if (explicitTanamDate) {
            if (today < explicitTanamDate) {
                isBelumTanam = true;
                daysToTanam = Math.round((explicitTanamDate - today) / (1000 * 60 * 60 * 24));
                maxHst = 0;
            } else {
                maxHst = Math.floor((today - explicitTanamDate) / (1000 * 60 * 60 * 24));
            }
        }

        var sisaHari = isBelumTanam ? totalTargetDays : Math.max(0, totalTargetDays - maxHst);

        var estHarvestDateStr = "-";
        if (explicitHarvestDate) {
            estHarvestDateStr = explicitHarvestDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        } else if (explicitTanamDate) {
            var targetPanen = new Date(explicitTanamDate.getTime());
            targetPanen.setDate(targetPanen.getDate() + totalTargetDays);
            estHarvestDateStr = targetPanen.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        }

        var uniqueHoles = new Set();
        var varietasSet = new Set();

        filteredTanaman.forEach(function(t) {
            if (t.talang && t.talang !== '-') uniqueHoles.add(t.talang);
            if (t.varietas) varietasSet.add(t.varietas);
        });

        var totalPopulasi = uniqueHoles.size > 0 ? uniqueHoles.size : filteredTanaman.length;
        if (totalPopulasi === 0 && targetGhList.length > 0) {
            targetGhList.forEach(function(g) {
                totalPopulasi += (parseFloat(g.lubang) || parseFloat(g.kapasitas) || parseFloat(g.populasi) || 0);
                if (g.varietas) varietasSet.add(g.varietas);
            });
        }
        var varietasStr = Array.from(varietasSet).join(', ') || 'Melon';

        var phaseTitle = "Vegetatif Awal";
        var currentStep = 1;

        if (isBelumTanam) {
            phaseTitle = "Persiapan Tanam (H-" + daysToTanam + ")";
            currentStep = 1;
        } else {
            var ratio = totalTargetDays > 0 ? (maxHst / totalTargetDays) : 0;
            if (ratio > 0.20 && ratio <= 0.40) {
                currentStep = 2;
                phaseTitle = "Vegetatif Lanjutan";
            } else if (ratio > 0.40 && ratio <= 0.60) {
                currentStep = 3;
                phaseTitle = "Masa Polinasi";
            } else if (ratio > 0.60) {
                currentStep = 4;
                phaseTitle = "Pembesaran & Panen";
            }
        }

        var totalBuahFix = 0;
        var filteredBuah = (selectedGh === 'ALL') ? dataBuah : dataBuah.filter(function(b) { return (b.gh === selectedGh || b.ghId === selectedGh); });
        filteredBuah.forEach(function(b) { totalBuahFix += (parseFloat(b.jumlahFix) || parseFloat(b.jumlah) || 0); });

        el.innerHTML = `
            <!-- HEADER RINGKAS -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; border-bottom: 1px dashed #FFE082; padding-bottom: 10px;">
                <div>
                    <span style="font-size: 10px; background: ${isBelumTanam ? '#FFF3E0' : '#E8F5E9'}; color: ${isBelumTanam ? '#E65100' : '#2E7D32'}; padding: 3px 8px; border-radius: 6px; font-weight: bold; text-transform: uppercase; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">${phaseTitle}</span>
                    <div style="font-size: 18px; font-weight: 800; color: #E65100; margin-top: 6px;">
                        ${maxHst} <span style="font-size: 12px; font-weight: normal; color: #795548;">/ ${totalTargetDays} HST</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 10px; color: #8D6E63; font-weight: 600;">Estimasi Panen</div>
                    <div style="font-size: 12px; font-weight: 800; color: #0277BD;">📅 ${estHarvestDateStr}</div>
                    <div style="font-size: 10px; color: #666; font-weight: 600;">(${sisaHari} Hari Siklus)</div>
                </div>
            </div>

            <!-- TIMELINE 4 FASE (STEPPER) -->
            <div style="display: flex; justify-content: space-between; position: relative; margin-bottom: 14px; padding: 0 5px;">
                <div style="position: absolute; top: 10px; left: 10px; right: 10px; height: 3px; background: #FFE082; z-index: 1;"></div>
                <div style="position: absolute; top: 10px; left: 10px; width: ${((currentStep - 1) / 3) * 100}%; height: 3px; background: #2E7D32; z-index: 1; transition: width 0.3s ease;"></div>

                <div style="text-align: center; position: relative; z-index: 2;">
                    <div style="width: 22px; height: 22px; border-radius: 50%; background: ${currentStep >= 1 ? '#2E7D32' : '#FFF'}; border: 2px solid #2E7D32; color: ${currentStep >= 1 ? '#FFF' : '#2E7D32'}; font-size: 10px; font-weight: bold; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px auto;">1</div>
                    <span style="font-size: 9px; color: ${currentStep === 1 ? '#2E7D32' : '#795548'}; font-weight: ${currentStep === 1 ? 'bold' : 'normal'};">Veg Awal</span>
                </div>

                <div style="text-align: center; position: relative; z-index: 2;">
                    <div style="width: 22px; height: 22px; border-radius: 50%; background: ${currentStep >= 2 ? '#2E7D32' : '#FFF'}; border: 2px solid ${currentStep >= 2 ? '#2E7D32' : '#CCC'}; color: ${currentStep >= 2 ? '#FFF' : '#888'}; font-size: 10px; font-weight: bold; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px auto;">2</div>
                    <span style="font-size: 9px; color: ${currentStep === 2 ? '#2E7D32' : '#795548'}; font-weight: ${currentStep === 2 ? 'bold' : 'normal'};">Vegetatif</span>
                </div>

                <div style="text-align: center; position: relative; z-index: 2;">
                    <div style="width: 22px; height: 22px; border-radius: 50%; background: ${currentStep >= 3 ? '#2E7D32' : '#FFF'}; border: 2px solid ${currentStep >= 3 ? '#2E7D32' : '#CCC'}; color: ${currentStep >= 3 ? '#FFF' : '#888'}; font-size: 10px; font-weight: bold; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px auto;">3</div>
                    <span style="font-size: 9px; color: ${currentStep === 3 ? '#2E7D32' : '#795548'}; font-weight: ${currentStep === 3 ? 'bold' : 'normal'};">Polinasi</span>
                </div>

                <div style="text-align: center; position: relative; z-index: 2;">
                    <div style="width: 22px; height: 22px; border-radius: 50%; background: ${currentStep >= 4 ? '#2E7D32' : '#FFF'}; border: 2px solid ${currentStep >= 4 ? '#2E7D32' : '#CCC'}; color: ${currentStep >= 4 ? '#FFF' : '#888'}; font-size: 10px; font-weight: bold; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px auto;">4</div>
                    <span style="font-size: 9px; color: ${currentStep === 4 ? '#2E7D32' : '#795548'}; font-weight: ${currentStep === 4 ? 'bold' : 'normal'};">Pembesaran</span>
                </div>
            </div>

            <!-- KETERANGAN KONDISIONAL -->
            <div style="background: rgba(255,255,255,0.85); padding: 8px 12px; border-radius: 10px; border: 1px solid #FFE082; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                <div>
                    <span style="color: #666;">Populasi Aktif:</span>
                    <strong style="color: #333;">${totalPopulasi} Pohon</strong> (${varietasStr})
                </div>
                ${
                    totalBuahFix > 0
                    ? `<div><span style="color: #666;">Buah Fix:</span> <strong style="color: #E65100;">${totalBuahFix} Buah (~${Math.round(totalBuahFix * 1.5)} Kg)</strong></div>`
                    : `<div style="color: #888; font-size: 10px; font-style: italic;">*Estimasi panen dihitung setelah Polinasi</div>`
                }
            </div>
        `;
    }

    function loadRecentActivities() {
        var el = document.getElementById('dashRecentActivities');
        if (!el) return;

        var allLogs = [];

        var explicitLogs = getData('cozycs_aktivitas');
        if (explicitLogs.length === 0) explicitLogs = getData('cozycs_activities');
        if (explicitLogs.length === 0) explicitLogs = getData('cozycs_logs');

        if (explicitLogs.length > 0) {
            explicitLogs.forEach(function(item) {
                allLogs.push({
                    timestamp: item.timestamp || item.created_at || (item.tanggal ? (item.tanggal + 'T' + (item.jam || '00:00') + ':00') : new Date().toISOString()),
                    jam: item.jam || item.waktu || 'Baru',
                    text: item.judul || item.text || item.kegiatan || 'Aktivitas',
                    desc: item.deskripsi || item.keterangan || '',
                    gh: item.gh || 'ALL'
                });
            });
        } else {
            var allTanaman = getData('cozycs_tanaman') || [];
            var allNutrisi = getData('cozycs_nutrisi') || [];
            var allPanen = getData('cozycs_panen') || [];
            var allBuah = getData('cozycs_buah') || [];
            var allSpray = getData('cozycs_spray') || [];

            var plantGroupMap = {};
            allTanaman.forEach(function(item) {
                var groupKey = (item.varietas || 'Melon') + '_' + (item.gh || 'GH') + '_' + (item.tanggal || 'Today');
                if (!plantGroupMap[groupKey]) {
                    plantGroupMap[groupKey] = {
                        timestamp: item.createdAt || item.tanggal || new Date().toISOString(),
                        jam: item.jam || item.waktu || 'Tercatat',
                        varietas: item.varietas || 'Melon',
                        gh: item.gh || 'GH',
                        totalJumlah: 0
                    };
                }
                plantGroupMap[groupKey].totalJumlah += (parseFloat(item.jumlah) || 1);
            });

            Object.values(plantGroupMap).forEach(function(g) {
                allLogs.push({
                    timestamp: g.timestamp,
                    jam: g.jam,
                    text: 'Tanam: ' + g.varietas,
                    desc: 'GH: ' + g.gh + ' | Total: ' + g.totalJumlah + ' Pohon',
                    gh: g.gh
                });
            });

            allNutrisi.forEach(function(item) {
                allLogs.push({
                    timestamp: item.createdAt || item.tanggal || new Date().toISOString(),
                    jam: item.jam || item.waktu || 'Tercatat',
                    text: 'Nutrisi: ' + (item.ppm || 0) + ' PPM',
                    desc: 'pH: ' + (item.ph || '-') + ' | GH: ' + (item.gh || 'GH'),
                    gh: item.gh || 'ALL'
                });
            });

            allSpray.forEach(function(item) {
                allLogs.push({
                    timestamp: item.createdAt || item.tanggal || new Date().toISOString(),
                    jam: item.jam || item.waktu || 'Tercatat',
                    text: 'Aplikasi Spray',
                    desc: (item.bahan || item.pestisida || 'Penyemprotan') + ' (' + (item.gh || 'GH') + ')',
                    gh: item.gh || 'ALL'
                });
            });

            allPanen.forEach(function(item) {
                allLogs.push({
                    timestamp: item.createdAt || item.tanggal || new Date().toISOString(),
                    jam: item.jam || item.waktu || 'Tercatat',
                    text: 'Panen Melon',
                    desc: (item.totalKg || item.jumlah || 0) + ' Kg (' + (item.gh || 'GH') + ')',
                    gh: item.gh || 'ALL'
                });
            });

            allBuah.forEach(function(item) {
                allLogs.push({
                    timestamp: item.createdAt || item.tanggal || new Date().toISOString(),
                    jam: item.jam || item.waktu || 'Tercatat',
                    text: 'Seleksi Buah Fix',
                    desc: (item.tindakan || 'Monitoring Buah') + ' (' + (item.gh || 'GH') + ')',
                    gh: item.gh || 'ALL'
                });
            });
        }

        var filteredLogs = (selectedGh === 'ALL') 
            ? allLogs 
            : allLogs.filter(function(l) { return l.gh === selectedGh || l.gh === 'ALL' || !l.gh; });

        if (filteredLogs.length === 0) {
            el.innerHTML = `<div style="font-size: 11px; color: #5C6BC0; text-align: center; padding: 12px 0; font-weight: 600;">${t('no_logs')}</div>`;
            return;
        }

        filteredLogs.sort(function(a, b) {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

        var html = '';
        filteredLogs.slice(0, 5).forEach(function(l) {
            var jamStr = (l.jam && l.jam !== 'Tercatat') ? l.jam : parseJamFromTimestamp(l.timestamp);
            var mainText = l.text || 'Aktivitas';
            var descText = l.desc ? (' - ' + l.desc) : '';

            html += `
                <div style="display: flex; gap: 10px; font-size: 11px; align-items: center; background: rgba(255,255,255,0.85); padding: 8px 10px; border-radius: 8px; border: 1px solid #B3E5FC; margin-bottom: 4px;">
                    <span style="font-weight: bold; color: #0277BD; width: 55px; flex-shrink: 0; font-size: 10px; background: #E1F5FE; padding: 2px 4px; border-radius: 4px; text-align: center;">${jamStr}</span>
                    <span style="color: #283593; flex-grow: 1;"><strong>${mainText}</strong><span style="color: #5C6BC0;">${descText}</span></span>
                </div>
            `;
        });

        el.innerHTML = html;
    }

    function parseJamFromTimestamp(ts) {
        try {
            var d = new Date(ts);
            if (isNaN(d.getTime())) return 'Baru';
            var h = String(d.getHours()).padStart(2, '0');
            var m = String(d.getMinutes()).padStart(2, '0');
            return h + ':' + m;
        } catch(e) {
            return 'Baru';
        }
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
        var keyName = 'cozycs_schedules';
        if (schedules.length === 0) {
            schedules = getData('cozycs_jadwal');
            keyName = 'cozycs_jadwal';
        }

        var item = schedules.find(function(s, idx) { return (s.id === id || idx == id); });
        if (item) {
            if (item.status === 'Selesai' || item.completed === true) {
                item.status = 'Belum Dikerjakan';
                item.completed = false;
            } else {
                item.status = 'Selesai';
                item.completed = true;
            }
            localStorage.setItem(keyName, JSON.stringify(schedules));
            if (typeof Storage !== 'undefined' && Storage.saveAll) {
                Storage.saveAll(keyName, schedules);
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
        toggleTask: toggleTask,
        detectUserLocation: detectUserLocation,
        refreshAllDashboardData: refreshAllDashboardData,
        manualRefreshLogs: manualRefreshLogs,
        logActivity: logActivity
    };

})();

window.dashboard = dashboard;
window.logCozycsActivity = dashboard.logActivity;
