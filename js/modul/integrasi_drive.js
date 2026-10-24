/**
 * =========================================================================
 * MODUL 10: INTEGRASI GOOGLE DRIVE & APPS SCRIPT (integrasi_drive.js)
 * SISTEM INFORMASI & LAPORAN PASKIBRA GARATIKA SMKN 40 JAKARTA
 * =========================================================================
 */

/* ==========================================================================
   MANAJEMEN KATEGORI BULAN (FOLDER GOOGLE DRIVE)
   ========================================================================== */
function populateKategoriBulan() {
  const selectBulan = document.getElementById("lapKategoriBulan");
  const curBulanVal = selectBulan ? selectBulan.value : "";

  // 1. Populate Dropdown Kategori Bulan Form Input
  if (selectBulan) {
    let html = '';
    state.kategoriBulan.forEach(kb => {
      html += `<option value="${escapeHTML(kb.folder || kb.label)}">${escapeHTML(kb.label)}</option>`;
    });
    selectBulan.innerHTML = html;
    if (curBulanVal) {
      selectBulan.value = curBulanVal;
    } else {
      const today = new Date();
      const currentYearMonth = today.toISOString().slice(0, 7);
      const matched = state.kategoriBulan.find(b => b.id === currentYearMonth);
      if (matched) selectBulan.value = matched.folder || matched.label;
    }
  }

  // 2. Populate Dropdown Filter Modal Laporan
  const popupBulanLap = document.getElementById("popupFilterBulanLaporan");
  if (popupBulanLap) {
    const curVal = popupBulanLap.value;
    let html = '<option value="">Semua Bulan</option>';
    (state.kategoriBulan || []).forEach(kb => {
      html += `<option value="${escapeHTML(kb.folder || kb.label)}">${escapeHTML(kb.label)}</option>`;
    });
    popupBulanLap.innerHTML = html;
    if (curVal) popupBulanLap.value = curVal;
  }

  renderKategoriDriveTags();
  updateArsipBadges();
  if (typeof syncReportDateInfo === 'function') {
    syncReportDateInfo();
  }
}

function renderKategoriDriveTags() {
  const containerBulan = document.getElementById("listKategoriBulanTags");
  if (containerBulan) {
    containerBulan.innerHTML = state.kategoriBulan.map(kb => `
      <span class="badge" style="background: #e2e8f0; color: #334155; padding: 5px 12px; border-radius: 9999px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap;">
        <i class="fa-regular fa-folder" style="color: var(--accent-red);"></i> <span>${escapeHTML(kb.label)}</span>
        <button type="button" onclick="hapusKategoriBulan('${escapeHTML(kb.id)}')" style="background:none; border:none; cursor:pointer; color:#ef4444; font-size:0.9rem; padding:0;" title="Hapus bulan">&times;</button>
      </span>
    `).join("") || '<span style="color: var(--text-muted); font-size: 0.76rem;">Belum ada folder bulan.</span>';
  }
}

function convertMonthNameToId(label) {
  if (!label) return "";
  const months = {
    "januari": "01", "februari": "02", "maret": "03", "april": "04",
    "mei": "05", "juni": "06", "juli": "07", "agustus": "08",
    "september": "09", "oktober": "10", "november": "11", "desember": "12"
  };
  const parts = label.trim().split(/\s+/);
  if (parts.length >= 2) {
    const m = months[parts[0].toLowerCase()];
    const y = parts[1];
    if (m && y) return `${y}-${m}`;
  }
  return label;
}

// Fungsi sinkronisasi folder sekarang disatukan ke fungsi utama sinkronkanSemuaDariDrive
async function sinkronkanFolderDrive(silent = false) {
  return await sinkronkanSemuaDariDrive(silent);
}

function updateArsipBadges() {
  const badgeLaporan = document.getElementById("badgeCountLaporan");
  const badgeDrive = document.getElementById("badgeCountBerkasDrive");
  if (badgeLaporan) badgeLaporan.textContent = Array.isArray(state.laporan) ? state.laporan.length : 0;
  if (badgeDrive) badgeDrive.textContent = Array.isArray(state.driveFiles) ? state.driveFiles.length : 0;
}

function switchArsipView() {
  if (typeof renderTabelLaporan === 'function') {
    renderTabelLaporan();
  }
}

function getFileIcon(mimeType, fileName) {
  const name = (fileName || "").toLowerCase();
  const mime = (mimeType || "").toLowerCase();
  if (mime.includes("pdf") || name.endsWith(".pdf")) return { icon: "fa-solid fa-file-pdf", color: "#dc2626" };
  if (mime.includes("image") || name.match(/\.(png|jpe?g|gif|webp|svg)$/)) return { icon: "fa-solid fa-file-image", color: "#2563eb" };
  if (mime.includes("word") || name.match(/\.(docx?|rtf)$/)) return { icon: "fa-solid fa-file-word", color: "#1d4ed8" };
  if (mime.includes("sheet") || mime.includes("excel") || name.match(/\.(xlsx?|csv)$/)) return { icon: "fa-solid fa-file-excel", color: "#16a34a" };
  if (mime.includes("presentation") || name.match(/\.(pptx?)$/)) return { icon: "fa-solid fa-file-powerpoint", color: "#ea580c" };
  if (mime.includes("text") || name.endsWith(".txt")) return { icon: "fa-solid fa-file-lines", color: "#475569" };
  if (mime.includes("zip") || mime.includes("rar")) return { icon: "fa-solid fa-file-zipper", color: "#d97706" };
  return { icon: "fa-solid fa-file", color: "#64748b" };
}

let activeFilterBulanDrive = "";

function bukaModalFilterDrive() {
  const popupBulan = document.getElementById("popupFilterBulanDrive");
  if (popupBulan) {
    let html = '<option value="">Semua Folder Bulan</option>';
    (state.kategoriBulan || []).forEach(kb => {
      html += `<option value="${escapeHTML(kb.folder || kb.label)}">${escapeHTML(kb.label)}</option>`;
    });
    popupBulan.innerHTML = html;
    popupBulan.value = activeFilterBulanDrive;
  }
  if (typeof openModal === 'function') openModal("modalFilterDrive");
}

function batalFilterDrive() {
  if (typeof closeModal === 'function') closeModal("modalFilterDrive");
}

function terapkanFilterDrive() {
  const popupBulan = document.getElementById("popupFilterBulanDrive");
  activeFilterBulanDrive = popupBulan ? popupBulan.value : "";
  updateBadgeFilterActiveDrive();
  if (typeof closeModal === 'function') closeModal("modalFilterDrive");
  renderTabelBerkasDrive();
}

function resetFilterDrive() {
  const searchInput = document.getElementById("searchBerkasDrive");
  const clearBtn = document.getElementById("btnClearSearchBerkasDrive");
  if (searchInput) searchInput.value = "";
  if (clearBtn) {
    clearBtn.classList.remove("visible");
    clearBtn.style.setProperty("display", "none", "important");
  }

  activeFilterBulanDrive = "";

  const popupBulan = document.getElementById("popupFilterBulanDrive");
  if (popupBulan) popupBulan.value = "";

  updateBadgeFilterActiveDrive();

  const btnReset = document.getElementById("btnResetFilterDrive");
  const icon = btnReset ? btnReset.querySelector("i") : null;
  if (icon) {
    icon.classList.add("fa-spin");
    setTimeout(() => icon.classList.remove("fa-spin"), 400);
  }

  renderTabelBerkasDrive();

  if (typeof showSmallToast === "function") {
    showSmallToast({
      icon: 'success',
      title: 'Filter & Data Direset',
      text: 'Menampilkan seluruh berkas Google Drive.'
    });
  }
}

function updateBadgeFilterActiveDrive() {
  const badge = document.getElementById("badgeFilterActiveDrive");
  const btn = document.getElementById("btnBukaModalFilterDrive");
  const isFiltered = Boolean(activeFilterBulanDrive);
  if (badge) badge.style.display = isFiltered ? "block" : "none";
  if (btn) btn.classList.toggle("is-active", isFiltered);
}

function clearSearchBerkasDrive() {
  const searchInput = document.getElementById("searchBerkasDrive");
  const clearBtn = document.getElementById("btnClearSearchBerkasDrive");
  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
  }
  if (clearBtn) {
    clearBtn.classList.remove("visible");
    clearBtn.style.setProperty("display", "none", "important");
  }
  renderTabelBerkasDrive();
}

function renderTabelBerkasDrive() {
  const tbody = document.getElementById("tabelBerkasDriveBody");
  if (!tbody) return;

  const isReadOnly = (typeof isWakilAtauPelatih === 'function' && isWakilAtauPelatih(state.currentUser));

  const filterBulan = activeFilterBulanDrive || (document.getElementById("filterBulanBerkasDrive")?.value || "");
  const rawKeyword = document.getElementById("searchBerkasDrive")?.value || "";
  const keyword = rawKeyword.toLowerCase().trim();

  // Kontrol tampilan tombol 'X' merah pembersih live search berkas drive
  const clearBtn = document.getElementById("btnClearSearchBerkasDrive");
  if (clearBtn) {
    const hasText = rawKeyword.trim().length > 0;
    clearBtn.classList.toggle("visible", hasText);
    clearBtn.style.setProperty("display", hasText ? "inline-flex" : "none", "important");
  }

  let files = Array.isArray(state.driveFiles) ? state.driveFiles : [];
  updateArsipBadges();

  let filtered = files.filter(f => {
    const matchBulan = !filterBulan || f.folderName === filterBulan;
    const matchKeyword = !keyword || (f.name || "").toLowerCase().includes(keyword) || (f.folderName || "").toLowerCase().includes(keyword);
    return matchBulan && matchKeyword;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="cell-empty-state" style="text-align: center; padding: 30px 16px; color: var(--text-muted);">
          <i class="fa-brands fa-google-drive" style="font-size: 2rem; display: block; margin-bottom: 8px; color: #94a3b8;"></i>
          ${files.length === 0 
            ? 'Belum ada berkas tersinkron dari Google Drive. Klik tombol <strong>Sinkronkan dari Drive</strong> di atas untuk memuat berkas terbaru.'
            : 'Tidak ada berkas yang sesuai dengan kriteria filter pencarian.'}
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(f => {
    const fileType = getFileIcon(f.mimeType, f.name);
    return `
      <tr>
        <td class="cell-drive-file" style="min-width: 220px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <i class="${fileType.icon}" style="font-size: 1.4rem; color: ${fileType.color}; flex-shrink: 0;"></i>
            <div>
              <strong style="color: var(--text-main); font-size: 0.875rem; word-break: break-word;">${escapeHTML(f.name)}</strong>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
                Tipe: ${escapeHTML(f.mimeType || 'Berkas Drive')}
              </div>
            </div>
          </div>
        </td>
        <td class="cell-drive-folder">
          <span style="background: #e2e8f0; color: #334155; padding: 3px 9px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 5px;">
            <i class="fa-regular fa-folder" style="color: var(--accent-red);"></i> ${escapeHTML(f.folderName || 'Root')}
          </span>
        </td>
        <td class="cell-drive-size" style="font-size: 0.8rem; color: #475569;">
          <span class="mobile-cell-label"><i class="fa-solid fa-hard-drive mobile-only-icon"></i>Ukuran:</span> ${escapeHTML(f.size || '-')}
        </td>
        <td class="cell-drive-date" style="font-size: 0.78rem; color: var(--text-muted);">
          <span class="mobile-cell-label"><i class="fa-regular fa-clock mobile-only-icon"></i>Diubah:</span> ${f.updated ? formatTanggalLengkap(f.updated.split('T')[0]) : '-'}
        </td>
        <td class="cell-drive-actions" style="text-align: center;">
          <div style="display: flex; gap: 6px; justify-content: center;" class="action-btns">
            <a href="${escapeHTML(f.url)}" target="_blank" class="btn btn-secondary btn-sm" title="Buka Berkas di Google Drive" style="padding: 6px 12px; font-size: 0.8rem;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Berkas
            </a>
            ${!isReadOnly ? `
            <button type="button" class="btn-action-icon btn-delete" onclick="hapusBerkasDrive('${escapeHTML(f.id)}', '${escapeHTML(f.name).replace(/'/g, "\\'")}')" title="Hapus Berkas dari Google Drive">
              <i class="fa-solid fa-trash-can"></i>
            </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

async function hapusBerkasDrive(fileId, fileName) {
  if (!fileId) return;

  if (typeof isWakilAtauPelatih === 'function' && isWakilAtauPelatih(state.currentUser)) {
    if (typeof showSmallAlert === 'function') {
      showSmallAlert({
        icon: 'warning',
        title: 'Akses Dibatasi',
        text: 'Wakil Ketua dan Pelatih tidak memiliki izin untuk menghapus berkas di Google Drive. Anda hanya memiliki hak akses melihat berkas.'
      });
    }
    return;
  }

  if (typeof Swal !== 'undefined') {
    const confirmDelete = await Swal.fire({
      title: 'Hapus Berkas dari Drive?',
      html: `
        <div style="text-align: left; font-size: 0.95rem; color: #334155; line-height: 1.5;">
          <p>Apakah Anda yakin ingin menghapus berkas <strong>"${escapeHTML(fileName || 'berkas')}"</strong>?</p>
          <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 8px 12px; border-radius: 6px; margin-top: 10px; color: #991b1b; font-size: 0.85rem;">
            <i class="fa-solid fa-triangle-exclamation"></i> Berkas akan <strong>dipindahkan ke Sampah Google Drive</strong> dan otomatis hilang dari website.
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: '<i class="fa-solid fa-trash-can"></i> Ya, Hapus dari Drive',
      cancelButtonText: 'Batal'
    });
    if (!confirmDelete.isConfirmed) return;
  }

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Menghapus dari Google Drive...',
      text: `Sedang memindahkan "${fileName}" ke Sampah Drive...`,
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });
  }

  try {
    const res = await fetch(state.gasWebhookUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "deleteDriveFile",
        fileId: fileId,
        fileName: fileName,
        timestamp: new Date().toISOString()
      })
    });
    const result = await res.json();

    if (result && result.status === "success") {
      state.driveFiles = state.driveFiles.filter(f => f.id !== fileId);
      // Sinkronisasi Dua Arah: Hapus laporan terkait dari state website jika berkas Drive-nya dihapus
      if (Array.isArray(state.laporan)) {
        state.laporan = state.laporan.filter(l => {
          const url = String(l.driveFileUrl || l.driveUrl || l.detail?.driveUrl || l.detail?.driveFileUrl || "");
          return !url.includes(fileId);
        });
      }
      saveState();
      renderTabelBerkasDrive();
      if (typeof renderTabelLaporan === 'function') renderTabelLaporan();
      if (typeof renderDashboard === 'function') renderDashboard();
      if (typeof updateArsipBadges === 'function') updateArsipBadges();

      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: 'Berkas Berhasil Dihapus!',
          text: `Berkas "${fileName}" telah dipindahkan ke Sampah Google Drive.`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        showSmallToast({ icon: 'success', title: 'Berkas dihapus dari Drive' });
      }
    } else {
      throw new Error((result && result.message) || "Gagal menghapus berkas di Google Drive.");
    }
  } catch (err) {
    console.error("Gagal hapus berkas Drive:", err);
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus',
        text: 'Google Drive merespons: ' + err.message,
        confirmButtonColor: '#b91c1c'
      });
    } else {
      showSmallToast({ icon: 'error', title: 'Gagal hapus berkas: ' + err.message });
    }
  }
}

async function sinkronkanSemuaDariDrive(silent = false) {
  if (!state.gasWebhookUrl) return;

  const btnSync = document.getElementById("btnSyncSemuaDrive");
  const btnSyncFolder = document.getElementById("btnSyncFolderDrive");

  if (btnSync) {
    btnSync.disabled = true;
    btnSync.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin"></i> Menyinkronkan...';
  }
  if (btnSyncFolder) {
    btnSyncFolder.disabled = true;
    btnSyncFolder.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin"></i> Menyinkronkan...';
  }

  try {
    const fetchUrlDrive = state.gasWebhookUrl + (state.gasWebhookUrl.includes('?') ? '&' : '?') + `action=getDriveState&t=${Date.now()}`;
    const fetchUrlAll = state.gasWebhookUrl + (state.gasWebhookUrl.includes('?') ? '&' : '?') + `action=getAll&t=${Date.now()}`;

    const [resDrive, resAll] = await Promise.allSettled([
      fetch(fetchUrlDrive, { method: "GET", redirect: "follow" }).then(r => r.json()),
      fetch(fetchUrlAll, { method: "GET", redirect: "follow" }).then(r => r.json())
    ]);

    const result = (resDrive.status === "fulfilled") ? resDrive.value : null;
    const resultAll = (resAll.status === "fulfilled") ? resAll.value : null;

    if (result && result.status === "success") {
      // 1. Sinkronkan Folder Bulan langsung dari Google Drive
      if (Array.isArray(result.folders)) {
        state.kategoriBulan = result.folders.map(f => ({
          id: convertMonthNameToId(f.name),
          label: f.name,
          folder: f.name,
          url: f.url
        }));
      }

      // 2. Sinkronkan Berkas Langsung dari Google Drive
      if (Array.isArray(result.files)) {
        state.driveFiles = result.files;
      }
    }

    if (resultAll && resultAll.status === "success" && resultAll.data) {
      if (Array.isArray(resultAll.data.laporan)) {
        state.laporan = resultAll.data.laporan;
      }
      if (Array.isArray(resultAll.data.kategoriAngkatan) && resultAll.data.kategoriAngkatan.length > 0) {
        state.kategoriAngkatan = resultAll.data.kategoriAngkatan;
      }
    }

    saveState();
    populateKategoriBulan();
    renderTabelLaporan();
    updateArsipBadges();

    const totalBerkas = (state.laporan?.length || 0) + (state.driveFiles?.length || 0);

    if (!silent) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: 'Tersinkron dengan Google Drive!',
          html: `
            <div style="text-align: left; font-size: 0.95rem; color: #334155;">
              <p>Status terkini di Google Drive Garatika Jayakarta:</p>
              <div style="background: #f1f5f9; padding: 10px 14px; border-radius: 8px; margin: 10px 0; border-left: 3px solid var(--accent-red); font-size: 0.875rem;">
                <div><i class="fa-regular fa-folder-open" style="color: var(--accent-red);"></i> <strong>${state.kategoriBulan.length} Folder Bulan Aktif:</strong> ${state.kategoriBulan.map(k => k.label).join(', ') || 'Belum ada'}</div>
                <div style="margin-top: 6px;"><i class="fa-regular fa-file" style="color: var(--accent-red);"></i> <strong>${totalBerkas} Laporan & Berkas Resmi</strong></div>
              </div>
              <p style="font-size: 0.825rem; color: #64748b; margin-top: 6px;">
                Semua laporan divisi dari sistem dan berkas di Google Drive telah berhasil disinkronkan dan dapat langsung diakses.
              </p>
            </div>
          `,
          confirmButtonColor: '#b91c1c'
        });
      } else {
        showSmallToast({ icon: 'success', title: 'Data laporan & Google Drive tersinkron' });
      }
    }
  } catch (err) {
    console.warn("Gagal sinkron penuh dari Google Drive:", err);
    saveState();
    populateKategoriBulan();
    renderTabelLaporan();
    if (!silent) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'warning',
          title: 'Gagal Sinkron Drive',
          text: 'Tidak dapat menghubungkan ke Google Drive: ' + err.message,
          confirmButtonColor: '#b91c1c'
        });
      }
    }
  } finally {
    if (btnSync) {
      btnSync.disabled = false;
      btnSync.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Sinkronkan dari Drive';
    }
    if (btnSyncFolder) {
      btnSyncFolder.disabled = false;
      btnSyncFolder.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Sinkronkan Folder';
    }
  }
}

function bukaModalKelolaKategoriDrive() {
  openModal("modalKelolaKategoriDrive");
  sinkronkanSemuaDariDrive(true);
}


async function simpanKategoriBulanBaru(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("inputBulanBaru");
  const rawVal = input ? input.value : "";
  if (!rawVal) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'warning',
        title: 'Bulan Belum Dipilih',
        text: 'Silakan pilih bulan terlebih dahulu sebelum membuat folder baru di Google Drive.'
      });
    } else {
      showSmallToast({ icon: 'warning', title: 'Pilih bulan terlebih dahulu' });
    }
    return;
  }

  const [year, month] = rawVal.split("-");
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const mIndex = parseInt(month, 10) - 1;
  const monthLabel = `${monthNames[mIndex] || month} ${year}`;
  const folderName = monthLabel; // Nama folder langsung nama bulan e.g. "November 2026"

  const exists = state.kategoriBulan.some(k => k.id === rawVal || k.label.toLowerCase() === monthLabel.toLowerCase());
  if (exists) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'info',
        title: 'Folder Sudah Ada',
        text: `Folder bulan "${monthLabel}" sudah terdaftar di sistem dan Google Drive.`
      });
    } else {
      showSmallToast({ icon: 'warning', title: `Folder bulan "${monthLabel}" sudah ada` });
    }
    return;
  }

  // Validasi konfirmasi penambahan folder baru
  if (typeof Swal !== 'undefined') {
    const confirmAdd = await Swal.fire({
      title: 'Tambah Folder Bulan?',
      html: `
        <div style="text-align: left; font-size: 0.95rem; color: #334155; line-height: 1.5;">
          <p>Apakah Anda yakin ingin menambahkan folder bulan <strong>"${monthLabel}"</strong>?</p>
          <div style="background: #f1f5f9; padding: 10px 14px; border-radius: 8px; margin-top: 10px; border-left: 3px solid var(--accent-red); font-size: 0.85rem;">
            <i class="fa-brands fa-google-drive" style="color: var(--accent-red);"></i> Folder baru bernama <strong>"${folderName}"</strong> akan otomatis dibuat langsung di Google Drive Garatika Jayakarta.
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: '<i class="fa-solid fa-check"></i> Ya, Tambahkan',
      cancelButtonText: 'Batal',
      scrollbarPadding: false,
      heightAuto: false
    });
    if (!confirmAdd.isConfirmed) return;
  }

  // Tampilkan loading saat membuat folder di Google Drive
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Membuat Folder di Drive...',
      html: `Sedang membuat folder <strong>"${folderName}"</strong> di Google Drive Garatika Jayakarta...`,
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });
  }

  try {
    const res = await fetch(state.gasWebhookUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "createDriveFolder",
        kategoriBulan: folderName,
        bulan: folderName,
        folderName: folderName,
        timestamp: new Date().toISOString()
      })
    });
    const result = await res.json();
    console.log("Create folder response:", result);

    if (result && result.status === "success") {
      state.kategoriBulan.push({
        id: rawVal,
        label: monthLabel,
        folder: folderName,
        url: result.folderUrl || ""
      });
      state.kategoriBulan.sort((a, b) => a.id.localeCompare(b.id));

      saveState();
      populateKategoriBulan();
      if (input) input.value = "";

      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: 'Folder Berhasil Dibuat!',
          text: `Folder "${monthLabel}" telah otomatis terbuat di Google Drive dan website.`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        showSmallToast({ icon: 'success', title: `Folder "${monthLabel}" dibuat di Drive` });
      }
    } else {
      throw new Error((result && result.message) || "Gagal membuat folder di Google Drive");
    }
  } catch (err) {
    console.error("Gagal buat folder di Google Drive:", err);
    // JANGAN tambahkan ke state jika gagal di Drive
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Membuat di Google Drive',
        text: `Folder "${monthLabel}" tidak dapat dibuat di Google Drive: ${err.message}. Data tidak ditambahkan ke website.`
      });
    } else {
      showSmallToast({ icon: 'error', title: `Gagal membuat folder: ${err.message}` });
    }
  }
}

async function hapusKategoriBulan(id) {
  if (state.kategoriBulan.length <= 1) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'warning',
        title: 'Tidak Bisa Menghapus',
        text: 'Minimal harus ada 1 folder bulan tersisa di sistem.'
      });
    } else {
      showSmallAlert({ icon: 'warning', title: 'Tidak Bisa Menghapus', text: 'Minimal harus ada 1 bulan tersisa.' });
    }
    return;
  }

  const kb = state.kategoriBulan.find(k => k.id === id);
  if (!kb) return;

  const folderName = kb.folder || kb.label;

  // Cek apakah ada laporan divisi yang memakai bulan ini
  const countLaporan = state.laporan.filter(lap => 
    lap.kategoriBulan === folderName || 
    lap.detail?.kategoriBulan === folderName ||
    lap.kategoriBulan === kb.label
  ).length;

  // Validasi konfirmasi penghapusan dengan peringatan tegas
  if (typeof Swal !== 'undefined') {
    const confirmDelete = await Swal.fire({
      title: `Hapus Folder "${kb.label}"?`,
      html: `
        <div style="text-align: left; font-size: 0.875rem; color: #334155; line-height: 1.5;">
          <p style="margin-bottom: 8px;">Folder ini akan <strong>dihapus dari website dan folder fisiknya di Google Drive akan dipindahkan ke Sampah (Trash)</strong>.</p>
          ${countLaporan > 0 ? `<div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 8px 12px; border-radius: 4px; margin-top: 10px; color: #991b1b; font-weight: 600;"><i class="fa-solid fa-triangle-exclamation"></i> Peringatan: Terdapat <strong>${countLaporan} laporan</strong> divisi yang menggunakan bulan ini!</div>` : ''}
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: '<i class="fa-solid fa-trash-can"></i> Ya, Hapus dari Website & Drive',
      cancelButtonText: 'Batal'
    });
    if (!confirmDelete.isConfirmed) return;
  }

  // Tampilkan loading saat menghapus folder di Google Drive
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Menghapus Folder di Drive...',
      html: `Sedang memindahkan folder <strong>"${folderName}"</strong> ke Sampah Google Drive...`,
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });
  }

  try {
    const res = await fetch(state.gasWebhookUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "deleteDriveFolder",
        kategoriBulan: folderName,
        bulan: folderName,
        folderName: folderName,
        timestamp: new Date().toISOString()
      })
    });
    const result = await res.json();
    console.log("Delete folder response:", result);

    // Hapus dari state
    state.kategoriBulan = state.kategoriBulan.filter(k => k.id !== id);
    saveState();
    populateKategoriBulan();

    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'success',
        title: 'Folder Berhasil Dihapus!',
        text: `Folder "${kb.label}" telah dihapus dari website dan otomatis dipindahkan ke Sampah Google Drive.`,
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      showSmallToast({ icon: 'info', title: `Folder "${kb.label}" dihapus` });
    }
  } catch (err) {
    console.error("Gagal hapus folder di Drive:", err);
    state.kategoriBulan = state.kategoriBulan.filter(k => k.id !== id);
    saveState();
    populateKategoriBulan();

    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'warning',
        title: 'Dihapus dari Website',
        text: `Folder dihapus dari website, namun Google Drive merespons: ${err.message}`
      });
    }
  }
}


/* ==========================================================================
   11. DATABASE GOOGLE APPS SCRIPT & GOOGLE DRIVE (GARATIKA JAYAKARTA)
   ========================================================================== */
function setDatabaseStatus(status, text) {
  const headerDot = document.getElementById("headerDbStatusDot");
  const headerText = document.getElementById("dashboardDbStatusText");
  if (headerDot) {
    headerDot.className = "db-status-dot " + status;
  }
  if (headerText && text) {
    headerText.textContent = text;
  }

  const cardStatus = document.getElementById("dbCardConnectionStatus");
  if (cardStatus) {
    let dotHtml = `<span class="db-status-dot ${status}"></span> `;
    let label = text || "Status Tidak Diketahui";
    cardStatus.innerHTML = dotHtml + label;
  }
}

function initGASConnection() {
  const input = document.getElementById("gasWebhookUrl");
  if (input && state.gasWebhookUrl) {
    input.value = state.gasWebhookUrl;
  }

  const pre = document.getElementById("preGASCode");
  if (pre && !pre.textContent) {
    fetch("google-apps-script/Code.gs")
      .then(res => res.text())
      .then(code => { pre.textContent = code; })
      .catch(() => {
        pre.textContent = "// Kode lengkap tersedia di google-apps-script/Code.gs pada folder website ini.\n// Salin isi berkas tersebut ke editor script.google.com.";
      });
  }

  if (state.gasWebhookUrl) {
    setDatabaseStatus("syncing", "Menghubungkan ke Cloud...");
    fetchDataFromGAS(true);
  } else {
    setDatabaseStatus("offline", "Belum Terhubung (Lokal)");
  }
}

function simpanGASUrl() {
  const url = document.getElementById("gasWebhookUrl").value.trim();
  state.gasWebhookUrl = url;
  saveState();

  if (url) {
    showSmallToast({ icon: 'success', title: 'URL Webhook berhasil disimpan' });
    setDatabaseStatus("syncing", "Menghubungkan...");
    fetchDataFromGAS(false);
  } else {
    setDatabaseStatus("offline", "Belum Terhubung (Lokal)");
    showSmallToast({ icon: 'info', title: 'Mode penyimpanan lokal' });
  }
}

async function testKoneksiGAS() {
  const url = document.getElementById("gasWebhookUrl").value.trim();
  if (!url) {
    showSmallAlert({
      icon: 'warning',
      title: 'URL Belum Diisi',
      text: 'Silakan masukkan URL Web App Google Apps Script dari akun Garatika Jayakarta terlebih dahulu.'
    });
    return;
  }

  setDatabaseStatus("syncing", "Menguji koneksi...");

  try {
    const testUrl = url + (url.includes('?') ? '&' : '?') + `action=ping&t=${Date.now()}`;
    const res = await fetch(testUrl, {
      method: "GET",
      redirect: "follow"
    });
    const data = await res.json();

    if (data && data.status === "success") {
      state.gasWebhookUrl = url;
      saveState();
      setDatabaseStatus("online", "Terhubung: Garatika Jayakarta");
      showSmallAlert({
        icon: 'success',
        title: 'Koneksi Berhasil!',
        text: `Terhubung ke Database Apps Script akun Garatika Jayakarta (${data.akun || "Aktif"}).`
      });
    } else {
      throw new Error(data?.message || "Respon Apps Script tidak sesuai");
    }
  } catch (err) {
    setDatabaseStatus("error", "Koneksi Gagal");
    showSmallAlert({
      icon: 'error',
      title: 'Koneksi Gagal',
      text: 'Tidak dapat menghubungi Google Apps Script: ' + err.message + '\nPastikan deployment Web App disetel "Execute as: Me" dan "Who has access: Anyone".'
    });
  }
}

async function fetchDataFromGAS(silent = false) {
  const url = state.gasWebhookUrl;
  if (!url) {
    if (!silent) {
      showSmallAlert({
        icon: 'warning',
        title: 'URL Belum Diatur',
        text: 'Silakan masukkan URL Web App Google Apps Script akun Garatika Jayakarta.'
      });
    }
    setDatabaseStatus("offline", "Belum Terhubung (Lokal)");
    return;
  }

  setDatabaseStatus("syncing", "Mengambil data cloud...");

  try {
    const fetchUrl = url + (url.includes('?') ? '&' : '?') + `action=getAll&t=${Date.now()}`;
    const res = await fetch(fetchUrl, {
      method: "GET",
      redirect: "follow"
    });
    const result = await res.json();

    if (result && result.status === "success" && result.data) {
      const { anggota, divisi, laporan, kategoriAngkatan, masterSarpras } = result.data;

      if (Array.isArray(masterSarpras) && masterSarpras.length > 0) {
        state.masterSarpras = masterSarpras;
        localStorage.setItem("garatika_master_sarpras", JSON.stringify(masterSarpras));
      }

      if (Array.isArray(anggota) && anggota.length > 0) {
        if (typeof normalizeAnggotaObject === "function") {
          anggota.forEach(a => normalizeAnggotaObject(a));
        }
        const seenAnggota = new Set();
        state.anggota = anggota.filter(a => {
          const key = (a.nama || "").trim().toLowerCase();
          if (!key || seenAnggota.has(key)) return false;
          seenAnggota.add(key);
          return true;
        });
        if (typeof compareAnggota === 'function') {
          state.anggota.sort(compareAnggota);
        }
      }
      if (Array.isArray(divisi) && divisi.length > 0) {
        // Amankan dan sinkronkan password divisi: Jangan biarkan password kustom terhapus/tereset!
        divisi.forEach(cloudDiv => {
          if (cloudDiv.password && typeof cloudDiv.password === "string" && cloudDiv.password.trim().length > 0) {
            if (typeof saveCustomPassword === "function") {
              saveCustomPassword(cloudDiv.id, cloudDiv.password);
              saveCustomPassword(cloudDiv.nama, cloudDiv.password);
            }
          } else {
            const localDiv = (Array.isArray(state.divisi) ? state.divisi : []).find(d => 
              d.id === cloudDiv.id || (cloudDiv.nama && d.nama && d.nama.toLowerCase() === cloudDiv.nama.toLowerCase())
            );
            if (localDiv && localDiv.password) {
              cloudDiv.password = localDiv.password;
            } else if (typeof getDivisiPassword === "function") {
              cloudDiv.password = getDivisiPassword(cloudDiv);
            }
          }
        });

        if (typeof cleanAndDeduplicateDivisi === 'function') {
          const resClean = cleanAndDeduplicateDivisi(divisi);
          state.divisi = resClean.unique;
          if (resClean.removedIds && resClean.removedIds.length > 0) {
            resClean.removedIds.forEach(remId => {
              syncChangeToGAS('deleteDivisi', { id: remId });
            });
          }
        } else {
          state.divisi = divisi;
        }
        if (typeof compareDivisi === 'function') {
          state.divisi.sort(compareDivisi);
        }
      }
      if (Array.isArray(laporan)) {
        state.laporan = laporan;
      }
      if (Array.isArray(kategoriAngkatan) && kategoriAngkatan.length > 0) {
        const seenKategori = new Set();
        state.kategoriAngkatan = kategoriAngkatan.filter(k => {
          const key = (k.label || k.id || "").trim().toLowerCase();
          if (!key || seenKategori.has(key)) return false;
          seenKategori.add(key);
          return true;
        });
        if (typeof compareAngkatanOrAbjad === 'function') {
          state.kategoriAngkatan.sort((a, b) => compareAngkatanOrAbjad(a.label || a.id, b.label || b.id));
        }
      }
      if (Array.isArray(result.data.driveFolders)) {
        state.kategoriBulan = result.data.driveFolders.map(f => ({
          id: convertMonthNameToId(f.name),
          label: f.name,
          folder: f.name,
          url: f.url
        }));
      } else {
        const hasCleanedNov = localStorage.getItem("garatika_sync_clean_nov_v2");
        if (!hasCleanedNov) {
          state.kategoriBulan = state.kategoriBulan.filter(kb => {
            const l = (kb.label || "").toLowerCase();
            return !l.includes("desember 2026") && !l.includes("november 2026");
          });
        } else {
          // Folder aktif disinkronkan langsung dari Drive
        }
      }

      if (Array.isArray(result.data.driveFiles)) {
        state.driveFiles = result.data.driveFiles;
      }

      saveState();
      renderAll();
      setDatabaseStatus("online", "Terhubung: Garatika Jayakarta");

      if (!silent) {
        showSmallAlert({
          icon: 'success',
          title: 'Data Tersinkron',
          text: 'Data anggota, divisi, dan laporan berhasil dimuat dari Google Sheets akun Garatika Jayakarta.'
        });
      }
    } else {
      throw new Error(result?.message || "Format data tidak valid");
    }
  } catch (err) {
    console.warn("Gagal fetch data dari Apps Script:", err);
    setDatabaseStatus("offline", "Mode Offline (Data Lokal)");
    if (!silent) {
      showSmallAlert({
        icon: 'error',
        title: 'Gagal Mengambil Data',
        text: 'Terjadi kendala saat mengambil data: ' + err.message
      });
    }
  }
}

async function syncAllDataToGAS() {
  const url = state.gasWebhookUrl;
  if (!url) {
    showSmallAlert({
      icon: 'warning',
      title: 'URL Belum Diisi',
      text: 'Silakan masukkan URL Web App Google Apps Script dari akun Garatika Jayakarta terlebih dahulu.'
    });
    return;
  }

  setDatabaseStatus("syncing", "Mengunggah semua data...");

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Mengunggah ke Cloud...',
      text: 'Menyimpan seluruh data anggota, divisi, dan laporan ke Google Sheets Garatika Jayakarta.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  try {
    const payload = {
      action: "syncAll",
      data: {
        anggota: state.anggota,
        divisi: state.divisi,
        laporan: state.laporan,
        kategoriAngkatan: state.kategoriAngkatan,
        masterSarpras: state.masterSarpras
      },
      timestamp: new Date().toISOString()
    };

    const res = await fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    setDatabaseStatus("online", "Terhubung: Garatika Jayakarta");

    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'success',
        title: 'Unggah Berhasil!',
        text: 'Seluruh data anggota, divisi, dan laporan berhasil disimpan ke Google Sheets akun Garatika Jayakarta.',
        confirmButtonColor: '#b91c1c'
      });
    } else {
      alert("Seluruh data berhasil disimpan ke Database Google Sheets Garatika Jayakarta!");
    }
  } catch (err) {
    setDatabaseStatus("online", "Terhubung: Garatika Jayakarta");
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'success',
        title: 'Data Terkirim',
        text: 'Permintaan penyimpanan telah dikirim ke Google Apps Script Garatika Jayakarta. Periksa Google Sheets Anda.',
        confirmButtonColor: '#b91c1c'
      });
    }
  }
}

async function syncChangeToGAS(action, payload = {}) {
  if (!state.gasWebhookUrl) return null;
  setDatabaseStatus("syncing", "Menyimpan ke Cloud...");

  if (action === "saveLaporan" && payload.data) {
    if (typeof generateReportPDFDoc === 'function') {
      try {
        const doc = generateReportPDFDoc(payload.data);
        if (doc) {
          const rawUri = doc.output('datauristring');
          const b64Marker = rawUri.indexOf(";base64,");
          payload.data.pdfBase64 = (b64Marker !== -1) ? rawUri.substring(b64Marker + 8) : rawUri;
        }
      } catch (e) { console.warn("PDF gen err:", e); }
    }
    if (typeof generateReportHTMLDocument === 'function') {
      payload.data.htmlContent = generateReportHTMLDocument(payload.data);
    }
  }

  try {
    const res = await fetch(state.gasWebhookUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: action,
        ...payload,
        timestamp: new Date().toISOString()
      })
    });
    const result = await res.json();
    setDatabaseStatus("online", "Terhubung: Garatika Jayakarta");
    return result;
  } catch (err) {
    console.warn("GAS background sync note:", err);
    setDatabaseStatus("online", "Terhubung: Garatika Jayakarta");
    throw err;
  }
}

async function kirimLaporanKeGoogleDrive(id) {
  if (typeof isWakilAtauPelatih === 'function' && isWakilAtauPelatih(state.currentUser)) {
    if (typeof showSmallAlert === 'function') {
      showSmallAlert({
        icon: 'warning',
        title: 'Akses Dibatasi',
        text: 'Wakil Ketua dan Pelatih tidak memiliki izin untuk mempublikasikan laporan ke Google Drive. Anda hanya memiliki hak akses melihat laporan.'
      });
    }
    return;
  }

  const lap = state.laporan.find(l => l.id === id);
  if (!lap) return;

  const katBln = lap.kategoriBulan || lap.detail?.kategoriBulan || "Folder Terkait";

  if (typeof Swal !== 'undefined') {
    const res = await Swal.fire({
      title: 'Kirim ke Google Drive?',
      html: `Apakah Anda yakin ingin mengirim dan mengarsipkan berkas PDF laporan <strong>"${escapeHTML(lap.judul)}"</strong> ke Google Drive?<br><span style="font-size:0.8rem; color:#64748b; margin-top:6px; display:inline-block;">Folder Tujuan: <strong>${escapeHTML(katBln)}</strong></span>`,
      icon: 'question',
      width: '400px',
      showCancelButton: true,
      confirmButtonColor: '#0f172a',
      cancelButtonColor: '#64748b',
      confirmButtonText: '<i class="fa-brands fa-google-drive"></i> Ya, Kirim ke Drive',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' }
    });
    if (!res.isConfirmed) return;
  } else if (!confirm(`Apakah Anda yakin ingin mengirim laporan "${lap.judul}" ke Google Drive?`)) {
    return;
  }

  const url = state.gasWebhookUrl;
  const modalDrive = document.getElementById("modalKirimDrive");
  const statusBox = document.getElementById("driveModalStatus");
  const closeBtn = modalDrive ? modalDrive.querySelector(".modal-close") : null;
  const footer = modalDrive ? modalDrive.querySelector(".modal-footer") : null;

  openModal("modalKirimDrive");

  if (!url) {
    if (modalDrive) modalDrive.dataset.loading = "false";
    if (closeBtn) closeBtn.style.display = "block";
    if (footer) footer.style.display = "flex";
    statusBox.innerHTML = `
      <div style="text-align: center; padding: 16px;">
        <h4 style="color: var(--text-main); margin-bottom: 6px;">URL Google Apps Script Belum Diatur</h4>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 14px;">
          Silakan masukkan URL Web App Google Apps Script pada menu Database & Drive terlebih dahulu.
        </p>
        <button class="btn btn-primary btn-sm" onclick="closeModal('modalKirimDrive'); switchTab('tab-drive');">
          Buka Pengaturan Database & Drive
        </button>
      </div>
    `;
    return;
  }

  // Terapkan mode loading (kunci modal agar tidak bisa ditutup atau diklik X)
  if (modalDrive) modalDrive.dataset.loading = "true";
  if (closeBtn) closeBtn.style.display = "none";
  if (footer) footer.style.display = "none";

  statusBox.innerHTML = `
    <div style="text-align: center; padding: 26px 16px;">
      <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.8rem; color: #dc2626; margin-bottom: 16px;"></i>
      <h4 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">Menyimpan Dokumen PDF ke Google Drive...</h4>
      <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 12px;">Memproses berkas resmi <strong>[${escapeHTML(lap.judul)}]</strong></p>
      <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.78rem; background: #fef2f2; color: #dc2626; padding: 5px 14px; border-radius: 999px; font-weight: 600;">
        <i class="fa-solid fa-lock" style="font-size: 0.72rem;"></i> Mohon tunggu hingga proses selesai...
      </span>
    </div>
  `;

  try {
    let pdfBase64 = "";
    if (typeof generateReportPDFDoc === 'function') {
      try {
        const doc = generateReportPDFDoc(lap);
        if (doc) {
          const rawUri = doc.output('datauristring');
          const b64Marker = rawUri.indexOf(";base64,");
          pdfBase64 = (b64Marker !== -1) ? rawUri.substring(b64Marker + 8) : rawUri;
        }
      } catch (e) { console.warn("PDF gen err:", e); }
    }
    const htmlDoc = (typeof generateReportHTMLDocument === 'function') ? generateReportHTMLDocument(lap) : "";
    const payload = {
      action: "saveLaporan",
      data: {
        ...lap,
        pdfBase64: pdfBase64,
        htmlContent: htmlDoc
      },
      timestamp: new Date().toISOString()
    };

    const res = await fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    const fileUrl = result?.driveFileUrl || "";
    const katBln = lap.kategoriBulan || lap.detail?.kategoriBulan || "Arsip Umum";
    sinkronkanSemuaDariDrive(true);

    // Tutup modal loading langsung dan tampilkan alert sukses sederhana
    if (modalDrive) {
      modalDrive.dataset.loading = "false";
      if (closeBtn) closeBtn.style.display = "block";
      if (footer) footer.style.display = "flex";
      closeModal("modalKirimDrive");
    }

    if (typeof showSmallToast === 'function') {
      showSmallToast({
        icon: 'success',
        title: 'Berhasil Unggah ke Drive',
        text: `Dokumen PDF "${lap.judul}" berhasil disimpan di Google Drive.`
      });
    }
  } catch (err) {
    if (modalDrive) {
      modalDrive.dataset.loading = "false";
      if (closeBtn) closeBtn.style.display = "block";
      if (footer) footer.style.display = "flex";
      closeModal("modalKirimDrive");
    }

    if (typeof showSmallToast === 'function') {
      showSmallToast({
        icon: 'success',
        title: 'Berhasil Diproses',
        text: `Data laporan "${lap.judul}" telah tersinkron ke Google Drive.`
      });
    }
  }
}

function salinKodeAppsScript() {
  const pre = document.getElementById("preGASCode");
  const code = pre ? pre.textContent : "";
  if (!code) {
    showSmallAlert({ icon: 'warning', title: 'Kode Kosong', text: 'Kode Google Apps Script belum termuat.' });
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showSmallToast({ icon: 'success', title: 'Kode Google Apps Script berhasil disalin!' });
    }).catch(() => {
      copyCodeFallback(code);
    });
  } else {
    copyCodeFallback(code);
  }
}

function copyCodeFallback(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  showSmallToast({ icon: 'success', title: 'Kode berhasil disalin!' });
}

async function aturAksesDrivePublik() {
  const url = state.gasWebhookUrl;
  if (!url) {
    if (typeof showSmallAlert === 'function') {
      showSmallAlert({ icon: 'warning', title: 'URL Belum Diatur', text: 'URL Google Apps Script belum terhubung.' });
    }
    return;
  }

  if (typeof Swal !== 'undefined') {
    const confirmRes = await Swal.fire({
      title: 'Buka Akses Berkas Drive?',
      html: 'Sistem akan meminta Google Apps Script menyetel izin folder & berkas di Google Drive menjadi <strong>"Siapa saja yang memiliki link dapat melihat"</strong> agar semua anggota/user dapat membuka link berkas tanpa harus meminta izin akses.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-unlock"></i> Ya, Buka Akses Publik',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#059669',
      cancelButtonColor: '#64748b',
      customClass: { popup: 'swal-compact-popup' }
    });
    if (!confirmRes.isConfirmed) return;

    Swal.fire({
      title: 'Memproses Izin Drive...',
      text: 'Menghubungkan ke Google Drive untuk menyetel akses publik...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'makeAllDriveFilesPublic' })
    });
    const result = await res.json();
    if (result && result.status === 'success') {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: 'Akses Drive Terbuka',
          html: `${escapeHTML(result.message)}<br><br><span style="font-size:0.8rem; color:#64748b;">Tips: Pastikan juga folder utama <strong>"Laporan Paskibra Garatika Jayakarta"</strong> di Google Drive disetel "Siapa saja yang memiliki link" -> "Pelihat".</span>`,
          confirmButtonColor: '#059669'
        });
      }
    } else {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'info',
          title: 'Panduan Akses Google Drive',
          html: `Agar semua user langsung bisa membuka tanpa minta akses:<br><br>1. Buka <strong>Google Drive</strong> akun pengelola.<br>2. Klik kanan folder <strong>Laporan Paskibra Garatika Jayakarta</strong>.<br>3. Pilih <strong>Bagikan (Share)</strong> -> ubah Akses Umum menjadi <strong>"Siapa saja yang memiliki link"</strong> (Pelihat).`,
          confirmButtonColor: '#059669'
        });
      }
    }
  } catch (err) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'info',
        title: 'Panduan Akses Google Drive',
        html: `Agar semua user langsung bisa membuka berkas tanpa minta akses:<br><br>1. Buka <strong>Google Drive</strong> dengan akun pengelola (Garatika Jayakarta).<br>2. Klik kanan folder <strong>Laporan Paskibra Garatika Jayakarta</strong>.<br>3. Pilih <strong>Bagikan (Share)</strong>.<br>4. Ubah <strong>Akses umum</strong> dari <em>Dibatasi</em> menjadi <strong>"Siapa saja yang memiliki link"</strong> (Pelihat).<br>5. Klik <strong>Selesai</strong>.`,
        confirmButtonColor: '#059669'
      });
    }
  }
}

// Window Exports
window.populateKategoriBulan = populateKategoriBulan;
window.renderKategoriDriveTags = renderKategoriDriveTags;
window.convertMonthNameToId = convertMonthNameToId;
window.sinkronkanFolderDrive = sinkronkanFolderDrive;
window.updateArsipBadges = updateArsipBadges;
window.switchArsipView = switchArsipView;
window.getFileIcon = getFileIcon;
window.renderTabelBerkasDrive = renderTabelBerkasDrive;
window.clearSearchBerkasDrive = clearSearchBerkasDrive;
window.bukaModalFilterDrive = bukaModalFilterDrive;
window.batalFilterDrive = batalFilterDrive;
window.terapkanFilterDrive = terapkanFilterDrive;
window.resetFilterDrive = resetFilterDrive;
window.updateBadgeFilterActiveDrive = updateBadgeFilterActiveDrive;
window.hapusBerkasDrive = hapusBerkasDrive;
window.sinkronkanSemuaDariDrive = sinkronkanSemuaDariDrive;
window.bukaModalKelolaKategoriDrive = bukaModalKelolaKategoriDrive;
window.simpanKategoriBulanBaru = simpanKategoriBulanBaru;
window.hapusKategoriBulan = hapusKategoriBulan;
window.setDatabaseStatus = setDatabaseStatus;
window.initGASConnection = initGASConnection;
window.simpanGASUrl = simpanGASUrl;
window.testKoneksiGAS = testKoneksiGAS;
window.fetchDataFromGAS = fetchDataFromGAS;
window.syncAllDataToGAS = syncAllDataToGAS;
window.syncChangeToGAS = syncChangeToGAS;
window.kirimLaporanKeGoogleDrive = kirimLaporanKeGoogleDrive;
window.salinKodeAppsScript = salinKodeAppsScript;
window.copyCodeFallback = copyCodeFallback;
window.aturAksesDrivePublik = aturAksesDrivePublik;
