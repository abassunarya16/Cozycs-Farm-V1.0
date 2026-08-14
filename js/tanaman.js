// ==========================================
// COZYCS FARM - MODUL MONITORING & PERAWATAN TANAMAN
// (CLEAN & SIMPLE VERSION)
// ==========================================

var tanaman = (function() {

    var searchQuery = '';
    var sortBy = 'tanggal_desc';
    var currentPage = 1;
    var itemsPerPage = 20;

    var i18nDict = {
        'id': {
            'module_title': 'Monitoring & Perawatan Tanaman',
            'form_title_add': 'Tambah Catatan Perawatan',
            'form_title_edit': 'Edit Data Perawatan',
            'lbl_gh': 'Greenhouse',
            'select_gh': '-- Pilih GH --',
            'gh_default': 'GH-01',
            'lbl_date': 'Tanggal',
            'lbl_category': 'Kategori',
            'opt_cat_growth': 'Pertumbuhan',
            'opt_cat_polinasi': 'Polinasi',
            'opt_cat_pruning': 'Pruning',
            'opt_cat_buah': 'Pembuahan',
            'lbl_gutter': 'Posisi (Talang/Lubang)',
            'lbl_variety': 'Varietas',
            'lbl_petugas': 'Petugas',
            'lbl_phase': 'Fase',
            'lbl_height': 'Tinggi (cm)',
            'lbl_leaves': 'Jumlah Daun',
            'lbl_stem': 'Batang (mm)',
            'lbl_population': 'Populasi',
            'lbl_flower_num': 'Posisi Bunga',
            'lbl_pol_status': 'Status Polinasi',
            'lbl_prune_type': 'Tipe Pruning',
            'lbl_fruit_weight': 'Berat Buah (g)',
            'lbl_fruit_brix': 'Brix (°Brix)',
            'lbl_desc': 'Catatan',
            'btn_save': 'Simpan Data',
            'btn_cancel': 'Batal',
            'recap_title': 'Riwayat Perawatan',
            'no_data': 'Belum ada data.',
            'toast_saved': 'Data berhasil disimpan!',
            'toast_deleted': 'Data dihapus.',
            'confirm_delete': 'Hapus data ini?',
            'btn_edit': 'Edit',
            'btn_delete': 'Hapus',
            'btn_history': 'Riwayat',
            'opt_sort_newest': 'Terbaru ➔ Terlama',
            'opt_sort_oldest': 'Terlama ➔ Terbaru',
            'opt_sort_talang_asc': 'Talang / Lubang (A-Z)',
            'opt_sort_variety_asc': 'Varietas (A-Z)',
            'opt_sort_variety_desc': 'Varietas (Z-A)',
            'opt_sort_gh_asc': 'Greenhouse (A-Z)'
        }
    };

    function t(key) { return i18nDict['id'][key] || key; }
    function getKey() { return (typeof Storage !== 'undefined' && Storage.KEYS) ? Storage.KEYS.TANAMAN : 'cozycs_tanaman'; }
    function getData(key) {
        try {
            if (typeof Storage !== 'undefined' && typeof Storage.getAll === 'function') return Storage.getAll(key);
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch(e) { return []; }
    }
    function getVal(id) { var el = document.getElementById(id); return el ? el.value : ''; }
    function setVal(id, val) { var el = document.getElementById(id); if(el) el.value = val; }
    
    // Helper hitung HST
    function hitungHST(tglTanam, tglSekarang) {
        if (!tglTanam) return 0;
        var start = new Date(tglTanam);
        var end = new Date(tglSekarang);
        var diff = end - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    function renderCard(item) {
        if (!item) return '';
        var kat = item.kategori || 'Pertumbuhan';
        var hst = hitungHST(item.tanggal, new Date());

        return `
            <div style="background: #ffffff; border-radius: 12px; border: 1px solid #E0E0E0; padding: 16px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <div style="font-weight: 800; color: #2E7D32;">${item.tanggal}</div>
                    <div style="font-size: 11px; font-weight: 700; color: #555;">${hst} HST</div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                    <div style="background: #F5F5F5; padding: 8px; border-radius: 8px;">
                        <div style="font-size: 9px; color: #888; font-weight: 700;">VARIETAS & LOKASI</div>
                        <div style="font-size: 12px; font-weight: 700;">${item.varietas || '-'}</div>
                        <div style="font-size: 11px; color: #444;">${item.talang || '-'}</div>
                    </div>
                    <div style="background: #F5F5F5; padding: 8px; border-radius: 8px;">
                        <div style="font-size: 9px; color: #888; font-weight: 700;">METRIK</div>
                        <div style="font-size: 12px; font-weight: 700;">${item.tinggi || 0} cm | ${item.daun || 0} daun</div>
                        <div style="font-size: 11px; color: #444;">Ø ${item.batang || 0} mm</div>
                    </div>
                    <div style="background: #F5F5F5; padding: 8px; border-radius: 8px;">
                        <div style="font-size: 9px; color: #888; font-weight: 700;">KATEGORI & PIC</div>
                        <div style="font-size: 12px; font-weight: 700;">${item.petugas || '-'}</div>
                        <div style="font-size: 11px; color: #444;">${kat}</div>
                    </div>
                    <div style="background: #F5F5F5; padding: 8px; border-radius: 8px;">
                        <div style="font-size: 9px; color: #888; font-weight: 700;">FASE</div>
                        <div style="font-size: 12px; font-weight: 700; color: #C62828;">${item.fase || '-'}</div>
                    </div>
                </div>

                <div style="font-size: 12px; color: #333; margin-bottom: 12px; border-top: 1px solid #EEE; padding-top: 8px;">
                    ${item.desc || '-'}
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 15px; border-top: 1px solid #EEE; padding-top: 8px;">
                    <span onclick="tanaman.showHistoryModal('${item.talang}', '${item.gh}')" style="cursor: pointer; color: #2E7D32; font-size: 12px; font-weight: 700;">${t('btn_history')}</span>
                    <span onclick="tanaman.editItem('${item.id}')" style="cursor: pointer; color: #E67E22; font-size: 12px; font-weight: 700;">${t('btn_edit')}</span>
                    <span onclick="tanaman.deleteItem('${item.id}')" style="cursor: pointer; color: #C62828; font-size: 12px; font-weight: 700;">${t('btn_delete')}</span>
                </div>
            </div>
        `;
    }

    function render() {
        return `
            <div style="padding: 16px;">
                <div style="font-weight: 800; font-size: 16px; margin-bottom: 16px;">${t('module_title')}</div>
                <div id="containerTanamanCards"></div>
                <div id="paginationTanamanControls" style="display:flex; justify-content:space-between; margin-top:10px;"></div>
            </div>
        `;
    }

    function loadTable() {
        var container = document.getElementById('containerTanamanCards');
        if (!container) return;
        var data = getData(getKey());
        
        // Sorting
        data.sort(function(a, b) {
            if (sortBy === 'tanggal_desc') return new Date(b.tanggal) - new Date(a.tanggal);
            return 0;
        });

        var html = data.map(renderCard).join('');
        container.innerHTML = html || `<div style="text-align:center;">${t('no_data')}</div>`;
    }

    function deleteItem(id) {
        if(confirm(t('confirm_delete'))) {
            if (typeof Storage !== 'undefined' && Storage.remove) Storage.remove(getKey(), id);
            loadTable();
        }
    }

    function init() { loadTable(); }

    return { render: render, init: init, deleteItem: deleteItem, loadTable: loadTable, editItem: function(id){ console.log("Edit:", id); } };
})();

window.tanaman = tanaman;
