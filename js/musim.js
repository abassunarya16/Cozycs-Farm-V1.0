// ==========================================
// COZYCS FARM - MODUL MANAJEMEN MUSIM TANAM PRESISI
// (MASTER DATA SIKLUS MUSIM TANAM S.D. REKAP PENJUALAN)
// ==========================================

var musim = (function() {

    var searchQuery = '';
    var itemsPerPage = 10;
    var currentPage = 1;

    function getKey() {
        if (typeof Storage !== 'undefined' && Storage.KEYS && Storage.KEYS.MUSIM) {
            return Storage.KEYS.MUSIM;
        }
        return 'cozycs_musim';
    }

    function getData() {
        var key = getKey();
        try {
            if (typeof Storage !== 'undefined' && typeof Storage.getAll === 'function') {
                var res = Storage.getAll(key);
                if (Array.isArray(res) && res.length > 0) return res;
            }
            var raw = localStorage.getItem(key);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch(e) {
            console.error('[Musim] Gagal membaca data ' + key, e);
        }
        return getSeedData();
    }

    // DATA DEFAULT AWAL KETIKA SISTEM PERTAMA KALI JALAN
    function getSeedData() {
        var seed = [
            {
                id: 'musim_1',
                nama: 'Musim 1',
                status: 'Selesai',
                tglMulai: '2025-01-10',
                tglSelesai: '2025-04-05',
                ghList: ['GH-01'],
                catatan: 'Musim perdana GH-01 (Inthanon)'
            },
            {
                id: 'musim_2',
                nama: 'Musim 2',
                status: 'Selesai',
                tglMulai: '2025-05-01',
                tglSelesai: '2025-07-25',
                ghList: ['GH-01'],
                catatan: 'Musim kedua GH-01'
            },
            {
                id: 'musim_3',
                nama: 'Musim 3',
                status: 'Aktif',
                tglMulai: '2025-08-10',
                tglSelesai: '2025-11-15',
                ghList: ['GH-01', 'GH-02'],
                catatan: 'Musim ekspansi penambahan GH-02'
            }
        ];
        var key = getKey();
        try {
            localStorage.setItem(key, JSON.stringify(seed));
        } catch(e) {}
        return seed;
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val;
    }

    // HELPER MENGAMBIL MUSIM YANG SEDANG AKTIF SAAT INI
    function getMusimAktif() {
        var list = getData();
        var aktif = list.find(function(m) { return m.status === 'Aktif'; });
        return aktif || list[list.length - 1] || null;
    }

    // HELPER SET MUSIM AKTIF GLOBAL
    function setMusimAktifId(musimId) {
        var list = getData();
        list.forEach(function(m) {
            m.status = (m.id === musimId) ? 'Aktif' : 'Selesai';
        });
        saveAllData(list);
        window.dispatchEvent(new CustomEvent('cozycs_musim_changed', { detail: { musimId: musimId } }));
    }

    function saveAllData(list) {
        var key = getKey();
        try {
            if (typeof Storage !== 'undefined' && Storage.saveAll) {
                Storage.saveAll(key, list);
            } else {
                localStorage.setItem(key, JSON.stringify(list));
            }
        } catch(e) {
            console.error('[Musim] Error saving data:', e);
        }
    }

    function render() {
        return `
            <div class="dashboard-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div class="section-title" style="margin-bottom: 0;">
                        Master Musim Tanam Cozycs Farm
                    </div>
                    <button type="button" onclick="musim.resetDataMusim()" style="background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
                        Reset Musim
                    </button>
                </div>

                <!-- Form Tambah / Edit Musim -->
                <div style="background: var(--card-bg, #fff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 12px;" id="formTitleMusim">
                        Tambah / Edit Periode Musim
                    </div>

                    <form id="formMusim">
                        <input type="hidden" id="musimId">

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Nama Musim</label>
                                <input type="text" id="musimNama" required placeholder="Contoh: Musim 3" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Status Musim</label>
                                <select id="musimStatus" style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px; background: #fff;">
                                    <option value="Aktif">Aktif (Sedang Berjalan)</option>
                                    <option value="Selesai">Selesai (Arsip / Panen Final)</option>
                                </select>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tgl Tanam Awal (Bibit)</label>
                                <input type="date" id="musimTglMulai" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; font-weight: 600; color: #555;">Tgl Selesai Rekap Sales</label>
                                <input type="date" id="musimTglSelesai" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;">
                            </div>
                        </div>

                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Greenhouse Aktif di Musim Ini</label>
                            <div style="display: flex; gap: 14px; margin-top: 6px; background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, #eee);">
                                <label style="font-size: 12px; font-weight: 600; color: #333; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                                    <input type="checkbox" id="chkGh01" value="GH-01" checked style="accent-color: #2E7D32; width: 16px; height: 16px;"> GH-01
                                </label>
                                <label style="font-size: 12px; font-weight: 600; color: #333; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                                    <input type="checkbox" id="chkGh02" value="GH-02" style="accent-color: #2E7D32; width: 16px; height: 16px;"> GH-02
                                </label>
                                <label style="font-size: 12px; font-weight: 600; color: #333; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                                    <input type="checkbox" id="chkGh03" value="GH-03" style="accent-color: #2E7D32; width: 16px; height: 16px;"> GH-03
                                </label>
                            </div>
                        </div>

                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 12px; font-weight: 600; color: #555;">Catatan / Target Musim</label>
                            <textarea id="musimCatatan" rows="2" placeholder="Catatan target varietas, nutrisi, atau evaluasi..." style="width: 100%; padding: 10px; border: 1px solid var(--border-color, #ddd); border-radius: 8px; font-size: 13px; margin-top: 4px;"></textarea>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <button type="submit" class="btn btn-primary" style="flex: 1; background: #2E7D32; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                                Simpan Musim
                            </button>
                            <button type="button" id="btnCancelMusimEdit" style="display: none; background: #e0e0e0; border: none; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #333;">
                                Batal
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Riwayat Musim Grid -->
                <div class="section-title">Daftar Siklus Musim Tanam</div>
                <div id="containerMusimCards"></div>
            </div>
        `;
    }

    function init() {
        loadTable();

        var form = document.getElementById('formMusim');
        var btnCancel = document.getElementById('btnCancelMusimEdit');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var id = getVal('musimId') || ('musim_' + Date.now());
                var nama = getVal('musimNama');
                var status = getVal('musimStatus');
                var tglMulai = getVal('musimTglMulai');
                var tglSelesai = getVal('musimTglSelesai');
                var catatan = getVal('musimCatatan');

                var ghList = [];
                if (document.getElementById('chkGh01') && document.getElementById('chkGh01').checked) ghList.push('GH-01');
                if (document.getElementById('chkGh02') && document.getElementById('chkGh02').checked) ghList.push('GH-02');
                if (document.getElementById('chkGh03') && document.getElementById('chkGh03').checked) ghList.push('GH-03');

                if (ghList.length === 0) {
                    alert('Pilih minimal 1 Greenhouse yang aktif untuk musim ini!');
                    return;
                }

                var list = getData();
                
                // JIKA STATUS DIESET AKTIF, MATIKAN STATUS AKTIF MUSIM LAIN
                if (status === 'Aktif') {
                    list.forEach(function(m) { m.status = 'Selesai'; });
                }

                var existingIndex = list.findIndex(function(m) { return m.id === id; });
                var payload = {
                    id: id,
                    nama: nama,
                    status: status,
                    tglMulai: tglMulai,
                    tglSelesai: tglSelesai,
                    ghList: ghList,
                    catatan: catatan
                };

                if (existingIndex >= 0) {
                    list[existingIndex] = payload;
                } else {
                    list.push(payload);
                }

                saveAllData(list);

                form.reset();
                setVal('musimId', '');
                if (btnCancel) btnCancel.style.display = 'none';

                loadTable();
                window.dispatchEvent(new CustomEvent('cozycs_musim_changed', { detail: { musimId: id } }));
                
                if (typeof Helper !== 'undefined' && Helper.showToast) {
                    Helper.showToast('Data Musim berhasil disimpan!', 'success');
                }
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function() {
                if (form) form.reset();
                setVal('musimId', '');
                btnCancel.style.display = 'none';
            });
        }
    }

    function loadTable() {
        var container = document.getElementById('containerMusimCards');
        if (!container) return;

        var list = getData();
        if (!Array.isArray(list) || list.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #777; padding: 20px; background: var(--card-bg, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8);">Belum ada periode musim tanam.</div>`;
            return;
        }

        list.sort(function(a, b) {
            return new Date(b.tglMulai || 0) - new Date(a.tglMulai || 0);
        });

        var html = '';
        list.forEach(function(item) {
            var isAktif = item.status === 'Aktif';
            var badgeBg = isAktif ? '#E8F5E9' : '#ECEFF1';
            var badgeColor = isAktif ? '#2E7D32' : '#455A64';
            var ghStr = (item.ghList && item.ghList.length > 0) ? item.ghList.join(', ') : 'GH-01';

            html += `
                <div style="background: var(--card-bg, #fff); border: 1px solid ${isAktif ? '#2E7D32' : 'var(--border-color, #e8e8e8)'}; border-radius: 12px; padding: 14px; margin-bottom: 12px; position: relative;">
                    ${isAktif ? `<div style="position: absolute; top: -1px; right: 14px; background: #2E7D32; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px;">MUSIM AKTIF</div>` : ''}
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div>
                            <strong style="font-size: 15px; color: var(--text-color, #222);">${item.nama}</strong>
                            <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-left: 6px;">${item.status}</span>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: var(--inner-card-bg, #f9f9f9); padding: 10px; border-radius: 8px; margin-bottom: 8px; font-size: 12px;">
                        <div>
                            <span style="color: #777; font-size: 10px; font-weight: 600; display: block;">RENTANG SIKLUS</span>
                            <strong>${item.tglMulai}</strong> s/d <strong>${item.tglSelesai}</strong>
                        </div>
                        <div>
                            <span style="color: #777; font-size: 10px; font-weight: 600; display: block;">COVERAGE GREENHOUSE</span>
                            <strong style="color: #2E7D32;">${ghStr}</strong>
                        </div>
                    </div>

                    ${item.catatan ? `<div style="font-size: 12px; color: #444; background: #fff; padding: 6px 8px; border-radius: 6px; border: 1px solid #eee; margin-bottom: 8px;">Catatan: ${item.catatan}</div>` : ''}

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color, #eee); padding-top: 8px;">
                        <button type="button" onclick="musim.setMusimAktifId('${item.id}')" ${isAktif ? 'disabled' : ''} style="background: ${isAktif ? '#CCC' : '#E8F5E9'}; color: ${isAktif ? '#666' : '#2E7D32'}; border: none; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
                            ${isAktif ? 'Sedang Aktif' : 'Pilih Musim Ini'}
                        </button>
                        <div style="display: flex; gap: 12px;">
                            <span onclick="musim.editItem('${item.id}')" style="cursor: pointer; color: #F57F17; font-size: 12px; font-weight: 700;">Edit</span>
                            <span onclick="musim.deleteItem('${item.id}')" style="cursor: pointer; color: #C62828; font-size: 12px; font-weight: 700;">Hapus</span>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function editItem(id) {
        var list = getData();
        var item = list.find(function(m) { return m.id === id; });
        if (!item) return;

        setVal('musimId', item.id);
        setVal('musimNama', item.nama);
        setVal('musimStatus', item.status);
        setVal('musimTglMulai', item.tglMulai);
        setVal('musimTglSelesai', item.tglSelesai);
        setVal('musimCatatan', item.catatan || '');

        var ghList = item.ghList || [];
        if (document.getElementById('chkGh01')) document.getElementById('chkGh01').checked = ghList.includes('GH-01');
        if (document.getElementById('chkGh02')) document.getElementById('chkGh02').checked = ghList.includes('GH-02');
        if (document.getElementById('chkGh03')) document.getElementById('chkGh03').checked = ghList.includes('GH-03');

        var btnCancel = document.getElementById('btnCancelMusimEdit');
        if (btnCancel) btnCancel.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteItem(id) {
        if (confirm('Apakah kamu yakin ingin menghapus periode musim ini?')) {
            var list = getData();
            var filtered = list.filter(function(m) { return m.id !== id; });
            saveAllData(filtered);
            loadTable();
            window.dispatchEvent(new CustomEvent('cozycs_musim_changed', { detail: { musimId: id } }));
        }
    }

    function resetDataMusim() {
        if (confirm('Reset daftar musim ke settingan awal (Musim 1, 2, & 3)?')) {
            getSeedData();
            loadTable();
            window.dispatchEvent(new CustomEvent('cozycs_musim_changed'));
        }
    }

    return {
        render: render,
        init: init,
        getData: getData,
        getMusimAktif: getMusimAktif,
        setMusimAktifId: setMusimAktifId,
        editItem: editItem,
        deleteItem: deleteItem,
        resetDataMusim: resetDataMusim,
        loadTable: loadTable
    };

})();

window.musim = musim;
