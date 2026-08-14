// ==========================================
// COZYCS FARM - MODUL MONITORING & PERAWATAN TANAMAN PRESISI
// (UNIFIED LIFE-CYCLE: VEGETATIF, PRUNING RUAS, POLINASI, SELEKSI BUAH & °BRIX)
// ==========================================

var tanaman = (function() {

    // VARIABEL STATE
    var searchQuery = '';
    var sortBy = 'tanggal_desc';
    var currentPage = 1;
    var itemsPerPage = 20;
    var selectedItemIds = [];

    // KAMUS TERJEMAHAN
    var i18nDict = {
        'id': {
            'module_title': 'Monitoring & Perawatan Tanaman Presisi',
            'form_title_add': 'Catat Rekam Jejak / Perawatan Tanaman',
            'form_title_edit': 'Edit Data Rekam Jejak Tanaman',
            'lbl_gh': 'ID Greenhouse',
            'select_gh': '-- Pilih Greenhouse --',
            'gh_default': 'GH-01 (Default)',
            'lbl_tgl_tanam': 'Tanggal Tanam Awal',
            'lbl_date': 'Tanggal Kegiatan / Cek',
            'lbl_hst': 'HST (Hari Setelah Tanam)',
            'lbl_category': 'Kategori Perawatan / Kegiatan',
            'opt_cat_growth': '1. Vegetatif & Growth (0-25 HST)',
            'opt_cat_pruning': '2. Pruning & Ruas Target (20-30 HST)',
            'opt_cat_polinasi': '3. Polinasi & Fruit Set (26-40 HST)',
            'opt_cat_buah': '4. Pembesaran & °Brix (41-70+ HST)',
            'lbl_gutter': 'Posisi Talang / Lubang',
            'ph_gutter': 'Contoh: J1-T1-L05',
            'lbl_variety': 'Varietas Melon',
            'ph_variety': 'Contoh: Inthanon / Dalmatian / Golden',
            'lbl_petugas': 'Penanggung Jawab / PIC',
            'ph_petugas': 'Contoh: Rizky',
            'default_petugas': 'Petugas Kebun',
            'lbl_phase': 'Fase Tanam Otomatis',
            'opt_phase_nursery': 'Semaian (0-10 HST)',
            'opt_phase_veg': 'Vegetatif (11-25 HST)',
            'opt_phase_flowering': 'Generatif / Bunga (26-40 HST)',
            'opt_phase_fruiting': 'Pembesaran Buah (41-65 HST)',
            'opt_phase_harvest': 'Pematangan / Panen (66+ HST)',
            'lbl_height': 'Tinggi Tanaman (cm)',
            'ph_height': 'Contoh: 120',
            'lbl_leaves': 'Jumlah Daun (Lembar)',
            'ph_leaves': 'Contoh: 18',
            'lbl_stem': 'Diameter Batang (mm)',
            'ph_stem': 'Contoh: 8.5',
            'lbl_population': 'Populasi (Pohon)',
            'ph_population': 'Contoh: 1',
            'lbl_ruas_target': 'Posisi Ruas Cabang / Bunga',
            'ph_ruas_target': 'Contoh: Ruas 9 s/d 12',
            'lbl_prune_type': 'Tipe Perlakuan Pruning',
            'ph_prune_type': 'Contoh: Rempes Cabang Air Ruas 1-8 / Topping Daun 30',
            'lbl_flower_num': 'Posisi Ruas Bunga Dikawinkan',
            'ph_flower_num': 'Contoh: Ruas Ke-10',
            'lbl_pol_status': 'Hasil Polinasi / Fruit Set',
            'opt_pol_success': 'Berhasil / Calon Buah Jadi',
            'opt_pol_fail': 'Gagal / Rontok',
            'lbl_fruit_weight': 'Estimasi / Bobot Buah (Gram)',
            'ph_fruit_weight': 'Contoh: 1250',
            'lbl_fruit_brix': 'Kadar Gula (°Brix)',
            'ph_fruit_brix': 'Contoh: 14.5',
            'lbl_desc': 'Catatan Khusus & Pengamatan',
            'ph_desc': 'Catatan defisiensi, kondisi fisik, perlakuan khusus...',
            'btn_save': 'Simpan Rekam Jejak',
            'btn_cancel': 'Batal',
            'recap_title': 'Riwayat Rekam Jejak Siklus Tanaman',
            'no_data': 'Belum ada catatan kegiatan perawatan tanaman.',
            'card_lbl_loc_variety': 'Varietas & Lokasi',
            'card_lbl_metrics': 'Metrik Pertumbuhan / Hasil',
            'card_lbl_pop_petugas': 'Kategori & PIC',
            'card_lbl_status': 'Fase & Timbal Balik',
            'unit_cm': 'cm', 'unit_leaves': 'Daun', 'unit_mm': 'mm', 'unit_trees': 'Pohon', 'unit_gram': 'g',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Data berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus data ini?',
            'toast_deleted': 'Catatan berhasil dihapus',
            'ph_search': 'Cari varietas, GH, talang, ruas, kategori...',
            'btn_prev': 'Sebelumnya', 'btn_next': 'Selanjutnya', 'page_lbl': 'Halaman', 'total_lbl': 'Total Data',
            'btn_generate_batch': 'Generate Custom Lubang',
            'opt_sort_newest': 'Terbaru ➔ Terlama', 'opt_sort_oldest': 'Terlama ➔ Terbaru',
            'opt_sort_talang_asc': 'Talang / Lubang (A-Z)',
            'opt_sort_variety_asc': 'Varietas Melon (A-Z)',
            'opt_sort_variety_desc': 'Varietas Melon (Z-A)',
            'opt_sort_gh_asc': 'Greenhouse (GH-01, GH-02)'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function getKey() { return (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.TANAMAN) ? Storage.KEYS.TANAMAN : 'cozycs_tanaman'; }

    function getData(key) {
        try {
            if (typeof Storage !== 'undefined' && typeof Storage.getAll === 'function') return Storage.getAll(key);
            var raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : [];
        } catch(e) { return []; }
    }

    function getVal(id) { var el = document.getElementById(id); return el ? el.value : ''; }
    function setVal(id, val) { var el = document.getElementById(id); if (el) el.value = val; }

    // FUNGSI INTI: HST DINAMIS
    function hitungHST(tglTanam, tglCek) {
        if (!tglTanam) return 0;
        var start = new Date(tglTanam);
        var check = tglCek ? new Date(tglCek) : new Date();
        var diffTime = check - start;
        return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    function deteksiFaseOtomatis(hst) {
        if (hst <= 10) return t('opt_phase_nursery');
        if (hst <= 25) return t('opt_phase_veg');
        if (hst <= 40) return t('opt_phase_flowering');
        if (hst <= 65) return t('opt_phase_fruiting');
        return t('opt_phase_harvest');
    }

    function updateHstDisplay() {
        var tglTanam = getVal('tanamanTglTanam');
        var tglCek = getVal('tanamanTanggal');
        var hstEl = document.getElementById('textHstDisplay');
        var faseSelect = document.getElementById('tanamanFase');

        if (tglTanam) {
            var hst = hitungHST(tglTanam, tglCek || new Date().toISOString().split('T')[0]);
            if (hstEl) hstEl.innerText = hst + ' HST';
            var faseAuto = deteksiFaseOtomatis(hst);
            if (faseSelect) faseSelect.value = faseAuto;
        }
    }

    // [Fungsi Lain tetap sama seperti di kode awal: populateGhDropdown, toggleKategoriFields, dll]
    function populateGhDropdown() {
        var selectEl = document.getElementById('tanamanGh');
        if (!selectEl) return;
        var keyGh = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GREENHOUSE) ? Storage.KEYS.GREENHOUSE : 'cozycs_greenhouse';
        var dataGh = getData(keyGh);
        var optionsHtml = `<option value="">${t('select_gh')}</option>`;
        dataGh.forEach(function(gh) { if(gh && gh.kode) optionsHtml += `<option value="${gh.kode}">${gh.kode}</option>`; });
        selectEl.innerHTML = optionsHtml;
    }

    function toggleKategoriFields(cat) {
        document.getElementById('secMetrikGrowth').style.display = (cat === 'Growth') ? 'block' : 'none';
        document.getElementById('secMetrikPruning').style.display = (cat === 'Pruning') ? 'block' : 'none';
        document.getElementById('secMetrikPolinasi').style.display = (cat === 'Polinasi') ? 'grid' : 'none';
        document.getElementById('secMetrikBuah').style.display = (cat === 'Buah') ? 'grid' : 'none';
    }

    // --- RENDER CARD DENGAN FIX HST DINAMIS ---
    function renderCard(item) {
        if (!item) return '';
        var kat = item.kategori || 'Growth';
        
        // FIX: HITUNG ULANG HST SECARA DINAMIS TERHADAP HARI INI
        var valHst = hitungHST(item.tglTanam, new Date().toISOString().split('T')[0]);

        var badgeBg = (kat === 'Pruning') ? '#E1F5FE' : (kat === 'Polinasi') ? '#FFF3E0' : (kat === 'Buah') ? '#F3E5F5' : '#E8F5E9';
        var badgeColor = (kat === 'Pruning') ? '#0288D1' : (kat === 'Polinasi') ? '#E65100' : (kat === 'Buah') ? '#6A1B9A' : '#2E7D32';

        return `
            <div style="background: #ffffff; border-radius: 16px; border: 1px solid #EAEAEA; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
                    <span style="font-size: 14px; font-weight: 800; color: #333;">${item.tanggal || '-'}</span>
                    <span style="background: #E3F2FD; color: #1976D2; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 8px;">${valHst} HST</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                    <div style="background: #F8F9FA; padding: 12px; border-radius: 12px;">
                        <div style="font-size: 10px; color: #888; font-weight: 700; text-transform: uppercase;">VARIETAS & LOKASI</div>
                        <div style="font-size: 12px; font-weight: 800; color: #2E7D32;">🌱 ${item.varietas || '-'}</div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">📍 ${item.talang || '-'}</div>
                    </div>
                    <div style="background: #F8F9FA; padding: 12px; border-radius: 12px;">
                        <div style="font-size: 10px; color: #888; font-weight: 700; text-transform: uppercase;">METRIK PERTUMBUHAN</div>
                        <div style="font-size: 12px; font-weight: 800; color: #333;">📏 ${item.tinggi || 0} cm | 🍃 ${item.daun || 0} Daun</div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">↔️ Ø ${item.batang || 0} mm</div>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 1px dashed #DDD; padding-top: 10px;">
                    <i class="fas fa-history" onclick="tanaman.showHistoryModal('${item.talang}', '${item.gh}')" style="color: #2E7D32; cursor: pointer; font-size: 16px;"></i>
                    <div style="display: flex; gap: 16px;">
                        <i class="fas fa-pencil-alt" onclick="tanaman.editItem('${item.id}')" style="color: #E67E22; cursor: pointer; font-size: 16px;"></i>
                        <i class="fas fa-trash-alt" onclick="tanaman.deleteItem('${item.id}')" style="color: #C62828; cursor: pointer; font-size: 16px;"></i>
                    </div>
                </div>
            </div>
        `;
    }

    // [FUNGSI LAINNYA SEPERTI editItem, loadTable, dll TETAP SAMA]
    // Pastikan Anda memanggil loadTable() di dalam init()
    
    function init() {
        populateGhDropdown();
        loadTable();
        // Event listeners...
    }

    return { render: render, init: init, editItem: editItem, deleteItem: deleteItem, handleSearch: handleSearch, handleSort: handleSort, changePage: changePage, toggleKategoriFields: toggleKategoriFields, updateHstDisplay: updateHstDisplay, openGenerateModal: openGenerateModal, closeGenerateModal: closeGenerateModal, updateTotalPreview: updateTotalPreview, processGenerateCustom: processGenerateCustom, showHistoryModal: showHistoryModal, closeHistoryModal: closeHistoryModal, toggleSelectItem: toggleSelectItem, toggleSelectAll: toggleSelectAll, deleteSelectedItems: deleteSelectedItems, resetDataTanaman: resetDataTanaman };

})();

window.tanaman = tanaman;
