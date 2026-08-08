// ==========================================
// COZYCS FARM - MODUL MONITORING CCTV GREENHOUSE
// (WITH LIVE STREAM MODAL, AUTO-DRAFT & DASHBOARD LOG)
// ==========================================

var cctv = (function() {

    // VARIABEL STATE UNTUK PENCARIAN & PAGINASI
    var searchQuery = '';
    var currentPage = 1;
    var itemsPerPage = 20;

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Monitoring Live CCTV Greenhouse',
            'form_title_add': 'Tambah Kamera CCTV Baru',
            'form_title_edit': 'Edit Konfigurasi Kamera',
            'lbl_name': 'Nama Kamera / Area',
            'ph_name': 'Contoh: CCTV GH-01 Pintu Utama',
            'lbl_gh': 'Lokasi Greenhouse / Area',
            'select_gh': '-- Pilih Greenhouse / Area --',
            'gh_default': 'GH-01 (Default)',
            'lbl_stream_url': 'URL Stream / IP Camera (HTTP / RTSP / WebRTC)',
            'ph_stream_url': 'Contoh: http://192.168.1.100:8080/video',
            'lbl_status': 'Status Koneksi',
            'opt_online': 'Online / Aktif',
            'opt_maintenance': 'Maintenance / Perbaikan',
            'opt_offline': 'Offline / Terputus',
            'lbl_type': 'Tipe Kamera',
            'opt_type_ptz': 'PTZ (Pan-Tilt-Zoom)',
            'opt_type_fixed': 'Fixed / Statis 1080p',
            'lbl_desc': 'Catatan / Keterangan Area',
            'ph_desc': 'Contoh: Mengawasi talang 1-12 & tangki nutrisi...',
            'btn_save': 'Simpan Kamera',
            'btn_cancel': 'Batal',
            'recap_title': 'Daftar Kamera & Feed Live Monitoring',
            'no_data': 'Belum ada kamera CCTV yang terdaftar.',
            'lbl_live_view': 'Live Fullscreen',
            'toast_saved': 'Kamera CCTV berhasil disimpan!',
            'confirm_delete': 'Apakah kamu yakin ingin menghapus kamera ini?',
            'toast_deleted': 'Kamera CCTV berhasil dihapus',
            'ph_search': '🔍 Cari nama kamera, GH, status, atau IP stream...',
            'btn_prev': '⬅️ Sebelum',
            'btn_next': 'Selanjutnya ➡️',
            'page_lbl': 'Halaman',
            'total_lbl': 'Total Kamera'
        },
        'en': {
            'module_title': 'Live Greenhouse CCTV Monitoring',
            'form_title_add': 'Add New CCTV Camera',
            'form_title_edit': 'Edit Camera Configuration',
            'lbl_name': 'Camera / Area Name',
            'ph_name': 'e.g., CCTV GH-01 Main Gate',
            'lbl_gh': 'Greenhouse / Area Location',
            'select_gh': '-- Select Greenhouse / Area --',
            'gh_default': 'GH-01 (Default)',
            'lbl_stream_url': 'Stream URL / IP Camera (HTTP / RTSP / WebRTC)',
            'ph_stream_url': 'e.g., http://192.168.1.100:8080/video',
            'lbl_status': 'Connection Status',
            'opt_online': 'Online / Active',
            'opt_maintenance': 'Maintenance',
            'opt_offline': 'Offline / Disconnected',
            'lbl_type': 'Camera Type',
            'opt_type_ptz': 'PTZ (Pan-Tilt-Zoom)',
            'opt_type_fixed': 'Fixed 1080p',
            'lbl_desc': 'Area Notes / Description',
            'ph_desc': 'e.g., Monitoring gutter 1-12 & nutrient tank...',
            'btn_save': 'Save Camera',
            'btn_cancel': 'Cancel',
            'recap_title': 'Camera List & Live Feeds',
            'no_data': 'No CCTV cameras registered yet.',
            'lbl_live_view': 'Live Fullscreen',
            'toast_saved': 'CCTV Camera saved successfully!',
            'confirm_delete': 'Are you sure you want to delete this camera?',
            'toast_deleted': 'CCTV Camera deleted successfully',
            'ph_search': '🔍 Search camera name, GH, status, or IP stream...',
            'btn_prev': '⬅️ Prev',
            'btn_next': 'Next ➡️',
            'page_lbl': 'Page',
            'total_lbl': 'Total Cameras'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function getKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.CCTV) {
            return Storage.KEYS.CCTV;
        }
        return 'cozycs_cctv';
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val;
    }

    function populateGhDropdown() {
        var selectEl = document.getElementById('cctvGh');
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

        var optionsHtml = `<option value="">${t('select_gh')}</option>`;
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
                <div class="section-title"><i class="fas fa-video" style="color: #0288D1;"></i> ${t('module_title')}</div>
                
                <!-- Form Input / Edit Konfigurasi CCTV -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #0288D1; margin-bottom: 12px;" id="formTitleCctv">${t('form_title_add')}</div>
                    <form id="formCctv">
                        <input type="hidden" id="cctvId">
                        
                        <!-- Nama Kamera & Lokasi GH -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_name')}</label>
                                <input type="text" id="cctvNama" required placeholder="${t('ph_name')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_gh')}</label>
                                <select id="cctvGh" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="">${t('select_gh')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- URL Stream & Status -->
                        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_stream_url')}</label>
                                <input type="text" id="cctvUrl" placeholder="${t('ph_stream_url')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_status')}</label>
                                <select id="cctvStatus" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="Online">${t('opt_online')}</option>
                                    <option value="Maintenance">${t('opt_maintenance')}</option>
                                    <option value="Offline">${t('opt_offline')}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Tipe Kamera & Catatan -->
                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 10px; margin-bottom: 12px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_type')}</label>
                                <select id="cctvTipe" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: var(--card-bg, #fff);">
                                    <option value="PTZ (Pan-Tilt-Zoom)">${t('opt_type_ptz')}</option>
                                    <option value="Fixed 1080p">${t('opt_type_fixed')}</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">${t('lbl_desc')}</label>
                                <input type="text" id="cctvDesc" placeholder="${t('ph_desc')}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #0288D1; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> ${t('btn_save')}</button>
                            <button type="button" id="btnCancelCctvEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">${t('btn_cancel')}</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data Title -->
                <div class="section-title"><i class="fas fa-th-large" style="color: #0288D1;"></i> ${t('recap_title')}</div>
                
                <!-- Kotak Pencarian Khusus Modul CCTV -->
                <div style="margin-bottom: 14px;">
                    <input type="text" id="inputSearchCctv" 
                           placeholder="${t('ph_search')}" 
                           oninput="cctv.handleSearch(this.value)"
                           value="${searchQuery}"
                           style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color, #ccc); font-size: 13px; box-sizing: border-box; background: var(--card-bg, #fff); color: var(--text-color, #222);">
                </div>

                <!-- Container Grid Feed CCTV -->
                <div id="containerCctvCards"></div>

                <!-- Kontrol Navigasi Paginasi -->
                <div id="paginationCctvControls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; margin-bottom: 20px; font-size: 12px;"></div>

                <!-- Modal Live View Fullscreen -->
                <div id="cctvModalView" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 99999; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box; backdrop-filter: blur(4px);">
                    <div style="background: var(--card-bg, #fff); width: 100%; max-width: 800px; border-radius: 16px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--border-color, #eee); padding-bottom: 8px;">
                            <strong id="cctvModalTitle" style="font-size: 15px; color: var(--text-color, #222);">Live Camera Stream</strong>
                            <span onclick="cctv.closeModalView()" style="cursor: pointer; font-size: 18px; color: #C62828; padding: 4px;"><i class="fas fa-times"></i></span>
                        </div>
                        <div id="cctvModalBody" style="width: 100%; height: 400px; background: #000; border-radius: 10px; overflow: hidden; display: flex; align-items: center; justify-content: center; color: #fff;">
                            <!-- Iframe / Stream Player disuntikkan di sini -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        // Pemulihan Draf Form Terakhir
        if (typeof restoreFormDraftGlobal === 'function') {
            restoreFormDraftGlobal('formCctv');
        }

        var form = document.getElementById('formCctv');
        var btnCancel = document.getElementById('btnCancelCctvEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('cctvId');
                var nama = getVal('cctvNama');
                var gh = getVal('cctvGh');
                var url = getVal('cctvUrl');
                var status = getVal('cctvStatus');
                var tipe = getVal('cctvTipe');
                var desc = getVal('cctvDesc');

                var payload = {
                    nama: nama,
                    gh: gh || '-',
                    url: url || '',
                    status: status || 'Online',
                    tipe: tipe || 'Fixed 1080p',
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

                    // Log Aktivitas Terakhir Dasbor
                    if (typeof Storage !== 'undefined' && Storage.add) {
                        var keyAktivitas = (Storage.KEYS && Storage.KEYS.AKTIVITAS) ? Storage.KEYS.AKTIVITAS : 'cozycs_aktivitas';
                        var now = new Date();
                        var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

                        Storage.add(keyAktivitas, {
                            judul: id ? 'Perbarui CCTV' : 'Tambah CCTV Baru',
                            deskripsi: (nama || 'Kamera') + ' (' + (gh || 'GH') + ') - Status: ' + (status || 'Online'),
                            tanggal: now.toISOString().split('T')[0],
                            jam: timeStr,
                            kategori: 'CCTV',
                            icon: 'fas fa-video',
                            color: '#0288D1'
                        });
                    }

                    if (typeof Helper !== 'undefined' && Helper.showToast) {
                        Helper.showToast(t('toast_saved'), 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('cctvId', '');
                var titleEl = document.getElementById('formTitleCctv');
                if (titleEl) titleEl.innerText = t('form_title_add');
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('cctvId', '');
                var titleEl = document.getElementById('formTitleCctv');
                if (titleEl) titleEl.innerText = t('form_title_add');
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerCctvCards');
        var pageEl = document.getElementById('paginationCctvControls');
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
            if (pageEl) pageEl.innerHTML = '';
            return;
        }

        // Filter data berdasarkan pencarian
        var filteredData = data.filter(function(item) {
            if (!searchQuery) return true;
            var kw = searchQuery.toLowerCase();
            var nama = (item.nama || '').toLowerCase();
            var gh = (item.gh || '').toLowerCase();
            var status = (item.status || '').toLowerCase();
            var url = (item.url || '').toLowerCase();
            var desc = (item.desc || '').toLowerCase();
            return nama.includes(kw) || gh.includes(kw) || status.includes(kw) || url.includes(kw) || desc.includes(kw);
        });

        if (filteredData.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">${t('no_data')}</div>`;
            if (pageEl) pageEl.innerHTML = '';
            return;
        }

        // Paginasi
        var totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        var pageData = filteredData.slice(startIndex, endIndex);

        // Render Cards Grid Feed Kamera
        var html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px;">';
        pageData.forEach(function(item) {
            if (!item) return;

            var valStatus = item.status || 'Online';
            var statusBg = '#E8F5E9';
            var statusColor = '#2E7D32';
            if (valStatus === 'Maintenance') {
                statusBg = '#FFF3E0';
                statusColor = '#E65100';
            } else if (valStatus === 'Offline') {
                statusBg = '#FFEBEE';
                statusColor = '#C62828';
            }

            var streamContent = '';
            if (item.url && item.url.startsWith('http')) {
                streamContent = `<iframe src="${item.url}" style="width:100%; height:100%; border:none;" scrolling="no"></iframe>`;
            } else {
                streamContent = `
                    <div style="text-align:center; color:#aaa; font-size:12px;">
                        <i class="fas fa-video-slash" style="font-size:24px; margin-bottom:6px; color:#666;"></i>
                        <div>Live Feed Standby</div>
                        <div style="font-size:10px; color:#777;">${item.url || 'RTSP Stream'}</div>
                    </div>
                `;
            }

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e8e8e8); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;">
                    <!-- Player Display Box -->
                    <div style="width: 100%; height: 180px; background: #111; display: flex; align-items: center; justify-content: center; position: relative;">
                        ${streamContent}
                        <span style="position: absolute; top: 10px; right: 10px; background: ${statusBg}; color: ${statusColor}; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: bold;">
                            ● ${valStatus}
                        </span>
                        <span style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.6); color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: bold;">
                            GH: ${item.gh || '-'}
                        </span>
                    </div>

                    <!-- Meta Detail Kamera -->
                    <div style="padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <strong style="font-size: 13px; color: var(--text-color, #222);">${item.nama || 'CCTV'}</strong>
                            <div style="font-size: 11px; color: #777; margin-top: 2px;">Tipe: ${item.tipe || 'Fixed'}</div>
                            ${item.desc ? `<div style="font-size: 11px; color: #555; margin-top: 4px;">${item.desc}</div>` : ''}
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px;">
                            <button onclick="cctv.openModalView('${item.id}')" style="background: #E1F5FE; color: #0288D1; border: 1px solid #B3E5FC; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
                                <i class="fas fa-expand"></i> ${t('lbl_live_view')}
                            </button>
                            <div>
                                <span onclick="cctv.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 13px; padding: 4px; margin-right: 6px;"><i class="fas fa-pen"></i></span>
                                <span onclick="cctv.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 13px; padding: 4px;"><i class="fas fa-trash"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;

        // Render Tombol Paginasi
        if (pageEl) {
            if (totalPages > 1) {
                pageEl.innerHTML = `
                    <button onclick="cctv.changePage(-1)" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_prev')}
                    </button>
                    <span style="font-weight: bold; color: var(--text-color, #555);">
                        ${t('page_lbl')} ${currentPage} / ${totalPages} (${filteredData.length} kamera)
                    </span>
                    <button onclick="cctv.changePage(1)" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="cursor:pointer;"'} class="btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--card-bg, #f5f5f5); font-weight: bold; color: var(--text-color, #333);">
                        ${t('btn_next')}
                    </button>
                `;
            } else {
                pageEl.innerHTML = `<span style="color: #777; font-size: 11px;">${t('total_lbl')}: ${filteredData.length} kamera</span>`;
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

        populateGhDropdown();

        setVal('cctvId', item.id || '');
        setVal('cctvNama', item.nama || '');
        setVal('cctvGh', item.gh === '-' ? '' : (item.gh || ''));
        setVal('cctvUrl', item.url || '');
        setVal('cctvStatus', item.status || 'Online');
        setVal('cctvTipe', item.tipe || 'Fixed 1080p');
        setVal('cctvDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleCctv');
        if (titleEl) titleEl.innerText = t('form_title_edit');
        
        var btnCancel = document.getElementById('btnCancelCctvEdit');
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
            loadTable();
            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast(t('toast_deleted'), 'error');
            }
        }
    }

    function openModalView(id) {
        var storageKey = getKey();
        var item = null;
        try {
            if (typeof Storage !== 'undefined' && Storage.getById) {
                item = Storage.getById(storageKey, id);
            }
        } catch(e) {}

        if (!item) return;

        var titleEl = document.getElementById('cctvModalTitle');
        var bodyEl = document.getElementById('cctvModalBody');
        var modalEl = document.getElementById('cctvModalView');

        if (titleEl) titleEl.innerText = item.nama + ' (GH: ' + (item.gh || '-') + ')';
        if (bodyEl) {
            if (item.url && item.url.startsWith('http')) {
                bodyEl.innerHTML = `<iframe src="${item.url}" style="width:100%; height:100%; border:none;"></iframe>`;
            } else {
                bodyEl.innerHTML = `
                    <div style="text-align:center;">
                        <i class="fas fa-video" style="font-size:42px; color:#0288D1; margin-bottom:12px;"></i>
                        <div style="font-size:16px; font-weight:bold;">Live Stream Feeds</div>
                        <div style="font-size:12px; color:#aaa; margin-top:4px;">${item.url || 'Stream IP Camera'}</div>
                    </div>
                `;
            }
        }
        if (modalEl) modalEl.style.display = 'flex';
    }

    function closeModalView() {
        var modalEl = document.getElementById('cctvModalView');
        var bodyEl = document.getElementById('cctvModalBody');
        if (bodyEl) bodyEl.innerHTML = '';
        if (modalEl) modalEl.style.display = 'none';
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
        editItem: editItem,
        deleteItem: deleteItem,
        openModalView: openModalView,
        closeModalView: closeModalView,
        handleSearch: handleSearch,
        changePage: changePage
    };

})();

window.cctv = cctv;
