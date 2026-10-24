/**
 * =========================================================================
 * MODUL 4: DASHBOARD & STATISTIK (dashboard.js)
 * SISTEM INFORMASI & LAPORAN PASKIBRA GARATIKA SMKN 40 JAKARTA
 * =========================================================================
 */

/* ==========================================================================
   4. RENDER DASHBOARD
   ========================================================================== */
function renderStatusReviewBadge(status) {
  return `<span class="badge" style="background: #dcfce7; color: #15803d; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-circle-check"></i> Terkirim</span>`;
}

function navigasiKePengurus() {
  switchTab('tab-pengurus');
}

function renderDashboard() {
  const elemAnggota = document.getElementById("statTotalAnggota");
  const elemDivisi = document.getElementById("statTotalDivisi");
  const elemPengurus = document.getElementById("statTotalPengurus");

  // Seluruh penghitungan mengikutsertakan Pelatih (karena Pelatih user resmi terdaftar)
  const totalAnggota = (state.anggota || []).filter(a => a.angkatan !== 'Senior').length;
  const totalDivisi = (state.divisi || []).length;
  const totalPengurus = (state.anggota || []).filter(a => {
    if (!a || a.angkatan === 'Senior') return false;
    const isPelatih = a.angkatan === 'Pelatih' || a.divisi === 'Pelatih' || a.divisiId === 'pelatih';
    if (isPelatih) return true;
    return Boolean(
      a.divisiId && a.divisiId !== 'anggota' && a.divisi && a.divisi !== 'Anggota' && a.divisi !== '-'
    );
  }).length;

  if (elemAnggota) elemAnggota.textContent = totalAnggota;
  if (elemDivisi) elemDivisi.textContent = totalDivisi;
  if (elemPengurus) elemPengurus.textContent = totalPengurus;

  const recentTableBody = document.getElementById("dashboardRecentLaporanBody");
  if (!recentTableBody) return;

  const recent = [...state.laporan].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 5);
  
  if (recent.length === 0) {
    recentTableBody.innerHTML = `<tr><td colspan="6" class="cell-empty-state" style="text-align:center; padding: 22px; color: var(--text-muted);"><i class="fa-regular fa-folder-open" style="font-size: 1.5rem; display: block; margin-bottom: 8px; color: #94a3b8;"></i>Belum ada laporan divisi yang tercatat.</td></tr>`;
    return;
  }

  const isReadOnly = (typeof isWakilAtauPelatih === 'function' && isWakilAtauPelatih(state.currentUser));

  recentTableBody.innerHTML = recent.map(lap => {
    const katBln = lap.kategoriBulan || lap.detail?.kategoriBulan || "";
    return `
    <tr>
      <td class="cell-date">
        <span class="text-date-full"><strong><i class="fa-regular fa-calendar-days mobile-only-icon"></i> ${(typeof formatHariTanggalIndo === 'function' ? formatHariTanggalIndo(lap.tanggal || lap.detail?.tanggalIndo) : formatTanggalLengkap(lap.tanggal))}</strong></span>
      </td>
      <td class="cell-title" style="min-width: 0; word-break: break-word; overflow-wrap: anywhere;">
        <strong class="report-title-text" style="word-break: break-word; overflow-wrap: anywhere;">${escapeHTML(lap.judul)}</strong>
        ${katBln ? `
        <div style="display: flex; gap: 4px; margin-top: 4px;">
          <span style="background: #e2e8f0; color: #334155; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 600; white-space: nowrap; display: inline-flex; align-items: center; gap: 5px;"><i class="fa-regular fa-calendar" style="font-size: 0.72rem; color: var(--accent-red); flex-shrink: 0;"></i> <span style="white-space: nowrap;">${escapeHTML(katBln)}</span></span>
        </div>` : ''}
      </td>
      <td class="cell-reporter">
        <span class="mobile-cell-label"><i class="fa-solid fa-user"></i> Pelapor:</span>
        <span class="cell-value-text">${escapeHTML(lap.pelapor)}</span>
      </td>
      <td class="cell-division">
        <span class="badge-divisi">${escapeHTML(lap.divisiNama)}</span>
        ${lap.detail?.angkatan ? `
        <div style="margin-top: 4px;">
          <span class="badge" style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 4px;">
            <i class="fa-solid fa-users" style="color: var(--accent-red); margin-right: 3px;"></i>${escapeHTML(lap.detail.angkatan)}
          </span>
        </div>` : ''}
      </td>
      <td class="cell-status">
        ${renderStatusReviewBadge(lap.statusReview)}
      </td>
      <td class="cell-actions" style="text-align: center;">
        <div class="action-btns" style="justify-content: center; gap: 6px;">
          <button type="button" class="btn-action-icon btn-view" onclick="bukaDetailLaporan('${lap.id}')" title="Lihat Rincian Laporan">
            <i class="fa-solid fa-eye"></i>
          </button>
          ${!isReadOnly ? `
          <button type="button" class="btn-action-icon btn-edit" onclick="editLaporan('${lap.id}')" title="Edit Laporan Ini">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          ` : ''}
          <button type="button" class="btn-action-icon btn-pdf" onclick="unduhLaporanPDF('${lap.id}')" title="Unduh Berkas PDF Resmi">
            <i class="fa-solid fa-file-pdf"></i>
          </button>
          ${lap.driveFileUrl ? `
            <a href="${escapeHTML(lap.driveFileUrl)}" target="_blank" class="btn-action-icon btn-drive" title="Lihat di Google Drive">
              <i class="fa-brands fa-google-drive"></i>
            </a>
          ` : (!isReadOnly ? `
            <button type="button" class="btn-action-icon btn-drive" onclick="kirimLaporanKeGoogleDrive('${lap.id}')" title="Kirim ke Google Drive">
              <i class="fa-brands fa-google-drive"></i>
            </button>
          ` : '')}
          ${!isReadOnly ? `
          <button type="button" class="btn-action-icon btn-delete" onclick="hapusLaporan('${lap.id}')" title="Hapus Laporan">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          ` : ''}
        </div>
      </td>
    </tr>
  `;
  }).join("");
}


// Window Exports
window.renderStatusReviewBadge = renderStatusReviewBadge;
window.navigasiKePengurus = navigasiKePengurus;
window.renderDashboard = renderDashboard;
