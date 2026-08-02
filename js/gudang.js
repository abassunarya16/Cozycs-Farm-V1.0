// ==========================================
// COZYCS FARM - MODUL PUSAT INVENTARIS & GUDANG (ERP)
// ==========================================

var gudang = (function() {

    function getKeyBarang() {
        return (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GUDANG) ? Storage.KEYS.GUDANG : 'cozycs_gudang';
    }

    function getKeyMutasi() {
        return 'cozycs_gudang_mutasi';
    }

    function getKeySupplier() {
        return 'cozycs_supplier';
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
    // API OTOMATISASI LINTAS MODUL (DIPANGGIL NUTRISI/SPRAY/TANAMAN)
    // ==========================================
    function potongStokOtomatis(namaBarang, jumlahDipotong, modulPengirim, idGh, namaPetugas) {
        var dataBarang = Storage.getAll(getKeyBarang()) || [];
        var item = dataBarang.find(function(b) {
            return b.nama.toLowerCase().trim() === namaBarang.toLowerCase().trim();
        });

        if (!item) {
            console.warn("Gudang: Barang '" + namaBarang + "' tidak ditemukan di inventaris.");
            return false;
        }

        var stokLama = parseFloat(item.stok) || 0;
        var jumlah = parseFloat(jumlahDipotong) || 0;
        var stokBaru = Math.max(0, stokLama - jumlah);

        // Update Stok
        item.stok = stokBaru;
        if (stokBaru <= 0) item.status = 'Habis';
        else if (stokBaru <= (parseFloat(item.stokMin) || 0)) item.status = 'Hampir Habis';
        else item.status = 'Aktif';

        Storage.update(getKeyBarang(), item);

        // Catat Mutasi
        catatMutasi({
            barangId: item.id,
            namaBarang: item.nama,
            jenis: 'Keluar',
            jumlah: jumlah,
            satuan: item.satuan,
            alasan: 'Dipakai ' + modulPengirim,
            gh: idGh || '-',
            petugas: namaPetugas || 'Sistem Otomatis',
            tanggal: new Date().toISOString().split('T')[0]
        });

        loadTable();
        return true;
    }

    function catatMutasi(payload) {
        var list = Storage.getAll(getKeyMutasi()) || [];
        payload.id = 'MUT-' + Date.now();
        list.unshift(payload);
        Storage.saveAll(getKeyMutasi(), list);
    }

    // ==========================================
    // RENDER TAMPILAN
    // ==========================================
    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-boxes" style="color: #E65100;"></i> Pusat Inventaris & Gudang Cozycs Farm</div>

                <!-- 1. DASHBOARD STATISTIK UTAMA (4 STAT CARDS) -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;" id="gudangStatCards">
                    <!-- Dynamic Stat Cards -->
                </div>

                <!-- 2. PENCARIAN & FILTER KATEGORI -->
                <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 16px;">
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <input type="text" id="gudangSearch" onkeyup="gudang.loadTable()" placeholder="🔍 Cari nama barang / merek..." style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px;">
                    </div>
                    <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;">
                        <select id="gudangFilterKategori" onchange="gudang.loadTable()" style="padding: 6px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 12px; background: #fff;">
                            <option value="">Semua Kategori</option>
                            <option value="Nutrisi">Nutrisi</option>
                            <option value="Pestisida">Pestisida</option>
                            <option value="Benih">Benih</option>
                            <option value="Rockwool">Rockwool</option>
                            <option value="Netpot">Netpot</option>
                            <option value="Peralatan">Peralatan</option>
                            <option value="Sparepart">Sparepart</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                        <select id="gudangFilterStatus" onchange="gudang.loadTable()" style="padding: 6px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 12px; background: #fff;">
                            <option value="">Semua Status</option>
                            <option value="KRITIS">Perlu Restock / Kritis</option>
                            <option value="EXPIRED">Hampir Expired</option>
                        </select>
                    </div>
                </div>

                <!-- 3. FORM INPUT MASTER BARANG -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #E65100; margin-bottom: 12px;" id="formTitleGudang">Tambah Master Barang Gudang</div>
                    <form id="formGudang">
                        <input type="hidden" id="barangId">

                        <!-- Tanggal & Kategori -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Beli / Masuk</label>
                                <input type="date" id="barangTglBeli" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Kategori</label>
                                <select id="barangKategori" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Nutrisi">Nutrisi</option>
                                    <option value="Pestisida">Pestisida</option>
                                    <option value="Benih">Benih</option>
                                    <option value="Rockwool">Rockwool</option>
                                    <option value="Netpot">Netpot</option>
                                    <option value="Tali">Tali</option>
                                    <option value="Plastik UV">Plastik UV</option>
                                    <option value="Insect Net">Insect Net</option>
                                    <option value="Peralatan">Peralatan</option>
                                    <option value="Sparepart">Sparepart</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                        </div>

                        <!-- Nama Barang & Merek -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Nama Barang</label>
                                <input type="text" id="barangNama" required placeholder="Contoh: AB Mix A" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Merek / Produsen</label>
                                <input type="text" id="barangMerek" placeholder="Contoh: Meroke" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Stok, Satuan & Stok Min -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">Stok Awal</label>
                                <input type="number" step="any" id="barangStok" required placeholder="10" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 11px; font-weight: 600; color: #555;">Satuan</label>
                                <select id="barangSatuan" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
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
                                <label style="font-size: 11px; font-weight: 600; color: #555;">Stok Min</label>
                                <input type="number" step="any" id="barangStokMin" placeholder="2" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Harga Beli & Supplier -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Harga Satuan (Rp)</label>
                                <input type="number" id="barangHarga" placeholder="Contoh: 125000" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Supplier / Toko</label>
                                <input type="text" id="barangSupplier" placeholder="Contoh: Tokopedia / PT XYZ" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Lokasi Spesifik, No Batch, Tgl Expired -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Lokasi Penyimpanan</label>
                                <input type="text" id="barangLokasi" placeholder="Contoh: Rak A - Box 02" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">No Batch / Expired</label>
                                <input type="date" id="barangExpired" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan Barang</label>
                            <textarea id="barangDesc" rows="2" placeholder="Nomor batch, dosis rekomendasi, dll..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #E65100; color:#fff; border:none; padding:10px; border-radius:8px; font-weight:bold;"><i class="fas fa-save"></i> Simpan Inventaris</button>
                            <button type="button" id="btnCancelGudangEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- 4. REKAP KATALOG STOK GUDANG -->
                <div class="section-title"><i class="fas fa-cubes" style="color: #E65100;"></i> Katalog Stok & Persediaan</div>
                <div id="containerGudangCards"></div>

                <!-- 5. RIWAYAT MUTASI STOK (LOG AUDIT) -->
                <div class="section-title" style="margin-top:24px;"><i class="fas fa-history" style="color: #0277BD;"></i> Riwayat Mutasi (Masuk & Keluar)</div>
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
                    lokasi: lokasi || 'Gudang Utama',
                    expired: expired || '-',
                    desc: desc,
                    status: status
                };

                var key = getKeyBarang();
                if (id) {
                    payload.id = id;
                    Storage.update(key, payload);
                } else {
                    var added = Storage.add(key, payload);
                    // Catat Log Mutasi Masuk Awal
                    catatMutasi({
                        barangId: added.id,
                        namaBarang: nama,
                        jenis: 'Masuk',
                        jumlah: stok,
                        satuan: satuan,
                        alasan: 'Stok Awal / Pembelian',
                        gh: 'Gudang Utama',
                        petugas: 'Admin',
                        tanggal: tglBeli || new Date().toISOString().split('T')[0]
                    });
                }

                form.reset();
                setVal('barangId', '');
                var titleEl = document.getElementById('formTitleGudang');
                if (titleEl) titleEl.innerText = 'Tambah Master Barang Gudang';
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
                if (titleEl) titleEl.innerText = 'Tambah Master Barang Gudang';
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadDashboard() {
        var container = document.getElementById('gudangStatCards');
        if (!container) return;

        var data = Storage.getAll(getKeyBarang()) || [];
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

        container.innerHTML = `
            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e8e8e8;">
                <div style="font-size: 10px; color: #777; font-weight: 600;">TOTAL ITEM</div>
                <div style="font-size: 16px; font-weight: bold; color: #222;">${totalJenis} Jenis</div>
            </div>
            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e8e8e8;">
                <div style="font-size: 10px; color: #777; font-weight: 600;">NILAI PERSEDIAAN</div>
                <div style="font-size: 14px; font-weight: bold; color: #2E7D32;">${formatRupiah(nilaiPersediaan)}</div>
            </div>
            <div style="background: ${stokKritis > 0 ? '#FFEBEE' : '#fff'}; padding: 12px; border-radius: 10px; border: 1px solid ${stokKritis > 0 ? '#FFCDD2' : '#e8e8e8'};">
                <div style="font-size: 10px; color: ${stokKritis > 0 ? '#C62828' : '#777'}; font-weight: 600;">STOK KRITIS</div>
                <div style="font-size: 16px; font-weight: bold; color: ${stokKritis > 0 ? '#C62828' : '#222'};">${stokKritis} Barang</div>
            </div>
            <div style="background: ${expiredSoon > 0 ? '#FFF3E0' : '#fff'}; padding: 12px; border-radius: 10px; border: 1px solid ${expiredSoon > 0 ? '#FFE0B2' : '#e8e8e8'};">
                <div style="font-size: 10px; color: ${expiredSoon > 0 ? '#E65100' : '#777'}; font-weight: 600;">EXPIRED SOON</div>
                <div style="font-size: 16px; font-weight: bold; color: ${expiredSoon > 0 ? '#E65100' : '#222'};">${expiredSoon} Barang</div>
            </div>
        `;
    }

    function loadTable() {
        var container = document.getElementById('containerGudangCards');
        if (!container) return;

        var data = Storage.getAll(getKeyBarang()) || [];
        var search = (getVal('gudangSearch') || '').toLowerCase();
        var filterKat = getVal('gudangFilterKategori');
        var filterStat = getVal('gudangFilterStatus');

        var filtered = data.filter(function(item) {
            var matchSearch = (item.nama || '').toLowerCase().includes(search) || (item.merek || '').toLowerCase().includes(search);
            var matchKat = !filterKat || item.kategori === filterKat;
            
            var stok = parseFloat(item.stok) || 0;
            var stokMin = parseFloat(item.stokMin) || 0;
            var isKritis = stok <= stokMin;

            var matchStat = true;
            if (filterStat === 'KRITIS') matchStat = isKritis;

            return matchSearch && matchKat && matchStat;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Tidak ada data stok inventaris.</div>`;
            return;
        }

        var html = '';
        filtered.forEach(function(item) {
            var stok = parseFloat(item.stok) || 0;
            var stokMin = parseFloat(item.stokMin) || 0;
            var isKritis = stok <= stokMin;

            var badgeBg = isKritis ? '#FFEBEE' : '#E8F5E9';
            var badgeColor = isKritis ? '#C62828' : '#2E7D32';
            var badgeText = isKritis ? '⚠ PERLU RESTOCK' : 'STOK AMAN';

            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 15px; color: #222;">${item.nama}</strong>
                            <span style="font-size: 11px; background: #F5F5F5; color: #666; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">${item.kategori}</span>
                        </div>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: bold;">${badgeText}</span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px;">
                            <div style="font-size: 10px; color: #777; font-weight: 600;">SISA STOK</div>
                            <div style="font-size: 14px; font-weight: bold; color: ${isKritis ? '#C62828' : '#000'};">
                                ${stok} ${item.satuan} <span style="font-size:10px; font-weight:normal; color:#777;">(Min: ${stokMin})</span>
                            </div>
                        </div>
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px;">
                            <div style="font-size: 10px; color: #777; font-weight: 600;">HARGA & VALUE</div>
                            <div style="font-size: 12px; font-weight: bold; color: #2E7D32;">
                                Rp${(item.harga || 0).toLocaleString('id-ID')} / ${item.satuan}
                            </div>
                        </div>
                    </div>

                    <div style="font-size: 11px; color: #555; margin-bottom: 6px; line-height: 1.5;">
                        <div><i class="fas fa-map-marker-alt" style="color: #E65100; width: 14px;"></i> Lokasi: <strong>${item.lokasi || 'Gudang Utama'}</strong></div>
                        <div><i class="fas fa-truck" style="color: #0277BD; width: 14px;"></i> Supplier: <strong>${item.supplier || '-'}</strong> | Merek: <strong>${item.merek || '-'}</strong></div>
                        ${item.expired && item.expired !== '-' ? `<div><i class="fas fa-hourglass-half" style="color: #C62828; width: 14px;"></i> Expired: <strong>${item.expired}</strong></div>` : ''}
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #eee; padding-top: 8px; margin-top: 4px;">
                        <span onclick="gudang.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="gudang.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function loadMutasiLog() {
        var container = document.getElementById('containerMutasiLog');
        if (!container) return;

        var logs = Storage.getAll(getKeyMutasi()) || [];

        if (logs.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 12px; background: #fff; border-radius: 8px; font-size: 12px;">Belum ada riwayat mutasi stok.</div>`;
            return;
        }

        var html = '';
        logs.slice(0, 10).forEach(function(m) {
            var isMasuk = m.jenis === 'Masuk';
            html += `
                <div style="background: #fff; padding: 8px 12px; border-radius: 8px; border: 1px solid #eee; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                    <div>
                        <strong>${m.namaBarang}</strong> <span style="color: #777;">(${m.alasan})</span>
                        <div style="font-size: 10px; color: #999;">${m.tanggal} | ${m.gh || 'Gudang'} | Oleh: ${m.petugas || 'Sistem'}</div>
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
        setVal('barangLokasi', item.lokasi === 'Gudang Utama' ? '' : item.lokasi);
        setVal('barangExpired', item.expired === '-' ? '' : item.expired);
        setVal('barangDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleGudang');
        if (titleEl) titleEl.innerText = 'Edit Master Barang Gudang';

        var btnCancel = document.getElementById('btnCancelGudangEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm('Apakah kamu yakin ingin menghapus barang ini dari inventaris?')) {
            Storage.remove(getKeyBarang(), id);
            loadDashboard();
            loadTable();
        }
    }

    return {
        render: render,
        init: init,
        loadTable: loadTable,
        editItem: editItem,
        deleteItem: deleteItem,
        potongStokOtomatis: potongStokOtomatis
    };

})();
