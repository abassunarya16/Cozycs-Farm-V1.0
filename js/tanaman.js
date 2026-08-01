// ==========================================
// COZYCS FARM - MODUL MANAJEMEN TANAMAN (CRUD)
// ==========================================

var tanaman = (function() {

    // Helper internal kunci penyimpanan agar aman & anti-crash
    function getStorageKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.TANAMAN) {
            return Storage.KEYS.TANAMAN;
        }
        return 'cozycs_tanaman';
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-seedling" style="color: #2E7D32;"></i> Monitoring & Data Tanaman</div>
                
                <!-- Form Input / Edit Data Tanaman -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;" id="formTitleTanaman">Catat Perkembangan Tanaman</div>
                    <form id="formTanaman">
                        <input type="hidden" id="tanamanId">
                        
                        <!-- 1. Tanggal Pelaksanaan -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Monitoring</label>
                            <input type="date" id="tanamanDate" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                        </div>

                        <!-- 2. Varietas & Lokasi Block -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Varietas Melon</label>
                                <input type="text" id="tanamanVarietas" required placeholder="Contoh: Intanon / Sweet Net" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Blok / Row Bedengan</label>
                                <input type="text" id="tanamanBlok" placeholder="Contoh: Blok A - Line 1" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 3. Populasi (Tanaman Hidup & Mati/Sulam) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Jumlah Tanaman Hidup</label>
                                <input type="number" id="tanamanHidup" placeholder="Contoh: 250" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanaman Mati / Sulam</label>
                                <input type="number" id="tanamanMati" placeholder="Contoh: 3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 4. Pertumbuhan Vegetatif (Tinggi & Jumlah Daun) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Rata-rata Tinggi (cm)</label>
                                <input type="text" id="tanamanTinggi" placeholder="Contoh: 120 cm" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Rata-rata Jumlah Daun</label>
                                <input type="text" id="tanamanDaun" placeholder="Contoh: 15 Helai" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- 5. Status Generatif & Kesehatan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Jumlah Buah / Polinasi</label>
                                <input type="text" id="tanamanBuah" placeholder="Contoh: 200 Buah Jadi" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Kondisi Vigor Umum</label>
                                <select id="tanamanVigor" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Sangat Sehat & Vigour">Sangat Sehat & Vigour</option>
                                    <option value="Normal / Cukup Baik">Normal / Cukup Baik</option>
                                    <option value="Terserang Hama Ringan">Terserang Hama Ringan</option>
                                    <option value="Perlu Perhatian Khusus">Perlu Perhatian Khusus</option>
                                </select>
                            </div>
                        </div>

                        <!-- 6. Catatan Tambahan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan Perkembangan (Opsional)</label>
                            <textarea id="tanamanDesc" rows="2" placeholder="Catatan kondisi tajuk, pruning cabang, seleksi buah..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #2E7D32;"><i class="fas fa-save"></i> Simpan Data Tanaman</button>
                            <button type="button" id="btnCancelTanamanEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data / Card List Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #2E7D32;"></i> Rekap Data & Perkembangan Tanaman</div>
                <div id="containerTanamanCards">
                    <!-- Diisi dinamis oleh JavaScript -->
                </div>
            </div>
        `;
    }

    function init() {
        loadTable();

        var form = document.getElementById('formTanaman');
        var btnCancel = document.getElementById('btnCancelTanamanEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var idEl = document.getElementById('tanamanId');
                var dateEl = document.getElementById('tanamanDate');
                var varietasEl = document.getElementById('tanamanVarietas');
                var blokEl = document.getElementById('tanamanBlok');
                var hidupEl = document.getElementById('tanamanHidup');
                var matiEl = document.getElementById('tanamanMati');
                var tinggiEl = document.getElementById('tanamanTinggi');
                var daunEl = document.getElementById('tanamanDaun');
                var buahEl = document.getElementById('tanamanBuah');
                var vigorEl = document.getElementById('tanamanVigor');
                var descEl = document.getElementById('tanamanDesc');

                var payload = {
                    date: dateEl ? dateEl.value : '',
                    varietas: (varietasEl && varietasEl.value) ? varietasEl.value : '-',
                    blok: (blokEl && blokEl.value) ? blokEl.value : '-',
                    hidup: (hidupEl && hidupEl.value) ? hidupEl.value : '-',
                    mati: (matiEl && matiEl.value) ? matiEl.value : '-',
                    tinggi: (tinggiEl && tinggiEl.value) ? tinggiEl.value : '-',
                    daun: (daunEl && daunEl.value) ? daunEl.value : '-',
                    buah: (buahEl && buahEl.value) ? buahEl.value : '-',
                    vigor: (vigorEl && vigorEl.value) ? vigorEl.value : 'Normal / Cukup Baik',
                    desc: descEl ? descEl.value : ''
                };

                var key = getStorageKey();
                var id = idEl ? idEl.value : '';

                if (id) {
                    payload.id = id;
                    if (typeof Storage !== 'undefined' && Storage.update) {
                        Storage.update(key, payload);
                    }
                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast('Data tanaman berhasil diperbarui!', 'success');
                    }
                } else {
                    if (typeof Storage !== 'undefined' && Storage.add) {
                        Storage.add(key, payload);
                    }
                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast('Data tanaman berhasil ditambahkan!', 'success');
                    }
                }

                form.reset();
                if (idEl) idEl.value = '';
                var titleEl = document.getElementById('formTitleTanaman');
                if (titleEl) titleEl.innerText = 'Catat Perkembangan Tanaman';
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                var idEl = document.getElementById('tanamanId');
                if (idEl) idEl.value = '';
                var titleEl = document.getElementById('formTitleTanaman');
                if (titleEl) titleEl.innerText = 'Catat Perkembangan Tanaman';
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerTanamanCards');
        if (!container) return;

        var key = getStorageKey();
        var data = [];
        if (typeof Storage !== 'undefined' && Storage.getAll) {
            data = Storage.getAll(key) || [];
        }

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada data tanaman tercatat.</div>`;
            return;
        }

        // Urutkan dari tanggal terbaru
        data.sort(function(a, b) {
            return new Date(b.date || 0) - new Date(a.date || 0);
        });

        var html = '';
        data.forEach(function(item) {
            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card: Tanggal Monitoring -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${item.date || '-'}</strong>
                            <span style="background: #E8F5E9; color: #2E7D32; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">Monitoring Tanaman</span>
                        </div>
                    </div>

                    <!-- Grid 4 Kotak (2x2) Ukuran Sama Rata -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Kiri Atas: Varietas & Blok -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Varietas & Blok</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-seedling" style="color: #2E7D32; width: 14px;"></i> <strong>${item.varietas || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-map-marker-alt" style="color: #E65100; width: 14px;"></i> <strong>${item.blok || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Kanan Atas: Populasi Tanaman -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Populasi Tanaman</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-check-circle" style="color: #388E3C; width: 14px;"></i> <strong>Hidup: ${item.hidup || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-times-circle" style="color: #C62828; width: 14px;"></i> <strong>Mati/Sulam: ${item.mati || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Kiri Bawah: Pertumbuhan Vegetatif -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Vegetatif</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-ruler-vertical" style="color: #0288D1; width: 14px;"></i> <strong>Tinggi: ${item.tinggi || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-leaf" style="color: #4CAF50; width: 14px;"></i> <strong>Daun: ${item.daun || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Kanan Bawah: Generatif & Vigor -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Generatif & Vigor</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-apple-alt" style="color: #F57F17; width: 14px;"></i> <strong>Buah: ${item.buah || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-heartbeat" style="color: #D32F2F; width: 14px;"></i> <strong>${item.vigor || '-'}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan (Jika Ada) -->
                    ${item.desc ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${item.desc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja (Ikon Pensil di Kiri, Ikon Tong Sampah di Kanan Tanpa Kotak) -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #eee; padding-top: 8px; margin-top: 4px;">
                        <span onclick="tanaman.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="tanaman.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function editItem(id) {
        var key = getStorageKey();
        var item = null;
        if (typeof Storage !== 'undefined' && Storage.getById) {
            item = Storage.getById(key, id);
        }
        if (!item) return;

        var idEl = document.getElementById('tanamanId');
        var dateEl = document.getElementById('tanamanDate');
        var varietasEl = document.getElementById('tanamanVarietas');
        var blokEl = document.getElementById('tanamanBlok');
        var hidupEl = document.getElementById('tanamanHidup');
        var matiEl = document.getElementById('tanamanMati');
        var tinggiEl = document.getElementById('tanamanTinggi');
        var daunEl = document.getElementById('tanamanDaun');
        var buahEl = document.getElementById('tanamanBuah');
        var vigorEl = document.getElementById('tanamanVigor');
        var descEl = document.getElementById('tanamanDesc');

        if (idEl) idEl.value = item.id || '';
        if (dateEl) dateEl.value = item.date || '';
        if (varietasEl) varietasEl.value = (item.varietas && item.varietas !== '-') ? item.varietas : '';
        if (blokEl) blokEl.value = (item.blok && item.blok !== '-') ? item.blok : '';
        if (hidupEl) hidupEl.value = (item.hidup && item.hidup !== '-') ? item.hidup : '';
        if (matiEl) matiEl.value = (item.mati && item.mati !== '-') ? item.mati : '';
        if (tinggiEl) tinggiEl.value = (item.tinggi && item.tinggi !== '-') ? item.tinggi : '';
        if (daunEl) daunEl.value = (item.daun && item.daun !== '-') ? item.daun : '';
        if (buahEl) buahEl.value = (item.buah && item.buah !== '-') ? item.buah : '';
        if (vigorEl) vigorEl.value = item.vigor || 'Sangat Sehat & Vigour';
        if (descEl) descEl.value = item.desc || '';

        var titleEl = document.getElementById('formTitleTanaman');
        if (titleEl) titleEl.innerText = 'Edit Data Tanaman';
        
        var btnCancel = document.getElementById('btnCancelTanamanEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function d
