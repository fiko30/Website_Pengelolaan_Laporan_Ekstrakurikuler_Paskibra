/**
 * =========================================================================
 * MODUL 5: MANAJEMEN ANGGOTA (manajemen_anggota.js)
 * SISTEM INFORMASI & LAPORAN PASKIBRA GARATIKA SMKN 40 JAKARTA
 * =========================================================================
 */

/* ==========================================================================
   DROPDOWN FILTER KELAS OTOMATIS (HANYA KELAS YANG TERDAFTAR)
   ========================================================================== */
function populateKelasFilter() {
  const filterSelect = document.getElementById("filterKelasAnggota");
  if (!filterSelect) return;
  const currentVal = filterSelect.value;

  // Hanya ambil kelas unik yang benar-benar ada pada anggota yang terdaftar
  const registeredClasses = [];
  (state.anggota || []).forEach(a => {
    const k = (a.kelas || "").trim();
    if (k && k !== "-" && k !== "Pelatih" && k !== "Alumni" && !registeredClasses.includes(k)) {
      registeredClasses.push(k);
    }
  });

  registeredClasses.sort((a, b) => {
    if (typeof compareAngkatanOrAbjad === 'function') {
      return compareAngkatanOrAbjad(a, b);
    }
    return a.localeCompare(b, undefined, { numeric: true });
  });

  let html = `<option value="">Semua Kelas</option>`;
  registeredClasses.forEach(cls => {
    html += `<option value="${escapeHTML(cls)}">${escapeHTML(cls)}</option>`;
  });

  filterSelect.innerHTML = html;
  if (currentVal && registeredClasses.includes(currentVal)) {
    filterSelect.value = currentVal;
  }
}

/* ==========================================================================
   5. CRUD DATA ANGGOTA (POP-UP FILTER & LIVE SEARCH KOMBO)
   ========================================================================== */
let activeFilterAngkatan = "";
let activeFilterTingkat = "";
let activeFilterJurusan = "";
let tempPopupAngkatan = "";
let tempPopupTingkat = "";
let tempPopupJurusan = "";

function clearSearchAnggota() {
  const searchInput = document.getElementById("searchAnggota");
  const clearBtn = document.getElementById("btnClearSearchAnggota");
  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
  }
  if (clearBtn) {
    clearBtn.classList.remove("visible");
    clearBtn.style.setProperty("display", "none", "important");
  }
  renderTabelAnggota();
}

function renderFilterAngkatanAnggotaPills() {
  const grid = document.getElementById("popupFilterAngkatanGrid");
  if (!grid) return;
  const sorted = [...(state.kategoriAngkatan || [])].sort((a, b) => {
    if (typeof compareAngkatanOrAbjad === 'function') {
      return compareAngkatanOrAbjad(a.label || a.id, b.label || b.id);
    }
    return (a.label || a.id || "").localeCompare(b.label || b.id || "", undefined, { numeric: true });
  });

  let html = `<button type="button" class="filter-pill-btn ${!tempPopupAngkatan ? 'active' : ''}" onclick="pilihPopupAngkatanAnggotaBtn('')">Semua Angkatan</button>`;
  sorted.forEach(k => {
    const val = k.id || k.label;
    const lbl = k.label || k.id;
    const isActive = (tempPopupAngkatan === val);
    html += `<button type="button" class="filter-pill-btn ${isActive ? 'active' : ''}" onclick="pilihPopupAngkatanAnggotaBtn('${escapeHTML(val)}')">${escapeHTML(lbl)}</button>`;
  });
  grid.innerHTML = html;
}

function pilihPopupAngkatanAnggotaBtn(val) {
  tempPopupAngkatan = val;
  const grid = document.getElementById("popupFilterAngkatanGrid");
  if (grid) {
    grid.querySelectorAll(".filter-pill-btn").forEach(btn => {
      const btnVal = btn.getAttribute("onclick") || "";
      const match = (!val && btnVal.includes("''")) || (val && btnVal.includes(`'${val}'`));
      btn.classList.toggle("active", Boolean(match));
    });
  }

  const groupKelas = document.getElementById("groupPopupFilterKelas");
  const containerJurusan = document.getElementById("containerPopupJurusan");

  if (val === "Pelatih") {
    if (groupKelas) groupKelas.style.display = "none";
    if (containerJurusan) containerJurusan.style.display = "none";
    tempPopupTingkat = "";
    tempPopupJurusan = "";
    highlightPopupTingkatAnggotaBtn("");
    highlightPopupJurusanBtn("");
  } else {
    if (groupKelas) groupKelas.style.display = "block";
  }
}

function highlightPopupTingkatAnggotaBtn(tingkat) {
  const grid = document.getElementById("popupFilterTingkatGrid");
  if (!grid) return;
  grid.querySelectorAll(".filter-pill-btn").forEach(btn => {
    const text = btn.textContent.trim();
    if (!tingkat && text.toLowerCase().includes("semua")) {
      btn.classList.add("active");
    } else if (tingkat && text.endsWith(tingkat)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function pilihPopupTingkatAnggotaBtn(val) {
  tempPopupTingkat = val;
  highlightPopupTingkatAnggotaBtn(val);

  const containerJurusan = document.getElementById("containerPopupJurusan");
  if (val === "X" || val === "XI" || val === "XII") {
    if (containerJurusan) {
      containerJurusan.style.display = "block";
    }
    highlightPopupJurusanBtn(tempPopupJurusan);
  } else {
    if (containerJurusan) {
      containerJurusan.style.display = "none";
    }
    tempPopupJurusan = "";
    highlightPopupJurusanBtn("");
  }
}

function bukaModalFilterAnggota() {
  populateKategoriDropdowns();

  tempPopupAngkatan = activeFilterAngkatan;
  tempPopupTingkat = activeFilterTingkat;
  tempPopupJurusan = activeFilterJurusan;

  renderFilterAngkatanAnggotaPills();
  highlightPopupTingkatAnggotaBtn(tempPopupTingkat);

  const groupKelas = document.getElementById("groupPopupFilterKelas");
  const containerJurusan = document.getElementById("containerPopupJurusan");

  if (activeFilterAngkatan === "Pelatih") {
    if (groupKelas) groupKelas.style.display = "none";
    if (containerJurusan) containerJurusan.style.display = "none";
  } else {
    if (groupKelas) groupKelas.style.display = "block";
    if (activeFilterTingkat) {
      if (containerJurusan) containerJurusan.style.display = "block";
      highlightPopupJurusanBtn(tempPopupJurusan);
    } else {
      if (containerJurusan) containerJurusan.style.display = "none";
      highlightPopupJurusanBtn("");
    }
  }

  openModal("modalFilterAnggota");
}

function handlePopupFilterAngkatanChange() {
  pilihPopupAngkatanAnggotaBtn(tempPopupAngkatan);
}

function handlePopupFilterTingkatChange() {
  pilihPopupTingkatAnggotaBtn(tempPopupTingkat);
}

function pilihPopupJurusanBtn(jurusan) {
  tempPopupJurusan = jurusan;
  highlightPopupJurusanBtn(jurusan);
}

function highlightPopupJurusanBtn(jurusan) {
  const grid = document.getElementById("popupJurusanBtnGrid");
  if (!grid) return;
  const buttons = grid.querySelectorAll(".btn-jurusan-pill");
  buttons.forEach(btn => {
    const text = btn.textContent.trim();
    if (!jurusan && text === "Semua Jurusan") {
      btn.classList.add("active");
    } else if (jurusan && text === jurusan) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function batalFilterAnggota() {
  closeModal("modalFilterAnggota");
}

function terapkanFilterAnggota() {
  activeFilterAngkatan = tempPopupAngkatan || "";
  activeFilterTingkat = tempPopupTingkat || "";
  activeFilterJurusan = tempPopupJurusan || "";

  updateBadgeFilterActive();
  closeModal("modalFilterAnggota");
  renderTabelAnggota();
}

function resetFilterAnggota() {
  const searchInput = document.getElementById("searchAnggota");
  const clearBtn = document.getElementById("btnClearSearchAnggota");
  if (searchInput) searchInput.value = "";
  if (clearBtn) {
    clearBtn.classList.remove("visible");
    clearBtn.style.setProperty("display", "none", "important");
  }

  activeFilterAngkatan = "";
  activeFilterTingkat = "";
  activeFilterJurusan = "";
  tempPopupAngkatan = "";
  tempPopupTingkat = "";
  tempPopupJurusan = "";

  updateBadgeFilterActive();

  // Animasi icon putar
  const btnReset = document.getElementById("btnResetFilterAnggota");
  const icon = btnReset ? btnReset.querySelector("i") : null;
  if (icon) {
    icon.classList.add("fa-spin");
    setTimeout(() => icon.classList.remove("fa-spin"), 400);
  }

  renderTabelAnggota();

  if (typeof showSmallToast === "function") {
    showSmallToast({
      icon: 'success',
      title: 'Filter & Data Direset',
      text: 'Menampilkan seluruh anggota Garatika.'
    });
  }
}

function updateBadgeFilterActive() {
  const badge = document.getElementById("badgeFilterActive");
  const btn = document.getElementById("btnBukaModalFilter");
  const isFiltered = Boolean(activeFilterAngkatan || activeFilterTingkat || activeFilterJurusan);
  if (badge) badge.style.display = isFiltered ? "block" : "none";
  if (btn) btn.classList.toggle("is-active", isFiltered);
}

function renderTabelAnggota() {
  const tbody = document.getElementById("tabelAnggotaBody");
  if (!tbody) return;

  const rawKeyword = document.getElementById("searchAnggota")?.value || "";
  const keyword = rawKeyword.toLowerCase().trim();

  // Kontrol tampilan tombol 'X' merah pembersih search input
  const clearBtn = document.getElementById("btnClearSearchAnggota");
  if (clearBtn) {
    const hasText = rawKeyword.trim().length > 0;
    clearBtn.classList.toggle("visible", hasText);
    clearBtn.style.setProperty("display", hasText ? "inline-flex" : "none", "important");
  }

  // Kombinasi filter pop up dan live search bekerja bersamaan (AND logic) tanpa saling reset
  let filtered = (state.anggota || []).filter(item => {
    const namaText = (item.nama || "").toLowerCase();
    const kelasText = (item.kelas || "").toLowerCase();
    const angkatanText = (item.angkatan || "").toLowerCase();

    const matchKeyword = !keyword || namaText.includes(keyword);

    const matchAngkatan = !activeFilterAngkatan || item.angkatan === activeFilterAngkatan;

    let matchKelas = true;
    if (activeFilterAngkatan === "Pelatih") {
      matchKelas = true;
    } else if (activeFilterTingkat) {
      const cleanKelas = (item.kelas || "").trim();
      let tingkatItem = "";
      if (cleanKelas.startsWith("XII")) tingkatItem = "XII";
      else if (cleanKelas.startsWith("XI")) tingkatItem = "XI";
      else if (cleanKelas.startsWith("X")) tingkatItem = "X";

      if (tingkatItem !== activeFilterTingkat) {
        matchKelas = false;
      } else if (activeFilterJurusan) {
        const normKelas = cleanKelas.toUpperCase().replace(/\s+/g, '');
        const normJurusan = activeFilterJurusan.toUpperCase().replace(/\s+/g, '');
        if (normJurusan === 'AK' && normKelas.includes('AKL')) {
          matchKelas = true;
        } else {
          matchKelas = normKelas.includes(normJurusan);
        }
      }
    }

    return matchKeyword && matchAngkatan && matchKelas;
  });

  if (typeof compareAnggota === 'function') {
    filtered.sort(compareAnggota);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="cell-empty-state" style="text-align: center; padding: 28px 16px; color: var(--text-muted);"><i class="fa-solid fa-users-slash" style="font-size: 1.8rem; display: block; margin-bottom: 10px; color: #94a3b8;"></i>Data anggota tidak ditemukan dengan kriteria pencarian dan filter yang dipilih.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((agt, idx) => `
    <tr>
      <td class="cell-no">${idx + 1}</td>
      <td class="cell-name"><strong class="member-name-text">${escapeHTML(agt.nama)}</strong></td>
      <td class="cell-class">
        <span class="mobile-cell-label"><i class="fa-solid fa-graduation-cap"></i> Kelas:</span>
        <span class="cell-value-text">${escapeHTML(agt.kelas)}</span>
      </td>
      <td class="cell-angkatan"><span class="badge-angkatan">${escapeHTML(agt.angkatan)}</span></td>
      <td class="cell-actions" style="text-align: center;">
        <div class="action-btns" style="justify-content: center;">
          <button class="btn-action-icon btn-edit" onclick="editAnggota('${agt.id}')" title="Edit Anggota">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-action-icon btn-delete" onclick="hapusAnggota('${agt.id}')" title="Hapus Anggota">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}


/* ==========================================================================
   DROPDOWNS & KATEGORI ANGKATAN
   ========================================================================== */
function populateKategoriDropdowns() {
  const filterAnggota = document.getElementById("filterAngkatan");
  const popupFilterAnggota = document.getElementById("popupFilterAngkatan");
  const filterPengurus = document.getElementById("filterAngkatanPengurus");
  const agtAngkatan = document.getElementById("agtAngkatan");

  const curFilterAnggota = filterAnggota ? filterAnggota.value : "";
  const curPopupFilterAnggota = popupFilterAnggota ? popupFilterAnggota.value : "";
  const curFilterPengurus = filterPengurus ? filterPengurus.value : "";
  const curAgtAngkatan = agtAngkatan ? agtAngkatan.value : "";

  const sortedKategori = [...(state.kategoriAngkatan || [])].sort((a, b) => {
    if (typeof compareAngkatanOrAbjad === 'function') {
      return compareAngkatanOrAbjad(a.label || a.id, b.label || b.id);
    }
    return (a.label || a.id || "").localeCompare(b.label || b.id || "", undefined, { numeric: true });
  });

  if (filterAnggota) {
    let html = '<option value="">Semua Angkatan</option>';
    sortedKategori.forEach(k => {
      html += `<option value="${escapeHTML(k.id)}">${escapeHTML(k.label)}</option>`;
    });
    filterAnggota.innerHTML = html;
    if (curFilterAnggota) filterAnggota.value = curFilterAnggota;
  }

  if (popupFilterAnggota) {
    let html = '<option value="">Semua Angkatan</option>';
    sortedKategori.forEach(k => {
      html += `<option value="${escapeHTML(k.id)}">${escapeHTML(k.label)}</option>`;
    });
    popupFilterAnggota.innerHTML = html;
    if (curPopupFilterAnggota) {
      popupFilterAnggota.value = curPopupFilterAnggota;
    } else if (activeFilterAngkatan) {
      popupFilterAnggota.value = activeFilterAngkatan;
    }
  }

  if (filterPengurus) {
    let html = '<option value="">Semua Angkatan</option>';
    sortedKategori
      .forEach(k => {
        html += `<option value="${escapeHTML(k.id)}">${escapeHTML(k.label)}</option>`;
      });
    filterPengurus.innerHTML = html;
    if (curFilterPengurus) filterPengurus.value = curFilterPengurus;
  }

  if (agtAngkatan) {
    let html = '<option value="" disabled selected>Pilih Angkatan Garatika</option>';
    sortedKategori.forEach(k => {
      html += `<option value="${escapeHTML(k.id)}">${escapeHTML(k.label)}</option>`;
    });
    agtAngkatan.innerHTML = html;
    if (curAgtAngkatan) {
      agtAngkatan.value = curAgtAngkatan;
    } else {
      agtAngkatan.value = "";
    }
  }
}


function renderListKategoriAngkatan() {
  const container = document.getElementById("listKategoriAngkatanContainer");
  const countSpan = document.getElementById("countKategoriAngkatan");
  if (!container) return;

  const list = [...(state.kategoriAngkatan || [])].sort((a, b) => {
    if (typeof compareAngkatanOrAbjad === 'function') {
      return compareAngkatanOrAbjad(a.label || a.id, b.label || b.id);
    }
    return (a.label || a.id || "").localeCompare(b.label || b.id || "", undefined, { numeric: true });
  });

  if (countSpan) countSpan.textContent = list.length;

  if (list.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 16px;">Belum ada kategori angkatan.</div>`;
    return;
  }

  container.innerHTML = list.map(k => {
    const isPelatih = k.id === 'Pelatih' || k.label === 'Pelatih';
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #ffffff; border: 1px solid var(--border-light); border-radius: 8px;">
        <div style="display: flex; align-items: center;">
          <span style="color: #0f172a; font-size: 0.875rem; font-weight: 600;">${escapeHTML(k.label)}</span>
        </div>
        <div>
          ${isPelatih ? `
            <span style="font-size: 0.72rem; color: #94a3b8; font-style: italic; padding: 4px 8px;">Bawaan Sistem</span>
          ` : `
            <button type="button" class="btn btn-outline-red btn-sm" onclick="hapusKategoriAngkatan('${escapeHTML(k.id)}')" style="font-size: 0.85rem; padding: 4px 10px;" title="Hapus Kategori">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          `}
        </div>
      </div>
    `;
  }).join("");
}

function bukaModalTambahKategori() {
  const form = document.getElementById("formTambahKategori");
  if (form) form.reset();
  renderListKategoriAngkatan();
  openModal("modalTambahKategori");
  setTimeout(() => {
    document.getElementById("inputKategoriBaru")?.focus();
  }, 100);
}

function simpanKategoriBaru(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const input = document.getElementById("inputKategoriBaru");
  const rawVal = input ? input.value.trim() : "";
  if (!rawVal) return;

  const cleanVal = rawVal.replace(/^Angkatan\s+/i, "").trim() || rawVal.trim();
  const label = cleanVal;
  const id = cleanVal;

  const exists = state.kategoriAngkatan.some(k => 
    (k.label || "").toLowerCase() === cleanVal.toLowerCase() || 
    (k.id || "").toLowerCase() === cleanVal.toLowerCase()
  );

  if (exists) {
    showSmallAlert({
      icon: 'warning',
      title: 'Kategori Sudah Ada',
      text: `Kategori "${cleanVal}" sudah terdaftar di sistem.`
    });
    return;
  }

  const doSaveKategori = () => {
    state.kategoriAngkatan.push({ id, label });
    if (typeof compareAngkatanOrAbjad === 'function') {
      state.kategoriAngkatan.sort((a, b) => compareAngkatanOrAbjad(a.label || a.id, b.label || b.id));
    }
    saveState();
    syncChangeToGAS('saveKategoriAngkatan', { data: { id, label } });
    populateKategoriDropdowns();
    renderListKategoriAngkatan();
    if (input) input.value = "";

    showSmallToast({
      icon: 'success',
      title: 'Kategori Ditambahkan',
      text: `Kategori "${label}" telah berhasil disimpan ke sistem.`
    });
  };

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Tambah Kategori?',
      text: `Apakah Anda yakin ingin menambahkan "${label}" sebagai kategori baru?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Tambahkan',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' }
    }).then((result) => {
      if (result.isConfirmed) doSaveKategori();
    });
  } else if (confirm(`Apakah Anda yakin ingin menambahkan "${label}" sebagai kategori baru?`)) {
    doSaveKategori();
  }
}

function hapusKategoriAngkatan(id) {
  if (state.kategoriAngkatan.length <= 1) {
    showSmallAlert({
      icon: 'warning',
      title: 'Tidak Bisa Dihapus',
      text: 'Minimal harus ada 1 kategori tersisa di sistem.'
    });
    return;
  }

  const target = state.kategoriAngkatan.find(k => k.id === id);
  if (!target) return;

  const countDipakai = state.anggota.filter(a => a.angkatan === target.id || a.angkatan === target.label).length;

  const doHapus = () => {
    state.kategoriAngkatan = state.kategoriAngkatan.filter(k => k.id !== id);
    saveState();
    syncChangeToGAS('deleteKategoriAngkatan', { id: id });
    populateKategoriDropdowns();
    renderListKategoriAngkatan();

    showSmallToast({
      icon: 'success',
      title: 'Kategori Dihapus',
      text: `Kategori "${target.label}" berhasil dihapus dari sistem.`
    });
  };

  const warningText = countDipakai > 0 
    ? `Kategori "${target.label}" saat ini digunakan oleh ${countDipakai} anggota. Apakah Anda tetap yakin ingin menghapusnya?`
    : `Apakah Anda yakin ingin menghapus kategori "${target.label}"?`;

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Hapus Kategori?',
      text: warningText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' }
    }).then((result) => {
      if (result.isConfirmed) doHapus();
    });
  } else if (confirm(warningText)) {
    doHapus();
  }
}



const JURUSAN_LIST = ["AK", "BR", "MP", "DKV 1", "DKV 2", "RPL"];
let selectedJurusanBtn = "";
let selectedDivisiBtn = "";

function handleAngkatanChange() {
  const angkatanSelect = document.getElementById("agtAngkatan");
  const groupKelas = document.getElementById("groupInputKelas");
  const hiddenInputKelas = document.getElementById("agtKelas");
  const tingkatSelect = document.getElementById("agtTingkatKelas");
  const containerJurusan = document.getElementById("containerPilihanJurusan");

  const groupDivisi = document.getElementById("groupInputDivisi");
  const statusDivisiSelect = document.getElementById("agtStatusDivisi");
  const containerDivisi = document.getElementById("containerPilihanDivisi");
  const hiddenInputDivisi = document.getElementById("agtDivisi");

  if (!angkatanSelect) return;
  const val = angkatanSelect.value;

  if (val === "Pelatih") {
    // Pelatih: sembunyikan kelas dan divisi
    if (groupKelas) groupKelas.style.display = "none";
    if (tingkatSelect) {
      tingkatSelect.value = "";
      tingkatSelect.removeAttribute("required");
    }
    if (containerJurusan) containerJurusan.style.display = "none";
    selectedJurusanBtn = "";
    highlightJurusanBtn("");
    if (hiddenInputKelas) hiddenInputKelas.value = "-";

    if (groupDivisi) groupDivisi.style.display = "none";
    if (statusDivisiSelect) statusDivisiSelect.value = "";
    if (containerDivisi) containerDivisi.style.display = "none";
    selectedDivisiBtn = "";
    highlightDivisiBtn("");
    if (hiddenInputDivisi) hiddenInputDivisi.value = "Pelatih";

  } else if (val) {
    // Angkatan siswa aktif (G9, G10, G11, dst.)
    if (groupKelas) groupKelas.style.display = "block";
    if (tingkatSelect) tingkatSelect.setAttribute("required", "required");
    if (hiddenInputKelas && hiddenInputKelas.value === "-") hiddenInputKelas.value = "";
    handleTingkatKelasChange();

    if (groupDivisi) groupDivisi.style.display = "block";
    if (hiddenInputDivisi && hiddenInputDivisi.value === "Pelatih") {
      hiddenInputDivisi.value = "";
      if (statusDivisiSelect) statusDivisiSelect.value = "";
      if (containerDivisi) containerDivisi.style.display = "none";
      selectedDivisiBtn = "";
      highlightDivisiBtn("");
    }
  } else {
    // Angkatan belum dipilih (text placeholder aktif)
    if (groupKelas) groupKelas.style.display = "none";
    if (tingkatSelect) {
      tingkatSelect.value = "";
      tingkatSelect.removeAttribute("required");
    }
    if (containerJurusan) containerJurusan.style.display = "none";
    selectedJurusanBtn = "";
    highlightJurusanBtn("");
    if (hiddenInputKelas) hiddenInputKelas.value = "";

    if (groupDivisi) groupDivisi.style.display = "block";
    if (statusDivisiSelect) statusDivisiSelect.value = "";
    if (containerDivisi) containerDivisi.style.display = "none";
    selectedDivisiBtn = "";
    highlightDivisiBtn("");
    if (hiddenInputDivisi) hiddenInputDivisi.value = "";
  }
}

function handleTingkatKelasChange() {
  const tingkatSelect = document.getElementById("agtTingkatKelas");
  const container = document.getElementById("containerPilihanJurusan");
  const hiddenInput = document.getElementById("agtKelas");
  if (!tingkatSelect) return;

  const tingkat = tingkatSelect.value;
  if (tingkat === "X" || tingkat === "XI" || tingkat === "XII") {
    if (container) {
      container.style.display = "block";
    }
    if (selectedJurusanBtn) {
      highlightJurusanBtn(selectedJurusanBtn);
      if (hiddenInput) hiddenInput.value = `${tingkat} - ${selectedJurusanBtn}`;
    } else {
      if (hiddenInput) hiddenInput.value = "";
    }
  } else {
    if (container) {
      container.style.display = "none";
    }
    selectedJurusanBtn = "";
    highlightJurusanBtn("");
    if (hiddenInput) hiddenInput.value = "";
  }
}

function pilihJurusanBtn(jurusan) {
  selectedJurusanBtn = jurusan;
  highlightJurusanBtn(jurusan);
  updateAgtKelasValue();
}

function highlightJurusanBtn(jurusan) {
  const grid = document.getElementById("jurusanBtnGrid");
  if (!grid) return;
  const buttons = grid.querySelectorAll(".btn-jurusan-pill");
  buttons.forEach(btn => {
    if (btn.textContent.trim() === jurusan) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function updateAgtKelasValue() {
  const angkatanSelect = document.getElementById("agtAngkatan");
  const tingkatSelect = document.getElementById("agtTingkatKelas");
  const hiddenInput = document.getElementById("agtKelas");
  if (!hiddenInput) return;

  if (angkatanSelect && angkatanSelect.value === "Pelatih") {
    hiddenInput.value = "-";
    return;
  }

  if (!tingkatSelect) return;
  const tingkat = tingkatSelect.value;
  if ((tingkat === "X" || tingkat === "XI" || tingkat === "XII") && selectedJurusanBtn) {
    hiddenInput.value = `${tingkat} - ${selectedJurusanBtn}`;
  } else {
    hiddenInput.value = "";
  }
}

/* ==========================================================================
   PILIHAN STATUS DIVISI (NON-DIVISI VS DIVISI)
   ========================================================================== */
function updateActiveDivisiBadge(namaDivisi) {
  const badgeBox = document.getElementById("activeDivisiInfoBadge");
  const badgeText = document.getElementById("activeDivisiBadgeText");
  const badgeTag = document.getElementById("activeDivisiBadgeTag");
  if (!badgeBox || !badgeText) return;

  if (namaDivisi && namaDivisi !== "Anggota" && namaDivisi !== "-") {
    badgeBox.style.display = "block";
    badgeText.textContent = namaDivisi;
    if (badgeTag) {
      badgeTag.innerHTML = '<i class="fa-solid fa-check"></i> Terpilih';
      badgeTag.style.background = "#ecfdf5";
      badgeTag.style.color = "#047857";
      badgeTag.style.borderColor = "#a7f3d0";
    }
  } else {
    badgeBox.style.display = "none";
    badgeText.textContent = "-";
  }
}

function handleStatusDivisiChange() {
  const statusSelect = document.getElementById("agtStatusDivisi");
  const container = document.getElementById("containerPilihanDivisi");
  const hiddenInput = document.getElementById("agtDivisi");
  if (!statusSelect) return;

  const status = statusSelect.value;
  if (status === "Non-Divisi") {
    if (container) container.style.display = "none";
    selectedDivisiBtn = "";
    highlightDivisiBtn("");
    updateActiveDivisiBadge("");
    if (hiddenInput) hiddenInput.value = "Anggota";
  } else if (status === "Divisi") {
    if (container) container.style.display = "block";
    populateDivisiPillButtons();
    if (selectedDivisiBtn) {
      highlightDivisiBtn(selectedDivisiBtn);
      if (hiddenInput) hiddenInput.value = selectedDivisiBtn;
      updateActiveDivisiBadge(selectedDivisiBtn);
    } else {
      if (hiddenInput) hiddenInput.value = "";
      updateActiveDivisiBadge("");
    }
  } else {
    if (container) container.style.display = "none";
    selectedDivisiBtn = "";
    highlightDivisiBtn("");
    updateActiveDivisiBadge("");
    if (hiddenInput) hiddenInput.value = "";
  }
}

function pilihDivisiBtn(namaDivisi, divisiId = "") {
  selectedDivisiBtn = namaDivisi;
  highlightDivisiBtn(namaDivisi, divisiId);
  const hiddenInput = document.getElementById("agtDivisi");
  if (hiddenInput) hiddenInput.value = namaDivisi;
  updateActiveDivisiBadge(namaDivisi);
}

function highlightDivisiBtn(namaDivisi, divisiId = "") {
  const grid = document.getElementById("divisiBtnGrid");
  if (!grid) return;
  const buttons = grid.querySelectorAll(".btn-divisi-pill");
  buttons.forEach(btn => {
    const btnDivisi = btn.getAttribute("data-divisi") || "";
    const btnId = btn.getAttribute("data-id") || "";
    const matchesName = Boolean(namaDivisi && (
      btnDivisi === namaDivisi || 
      (typeof isSameDivisi === 'function' && isSameDivisi(btnDivisi, namaDivisi))
    ));
    const matchesId = Boolean(divisiId && btnId === divisiId);

    if (matchesName || matchesId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  updateActiveDivisiBadge(namaDivisi);
}

function populateDivisiPillButtons() {
  const grid = document.getElementById("divisiBtnGrid");
  if (!grid) return;

  const listDivisi = [...(state.divisi || [])]
    .sort((a, b) => (typeof compareDivisi === 'function' ? compareDivisi(a, b) : a.nama.localeCompare(b.nama)));

  grid.innerHTML = listDivisi.map(d => {
    const isAct = Boolean(selectedDivisiBtn && (
      selectedDivisiBtn === d.nama || 
      (typeof isSameDivisi === 'function' && isSameDivisi(selectedDivisiBtn, d.nama))
    ));
    return `
      <button type="button" 
              class="btn-divisi-pill ${isAct ? 'active' : ''}" 
              data-divisi="${escapeHTML(d.nama)}"
              data-id="${escapeHTML(d.id || '')}"
              onclick="pilihDivisiBtn('${escapeHTML(d.nama)}', '${escapeHTML(d.id || '')}')">
        ${escapeHTML(d.nama)}
      </button>
    `;
  }).join("");
}

/* ==========================================================================
   CRUD ANGGOTA
   ========================================================================== */
function bukaModalTambahAnggota() {
  document.getElementById("modalAnggotaTitle").textContent = "Tambah Anggota";
  document.getElementById("formAnggota").reset();
  document.getElementById("anggotaId").value = "";

  populateKategoriDropdowns();
  populateDivisiDropdowns();

  // 1. Angkatan: Awalnya ada teks 'Pilih Angkatan Garatika'
  const angkatanSelect = document.getElementById("agtAngkatan");
  if (angkatanSelect) angkatanSelect.value = "";

  // 2. Kelas: Awalnya ada teks 'Pilih Tingkat Kelas'
  const groupKelas = document.getElementById("groupInputKelas");
  const tingkatSelect = document.getElementById("agtTingkatKelas");
  const containerJurusan = document.getElementById("containerPilihanJurusan");
  const hiddenInputKelas = document.getElementById("agtKelas");

  if (groupKelas) groupKelas.style.display = "none";
  if (tingkatSelect) {
    tingkatSelect.value = "";
    tingkatSelect.removeAttribute("required");
  }
  if (containerJurusan) containerJurusan.style.display = "none";
  selectedJurusanBtn = "";
  highlightJurusanBtn("");
  if (hiddenInputKelas) hiddenInputKelas.value = "";

  // 3. Divisi: Awalnya ada teks 'Pilih Status Divisi'
  const groupDivisi = document.getElementById("groupInputDivisi");
  const statusDivisiSelect = document.getElementById("agtStatusDivisi");
  const containerDivisi = document.getElementById("containerPilihanDivisi");
  const hiddenInputDivisi = document.getElementById("agtDivisi");

  if (groupDivisi) groupDivisi.style.display = "block";
  if (statusDivisiSelect) statusDivisiSelect.value = "";
  if (containerDivisi) containerDivisi.style.display = "none";
  selectedDivisiBtn = "";
  highlightDivisiBtn("");
  updateActiveDivisiBadge("");
  if (hiddenInputDivisi) hiddenInputDivisi.value = "";

  openModal("modalAnggota");
}

function editAnggota(id) {
  const agt = state.anggota.find(a => a.id === id);
  if (!agt) return;

  document.getElementById("modalAnggotaTitle").textContent = "Edit Data Anggota";
  document.getElementById("anggotaId").value = agt.id;
  document.getElementById("agtNama").value = agt.nama;

  populateKategoriDropdowns();
  const angkatanSelect = document.getElementById("agtAngkatan");
  if (angkatanSelect) angkatanSelect.value = agt.angkatan;

  const groupKelas = document.getElementById("groupInputKelas");
  const tingkatSelect = document.getElementById("agtTingkatKelas");
  const containerJurusan = document.getElementById("containerPilihanJurusan");
  const hiddenInputKelas = document.getElementById("agtKelas");

  const groupDivisi = document.getElementById("groupInputDivisi");
  const statusDivisiSelect = document.getElementById("agtStatusDivisi");
  const containerDivisi = document.getElementById("containerPilihanDivisi");
  const hiddenInputDivisi = document.getElementById("agtDivisi");

  selectedJurusanBtn = "";
  selectedDivisiBtn = "";

  const isPelatih = agt.angkatan === "Pelatih" || agt.divisi === "Pelatih";

  if (isPelatih) {
    if (groupKelas) groupKelas.style.display = "none";
    if (tingkatSelect) {
      tingkatSelect.value = "";
      tingkatSelect.removeAttribute("required");
    }
    if (containerJurusan) containerJurusan.style.display = "none";
    highlightJurusanBtn("");
    if (hiddenInputKelas) hiddenInputKelas.value = "-";

    if (groupDivisi) groupDivisi.style.display = "none";
    if (statusDivisiSelect) statusDivisiSelect.value = "";
    if (containerDivisi) containerDivisi.style.display = "none";
    if (hiddenInputDivisi) hiddenInputDivisi.value = "Pelatih";
  } else {
    // Set Kelas
    if (groupKelas) groupKelas.style.display = "block";
    if (tingkatSelect) tingkatSelect.setAttribute("required", "required");
    const k = (agt.kelas || "").trim();

    if (k.includes(" - ")) {
      const parts = k.split(" - ");
      const t = parts[0].trim();
      const j = parts[1].trim();
      if (tingkatSelect) tingkatSelect.value = t;
      selectedJurusanBtn = j;
      if (containerJurusan) containerJurusan.style.display = "block";
      highlightJurusanBtn(j);
      if (hiddenInputKelas) hiddenInputKelas.value = k;
    } else if (k && k !== "-") {
      let t = "";
      if (k.startsWith("XII")) t = "XII";
      else if (k.startsWith("XI")) t = "XI";
      else if (k.startsWith("X")) t = "X";

      if (tingkatSelect) tingkatSelect.value = t;
      if (t) {
        if (containerJurusan) containerJurusan.style.display = "block";
        const foundJurusan = JURUSAN_LIST.find(jur => k.toUpperCase().includes(jur.replace(/\s+/g, '')));
        if (foundJurusan) {
          selectedJurusanBtn = foundJurusan;
          highlightJurusanBtn(foundJurusan);
          if (hiddenInputKelas) hiddenInputKelas.value = `${t} - ${foundJurusan}`;
        }
      }
    } else {
      if (tingkatSelect) tingkatSelect.value = "";
      if (containerJurusan) containerJurusan.style.display = "none";
      highlightJurusanBtn("");
      if (hiddenInputKelas) hiddenInputKelas.value = "";
    }

    // Set Divisi
    if (groupDivisi) groupDivisi.style.display = "block";
    const matchedDiv = typeof findDivisiForAnggota === 'function' ? findDivisiForAnggota(agt) : null;
    const rawDiv = (agt.divisi || "").trim();

    if (matchedDiv) {
      if (statusDivisiSelect) statusDivisiSelect.value = "Divisi";
      selectedDivisiBtn = matchedDiv.nama;
      populateDivisiPillButtons();
      if (containerDivisi) containerDivisi.style.display = "block";
      highlightDivisiBtn(matchedDiv.nama, matchedDiv.id);
      if (hiddenInputDivisi) hiddenInputDivisi.value = matchedDiv.nama;
      updateActiveDivisiBadge(matchedDiv.nama);
    } else if (rawDiv && rawDiv !== "Anggota" && rawDiv !== "-") {
      if (statusDivisiSelect) statusDivisiSelect.value = "Divisi";
      selectedDivisiBtn = rawDiv;
      populateDivisiPillButtons();
      if (containerDivisi) containerDivisi.style.display = "block";
      highlightDivisiBtn(rawDiv);
      if (hiddenInputDivisi) hiddenInputDivisi.value = rawDiv;
      updateActiveDivisiBadge(rawDiv);
    } else {
      if (statusDivisiSelect) statusDivisiSelect.value = "Non-Divisi";
      if (containerDivisi) containerDivisi.style.display = "none";
      selectedDivisiBtn = "";
      highlightDivisiBtn("");
      if (hiddenInputDivisi) hiddenInputDivisi.value = "Anggota";
      updateActiveDivisiBadge("");
    }
  }

  openModal("modalAnggota");
}

function simpanAnggota(e) {
  e.preventDefault();
  updateAgtKelasValue();
  const id = document.getElementById("anggotaId").value;
  const nama = document.getElementById("agtNama").value.trim();
  const angkatan = document.getElementById("agtAngkatan").value;
  let kelas = (document.getElementById("agtKelas")?.value || "").trim();
  const divisi = document.getElementById("agtDivisi").value;
  const status = "Aktif";

  if (!angkatan) {
    showSmallToast({
      icon: 'warning',
      title: 'Pilih Angkatan',
      text: 'Silakan pilih angkatan Garatika terlebih dahulu.'
    });
    return;
  }

  const isPelatih = angkatan === "Pelatih" || divisi === "Pelatih";
  if (isPelatih) {
    kelas = "-";
  } else if (!kelas || kelas === "-") {
    showSmallToast({
      icon: 'warning',
      title: 'Pilih Kelas & Jurusan',
      text: 'Silakan pilih tingkat kelas dan jurusan terlebih dahulu.'
    });
    return;
  }

  // VALIDASI KETAT: Setiap nama anggota hanya boleh 1 (tidak boleh ada 2 anggota dengan nama sama)
  const namaLower = nama.toLowerCase();
  const isDuplicateNama = state.anggota.some(a => a.id !== id && a.nama.trim().toLowerCase() === namaLower);
  if (isDuplicateNama) {
    showSmallAlert({
      icon: 'warning',
      title: 'Nama Anggota Sudah Terdaftar',
      text: `Anggota dengan nama "${nama}" sudah terdaftar di sistem. Setiap nama anggota hanya boleh ada 1 dan tidak boleh ganda.`
    });
    return;
  }

  const isEdit = Boolean(id);
  const actionTitle = isEdit ? 'Simpan Perubahan Anggota?' : 'Tambah Anggota Baru?';
  const actionText = isEdit 
    ? `Apakah Anda yakin ingin menyimpan perubahan data untuk "${nama}"?`
    : `Apakah Anda yakin ingin menambahkan "${nama}" sebagai anggota baru?`;

  const doSave = () => {
    const matchedDivisi = typeof findDivisiForAnggota === 'function' 
      ? findDivisiForAnggota({ divisi, angkatan }) 
      : (state.divisi || []).find(d => d.nama === divisi || (typeof isSameDivisi === 'function' && isSameDivisi(d.nama, divisi)));

    let divisiId = "anggota";
    let finalDivisi = divisi;

    if (divisi === "Pelatih" || angkatan === "Pelatih") {
      divisiId = "pelatih";
      finalDivisi = "Pelatih";
    } else if (matchedDivisi) {
      divisiId = matchedDivisi.id;
      finalDivisi = matchedDivisi.nama;
    } else if (divisi && divisi !== "Anggota" && divisi !== "-") {
      divisiId = divisi.toLowerCase().replace(/\s+/g, '_');
      finalDivisi = divisi;
    } else {
      finalDivisi = "Anggota";
      divisiId = "anggota";
    }

    let savedItem = null;

    if (id) {
      const index = state.anggota.findIndex(a => a.id === id);
      if (index !== -1) {
        state.anggota[index] = {
          ...state.anggota[index],
          nama,
          kelas,
          angkatan,
          divisi: finalDivisi,
          divisiId,
          status
        };
        savedItem = state.anggota[index];
      }
    } else {
      const newAnggota = {
        id: "agt-" + Date.now(),
        nama,
        kelas,
        angkatan,
        divisi: finalDivisi,
        divisiId,
        status: "Aktif"
      };
      state.anggota.push(newAnggota);
      savedItem = newAnggota;
    }

    if (typeof compareAnggota === 'function') {
      state.anggota.sort(compareAnggota);
    }

    saveState();
    if (savedItem) syncChangeToGAS('saveAnggota', { data: savedItem });

    closeModal("modalAnggota");
    populateKelasFilter();
    renderTabelAnggota();
    renderTabelPengurus();
    renderGridDivisi();
    renderDashboard();
    if (typeof refreshTabelAbsensiSekretaris === 'function') {
      refreshTabelAbsensiSekretaris();
    }
    showSmallToast({ 
      icon: 'success', 
      title: isEdit ? 'Data Anggota Disimpan' : 'Anggota Berhasil Ditambahkan',
      text: isEdit ? `Perubahan data "${nama}" berhasil disimpan.` : `"${nama}" telah berhasil ditambahkan.` 
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

function hapusAnggota(id) {
  const agt = state.anggota.find(a => a.id === id);
  if (!agt) return;

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Hapus Anggota?',
      text: `Apakah Anda yakin ingin menghapus ${agt.nama}?`,
      icon: 'warning',
      width: '320px',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' }
    }).then((result) => {
      if (result.isConfirmed) {
        state.anggota = state.anggota.filter(a => a.id !== id);
        saveState();
        syncChangeToGAS('deleteAnggota', { id: id });
        populateKelasFilter();
        renderTabelAnggota();
        renderDashboard();
        if (typeof refreshTabelAbsensiSekretaris === 'function') {
          refreshTabelAbsensiSekretaris();
        }
        showSmallToast({ 
          icon: 'success', 
          title: 'Anggota Berhasil Dihapus', 
          text: `Data "${agt.nama}" telah dihapus dari sistem.` 
        });
      }
    });
  } else if (confirm(`Apakah Anda yakin ingin menghapus ${agt.nama}?`)) {
    state.anggota = state.anggota.filter(a => a.id !== id);
    saveState();
    syncChangeToGAS('deleteAnggota', { id: id });
    populateKelasFilter();
    renderTabelAnggota();
    renderDashboard();
    if (typeof refreshTabelAbsensiSekretaris === 'function') {
      refreshTabelAbsensiSekretaris();
    }
  }
}


// Window Exports
window.renderTabelAnggota = renderTabelAnggota;
window.clearSearchAnggota = clearSearchAnggota;
window.populateKategoriDropdowns = populateKategoriDropdowns;
window.populateKelasFilter = populateKelasFilter;
window.renderListKategoriAngkatan = renderListKategoriAngkatan;
window.hapusKategoriAngkatan = hapusKategoriAngkatan;
window.bukaModalTambahKategori = bukaModalTambahKategori;
window.simpanKategoriBaru = simpanKategoriBaru;
window.bukaModalTambahAnggota = bukaModalTambahAnggota;
window.editAnggota = editAnggota;
window.simpanAnggota = simpanAnggota;
window.hapusAnggota = hapusAnggota;
window.handleTingkatKelasChange = handleTingkatKelasChange;
window.handleAngkatanChange = handleAngkatanChange;
window.updateAgtKelasValue = updateAgtKelasValue;
window.pilihJurusanBtn = pilihJurusanBtn;
window.bukaModalFilterAnggota = bukaModalFilterAnggota;
window.renderFilterAngkatanAnggotaPills = renderFilterAngkatanAnggotaPills;
window.pilihPopupAngkatanAnggotaBtn = pilihPopupAngkatanAnggotaBtn;
window.highlightPopupTingkatAnggotaBtn = highlightPopupTingkatAnggotaBtn;
window.pilihPopupTingkatAnggotaBtn = pilihPopupTingkatAnggotaBtn;
window.handlePopupFilterAngkatanChange = handlePopupFilterAngkatanChange;
window.handlePopupFilterTingkatChange = handlePopupFilterTingkatChange;
window.pilihPopupJurusanBtn = pilihPopupJurusanBtn;
window.highlightPopupJurusanBtn = highlightPopupJurusanBtn;
window.batalFilterAnggota = batalFilterAnggota;
window.terapkanFilterAnggota = terapkanFilterAnggota;
window.resetFilterAnggota = resetFilterAnggota;
window.handleStatusDivisiChange = handleStatusDivisiChange;
window.pilihDivisiBtn = pilihDivisiBtn;
window.highlightDivisiBtn = highlightDivisiBtn;
window.populateDivisiPillButtons = populateDivisiPillButtons;


