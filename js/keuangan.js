// ==========================================
// COZYCS FARM - MODUL KEUANGAN & KAS FARM
// ==========================================

var keuangan = (function() {

    var activeFilter = 'ALL';

    function render() {
        return `
            <div class="keuangan-container" style="padding: 4px 0 30px 0;">
                
                <!-- HEADER TITLE -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <div>
                        <div style="font-size: 16px; font-weight: 800; color: #1B5E20;"><i class="fas fa-wallet" style="margin-right: 6px;"></i> Manajemen Keuangan</div>
                        <div style="font-size: 11px; color: #666;">Kelola arus kas, pemasukan, dan pengeluaran farm</div>
                    </div>
                    <span style="font-size: 10px; background: #E8F5E9; color: #2E7D32; padding: 4px 10px; border-radius: 20px; font-weight: 700;">Arus Kas Farm</span>
                </div>

                <!-- KARTU RINGKASAN KEUANGAN (3 STATISTIK UTAMA) -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px;" id="keuanganSummaryCards">
                    <!-- Dinamik diisi via JS -->
                </div>

                <!-- FORM INPUT TRANSAKSI BARU -->
                <div style="background: #fff; padding: 14px; border-radius: 14px; border: 1px solid #e8e8e8; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 13px; font-weight: 700; color: #2E7D32; margin-bottom: 10px;"><i class="fas fa-plus-circle"></i> Catat Transaksi Baru</div>
                    
                    <form id="formTransaksi" onsubmit="keuangan.simpanTransaksi(event)">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                            <div>
                                <label style="font-size: 10px; font-weight: 700; color: #555; display: block; margin-bottom: 3px;">JENIS TRANSAKSI</label>
                                <select id="trxJenis" required style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #ccc; font-size: 12px; background: #fafafa;">
                                    <option value="pemasukan">🟢 Pemasukan</option>
                                    <option value="pengeluaran">🔴 Pengeluaran</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 10px; font-weight: 700; color: #555; display: block; margin-bottom: 3px;">GREENHOUSE</label>
                                <select id="trxGh" required style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #ccc; font-size: 12px; background: #fafafa;">
                                    <option value="ALL">🌐 Seluruh Farm (Umum)</option>
                                    <option value="GH-01">🏡 GH-01</option>
                                    <option value="GH-02">🏡 GH-02</option>
                                </select>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                            <div>
                                <label style="font-size: 10px; font-weight: 700; color: #555; display: block; margin-bottom: 3px;">KATEGORI</label>
                                <select id="trxKategori" required style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #ccc; font-size: 12px; background: #fafafa;">
                                    <option value="Penjualan Melon">🍈 Penjualan Melon</option>
                                    <option value="Nutrisi & Pupuk">💧 Nutrisi & Pupuk (AB Mix)</option>
                                    <option value="Pestisida & Obat">🧪 Pestisida & Obat Hama</option>
                                    <option value="Bibit / Media">🌱 Bibit & Media Tanam</option>
                                    <option value="Operasional & Listrik">⚡ Listrik & Air Operasional</option>
                                    <option value="Perawatan Alat">🛠️ Perbaikan & Alat GH</option>
                                    <option value="Lainnya">📦 Lainnya</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 10px; font-weight: 700; color: #555; display: block; margin-bottom: 3px;">NOMINAL (RP)</label>
                                <input type="number" id="trxNominal" placeholder="Contoh: 1500000" required style="width: 100%; padding: 7px 8px; border-radius: 8px; border: 1px solid #ccc; font-size: 12px; box-sizing: border-box;">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 12px;">
                            <div>
                                <label style="font-size: 10px; font-weight: 700; color: #555; display: block; margin-bottom: 3px;">TANGGAL</label>
                                <input type="date" id="trxTanggal" required style="width: 100%; padding: 7px 8px; border-radius: 8px; border: 1px solid #ccc; font-size: 12px; box-sizing: border-box;">
                            </div>
                            <div>
                                <label style="font-size: 10px; font-weight: 700; color: #555; display: block; margin-bottom: 3px;">KETERANGAN / CATATAN</label>
                                <input type="text" id="trxKeterangan" placeholder="Contoh: Pembeli Pak Budi Grade A" style="width: 100%; padding: 7px 8px; border-radius: 8px; border: 1px solid #ccc; font-size: 12px; box-sizing: border-box;">
                            </div>
                        </div>

                        <button type="submit" style="width: 100%; background: #2E7D32; color: #fff; border: none; padding: 10px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(46,125,50,0.3);">
                            <i class="fas fa-save"></i> Simpan Transaksi Keuangan
                        </button>
                    </form>
                </div>

                <!-- FILTER TAB RIWAYAT -->
                <div style="display: flex; gap: 6px; margin-bottom: 10px; overflow-x: auto; padding-bottom: 4px;">
                    <button onclick="keuangan.filterData('ALL')" id="btnFilterAll" style="padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: bold; border: 1px solid #ccc; cursor: pointer; background: #2E7D32; color: #fff;">Semua</button>
                    <button onclick="keuangan.filterData('pemasukan')" id="btnFilterMasuk" style="padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: bold; border: 1px solid #ccc; cursor: pointer; background: #fff; color: #555;">Pemasukan</button>
                    <button onclick="keuangan.filterData('pengeluaran')" id="btnFilterKeluar" style="padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: bold; border: 1px solid #ccc; cursor: pointer; background: #fff; color: #555;">Pengeluaran</option>
                </div>

                <!-- DAFTAR RIWAYAT TRANSAKSI -->
                <div style="background: #fff; padding: 14px; border-radius: 14px; border: 1px solid #e8e8e8; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 13px; font-weight: 700; color: #333; margin-bottom: 10px;"><i class="fas fa-history" style="color: #0277BD;"></i> Riwayat Arus Kas</div>
                    <div id="listTransaksiContainer"></div>
                </div>

            </div>
        `;
    }

    function init() {
        // Set default tanggal hari ini di form
        var todayStr = new Date().toISOString().split('T')[0];
        var dateEl = document.getElementById('trxTanggal');
        if (dateEl) dateEl.value = todayStr;

        loadKeuanganData();
    }

    function getData() {
        try {
            if (typeof Storage !== 'undefined' && Storage.getAll) {
                var data = Storage.getAll('cozycs_keuangan');
                if (!data || data.length === 0) {
                    // Data Dummy Default jika masih kosong
                    data = [
                        { id: 'trx_1', jenis: 'pemasukan', kategori: 'Penjualan Melon', nominal: 14200000, tanggal: '2026-07-28', keterangan: 'Panen GH-01 ke Distributor', gh: 'GH-01' },
                        { id: 'trx_2', jenis: 'pengeluaran', kategori: 'Nutrisi & Pupuk', nominal: 1850000, tanggal: '2026-07-29', keterangan: 'Restock AB Mix & Kalsium', gh: 'ALL' },
                        { id: 'trx_3', jenis: 'pengeluaran', kategori: 'Pestisida & Obat', nominal: 650000, tanggal: '2026-08-01', keterangan: 'Fungisida & Insektisida Thrips', gh: 'GH-02' }
                    ];
                    Storage.saveAll('cozycs_keuangan', data);
                }
                return data;
            }
        } catch(e) {}
        return [];
    }

    function loadKeuanganData() {
        var data = getData();
        renderSummary(data);
        renderList(data);
    }

    function renderSummary(data) {
        var el = document.getElementById('keuanganSummaryCards');
        if (!el) return;

        var totalMasuk = 0;
        var totalKeluar = 0;

        data.forEach(function(item) {
            var val = parseFloat(item.nominal) || 0;
            if (item.jenis === 'pemasukan') totalMasuk += val;
            if (item.jenis === 'pengeluaran') totalKeluar += val;
        });

        var labaBersih = totalMasuk - totalKeluar;

        var formatRp = function(val) {
            return 'Rp' + val.toLocaleString('id-ID');
        };

        el.innerHTML = `
            <div style="background: #E8F5E9; padding: 10px; border-radius: 12px; border: 1px solid #C8E6C9;">
                <div style="font-size: 9px; font-weight: 700; color: #2E7D32; text-transform: uppercase;">Pemasukan</div>
                <div style="font-size: 13px; font-weight: 800; color: #1B5E20; margin-top: 4px;">${formatRp(totalMasuk)}</div>
            </div>
            <div style="background: #FFEBEE; padding: 10px; border-radius: 12px; border: 1px solid #FFCDD2;">
                <div style="font-size: 9px; font-weight: 700; color: #C62828; text-transform: uppercase;">Pengeluaran</div>
                <div style="font-size: 13px; font-weight: 800; color: #B71C1C; margin-top: 4px;">${formatRp(totalKeluar)}</div>
            </div>
            <div style="background: #E1F5FE; padding: 10px; border-radius: 12px; border: 1px solid #B3E5FC;">
                <div style="font-size: 9px; font-weight: 700; color: #0277BD; text-transform: uppercase;">Laba Bersih</div>
                <div style="font-size: 13px; font-weight: 800; color: ${labaBersih >= 0 ? '#01579B' : '#C62828'}; margin-top: 4px;">${formatRp(labaBersih)}</div>
            </div>
        `;
    }

    function renderList(data) {
        var el = document.getElementById('listTransaksiContainer');
        if (!el) return;

        var filtered = data.filter(function(item) {
            if (activeFilter === 'ALL') return true;
            return item.jenis === activeFilter;
        });

        if (filtered.length === 0) {
            el.innerHTML = `<div style="text-align: center; color: #888; font-size: 12px; padding: 20px;">Belum ada catatan transaksi keuangan.</div>`;
            return;
        }

        // Urutkan dari tanggal terbaru
        filtered.sort(function(a, b) {
            return new Date(b.tanggal) - new Date(a.tanggal);
        });

        var html = '';
        filtered.forEach(function(item) {
            var isMasuk = item.jenis === 'pemasukan';
            var warnaNominal = isMasuk ? '#2E7D32' : '#C62828';
            var tandaNominal = isMasuk ? '+ Rp' : '- Rp';
            var nominalFormatted = parseFloat(item.nominal || 0).toLocaleString('id-ID');

            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dashed #eee;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${isMasuk ? '#E8F5E9' : '#FFEBEE'}; color: ${isMasuk ? '#2E7D32' : '#C62828'};">
                                ${item.kategori}
                            </span>
                            <span style="font-size: 10px; color: #888; background: #f0f0f0; padding: 2px 6px; border-radius: 4px;">${item.gh}</span>
                        </div>
                        <div style="font-size: 12px; font-weight: 600; color: #333; margin-top: 4px;">${item.keterangan || '-'}</div>
                        <div style="font-size: 10px; color: #777; margin-top: 2px;"><i class="fas fa-calendar-alt"></i> ${item.tanggal}</div>
                    </div>

                    <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                        <div style="font-size: 13px; font-weight: 800; color: ${warnaNominal};">
                            ${tandaNominal}${nominalFormatted}
                        </div>
                        <button onclick="keuangan.hapusTransaksi('${item.id}')" title="Hapus" style="background: none; border: none; color: #ccc; cursor: pointer; font-size: 12px; padding: 2px;">
                            <i class="fas fa-trash-alt" onmouseover="this.style.color='#C62828'" onmouseout="this.style.color='#ccc'"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        el.innerHTML = html;
    }

    function simpanTransaksi(e) {
        e.preventDefault();

        var jenis = document.getElementById('trxJenis').value;
        var gh = document.getElementById('trxGh').value;
        var kategori = document.getElementById('trxKategori').value;
        var nominal = parseFloat(document.getElementById('trxNominal').value) || 0;
        var tanggal = document.getElementById('trxTanggal').value;
        var keterangan = document.getElementById('trxKeterangan').value;

        var data = getData();
        var newTrx = {
            id: 'trx_' + Date.now(),
            jenis: jenis,
            gh: gh,
            kategori: kategori,
            nominal: nominal,
            tanggal: tanggal,
            keterangan: keterangan
        };

        data.push(newTrx);

        if (typeof Storage !== 'undefined' && Storage.saveAll) {
            Storage.saveAll('cozycs_keuangan', data);
        }

        // Reset Form Nominal & Ket
        document.getElementById('trxNominal').value = '';
        document.getElementById('trxKeterangan').value = '';

        loadKeuanganData();

        if (typeof showToast === 'function') {
            showToast('Transaksi berhasil disimpan!');
        }
    }

    function hapusTransaksi(id) {
        if (confirm('Yakin ingin menghapus catatan transaksi ini?')) {
            var data = getData();
            data = data.filter(function(item) { return item.id !== id; });

            if (typeof Storage !== 'undefined' && Storage.saveAll) {
                Storage.saveAll('cozycs_keuangan', data);
            }

            loadKeuanganData();
            if (typeof showToast === 'function') {
                showToast('Transaksi dihapus.');
            }
        }
    }

    function filterData(tipe) {
        activeFilter = tipe;
        
        var btnAll = document.getElementById('btnFilterAll');
        var btnMasuk = document.getElementById('btnFilterMasuk');
        var btnKeluar = document.getElementById('btnFilterKeluar');

        if (btnAll && btnMasuk && btnKeluar) {
            btnAll.style.background = tipe === 'ALL' ? '#2E7D32' : '#fff';
            btnAll.style.color = tipe === 'ALL' ? '#fff' : '#555';

            btnMasuk.style.background = tipe === 'pemasukan' ? '#2E7D32' : '#fff';
            btnMasuk.style.color = tipe === 'pemasukan' ? '#fff' : '#555';

            btnKeluar.style.background = tipe === 'pengeluaran' ? '#2E7D32' : '#fff';
            btnKeluar.style.color = tipe === 'pengeluaran' ? '#fff' : '#555';
        }

        loadKeuanganData();
    }

    return {
        render: render,
        init: init,
        simpanTransaksi: simpanTransaksi,
        hapusTransaksi: hapusTransaksi,
        filterData: filterData
    };

})();
