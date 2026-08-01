// ==========================================
// COZYCS FARM - NOTIFICATION SYSTEM
// ==========================================

var Notification = (function() {

    function init() {
        checkNotifications();
        setupNotificationEvents();
    }

    function checkNotifications() {
        try {
            // Ambil data jadwal dari storage
            var jadwalList = typeof Storage !== 'undefined' ? Storage.getAll(Storage.KEYS.JADWAL) : [];
            var today = Helper.getTodayDate();

            // Hitung jadwal yang belum selesai atau jatuh tempo hari ini
            var pendingCount = jadwalList.filter(function(item) {
                return !item.completed;
            }).length;

            updateBadge(pendingCount);
        } catch (e) {
            console.error('[Notification] Error checking notifications', e);
        }
    }

    function updateBadge(count) {
        var badge = document.getElementById('notificationBadge');
        if (!badge) return;

        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    function setupNotificationEvents() {
        var btnNotification = document.getElementById('btnNotification');
        if (btnNotification) {
            btnNotification.addEventListener('click', function() {
                // Saat tombol lonceng diklik, arahkan pengguna ke halaman jadwal/tugas
                if (typeof Router !== 'undefined' && typeof Router.navigate === 'function') {
                    Router.navigate('jadwal');
                }
            });
        }
    }

    return {
        init: init,
        check: checkNotifications
    };

})();
