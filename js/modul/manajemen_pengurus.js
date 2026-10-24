/**
 * =========================================================================
 * MODUL 6: MANAJEMEN PENGURUS (manajemen_pengurus.js)
 * SISTEM INFORMASI & LAPORAN PASKIBRA GARATIKA SMKN 40 JAKARTA
 * =========================================================================
 */

/* ==========================================================================
   DATA PENGURUS: DARI KETUA HINGGA DIVISI TERAKHIR (TABEL BISA DI-FILTER)
   ========================================================================== */
let activeFilterDivisiPengurus = "";
let activeFilterAngkatanPengurus = "";
let activeFilterTingkatPengurus = "";
let activeFilterJurusanPengurus = "";
let tempPopupDivisiPengurus = "";
let tempPopupAngkatanPengurus = "";
let tempPopupTingkatPengurus = "";
let tempPopupJurusanPengurus = "";

function clearSearchPengurus() {
  const searchInput = document.getElementById("searchPengurus");
  const clearBtn = document.getElementById("btnClearSearchPengurus");
  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
  }
  if (clearBtn) {
    clearBtn.classList.remove("visible");
    clearBtn.style.setProperty("display", "none", "important");
  }
  renderTabelPengurus();
}

function renderFilterDivisiPengurusPills() {
  const grid = document.getElementById("popupFilterDivisiPengurusGrid");
  if (!grid) return;
  let html = `<button type="button" class="filter-pill-btn ${!tempPopupDivisiPengurus ? 'active' : ''}" onclick="pilihPopupDivisiPengurusBtn('')">Semua Divisi</button>`;
  const sortedDiv = [...(state.divisi || [])].sort(typeof compareDivisi === 'function' ? compareDivisi : (a, b) => a.nama.localeCompare(b.nama));
  sortedDiv.forEach(d => {
    const isActive = (tempPopupDivisiPengurus === d.nama);
    html += `<button type="button" class="filter-pill-btn ${isActive ? 'active' : ''}" onclick="pilihPopupDivisiPengurusBtn('${escapeHTML(d.nama)}')">${escapeHTML(d.nama)}</button>`;
  });
  grid.innerHTML = html;
}

function pilihPopupDivisiPengurusBtn(val) {
  tempPopupDivisiPengurus = val;
  const grid = document.getElementById("popupFilterDivisiPengurusGrid");
  if (grid) {
    grid.querySelectorAll(".filter-pill-btn").forEach(btn => {
      const btnVal = btn.getAttribute("onclick") || "";
      const match = (!val && btnVal.includes("''")) || (val && btnVal.includes(`'${val}'`));
      btn.classList.toggle("active", Boolean(match));
    });
  }
}

function renderFilterAngkatanPengurusPills() {
  const grid = document.getElementById("popupFilterAngkatanPengurusGrid");
  if (!grid) return;
  const sorted = [...(state.kategoriAngkatan || [])].sort((a, b) => {
    if (typeof compareAngkatanOrAbjad === 'function') {
      return compareAngkatanOrAbjad(a.label || a.id, b.label || b.id);
    }
    return (a.label || a.id || "").localeCompare(b.label || b.id || "", undefined, { numeric: true });
  });

  let html = `<button type="button" class="filter-pill-btn ${!tempPopupAngkatanPengurus ? 'active' : ''}" onclick="pilihPopupAngkatanPengurusBtn('')">Semua Angkatan</button>`;
  sorted.forEach(k => {
    const val = k.id || k.label;
    const lbl = k.label || k.id;
    const isActive = (tempPopupAngkatanPengurus === val);
    html += `<button type="button" class="filter-pill-btn ${isActive ? 'active' : ''}" onclick="pilihPopupAngkatanPengurusBtn('${escapeHTML(val)}')">${escapeHTML(lbl)}</button>`;
  });
  grid.innerHTML = html;
}

function pilihPopupAngkatanPengurusBtn(val) {
  tempPopupAngkatanPengurus = val;
  const grid = document.getElementById("popupFilterAngkatanPengurusGrid");
  if (grid) {
    grid.querySelectorAll(".filter-pill-btn").forEach(btn => {
      const btnVal = btn.getAttribute("onclick") || "";
      const match = (!val && btnVal.includes("''")) || (val && btnVal.includes(`'${val}'`));
      btn.classList.toggle("active", Boolean(match));
    });
  }

  const groupKelas = document.getElementById("groupPopupFilterKelasPengurus");
  const containerJurusan = document.getElementById("containerPopupJurusanPengurus");

  if (val === "Pelatih") {
    if (groupKelas) groupKelas.style.display = "none";
    if (containerJurusan) containerJurusan.style.display = "none";
    tempPopupTingkatPengurus = "";
    tempPopupJurusanPengurus = "";
    highlightPopupTingkatPengurusBtn("");
    highlightPopupJurusanPengurusBtn("");
  } else {
    if (groupKelas) groupKelas.style.display = "block";
  }
}

function highlightPopupTingkatPengurusBtn(tingkat) {
  const grid = document.getElementById("popupFilterTingkatPengurusGrid");
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

function pilihPopupTingkatPengurusBtn(val) {
  tempPopupTingkatPengurus = val;
  highlightPopupTingkatPengurusBtn(val);

  const containerJurusan = document.getElementById("containerPopupJurusanPengurus");
  if (val === "X" || val === "XI" || val === "XII") {
    if (containerJurusan) {
      containerJurusan.style.display = "block";
    }
    highlightPopupJurusanPengurusBtn(tempPopupJurusanPengurus);
  } else {
    if (containerJurusan) {
      containerJurusan.style.display = "none";
    }
    tempPopupJurusanPengurus = "";
    highlightPopupJurusanPengurusBtn("");
  }
}

function bukaModalFilterPengurus() {
  tempPopupDivisiPengurus = activeFilterDivisiPengurus;
  tempPopupAngkatanPengurus = activeFilterAngkatanPengurus;
  tempPopupTingkatPengurus = activeFilterTingkatPengurus;
  tempPopupJurusanPengurus = activeFilterJurusanPengurus;

  renderFilterDivisiPengurusPills();
  renderFilterAngkatanPengurusPills();
  highlightPopupTingkatPengurusBtn(tempPopupTingkatPengurus);

  const groupKelas = document.getElementById("groupPopupFilterKelasPengurus");
  const containerJurusan = document.getElementById("containerPopupJurusanPengurus");

  if (activeFilterAngkatanPengurus === "Pelatih") {
    if (groupKelas) groupKelas.style.display = "none";
    if (containerJurusan) containerJurusan.style.display = "none";
  } else {
    if (groupKelas) groupKelas.style.display = "block";
    if (activeFilterTingkatPengurus) {
      if (containerJurusan) containerJurusan.style.display = "block";
      highlightPopupJurusanPengurusBtn(tempPopupJurusanPengurus);
    } else {
      if (containerJurusan) containerJurusan.style.display = "none";
      highlightPopupJurusanPengurusBtn("");
    }
  }

  openModal("modalFilterPengurus");
}

function handlePopupFilterTingkatPengurusChange() {
  pilihPopupTingkatPengurusBtn(tempPopupTingkatPengurus);
}

function pilihPopupJurusanPengurusBtn(jurusan) {
  tempPopupJurusanPengurus = jurusan;
  highlightPopupJurusanPengurusBtn(jurusan);
}

function highlightPopupJurusanPengurusBtn(jurusan) {
  const grid = document.getElementById("popupJurusanBtnGridPengurus");
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

function batalFilterPengurus() {
  closeModal("modalFilterPengurus");
}

function terapkanFilterPengurus() {
  activeFilterDivisiPengurus = tempPopupDivisiPengurus || "";
  activeFilterAngkatanPengurus = tempPopupAngkatanPengurus || "";
  activeFilterTingkatPengurus = tempPopupTingkatPengurus || "";
  activeFilterJurusanPengurus = tempPopupJurusanPengurus || "";

  updateBadgeFilterActivePengurus();
  closeModal("modalFilterPengurus");
  renderTabelPengurus();
}

function resetFilterPengurus() {
  const searchInput = document.getElementById("searchPengurus");
  const clearBtn = document.getElementById("btnClearSearchPengurus");
  if (searchInput) searchInput.value = "";
  if (clearBtn) {
    clearBtn.classList.remove("visible");
    clearBtn.style.setProperty("display", "none", "important");
  }

  activeFilterDivisiPengurus = "";
  activeFilterAngkatanPengurus = "";
  activeFilterTingkatPengurus = "";
  activeFilterJurusanPengurus = "";
  tempPopupDivisiPengurus = "";
  tempPopupAngkatanPengurus = "";
  tempPopupTingkatPengurus = "";
  tempPopupJurusanPengurus = "";

  updateBadgeFilterActivePengurus();

  // Animasi icon putar
  const btnReset = document.getElementById("btnResetFilterPengurus");
  const icon = btnReset ? btnReset.querySelector("i") : null;
  if (icon) {
    icon.classList.add("fa-spin");
    setTimeout(() => icon.classList.remove("fa-spin"), 400);
  }

  renderTabelPengurus();

  if (typeof showSmallToast === "function") {
    showSmallToast({
      icon: 'success',
      title: 'Filter & Data Direset',
      text: 'Menampilkan seluruh pengurus Garatika.'
    });
  }
}

function updateBadgeFilterActivePengurus() {
  const badge = document.getElementById("badgeFilterActivePengurus");
  const btn = document.getElementById("btnBukaModalFilterPengurus");
  const isFiltered = Boolean(activeFilterDivisiPengurus || activeFilterAngkatanPengurus || activeFilterTingkatPengurus || activeFilterJurusanPengurus);
  if (badge) badge.style.display = isFiltered ? "block" : "none";
  if (btn) btn.classList.toggle("is-active", isFiltered);
}

function renderTabelPengurus() {
  const tbody = document.getElementById("tabelPengurusBody");
  if (!tbody) return;

  const rawKeyword = document.getElementById("searchPengurus")?.value || "";
  const keyword = rawKeyword.toLowerCase().trim();

  // Kontrol tampilan tombol 'X' pembersih search input
  const clearBtn = document.getElementById("btnClearSearchPengurus");
  if (clearBtn) {
    const hasText = rawKeyword.trim().length > 0;
    clearBtn.classList.toggle("visible", hasText);
    clearBtn.style.setProperty("display", hasText ? "inline-flex" : "none", "important");
  }

  // Ambil seluruh pengurus dari Pelatih, Ketua hingga divisi terakhir
  let pengurusList = state.anggota.filter(a => {
    if (!a || a.angkatan === 'Senior') return false;
    const isPelatih = a.angkatan === 'Pelatih' || a.divisi === 'Pelatih' || a.divisiId === 'pelatih';
    if (isPelatih) return true;
    return Boolean(
      a.divisiId &&
      a.divisiId !== 'anggota' &&
      a.divisi &&
      a.divisi !== 'Anggota' &&
      a.divisi !== '-'
    );
  });

  // Urutan hierarki: Pelatih paling atas (#0), Ketua (#1), Wakil (#2), lalu divisi-divisi berikutnya
  const getHierarchyOrder = (agt) => {
    const div = (agt.divisi || "").toLowerCase();
    const divId = (agt.divisiId || "").toLowerCase();
    const angkatan = (agt.angkatan || "").toLowerCase();
    if (divId === 'pelatih' || div.includes('pelatih') || angkatan.includes('pelatih')) return 0;
    if (divId === 'ketua' || (div.includes('ketua') && !div.includes('wakil'))) return 1;
    if (divId === 'wakil_ketua' || div.includes('wakil')) return 2;
    if (divId === 'sekretaris' || div.includes('sekretaris')) return 3;
    if (divId === 'bendahara' || div.includes('bendahara')) return 4;
    if (divId === 'korlap' || div.includes('lapangan')) return 5;
    if (divId === 'sarpras' || div.includes('sarana')) return 6;
    if (divId === 'media_kreatif' || div.includes('media')) return 7;
    return 10;
  };

  pengurusList.sort((a, b) => getHierarchyOrder(a) - getHierarchyOrder(b));

  let filtered = pengurusList.filter(item => {
    const namaText = (item.nama || "").toLowerCase();

    // Fungsi search HANYA mencari nama, sama persis seperti di halaman anggota
    const matchKeyword = !keyword || namaText.includes(keyword);

    const isItemPelatih = item.divisiId === 'pelatih' || (item.divisi && item.divisi.toLowerCase() === 'pelatih') || (item.angkatan && item.angkatan.toLowerCase() === 'pelatih');

    let matchDivisi = true;
    if (activeFilterDivisiPengurus) {
      const filterLower = activeFilterDivisiPengurus.toLowerCase();
      if (filterLower === 'pelatih') {
        matchDivisi = isItemPelatih;
      } else {
        matchDivisi = (item.divisi === activeFilterDivisiPengurus || item.divisiId === activeFilterDivisiPengurus) && !isItemPelatih;
      }
    }

    let matchAngkatan = true;
    if (activeFilterAngkatanPengurus) {
      const filterAngkatanLower = activeFilterAngkatanPengurus.toLowerCase();
      if (filterAngkatanLower === 'pelatih') {
        matchAngkatan = isItemPelatih;
      } else {
        matchAngkatan = item.angkatan === activeFilterAngkatanPengurus;
      }
    }

    let matchKelas = true;
    if (activeFilterTingkatPengurus) {
      if (isItemPelatih) {
        matchKelas = false;
      } else {
        const cleanKelas = (item.kelas || "").trim();
        let tingkatItem = "";
        if (cleanKelas.startsWith("XII")) tingkatItem = "XII";
        else if (cleanKelas.startsWith("XI")) tingkatItem = "XI";
        else if (cleanKelas.startsWith("X")) tingkatItem = "X";

        if (tingkatItem !== activeFilterTingkatPengurus) {
          matchKelas = false;
        } else if (activeFilterJurusanPengurus) {
          const normKelas = cleanKelas.toUpperCase().replace(/\s+/g, '');
          const normJurusan = activeFilterJurusanPengurus.toUpperCase().replace(/\s+/g, '');
          if (normJurusan === 'AK' && normKelas.includes('AKL')) {
            matchKelas = true;
          } else {
            matchKelas = normKelas.includes(normJurusan);
          }
        }
      }
    }

    return matchKeyword && matchDivisi && matchAngkatan && matchKelas;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="cell-empty-state" style="text-align: center; padding: 22px; color: var(--text-muted);"><i class="fa-solid fa-user-xmark" style="font-size: 1.5rem; display: block; margin-bottom: 8px; color: #94a3b8;"></i>Data pengurus tidak ditemukan dengan kriteria filter yang dipilih.</td></tr>`;
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
      <td class="cell-division"><span class="badge-divisi">${escapeHTML(agt.divisi)}</span></td>
      <td class="cell-actions" style="text-align: center;">
        <div class="action-btns" style="justify-content: center;">
          <button class="btn-action-icon btn-edit" onclick="editPengurus('${agt.id}')" title="Edit Jabatan Pengurus">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-action-icon btn-delete" onclick="copotPengurus('${agt.id}')" title="Copot dari Struktur Pengurus">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function bukaPengurusPerDivisi(divisiNama) {
  switchTab('tab-pengurus');
  activeFilterDivisiPengurus = divisiNama || "";
  activeFilterAngkatanPengurus = "";
  activeFilterTingkatPengurus = "";
  activeFilterJurusanPengurus = "";
  tempPopupJurusanPengurus = "";
  updateBadgeFilterActivePengurus();
  renderTabelPengurus();
}


/* ==========================================================================
   PENGURUS AUTOCOMPLETE & TETAPKAN PENGURUS
   ========================================================================== */
function updateBadgePengurusDivisi(namaDivisi) {
  const badgeBox = document.getElementById("pengurusDivisiInfoBadge");
  const badgeText = document.getElementById("pengurusDivisiBadgeText");
  if (!badgeBox || !badgeText) return;

  if (namaDivisi && namaDivisi !== "Anggota" && namaDivisi !== "-") {
    badgeBox.style.display = "block";
    badgeText.textContent = namaDivisi;
  } else {
    badgeBox.style.display = "none";
    badgeText.textContent = "-";
  }
}

function bukaModalTambahPengurus() {
  const form = document.getElementById("formTambahPengurus");
  if (form) form.reset();

  const idInput = document.getElementById("pengurusAnggotaId");
  if (idInput) idInput.value = "";

  const kelasInput = document.getElementById("pengurusKelas");
  if (kelasInput) kelasInput.value = "";

  const angkatanInput = document.getElementById("pengurusAngkatan");
  if (angkatanInput) angkatanInput.value = "";

  const dropBox = document.getElementById("autocompleteNamaPengurus");
  if (dropBox) {
    dropBox.style.display = "none";
    dropBox.innerHTML = "";
  }

  updateBadgePengurusDivisi("");

  const clearBtn = document.getElementById("btnClearSearchPengurusNama");
  if (clearBtn) {
    clearBtn.classList.remove("visible");
    clearBtn.style.setProperty("display", "none", "important");
  }

  const selectDivisi = document.getElementById("pengurusDivisi");
  if (selectDivisi) {
    let options = `<option value="">-- Pilih Jabatan / Divisi --</option>`;
    const sortedDivisi = [...(state.divisi || [])].sort((typeof compareDivisi === 'function' ? compareDivisi : (a, b) => a.nama.localeCompare(b.nama)));
    sortedDivisi.forEach(d => {
      options += `<option value="${escapeHTML(d.nama)}" data-id="${d.id}">${escapeHTML(d.nama)}</option>`;
    });
    selectDivisi.innerHTML = options;
    selectDivisi.onchange = function() {
      updateBadgePengurusDivisi(this.value);
    };
  }

  openModal("modalTambahPengurus");
}

function clearSearchPengurusNama() {
  const searchInput = document.getElementById("pengurusNamaSearch");
  const clearBtn = document.getElementById("btnClearSearchPengurusNama");
  const dropBox = document.getElementById("autocompleteNamaPengurus");
  const idInput = document.getElementById("pengurusAnggotaId");
  const kelasInput = document.getElementById("pengurusKelas");
  const angkatanInput = document.getElementById("pengurusAngkatan");

  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
  }
  if (idInput) idInput.value = "";
  if (kelasInput) kelasInput.value = "";
  if (angkatanInput) angkatanInput.value = "";
  if (dropBox) {
    dropBox.style.display = "none";
    dropBox.innerHTML = "";
  }
  if (clearBtn) {
    clearBtn.classList.remove("visible");
    clearBtn.style.setProperty("display", "none", "important");
  }
}

function handlePengurusSearchInput(e) {
  const rawVal = e.target.value || "";
  const query = rawVal.toLowerCase().trim();

  // Kontrol tombol 'X' merah live search nama pengurus
  const clearBtn = document.getElementById("btnClearSearchPengurusNama");
  if (clearBtn) {
    const hasText = rawVal.trim().length > 0;
    clearBtn.classList.toggle("visible", hasText);
    clearBtn.style.setProperty("display", hasText ? "inline-flex" : "none", "important");
  }

  const dropBox = document.getElementById("autocompleteNamaPengurus");
  if (!dropBox) return;

  if (!query) {
    dropBox.style.display = "none";
    dropBox.innerHTML = "";
    return;
  }

  const matches = state.anggota.filter(a => 
    a.angkatan !== 'Senior' &&
    a.nama.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    dropBox.innerHTML = `<div style="padding: 10px; font-size: 0.82rem; color: var(--text-muted); text-align: center;">Tidak ada anggota yang cocok dengan nama "${escapeHTML(e.target.value)}"</div>`;
    dropBox.style.display = "block";
    return;
  }

  dropBox.innerHTML = matches.slice(0, 8).map(a => `
    <div class="autocomplete-item" onclick="pilihAnggotaPengurus('${a.id}')" style="padding: 9px 12px; cursor: pointer; border-bottom: 1px solid #f1f5f9;">
      <div style="font-weight: 600; color: #0f172a; font-size: 0.875rem;">${escapeHTML(a.nama)}</div>
      <div style="font-size: 0.75rem; color: #64748b;">${escapeHTML(a.kelas)} - ${escapeHTML(a.angkatan)} (${escapeHTML(a.divisi || 'Anggota')})</div>
    </div>
  `).join("");
  dropBox.style.display = "block";
}

function pilihAnggotaPengurus(agtId) {
  const agt = state.anggota.find(a => a.id === agtId);
  if (!agt) return;

  const idInput = document.getElementById("pengurusAnggotaId");
  const searchInput = document.getElementById("pengurusNamaSearch");
  const kelasInput = document.getElementById("pengurusKelas");
  const angkatanInput = document.getElementById("pengurusAngkatan");
  const selectDivisi = document.getElementById("pengurusDivisi");

  if (idInput) idInput.value = agt.id;
  if (searchInput) searchInput.value = agt.nama;
  if (kelasInput) kelasInput.value = agt.kelas;
  if (angkatanInput) angkatanInput.value = agt.angkatan;

  const clearBtn = document.getElementById("btnClearSearchPengurusNama");
  if (clearBtn) {
    clearBtn.classList.add("visible");
    clearBtn.style.setProperty("display", "inline-flex", "important");
  }

  if (selectDivisi) {
    const matchedDiv = typeof findDivisiForAnggota === 'function' ? findDivisiForAnggota(agt) : null;
    let selectedIndex = 0;

    for (let i = 0; i < selectDivisi.options.length; i++) {
      const opt = selectDivisi.options[i];
      if (!opt.value) continue;

      if (matchedDiv) {
        if (opt.value === matchedDiv.nama || opt.dataset.id === matchedDiv.id || (typeof isSameDivisi === 'function' && isSameDivisi(opt.value, matchedDiv.nama))) {
          selectedIndex = i;
          break;
        }
      }

      if (agt.divisi && (opt.value === agt.divisi || (typeof isSameDivisi === 'function' && isSameDivisi(opt.value, agt.divisi)))) {
        selectedIndex = i;
        break;
      }

      if (agt.divisiId && (opt.dataset.id === agt.divisiId || opt.value.toLowerCase() === agt.divisiId.toLowerCase())) {
        selectedIndex = i;
        break;
      }
    }

    if (selectedIndex > 0) {
      selectDivisi.selectedIndex = selectedIndex;
      updateBadgePengurusDivisi(selectDivisi.options[selectedIndex].value);
    } else {
      selectDivisi.selectedIndex = 0;
      updateBadgePengurusDivisi("");
    }
  }

  const dropBox = document.getElementById("autocompleteNamaPengurus");
  if (dropBox) {
    dropBox.style.display = "none";
    dropBox.innerHTML = "";
  }
}

function editPengurus(id) {
  bukaModalTambahPengurus();
  pilihAnggotaPengurus(id);
}

function copotPengurus(id) {
  const agt = state.anggota.find(a => a.id === id);
  if (!agt) return;

  const isPelatih = agt.angkatan === 'Pelatih' || agt.divisi === 'Pelatih' || agt.divisiId === 'pelatih';
  if (isPelatih) {
    if (typeof showSmallToast === 'function') {
      showSmallToast({
        icon: 'warning',
        title: 'Tidak Bisa Dicopot',
        text: 'Pelatih merupakan pembina organisasi dan tidak dapat dicopot menjadi anggota biasa. Kelola statusnya melalui menu Data Anggota.'
      });
    } else {
      alert('Pelatih merupakan pembina organisasi dan tidak dapat dicopot menjadi anggota biasa.');
    }
    return;
  }

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Hapus dari Pengurus?',
      text: `Apakah Anda yakin ingin mencopot ${agt.nama} dari struktur pengurus?`,
      icon: 'warning',
      width: '320px',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Copot',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' }
    }).then((result) => {
      if (result.isConfirmed) {
        agt.divisi = 'Anggota';
        agt.divisiId = 'anggota';
        saveState();
        syncChangeToGAS('saveAnggota', { data: agt });
        renderTabelPengurus();
        renderTabelAnggota();
        renderGridDivisi();
        renderDashboard();
        showSmallToast({
          icon: 'success',
          title: 'Pengurus Dicopot',
          text: `${agt.nama} dikembalikan menjadi anggota biasa.`
        });
      }
    });
  } else if (confirm(`Apakah Anda yakin ingin mencopot ${agt.nama} dari struktur pengurus?`)) {
    agt.divisi = 'Anggota';
    agt.divisiId = 'anggota';
    saveState();
    syncChangeToGAS('saveAnggota', { data: agt });
    renderTabelPengurus();
    renderTabelAnggota();
    renderGridDivisi();
    renderDashboard();
  }
}

function simpanPengurusDariModal(e) {
  e.preventDefault();
  const agtId = document.getElementById("pengurusAnggotaId")?.value;
  const divisiVal = document.getElementById("pengurusDivisi")?.value;

  if (!agtId) {
    showSmallToast({ icon: 'warning', title: 'Pilih Anggota', text: 'Pilih nama anggota dari rekomendasi yang muncul.' });
    return;
  }
  if (!divisiVal) {
    showSmallToast({ icon: 'warning', title: 'Pilih Jabatan/Divisi', text: 'Silakan tentukan divisi kepengurusan.' });
    return;
  }

  const agt = state.anggota.find(a => a.id === agtId);
  if (!agt) return;

  const doSavePengurus = () => {
    const matchedDivisi = typeof findDivisiForAnggota === 'function' 
      ? findDivisiForAnggota({ divisi: divisiVal }) 
      : (state.divisi || []).find(d => d.nama === divisiVal || (typeof isSameDivisi === 'function' && isSameDivisi(d.nama, divisiVal)));

    agt.divisi = matchedDivisi ? matchedDivisi.nama : divisiVal;
    agt.divisiId = matchedDivisi ? matchedDivisi.id : "divisi_lain";

    saveState();
    syncChangeToGAS('saveAnggota', { data: agt });

    closeModal("modalTambahPengurus");
    renderTabelPengurus();
    renderGridDivisi();
    renderDashboard();
    renderTabelAnggota();
    if (typeof refreshTabelAbsensiSekretaris === 'function') {
      refreshTabelAbsensiSekretaris();
    }
    showSmallToast({
      icon: 'success',
      title: 'Pengurus Ditetapkan',
      text: `${agt.nama} berhasil ditetapkan sebagai pengurus ${divisiVal}.`
    });
  };

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Tetapkan Pengurus?',
      text: `Apakah Anda yakin ingin menetapkan ${agt.nama} sebagai pengurus ${divisiVal}?`,
      icon: 'question',
      width: '340px',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Tetapkan',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' }
    }).then((result) => {
      if (result.isConfirmed) doSavePengurus();
    });
  } else if (confirm(`Apakah Anda yakin ingin menetapkan ${agt.nama} sebagai pengurus ${divisiVal}?`)) {
    doSavePengurus();
  }
}


// Window Exports
window.renderTabelPengurus = renderTabelPengurus;
window.bukaPengurusPerDivisi = bukaPengurusPerDivisi;
window.bukaModalTambahPengurus = bukaModalTambahPengurus;
window.handlePengurusSearchInput = handlePengurusSearchInput;
window.pilihAnggotaPengurus = pilihAnggotaPengurus;
window.editPengurus = editPengurus;
window.copotPengurus = copotPengurus;
window.simpanPengurusDariModal = simpanPengurusDariModal;
window.clearSearchPengurus = clearSearchPengurus;
window.clearSearchPengurusNama = clearSearchPengurusNama;
window.bukaModalFilterPengurus = bukaModalFilterPengurus;
window.renderFilterDivisiPengurusPills = renderFilterDivisiPengurusPills;
window.pilihPopupDivisiPengurusBtn = pilihPopupDivisiPengurusBtn;
window.renderFilterAngkatanPengurusPills = renderFilterAngkatanPengurusPills;
window.pilihPopupAngkatanPengurusBtn = pilihPopupAngkatanPengurusBtn;
window.highlightPopupTingkatPengurusBtn = highlightPopupTingkatPengurusBtn;
window.pilihPopupTingkatPengurusBtn = pilihPopupTingkatPengurusBtn;
window.handlePopupFilterTingkatPengurusChange = handlePopupFilterTingkatPengurusChange;
window.pilihPopupJurusanPengurusBtn = pilihPopupJurusanPengurusBtn;
window.batalFilterPengurus = batalFilterPengurus;
window.terapkanFilterPengurus = terapkanFilterPengurus;
window.resetFilterPengurus = resetFilterPengurus;
window.updateBadgeFilterActivePengurus = updateBadgeFilterActivePengurus;
