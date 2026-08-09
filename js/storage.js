// ==========================================
// COZYCS FARM - STORAGE & DATABASE SYSTEM (PERMANENT SECURE)
// ==========================================

var Storage = (function() {
    
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
        SETTING: 'cozycs_setting',
        AKTIVITAS: 'cozycs_aktivitas',
        SCHEDULES: 'cozycs_schedules'
    };

    function init() {
        // PENGAMAN PERMANEN: Hanya buat brankas jika BELUM ADA SAMA SEKALI.
        // Jika data sudah ada, sistem dijamin TIDAK AKAN MENIMPA atau MENGHAPUSNYA.
        for (var key in KEYS) {
            if (KEYS.hasOwnProperty(key)) {
                var storageKey = KEYS[key];
                if (localStorage.getItem(storageKey) === null) {
                    localStorage.setItem(storageKey, JSON.stringify([]));
                    console.log('[Storage] Created new safe table for: ' + storageKey);
                }
            }
        }
        console.log('[Storage] Local storage securely initialized and locked.');
    }

    // FUNGSI PEMBACAAN ULTRA-AMAN (GARANSI PASTI ARRAY)
    function getAll(key) {
        try {
            var data = localStorage.getItem(key);
            if (!data) return [];
            var parsed = JSON.parse(data);
            // Pastikan hasil parse SELALU berbentuk Array
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('[Storage] Error reading key ' + key, e);
            return [];
        }
    }

    function saveAll(key, dataArray) {
        try {
            var arrayToSave = Array.isArray(dataArray) ? dataArray : [];
            localStorage.setItem(key, JSON.stringify(arrayToSave));
            return true;
        } catch (e) {
            console.error('[Storage] Error saving key ' + key, e);
            return false;
        }
    }

    function add(key, item) {
        if (!item || typeof item !== 'object') return null;
        var list = getAll(key);
        item.id = item.id || 'ID_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        item.created_at = item.created_at || new Date().toISOString();
        list.unshift(item); // Menyimpan data terbaru di posisi teratas
        return saveAll(key, list) ? item : null;
    }

    function update(key, updatedItem) {
        if (!updatedItem || !updatedItem.id) return false;
        var list = getAll(key);
        var index = list.findIndex(function(item) { return item && item.id === updatedItem.id; });
        if (index !== -1) {
            list[index] = Object.assign({}, list[index], updatedItem, { updated_at: new Date().toISOString() });
            return saveAll(key, list);
        }
        return false;
    }

    function remove(key, id) {
        if (!id) return false;
        var list = getAll(key);
        var filtered = list.filter(function(item) { return item && item.id !== id; });
        return saveAll(key, filtered);
    }

    function getById(key, id) {
        if (!id) return null;
        var list = getAll(key);
        return list.find(function(item) { return item && item.id === id; }) || null;
    }

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

// Daftarkan ke global window & langsung inisialisasi brankas penyimpanan
window.Storage = Storage;
Storage.init();
