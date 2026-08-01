// ==========================================
// COZYCS FARM - NOTIFICATION / ALARM MODULE
// ==========================================

var notifikasi = (function() {

    // Menyimpan data alarm di dalam memori lokal/session agar status "sudah dibaca" tersimpan
    function getStoredAlarms() {
        var defaultAlarms = [
            {
                id: 1,
                title: 'Jadwal Penyemprotan Preventif Hama',
                desc: 'Penyemprotan fungisida/insektisida rutin untuk pencegahan jamur.',
                time: 'Hari ini, 16:00 WIB',
                module: 'spray',
                icon: 'fa-spray-can',
                color: '#6A1B9A',
                bg: '#F3E5F5',
                unread: true
            },
            {
                id: 2,
                title: 'Pengecekan Tandon & Target PPM',
                desc: 'Pastikan nutrisi AB Mix fase vegetatif stabil di kisaran 1,050 - 1,200 PPM.',
                time: 'Besok, 08:00 WIB',
                module: 'nutrisi',
                icon: 'fa-flask',
                color: '#0277BD',
                bg: '#E3F2FD',
                unread: true
            },
            {
                id: 3,
                title: 'Agenda Polinasi Bunga Susulan',
                desc: 'Cek bunga tandan ke-9 hingga ke-12 yang siap dikawinkan.',
                time: '03 Agu 2026',
                module: 'polinasi',
                icon: 'fa-heart',
                color: '#E65100',
                bg: '#FFF3E0',
                unread: false
            },
            {
                id: 4,
                title: 'Pangkas Tunas Air (Pruning)',
                desc: 'Merempes cabang air di bawah ketinggian 1 meter.',
                time: '05 Agu 2026',
                module: 'pruning',
                icon: 'fa-cut',
                color: '#4E342E',
                bg: '#EFEBE9',
                unread: false
            }
        ];

        var saved = localStorage.getItem('cozycs_farm_alarms');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return defaultAlarms;
            }
        }
        return defaultAlarms;
    }

    function saveStoredAlarms(alarms) {
        localStorage.setItem('cozycs_farm_alarms', JSON.stringify(alarms));
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-bell" style="color: #C62828;"></i> Pusat Notifikasi & Alarm Farm</div>
                <div style="font-size: 13px; color: #666; margin-bottom: 16px;">
                    Ketuk salah satu alarm di bawah untuk langsung menuju modul terkait dan menandainya sebagai selesai.
                </div>

                <!-- Daftar Notifikasi Dinamis -->
                <div id="notificationListContainer" style="display: flex; flex-direction: column; gap: 10px;">
                    <!-- Diisi otomatis oleh JavaScript -->
                </div>
            </div>
        `;
    }

    function init() {
        loadNotifications();
    }

    function loadNotifications() {
        var container = document.getElementById('notificationListContainer');
        if (!container) return;

        var alarmList = getStoredAlarms();
        var html = '';

        alarmList.forEach(function(item) {
            html += `
                <div class="notif-card-item" data-id="${item.id}" data-page="${item.module}" style="background: #fff; border: 1px solid ${item.unread ? '#a5d6a7' : '#e8e8e8'}; border-left: 4px solid ${item.color}; border-radius: 10px; padding: 12px 14px; display: flex; align-items: flex-start; gap: 12px; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.02); transition: all 0.2s;">
                    <div style="width: 38px; height: 38px; border-radius: 8px; background: ${item.bg}; color: ${item.color}; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">
                        <i class="fas ${item.icon}"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                            <span style="font-size: 13px; font-weight: ${item.unread ? '700' : '600'}; color: #222;">${item.title}</span>
                            <span style="font-size: 10px; color: #777; background: #f4f6f5; padding: 2px 6px; border-radius: 4px;">${item.time}</span>
                        </div>
                        <div style="font-size: 12px; color: #555; line-height: 1.4;">${item.desc}</div>
                    </div>
                    ${item.unread ? '<div class="unread-dot" style="width: 8px; height: 8px; background: #C62828; border-radius: 50%; align-self: center;"></div>' : '<span style="font-size: 10px; color: #2E7D32; font-weight: 600; align-self: center;"><i class="fas fa-check-circle"></i> Selesai</span>'}
                </div>
            `;
        });

        container.innerHTML = html;

        // Tambahkan Event Listener interaktif ketika kartu alarm diklik
        var cards = container.querySelectorAll('.notif-card-item');
        cards.forEach(function(card) {
            card.addEventListener('click', function() {
                var alarmId = parseInt(this.getAttribute('data-id'));
                var targetPage = this.getAttribute('data-page');

                // Ubah status unread menjadi false (sudah dieksekusi/dibaca)
                var alarms = getStoredAlarms();
                alarms = alarms.map(function(al) {
                    if (al.id === alarmId) {
                        al.unread = false;
                    }
                    return al;
                });
                saveStoredAlarms(alarms);

                // Navigasi ke halaman modul yang dituju menggunakan router global
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
