// ==========================================
// COZYCS FARM - ROUTER & NAVIGATION SYSTEM
// ==========================================

var Router = (function() {
    
    // Kamus Judul Halaman
    var pageTitles = {
        'dashboard': 'Dashboard',
        'greenhouse': 'Greenhouse',
        'tanaman': 'Database & Perawatan Tanaman',
        'nutrisi': 'Nutrisi & PPM',
        'hama': 'Hama & Penyakit',
        'spray': 'Penyemprotan (Spray)',
        'jadwal': 'Jadwal & Tugas',
        'panen': 'Data Panen',
        'laporan': 'Laporan',
        'gudang': 'Gudang & Stok',
        'keuangan': 'Keuangan',
        'setting': 'Pengaturan'
    };

    var currentPage = 'dashboard';

    function init() {
        setupNavigationEvents();
        navigate('dashboard');
    }

    // HELPER EVALUASI MODUL SECARA DINAMIS (RUNTIME)
    function getModule(pageName) {
        var moduleMap = {
            'dashboard': typeof dashboard !== 'undefined' ? dashboard : null,
            'greenhouse': typeof greenhouse !== 'undefined' ? greenhouse : null,
            'tanaman': typeof tanaman !== 'undefined' ? tanaman : null,
            'nutrisi': typeof nutrisi !== 'undefined' ? nutrisi : null,
            'hama': typeof hama !== 'undefined' ? hama : null,
            'spray': typeof spray !== 'undefined' ? spray : null,
            'jadwal': typeof jadwal !== 'undefined' ? jadwal : null,
            'panen': typeof panen !== 'undefined' ? panen : null,
            'laporan': typeof laporan !== 'undefined' ? laporan : null,
            'gudang': typeof gudang !== 'undefined' ? gudang : null,
            'keuangan': typeof keuangan !== 'undefined' ? keuangan : null,
            'setting': typeof setting !== 'undefined' ? setting : null
        };

        var mod = moduleMap[pageName] || window[pageName];
        
        return {
            title: pageTitles[pageName] || 'Cozycs Farm',
            render: (mod && typeof mod.render === 'function') ? function() { return mod.render(); } : function() { return '<div style="padding:20px; text-align:center; color:#666;">Halaman ' + pageName + ' sedang dimuat...</div>'; },
            init: (mod && typeof mod.init === 'function') ? function() { mod.init(); } : null
        };
    }

    function navigate(pageName) {
        // Redirect jika mengakses modul lama yang sudah digabung ke tanaman
        if (pageName === 'polinasi' || pageName === 'buah' || pageName === 'pruning') {
            pageName = 'tanaman';
        }

        if (!pageTitles[pageName]) {
            pageName = 'dashboard';
        }
        currentPage = pageName;

        // Ambil modul secara dinamis sesuai kondisi variabel JS terkini
        var route = getModule(pageName);
        var mainContent = document.getElementById('mainContent');
        var headerTitle = document.getElementById('headerTitle');

        // Render konten halaman
        if (mainContent && typeof route.render === 'function') {
            mainContent.innerHTML = route.render();
        }

        // Update Judul Header
        if (headerTitle) {
            headerTitle.innerHTML = '<img src="img/logo.png" alt="Logo" onerror="this.style.display=\'none\'"> ' + route.title;
        }

        // Jalankan fungsi init halaman jika ada
        if (typeof route.init === 'function') {
            try {
                route.init();
            } catch (e) {
                console.error('[Router] Error initializing page ' + pageName, e);
            }
        }

        // Update status aktif di menu bawah & sidebar
        updateActiveMenuUI(pageName);

        // Tutup sidebar jika sedang terbuka (di versi mobile)
        closeSidebar();
        
        // Scroll ke atas halaman
        window.scrollTo(0, 0);
    }

    function setupNavigationEvents() {
        // Event listener untuk klik navigasi di seluruh dokumen
        document.addEventListener('click', function(e) {
            var target = e.target.closest('[data-page]');
            if (target) {
                var page = target.getAttribute('data-page');
                if (page) {
                    navigate(page);
                }
            }
        });

        // Toggle Sidebar
        var menuToggle = document.getElementById('menuToggle');
        var sidebar = document.getElementById('sidebar');
        var sidebarOverlay = document.getElementById('sidebarOverlay');
        var sidebarClose = document.getElementById('sidebarClose');

        if (menuToggle && sidebar && sidebarOverlay) {
            menuToggle.addEventListener('click', function() {
                sidebar.classList.add('open');
                sidebarOverlay.classList.add('show');
            });
        }

        if (sidebarClose && sidebar && sidebarOverlay) {
            sidebarClose.addEventListener('click', function() {
                closeSidebar();
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', function() {
                closeSidebar();
            });
        }

        // Render Menu Sidebar & Bottom Nav secara otomatis
        renderNavigationUI();
    }

    function closeSidebar() {
        var sidebar = document.getElementById('sidebar');
        var sidebarOverlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('show');
    }

    function renderNavigationUI() {
        // Render Bottom Nav (5 menu utama)
        var bottomNav = document.getElementById('bottomNav');
        if (bottomNav) {
            bottomNav.innerHTML = 
                '<button class="bottom-nav-item" data-page="dashboard"><i class="fas fa-chart-pie"></i><span>Dashboard</span></button>' +
                '<button class="bottom-nav-item" data-page="tanaman"><i class="fas fa-seedling"></i><span>Tanaman</span></button>' +
                '<button class="bottom-nav-item" data-page="nutrisi"><i class="fas fa-flask"></i><span>Nutrisi</span></button>' +
                '<button class="bottom-nav-item" data-page="panen"><i class="fas fa-box"></i><span>Panen</span></button>' +
                '<button class="bottom-nav-item" data-page="setting"><i class="fas fa-cog"></i><span>Pengaturan</span></button>';
        }

        // Render Sidebar Menu
        var sidebarMenu = document.getElementById('sidebarMenu');
        if (sidebarMenu) {
            sidebarMenu.innerHTML = 
                '<div class="sidebar-group">' +
                    '<div class="sidebar-group-title">Utama</div>' +
                    '<a class="sidebar-link" data-page="dashboard"><i class="fas fa-home"></i> Dashboard</a>' +
                    '<a class="sidebar-link" data-page="greenhouse"><i class="fas fa-house-chimney-window"></i> Greenhouse</a>' +
                '</div>' +
                '<div class="sidebar-group">' +
                    '<div class="sidebar-group-title">Budidaya Melon</div>' +
                    '<a class="sidebar-link" data-page="tanaman"><i class="fas fa-seedling"></i> Database & Perawatan Tanaman</a>' +
                    '<a class="sidebar-link" data-page="nutrisi"><i class="fas fa-flask"></i> Nutrisi & PPM/pH</a>' +
                    '<a class="sidebar-link" data-page="hama"><i class="fas fa-bug"></i> Hama & Penyakit</a>' +
                    '<a class="sidebar-link" data-page="spray"><i class="fas fa-spray-can"></i> Penyemprotan</a>' +
                '</div>' +
                '<div class="sidebar-group">' +
                    '<div class="sidebar-group-title">Manajemen & Bisnis</div>' +
                    '<a class="sidebar-link" data-page="jadwal"><i class="fas fa-tasks"></i> Jadwal & Tugas</a>' +
                    '<a class="sidebar-link" data-page="panen"><i class="fas fa-box"></i> Panen</a>' +
                    '<a class="sidebar-link" data-page="laporan"><i class="fas fa-chart-line"></i> Laporan Farm</a>' +
                    '<a class="sidebar-link" data-page="gudang"><i class="fas fa-warehouse"></i> Gudang & Stok</a>' +
                    '<a class="sidebar-link" data-page="keuangan"><i class="fas fa-wallet"></i> Keuangan Farm</a>' +
                    '<a class="sidebar-link" data-page="setting"><i class="fas fa-cog"></i> Pengaturan Aplikasi</a>' +
                '</div>';
        }
    }

    function updateActiveMenuUI(pageName) {
        var bottomItems = document.querySelectorAll('.bottom-nav-item');
        bottomItems.forEach(function(item) {
            if (item.getAttribute('data-page') === pageName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        var sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(function(link) {
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    return {
        init: init,
        navigate: navigate,
        getCurrentPage: function() { return currentPage; }
    };

})();
