// ==========================================
// COZYCS FARM - MODUL MANAJEMEN GREENHOUSE (CRUD)
// ==========================================

var greenhouse = (function() {

    function getKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GREENHOUSE) {
            return Storage.KEYS.GREENHOUSE;
        }
        return 'cozycs_greenhouse';
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val;
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-warehouse" style="color: #2E7D32;"></i> Master Data Greenhouse</div>
                
                <!-- Form Input / Edit Data Greenhouse -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;" id="formTitleGh">Registrasi Data Greenhouse</div>
                    <form id="formGh">
                        <input type="hidden" id="ghId">
                        
                        <!-- Kode & Nama GH -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Kode GH</label>
                                <input type="text" id="ghKode" required placeholder="Contoh: GH-01" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Nama Greenhouse</label>
                                <input type="text" id="ghNama" required placeholder="Contoh: GH Utama Intanon" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Status Operasional & Tipe Hidroponik -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Status Operasional</label>
                                <select id="ghStatus" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Aktif / Berjalan">Aktif / Berjalan</option>
                                    <option value="Persiapan / Sterilisasi">Persiapan / Sterilisasi</option>
                                    <option value="Masa Rehat / Kosong">Masa Rehat / Kosong</option>
                                    <option value="Perawatan / Perbaikan">Perawatan / Perbaikan</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tipe Sistem</label>
                                <select id="ghSistem" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Fertigasi Tetes / Drip">Fertigasi Tetes / Drip</option>
                                    <option value="Dutch Bucket">Dutch Bucket</option>
                                    <option value="NFT / DFT">NFT / DFT</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                        </div>

                        <!-- Kapasitas & Dimensi Fisik -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Jumlah Talang / Line</label>
                                <input type="number" id="ghTalang" placeholder="Contoh: 10" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Total Lubang Tanam</label>
                                <input type="number" id="ghLubang" placeholder="Contoh: 250" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Luas Area (m²)</label>
                                <input type="number" id="ghLuas" placeholder="Contoh: 200" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Kapasitas Tandon (Liter)</label>
                                <input type="number" id="ghTandon" placeholder="Contoh: 1000" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Spesifikasi Atap & Jaring -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Plastik UV</label>
                                <input type="text" id="ghUv" placeholder="Contoh: UV 14% Vatan" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Insect Net</label>
                                <input type="text" id="ghInsect" placeholder="Contoh: 40 Mesh" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Tanggal Operasi & Periode Tanam -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Operasi GH</label>
                            <input type="date" id="ghTglOperasi" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Tanam Perdana</label>
                                <input type="date" id="ghTglTanam" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Target Tanggal Panen</label>
                                <input type="date" id="ghTglPanen" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan GH</label>
                            <textarea id="ghDesc" rows="2" placeholder="Catatan fasilitas, sterilisasi, perbaikan..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #2E7D32;"><i class="fas fa-save"></i> Simpan Data GH</button>
                            <button type="button" id="btnCancelGhEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data / Card List Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #2E7D32;"></i> Daftar & Status Greenhouse</div>
                <div id="containerGhCards">
                    <!-- Diisi dinamis oleh JavaScript -->
                </div>
            </div>
        `;
    }

    function init() {
        loadTable();

        var form = document.getElementById('formGh');
        var btnCancel = document.getElementById('btnCancelGhEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('ghId');
                var kode = getVal('ghKode');
                var nama = getVal('ghNama');
                var status = getVal('ghStatus');
                var sistem = getVal('ghSistem');
                var talang = getVal('ghTalang');
                var lubang = getVal('ghLubang');
                var luas = getVal('ghLuas');
                var tandon = getVal('ghTandon');
                var uv = getVal('ghUv');
                var insect = getVal('ghInsect');
                var tglOperasi = getVal('ghTglOperasi');
                var tglTanam = getVal('ghTglTanam');
                var tglPanen = getVal('ghTglPanen');
                var desc = getVal('ghDesc');

                var payload = {
                    kode: kode || '-',
                    nama: nama || '-',
                    status: status || 'Aktif / Berjalan',
                    sistem: sistem || 'Fertigasi Tetes / Drip',
                    talang: talang || '-',
                    lubang: lubang || '-',
                    luas: luas || '-',
                    tandon: tandon || '-',
                    uv: uv || '-',
                    insect: insect || '-',
                    tglOperasi: tglOperasi || '-',
                    tglTanam: tglTanam || '-',
                    tglPanen: tglPanen || '-',
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
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('ghId', '');
                var titleEl = document.getElementById('formTitleGh');
                if (titleEl) titleEl.innerText = 'Registrasi Data Greenhouse';
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('ghId', '');
                var titleEl = document.getElementById('formTitleGh');
                if (titleEl) titleEl.innerText = 'Registrasi Data Greenhouse';
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerGhCards');
        if (!container) return;

        var data = [];
        try {
            var storageKey = getKey();
            if (typeof Storage !== 'undefined' && Storage.getAll) {
                data = Storage.getAll(storageKey) || [];
            }
        } catch(e) {
            data = [];
        }

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada data greenhouse tercatat.</div>`;
            return;
        }

        var html = '';
        data.forEach(function(item) {
            if (!item) return;
            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card: Kode GH & Status -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 15px; color: #2E7D32;">${item.kode || '-'}</strong>
                            <span style="font-size: 13px; font-weight: 600; color: #333; margin-left: 6px;">${item.nama || '-'}</span>
                        </div>
                        <span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">${item.status || '-'}</span>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Kapasitas & Sistem -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Kapasitas & Sistem</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-th" style="color: #0277BD; width: 14px;"></i> <strong>${item.talang || '-'} Talang / ${item.lubang || '-'} Lubang</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-cogs" style="color: #E65100; width: 14px;"></i> <strong>${item.sistem || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Dimensi & Infrastruktur -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Dimensi & Fasilitas</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-ruler-combined" style="color: #388E3C; width: 14px;"></i> <strong>${item.luas || '-'} m² | ${item.tandon || '-'}L Tandon</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-shield-alt" style="color: #6A1B9A; width: 14px;"></i> <strong>${item.uv || '-'} | ${item.insect || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Tanggal Operasi -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Tanggal Operasi</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-calendar-check" style="color: #2E7D32; width: 14px;"></i> <strong>Beroperasi: ${item.tglOperasi || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Siklus Tanam & Panen -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Siklus Tanam</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-seedling" style="color: #F57F17; width: 14px;"></i> <strong>Tanam: ${item.tglTanam || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-shopping-basket" style="color: #C62828; width: 14px;"></i> <strong>Target: ${item.tglPanen || '-'}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan -->
                    ${item.desc ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${item.desc}</div>` : ''}

                    <!-- Tombol Aksi -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #eee; padding-top: 8px; margin-top: 4px;">
                        <span onclick="greenhouse.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="greenhouse.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function editItem(id) {
        var storageKey = getKey();
        var item = null;
        try {
            if (typeof Storage !== 'undefined' && Storage.getById) {
                item = Storage.getById(storageKey, id);
            }
        } catch(e) {}

        if (!item) return;

        setVal('ghId', item.id || '');
        setVal('ghKode', item.kode === '-' ? '' : (item.kode || ''));
        setVal('ghNama', item.nama === '-' ? '' : (item.nama || ''));
        setVal('ghStatus', item.status || 'Aktif / Berjalan');
        setVal('ghSistem', item.sistem || 'Fertigasi Tetes / Drip');
        setVal('ghTalang', item.talang === '-' ? 
