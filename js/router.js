// ==========================================
// COZYCS FARM - ROUTER & NAVIGATION SYSTEM
// ==========================================

var Router = (function() {
    
    // Daftar halaman yang tersedia di aplikasi (Modul terpadu)
    var routes = {
        'dashboard': { title: 'Dashboard', render: typeof dashboard !== 'undefined' ? dashboard.render : function() { return '<div>Dashboard belum dimuat</div>'; }, init: typeof dashboard !== 'undefined' ? dashboard.init : null },
        'greenhouse': { title: 'Greenhouse', render: typeof greenhouse !== 'undefined' ? greenhouse.render : function() { return '<div>Halaman Greenhouse</div>'; }, init: typeof greenhouse !== 'undefined' ? greenhouse.init : null },
        'tanaman': { title: 'Database & Perawatan Tanaman', render: typeof tanaman !== 'undefined' ? tanaman.render : function() { return '<div>Halaman Tanaman</div>'; }, init: typeof tanaman !== 'undefined' ? tanaman.init : null },
        'nutrisi': { title: 'Nutrisi & PPM', render: typeof nutrisi !== 'undefined' ? nutrisi.render : function() { return '<div>Halaman Nutrisi</div>'; }, init: typeof nutrisi !== 'undefined' ? nutrisi.init : null },
        'hama': { title: 'Hama & Penyakit', render: typeof hama !== 'undefined' ? hama.render : function() { return '<div>Halaman Hama</div>'; }, init: typeof hama !== 'undefined' ? hama.init : null },
        'spray': { title: 'Penyemprotan (Spray)', render: typeof spray !== 'undefined' ? spray.render : function() { return '<div>Halaman Spray</div>'; }, init: typeof spray !== 'undefined' ? spray.init : null },
        'jadwal': { title: 'Jadwal & Tugas', render: typeof jadwal !== 'undefined' ? jadwal.render : function() { return '<div>Halaman Jadwal</div>'; }, init: typeof jadwal !== 'undefined' ? jadwal.init : null },
        'panen': { title: 'Data Panen', render: typeof panen !== 'undefined' ? panen.render : function() { return '<div>Halaman Panen</div>'; }, init: typeof panen !== 'undefined' ? panen.init : null },
        'laporan': { title: 'Laporan', render: typeof laporan !== 'undefined' ? laporan.render : function() { return '<div>Halaman Laporan</div>'; }, init: typeof laporan !== 'undefined' ? laporan.init : null },
        'gudang': { title: 'Gudang & Stok', render: typeof gudang !== 'undefined' ? gudang.render : function() { return '<div>Halaman Gudang</div>'; }, init: typeof gudang !== 'undefined' ? gudang.init : null },
        'keuangan': { title: 'Keuangan', render: typeof keuangan !== 'undefined' ? keuangan.render : function() { return '<div>Halaman Keuangan</div>'; }, init: typeof keuangan !== 'undefined' ? keuangan.init : null },
        'setting': { title: 'Pengaturan', render: typeof setting !== 'undefined' ? setting.render : function() { return '<div>Halaman Pengaturan</div>'; }, init: typeof setting !== 'undefined' ? setting.init : null }
    };

    var currentPage = 'dashboard';

    function init() {
        setupNavigationEvents();
        navigate('dashboard');
    }

    function navigate(pageName) {
        // Redirect jika mengakses modul lama yang sudah digabung ke tanaman
        if (pageName === 'polinasi' || pageName === 'buah' || pageName === 'pruning') {
            pageName = 'tanaman';
        }

        if (!routes[pageName]) {
            pageName = 'dashboard';
        }
        currentPage = pageName;

        var route = routes[pageName];
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
