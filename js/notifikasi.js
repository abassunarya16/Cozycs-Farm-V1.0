// ==========================================
// COZYCS FARM - REAL NOTIFIKASI MODULE (SAFE & STABLE)
// ==========================================

var notifikasi = (function() {

    function render() {
        return `
            <div class="notifikasi-container" style="padding: 16px; padding-bottom: 30px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                    <i class="fas fa-bell" style="font-size: 18px; color: #2E7D32;"></i>
                    <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #1B5E20;">Pusat Notifikasi & Alarm Farm</h3>
                </div>

                <div style="font-size: 11px; color: #666; margin-bottom: 16px; background: #E8F5E9; padding: 10px 12px; border-radius: 8px; border-left: 4px solid #2E7D32;">
                    Daftar pengingat otomatis berdasarkan data jadwal dan agenda asli farm Anda. Ketuk kartu untuk menuju modul terkait.
                </div>

                <div id="realNotifikasiList" style="display: flex; flex-direction: column; gap: 12px;"></div>
            </div>
        `;
    }

    function init() {
        loadRealNotifikasi();
    }

    function getData(key) {
        try {
            if (typeof Storage !== 'undefined' && Storage.getAll) {
                return Storage.getAll(key) || [];
            }
        } catch(e) {}
        return [];
    }

    function loadRealNotifikasi() {
        var el = document.getElementById('realNotifikasiList');
        if (!el) return;

        var schedules = getData('cozycs_schedules');
        if (schedules.length === 0) schedules = getData('cozycs_jadwal');

        if (schedules.length === 0) {
            el.innerHTML = `
                <div style="background: #fff; padding: 30px; border-radius: 12px; text-align: center; border: 1px solid #e8e8e8; color: #888;">
                    <i class="far fa-bell-slash" style="font-size: 32px; color: #ccc; margin-bottom: 8px; display: block;"></i>
                    <div style="font-size: 13px; font-weight: 600;">Belum ada notifikasi atau jadwal aktif.</div>
                    <div style="font-size: 11px; color: #aaa; margin-top: 4px;">Tambahkan jadwal di menu Jadwal untuk memunculkan pengingat di sini.</div>
                </div>
            `;
            return;
        }

        var html = '';
        schedules.slice(-10).reverse().forEach(function(item) {
            var title = item.title || item.judul || item.kegiatan || item.nama || 'Agenda Farm';
            var dateStr = item.date || item.tanggal || 'Segera';
            var status = item.status || 'Pending';
            var isDone = (status === 'Selesai' || status === 'DONE' || item.completed === true);

            var borderColor = isDone ? '#4CAF50' : '#FF9800';
            var bgBadge = isDone ? '#E8F5E9' : '#FFF3E0';
            var textBadgeColor = isDone ? '#2E7D32' : '#E65100';

            html += `
                <div onclick="navigateTo('jadwal')" style="background: #fff; border-radius: 12px; padding: 14px; border: 1px solid #e8e8e8; border-left: 4px solid ${borderColor}; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                        <div style="font-size: 13px; font-weight: 800; color: #222;">${title}</div>
                        <span style="font-size: 10px; background: ${bgBadge}; color: ${textBadgeColor}; padding: 2px 8px; border-radius: 6px; font-weight: bold;">
                            ${isDone ? 'Selesai' : 'Agenda Aktif'}
                        </span>
                    </div>
                    <div style="font-size: 11px; color: #666; margin-bottom: 8px;">
                        Status pengerjaan kegiatan farm terpantau otomatis. Ketuk untuk mengelola jadwal.
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #555; font-weight: 600;">
                        <i class="far fa-calendar-alt" style="color: #2E7D32;"></i>
                        <span>Tanggal Kegiatan: ${dateStr}</span>
                    </div>
                </div>
            `;
        });

        el.innerHTML = html;
    }

    return {
        render: render,
        init: init
    };

})();

window.notifikasi = notifikasi;
