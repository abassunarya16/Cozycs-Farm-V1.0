// ==========================================
// COZYCS FARM - CCTV MONITORING MODULE
// ==========================================

var cctv = (function() {

    function render() {
        return `
            <div class="dashboard-container">
                <div class="section-title"><i class="fas fa-video"></i> Live CCTV Greenhouse Pesawaran</div>
                
                <!-- CAMERA 1: GREENHOUSE 01 -->
                <div style="background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 16px; border: 1px solid #e8e8e8;">
                    <div style="font-size: 13px; font-weight: 700; color: #1B5E20; margin-bottom: 8px; display: flex; justify-content: space-between;">
                        <span>📹 GH-01 (Melon Zone A)</span>
                        <span style="color: #2E7D32; font-size: 10px;">🔴 LIVE</span>
                    </div>
                    <div style="width: 100%; height: 200px; background: #000; border-radius: 8px; overflow: hidden;">
                        <!-- Player Video Stream HLS/WebRTC -->
                        <iframe src="LINK_STREAM_CCTV_GH01" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>
                </div>

                <!-- CAMERA 2: GREENHOUSE 02 -->
                <div style="background: #fff; border-radius: 12px; padding: 12px; border: 1px solid #e8e8e8;">
                    <div style="font-size: 13px; font-weight: 700; color: #1B5E20; margin-bottom: 8px; display: flex; justify-content: space-between;">
                        <span>📹 GH-02 (Melon Zone B)</span>
                        <span style="color: #2E7D32; font-size: 10px;">🔴 LIVE</span>
                    </div>
                    <div style="width: 100%; height: 200px; background: #000; border-radius: 8px; overflow: hidden;">
                        <iframe src="LINK_STREAM_CCTV_GH02" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>
                </div>
            </div>
        `;
    }

    function init() {
        // Inisialisasi player video jika diperlukan
    }

    return {
        render: render,
        init: init
    };

})();
