// ==========================================
// COZYCS FARM - HELPER & UTILITY FUNCTIONS
// ==========================================

// Pusat Konfigurasi Versi Aplikasi Cozycs Farm (Single Source of Truth)
var APP_VERSION = '1.1.1';

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

    // Menentukan salam otomatis berdasarkan jam
    function getGreeting() {
        var hour = new Date().getHours();
        if (hour >= 3 && hour < 11) return { text: 'Selamat Pagi', icon: '🌅' };
        if (hour >= 11 && hour < 15) return { text: 'Selamat Siang', icon: '☀️' };
        if (hour >= 15 && hour < 19) return { text: 'Selamat Sore', icon: '⛅' };
        return { text: 'Selamat Malam', icon: '🌙' };
    }

    // Format tanggal dan waktu lengkap (Contoh: Senin, 03 Agu 2026 | 15:29 WIB)
    function getFullDateTime() {
        var now = new Date();
        var days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        var dayName = days[now.getDay()];
        var dateNum = ('0' + now.getDate()).slice(-2);
        var monthName = months[now.getMonth()];
        var year = now.getFullYear();
        var hours = ('0' + now.getHours()).slice(-2);
        var minutes = ('0' + now.getMinutes()).slice(-2);

        return dayName + ', ' + dateNum + ' ' + monthName + ' ' + year + ' | ' + hours + ':' + minutes + ' WIB';
    }

    // ==========================================
// COZYCS FARM - GLOBAL FORM AUTO-SAVE DRAFT SYSTEM
// (Mencegah Data Hilang di Seluruh Modul Aplikasi)
// ==========================================

(function() {
    // 1. DENGARKAN SETIAP KETIKAN / PERUBAHAN DI FORM APAPUN SECARA OTOMATIS
    document.addEventListener('input', function(e) {
        var form = e.target.closest('form');
        if (!form || !form.id) return;

        saveFormDraftGlobal(form.id);
    });

    document.addEventListener('change', function(e) {
        var form = e.target.closest('form');
        if (!form || !form.id) return;

        saveFormDraftGlobal(form.id);
    });

    // 2. FUNGSI MENYIMPAN DRAF FORM
    function saveFormDraftGlobal(formId) {
        var form = document.getElementById(formId);
        if (!form) return;

        var formData = {};
        var inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(function(input) {
            // Hindari menyimpan input password / file / hidden ID bawaan edit
            if (input.id && input.type !== 'password' && input.type !== 'file' && input.type !== 'hidden') {
                formData[input.id] = input.value;
            }
        });

        try {
            localStorage.setItem('cozycs_global_draft_' + formId, JSON.stringify(formData));
        } catch(e) {}
    }

    // 3. FUNGSI MEMULIHKAN DRAF FORM (AUTO-RESTORE)
    window.restoreFormDraftGlobal = function(formId) {
        var form = document.getElementById(formId);
        if (!form) return;

        try {
            var rawData = localStorage.getItem('cozycs_global_draft_' + formId);
            if (!rawData) return;

            var formData = JSON.parse(rawData);
            Object.keys(formData).forEach(function(inputId) {
                var input = document.getElementById(inputId);
                if (input && formData[inputId] !== undefined) {
                    input.value = formData[inputId];
                }
            });
        } catch(e) {}
    };

    // 4. FUNGSI BERSIHKAN DRAF SAAT FORM BERHASIL DI-SUBMIT
    document.addEventListener('submit', function(e) {
        var form = e.target;
        if (form && form.id) {
            try {
                localStorage.removeItem('cozycs_global_draft_' + form.id);
            } catch(err) {}
        }
    });
})();
    

    return {
        VERSION: APP_VERSION,
        formatDate: formatDate,
        formatRupiah: formatRupiah,
        showToast: showToast,
        getTodayDate: getTodayDate,
        getGreeting: getGreeting,
        getFullDateTime: getFullDateTime
    };

})();
