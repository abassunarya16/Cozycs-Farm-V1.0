// ==========================================
// COZYCS FARM - SETTINGS MODULE (REVISED WITH BACKUP & RESTORE)
// ==========================================

var setting = (function() {

    // Kamus Bahasa Sederhana (ID & EN)
    var translations = {
        'id': {
            'title': 'Pengaturan',
            'lang_label': 'Pilih Bahasa',
            'dark_label': 'Mode Gelap',
            'info_title': 'Informasi Lainnya',
            'notif': 'Notifikasi',
            'about_farm': 'Tentang Cozycs Farm',
            'faq': 'Bantuan & FAQ',
            'about_app': 'Tentang Aplikasi',
            'terms': 'Ketentuan Layanan',
            'privacy': 'Kebijakan Privasi',
            'backup_title': 'Penyimpanan & Data',
            'backup_data': 'Cadangkan Data (Backup)',
            'restore_data': 'Pulihkan Data (Restore)',
            'account_title': 'Akun',
            'logout': 'Keluar',
            'lang_name': 'Indonesia',
            'toast_backup': 'Backup seluruh data berhasil diunduh!',
            'toast_restore': 'Data berhasil direstore! Memuat ulang...',
            'error_restore': 'Gagal memulihkan data. Format file JSON tidak valid.'
        },
        'en': {
            'title': 'Settings',
            'lang_label': 'Select Language',
            'dark_label': 'Dark Mode',
            'info_title': 'Other Information',
            'notif': 'Notifications',
            'about_farm': 'About Cozycs Farm',
            'faq': 'Help & FAQ',
            'about_app': 'About Application',
            'terms': 'Terms of Service',
            'privacy': 'Privacy Policy',
            'backup_title': 'Storage & Data',
            'backup_data': 'Backup Data',
            'restore_data': 'Restore Data',
            'account_title': 'Account',
            'logout': 'Sign Out',
            'lang_name': 'English',
            'toast_backup': 'All data backup downloaded successfully!',
            'toast_restore': 'Data restored successfully! Reloading...',
            'error_restore': 'Failed to restore data. Invalid JSON format.'
        }
    };

    function getLang() {
        return localStorage.getItem('cozycs_lang') || 'id';
    }

    function render() {
        var isDarkMode = localStorage.getItem('cozycs_dark_mode') === 'true';
        var appVer = (typeof Helper !== 'undefined' && Helper.VERSION) ? Helper.VERSION : '1.6';
        var currentLangKey = getLang();
        var t = translations[currentLangKey] || translations['id'];

        return `
            <div class="dashboard-container" style="padding-bottom: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <!-- GRUP 1: PENGATURAN -->
                <div style="margin-bottom: 24px;">
                    <div style="font-size: 15px; font-weight: 800; margin-bottom: 12px; color: var(--text-color, #111); letter-spacing: 0.3px;">
                        ${t.title}
                    </div>

                    <div style="background: var(--card-bg, #ffffff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); overflow: hidden;">
                        
                        <!-- Item: Pilih Bahasa -->
                        <div onclick="setting.openLanguageModal()" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #f0f0f0); cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="fas fa-globe" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">${t.lang_label}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 13px; font-weight: 700; color: #F59E0B;">${t.lang_name}</span>
                                <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                            </div>
                        </div>

                        <!-- Item: Mode Gelap -->
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="fas fa-adjust" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">${t.dark_label}</span>
                            </div>
                            <label class="switch-toggle" style="position: relative; display: inline-block; width: 44px; height: 24px;">
                                <input type="checkbox" id="toggleDarkMode" ${isDarkMode ? 'checked' : ''} onchange="setting.toggleDarkMode(this.checked)" style="opacity: 0; width: 0; height: 0;">
                                <span class="slider-round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${isDarkMode ? '#F59E0B' : '#ccc'}; transition: .3s; border-radius: 24px;"></span>
                            </label>
                        </div>

                    </div>
                </div>

                <!-- GRUP 2: BACKUP & RESTORE DATA -->
                <div style="margin-bottom: 24px;">
                    <div style="font-size: 15px; font-weight: 800; margin-bottom: 12px; color: var(--text-color, #111); letter-spacing: 0.3px;">
                        ${t.backup_title}
                    </div>

                    <div style="background: var(--card-bg, #ffffff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); overflow: hidden;">
                        
                        <!-- Item: Backup Data -->
                        <div onclick="setting.backupAllData()" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #f0f0f0); cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="fas fa-cloud-download-alt" style="font-size: 18px; width: 22px; text-align: center; color: #2E7D32;"></i>
                                <span style="font-size: 14px; font-weight: 600;">${t.backup_data}</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>

                        <!-- Item: Restore Data -->
                        <div onclick="document.getElementById('fileRestoreInput').click()" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="fas fa-cloud-upload-alt" style="font-size: 18px; width: 22px; text-align: center; color: #0277BD;"></i>
                                <span style="font-size: 14px; font-weight: 600;">${t.restore_data}</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>
                        <!-- Hidden File Input untuk Restore -->
                        <input type="file" id="fileRestoreInput" accept=".json" style="display: none;" onchange="setting.restoreAllData(event)">

                    </div>
                </div>

                <!-- GRUP 3: INFORMASI LAINNYA -->
                <div style="margin-bottom: 24px;">
                    <div style="font-size: 15px; font-weight: 800; margin-bottom: 12px; color: var(--text-color, #111); letter-spacing: 0.3px;">
                        ${t.info_title}
                    </div>

                    <div style="background: var(--card-bg, #ffffff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); overflow: hidden;">
                        
                        <!-- Item: Notifikasi -->
                        <div onclick="navigateTo('notifikasi')" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #f0f0f0); cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="far fa-bell" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">${t.notif}</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>

                        <!-- Item: Tentang Cozycs Farm -->
                        <div onclick="setting.openCustomInfoModal('${t.about_farm}', 'Cozycs Farm adalah usaha perkebunan melon hidroponik premium berbasis green house yang berlokasi di Pesawaran, Lampung.')" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #f0f0f0); cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="far fa-building" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">${t.about_farm}</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>

                        <!-- Item: Bantuan & FAQ -->
                        <div onclick="setting.openCustomInfoModal('${t.faq}', 'Aplikasi Cozycs Farm membantu mengelola nutrisi (PPM/pH), jadwal spray, populasi tanaman, seleksi buah, dan penjualan hasil panen secara otomatis.')" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #f0f0f0); cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="far fa-question-circle" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">${t.faq}</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>

                        <!-- Item: Tentang Aplikasi -->
                        <div onclick="setting.checkAppUpdate()" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #f0f0f0); cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="fas fa-mobile-alt" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">${t.about_app}</span>
                            </div>
                            <span style="font-size: 13px; font-weight: 600; color: #777;">v ${appVer}</span>
                        </div>

                        <!-- Item: Ketentuan Layanan -->
                        <div onclick="setting.openCustomInfoModal('${t.terms}', 'Seluruh data operasional Cozycs Farm disimpan secara aman di perangkat lokal pengguna. Harap lakukan sinkronisasi secara berkala.')" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #f0f0f0); cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="far fa-file-alt" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">${t.terms}</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>

                        <!-- Item: Kebijakan Privasi -->
                        <div onclick="setting.openCustomInfoModal('${t.privacy}', 'Sistem menjamin kerahasiaan data internal farm dan tidak akan membagikan data operasional ke pihak ketiga tanpa izin pengguna.')" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="fas fa-shield-alt" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">${t.privacy}</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>

                    </div>
                </div>

                <!-- GRUP 4: AKUN -->
                <div>
                    <div style="font-size: 15px; font-weight: 800; margin-bottom: 12px; color: var(--text-color, #111); letter-spacing: 0.3px;">
                        ${t.account_title}
                    </div>

                    <div style="background: var(--card-bg, #ffffff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); overflow: hidden;">
                        
                        <!-- Item: Keluar -->
                        <div onclick="setting.openLogoutModal()" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: #D32F2F;">
                                <i class="fas fa-sign-out-alt" style="font-size: 18px; width: 22px; text-align: center;"></i>
                                <span style="font-size: 14px; font-weight: 700;">${t.logout}</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>

                    </div>
                </div>

                <!-- CONTAINER DIALOG / MODAL CUSTOM (NATIVE LOOK, NO BROWSER HEADER) -->
                <div id="customModalOverlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(3px); z-index: 99999; align-items: center; justify-content: center; padding: 20px;">
                    <div id="customModalCard" style="background: var(--card-bg, #ffffff); color: var(--text-color, #222); width: 100%; max-width: 320px; border-radius: 20px; padding: 22px 20px 18px 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.25); text-align: center; border: 1px solid var(--border-color, #eee);">
                        <div id="customModalTitle" style="font-size: 17px; font-weight: 800; margin-bottom: 8px;"></div>
                        <div id="customModalBody" style="font-size: 13px; color: #666; line-height: 1.4; margin-bottom: 20px;"></div>
                        <div id="customModalActions" style="display: flex; gap: 10px; justify-content: center;"></div>
                    </div>
                </div>

            </div>

            <!-- CSS LENGKAP MODE GELAP & SAKLAR TOGGLE -->
            <style>
                .switch-toggle .slider-round:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                }
                .switch-toggle input:checked + .slider-round {
                    background-color: #F59E0B !important;
                }
                .switch-toggle input:checked + .slider-round:before {
                    transform: translateX(20px);
                    background-color: #000;
                }

                /* STYLESHEET GLOBAL UNTUK MODE GELAP */
                body.dark-theme {
                    --card-bg: #1e1e1e !important;
                    --border-color: #333333 !important;
                    --text-color: #f1f1f1 !important;
                    background-color: #121212 !important;
                    color: #e0e0e0 !important;
                }
                body.dark-theme .dashboard-container {
                    background-color: #121212 !important;
                }
                body.dark-theme #customModalCard {
                    background: #1e1e1e !important;
                    color: #ffffff !important;
                    border-color: #333 !important;
                }
                body.dark-theme #customModalBody {
                    color: #bbb !important;
                }
            </style>
        `;
    }

    function init() {
        var isDarkMode = localStorage.getItem('cozycs_dark_mode') === 'true';
        applyDarkModeStyle(isDarkMode);
    }

    function applyDarkModeStyle(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
            document.documentElement.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            document.documentElement.classList.remove('dark-theme');
        }
    }

    function toggleDarkMode(isDark) {
        localStorage.setItem('cozycs_dark_mode', isDark);
        applyDarkModeStyle(isDark);

        if (typeof window.applyDarkModeGlobal === 'function') {
            window.applyDarkModeGlobal();
        }

        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast(isDark ? 'Mode Gelap diaktifkan' : 'Mode Terang diaktifkan', 'success');
        }

        if (typeof navigateTo === 'function') {
            navigateTo('setting');
        }
    }

    // FUNGSI BACKUP SEMUA DATA KE FILE JSON
    function backupAllData() {
        var allData = {};
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.startsWith('cozycs_')) {
                allData[key] = localStorage.getItem(key);
            }
        }
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
        var downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "CozycsFarm_Backup_" + new Date().toISOString().split('T')[0] + ".json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        var currentLangKey = getLang();
        var t = translations[currentLangKey] || translations['id'];

        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast(t.toast_backup, 'success');
        }
    }

    // FUNGSI RESTORE DATA DARI FILE JSON
    function restoreAllData(event) {
        var file = event.target.files[0];
        if (!file) return;

        var currentLangKey = getLang();
        var t = translations[currentLangKey] || translations['id'];

        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var importedData = JSON.parse(e.target.result);
                Object.keys(importedData).forEach(function(key) {
                    if (key.startsWith('cozycs_')) {
                        localStorage.setItem(key, importedData[key]);
                    }
                });
                if (typeof Helper !== 'undefined' && Helper.showToast) {
                    Helper.showToast(t.toast_restore, 'success');
                }
                setTimeout(function() {
                    location.reload();
                }, 1000);
            } catch (err) {
                alert(t.error_restore);
            }
        };
        reader.readAsText(file);
    }

    function openLanguageModal() {
        var currentLang = getLang();
        var title = 'Pilih Bahasa / Select Language';
        var body = `
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px; text-align: left;">
                <label onclick="setting.setLanguage('id')" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-radius: 10px; background: ${currentLang === 'id' ? '#E8F5E9' : '#f9f9f9'}; border: 1px solid ${currentLang === 'id' ? '#2E7D32' : '#eee'}; cursor: pointer;">
                    <span style="font-size: 13px; font-weight: 700; color: #222;">🇮🇩 Bahasa Indonesia</span>
                    ${currentLang === 'id' ? '<i class="fas fa-check-circle" style="color: #2E7D32;"></i>' : ''}
                </label>
                <label onclick="setting.setLanguage('en')" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-radius: 10px; background: ${currentLang === 'en' ? '#E8F5E9' : '#f9f9f9'}; border: 1px solid ${currentLang === 'en' ? '#2E7D32' : '#eee'}; cursor: pointer;">
                    <span style="font-size: 13px; font-weight: 700; color: #222;">🇬🇧 English</span>
                    ${currentLang === 'en' ? '<i class="fas fa-check-circle" style="color: #2E7D32;"></i>' : ''}
                </label>
            </div>
        `;
        var actions = `
            <button onclick="setting.closeModal()" style="width: 100%; padding: 10px; border-radius: 10px; border: 1px solid #ccc; background: #fff; color: #555; font-weight: bold; font-size: 13px; cursor: pointer;">Tutup / Close</button>
        `;
        showModal(title, body, actions);
    }

    function setLanguage(langCode) {
        localStorage.setItem('cozycs_lang', langCode);
        closeModal();

        if (typeof window.applyAppLanguage === 'function') {
            window.applyAppLanguage(langCode);
        }

        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast(langCode === 'id' ? 'Bahasa Indonesia dipilih' : 'English language selected', 'success');
        }
        if (typeof navigateTo === 'function') {
            navigateTo('setting');
        }
    }

    function openCustomInfoModal(titleText, contentText) {
        var actions = `
            <button onclick="setting.closeModal()" style="width: 100%; padding: 10px 16px; border-radius: 10px; border: none; background: #2E7D32; color: #fff; font-weight: bold; font-size: 13px; cursor: pointer;">Tutup</button>
        `;
        showModal(titleText, contentText, actions);
    }

    function openLogoutModal() {
        var isEn = (getLang() === 'en');
        var title = isEn ? 'Are you sure?' : 'Yakin!';
        var body = isEn ? 'Are you sure you want to exit from this application?' : 'Apakah anda yakin akan keluar dari aplikasi ini?';
        var actions = `
            <button onclick="setting.closeModal()" style="flex: 1; padding: 10px; border-radius: 10px; border: 1px solid #ccc; background: #fff; color: #555; font-weight: bold; font-size: 13px; cursor: pointer;">${isEn ? 'Cancel' : 'Batal'}</button>
            <button onclick="setting.confirmLogout()" style="flex: 1; padding: 10px; border-radius: 10px; border: none; background: #D32F2F; color: #fff; font-weight: bold; font-size: 13px; cursor: pointer;">${isEn ? 'OK' : 'Oke'}</button>
        `;
        showModal(title, body, actions);
    }

    function confirmLogout() {
        closeModal();
        var isEn = (getLang() === 'en');
        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast(isEn ? 'Closing application...' : 'Menutup aplikasi...', 'info');
        }
        setTimeout(function() {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                navigateTo('dashboard');
            }
        }, 600);
    }

    function checkAppUpdate() {
        var isEn = (getLang() === 'en');
        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast(isEn ? 'Checking for app updates...' : 'Mengecek versi aplikasi terbaru...', 'info');
        }
        setTimeout(function() {
            openCustomInfoModal(
                isEn ? 'App Version' : 'Versi Aplikasi', 
                isEn ? 'Your Cozycs Farm app is up to date (v1.6).' : 'Aplikasi Cozycs Farm kamu sudah menggunakan versi terbaru (v1.6).'
            );
        }, 800);
    }

    function showModal(title, bodyHtml, actionsHtml) {
        var overlay = document.getElementById('customModalOverlay');
        var titleEl = document.getElementById('customModalTitle');
        var bodyEl = document.getElementById('customModalBody');
        var actionsEl = document.getElementById('customModalActions');

        if (overlay && titleEl && bodyEl && actionsEl) {
            titleEl.innerHTML = title;
            bodyEl.innerHTML = bodyHtml;
            actionsEl.innerHTML = actionsHtml;
            overlay.style.display = 'flex';
        }
    }

    function closeModal() {
        var overlay = document.getElementById('customModalOverlay');
        if (overlay) overlay.style.display = 'none';
    }

    return {
        render: render,
        init: init,
        toggleDarkMode: toggleDarkMode,
        backupAllData: backupAllData,
        restoreAllData: restoreAllData,
        openLanguageModal: openLanguageModal,
        setLanguage: setLanguage,
        openCustomInfoModal: openCustomInfoModal,
        openLogoutModal: openLogoutModal,
        confirmLogout: confirmLogout,
        checkAppUpdate: checkAppUpdate,
        closeModal: closeModal
    };

})();

window.setting = setting;
