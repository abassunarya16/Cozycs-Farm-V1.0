// ==========================================
// COZYCS FARM - MODUL MONITORING & PERAWATAN TANAMAN
// (LAYOUT DISESUAIKAN DENGAN MODUL NUTRISI)
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
            'lbl_date': 'Tanggal',
            'lbl_category': 'Kategori',
            'lbl_gutter': 'Posisi (Talang/Lubang)',
            'lbl_variety': 'Varietas',
            'lbl_petugas': 'Petugas',
            'lbl_phase': 'Fase',
            'lbl_height': 'Tinggi (cm)',
            'lbl_leaves': 'Jumlah Daun',
            'lbl_stem': 'Batang (mm)',
            'lbl_desc': 'Catatan',
            'btn_save': 'Simpan Data',
            'btn_cancel': 'Batal',
            'recap_title': 'Riwayat Perawatan',
            'no_data': 'Belum ada data.',
            'btn_edit': 'Edit',
            'btn_delete': 'Hapus',
            'btn_history': 'Riwayat',
            'card_lbl_loc': 'VARIETAS & LOKASI',
            'card_lbl_metrics': 'METRIK',
            'card_lbl_pic': 'KATEGORI & PIC',
            'card_lbl_phase': 'FASE'
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

    function hitungHST(tglTanam, tglSekarang) {
        if (!tglTanam) return 0;
        var start = new Date(tglTanam);
        var end = new Date(tglSekarang);
        var diff = end - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    function renderCard(item) {
        if (!item) return '';
        var hst = hitungHST(item.tanggal, new Date());

        return `
            <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                    <div>
                        <strong style="font-size: 14px; color: var(--text-color, #222);">${item.tanggal || '-'}</strong>
                        <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${item.gh || '-'}</span>
                    </div>
                    <div style="font-size: 11px; font-weight: 700; color: #555;">${hst} HST</div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                    <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_loc')}</div>
                        <div style="font-size: 12px; font-weight: bold;">${item.varietas || '-'}</div>
                        <div style="font-size: 11px; color: #444;">${item.talang || '-'}</div>
                    </div>
                    <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_metrics')}</div>
                        <div style="font-size: 12px; font-weight: bold;">${item.tinggi || 0} cm | ${item.daun || 0} daun</div>
                        <div style="font-size: 11px; color: #444;">Ø ${item.batang || 0} mm</div>
                    </div>
                    <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_pic')}</div>
                        <div style="font-size: 12px; font-weight: bold;">${item.petugas || '-'}</div>
                        <div style="font-size: 11px; color: #444;">${item.kategori || '-'}</div>
                    </div>
                    <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_phase')}</div>
                        <div style="font-size: 12px; font-weight: bold; color: #C62828;">${item.fase || '-'}</div>
                    </div>
                </div>

                ${item.desc ? `<div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); background: var(--inner-card-bg, #fdfdfd); padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${item.desc}</div>` : ''}

                <div style="display: flex; justify-content: flex-end; gap: 15px; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                    <span onclick="tanaman.showHistoryModal('${item.talang}', '${item.gh}')" style="cursor: pointer; color: #2E7D32; font-size: 12px; font-weight: 700;">${t('btn_history')}</span>
                    <span onclick="tanaman.editItem('${item.id}')" style="cursor: pointer; color: #F57F17; font-size: 12px; font-weight: 700;">${t('btn_edit')}</span>
                    <span onclick="tanaman.deleteItem('${item.id}')" style="cursor: pointer; color: #C62828; font-size: 12px; font-weight: 700;">${t('btn_delete')}</span>
                </div>
            </div>
        `;
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title">${t('module_title')}</div>
                <div id="containerTanamanCards"></div>
                <div id="paginationTanamanControls" style="display: flex; justify-content: space-between; margin-top: 16px;"></div>
            </div>
        `;
    }

    function loadTable() {
        var container = document.getElementById('containerTanamanCards');
        if (!container) return;
        var data = getData(getKey());
        
        data.sort(function(a, b) {
            return new Date(b.tanggal) - new Date(a.tanggal);
        });

        container.innerHTML = data.map(renderCard).join('') || `<div style="text-align:center; padding: 20px;">${t('no_data')}</div>`;
    }

    function deleteItem(id) {
        if(confirm(t('confirm_delete'))) {
            if (typeof Storage !== 'undefined' && Storage.remove) Storage.remove(getKey(), id);
            loadTable();
        }
    }

    function init() { loadTable(); }

    return { 
        render: render, 
        init: init, 
        deleteItem: deleteItem, 
        loadTable: loadTable, 
        editItem: function(id){ console.log("Edit:", id); },
        showHistoryModal: function(talang, gh){ console.log("History:", talang, gh); }
    };
})();

window.tanaman = tanaman;
