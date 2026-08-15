// ==========================================
// COZYCS FARM - MODUL PUSAT INVENTARIS & GUDANG
// (WITH BULK DELETE, DATA RESET, VALIDATED STATS, MODERN DASHBOARD & AUTO-SYNC KEUANGAN)
// ==========================================

var gudang = (function() {

    // VARIABEL STATE UNTUK PENCARIAN, FILTER, PAGINASI & SELEKSI MASSAL
    var searchQuery = '';
    var selectedCategory = '';
    var selectedStatus = '';
    var currentPage = 1;
    var itemsPerPage = 20;
    var selectedItemIds = []; // Menyimpan ID barang yang dicentang

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
            'ph_item_name': 'Contoh: Pekatan AB Mix A',
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
            'ph_item_name': 'e.g., AB Mix Concentrate A',
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

    // HELPER PEMBULATAN ANGKA DESIMAL
    function roundNumber(val) {
        var num = parseFloat(val) || 0;
        return parseFloat(num.toFixed(2));
    }

    function getKeyBarang() {
        return (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GUDANG) ? Storage.KEYS.GUDANG : 'cozycs_gudang';
    }

    function getKeyMutasi() {
        return 'cozycs_gudang_mutasi';
    }

    // KEY STORAGE KEUANGAN (harus sama dengan yang dipakai modul keuangan.js)
    function getKeyKeuangan() {
        return (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.KEUANGAN) ? Storage.KEYS.KEUANGAN : 'cozycs_keuangan';
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val;
    }

    // HELPER AMBIL HANYA DATA BARANG VALID & AKTIF
    function getValidBarangList() {
        if (typeof Storage === 'undefined' || !Storage.getAll) return [];
        var raw = Storage.getAll(getKeyBarang()) || [];
        if (!Array.isArray(raw)) return [];
        return raw.filter(function(item) {
            return item && item.id && typeof item.nama === 'string' && item.nama.trim() !== '';
        });
    }

    // ==========================================
    // API KHUSUS PEKATAN NUTRISI (UNTUK MODUL NUTRISI)
    // ==========================================
    function getStokPekatan() {
        var data = getValidBarangList();

        var nutrisiItems = data.filter(function(b) {
            var kat = String(b.kategori || '').toLowerCase();
            var nm = String(b.nama || '').toLowerCase();
            return kat === 'nutrisi' || nm.includes('pekatan') || nm.includes('ab mix') || nm.includes('abmix');
        });

        var itemA = nutrisiItems.find(function(b) {
            var nm = String(b.nama || '').toLowerCase();
            return nm.includes('pekatan a') || nm.includes('ab mix a') || nm.includes('mix a') || (nm.includes('a') && nm.includes('pekatan'));
        });

        var itemB = nutrisiItems.find(function(b) {
            var nm = String(b.nama || '').toLowerCase();
            return nm.includes('pekatan b') || nm.includes('ab mix b') || nm.includes('mix b') || (nm.includes('b') && nm.includes('pekatan'));
        });

        return {
            pekatanA: itemA ? {
                id: itemA.id,
                nama: itemA.nama,
                stok: roundNumber(itemA.stok),
                satuan: itemA.satuan || 'Liter',
                stokMin: roundNumber(itemA.stokMin || 0),
                isKritis: roundNumber(itemA.stok) <= roundNumber(itemA.stokMin || 0)
            } : null,
            pekatanB: itemB ? {
                id: itemB.id,
                nama: itemB.nama,
                stok: roundNumber(itemB.stok),
                satuan: itemB.satuan || 'Liter',
                stokMin: roundNumber(itemB.stokMin || 0),
                isKritis: roundNumber(itemB.stok) <= roundNumber(itemB.stokMin || 0)
            } : null
        };
    }

    // ==========================================
    // API OTOMATISASI LINTAS MODUL (SMART DEDUCTION)
    // ==========================================
    function potongStokOtomatis(namaBarang, jumlahDipotong, modulPengirim, idGh, namaPetugas, satuanInput) {
        var dataBarang = getValidBarangList();
        if (dataBarang.length === 0) return false;

        var targetKw = String(namaBarang || '').toLowerCase().trim();

        var item = dataBarang.find(function(b) {
            return b && b.nama && b.nama.toLowerCase().trim() === targetKw;
        });

        if (!item) {
            item = dataBarang.find(function(b) {
                var bName = String(b.nama || '').toLowerCase().trim();
                return bName.includes(targetKw) || targetKw.includes(bName);
            });
        }

        if (!item && (targetKw.includes('pekatan a') || targetKw.includes('ab mix a') || targetKw === 'a')) {
            item = dataBarang.find(function(b) {
                var bName = String(b.nama || '').toLowerCase();
                return bName.includes('pekatan a') || bName.includes('ab mix a') || (bName.includes('a') && bName.includes('pekatan'));
            });
        }

        if (!item && (targetKw.includes('pekatan b') || targetKw.includes('ab mix b') || targetKw === 'b')) {
            item = dataBarang.find(function(b) {
                var bName = String(b.nama || '').toLowerCase();
                return bName.includes('pekatan b') || bName.includes('ab mix b') || (bName.includes('b') && bName.includes('pekatan'));
            });
        }

        if (!item) {
            console.warn("Gudang: Barang '" + namaBarang + "' tidak ditemukan di inventaris.");
            return false;
        }

        var stokLama = parseFloat(item.stok) || 0;
        var jumlah = parseFloat(jumlahDipotong) || 0;
        var inputSat = String(satuanInput || item.satuan || '').toLowerCase().trim();
        var itemSat = String(item.satuan || '').toLowerCase().trim();

        if ((inputSat === 'ml' || inputSat === 'milliliter') && (itemSat === 'liter' || itemSat === 'l')) {
            jumlah = jumlah / 1000;
        } else if ((inputSat === 'liter' || inputSat === 'l') && (itemSat === 'ml' || itemSat === 'milliliter')) {
            jumlah = jumlah * 1000;
        }

        var stokBaru = Math.max(0, stokLama - jumlah);
        stokBaru = roundNumber(stokBaru);

        item.stok = stokBaru;
        var minStok = parseFloat(item.stokMin) || 0;
        if (stokBaru <= 0) item.status = 'Habis';
        else if (stokBaru <= minStok) item.status = 'Hampir Habis';
        else item.status = 'Aktif';

        Storage.update(getKeyBarang(), item);

        catatMutasi({
            barangId: item.id,
            namaBarang: item.nama,
            jenis: 'Keluar',
            jumlah: roundNumber(jumlah),
            satuan: item.satuan,
            alasan: (t('log_reason_used') || 'Dipakai') + ' ' + (modulPengirim || 'Nutrisi'),
            gh: idGh || '-',
            petugas: namaPetugas || 'Sistem Otomatis',
            tanggal: new Date().toISOString().split('T')[0]
        });

        // CATATAN: Pemakaian stok (konsumsi) TIDAK memicu transaksi keuangan baru.
        // Uangnya sudah tercatat sebagai pengeluaran saat barang ini dibeli/masuk
        // ke gudang (lihat syncToKeuangan()). Kalau konsumsi ikut dicatat lagi ke
        // keuangan, biayanya akan terhitung dobel.

        loadDashboard();
        loadTable();
        loadMutasiLog();

        window.dispatchEvent(new Event('cozycs_data_changed'));
        return true;
    }

    function kembalikanStokOtomatis(namaBarang, jumlahDikembalikan, modulPengirim, idGh, namaPetugas, satuanInput) {
        var dataBarang = getValidBarangList();
        if (dataBarang.length === 0) return false;

        var targetKw = String(namaBarang || '').toLowerCase().trim();

        var item = dataBarang.find(function(b) {
            return b && b.nama && b.nama.toLowerCase().trim() === targetKw;
        });

        if (!item) {
            item = dataBarang.find(function(b) {
                var bName = String(b.nama || '').toLowerCase().trim();
                return bName.includes(targetKw) || targetKw.includes(bName);
            });
        }

        if (!item) {
            console.warn("Gudang: Barang '" + namaBarang + "' tidak ditemukan di inventaris.");
            return false;
        }

        var stokLama = parseFloat(item.stok) || 0;
        var jumlah = parseFloat(jumlahDikembalikan) || 0;
        var inputSat = String(satuanInput || item.satuan || '').toLowerCase().trim();
        var itemSat = String(item.satuan || '').toLowerCase().trim();

        if ((inputSat === 'ml' || inputSat === 'milliliter') && (itemSat === 'liter' || itemSat === 'l')) {
            jumlah = jumlah / 1000;
        } else if ((inputSat === 'liter' || inputSat === 'l') && (itemSat === 'ml' || itemSat === 'milliliter')) {
            jumlah = jumlah * 1000;
        }

        var stokBaru = roundNumber(stokLama + jumlah);

        item.stok = stokBaru;
        var minStok = parseFloat(item.stokMin) || 0;
        if (stokBaru <= 0) item.status = 'Habis';
        else if (stokBaru <= minStok) item.status = 'Hampir Habis';
        else item.status = 'Aktif';

        Storage.update(getKeyBarang(), item);

        catatMutasi({
            barangId: item.id,
            namaBarang: item.nama,
            jenis: 'Masuk',
            jumlah: roundNumber(jumlah),
            satuan: item.satuan,
            alasan: 'Pengembalian Stok (' + (modulPengirim || 'Nutrisi') + ')',
            gh: idGh || '-',
            petugas: namaPetugas || 'Sistem Otomatis',
            tanggal: new Date().toISOString().split('T')[0]
        });

        loadDashboard();
        loadTable();
        loadMutasiLog();

        window.dispatchEvent(new Event('cozycs_data_changed'));
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
    // AUTO-SYNC KE MODUL KEUANGAN (HANYA SAAT BARANG BARU DIBELI/MASUK)
    // ==========================================
    // Dipanggil hanya ketika: (1) barang baru ditambahkan (bukan edit), dan
    // (2) harga satuan > 0. Nilai pembelian = stok awal x harga satuan,
    // dicatat sebagai satu baris transaksi "Pengeluaran" di modul Keuangan,
    // supaya kas usaha otomatis ikut berkurang tanpa perlu input manual dobel.
    function mapKategoriKeKeuangan(kategoriGudang) {
        switch (kategoriGudang) {
            case 'Nutrisi':
                return 'Pembelian Nutrisi / Pupuk';
            case 'Pestisida':
                return 'Pembelian Pestisida / Obatan';
            case 'Peralatan':
            case 'Sparepart':
                return 'Peralatan & Sparepart GH';
            default:
                return 'Lain-Lain';
        }
    }

    function syncToKeuangan(barangItem, stokAwal, hargaSatuan) {
        var nominal = roundNumber(stokAwal) * (parseFloat(hargaSatuan) || 0);
        if (nominal <= 0) return; // Tidak ada biaya tercatat (harga kosong/0), jangan buat transaksi kosong

        if (typeof Storage === 'undefined' || !Storage.add) return;

        var payload = {
            tanggal: barangItem.tglBeli || new Date().toISOString().split('T')[0],
            jenis: 'Pengeluaran',
            kategori: mapKategoriKeKeuangan(barangItem.kategori),
            nominal: roundNumber(nominal),
            gh: 'Seluruh Kebun',
            petugas: 'Admin',
            desc: 'Pembelian ' + barangItem.nama + ' (' + roundNumber(stokAwal) + ' ' + (barangItem.satuan || '') + ') via Gudang',
            sourceModule: 'gudang',
            sourceBarangId: barangItem.id || ''
        };

        Storage.add(getKeyKeuangan(), payload);
    }

    // ==========================================
    // RENDER TAMPILAN UTAMA MODUL
    // ==========================================
    function render() {
        return `
            <div class="dashboard-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div class="section-title" style="margin-bottom: 0;">
                        <i class="fas fa-boxes" style="color: #2E7D32;"></i> ${t('module_title')}
                    </div>
                    <button type="button" onclick="gudang.resetDataGudang()" style="background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                        <i class="fas fa-power-off"></i> Reset Data
                    </button>
                </div>

                <!-- 1. DASHBOARD STATISTIK UTAMA (MODERN CARDS) -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;" id="gudangStatCards">
                    <!-- Dynamic Stat Cards -->
                </div>

                <!-- 2. FORM INPUT MASTER BARANG GUDANG -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #E65100; margin-bottom: 12px;" id="formTitleGudang">${t('form_title_add')}</div>
                    <form id="formGudang">
                        <input type="hidden" id="barangId">

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

                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">${t('lbl_stock_initial')}</label>
                                <input type="number" step="any" id="barangStok" required placeholder="10" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">${t('lbl_unit')}</label>
                                <select id="barangSatuan" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                                    <option value="Liter">Liter</option>
                                    <option value="ml">ml</option>
                                    <option value="Kg">Kg</option>
                                    <option value="Gram">Gram</option>
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

                <!-- 3. REKAP KATALOG STOK GUDANG + TOOLBAR AKSI PENCENTANGAN -->
                <div class="section-title"><i class="fas fa-cubes" style="color: #E65100;"></i> ${t('recap_catalog_title')}</div>

                <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 14px;">
                    <div style="margin-bottom: 10px;">
                        <input type="text" id="inputSearchGudang" 
                               placeholder="${t('ph_search')}" 
                               oninput="gudang.handleSearch(this.value)"
                               value="${searchQuery}"
                               style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color, #ccc); font-size: 13px; box-sizing: border-box; background: var(--card-bg, #fff); color: var(--text-color, #222);">
                    </div>

                    <div style="display: flex; gap: 8px; margin-bottom: 10px; overflow-x: auto;">
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

                    <!-- BILAH AKSI CENTANG MASSAL -->
                    <div style="display: flex; justify-content: space-between; align-items: center; background: var(--inner-card-bg, #f9f9f9); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color, #eee);">
                        <label style="font-size: 12px; font-weight: 600; color: #444; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                            <input type="checkbox" id="chkSelectAllGudang" onchange="gudang.toggleSelectAll(this.checked)" style="width: 16px; height: 16px; accent-color: #2E7D32;">
                            <span>Pilih Semua</span>
                        </label>

                        <button type="button" id="btnHapusTerpilihGudang" onclick="gudang.deleteSelectedItems()" style="display: none; background: #C62828; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; align-items: center; gap: 5px;">
                            <i class="fas fa-trash"></i> Hapus Terpilih (<span id="cntTerpilihGudang">0</span>)
                        </button>
                    </div>
                </div>

                <div id="containerGudangCards"></div>
                <div id="paginationGudangControls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; margin-bottom: 24px; font-size: 12px;"></div>

                <!-- 4. RIWAYAT MUTASI STOK -->
                <div class="section-title"><i class="fas fa-history" style="color: #0277BD;"></i> ${t('recap_mutation_title')}</div>
                <div id="containerMutasiLog"></div>
            </div>
        `;
    }

    function init() {
        loadDashboard();
        loadTable();
        loadMutasiLog();

        if (typeof restoreFormDraftGlobal === 'function') {
            restoreFormDraftGlobal('formGudang');
        }

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
                var stok = roundNumber(getVal('barangStok'));
                var satuan = getVal('barangSatuan');
                var stokMin = roundNumber(getVal('barangStokMin'));
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
                    // Catatan: EDIT barang (misal cuma ganti lokasi/stok min) TIDAK
                    // memicu transaksi keuangan baru, supaya tidak dobel catat.
                    // Kalau memang ada pembelian ulang/restock, disarankan pakai
                    // "Tambah Master Barang Gudang" baru, bukan edit yang sudah ada.
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

                    // --- AUTO-SYNC KE KEUANGAN: catat pengeluaran pembelian barang ---
                    syncToKeuangan(added, stok, harga);
                }

                if (typeof Storage !== 'undefined' && Storage.add) {
                    var keyAktivitas = (Storage.KEYS && Storage.KEYS.AKTIVITAS) ? Storage.KEYS.AKTIVITAS : 'cozycs_aktivitas';
                    var now = new Date();
                    var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
                    
                    Storage.add(keyAktivitas, {
                        judul: id ? 'Perbarui Barang Gudang' : 'Restock / Input Gudang',
                        deskripsi: nama + ' (' + stok + ' ' + satuan + ') - ' + (kategori || 'Inventaris'),
                        tanggal: tglBeli || now.toISOString().split('T')[0],
                        jam: timeStr,
                        kategori: 'Gudang',
                        icon: 'fas fa-boxes',
                        color: '#E65100'
                    });
                }

                if (typeof Helper !== 'undefined' && Helper.showToast) {
                    var pesanToast = t('toast_saved');
                    if (!id && harga > 0) {
                        pesanToast += ' Pengeluaran otomatis tercatat di Keuangan.';
                    }
                    Helper.showToast(pesanToast, 'success');
                }

                form.reset();
                setVal('barangId', '');
                var titleEl = document.getElementById('formTitleGudang');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadDashboard();
                loadTable();
                loadMutasiLog();

                window.dispatchEvent(new Event('cozycs_data_changed'));
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

    // ==========================================
    // REKAP DASBOR & KARTU STATISTIK TAMPILAN MODERN
    // ==========================================
    function loadDashboard() {
        var container = document.getElementById('gudangStatCards');
        if (!container) return;

        var data = getValidBarangList();

        var totalJenis = data.length;
        var nilaiPersediaan = 0;
        var stokKritis = 0;
        var expiredSoon = 0;

        var today = new Date();

        data.forEach(function(item) {
            var stok = roundNumber(item.stok);
            var harga = parseFloat(item.harga) || 0;
            var stokMin = roundNumber(item.stokMin);

            // Hanya hitung jika stok dan harga bernilai positif valid
            if (stok > 0 && harga > 0) {
                nilaiPersediaan += (stok * harga);
            }

            if (stok <= stokMin) stokKritis++;

            if (item.expired && item.expired !== '-') {
                var expDate = new Date(item.expired);
                var diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
                if (diffDays <= 30 && diffDays >= 0) expiredSoon++;
            }
        });

        var formatRupiah = function(val) {
            return 'Rp' + Math.round(val).toLocaleString('id-ID');
        };

        container.innerHTML = `
            <div style="background: linear-gradient(135deg, #ffffff 0%, #f4fbf7 100%); padding: 14px 16px; border-radius: 14px; border: 1px solid #d4edda; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px;">${t('stat_total_items')}</div>
                        <div style="font-size: 18px; font-weight: 800; color: #2E7D32; margin-top: 4px;">${totalJenis} <span style="font-size: 12px; font-weight: 600;">${t('unit_types')}</span></div>
                    </div>
                    <div style="background: #E8F5E9; color: #2E7D32; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px;">
                        <i class="fas fa-boxes"></i>
                    </div>
                </div>
            </div>

            <div style="background: linear-gradient(135deg, #ffffff 0%, #f2f9ff 100%); padding: 14px 16px; border-radius: 14px; border: 1px solid #cce5ff; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px;">${t('stat_inventory_value')}</div>
                        <div style="font-size: 17px; font-weight: 800; color: #0277BD; margin-top: 4px;">${formatRupiah(nilaiPersediaan)}</div>
                    </div>
                    <div style="background: #E1F5FE; color: #0277BD; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px;">
                        <i class="fas fa-wallet"></i>
                    </div>
                </div>
            </div>

            <div style="background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%); padding: 14px 16px; border-radius: 14px; border: 1px solid #ffcdd2; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px;">${t('stat_critical_stock')}</div>
                        <div style="font-size: 18px; font-weight: 800; color: #C62828; margin-top: 4px;">${stokKritis} <span style="font-size: 12px; font-weight: 600;">${t('unit_items')}</span></div>
                    </div>
                    <div style="background: #FFEBEE; color: #C62828; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px;">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                </div>
            </div>

            <div style="background: linear-gradient(135deg, #ffffff 0%, #fffde7 100%); padding: 14px 16px; border-radius: 14px; border: 1px solid #fff9c4; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px;">${t('stat_expired_soon')}</div>
                        <div style="font-size: 18px; font-weight: 800; color: #F57F17; margin-top: 4px;">${expiredSoon} <span style="font-size: 12px; font-weight: 600;">${t('unit_items')}</span></div>
                    </div>
                    <div style="background: #FFFDE7; color: #F57F17; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px;">
                        <i class="fas fa-hourglass-half"></i>
                    </div>
                </div>
            </div>
        `;
    }

    // ==========================================
    // REKAP TABEL KATALOG BARANG
    // ==========================================
    function loadTable() {
        var container = document.getElementById('containerGudangCards');
        var pageEl = document.getElementById('paginationGudangControls');
        if (!container) return;

        var data = getValidBarangList();

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data_stock')}</div>`;
            if (pageEl) pageEl.innerHTML = '';
            return;
        }

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

            var stok = roundNumber(item.stok);
            var stokMin = roundNumber(item.stokMin);
            var isKritis = stok <= stokMin;

            var isExpiredSoon = false;
            if (item.expired && item.expired !== '-') {
                var expDate = new Date(item.expired);
                var diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
                if (diffDays <= 30 && diffDays >= 0) isExpiredSoon = true;
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

        var totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        var pageData = filteredData.slice(startIndex, endIndex);

        var html = '';
        pageData.forEach(function(item) {
            var stok = roundNumber(item.stok);
            var stokMin = roundNumber(item.stokMin);
            var isKritis = stok <= stokMin;

            var badgeBg = isKritis ? '#FFEBEE' : '#E8F5E9';
            var badgeColor = isKritis ? '#C62828' : '#2E7D32';
            var badgeText = isKritis ? t('badge_restock') : t('badge_safe');
            var isChecked = selectedItemIds.includes(item.id);

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" onchange="gudang.toggleSelectItem('${item.id}', this.checked)" ${isChecked ? 'checked' : ''} style="width: 17px; height: 17px; accent-color: #2E7D32; cursor: pointer;">
                            <div>
                                <strong style="font-size: 15px; color: var(--text-color, #222);">${item.nama}</strong>
                                <span style="font-size: 10px; background: var(--inner-card-bg, #F5F5F5); color: #666; padding: 2px 6px; border-radius: 4px; margin-left: 4px; font-weight: 600;">${item.kategori}</span>
                            </div>
                        </div>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: bold;">${badgeText}</span>
                    </div>

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

                    <div style="font-size: 11px; color: #777; margin-bottom: 6px; line-height: 1.5;">
                        <div><i class="fas fa-map-marker-alt" style="color: #E65100; width: 14px;"></i> ${t('lbl_location_card')} <strong>${item.lokasi || t('default_location')}</strong></div>
                        <div><i class="fas fa-truck" style="color: #0277BD; width: 14px;"></i> ${t('lbl_supplier_card')} <strong>${item.supplier || '-'}</strong> | ${t('lbl_brand_card')} <strong>${item.merek || '-'}</strong></div>
                        ${item.expired && item.expired !== '-' ? `<div><i class="fas fa-hourglass-half" style="color: #C62828; width: 14px;"></i> ${t('lbl_expired_card')} <strong>${item.expired}</strong></div>` : ''}
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                        <span onclick="gudang.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i> Edit</span>
                        <span onclick="gudang.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i> Hapus</span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

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

        updateBulkActionBarUI();
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
            var jumlahFormatted = roundNumber(m.jumlah);
            html += `
                <div style="background: var(--card-bg, #fff); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color, #eee); margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                    <div>
                        <strong style="color: var(--text-color, #222);">${m.namaBarang}</strong> <span style="color: #777;">(${m.alasan})</span>
                        <div style="font-size: 10px; color: #888;">${m.tanggal} | ${m.gh || 'Gudang'} | ${t('log_by')} ${m.petugas || 'Sistem'}</div>
                    </div>
                    <div style="font-weight: bold; color: ${isMasuk ? '#2E7D32' : '#C62828'}; font-size: 13px;">
                        ${isMasuk ? '+' : '-'}${jumlahFormatted} ${m.satuan}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // ==========================================
    // LOGIKA CENTANG & HAPUS MASSAL (BULK DELETE)
    // ==========================================
    function toggleSelectItem(id, isChecked) {
        if (isChecked) {
            if (!selectedItemIds.includes(id)) selectedItemIds.push(id);
        } else {
            selectedItemIds = selectedItemIds.filter(function(i) { return i !== id; });
        }
        updateBulkActionBarUI();
    }

    function toggleSelectAll(isChecked) {
        var data = getValidBarangList();
        if (isChecked) {
            selectedItemIds = data.map(function(item) { return item.id; });
        } else {
            selectedItemIds = [];
        }
        loadTable();
    }

    function updateBulkActionBarUI() {
        var btnHapus = document.getElementById('btnHapusTerpilihGudang');
        var cntSpan = document.getElementById('cntTerpilihGudang');
        var chkAll = document.getElementById('chkSelectAllGudang');

        if (cntSpan) cntSpan.innerText = selectedItemIds.length;

        if (btnHapus) {
            btnHapus.style.display = selectedItemIds.length > 0 ? 'inline-flex' : 'none';
        }

        if (chkAll) {
            var data = getValidBarangList();
            chkAll.checked = data.length > 0 && selectedItemIds.length === data.length;
        }
    }

    function deleteSelectedItems() {
        if (selectedItemIds.length === 0) return;

        if (confirm('Apakah kamu yakin ingin menghapus ' + selectedItemIds.length + ' barang yang dicentang dari gudang?')) {
            if (typeof Storage !== 'undefined' && Storage.remove) {
                selectedItemIds.forEach(function(id) {
                    Storage.remove(getKeyBarang(), id);
                });
            }
            selectedItemIds = [];
            loadDashboard();
            loadTable();
            window.dispatchEvent(new Event('cozycs_data_changed'));

            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast(t('toast_deleted'), 'error');
            }
        }
    }

    // ==========================================
    // LOGIKA RESET TOTAL DATA GUDANG
    // ==========================================
    function resetDataGudang() {
        var confirmKey = prompt("PERINGATAN: Semua data master barang & mutasi gudang akan dihapus permanen!\n\nKetik 'RESET' untuk mengonfirmasi:");
        if (confirmKey === 'RESET') {
            if (typeof Storage !== 'undefined' && Storage.saveAll) {
                Storage.saveAll(getKeyBarang(), []);
                Storage.saveAll(getKeyMutasi(), []);
            }
            selectedItemIds = [];
            loadDashboard();
            loadTable();
            loadMutasiLog();
            window.dispatchEvent(new Event('cozycs_data_changed'));

            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast('Seluruh data gudang berhasil di-reset!', 'success');
            } else {
                alert('Seluruh data gudang berhasil di-reset!');
            }
        } else if (confirmKey !== null) {
            alert('Konfirmasi batal. Kata kunci yang dimasukkan salah.');
        }
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
        setVal('barangStok', roundNumber(item.stok));
        setVal('barangSatuan', item.satuan || 'Liter');
        setVal('barangStokMin', roundNumber(item.stokMin));
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
            selectedItemIds = selectedItemIds.filter(function(i) { return i !== id; });
            loadDashboard();
            loadTable();
            window.dispatchEvent(new Event('cozycs_data_changed'));
            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast(t('toast_deleted'), 'error');
            }
        }
    }

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
        kembalikanStokOtomatis: kembalikanStokOtomatis,
        getStokPekatan: getStokPekatan,
        handleSearch: handleSearch,
        handleCategoryFilter: handleCategoryFilter,
        handleStatusFilter: handleStatusFilter,
        changePage: changePage,
        toggleSelectItem: toggleSelectItem,
        toggleSelectAll: toggleSelectAll,
        deleteSelectedItems: deleteSelectedItems,
        resetDataGudang: resetDataGudang
    };

})();

window.gudang = gudang;
