// ==========================================
// COZYCS FARM - STORAGE & DATABASE SYSTEM
// ==========================================

var Storage = (function() {
    
    // Kunci / Nama tabel untuk LocalStorage
    var KEYS = {
        GREENHOUSE: 'cozycs_greenhouse',
        TANAMAN: 'cozycs_tanaman',
        POLINASI: 'cozycs_polinasi',
        BUAH: 'cozycs_buah',
        NUTRISI: 'cozycs_nutrisi',
        PRUNING: 'cozycs_pruning',
        HAMA: 'cozycs_hama',
        SPRAY: 'cozycs_spray',
        JADWAL: 'cozycs_jadwal',
        PANEN: 'cozycs_panen',
        LAPORAN: 'cozycs_laporan',
        GUDANG: 'cozycs_gudang',
        KEUANGAN: 'cozycs_keuangan',
        SETTING: 'cozycs_setting'
    };

    function init() {
        // Pastikan setiap kunci dasar sudah terinisialisasi sebagai array kosong jika belum ada
        for (var key in KEYS) {
            if (KEYS.hasOwnProperty(key)) {
                var storageKey = KEYS[key];
                if (!localStorage.getItem(storageKey)) {
                    localStorage.setItem(storageKey, JSON.stringify([]));
                }
            }
        }
        console.log('[Storage] Local storage initialized successfully.');
    }

    // Mengambil semua data berdasarkan kunci
    function getAll(key) {
        try {
            var data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('[Storage] Error reading key ' + key, e);
            return [];
        }
    }

    // Menyimpan seluruh data baru ke kunci tertentu
    function saveAll(key, dataArray) {
        try {
            localStorage.setItem(key, JSON.stringify(dataArray));
            return true;
        } catch (e) {
            console.error('[Storage] Error saving key ' + key, e);
            return false;
        }
    }

    // Menambah satu data baru (otomatis diberi ID unik berbasis waktu)
    function add(key, item) {
        var list = getAll(key);
        item.id = item.id || 'ID_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        item.created_at = item.created_at || new Date().toISOString();
        list.push(item);
        return saveAll(key, list) ? item : null;
    }

    // Memperbarui data berdasarkan ID
    function update(key, updatedItem) {
        var list = getAll(key);
        var index = list.findIndex(function(item) { return item.id === updatedItem.id; });
        if (index !== -1) {
            list[index] = Object.assign({}, list[index], updatedItem, { updated_at: new Date().toISOString() });
            return saveAll(key, list);
        }
        return false;
    }

    // Menghapus data berdasarkan ID
    function remove(key, id) {
        var list = getAll(key);
        var filtered = list.filter(function(item) { return item.id !== id; });
        return saveAll(key, filtered);
    }

    // Mengambil satu data spesifik berdasarkan ID
    function getById(key, id) {
        var list = getAll(key);
        return list.find(function(item) { return item.id === id; }) || null;
    }

    // Menghitung ukuran penggunaan memori LocalStorage
    function getStorageUsage() {
        try {
            var totalBytes = 0;
            for (var key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalBytes += ((localStorage[key].length + key.length) * 2);
                }
            }
            var kb = (totalBytes / 1024).toFixed(2);
            return kb + ' KB / 5000 KB';
        } catch (e) {
            return '0 KB';
        }
    }

    return {
        KEYS: KEYS,
        init: init,
        getAll: getAll,
        saveAll: saveAll,
        add: add,
        update: update,
        remove: remove,
        getById: getById,
        getStorageUsage: getStorageUsage
    };

})();
