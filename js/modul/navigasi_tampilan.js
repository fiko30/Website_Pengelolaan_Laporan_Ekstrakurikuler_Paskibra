/**
 * =========================================================================
 * MODUL 2: NAVIGASI & TAMPILAN (navigasi_tampilan.js)
 * SISTEM INFORMASI & LAPORAN PASKIBRA GARATIKA SMKN 40 JAKARTA
 * =========================================================================
 */

/* ==========================================================================
   SWEETALERT2 HELPER (KOMPAK, ELEGAN, BEBAS LAYOUT SHIFT)
   ========================================================================== */
function showSmallAlert({ icon = 'error', title = '', text = '' }) {
  if (typeof Swal !== 'undefined') {
    return Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#b91c1c',
      buttonsStyling: true,
      scrollbarPadding: false,
      heightAuto: false,
      customClass: {
        popup: 'swal-compact-popup'
      }
    });
  } else {
    alert(`${title}\n${text}`);
  }
}

function showSmallToast({ icon = 'success', title = '', text = '' }) {
  if (typeof Swal !== 'undefined') {
    return Swal.fire({
      icon: icon,
      title: title,
      text: text || '',
      timer: 1800,
      showConfirmButton: false,
      scrollbarPadding: false,
      heightAuto: false,
      customClass: {
        popup: 'swal-compact-popup'
      }
    });
  } else {
    alert(title + (text ? '\n' + text : ''));
  }
}


/* ==========================================================================
   3. NAVIGASI TAB & PEMISAHAN TAMPILAN BERBASIS PERAN (PIMPINAN VS DIVISI)
   ========================================================================== */
function normalizeUserDivisionId(user = state.currentUser) {
  if (!user) return "sekretaris";
  const raw = `${user.divisiId || ''} ${user.divisi || ''} ${user.jabatan || ''} ${user.role || ''}`.toLowerCase();
  if (raw.includes("sekretar")) return "sekretaris";
  if (raw.includes("bendahar")) return "bendahara";
  if (raw.includes("korlap") || raw.includes("lapangan")) return "korlap";
  if (raw.includes("sarpras") || raw.includes("sarana")) return "sarpras";
  if (raw.includes("media") || raw.includes("kreatif") || raw.includes("pubdok")) return "media_kreatif";
  if (user.divisiId && user.divisiId !== "anggota") return user.divisiId;
  return "sekretaris";
}

function applyRoleBasedNavigation() {
  const isPimpinan = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : false;
  const menuContainer = document.getElementById("sidebarMenuContainer");
  const navLabel = document.getElementById("sidebarNavLabel");
  const user = state.currentUser;

  if (!menuContainer) return;

  const activeTabEl = document.querySelector(".tab-content.active");
  const currentTabId = activeTabEl ? activeTabEl.id : (!isPimpinan ? "tab-buat-laporan" : "tab-dashboard");

  if (isPimpinan) {
    if (navLabel) navLabel.textContent = "Navigasi Pimpinan";
    menuContainer.innerHTML = `
      <li>
        <button class="nav-btn ${currentTabId === 'tab-dashboard' ? 'active' : ''}" data-tab="tab-dashboard">
          <i class="fa-solid fa-house nav-icon"></i>
          <span>Beranda</span>
        </button>
      </li>
      <li>
        <button class="nav-btn ${currentTabId === 'tab-anggota' ? 'active' : ''}" data-tab="tab-anggota">
          <i class="fa-solid fa-users nav-icon"></i>
          <span>Anggota</span>
        </button>
      </li>
      <li>
        <button class="nav-btn ${currentTabId === 'tab-divisi' ? 'active' : ''}" data-tab="tab-divisi">
          <i class="fa-solid fa-sitemap nav-icon"></i>
          <span>Divisi</span>
        </button>
      </li>
      <li>
        <button class="nav-btn ${currentTabId === 'tab-pengurus' ? 'active' : ''}" data-tab="tab-pengurus">
          <i class="fa-solid fa-user-shield nav-icon"></i>
          <span>Pengurus</span>
        </button>
      </li>
      <li>
        <button class="nav-btn ${currentTabId === 'tab-arsip-laporan' ? 'active' : ''}" data-tab="tab-arsip-laporan">
          <i class="fa-solid fa-file-lines nav-icon"></i>
          <span>Laporan</span>
        </button>
      </li>
    `;
  } else {
    // Menu khusus Divisi (seperti di referensi Website Paskib)
    const divId = typeof normalizeUserDivisionId === 'function' ? normalizeUserDivisionId(user) : '';
    const divTitle = user ? (user.jabatan || user.divisi || "Divisi") : "Divisi";
    if (navLabel) navLabel.textContent = `Menu ${divTitle}`;
    
    if (divId === "sarpras") {
      menuContainer.innerHTML = `
        <li>
          <button class="nav-btn ${currentTabId === 'tab-buat-laporan' ? 'active' : ''}" data-tab="tab-buat-laporan">
            <i class="fa-solid fa-file-pen nav-icon"></i>
            <span>Kelola Laporan</span>
          </button>
        </li>
        <li>
          <button class="nav-btn ${currentTabId === 'tab-barang-sarpras' ? 'active' : ''}" data-tab="tab-barang-sarpras">
            <i class="fa-solid fa-boxes-stacked nav-icon"></i>
            <span>Barang</span>
          </button>
        </li>
        <li>
          <button class="nav-btn ${currentTabId === 'tab-arsip-laporan' ? 'active' : ''}" data-tab="tab-arsip-laporan">
            <i class="fa-solid fa-paper-plane nav-icon"></i>
            <span>Laporan Terkirim</span>
          </button>
        </li>
      `;
    } else {
      menuContainer.innerHTML = `
        <li>
          <button class="nav-btn ${currentTabId === 'tab-buat-laporan' ? 'active' : ''}" data-tab="tab-buat-laporan">
            <i class="fa-solid fa-file-pen nav-icon"></i>
            <span>Kelola Laporan</span>
          </button>
        </li>
        <li>
          <button class="nav-btn ${currentTabId === 'tab-arsip-laporan' ? 'active' : ''}" data-tab="tab-arsip-laporan">
            <i class="fa-solid fa-paper-plane nav-icon"></i>
            <span>Laporan Terkirim</span>
          </button>
        </li>
      `;
    }
  }

  // Bind ulang event listener navigasi sidebar
  initNavigation();

  // Pastikan tombol nav aktif sinkron dengan tab aktif
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === currentTabId);
  });
}

function siapkanTampilanBuatLaporan() {
  const isPimpinan = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : false;
  const selectorBox = document.querySelector(".divisi-selector-box");

  // Jika pimpinan berada di tab buat laporan TANPA mode edit, alihkan segera ke tab arsip laporan
  if (isPimpinan && !window.editingLaporanId) {
    if (typeof switchTab === 'function') {
      switchTab('tab-arsip-laporan');
    }
    return;
  }

  // Jika sedang mode edit, pastikan kotak pemilih divisi selalu tersembunyi
  if (window.editingLaporanId) {
    if (selectorBox) selectorBox.style.display = "none";
    return;
  }

  const pelaporInput = document.getElementById("lapPelapor");
  const headerTitle = document.querySelector("#tab-buat-laporan .section-title-box h2");
  const headerDesc = document.querySelector("#tab-buat-laporan .section-title-box p");

  let targetDivId = "sekretaris";

  if (!isPimpinan) {
    targetDivId = normalizeUserDivisionId(state.currentUser);
    const userTitle = state.currentUser ? (state.currentUser.jabatan || state.currentUser.divisi || "Divisi") : "Divisi";

    if (selectorBox) selectorBox.style.display = "none";

    if (headerTitle) headerTitle.textContent = `Kelola Laporan ${userTitle}`;
    if (headerDesc) headerDesc.textContent = `Pengisian dan pengelolaan formulir laporan rutin mingguan Garatika Jayakarta.`;

    if (pelaporInput && state.currentUser) {
      pelaporInput.value = state.currentUser.nama;
      pelaporInput.readOnly = true;
      pelaporInput.style.backgroundColor = "#f1f5f9";
      pelaporInput.style.cursor = "not-allowed";
    }

    const radio = document.querySelector(`input[name="divisiReport"][value="${targetDivId}"]`);
    if (radio) {
      radio.checked = true;
    }
  } else {
    if (selectorBox) selectorBox.style.display = "";
    if (headerTitle) headerTitle.textContent = "Buat Laporan Divisi";
    if (headerDesc) headerDesc.textContent = "Formulir laporan disesuaikan secara otomatis menurut tugas divisi masing-masing.";
    if (pelaporInput) {
      pelaporInput.readOnly = false;
      pelaporInput.style.backgroundColor = "";
      pelaporInput.style.cursor = "";
      if (!pelaporInput.value && state.currentUser) {
        pelaporInput.value = state.currentUser.nama;
      }
    }
    const checkedRadio = document.querySelector('input[name="divisiReport"]:checked');
    if (checkedRadio) {
      targetDivId = checkedRadio.value;
    } else {
      const defaultSekRadio = document.querySelector('input[name="divisiReport"][value="sekretaris"]');
      if (defaultSekRadio) {
        defaultSekRadio.checked = true;
      }
      targetDivId = "sekretaris";
    }
  }

  if (typeof updateRadioLabelStyles === 'function') updateRadioLabelStyles();
  if (typeof renderDynamicReportFields === 'function') {
    renderDynamicReportFields(targetDivId);
  }
  if (typeof initFlatpickrCalendar === 'function') {
    initFlatpickrCalendar();
  }
}

function siapkanTampilanArsipLaporan() {
  const isPimpinan = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : false;
  const isReadOnly = typeof isWakilAtauPelatih === 'function' ? isWakilAtauPelatih(state.currentUser) : false;
  const adminToolbar = document.getElementById("arsipAdminToolbar");
  const userToolbar = document.getElementById("arsipUserToolbar");
  const btnKelolaFolder = document.getElementById("btnKelolaFolderBulanDrive");
  const btnAksesPublik = document.getElementById("btnAksesDrivePublik");
  const headerTitle = document.querySelector("#tab-arsip-laporan .section-title-box h2");
  const headerDesc = document.querySelector("#tab-arsip-laporan .section-title-box p");

  if (!isPimpinan) {
    const userTitle = state.currentUser ? (state.currentUser.jabatan || state.currentUser.divisi || "Divisi") : "Divisi";

    if (adminToolbar) adminToolbar.style.display = "none";
    if (userToolbar) userToolbar.style.display = "flex";

    if (headerTitle) headerTitle.innerHTML = `Laporan Terkirim - ${escapeHTML(userTitle)}`;
    if (headerDesc) headerDesc.textContent = "Daftar arsip dan riwayat seluruh laporan mingguan divisi yang telah berhasil dikirimkan.";
  } else {
    if (adminToolbar) adminToolbar.style.display = "flex";
    if (userToolbar) userToolbar.style.display = "none";

    // Khusus Wakil Ketua & Pelatih: Sembunyikan tombol kelola folder dan setelan akses Drive
    if (btnKelolaFolder) btnKelolaFolder.style.display = isReadOnly ? "none" : "inline-flex";
    if (btnAksesPublik) btnAksesPublik.style.display = isReadOnly ? "none" : "inline-flex";

    if (headerTitle) headerTitle.textContent = isReadOnly ? "Daftar Laporan Paskibra" : "Arsip Laporan";
    if (headerDesc) headerDesc.textContent = isReadOnly ? "Daftar seluruh laporan divisi yang telah diajukan (Mode Hanya Melihat / Read-Only)." : "Daftar laporan divisi yang telah diajukan, siap dicetak atau dikirim ke Google Drive.";
  }
}

function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTabId = btn.getAttribute("data-tab");
      // Jika pengguna berpindah tab dari menu saat sedang mode edit, bersihkan mode edit tanpa redirect ganda
      if (window.editingLaporanId && targetTabId !== "tab-buat-laporan") {
        if (typeof batalEditLaporan === 'function') {
          batalEditLaporan(false);
        }
      }
      switchTab(targetTabId);
    });
  });
}

function switchTab(tabId) {
  const isPimpinan = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : false;
  const userDivId = typeof normalizeUserDivisionId === 'function' ? normalizeUserDivisionId(state.currentUser) : '';

  // Proteksi hak akses tab untuk non-pimpinan (Divisi)
  if (!isPimpinan) {
    const allowedTabs = ["tab-buat-laporan", "tab-arsip-laporan"];
    if (userDivId === "sarpras") {
      allowedTabs.push("tab-barang-sarpras");
    }
    if (!allowedTabs.includes(tabId)) {
      tabId = "tab-buat-laporan";
    }
  } else {
    // Pimpinan tidak membuat laporan divisi baru secara langsung.
    // tab-buat-laporan hanya boleh diakses pimpinan saat sedang mengedit laporan (window.editingLaporanId aktif)
    if (tabId === "tab-buat-laporan" && !window.editingLaporanId) {
      tabId = "tab-arsip-laporan";
    }
  }

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });

  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.classList.toggle("active", tab.id === tabId);
  });

  // Di layar mobile/tablet, otomatis tutup sidebar drawer saat memilih menu
  if (window.innerWidth <= 1024) {
    const appSidebar = document.getElementById("appSidebar");
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");
    appSidebar?.classList.remove("show");
    sidebarBackdrop?.classList.remove("show");
  }

  if (tabId === "tab-dashboard") renderDashboard();
  if (tabId === "tab-anggota") renderTabelAnggota();
  if (tabId === "tab-divisi") renderGridDivisi();
  if (tabId === "tab-pengurus") renderTabelPengurus();
  if (tabId === "tab-buat-laporan") {
    if (typeof isWakilAtauPelatih === 'function' && isWakilAtauPelatih(state.currentUser)) {
      if (typeof showSmallAlert === 'function') {
        showSmallAlert({
          icon: 'info',
          title: 'Akses Dibatasi',
          text: 'Wakil Ketua dan Pelatih hanya memiliki hak akses untuk melihat laporan, tidak dapat membuat laporan baru.'
        });
      }
      switchTab("tab-arsip-laporan");
      return;
    }
    siapkanTampilanBuatLaporan();
  }
  if (tabId === "tab-barang-sarpras") {
    if (typeof renderHalamanBarangSarpras === 'function') {
      renderHalamanBarangSarpras();
    }
  }
  if (tabId === "tab-arsip-laporan") {
    siapkanTampilanArsipLaporan();
    renderTabelLaporan();
    if (typeof sinkronkanSemuaDariDrive === 'function') {
      sinkronkanSemuaDariDrive(true);
    }
  }
}


function toggleSidebar(forceState) {
  const appSidebar = document.getElementById("appSidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  if (!appSidebar) return;
  const willShow = (typeof forceState === "boolean") ? forceState : !appSidebar.classList.contains("show");
  appSidebar.classList.toggle("show", willShow);
  if (sidebarBackdrop) {
    sidebarBackdrop.classList.toggle("show", willShow);
  }
}

/* ==========================================================================
   HELPER UTILITIES
   ========================================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show");
    modal.style.display = "flex";
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    if (modal.dataset.loading === "true") return; // Cegah tutup saat sedang proses loading
    modal.classList.remove("show");
    modal.style.display = "none";
  }
  const remaining = document.querySelectorAll(".modal-backdrop.show");
  if (!remaining || remaining.length === 0) {
    document.documentElement.classList.remove("modal-open");
    document.body.classList.remove("modal-open");
  }
}


function formatTanggal(isoString) {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return d.toLocaleDateString("id-ID", options);
}

function formatTanggalLengkap(isoString) {
  if (!isoString) return "-";
  const str = String(isoString).trim();
  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  let d;
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const parts = str.split("T")[0].split("-");
    d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  } else if (/^\d{2}-\d{2}-\d{4}/.test(str)) {
    const parts = str.split("-");
    d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  } else {
    let foundMonth = -1;
    namaBulan.forEach((m, idx) => {
      if (str.toLowerCase().includes(m.toLowerCase())) foundMonth = idx;
    });
    if (foundMonth !== -1) {
      const match = str.match(/\b(\d{1,2})\b.*?\b(\d{4})\b/);
      if (match) {
        d = new Date(Number(match[2]), foundMonth, Number(match[1]));
      }
    }
    if (!d) d = new Date(str);
  }
  if (isNaN(d.getTime())) return str;
  return `${d.getDate()} ${namaBulan[d.getMonth()]} ${d.getFullYear()}`;
}

function formatHariTanggalIndo(dateVal) {
  if (!dateVal) return "-";
  const str = String(dateVal).trim();
  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const hariArray = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  let d;
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const parts = str.split("T")[0].split("-");
    d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  } else if (/^\d{2}-\d{2}-\d{4}/.test(str)) {
    const parts = str.split("-");
    d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  } else if (/^\d{2}\/\d{2}\/\d{4}/.test(str)) {
    const parts = str.split("/");
    d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  } else {
    let foundMonth = -1;
    namaBulan.forEach((m, idx) => {
      if (str.toLowerCase().includes(m.toLowerCase())) foundMonth = idx;
    });
    if (foundMonth !== -1) {
      const match = str.match(/\b(\d{1,2})\b.*?\b(\d{4})\b/);
      if (match) {
        d = new Date(Number(match[2]), foundMonth, Number(match[1]));
      }
    }
    if (!d) d = new Date(str);
  }

  if (isNaN(d.getTime())) return str;
  return `${d.getDate()} ${namaBulan[d.getMonth()]} ${d.getFullYear()}`;
}

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount);
}

function formatWaNumber(phone) {
  if (!phone) return "";
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("0")) clean = "62" + clean.slice(1);
  return clean;
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function compareAngkatanOrAbjad(aStr, bStr) {
  const strA = (aStr || "").trim();
  const strB = (bStr || "").trim();

  // Pelatih selalu berada di urutan paling atas (terdahulu)
  const isPelatihA = strA.toLowerCase().includes('pelatih');
  const isPelatihB = strB.toLowerCase().includes('pelatih');
  if (isPelatihA && !isPelatihB) return -1;
  if (!isPelatihA && isPelatihB) return 1;
  if (isPelatihA && isPelatihB) return 0;

  const numA = strA.match(/\d+/);
  const numB = strB.match(/\d+/);

  if (numA && numB) {
    const valA = parseInt(numA[0], 10);
    const valB = parseInt(numB[0], 10);
    if (valA !== valB) return valA - valB;
  } else if (numA && !numB) {
    return -1;
  } else if (!numA && numB) {
    return 1;
  }

  return strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
}

function compareAnggota(a, b) {
  const compAngkatan = compareAngkatanOrAbjad(a.angkatan, b.angkatan);
  if (compAngkatan !== 0) return compAngkatan;
  return (a.nama || "").localeCompare(b.nama || "", undefined, { sensitivity: 'base' });
}

function getDivisiRank(item) {
  const id = String(item?.id || "").toLowerCase();
  const nama = String(item?.nama || "").toLowerCase();

  // 0. Pelatih paling atas
  if (id === 'pelatih' || nama.includes('pelatih')) return 0;
  // 1. Ketua
  if (id === 'ketua' || (nama.includes('ketua') && !nama.includes('wakil'))) return 1;
  // 2. Wakil Ketua
  if (id === 'wakil_ketua' || nama.includes('wakil')) return 2;
  // 3. Sekretaris
  if (id === 'sekretaris' || nama.includes('sekretaris')) return 3;
  // 4. Bendahara
  if (id === 'bendahara' || nama.includes('bendahara')) return 4;
  // 5. Koordinator Lapangan
  if (id === 'korlap' || nama.includes('lapangan') || nama.includes('korlap')) return 5;
  // 6. Sarana dan Prasarana
  if (id === 'sarpras' || nama.includes('sarana') || nama.includes('sarpras')) return 6;
  // 7. Media Kreatif
  if (id === 'media_kreatif' || nama.includes('media') || nama.includes('kreatif')) return 7;
  return 100;
}

function compareDivisi(a, b) {
  const rankA = getDivisiRank(a);
  const rankB = getDivisiRank(b);

  if (rankA !== rankB) {
    return rankA - rankB;
  }

  // Divisi lainnya jika ranking sama diurutkan berdasarkan nomor jika ada, atau abjad
  const numA = (a?.nama || "").match(/\d+/);
  const numB = (b?.nama || "").match(/\d+/);
  if (numA && numB) {
    const valA = parseInt(numA[0], 10);
    const valB = parseInt(numB[0], 10);
    if (valA !== valB) return valA - valB;
  } else if (numA && !numB) {
    return -1;
  } else if (!numA && numB) {
    return 1;
  }
  return (a?.nama || "").localeCompare(b?.nama || "", undefined, { numeric: true, sensitivity: 'base' });
}


// Window Exports
window.showSmallAlert = showSmallAlert;
window.showSmallToast = showSmallToast;
window.initNavigation = initNavigation;
window.switchTab = switchTab;
window.toggleSidebar = toggleSidebar;
window.openModal = openModal;
window.closeModal = closeModal;
window.formatTanggal = formatTanggal;
window.formatTanggalLengkap = formatTanggalLengkap;
window.formatHariTanggalIndo = formatHariTanggalIndo;
window.formatRupiah = formatRupiah;
window.formatWaNumber = formatWaNumber;
window.escapeHTML = escapeHTML;
window.compareAngkatanOrAbjad = compareAngkatanOrAbjad;
window.compareAnggota = compareAnggota;
window.getDivisiRank = getDivisiRank;
window.compareDivisi = compareDivisi;
window.applyRoleBasedNavigation = applyRoleBasedNavigation;
window.siapkanTampilanBuatLaporan = siapkanTampilanBuatLaporan;
window.siapkanTampilanArsipLaporan = siapkanTampilanArsipLaporan;
window.normalizeUserDivisionId = normalizeUserDivisionId;
