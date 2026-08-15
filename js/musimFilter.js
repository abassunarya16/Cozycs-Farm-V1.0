// ==========================================
// COZYCS FARM - GLOBAL FILTER MUSIM COMPONENT
// ==========================================

var musimFilter = (function() {

    var ACTIVE_FILTER_KEY = 'cozycs_selected_musim_filter';

    function getSelectedMusimId() {
        var saved = localStorage.getItem(ACTIVE_FILTER_KEY);
        if (saved) return saved;
        
        // DEFAULT KE MUSIM AKTIF JIKA BELUM ADA PILIHAN
        if (typeof musim !== 'undefined' && musim.getMusimAktif) {
            var aktif = musim.getMusimAktif();
            if (aktif) return aktif.id;
        }
        return 'all';
    }

    function setSelectedMusimId(id) {
        localStorage.setItem(ACTIVE_FILTER_KEY, id);
        window.dispatchEvent(new CustomEvent('cozycs_musim_filter_changed', { 
            detail: { musimId: id } 
        }));
    }

    // RENDER DROPDOWN BAR UNTUK HEADER APLIKASI
    function renderBarHTML() {
        var selectedId = getSelectedMusimId();
        var list = (typeof musim !== 'undefined' && musim.getData) ? musim.getData() : [];

        var optionsHtml = `<option value="all" ${selectedId === 'all' ? 'selected' : ''}>🌐 Semua Musim (Total)</option>`;
        
        list.forEach(function(m) {
            var isSelected = (m.id === selectedId);
            var statusTag = m.status === 'Aktif' ? ' [Aktif]' : '';
            optionsHtml += `<option value="${m.id}" ${isSelected ? 'selected' : ''}>📅 ${m.nama}${statusTag} (${m.tglMulai})</option>`;
        });

        return `
            <div id="globalMusimBarContainer" style="background: #1B5E20; color: #fff; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2E7D32; font-family: inherit;">
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
                    <span style="background: #2E7D32; padding: 2px 6px; border-radius: 4px;">FILTER SIKLUS</span>
                </div>
                <div>
                    <select id="selectGlobalMusimFilter" onchange="musimFilter.handleFilterChange(this.value)" style="background: #2E7D32; color: #fff; border: 1px solid #A5D6A7; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; outline: none;">
                        ${optionsHtml}
                    </select>
                </div>
            </div>
        `;
    }

    function handleFilterChange(val) {
        setSelectedMusimId(val);
    }

    // FUNGSI UTAMA UNTUK FILTER ARRAY DATA BERDASARKAN MUSIM TERPILIH
    function applyFilter(dataArray, dateFieldName, ghFieldName) {
        if (!Array.isArray(dataArray) || dataArray.length === 0) return [];
        
        var selectedId = getSelectedMusimId();
        if (selectedId === 'all') return dataArray;

        if (typeof musim === 'undefined' || !musim.getData) return dataArray;
        
        var listMusim = musim.getData();
        var targetMusim = listMusim.find(function(m) { return m.id === selectedId; });
        if (!targetMusim) return dataArray;

        var start = new Date(targetMusim.tglMulai);
        var end = new Date(targetMusim.tglSelesai);
        var allowedGh = targetMusim.ghList || [];

        return dataArray.filter(function(item) {
            if (!item) return false;

            // 1. FILTER TANGGAL
            if (dateFieldName && item[dateFieldName]) {
                var itemDate = new Date(item[dateFieldName]);
                if (itemDate < start || itemDate > end) {
                    return false;
                }
            }

            // 2. FILTER GREENHOUSE (JIKA FITUR GH TERSEDIA PADA DATA)
            if (ghFieldName && item[ghFieldName] && item[ghFieldName] !== '-') {
                if (allowedGh.length > 0 && !allowedGh.includes(item[ghFieldName])) {
                    return false;
                }
            }

            return true;
        });
    }

    // LISTENER RE-RENDER OTOMATIS SAAT ADA PERUBAHAN DATA MUSIM
    window.addEventListener('cozycs_musim_changed', function() {
        var barContainer = document.getElementById('globalMusimBarContainer');
        if (barContainer) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = renderBarHTML();
            barContainer.parentNode.replaceChild(tempDiv.firstElementChild, barContainer);
        }
    });

    return {
        renderBarHTML: renderBarHTML,
        getSelectedMusimId: getSelectedMusimId,
        handleFilterChange: handleFilterChange,
        applyFilter: applyFilter
    };

})();

window.musimFilter = musimFilter;
