// ==========================================
// COZYCS FARM - CCTV MONITORING MODULE
// ==========================================

var cctv = (function() {

    var activeCam = 'Kamera Utama';

    function render() {
        var streamUrl = localStorage.getItem('cozycs_cctv_url') || '';

        var camList = [
            'Kamera Utama',
            'Lorong 1',
            'Lorong 2'
        ];

        var camButtonsHtml = '';
        camList.forEach(function(camName) {
            var isActive = activeCam === camName;
            camButtonsHtml += `
                <button onclick="cctv.selectCam('${camName}')" class="btn" style="padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; ${isActive ? 'background: #2E7D32; color: #fff;' : 'background: #f0f0f0; color: #555;'} border: none; white-space: nowrap; cursor: pointer;">
                    📹 ${camName}
                </button>
            `;
        });

        return `
            <div class="dashboard-container" style="padding-bottom: 30px;">
                <div class="section-title" style="font-size: 15px; font-weight: 800; color: #1B5E20; margin-bottom: 4px;">
                    <i class="fas fa-video" style="color: #C62828;"></i> Live CCTV
                </div>
                <div style="font-size: 12px; color: #666; margin-bottom: 14px;">
                    Pantau kondisi fisik tanaman dan situasi greenhouse secara real-time.
                </div>

                <!-- CARD STREAM VIDEO CCTV -->
                <div style="background: #111; border-radius: 16px; overflow: hidden; position: relative; margin-bottom: 14px; border: 1px solid #333; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    
                    <!-- Overlay Badge Live -->
                    <div style="position: absolute; top: 12px; left: 12px; z-index: 10; display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.15);">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: #E53935; display: inline-block; animation: pulseCctv 1.5s infinite;"></span>
                        <span style="font-size: 10px; font-weight: 800; color: #fff; letter-spacing: 0.5px;">LIVE - ${activeCam.toUpperCase()}</span>
                    </div>

                    <!-- Video / Stream Player Area -->
                    <div id="cctvPlayerContainer" style="width: 100%; height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1a1a1a; color: #aaa; text-align: center; padding: 20px;">
                        ${streamUrl ? `
                            <iframe src="${streamUrl}" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
                        ` : `
                            <i class="fas fa-camera-retro" style="font-size: 36px; color: #555; margin-bottom: 10px;"></i>
                            <div style="font-size: 13px; font-weight: 700; color: #ddd; margin-bottom: 4px;">Mode Standby (${activeCam})</div>
                            <div style="font-size: 11px; color: #888; max-width: 260px;">Kamera CCTV belum terhubung. Tautan IP Cam/WebRTC dapat diatur pada menu konfigurasi di bawah.</div>
                        `}
                    </div>

                    <!-- Footer Control Bar di Video -->
                    <div style="background: #181818; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #282828; font-size: 11px; color: #ccc;">
                        <span id="cctvLiveClock"><i class="far fa-clock"></i> Live Feed</span>
                        <span style="color: #4CAF50; font-weight: 700;"><i class="fas fa-signal"></i> 1080p HD</span>
                    </div>
                </div>

                <!-- SELEKSI ZONA KAMERA DINAMIS -->
                <div style="background: #fff; border-radius: 12px; padding: 12px; border: 1px solid #e8e8e8; margin-bottom: 14px;">
                    <div style="font-size: 11px; font-weight: 700; color: #555; text-transform: uppercase; margin-bottom: 8px;">Pilih Sudut Kamera:</div>
                    <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px;">
                        ${camButtonsHtml}
                    </div>
                </div>

                <!-- KONFIGURASI URL STREAM CAM -->
                <div style="background: #fff; border-radius: 12px; padding: 14px; border: 1px solid #e8e8e8;">
                    <div style="font-size: 12px; font-weight: 700; color: #1B5E20; margin-bottom: 8px;">
                        <i class="fas fa-cog"></i> Pengaturan Tautan CCTV
                    </div>
                    <div style="font-size: 11px; color: #666; margin-bottom: 10px;">
                        Masukkan URL IP Camera / WebRTC / Web Embed bila CCTV sudah terpasang:
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="inputCctvUrl" value="${streamUrl}" placeholder="https://stream.cozycsfarm.com/cctv" style="flex: 1; padding: 8px 10px; border-radius: 8px; border: 1px solid #ccc; font-size: 12px;">
                        <button id="btnSaveCctvUrl" class="btn" style="background: #2E7D32; color: #fff; padding: 8px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; border: none; cursor: pointer;">
                            Simpan
                        </button>
                    </div>
                </div>
            </div>

            <style>
                @keyframes pulseCctv {
                    0% { opacity: 1; }
                    50% { opacity: 0.3; }
                    100% { opacity: 1; }
                }
            </style>
        `;
    }

    function selectCam(camName) {
        activeCam = camName;
        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast('Memindahkan tampilan ke ' + camName, 'success');
        }
        if (typeof navigateTo === 'function') {
            navigateTo('cctv');
        }
    }

    function init() {
        var btnSave = document.getElementById('btnSaveCctvUrl');
        if (btnSave) {
            btnSave.addEventListener('click', function() {
                var urlVal = document.getElementById('inputCctvUrl').value.trim();
                localStorage.setItem('cozycs_cctv_url', urlVal);
                if (typeof Helper !== 'undefined' && Helper.showToast) {
                    Helper.showToast('Tautan CCTV berhasil diperbarui!', 'success');
                }
                if (typeof navigateTo === 'function') {
                    navigateTo('cctv');
                }
            });
        }

        setInterval(function() {
            var clockEl = document.getElementById('cctvLiveClock');
            if (clockEl && typeof Helper !== 'undefined' && Helper.getFullDateTime) {
                clockEl.innerHTML = '<i class="far fa-clock"></i> ' + Helper.getFullDateTime();
            }
        }, 1000);
    }

    return {
        render: render,
        init: init,
        selectCam: selectCam
    };

})();
