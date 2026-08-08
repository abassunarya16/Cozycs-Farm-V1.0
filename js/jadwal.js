// ==========================================
// COZYCS FARM - MODUL JADWAL & AGENDA OPERASIONAL (WITH AUTO-DRAFT & DASHBOARD LOG)
// ==========================================

var jadwal = (function() {

    // VARIABEL STATE UNTUK PENCARIAN & PAGINASI
    var searchQuery = '';
    var currentPage = 1;
    var itemsPerPage = 20;

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Jadwal & Agenda Operasional',
            'stat_total': 'TOTAL JADWAL',
            'stat_pending': 'PENDING',
            'stat_urgent': 'URGENT (TINGGI)',
            'stat_completed': 'SELESAI (DONE)',
            'unit_tasks': 'Tugas',
            'form_title_add': 'Tambah Jadwal / Tugas Baru',
            'form_title_edit': 'Edit Jadwal / Tugas',
            'lbl_location': 'Lokasi / ID GH',
            'opt_farm_general': 'Seluruh Kebun (Umum)',
            'lbl_date': 'Tanggal Eksekusi',
            'lbl_title': 'Nama / Judul Kegiatan',
            'ph_title': 'Contoh: Flush Nutrisi Utama',
            'lbl_time': 'Waktu / Jam',
            'opt_time_morning': 'Pagi (06:00 - 09:00)',
            'opt_time_noon': 'Siang (11:00 - 13:00)',
            'opt_time_afternoon': 'Sore (15:00 - 17:00)',
            'opt_time_night': 'Malam / Bebas',
            'lbl_category': 'Kategori Kegiatan',
            'opt_cat_nutrition': 'Nutrisi & Tandon',
            'opt_cat_spray': 'Penyemprotan Pestisida',
            'opt_cat_pruning': 'Pruning / Wiwil',
            'opt_cat_pollination': 'Penyerbukan / Polinasi',
            'opt_cat_harvest': 'Panen & Sortir',
            'opt_cat_maintenance': 'Perawatan GH & Alat',
            'opt_cat_others': 'Lainnya',
            'lbl_petugas': 'Penanggung Jawab',
            'ph_petugas': 'Contoh: Rizky',
            'default_petugas': 'Penanggung Jawab',
            'lbl_priority': 'Tingkat Prioritas',
            'opt_prio_low': 'Rendah (Santai)',
            'opt_prio_medium': 'Sedang (Normal)',
            'opt_prio_high': 'Tinggi (Urgent)',
            'lbl_status': 'Status Penyelesaian',
            'opt_status_pending': 'Pending',
            'opt_status_done': 'Selesai',
            'lbl_desc': 'Catatan Tambahan',
            'ph_desc': 'Instruksi khusus, dosis, alat yang disiapkan...',
            'btn_save': 'Simpan Jadwal',
            'btn_cancel': 'Batal',
            'recap_title': 'Daftar Jadwal & Tugas Kebun',
            'no_data': 'Belum ada jadwal kegiatan tersimpan.',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Jadwal berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus jadwal ini?',
            'toast_deleted': 'Jadwal berhasil dihapus',
            'ph_search': '🔍 Cari judul, GH, tanggal, petugas, atau kategori...',
            'btn_prev': '⬅️ Sebelum',
            'btn_next': 'Selanjutnya ➡️',
            'page_lbl': 'Halaman',
            'total_lbl': 'Total Data'
        },
        'en': {
            'module_title': 'Operational Schedule & Agenda',
            'stat_total': 'TOTAL SCHEDULE',
            'stat_pending': 'PENDING',
            'stat_urgent': 'URGENT (HIGH)',
            'stat_completed': 'COMPLETED (DONE)',
            'unit_tasks': 'Tasks',
            'form_title_add': 'Add New Schedule / Task',
            'form_title_edit': 'Edit Schedule / Task',
            'lbl_location': 'Location / GH ID',
            'opt_farm_general': 'Entire Farm (General)',
            'lbl_date': 'Execution Date',
            'lbl_title': 'Activity Name / Title',
            'ph_title': 'e.g., Flush Main Nutrient',
            'lbl_time': 'Time / Hours',
            'opt_time_morning': 'Morning (06:00 - 09:00)',
            'opt_time_noon': 'Noon (11:00 - 13:00)',
            'opt_time_afternoon': 'Afternoon (15:00 - 17:00)',
            'opt_time_night': 'Night / Flexible',
            'lbl_category': 'Activity Category',
            'opt_cat_nutrition': 'Nutrition & Tank',
            'opt_cat_spray': 'Pesticide Spraying',
            'opt_cat_pruning': 'Pruning / Trimming',
            'opt_cat_pollination': 'Pollination',
            'opt_cat_harvest': 'Harvest & Sorting',
            'opt_cat_maintenance': 'GH & Tool Maintenance',
            'opt_cat_others': 'Others',
            'lbl_petugas': 'Person in Charge',
            'ph_petugas': 'e.g., Rizky',
            'default_petugas': 'Person in Charge',
            'lbl_priority': 'Priority Level',
            'opt_prio_low': 'Low (Relaxed)',
            'opt_prio_medium': 'Medium (Normal)',
            'opt_prio_high': 'High (Urgent)',
            'lbl_status': 'Completion Status',
            'opt_status_pending': 'Pending',
            'opt_status_done': 'Completed',
            'lbl_desc': 'Additional Notes',
            'ph_desc': 'Special instructions, dosage, tools to prepare...',
            'btn_save': 'Save Schedule',
            'btn_cancel': 'Cancel',
            'recap_title': 'Farm Schedule & Task List',
            'no_data': 'No activity schedule saved yet.',
            'lbl_notes': 'Notes',
            'toast_saved': 'Schedule saved successfully!',
            'confirm_delete': 'Are you sure you want to delete this schedule?',
            'toast_deleted': 'Schedule deleted successfully',
            'ph_search': '🔍 Search title, GH, date, PIC, or category...',
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

    function getKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.JADWAL) {
            return Storage.KEYS.JADWAL;
        }
        return 'cozycs_jadwal';
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
                <div class="section-title"><i class="fas fa-calendar-alt" style="color: #2E7D32;"></i> ${t('module_title')}</div>

                <!-- 1. DASHBOARD STATISTIK UTAMA (4 STAT CARDS) -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;" id="jadwalStatCards">
                    <!-- Dynamic Stat Cards -->
                </div>

                <!-- 2. FORM INPUT JADWAL -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;" id="formTitleJadwal">${t('form_title_add')}</div>
                    <form id="formJadwal">
                        <input type="hidden" id="jadwalId">

                        <!-- Lokasi GH & Tanggal Eksekusi -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_location')}</label>
                                <select id="jadwalGh" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                                    <option value="Seluruh Kebun">${t('opt_farm_general')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date')}</label>
                                <input type="date" id="jadwalTanggal" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <!-- Judul Kegiatan & Waktu -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_title')}</label>
                                <input type="text" id="jadwalJudul" required placeholder="${t('ph_title')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_time')}</label>
                                <select id="jadwalWaktu" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                                    <option value="Pagi (06:00 - 09:00)">${t('opt_time_morning')}</option>
                                    <option value="Siang (11:00 - 13:00)">${t('opt_time_noon')}</option>
                                    <option value="Sore (15:00 - 17:00)">${t('opt_time_afternoon')}</option>
                                    <option value="Malam / Bebas">${t('opt_time_night')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Kategori & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_category')}</label>
                                <select id="jadwalKategori" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                                    <option value="Nutrisi & Tandon">${t('opt_cat_nutrition')}</option>
                                    <option value="Penyemprotan Pestisida">${t('opt_cat_spray')}</option>
                                    <option value="Pruning / Wiwil">${t('opt_cat_pruning')}</option>
                                    <option value="Penyerbukan / Polinasi">${t('opt_cat_pollination')}</option>
                                    <option value="Panen & Sortir">${t('opt_cat_harvest')}</option>
                                    <option value="Perawatan GH & Alat">${t('opt_cat_maintenance')}</option>
                                    <option value="Lainnya">${t('opt_cat_others')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_petugas')}</label>
                                <input type="text" id="jadwalPetugas" placeholder="${t('ph_petugas')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                            </div>
                        </div>

                        <!-- Prioritas & Status -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_priority')}</label>
                                <select id="jadwalPrioritas" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                                    <option value="Sedang">${t('opt_prio_medium')}</option>
                                    <option value="Tinggi">${t('opt_prio_high')}</option>
                                    <option value="Rendah">${t('opt_prio_low')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_status')}</label>
                                <select id="jadwalStatus" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                                    <option value="Pending">${t('opt_status_pending')}</option>
                                    <option value="Selesai">${t('opt_status_done')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label>
                            <textarea id="jadwalDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff); color: var(--text-color, #333);"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #2E7D32; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelJadwalEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- 3. REKAP DAFTAR JADWAL TITLE -->
                <div class="section-title"><i class="fas fa-list-ul" style="color: #2E7D32;"></i> ${t('recap_title')}</div>
                
                <!-- Kotak Pencarian Khusus Modul Jadwal -->
                <div style="margin-bottom: 14px;">
                    <input type="text" id="inputSearchJadwal" 
                           placeholder="${t('ph_search')}" 
                           oninput="jadwal.handleSearch(this.value)"
                           value="${searchQuery}"
                           style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color, #ccc); font-size: 13px; box-sizing: border-box; background: var(--card-bg, #fff); color: var(--text-color, #222);">
                </div>

                <!-- Container Cards Jadwal -->
                <div id="containerJadwalCards"></div>

                <!-- Kontrol Navigasi Paginasi -->
                <div id="paginationJadwalControls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; margin-bottom: 20px; font-size: 12px;"></div>
            </div>
        `;
    }

    function init() {
        loadDashboard();
        loadTable();

        // 1. KEMBALIKAN DRAF TERAKHIR DARI LOCALSTORAGE
        if (typeof restoreFormDraftGlobal === 'function') {
            restoreFormDraftGlobal('formJadwal');
        }

        var form = document.getElementById('formJadwal');
        var btnCancel = document.getElementById('btnCancelJadwalEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('jadwalId');
                var gh = getVal('jadwalGh');
                var tanggal = getVal('jadwalTanggal');
                var judul = getVal('jadwalJudul');
                var waktu = getVal('jadwalWaktu');
                var kategori = getVal('jadwalKategori');
                var petugas = getVal('jadwalPetugas');
                var prioritas = getVal('jadwalPrioritas');
                var status = getVal('jadwalStatus');
                var desc = getVal('jadwalDesc');

                var payload = {
                    gh: gh || 'Seluruh Kebun',
                    tanggal: tanggal,
                    judul: judul,
                    waktu: waktu || 'Pagi (06:00 - 09:00)',
                    kategori: kategori || 'Nutrisi & Tandon',
                    petugas: petugas || t('default_petugas'),
                    prioritas: prioritas || 'Sedang',
                    status: status || 'Pending',
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

                    // 2. CATAT LOG KE AKTIVITAS TERAKHIR DASBOR
                    if (typeof Storage !== 'undefined' && Storage.add) {
                        var keyAktivitas = (Storage.KEYS && Storage.KEYS.AKTIVITAS) ? Storage.KEYS.AKTIVITAS : 'cozycs_aktivitas';
                        var now = new Date();
                        var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
                        
                        Storage.add(keyAktivitas, {
                            judul: id ? 'Perbarui Jadwal Operasional' : 'Jadwal / Tugas Baru',
                            deskripsi: (judul || 'Tugas Kebun') + ' (' + (gh || 'Seluruh Kebun') + ') - Status: ' + (status || 'Pending'),
                            tanggal: tanggal || now.toISOString().split('T')[0],
                            jam: timeStr,
                            kategori: 'Jadwal',
                            icon: 'fas fa-calendar-alt',
                            color: '#2E7D32'
                        });
                    }

                    if (typeof Helper !== 'undefined' && Helper.showToast) {
                        Helper.showToast(t('toast_saved'), 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('jadwalId', '');
                var titleEl = document.getElementById('formTitleJadwal');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadDashboard();
                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('jadwalId', '');
                var titleEl = document.getElementById('formTitleJadwal');
                if (titleEl) titleEl.innerText = t('form_title_add');
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadDashboard() {
        var container = document.getElementById('jadwalStatCards');
        if (!container) return;

        var data = (typeof Storage !== 'undefined' && Storage.getAll) ? (Storage.getAll(getKey()) || []) : [];
        var total = data.length;
        var pendingCount = 0;
        var urgentCount = 0;
        var completedCount = 0;

        data.forEach(function(item) {
            if (item.status === 'Selesai' || item.status === 'Completed') {
                completedCount++;
            } else {
                pendingCount++;
                if (item.prioritas === 'Tinggi' || item.prioritas === 'High') {
                    urgentCount++;
                }
            }
        });

        container.innerHTML = `
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 10px; border: 1px solid var(--border-color, #e8e8e8);">
                <div style="font-size: 10px; color: #888; font-weight: 600;">${t('stat_total')}</div>
                <div style="font-size: 16px; font-weight: bold; color: var(--text-color, #222);">${total} ${t('unit_tasks')}</div>
            </div>
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 10px; border: 1px solid ${pendingCount > 0 ? '#E65100' : 'var(--border-color, #e8e8e8)'};">
                <div style="font-size: 10px; color: ${pendingCount > 0 ? '#E65100' : '#888'}; font-weight: 600;">${t('stat_pending')}</div>
                <div style="font-size: 16px; font-weight: bold; color: ${pendingCount > 0 ? '#E65100' : 'var(--text-color, #222)'};">${pendingCount} ${t('unit_tasks')}</div>
            </div>
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 10px; border: 1px solid ${urgentCount > 0 ? '#C62828' : 'var(--border-color, #e8e8e8)'};">
                <div style="font-size: 10px; color: ${urgentCount > 0 ? '#C62828' : '#888'}; font-weight: 600;">${t('stat_urgent')}</div>
                <div style="font-size: 16px; font-weight: bold; color: ${urgentCount > 0 ? '#C62828' : 'var(--text-color, #222)'};">${urgentCount} ${t('unit_tasks')}</div>
            </div>
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 10px; border: 1px solid var(--border-color, #e8e8e8);">
                <div style="font-size: 10px; color: #2E7D32; font-weight: 600;">${t('stat_completed')}</div>
                <div style="font-size: 16px; font-weight: bold; color: #2E7D32;">${completedCount} ${t('unit_tasks')}</div>
            </div>
        `;
    }

    function loadTable() {
        var container = document.getElementById('containerJadwalCards');
        var pageEl = document.getElementById('paginationJadwalControls');
        if (!container) return;

        var data = (typeof Storage !== 'undefined' && Storage.getAll) ? (Storage.getAll(getKey()) || []) : [];

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data')}</div>`;
            if (pageEl) pageEl.innerHTML = '';
            return;
        }

        // 1. Urutkan dari tanggal terdekat
        data.sort(function(a, b) {
            var dateA = a && a.tanggal ? new Date(a.tanggal) : new Date(0);
            var dateB = b && b.tanggal ? new Date(b.tanggal) : new Date(0);
            return dateA - dateB;
        });

        // 2. Filter data berdasarkan kata kunci pencarian
        var filteredData = data.filter(function(item) {
            if (!searchQuery) return true;
            var kw = searchQuery.toLowerCase();
            var gh = (item.gh || '').toLowerCase();
            var tanggal = (item.tanggal || '').toLowerCase();
            var judul = (item.judul || '').toLowerCase();
            var waktu = (item.waktu || '').toLowerCase();
            var kategori = (item.kategori || '').toLowerCase();
            var petugas = (item.petugas || '').toLowerCase();
            var prioritas = (item.prioritas || '').toLowerCase();
            var status = (item.status || '').toLowerCase();
            var desc = (item.desc || '').toLowerCase();
            return gh.includes(kw) || tanggal.includes(kw) || judul.includes(kw) || waktu.includes(kw) || kategori.includes(kw) || petugas.includes(kw) || prioritas.includes(kw) || status.includes(kw) || desc.includes(kw);
        });

        if (filteredData.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data')}</div>`;
            if (pageEl) pageEl.innerHTML = '';
            return;
        }

        // 3. Paginasi: potong array data sesuai halaman aktif
        var totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        var pageData = filteredData.slice(startIndex, endIndex);

        // 4. Render HTML Kartu
        var html = '';
        pageData.forEach(function(item) {
            if (!item) return;

            var isDone = item.status === 'Selesai' || item.status === 'Completed';
            var badgeBg = isDone ? '#E8F5E9' : (item.prioritas === 'Tinggi' || item.prioritas === 'High' ? '#FFEBEE' : '#FFF3E0');
            var badgeColor = isDone ? '#2E7D32' : (item.prioritas === 'Tinggi' || item.prioritas === 'High' ? '#C62828' : '#E65100');

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: var(--text-color, #222);">${item.tanggal || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">${item.gh || 'Seluruh Kebun'}</span>
                        </div>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${item.status || 'Pending'}</span>
                    </div>

                    <div style="margin-bottom: 8px;">
                        <strong style="font-size: 15px; color: var(--text-color, #222); display: block; margin-bottom: 4px;">${item.judul}</strong>
                        <div style="font-size: 12px; color: #888;">
                            <span><i class="far fa-clock" style="color: #0277BD;"></i> ${item.waktu}</span> | 
                            <span><i class="fas fa-tag" style="color: #E65100;"></i> ${item.kategori}</span> | 
                            <span><i class="fas fa-user" style="color: #388E3C;"></i> ${item.petugas || t('default_petugas')}</span>
                        </div>
                    </div>

                    ${item.desc ? `<div style="font-size: 12px; color: var(--text-color, #333); background: var(--inner-card-bg, #fdfdfd); padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">${t('lbl_notes')}: ${item.desc}</div>` : ''}

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                        <span onclick="jadwal.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="jadwal.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // 5. Render Tombol Paginasi
        if (pageEl) {
            if (totalPages > 1) {
                pageEl.innerHTML = `
                    <button onclick="jadwal.changePage(-1)" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_prev')}
                    </button>
                    <span style="font-weight: bold; color: var(--text-color, #555);">
                        ${t('page_lbl')} ${currentPage} / ${totalPages} (${filteredData.length} ${t('unit_tasks')})
                    </span>
                    <button onclick="jadwal.changePage(1)" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_next')}
                    </button>
                `;
            } else {
                pageEl.innerHTML = `<span style="color: #777; font-size: 11px;">${t('total_lbl')}: ${filteredData.length} ${t('unit_tasks')}</span>`;
            }
        }
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

        setVal('jadwalId', item.id || '');
        setVal('jadwalGh', item.gh || 'Seluruh Kebun');
        setVal('jadwalTanggal', item.tanggal || '');
        setVal('jadwalJudul', item.judul || '');
        setVal('jadwalWaktu', item.waktu || 'Pagi (06:00 - 09:00)');
        setVal('jadwalKategori', item.kategori || 'Nutrisi & Tandon');
        setVal('jadwalPetugas', item.petugas === t('default_petugas') ? '' : (item.petugas || ''));
        setVal('jadwalPrioritas', item.prioritas || 'Sedang');
        setVal('jadwalStatus', item.status || 'Pending');
        setVal('jadwalDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleJadwal');
        if (titleEl) titleEl.innerText = t('form_title_edit');

        var btnCancel = document.getElementById('btnCancelJadwalEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm(t('confirm_delete'))) {
            try {
                var storageKey = getKey();
                if (typeof Storage !== 'undefined' && Storage.remove) {
                    Storage.remove(storageKey, id);
                }
            } catch(e) {}
            loadDashboard();
            loadTable();
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

    function changePage(direction) {
        currentPage += direction;
        loadTable();
    }

    return {
        render: render,
        init: init,
        loadDashboard: loadDashboard,
        loadTable: loadTable,
        editItem: editItem,
        deleteItem: deleteItem,
        handleSearch: handleSearch,
        changePage: changePage
    };

})();

window.jadwal = jadwal;
