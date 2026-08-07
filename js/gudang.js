// ==========================================
// COZYCS FARM - MODUL PUSAT INVENTARIS & GUDANG (CRUD BILINGUAL, SEARCH & PAGINATION)
// ==========================================

var gudang = (function() {

    // VARIABEL STATE UNTUK PENCARIAN, FILTER & PAGINASI
    var searchQuery = '';
    var selectedCategory = '';
    var selectedStatus = '';
    var currentPage = 1;
    var itemsPerPage = 20; // Dibatasi 20 data per halaman

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Pusat Inventaris & Gudang Cozycs Farm',
            'stat_total_items': 'TOTAL ITEM',
            'stat_inventory_value': 'NILAI PERSEDIAAN',
            'stat_critical_stock': 'STOK KRITIS',
            'stat_expired_soon': 'EXPIRED SOON',
            'unit_types': 'Jenis',
            'unit_items': 'Barang',
            'ph_search': '🔍 Cari nama barang, merek, supplier, atau lokasi...',
            'opt_all_categories': 'Semua Kategori',
            'opt_all_status': 'Semua Status',
            'opt_status_kritis': 'Perlu Restock / Kritis',
            'opt_status_expired': 'Hampir Expired',
            'form_title_add': 'Tambah Master Barang Gudang',
            'form_title_edit': 'Edit Master Barang Gudang',
            'lbl_date_buy': 'Tanggal Beli / Masuk',
            'lbl_category': 'Kategori',
            'opt_cat_nutrition': 'Nutrisi',
            'opt_cat_pesticide': 'Pestisida',
            'opt_cat_seeds': 'Benih',
            'opt_cat_rockwool': 'Rockwool',
            'opt_cat_netpot': 'Netpot',
            'opt_cat_twine': 'Tali',
            'opt_cat_uv_film': 'Plastik UV',
            'opt_cat_insect_net': 'Insect Net',
            'opt_cat_equipment': 'Peralatan',
            'opt_cat_sparepart': 'Sparepart',
            'opt_cat_others': 'Lainnya',
            'lbl_item_name': 'Nama Barang',
            'ph_item_name': 'Contoh: AB Mix A',
            'lbl_brand': 'Merek / Produsen',
            'ph_brand': 'Contoh: Meroke',
            'lbl_stock_initial': 'Stok Awal',
            'lbl_unit': 'Satuan',
            'lbl_stock_min': 'Stok Min',
            'lbl_price_per_unit': 'Harga Satuan (Rp)',
            'ph_price': 'Contoh: 125000',
            'lbl_supplier': 'Supplier / Toko',
            'ph_supplier': 'Contoh: Tokopedia / PT XYZ',
            'lbl_location': 'Lokasi Penyimpanan',
            'ph_location': 'Contoh: Rak A - Box 02',
            'default_location': 'Gudang Utama',
            'lbl_expired_batch': 'No Batch / Expired',
            'lbl_desc': 'Catatan Barang',
            'ph_desc': 'Nomor batch, dosis rekomendasi, dll...',
            'btn_save': 'Simpan Inventaris',
            'btn_cancel': 'Batal',
            'recap_catalog_title': 'Katalog Stok & Persediaan',
            'recap_mutation_title': 'Riwayat Mutasi (Masuk & Keluar)',
            'no_data_stock': 'Tidak ada data stok inventaris.',
            'no_data_mutation': 'Belum ada riwayat mutasi stok.',
            'badge_restock': '⚠ PERLU RESTOCK',
            'badge_safe': 'STOK AMAN',
            'lbl_remaining_stock': 'SISA STOK',
            'lbl_price_value': 'HARGA & VALUE',
            'lbl_location_card': 'Lokasi:',
            'lbl_supplier_card': 'Supplier:',
            'lbl_brand_card': 'Merek:',
            'lbl_expired_card': 'Expired:',
            'toast_saved': 'Data inventaris berhasil disimpan!',
            'toast_deleted': 'Barang berhasil dihapus dari inventaris',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus barang ini dari inventaris?',
            'log_reason_used': 'Dipakai',
            'log_reason_initial': 'Stok Awal / Pembelian',
            'log_by': 'Oleh:',
            'btn_prev': '⬅️ Sebelum',
            'btn_next': 'Selanjutnya ➡️',
            'page_lbl': 'Halaman',
            'total_lbl': 'Total Data'
        },
        'en': {
            'module_title': 'Cozycs Farm Inventory & Warehouse Center',
            'stat_total_items': 'TOTAL ITEMS',
            'stat_inventory_value': 'INVENTORY VALUE',
            'stat_critical_stock': 'CRITICAL STOCK',
            'stat_expired_soon': 'EXPIRES SOON',
            'unit_types': 'Types',
            'unit_items': 'Items',
            'ph_search': '🔍 Search item name, brand, supplier, or location...',
            'opt_all_categories': 'All Categories',
            'opt_all_status': 'All Status',
            'opt_status_kritis': 'Needs Restock / Critical',
            'opt_status_expired': 'Expiring Soon',
            'form_title_add': 'Add Warehouse Master Item',
            'form_title_edit': 'Edit Warehouse Master Item',
            'lbl_date_buy': 'Purchase / Entry Date',
            'lbl_category': 'Category',
            'opt_cat_nutrition': 'Nutrition',
            'opt_cat_pesticide': 'Pesticides',
            'opt_cat_seeds': 'Seeds',
            'opt_cat_rockwool': 'Rockwool',
            'opt_cat_netpot': 'Netpot',
            'opt_cat_twine': 'Twine / String',
            'opt_cat_uv_film': 'UV Plastic',
            'opt_cat_insect_net': 'Insect Net',
            'opt_cat_equipment': 'Equipment',
            'opt_cat_sparepart': 'Spare Parts',
            'opt_cat_others': 'Others',
            'lbl_item_name': 'Item Name',
            'ph_item_name': 'e.g., AB Mix A',
            'lbl_brand': 'Brand / Manufacturer',
            'ph_brand': 'e.g., Meroke',
            'lbl_stock_initial': 'Initial Stock',
            'lbl_unit': 'Unit',
            'lbl_stock_min': 'Min Stock',
            'lbl_price_per_unit': 'Unit Price (Rp)',
            'ph_price': 'e.g., 125000',
            'lbl_supplier': 'Supplier / Store',
            'ph_supplier': 'e.g., Tokopedia / PT XYZ',
            'lbl_location': 'Storage Location',
            'ph_location': 'e.g., Rack A - Box 02',
            'default_location': 'Main Warehouse',
            'lbl_expired_batch': 'Batch No / Expiry Date',
            'lbl_desc': 'Item Notes',
            'ph_desc': 'Batch number, recommended dosage, etc...',
            'btn_save': 'Save Inventory',
            'btn_cancel': 'Cancel',
            'recap_catalog_title': 'Stock & Inventory Catalog',
            'recap_mutation_title': 'Mutation History (In & Out)',
            'no_data_stock': 'No inventory stock data found.',
            'no_data_mutation': 'No stock mutation history.',
            'badge_restock': '⚠ RESTOCK NEEDED',
            'badge_safe': 'SAFE STOCK',
            'lbl_remaining_stock': 'REMAINING STOCK',
            'lbl_price_value': 'PRICE & VALUE',
            'lbl_location_card': 'Location:',
            'lbl_supplier_card': 'Supplier:',
            'lbl_brand_card': 'Brand:',
            'lbl_expired_card': 'Expiry:',
            'toast_saved': 'Inventory data saved successfully!',
            'toast_deleted': 'Item deleted from inventory successfully',
            'confirm_delete': 'Are you sure you want to delete this item from inventory?',
            'log_reason_used': 'Used by',
            'log_reason_initial': 'Initial Stock / Purchase',
            'log_by': 'By:',
            'btn_prev': '⬅️ Prev',
            'btn_next': 'Next ➡️',
            'page_lbl': 'Page',
            'total_lbl': 'Total Items'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function getKeyBarang() {
        return (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GUDANG) ? Storage.KEYS.GUDANG : 'cozycs_gudang';
    }

    function getKeyMutasi() {
        return 'cozycs_gudang_mutasi';
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val;
    }

    // ==========================================
    // API OTOMATISASI LINTAS MODUL
    // ==========================================
    function potongStokOtomatis(namaBarang, jumlahDipotong, modulPengirim, idGh, namaPetugas) {
        if (typeof Storage === 'undefined' || !Storage.getAll) return false;

        var dataBarang = Storage.getAll(getKeyBarang()) || [];
        var item = dataBarang.find(function(b) {
            return b && b.nama && b.nama.toLowerCase().trim() === namaBarang.toLowerCase().trim();
        });

        if (!item) {
            console.warn("Gudang: Barang '" + namaBarang + "' tidak ditemukan di inventaris.");
            return false;
        }

        var stokLama = parseFloat(item.stok) || 0;
        var jumlah = parseFloat(jumlahDipotong) || 0;
        var stokBaru = Math.max(0, stokLama - jumlah);

        item.stok = stokBaru;
        if (stokBaru <= 0) item.status = 'Habis';
        else if (stokBaru <= (parseFloat(item.stokMin) || 0)) item.status = 'Hampir Habis';
        else item.status = 'Aktif';

        Storage.update(getKeyBarang(), item);

        catatMutasi({
            barangId: item.id,
            namaBarang: item.nama,
            jenis: 'Keluar',
            jumlah: jumlah,
            satuan: item.satuan,
            alasan: t('log_reason_used') + ' ' + modulPengirim,
            gh: idGh || '-',
            petugas: namaPetugas || 'Sistem Otomatis',
            tanggal: new Date().toISOString().split('T')[0]
        });

        loadTable();
        return true;
    }

    function catatMutasi(payload) {
        if (typeof Storage === 'undefined') return;
        var list = Storage.getAll(getKeyMutasi()) || [];
        payload.id = 'MUT-' + Date.now();
        list.unshift(payload);
        Storage.saveAll(getKeyMutasi(), list);
    }

    // ==========================================
    // RENDER TAMPILAN MODUL
    // ==========================================
    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-boxes" style="color: #E65100;"></i> ${t('module_title')}</div>

                <!-- 1. DASHBOARD STATISTIK UTAMA (4 STAT CARDS PERSIS POLA KEUANGAN) -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;" id="gudangStatCards">
                    <!-- Dynamic Stat Cards -->
                </div>

                <!-- 2. FORM INPUT MASTER BARANG GUDANG -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #E65100; margin-bottom: 12px;" id="formTitleGudang">${t('form_title_add')}</div>
                    <form id="formGudang">
                        <input type="hidden" id="barangId">

                        <!-- Tanggal Beli & Kategori -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date_buy')}</label>
                                <input type="date" id="barangTglBeli" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_category')}</label>
                                <select id="barangKategori" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                                    <option value="Nutrisi">${t('opt_cat_nutrition')}</option>
                                    <option value="Pestisida">${t('opt_cat_pesticide')}</option>
                                    <option value="Benih">${t('opt_cat_seeds')}</option>
                                    <option value="Rockwool">${t('opt_cat_rockwool')}</option>
                                    <option value="Netpot">${t('opt_cat_netpot')}</option>
                                    <option value="Tali">${t('opt_cat_twine')}</option>
                                    <option value="Plastik UV">${t('opt_cat_uv_film')}</option>
                                    <option value="Insect Net">${t('opt_cat_insect_net')}</option>
                                    <option value="Peralatan">${t('opt_cat_equipment')}</option>
                                    <option value="Sparepart">${t('opt_cat_sparepart')}</option>
                                    <option value="Lainnya">${t('opt_cat_others')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Nama Barang & Merek -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_item_name')}</label>
                                <input type="text" id="barangNama" required placeholder="${t('ph_item_name')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_brand')}</label>
                                <input type="text" id="barangMerek" placeholder="${t('ph_brand')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <!-- Stok, Satuan & Stok Min -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">${t('lbl_stock_initial')}</label>
                                <input type="number" step="any" id="barangStok" required placeholder="10" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">${t('lbl_unit')}</label>
                                <select id="barangSatuan" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                                    <option value="Kg">Kg</option>
                                    <option value="Gram">Gram</option>
                                    <option value="Liter">Liter</option>
                                    <option value="ml">ml</option>
                                    <option value="Pcs">Pcs</option>
                                    <option value="Roll">Roll</option>
                                    <option value="Pack">Pack</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">${t('lbl_stock_min')}</label>
                                <input type="number" step="any" id="barangStokMin" placeholder="2" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <!-- Harga Beli & Supplier -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_price_per_unit')}</label>
                                <input type="number" id="barangHarga" placeholder="${t('ph_price')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_supplier')}</label>
                                <input type="text" id="barangSupplier" placeholder="${t('ph_supplier')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <!-- Lokasi Spesifik & Expired -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_location')}</label>
                                <input type="text" id="barangLokasi" placeholder="${t('ph_location')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_expired_batch')}</label>
                                <input type="date" id="barangExpired" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label>
                            <textarea id="barangDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #E65100; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelGudangEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- 3. REKAP KATALOG STOK GUDANG TITLE -->
                <div class="section-title"><i class="fas fa-cubes" style="color: #E65100;"></i> ${t('recap_catalog_title')}</div>

                <!-- PENCARIAN & FILTER KATEGORI/STATUS -->
                <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 14px;">
                    <div style="margin-bottom: 8px;">
                        <input type="text" id="inputSearchGudang" 
                               placeholder="${t('ph_search')}" 
                               oninput="gudang.handleSearch(this.value)"
                               value="${searchQuery}"
                               style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color, #ccc); font-size: 13px; box-sizing: border-box; background: var(--card-bg, #fff); color: var(--text-color, #222);">
                    </div>
                    <div style="display: flex; gap: 8px; overflow-x: auto;">
                        <select id="gudangFilterKategori" onchange="gudang.handleCategoryFilter(this.value)" style="flex: 1; padding: 8px 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 12px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            <option value="">${t('opt_all_categories')}</option>
                            <option value="Nutrisi" ${selectedCategory === 'Nutrisi' ? 'selected' : ''}>${t('opt_cat_nutrition')}</option>
                            <option value="Pestisida" ${selectedCategory === 'Pestisida' ? 'selected' : ''}>${t('opt_cat_pesticide')}</option>
                            <option value="Benih" ${selectedCategory === 'Benih' ? 'selected' : ''}>${t('opt_cat_seeds')}</option>
                            <option value="Rockwool" ${selectedCategory === 'Rockwool' ? 'selected' : ''}>${t('opt_cat_rockwool')}</option>
                            <option value="Netpot" ${selectedCategory === 'Netpot' ? 'selected' : ''}>${t('opt_cat_netpot')}</option>
                            <option value="Tali" ${selectedCategory === 'Tali' ? 'selected' : ''}>${t('opt_cat_twine')}</option>
                            <option value="Plastik UV" ${selectedCategory === 'Plastik UV' ? 'selected' : ''}>${t('opt_cat_uv_film')}</option>
                            <option value="Insect Net" ${selectedCategory === 'Insect Net' ? 'selected' : ''}>${t('opt_cat_insect_net')}</option>
                            <option value="Peralatan" ${selectedCategory === 'Peralatan' ? 'selected' : ''}>${t('opt_cat_equipment')}</option>
                            <option value="Sparepart" ${selectedCategory === 'Sparepart' ? 'selected' : ''}>${t('opt_cat_sparepart')}</option>
                            <option value="Lainnya" ${selectedCategory === 'Lainnya' ? 'selected' : ''}>${t('opt_cat_others')}</option>
                        </select>
                        <select id="gudangFilterStatus" onchange="gudang.handleStatusFilter(this.value)" style="flex: 1; padding: 8px 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 12px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            <option value="">${t('opt_all_status')}</option>
                            <option value="KRITIS" ${selectedStatus === 'KRITIS' ? 'selected' : ''}>${t('opt_status_kritis')}</option>
                            <option value="EXPIRED" ${selectedStatus === 'EXPIRED' ? 'selected' : ''}>${t('opt_status_expired')}</option>
                        </select>
                    </div>
                </div>

                <!-- Container Cards Inventaris Gudang -->
                <div id="containerGudangCards"></div>

                <!-- Kontrol Navigasi Paginasi -->
                <div id="paginationGudangControls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; margin-bottom: 24px; font-size: 12px;"></div>

                <!-- 4. RIWAYAT MUTASI STOK (LOG AUDIT) -->
                <div class="section-title"><i class="fas fa-history" style="color: #0277BD;"></i> ${t('recap_mutation_title')}</div>
                <div id="containerMutasiLog"></div>
            </div>
        `;
    }

    function init() {
        loadDashboard();
        loadTable();
        loadMutasiLog();

        var form = document.getElementById('formGudang');
        var btnCancel = document.getElementById('btnCancelGudangEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('barangId');
                var tglBeli = getVal('barangTglBeli');
                var kategori = getVal('barangKategori');
                var nama = getVal('barangNama');
                var merek = getVal('barangMerek');
                var stok = parseFloat(getVal('barangStok')) || 0;
                var satuan = getVal('barangSatuan');
                var stokMin = parseFloat(getVal('barangStokMin')) || 0;
                var harga = parseFloat(getVal('barangHarga')) || 0;
                var supplier = getVal('barangSupplier');
                var lokasi = getVal('barangLokasi');
                var expired = getVal('barangExpired');
                var desc = getVal('barangDesc');

                var status = 'Aktif';
                if (stok <= 0) status = 'Habis';
                else if (stok <= stokMin) status = 'Hampir Habis';

                var payload = {
                    tglBeli: tglBeli,
                    kategori: kategori,
                    nama: nama,
                    merek: merek || '-',
                    stok: stok,
                    satuan: satuan,
                    stokMin: stokMin,
                    harga: harga,
                    supplier: supplier || '-',
                    lokasi: lokasi || t('default_location'),
                    expired: expired || '-',
                    desc: desc,
                    status: status
                };

                var key = getKeyBarang();
                if (id) {
                    payload.id = id;
                    if (typeof Storage !== 'undefined' && Storage.update) {
                        Storage.update(key, payload);
                    }
                } else {
                    var added = (typeof Storage !== 'undefined' && Storage.add) ? Storage.add(key, payload) : payload;
                    catatMutasi({
                        barangId: added.id || ('BRG-' + Date.now()),
                        namaBarang: nama,
                        jenis: 'Masuk',
                        jumlah: stok,
                        satuan: satuan,
                        alasan: t('log_reason_initial'),
                        gh: t('default_location'),
                        petugas: 'Admin',
                        tanggal: tglBeli || new Date().toISOString().split('T')[0]
                    });
                }

                if (typeof Helper !== 'undefined' && Helper.showToast) {
                    Helper.showToast(t('toast_saved'), 'success');
                }

                form.reset();
                setVal('barangId', '');
                var titleEl = document.getElementById('formTitleGudang');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadDashboard();
                loadTable();
                loadMutasiLog();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('barangId', '');
                var titleEl = document.getElementById('formTitleGudang');
                if (titleEl) titleEl.innerText = t('form_title_add');
                btnCancel.style.display = 'none';
            });
        }
    }

    // DASHBOARD 4 STAT CARDS - STRUCTURAL & TYPOGRAPHY COPY IDENTIK MODUL KEUANGAN
    function loadDashboard() {
        var container = document.getElementById('gudangStatCards');
        if (!container) return;

        var data = (typeof Storage !== 'undefined' && Storage.getAll) ? (Storage.getAll(getKeyBarang()) || []) : [];
        var totalJenis = data.length;
        var nilaiPersediaan = 0;
        var stokKritis = 0;
        var expiredSoon = 0;

        var today = new Date();

        data.forEach(function(item) {
            var stok = parseFloat(item.stok) || 0;
            var harga = parseFloat(item.harga) || 0;
            var stokMin = parseFloat(item.stokMin) || 0;

            nilaiPersediaan += (stok * harga);

            if (stok <= stokMin) stokKritis++;

            if (item.expired && item.expired !== '-') {
                var expDate = new Date(item.expired);
                var diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
                if (diffDays <= 30) expiredSoon++;
            }
        });

        var formatRupiah = function(val) {
            return 'Rp' + val.toLocaleString('id-ID');
        };

        // MEMAKAI KARTU PRESISI SAMA PERSIS KEUANGAN (padding 12px, border #e8e8e8, label 10px uppercase, value 16px bold)
        container.innerHTML = `
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 10px; border: 1px solid var(--border-color, #e8e8e8);">
                <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('stat_total_items')}</div>
                <div style="font-size: 16px; font-weight: bold; color: var(--text-color, #222);">${totalJenis} ${t('unit_types')}</div>
            </div>
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 10px; border: 1px solid var(--border-color, #e8e8e8);">
                <div style="font-size: 10px; color: #2E7D32; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('stat_inventory_value')}</div>
                <div style="font-size: 16px; font-weight: bold; color: #2E7D32;">${formatRupiah(nilaiPersediaan)}</div>
            </div>
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 10px; border: 1px solid var(--border-color, #e8e8e8);">
                <div style="font-size: 10px; color: ${stokKritis > 0 ? '#C62828' : '#777'}; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('stat_critical_stock')}</div>
                <div style="font-size: 16px; font-weight: bold; color: ${stokKritis > 0 ? '#C62828' : 'var(--text-color, #222)'};">${stokKritis} ${t('unit_items')}</div>
            </div>
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 10px; border: 1px solid var(--border-color, #e8e8e8);">
                <div style="font-size: 10px; color: ${expiredSoon > 0 ? '#E65100' : '#777'}; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('stat_expired_soon')}</div>
                <div style="font-size: 16px; font-weight: bold; color: ${expiredSoon > 0 ? '#E65100' : 'var(--text-color, #222)'};">${expiredSoon} ${t('unit_items')}</div>
            </div>
        `;
    }

    function loadTable() {
        var container = document.getElementById('containerGudangCards');
        var pageEl = document.getElementById('paginationGudangControls');
        if (!container) return;

        var data = (typeof Storage !== 'undefined' && Storage.getAll) ? (Storage.getAll(getKeyBarang()) || []) : [];

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data_stock')}</div>`;
            if (pageEl) pageEl.innerHTML = '';
            return;
        }

        // 1. Filter data berdasarkan Pencarian & Dropdown Filters
        var today = new Date();
        var filteredData = data.filter(function(item) {
            var kw = searchQuery.toLowerCase();
            var nama = (item.nama || '').toLowerCase();
            var merek = (item.merek || '').toLowerCase();
            var supplier = (item.supplier || '').toLowerCase();
            var lokasi = (item.lokasi || '').toLowerCase();
            var kategori = (item.kategori || '').toLowerCase();
            var desc = (item.desc || '').toLowerCase();

            var matchSearch = !searchQuery || nama.includes(kw) || merek.includes(kw) || supplier.includes(kw) || lokasi.includes(kw) || kategori.includes(kw) || desc.includes(kw);
            var matchKat = !selectedCategory || item.kategori === selectedCategory;

            var stok = parseFloat(item.stok) || 0;
            var stokMin = parseFloat(item.stokMin) || 0;
            var isKritis = stok <= stokMin;

            var isExpiredSoon = false;
            if (item.expired && item.expired !== '-') {
                var expDate = new Date(item.expired);
                var diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
                if (diffDays <= 30) isExpiredSoon = true;
            }

            var matchStat = true;
            if (selectedStatus === 'KRITIS') matchStat = isKritis;
            if (selectedStatus === 'EXPIRED') matchStat = isExpiredSoon;

            return matchSearch && matchKat && matchStat;
        });

        if (filteredData.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data_stock')}</div>`;
            if (pageEl) pageEl.innerHTML = '';
            return;
        }

        // 2. Paginasi: potong array data sesuai halaman aktif
        var totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        var pageData = filteredData.slice(startIndex, endIndex);

        // 3. Render HTML Kartu Inventaris
        var html = '';
        pageData.forEach(function(item) {
            var stok = parseFloat(item.stok) || 0;
            var stokMin = parseFloat(item.stokMin) || 0;
            var isKritis = stok <= stokMin;

            var badgeBg = isKritis ? '#FFEBEE' : '#E8F5E9';
            var badgeColor = isKritis ? '#C62828' : '#2E7D32';
            var badgeText = isKritis ? t('badge_restock') : t('badge_safe');

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <!-- Header Card: Nama Barang, Kategori & Status Badge -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 15px; color: var(--text-color, #222);">${item.nama}</strong>
                            <span style="font-size: 11px; background: var(--inner-card-bg, #F5F5F5); color: #666; padding: 2px 6px; border-radius: 4px; margin-left: 6px; font-weight: 600;">${item.kategori}</span>
                        </div>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: bold;">${badgeText}</span>
                    </div>

                    <!-- Grid 2 Kotak: Sisa Stok & Harga -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('lbl_remaining_stock')}</div>
                            <div style="font-size: 13px; font-weight: bold; color: ${isKritis ? '#C62828' : 'var(--text-color, #000)'};">
                                ${stok} ${item.satuan} <span style="font-size: 10px; font-weight: normal; color: #777;">(Min: ${stokMin})</span>
                            </div>
                        </div>
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('lbl_price_value')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: #2E7D32;">
                                Rp${(item.harga || 0).toLocaleString('id-ID')} / ${item.satuan}
                            </div>
                        </div>
                    </div>

                    <!-- Detail Tambahan (Lokasi, Supplier, Expired) -->
                    <div style="font-size: 11px; color: #777; margin-bottom: 6px; line-height: 1.5;">
                        <div><i class="fas fa-map-marker-alt" style="color: #E65100; width: 14px;"></i> ${t('lbl_location_card')} <strong>${item.lokasi || t('default_location')}</strong></div>
                        <div><i class="fas fa-truck" style="color: #0277BD; width: 14px;"></i> ${t('lbl_supplier_card')} <strong>${item.supplier || '-'}</strong> | ${t('lbl_brand_card')} <strong>${item.merek || '-'}</strong></div>
                        ${item.expired && item.expired !== '-' ? `<div><i class="fas fa-hourglass-half" style="color: #C62828; width: 14px;"></i> ${t('lbl_expired_card')} <strong>${item.expired}</strong></div>` : ''}
                    </div>

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                        <span onclick="gudang.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="gudang.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // 4. Render Tombol Paginasi
        if (pageEl) {
            if (totalPages > 1) {
                pageEl.innerHTML = `
                    <button onclick="gudang.changePage(-1)" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_prev')}
                    </button>
                    <span style="font-weight: bold; color: var(--text-color, #555);">
                        ${t('page_lbl')} ${currentPage} / ${totalPages} (${filteredData.length} ${t('unit_types')})
                    </span>
                    <button onclick="gudang.changePage(1)" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_next')}
                    </button>
                `;
            } else {
                pageEl.innerHTML = `<span style="color: #777; font-size: 11px;">${t('total_lbl')}: ${filteredData.length} ${t('unit_types')}</span>`;
            }
        }
    }

    function loadMutasiLog() {
        var container = document.getElementById('containerMutasiLog');
        if (!container) return;

        var logs = (typeof Storage !== 'undefined' && Storage.getAll) ? (Storage.getAll(getKeyMutasi()) || []) : [];

        if (logs.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 12px; background: var(--card-bg, #fff); border-radius: 8px; font-size: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data_mutation')}</div>`;
            return;
        }

        var html = '';
        logs.slice(0, 10).forEach(function(m) {
            var isMasuk = m.jenis === 'Masuk';
            html += `
                <div style="background: var(--card-bg, #fff); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color, #eee); margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                    <div>
                        <strong style="color: var(--text-color, #222);">${m.namaBarang}</strong> <span style="color: #777;">(${m.alasan})</span>
                        <div style="font-size: 10px; color: #888;">${m.tanggal} | ${m.gh || 'Gudang'} | ${t('log_by')} ${m.petugas || 'Sistem'}</div>
                    </div>
                    <div style="font-weight: bold; color: ${isMasuk ? '#2E7D32' : '#C62828'}; font-size: 13px;">
                        ${isMasuk ? '+' : '-'}${m.jumlah} ${m.satuan}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function editItem(id) {
        if (typeof Storage === 'undefined' || !Storage.getById) return;
        var item = Storage.getById(getKeyBarang(), id);
        if (!item) return;

        setVal('barangId', item.id || '');
        setVal('barangTglBeli', item.tglBeli || '');
        setVal('barangKategori', item.kategori || 'Nutrisi');
        setVal('barangNama', item.nama || '');
        setVal('barangMerek', item.merek === '-' ? '' : item.merek);
        setVal('barangStok', item.stok || '');
        setVal('barangSatuan', item.satuan || 'Kg');
        setVal('barangStokMin', item.stokMin || '');
        setVal('barangHarga', item.harga || '');
        setVal('barangSupplier', item.supplier === '-' ? '' : item.supplier);
        setVal('barangLokasi', item.lokasi === t('default_location') ? '' : item.lokasi);
        setVal('barangExpired', item.expired === '-' ? '' : item.expired);
        setVal('barangDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleGudang');
        if (titleEl) titleEl.innerText = t('form_title_edit');

        var btnCancel = document.getElementById('btnCancelGudangEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm(t('confirm_delete'))) {
            if (typeof Storage !== 'undefined' && Storage.remove) {
                Storage.remove(getKeyBarang(), id);
            }
            loadDashboard();
            loadTable();
            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast(t('toast_deleted'), 'error');
            }
        }
    }

    // FUNGSI PENANGAN SEARCH, FILTER & NAVIGASI HALAMAN
    function handleSearch(val) {
        searchQuery = val || '';
        currentPage = 1;
        loadTable();
    }

    function handleCategoryFilter(val) {
        selectedCategory = val || '';
        currentPage = 1;
        loadTable();
    }

    function handleStatusFilter(val) {
        selectedStatus = val || '';
        currentPage = 1;
        loadTable();
    }

    function changePage(direction) {
        currentPage += direction;
        loadTable();
    }

    return {
        render: render,
        init: init,
        loadTable: loadTable,
        editItem: editItem,
        deleteItem: deleteItem,
        potongStokOtomatis: potongStokOtomatis,
        handleSearch: handleSearch,
        handleCategoryFilter: handleCategoryFilter,
        handleStatusFilter: handleStatusFilter,
        changePage: changePage
    };

})();

window.gudang = gudang;
