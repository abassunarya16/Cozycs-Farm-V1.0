// ==========================================
// COZYCS FARM - MODUL KEUANGAN & KAS FARM
// (FULL BILINGUAL & DARK MODE SUPPORT)
// ==========================================

var keuangan = (function() {

    var activeFilter = 'ALL';

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Manajemen Keuangan',
            'module_subtitle': 'Kelola arus kas, pemasukan, dan pengeluaran farm',
            'badge_cash_flow': 'Arus Kas Farm',
            'card_income': 'Pemasukan',
            'card_expense': 'Pengeluaran',
            'card_net_profit': 'Laba Bersih',
            'form_title': 'Catat Transaksi Baru',
            'lbl_trx_type': 'JENIS TRANSAKSI',
            'opt_income': '🟢 Pemasukan',
            'opt_expense': '🔴 Pengeluaran',
            'lbl_gh': 'GREENHOUSE',
            'opt_all_farm': '🌐 Seluruh Farm (Umum)',
            'lbl_category': 'KATEGORI',
            'opt_cat_sales': '🍈 Penjualan Melon',
            'opt_cat_nutrition': '💧 Nutrisi & Pupuk (AB Mix)',
            'opt_cat_pesticide': '🧪 Pestisida & Obat Hama',
            'opt_cat_seeds': '🌱 Bibit & Media Tanam',
            'opt_cat_operational': '⚡ Listrik & Air Operasional',
            'opt_cat_tools': '🛠️ Perbaikan & Alat GH',
            'opt_cat_others': '📦 Lainnya',
            'lbl_nominal': 'NOMINAL (RP)',
            'ph_nominal': 'Contoh: 1500000',
            'lbl_date': 'TANGGAL',
            'lbl_notes': 'KETERANGAN / CATATAN',
            'ph_notes': 'Contoh: Pembeli Pak Budi Grade A',
            'btn_save': 'Simpan Transaksi Keuangan',
            'filter_all': 'Semua',
            'filter_income': 'Pemasukan',
            'filter_expense': 'Pengeluaran',
            'recap_title': 'Riwayat Arus Kas',
            'no_data': 'Belum ada catatan transaksi keuangan.',
            'confirm_delete': 'Yakin ingin menghapus catatan transaksi ini?',
            'toast_saved': 'Transaksi berhasil disimpan!',
            'toast_deleted': 'Transaksi dihapus.'
        },
        'en': {
            'module_title': 'Financial Management',
            'module_subtitle': 'Manage farm cash flow, income, and expenses',
            'badge_cash_flow': 'Farm Cash Flow',
            'card_income': 'Income',
            'card_expense': 'Expenses',
            'card_net_profit': 'Net Profit',
            'form_title': 'Record New Transaction',
            'lbl_trx_type': 'TRANSACTION TYPE',
            'opt_income': '🟢 Income',
            'opt_expense': '🔴 Expense',
            'lbl_gh': 'GREENHOUSE',
            'opt_all_farm': '🌐 Entire Farm (General)',
            'lbl_category': 'CATEGORY',
            'opt_cat_sales': '🍈 Melon Sales',
            'opt_cat_nutrition': '💧 Nutrition & Fertilizer (AB Mix)',
            'opt_cat_pesticide': '🧪 Pesticides & Pest Control',
            'opt_cat_seeds': '🌱 Seeds & Growing Media',
            'opt_cat_operational': '⚡ Electricity & Water Operations',
            'opt_cat_tools': '🛠️ GH Repairs & Equipment',
            'opt_cat_others': '📦 Others',
            'lbl_nominal': 'AMOUNT (RP)',
            'ph_nominal': 'e.g., 1500000',
            'lbl_date': 'DATE',
            'lbl_notes': 'DESCRIPTION / NOTES',
            'ph_notes': 'e.g., Buyer Mr. Budi Grade A',
            'btn_save': 'Save Financial Transaction',
            'filter_all': 'All',
            'filter_income': 'Income',
            'filter_expense': 'Expenses',
            'recap_title': 'Cash Flow History',
            'no_data': 'No financial transaction records found.',
            'confirm_delete': 'Are you sure you want to delete this transaction record?',
            'toast_saved': 'Transaction saved successfully!',
            'toast_deleted': 'Transaction deleted.'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function render() {
        return `
            <div class="keuangan-container" style="padding: 4px 0 30px 0;">
                
                <!-- HEADER TITLE -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <div>
                        <div style="font-size: 16px; font-weight: 800; color: #1B5E20;"><i class="fas fa-wallet" style="margin-right: 6px;"></i> ${t('module_title')}</div>
                        <div style="font-size: 11px; color: #888;">${t('module_subtitle')}</div>
                    </div>
                    <span style="font-size: 10px; background: #E8F5E9; color: #2E7D32; padding: 4px 10px; border-radius: 20px; font-weight: 700;">${t('badge_cash_flow')}</span>
                </div>

                <!-- KARTU RINGKASAN KEUANGAN (3 STATISTIK UTAMA) -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px;" id="keuanganSummaryCards">
                    <!-- Dinamik diisi via JS -->
                </div>

                <!-- FORM INPUT TRANSAKSI BARU -->
                <div style="background: var(--card-bg, #fff); padding: 14px; border-radius: 14px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 16px;">
                    <div style="font-size: 13px; font-weight: 700; color: #2E7D32; margin-bottom: 10px;"><i class="fas fa-plus-circle"></i> ${t('form_title')}</div>
                    
                    <form id="formTransaksi" onsubmit="keuangan.simpanTransaksi(event)">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                            <div>
                                <label style="font-size: 10px; font-weight: 700; color: #555; display: block; margin-bottom: 3px;">${t('lbl_trx_type')}</label>
                                <select id="trxJenis" required style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 12px; background: var(--card-bg, #fafafa); color: var(--text-color, #333);">
                                    <option value="pemasukan">${t('opt_income')}</option>
                                    <option value="pengeluaran">${t('opt_expense')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 10px; font-weight: 700; color: #555; display: block; margin-bottom: 3px;">${t('lbl_gh')}</label>
                                <select id="trxGh" required style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 12px; background: var(--card-bg, #fafafa); color: var(--text-color, #333);">
                                    <option value="ALL">${t('opt_all_farm')}</option>
                                    <option value="GH-01">🏡 GH-01</option>
                                    <option value="GH-02">🏡 GH-02</option>
                                </select>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                            <div>
                                <label style="font-size: 10px; font-weight: 700; color: #555; display: block; margin-bottom: 3px;">${t('lbl_category')}</label>
                                <select id="trxKategori" required style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 12px; background: var(--card-bg, #fafafa); color: var(--text-color, #333);">
                                    <option value="Penjualan Melon">${t('opt_cat_sales')}</option>
                                    <option value="Nutrisi & Pupuk">${t('opt_cat_nutrition')}</option>
                                    <option value="Pestisida & Obat">${t('opt_cat_pesticide')}</option>
                                    <option value="Bibit / Media">${t('opt_cat_seeds')}</option>
                                    <option value="Operasional & Listrik">${t('opt_cat_operational')}</option>
                                    <option value="Perawatan Alat">${t('opt_cat_tools')}</option>
                                    <option value="Lainnya">${t('opt_cat_others')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 10px; font-weight: 700; color: #555; display: block; margin-bottom: 3px;">${t('lbl_nominal')}</label>
                                <input type="number" id="trxNominal" placeholder="${t('ph_nominal')}" required style="width: 100%; padding: 7px 8px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 12px; box-sizing: border-box;">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 12px;">
                            <div>
                                <label style="font-size: 10px; font-weight: 700; color: #555; display: block; margin-bottom: 3px;">${t('lbl_date')}</label>
                                <input type="date" id="trxTanggal" required style="width: 100%; padding: 7px 8px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 12px; box-sizing: border-box;">
                            </div>
                            <div>
                                <label style="font-size: 10px; font-weight: 700; color: #555; display: block; margin-bottom: 3px;">${t('lbl_notes')}</label>
                                <input type="text" id="trxKeterangan" placeholder="${t('ph_notes')}" style="width: 100%; padding: 7px 8px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 12px; box-sizing: border-box;">
                            </div>
                        </div>

                        <button type="submit" style="width: 100%; background: #2E7D32; color: #fff; border: none; padding: 10px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(46,125,50,0.3);">
                            <i class="fas fa-save"></i> ${t('btn_save')}
                        </button>
                    </form>
                </div>

                <!-- FILTER TAB RIWAYAT -->
                <div style="display: flex; gap: 6px; margin-bottom: 10px; overflow-x: auto; padding-bottom: 4px;">
                    <button onclick="keuangan.filterData('ALL')" id="btnFilterAll" style="padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: bold; border: 1px solid var(--border-color, #ccc); cursor: pointer; background: #2E7D32; color: #fff;">${t('filter_all')}</button>
                    <button onclick="keuangan.filterData('pemasukan')" id="btnFilterMasuk" style="padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: bold; border: 1px solid var(--border-color, #ccc); cursor: pointer; background: var(--card-bg, #fff); color: var(--text-color, #555);">${t('filter_income')}</button>
                    <button onclick="keuangan.filterData('pengeluaran')" id="btnFilterKeluar" style="padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: bold; border: 1px solid var(--border-color, #ccc); cursor: pointer; background: var(--card-bg, #fff); color: var(--text-color, #555);">${t('filter_expense')}</button>
                </div>

                <!-- DAFTAR RIWAYAT TRANSAKSI -->
                <div style="background: var(--card-bg, #fff); padding: 14px; border-radius: 14px; border: 1px solid var(--border-color, #e8e8e8);">
                    <div style="font-size: 13px; font-weight: 700; color: var(--text-color, #333); margin-bottom: 10px;"><i class="fas fa-history" style="color: #0277BD;"></i> ${t('recap_title')}</div>
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
                <div style="font-size: 9px; font-weight: 700; color: #2E7D32; text-transform: uppercase;">${t('card_income')}</div>
                <div style="font-size: 13px; font-weight: 800; color: #1B5E20; margin-top: 4px;">${formatRp(totalMasuk)}</div>
            </div>
            <div style="background: #FFEBEE; padding: 10px; border-radius: 12px; border: 1px solid #FFCDD2;">
                <div style="font-size: 9px; font-weight: 700; color: #C62828; text-transform: uppercase;">${t('card_expense')}</div>
                <div style="font-size: 13px; font-weight: 800; color: #B71C1C; margin-top: 4px;">${formatRp(totalKeluar)}</div>
            </div>
            <div style="background: #E1F5FE; padding: 10px; border-radius: 12px; border: 1px solid #B3E5FC;">
                <div style="font-size: 9px; font-weight: 700; color: #0277BD; text-transform: uppercase;">${t('card_net_profit')}</div>
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
            el.innerHTML = `<div style="text-align: center; color: #888; font-size: 12px; padding: 20px;">${t('no_data')}</div>`;
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
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dashed var(--border-color, #eee);">
                    <div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${isMasuk ? '#E8F5E9' : '#FFEBEE'}; color: ${isMasuk ? '#2E7D32' : '#C62828'};">
                                ${item.kategori}
                            </span>
                            <span style="font-size: 10px; color: #888; background: var(--inner-card-bg, #f0f0f0); padding: 2px 6px; border-radius: 4px;">${item.gh}</span>
                        </div>
                        <div style="font-size: 12px; font-weight: 600; color: var(--text-color, #333); margin-top: 4px;">${item.keterangan || '-'}</div>
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

        if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
            Helper.showToast(t('toast_saved'), 'success');
        } else if (typeof showToast === 'function') {
            showToast(t('toast_saved'));
        }
    }

    function hapusTransaksi(id) {
        if (confirm(t('confirm_delete'))) {
            var data = getData();
            data = data.filter(function(item) { return item.id !== id; });

            if (typeof Storage !== 'undefined' && Storage.saveAll) {
                Storage.saveAll('cozycs_keuangan', data);
            }

            loadKeuanganData();
            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast(t('toast_deleted'), 'error');
            } else if (typeof showToast === 'function') {
                showToast(t('toast_deleted'));
            }
        }
    }

    function filterData(tipe) {
        activeFilter = tipe;
        
        var btnAll = document.getElementById('btnFilterAll');
        var btnMasuk = document.getElementById('btnFilterMasuk');
        var btnKeluar = document.getElementById('btnFilterKeluar');

        if (btnAll && btnMasuk && btnKeluar) {
            btnAll.style.background = tipe === 'ALL' ? '#2E7D32' : 'var(--card-bg, #fff)';
            btnAll.style.color = tipe === 'ALL' ? '#fff' : 'var(--text-color, #555)';

            btnMasuk.style.background = tipe === 'pemasukan' ? '#2E7D32' : 'var(--card-bg, #fff)';
            btnMasuk.style.color = tipe === 'pemasukan' ? '#fff' : 'var(--text-color, #555)';

            btnKeluar.style.background = tipe === 'pengeluaran' ? '#2E7D32' : 'var(--card-bg, #fff)';
            btnKeluar.style.color = tipe === 'pengeluaran' ? '#fff' : 'var(--text-color, #555)';
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

window.keuangan = keuangan;
