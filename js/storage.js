// ==========================================
// COZYCS FARM - UNIFIED STORAGE MANAGER (CRUD)
// ==========================================

var Storage = (function() {

    function init() {
        // Inisialisasi default storage jika belum ada
        var keys = ['spray', 'nutrisi', 'polinasi', 'pruning', 'panen', 'jadwal', 'hama', 'buah', 'tanaman', 'gudang', 'keuangan'];
        keys.forEach(function(key) {
            if (!localStorage.getItem('cozycs_' + key)) {
                localStorage.setItem('cozycs_' + key, JSON.stringify([]));
            }
        });
    }

    // Ambil semua data berdasarkan nama modul
    function getData(moduleName) {
        var data = localStorage.getItem('cozycs_' + moduleName);
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    // Simpan data baru (Create) atau perbarui data yang ada (Update)
    function saveData(moduleName, item) {
        var list = getData(moduleName);
        
        if (item.id) {
            // Update data yang sudah ada berdasarkan ID
            list = list.map(function(existing) {
                return existing.id === item.id ? item : existing;
            });
        } else {
            // Create data baru dengan ID unik berbasis timestamp
            item.id = 'id_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            item.createdAt = new Date().toISOString();
            list.unshift(item); // Taruh di urutan paling atas
        }

        localStorage.setItem('cozycs_' + moduleName, JSON.stringify(list));
        return list;
    }

    // Hapus data berdasarkan ID (Delete)
    function deleteData(moduleName, id) {
        var list = getData(moduleName);
        list = list.filter(function(item) {
            return item.id !== id;
        });
        localStorage.setItem('cozycs_' + moduleName, JSON.stringify(list));
        return list;
    }

    // Ambil satu item berdasarkan ID (untuk keperluan Edit form)
    function getById(moduleName, id) {
        var list = getData(moduleName);
        return list.find(function(item) {
            return item.id === id;
        }) || null;
    }

    return {
        init: init,
        getData: getData,
        saveData: saveData,
        deleteData: deleteData,
        getById: getById
    };

})();
