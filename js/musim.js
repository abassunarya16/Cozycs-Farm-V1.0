// ==========================================
// COZYCS FARM - MODUL MUSIM TANAM (MULTI-GH SEASON TRACKER & REKAP LINTAS MODUL)
// ==========================================
//
// Definisi 1 "Musim" di Cozycs Farm: dimulai dari tanggal tanam bibit,
// berakhir setelah rekapan penjualan seluruh hasil panen musim itu selesai.
// Satu musim bisa mencakup lebih dari 1 Greenhouse (misal Musim 3 mencakup
// GH-01 & GH-02 sekaligus).
//
// Modul ini TIDAK menyimpan data operasional baru — dia murni menandai
// rentang tanggal + GH mana saja yang termasuk 1 musim, lalu menyaring data
// yang SUDAH ADA di modul lain (Tanaman, Nutrisi, Spray, Panen, Keuangan)
// berdasarkan rentang itu untuk membuat rekap gabungan per musim.

var musim = (function() {

    var expandedMusimId = null; // ID musim yang rekapnya sedang ditampilkan

    var i18nDict = {
        'id': {
            'module_title': 'Musim Tanam & Rekap Analisis',
            'form_title_add': 'Tambah Musim Baru',
            'form_title_edit': 'Edit Data Musim',
            'lbl_nama': 'Nama Musim',
            'ph_nama': 'Contoh: Musim 3',
            'lbl_tgl_mulai': 'Tanggal Mulai (Tanam)',
            'lbl_tgl_selesai': 'Tanggal Selesai (Rekap Jual)',
            'ph_tgl_selesai': 'Kosongkan jika musim masih berjalan',
            'lbl_gh_terkait': 'Greenhouse Terkait',
            'no_gh_found': 'Belum ada data Greenhouse. Musim ini akan dianggap mencakup semua GH.',
            'lbl_catatan': 'Catatan Musim (Opsional)',
            'ph_catatan': 'Varietas, target, kondisi khusus musim ini...',
            'btn_save': 'Simpan Musim',
            'btn_cancel': 'Batal',
            'recap_title': 'Daftar Musim',
            'no_data': 'Belum ada musim tercatat. Tambahkan musim pertama di atas.',
            'badge_aktif': 'SEDANG BERJALAN',
            'badge_selesai': 'SELESAI',
            'btn_lihat_rekap': 'Lihat Rekap Musim',
            'btn_tutup_rekap': 'Tutup Rekap',
            'confirm_delete': 'Hapus data musim ini? (Data operasional di modul lain TIDAK ikut terhapus)',
            'toast_saved': 'Data musim berhasil disimpan!',
            'toast_deleted': 'Data musim berhasil dihapus',
            'rekap_tanaman': 'Tanaman',
            'rekap_populasi': 'Populasi',
            'rekap_nutrisi': 'Rata-Rata Nutrisi',
            'rekap_spray': 'Aplikasi Spray',
            'rekap_panen': 'Total Panen',
            'rekap_buah_fix': 'Buah Fix',
            'rekap_keuangan': 'Ringkasan Keuangan Musim Ini',
            'rekap_pemasukan': 'Pemasukan',
            'rekap_pengeluaran': 'Pengeluaran',
            'rekap_laba': 'Estimasi Laba Bersih',
            'rekap_kosong': 'Tidak ada data pada rentang musim ini.',
            'catatan_seluruh_kebun': 'Transaksi berkategori "Seluruh Kebun" (bukan GH spesifik) ikut dihitung selama tanggalnya masuk rentang musim ini.'
        },
        'en': {
            'module_title': 'Growing Season & Analysis Recap',
            'form_title_add': 'Add New Season',
            'form_title_edit': 'Edit Season Data',
            'lbl_nama': 'Season Name',
            'ph_nama': 'e.g., Season 3',
            'lbl_tgl_mulai': 'Start Date (Planting)',
            'lbl_tgl_selesai': 'End Date (Sales Recap)',
            'ph_tgl_selesai': 'Leave empty if season is ongoing',
            'lbl_gh_terkait': 'Related Greenhouses',
            'no_gh_found': 'No Greenhouse data yet. This season will be assumed to cover all GH.',
            'lbl_catatan': 'Season Notes (Optional)',
            'ph_catatan': 'Variety, target, special conditions...',
            'btn_save': 'Save Season',
            'btn_cancel': 'Cancel',
            'recap_title': 'Season List',
            'no_data': 'No seasons recorded yet. Add your first season above.',
            'badge_aktif': 'ONGOING',
            'badge_selesai': 'FINISHED',
            'btn_lihat_rekap': 'View Season Recap',
            'btn_tutup_rekap': 'Close Recap',
            'confirm_delete': 'Delete this season? (Operational data in other modules will NOT be deleted)',
            'toast_saved': 'Season data saved successfully!',
            'toast_deleted': 'Season data deleted successfully',
            'rekap_tanaman': 'Plants',
            'rekap_populasi': 'Population',
            'rekap_nutrisi': 'Average Nutrition',
            'rekap_spray': 'Spray Applications',
            'rekap_panen': 'Total Harvest',
            'rekap_buah_fix': 'Fixed Fruit',
            'rekap_keuangan': 'This Season Financial Summary',
            'rekap_pemasukan': 'Income',
            'rekap_pengeluaran': 'Expense',
            'rekap_laba': 'Estimated Net Profit',
            'rekap_kosong': 'No data found in this season range.',
            'catatan_seluruh_kebun': '"Entire Farm" (non GH-specific) transactions are included as long as the date falls within this season range.'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function getKey() {
        return 'cozycs_musim';
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val;
    }

    function getData(key) {
        try {
            if (typeof Storage !== 'undefined' && typeof Storage.getAll === 'function') {
                var res = Storage.getAll(key);
                if (Array.isArray(res)) return res;
            }
        } catch(e) {
            console.error('[Musim] Gagal mengambil data ' + key, e);
        }
        return [];
    }

    function roundNumber(val) {
        var num = parseFloat(val) || 0;
        return parseFloat(num.toFixed(2));
    }

    function formatRp(val) {
        var num = parseFloat(val) || 0;
        if (num < 0) return '-Rp' + Math.abs(Math.round(num)).toLocaleString('id-ID');
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    }

    // ==========================================
    // HELPER PENCOCOKAN TANGGAL & GH
    // ==========================================
    function normalisasiTanggal(val) {
        if (!val) return '';
        return String(val).split('T')[0];
    }

    function tanggalDalamRentang(tgl, mulai, selesai) {
        var t = normalisasiTanggal(tgl);
        if (!t) return false;
        var m = mulai || '0000-01-01';
        var s = selesai || '9999-12-31';
        return t >= m && t <= s;
    }

    // Cocokkan GH sebuah data (item.gh) dengan daftar GH yang termasuk musim.
    // - Musim tanpa GH spesifik (ghTerkait kosong) dianggap mencakup semua GH.
    // - Transaksi umum ("Seluruh Kebun"/"ALL", biasa dipakai di Keuangan untuk
    //   biaya seperti listrik) selalu dianggap cocok, karena tidak terikat ke
    //   GH tertentu — cukup tanggalnya yang masuk rentang musim.
    function ghCocokMusim(itemGh, ghTerkaitArr) {
        if (!ghTerkaitArr || ghTerkaitArr.length === 0) return true;
        var g = String(itemGh || '').trim();
        if (!g || g === 'Seluruh Kebun' || g === 'ALL') return true;
        return ghTerkaitArr.indexOf(g) !== -1;
    }

    function hitungStatusMusim(musimItem) {
        if (!musimItem.tanggalSelesai) return 'Aktif';
        var today = new Date().toISOString().split('T')[0];
        return (musimItem.tanggalSelesai >= today) ? 'Aktif' : 'Selesai';
    }

    // ==========================================
    // FORM: DAFTAR CHECKBOX GH
    // ==========================================
    function populateGhCheckboxes(selectedKodeArr) {
        var wrapperEl = document.getElementById('musimGhCheckboxWrapper');
        if (!wrapperEl) return;

        var keyGh = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GREENHOUSE) ? Storage.KEYS.GREENHOUSE : 'cozycs_greenhouse';
        var dataGh = getData(keyGh);
        var selected = selectedKodeArr || [];

        if (!Array.isArray(dataGh) || dataGh.length === 0) {
            wrapperEl.innerHTML = `<div style="font-size: 11px; color: #888; font-style: italic; padding: 8px;">${t('no_gh_found')}</div>`;
            return;
        }

        var html = '';
        dataGh.forEach(function(gh) {
            if (!gh || !gh.kode) return;
            var isChecked = selected.indexOf(gh.kode) !== -1;
            html += `
                <label style="display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: var(--inner-card-bg, #f9f9f9); border-radius: 8px; margin-bottom: 6px; cursor: pointer; font-size: 13px;">
                    <input type="checkbox" class="musim-gh-checkbox" value="${gh.kode}" ${isChecked ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: #00695C;">
                    <span style="color: var(--text-color, #333);">${gh.kode} - ${gh.nama || 'GH'}</span>
                </label>
            `;
        });

        wrapperEl.innerHTML = html;
    }

    function getSelectedGhCheckboxes() {
        var boxes = document.querySelectorAll('.musim-gh-checkbox:checked');
        var result = [];
        boxes.forEach(function(b) { result.push(b.value); });
        return result;
    }

    // ==========================================
    // RENDER TAMPILAN UTAMA
    // ==========================================
    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-seedling" style="color: #00695C;"></i> ${t('module_title')}</div>

                <!-- FORM TAMBAH/EDIT MUSIM -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #00695C; margin-bottom: 12px;" id="formTitleMusim">${t('form_title_add')}</div>
                    <form id="formMusim">
                        <input type="hidden" id="musimId">

                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_nama')}</label>
                            <input type="text" id="musimNama" required placeholder="${t('ph_nama')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_tgl_mulai')}</label>
                                <input type="date" id="musimTglMulai" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_tgl_selesai')}</label>
                                <input type="date" id="musimTglSelesai" title="${t('ph_tgl_selesai')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gh_terkait')}</label>
                            <div id="musimGhCheckboxWrapper" style="margin-top: 6px;"></div>
                        </div>

                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_catatan')}</label>
                            <textarea id="musimCatatan" rows="2" placeholder="${t('ph_catatan')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #00695C; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelMusimEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- DAFTAR MUSIM -->
                <div class="section-title"><i class="fas fa-list" style="color: #00695C;"></i> ${t('recap_title')}</div>
                <div id="containerMusimCards"></div>
            </div>
        `;
    }

    function init() {
        populateGhCheckboxes([]);
        loadTable();

        var form = document.getElementById('formMusim');
        var btnCancel = document.getElementById('btnCancelMusimEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('musimId');
                var nama = getVal('musimNama');
                var tglMulai = getVal('musimTglMulai');
                var tglSelesai = getVal('musimTglSelesai');
                var ghTerkait = getSelectedGhCheckboxes();
                var catatan = getVal('musimCatatan');

                var payload = {
                    nama: nama,
                    tanggalMulai: tglMulai,
                    tanggalSelesai: tglSelesai || '',
                    ghTerkait: ghTerkait,
                    catatan: catatan
                };

                var key = getKey();
                if (id) {
                    payload.id = id;
                    if (typeof Storage !== 'undefined' && Storage.update) {
                        Storage.update(key, payload);
                    }
                } else {
                    if (typeof Storage !== 'undefined' && Storage.add) {
                        Storage.add(key, payload);
                    }
                }

                if (typeof Helper !== 'undefined' && Helper.showToast) {
                    Helper.showToast(t('toast_saved'), 'success');
                }

                form.reset();
                setVal('musimId', '');
                populateGhCheckboxes([]);
                var titleEl = document.getElementById('formTitleMusim');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
                window.dispatchEvent(new Event('cozycs_data_changed'));
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('musimId', '');
                populateGhCheckboxes([]);
                var titleEl = document.getElementById('formTitleMusim');
                if (titleEl) titleEl.innerText = t('form_title_add');
                btnCancel.style.display = 'none';
            });
        }
    }

    // ==========================================
    // DAFTAR KARTU MUSIM
    // ==========================================
    function loadTable() {
        var container = document.getElementById('containerMusimCards');
        if (!container) return;

        var data = getData(getKey());

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data')}</div>`;
            return;
        }

        data.sort(function(a, b) {
            return new Date(b.tanggalMulai || 0) - new Date(a.tanggalMulai || 0);
        });

        var html = '';
        data.forEach(function(item) {
            if (!item || !item.id) return;
            var status = hitungStatusMusim(item);
            var badgeBg = status === 'Aktif' ? '#E8F5E9' : '#ECEFF1';
            var badgeColor = status === 'Aktif' ? '#2E7D32' : '#546E7A';
            var badgeText = status === 'Aktif' ? t('badge_aktif') : t('badge_selesai');

            var ghList = (Array.isArray(item.ghTerkait) && item.ghTerkait.length > 0) ? item.ghTerkait.join(', ') : t('no_gh_found');
            var isExpanded = (expandedMusimId === item.id);

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 15px; color: var(--text-color, #222);">${item.nama}</strong>
                        </div>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: bold;">${badgeText}</span>
                    </div>

                    <div style="font-size: 12px; color: #555; line-height: 1.6; margin-bottom: 10px;">
                        <div><i class="far fa-calendar-alt" style="color: #00695C; width: 16px;"></i> ${item.tanggalMulai || '-'} &rarr; ${item.tanggalSelesai || '(masih berjalan)'}</div>
                        <div><i class="fas fa-warehouse" style="color: #00695C; width: 16px;"></i> ${ghList}</div>
                        ${item.catatan ? `<div style="margin-top: 4px; font-style: italic; color: #777;">"${item.catatan}"</div>` : ''}
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px;">
                        <button type="button" onclick="musim.toggleRekap('${item.id}')" style="background: #E0F2F1; color: #00695C; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
                            <i class="fas fa-chart-bar"></i> ${isExpanded ? t('btn_tutup_rekap') : t('btn_lihat_rekap')}
                        </button>
                        <div>
                            <span onclick="musim.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                            <span onclick="musim.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                        </div>
                    </div>

                    <div id="rekapMusim-${item.id}" style="display: ${isExpanded ? 'block' : 'none'}; margin-top: 12px;"></div>
                </div>
            `;
        });

        container.innerHTML = html;

        if (expandedMusimId) {
            var musimAktif = data.find(function(m) { return m && m.id === expandedMusimId; });
            if (musimAktif) renderRekapMusim(musimAktif);
        }
    }

    function toggleRekap(id) {
        expandedMusimId = (expandedMusimId === id) ? null : id;
        loadTable();
    }

    // ==========================================
    // REKAP LINTAS MODUL UNTUK 1 MUSIM
    // ==========================================
    function renderRekapMusim(musimItem) {
        var container = document.getElementById('rekapMusim-' + musimItem.id);
        if (!container) return;

        var mulai = musimItem.tanggalMulai || '';
        var selesai = musimItem.tanggalSelesai || '';
        var ghTerkait = Array.isArray(musimItem.ghTerkait) ? musimItem.ghTerkait : [];

        // --- TANAMAN ---
        var dataTanaman = getData('cozycs_tanaman').filter(function(x) {
            return x && ghCocokMusim(x.gh || x.ghId, ghTerkait) && tanggalDalamRentang(x.tanggal || x.tanam || x.tglTanam, mulai, selesai);
        });
        var varietasSet = {};
        var uniqueTalang = {};
        dataTanaman.forEach(function(x) {
            if (x.varietas) varietasSet[x.varietas] = true;
            if (x.talang && x.talang !== '-') uniqueTalang[(x.gh || 'GH') + '_' + x.talang] = true;
        });
        var totalPopulasi = Object.keys(uniqueTalang).length > 0 ? Object.keys(uniqueTalang).length : dataTanaman.length;
        var daftarVarietas = Object.keys(varietasSet).join(', ') || '-';

        // --- NUTRISI ---
        var dataNutrisi = getData('cozycs_nutrisi').filter(function(x) {
            return x && ghCocokMusim(x.gh || x.ghId, ghTerkait) && tanggalDalamRentang(x.date || x.tanggal, mulai, selesai);
        });
        var totalPpm = 0, totalPh = 0, countNutrisiValid = 0;
        dataNutrisi.forEach(function(x) {
            var ppm = parseFloat(x.ppm || x.ppmAir || x.nutrisi);
            var ph = parseFloat(x.ph || x.phAir);
            if (!isNaN(ppm) && ppm > 0) { totalPpm += ppm; countNutrisiValid++; }
            if (!isNaN(ph) && ph > 0) totalPh += ph;
        });
        var rataPpm = countNutrisiValid > 0 ? roundNumber(totalPpm / countNutrisiValid) : 0;
        var rataPh = countNutrisiValid > 0 ? roundNumber(totalPh / countNutrisiValid) : 0;

        // --- SPRAY ---
        var dataSpray = getData('cozycs_spray').filter(function(x) {
            return x && ghCocokMusim(x.gh, ghTerkait) && tanggalDalamRentang(x.date, mulai, selesai) && !x.isAutoNext;
        });

        // --- PANEN ---
        var dataPanen = getData('cozycs_panen').filter(function(x) {
            return x && ghCocokMusim(x.gh, ghTerkait) && tanggalDalamRentang(x.tanggal || x.date, mulai, selesai);
        });
        var totalKgPanen = 0;
        dataPanen.forEach(function(x) { totalKgPanen += (parseFloat(x.totalKg) || parseFloat(x.jumlah) || 0); });

        // --- BUAH FIX ---
        var dataBuah = getData('cozycs_buah').filter(function(x) {
            return x && ghCocokMusim(x.gh, ghTerkait) && tanggalDalamRentang(x.tanggal || x.date, mulai, selesai);
        });
        var totalBuahFix = 0;
        dataBuah.forEach(function(x) { totalBuahFix += (parseFloat(x.jumlahFix) || parseFloat(x.jumlah) || 0); });

        // --- KEUANGAN ---
        var dataKeuangan = getData('cozycs_keuangan').filter(function(x) {
            return x && ghCocokMusim(x.gh, ghTerkait) && tanggalDalamRentang(x.tanggal, mulai, selesai);
        });
        var totalPemasukan = 0, totalPemasukanModal = 0, totalPengeluaran = 0;
        dataKeuangan.forEach(function(x) {
            var nominal = parseFloat(x.nominal) || 0;
            var isIncome = (x.jenis === 'Pemasukan' || x.jenis === 'Income');
            if (isIncome) {
                totalPemasukan += nominal;
                if (x.kategori === 'Modal / Setoran Owner') totalPemasukanModal += nominal;
            } else {
                totalPengeluaran += nominal;
            }
        });
        var labaBersihMusim = (totalPemasukan - totalPemasukanModal) - totalPengeluaran;

        container.innerHTML = `
            <div style="background: linear-gradient(135deg, #E0F2F1 0%, #F1F8E9 100%); border: 1px solid #B2DFDB; border-radius: 12px; padding: 12px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                    <div style="background: rgba(255,255,255,0.85); padding: 8px 10px; border-radius: 8px;">
                        <div style="font-size: 9px; color: #666; font-weight: 700; text-transform: uppercase;">${t('rekap_populasi')}</div>
                        <div style="font-size: 13px; font-weight: 800; color: #1B5E20;">${totalPopulasi} Pohon</div>
                        <div style="font-size: 10px; color: #777;">${daftarVarietas}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.85); padding: 8px 10px; border-radius: 8px;">
                        <div style="font-size: 9px; color: #666; font-weight: 700; text-transform: uppercase;">${t('rekap_nutrisi')}</div>
                        <div style="font-size: 13px; font-weight: 800; color: #006064;">${rataPpm > 0 ? rataPpm + ' PPM' : '-'} ${rataPh > 0 ? '/ ' + rataPh + ' pH' : ''}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.85); padding: 8px 10px; border-radius: 8px;">
                        <div style="font-size: 9px; color: #666; font-weight: 700; text-transform: uppercase;">${t('rekap_spray')}</div>
                        <div style="font-size: 13px; font-weight: 800; color: #6A1B9A;">${dataSpray.length}x</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.85); padding: 8px 10px; border-radius: 8px;">
                        <div style="font-size: 9px; color: #666; font-weight: 700; text-transform: uppercase;">${t('rekap_panen')} / ${t('rekap_buah_fix')}</div>
                        <div style="font-size: 13px; font-weight: 800; color: #E65100;">${totalKgPanen > 0 ? totalKgPanen + ' Kg' : '-'} ${totalBuahFix > 0 ? '(' + totalBuahFix + ' Buah)' : ''}</div>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.9); border-radius: 10px; padding: 10px 12px;">
                    <div style="font-size: 11px; font-weight: 800; color: #1B5E20; margin-bottom: 6px;">${t('rekap_keuangan')}</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
                        <div style="text-align: center;">
                            <div style="font-size: 9px; color: #2E7D32; font-weight: 700;">${t('rekap_pemasukan')}</div>
                            <div style="font-size: 12px; font-weight: 800; color: #2E7D32;">+${formatRp(totalPemasukan)}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 9px; color: #C62828; font-weight: 700;">${t('rekap_pengeluaran')}</div>
                            <div style="font-size: 12px; font-weight: 800; color: #C62828;">-${formatRp(totalPengeluaran)}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 9px; color: #0277BD; font-weight: 700;">${t('rekap_laba')}</div>
                            <div style="font-size: 12px; font-weight: 800; color: ${labaBersihMusim >= 0 ? '#0277BD' : '#C62828'};">${formatRp(labaBersihMusim)}</div>
                        </div>
                    </div>
                    ${dataKeuangan.length === 0 ? `<div style="text-align:center; font-size: 11px; color: #999; margin-top: 6px;">${t('rekap_kosong')}</div>` : ''}
                </div>

                <div style="font-size: 9.5px; color: #666; margin-top: 8px; font-style: italic; line-height: 1.4;">
                    <i class="fas fa-info-circle"></i> ${t('catatan_seluruh_kebun')}
                </div>
            </div>
        `;
    }

    function editItem(id) {
        if (typeof Storage === 'undefined' || !Storage.getById) return;
        var item = Storage.getById(getKey(), id);
        if (!item) return;

        setVal('musimId', item.id || '');
        setVal('musimNama', item.nama || '');
        setVal('musimTglMulai', item.tanggalMulai || '');
        setVal('musimTglSelesai', item.tanggalSelesai || '');
        setVal('musimCatatan', item.catatan || '');

        populateGhCheckboxes(Array.isArray(item.ghTerkait) ? item.ghTerkait : []);

        var titleEl = document.getElementById('formTitleMusim');
        if (titleEl) titleEl.innerText = t('form_title_edit');

        var btnCancel = document.getElementById('btnCancelMusimEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm(t('confirm_delete'))) {
            if (typeof Storage !== 'undefined' && Storage.remove) {
                Storage.remove(getKey(), id);
            }
            if (expandedMusimId === id) expandedMusimId = null;
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
        editItem: editItem,
        deleteItem: deleteItem,
        toggleRekap: toggleRekap
    };

})();

window.musim = musim;
