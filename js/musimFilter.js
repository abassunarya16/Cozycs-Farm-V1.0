// ==========================================
// COZYCS FARM - BILAH FILTER MUSIM GLOBAL (STICKY, LINTAS HALAMAN)
// ==========================================
//
// Modul ini menyediakan dropdown "musim aktif" yang tampil sticky di atas
// SETIAP halaman (lihat #barFilterMusimGlobal di index.html). Modul lain
// (Keuangan, Gudang, Spray, Dashboard, dll) bisa memanggil
// musimFilter.getActiveMusim() atau musimFilter.cocokDenganMusimAktif()
// untuk ikut menyaring data yang mereka tampilkan sesuai musim yang dipilih
// di sini — tanpa perlu tiap modul punya filter tanggal sendiri-sendiri.

var musimFilter = (function() {

    var KEY_SELECTED = 'cozycs_musim_filter_id';

    function getAllMusim() {
        try {
            if (typeof Storage !== 'undefined' && Storage.getAll) {
                return Storage.getAll('cozycs_musim') || [];
            }
        } catch(e) {}
        return [];
    }

    function getSelectedId() {
        return localStorage.getItem(KEY_SELECTED) || '';
    }

    function setSelectedId(id) {
        try {
            localStorage.setItem(KEY_SELECTED, id || '');
        } catch(e) {}
    }

    // Musim yang sedang aktif dipilih di bilah global, atau null jika
    // "Semua Musim" (tidak ada filter aktif).
    function getActiveMusim() {
        var id = getSelectedId();
        if (!id) return null;
        var list = getAllMusim();
        return list.find(function(m) { return m && m.id === id; }) || null;
    }

    // Helper siap-pakai untuk modul lain: cek apakah 1 data (dengan field
    // tanggal & gh) cocok dengan musim yang sedang aktif dipilih.
    // Jika tidak ada musim aktif (mode "Semua Musim"), selalu return true.
    function cocokDenganMusimAktif(tanggal, gh) {
        var musimAktif = getActiveMusim();
        if (!musimAktif) return true;

        var t = String(tanggal || '').split('T')[0];
        var mulai = musimAktif.tanggalMulai || '0000-01-01';
        var selesai = musimAktif.tanggalSelesai || '9999-12-31';
        if (!t || t < mulai || t > selesai) return false;

        var ghTerkait = Array.isArray(musimAktif.ghTerkait) ? musimAktif.ghTerkait : [];
        if (ghTerkait.length === 0) return true;

        var g = String(gh || '').trim();
        if (!g || g === 'Seluruh Kebun' || g === 'ALL') return true;

        return ghTerkait.indexOf(g) !== -1;
    }

    function renderBarHTML() {
        var list = getAllMusim();
        if (!Array.isArray(list) || list.length === 0) {
            return ''; // Belum ada musim tercatat -> bilah tidak usah tampil
        }

        list.sort(function(a, b) {
            return new Date((b && b.tanggalMulai) || 0) - new Date((a && a.tanggalMulai) || 0);
        });

        var selectedId = getSelectedId();
        var options = '<option value="">🌐 Semua Musim</option>';
        list.forEach(function(m) {
            if (!m || !m.id) return;
            var label = m.nama + (m.tanggalSelesai ? '' : ' (Berjalan)');
            options += '<option value="' + m.id + '" ' + (selectedId === m.id ? 'selected' : '') + '>' + label + '</option>';
        });

        return `
            <div style="background: #00695C; color: #fff; padding: 8px 14px; display: flex; align-items: center; gap: 8px; font-size: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                <i class="fas fa-calendar-week" style="flex-shrink: 0;"></i>
                <span style="font-weight: 700; white-space: nowrap; flex-shrink: 0;">Filter Musim:</span>
                <select onchange="musimFilter.selectMusim(this.value)" style="flex: 1; padding: 6px 8px; border-radius: 8px; border: none; font-size: 12px; font-weight: 600; background: #fff; color: #00332e; min-width: 0;">
                    ${options}
                </select>
            </div>
        `;
    }

    function refreshBarUI() {
        var barContainer = document.getElementById('barFilterMusimGlobal');
        if (barContainer) barContainer.innerHTML = renderBarHTML();
    }

    // Dipanggil dari dropdown (onchange) saat pengguna ganti pilihan musim.
    function selectMusim(id) {
        setSelectedId(id);
        refreshBarUI();

        // Render ulang halaman yang sedang aktif supaya datanya ikut
        // ter-filter sesuai musim yang baru dipilih.
        if (typeof navigateTo === 'function' && typeof currentPage !== 'undefined') {
            navigateTo(currentPage, true);
        }

        window.dispatchEvent(new Event('cozycs_data_changed'));
    }

    function init() {
        refreshBarUI();
    }

    // Bilah otomatis ikut ter-refresh kalau ada musim baru ditambah/dihapus
    // dari modul musim.js (yang dispatch 'cozycs_data_changed').
    window.addEventListener('cozycs_data_changed', function() {
        refreshBarUI();
    });

    return {
        render: function() { return renderBarHTML(); }, // alias, jaga-jaga dipanggil seperti modul lain
        renderBarHTML: renderBarHTML,
        init: init,
        selectMusim: selectMusim,
        getActiveMusim: getActiveMusim,
        getSelectedId: getSelectedId,
        cocokDenganMusimAktif: cocokDenganMusimAktif
    };

})();

window.musimFilter = musimFilter;
