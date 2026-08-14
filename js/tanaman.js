// ==========================================
// COZYCS FARM - MODUL MONITORING & PERAWATAN TANAMAN PRESISI
// (UNIFIED LIFE-CYCLE STYLE: SAMA DENGAN MODUL NUTRISI)
// ==========================================

var tanaman = (function() {

    // ... (Fungsi i18nDict, t, getKey, getData, getVal, setVal, hitungHST, dll tetap SAMA seperti sebelumnya) ...
    // Saya hanya mengubah bagian renderCard dan sedikit styling di render() agar lebih luas

    // [COPY PASTE SELURUH BAGIAN DI BAWAH INI KE TANAMAN.JS ANDA]

    function render() {
        return `
            <div id="page-tanaman-content" style="padding: 16px; max-width: 800px; margin: 0 auto;">
                <div id="titleFormTanaman" style="font-size: 16px; font-weight: 800; color: #1B5E20; margin-bottom: 16px;">
                    ${t('module_title')}
                </div>
                <!-- Form Input... (tetap sama) -->
                <div id="recapTanamanList"></div>
            </div>
        `;
    }

    // ... (Fungsi Helper, SaveData, ResetForm, dll tetap SAMA) ...

    function renderCard(item) {
        if (!item) return '';

        var kat = item.kategori || 'Growth';
        var tglTanamAwal = item.tglTanam || item.tanggal;
        var hstRill = hitungHST(tglTanamAwal, new Date());

        return `
            <div style="background: #ffffff; border-radius: 16px; border: 1px solid #EAEAEA; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                
                <!-- HEADER: DATE & BADGES -->
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
                    <span style="font-size: 14px; font-weight: 800; color: #333;">${item.tanggal || '-'}</span>
                    <span style="background: #2E7D32; color: #fff; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 8px;">GH: ${item.gh || 'GH-01'}</span>
                    <span style="background: #E3F2FD; color: #1976D2; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 8px;">${hstRill} HST</span>
                </div>

                <!-- GRID 2x2 (STYLE NUTRISI) -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                    
                    <!-- Box 1: Varietas -->
                    <div style="background: #F8F9FA; padding: 12px; border-radius: 12px;">
                        <div style="font-size: 10px; color: #888; font-weight: 700; text-transform: uppercase;">VARIETAS & LOKASI</div>
                        <div style="font-size: 12px; font-weight: 800; color: #2E7D32; margin-top: 4px;">🌱 ${item.varietas || '-'}</div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">📍 ${item.talang || '-'}</div>
                    </div>

                    <!-- Box 2: Metrik -->
                    <div style="background: #F8F9FA; padding: 12px; border-radius: 12px;">
                        <div style="font-size: 10px; color: #888; font-weight: 700; text-transform: uppercase;">METRIK PERTUMBUHAN</div>
                        <div style="font-size: 12px; font-weight: 800; color: #333; margin-top: 4px;">📏 ${item.tinggi || 0} cm | 🍃 ${item.daun || 0} Daun</div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">↔️ Ø ${item.batang || 0} mm</div>
                    </div>

                    <!-- Box 3: Kategori & PIC -->
                    <div style="background: #F8F9FA; padding: 12px; border-radius: 12px;">
                        <div style="font-size: 10px; color: #888; font-weight: 700; text-transform: uppercase;">KATEGORI & PIC</div>
                        <div style="font-size: 12px; font-weight: 800; color: #333; margin-top: 4px;">👤 ${item.petugas || '-'}</div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">📋 ${kat}</div>
                    </div>

                    <!-- Box 4: Fase -->
                    <div style="background: #F8F9FA; padding: 12px; border-radius: 12px;">
                        <div style="font-size: 10px; color: #888; font-weight: 700; text-transform: uppercase;">FASE & TIMBAL BALIK</div>
                        <div style="font-size: 12px; font-weight: 800; color: #C62828; margin-top: 4px;">❤️ ${item.fase || '-'}</div>
                        <div style="font-size: 11px; font-weight: 700; color: #555;">💬 Tercatat Rapi</div>
                    </div>
                </div>

                <!-- CATATAN -->
                <div style="font-size: 12px; color: #444; margin-bottom: 12px; padding: 4px 0;">
                    <strong>Catatan:</strong> ${item.desc || '-'}
                </div>

                <!-- TOMBOL AKSI -->
                <div style="display: flex; justify-content: space-between; border-top: 1px dashed #DDD; padding-top: 10px;">
                    <i class="fas fa-history" onclick="tanaman.showHistoryModal('${item.talang}', '${item.gh}')" style="color: #2E7D32; cursor: pointer; font-size: 16px;"></i>
                    <div style="display: flex; gap: 16px;">
                        <i class="fas fa-pencil-alt" onclick="tanaman.editData('${item.id}')" style="color: #E67E22; cursor: pointer; font-size: 16px;"></i>
                        <i class="fas fa-trash-alt" onclick="tanaman.deleteData('${item.id}')" style="color: #C62828; cursor: pointer; font-size: 16px;"></i>
                    </div>
                </div>
            </div>
        `;
    }

    // ... (sisanya fungsi lain seperti toggleSelectAll, deleteSelectedItems, dll tetap SAMA) ...
    // Pastikan untuk menyalin kembali fungsi-fungsi tersebut di bawah renderCard()
    
})();

window.tanaman = tanaman;
