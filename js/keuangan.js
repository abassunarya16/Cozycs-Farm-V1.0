// ==========================================
// COZYCS FARM - MODUL KEUANGAN (ENHANCED WITH SEARCH, PAGINATION & AUTO-GH)
// ==========================================

var keuangan = (function() {

    // KEY STORAGE
    var KEY_KEUANGAN = 'cozycs_keuangan';
    var KEY_SEEDED = 'cozycs_keuangan_init_done';

    // VARIABEL STATE UNTUK SEARCH, FILTER & PAGINASI
    var searchQuery = '';
    var filterJenis = 'semua'; // 'semua', 'Pemasukan', 'Pengeluaran'
    var currentPage = 1;
    var itemsPerPage = 15;

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Pencatatan Keuangan & Arus Kas',
            'stat_balance': 'SALDO SAAT INI',
            'stat_income': 'TOTAL PEMASUKAN',
            'stat_expense': 'TOTAL PENGELUARAN',
            'stat_profit': 'ESTIMASI LABA BERSIH',
            'form_title_add': 'Catat Transaksi Keuangan',
            'form_title_edit': 'Edit Transaksi Keuangan',
            'lbl_date': 'Tanggal Transaksi',
            'lbl_type': 'Jenis Transaksi',
            'opt_income': 'Pemasukan (Income)',
            'opt_expense': 'Pengeluaran (Expense)',
            'lbl_category': 'Kategori Transaksi',
            'opt_cat_melon_sales': 'Penjualan Melon',
            'opt_cat_veggie_sales': 'Penjualan Sayur / Lainnya',
            'opt_cat_nutrisi': 'Pembelian Nutrisi / Pupuk',
            'opt_cat_pestisida': 'Pembelian Pestisida / Obatan',
            'opt_cat_alat': 'Peralatan & Sparepart GH',
            'opt_cat_operasional': 'Operasional & Listrik',
            'opt_cat_gaji': 'Gaji / Tenaga Kerja',
            'opt_cat_lainnya': 'Lain-Lain',
            'lbl_nominal': 'Nominal (Rp)',
            'ph_nominal': 'Contoh: 1500000',
            'lbl_gh': 'Lokasi / GH Terkait',
            'opt_all_gh': 'Seluruh Kebun / Umum',
            'lbl_petugas': 'Penanggung Jawab',
            'ph_petugas': 'Contoh: Abas / Admin',
            'default_petugas': 'Admin',
            'lbl_desc': 'Keterangan / Catatan',
            'ph_desc': 'Detail transaksi, nota, nama pembeli...',
            'btn_save': 'Simpan Transaksi',
            'btn_cancel': 'Batal',
            'recap_title': 'Riwayat Transaksi Keuangan',
            'no_data': 'Belum ada riwayat transaksi keuangan.',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Transaksi keuangan berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus transaksi ini?',
            'toast_deleted': 'Transaksi berhasil dihapus',
            'ph_search': 'Cari kategori, catatan, petugas...',
            'btn_prev': 'Sebelumnya',
            'btn_next': 'Selanjutnya',
            'page_lbl': 'Halaman'
        },
        'en': {
            'module_title': 'Financial Records & Cash Flow',
            'stat_balance': 'CURRENT BALANCE',
            'stat_income': 'TOTAL INCOME',
            'stat_expense': 'TOTAL EXPENSE',
            'stat_profit': 'EST. NET PROFIT',
            'form_title_add': 'Record Financial Transaction',
            'form_title_edit': 'Edit Financial Transaction',
            'lbl_date': 'Transaction Date',
            'lbl_type': 'Transaction Type',
            'opt_income': 'Income',
            'opt_expense': 'Expense',
            'lbl_category': 'Category',
            'opt_cat_melon_sales': 'Melon Sales',
            'opt_cat_veggie_sales': 'Vegetable / Other Sales',
            'opt_cat_nutrisi': 'Nutrients / Fertilizer Purchase',
            'opt_cat_pestisida': 'Pesticide Purchase',
            'opt_cat_alat': 'GH Tools & Spare Parts',
            'opt_cat_operasional': 'Operational & Electricity',
            'opt_cat_gaji': 'Salary / Labor',
            'opt_cat_lainnya': 'Others',
            'lbl_nominal': 'Amount (Rp)',
            'ph_nominal': 'e.g., 1500000',
            'lbl_gh': 'Related GH / Location',
            'opt_all_gh': 'Entire Farm / General',
            'lbl_petugas': 'Person in Charge',
            'ph_petugas': 'e.g., Abas / Admin',
            'default_petugas': 'Admin',
            'lbl_desc': 'Description / Notes',
            'ph_desc': 'Transaction details, invoice, buyer name...',
            'btn_save': 'Save Transaction',
            'btn_cancel': 'Cancel',
            'recap_title': 'Transaction History',
            'no_data': 'No financial transaction history found.',
            'lbl_notes': 'Notes',
            'toast_saved': 'Transaction saved successfully!',
            'confirm_delete': 'Are you sure you want to delete this transaction?',
            'toast_deleted': 'Transaction deleted successfully',
            'ph_search': 'Search category, notes, PIC...',
            'btn_prev': 'Previous',
            'btn_next': 'Next',
            'page_lbl': 'Page'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function getKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.KEUANGAN) {
            return Storage.KEYS.KEUANGAN;
        }
        return KEY_KEUANGAN;
    }

    function getData(key) {
        try {
            if (typeof Storage !== 'undefined' && typeof Storage.getAll === 'function') {
                var res = Storage.getAll(key);
                if (Array.isArray(res)) return res;
            }
            var raw = localStorage.getItem(key);
            if (raw) return JSON.parse(raw);
        } catch(e) {
            console.error('[Keuangan] Gagal mengambil data ' + key, e);
        }
        return [];
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val;
    }

    // HELPER FORMAT CURRENCY ANGKIK (RAPI DENGAN DESIMAL & SIGN)
    function formatRupiah(val) {
        var num = parseFloat(val) || 0;
        var isNegative = num < 0;
        var absVal = Math.abs(num);
        var formatted = 'Rp ' + absVal.toLocaleString('id-ID');
        return isNegative ? '-' + formatted : formatted;
    }

    // POPULATE DROPDOWN GREENHOUSE DINAMIS FROM STORAGE
    function populateGhDropdown() {
        var selectEl = document.getElementById('keuanganGh');
        if (!selectEl) return;

        var keyGh = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GREENHOUSE) ? Storage.KEYS.GREENHOUSE : 'cozycs_greenhouse';
        var dataGh = getData(keyGh);

        var optionsHtml = `<option value="Seluruh Kebun">${t('opt_all_gh')}</option>`;
        if (Array.isArray(dataGh) && dataGh.length > 0) {
            dataGh.forEach(function(gh) {
                if (gh && gh.kode) {
                    optionsHtml += `<option value="${gh.kode}">${gh.kode} - ${gh.nama || 'GH'}</option>`;
                }
            });
        }
        selectEl.innerHTML = optionsHtml;
    }

    function checkSampleData() {
        var isSeeded = localStorage.getItem(KEY_SEEDED);
        if (!isSeeded) {
            var dataExisting = getData(getKey());
            if (!dataExisting || dataExisting.length === 0) {
                var initialData = [
                    {
                        id: 'FIN-' + Date.now(),
                        tanggal: new Date().toISOString().split('T')[0],
                        jenis: 'Pemasukan',
                        kategori: 'Penjualan Melon',
                        nominal: 2500000,
                        gh: 'GH-01',
                        petugas: 'Abas',
                        desc: 'Penjualan panen Melon Inthanon Grade A'
                    }
                ];
                if (typeof Storage !== 'undefined' && Storage.saveAll) {
                    Storage.saveAll(getKey(), initialData);
                }
            }
            localStorage.setItem(KEY_SEEDED, 'true');
        }
    }

    function render() {
        var todayStr = new Date().toISOString().split('T')[0];

        return `
            <div class="dashboard-container" style="padding: 16px; max-width: 800px; margin: 0 auto;">
                <div class="section-title" style="font-size: 16px; font-weight: 800; color: #1B5E20; margin-bottom: 16px;">
                    <i class="fas fa-wallet" style="color: #2E7D32;"></i> ${t('module_title')}
                </div>

                <!-- 1. DASHBOARD STATISTIK KEUANGAN -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;" id="keuanganStatCards">
                    <!-- Dynamic Stat Cards -->
                </div>

                <!-- 2. FORM INPUT TRANSAKSI -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 16px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div style="font-size: 15px; font-weight: 800; color: #2E7D32; margin-bottom: 14px; border-bottom: 2px solid #E8F5E9; padding-bottom: 8px;" id="formTitleKeuangan">
                        ${t('form_title_add')}
                    </div>
                    
                    <form id="formKeuangan">
                        <input type="hidden" id="keuanganId">

                        <!-- Tanggal & Jenis -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #555; display: block; margin-bottom: 4px;">${t('lbl_date')}</label>
                                <input type="date" id="keuanganTanggal" value="${todayStr}" required style="width: 100%; padding: 9px 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 12px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #555; display: block; margin-bottom: 4px;">${t('lbl_type')}</label>
                                <select id="keuanganJenis" style="width: 100%; padding: 9px 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 12px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                                    <option value="Pemasukan">${t('opt_income')}</option>
                                    <option value="Pengeluaran">${t('opt_expense')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Kategori & Nominal -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #555; display: block; margin-bottom: 4px;">${t('lbl_category')}</label>
                                <select id="keuanganKategori" style="width: 100%; padding: 9px 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 12px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                                    <option value="Penjualan Melon">${t('opt_cat_melon_sales')}</option>
                                    <option value="Penjualan Sayur / Lainnya">${t('opt_cat_veggie_sales')}</option>
                                    <option value="Pembelian Nutrisi / Pupuk">${t('opt_cat_nutrisi')}</option>
                                    <option value="Pembelian Pestisida / Obatan">${t('opt_cat_pestisida')}</option>
                                    <option value="Peralatan & Sparepart GH">${t('opt_cat_alat')}</option>
                                    <option value="Operasional & Listrik">${t('opt_cat_operasional')}</option>
                                    <option value="Gaji / Tenaga Kerja">${t('opt_cat_gaji')}</option>
                                    <option value="Lain-Lain">${t('opt_cat_lainnya')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #555; display: block; margin-bottom: 4px;">${t('lbl_nominal')}</label>
                                <input type="number" id="keuanganNominal" required placeholder="${t('ph_nominal')}" style="width: 100%; padding: 9px 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 12px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <!-- Lokasi GH & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #555; display: block; margin-bottom: 4px;">${t('lbl_gh')}</label>
                                <select id="keuanganGh" style="width: 100%; padding: 9px 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 12px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                                    <option value="Seluruh Kebun">${t('opt_all_gh')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 700; color: #555; display: block; margin-bottom: 4px;">${t('lbl_petugas')}</label>
                                <input type="text" id="keuanganPetugas" placeholder="${t('ph_petugas')}" style="width: 100%; padding: 9px 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 12px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <!-- Catatan / Deskripsi -->
                        <div style="margin-bottom: 14px;">
                            <label style="font-size: 11px; font-weight: 700; color: #555; display: block; margin-bottom: 4px;">${t('lbl_desc')}</label>
                            <textarea id="keuanganDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 9px 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 12px; background: var(--card-bg, #fff); color: var(--text-color, #333); resize: vertical;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px; justify-content: flex-end;">
                            <button type="button" id="btnCancelKeuanganEdit" style="display: none; background: #f5f5f5; border: 1px solid #ccc; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; color: #555;">
                                ${t('btn_cancel')}
                            </button>
                            <button type="submit" class="btn btn-primary" style="background: #2E7D32; color: #fff; border: none; padding: 8px 20px; border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer;">
                                <i class="fas fa-save"></i> ${t('btn_save')}
                            </button>
                        </div>
                    </form>
                </div>

                <!-- 3. BAR PENCARIAN & FILTER RIWAYAT TRANSAKSI -->
                <div style="display: flex; gap: 8px; margin-bottom: 12px; align-items: center;">
                    <div style="flex: 1; position: relative;">
                        <input type="text" id="keuanganSearchInput" placeholder="${t('ph_search')}" style="width: 100%; padding: 8px 12px 8px 30px; border-radius: 8px; border: 1px solid #ccc; font-size: 12px;">
                        <i class="fas fa-search" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #888; font-size: 11px;"></i>
                    </div>
                    <select id="keuanganFilterJenis" style="padding: 8px 10px; border-radius: 8px; border: 1px solid #ccc; font-size: 12px; background: #fff;">
                        <option value="semua">Semua Transaksi</option>
                        <option value="Pemasukan">Pemasukan (+)</option>
                        <option value="Pengeluaran">Pengeluaran (-)</option>
                    </select>
                </div>

                <!-- 4. REKAP RIWAYAT TRANSAKSI -->
                <div class="section-title" style="font-size: 14px; font-weight: 800; color: #1B5E20; margin-bottom: 10px;">
                    <i class="fas fa-history" style="color: #2E7D32;"></i> ${t('recap_title')}
                </div>
                <div id="containerKeuanganCards"></div>

                <!-- 5. PAGINASI -->
                <div id="keuanganPagination" style="margin-top: 14px;"></div>
            </div>
        `;
    }

    function init() {
        checkSampleData();
        populateGhDropdown();
        loadDashboard();
        loadTable();

        if (typeof restoreFormDraftGlobal === 'function') {
            restoreFormDraftGlobal('formKeuangan');
        }

        var form = document.getElementById('formKeuangan');
        var btnCancel = document.getElementById('btnCancelKeuanganEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('keuanganId');
                var tanggal = getVal('keuanganTanggal') || new Date().toISOString().split('T')[0];
                var jenis = getVal('keuanganJenis');
                var kategori = getVal('keuanganKategori');
                var nominal = parseFloat(getVal('keuanganNominal')) || 0;
                var gh = getVal('keuanganGh');
                var petugas = getVal('keuanganPetugas');
                var desc = getVal('keuanganDesc');

                var payload = {
                    tanggal: tanggal,
                    jenis: jenis || 'Pemasukan',
                    kategori: kategori || 'Lain-Lain',
                    nominal: nominal,
                    gh: gh || 'Seluruh Kebun',
                    petugas: petugas || t('default_petugas'),
                    desc: desc
                };

                try {
                    var storageKey = getKey();
                    if (id) {
                        payload.id = id;
                        if (typeof Storage !== 'undefined' && Storage.update) {
                            Storage.update(storageKey, payload);
                        }
                    } else {
                        if (typeof Storage !== 'undefined' && Storage.add) {
                            Storage.add(storageKey, payload);
                        }
                    }

                    // LOG AKTIVITAS DASBOR
                    if (typeof Storage !== 'undefined' && Storage.add) {
                        var keyAktivitas = (Storage.KEYS && Storage.KEYS.AKTIVITAS) ? Storage.KEYS.AKTIVITAS : 'cozycs_aktivitas';
                        var now = new Date();
                        var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
                        var isInc = (jenis === 'Pemasukan' || jenis === 'Income');

                        Storage.add(keyAktivitas, {
                            judul: id ? 'Perbarui Transaksi Keuangan' : 'Pencatatan Keuangan',
                            deskripsi: (jenis || 'Pemasukan') + ' ' + formatRupiah(nominal) + ' (' + (kategori || 'Keuangan') + ')',
                            tanggal: tanggal || now.toISOString().split('T')[0],
                            jam: timeStr,
                            kategori: 'Keuangan',
                            icon: 'fas fa-wallet',
                            color: isInc ? '#2E7D32' : '#C62828'
                        });
                    }

                    if (typeof Helper !== 'undefined' && Helper.showToast) {
                        Helper.showToast(t('toast_saved'), 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                resetForm();
                loadDashboard();
                loadTable();
                window.dispatchEvent(new Event('cozycs_data_changed'));
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                resetForm();
            });
        }

        // EVENT LISTENER UNTUK SEARCH & FILTER
        var searchEl = document.getElementById('keuanganSearchInput');
        if (searchEl) {
            searchEl.addEventListener('input', function(e) {
                searchQuery = e.target.value || '';
                currentPage = 1;
                loadTable();
            });
        }

        var filterEl = document.getElementById('keuanganFilterJenis');
        if (filterEl) {
            filterEl.addEventListener('change', function(e) {
                filterJenis = e.target.value || 'semua';
                currentPage = 1;
                loadTable();
            });
        }
    }

    function resetForm() {
        var form = document.getElementById('formKeuangan');
        if (form) form.reset();

        setVal('keuanganId', '');
        setVal('keuanganTanggal', new Date().toISOString().split('T')[0]);
        setVal('keuanganJenis', 'Pemasukan');
        setVal('keuanganKategori', 'Penjualan Melon');
        setVal('keuanganGh', 'Seluruh Kebun');
        setVal('keuanganPetugas', '');
        setVal('keuanganDesc', '');

        var titleEl = document.getElementById('formTitleKeuangan');
        if (titleEl) titleEl.innerText = t('form_title_add');

        var btnCancel = document.getElementById('btnCancelKeuanganEdit');
        if (btnCancel) btnCancel.style.display = 'none';
    }

    function loadDashboard() {
        var container = document.getElementById('keuanganStatCards');
        if (!container) return;

        var data = getData(getKey());
        var totalMasuk = 0;
        var totalKeluar = 0;

        if (Array.isArray(data)) {
            data.forEach(function(item) {
                if (!item) return;
                var nominal = parseFloat(item.nominal) || 0;
                if (item.jenis === 'Pemasukan' || item.jenis === 'Income') {
                    totalMasuk += nominal;
                } else {
                    totalKeluar += nominal;
                }
            });
        }

        var saldo = totalMasuk - totalKeluar;

        container.innerHTML = `
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="font-size: 10px; color: #888; font-weight: 700; text-transform: uppercase;">${t('stat_balance')}</div>
                <div style="font-size: 15px; font-weight: 800; color: ${saldo >= 0 ? '#2E7D32' : '#C62828'}; margin-top: 2px;">${formatRupiah(saldo)}</div>
            </div>
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="font-size: 10px; color: #2E7D32; font-weight: 700; text-transform: uppercase;">${t('stat_income')}</div>
                <div style="font-size: 15px; font-weight: 800; color: #2E7D32; margin-top: 2px;">+${formatRupiah(totalMasuk)}</div>
            </div>
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="font-size: 10px; color: #C62828; font-weight: 700; text-transform: uppercase;">${t('stat_expense')}</div>
                <div style="font-size: 15px; font-weight: 800; color: #C62828; margin-top: 2px;">-${formatRupiah(totalKeluar)}</div>
            </div>
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="font-size: 10px; color: #0277BD; font-weight: 700; text-transform: uppercase;">${t('stat_profit')}</div>
                <div style="font-size: 15px; font-weight: 800; color: #0277BD; margin-top: 2px;">${formatRupiah(saldo)}</div>
            </div>
        `;
    }

    function loadTable() {
        var container = document.getElementById('containerKeuanganCards');
        var paginationEl = document.getElementById('keuanganPagination');
        if (!container) return;

        var data = getData(getKey());

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 24px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); font-size: 12px;">${t('no_data')}</div>`;
            if (paginationEl) paginationEl.innerHTML = '';
            return;
        }

        // 1. FILTERING DATA (SEARCH & FILTER JENIS)
        var filtered = data.filter(function(item) {
            if (!item) return false;

            // Filter Jenis Transaksi
            if (filterJenis !== 'semua') {
                var isInc = item.jenis === 'Pemasukan' || item.jenis === 'Income';
                if (filterJenis === 'Pemasukan' && !isInc) return false;
                if (filterJenis === 'Pengeluaran' && isInc) return false;
            }

            // Search Keyword
            if (searchQuery) {
                var q = searchQuery.toLowerCase();
                var text = (item.kategori || '') + ' ' + (item.desc || '') + ' ' + (item.petugas || '') + ' ' + (item.gh || '');
                return text.toLowerCase().includes(q);
            }

            return true;
        });

        // 2. SORTING TERBARU
        filtered.sort(function(a, b) {
            var dateA = a && a.tanggal ? new Date(a.tanggal) : new Date(0);
            var dateB = b && b.tanggal ? new Date(b.tanggal) : new Date(0);
            return dateB - dateA;
        });

        // 3. PAGINASI
        var totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startIdx = (currentPage - 1) * itemsPerPage;
        var paginatedData = filtered.slice(startIdx, startIdx + itemsPerPage);

        var html = '';
        paginatedData.forEach(function(item) {
            if (!item) return;

            var isMasuk = item.jenis === 'Pemasukan' || item.jenis === 'Income';
            var badgeBg = isMasuk ? '#E8F5E9' : '#FFEBEE';
            var badgeColor = isMasuk ? '#2E7D32' : '#C62828';
            var prefix = isMasuk ? '+' : '-';

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 16px; padding: 14px 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 13px; color: var(--text-color, #222);">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; margin-left: 6px;">${item.gh || 'Seluruh Kebun'}</span>
                        </div>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase;">${item.jenis}</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div>
                            <strong style="font-size: 14px; color: var(--text-color, #222); display: block;">${item.kategori}</strong>
                            <div style="font-size: 11px; color: #777; margin-top: 3px;">
                                👤 ${item.petugas || t('default_petugas')}
                            </div>
                        </div>
                        <div style="font-size: 15px; font-weight: 800; color: ${badgeColor};">
                            ${prefix}${formatRupiah(item.nominal || 0)}
                        </div>
                    </div>

                    ${item.desc ? `
                        <div style="font-size: 11px; color: var(--text-color, #333); background: var(--inner-card-bg, #fdfdfd); padding: 8px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #f0f0f0;">
                            <strong>${t('lbl_notes')}:</strong> ${item.desc}
                        </div>
                    ` : ''}

                    <div style="display: flex; justify-content: flex-end; gap: 14px; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                        <i class="fas fa-pencil-alt" onclick="keuangan.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #E67E22; font-size: 14px;"></i>
                        <i class="fas fa-trash-alt" onclick="keuangan.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px;"></i>
                    </div>

                </div>
            `;
        });

        container.innerHTML = html;

        // BIKIN KONTROL PAGINASI
        if (paginationEl) {
            if (totalPages > 1) {
                paginationEl.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #fff; border-radius: 12px; border: 1px solid #E0E0E0; font-size: 11px;">
                        <button onclick="keuangan.changePage(-1)" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:default;"' : ''} style="background: #2E7D32; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                            <i class="fas fa-chevron-left"></i> ${t('btn_prev')}
                        </button>
                        <span style="font-weight: 700; color: #444;">
                            ${t('page_lbl')} <strong>${currentPage}</strong> / ${totalPages}
                        </span>
                        <button onclick="keuangan.changePage(1)" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:default;"' : ''} style="background: #2E7D32; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                            ${t('btn_next')} <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                `;
            } else {
                paginationEl.innerHTML = '';
            }
        }
    }

    function changePage(delta) {
        currentPage += delta;
        loadTable();
    }

    function editItem(id) {
        var storageKey = getKey();
        var allData = getData(storageKey);
        var item = allData.find(function(x) { return x && x.id === id; });

        if (!item && typeof Storage !== 'undefined' && Storage.getById) {
            item = Storage.getById(storageKey, id);
        }

        if (!item) return;

        populateGhDropdown();

        setVal('keuanganId', item.id || '');
        setVal('keuanganTanggal', item.tanggal || '');
        setVal('keuanganJenis', item.jenis || 'Pemasukan');
        setVal('keuanganKategori', item.kategori || 'Penjualan Melon');
        setVal('keuanganNominal', item.nominal || '');
        setVal('keuanganGh', item.gh || 'Seluruh Kebun');
        setVal('keuanganPetugas', item.petugas === t('default_petugas') ? '' : (item.petugas || ''));
        setVal('keuanganDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleKeuangan');
        if (titleEl) titleEl.innerText = t('form_title_edit');

        var btnCancel = document.getElementById('btnCancelKeuanganEdit');
        if (btnCancel) btnCancel.style.display = 'inline-block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm(t('confirm_delete'))) {
            try {
                var storageKey = getKey();
                if (typeof Storage !== 'undefined' && Storage.remove) {
                    Storage.remove(storageKey, id);
                } else {
                    var list = getData(storageKey);
                    var filtered = list.filter(function(x) { return x && x.id !== id; });
                    localStorage.setItem(storageKey, JSON.stringify(filtered));
                }
            } catch(e) {}

            loadDashboard();
            loadTable();
            window.dispatchEvent(new Event('cozycs_data_changed'));

            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast(t('toast_deleted'), 'error');
            }
        }
    }

    return {
        render: render,
        init: init,
        loadDashboard: loadDashboard,
        loadTable: loadTable,
        editItem: editItem,
        deleteItem: deleteItem,
        changePage: changePage
    };

})();

window.keuangan = keuangan;
