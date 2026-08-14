// ==========================================
// COZYCS FARM - MODUL KEUANGAN (ENHANCED LOGIC)
// ==========================================

var keuangan = (function() {

    var KEY_KEUANGAN = 'cozycs_keuangan';
    var KEY_SEEDED = 'cozycs_keuangan_init_done';

    // STATE UNTUK FILTER & PAGINASI
    var searchQuery = '';
    var filterJenis = 'semua';
    var filterStart = '';
    var filterEnd = '';
    var currentPage = 1;
    var itemsPerPage = 20;

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
            'ph_search': 'Cari transaksi...',
            'btn_export': 'Export CSV'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function getKey() {
        return (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.KEUANGAN) ? Storage.KEYS.KEUANGAN : KEY_KEUANGAN;
    }

    function getData(key) {
        try {
            if (typeof Storage !== 'undefined' && typeof Storage.getAll === 'function') return Storage.getAll(key) || [];
            var raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : [];
        } catch(e) { return []; }
    }

    function formatRupiah(val) {
        var num = parseFloat(val) || 0;
        var prefix = num < 0 ? '-' : '';
        return prefix + 'Rp ' + Math.abs(num).toLocaleString('id-ID');
    }

    function populateGhDropdown() {
        var selectEl = document.getElementById('keuanganGh');
        if (!selectEl) return;
        var keyGh = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GREENHOUSE) ? Storage.KEYS.GREENHOUSE : 'cozycs_greenhouse';
        var dataGh = (typeof Storage !== 'undefined' && Storage.getAll) ? Storage.getAll(keyGh) : [];
        var html = '<option value="Seluruh Kebun">' + t('opt_all_gh') + '</option>';
        dataGh.forEach(function(gh) { if (gh && gh.kode) html += '<option value="' + gh.kode + '">' + gh.kode + ' - ' + (gh.nama || 'GH') + '</option>'; });
        selectEl.innerHTML = html;
    }

    function render() {
        var todayStr = new Date().toISOString().split('T')[0];
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-wallet" style="color: #2E7D32;"></i> ${t('module_title')}</div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;" id="keuanganStatCards"></div>

                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;" id="formTitleKeuangan">${t('form_title_add')}</div>
                    <form id="formKeuangan">
                        <input type="hidden" id="keuanganId">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div><label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date')}</label><input type="date" id="keuanganTanggal" value="${todayStr}" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></div>
                            <div><label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_type')}</label><select id="keuanganJenis" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"><option value="Pemasukan">${t('opt_income')}</option><option value="Pengeluaran">${t('opt_expense')}</option></select></div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div><label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_category')}</label><select id="keuanganKategori" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"><option value="Penjualan Melon">${t('opt_cat_melon_sales')}</option><option value="Penjualan Sayur / Lainnya">${t('opt_cat_veggie_sales')}</option><option value="Pembelian Nutrisi / Pupuk">${t('opt_cat_nutrisi')}</option><option value="Pembelian Pestisida / Obatan">${t('opt_cat_pestisida')}</option><option value="Peralatan & Sparepart GH">${t('opt_cat_alat')}</option><option value="Operasional & Listrik">${t('opt_cat_operasional')}</option><option value="Gaji / Tenaga Kerja">${t('opt_cat_gaji')}</option><option value="Lain-Lain">${t('opt_cat_lainnya')}</option></select></div>
                            <div><label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_nominal')}</label><input type="number" id="keuanganNominal" required placeholder="${t('ph_nominal')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div><label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gh')}</label><select id="keuanganGh" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></select></div>
                            <div><label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_petugas')}</label><input type="text" id="keuanganPetugas" placeholder="${t('ph_petugas')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></div>
                        </div>
                        <div style="margin-bottom: 12px;"><label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label><textarea id="keuanganDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea></div>
                        <div style="display: flex; gap: 8px;">
                            <button type="submit" style="flex: 1; background: #2E7D32; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelKeuanganEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- FILTER BAR -->
                <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 14px;">
                    <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                        <input type="text" id="searchKeuangan" placeholder="${t('ph_search')}" oninput="keuangan.filter()" style="flex:1; padding: 8px; border: 1px solid #ddd; border-radius: 8px; font-size: 12px;">
                        <button onclick="keuangan.exportCSV()" style="background: #2E7D32; color: #fff; border: none; padding: 6px 12px; border-radius: 8px; font-size: 12px;">${t('btn_export')}</button>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <input type="date" id="startKeuangan" onchange="keuangan.filter()" style="flex:1; padding: 6px; border: 1px solid #ddd; border-radius: 8px; font-size: 12px;">
                        <input type="date" id="endKeuangan" onchange="keuangan.filter()" style="flex:1; padding: 6px; border: 1px solid #ddd; border-radius: 8px; font-size: 12px;">
                        <select id="filterJenisKeuangan" onchange="keuangan.filter()" style="padding: 6px; border: 1px solid #ddd; border-radius: 8px; font-size: 12px;"><option value="semua">Semua</option><option value="Pemasukan">Pemasukan</option><option value="Pengeluaran">Pengeluaran</option></select>
                    </div>
                </div>

                <div class="section-title"><i class="fas fa-history" style="color: #2E7D32;"></i> ${t('recap_title')}</div>
                <div id="containerKeuanganCards"></div>
            </div>
        `;
    }

    function filter() {
        searchQuery = document.getElementById('searchKeuangan').value.toLowerCase();
        filterJenis = document.getElementById('filterJenisKeuangan').value;
        filterStart = document.getElementById('startKeuangan').value;
        filterEnd = document.getElementById('endKeuangan').value;
        currentPage = 1;
        loadTable();
    }

    function exportCSV() {
        var data = getData(getKey());
        var csv = "Tanggal,Jenis,Kategori,Nominal,GH,Petugas,Deskripsi\n";
        data.forEach(function(item) {
            csv += [item.tanggal, item.jenis, item.kategori, item.nominal, item.gh, item.petugas, item.desc].join(",") + "\n";
        });
        var blob = new Blob([csv], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'Laporan_Keuangan_' + new Date().toISOString().split('T')[0] + '.csv';
        a.click();
    }

    function init() {
        populateGhDropdown();
        loadDashboard();
        loadTable();

        document.getElementById('formKeuangan').addEventListener('submit', function(e) {
            e.preventDefault();
            var id = getVal('keuanganId');
            var nominal = parseFloat(getVal('keuanganNominal')); // Input sudah otomatis angka murni
            
            var payload = {
                id: id || 'FIN-' + Date.now(),
                tanggal: getVal('keuanganTanggal'),
                jenis: getVal('keuanganJenis'),
                kategori: getVal('keuanganKategori'),
                nominal: nominal,
                gh: getVal('keuanganGh'),
                petugas: getVal('keuanganPetugas') || t('default_petugas'),
                desc: getVal('keuanganDesc')
            };

            var storageKey = getKey();
            if (id) {
                if (typeof Storage !== 'undefined' && Storage.update) Storage.update(storageKey, payload);
            } else {
                if (typeof Storage !== 'undefined' && Storage.add) Storage.add(storageKey, payload);
            }
            
            document.getElementById('formKeuangan').reset();
            setVal('keuanganTanggal', new Date().toISOString().split('T')[0]);
            loadDashboard();
            loadTable();
        });
    }

    function loadDashboard() {
        var container = document.getElementById('keuanganStatCards');
        if (!container) return;
        var data = getData(getKey());
        var totalMasuk = 0, totalKeluar = 0;
        data.forEach(function(item) {
            var n = parseFloat(item.nominal) || 0;
            if (item.jenis === 'Pemasukan') totalMasuk += n; else totalKeluar += n;
        });
        var saldo = totalMasuk - totalKeluar;
        container.innerHTML = `
            <div style="background:#fff; padding:10px; border-radius:10px; border:1px solid #eee;">
                <div style="font-size:9px; color:#888;">${t('stat_balance')}</div>
                <div style="font-size:14px; font-weight:bold; color:${saldo>=0?'#2E7D32':'#C62828'}">${formatRupiah(saldo)}</div>
            </div>
            <div style="background:#fff; padding:10px; border-radius:10px; border:1px solid #eee;">
                <div style="font-size:9px; color:#2E7D32;">${t('stat_income')}</div>
                <div style="font-size:14px; font-weight:bold; color:#2E7D32;">+${formatRupiah(totalMasuk)}</div>
            </div>
            <div style="background:#fff; padding:10px; border-radius:10px; border:1px solid #eee;">
                <div style="font-size:9px; color:#C62828;">${t('stat_expense')}</div>
                <div style="font-size:14px; font-weight:bold; color:#C62828;">-${formatRupiah(totalKeluar)}</div>
            </div>
            <div style="background:#fff; padding:10px; border-radius:10px; border:1px solid #eee;">
                <div style="font-size:9px; color:#0277BD;">${t('stat_profit')}</div>
                <div style="font-size:14px; font-weight:bold; color:#0277BD;">${formatRupiah(saldo)}</div>
            </div>
        `;
    }

    function loadTable() {
        var container = document.getElementById('containerKeuanganCards');
        if (!container) return;
        var data = getData(getKey());
        
        // FILTERING
        var filtered = data.filter(function(item) {
            var matchSearch = (item.kategori + item.desc + item.petugas).toLowerCase().includes(searchQuery);
            var matchJenis = (filterJenis === 'semua' || item.jenis === filterJenis);
            var matchStart = (!filterStart || item.tanggal >= filterStart);
            var matchEnd = (!filterEnd || item.tanggal <= filterEnd);
            return matchSearch && matchJenis && matchStart && matchEnd;
        });

        // SORTING & RENDER
        filtered.sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));
        
        var html = '';
        filtered.forEach(function(item) {
            var isMasuk = item.jenis === 'Pemasukan';
            html += `
                <div style="background:#fff; border:1px solid #eee; border-radius:12px; padding:12px; margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:5px;">
                        <span>${item.tanggal} | <b>${item.gh}</b></span>
                        <b style="color:${isMasuk?'#2E7D32':'#C62828'}">${item.jenis}</b>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div><b style="font-size:13px;">${item.kategori}</b><br><small>${item.petugas}</small></div>
                        <div style="font-weight:bold; color:${isMasuk?'#2E7D32':'#C62828'}">${isMasuk?'+':'-'}${formatRupiah(item.nominal)}</div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html || `<div style="text-align:center; padding:20px;">${t('no_data')}</div>`;
    }

    return { render: render, init: init, filter: filter, exportCSV: exportCSV, editItem: editItem, deleteItem: deleteItem };
})();

window.keuangan = keuangan;
