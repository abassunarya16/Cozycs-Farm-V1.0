// ==========================================
// COZYCS FARM - MODUL LAPORAN & EVALUASI FARM
// ==========================================

var laporan = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-file-invoice" style="color: #00695C;"></i> Laporan & Evaluasi Farm</div>
                <div style="font-size: 13px; color: #666; margin-bottom: 16px;">
                    Pusat rekapitulasi seluruh aktivitas operasional musim ini untuk bahan evaluasi mingguan dan bulanan.
                </div>

                <!-- Kartu Statistik Ringkasan Musim Ini -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                    <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                        <div style="font-size: 11px; color: #777; font-weight: 600; text-transform: uppercase;">Total Aksi Spray</div>
                        <div style="font-size: 20px; font-weight: 700; color: #6A1B9A; margin-top: 4px;" id="statTotalSpray">0</div>
                    </div>
                    <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                        <div style="font-size: 11px; color: #777; font-weight: 600; text-transform: uppercase;">Total Agenda / Jadwal</div>
                        <div style="font-size: 20px; font-weight: 700; color: #EF6C00; margin-top: 4px;" id="statTotalJadwal">0</div>
                    </div>
                    <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                        <div style="font-size: 11px; color: #777; font-weight: 600; text-transform: uppercase;">Total Catatan Panen</div>
                        <div style="font-size: 20px; font-weight: 700; color: #1B5E20; margin-top: 4px;" id="statTotalPanen">0</div>
                    </div>
                    <div style="background: #fff; padding: 14px; border-radius: 12px; border: 1px solid #e8e8e8; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                        <div style="font-size: 11px; color: #777; font-weight: 600; text-transform: uppercase;">Total Log Aktivitas</div>
                        <div style="font-size: 20px; font-weight: 700; color: #0277BD; margin-top: 4px;" id="statTotalLog">0</div>
                    </div>
                </div>

                <!-- Tombol Aksi Laporan / Ekspor Spreadsheet -->
                <div style="display: flex; gap: 8px; margin-bottom: 20px;">
                    <button id="btnExportData" class="btn btn-primary" style="flex: 1; background: #00695C;"><i class="fas fa-file-excel"></i> Unduh Rekap (Excel / CSV)</button>
                    <button id="btnClearAllData" style="background: #FFEBEE; color: #C62828; border: 1px solid #ffcdd2; padding: 0 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;"><i class="fas fa-trash-alt"></i> Reset Data</button>
                </div>

                <!-- Tabel Rekapitulasi Gabungan Aktivitas -->
                <div class="section-title"><i class="fas fa-list-alt" style="color: #00695C;"></i> Rekapitulasi Aktivitas Farm</div>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Kategori</th>
                                <th>Tanggal</th>
                                <th>Detail Kegiatan / Catatan</th>
                            </tr>
                        </thead>
                        <tbody id="tableLaporanBody">
                            <!-- Diisi dinamis oleh JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        loadReportData();

        var btnExport = document.getElementById('btnExportData');
        if (btnExport) {
            btnExport.addEventListener('click', function() {
                exportDataCSV();
            });
        }

        var btnReset = document.getElementById('btnClearAllData');
        if (btnReset) {
            btnReset.addEventListener('click', function() {
                if (confirm('PERINGATAN: Apakah kamu yakin ingin menghapus seluruh data rekam jejak farm? Tindakan ini tidak dapat dibatalkan!')) {
                    localStorage.clear();
                    Storage.init();
                    loadReportData();
                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast('Seluruh data berhasil direset.', 'error');
                    }
                }
            });
        }
    }

    function loadReportData() {
        var sprayData = Storage.getAll(Storage.KEYS.SPRAY);
        var jadwalData = Storage.getAll(Storage.KEYS.JADWAL);
        var panenData = Storage.getAll(Storage.KEYS.PANEN);
        var nutrisiData = Storage.getAll(Storage.KEYS.NUTRISI);
        var pruningData = Storage.getAll(Storage.KEYS.PRUNING);
        var polinasiData = Storage.getAll(Storage.KEYS.POLINASI);

        // Update Statistik Angka
        document.getElementById('statTotalSpray').innerText = sprayData.length;
        document.getElementById('statTotalJadwal').innerText = jadwalData.length;
        document.getElementById('statTotalPanen').innerText = panenData.length;
        
        var totalLog = sprayData.length + jadwalData.length + panenData.length + nutrisiData.length + pruningData.length + polinasiData.length;
        document.getElementById('statTotalLog').innerText = totalLog;

        var tbody = document.getElementById('tableLaporanBody');
        if (!tbody) return;

        // Gabungkan semua aktivitas dengan label kategorinya
        var combined = [];
        
        sprayData.forEach(function(item) {
            combined.push({
                category: 'Spray',
                color: '#6A1B9A',
                date: item.date || '-',
                info: `Produk: <strong>${item.title}</strong> (Dosis: ${item.dose || '-'}) - Sasaran: ${item.target || '-'}`
            });
        });

        jadwalData.forEach(function(item) {
            combined.push({
                category: 'Jadwal',
                color: '#EF6C00',
                date: item.date || '-',
                info: `Agenda: <strong>${item.title}</strong> - ${item.desc || '-'}`
            });
        });

        panenData.forEach(function(item) {
            combined.push({
                category: 'Panen',
                color: '#1B5E20',
                date: item.date || item.tanggal || '-',
                info: `Panen Melon: ${item.berat || item.jumlah || 'Sukses'} kg`
            });
        });

        nutrisiData.forEach(function(item) {
            combined.push({
                category: 'Nutrisi',
                color: '#0277BD',
                date: item.date || '-',
                info: `PPM: ${item.ppm || '-'} | Tandon: ${item.tandon || 'Stabil'}`
            });
        });

        // Urutkan berdasarkan tanggal terbaru (descending)
        combined.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        if (combined.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #777; padding: 20px;">Belum ada rekam jejak aktivitas tercatat.</td></tr>`;
            return;
        }

        var html = '';
        combined.forEach(function(row) {
            html += `
                <tr>
                    <td><span style="background: ${row.color}15; color: ${row.color}; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">${row.category}</span></td>
                    <td><strong>${row.date}</strong></td>
                    <td style="font-size: 12px; color: #333; line-height: 1.4;">${row.info}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    function exportDataCSV() {
        var sprayData = Storage.getAll(Storage.KEYS.SPRAY);
        var jadwalData = Storage.getAll(Storage.KEYS.JADWAL);
        var panenData = Storage.getAll(Storage.KEYS.PANEN);

        var csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Kategori,Tanggal,Detail Kegiatan / Produk,Dosis / Keterangan\r\n";

        sprayData.forEach(function(item) {
            var row = ["Spray", item.date || "", `"${item.title || ''}"`, `"${item.dose || ''} (Sasaran: ${item.target || ''})"`];
            csvContent += row.join(",") + "\r\n";
        });

        jadwalData.forEach(function(item) {
            var row = ["Jadwal", item.date || "", `"${item.title || ''}"`, `"${item.desc || ''}"`];
            csvContent += row.join(",") + "\r\n";
        });

        panenData.forEach(function(item) {
            var row = ["Panen", item.date || item.tanggal || "", "Panen Melon", `"${item.berat || item.jumlah || ''} kg"`];
            csvContent += row.join(",") + "\r\n";
        });

        var encodedUri = encodeURI(csvContent);
        var downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", encodedUri);
        downloadAnchor.setAttribute("download", "cozycs_farm_rekap_" + new Date().toISOString().slice(0,10) + ".csv");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
            Helper.showToast('Rekap spreadsheet Excel berhasil diunduh!', 'success');
        }
    }

    return {
        render: render,
        init: init
    };

})();
