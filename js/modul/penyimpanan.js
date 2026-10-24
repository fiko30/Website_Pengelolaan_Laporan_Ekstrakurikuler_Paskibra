/**
 * =========================================================================
 * MODUL 1: PENYIMPANAN & STATE GLOBAL (penyimpanan.js)
 * SISTEM INFORMASI & LAPORAN PASKIBRA GARATIKA SMKN 40 JAKARTA
 * =========================================================================
 */

// Global State
window.state = {
  currentUser: null,
  anggota: [],
  divisi: [],
  laporan: [],
  kategoriAngkatan: [],
  kategoriBulan: [],
  driveFiles: [],
  gasWebhookUrl: "https://script.google.com/macros/s/AKfycbwzQt8PY-MK6qP_nOOH1dkAygilR6RXI73foev8cdEfbPoQBINnPykrAZgQTsuqRmig/exec"
};
var state = window.state;

/* ==========================================================================
   NORMALISASI ANGGOTA & PENGURUS
   ========================================================================== */
function normalizeAnggotaObject(a) {
  if (!a || typeof a !== "object") return a;

  // Kasus jika kolom bergeser dari spreadsheet tanpa kolom ID:
  // r[0]=Nama ("April Riana"), r[1]=Kelas ("XI - MP"), r[2]=Angkatan ("G10"), r[3]=Status ("Aktif"), r[4]=Divisi ("Sekretaris")
  const aNama = String(a.nama || "").trim();
  const aId = String(a.id || "").trim();
  const isShifted = (
    /^(x|xi|xii)\s*[-/]?\s*[a-z0-9]/i.test(aNama) && 
    aId && !aId.toLowerCase().startsWith("agt-")
  );

  if (isShifted) {
    const realNama = aId;
    const realKelas = aNama;
    const realAngkatan = a.kelas || "G10";
    const realStatus = a.angkatan || "Aktif";
    const realDivisi = a.status || "Anggota";
    a.id = "agt-" + realNama.toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.nama = realNama;
    a.kelas = realKelas;
    a.angkatan = realAngkatan;
    a.status = realStatus;
    a.divisi = realDivisi;
  }

  // Jika divisi tersimpan di field status (misal status = "Sekretaris")
  const statusLower = (a.status || "").toLowerCase();
  if (statusLower.includes("sekretar") || statusLower.includes("bendahar") || statusLower.includes("korlap") || statusLower.includes("sarpras") || statusLower.includes("media") || statusLower.includes("kreatif") || statusLower.includes("pelatih") || statusLower.includes("ketua")) {
    if (!a.divisi || a.divisi === "Anggota" || a.divisi === "-") {
      a.divisi = a.status;
      a.status = "Aktif";
    }
  }

  const isPelatih = a.angkatan === "Senior" || a.angkatan === "Pelatih" || a.divisi === "Pelatih" || a.divisiId === "pelatih";
  if (isPelatih) {
    a.angkatan = "Pelatih";
    a.kelas = "-";
    a.divisi = "Pelatih";
    a.divisiId = "pelatih";
    a.jabatan = "Pelatih";
  }

  if (a.kelas === "Alumni / Pelatih" || a.kelas === "Alumni / Pembina" || a.kelas === "Alumni") a.kelas = "-";
  if (a.kelas === "XII RPL 1" || a.kelas === "XII RPL 2") a.kelas = "XII - RPL";
  if (a.kelas === "XII AKL 2" || a.kelas === "XII AKL 1") a.kelas = "XII - AK";
  if (a.kelas === "XI AKL 1" || a.kelas === "XI AKL 2") a.kelas = "XI - AK";
  if (a.kelas === "XI OTKP 1" || a.kelas === "XI OTKP 2") a.kelas = "XI - MP";
  if (a.kelas === "X DKV 2") a.kelas = "X - DKV 2";
  if (a.kelas === "X DKV 1") a.kelas = "X - DKV 1";
  if (a.kelas === "X BDP 1" || a.kelas === "XI BDP 1") a.kelas = "X - BR";
  if (a.kelas === "X RPL 1" || a.kelas === "X RPL 2") a.kelas = "X - RPL";

  const divLower = (a.divisi || "").toLowerCase();
  const divIdLower = (a.divisiId || "").toLowerCase();
  const jabLower = (a.jabatan || "").toLowerCase();
  const combined = `${divLower} ${divIdLower} ${jabLower}`;

  if (combined.includes("sekretar")) {
    a.divisi = "Divisi Sekretaris";
    a.divisiId = "sekretaris";
    a.jabatan = "Sekretaris";
  } else if (combined.includes("bendahar")) {
    a.divisi = "Divisi Bendahara";
    a.divisiId = "bendahara";
    a.jabatan = "Bendahara";
  } else if (combined.includes("korlap") || combined.includes("lapangan")) {
    a.divisi = "Divisi Koordinator Lapangan";
    a.divisiId = "korlap";
    a.jabatan = "Koordinator Lapangan";
  } else if (combined.includes("sarpras") || combined.includes("sarana")) {
    a.divisi = "Divisi Sarana dan Prasarana";
    a.divisiId = "sarpras";
    a.jabatan = "Sarana dan Prasarana";
  } else if (combined.includes("media") || combined.includes("kreatif") || combined.includes("pubdok")) {
    a.divisi = "Divisi Media Kreatif";
    a.divisiId = "media_kreatif";
    a.jabatan = "Media Kreatif";
  }

  return a;
}

function normalizeAllAnggota() {
  if (Array.isArray(state.anggota)) {
    state.anggota.forEach(a => normalizeAnggotaObject(a));
  }
}

/* ==========================================================================
   2. STORAGE & STATE MANAGEMENT
   ========================================================================== */
function initStorage() {
  const localAnggota = localStorage.getItem("garatika_anggota");
  const localDivisi = localStorage.getItem("garatika_divisi");
  const localLaporan = localStorage.getItem("garatika_laporan");
  const localKategori = localStorage.getItem("garatika_kategori_angkatan");
  const localBulan = localStorage.getItem("garatika_kategori_bulan");
  const localFiles = localStorage.getItem("garatika_drive_files");

  state.anggota = localAnggota ? JSON.parse(localAnggota) : [...DEFAULT_ANGGOTA];
  state.divisi = localDivisi ? JSON.parse(localDivisi) : [...DEFAULT_DIVISI];
  state.laporan = localLaporan ? JSON.parse(localLaporan) : [...DEFAULT_LAPORAN];
  if (Array.isArray(state.laporan)) {
    const defaultSarNames = [
      "Slayer", "Slempang", "Garuda", "Kopel", "Sarung Tangan",
      "Sepatu Pantofel Cewe", "Sepatu Pantofel Tali Cowo", "Sepatu Pantofel Laki-Laki",
      "Peci Cewe Cowo", "Baju PDU Cewe", "Rok PDU Cewe", "Celana PDU Cowo",
      "Bendera", "Taplak Bendera", "Talikur", "Belt Putih",
      "Peci Perempuan", "Peci Laki-Laki", "Evolet"
    ];
    state.laporan.forEach(l => {
      if (!l.statusReview || l.statusReview === "Menunggu Review" || l.statusReview === "Terverifikasi") {
        l.statusReview = "Terkirim";
      }
      if (l && l.detail && Array.isArray(l.detail.inventaris)) {
        l.detail.inventaris.forEach((it, idx) => {
          const nm = it.nama || it.barang || it.name || (window.SARPRAS_INVENTORY_ITEMS && window.SARPRAS_INVENTORY_ITEMS[idx]) || defaultSarNames[idx] || `Barang #${idx + 1}`;
          it.nama = nm;
          it.barang = nm;
          it.name = nm;
        });
      }
      if (l && l.detail && (Array.isArray(l.detail.kontenList) || l.detail.judulKonten)) {
        l.divisiId = "media_kreatif";
        l.divisiNama = "Divisi Media Kreatif";
      }
    });
  }
  state.kategoriAngkatan = (localKategori && JSON.parse(localKategori).length > 0) ? JSON.parse(localKategori) : [...DEFAULT_KATEGORI_ANGKATAN];
  const defaultBulanList = (typeof DEFAULT_KATEGORI_BULAN !== 'undefined' && Array.isArray(DEFAULT_KATEGORI_BULAN))
    ? DEFAULT_KATEGORI_BULAN
    : [{ id: "2026-10", label: "Oktober 2026", folder: "Oktober 2026", driveFolderId: "1Hd-En7FO1BCN0HzzGvKQ-KUXm3uvbRPT", url: "https://drive.google.com/drive/folders/1Hd-En7FO1BCN0HzzGvKQ-KUXm3uvbRPT" }];

  let parsedBulan = null;
  try {
    if (localBulan) parsedBulan = JSON.parse(localBulan);
  } catch (e) { parsedBulan = null; }

  state.kategoriBulan = (Array.isArray(parsedBulan) && parsedBulan.length > 0)
    ? parsedBulan
    : [...defaultBulanList];

  // Pastikan folder Oktober 2026 selalu terdaftar
  if (!state.kategoriBulan.some(k => (k.label || k.folder || "").toLowerCase().includes("oktober 2026"))) {
    state.kategoriBulan.unshift({
      id: "2026-10",
      label: "Oktober 2026",
      folder: "Oktober 2026",
      driveFolderId: "1Hd-En7FO1BCN0HzzGvKQ-KUXm3uvbRPT",
      url: "https://drive.google.com/drive/folders/1Hd-En7FO1BCN0HzzGvKQ-KUXm3uvbRPT"
    });
    localStorage.setItem("garatika_kategori_bulan", JSON.stringify(state.kategoriBulan));
  }
  state.driveFiles = localFiles ? JSON.parse(localFiles) : [];

  const localMasterSarpras = localStorage.getItem("garatika_master_sarpras");
  if (localMasterSarpras) {
    try {
      const parsed = JSON.parse(localMasterSarpras);
      if (Array.isArray(parsed) && parsed.length > 0) {
        state.masterSarpras = normalizeMasterSarprasList(parsed);
      }
    } catch (e) { state.masterSarpras = null; }
  }
  if (!state.masterSarpras || !Array.isArray(state.masterSarpras) || state.masterSarpras.length === 0) {
    state.masterSarpras = getDefaultMasterSarpras();
    localStorage.setItem("garatika_master_sarpras", JSON.stringify(state.masterSarpras));
  }
  if (typeof syncMasterSarprasFromServer === 'function') {
    syncMasterSarprasFromServer();
  }

  const DEFAULT_GAS_URL = "https://script.google.com/macros/s/AKfycbwzQt8PY-MK6qP_nOOH1dkAygilR6RXI73foev8cdEfbPoQBINnPykrAZgQTsuqRmig/exec";
  state.gasWebhookUrl = DEFAULT_GAS_URL;
  localStorage.setItem("garatika_gas_url", DEFAULT_GAS_URL);

  // Pastikan nama Ketua tersinkron
  const ketuaIdx = state.anggota.findIndex(a => a.divisiId === "ketua" || a.id === "agt-2");
  if (ketuaIdx !== -1 && typeof KREDENSIAL_KETUA !== "undefined" && KREDENSIAL_KETUA.nama) {
    state.anggota[ketuaIdx].nama = KREDENSIAL_KETUA.nama;
  }

  // Pastikan divisi Pelatih terdaftar & DEDUPLIKASI KETAT DIVISI (Tepat 1 divisi per nama)
  if (Array.isArray(state.divisi)) {
    // Sinkronkan password tersimpan ke objek divisi lokal
    state.divisi.forEach(div => {
      div.password = getDivisiPassword(div);
      if (div.id === "sekretaris" && (!div.password || div.password === "SekretarisGaratika40")) {
        div.password = "Sekretaris Ekstrakurikuler Paskibra SMK Negeri 40 Jakarta";
        if (typeof saveCustomPassword === 'function') {
          saveCustomPassword(div.id, div.password);
          saveCustomPassword(div.nama, div.password);
        }
      }
    });
    const resDedup = cleanAndDeduplicateDivisi(state.divisi);
    state.divisi = resDedup.unique;
    localStorage.setItem("garatika_divisi", JSON.stringify(state.divisi));
  }

  // Pastikan KREDENSIAL_KETUA tersinkron dengan password Ketua saat ini
  const activeKetuaPass = getDivisiPassword("ketua");
  if (activeKetuaPass && typeof KREDENSIAL_KETUA !== "undefined") {
    KREDENSIAL_KETUA.password = activeKetuaPass;
  }

  if (!Array.isArray(state.anggota) || state.anggota.length === 0) {
    state.anggota = (typeof DEFAULT_ANGGOTA !== 'undefined' && Array.isArray(DEFAULT_ANGGOTA)) ? [...DEFAULT_ANGGOTA] : [];
  }

  normalizeAllAnggota();

  // DEDUPLIKASI KETAT nama anggota: setiap nama anggota hanya boleh 1 di sistem
  if (Array.isArray(state.anggota)) {
    const seenAnggota = new Set();
    const uniqueAnggota = [];
    state.anggota.forEach(a => {
      const cleanNama = (a.nama || "").trim().toLowerCase();
      if (!cleanNama) return;
      if (!seenAnggota.has(cleanNama)) {
        seenAnggota.add(cleanNama);
        uniqueAnggota.push(a);
      }
    });
    state.anggota = uniqueAnggota;
  }

  // Normalisasi & DEDUPLIKASI KETAT kategori angkatan (Hanya 1 dari setiap kategori, tidak boleh ganda)
  if (Array.isArray(state.kategoriAngkatan)) {
    const seenKategori = new Set();
    const uniqueKategori = [];

    state.kategoriAngkatan.forEach(k => {
      let cleanLabel = (k.label || k.id || "").trim();
      if (cleanLabel.toLowerCase() !== 'pelatih') {
        cleanLabel = cleanLabel.replace(/^Angkatan\s+/i, "").replace(/\s*\(.*?\)/, "").trim() || cleanLabel;
      } else {
        cleanLabel = "Pelatih";
      }

      const lower = cleanLabel.toLowerCase();
      if (!lower) return;

      if (!seenKategori.has(lower)) {
        seenKategori.add(lower);
        uniqueKategori.push({ id: cleanLabel, label: cleanLabel });
      }
    });

    state.kategoriAngkatan = uniqueKategori;

    // Urutkan kategori angkatan: Pelatih paling atas, lalu G terendah (G9, G10, G11, ...)
    state.kategoriAngkatan.sort((a, b) => {
      const strA = (a.label || a.id || "").trim();
      const strB = (b.label || b.id || "").trim();
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
    });
  }

  // Urutkan anggota: Pelatih paling atas, lalu G terendah (G9, G10...), lalu abjad nama
  if (Array.isArray(state.anggota)) {
    state.anggota.sort((a, b) => {
      const strA = (a.angkatan || "").trim();
      const strB = (b.angkatan || "").trim();
      const isPelatihA = strA.toLowerCase().includes('pelatih');
      const isPelatihB = strB.toLowerCase().includes('pelatih');
      let comp = 0;
      if (isPelatihA && !isPelatihB) comp = -1;
      else if (!isPelatihA && isPelatihB) comp = 1;
      else if (isPelatihA && isPelatihB) comp = 0;
      else {
        const numA = strA.match(/\d+/);
        const numB = strB.match(/\d+/);
        if (numA && numB) {
          const valA = parseInt(numA[0], 10);
          const valB = parseInt(numB[0], 10);
          comp = valA - valB;
        } else if (numA && !numB) {
          comp = -1;
        } else if (!numA && numB) {
          comp = 1;
        } else {
          comp = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
        }
      }
      if (comp !== 0) return comp;
      return (a.nama || "").localeCompare(b.nama || "", undefined, { sensitivity: 'base' });
    });
  }

  if (Array.isArray(state.divisi)) {
    state.divisi.sort(compareDivisi);
  }

  saveState();

  const gasInput = document.getElementById("gasWebhookUrl");
  if (gasInput && state.gasWebhookUrl) {
    gasInput.value = state.gasWebhookUrl;
  }

  if (typeof initGASConnection === "function") {
    initGASConnection();
  }
}

function saveState() {
  if (Array.isArray(state.divisi)) {
    const resDiv = cleanAndDeduplicateDivisi(state.divisi);
    state.divisi = resDiv.unique;
  }
  localStorage.setItem("garatika_anggota", JSON.stringify(state.anggota));
  localStorage.setItem("garatika_divisi", JSON.stringify(state.divisi));
  localStorage.setItem("garatika_laporan", JSON.stringify(state.laporan));
  localStorage.setItem("garatika_kategori_angkatan", JSON.stringify(state.kategoriAngkatan));
  localStorage.setItem("garatika_kategori_bulan", JSON.stringify(state.kategoriBulan));
  localStorage.setItem("garatika_drive_files", JSON.stringify(state.driveFiles || []));
  localStorage.setItem("garatika_gas_url", state.gasWebhookUrl);
  if (Array.isArray(state.masterSarpras)) {
    localStorage.setItem("garatika_master_sarpras", JSON.stringify(state.masterSarpras));
  }
}

function guessSarprasKategori(nama) {
  const s = String(nama || '').toLowerCase();
  if (s.includes('cewe') || s.includes('perempuan') || s.includes('wanita') || s.includes('rok') || s.includes('putri')) {
    if (s.includes('cowo') || s.includes('laki') || s.includes('putra')) {
      return 'Umum';
    }
    return 'Perempuan';
  }
  if (s.includes('cowo') || s.includes('laki') || s.includes('pria') || s.includes('celana') || s.includes('putra')) {
    return 'Laki - Laki';
  }
  return 'Umum';
}

function getDefaultMasterSarpras() {
  return [
    { id: "srp-1", nama: "Slayer", kategori: "Umum" },
    { id: "srp-2", nama: "Slempang", kategori: "Umum" },
    { id: "srp-3", nama: "Garuda", kategori: "Umum" },
    { id: "srp-4", nama: "Kopel", kategori: "Umum" },
    { id: "srp-5", nama: "Sarung Tangan", kategori: "Umum" },
    { id: "srp-6", nama: "Sepatu Pantofel Cewe", kategori: "Perempuan" },
    { id: "srp-7", nama: "Sepatu Pantofel Tali Cowo", kategori: "Laki - Laki" },
    { id: "srp-8", nama: "Sepatu Pantofel Laki-Laki", kategori: "Laki - Laki" },
    { id: "srp-9", nama: "Peci Cewe Cowo", kategori: "Umum" },
    { id: "srp-10", nama: "Baju PDU Cewe", kategori: "Perempuan" },
    { id: "srp-11", nama: "Rok PDU Cewe", kategori: "Perempuan" },
    { id: "srp-12", nama: "Celana PDU Cowo", kategori: "Laki - Laki" },
    { id: "srp-13", nama: "Bendera", kategori: "Umum" },
    { id: "srp-14", nama: "Taplak Bendera", kategori: "Umum" },
    { id: "srp-15", nama: "Talikur", kategori: "Umum" },
    { id: "srp-16", nama: "Belt Putih", kategori: "Umum" },
    { id: "srp-17", nama: "Peci Perempuan", kategori: "Perempuan" },
    { id: "srp-18", nama: "Peci Laki-Laki", kategori: "Laki - Laki" },
    { id: "srp-19", nama: "Evolet", kategori: "Umum" }
  ];
}

function normalizeSarprasItem(item, idx = 0) {
  if (typeof item === 'string') {
    const nama = item.trim();
    return {
      id: `srp-${idx + 1}`,
      nama,
      kategori: guessSarprasKategori(nama)
    };
  }
  if (typeof item === 'object' && item !== null) {
    const nama = (item.nama || item.barang || item.name || `Barang #${idx + 1}`).trim();
    let kategori = (item.kategori || '').trim();
    if (!kategori || (kategori !== 'Umum' && kategori !== 'Laki - Laki' && kategori !== 'Perempuan')) {
      kategori = guessSarprasKategori(nama);
    }
    return {
      id: item.id || `srp-${idx + 1}`,
      nama,
      kategori
    };
  }
  return {
    id: `srp-${idx + 1}`,
    nama: `Barang #${idx + 1}`,
    kategori: 'Umum'
  };
}

function normalizeMasterSarprasList(items) {
  if (!Array.isArray(items)) return [];
  return items.map((it, idx) => normalizeSarprasItem(it, idx));
}

function getMasterSarprasItems() {
  if (typeof state !== 'undefined' && Array.isArray(state.masterSarpras) && state.masterSarpras.length > 0) {
    return normalizeMasterSarprasList(state.masterSarpras);
  }
  try {
    const raw = localStorage.getItem("garatika_master_sarpras");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalized = normalizeMasterSarprasList(parsed);
        if (typeof state !== 'undefined') state.masterSarpras = normalized;
        return normalized;
      }
    }
  } catch (e) {}

  const base = getDefaultMasterSarpras();
  saveMasterSarprasItems(base);
  return base;
}

function saveMasterSarprasItems(items) {
  if (!Array.isArray(items)) return;
  const normalized = normalizeMasterSarprasList(items);
  try {
    localStorage.setItem("garatika_master_sarpras", JSON.stringify(normalized));
    if (typeof state !== 'undefined') state.masterSarpras = [...normalized];

    // Sinkronisasi real-time ke Live Server (untuk semua laptop & HP di jaringan)
    fetch('/api/master-sarpras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized)
    }).catch(() => {});

    // Sinkronisasi ke Cloud Google Apps Script
    if (typeof syncChangeToGAS === 'function') {
      syncChangeToGAS('saveMasterSarpras', { items: normalized });
    }
  } catch (e) {
    console.error("Gagal simpan master sarpras:", e);
  }
}

async function syncMasterSarprasFromServer() {
  try {
    const res = await fetch('/api/master-sarpras', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = normalizeMasterSarprasList(data);
        if (typeof state !== 'undefined') state.masterSarpras = normalized;
        localStorage.setItem("garatika_master_sarpras", JSON.stringify(normalized));
      }
    }
  } catch (e) {}
}

function syncCurrentSarprasToMaster() {
  const tb = document.getElementById("tbodySarpras");
  if (!tb) return;
  const currentItems = Array.from(tb.querySelectorAll("tr"))
    .map((r, idx) => {
      const nama = r.querySelector(".sar-item-name")?.textContent.trim() || r.cells[1]?.textContent.trim();
      if (!nama) return null;
      const kategori = r.getAttribute("data-kategori") || r.querySelector(".sar-kategori-badge")?.textContent.trim() || guessSarprasKategori(nama);
      const id = r.getAttribute("data-id") || `srp-${idx + 1}`;
      return { id, nama, kategori };
    })
    .filter(Boolean);
  if (currentItems.length > 0) {
    saveMasterSarprasItems(currentItems);
  }
}

function resetToDefault() {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Reset ke Data Awal?',
      text: 'Semua data akan dikembalikan ke pengaturan contoh awal Paskibra Garatika.',
      icon: 'warning',
      width: '340px',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Reset',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("garatika_passwords_divisi");
        localStorage.removeItem("garatika_ketua_password");
        state.anggota = [...DEFAULT_ANGGOTA];
        state.divisi = [...DEFAULT_DIVISI];
        state.laporan = [...DEFAULT_LAPORAN];
        state.kategoriAngkatan = [...DEFAULT_KATEGORI_ANGKATAN];
        localStorage.removeItem("garatika_master_sarpras");
        state.masterSarpras = getDefaultMasterSarpras();
        saveMasterSarprasItems(state.masterSarpras);
        saveState();
        renderAll();
        showSmallToast({
          icon: 'success',
          title: 'Data Direset',
          text: 'Data telah dikembalikan ke contoh awal Paskibra.'
        });
      }
    });
  } else if (confirm("Apakah Anda ingin mengembalikan data ke contoh awal Paskibra Garatika?")) {
    localStorage.removeItem("garatika_passwords_divisi");
    localStorage.removeItem("garatika_ketua_password");
    state.anggota = [...DEFAULT_ANGGOTA];
    state.divisi = [...DEFAULT_DIVISI];
    state.laporan = [...DEFAULT_LAPORAN];
    state.kategoriAngkatan = [...DEFAULT_KATEGORI_ANGKATAN];
    localStorage.removeItem("garatika_master_sarpras");
    state.masterSarpras = getDefaultMasterSarpras();
    saveMasterSarprasItems(state.masterSarpras);
    saveState();
    renderAll();
    alert("Data berhasil direset ke setelan awal.");
  }
}


/* ==========================================================================
   12. BACKUP & EXPORT JSON
   ========================================================================== */
function exportAllToJSON() {
  const dataExport = {
    namaAplikasi: "Paskibra Garatika SMKN 40 Jakarta",
    waktuBackup: new Date().toISOString(),
    data: state
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataExport, null, 2));
  const dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `Backup_Paskibra_Garatika_${new Date().toISOString().split('T')[0]}.json`);
  dlAnchorElem.click();
}


// Storage khusus pengunci password kustom agar TIDAK BISA tereset oleh sinkronisasi cloud/default
function getStoredCustomPasswords() {
  try {
    const raw = localStorage.getItem("garatika_passwords_divisi");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveCustomPassword(divIdOrNama, password) {
  if (!divIdOrNama || typeof password !== "string" || !password.trim()) return;
  const store = getStoredCustomPasswords();
  const cleanPass = password.trim();
  const rawKey = String(divIdOrNama).trim();
  const lowerKey = rawKey.toLowerCase();
  store[rawKey] = cleanPass;
  store[lowerKey] = cleanPass;
  localStorage.setItem("garatika_passwords_divisi", JSON.stringify(store));

  if (lowerKey === "ketua" || lowerKey.includes("ketua")) {
    localStorage.setItem("garatika_ketua_password", cleanPass);
    if (typeof KREDENSIAL_KETUA !== "undefined") {
      KREDENSIAL_KETUA.password = cleanPass;
    }
  }
}

// Helper resmi penentu password divisi dengan proteksi ketat (tidak akan reset sendiri)
function getDivisiPassword(div) {
  if (!div) return "Garatika40";

  // Jika parameter berupa string ID atau nama divisi
  if (typeof div === "string") {
    const key = div.trim();
    const keyLower = key.toLowerCase();
    const stored = getStoredCustomPasswords();
    if (stored[key]) return stored[key];
    if (stored[keyLower]) return stored[keyLower];

    const found = (Array.isArray(state.divisi) ? state.divisi : []).find(d => 
      d.id === key || (d.nama && d.nama.toLowerCase() === keyLower)
    );
    if (found) return getDivisiPassword(found);
  }

  const divId = String(div.id || "").trim();
  const divNama = String(div.nama || "").trim();
  const idLower = divId.toLowerCase();
  const namaLower = divNama.toLowerCase();
  const stored = getStoredCustomPasswords();

  // 1. PRIORITAS TERTINGGI: Cek storage password kustom yang sudah diubah user
  if (divId && stored[divId]) {
    div.password = stored[divId];
    return div.password;
  }
  if (divNama && stored[namaLower]) {
    div.password = stored[namaLower];
    return div.password;
  }

  // 2. Jika objek div sudah membawa password kustom valid
  if (div.password && typeof div.password === "string" && div.password.trim().length > 0) {
    const cleanPass = div.password.trim();
    if (divId) saveCustomPassword(divId, cleanPass);
    if (divNama) saveCustomPassword(divNama, cleanPass);
    return cleanPass;
  }

  // 3. Khusus Ketua: Cek kustom password Ketua
  if (idLower === "ketua" || namaLower === "ketua") {
    const ketuaSavedPass = localStorage.getItem("garatika_ketua_password");
    if (ketuaSavedPass) {
      div.password = ketuaSavedPass;
      return div.password;
    }
    if (typeof KREDENSIAL_KETUA !== 'undefined' && KREDENSIAL_KETUA.password) {
      div.password = KREDENSIAL_KETUA.password;
      return div.password;
    }
  }

  // 4. Cek fallback di DEFAULT_DIVISI
  const def = (typeof DEFAULT_DIVISI !== 'undefined' ? DEFAULT_DIVISI : []).find(d => 
    d.id === div.id || (div.nama && d.nama.toLowerCase() === namaLower)
  );
  if (def && def.password && typeof def.password === "string" && def.password.trim().length > 0) {
    div.password = def.password.trim();
    return div.password;
  }

  // 5. Fallback otomatis berdasarkan id/nama divisi
  if (idLower === "pelatih" || namaLower === "pelatih") {
    div.password = "PelatihGaratika40";
  } else if (idLower === "wakil_ketua" || namaLower.includes("wakil")) {
    div.password = "WakilGaratika40";
  } else {
    const cleanNama = (div.nama || "Divisi").replace(/[^a-zA-Z0-9]/g, '');
    div.password = `${cleanNama || "Divisi"}Garatika40`;
  }

  return div.password;
}

// Helper deduplikasi ketat divisi (Menjamin tepat 1 divisi per nama, prioritaskan ID resmi bawaan)
function cleanAndDeduplicateDivisi(rawList) {
  if (!Array.isArray(rawList)) return { unique: [], removedIds: [] };

  const seen = new Set();
  const unique = [];
  const removedIds = [];

  // Prioritaskan ID resmi bawaan jika ada duplikasi nama
  const sorted = [...rawList].sort((a, b) => {
    const isOfficialA = a.id === 'pelatih' || ['ketua', 'wakil_ketua', 'sekretaris', 'bendahara', 'korlap', 'sarpras', 'media_kreatif'].includes(a.id);
    const isOfficialB = b.id === 'pelatih' || ['ketua', 'wakil_ketua', 'sekretaris', 'bendahara', 'korlap', 'sarpras', 'media_kreatif'].includes(b.id);
    if (isOfficialA && !isOfficialB) return -1;
    if (!isOfficialA && isOfficialB) return 1;
    return 0;
  });

  sorted.forEach(div => {
    const cleanNama = (div.nama || "").trim().toLowerCase();
    if (!cleanNama) return;
    if (!seen.has(cleanNama)) {
      seen.add(cleanNama);
      if (typeof getDivisiPassword === 'function') {
        div.password = getDivisiPassword(div);
      }
      unique.push(div);
    } else {
      if (div.id) removedIds.push(div.id);
    }
  });

  // Pastikan divisi Pelatih resmi selalu ada tepat 1
  const hasPelatih = unique.some(d => d.id === 'pelatih' || (d.nama && d.nama.toLowerCase() === 'pelatih'));
  if (!hasPelatih) {
    const defPelatih = (typeof DEFAULT_DIVISI !== 'undefined' ? DEFAULT_DIVISI : []).find(d => d.id === 'pelatih') || {
      id: "pelatih",
      nama: "Pelatih",
      kategori: "pimpinan",
      password: "PelatihGaratika40",
      bisaBuatLaporan: false
    };
    const pelatihClone = { ...defPelatih };
    if (typeof getDivisiPassword === 'function') {
      pelatihClone.password = getDivisiPassword(pelatihClone);
    }
    unique.push(pelatihClone);
  }

  return { unique, removedIds };
}

// Helper resmi urutan divisi: Pelatih #0, Ketua #1, Wakil #2, Sekretaris #3, Bendahara #4, Korlap #5, Sarpras #6, Medkraf #7, lalu divisi lainnya
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

// Helper deteksi dan normalisasi divisi anggota/pengurus
function findDivisiForAnggota(agt) {
  if (!agt) return null;
  const divisionList = Array.isArray(state?.divisi) ? state.divisi : [];
  const divName = String(agt.divisi || "").trim().toLowerCase();
  const divId = String(agt.divisiId || "").trim().toLowerCase();
  const jabatan = String(agt.jabatan || "").trim().toLowerCase();

  // Jika murni bukan divisi
  if ((!divName || divName === "anggota" || divName === "-") && 
      (!divId || divId === "anggota") && 
      (!jabatan || jabatan === "anggota" || jabatan === "-")) {
    return null;
  }

  // 1. Cocokkan ID divisi persis
  if (divId && divId !== "anggota") {
    let match = divisionList.find(d => (d.id || "").toLowerCase() === divId);
    if (match) return match;
  }

  // 2. Cocokkan Nama divisi persis
  if (divName && divName !== "anggota" && divName !== "-") {
    let match = divisionList.find(d => (d.nama || "").toLowerCase() === divName);
    if (match) return match;

    // Bersihkan awalan 'divisi '
    const cleanDivName = divName.replace(/^divisi\s+/i, '').trim();
    match = divisionList.find(d => {
      const cleanD = (d.nama || "").toLowerCase().replace(/^divisi\s+/i, '').trim();
      return cleanD === cleanDivName || cleanD === divName;
    });
    if (match) return match;
  }

  // 3. Cocokkan Jabatan jika ada
  if (jabatan && jabatan !== "anggota" && jabatan !== "-") {
    let match = divisionList.find(d => (d.nama || "").toLowerCase() === jabatan);
    if (match) return match;
    const cleanJabatan = jabatan.replace(/^divisi\s+/i, '').trim();
    match = divisionList.find(d => {
      const cleanD = (d.nama || "").toLowerCase().replace(/^divisi\s+/i, '').trim();
      return cleanD === cleanJabatan;
    });
    if (match) return match;
  }

  // 4. Keyword fuzzy matching (sekretar, bendahar, korlap, sarpras, media, ketua, wakil, pelatih)
  const combined = `${divName} ${divId} ${jabatan}`.toLowerCase();
  const keywords = [
    { key: "sekretar", id: "sekretaris" },
    { key: "bendahar", id: "bendahara" },
    { key: "korlap", id: "korlap" },
    { key: "lapangan", id: "korlap" },
    { key: "sarpras", id: "sarpras" },
    { key: "sarana", id: "sarpras" },
    { key: "media", id: "media_kreatif" },
    { key: "kreatif", id: "media_kreatif" },
    { key: "ketua umum", id: "ketua" },
    { key: "wakil", id: "wakil_ketua" },
    { key: "pelatih", id: "pelatih" }
  ];

  for (const item of keywords) {
    if (combined.includes(item.key)) {
      let match = divisionList.find(d => d.id === item.id);
      if (match) return match;
    }
  }

  // 5. Fallback jika agt.divisi terisi bukan anggota
  if (agt.divisi && String(agt.divisi).trim().toLowerCase() !== "anggota" && String(agt.divisi).trim() !== "-") {
    return { id: agt.divisiId || String(agt.divisi).toLowerCase().replace(/\s+/g, '_'), nama: agt.divisi };
  }

  return null;
}

// Helper komparasi kesamaan nama divisi (dengan toleransi awalan 'Divisi ', spasi, dan casing)
function isSameDivisi(div1, div2) {
  if (!div1 || !div2) return false;
  const s1 = String(div1).trim().toLowerCase().replace(/^divisi\s+/i, '');
  const s2 = String(div2).trim().toLowerCase().replace(/^divisi\s+/i, '');
  if (s1 === s2) return true;
  return s1.replace(/[^a-z0-9]/g, '') === s2.replace(/[^a-z0-9]/g, '');
}

// Window Exports
window.findDivisiForAnggota = findDivisiForAnggota;
window.isSameDivisi = isSameDivisi;
window.cleanAndDeduplicateDivisi = cleanAndDeduplicateDivisi;
window.getDivisiPassword = getDivisiPassword;
window.getStoredCustomPasswords = getStoredCustomPasswords;
window.saveCustomPassword = saveCustomPassword;
window.getDivisiRank = getDivisiRank;
window.compareDivisi = compareDivisi;
window.initStorage = initStorage;
window.normalizeAnggotaObject = normalizeAnggotaObject;
window.normalizeAllAnggota = normalizeAllAnggota;
window.saveState = saveState;
window.resetToDefault = resetToDefault;
window.getMasterSarprasItems = getMasterSarprasItems;
window.saveMasterSarprasItems = saveMasterSarprasItems;
window.syncCurrentSarprasToMaster = syncCurrentSarprasToMaster;
window.guessSarprasKategori = guessSarprasKategori;
window.getDefaultMasterSarpras = getDefaultMasterSarpras;
window.normalizeSarprasItem = normalizeSarprasItem;
window.normalizeMasterSarprasList = normalizeMasterSarprasList;
window.exportAllToJSON = exportAllToJSON;

