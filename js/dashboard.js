// ==========================================
// COZYCS FARM - EXECUTIVE DASHBOARD (BILINGUAL & DARK MODE FULL)
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

    // KAMUS BAHASA KUSUS DASBOR
    var i18nDict = {
        'id': {
            'greeting_sub': 'Semoga panen melimpah hari ini!',
            'select_gh': 'Pilih Tampilan Greenhouse:',
            'all_gh': '🌐 Semua GH',
            'water_env_mon': 'Monitoring Air Dan Lingkungan',
            'latest': 'Terbaru',
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
            'active_plants': '🌱 Tanaman Aktif',
            'living_plants': '🌿 Tanaman Hidup',
            'selected_fruit': '🍈 Buah Fix',
            'est_harvest': '📅 Estimasi Panen',
            'initial_cap': 'Kapasitas Awal',
            'active_pop': 'Populasi Aktif',
            'selection_passed': 'Seleksi Lolos',
            'today_agenda': 'Agenda Hari Ini',
            'today': 'Hari Ini',
            'no_agenda': 'Tidak ada agenda kegiatan untuk hari ini.',
            'season_progress': 'Progress Musim & Estimasi Hasil',
            'recent_act': 'Aktivitas Terakhir (Audit Log)',
            'no_logs': 'Belum ada riwayat aktivitas tercatat.',
            'quick_action': 'Quick Action / Input Cepat',
            'btn_nutrition': '+ Nutrisi',
            'btn_spray': '+ Spray',
            'btn_warehouse': '+ Gudang',
            'btn_harvest': '+ Panen',
            'btn_schedule': '+ Jadwal',
            'btn_pests': '+ Hama',
            'stem': 'Batang',
            'tree': 'Pohon',
            'fruit': 'Buah'
        },
        'en': {
            'greeting_sub': 'May your harvest be abundant today!',
            'select_gh': 'Select Greenhouse View:',
            'all_gh': '🌐 All GH',
            'water_env_mon': 'Water & Environment Monitoring',
            'latest': 'Latest',
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
            'active_plants': '🌱 Active Plants',
            'living_plants': '🌿 Living Plants',
            'selected_fruit': '🍈 Selected Fruit',
            'est_harvest': '📅 Est. Harvest',
            'initial_cap': 'Initial Capacity',
            'active_pop': 'Active Population',
            'selection_passed': 'Selected Passed',
            'today_agenda': "Today's Agenda",
            'today': 'Today',
            'no_agenda': 'No scheduled activities for today.',
            'season_progress': 'Season Progress & Estimated Yield',
            'recent_act': 'Recent Activities (Audit Log)',
            'no_logs': 'No activity logs recorded yet.',
            'quick_action': 'Quick Action / Fast Input',
            'btn_nutrition': '+ Nutrition',
            'btn_spray': '+ Spray',
            'btn_warehouse': '+ Stock',
            'btn_harvest': '+ Harvest',
            'btn_schedule': '+ Schedule',
            'btn_pests': '+ Pests',
            'stem': 'Stems',
            'tree': 'Trees',
            'fruit': 'Fruits'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function render() {
        return `
            <div class="dashboard-container" style="padding-bottom: 30px;">
                
                <!-- 0. WELCOME BANNER, REAL-TIME CLOCK & WEATHER -->
                <div id="dashWelcomeBanner" style="margin-bottom: 12px;"></div>

                <!-- 1. SWITCHER / FILTER GREENHOUSE -->
                <div style="background: var(--card-bg, #fff); padding: 10px 12px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 12px;">
                    <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">${t('select_gh')}</div>
                    <div id="dashGhSwitcher" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;"></div>
                </div>

                <!-- 2. KARTU INFORMASI GH BANNER -->
                <div id="dashGhInfoBanner" style="margin-bottom: 16px;"></div>
                
// Tambahkan ini di dalam return render() pada dashboard.js kamu, 
// tepat di atas bagian "Monitoring Air Dan Lingkungan"

`
<!-- AREA GREENHOUSE SELECTOR (SWIPEABLE CARDS) -->
<div style="margin-bottom: 20px;">
    
    <!-- Header Bagian -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 0 4px;">
        <div style="font-size: 14px; font-weight: 800; color: var(--text-color, #111);">Pilih Greenhouse</div>
        <div style="font-size: 12px; font-weight: 700; color: #2E7D32; cursor: pointer;">Lihat Semua <i class="fas fa-chevron-right" style="font-size: 10px;"></i></div>
    </div>

    <!-- Kontainer Horizontal Scroll (Swipe Area) -->
    <div class="gh-slider" style="display: flex; gap: 14px; overflow-x: auto; padding-bottom: 10px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">

        <!-- KARTU 1: GH-01 (Kondisi Aktif/Dipilih) -->
        <div onclick="dashboard.selectGH('GH-01')" style="min-width: 85%; flex: 0 0 85%; background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%); border-radius: 16px; padding: 18px; color: #fff; scroll-snap-align: center; box-shadow: 0 6px 16px rgba(46, 125, 50, 0.3); position: relative; overflow: hidden; cursor: pointer;">
            <!-- Hiasan Background Vektor (Opsional) -->
            <i class="fas fa-leaf" style="position: absolute; right: -10px; bottom: -10px; font-size: 80px; opacity: 0.1; transform: rotate(-20deg);"></i>
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; position: relative; z-index: 2;">
                <div>
                    <div style="font-size: 18px; font-weight: 800; margin-bottom: 4px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">GH-01 Premium</div>
                    <div style="font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 20px; display: inline-block; backdrop-filter: blur(4px);">
                        🍈 Pembesaran Buah (45 HST)
                    </div>
                </div>
                <!-- Indikator Aktif -->
                <div style="background: #F59E0B; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 8px rgba(245, 158, 11, 0.8);"></div>
            </div>

            <!-- Grid Data Corong Tanaman -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; position: relative; z-index: 2; background: rgba(0,0,0,0.15); padding: 10px; border-radius: 12px;">
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #e8f5e9; margin-bottom: 4px;">Populasi</div>
                    <div style="font-size: 14px; font-weight: 700;">1.200 <span style="font-size: 9px; font-weight: normal;">Phn</span></div>
                </div>
                <div style="text-align: center; border-left: 1px solid rgba(255,255,255,0.2); border-right: 1px solid rgba(255,255,255,0.2);">
                    <div style="font-size: 10px; color: #e8f5e9; margin-bottom: 4px;">Polinasi</div>
                    <div style="font-size: 14px; font-weight: 700;">1.150 <span style="font-size: 9px; font-weight: normal;">Phn</span></div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #F59E0B; font-weight: bold; margin-bottom: 4px;">Buah Fix</div>
                    <div style="font-size: 14px; font-weight: 800; color: #fff;">1.100 <span style="font-size: 9px; font-weight: normal;">Buh</span></div>
                </div>
            </div>
        </div>

        <!-- KARTU 2: GH-02 (Kondisi Tidak Aktif / Abu-abu terang) -->
        <div onclick="dashboard.selectGH('GH-02')" style="min-width: 85%; flex: 0 0 85%; background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 16px; padding: 18px; color: var(--text-color, #333); scroll-snap-align: center; cursor: pointer; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
                <div>
                    <div style="font-size: 18px; font-weight: 800; margin-bottom: 4px;">GH-02 Standar</div>
                    <div style="font-size: 11px; font-weight: 600; color: #666; background: #f0f0f0; padding: 3px 8px; border-radius: 20px; display: inline-block;">
                        🌱 Vegetatif Awal (14 HST)
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: #f9f9f9; padding: 10px; border-radius: 12px; border: 1px solid #eee;">
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #888; margin-bottom: 4px;">Populasi</div>
                    <div style="font-size: 14px; font-weight: 700; color: #333;">1.500 <span style="font-size: 9px; font-weight: normal;">Phn</span></div>
                </div>
                <div style="text-align: center; border-left: 1px solid #ddd; border-right: 1px solid #ddd;">
                    <div style="font-size: 10px; color: #888; margin-bottom: 4px;">Polinasi</div>
                    <div style="font-size: 14px; font-weight: 700; color: #333;">-</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #888; margin-bottom: 4px;">Buah Fix</div>
                    <div style="font-size: 14px; font-weight: 700; color: #333;">-</div>
                </div>
            </div>
        </div>

    </div>
</div>

<!-- CSS Tambahan untuk Menyembunyikan Scrollbar (Letakkan di area tag <style>) -->
<style>
    /* Sembunyikan scrollbar di slider GH tapi tetap bisa di-swipe */
    .gh-slider::-webkit-scrollbar {
        display: none;
    }
    .gh-slider {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
`

                

                <!-- 3. MONITORING AIR DAN LINGKUNGAN -->
                <div style="background: var(--card-bg, #fff); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 13px; font-weight: 700; color: #0277BD;"><i class="fas fa-tint" style="margin-right: 4px;"></i> ${t('water_env_mon')}</span>
                            <span style="font-size: 9px; background: #E1F5FE; color: #0277BD; padding: 2px 6px; border-radius: 8px; font-weight: bold;">${t('latest')}</span>
                        </div>
                        
                        <button onclick="dashboard.toggleIotSection()" title="Toggle Monitoring" style="width: 28px; height: 28px; border-radius: 50%; background: var(--card-bg, #F0F4F8); border: 1px solid var(--border-color, #D0D7DE); color: #0277BD; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0;">
                            <i id="iconToggleIot" class="fas ${isIotCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}" style="font-size: 12px;"></i>
                        </button>
                    </div>

                    <div id="wrapperIotContent" style="display: ${isIotCollapsed ? 'none' : 'block'}; margin-top: 14px; transition: all 0.3s ease;">
                        <div style="font-size: 11px; font-weight: 700; color: #555; margin-bottom: 8px; text-transform: uppercase;">${t('water_param')}</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px;" id="dashIotWaterCards"></div>

                        <div style="font-size: 11px; font-weight: 700; color: #555; margin-bottom: 8px; text-transform: uppercase;">${t('env_param')}</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;" id="dashIotEnvCards"></div>
                    </div>
                </div>

                <!-- 4. EXECUTIVE SUMMARY -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px;" id="dashExecutiveSummary"></div>

                <!-- 5. AGENDA HARI INI -->
                <div style="background: var(--card-bg, #fff); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 13px; font-weight: 700; color: #1B5E20;"><i class="fas fa-tasks" style="color: #2E7D32; margin-right: 6px;"></i> ${t('today_agenda')}</span>
                        <span style="font-size: 10px; color: #777;" id="dashTodayDate">${t('today')}</span>
                    </div>
                    <div id="dashTodayAgendaList"></div>
                </div>

                <!-- 6. PROGRESS MUSIM & ESTIMASI OMZET -->
                <div style="background: var(--card-bg, #fff); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 16px;">
                    <div style="font-size: 13px; font-weight: 700; color: #2E7D32; margin-bottom: 10px;"><i class="fas fa-seedling" style="margin-right: 6px;"></i> ${t('season_progress')}</div>
                    <div id="dashProgressMusim"></div>
                </div>

                <!-- 7. AKTIVITAS TERAKHIR -->
                <div style="background: var(--card-bg, #fff); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 13px; font-weight: 700; color: #424242; margin-bottom: 10px;"><i class="fas fa-history" style="color: #0277BD; margin-right: 6px;"></i> ${t('recent_act')}</div>
                    <div id="dashRecentActivities" style="display: flex; flex-direction: column; gap: 8px;"></div>
                </div>

                <!-- 8. QUICK ACTION BUTTONS -->
                <div style="background: var(--card-bg, #F5F5F5); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #e0e0e0);">
                    <div style="font-size: 11px; font-weight: 700; color: #616161; margin-bottom: 8px; text-transform: uppercase;">${t('quick_action')}</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
                        <button onclick="navigateTo('nutrisi')" style="padding: 8px 4px; border-radius: 8px; border: 1px solid #B3E5FC; background: #E1F5FE; color: #0277BD; font-weight: bold; font-size: 11px; cursor: pointer;">${t('btn_nutrition')}</button>
                        <button onclick="navigateTo('spray')" style="padding: 8px 4px; border-radius: 8px; border: 1px solid #E1BEE7; background: #F3E5F5; color: #6A1B9A; font-weight: bold; font-size: 11px; cursor: pointer;">${t('btn_spray')}</button>
                        <button onclick="navigateTo('gudang')" style="padding: 8px 4px; border-radius: 8px; border: 1px solid #FFE0B2; background: #FFF3E0; color: #E65100; font-weight: bold; font-size: 11px; cursor: pointer;">${t('btn_warehouse')}</button>
                        <button onclick="navigateTo('panen')" style="padding: 8px 4px; border-radius: 8px; border: 1px solid #C8E6C9; background: #E8F5E9; color: #2E7D32; font-weight: bold; font-size: 11px; cursor: pointer;">${t('btn_harvest')}</button>
                        <button onclick="navigateTo('jadwal')" style="padding: 8px 4px; border-radius: 8px; border: 1px solid #D1C4E9; background: #EDE7F6; color: #512DA8; font-weight: bold; font-size: 11px; cursor: pointer;">${t('btn_schedule')}</button>
                        <button onclick="navigateTo('hama')" style="padding: 8px 4px; border-radius: 8px; border: 1px solid #FFCDD2; background: #FFEBEE; color: #C62828; font-weight: bold; font-size: 11px; cursor: pointer;">${t('btn_pests')}</button>
                    </div>
                </div>
            </div>
        `;
    }

    function init() {
        renderGhSwitcher();
        refreshAllDashboardData();
        startLiveClock();
        fetchWeatherByCoords(currentLocation.lat, currentLocation.lon, currentLocation.city);
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
            function(error) {
                if (locIconEl) locIconEl.className = 'fas fa-crosshairs';
            },
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

        var isEn = (localStorage.getItem('cozycs_lang') === 'en');
        var greeting = (typeof Helper !== 'undefined' && Helper.getGreeting) ? Helper.getGreeting() : { text: 'Selamat Sore' };
        var greetingText = greeting.text;
        if (isEn) {
            if (greetingText.includes('Pagi')) greetingText = 'Good Morning';
            else if (greetingText.includes('Siang')) greetingText = 'Good Afternoon';
            else if (greetingText.includes('Sore')) greetingText = 'Good Afternoon';
            else greetingText = 'Good Evening';
        }

        var dateTimeStr = (typeof Helper !== 'undefined' && Helper.getFullDateTime) ? Helper.getFullDateTime() : '';

        el.innerHTML = `
            <div style="background: var(--card-bg, #ffffff); border-radius: 16px; padding: 16px; border: 1px solid var(--border-color, #e8e8e8);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 46px; height: 46px; border-radius: 50%; background: #E8F5E9; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; border: 1px solid #C8E6C9;">
                            👨‍🌾
                        </div>
                        <div>
                            <div id="liveGreetingText" style="font-size: 16px; font-weight: 800; color: #1B5E20; line-height: 1.2;">
                                ${greetingText}
                            </div>
                            <div style="font-size: 11px; color: #666; margin-top: 3px;">
                                ${t('greeting_sub')}
                            </div>
                        </div>
                    </div>

                    <div style="text-align: right; flex-shrink: 0;">
                        <div id="liveWeatherIcon" style="font-size: 22px; line-height: 1;">${pesawaranWeather.icon}</div>
                        <div id="liveWeatherTemp" style="font-size: 15px; font-weight: 800; color: var(--text-color, #222); margin-top: 2px;">
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
                        <span id="liveLocationName">${currentLocation.city}</span>
                        <button onclick="dashboard.detectUserLocation()" title="GPS Location" style="background: #FFEBEE; border: 1px solid #FFCDD2; color: #D32F2F; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0;">
                            <i id="btnGpsTargetIcon" class="fas fa-crosshairs" style="font-size: 11px;"></i>
                        </button>
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
                ${t('all_gh')}
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

    function loadGhInfoBanner() {
        var el = document.getElementById('dashGhInfoBanner');
        if (!el) return;

        var dataGh = getData('cozycs_greenhouse');
        var dataTanaman = getData('cozycs_tanaman');
        var melonImgUrl = 'https://cdn-icons-png.flaticon.com/512/2909/2909787.png';

        if (dataGh.length === 0) {
            el.innerHTML = `
                <div style="background: var(--card-bg, #F5F5F5); border-radius: 16px; padding: 14px 16px; text-align: center; border: 1px dashed #CCC; color: #777; font-size: 12px;">
                    <i class="fas fa-warehouse" style="font-size: 20px; color: #888; margin-bottom: 6px; display: block;"></i>
                    Belum ada Greenhouse terdaftar.
                </div>
            `;
            return;
        }

        if (selectedGh === 'ALL') {
            var listGhHtml = '';
            dataGh.forEach(function(g) {
                var currentTanaman = dataTanaman.find(function(t) { return t.gh === g.kode || t.ghId === g.id; });
                var varietas = (currentTanaman && currentTanaman.varietas) ? currentTanaman.varietas : (g.nama || '-');
                var hst = (currentTanaman && (currentTanaman.hst !== undefined)) ? currentTanaman.hst + ' DAP' : '0 DAP';

                listGhHtml += `
                    <div style="font-size: 12px; font-weight: 600; color: #2E7D32; display: flex; align-items: center; gap: 6px; margin-top: 3px;">
                        <span>🏡</span>
                        <span>${g.kode || g.nama}: ${varietas} (${hst})</span>
                    </div>
                `;
            });

            el.innerHTML = `
                <div style="background: var(--card-bg, #F4F6F8); border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--border-color, #EAEAEA);">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="width: 58px; height: 58px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; padding: 6px;">
                            <img src="${melonImgUrl}" alt="Melon" style="width: 100%; height: 100%; object-fit: contain;">
                        </div>
                        <div>
                            <div style="font-size: 15px; font-weight: 800; color: var(--text-color, #111); margin-bottom: 2px;">Cozycs Farm (All GH)</div>
                            ${listGhHtml}
                        </div>
                    </div>
                </div>
            `;
        }
    }

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

        var statusPpm = (valPpm > 0) ? t('recorded') : t('no_data');
        var statusPh = (valPh > 0) ? t('recorded') : t('no_data');

        el.innerHTML = `
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #EAEAEA); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #E8F5E9; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-seedling" style="color: #2E7D32; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">${t('nutrition')}</div>
                        <div style="font-size: 18px; font-weight: 800; color: var(--text-color, #111);">${valPpm} <span style="font-size: 10px; font-weight: 600; color: #888;">ppm</span></div>
                    </div>
                </div>
                <div><span style="background: ${valPpm > 0 ? '#E8F5E9' : '#F5F5F5'}; color: ${valPpm > 0 ? '#2E7D32' : '#888'}; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${statusPpm}</span></div>
            </div>

            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #EAEAEA); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #E1F5FE; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-vial" style="color: #0288D1; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">${t('ph_water')}</div>
                        <div style="font-size: 18px; font-weight: 800; color: var(--text-color, #111);">${valPh} <span style="font-size: 10px; font-weight: 600; color: #888;">pH</span></div>
                    </div>
                </div>
                <div><span style="background: ${valPh > 0 ? '#E8F5E9' : '#F5F5F5'}; color: ${valPh > 0 ? '#2E7D32' : '#888'}; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${statusPh}</span></div>
            </div>

            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #EAEAEA); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #E0F7FA; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-thermometer-half" style="color: #00838F; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">${t('water_temp')}</div>
                        <div style="font-size: 18px; font-weight: 800; color: var(--text-color, #111);">${valWaterTemp}</div>
                    </div>
                </div>
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${t('recorded')}</span></div>
            </div>

            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #EAEAEA); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #E1F5FE; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-water" style="color: #0277BD; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">${t('tandon_water')}</div>
                        <div style="font-size: 18px; font-weight: 800; color: var(--text-color, #111);">${valTandon} <span style="font-size: 10px; font-weight: 600; color: #888;">%</span></div>
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
        var filteredNutrisi = (selectedGh === 'ALL') ? dataNutrisi : dataNutrisi.filter(function(n) { return n.gh === selectedGh; });
        var latest = filteredNutrisi.length > 0 ? filteredNutrisi[filteredNutrisi.length - 1] : {};

        var valRoomTemp = (latest.roomTemp !== undefined && latest.roomTemp !== '') ? latest.roomTemp + '°C' : '0°C';
        var valHumidity = (latest.humidity !== undefined && latest.humidity !== '') ? latest.humidity : '0';
        var valLux = (latest.lux !== undefined && latest.lux !== '') ? latest.lux : '0';

        el.innerHTML = `
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #EAEAEA); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #FFF3E0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-temperature-high" style="color: #E65100; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">${t('room_temp')}</div>
                        <div style="font-size: 18px; font-weight: 800; color: var(--text-color, #111);">${valRoomTemp}</div>
                    </div>
                </div>
                <div><span style="background: #FFF3E0; color: #E65100; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${t('room_temp_lbl')}</span></div>
            </div>

            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #EAEAEA); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #E3F2FD; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-tint-slash" style="color: #1E88E5; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">${t('humidity')}</div>
                        <div style="font-size: 18px; font-weight: 800; color: var(--text-color, #111);">${valHumidity} <span style="font-size: 10px; font-weight: 600; color: #888;">%</span></div>
                    </div>
                </div>
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${t('rh_gh')}</span></div>
            </div>

            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #EAEAEA); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: #FFFDE7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-sun" style="color: #F57F17; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">${t('light')}</div>
                        <div style="font-size: 18px; font-weight: 800; color: var(--text-color, #111);">${valLux} <span style="font-size: 10px; font-weight: 600; color: #888;">Lux</span></div>
                    </div>
                </div>
                <div><span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${t('intensity')}</span></div>
            </div>

            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #EAEAEA); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background: ${isAirflowOn ? '#EDE7F6' : '#F5F5F5'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.3s ease;">
                        <i class="fas fa-fan" style="color: ${isAirflowOn ? '#512DA8' : '#9E9E9E'}; font-size: 24px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: #777;">${t('airflow')}</div>
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

    function loadExecutiveSummary() {
        var el = document.getElementById('dashExecutiveSummary');
        if (!el) return;

        var dataGh = getData('cozycs_greenhouse');
        var dataTanaman = getData('cozycs_tanaman');
        var dataBuah = getData('cozycs_buah');
        var dataPolinasi = getData('cozycs_polinasi');

        var totalTanaman = 0;
        var filteredGhList = (selectedGh === 'ALL') ? dataGh : dataGh.filter(function(g) { return g.kode === selectedGh || g.id === selectedGh; });
        filteredGhList.forEach(function(g) {
            totalTanaman += (parseFloat(g.kapasitas) || parseFloat(g.populasi) || parseFloat(g.jumlah) || 0);
        });

        var tanamanHidup = 0;
        var filteredTanaman = (selectedGh === 'ALL') ? dataTanaman : dataTanaman.filter(function(t) { return t.gh === selectedGh || t.ghId === selectedGh; });
        filteredTanaman.forEach(function(t) {
            tanamanHidup += (parseFloat(t.populasi) || parseFloat(t.jumlah) || parseFloat(t.jumlahHidup) || 0);
        });

        var buahFix = 0;
        var filteredBuah = (selectedGh === 'ALL') ? dataBuah : dataBuah.filter(function(b) { return b.gh === selectedGh || b.ghId === selectedGh; });
        filteredBuah.forEach(function(b) {
            buahFix += (parseFloat(b.jumlahFix) || parseFloat(b.jumlah) || parseFloat(b.totalBuah) || 0);
        });

        var tglPanenStr = '-';
        var totalEstimasiKg = 0;
        var filteredPolinasi = (selectedGh === 'ALL') ? dataPolinasi : dataPolinasi.filter(function(p) { return p.gh === selectedGh || p.ghId === selectedGh; });
        
        filteredPolinasi.forEach(function(p) {
            var jumlahBunga = (parseFloat(p.berhasil) || parseFloat(p.jumlah) || parseFloat(p.jumlahFix) || 0);
            totalEstimasiKg += (jumlahBunga * 1.5);
            if (p.tglPanen || p.tanggalPanen) tglPanenStr = p.tglPanen || p.tanggalPanen;
        });

        el.innerHTML = `
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">${t('active_plants')}</div>
                <div style="font-size: 15px; font-weight: 800; color: #2E7D32; margin-top: 4px;">${totalTanaman} ${t('stem')}</div>
                <div style="font-size: 10px; color: #555; font-weight: 600; margin-top: 2px;">${t('initial_cap')}</div>
            </div>

            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">${t('living_plants')}</div>
                <div style="font-size: 15px; font-weight: 800; color: #0277BD; margin-top: 4px;">${tanamanHidup} ${t('tree')}</div>
                <div style="font-size: 10px; color: #555; font-weight: 600; margin-top: 2px;">${t('active_pop')}</div>
            </div>

            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">${t('selected_fruit')}</div>
                <div style="font-size: 15px; font-weight: 800; color: #E65100; margin-top: 4px;">${buahFix} ${t('fruit')}</div>
                <div style="font-size: 10px; color: #555; font-weight: 600; margin-top: 2px;">${t('selection_passed')}</div>
            </div>

            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-size: 10px; color: #777; font-weight: 700; text-transform: uppercase;">${t('est_harvest')}</div>
                <div style="font-size: 13px; font-weight: 800; color: #2E7D32; margin-top: 4px;">${tglPanenStr}</div>
                <div style="font-size: 10px; color: #555; font-weight: 600; margin-top: 2px;">Est. ${totalEstimasiKg} Kg</div>
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
        if (schedules.length === 0) schedules = getData('cozycs_jadwal');

        var todayTasks = schedules.filter(function(s) {
            var sDate = s.date || s.tanggal || '';
            var matchDate = (sDate === todayStr);
            var sGh = s.gh || s.greenhouse || 'ALL';
            var matchGh = (selectedGh === 'ALL') || (sGh === selectedGh) || (sGh === 'ALL');
            return matchDate && matchGh;
        });

        if (todayTasks.length === 0) {
            el.innerHTML = `
                <div style="text-align: center; padding: 12px; color: #888; font-size: 12px;">
                    <i class="far fa-calendar-check" style="font-size: 18px; color: #2E7D32; margin-bottom: 4px; display: block;"></i>
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
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #eee;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" ${isDone ? 'checked' : ''} onchange="dashboard.toggleTask('${taskId}')" style="width: 16px; height: 16px; cursor: pointer;">
                        <span style="font-size: 12px; font-weight: 600; color: ${isDone ? '#888888' : 'var(--text-color, #222)'}; text-decoration: ${isDone ? 'line-through' : 'none'};">
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

    function loadProgressMusim() {
        var el = document.getElementById('dashProgressMusim');
        if (!el) return;

        var dataTanaman = getData('cozycs_tanaman');
        var dataPolinasi = getData('cozycs_polinasi');

        var totalBatang = 0;
        var maxHst = 0;
        var filteredTanaman = (selectedGh === 'ALL') ? dataTanaman : dataTanaman.filter(function(t) { return t.gh === selectedGh || t.ghId === selectedGh; });
        
        filteredTanaman.forEach(function(t) {
            totalBatang += (parseFloat(t.populasi) || parseFloat(t.jumlah) || 0);
            var hstVal = parseFloat(t.hst) || 0;
            if (hstVal > maxHst) maxHst = hstVal;
        });

        var totalPolinasi = 0;
        var filteredPolinasi = (selectedGh === 'ALL') ? dataPolinasi : dataPolinasi.filter(function(p) { return p.gh === selectedGh || p.ghId === selectedGh; });
        filteredPolinasi.forEach(function(p) {
            totalPolinasi += (parseFloat(p.berhasil) || parseFloat(p.jumlah) || parseFloat(p.jumlahFix) || 0);
        });

        var percentHst = Math.min(Math.round((maxHst / 80) * 100), 100);
        var estimasiKg = totalPolinasi > 0 ? (totalPolinasi * 1.5) : (totalBatang * 1.5);
        var hargaPerKg = 20000;
        var estimasiOmzet = estimasiKg * hargaPerKg;

        el.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                <span><strong>Progress (${selectedGh})</strong>: ${percentHst}% (${maxHst} DAP)</span>
                <span style="font-weight: bold; color: #2E7D32;">Est: Rp ${estimasiOmzet.toLocaleString('id-ID')}</span>
            </div>
            <div style="width: 100%; background: #E0E0E0; height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 8px;">
                <div style="width: ${percentHst}%; background: #2E7D32; height: 100%;"></div>
            </div>
            <div style="font-size: 10px; color: #666;">*Calc: ${estimasiKg} Kg × Rp ${hargaPerKg.toLocaleString('id-ID')}/Kg</div>
        `;
    }

    function loadRecentActivities() {
        var el = document.getElementById('dashRecentActivities');
        if (!el) return;

        var logs = getData('cozycs_logs');
        if (logs.length === 0) logs = getData('cozycs_activities');

        var filteredLogs = (selectedGh === 'ALL') ? logs : logs.filter(function(l) { return l.gh === selectedGh || l.gh === 'ALL' || !l.gh; });

        if (filteredLogs.length === 0) {
            el.innerHTML = `<div style="font-size: 11px; color: #888; text-align: center; padding: 8px 0;">${t('no_logs')}</div>`;
            return;
        }

        var html = '';
        filteredLogs.slice(-5).reverse().forEach(function(l) {
            var jamStr = l.jam || l.time || l.waktu || '-';
            var textStr = l.text || l.kegiatan || l.keterangan || l.judul || '-';
            html += `
                <div style="display: flex; gap: 10px; font-size: 11px; align-items: center; border-bottom: 1px dashed #f0f0f0; padding-bottom: 4px;">
                    <span style="font-weight: bold; color: #0277BD; width: 45px; flex-shrink: 0;">${jamStr}</span>
                    <span style="color: var(--text-color, #333);">${textStr}</span>
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
        detectUserLocation: detectUserLocation
    };

})();

window.dashboard = dashboard;
