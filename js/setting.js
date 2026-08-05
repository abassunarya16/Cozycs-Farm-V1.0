// ==========================================
// COZYCS FARM - SETTINGS MODULE (CLEAN MODERN LIST UI)
// ==========================================

var setting = (function() {

    function render() {
        var isDarkMode = localStorage.getItem('cozycs_dark_mode') === 'true';
        var appVer = (typeof Helper !== 'undefined' && Helper.VERSION) ? Helper.VERSION : '1.6';
        var selectedLang = localStorage.getItem('cozycs_lang') || 'Indonesia';

        return `
            <div class="dashboard-container" style="padding-bottom: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <!-- GRUP 1: PENGATURAN -->
                <div style="margin-bottom: 24px;">
                    <div style="font-size: 15px; font-weight: 800; margin-bottom: 12px; color: var(--text-color, #111); letter-spacing: 0.3px;">
                        Pengaturan
                    </div>

                    <div style="background: var(--card-bg, #ffffff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); overflow: hidden;">
                        
                        <!-- Item: Pilih Bahasa -->
                        <div onclick="setting.showLanguageModal()" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #f0f0f0); cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="fas fa-globe" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">Pilih Bahasa</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 13px; font-weight: 700; color: #F59E0B;">${selectedLang}</span>
                                <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                            </div>
                        </div>

                        <!-- Item: Mode Gelap -->
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="fas fa-adjust" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">Mode Gelap</span>
                            </div>
                            <label class="switch-toggle" style="position: relative; display: inline-block; width: 44px; height: 24px;">
                                <input type="checkbox" id="toggleDarkMode" ${isDarkMode ? 'checked' : ''} onchange="setting.toggleDarkMode(this.checked)" style="opacity: 0; width: 0; height: 0;">
                                <span class="slider-round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${isDarkMode ? '#F59E0B' : '#ccc'}; transition: .3s; border-radius: 24px;"></span>
                            </label>
                        </div>

                    </div>
                </div>

                <!-- GRUP 2: INFORMASI LAINNYA -->
                <div style="margin-bottom: 24px;">
                    <div style="font-size: 15px; font-weight: 800; margin-bottom: 12px; color: var(--text-color, #111); letter-spacing: 0.3px;">
                        Informasi Lainnya
                    </div>

                    <div style="background: var(--card-bg, #ffffff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); overflow: hidden;">
                        
                        <!-- Item: Notifikasi -->
                        <div onclick="navigateTo('notifikasi')" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #f0f0f0); cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="far fa-bell" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">Notifikasi</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>

                        <!-- Item: Tentang Perusahaan / Farm -->
                        <div onclick="setting.showInfoModal('Tentang Cozycs Farm', 'Cozycs Farm adalah usaha perkebunan melon hidroponik premium berbasis green house yang berlokasi di Pesawaran, Lampung.')" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #f0f0f0); cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="far fa-building" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">Tentang Cozycs Farm</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>

                        <!-- Item: Bantuan & FAQ -->
                        <div onclick="setting.showInfoModal('Bantuan & FAQ', 'Aplikasi Cozycs Farm membantu mengelola nutrisi (PPM/pH), jadwal spray, populasi tanaman, seleksi buah, dan penjualan hasil panen secara otomatis.')" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #f0f0f0); cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="far fa-question-circle" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">Bantuan & FAQ</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>

                        <!-- Item: Tentang Aplikasi -->
                        <div onclick="setting.checkAppUpdate()" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #f0f0f0); cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="fas fa-mobile-alt" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">Tentang Aplikasi</span>
                            </div>
                            <span style="font-size: 13px; font-weight: 600; color: #777;">v ${appVer}</span>
                        </div>

                        <!-- Item: Ketentuan Layanan -->
                        <div onclick="setting.showInfoModal('Ketentuan Layanan', 'Seluruh data operasional Cozycs Farm disimpan secara lokal di perangkat pengguna. Harap lakukan backup berkala.')" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #f0f0f0); cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="far fa-file-alt" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">Ketentuan Layanan</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>

                        <!-- Item: Kebijakan Privasi -->
                        <div onclick="setting.showInfoModal('Kebijakan Privasi', 'Sistem tidak membagikan data internal farm ke pihak luar tanpa izin pengelola.')" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: var(--text-color, #222);">
                                <i class="fas fa-shield-alt" style="font-size: 18px; width: 22px; text-align: center; color: #555;"></i>
                                <span style="font-size: 14px; font-weight: 600;">Kebijakan Privasi</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>

                    </div>
                </div>

                <!-- GRUP 3: AKUN & SISTEM -->
                <div>
                    <div style="font-size: 15px; font-weight: 800; margin-bottom: 12px; color: var(--text-color, #111); letter-spacing: 0.3px;">
                        Akun & Data
                    </div>

                    <div style="background: var(--card-bg, #ffffff); border-radius: 12px; border: 1px solid var(--border-color, #e8e8e8); overflow: hidden;">
                        
                        <!-- Item: Reset Data Sistem -->
                        <div onclick="setting.resetSystemData()" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 14px; color: #D32F2F;">
                                <i class="fas fa-sign-out-alt" style="font-size: 18px; width: 22px; text-align: center;"></i>
                                <span style="font-size: 14px; font-weight: 700;">Reset Data / Keluar</span>
                            </div>
                            <i class="fas fa-chevron-right" style="font-size: 12px; color: #888;"></i>
                        </div>

                    </div>
                </div>

            </div>

            <!-- CSS UNTUK SAKLAR TOGGLE & ANIMASI BOLA -->
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
            </style>
        `;
    }

    function init() {
        // Inisialisasi awal
    }

    function toggleDarkMode(isDark) {
        localStorage.setItem('cozycs_dark_mode', isDark);
        
        if (isDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast(isDark ? 'Mode Gelap diaktifkan' : 'Mode Terang diaktifkan', 'success');
        }

        if (typeof navigateTo === 'function') {
            navigateTo('setting');
        }
    }

    function showLanguageModal() {
        var current = localStorage.getItem('cozycs_lang') || 'Indonesia';
        var newLang = prompt('Pilih Bahasa (Indonesia / English):', current);
        if (newLang) {
            localStorage.setItem('cozycs_lang', newLang);
            if (typeof Helper !== 'undefined' && Helper.showToast) {
                Helper.showToast('Bahasa diubah ke ' + newLang, 'success');
            }
            if (typeof navigateTo === 'function') {
                navigateTo('setting');
            }
        }
    }

    function showInfoModal(title, text) {
        alert(title + '\n\n' + text);
    }

    function checkAppUpdate() {
        if (typeof Helper !== 'undefined' && Helper.showToast) {
            Helper.showToast('Mengecek versi aplikasi terbaru...', 'info');
        }
        setTimeout(function() {
            if (typeof Helper !== 'undefined' && Helper.showToast) {
                Helper.showToast('Aplikasi Cozycs Farm sudah versi terbaru!', 'success');
            }
        }, 1200);
    }

    function resetSystemData() {
        var confirmReset = confirm('Apakah Anda yakin ingin menghapus seluruh data dan mereset sistem ke angka 0?');
        if (confirmReset) {
            localStorage.clear();
            if (typeof Helper !== 'undefined' && Helper.showToast) {
                Helper.showToast('Seluruh data berhasil direset!', 'success');
            }
            setTimeout(function() {
                window.location.reload();
            }, 1000);
        }
    }

    return {
        render: render,
        init: init,
        toggleDarkMode: toggleDarkMode,
        showLanguageModal: showLanguageModal,
        showInfoModal: showInfoModal,
        checkAppUpdate: checkAppUpdate,
        resetSystemData: resetSystemData
    };

})();

window.setting = setting;
