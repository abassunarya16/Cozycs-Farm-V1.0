// ==========================================
// COZYCS FARM - UNIFIED STORAGE MANAGER (CRUD)
// ==========================================

var Storage = (function() {

    function init() {
        var keys = ['spray', 'nutrisi', 'polinasi', 'pruning', 'panen', 'jadwal', 'hama', 'buah', 'tanaman', 'gudang', 'keuangan', 'schedules'];
        keys.forEach(function(key) {
            if (!localStorage.getItem('cozycs_' + key)) {
                localStorage.setItem('cozycs_' + key, JSON.stringify([]));
            }
        });
    }

    function getData(moduleName) {
        var data = localStorage.getItem('cozycs_' + moduleName);
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveData(moduleName, item) {
        var list = getData(moduleName);
        
        if (item.id) {
            list = list.map(function(existing) {
                return existing.id === item.id ? item : existing;
            });
        } else {
            item.id = 'id_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            item.createdAt = new Date().toISOString();
            list.unshift(item);
        }

        localStorage.setItem('cozycs_' + moduleName, JSON.stringify(list));
        return list;
    }

    function deleteData(moduleName, id) {
        var list = getData(moduleName);
        list = list.filter(function(item) {
            return item.id !== id;
        });
        localStorage.setItem('cozycs_' + moduleName, JSON.stringify(list));
        return list;
    }

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
