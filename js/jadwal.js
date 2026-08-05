// ==========================================
// COZYCS FARM - MODUL JADWAL & AGENDA OPERASIONAL (CRUD BILINGUAL & DARK MODE)
// ==========================================

var jadwal = (function() {

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Jadwal & Agenda Operasional',
            'stat_total': 'TOTAL AGENDA',
            'stat_pending': 'PENDING (BELUM)',
            'stat_urgent': 'MENDESAK (HIGH)',
            'stat_done': 'SELESAI (DONE)',
            'unit_task': 'Tugas',
            'form_title_add': 'Tambah Agenda / Tugas Baru',
            'form_title_edit': 'Edit Agenda Operasional',
            'lbl_gh': 'Lokasi / ID GH',
            'select_gh_all': 'Seluruh Farm (Umum)',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Tanggal Pelaksanaan',
            'lbl_title': 'Nama / Judul Kegiatan',
            'ph_title': 'Contoh: Kuras Tandon Nutrisi Utama',
            'lbl_time': 'Waktu / Jam',
            'opt_time_morning': 'Pagi (06:00 - 09:00)',
            'opt_time_noon': 'Siang (11:00 - 13:00)',
            'opt_time_afternoon': 'Sore (15:30 - 17:30)',
            'opt_time_flexible': 'Fleksibel / Seharian',
            'lbl_category': 'Kategori Kegiatan',
            'opt_cat_nutrition': 'Nutrisi & Tandon',
            'opt_cat_spray': 'Penyemprotan (Spray)',
            'opt_cat_pruning': 'Pruning & Pemeliharaan',
            'opt_cat_sanitation': 'Sanitasi & Perawatan GH',
            'opt_cat_harvest': 'Persiapan Panen',
            'opt_cat_other': 'Lainnya',
            'lbl_petugas': 'Penanggung Jawab',
            'ph_petugas': 'Contoh: Rizky',
            'default_petugas': 'Penanggung Jawab',
            'lbl_priority': 'Tingkat Prioritas',
            'opt_prio_medium': 'Sedang (Normal)',
            'opt_prio_high': 'Tinggi (Mendesak)',
            'opt_prio_low': 'Rendah (Rutin)',
            'lbl_status': 'Status Penyelesaian',
            'opt_status_pending': 'Belum Dikerjakan',
            'opt_status_done': 'Selesai',
            'lbl_desc': 'Catatan Tambahan',
            'ph_desc': 'Instruksi khusus, dosis, alat yang disiapkan...',
            'btn_save': 'Simpan Agenda',
            'btn_cancel': 'Batal',
            'recap_title': 'Daftar Agenda & Tugas Operasional',
            'no_data': 'Belum ada agenda operasional tercatat.',
            'badge_done': '✔ SELESAI',
            'badge_pending': 'PENDING',
            'card_lbl_agenda_time': 'Agenda & Waktu',
            'card_lbl_cat_prio': 'Kategori & Prioritas',
            'card_lbl_petugas': 'Penanggung Jawab',
            'card_lbl_quick_action': 'Aksi Cepat Status',
            'btn_mark_pending': 'Tandai Belum',
            'btn_mark_done': 'Tandai Selesai',
            'lbl_prio_prefix': 'Prio:',
            'lbl_notes': 'Catatan',
            'toast_saved': 'Agenda berhasil disimpan!',
            'toast_status_updated': 'Status agenda berhasil diperbarui!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus agenda ini?',
            'toast_deleted': 'Agenda berhasil dihapus'
        },
        'en': {
            'module_title': 'Operational Schedule & Agenda',
            'stat_total': 'TOTAL AGENDA',
            'stat_pending': 'PENDING',
            'stat_urgent': 'URGENT (HIGH)',
            'stat_done': 'COMPLETED (DONE)',
            'unit_task': 'Tasks',
            'form_title_add': 'Add New Agenda / Task',
            'form_title_edit': 'Edit Operational Agenda',
            'lbl_gh': 'Location / GH ID',
            'select_gh_all': 'Entire Farm (General)',
            'gh_default': 'GH-01 (Default)',
            'lbl_date': 'Execution Date',
            'lbl_title': 'Activity Name / Title',
            'ph_title': 'e.g., Flush Main Nutrient Tank',
            'lbl_time': 'Time / Hours',
            'opt_time_morning': 'Morning (06:00 - 09:00)',
            'opt_time_noon': 'Noon (11:00 - 13:00)',
            'opt_time_afternoon': 'Afternoon (15:30 - 17:30)',
            'opt_time_flexible': 'Flexible / All Day',
            'lbl_category': 'Activity Category',
            'opt_cat_nutrition': 'Nutrition & Tank',
            'opt_cat_spray': 'Spraying',
            'opt_cat_pruning': 'Pruning & Maintenance',
            'opt_cat_sanitation': 'Sanitation & GH Care',
            'opt_cat_harvest': 'Harvest Prep',
            'opt_cat_other': 'Others',
            'lbl_petugas': 'Person in Charge',
            'ph_petugas': 'e.g., Rizky',
            'default_petugas': 'Person in Charge',
            'lbl_priority': 'Priority Level',
            'opt_prio_medium': 'Medium (Normal)',
            'opt_prio_high': 'High (Urgent)',
            'opt_prio_low': 'Low (Routine)',
            'lbl_status': 'Completion Status',
            'opt_status_pending': 'Pending',
            'opt_status_done': 'Completed',
            'lbl_desc': 'Additional Notes',
            'ph_desc': 'Special instructions, dosage, tools to prepare...',
            'btn_save': 'Save Agenda',
            'btn_cancel': 'Cancel',
            'recap_title': 'Operational Agenda & Task List',
            'no_data': 'No operational agendas recorded yet.',
            'badge_done': '✔ DONE',
            'badge_pending': 'PENDING',
            'card_lbl_agenda_time': 'Agenda & Time',
            'card_lbl_cat_prio': 'Category & Priority',
            'card_lbl_petugas': 'Person in Charge',
            'card_lbl_quick_action': 'Quick Status Action',
            'btn_mark_pending': 'Mark Pending',
            'btn_mark_done': 'Mark Completed',
            'lbl_prio_prefix': 'Prio:',
            'lbl_notes': 'Notes',
            'toast_saved': 'Agenda saved successfully!',
            'toast_status_updated': 'Agenda status updated successfully!',
            'confirm_delete': 'Are you sure you want to delete this agenda?',
            'toast_deleted': 'Agenda deleted successfully'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function getKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.SCHEDULES) {
            return Storage.KEYS.SCHEDULES;
        }
        return 'cozycs_schedules';
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val;
    }

    // Fungsi untuk mengisi opsi dropdown ID GH dari data Greenhouse
    function populateGhDropdown() {
        var selectEl = document.getElementById('jadwalGh');
        if (!selectEl) return;

        var keyGh = (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.GREENHOUSE) ? Storage.KEYS.GREENHOUSE : 'cozycs_greenhouse';
        var dataGh = [];

        try {
            if (typeof Storage !== 'undefined' && Storage.getAll) {
                dataGh = Storage.getAll(keyGh) || [];
            }
        } catch(e) {
            dataGh = [];
        }

        var optionsHtml = `<option value="Seluruh Farm">${t('select_gh_all')}</option>`;
        if (Array.isArray(dataGh) && dataGh.length > 0) {
            dataGh.forEach(function(gh) {
                if (gh && gh.kode) {
                    optionsHtml += `<option value="${gh.kode}">${gh.kode} - ${gh.nama || 'GH'}</option>`;
                }
            });
        } else {
            optionsHtml += `<option value="GH-01">${t('gh_default')}</option>`;
        }

        selectEl.innerHTML = optionsHtml;
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-calendar-alt" style="color: #2E7D32;"></i> ${t('module_title')}</div>
                
                <!-- 1. DASHBOARD RINGKASAN AGENDA -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;" id="jadwalStatCards">
                    <!-- Dynamic Stat Cards -->
                </div>

                <!-- 2. FORM INPUT AGENDA BARU -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;" id="formTitleJadwal">${t('form_title_add')}</div>
                    <form id="formJadwal">
                        <input type="hidden" id="jadwalId">
                        
                        <!-- ID GH & Tanggal Pelaksanaan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gh')}</label>
                                <select id="jadwalGh" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Seluruh Farm">${t('select_gh_all')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_date')}</label>
                                <input type="date" id="jadwalTanggal" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Judul Kegiatan & Waktu -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_title')}</label>
                                <input type="text" id="jadwalJudul" required placeholder="${t('ph_title')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_time')}</label>
                                <select id="jadwalWaktu" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Pagi (06:00 - 09:00)">${t('opt_time_morning')}</option>
                                    <option value="Siang (11:00 - 13:00)">${t('opt_time_noon')}</option>
                                    <option value="Sore (15:30 - 17:30)">${t('opt_time_afternoon')}</option>
                                    <option value="Fleksibel / Seharian">${t('opt_time_flexible')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Kategori & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_category')}</label>
                                <select id="jadwalKategori" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Nutrisi & Tandon">${t('opt_cat_nutrition')}</option>
                                    <option value="Penyemprotan (Spray)">${t('opt_cat_spray')}</option>
                                    <option value="Pruning & Pemeliharaan">${t('opt_cat_pruning')}</option>
                                    <option value="Sanitasi & Perawatan GH">${t('opt_cat_sanitation')}</option>
                                    <option value="Persiapan Panen">${t('opt_cat_harvest')}</option>
                                    <option value="Lainnya">${t('opt_cat_other')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_petugas')}</label>
                                <input type="text" id="jadwalPetugas" placeholder="${t('ph_petugas')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Prioritas & Status Penyelesaian -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_priority')}</label>
                                <select id="jadwalPrioritas" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Sedang">${t('opt_prio_medium')}</option>
                                    <option value="Tinggi (Mendesak)">${t('opt_prio_high')}</option>
                                    <option value="Rendah">${t('opt_prio_low')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_status')}</label>
                                <select id="jadwalStatus" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Belum Dikerjakan">${t('opt_status_pending')}</option>
                                    <option value="Selesai">${t('opt_status_done')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label>
                            <textarea id="jadwalDesc" rows="2" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #2E7D32; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelJadwalEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- 3. REKAP CARDS JADWAL GRID 2x2 -->
                <div class="section-title"><i class="fas fa-list-ul" style="color: #2E7D32;"></i> ${t('recap_title')}</div>
                <div id="containerJadwalCards"></div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadDashboard();
        loadTable();

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
                    gh: gh || t('select_gh_all'),
                    date: tanggal,
                    title: judul || '-',
                    waktu: waktu || t('opt_time_flexible'),
                    kategori: kategori || t('opt_cat_other'),
                    petugas: petugas || t('default_petugas'),
                    prioritas: prioritas || t('opt_prio_medium'),
                    status: status || 'Belum Dikerjakan',
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

        var data = [];
        try {
            var storageKey = getKey();
            if (typeof Storage !== 'undefined' && Storage.getAll) {
                data = Storage.getAll(storageKey) || [];
            }
        } catch(e) {
            data = [];
        }

        var totalAgenda = data.length;
        var pending = 0;
        var mendesak = 0;
        var selesai = 0;

        data.forEach(function(item) {
            var isSelesai = item.status === 'Selesai' || item.status === 'Completed';
            if (isSelesai) {
                selesai++;
            } else {
                pending++;
                if (item.prioritas && (item.prioritas.indexOf('Tinggi') !== -1 || item.prioritas.indexOf('High') !== -1)) {
                    mendesak++;
                }
            }
        });

        container.innerHTML = `
            <div style="background: var(--card-bg, #fff); padding: 12px; border-radius: 10px; border: 1px solid var(--border-color, #e8e8e8);">
                <div style="font-size: 10px; color: #777; font-weight: 600;">${t('stat_total')}</div>
                <div style="font-size: 16px; font-weight: bold; color: var(--text-color, #222);">${totalAgenda} ${t('unit_task')}</div>
            </div>
            <div style="background: ${pending > 0 ? '#FFF8E1' : 'var(--card-bg, #fff)'}; padding: 12px; border-radius: 10px; border: 1px solid ${pending > 0 ? '#FFE0B2' : 'var(--border-color, #e8e8e8)'};">
                <div style="font-size: 10px; color: ${pending > 0 ? '#E65100' : '#777'}; font-weight: 600;">${t('stat_pending')}</div>
                <div style="font-size: 16px; font-weight: bold; color: ${pending > 0 ? '#E65100' : 'var(--text-color, #222)'};">${pending} ${t('unit_task')}</div>
            </div>
            <div style="background: ${mendesak > 0 ? '#FFEBEE' : 'var(--card-bg, #fff)'}; padding: 12px; border-radius: 10px; border: 1px solid ${mendesak > 0 ? '#FFCDD2' : 'var(--border-color, #e8e8e8)'};">
                <div style="font-size: 10px; color: ${mendesak > 0 ? '#C62828' : '#777'}; font-weight: 600;">${t('stat_urgent')}</div>
                <div style="font-size: 16px; font-weight: bold; color: ${mendesak > 0 ? '#C62828' : 'var(--text-color, #222)'};">${mendesak} ${t('unit_task')}</div>
            </div>
            <div style="background: #E8F5E9; padding: 12px; border-radius: 10px; border: 1px solid #C8E6C9;">
                <div style="font-size: 10px; color: #2E7D32; font-weight: 600;">${t('stat_done')}</div>
                <div style="font-size: 16px; font-weight: bold; color: #2E7D32;">${selesai} ${t('unit_task')}</div>
            </div>
        `;
    }

    function loadTable() {
        var container = document.getElementById('containerJadwalCards');
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
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data')}</div>`;
            return;
        }

        data.sort(function(a, b) {
            var dateA = a && (a.date || a.tanggal) ? new Date(a.date || a.tanggal) : new Date(0);
            var dateB = b && (b.date || b.tanggal) ? new Date(b.date || b.tanggal) : new Date(0);
            return dateB - dateA;
        });

        var html = '';
        data.forEach(function(item) {
            if (!item) return;

            var valGh = item.gh ? item.gh : t('select_gh_all');
            var valDate = item.date || item.tanggal || '-';
            var valTitle = item.title || item.judul || 'Agenda Kegiatan';
            var valWaktu = item.waktu || item.timeSlot || t('opt_time_flexible');
            var valKategori = item.kategori || t('opt_cat_other');
            var valPrioritas = item.prioritas || t('opt_prio_medium');
            var valStatus = item.status || 'Belum Dikerjakan';
            var valDesc = item.desc || '';

            var isSelesai = valStatus === 'Selesai' || valStatus === 'Completed';
            var isHighPrio = valPrioritas.indexOf('Tinggi') !== -1 || valPrioritas.indexOf('High') !== -1;

            var badgeBg = isSelesai ? '#E8F5E9' : (isHighPrio ? '#FFEBEE' : '#FFF3E0');
            var badgeColor = isSelesai ? '#2E7D32' : (isHighPrio ? '#C62828' : '#E65100');

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <!-- Header Card: Tanggal, ID GH & Status -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #f0f0f0); padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: var(--text-color, #222);">${valDate}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                        </div>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">
                            ${isSelesai ? t('badge_done') : t('badge_pending')}
                        </span>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Nama Agenda & Waktu -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_agenda_time')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div style="text-decoration: ${isSelesai ? 'line-through' : 'none'};"><i class="fas fa-tasks" style="color: #2E7D32; width: 14px;"></i> <strong>${valTitle}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-clock" style="color: #0277BD; width: 14px;"></i> <strong>${valWaktu}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Kategori & Prioritas -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_cat_prio')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-tag" style="color: #6A1B9A; width: 14px;"></i> <strong>${valKategori}</strong></div>
                                <div style="margin-top: 3px; color: ${isHighPrio ? '#C62828' : 'var(--text-color, #333)'};"><i class="fas fa-flag" style="color: ${isHighPrio ? '#C62828' : '#F57F17'}; width: 14px;"></i> <strong>${t('lbl_prio_prefix')} ${valPrioritas}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Penanggung Jawab -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_petugas')}</div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); line-height: 1.4;">
                                <div><i class="fas fa-user-check" style="color: #0288D1; width: 14px;"></i> <strong>${item.petugas || t('default_petugas')}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Tombol Quick Toggle Status -->
                        <div style="background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${t('card_lbl_quick_action')}</div>
                            <button onclick="jadwal.toggleStatus('${item.id}')" style="background: ${isSelesai ? '#E0E0E0' : '#2E7D32'}; color: ${isSelesai ? '#333' : '#fff'}; border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
                                ${isSelesai ? t('btn_mark_pending') : t('btn_mark_done')}
                            </button>
                        </div>

                    </div>

                    <!-- Catatan Tambahan -->
                    ${valDesc ? `<div style="font-size: 12px; font-weight: bold; color: var(--text-color, #000); background: var(--inner-card-bg, #fdfdfd); padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">${t('lbl_notes')}: ${valDesc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px; margin-top: 4px;">
                        <span onclick="jadwal.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="jadwal.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function toggleStatus(id) {
        var storageKey = getKey();
        var item = Storage.getById(storageKey, id);
        if (!item) return;

        item.status = (item.status === 'Selesai' || item.status === 'Completed') ? 'Belum Dikerjakan' : 'Selesai';
        Storage.update(storageKey, item);

        loadDashboard();
        loadTable();

        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast(t('toast_status_updated'), 'success');
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

        populateGhDropdown();

        setVal('jadwalId', item.id || '');
        setVal('jadwalGh', item.gh || 'Seluruh Farm');
        setVal('jadwalTanggal', item.date || item.tanggal || '');
        setVal('jadwalJudul', item.title || item.judul || '');
        setVal('jadwalWaktu', item.waktu || item.timeSlot || t('opt_time_morning'));
        setVal('jadwalKategori', item.kategori || t('opt_cat_nutrition'));
        setVal('jadwalPetugas', item.petugas === t('default_petugas') ? '' : (item.petugas || ''));
        setVal('jadwalPrioritas', item.prioritas || t('opt_prio_medium'));
        setVal('jadwalStatus', item.status || 'Belum Dikerjakan');
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

    return {
        render: render,
        init: init,
        editItem: editItem,
        deleteItem: deleteItem,
        toggleStatus: toggleStatus
    };

})();

window.jadwal = jadwal;
