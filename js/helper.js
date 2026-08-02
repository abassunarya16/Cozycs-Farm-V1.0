// ==========================================
// COZYCS FARM - HELPER & UTILITY FUNCTIONS
// ==========================================

// Pusat Konfigurasi Versi Aplikasi Cozycs Farm (Single Source of Truth)
var APP_VERSION = '1.5';

var Helper = (function() {

    // Format tanggal menjadi format Indonesia (Contoh: 01 Agu 2026)
    function formatDate(dateString) {
        if (!dateString) return '-';
        var date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        var day = ('0' + date.getDate()).slice(-2);
        var month = months[date.getMonth()];
        var year = date.getFullYear();

        return day + ' ' + month + ' ' + year;
    }

    // Format angka menjadi mata uang Rupiah (Contoh: Rp 150.000)
    function formatRupiah(number) {
        if (number === undefined || number === null || isNaN(number)) return 'Rp 0';
        return 'Rp ' + Number(number).toLocaleString('id-ID');
    }

    // Menampilkan pesan pop-up Toast di sudut layar
    function showToast(message, type) {
        type = type || 'success'; // Pilihan: 'success' atau 'error'
        var container = document.getElementById('toastContainer');
        if (!container) return;

        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.innerHTML = '<i class="fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i> ' + message;

        container.appendChild(toast);

        // Hapus toast otomatis setelah 3 detik
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(function() {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
    function getTodayDate() {
        var now = new Date();
        var year = now.getFullYear();
        var month = ('0' + (now.getMonth() + 1)).slice(-2);
        var day = ('0' + now.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
    }

    return {
        VERSION: APP_VERSION,
        formatDate: formatDate,
        formatRupiah: formatRupiah,
        showToast: showToast,
        getTodayDate: getTodayDate
    };

})();
