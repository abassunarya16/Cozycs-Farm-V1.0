// ==========================================
// COZYCS FARM - MODUL DASHBOARD (DEFENSIVE & SAFE)
// ==========================================

var dashboard = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <!-- Header / Greeting -->
                <div style="background: linear-gradient(135deg, #1B5E20, #2E7D32); color: #fff; padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <div style="font-size: 18px; font-weight: 700;">Selamat Datang di Cozycs Farm! 🍈</div>
                    <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">Sistem Ringkasan & Monitoring Kebun Melon Hidroponik</div>
                </div>

                <!-- 1. Grid Ringkasan Utama (4 Kotak Kartu) -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;" id="dashboardSummaryGrid">
                    <!-- Diisi dinamis oleh JavaScript -->
                </div>

                <!-- 2. Aktivitas / Cek Terakhir Nutrisi -->
                <div class="section-title"><i class="fas fa-tint" style="color: #0277BD;"></i> Cek Nutrisi Terbaru</div>
                <div id="dashboardRecentNutrisi" style="margin-bottom: 20px;">
                    <!-- Diisi dinamis oleh JavaScript -->
                </div>

                <!-- 3. Jadwal / Riwayat Spray Terbaru -->
                <div class="section-title"><i class="fas fa-spray-can" style="color: #6A1B9A;"></i> Jadwal Spray Terbaru</div>
                <div id="dashboardRecentSpray" style="margin-bottom: 20px;">
                    <!-- Diisi dinamis oleh JavaScript -->
                </div>
            </div>
        `;
    }

    function init() {
        loadSummaryGrid();
        loadRecentNutrisi();
        loadRecentSpray();
    }

    // Helper aman untuk mengambil data dari Storage tanpa bikin crash
    function safeGetData(keyName) {
        try {
            if (typeof Storage !== 'undefined' && Storage.getAll) {
                var actualKey = (Storage.KEYS && Storage.KEYS[keyName]) ? Storage.KEYS[keyName] : 'cozycs_' + keyName.toLowerCase();
                var res = Storage.getAll(actualKey);
                return Array.isArray(res) ? res : [];
            }
        } catch (e) {
            console.error('Error fetching data for ' + keyName, e);
        }
        return [];
    }

    function loadSummaryGrid() {
        var gridContainer = document.getElementById('dashboardSummaryGrid');
        if (!gridContainer) return;

        var nutrisiData = safeGetData('NUTRISI');
        var sprayData = safeGetData('SPRAY');
        var tanamanData = safeGetData('TANAMAN');

        // Mengambil sampel data nutrisi paling baru jika ada
        var lastPpm = '-';
        var lastPh = '-';
        if (nutrisiData.length > 0) {
            var sortedNutrisi = nutrisiData.slice().sort(function(a, b) { return new Date(b.date || 0) - new Date(a.date || 0); });
            lastPpm = sortedNutrisi[0].ppm || '-';
            lastPh = sortedNutrisi[0].ph || '-';
        }

        // Mengambil statistik tanaman jika ada
        var totalHidup = 0;
        if (tanamanData.length > 0) {
            var sortedTanaman = tanamanData.slice().sort(function(a, b) { return new Date(b.date || 0) - new Date(a.date || 0); });
            totalHidup = sortedTanaman[0].hidup || 0;
        }

        gridContainer.innerHTML = `
            <!-- Kartu 1: Cek Nutrisi -->
            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e8e8e8; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase;"><i class="fas fa-tint" style="color: #0277BD;"></i> PPM Terakhir</div>
                <div style="font-size: 16px; font-weight: bold; color: #000; margin-top: 4px;">${lastPpm}</div>
                <div style="font-size: 10px; color: #555; margin-top: 2px;">Total Cek: <strong>${nutrisiData.length}</strong></div>
            </div>

            <!-- Kartu 2: pH Terakhir -->
            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e8e8e8; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase;"><i class="fas fa-vial" style="color: #E65100;"></i> pH Terakhir</div>
                <div style="font-size: 16px; font-weight: bold; color: #000; margin-top: 4px;">${lastPh}</div>
                <div style="font-size: 10px; color: #555; margin-top: 2px;">Kondisi Tandon</div>
            </div>

            <!-- Kartu 3: Total Spray -->
            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e8e8e8; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase;"><i class="fas fa-spray-can" style="color: #6A1B9A;"></i> Aksi Spray</div>
                <div style="font-size: 16px; font-weight: bold; color: #000; margin-top: 4px;">${sprayData.length} <span style="font-size: 10px; font-weight: normal;">kali</span></div>
                <div style="font-size: 10px; color: #555; margin-top: 2px;">Riwayat Tercatat</div>
            </div>

            <!-- Kartu 4: Tanaman Hidup -->
            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e8e8e8; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase;"><i class="fas fa-seedling" style="color: #2E7D32;"></i> Tanaman</div>
                <div style="font-size: 16px; font-weight: bold; color: #000; margin-top: 4px;">${totalHidup} <span style="font-size: 10px; font-weight: normal;">Pohon</span></div>
                <div style="font-size: 10px; color: #555; margin-top: 2px;">Populasi Aktif</div>
            </div>
        `;
    }

    function loadRecentNutrisi() {
        var container = document.getElementById('dashboardRecentNutrisi');
        if (!container) return;

        var nutrisiData = safeGetData('NUTRISI');
        if (nutrisiData.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 14px; background: #fff; border-radius: 10px; border: 1px solid #e8e8e8; font-size: 12px;">Belum ada catatan nutrisi.</div>`;
            return;
        }

        nutrisiData.sort(function(a, b) { return new Date(b.date || 0) - new Date(a.date || 0); });
        var item = nutrisiData[0]; // Ambil data paling baru

        container.innerHTML = `
            <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px dashed #eee; padding-bottom: 6px;">
                    <strong style="font-size: 13px; color: #222;">${item.date || '-'} (${item.timeSlot || 'Pagi'})</strong>
                    <span style="font-size: 11px; font-weight: bold; color: #0277BD;">Cek Terakhir</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; font-weight: bold; color: #000;">
                    <div><i class="fas fa-water" style="color: #0277BD; width: 14px;"></i> PPM: <strong>${item.ppm || '-'}</strong></div>
                    <div><i class="fas fa-vial" style="color: #E65100; width: 14px;"></i> pH: <strong>${item.ph || '-'}</strong></div>
                </div>
            </div>
        `;
    }

    function loadRecentSpray() {
        var container = document.getElementById('dashboardRecentSpray');
        if (!container) return;

        var sprayData = safeGetData('SPRAY');
        if (sprayData.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 14px; background: #fff; border-radius: 10px; border: 1px solid #e8e8e8; font-size: 12px;">Belum ada riwayat spray.</div>`;
            return;
        }

        sprayData.sort(function(a, b) { return new Date(b.date || 0) - new Date(a.date || 0); });
        var item = sprayData[0]; // Ambil data paling baru
        var displayProduct = item.productBubuk || item.title || '-';

        container.innerHTML = `
            <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px dashed #eee; padding-bottom: 6px;">
                    <strong style="font-size: 13px; color: #222;">${item.date || '-'}</strong>
                    <span style="font-size: 11px; font-weight: bold; color: #6A1B9A;">${item.timeSlot || ''}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; font-weight: bold; color: #000;">
                    <div><i class="fas fa-box" style="color: #8D6E63; width: 14px;"></i> <strong>${displayProduct}</strong></div>
                    <div><i class="fas fa-shield-alt" style="color: #C2185B; width: 14px;"></i> <strong>${item.typeFungInsek || item.sprayType || '-'}</strong></div>
                </div>
            </div>
        `;
    }

    return {
        render: render,
        init: init
    };

})();
