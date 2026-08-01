// ==========================================
// COZYCS FARM - CHART / GRAFIK MODULE
// ==========================================

var FarmChart = (function() {

    // Fungsi inisialisasi grafik (bisa diintegrasikan dengan Chart.js jika diperlukan)
    function initChart(canvasId, type, data, options) {
        var canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        var ctx = canvas.getContext('2d');
        
        // Pengecekan apakah pustaka Chart global tersedia
        if (typeof Chart !== 'undefined') {
            try {
                return new Chart(ctx, {
                    type: type || 'line',
                    data: data || { labels: [], datasets: [] },
                    options: options || { responsive: true, maintainAspectRatio: false }
                });
            } catch (e) {
                console.error('[Chart] Error creating chart instance', e);
                return null;
            }
        } else {
            console.warn('[Chart] Chart.js library is not loaded.');
            return null;
        }
    }

    return {
        init: initChart
    };

})();
