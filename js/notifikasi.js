// ==========================================
// COZYCS FARM - NOTIFICATION / ALARM MODULE
// (Sistem Alarm Otomatis H-1 & Expired H+1 - BILINGUAL & DARK MODE)
// ==========================================

var notifikasi = (function() {

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Pusat Notifikasi & Alarm Farm',
            'module_subtitle': 'Daftar pengingat otomatis (H-1 kegiatan). Ketuk kartu alarm untuk langsung menuju modul terkait.',
            'no_alarm_title': 'Tidak ada alarm aktif untuk esok hari',
            'no_alarm_desc': 'Semua jadwal aman dan terkendali.',
            'lbl_tomorrow_agenda': 'Agenda Besok',
            'lbl_event_date': 'Tanggal Kegiatan:'
        },
        'en': {
            'module_title': 'Farm Notification & Alarm Center',
            'module_subtitle': 'Automated reminder list (H-1 tasks). Tap an alarm card to go directly to the related module.',
            'no_alarm_title': 'No active alarms for tomorrow',
            'no_alarm_desc': 'All schedules are clear and on track.',
            'lbl_tomorrow_agenda': "Tomorrow's Agenda",
            'lbl_event_date': 'Event Date:'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    // Helper untuk memformat tanggal (YYYY-MM-DD)
    function formatDateString(date) {
        var d = new Date(date);
        var month = '' + (d.getMonth() + 1);
        var day = '' + d.getDate();
        var year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    // Mendapatkan tanggal hari ini, H-1, dan H+1 secara dinamis
    function getSystemDates() {
        var today = new Date();
        
        var tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        var yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        var twoDaysLater = new Date(today);
        twoDaysLater.setDate(today.getDate() + 2);

        return {
            todayStr: formatDateString(today),
            tomorrowStr: formatDateString(tomorrow),
            yesterdayStr: formatDateString(yesterday),
            futureStr: formatDateString(twoDaysLater)
        };
    }

    // Mengambil master jadwal farm (bisa dari Storage atau fallback)
    function getFarmSchedules() {
        if (typeof Storage !== 'undefined' && Storage.getAll) {
            var schedules = Storage.getAll('cozycs_schedules') || [];
            if (schedules.length > 0) return schedules;
        }

        var defaultSchedules = [
            {
                id: 'sch_1',
                title: 'Jadwal Penyemprotan Preventif Hama',
                desc: 'Penyemprotan fungisida/insektisida rutin pencegahan jamur pada daun.',
                date: formatDateString(new Date(Date.now() + 86400000)), // H+1 (Besok)
                module: 'spray',
                icon: 'fa-spray-can',
                color: '#6A1B9A',
                bg: '#F3E5F5'
            },
            {
                id: 'sch_2',
                title: 'Pengecekan Tandon & Target PPM',
                desc: 'Pastikan nutrisi AB Mix fase vegetatif stabil di kisaran 1,050 - 1,200 PPM.',
                date: formatDateString(new Date(Date.now() + 86400000)), // H+1 (Besok)
                module: 'nutrisi',
                icon: 'fa-flask',
                color: '#0277BD',
                bg: '#E3F2FD'
            }
        ];

        var saved = localStorage.getItem('cozycs_farm_schedules');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return defaultSchedules;
            }
        }
        return defaultSchedules;
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-bell" style="color: #C62828;"></i> ${t('module_title')}</div>
                <div style="font-size: 13px; color: #888; margin-bottom: 16px;">
                    ${t('module_subtitle')}
                </div>

                <!-- Daftar Notifikasi Dinamis -->
                <div id="notificationListContainer" style="display: flex; flex-direction: column; gap: 10px;">
                    <!-- Diisi otomatis oleh JavaScript -->
                </div>
            </div>
        `;
    }

    function init() {
        loadActiveNotifications();
    }

    function loadActiveNotifications() {
        var container = document.getElementById('notificationListContainer');
        if (!container) return;

        var allSchedules = getFarmSchedules();
        var dates = getSystemDates();

        // LOGIKA UTAMA ALARM H-1 & EXPIRED H+1:
        var activeAlarms = allSchedules.filter(function(item) {
            if (!item || !item.date) return false;
            var eventDate = new Date(item.date);
            var hMinus1 = new Date(eventDate);
            hMinus1.setDate(eventDate.getDate() - 1);
            var hMinus1Str = formatDateString(hMinus1);

            return hMinus1Str === dates.todayStr;
        });

        if (activeAlarms.length === 0) {
            container.innerHTML = `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 24px; text-align: center; color: #777;">
                    <i class="fas fa-check-circle" style="font-size: 32px; color: #2E7D32; margin-bottom: 8px;"></i>
                    <div style="font-size: 14px; font-weight: 600; color: var(--text-color, #333);">${t('no_alarm_title')}</div>
                    <div style="font-size: 12px; color: #777; margin-top: 4px;">${t('no_alarm_desc')}</div>
                </div>
            `;
            return;
        }

        var html = '';
        activeAlarms.forEach(function(item) {
            html += `
                <div class="notif-card-item" data-page="${item.module}" style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-left: 4px solid ${item.color || '#C62828'}; border-radius: 10px; padding: 12px 14px; display: flex; align-items: flex-start; gap: 12px; cursor: pointer; transition: all 0.2s;">
                    <div style="width: 38px; height: 38px; border-radius: 8px; background: ${item.bg || '#FFEBEE'}; color: ${item.color || '#C62828'}; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">
                        <i class="fas ${item.icon || 'fa-bell'}"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                            <span style="font-size: 13px; font-weight: 700; color: var(--text-color, #222);">${item.title}</span>
                            <span style="font-size: 10px; color: #C62828; background: #FFEBEE; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${t('lbl_tomorrow_agenda')}</span>
                        </div>
                        <div style="font-size: 12px; color: #888; line-height: 1.4; margin-bottom: 4px;">${item.desc || ''}</div>
                        <div style="font-size: 11px; color: #777;"><i class="far fa-calendar-alt"></i> ${t('lbl_event_date')} <strong>${item.date}</strong></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Event listener saat kartu alarm diklik -> Langsung arahkan ke modul terkait
        var cards = container.querySelectorAll('.notif-card-item');
        cards.forEach(function(card) {
            card.addEventListener('click', function() {
                var targetPage = this.getAttribute('data-page');
                if (typeof navigateTo === 'function' && targetPage) {
                    navigateTo(targetPage);
                }
            });
        });
    }

    return {
        render: render,
        init: init
    };

})();

window.notifikasi = notifikasi;
