// ==========================================
// COZYCS FARM - CCTV MONITORING MODULE
// (FULL BILINGUAL & DARK MODE SUPPORT)
// ==========================================

var cctv = (function() {

    var activeCamKey = 'cam_main';

    // KAMUS TERJEMAHAN DUAL BAHASA (ID & EN)
    var i18nDict = {
        'id': {
            'module_title': 'Live CCTV',
            'module_subtitle': 'Pantau kondisi fisik tanaman dan situasi greenhouse secara real-time.',
            'badge_live': 'LIVE',
            'cam_main': 'Kamera Utama',
            'cam_aisle_1': 'Lorong 1',
            'cam_aisle_2': 'Lorong 2',
            'standby_title': 'Mode Standby',
            'standby_desc': 'Kamera CCTV belum terhubung. Tautan IP Cam/WebRTC dapat diatur pada menu konfigurasi di bawah.',
            'lbl_live_feed': 'Live Feed',
            'lbl_hd': '1080p HD',
            'lbl_select_cam': 'Pilih Sudut Kamera:',
            'config_title': 'Pengaturan Tautan CCTV',
            'config_desc': 'Masukkan URL IP Camera / WebRTC / Web Embed bila CCTV sudah terpasang:',
            'btn_save': 'Simpan',
            'ph_url': 'https://stream.cozycsfarm.com/cctv',
            'toast_switch_cam': 'Memindahkan tampilan ke ',
            'toast_saved': 'Tautan CCTV berhasil diperbarui!'
        },
        'en': {
            'module_title': 'Live CCTV',
            'module_subtitle': 'Monitor physical crop conditions and greenhouse environment in real-time.',
            'badge_live': 'LIVE',
            'cam_main': 'Main Camera',
            'cam_aisle_1': 'Aisle 1',
            'cam_aisle_2': 'Aisle 2',
            'standby_title': 'Standby Mode',
            'standby_desc': 'CCTV camera is not connected. IP Cam/WebRTC stream link can be configured in the settings below.',
            'lbl_live_feed': 'Live Feed',
            'lbl_hd': '1080p HD',
            'lbl_select_cam': 'Select Camera Angle:',
            'config_title': 'CCTV Link Settings',
            'config_desc': 'Enter IP Camera / WebRTC / Web Embed URL if CCTV is installed:',
            'btn_save': 'Save',
            'ph_url': 'https://stream.cozycsfarm.com/cctv',
            'toast_switch_cam': 'Switching view to ',
            'toast_saved': 'CCTV link updated successfully!'
        }
    };

    function t(key) {
        var lang = localStorage.getItem('cozycs_lang') || 'id';
        return (i18nDict[lang] && i18nDict[lang][key]) ? i18nDict[lang][key] : (i18nDict['id'][key] || key);
    }

    function render() {
        var streamUrl = localStorage.getItem('cozycs_cctv_url') || '';

        var camKeys = ['cam_main', 'cam_aisle_1', 'cam_aisle_2'];

        var camButtonsHtml = '';
        camKeys.forEach(function(key) {
            var camName = t(key);
            var isActive = activeCamKey === key;
            camButtonsHtml += `
                <button onclick="window.cctv.selectCam('${key}')" class="btn" style="padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; ${isActive ? 'background: #2E7D32; color: #fff;' : 'background: var(--inner-card-bg, #f0f0f0); color: var(--text-color, #555);'} border: none; white-space: nowrap; cursor: pointer;">
                    📹 ${camName}
                </button>
            `;
        });

        var activeCamName = t(activeCamKey);

        return `
            <div class="dashboard-container" style="padding-bottom: 30px;">
                <div class="section-title" style="font-size: 15px; font-weight: 800; color: #1B5E20; margin-bottom: 4px;">
                    <i class="fas fa-video" style="color: #C62828;"></i> ${t('module_title')}
                </div>
                <div style="font-size: 12px; color: #888; margin-bottom: 14px;">
                    ${t('module_subtitle')}
                </div>

                <!-- CARD STREAM VIDEO CCTV -->
                <div style="background: #111; border-radius: 16px; overflow: hidden; position: relative; margin-bottom: 14px; border: 1px solid #333; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    
                    <!-- Overlay Badge Live -->
                    <div style="position: absolute; top: 12px; left: 12px; z-index: 10; display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.15);">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: #E53935; display: inline-block; animation: pulseCctv 1.5s infinite;"></span>
                        <span style="font-size: 10px; font-weight: 800; color: #fff; letter-spacing: 0.5px;">${t('badge_live')} - ${activeCamName.toUpperCase()}</span>
                    </div>

                    <!-- Video / Stream Player Area -->
                    <div id="cctvPlayerContainer" style="width: 100%; height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1a1a1a; color: #aaa; text-align: center; padding: 20px;">
                        ${streamUrl ? `
                            <iframe src="${streamUrl}" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
                        ` : `
                            <i class="fas fa-camera-retro" style="font-size: 36px; color: #555; margin-bottom: 10px;"></i>
                            <div style="font-size: 13px; font-weight: 700; color: #ddd; margin-bottom: 4px;">${t('standby_title')} (${activeCamName})</div>
                            <div style="font-size: 11px; color: #888; max-width: 260px;">${t('standby_desc')}</div>
                        `}
                    </div>

                    <!-- Footer Control Bar -->
                    <div style="background: #181818; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #282828; font-size: 11px; color: #ccc;">
                        <span id="cctvLiveClock"><i class="far fa-clock"></i> ${t('lbl_live_feed')}</span>
                        <span style="color: #4CAF50; font-weight: 700;"><i class="fas fa-signal"></i> ${t('lbl_hd')}</span>
                    </div>
                </div>

                <!-- SELEKSI ZONA KAMERA DINAMIS -->
                <div style="background: var(--card-bg, #fff); border-radius: 12px; padding: 12px; border: 1px solid var(--border-color, #e8e8e8); margin-bottom: 14px;">
                    <div style="font-size: 11px; font-weight: 700; color: #555; text-transform: uppercase; margin-bottom: 8px;">${t('lbl_select_cam')}</div>
                    <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px;">
                        ${camButtonsHtml}
                    </div>
                </div>

                <!-- KONFIGURASI URL STREAM CAM -->
                <div style="background: var(--card-bg, #fff); border-radius: 12px; padding: 14px; border: 1px solid var(--border-color, #e8e8e8);">
                    <div style="font-size: 12px; font-weight: 700; color: #1B5E20; margin-bottom: 8px;">
                        <i class="fas fa-cog"></i> ${t('config_title')}
                    </div>
                    <div style="font-size: 11px; color: #888; margin-bottom: 10px;">
                        ${t('config_desc')}
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="inputCctvUrl" value="${streamUrl}" placeholder="${t('ph_url')}" style="flex: 1; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border-color, #ccc); font-size: 12px; background: var(--card-bg, #fff); color: var(--text-color, #333);">
                        <button id="btnSaveCctvUrl" class="btn" style="background: #2E7D32; color: #fff; padding: 8px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; border: none; cursor: pointer;">
                            ${t('btn_save')}
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

    function selectCam(key) {
        activeCamKey = key;
        var camName = t(key);
        if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
            Helper.showToast(t('toast_switch_cam') + camName, 'success');
        }
        if (typeof navigateTo === 'function') {
            navigateTo('cctv');
        }
    }

    function init() {
        var btnSave = document.getElementById('btnSaveCctvUrl');
        if (btnSave) {
            btnSave.addEventListener('click', function() {
                var urlInput = document.getElementById('inputCctvUrl');
                var urlVal = urlInput ? urlInput.value.trim() : '';
                localStorage.setItem('cozycs_cctv_url', urlVal);
                if (typeof Helper !== 'undefined' && typeof Helper.showToast === 'function') {
                    Helper.showToast(t('toast_saved'), 'success');
                }
                if (typeof navigateTo === 'function') {
                    navigateTo('cctv');
                }
            });
        }

        setInterval(function() {
            var clockEl = document.getElementById('cctvLiveClock');
            if (clockEl && typeof Helper !== 'undefined' && typeof Helper.getFullDateTime === 'function') {
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

// DAFTARKAN EKSPLISIT KE WINDOW GLOBAL
window.cctv = cctv;
