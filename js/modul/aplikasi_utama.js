/**
 * =========================================================================
 * MODUL 11: APLIKASI UTAMA & INISIALISASI (aplikasi_utama.js)
 * SISTEM INFORMASI & LAPORAN PASKIBRA GARATIKA SMKN 40 JAKARTA
 * =========================================================================
 */

function renderAll() {
  if (typeof applyRoleBasedNavigation === 'function') {
    applyRoleBasedNavigation();
  }
  populateKategoriDropdowns();
  populateKategoriBulan();
  populateKelasFilter();
  renderDashboard();
  renderTabelAnggota();
  renderTabelPengurus();
  renderGridDivisi();
  renderTabelLaporan();
  renderTabelBerkasDrive();
  updateArsipBadges();

  // Sinkronisasi otomatis dari Google Drive di latar belakang (diberi jeda agar halaman terbuka instan)
  if (typeof sinkronkanSemuaDariDrive === 'function') {
    setTimeout(() => {
      sinkronkanSemuaDariDrive(true).catch(e => console.warn("Auto-sync Drive:", e));
    }, 2500);
  }
}


/* ==========================================================================
   13. EVENT LISTENERS
   ========================================================================== */
function initEventListeners() {
  // Auth Form
  document.getElementById("formLogin")?.addEventListener("submit", handleLogin);
  document.getElementById("loginNama")?.addEventListener("input", clearLoginAlert);
  document.getElementById("loginPassword")?.addEventListener("input", clearLoginAlert);
  document.getElementById("btnLogout")?.addEventListener("click", handleLogout);

  // Anggota & Kategori
  document.getElementById("btnTambahAnggota")?.addEventListener("click", bukaModalTambahAnggota);
  document.getElementById("btnTambahKategori")?.addEventListener("click", bukaModalTambahKategori);
  document.getElementById("formAnggota")?.addEventListener("submit", simpanAnggota);
  document.getElementById("searchAnggota")?.addEventListener("input", renderTabelAnggota);
  document.getElementById("btnClearSearchAnggota")?.addEventListener("click", clearSearchAnggota);
  document.getElementById("btnBukaModalFilter")?.addEventListener("click", bukaModalFilterAnggota);
  document.getElementById("btnResetFilterAnggota")?.addEventListener("click", resetFilterAnggota);
  document.getElementById("filterAngkatan")?.addEventListener("change", renderTabelAnggota);
  document.getElementById("filterDivisiAnggota")?.addEventListener("change", renderTabelAnggota);
  document.getElementById("filterKelasAnggota")?.addEventListener("change", renderTabelAnggota);

  // Kategori Angkatan
  document.getElementById("formTambahKategori")?.addEventListener("submit", simpanKategoriBaru);

  // Pengurus
  document.getElementById("searchPengurus")?.addEventListener("input", renderTabelPengurus);
  document.getElementById("btnClearSearchPengurus")?.addEventListener("click", clearSearchPengurus);
  document.getElementById("btnBukaModalFilterPengurus")?.addEventListener("click", bukaModalFilterPengurus);
  document.getElementById("btnResetFilterPengurus")?.addEventListener("click", resetFilterPengurus);
  document.getElementById("formTambahPengurus")?.addEventListener("submit", simpanPengurusDariModal);
  document.getElementById("pengurusNamaSearch")?.addEventListener("input", handlePengurusSearchInput);
  document.getElementById("btnClearSearchPengurusNama")?.addEventListener("click", clearSearchPengurusNama);

  // Divisi
  document.getElementById("btnTambahDivisi")?.addEventListener("click", bukaModalTambahDivisi);
  document.getElementById("formDivisi")?.addEventListener("submit", simpanDivisi);
  document.getElementById("searchDivisi")?.addEventListener("input", renderGridDivisi);
  document.getElementById("btnClearSearchDivisi")?.addEventListener("click", clearSearchDivisi);

  // Laporan
  document.getElementById("formInputLaporan")?.addEventListener("submit", simpanLaporan);
  document.getElementById("searchLaporan")?.addEventListener("input", renderTabelLaporan);
  document.getElementById("btnClearSearchLaporan")?.addEventListener("click", clearSearchLaporan);
  document.getElementById("btnBukaModalFilterLaporan")?.addEventListener("click", bukaModalFilterLaporan);
  document.getElementById("btnResetFilterLaporan")?.addEventListener("click", resetFilterLaporan);

  // Master Barang Sarpras
  document.getElementById("btnBukaModalFilterBarang")?.addEventListener("click", bukaModalFilterBarang);
  document.getElementById("btnResetFilterBarang")?.addEventListener("click", resetFilterBarang);
  document.getElementById("btnClearSearchBarangMaster")?.addEventListener("click", clearSearchBarangMaster);

  // Folder Bulan Drive
  document.getElementById("formTambahKategoriBulan")?.addEventListener("submit", simpanKategoriBulanBaru);

  // Database Google Apps Script & Google Drive
  document.getElementById("btnSimpanGASUrl")?.addEventListener("click", simpanGASUrl);
  document.getElementById("btnTestKoneksiGAS")?.addEventListener("click", testKoneksiGAS);
  document.getElementById("btnFetchGASData")?.addEventListener("click", () => fetchDataFromGAS(false));
  document.getElementById("btnSyncAllGASData")?.addEventListener("click", syncAllDataToGAS);

  // Autocomplete dropdown close on outside click
  document.addEventListener("click", (e) => {
    const dropBox = document.getElementById("autocompleteNamaPengurus");
    const searchInput = document.getElementById("pengurusNamaSearch");
    if (dropBox && searchInput && !dropBox.contains(e.target) && e.target !== searchInput) {
      dropBox.style.display = "none";
    }
  });

  // Modal backdrop click to close & pencegahan scroll tembus ke background
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        if (backdrop.dataset.loading === "true") return; // Cegah tutup saat sedang loading
        closeModal(backdrop.id);
      }
    });

    backdrop.addEventListener("wheel", (e) => {
      if (e.target === backdrop) {
        e.preventDefault();
      }
    }, { passive: false });

    backdrop.addEventListener("touchmove", (e) => {
      if (e.target === backdrop) {
        e.preventDefault();
      }
    }, { passive: false });
  });

  // Cegah scroll tembus pada batas atas dan bawah modal window
  document.querySelectorAll(".modal-window").forEach(win => {
    win.addEventListener("wheel", (e) => {
      const isAtTop = win.scrollTop <= 0 && e.deltaY < 0;
      const isAtBottom = (win.scrollTop + win.clientHeight >= win.scrollHeight - 1) && e.deltaY > 0;
      if (isAtTop || isAtBottom) {
        e.preventDefault();
      }
    }, { passive: false });
  });

  // Sidebar Drawer (Hamburger Mobile, Tutup Menu & Backdrop)
  const appSidebar = document.getElementById("appSidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");

  function toggleSidebar(forceState) {
    if (!appSidebar) return;
    const willShow = (typeof forceState === "boolean") ? forceState : !appSidebar.classList.contains("show");
    appSidebar.classList.toggle("show", willShow);
    if (sidebarBackdrop) {
      sidebarBackdrop.classList.toggle("show", willShow);
    }
    document.body.classList.toggle("sidebar-drawer-open", willShow);
  }

  document.getElementById("btnToggleSidebar")?.addEventListener("click", () => toggleSidebar());
  document.getElementById("btnCloseSidebar")?.addEventListener("click", () => toggleSidebar(false));
  sidebarBackdrop?.addEventListener("click", () => toggleSidebar(false));
}

// Inisialisasi Saat Dokumen Selesai Dimuat
document.addEventListener("DOMContentLoaded", () => {
  if (typeof initStorage === "function") initStorage();
  if (typeof checkAuthSession === "function") checkAuthSession();
  if (typeof initNavigation === "function") initNavigation();
  if (typeof initDynamicReportForm === "function") initDynamicReportForm();
  if (typeof initEventListeners === "function") initEventListeners();
  if (typeof initPasswordToggle === "function") initPasswordToggle();

  // Sinkronisasi data cloud (anggota, divisi, laporan) di latar belakang saat aplikasi dibuka / di-refresh
  if (typeof fetchDataFromGAS === "function" && state.gasWebhookUrl) {
    setTimeout(() => {
      fetchDataFromGAS(true).catch(e => console.warn("Background startup sync:", e));
    }, 1200);
  }
});

// Window Exports
window.renderAll = renderAll;
window.initEventListeners = initEventListeners;
