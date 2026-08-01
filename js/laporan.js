// ==========================================
// COZYCS FARM - MODUL LAPORAN & EVALUASI FARM
// ==========================================

var laporan = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-file-invoice" style="color: #00695C;"></i> Laporan & Evaluasi Farm</div>
                <div style="font-size: 13px; color: #666; margin-bottom: 16px;">
                    Pusat rekapitulasi seluruh aktivitas operasional musim ini. Pilih kategori untuk mengunduh laporan terpisah dalam format spreadsheet Excel/CSV.
                </div>

                <!-- Kartu Statistik Ringkasan Musim Ini -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px;">
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

                <!-- Tombol Unduh Per Kategori Spreadsheet -->
                <div class="section-title"><i class="fas fa-download" style="color: #00695C;"></i> Unduh Laporan Terpisah (Excel / CSV)</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px;">
                    <button id="btnExportSpray" class="btn" style="background: #F3E5F5; color: #6A1B9A; border: 1px solid #d1c4e9; font-weight: 600; font-size: 12px; padding: 10px; border-radius: 8px; cursor: pointer;"><i class="fas fa-file-excel"></i> Laporan Spray</button>
                    <button id="btnExportNutrisi" class="btn" style="background: #E1F5FE; color: #0277BD; border: 1px solid #b3e5fc; font-weight: 600; font-size: 12px; padding: 10px; border-radius: 8px; cursor: pointer;"><i class="fas fa-file-excel"></i> Laporan Nutrisi</button>
                    <button id="btnExportPanen" class="btn" style="background: #E8F5E9; color: #1B5E20; border: 1px solid #c8e6c9; font-weight: 600; font-size: 12px; padding: 10px; border-radius: 8px; cursor: pointer;"><i class="fas fa-file-excel"></i> Laporan Panen</button>
                    <button id="btnExportJadwal" class="btn" style="background: #FFF3E0; color: #EF6C00; border: 1px solid #ffe0b2; font-weight: 600; font-size: 12px; padding: 10px; border-radius: 8px; cursor: pointer;"><i class="fas fa-file-excel"></i> Laporan Jadwal</button>
                </div>

                <!-- Tombol Reset Data -->
                <div style="margin-bottom: 20px;">
                    <button id="btnClearAllData" style="width: 100%; background: #FFEBEE; color: #C62828; border: 1px solid #ffcdd2; padding: 10px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;"><i class="fas fa-trash-alt"></i> Reset Seluruh Data Farm</button>
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

        // Event listener unduh per kategori
        var btnSpray = document.getElementById('btnExportSpray');
        if (btnSpray) btnSpray.addEventListener('click', function() { exportCategory('spray'); });

        var btnNutrisi = document.getElementById('btnExportNutrisi');
        if (btnNutrisi) btnNutrisi.addEventListener('click', function() { exportCategory('nutrisi'); });

        var btnPanen = document.getElementById('btnExportPanen');
        if (btnPanen) btnPanen.addEventListener('click', function() { exportCategory('panen'); });

        var btnJadwal = document.getElementById('btnExportJadwal');
        if (btnJadwal) btnJadwal.addEventListener('click', function() { exportCategory('jadwal'); });

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

    function exportCategory(type) {
        var csvContent = "data:text/csv;charset=utf-8,";
        var filename = "cozycs_farm_laporan_" + type + "_" + new Date().toISOString().slice(0,10) + ".csv";
        var data = [];

        if (type === 'spray') {
            csvContent += "Tanggal,Waktu,Produk Pestisida,Dosis,Sasaran Hama,Catatan\r\n";
            data = Storage.getAll(Storage.KEYS.SPRAY);
            data.forEach(function(item) {
                var row = [item.date || "", item.timeSlot || "", `"${item.title || ''}"`, `"${item.dose || ''}"`, `"${item.target || ''}"`, `"${item.desc || ''}"`];
                csvContent += row.join(",") + "\r\n";
            });
        } else if (type === 'nutrisi') {
            csvContent += "Tanggal,PPM,pH,Kondisi Tandon,Catatan\r\n";
            data = Storage.getAll(Storage.KEYS.NUTRISI);
            data.forEach(function(item) {
                var row = [item.date || "", item.ppm || "", item.ph || "", `"${item.tandon || ''}"`, `"${item.desc || ''}"`];
                csvContent += row.join(",") + "\r\n";
            });
        } else if (type === 'panen') {
            csvContent += "Tanggal,Nomor Tanaman / Greenhouse,Berat (Kg),Jumlah Buah,Kualitas,Catatan\r\n";
            data = Storage.getAll(Storage.KEYS.PANEN);
            data.forEach(function(item) {
                var row = [item.date || item.tanggal || "", `"${item.tanaman || item.gh || ''}"`, item.berat || item.jumlah || "", item.pcs || 1, `"${item.kualitas || 'Grade A'}"`, `"${item.desc || ''}"`];
                csvContent += row.join(",") + "\r\n";
            });
        } else if (type === 'jadwal') {
            csvContent += "Tanggal,Judul Agenda,Keterangan\r\n";
            data = Storage.getAll(Storage.KEYS.JADWAL);
            data.forEach(function(item) {
                var row = [item.date || "", `"${item.title || ''}"`, `"${item.desc || ''}"`];
                csvContent += row.join(",") + "\r\n";
            });
        }

        if (data.length === 0) {
            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast('Belum ada data untuk kategori ' + type, 'error');
            }
            return;
        }

        var encodedUri = encodeURI(csvContent);
        var downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", encodedUri);
        downloadAnchor.setAttribute("download", filename);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
            Helper.showToast('Laporan ' + type + ' berhasil diunduh!', 'success');
        }
    }

    return {
        render: render,
        init: init
    };

})();
