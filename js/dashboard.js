// ==========================================
// COZYCS FARM - EXECUTIVE DASHBOARD (REORDERED & RACIKAN LINKED)
// ==========================================

var dashboard = (function() {

    var selectedGh = 'ALL';
    var selectedNutrientSession = 'AUTO'; // 'AUTO', 'Pagi', atau 'Sore'
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
            'today_agenda': 'Agenda & Tugas Operasional Kebun',
            'today': 'Lintas Tanggal',
            'no_agenda': 'Tidak ada agenda kegiatan aktif saat ini.',
            'season_progress': 'Progress Musim & Analisis Fase Tanam',
            'recent_act': 'Aktivitas Terakhir (Audit Log)',
            'no_logs': 'Belum ada riwayat aktivitas tercatat.',
            'exec_summary': 'Ringkasan Eksekutif & Asset Kebun',
            'inventory_val': 'Nilai Persediaan Gudang',
            'net_cashflow': 'Arus Kas Bersih',
            'critical_items': 'Item Stok Kritis'
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
            'today_agenda': 'Farm Operational Agenda & Tasks',
            'today': 'Cross Date',
            'no_agenda': 'No active scheduled activities found.',
            'season_progress': 'Season Progress & Growth Phase Analysis',
            'recent_act': 'Recent Activities (Audit Log)',
            'no_logs': 'No activity logs recorded yet.',
            'exec_summary': 'Executive Summary & Farm Assets',
            'inventory_val': 'Inventory Stock Value',
            'net_cashflow': 'Net Cashflow',
            'critical_items': 'Critical Stock Items'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    // ROBUST DATE PARSER FOR DD/MM/YYYY, MM/DD/YYYY & YYYY-MM-DD
    function parseLocalDate(dateStr) {
        if (!dateStr) return null;
        if (dateStr instanceof Date) {
            var d = new Date(dateStr.getTime());
            d.setHours(0, 0, 0, 0);
            return d;
        }
        var str = String(dateStr).trim().split('T')[0];
        
        if (str.includes('-') || str.includes('/')) {
            var parts = str.split(/[-/]/);
            if (parts.length === 3) {
                var p1 = parseInt(parts[0], 10);
                var p2 = parseInt(parts[1], 10);
                var p3 = parseInt(parts[2], 10);

                if (p1 > 1000) {
                    var monthY = Math.max(0, Math.min(11, p2 - 1));
                    var dayY = Math.max(1, Math.min(31, p3));
                    return new Date(p1, monthY, dayY, 0, 0, 0, 0);
                } else if (p3 > 1000) {
                    var day = p1;
                    var month = p2;

                    if (p2 > 12) {
                        day = p2;
                        month = p1;
                    }

                    month = Math.max(1, Math.min(12, month)) - 1;
                    day = Math.max(1, Math.min(31, day));
                    return new Date(p3, month, day, 0, 0, 0, 0);
                }
            }
        }

        var parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
            parsed.setHours(0, 0, 0, 0);
            return parsed;
        }
        return null;
    }

    // MULTI-FALLBACK DATA READER
    function getData(key) {
        try {
            var altKeys = [key];
            if (key === 'cozycs_greenhouse') altKeys = ['cozycs_greenhouse', 'cozycs_gh', 'cozycs_greenhouses', 'greenhouses'];
            if (key === 'cozycs_schedules' || key === 'cozycs_jadwal') altKeys = ['cozycs_jadwal', 'cozycs_schedules', 'schedules', 'jadwal'];
            if (key === 'cozycs_nutrisi') altKeys = ['cozycs_nutrisi', 'nutrisi', 'cozycs_nutrition'];
            if (key === 'cozycs_gudang') altKeys = ['cozycs_gudang', 'gudang', 'cozycs_inventory'];
            if (key === 'cozycs_keuangan') altKeys = ['cozycs_keuangan', 'keuangan', 'cozycs_finance'];
            if (key === 'cozycs_tanaman') altKeys = ['cozycs_tanaman', 'tanaman', 'cozycs_plants'];

            for (var i = 0; i < altKeys.length; i++) {
                var k = altKeys[i];
                var raw = localStorage.getItem(k);
                if (raw !== null) {
                    try {
                        var parsed = JSON.parse(raw);
                        if (Array.isArray(parsed)) return parsed;
                    } catch(e){}
                }
            }

            if (typeof Storage !== 'undefined' && typeof Storage.getAll === 'function') {
                for (var j = 0; j < altKeys.length; j++) {
                    var res = Storage.getAll(altKeys[j]);
                    if (Array.isArray(res)) return res;
                }
            }
        } catch(e) {
            console.error('[Dashboard] Gagal membaca data ' + key, e);
        }
        return [];
    }

    // KALKULASI RANGE TARGET PPM & pH BERDASARKAN FASE HST TANAMAN
    function getTargetPpmAndPh() {
        var dataTanaman = getData('cozycs_tanaman');
        var today = parseLocalDate(new Date());
        var maxHst = 0;

        var filteredTanaman = (selectedGh === 'ALL') 
            ? dataTanaman 
            : dataTanaman.filter(function(t) { return t && isGhMatched(t.gh || t.ghId, selectedGh); });

        filteredTanaman.forEach(function(t) {
            if (!t) return;
            var tglT = parseLocalDate(t.tanggal || t.tanam || t.tglTanam);
            if (tglT && today >= tglT) {
                var hst = Math.floor((today - tglT) / (1000 * 60 * 60 * 24));
                if (hst > maxHst) maxHst = hst;
            }
        });

        // Standar Nutrisi Hidroponik Melon
        if (maxHst <= 10) {
            return { minPpm: 800, maxPpm: 1000, minPh: 5.8, maxPh: 6.5, phase: 'Veg Awal' };
        } else if (maxHst <= 25) {
            return { minPpm: 1000, maxPpm: 1200, minPh: 5.8, maxPh: 6.5, phase: 'Vegetatif' };
        } else if (maxHst <= 40) {
            return { minPpm: 1200, maxPpm: 1500, minPh: 6.0, maxPh: 6.8, phase: 'Polinasi' };
        } else {
            return { minPpm: 1500, maxPpm: 1800, minPh: 6.0, maxPh: 6.8, phase: 'Pembesaran' };
        }
    }

    // NAVIGASI SPA UNTUK BILAH AKSI CEPAT
    function navigateTo(pageId) {
        if (typeof app !== 'undefined' && typeof app.navigateTo === 'function') {
            app.navigateTo(pageId);
        } else if (typeof app !== 'undefined' && typeof app.showPage === 'function') {
            app.showPage(pageId);
        } else if (typeof showPage === 'function') {
            showPage(pageId);
        } else {
            window.location.hash = '#' + pageId;
            var btn = document.querySelector('[data-page="' + pageId + '"], [onclick*="' + pageId + '"]');
            if (btn) btn.click();
        }
    }

    function isGhMatched(itemGh, selected) {
        if (!selected || selected === 'ALL') return true;

        var itemStr = '';
        if (typeof itemGh === 'object' && itemGh !== null) {
            itemStr = String(itemGh.nama || itemGh.kode || itemGh.id || '').toLowerCase();
        } else {
            itemStr = String(itemGh || '').toLowerCase().trim();
        }

        var selStr = String(selected || '').toLowerCase().trim();
        if (!itemStr) return true;

        if (itemStr === selStr) return true;
        if (itemStr.includes(selStr) || selStr.includes(itemStr)) return true;

        var isUtama = (selStr.includes('utama') || selStr.includes('gh-01') || selStr.includes('gh1') || selStr.includes('gh_01'));
        var itemIsUtama = (itemStr.includes('utama') || itemStr.includes('gh-01') || itemStr.includes('gh1') || itemStr.includes('gh_01'));
        if (isUtama && itemIsUtama) return true;

        var isKedua = (selStr.includes('kedua') || selStr.includes('gh-02') || selStr.includes('gh2') || selStr.includes('gh_02'));
        var itemIsKedua = (itemStr.includes('kedua') || itemStr.includes('gh-02') || itemStr.includes('gh2') || itemStr.includes('gh_02'));
        if (isKedua && itemIsKedua) return true;

        return false;
    }

    function getSessionFromItem(item) {
        if (!item || typeof item !== 'object') return '';

        var rawVal = item.timeSlot || item.timeslot || item.waktuCek || item.waktu_cek || 
                     item.waktuPengecekan || item.waktu || item.sesi || item.periode || 
                     item.session || item.waktuSesi || item.kategori || item.type || item.label || '';

        if (typeof rawVal === 'object' && rawVal !== null) {
            rawVal = rawVal.nama || rawVal.label || rawVal.val || '';
        }

        var str = String(rawVal).toLowerCase().trim();

        if (str.includes('pagi') || str.includes('morning')) return 'pagi';
        if (str.includes('sore') || str.includes('afternoon') || str.includes('malam')) return 'sore';

        return '';
    }

    function sortGhList(list) {
        if (!Array.isArray(list)) return [];
        return list.slice().sort(function(a, b) {
            if (!a || !b) return 0;
            var nameA = String(a.nama || a.kode || a.id || '').toLowerCase();
            var nameB = String(b.nama || b.kode || b.id || '').toLowerCase();

            var getRank = function(str) {
                if (str.includes('utama') || str.includes('gh 1') || str.includes('gh1') || str.includes('gh-01')) return 1;
                if (str.includes('kedua') || str.includes('gh 2') || str.includes('gh2') || str.includes('gh-02')) return 2;
                if (str.includes('ketiga') || str.includes('gh 3') || str.includes('gh3') || str.includes('gh-03')) return 3;
                if (str.includes('keempat') || str.includes('gh 4') || str.includes('gh4') || str.includes('gh-04')) return 4;
                return 99;
            };

            var rankA = getRank(nameA);
            var rankB = getRank(nameB);

            if (rankA !== rankB) return rankA - rankB;
            return nameA.localeCompare(nameB);
        });
    }

    function formatLastUpdated(item) {
        if (!item || typeof item !== 'object' || Object.keys(item).length === 0) return null;

        var dateStr = item.date || item.tanggal || item.tgl || item.updatedAt || 
                      item.updated_at || item.timestamp || item.createdAt || item.created_at;

        var jamStr = item.jam || item.waktu || item.time || item.jamInput || item.waktu_input;

        if (!dateStr && !jamStr) return null;

        var timeText = (typeof jamStr === 'string' && jamStr.includes(':')) ? jamStr : '';

        if (dateStr) {
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

            var d = parseLocalDate(dateStr);
            if (!d) {
                var parsed = new Date(dateStr);
                if (!isNaN(parsed.getTime())) d = parsed;
            }

            if (d) {
                var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
                var day = d.getDate();
                var month = monthNames[d.getMonth()];

                return timeText ? (day + ' ' + month + ', ' + timeText) : (day + ' ' + month);
            }
        }

        return timeText ? ('Jam ' + timeText) : null;
    }

    function getTodayNutrientBySession(targetSession) {
        var dataNutrisi = getData('cozycs_nutrisi');
        var todayMurni = parseLocalDate(new Date());

        if (!Array.isArray(dataNutrisi) || dataNutrisi.length === 0 || !todayMurni) {
            return null;
        }

        var sessionToUse = targetSession;
        if (sessionToUse === 'AUTO') {
            var currentHour = new Date().getHours();
            sessionToUse = (currentHour >= 12) ? 'Sore' : 'Pagi';
        }

        var searchKey = sessionToUse.toLowerCase().trim();

        var matchedList = dataNutrisi.filter(function(n) {
            if (!n) return false;

            var ghVal = n.gh || n.ghId || n.greenhouse || n.idGh || n.id_gh || n.kodeGh;
            if (!isGhMatched(ghVal, selectedGh)) return false;

            var nDate = parseLocalDate(n.date || n.tanggal || n.tgl || n.createdAt || n.timestamp);
            if (!nDate || nDate.getTime() !== todayMurni.getTime()) return false;

            var s = getSessionFromItem(n);
            return s === searchKey;
        });

        if (matchedList.length > 0) {
            return {
                item: matchedList[matchedList.length - 1],
                sessionName: sessionToUse
            };
        }

        return null;
    }

    function setNutrientSessionFilter(sesi) {
        selectedNutrientSession = sesi;
        loadIotWaterData();
        loadIotEnvData();
    }

    function render() {
        return `
            <style>
                @keyframes spinIcon { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes pulseDot { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
                .spinning { animation: spinIcon 0.8s linear infinite; }
                .pulse-green { animation: pulseDot 1.8s infinite ease-in-out; }
                .dash-card-shadow { box-shadow: 0 6px 18px rgba(0,0,0,0.06); }
            </style>

            <div class="dashboard-container" style="padding-bottom: 30px;">
                
                <!-- 0. WELCOME BANNER HERO CARD -->
                <div id="dashWelcomeBanner" style="margin-bottom: 16px;"></div>

                <!-- 1. GRID MATRIX GREENHOUSE -->
                <div id="dashSwipeableGhContainer" style="margin-bottom: 16px;"></div>

                <!-- 2. MONITORING AIR DAN LINGKUNGAN -->
                <div class="dash-card-shadow" style="background: linear-gradient(135deg, #E0F7FA 0%, #E1F5FE 100%); padding: 15px; border-radius: 16px; border: 1px solid #B2EBF2; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 13px; font-weight: 800; color: #006064;"><i class="fas fa-tint" style="margin-right: 4px; color: #0288D1;"></i> ${t('water_env_mon')}</span>
                            <span id="dashIotLastUpdated" style="font-size: 9px; background: #00838F; color: #FFF; padding: 2px 7px; border-radius: 10px; font-weight: bold;">Belum Ada Data</span>
                        </div>
                        
                        <button onclick="dashboard.toggleIotSection()" title="Toggle Monitoring" style="width: 28px; height: 28px; border-radius: 50%; background: #FFF; border: 1px solid #B2EBF2; color: #0277BD; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0;">
                            <i id="iconToggleIot" class="fas ${isIotCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}" style="font-size: 12px;"></i>
                        </button>
                    </div>

                    <!-- TAB SESI PENGECEKAN NUTRISI (PAGI / SORE) -->
                    <div style="display: flex; gap: 6px; margin-bottom: 12px;" id="wrapperNutrientSessionTabs">
                        <button id="btnSesiPagi" onclick="dashboard.setNutrientSessionFilter('Pagi')" style="flex: 1; padding: 6px; border-radius: 8px; border: 1px solid #00838F; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.2s ease;">
                            ☀️ Pagi
                        </button>
                        <button id="btnSesiSore" onclick="dashboard.setNutrientSessionFilter('Sore')" style="flex: 1; padding: 6px; border-radius: 8px; border: 1px solid #00838F; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.2s ease;">
                            🌙 Sore
                        </button>
                    </div>

                    <div id="wrapperIotContent" style="display: ${isIotCollapsed ? 'none' : 'block'}; transition: all 0.3s ease;">
                        <div style="font-size: 11px; font-weight: 800; color: #00838F; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">${t('water_param')}</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px;" id="dashIotWaterCards"></div>

                        <div style="font-size: 11px; font-weight: 800; color: #00838F; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">${t('env_param')}</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;" id="dashIotEnvCards"></div>
                    </div>
                </div>

                <!-- 3. BILAH AKSI CEPAT (QUICK ACTION BAR) -->
                <div class="dash-card-shadow" style="background: #FFFFFF; padding: 12px 14px; border-radius: 16px; border: 1px solid #E0E0E0; margin-bottom: 16px;">
                    <div style="font-size: 11px; font-weight: 800; color: #37474F; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                        <span><i class="fas fa-bolt" style="color: #F57C00; margin-right: 5px;"></i> Pintasan Aksi Cepat</span>
                        <span style="font-size: 9px; color: #78909C; font-weight: 600;">Quick Access</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                        <button onclick="dashboard.navigateTo('gudang')" style="background: #F3E5F5; border: 1px solid #E1BEE7; border-radius: 12px; padding: 10px 4px; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                            <i class="fas fa-boxes" style="font-size: 18px; color: #7B1FA2; display: block; margin-bottom: 4px;"></i>
                            <span style="font-size: 10px; font-weight: 800; color: #4A148C; display: block; line-height: 1.1;">Gudang</span>
                        </button>
                        <button onclick="dashboard.navigateTo('spray')" style="background: #E0F2F1; border: 1px solid #B2DFDB; border-radius: 12px; padding: 10px 4px; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                            <i class="fas fa-spray-can" style="font-size: 18px; color: #00796B; display: block; margin-bottom: 4px;"></i>
                            <span style="font-size: 10px; font-weight: 800; color: #004D40; display: block; line-height: 1.1;">Spray</span>
                        </button>
                        <button onclick="dashboard.navigateTo('jadwal')" style="background: #E8EAF6; border: 1px solid #C5CAE9; border-radius: 12px; padding: 10px 4px; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                            <i class="fas fa-calendar-plus" style="font-size: 18px; color: #303F9F; display: block; margin-bottom: 4px;"></i>
                            <span style="font-size: 10px; font-weight: 800; color: #1A237E; display: block; line-height: 1.1;">Jadwal</span>
                        </button>
                        <button onclick="dashboard.navigateTo('racikan')" style="background: #FFF3E0; border: 1px solid #FFE0B2; border-radius: 12px; padding: 10px 4px; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                            <i class="fas fa-calculator" style="font-size: 18px; color: #E65100; display: block; margin-bottom: 4px;"></i>
                            <span style="font-size: 10px; font-weight: 800; color: #BF360C; display: block; line-height: 1.1;">Kalkulator</span>
                        </button>
                    </div>
                </div>

                <!-- 4. EXECUTIVE SUMMARY WIDGET -->
                <div id="dashExecutiveSummaryWidget" style="margin-bottom: 16px;"></div>

                <!-- 5. PROGRESS MUSIM & ANALISIS FASE TANAM -->
                <div class="dash-card-shadow" style="background: linear-gradient(135deg, #FFFDE7 0%, #F1F8E9 100%); padding: 16px; border-radius: 18px; border: 1px solid #FFE082; margin-bottom: 16px;">
                    <div style="font-size: 13px; font-weight: 800; color: #E65100; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-seedling" style="color: #2E7D32; font-size: 14px;"></i> ${t('season_progress')}
                    </div>
                    <div id="dashProgressMusim"></div>
                </div>

                <!-- 6. AGENDA HARI INI & LINTAS TANGGAL -->
                <div class="dash-card-shadow" style="background: linear-gradient(135deg, #E8F8F5 0%, #E8F5E9 100%); padding: 15px; border-radius: 16px; border: 1px solid #A3E4D7; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 13px; font-weight: 800; color: #117A65;"><i class="fas fa-tasks" style="color: #2E7D32; margin-right: 6px;"></i> ${t('today_agenda')}</span>
                        <span style="font-size: 10px; color: #16A085; font-weight: bold;" id="dashTodayDate">${t('today')}</span>
                    </div>
                    <div id="dashTodayAgendaList"></div>
                </div>

                <!-- 7. AKTIVITAS TERAKHIR (AUDIT LOG) -->
                <div class="dash-card-shadow" style="background: linear-gradient(135deg, #E1F5FE 0%, #EDE7F6 100%); padding: 15px; border-radius: 16px; border: 1px solid #B3E5FC;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="font-size: 13px; font-weight: 800; color: #283593;"><i class="fas fa-history" style="color: #0277BD; margin-right: 6px;"></i> ${t('recent_act')}</div>
                        <button id="btnManualRefreshLog" onclick="dashboard.manualRefreshLogs()" style="background: #FFF; border: 1px solid #B3E5FC; color: #0277BD; font-size: 11px; padding: 4px 10px; border-radius: 8px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 4px;">
                            <i id="iconRefreshBtn" class="fas fa-sync-alt"></i> Refresh
                        </button>
                    </div>
                    <div id="dashRecentActivities" style="display: flex; flex-direction: column; gap: 8px;"></div>
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
        var tempEl = document.getElementById('liveWeatherTemp');
        var humEl = document.getElementById('liveWeatherHumidity');
        var iconEl = document.getElementById('liveWeatherIcon');

        if (tempEl) tempEl.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size:11px;"></i>';
        if (humEl) humEl.textContent = 'Memuat...';

        var apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FJakarta';
        
        fetch(apiUrl)
            .then(function(res) { 
                if (!res.ok) throw new Error('Weather API network error');
                return res.json(); 
            })
            .then(function(data) {
                if (data && data.current) {
                    var temp = Math.round(data.current.temperature_2m) + '°C';
                    var humidity = Math.round(data.current.relative_humidity_2m) + '%';
                    pesawaranWeather = { temp: temp, humidity: humidity, icon: '⛅' };
                    
                    if (tempEl) tempEl.textContent = temp;
                    if (humEl) humEl.textContent = '💧 ' + humidity;
                    if (iconEl) iconEl.textContent = '⛅';

                    var cityEl = document.getElementById('liveLocationName');
                    if (cityEl) cityEl.textContent = cityName;

                    loadIotEnvData();
                }
            })
            .catch(function(err) {
                console.warn('[Dashboard] Weather fetch fallback:', err);
                if (tempEl) tempEl.textContent = 'N/A';
                if (humEl) humEl.textContent = 'Offline';
            });
    }

    function refreshAllDashboardData() {
        loadWelcomeBanner();
        renderSwipeableGhCards();
        loadIotWaterData();
        loadIotEnvData();
        loadExecutiveSummary();
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
        
        var now = new Date();
        var currentHour = now.getHours();
        var currentMinute = now.getMinutes();
        
        var smartInsight = '';
        var actionRecommendation = '';

        if (currentHour >= 6 && currentHour < 18) {
            var remainingHours = 17 - currentHour;
            var remainingMins = 60 - currentMinute;
            if (remainingMins === 60) {
                remainingMins = 0;
                remainingHours += 1;
            }

            var countdownText = remainingHours + 'j ' + remainingMins + 'm lagi';
            smartInsight = '☀️ Fotosintesis Aktif (' + countdownText + ')';

            if (currentHour >= 6 && currentHour < 9) {
                actionRecommendation = '🌱 Pagi Cerah: Momen terbaik semprot daun & cek PPM nutrisi.';
            } else if (currentHour >= 9 && currentHour < 14) {
                actionRecommendation = '☀️ Siang Terik: Pastikan pompa dan sirkulasi udara berjalan lancar.';
            } else if (currentHour >= 14 && currentHour < 17) {
                actionRecommendation = '💧 Sore Sejuk: Cocok beri nutrisi tambahan & pantau polinasi.';
            } else {
                actionRecommendation = '🌇 Senja: Waktu cek tandon air sebelum malam tiba.';
            }
        } else {
            var hoursUntilMorning = (currentHour >= 18) ? (30 - currentHour) : (6 - currentHour);
            smartInsight = '🌙 Malam: Tanaman beristirahat (' + hoursUntilMorning + ' jam menuju pagi)';
            actionRecommendation = '💤 Tutup rapat GH, jaga kelembapan tetap stabil.';
        }

        el.innerHTML = `
            <div style="background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%); border-radius: 20px; padding: 18px 16px; color: #ffffff; box-shadow: 0 8px 24px rgba(27,67,50,0.28); position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.12);">
                <div style="position: absolute; right: -20px; top: -20px; width: 120px; height: 120px; background: rgba(255,255,255,0.08); border-radius: 50%; pointer-events: none;"></div>

                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 2;">
                    <div style="display: flex; align-items: center; gap: 12px; flex-grow: 1; padding-right: 8px;">
                        <div style="position: relative; flex-shrink: 0;">
                            <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.18); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; font-size: 24px; border: 1.5px solid rgba(255,255,255,0.3); box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
                                👨‍🌾
                            </div>
                            <span class="pulse-green" style="position: absolute; bottom: 1px; right: 1px; width: 10px; height: 10px; background: #52B788; border: 2px solid #1b4332; border-radius: 50%;"></span>
                        </div>

                        <div style="overflow: hidden;">
                            <div id="liveGreetingText" style="font-size: 16px; font-weight: 800; color: #FFFFFF; line-height: 1.2; letter-spacing: -0.2px;">
                                ${greetingText}
                            </div>
                            <div style="font-size: 11px; color: #D8F3DC; margin-top: 3px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${t('greeting_sub')}
                            </div>
                            
                            <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; font-size: 9.5px; font-weight: 700; background: rgba(255,255,255,0.18); color: #FFF; padding: 3px 9px; border-radius: 10px; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2);">
                                <i class="far fa-clock" style="color: #FFE082;"></i>
                                <span>${smartInsight}</span>
                            </div>
                        </div>
                    </div>

                    <div style="background: rgba(0, 0, 0, 0.22); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.18); padding: 8px 12px; border-radius: 14px; text-align: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                        <div id="liveWeatherIcon" style="font-size: 20px; line-height: 1;">${pesawaranWeather.icon}</div>
                        <div id="liveWeatherTemp" style="font-size: 15px; font-weight: 800; color: #FFF; margin-top: 2px;">
                            ${pesawaranWeather.temp}
                        </div>
                        <div id="liveWeatherHumidity" style="font-size: 9px; color: #B7E4C7; font-weight: 700; margin-top: 1px;">
                            💧 ${pesawaranWeather.humidity}
                        </div>
                    </div>
                </div>

                <div style="background: rgba(0, 0, 0, 0.25); border-radius: 10px; padding: 6px 10px; margin-bottom: 8px; font-size: 10px; color: #FFE082; font-weight: 700; display: flex; align-items: center; gap: 6px; border: 1px dashed rgba(255,224,130,0.4);">
                    <i class="fas fa-lightbulb" style="color: #FFD54F;"></i>
                    <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${actionRecommendation}</span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.18); padding: 8px 12px; border-radius: 12px; backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.08); font-size: 11px; position: relative; z-index: 2;">
                    <div style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: #E8F5E9;">
                        <span class="pulse-green" style="width: 6px; height: 6px; background: #74C69D; border-radius: 50%; display: inline-block;"></span>
                        <span id="liveDateTime">${dateTimeStr}</span>
                    </div>

                    <div style="display: flex; align-items: center; gap: 6px;">
                        <div style="display: flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 10px; font-weight: 700; color: #FFF;">
                            <i class="fas fa-map-marker-alt" style="color: #FF8A80; font-size: 10px;"></i>
                            <span id="liveLocationName">${currentLocation.city}</span>
                        </div>
                        <button onclick="dashboard.detectUserLocation()" title="GPS Location" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: #FFF; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0;">
                            <i id="btnGpsTargetIcon" class="fas fa-crosshairs" style="font-size: 10px;"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function loadExecutiveSummary() {
        var el = document.getElementById('dashExecutiveSummaryWidget');
        if (!el) return;

        var dataGudang = getData('cozycs_gudang');
        var totalNilaiGudang = 0;
        var totalKritisCount = 0;

        dataGudang.forEach(function(item) {
            if (!item) return;
            var stok = parseFloat(item.stok) || 0;
            var harga = parseFloat(item.harga) || 0;
            var stokMin = parseFloat(item.stokMin) || 0;

            if (stok > 0 && harga > 0) {
                totalNilaiGudang += (stok * harga);
            }
            if (stok <= stokMin && stokMin > 0) {
                totalKritisCount++;
            }
        });

        var dataKeuangan = getData('cozycs_keuangan');
        var netCashflow = 0;

        dataKeuangan.forEach(function(k) {
            if (!k) return;
            var nominal = parseFloat(k.nominal || k.jumlah || k.total) || 0;
            var tipe = String(k.tipe || k.jenis || '').toLowerCase();

            if (tipe === 'pemasukan' || tipe === 'income' || tipe === 'masuk') {
                netCashflow += nominal;
            } else if (tipe === 'pengeluaran' || tipe === 'expense' || tipe === 'keluar') {
                netCashflow -= nominal;
            }
        });

        var formatRp = function(val) {
            return 'Rp' + Math.round(val).toLocaleString('id-ID');
        };

        el.innerHTML = `
            <div class="dash-card-shadow" style="background: linear-gradient(135deg, #FFFFFF 0%, #F4FBF7 100%); padding: 14px 15px; border-radius: 16px; border: 1px solid #D4EDDA;">
                <div style="font-size: 12px; font-weight: 800; color: #1B5E20; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                    <span><i class="fas fa-chart-pie" style="color: #2E7D32; margin-right: 6px;"></i> ${t('exec_summary')}</span>
                    <span style="font-size: 9px; background: #E8F5E9; color: #2E7D32; font-weight: 700; padding: 2px 7px; border-radius: 8px;">Real-time Sync</span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                    <div style="background: #FFF; padding: 10px 8px; border-radius: 10px; border: 1px solid #E8F5E9; text-align: center;">
                        <div style="font-size: 9px; color: #666; font-weight: 700; text-transform: uppercase;">${t('inventory_val')}</div>
                        <div style="font-size: 12px; font-weight: 800; color: #2E7D32; margin-top: 3px;">${formatRp(totalNilaiGudang)}</div>
                    </div>

                    <div style="background: #FFF; padding: 10px 8px; border-radius: 10px; border: 1px solid #E1F5FE; text-align: center;">
                        <div style="font-size: 9px; color: #666; font-weight: 700; text-transform: uppercase;">${t('net_cashflow')}</div>
                        <div style="font-size: 12px; font-weight: 800; color: ${netCashflow >= 0 ? '#0277BD' : '#C62828'}; margin-top: 3px;">${formatRp(netCashflow)}</div>
                    </div>

                    <div style="background: #FFF; padding: 10px 8px; border-radius: 10px; border: 1px solid #FFCDD2; text-align: center;">
                        <div style="font-size: 9px; color: #666; font-weight: 700; text-transform: uppercase;">${t('critical_items')}</div>
                        <div style="font-size: 12px; font-weight: 800; color: ${totalKritisCount > 0 ? '#C62828' : '#2E7D32'}; margin-top: 3px;">
                            ${totalKritisCount} <span style="font-size: 9px; font-weight: normal;">Item</span>
                        </div>
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
            if (!t) return;
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

        dataPolinasi.forEach(function(p) { if (p) tPolALL += (parseFloat(p.berhasil) || parseFloat(p.jumlah) || 0); });
        dataBuah.forEach(function(b) { if (b) tBuahALL += (parseFloat(b.jumlahFix) || parseFloat(b.jumlah) || 0); });

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
            if (!g) return;
            var gId = g.kode || g.id;
            var isActive = (selectedGh === gId);
            var theme = themes[index % themes.length];

            var filteredTanaman = dataTanaman.filter(function(t) { return t && isGhMatched(t.gh || t.ghId, gId); });

            var uniqueHoles = new Set();
            filteredTanaman.forEach(function(t) {
                if (t && t.talang && t.talang !== '-') uniqueHoles.add(t.talang);
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
                if (!t) return;
                if (t.kategori === 'Polinasi' && (t.statusPolinasi === 'Sukses' || !t.statusPolinasi)) tPol += 1;
                if (t.kategori === 'Buah') tBuah += 1;
            });

            var filteredPol = dataPolinasi.filter(function(p) { return p && isGhMatched(p.gh || p.ghId, gId); });
            filteredPol.forEach(function(p) { tPol += (parseFloat(p.berhasil) || parseFloat(p.jumlah) || 0); });
            
            var filteredBuah = dataBuah.filter(function(b) { return b && isGhMatched(b.gh || b.ghId, gId); });
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
        var btnPagi = document.getElementById('btnSesiPagi');
        var btnSore = document.getElementById('btnSesiSore');
        if (!el) return;

        var nutrientData = getTodayNutrientBySession(selectedNutrientSession);
        var latest = nutrientData ? nutrientData.item : null;
        var activeSessionName = nutrientData ? nutrientData.sessionName : (selectedNutrientSession === 'AUTO' ? (new Date().getHours() >= 12 ? 'Sore' : 'Pagi') : selectedNutrientSession);

        if (btnPagi && btnSore) {
            if (activeSessionName.toLowerCase().includes('pagi')) {
                btnPagi.style.background = '#00838F';
                btnPagi.style.color = '#FFF';
                btnSore.style.background = '#FFF';
                btnSore.style.color = '#00838F';
            } else {
                btnSore.style.background = '#00838F';
                btnSore.style.color = '#FFF';
                btnPagi.style.background = '#FFF';
                btnPagi.style.color = '#00838F';
            }
        }

        if (lastUpdatedEl) {
            if (latest) {
                var timeBadge = formatLastUpdated(latest);
                lastUpdatedEl.textContent = (activeSessionName + ' (' + (timeBadge || 'Hari ini') + ')');
            } else {
                lastUpdatedEl.textContent = activeSessionName + ' (Belum Ada Data)';
            }
        }

        var valPpm = (latest && (latest.ppm || latest.ppmAir || latest.nutrisi) !== undefined && latest.ppm !== '-') ? (latest.ppm || latest.ppmAir || latest.nutrisi) : '0';
        var valPh = (latest && (latest.ph || latest.phAir) !== undefined && latest.ph !== '-') ? (latest.ph || latest.phAir) : '0.0';
        var valWaterTemp = (latest && (latest.waterTemp || latest.suhuAir || latest.suhu_air) !== undefined && latest.waterTemp !== '-') ? (latest.waterTemp || latest.suhuAir || latest.suhu_air) + '°C' : '0°C';
        var valTandon = (latest && (latest.tandon || latest.levelAir || latest.tandonAir) !== undefined) ? (latest.tandon || latest.levelAir || latest.tandonAir) : '0';

        var targetInfo = getTargetPpmAndPh();
        var numPpm = parseFloat(valPpm) || 0;
        var numPh = parseFloat(valPh) || 0;

        var badgePpmBg = '#F5F5F5', badgePpmColor = '#888', badgePpmText = t('no_data');
        if (numPpm > 0) {
            if (numPpm < targetInfo.minPpm) {
                badgePpmBg = '#FFF3E0'; badgePpmColor = '#E65100'; badgePpmText = '⚠️ Encer (<' + targetInfo.minPpm + ')';
            } else if (numPpm > targetInfo.maxPpm) {
                badgePpmBg = '#FFEBEE'; badgePpmColor = '#C62828'; badgePpmText = '⚠️ Pekat (>' + targetInfo.maxPpm + ')';
            } else {
                badgePpmBg = '#E8F5E9'; badgePpmColor = '#2E7D32'; badgePpmText = '✅ Ideal (' + targetInfo.minPpm + '-' + targetInfo.maxPpm + ')';
            }
        }

        var badgePhBg = '#F5F5F5', badgePhColor = '#888', badgePhText = t('no_data');
        if (numPh > 0) {
            if (numPh < targetInfo.minPh) {
                badgePhBg = '#FFF3E0'; badgePhColor = '#E65100'; badgePhText = '⚠️ Asam (<' + targetInfo.minPh + ')';
            } else if (numPh > targetInfo.maxPh) {
                badgePhBg = '#FFEBEE'; badgePhColor = '#C62828'; badgePhText = '⚠️ Basa (>' + targetInfo.maxPh + ')';
            } else {
                badgePhBg = '#E8F5E9'; badgePhColor = '#2E7D32'; badgePhText = '✅ Ideal (' + targetInfo.minPh + '–' + targetInfo.maxPh + ')';
            }
        }

        el.innerHTML = `
            <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 12px; border: 1px solid #B2EBF2; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #E8F5E9; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-seedling" style="color: #2E7D32; font-size: 20px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">${t('nutrition')}</div>
                        <div style="font-size: 17px; font-weight: 800; color: #006064;">${valPpm} <span style="font-size: 10px; font-weight: 600; color: #777;">ppm</span></div>
                    </div>
                </div>
                <div>
                    <span style="background: ${badgePpmBg}; color: ${badgePpmColor}; padding: 3px 8px; border-radius: 12px; font-size: 9.5px; font-weight: bold; display: inline-block;">
                        ${badgePpmText}
                    </span>
                </div>
            </div>

            <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 12px; border: 1px solid #B2EBF2; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #E1F5FE; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-vial" style="color: #0288D1; font-size: 20px;"></i>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">${t('ph_water')}</div>
                        <div style="font-size: 17px; font-weight: 800; color: #006064;">${valPh} <span style="font-size: 10px; font-weight: 600; color: #777;">pH</span></div>
                    </div>
                </div>
                <div>
                    <span style="background: ${badgePhBg}; color: ${badgePhColor}; padding: 3px 8px; border-radius: 12px; font-size: 9.5px; font-weight: bold; display: inline-block;">
                        ${badgePhText}
                    </span>
                </div>
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
                <div><span style="background: ${latest ? '#E8F5E9' : '#F5F5F5'}; color: ${latest ? '#2E7D32' : '#888'}; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${latest ? t('recorded') : t('no_data')}</span></div>
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

        var nutrientData = getTodayNutrientBySession(selectedNutrientSession);
        var latest = nutrientData ? nutrientData.item : null;

        var rawRoomTemp = latest ? (latest.roomTemp || latest.suhuRuangan || latest.suhu_ruangan || latest.suhuRuang || latest.suhu_ruang || latest.tempUdara) : null;
        var rawHumidity = latest ? (latest.humidity || latest.kelembaban) : null;

        var hasManualRoomTemp = (rawRoomTemp !== null && rawRoomTemp !== undefined && rawRoomTemp !== '-' && rawRoomTemp !== '' && parseFloat(rawRoomTemp) > 0);
        var hasManualHumidity = (rawHumidity !== null && rawHumidity !== undefined && rawHumidity !== '-' && rawHumidity !== '' && parseFloat(rawHumidity) > 0);

        var valRoomTemp = hasManualRoomTemp ? (rawRoomTemp + '°C') : (pesawaranWeather.temp !== '-°C' ? pesawaranWeather.temp : '0°C');
        var valHumidity = hasManualHumidity ? rawHumidity : (pesawaranWeather.humidity !== '-%' ? pesawaranWeather.humidity.replace('%', '') : '0');
        var valLux = (latest && (latest.lux || latest.cahaya) !== undefined) ? (latest.lux || latest.cahaya) : '0';

        var badgeRoomTemp = hasManualRoomTemp ? t('room_temp_lbl') : (pesawaranWeather.temp !== '-°C' ? '📍 GPS Live' : t('no_data'));
        var badgeHumidity = hasManualHumidity ? t('rh_gh') : (pesawaranWeather.humidity !== '-%' ? '📍 GPS Live' : t('no_data'));

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
                <div><span style="background: ${hasManualRoomTemp ? '#FFF3E0' : '#E0F7FA'}; color: ${hasManualRoomTemp ? '#E65100' : '#00838F'}; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${badgeRoomTemp}</span></div>
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
                <div><span style="background: ${hasManualHumidity ? '#E8F5E9' : '#E0F7FA'}; color: ${hasManualHumidity ? '#2E7D32' : '#00838F'}; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${badgeHumidity}</span></div>
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

        if (dateEl) {
            dateEl.innerText = t('today');
        }

        var schedules = getData('cozycs_jadwal');
        var todayMurni = parseLocalDate(new Date());

        var filteredTasks = schedules.filter(function(s) {
            if (!s) return false;
            var sGh = s.gh || s.greenhouse || 'ALL';
            var matchGh = (selectedGh === 'ALL') || isGhMatched(sGh, selectedGh) || (sGh === 'ALL') || (sGh === 'Seluruh Kebun');
            if (!matchGh) return false;

            var sDate = parseLocalDate(s.tanggal || s.date);
            var isDone = (s.status === 'Selesai' || s.status === 'Completed' || s.completed === true);
            var isPast = sDate && (sDate < todayMurni);

            if (isDone && isPast) {
                return false;
            }

            return true;
        });

        if (filteredTasks.length === 0) {
            el.innerHTML = `
                <div style="text-align: center; padding: 12px; color: #16A085; font-size: 12px; font-weight: 600;">
                    <i class="far fa-calendar-check" style="font-size: 20px; color: #2E7D32; margin-bottom: 4px; display: block;"></i>
                    ${t('no_agenda')}
                </div>
            `;
            return;
        }

        filteredTasks.sort(function(a, b) {
            var dateA = parseLocalDate(a ? (a.tanggal || a.date) : null) || new Date(0);
            var dateB = parseLocalDate(b ? (b.tanggal || b.date) : null) || new Date(0);
            return dateA - dateB;
        });

        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

        var html = '';
        filteredTasks.forEach(function(item, idx) {
            if (!item) return;
            var isDone = (item.status === 'Selesai' || item.status === 'Completed' || item.completed === true);
            var taskId = item.id || ('task_' + idx);

            var rawDate = item.tanggal || item.date || '';
            var dateBadge = '-';
            if (rawDate) {
                var d = parseLocalDate(rawDate);
                if (d) {
                    dateBadge = d.getDate() + ' ' + monthNames[d.getMonth()];
                } else {
                    dateBadge = rawDate;
                }
            }

            var ghTag = (item.gh && item.gh !== 'Seluruh Kebun' && item.gh !== 'ALL') ? (' (' + item.gh + ')') : '';
            var textColor = isDone ? '#9E9E9E' : '#117A65';

            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: rgba(255,255,255,0.85); border-radius: 8px; margin-bottom: 6px; border: 1px solid #A3E4D7; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px; flex-grow: 1; overflow: hidden;">
                        <input type="checkbox" ${isDone ? 'checked' : ''} onchange="dashboard.toggleTask('${taskId}')" style="width: 16px; height: 16px; cursor: pointer; flex-shrink: 0;">
                        <span style="font-size: 12px; font-weight: 600; color: ${textColor}; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${item.title || item.judul || item.kegiatan || item.nama || 'Agenda'}${ghTag}
                        </span>
                    </div>

                    <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
                        <span style="font-size: 9px; background: #E0F2F1; color: #00796B; padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid #B2DFDB;">
                            📅 ${dateBadge}
                        </span>
                        <span style="font-size: 9px; background: ${isDone ? '#E8F5E9' : '#FFF3E0'}; color: ${isDone ? '#2E7D32' : '#E65100'}; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                            ${isDone ? 'DONE' : 'PENDING'}
                        </span>
                    </div>
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
            : dataGh.filter(function(g) { return g && isGhMatched(g.kode || g.id || g.nama, selectedGh); });

        var filteredTanaman = (selectedGh === 'ALL') 
            ? dataTanaman 
            : dataTanaman.filter(function(t) { return t && isGhMatched(t.gh || t.ghId, selectedGh); });

        var explicitTanamDate = null;
        var explicitHarvestDate = null;

        for (var i = 0; i < targetGhList.length; i++) {
            if (!targetGhList[i]) continue;
            var gDates = parseGhDates(targetGhList[i]);
            if (gDates.target) explicitHarvestDate = gDates.target;
            if (gDates.tanam) explicitTanamDate = gDates.tanam;
            if (explicitHarvestDate && explicitTanamDate) break;
        }

        if (!explicitTanamDate || !explicitHarvestDate) {
            filteredTanaman.forEach(function(t) {
                if (!t) return;
                var tglT = parseLocalDate(t.tanggal || t.tanam || t.tglTanam);
                var tglH = parseLocalDate(t.target || t.targetPanen || t.tglTarget || t.estimasiPanen);
                if (tglT && !explicitTanamDate) explicitTanamDate = tglT;
                if (tglH && !explicitHarvestDate) explicitHarvestDate = tglH;
            });
        }

        if (!explicitTanamDate && filteredTanaman.length === 0 && targetGhList.length === 0) {
            el.innerHTML = `
                <div style="background: rgba(255,255,255,0.9); padding: 16px; border-radius: 14px; text-align: center; color: #888; font-size: 12px; border: 1px dashed #FFE082;">
                    <i class="fas fa-seedling" style="font-size: 22px; color: #BDBDBD; margin-bottom: 6px; display: block;"></i>
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

        var totalPopulasi = 0;
        var varietasSet = new Set();

        if (selectedGh === 'ALL') {
            var uniqueHolesALL = new Set();
            dataTanaman.forEach(function(t) {
                if (!t) return;
                if (t.talang && t.talang !== '-') {
                    uniqueHolesALL.add((t.gh || t.ghId || 'GH') + '_' + t.talang);
                }
                if (t.varietas) varietasSet.add(t.varietas);
            });
            totalPopulasi = uniqueHolesALL.size > 0 ? uniqueHolesALL.size : dataTanaman.length;

            if (totalPopulasi === 0 && dataGh.length > 0) {
                dataGh.forEach(function(g) {
                    if (!g) return;
                    totalPopulasi += (parseFloat(g.lubang) || parseFloat(g.kapasitas) || parseFloat(g.populasi) || parseFloat(g.totalPop) || 0);
                    if (g.varietas) varietasSet.add(g.varietas);
                });
            }
        } else {
            var uniqueHolesGH = new Set();
            filteredTanaman.forEach(function(t) {
                if (!t) return;
                if (t.talang && t.talang !== '-') {
                    uniqueHolesGH.add(t.talang);
                }
                if (t.varietas) varietasSet.add(t.varietas);
            });
            totalPopulasi = uniqueHolesGH.size > 0 ? uniqueHolesGH.size : filteredTanaman.length;

            if (totalPopulasi === 0 && targetGhList.length > 0) {
                targetGhList.forEach(function(g) {
                    if (!g) return;
                    totalPopulasi += (parseFloat(g.lubang) || parseFloat(g.kapasitas) || parseFloat(g.populasi) || parseFloat(g.totalPop) || 0);
                    if (g.varietas) varietasSet.add(g.varietas);
                });
            }
        }

        var varietasDisplay = (selectedGh === 'ALL') ? '' : ` (${Array.from(varietasSet).join(', ') || 'Melon'})`;

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
        var filteredBuah = (selectedGh === 'ALL') ? dataBuah : dataBuah.filter(function(b) { return b && isGhMatched(b.gh || b.ghId, selectedGh); });
        filteredBuah.forEach(function(b) { if (b) totalBuahFix += (parseFloat(b.jumlahFix) || parseFloat(b.jumlah) || 0); });

        var progressPercent = Math.min(100, Math.max(0, isBelumTanam ? 0 : Math.round((maxHst / totalTargetDays) * 100)));

        el.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
                <div>
                    <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 800; background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%); color: #E65100; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.4px; box-shadow: 0 2px 6px rgba(230,81,0,0.12); border: 1px solid #FFCC80;">
                        <span style="width: 6px; height: 6px; border-radius: 50%; background: #E65100; display: inline-block;" class="pulse-green"></span>
                        ${phaseTitle}
                    </span>
                    <div style="display: flex; align-items: baseline; gap: 4px; margin-top: 8px;">
                        <span style="font-size: 26px; font-weight: 900; color: #1B5E20; line-height: 1; font-family: system-ui, -apple-system, sans-serif;">${maxHst}</span>
                        <span style="font-size: 12px; font-weight: 700; color: #666;">/ ${totalTargetDays} HST</span>
                    </div>
                </div>

                <div style="background: rgba(255, 255, 255, 0.95); border: 1px solid #FFE082; border-radius: 12px; padding: 8px 12px; text-align: right; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div style="font-size: 9px; color: #888; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px;">Estimasi Panen</div>
                    <div style="font-size: 12px; font-weight: 800; color: #0277BD; display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
                        <i class="far fa-calendar-alt" style="font-size: 11px;"></i> ${estHarvestDateStr}
                    </div>
                    <div style="font-size: 9px; color: #2E7D32; font-weight: 700; margin-top: 2px;">
                        (${sisaHari} Hari Lagi)
                    </div>
                </div>
            </div>

            <div style="background: rgba(255, 255, 255, 0.9); border-radius: 14px; padding: 12px 10px; border: 1px solid rgba(255, 224, 130, 0.6); margin-bottom: 12px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);">
                <div style="height: 6px; background: #E0E0E0; border-radius: 10px; overflow: hidden; margin-bottom: 12px; position: relative;">
                    <div style="height: 100%; width: ${progressPercent}%; background: linear-gradient(90deg, #2E7D32 0%, #4CAF50 100%); border-radius: 10px; transition: width 0.5s ease;"></div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; position: relative;">
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: ${currentStep >= 1 ? 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)' : '#FFF'}; border: 2px solid ${currentStep >= 1 ? '#2E7D32' : '#CCC'}; color: ${currentStep >= 1 ? '#FFF' : '#888'}; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: ${currentStep === 1 ? '0 0 0 3px rgba(46,125,50,0.25)' : 'none'}; transition: all 0.2s ease;">
                            1
                        </div>
                        <span style="font-size: 9px; color: ${currentStep === 1 ? '#1B5E20' : '#757575'}; font-weight: ${currentStep === 1 ? '800' : '600'}; margin-top: 4px;">Veg Awal</span>
                    </div>

                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: ${currentStep >= 2 ? 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)' : '#FFF'}; border: 2px solid ${currentStep >= 2 ? '#2E7D32' : '#CCC'}; color: ${currentStep >= 2 ? '#FFF' : '#888'}; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: ${currentStep === 2 ? '0 0 0 3px rgba(46,125,50,0.25)' : 'none'}; transition: all 0.2s ease;">
                            2
                        </div>
                        <span style="font-size: 9px; color: ${currentStep === 2 ? '#1B5E20' : '#757575'}; font-weight: ${currentStep === 2 ? '800' : '600'}; margin-top: 4px;">Vegetatif</span>
                    </div>

                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: ${currentStep >= 3 ? 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)' : '#FFF'}; border: 2px solid ${currentStep >= 3 ? '#2E7D32' : '#CCC'}; color: ${currentStep >= 3 ? '#FFF' : '#888'}; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: ${currentStep === 3 ? '0 0 0 3px rgba(46,125,50,0.25)' : 'none'}; transition: all 0.2s ease;">
                            3
                        </div>
                        <span style="font-size: 9px; color: ${currentStep === 3 ? '#1B5E20' : '#757575'}; font-weight: ${currentStep === 3 ? '800' : '600'}; margin-top: 4px;">Polinasi</span>
                    </div>

                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: ${currentStep >= 4 ? 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)' : '#FFF'}; border: 2px solid ${currentStep >= 4 ? '#2E7D32' : '#CCC'}; color: ${currentStep >= 4 ? '#FFF' : '#888'}; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: ${currentStep === 4 ? '0 0 0 3px rgba(46,125,50,0.25)' : 'none'}; transition: all 0.2s ease;">
                            4
                        </div>
                        <span style="font-size: 9px; color: ${currentStep === 4 ? '#1B5E20' : '#757575'}; font-weight: ${currentStep === 4 ? '800' : '600'}; margin-top: 4px;">Pembesaran</span>
                    </div>
                </div>
            </div>

            <div style="background: rgba(255,255,255,0.92); padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(200, 230, 201, 0.8); display: flex; justify-content: space-between; align-items: center; font-size: 11px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <i class="fas fa-tree" style="color: #2E7D32; font-size: 12px;"></i>
                    <span style="color: #555; font-weight: 600;">Populasi:</span>
                    <strong style="color: #1B5E20; font-weight: 800;">${totalPopulasi} Pohon</strong>
                    <span style="color: #777; font-size: 10px;">${varietasDisplay}</span>
                </div>
                ${
                    totalBuahFix > 0
                    ? `<div style="display: flex; align-items: center; gap: 4px;"><i class="fas fa-apple-alt" style="color: #E65100; font-size: 11px;"></i> <span style="color: #555;">Fix:</span> <strong style="color: #E65100; font-weight: 800;">${totalBuahFix} Buah (~${Math.round(totalBuahFix * 1.5)} Kg)</strong></div>`
                    : `<div style="color: #9E9E9E; font-size: 10px; font-style: italic;">*Panen dihitung pasca Polinasi</div>`
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
                if (!item) return;
                var itemGh = item.gh;
                if (!itemGh && item.deskripsi) {
                    var match = item.deskripsi.match(/(GH[-\w\d]+)/i);
                    if (match) itemGh = match[1];
                }

                allLogs.push({
                    timestamp: item.timestamp || item.created_at || (item.tanggal ? (item.tanggal + 'T' + (item.jam || '00:00') + ':00') : new Date().toISOString()),
                    jam: item.jam || item.waktu || 'Baru',
                    text: item.judul || item.text || item.kegiatan || 'Aktivitas',
                    desc: item.deskripsi || item.keterangan || '',
                    gh: itemGh || 'ALL'
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
                if (!item) return;
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

            Object.keys(plantGroupMap).forEach(function(k) {
                var g = plantGroupMap[k];
                if (!g) return;
                allLogs.push({
                    timestamp: g.timestamp,
                    jam: g.jam,
                    text: 'Tanam: ' + g.varietas,
                    desc: 'GH: ' + g.gh + ' | Total: ' + g.totalJumlah + ' Pohon',
                    gh: g.gh
                });
            });

            allNutrisi.forEach(function(item) {
                if (!item) return;
                allLogs.push({
                    timestamp: item.createdAt || item.date || item.tanggal || new Date().toISOString(),
                    jam: item.jam || item.waktu || 'Tercatat',
                    text: 'Nutrisi: ' + (item.ppm || 0) + ' PPM',
                    desc: 'pH: ' + (item.ph || '-') + ' | GH: ' + (item.gh || 'GH'),
                    gh: item.gh || 'ALL'
                });
            });

            allSpray.forEach(function(item) {
                if (!item) return;
                allLogs.push({
                    timestamp: item.createdAt || item.tanggal || new Date().toISOString(),
                    jam: item.jam || item.waktu || 'Tercatat',
                    text: 'Aplikasi Spray',
                    desc: (item.bahan || item.pestisida || 'Penyemprotan') + ' (' + (item.gh || 'GH') + ')',
                    gh: item.gh || 'ALL'
                });
            });

            allPanen.forEach(function(item) {
                if (!item) return;
                allLogs.push({
                    timestamp: item.createdAt || item.tanggal || new Date().toISOString(),
                    jam: item.jam || item.waktu || 'Tercatat',
                    text: 'Panen Melon',
                    desc: (item.totalKg || item.jumlah || 0) + ' Kg (' + (item.gh || 'GH') + ')',
                    gh: item.gh || 'ALL'
                });
            });

            allBuah.forEach(function(item) {
                if (!item) return;
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
            : allLogs.filter(function(l) { return l && (isGhMatched(l.gh, selectedGh) || l.gh === 'ALL' || !l.gh); });

        if (filteredLogs.length === 0) {
            el.innerHTML = `<div style="font-size: 11px; color: #5C6BC0; text-align: center; padding: 12px 0; font-weight: 600;">${t('no_logs')}</div>`;
            return;
        }

        filteredLogs.sort(function(a, b) {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

        var html = '';
        filteredLogs.slice(0, 5).forEach(function(l) {
            if (!l) return;
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
        var schedules = getData('cozycs_jadwal');

        var item = schedules.find(function(s, idx) { return s && (s.id === id || idx == id); });
        if (item) {
            if (item.status === 'Selesai' || item.status === 'Completed' || item.completed === true) {
                item.status = 'Pending';
                item.completed = false;
            } else {
                item.status = 'Selesai';
                item.completed = true;
            }

            var json = JSON.stringify(schedules);
            localStorage.setItem('cozycs_jadwal', json);
            localStorage.setItem('cozycs_schedules', json);

            if (typeof Storage !== 'undefined' && Storage.saveAll) {
                Storage.saveAll('cozycs_jadwal', schedules);
                Storage.saveAll('cozycs_schedules', schedules);
            }

            window.dispatchEvent(new Event('cozycs_data_changed'));
        }
        loadTodayAgenda();
    }

    return {
        render: render,
        init: init,
        navigateTo: navigateTo,
        selectGhFilter: selectGhFilter,
        setNutrientSessionFilter: setNutrientSessionFilter,
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
