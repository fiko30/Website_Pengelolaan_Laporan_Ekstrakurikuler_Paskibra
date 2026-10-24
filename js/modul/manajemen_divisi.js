/**
 * =========================================================================
 * MODUL 7: MANAJEMEN DIVISI (manajemen_divisi.js)
 * SISTEM INFORMASI & LAPORAN PASKIBRA GARATIKA SMKN 40 JAKARTA
 * =========================================================================
 */


function populateDivisiDropdowns() {
  const filterSelect = document.getElementById("filterDivisiAnggota");
  const formSelect = document.getElementById("agtDivisi");
  if (!filterSelect && !formSelect) return;

  const currentFilterVal = filterSelect ? filterSelect.value : "";
  const currentFormVal = formSelect ? formSelect.value : "";

  if (filterSelect) {
    let optionsHTML = `<option value="">Semua Divisi</option>`;
    optionsHTML += `<option value="Anggota">Anggota</option>`;
    const sortedDivisi = [...state.divisi]
      .sort((a, b) => (typeof compareDivisi === 'function' ? compareDivisi(a, b) : a.nama.localeCompare(b.nama)));

    sortedDivisi.forEach(d => {
      optionsHTML += `<option value="${escapeHTML(d.nama)}">${escapeHTML(d.nama)}</option>`;
    });
    filterSelect.innerHTML = optionsHTML;
    filterSelect.value = currentFilterVal;
  }

  if (formSelect && formSelect.tagName === "SELECT") {
    let formOptionsHTML = `
      <optgroup label="Status Non-Divisi">
        <option value="Anggota" data-id="anggota">Anggota</option>
      </optgroup>
      <optgroup label="Divisi Kepengurusan">
    `;
    const sortedDivisi = [...state.divisi]
      .sort((a, b) => (typeof compareDivisi === 'function' ? compareDivisi(a, b) : a.nama.localeCompare(b.nama)));

    sortedDivisi.forEach(d => {
      formOptionsHTML += `<option value="${escapeHTML(d.nama)}" data-id="${d.id}">${escapeHTML(d.nama)}</option>`;
    });
    formOptionsHTML += `</optgroup>`;
    formSelect.innerHTML = formOptionsHTML;
    if (currentFormVal) {
      formSelect.value = currentFormVal;
    } else {
      formSelect.value = "Anggota";
    }
  }

  if (typeof populateDivisiPillButtons === "function") {
    populateDivisiPillButtons();
  }
}

/* ==========================================================================
   6. CRUD STRUKTUR DIVISI
   ========================================================================== */
function renderGridDivisi() {
  const container = document.getElementById("divisiContainerGrid");
  if (!container) return;

  // DEDUPLIKASI KETAT: Bersihkan duplikasi divisi sebelum render (hanya 1 divisi per nama)
  if (typeof cleanAndDeduplicateDivisi === 'function' && Array.isArray(state.divisi)) {
    const resClean = cleanAndDeduplicateDivisi(state.divisi);
    if (resClean.unique.length !== state.divisi.length || (resClean.removedIds && resClean.removedIds.length > 0)) {
      state.divisi = resClean.unique;
      saveState();
      if (resClean.removedIds && resClean.removedIds.length > 0) {
        resClean.removedIds.forEach(remId => {
          if (typeof syncChangeToGAS === 'function') {
            syncChangeToGAS('deleteDivisi', { id: remId });
          }
        });
      }
    }
  }

  const keyword = (document.getElementById("searchDivisi")?.value || "").toLowerCase().trim();
  const btnClear = document.getElementById("btnClearSearchDivisi");
  if (btnClear) {
    const hasText = Boolean(keyword);
    btnClear.classList.toggle("visible", hasText);
    btnClear.style.setProperty("display", hasText ? "inline-flex" : "none", "important");
  }

  // Pelatih diikutsertakan di daftar kartu divisi
  let listDivisi = [...state.divisi];

  if (typeof compareDivisi === 'function') {
    listDivisi.sort(compareDivisi);
  } else {
    listDivisi.sort((a, b) => a.nama.localeCompare(b.nama));
  }

  if (keyword) {
    listDivisi = listDivisi.filter(div => {
      const matchNama = div.nama.toLowerCase().includes(keyword);
      const isDivPelatih = div.id === 'pelatih' || div.nama.toLowerCase() === 'pelatih';
      const anggotaDiv = state.anggota.filter(a => 
        (a.divisi === div.nama || a.divisiId === div.id || (isDivPelatih && a.angkatan === 'Pelatih')) && 
        a.angkatan !== 'Senior'
      );
      const matchAnggota = anggotaDiv.some(a => a.nama.toLowerCase().includes(keyword));
      return matchNama || matchAnggota;
    });
  }

  if (listDivisi.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 36px 20px; color: var(--text-muted); background: #ffffff; border-radius: 12px; border: 1.5px dashed var(--border-medium);">
        <i class="fa-solid fa-sitemap" style="font-size: 2rem; display: block; margin-bottom: 10px; color: #94a3b8;"></i>
        <div style="font-size: 0.95rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Tidak Ada Divisi yang Ditemukan</div>
        <div style="font-size: 0.8rem; color: #64748b;">Tidak ada data divisi yang cocok dengan kata kunci "${escapeHTML(keyword)}".</div>
      </div>
    `;
    return;
  }

  const canManage = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : Boolean(state.currentUser && state.currentUser.canManagePasswords);
  let html = "";

  listDivisi.forEach(div => {
    const isDivPelatih = div.id === 'pelatih' || div.nama.toLowerCase() === 'pelatih';
    const anggotaDiv = state.anggota.filter(a => 
      (a.divisi === div.nama || a.divisiId === div.id || (isDivPelatih && a.angkatan === 'Pelatih')) && 
      a.angkatan !== 'Senior'
    );

    const isPimpinan = div.kategori === "pimpinan" || !div.bisaBuatLaporan;

    // Badges Personel
    let badgesHtml = "";
    if (anggotaDiv.length > 0) {
      badgesHtml = anggotaDiv.map(a => `
        <span class="badge-personel-pill" title="${escapeHTML(a.nama)} - ${escapeHTML(a.kelas)}">
          <i class="fa-solid fa-user"></i>
          <span>${escapeHTML(a.nama)}</span>
          <span class="badge-sub-info">(${escapeHTML(a.kelas)})</span>
        </span>
      `).join('');
    } else {
      badgesHtml = `<span style="color: #94a3b8; font-style: italic; font-size: 0.775rem;">Belum ada personel yang ditugaskan di divisi ini.</span>`;
    }

    // Password Info
    let passwordHtml = "";
    const divPass = (typeof getDivisiPassword === 'function') ? getDivisiPassword(div) : (div.password || "Garatika40");

    if (canManage) {
      passwordHtml = `
        <div class="divisi-password-box">
          <div>
            <span style="font-size: 0.7rem; color: #64748b; font-weight: 600; display: block; text-transform: uppercase;">Password Login:</span>
            <span id="passSpan_${div.id}" data-pass="${escapeHTML(divPass)}" data-masked="true" style="font-family: monospace; font-size: 0.825rem; font-weight: 700; color: #0f172a;">••••••••</span>
          </div>
          <button type="button" class="btn-icon-subtle" onclick="event.stopPropagation(); toggleCardPassword('${div.id}')" title="Lihat / Sembunyikan Password" style="background: none; border: none; cursor: pointer; color: #64748b; padding: 4px; font-size: 0.9rem;">
            <i class="fa-solid fa-eye-slash" id="eyeIconCard_${div.id}"></i>
          </button>
        </div>
      `;
    } else {
      passwordHtml = `
        <div class="divisi-password-box" style="justify-content: flex-start; gap: 8px;">
          <i class="fa-solid fa-lock" style="font-size: 0.75rem; color: #94a3b8;"></i>
          <span style="font-size: 0.75rem; color: #64748b; font-style: italic;">Password diatur oleh Pelatih / Ketua / Wakil</span>
        </div>
      `;
    }

    html += `
      <div class="divisi-card">
        <div>
          <div class="divisi-card-header">
            <div class="divisi-title-wrap" style="flex:1;">
              <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: 0;">
                ${escapeHTML(div.nama)}
              </h3>
            </div>
            <span style="background: #f1f5f9; color: #334155; padding: 3px 8px; border-radius: 20px; font-size: 0.725rem; font-weight: 700; white-space: nowrap;">
              <i class="fa-solid fa-users" style="margin-right: 4px; color: var(--accent-red);"></i>${anggotaDiv.length} Personel
            </span>
          </div>

          <div class="divisi-card-body">
            <div style="margin-bottom: 12px;">
              <div style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-id-badge" style="color: var(--accent-red);"></i> Daftar Nama Personel:
              </div>
              <div class="divisi-personel-badges">
                ${badgesHtml}
              </div>
            </div>

            ${passwordHtml}
          </div>
        </div>

        <div class="divisi-actions">
          <button type="button" class="btn-divisi-action btn-action-detail" onclick="event.stopPropagation(); lihatDetailDivisi('${div.id}')" title="Lihat Detail Lengkap Divisi" aria-label="Detail">
            <i class="fa-solid fa-circle-info"></i>
            <span class="btn-action-label">Detail</span>
          </button>
          <button type="button" class="btn-divisi-action btn-action-edit" onclick="event.stopPropagation(); editDivisi('${div.id}')" title="Edit Divisi dan Password" aria-label="Edit">
            <i class="fa-solid fa-pen-to-square"></i>
            <span class="btn-action-label">Edit</span>
          </button>
          <button type="button" class="btn-divisi-action btn-divisi-delete" onclick="event.stopPropagation(); hapusDivisi('${div.id}')" title="Hapus Divisi" aria-label="Hapus">
            <i class="fa-solid fa-trash-can"></i>
            <span class="btn-action-label">Hapus</span>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function clearSearchDivisi() {
  const searchInput = document.getElementById("searchDivisi");
  const btnClear = document.getElementById("btnClearSearchDivisi");
  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
  }
  if (btnClear) {
    btnClear.classList.remove("visible");
    btnClear.style.setProperty("display", "none", "important");
  }
  renderGridDivisi();
}

function lihatDetailDivisi(id) {
  const div = state.divisi.find(d => d.id === id);
  if (!div) return;

  const isDivPelatih = div.id === 'pelatih' || div.nama.toLowerCase() === 'pelatih';
  const anggotaDiv = (state.anggota || []).filter(a => 
    (a.divisi === div.nama || a.divisiId === div.id || (isDivPelatih && a.angkatan === 'Pelatih')) &&
    a.angkatan !== 'Senior'
  );

  const isPimpinan = div.kategori === 'pimpinan' || !div.bisaBuatLaporan;
  const canManage = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : Boolean(state.currentUser?.canManagePasswords);

  const title = document.getElementById("detailDivisiNama");
  const content = document.getElementById("detailDivisiContent");
  const btnBuka = document.getElementById("btnDetailBukaPengurus");

  if (title) title.textContent = `Detail: ${div.nama}`;

  let anggotaListHtml = "";
  if (anggotaDiv.length > 0) {
    anggotaListHtml = anggotaDiv.map((a, idx) => `
      <li style="padding: 10px 12px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; background: #ffffff; border-radius: 8px; margin-bottom: 8px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <i class="fa-solid fa-user" style="color: var(--accent-red); font-size: 0.825rem;"></i>
          <strong style="color: #0f172a; font-size: 0.875rem;">${escapeHTML(a.nama)}</strong>
        </div>
        <span style="color: #475569; font-size: 0.76rem; background: #f1f5f9; padding: 3px 10px; border-radius: 5px; font-weight: 600;">
          ${escapeHTML(a.kelas)} (${escapeHTML(a.angkatan)})
        </span>
      </li>
    `).join('');
  } else {
    anggotaListHtml = `<li style="color: #94a3b8; padding: 12px; text-align: center; font-style: italic; font-size: 0.82rem;">Belum ada personel yang ditugaskan di divisi ini.</li>`;
  }

  // Password detail jika berhak
  let passwordDetailHtml = "";
  if (canManage) {
    const divPass = (typeof getDivisiPassword === 'function') ? getDivisiPassword(div) : (div.password || "Garatika40");
    passwordDetailHtml = `
      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 3px;">Password Login Divisi:</div>
          <span id="detailPassSpan" data-pass="${escapeHTML(divPass)}" data-masked="true" style="font-family: monospace; font-size: 0.95rem; font-weight: 700; color: #0f172a;">••••••••</span>
        </div>
        <button type="button" class="btn-icon-subtle" onclick="toggleDetailPasswordMask()" title="Lihat / Sembunyikan Password" style="background: none; border: none; cursor: pointer; color: #64748b; padding: 6px; font-size: 1rem;">
          <i class="fa-solid fa-eye-slash" id="eyeIconDetailPass"></i>
        </button>
      </div>
    `;
  }

  if (content) {
    content.innerHTML = `
      <div style="margin-bottom: 14px; display: flex; align-items: center; justify-content: flex-end;">
        <span style="font-size: 0.8rem; font-weight: 700; color: #334155; background: #f1f5f9; padding: 4px 12px; border-radius: 20px;">
          <i class="fa-solid fa-users" style="color: var(--accent-red); margin-right: 5px;"></i>${anggotaDiv.length} Personel Terdaftar
        </span>
      </div>

      <div style="margin-bottom: 16px;">
        <div style="font-size: 0.74rem; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 5px;">
          <i class="fa-solid fa-id-badge" style="color: var(--accent-red);"></i> Daftar Personel (${anggotaDiv.length}):
        </div>
        <ul style="list-style: none; padding: 0; margin: 0; max-height: 220px; overflow-y: auto;">
          ${anggotaListHtml}
        </ul>
      </div>

      ${passwordDetailHtml}
    `;
  }

  if (btnBuka) {
    btnBuka.onclick = () => {
      closeModal('modalDetailDivisi');
      if (typeof bukaPengurusPerDivisi === 'function') {
        bukaPengurusPerDivisi(div.nama);
      }
    };
  }

  openModal('modalDetailDivisi');
}

function toggleDetailPasswordMask() {
  const span = document.getElementById("detailPassSpan");
  const icon = document.getElementById("eyeIconDetailPass");
  if (!span) return;

  const rawPass = span.getAttribute("data-pass") || (typeof getDivisiPassword === 'function' ? getDivisiPassword() : "Garatika40");
  const isMasked = span.getAttribute("data-masked") !== "false";
  if (isMasked) {
    span.textContent = rawPass;
    span.setAttribute("data-masked", "false");
    if (icon) icon.className = "fa-solid fa-eye";
  } else {
    span.textContent = "••••••••";
    span.setAttribute("data-masked", "true");
    if (icon) icon.className = "fa-solid fa-eye-slash";
  }
}

function toggleCardPassword(divId) {
  const span = document.getElementById(`passSpan_${divId}`);
  const icon = document.getElementById(`eyeIconCard_${divId}`);
  if (!span) return;

  const rawPass = span.getAttribute("data-pass") || (typeof getDivisiPassword === 'function' ? getDivisiPassword(divId) : "Garatika40");
  const isMasked = span.getAttribute("data-masked") !== "false";
  if (isMasked) {
    span.textContent = rawPass;
    span.setAttribute("data-masked", "false");
    if (icon) icon.className = "fa-solid fa-eye";
  } else {
    span.textContent = "••••••••";
    span.setAttribute("data-masked", "true");
    if (icon) icon.className = "fa-solid fa-eye-slash";
  }
}

function toggleVisibilityDivPassword(e) {
  if (e) {
    if (typeof e.preventDefault === "function") e.preventDefault();
    if (typeof e.stopPropagation === "function") e.stopPropagation();
  }
  const passInput = document.getElementById("divPassword");
  const eyeIcon = document.getElementById("eyeIconDivPassword");
  if (!passInput) return;

  const isPassword = passInput.type === "password" || passInput.getAttribute("type") === "password";
  if (isPassword) {
    passInput.type = "text";
    passInput.setAttribute("type", "text");
    if (eyeIcon) eyeIcon.className = "fa-solid fa-eye";
  } else {
    passInput.type = "password";
    passInput.setAttribute("type", "password");
    if (eyeIcon) eyeIcon.className = "fa-solid fa-eye-slash";
  }
}

function renderInfoDaftarNamaDivisi(div) {
  const group = document.getElementById("groupDivDaftarNamaInfo");
  const container = document.getElementById("divInfoDaftarNamaContainer");
  if (!group || !container) return;

  if (!div) {
    group.style.display = "none";
    container.innerHTML = "";
    return;
  }

  const isDivPelatih = div.id === 'pelatih' || div.nama.toLowerCase() === 'pelatih';
  const anggotaDiv = (state.anggota || []).filter(a => 
    (a.divisi === div.nama || a.divisiId === div.id || (isDivPelatih && a.angkatan === 'Pelatih')) && 
    a.angkatan !== 'Senior'
  );

  if (anggotaDiv.length > 0) {
    container.innerHTML = anggotaDiv.map(a => `
      <span class="badge-personel-pill">
        <i class="fa-solid fa-user"></i>
        <span>${escapeHTML(a.nama)}</span>
        <span class="badge-sub-info">(${escapeHTML(a.kelas)})</span>
      </span>
    `).join('');
  } else {
    container.innerHTML = `<span style="color: #94a3b8; font-style: italic; font-size: 0.775rem;">Belum ada anggota yang ditugaskan ke divisi ini melalui Data Anggota.</span>`;
  }
  group.style.display = "block";
}

function bukaModalTambahDivisi() {
  const title = document.getElementById("modalDivisiTitle");
  if (title) title.textContent = "Tambah Divisi";

  const form = document.getElementById("formDivisi");
  if (form) form.reset();

  document.getElementById("divisiIdInput").value = "";
  document.getElementById("divNama").value = "";

  const passInput = document.getElementById("divPassword");
  const passNotice = document.getElementById("divPasswordRestrictedNotice");
  const canManage = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : Boolean(state.currentUser?.canManagePasswords);

  if (passInput) {
    passInput.value = "";
    passInput.setAttribute("type", "password");
    passInput.disabled = !canManage;
    passInput.readOnly = !canManage;
    passInput.required = canManage;
  }
  const eyeIcon = document.getElementById("eyeIconDivPassword");
  if (eyeIcon) {
    eyeIcon.className = "fa-solid fa-eye-slash";
  }
  if (passNotice) {
    passNotice.style.display = canManage ? "none" : "block";
  }

  renderInfoDaftarNamaDivisi(null);
  openModal("modalDivisi");
}

function editDivisi(id) {
  const div = state.divisi.find(d => d.id === id);
  if (!div) return;

  const title = document.getElementById("modalDivisiTitle");
  if (title) title.textContent = `Edit Divisi: ${div.nama}`;

  document.getElementById("divisiIdInput").value = div.id;
  document.getElementById("divNama").value = div.nama;

  const passInput = document.getElementById("divPassword");
  const passNotice = document.getElementById("divPasswordRestrictedNotice");
  const canManage = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : Boolean(state.currentUser?.canManagePasswords);

  if (passInput) {
    passInput.value = (typeof getDivisiPassword === 'function') ? getDivisiPassword(div) : (div.password || "");
    passInput.setAttribute("type", "password");
    passInput.disabled = !canManage;
    passInput.readOnly = !canManage;
    passInput.required = canManage;
  }
  const eyeIconEdit = document.getElementById("eyeIconDivPassword");
  if (eyeIconEdit) {
    eyeIconEdit.className = "fa-solid fa-eye-slash";
  }
  if (passNotice) {
    passNotice.style.display = canManage ? "none" : "block";
  }

  // Tampilkan daftar nama personel yang ada di divisi ini (hanya info)
  renderInfoDaftarNamaDivisi(div);
  openModal("modalDivisi");
}

function simpanDivisi(e) {
  e.preventDefault();
  const id = document.getElementById("divisiIdInput").value;
  const nama = document.getElementById("divNama").value.trim();
  const passInput = document.getElementById("divPassword");
  const passwordVal = passInput ? passInput.value : "";
  const canManage = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : Boolean(state.currentUser?.canManagePasswords);

  if (!nama) {
    alert("Nama Divisi tidak boleh kosong.");
    return;
  }

  // VALIDASI KETAT: Setiap nama divisi hanya boleh ada 1 (tidak boleh ada 2 divisi dengan nama sama)
  const namaLower = nama.toLowerCase();
  const isDuplicate = state.divisi.some(d => d.id !== id && d.nama.trim().toLowerCase() === namaLower);
  if (isDuplicate) {
    if (typeof showSmallAlert === "function") {
      showSmallAlert({
        icon: 'warning',
        title: 'Nama Divisi Sudah Ada',
        text: `Divisi dengan nama "${nama}" sudah terdaftar di sistem. Setiap nama divisi hanya boleh ada 1 dan tidak boleh ganda.`
      });
    } else {
      alert(`Divisi dengan nama "${nama}" sudah terdaftar di sistem. Setiap nama divisi hanya boleh ada 1 dan tidak boleh ganda.`);
    }
    return;
  }

  const isEdit = Boolean(id);
  const existingDiv = isEdit ? state.divisi.find(d => d.id === id) : null;

  // Password yang akan disimpan (tidak boleh kosong & selalu prioritaskan input baru user)
  let finalPassword = "";
  const fallbackPass = (typeof getDivisiPassword === 'function') 
    ? getDivisiPassword(existingDiv || { id, nama }) 
    : `${nama.replace(/\s+/g, '')}Garatika40`;

  if (passwordVal && passwordVal.trim().length > 0) {
    finalPassword = passwordVal.trim();
  } else if (existingDiv && existingDiv.password && existingDiv.password.trim()) {
    finalPassword = existingDiv.password.trim();
  } else {
    finalPassword = fallbackPass;
  }

  const actionTitle = isEdit ? 'Simpan Perubahan Divisi?' : 'Tambah Divisi Baru?';
  const actionText = isEdit 
    ? `Apakah Anda yakin ingin menyimpan perubahan untuk divisi "${nama}"?`
    : `Apakah Anda yakin ingin menambahkan divisi "${nama}" baru?`;

  const doSave = () => {
    let targetDivId = id;
    let savedDiv = null;

    if (isEdit) {
      const idx = state.divisi.findIndex(d => d.id === id);
      if (idx !== -1) {
        const oldNama = state.divisi[idx].nama;
        state.divisi[idx].nama = nama;
        state.divisi[idx].password = finalPassword;
        savedDiv = state.divisi[idx];
        targetDivId = state.divisi[idx].id;

        // Kunci ke penyimpanan kustom agar permanen dan tidak tereset oleh sinkronisasi cloud
        if (typeof saveCustomPassword === 'function') {
          saveCustomPassword(targetDivId, finalPassword);
          saveCustomPassword(nama, finalPassword);
          if (oldNama && oldNama !== nama) saveCustomPassword(oldNama, finalPassword);
        }

        // Jika nama divisi berubah, sinkronkan nama divisi di anggota, user aktif, dan riwayat laporan
        if (oldNama !== nama) {
          state.anggota.forEach(a => {
            if (a.divisiId === targetDivId || a.divisi === oldNama) {
              a.divisi = nama;
            }
          });

          // Sinkronkan juga pada sesi user yang sedang login jika termasuk divisi ini
          if (state.currentUser && (state.currentUser.divisiId === targetDivId || state.currentUser.divisi === oldNama)) {
            state.currentUser.divisi = nama;
            localStorage.setItem("garatika_auth_user", JSON.stringify(state.currentUser));
          }

          // Sinkronkan nama divisi pada data laporan yang sudah tersimpan
          if (Array.isArray(state.laporan)) {
            state.laporan.forEach(l => {
              if (l.divisiId === targetDivId || l.divisiNama === oldNama) {
                l.divisiNama = nama;
              }
            });
          }
        }

        // Jika divisi ketua, sinkronkan KREDENSIAL_KETUA
        if (targetDivId === 'ketua' && typeof KREDENSIAL_KETUA !== 'undefined') {
          KREDENSIAL_KETUA.password = finalPassword;
        }
      }
    } else {
      targetDivId = "div_" + Date.now();
      const newDiv = {
        id: targetDivId,
        nama: nama,
        kategori: "divisi",
        password: finalPassword,
        bisaBuatLaporan: true
      };
      state.divisi.push(newDiv);
      savedDiv = newDiv;

      if (typeof saveCustomPassword === 'function') {
        saveCustomPassword(targetDivId, finalPassword);
        saveCustomPassword(nama, finalPassword);
      }
    }

    if (typeof compareDivisi === 'function') {
      state.divisi.sort(compareDivisi);
    }

    saveState();
    if (savedDiv) syncChangeToGAS('saveDivisi', { data: savedDiv });

    closeModal("modalDivisi");
    renderGridDivisi();
    populateDivisiDropdowns();
    if (typeof renderTabelAnggota === 'function') renderTabelAnggota();
    if (typeof renderTabelPengurus === 'function') renderTabelPengurus();
    if (typeof renderDashboard === 'function') renderDashboard();


    showSmallToast({ 
      icon: 'success', 
      title: isEdit ? 'Data Divisi Disimpan' : 'Divisi Berhasil Ditambahkan',
      text: isEdit ? `Perubahan divisi "${nama}" berhasil disimpan.` : `Divisi "${nama}" telah berhasil ditambahkan.` 
    });
  };

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: actionTitle,
      text: actionText,
      icon: 'question',
      width: '340px',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: isEdit ? 'Ya, Simpan' : 'Ya, Tambahkan',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' }
    }).then((result) => {
      if (result.isConfirmed) doSave();
    });
  } else if (confirm(actionText)) {
    doSave();
  }
}

function hapusDivisi(id) {
  const div = state.divisi.find(d => d.id === id);
  if (!div) return;

  const namaLower = (div.nama || "").trim().toLowerCase();
  const sameNameCount = state.divisi.filter(d => (d.nama || "").trim().toLowerCase() === namaLower).length;

  // Hanya tolak hapus jika struktur utama dan TIDAK ada duplikasi nama (hanya 1)
  if (sameNameCount <= 1 && (['pelatih', 'ketua', 'wakil_ketua'].includes(id) || ['pelatih', 'ketua', 'wakil ketua'].includes(namaLower))) {
    if (typeof showSmallToast === 'function') {
      showSmallToast({
        icon: 'warning',
        title: 'Tidak Bisa Dihapus',
        text: `Divisi ${div.nama} merupakan struktur utama organisasi dan tidak dapat dihapus.`
      });
    } else {
      alert(`Divisi ${div.nama} merupakan struktur utama organisasi dan tidak dapat dihapus.`);
    }
    return;
  }

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Hapus Divisi?',
      text: `Apakah Anda yakin ingin menghapus divisi "${div.nama}"? Anggota di divisi ini akan dikembalikan ke status Anggota.`,
      icon: 'warning',
      width: '340px',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' }
    }).then((result) => {
      if (result.isConfirmed) {
        // Kembalikan anggota ke Anggota
        state.anggota.forEach(a => {
          if (a.divisiId === id || a.divisi === div.nama) {
            a.divisi = "Anggota";
            a.divisiId = "anggota";
          }
        });

        state.divisi = state.divisi.filter(d => d.id !== id);
        saveState();
        syncChangeToGAS('deleteDivisi', { id: id });
        renderGridDivisi();
        populateDivisiDropdowns();
        if (typeof renderTabelAnggota === 'function') renderTabelAnggota();
        if (typeof renderTabelPengurus === 'function') renderTabelPengurus();
        if (typeof renderDashboard === 'function') renderDashboard();
        showSmallToast({
          icon: 'success',
          title: 'Divisi Berhasil Dihapus',
          text: `Divisi "${div.nama}" telah dihapus.`
        });
      }
    });
  } else if (confirm(`Apakah Anda yakin ingin menghapus divisi "${div.nama}"?`)) {
    state.anggota.forEach(a => {
      if (a.divisiId === id || a.divisi === div.nama) {
        a.divisi = "Anggota";
        a.divisiId = "anggota";
      }
    });
    state.divisi = state.divisi.filter(d => d.id !== id);
    saveState();
    syncChangeToGAS('deleteDivisi', { id: id });
    renderGridDivisi();
    populateDivisiDropdowns();
    if (typeof renderTabelAnggota === 'function') renderTabelAnggota();
    if (typeof renderTabelPengurus === 'function') renderTabelPengurus();
    if (typeof renderDashboard === 'function') renderDashboard();
  }
}

function bukaLaporanUntukDivisi(divisiId) {
  switchTab("tab-buat-laporan");
  const radio = document.querySelector(`input[name="divisiReport"][value="${divisiId}"]`);
  if (radio) {
    radio.checked = true;
    updateRadioLabelStyles();
    renderDynamicReportFields(divisiId);
  }
}

// Window Exports
window.populateDivisiDropdowns = populateDivisiDropdowns;
window.renderGridDivisi = renderGridDivisi;
window.clearSearchDivisi = clearSearchDivisi;
window.lihatDetailDivisi = lihatDetailDivisi;
window.toggleDetailPasswordMask = toggleDetailPasswordMask;
window.toggleCardPassword = toggleCardPassword;
window.toggleVisibilityDivPassword = toggleVisibilityDivPassword;
window.renderInfoDaftarNamaDivisi = renderInfoDaftarNamaDivisi;
window.bukaModalTambahDivisi = bukaModalTambahDivisi;
window.editDivisi = editDivisi;
window.simpanDivisi = simpanDivisi;
window.hapusDivisi = hapusDivisi;
window.bukaLaporanUntukDivisi = bukaLaporanUntukDivisi;


