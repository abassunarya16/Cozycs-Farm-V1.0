// ==========================================
// COZYCS FARM - MODUL JADWAL & RIWAYAT SPRAY (CRUD)
// ==========================================

var spray = (function() {

    // Helper internal kunci penyimpanan agar aman & anti-crash
    function getStorageKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.SPRAY) {
            return Storage.KEYS.SPRAY;
        }
        return 'cozycs_spray';
    }

    // Fungsi untuk mengisi opsi dropdown ID GH dari data Greenhouse
    function populateGhDropdown() {
        var selectEl = document.getElementById('sprayGh');
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

        var optionsHtml = '<option value="">-- Pilih Greenhouse --</option>';
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
                <div class="section-title"><i class="fas fa-spray-can" style="color: #6A1B9A;"></i> Jadwal & Riwayat Spray</div>
                
                <!-- Form Input / Edit Data Spray -->
                <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e8e8e8; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <div style="font-size: 14px; font-weight: 700; color: #6A1B9A; margin-bottom: 12px;" id="formTitleSpray">Tambah Jadwal / Aksi Spray</div>
                    <form id="formSpray">
                        <input type="hidden" id="sprayId">
                        
                        <!-- ID GH (Dropdown Konek ke Modul Greenhouse) & Tanggal Pelaksanaan -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">ID GH</label>
                                <select id="sprayGh" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="">-- Pilih Greenhouse --</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tanggal Pelaksanaan</label>
                                <input type="date" id="sprayDate" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Waktu Penyemprotan (Pagi / Sore) -->
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Waktu Penyemprotan</label>
                            <select id="sprayTimeSlot" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                <option value="Pagi (06:00 - 08:00)">Pagi (06:00 - 08:00)</option>
                                <option value="Sore (16:00 - 17:30)">Sore (16:00 - 17:30)</option>
                            </select>
                        </div>

                        <!-- Nama Produk Terpisah (Bubuk & Cairan) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Nama Produk (Bubuk)</label>
                                <input type="text" id="sprayProductBubuk" placeholder="Contoh: Antracol" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Nama Produk (Cairan)</label>
                                <input type="text" id="sprayProductCairan" placeholder="Contoh: Demolish" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Jenis Penyemprotan Terpisah (2 Kolom Grid) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Fungisida & Insektisida</label>
                                <input type="text" id="sprayTypeFungInsek" placeholder="Contoh: Antracol / Demolish" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Fertilizer / Pupuk Daun</label>
                                <input type="text" id="sprayTypeFertilizer" placeholder="Contoh: Gandasil D" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Dosis Terpisah (Gram & ml) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Dosis (Gram)</label>
                                <input type="text" id="sprayDoseGram" placeholder="Contoh: 2 gram / 16L" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Dosis (ml)</label>
                                <input type="text" id="sprayDoseMl" placeholder="Contoh: 15 ml / 16L" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Sasaran Hama & Penyakit -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Pengendalian Hama</label>
                                <input type="text" id="sprayTargetHama" placeholder="Contoh: Thrips, Kutu kebul" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Pengendalian Penyakit</label>
                                <input type="text" id="sprayTargetPenyakit" placeholder="Contoh: Powdery mildew, Busuk" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <!-- Catatan Tambahan -->
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan Tambahan (Opsional)</label>
                            <textarea id="sprayDesc" rows="2" placeholder="Catatan khusus pelaksanaan..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #6A1B9A;"><i class="fas fa-save"></i> Simpan Jadwal Spray</button>
                            <button type="button" id="btnCancelSprayEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                        </div>
                    </form>
                </div>

                <!-- Rekap Data / Card List Grid 2x2 -->
                <div class="section-title"><i class="fas fa-list" style="color: #6A1B9A;"></i> Rekap Riwayat & Jadwal Spray</div>
                <div id="containerSprayCards">
                    <!-- Diisi dinamis oleh JavaScript -->
                </div>
            </div>
        `;
    }

    function init() {
        populateGhDropdown();
        loadTable();

        var form = document.getElementById('formSpray');
        var btnCancel = document.getElementById('btnCancelSprayEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var idEl = document.getElementById('sprayId');
                var ghEl = document.getElementById('sprayGh');
                var dateEl = document.getElementById('sprayDate');
                var timeSlotEl = document.getElementById('sprayTimeSlot');
                var productBubukEl = document.getElementById('sprayProductBubuk');
                var productCairanEl = document.getElementById('sprayProductCairan');
                var typeFungInsekEl = document.getElementById('sprayTypeFungInsek');
                var typeFertilizerEl = document.getElementById('sprayTypeFertilizer');
                var doseGramEl = document.getElementById('sprayDoseGram');
                var doseMlEl = document.getElementById('sprayDoseMl');
                var targetHamaEl = document.getElementById('sprayTargetHama');
                var targetPenyakitEl = document.getElementById('sprayTargetPenyakit');
                var descEl = document.getElementById('sprayDesc');

                var payload = {
                    gh: (ghEl && ghEl.value) ? ghEl.value : '-',
                    date: dateEl ? dateEl.value : '',
                    timeSlot: timeSlotEl ? timeSlotEl.value : 'Pagi (06:00 - 08:00)',
                    productBubuk: (productBubukEl && productBubukEl.value) ? productBubukEl.value : '-',
                    productCairan: (productCairanEl && productCairanEl.value) ? productCairanEl.value : '-',
                    typeFungInsek: (typeFungInsekEl && typeFungInsekEl.value) ? typeFungInsekEl.value : '-',
                    typeFertilizer: (typeFertilizerEl && typeFertilizerEl.value) ? typeFertilizerEl.value : '-',
                    doseGram: (doseGramEl && doseGramEl.value) ? doseGramEl.value : '-',
                    doseMl: (doseMlEl && doseMlEl.value) ? doseMlEl.value : '-',
                    targetHama: (targetHamaEl && targetHamaEl.value) ? targetHamaEl.value : '-',
                    targetPenyakit: (targetPenyakitEl && targetPenyakitEl.value) ? targetPenyakitEl.value : '-',
                    desc: descEl ? descEl.value : '',
                    module: 'spray',
                    icon: 'fa-spray-can',
                    color: '#6A1B9A',
                    bg: '#F3E5F5'
                };

                var key = getStorageKey();
                var id = idEl ? idEl.value : '';

                if (id) {
                    payload.id = id;
                    if (typeof Storage !== 'undefined' && Storage.update) {
                        Storage.update(key, payload);
                    }
                    syncToSchedules(payload);

                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast('Jadwal spray berhasil diperbarui!', 'success');
                    }
                } else {
                    var added = null;
                    if (typeof Storage !== 'undefined' && Storage.add) {
                        added = Storage.add(key, payload);
                    }
                    if (added) {
                        syncToSchedules(added);
                    }

                    if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                        Helper.showToast('Jadwal spray berhasil ditambahkan!', 'success');
                    }
                }

                form.reset();
                if (idEl) idEl.value = '';
                var titleEl = document.getElementById('formTitleSpray');
                if (titleEl) titleEl.innerText = 'Tambah Jadwal / Aksi Spray';
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                var idEl = document.getElementById('sprayId');
                if (idEl) idEl.value = '';
                var titleEl = document.getElementById('formTitleSpray');
                if (titleEl) titleEl.innerText = 'Tambah Jadwal / Aksi Spray';
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerSprayCards');
        if (!container) return;

        var key = getStorageKey();
        var data = [];
        if (typeof Storage !== 'undefined' && Storage.getAll) {
            data = Storage.getAll(key) || [];
        }

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #e8e8e8;">Belum ada jadwal spray tercatat.</div>`;
            return;
        }

        // Urutkan dari tanggal terbaru
        data.sort(function(a, b) {
            return new Date(b.date || 0) - new Date(a.date || 0);
        });

        var html = '';
        data.forEach(function(item) {
            var valGh = item.gh ? item.gh : '-';
            var displayBubuk = item.productBubuk || item.title || '-';
            var displayCairan = item.productCairan || '-';
            var displayFungInsek = item.typeFungInsek || item.sprayType || '-';
            var displayFertilizer = item.typeFertilizer || '-';

            html += `
                <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <!-- Header Card: Tanggal, ID GH & Waktu -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 14px; color: #222;">${item.date || '-'}</strong>
                            <span style="background: #2E7D32; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">GH: ${valGh}</span>
                            <span style="background: #F3E5F5; color: #6A1B9A; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 4px;">${item.timeSlot || ''}</span>
                        </div>
                    </div>

                    <!-- Grid 4 Kotak (2x2) Ukuran Sama Rata -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        
                        <!-- 1. Kiri Atas: Nama Produk (Bubuk & Cairan) -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Nama Produk</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-box" style="color: #8D6E63; width: 14px;"></i> <strong>${displayBubuk}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-wine-bottle" style="color: #0288D1; width: 14px;"></i> <strong>${displayCairan}</strong></div>
                            </div>
                        </div>

                        <!-- 2. Kanan Atas: Dosis (Gram & ml) -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Dosis Aplikasi</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-weight-hanging" style="color: #6A1B9A; width: 14px;"></i> <strong>${item.doseGram || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-flask" style="color: #0277BD; width: 14px;"></i> <strong>${item.doseMl || '-'}</strong></div>
                            </div>
                        </div>

                        <!-- 3. Kiri Bawah: Jenis Penyemprotan -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Jenis Penyemprotan</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-shield-alt" style="color: #C2185B; width: 14px;"></i> <strong>${displayFungInsek}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-seedling" style="color: #2E7D32; width: 14px;"></i> <strong>${displayFertilizer}</strong></div>
                            </div>
                        </div>

                        <!-- 4. Kanan Bawah: Sasaran Hama & Penyakit -->
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; min-height: 54px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 10px; color: #777; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Sasaran Hama & Penyakit</div>
                            <div style="font-size: 12px; font-weight: bold; color: #000; line-height: 1.4;">
                                <div><i class="fas fa-bug" style="color: #D32F2F; width: 14px;"></i> <strong>${item.targetHama || '-'}</strong></div>
                                <div style="margin-top: 3px;"><i class="fas fa-shield-virus" style="color: #7B1FA2; width: 14px;"></i> <strong>${item.targetPenyakit || '-'}</strong></div>
                            </div>
                        </div>

                    </div>

                    <!-- Catatan Tambahan (Jika Ada) -->
                    ${item.desc ? `<div style="font-size: 12px; font-weight: bold; color: #000; background: #fdfdfd; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">Catatan: ${item.desc}</div>` : ''}

                    <!-- Tombol Aksi Logo Saja -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #eee; padding-top: 8px; margin-top: 4px;">
                        <span onclick="spray.editItem('${item.id}')" title="Edit" style="cursor: pointer; color: #F57F17; font-size: 14px; padding: 4px;"><i class="fas fa-pen"></i></span>
                        <span onclick="spray.deleteItem('${item.id}')" title="Hapus" style="cursor: pointer; color: #C62828; font-size: 14px; padding: 4px;"><i class="fas fa-trash"></i></span>
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

        populateGhDropdown();

        var idEl = document.getElementById('sprayId');
        var ghEl = document.getElementById('sprayGh');
        var dateEl = document.getElementById('sprayDate');
        var timeSlotEl = document.getElementById('sprayTimeSlot');
        var productBubukEl = document.getElementById('sprayProductBubuk');
        var productCairanEl = document.getElementById('sprayProductCairan');
        var typeFungInsekEl = document.getElementById('sprayTypeFungInsek');
        var typeFertilizerEl = document.getElementById('sprayTypeFertilizer');
        var doseGramEl = document.getElementById('sprayDoseGram');
        var doseMlEl = document.getElementById('sprayDoseMl');
        var targetHamaEl = document.getElementById('sprayTargetHama');
        var targetPenyakitEl = document.getElementById('sprayTargetPenyakit');
        var descEl = document.getElementById('sprayDesc');

        if (idEl) idEl.value = item.id || '';
        if (ghEl) ghEl.value = item.gh === '-' ? '' : (item.gh || '');
        if (dateEl) dateEl.value = item.date || '';
        if (timeSlotEl) timeSlotEl.value = item.timeSlot || 'Pagi (06:00 - 08:00)';
        if (productBubukEl) productBubukEl.value = (item.productBubuk && item.productBubuk !== '-') ? item.productBubuk : (item.title || '');
        if (productCairanEl) productCairanEl.value = (item.productCairan && item.productCairan !== '-') ? item.productCairan : '';
        if (typeFungInsekEl) typeFungInsekEl.value = (item.typeFungInsek && item.typeFungInsek !== '-') ? item.typeFungInsek : (item.sprayType || '');
        if (typeFertilizerEl) typeFertilizerEl.value = (item.typeFertilizer && item.typeFertilizer !== '-') ? item.typeFertilizer : '';
        if (doseGramEl) doseGramEl.value = (item.doseGram && item.doseGram !== '-') ? item.doseGram : '';
        if (doseMlEl) doseMlEl.value = (item.doseMl && item.doseMl !== '-') ? item.doseMl : '';
        if (targetHamaEl) targetHamaEl.value = (item.targetHama && item.targetHama !== '-') ? item.targetHama : '';
        if (targetPenyakitEl) targetPenyakitEl.value = (item.targetPenyakit && item.targetPenyakit !== '-') ? item.targetPenyakit : '';
        if (descEl) descEl.value = item.desc || '';

        var titleEl = document.getElementById('formTitleSpray');
        if (titleEl) titleEl.innerText = 'Edit Jadwal Spray';
        
        var btnCancel = document.getElementById('btnCancelSprayEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm('Apakah kamu yakin ingin menghapus jadwal spray ini?')) {
            var key = getStorageKey();
            if (typeof Storage !== 'undefined' && Storage.remove) {
                Storage.remove(key, id);
            }
            removeFromSchedules(id);
            loadTable();
            if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                Helper.showToast('Jadwal spray berhasil dihapus', 'error');
            }
        }
    }

    function syncToSchedules(item) {
        if (typeof Storage === 'undefined' || !Storage.getAll || !Storage.saveAll) return;
        var schedules = Storage.getAll('cozycs_schedules') || [];
        var prodText = (item.productBubuk && item.productBubuk !== '-' ? item.productBubuk : '') + ' ' + (item.productCairan && item.productCairan !== '-' ? item.productCairan : '');
        var ghText = (item.gh && item.gh !== '-') ? ('[' + item.gh + '] ') : '';
        var schedulePayload = Object.assign({}, item, {
            title: 'Spray ' + ghText + ': ' + (prodText.trim() ? prodText : 'Aktivitas Spray')
        });
        
        var index = schedules.findIndex(function(s) { return s.id === item.id; });
        if (index >= 0) {
            schedules[index] = schedulePayload;
        } else {
            schedules.unshift(schedulePayload);
        }
        Storage.saveAll('cozycs_schedules', schedules);
    }

    function removeFromSchedules(id) {
        if (typeof Storage === 'undefined' || !Storage.getAll || !Storage.saveAll) return;
        var schedules = Storage.getAll('cozycs_schedules') || [];
        var filtered = schedules.filter(function(s) { return s.id !== id; });
        Storage.saveAll('cozycs_schedules', filtered);
    }

    return {
        render: render,
        init: init,
        editItem: editItem,
        deleteItem: deleteItem
    };

})();
