// ==========================================
// COZYCS FARM - MODUL JADWAL & AGENDA OPERASIONAL (CRUD)
// ==========================================

var jadwal = (function() {

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

        var optionsHtml = '<option value="Seluruh Farm">Seluruh Farm (Umum)</option>';
        if (Array.isArray(dataGh) && dataGh.length > 0) {
            dataGh.forEach(function(gh) {
                if (gh && gh.kode) {
                    optionsHtml += `<option value="${gh.kode}">${gh.kode} - ${gh.nama || 'GH'}</option>`;
                }
            });
        } else {
            optionsHtml += '<option value="GH-01">GH-01 (Default)</option>';
        }

        selectEl.innerHTML = optionsHtml;
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-calendar-alt" style="color: #2E7D32;"></i> Jadwal & Agenda Operasional</div>
                
                <!-- 1. DASHBOARD RINGKASAN AGENDA -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;" id="jadwalStatCards">
                    <!-- Dynamic Stat Cards -->
                </div>

                <!-- 2. FORM INPUT AGENDA BARU -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;" id="formTitleJadwal">Tambah Agenda / Tugas Baru</div>
                    <form id="formJadwal">
                        <input type="hidden" id="jadwalId">
                        
                        <!-- ID GH & Tanggal Pelaksanaan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Lokasi / ID GH</label>
                                <select id="jadwalGh" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Seluruh Farm">Seluruh Farm (Umum)</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Pelaksanaan</label>
                                <input type="date" id="jadwalTanggal" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Judul Kegiatan & Waktu -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Nama / Judul Kegiatan</label>
                                <input type="text" id="jadwalJudul" required placeholder="Contoh: Kuras Tandon Nutrisi Utama" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Waktu / Jam</label>
                                <select id="jadwalWaktu" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Pagi (06:00 - 09:00)">Pagi (06:00 - 09:00)</option>
                                    <option value="Siang (11:00 - 13:00)">Siang (11:00 - 13:00)</option>
                                    <option value="Sore (15:30 - 17:30)">Sore (15:30 - 17:30)</option>
                                    <option value="Fleksibel / Seharian">Fleksibel / Seharian</option>
                                </select>
                            </div>
                        </div>

                        <!-- Kategori & Penanggung Jawab -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Kategori Kegiatan</label>
                                <select id="jadwalKategori" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Nutrisi & Tandon">Nutrisi & Tandon</option>
                                    <option value="Penyemprotan (Spray)">Penyemprotan (Spray)</option>
                                    <option value="Pruning & Pemeliharaan">Pruning & Pemeliharaan</option>
                                    <option value="Sanitasi & Perawatan GH">Sanitasi & Perawatan GH</option>
                                    <option value="Persiapan Panen">Persiapan Panen</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Penanggung Jawab</label>
                                <input type="text" id="jadwalPetugas" placeholder="Contoh: Rizky" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Prioritas & Status Penyelesaian -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tingkat Prioritas</label>
                                <select id="jadwalPrioritas" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Sedang">Sedang (Normal)</option>
                                    <option value="Tinggi (Mendesak)">Tinggi (Mendesak)</option>
                                    <option value="Rendah">Rendah (Rutin)</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Status Penyelesaian</label>
                                <select id="jadwalStatus" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Belum Dikerjakan">Belum Dikerjakan</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>
                        </div>

                        <!-- Catatan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan Tambahan</label>
                            <textarea id="jadwalDesc" rows="2" placeholder="Instruksi khusus, dosis, alat yang disiapkan..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #2E7D32; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600;"><i class="fas fa-save"></i> Simpan Agenda</button>
                            <button type="button" id="btnCancelJadwalEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- 3. REKAP CARDS JADWAL GRID 2x2 -->
                <div class="section-title"><i class="fas fa-list-ul" style="color: #2E7D32;"></i> Daftar Agenda & Tugas Operasional</div>
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
                    gh: gh || 'Seluruh Farm',
                    date: tanggal, // diselaraskan dengan field 'date' di syncToSchedules
                    title: judul || '-',
                    waktu: waktu || 'Fleksibel',
                    kategori: kategori || 'Lainnya',
                    petugas: petugas || 'Penanggung Jawab',
                    prioritas: prioritas || 'Sedang',
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
                        Helper.showToast('Agenda berhasil disimpan!', 'success');
                    }
                } catch(err) {
                    console.error("Storage Error:", err);
                }

                form.reset();
                setVal('jadwalId', '');
                var titleEl = document.getElementById('formTitleJadwal');
                if (titleEl) titleEl.innerText = 'Tambah Agenda / Tugas Baru';
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
                if (titleEl) titleEl.innerText = 'Tambah Agenda / Tugas Baru';
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
            var isSelesai = item.status === 'Selesai';
            if (isSelesai) {
                selesai++;
            } else {
                pending++;
                if (item.prioritas && item.prioritas.indexOf('Tinggi') !== -1) {
                    mendesak++;
                }
            }
        });

        container.innerHTML = `
            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e8e8e8;">
                <div style="font-size: 10px; color: #777; font-weight: 600;">TOTAL AGENDA</div>
                <div style="font-size: 16px; font-weight: bold; color: #222;">${totalAgenda} Tugas</div>
            </div>
            <div style="background: ${pending > 0 ? '#FFF8E1' : '#fff'}; padding: 12px; border-radius: 10px; border: 1px solid ${pending > 0 ? '#FFE0B2' : '#e8e8e8'};">
                <div style="font-size: 10px; color: ${pending > 0 ? '#E65100' : '#777'}; font-weight: 600;">PENDING (BELUM)</div>
                <div style="font-size: 16px; font-weight: bold; color: ${pending > 0 ? '#E65100' : '#222'};">${pending} Tugas</div>
            </div>
            <div style="background: ${mendesak > 0 ? '#FFEBEE' : '#fff'}; padding: 12px; border-radius: 10px; border: 1px solid ${mendesak > 0 ? '#FFCDD2' : '#e8e8e8'};">
                <div style="font-size: 10px; color: ${mendesak > 0 ? '#C62828' : '#777'}; font-weight: 600;">MENDESAK (HIGH)</div>
                <div style="font-size: 16px; font-weight: bold; color: ${mendesak > 0 ? '#C62828' : '#222'};">${mendesak} Tugas</div>
            </div>
            <div style="background: #E8F5E9; padding: 12px; border-radius: 10px; border: 1px solid #C8E6C9;">
                <div style="font-size: 10px; color: #2E7D32; font-weight: 600;">SELESAI (DONE)</div>
                <div style="font-size: 16px; font-weight: bold; color: #2E7D32;">${selesai} Tugas</div>
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
            container.innerHTML = '<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada agenda operasional tercatat.</div>';
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

            var valGh = item.gh ? item.gh : 'Seluruh Farm';
            var valDate = item.date || item.tanggal || '-';
            var valTitle = item.title || item.judul || 'Agenda Kegiatan';
            var valWaktu = item.waktu || item.timeSlot || 'Fleksibel';
            var valKategori = item.kategori || 'Lainnya';
            var valPrioritas = item.prioritas || 'Sedang';
            var valStatus = item.status || 'Belum Dikerjakan';
            var valDesc = item.desc || '';

            var isSelesai = valStatus === 'Selesai';
            var badgeBg = isSelesai ? '#E8F5E9' : (valPrioritas.indexOf('Tinggi') !== -1 ? '#FFEBEE' : '#FFF3E0');
            var badgeColor = isSelesai ? '#2E7D32' : (valPrioritas.indexOf('Tinggi') !== -1 ? '#C62828' : '#E65100');

            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card: Tanggal, ID GH & Status -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${valDate}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                        </div>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">
                            ${isSelesai ? '✔ SELESAI' : 'PENDING'}
                        </span>
                    </div>

                    <!-- Grid 4 Kotak (2x2) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Nama Agenda & Waktu -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Agenda & Waktu</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div style="text-decoration: ${isSelesai ? 'line-through' : 'none'};"><i class="fas fa-tasks" style="color: #2E7D32; width: 14px;"></i> <strong>${valTitle}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-clock" style="color: #0277BD; width: 14px;"></i> <strong>${valWaktu}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Kategori & Prioritas -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Kategori & Prioritas</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-tag" style="color: #6A1B9A; width: 14px;"></i> <strong>${valKategori}</strong></div>
                                <div style="margin-top: 3px; color: ${valPrioritas.indexOf('Tinggi') !== -1 ? '#C62828' : '#333'};"><i class="fas fa-flag" style="color: ${valPrioritas.indexOf('Tinggi') !== -1 ? '#C62828' : '#F57F17'}; width: 14px;"></i> <strong>Prio: ${valPrioritas}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Penanggung Jawab -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Penanggung Jawab</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-user-check" style="color: #0288D1; width: 14px;"></i> <strong>${item.petugas || 'Penanggung Jawab'}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Tombol Quick Toggle Status -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Aksi Cepat Status</div>
                            <button onclick="jadwal.toggleStatus('${item.id}')" style="background: ${isSelesai ? '#E0E0E0' : '#2E7D32'}; color: ${isSelesai ? '#333' : '#fff'}; border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
                                ${isSelesai ? 'Tandai Belum' : 'Tandai Selesai'}
                            </button>
                        </div>

                    </div>

                    <!-- Catatan Tambahan -->
                    ${valDesc ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${valDesc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #eee; padding-top: 8px; margin-top: 4px;">
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

        item.status = (item.status === 'Selesai') ? 'Belum Dikerjakan' : 'Selesai';
        Storage.update(storageKey, item);

        loadDashboard();
        loadTable();

        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast('Status agenda berhasil diperbarui!', 'success');
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
        setVal('jadwalWaktu', item.waktu || item.timeSlot || 'Pagi (06:00 - 09:00)');
        setVal('jadwalKategori', item.kategori || 'Nutrisi & Tandon');
        setVal('jadwalPetugas', item.petugas === 'Penanggung Jawab' ? '' : (item.petugas || ''));
        setVal('jadwalPrioritas', item.prioritas || 'Sedang');
        setVal('jadwalStatus', item.status || 'Belum Dikerjakan');
        setVal('jadwalDesc', item.desc || '');

        var titleEl = document.getElementById('formTitleJadwal');
        if (titleEl) titleEl.innerText = 'Edit Agenda Operasional';
        
        var btnCancel = document.getElementById('btnCancelJadwalEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm('Apakah kamu yakin ingin menghapus agenda ini?')) {
            try {
                var storageKey = getKey();
                if (typeof Storage !== 'undefined' && Storage.remove) {
                    Storage.remove(storageKey, id);
                }
            } catch(e) {}
            loadDashboard();
            loadTable();
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
