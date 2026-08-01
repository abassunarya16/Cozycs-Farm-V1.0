// ==========================================
// COZYCS FARM - NOTIFICATION / ALARM MODULE
// (Sistem Alarm Otomatis H-1 & Expired H+1)
// ==========================================

var notifikasi = (function() {

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

    // Mendapatkan tanggal hari ini, H-1, dan H+1 berdasarkan waktu sistem (2026)
    function getSystemDates() {
        var today = new Date(2026, 7, 1); // 1 Agustus 2026 sesuai konteks sistem
        
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

    // Mengambil master jadwal farm (bisa dari modul terkait atau localStorage)
    function getFarmSchedules() {
        var defaultSchedules = [
            {
                id: 'sch_1',
                title: 'Jadwal Penyemprotan Preventif Hama',
                desc: 'Penyemprotan fungisida/insektisida rutin pencegahan jamur pada daun.',
                date: '2026-08-02', // Tanggal pelaksanaan besok (H-1 nya muncul hari ini)
                module: 'spray',
                icon: 'fa-spray-can',
                color: '#6A1B9A',
                bg: '#F3E5F5'
            },
            {
                id: 'sch_2',
                title: 'Pengecekan Tandon & Target PPM',
                desc: 'Pastikan nutrisi AB Mix fase vegetatif stabil di kisaran 1,050 - 1,200 PPM.',
                date: '2026-08-02', // Pelaksanaan besok
                module: 'nutrisi',
                icon: 'fa-flask',
                color: '#0277BD',
                bg: '#E3F2FD'
            },
            {
                id: 'sch_3',
                title: 'Agenda Polinasi Bunga Susulan',
                desc: 'Cek bunga tandan ke-9 hingga ke-12 yang siap dikawinkan.',
                date: '2026-08-03', // Pelaksanaan lusa
                module: 'polinasi',
                icon: 'fa-heart',
                color: '#E65100',
                bg: '#FFF3E0'
            },
            {
                id: 'sch_4',
                title: 'Pangkas Tunas Air (Pruning)',
                desc: 'Merempes cabang air liar di bawah ketinggian 1 meter.',
                date: '2026-08-05', // Pelaksanaan beberapa hari kedepan
                module: 'pruning',
                icon: 'fa-cut',
                color: '#4E342E',
                bg: '#EFEBE9'
            },
            {
                id: 'sch_5',
                title: 'Estimasi Panen Blok Greenhouse A',
                desc: 'Persiapan keranjang, timbangan, dan sortir buah menjelang hari H.',
                date: '2026-08-01', // Pelaksanaan hari ini (artinya H-1 nya kemarin, hari ini harusnya sudah expired/hilang)
                module: 'panen',
                icon: 'fa-box',
                color: '#1B5E20',
                bg: '#E8F5E9'
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
                <div class="section-title"><i class="fas fa-bell" style="color: #C62828;"></i> Pusat Notifikasi & Alarm Farm</div>
                <div style="font-size: 13px; color: #666; margin-bottom: 16px;">
                    Daftar pengingat otomatis (H-1 kegiatan). Ketuk kartu alarm untuk langsung menuju modul terkait.
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
        // Sebuah jadwal akan menjadi alarm aktif jika:
        // Tanggal Hari Ini (todayStr) adalah TEPAT SATU HARI SEBELUM tanggal kegiatan (date).
        // Atau dengan kata lain: (Tanggal Kegiatan - 1 Hari) == Hari Ini.
        // Jika tanggal kegiatan sudah sama dengan hari ini atau sudah lewat (<= todayStr), 
        // maka alarm otomatis dianggap expired dan tidak dimunculkan lagi di pusat notifikasi.
        
        var activeAlarms = allSchedules.filter(function(item) {
            // Hitung tanggal H-1 dari tanggal kegiatan item
            var eventDate = new Date(item.date);
            var hMinus1 = new Date(eventDate);
            hMinus1.setDate(eventDate.getDate() - 1);
            var hMinus1Str = formatDateString(hMinus1);

            // Alarm hanya muncul jika hari ini adalah tanggal H-1 dari kegiatan tersebut
            return hMinus1Str === dates.todayStr;
        });

        if (activeAlarms.length === 0) {
            container.innerHTML = `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 24px; text-align: center; color: #777;">
                    <i class="fas fa-check-circle" style="font-size: 32px; color: #2E7D32; margin-bottom: 8px;"></i>
                    <div style="font-size: 14px; font-weight: 600; color: #333;">Tidak ada alarm aktif untuk esok hari</div>
                    <div style="font-size: 12px; color: #777; margin-top: 4px;">Semua jadwal aman dan terkendali.</div>
                </div>
            `;
            return;
        }

        var html = '';
        activeAlarms.forEach(function(item) {
            html += `
                <div class="notif-card-item" data-page="${item.module}" style="background: #fff; border: 1px solid #a5d6a7; border-left: 4px solid ${item.color}; border-radius: 10px; padding: 12px 14px; display: flex; align-items: flex-start; gap: 12px; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.02); transition: all 0.2s;">
                    <div style="width: 38px; height: 38px; border-radius: 8px; background: ${item.bg}; color: ${item.color}; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">
                        <i class="fas ${item.icon}"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                            <span style="font-size: 13px; font-weight: 700; color: #222;">${item.title}</span>
                            <span style="font-size: 10px; color: #C62828; background: #FFEBEE; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Agenda Besok</span>
                        </div>
                        <div style="font-size: 12px; color: #555; line-height: 1.4; margin-bottom: 4px;">${item.desc}</div>
                        <div style="font-size: 11px; color: #777;"><i class="far fa-calendar-alt">></i> Tanggal Kegiatan: <strong>${item.date}</strong></div>
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
