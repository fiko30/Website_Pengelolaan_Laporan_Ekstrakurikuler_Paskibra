/**
 * =========================================================================
 * MODUL 8: FORM & LAPORAN DIVISI (laporan_divisi.js)
 * SISTEM INFORMASI & LAPORAN PASKIBRA GARATIKA SMKN 40 JAKARTA
 * =========================================================================
 */

/* ==========================================================================
   7. FORM TEMPLATE LAPORAN PER DIVISI
   ========================================================================== */
/* ==========================================================================
   7. FORM TEMPLATE LAPORAN PER DIVISI (REFERENSI RESMI WEBSITE PASKIB)
   ========================================================================== */

// DAFTAR RESMI ANGGOTA TETAP PASKIBRA GARATIKA (SESUAI FOLDER REFERENSI WEBSITE PASKIB)
const OFFICIAL_SEKRETARIS_MEMBERS_G10 = [
  { name: "Akhsan Zain Saifuddin", class: "XI DKV 1", generation: "G10" },
  { name: "Alifah Annisa Rahman", class: "XI MP", generation: "G10" },
  { name: "Alvina Julia Irfany", class: "XI AKL", generation: "G10" },
  { name: "Amalia Putri", class: "XI AKL", generation: "G10" },
  { name: "Anggun Amelia", class: "XI BR", generation: "G10" },
  { name: "Annisa Dwi Yulistiani", class: "XI DKV 2", generation: "G10" },
  { name: "April Riana", class: "XI MP", generation: "G10" },
  { name: "Eistry Zahwa Aqila", class: "XI DKV 1", generation: "G10" },
  { name: "Gladis Amanda Putri", class: "XI DKV 2", generation: "G10" },
  { name: "Mifta Aulia", class: "XI DKV 2", generation: "G10" },
  { name: "Muhammad Salman Diyaaz", class: "XI BR", generation: "G10" },
  { name: "Nadya Rheva Aulia Putri", class: "XI MP", generation: "G10" },
  { name: "Nur Khansa Maulida", class: "XI MP", generation: "G10" },
  { name: "Nurul Assyifa", class: "XI DKV 2", generation: "G10" },
  { name: "Ratna Ayu Lestari", class: "XI AKL", generation: "G10" },
  { name: "Ratu Veranda", class: "XI DKV 1", generation: "G10" },
  { name: "Rayya Oktaviana", class: "XI MP", generation: "G10" },
  { name: "Rianti Aryanda Vai", class: "XI DKV 2", generation: "G10" },
  { name: "Ridho Afrel Setiawan", class: "XI BR", generation: "G10" },
  { name: "Safira Azizah", class: "XI AKL", generation: "G10" },
  { name: "Sherly Ramadhani", class: "XI MP", generation: "G10" },
  { name: "Zihan Amelia Handani", class: "XI DKV 1", generation: "G10" },
  { name: "Zubair Muhammad Yamani", class: "XI BR", generation: "G10" }
];

const OFFICIAL_SEKRETARIS_MEMBERS_G11 = [
  { name: "Afifa Regina Putri", class: "X BR", generation: "G11" },
  { name: "Amirah Fitria", class: "X AKL", generation: "G11" },
  { name: "Andi Fachri Nasir", class: "X DKV 1", generation: "G11" },
  { name: "Anisa Pitri Yani", class: "X MP", generation: "G11" },
  { name: "Assabiqunal Arimireshwari", class: "X DKV 2", generation: "G11" },
  { name: "Ayudya Haningtyas Prameswari", class: "X AKL", generation: "G11" },
  { name: "Dea Aqilah Marsella", class: "X BR", generation: "G11" },
  { name: "Fakhri Fathurrahman", class: "X DKV 1", generation: "G11" },
  { name: "Farah Auralia Putri", class: "X MP", generation: "G11" },
  { name: "Filza Safa Wongsorejo", class: "X DKV 2", generation: "G11" },
  { name: "Firyaal Labibah", class: "X AKL", generation: "G11" },
  { name: "Fitriyani", class: "X BR", generation: "G11" },
  { name: "Gestiara Ferfira", class: "X DKV 1", generation: "G11" },
  { name: "Haruno Syahira Hakim", class: "X MP", generation: "G11" },
  { name: "Keyla Febriana", class: "X DKV 2", generation: "G11" },
  { name: "Lutfi Hibatul 'Azies", class: "X AKL", generation: "G11" },
  { name: "Mavi Marhamah", class: "X BR", generation: "G11" },
  { name: "Nandiva Qurrata'aini Dzulhujjah", class: "X DKV 1", generation: "G11" },
  { name: "Qotrunnada Cantika", class: "X MP", generation: "G11" },
  { name: "Raditya Ramadhan", class: "X DKV 2", generation: "G11" },
  { name: "Ratu Nirmala Dewi", class: "X AKL", generation: "G11" },
  { name: "Rayyan Fahreza Rafaf", class: "X BR", generation: "G11" },
  { name: "Salwa Zhillal", class: "X DKV 1", generation: "G11" },
  { name: "Shaffa Safitriani", class: "X MP", generation: "G11" },
  { name: "Siti Humairah", class: "X DKV 2", generation: "G11" },
  { name: "Sunni Marom", class: "X AKL", generation: "G11" },
  { name: "Zaskia Nuraliza", class: "X BR", generation: "G11" }
];

function syncOfficialMembersToState() {
  if (!Array.isArray(state.anggota)) state.anggota = [];

  const existingNames = new Set(state.anggota.map(a => (a.nama || "").trim().toLowerCase()));
  let hasNew = false;

  OFFICIAL_SEKRETARIS_MEMBERS_G10.forEach((m, idx) => {
    const cleanName = m.name.trim();
    if (!existingNames.has(cleanName.toLowerCase())) {
      state.anggota.push({
        id: "agt-g10-" + (idx + 1),
        nama: cleanName,
        kelas: m.class,
        angkatan: "G10",
        divisi: "Anggota",
        divisiId: "anggota",
        status: "Aktif"
      });
      existingNames.add(cleanName.toLowerCase());
      hasNew = true;
    }
  });

  OFFICIAL_SEKRETARIS_MEMBERS_G11.forEach((m, idx) => {
    const cleanName = m.name.trim();
    if (!existingNames.has(cleanName.toLowerCase())) {
      state.anggota.push({
        id: "agt-g11-" + (idx + 1),
        nama: cleanName,
        kelas: m.class,
        angkatan: "G11",
        divisi: "Anggota",
        divisiId: "anggota",
        status: "Aktif"
      });
      existingNames.add(cleanName.toLowerCase());
      hasNew = true;
    }
  });

  if (hasNew) {
    if (typeof compareAnggota === 'function') {
      state.anggota.sort(compareAnggota);
    }
    if (typeof saveState === 'function') {
      saveState();
    }
  }
}

function getDaftarAnggotaAbsensi() {
  syncOfficialMembersToState();
  const g10 = [];
  const g11 = [];

  (state.anggota || []).forEach(a => {
    const angk = (a.angkatan || "").trim().toUpperCase();
    const nama = (a.nama || "").trim();
    const divId = (a.divisiId || "").trim().toLowerCase();
    const divNama = (a.divisi || "").trim().toLowerCase();
    const jab = (a.jabatan || "").trim().toLowerCase();
    const role = (a.role || "").trim().toLowerCase();

    // Pastikan Pelatih sama sekali tidak masuk ke daftar absen sekretaris
    const isPelatih = angk === "PELATIH" || 
      divId === "pelatih" || 
      divNama === "pelatih" || 
      jab.includes("pelatih") || 
      role.includes("pelatih") ||
      nama.toLowerCase().startsWith("kak dimas") ||
      nama.toLowerCase().includes("pelatih");

    if (!nama || isPelatih) return;

    if (angk === "G10") {
      g10.push({ id: a.id, name: a.nama, class: a.kelas || "XI", generation: "G10" });
    } else if (angk === "G11") {
      g11.push({ id: a.id, name: a.nama, class: a.kelas || "X", generation: "G11" });
    }
  });

  g10.sort((a, b) => a.name.localeCompare(b.name));
  g11.sort((a, b) => a.name.localeCompare(b.name));

  return { g10, g11 };
}

function getNearestTuesday(d = new Date()) {
  const date = new Date(d);
  if (isNaN(date.getTime())) return new Date().toISOString().split("T")[0];
  const day = date.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  // Hitung selisih hari mundur ke hari Selasa terdekat
  const diff = (day >= 2) ? (day - 2) : (day + 5);
  date.setDate(date.getDate() - diff);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function normalizeTanggalToYMD(rawDate) {
  if (!rawDate) return "";
  if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
    const y = rawDate.getFullYear();
    const m = String(rawDate.getMonth() + 1).padStart(2, '0');
    const d = String(rawDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  let str = String(rawDate).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) return str.split("T")[0];

  // Bersihkan awalan nama hari jika ada (misal "Selasa, " atau "Selasa ")
  const cleanStr = str.replace(/^[a-zA-Z]+,\s*|^[a-zA-Z]+\s+/, "").trim();

  const dmyMatch = cleanStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    return `${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`;
  }

  const indoMonths = {
    jan: '01', januari: '01',
    feb: '02', februari: '02',
    mar: '03', maret: '03',
    apr: '04', april: '04',
    mei: '05', may: '05',
    jun: '06', juni: '06', june: '06',
    jul: '07', juli: '07', july: '07',
    agu: '08', ags: '08', agustus: '08', aug: '08', august: '08',
    sep: '09', september: '09',
    okt: '10', oktober: '10', oct: '10', october: '10',
    nov: '11', november: '11',
    des: '12', desember: '12', dec: '12', december: '12'
  };
  const indoMatch = cleanStr.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/);
  if (indoMatch && indoMonths[indoMatch[2].toLowerCase()]) {
    return `${indoMatch[3]}-${indoMonths[indoMatch[2].toLowerCase()]}-${indoMatch[1].padStart(2, '0')}`;
  }

  // Format Bulan Tahun (contoh: "Oktober 2026")
  const monthYearMatch = cleanStr.match(/^([a-zA-Z]+)\s+(\d{4})$/);
  if (monthYearMatch && indoMonths[monthYearMatch[1].toLowerCase()]) {
    return `${monthYearMatch[2]}-${indoMonths[monthYearMatch[1].toLowerCase()]}-01`;
  }

  const dObj = new Date(str);
  if (!isNaN(dObj.getTime())) {
    const y = dObj.getFullYear();
    const m = String(dObj.getMonth() + 1).padStart(2, '0');
    const d = String(dObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return str;
}

let fpTanggalInstance = null;
window.editingLaporanId = null;
let currentCalendarMode = null;

function initFlatpickrCalendar(mode) {
  const inputEl = document.getElementById("lapTanggal");
  if (!inputEl) return;

  if (!mode) {
    const activeRadio = document.querySelector('input[name="divisiReport"]:checked');
    mode = (activeRadio && (activeRadio.value === 'sarpras' || activeRadio.value === 'media_kreatif')) ? 'monthly' : 'weekly';
  }

  // Jika mode sama dan instance sudah ada, tidak perlu re-init
  if (currentCalendarMode === mode && fpTanggalInstance) {
    return;
  }
  currentCalendarMode = mode;

  if (fpTanggalInstance && typeof fpTanggalInstance.destroy === "function") {
    try {
      fpTanggalInstance.destroy();
    } catch (e) {}
    fpTanggalInstance = null;
  }

  if (typeof flatpickr !== "undefined") {
    try {
      const baseLocale = (typeof flatpickr.l10ns !== "undefined" && flatpickr.l10ns.id) 
        ? flatpickr.l10ns.id 
        : {};

      const idLocale = {
        ...baseLocale,
        firstDayOfWeek: 1, // 1 = Senin sebagai hari pertama, Selasa adalah kolom ke-2 (Sel)
        weekdays: {
          shorthand: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
          longhand: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
        },
        months: {
          shorthand: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
          longhand: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
        }
      };

      // Tentukan batas tanggal: Mulai 1 Oktober 2026, hingga hari ini (real-time)
      const now = new Date();
      const minDateStr = "2026-10-01";
      const maxDateVal = now < new Date(minDateStr) ? "2026-10-31" : now;

      if (mode === "monthly") {
        // ==========================================
        // MODE BULANAN (SARANA & PRASARANA)
        // Kalender bulanan saja dan real-time
        // ==========================================
        const plugins = [];
        if (typeof monthSelectPlugin !== "undefined") {
          plugins.push(new monthSelectPlugin({
            shorthand: false,
            dateFormat: "Y-m-d",
            altFormat: "F Y",
            theme: "light"
          }));
        }

        fpTanggalInstance = flatpickr(inputEl, {
          locale: idLocale,
          plugins: plugins,
          dateFormat: "Y-m-d",
          altInput: true,
          altFormat: "F Y",
          altInputClass: "form-control",
          disableMobile: true,
          allowInput: false,
          static: true,
          showMonths: 1,
          defaultDate: inputEl.value ? inputEl.value : (now >= new Date(minDateStr) ? now : "2026-10-01"),
          minDate: minDateStr,
          maxDate: maxDateVal,
          onChange: function (selectedDates, dateStr) {
            inputEl.value = dateStr || "";
            syncReportDateInfo();
          },
          onClose: function (selectedDates, dateStr) {
            if (dateStr) {
              inputEl.value = dateStr;
              syncReportDateInfo();
            }
          }
        });
      } else {
        // ==========================================
        // MODE MINGGUAN (SEKRETARIS, BENDAHARA, KORLAP)
        // Khusus hari Selasa (latihan mingguan)
        // ==========================================
        fpTanggalInstance = flatpickr(inputEl, {
          locale: idLocale,
          dateFormat: "Y-m-d",
          altInput: true,
          altFormat: "j F Y",
          altInputClass: "form-control",
          disableMobile: true,
          allowInput: false,
          static: true,
          showMonths: 1,
          defaultDate: inputEl.value ? inputEl.value : null,
          minDate: minDateStr,
          maxDate: maxDateVal,
          onReady: function (selectedDates, dateStr, instance) {
            if (instance.calendarContainer) {
              instance.calendarContainer.classList.add("flatpickr-weekly-only");
            }
          },
          onOpen: function (selectedDates, dateStr, instance) {
            if (instance.calendarContainer) {
              instance.calendarContainer.classList.add("flatpickr-weekly-only");
            }
          },
          disable: [
            function (date) {
              // HANYA HARI SELASA (date.getDay() === 2) YANG BISA DIKLIK / DIBUKA
              return date.getDay() !== 2;
            }
          ],
          onDayCreate: function (dObj, dStr, fp, dayElem) {
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            if (dayElem.dateObj && dayElem.dateObj > today) {
              dayElem.classList.add("future-day-hidden");
            }
          },
          onChange: function (selectedDates, dateStr) {
            inputEl.value = dateStr || "";
            syncReportDateInfo();
          },
          onClose: function (selectedDates, dateStr) {
            if (dateStr) {
              inputEl.value = dateStr;
              syncReportDateInfo();
            }
          }
        });
      }

      if (!window._flatpickrScrollListenerAttached) {
        window._flatpickrScrollListenerAttached = true;
        document.addEventListener("scroll", () => {
          if (fpTanggalInstance && fpTanggalInstance.isOpen) {
            fpTanggalInstance.close();
          }
        }, { passive: true, capture: true });
      }
    } catch (err) {
      console.warn("Gagal inisialisasi Flatpickr:", err);
    }
  } else {
    inputEl.addEventListener("change", () => {
      const d = new Date(inputEl.value);
      if (mode !== 'monthly' && d.getDay() !== 2) {
        if (typeof showSmallAlert === 'function') {
          showSmallAlert({
            icon: 'warning',
            title: 'Bukan Hari Selasa',
            text: 'Jadwal latihan rutin Paskibra hanya pada hari Selasa. Sistem otomatis mengalihkan ke hari Selasa terdekat.'
          });
        }
        inputEl.value = getNearestTuesday(d);
      }
      syncReportDateInfo();
    });
  }

  syncReportDateInfo();
}

function getReportDateInfo() {
  const tglInput = document.getElementById("lapTanggal");
  const rawDate = (tglInput?.value || "").trim();
  const dateStr = normalizeTanggalToYMD(rawDate);

  const displayBulan = document.getElementById("displayBulanDrive");
  const selectBulan = document.getElementById("lapKategoriBulan");

  const activeRadio = document.querySelector('input[name="divisiReport"]:checked');
  const isMonthlyDiv = (activeRadio && (activeRadio.value === 'sarpras' || activeRadio.value === 'media_kreatif'));

  if (!dateStr) {
    if (displayBulan) {
      displayBulan.innerHTML = `Folder: <span style="color: #94a3b8; font-style: italic; font-weight: 500;">Pilih ${isMonthlyDiv ? 'bulan periode' : 'tanggal latihan'} terlebih dahulu</span>`;
    }
    if (selectBulan) {
      selectBulan.value = "";
    }
    return { dateStr: "", mingguKe: "-", tanggalIndo: "-", bulanNama: "", folderExists: false };
  }

  const parts = dateStr.split("-");
  const dObj = parts.length === 3
    ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    : new Date(dateStr);

  const day = isNaN(dObj.getDate()) ? 1 : dObj.getDate();
  const mingguKe = isMonthlyDiv ? "-" : (Math.ceil(day / 7) || 1);

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const bulanNama = `${monthNames[isNaN(dObj.getMonth()) ? 9 : dObj.getMonth()]} ${dObj.getFullYear() || 2026}`;

  const tanggalIndo = isMonthlyDiv
    ? bulanNama
    : ((typeof formatHariTanggalIndo === "function")
      ? formatHariTanggalIndo(dateStr)
      : ((typeof formatTanggalLengkap === "function") ? formatTanggalLengkap(dateStr) : dateStr));

  // Validasi apakah folder bulan Google Drive sudah dibuat di sistem (state.kategoriBulan)
  const targetBulan = bulanNama.toLowerCase().trim();
  const folderExists = targetBulan.includes("oktober 2026") || (Array.isArray(state.kategoriBulan) && state.kategoriBulan.some(kb => {
    const lbl = (kb.label || kb.folder || kb.name || "").trim().toLowerCase();
    const idVal = (kb.id || "").trim().toLowerCase();
    return lbl === targetBulan || lbl.includes(targetBulan) || targetBulan.includes(lbl) || idVal === targetBulan;
  }));

  // Sinkronkan lencana dan display bulan drive
  if (displayBulan) {
    if (folderExists) {
      displayBulan.innerHTML = `Folder: <strong style="color: #0f172a;">${escapeHTML(bulanNama)}</strong> <span style="background: #ecfdf5; color: #059669; font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; border: 1px solid #a7f3d0; margin-left: 6px;"><i class="fa-solid fa-circle-check" style="margin-right: 3px;"></i>Tersedia</span>`;
    } else {
      displayBulan.innerHTML = `Folder: <strong style="color: #dc2626;">${escapeHTML(bulanNama)}</strong> <span style="background: #fef2f2; color: #dc2626; font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; border: 1px solid #fecaca; margin-left: 6px;"><i class="fa-solid fa-triangle-exclamation" style="margin-right: 3px;"></i>Belum Dibuat</span>`;
    }
  }

  if (selectBulan) {
    selectBulan.value = folderExists ? bulanNama : "";
  }

  return { dateStr, mingguKe, tanggalIndo, bulanNama, folderExists };
}

function syncReportDateInfo() {
  const info = getReportDateInfo();
  document.querySelectorAll(".sync-report-minggu").forEach(el => {
    if (el.tagName === "INPUT") el.value = info.mingguKe;
    else el.textContent = info.mingguKe;
  });
  document.querySelectorAll(".sync-report-tanggal").forEach(el => {
    if (el.tagName === "INPUT") el.value = info.tanggalIndo;
    else el.textContent = info.tanggalIndo;
  });
}

function initDynamicReportForm() {
  const radios = document.querySelectorAll('input[name="divisiReport"]');
  radios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      updateRadioLabelStyles();
      renderDynamicReportFields(e.target.value);
    });
  });

  initFlatpickrCalendar();
  updateRadioLabelStyles();

  const isPimpinan = (typeof isUserPimpinan === 'function' && state.currentUser) ? isUserPimpinan(state.currentUser) : false;
  const initialDiv = (!isPimpinan && typeof normalizeUserDivisionId === 'function' && state.currentUser)
    ? normalizeUserDivisionId(state.currentUser)
    : "sekretaris";

  renderDynamicReportFields(initialDiv);
}

function updateRadioLabelStyles() {
  document.querySelectorAll(".divisi-radio-label").forEach(label => {
    const input = label.querySelector("input");
    label.classList.toggle("selected", Boolean(input && input.checked));
  });
}

function renderDynamicReportFields(divisiKey) {
  const container = document.getElementById("dynamicTemplateContainer");
  if (!container) return;

  const activeDiv = divisiKey || "sekretaris";

  // Perbarui UI label tanggal, placeholder, lencana, dan mode kalender sesuai divisi
  const lblText = document.getElementById("lblTextLapTanggal");
  const badgeMinggu = document.getElementById("badgeMingguWrapper");
  const subText = document.getElementById("subTextLapTanggal");
  const lapTgl = document.getElementById("lapTanggal");

  if (activeDiv === "sarpras" || activeDiv === "media_kreatif") {
    if (lblText) lblText.textContent = "Bulan Periode Laporan";
    if (lapTgl) lapTgl.placeholder = "Pilih Bulan Laporan (Real-Time)...";
    if (badgeMinggu) {
      badgeMinggu.innerHTML = '<i class="fa-solid fa-calendar-check" style="margin-right: 4px;"></i> Laporan Bulanan';
      badgeMinggu.style.backgroundColor = '#2563eb';
    }
    if (subText) {
      const divLabel = activeDiv === "sarpras" ? "Sarana & Prasarana" : "Media Kreatif";
      subText.innerHTML = `<i class="fa-solid fa-circle-info" style="color: #2563eb; margin-right: 4px;"></i>Laporan ${divLabel} direkap bulanan secara real-time.`;
    }
    initFlatpickrCalendar("monthly");
  } else {
    if (lblText) lblText.textContent = "Tanggal Latihan (Hari Selasa)";
    if (lapTgl) lapTgl.placeholder = "Pilih Hari Latihan (Selasa)...";
    if (badgeMinggu) {
      const curMinggu = document.querySelector(".sync-report-minggu")?.textContent || "-";
      badgeMinggu.innerHTML = `Minggu Ke-<span class="sync-report-minggu">${curMinggu}</span>`;
      badgeMinggu.style.backgroundColor = "var(--accent-red)";
    }
    if (subText) {
      subText.innerHTML = '<i class="fa-solid fa-circle-info" style="color: var(--accent-red); margin-right: 4px;"></i>Hanya hari Selasa yang dapat dipilih (latihan mingguan).';
    }
    initFlatpickrCalendar("weekly");
  }

  const dateInfo = getReportDateInfo();

  if (activeDiv === "sekretaris") {
    // Ambil data anggota resmi G10 dan G11 langsung dari state.anggota terpusat
    const { g10: g10Members, g11: g11Members } = getDaftarAnggotaAbsensi();

    // Auto set nama pelapor dari akun login
    const pelaporInput = document.getElementById("lapPelapor");
    if (pelaporInput && state.currentUser) {
      pelaporInput.value = state.currentUser.nama;
    }

    container.innerHTML = `
      <div class="template-section-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div>
            <span class="template-header-tag" style="background: #0f172a; font-size: 0.75rem; padding: 4px 10px; border-radius: 6px;">
              <i class="fa-solid fa-clipboard-user" style="color: var(--accent-red); margin-right: 4px;"></i> Formulir Laporan Rutin Sekretaris
            </span>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 6px 0 0 0;">
              Pengisian dan pengelolaan Formulir Absensi Rutin Mingguan Garatika Jayakarta.
            </p>
          </div>
          <div class="report-date-badge-box" style="margin-bottom:0; padding: 6px 12px; background: #ffffff; border: 1px solid var(--border-medium); border-radius: 8px;">
            <span class="badge-minggu" style="background: var(--accent-red); color: #fff; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 0.775rem;">
              Minggu Ke-<span class="sync-report-minggu">${dateInfo.mingguKe}</span>
            </span>
            <span style="font-size: 0.825rem; font-weight: 600; color: #1e293b; margin-left: 6px;" class="sync-report-tanggal">${dateInfo.tanggalIndo}</span>
          </div>
        </div>

        <!-- Kolom Judul Laporan (Dikosongkan agar diisi sendiri oleh pengguna) -->
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="lapJudulUtama" style="font-weight: 700; font-size: 0.85rem; color: #0f172a; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-heading" style="color: var(--accent-red);"></i> Judul Laporan <span class="req">*</span>
          </label>
          <input type="text" id="lapJudulUtama" class="form-control" placeholder="Masukkan Judul Laporan" required style="font-weight: 600;" value="${escapeHTML(document.getElementById('lapJudul')?.value || '')}" oninput="document.getElementById('lapJudul').value = this.value;">
        </div>

        <!-- Pilihan Angkatan Laporan (Dipisah: 1 Laporan per 1 Angkatan) -->
        <div class="generation-filter-wrapper">
          <div class="generation-filter-label">
            <i class="fa-solid fa-users" style="color: var(--accent-red);"></i> Pilih Angkatan untuk Laporan Ini:
          </div>
          <div class="btn-gen-filter-group" id="genFilterGroupSek">
            <button type="button" class="btn-gen-filter ${(window.currentSekGen || 'G10') === 'G10' ? 'active' : ''}" id="tabBtnSekG10" onclick="switchSekretarisGenTab('G10')">
              <i class="fa-solid fa-user-group"></i>
              <span>Angkatan G10 (Kelas XI)</span>
              <span class="badge-count" id="badgeSekCountG10">${g10Members.length} Anak</span>
            </button>
            <button type="button" class="btn-gen-filter ${(window.currentSekGen || 'G10') === 'G11' ? 'active' : ''}" id="tabBtnSekG11" onclick="switchSekretarisGenTab('G11')">
              <i class="fa-solid fa-user-group"></i>
              <span>Angkatan G11 (Kelas X)</span>
              <span class="badge-count" id="badgeSekCountG11">${g11Members.length} Anak</span>
            </button>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">
            <i class="fa-solid fa-circle-info" style="color: var(--accent-red); margin-right: 4px;"></i>
            Laporan absensi dibuat terpisah per angkatan. Anda cukup melengkapi kehadiran angkatan yang dipilih saat ini. Jika ingin melaporkan 2 angkatan, simpan masing-masing menjadi 2 laporan.
          </div>
        </div>

        <!-- Rekap Realtime Kehadiran Angkatan Terpilih -->
        <div class="report-summary-bar" id="sekRekapBar">
          <div class="report-summary-chip hadir"><i class="fa-solid fa-circle-check"></i> Hadir: <span id="sekTotalHadir">0</span></div>
          <div class="report-summary-chip izin"><i class="fa-solid fa-envelope-open-text"></i> Izin: <span id="sekTotalIzin">0</span></div>
          <div class="report-summary-chip alfa"><i class="fa-solid fa-circle-xmark"></i> Alfa: <span id="sekTotalAlfa">0</span></div>
          <div class="report-summary-chip total"><i class="fa-solid fa-calculator"></i> Total Angkatan (<span id="sekCurrentGenLabel">${window.currentSekGen || 'G10'}</span>): <span id="sekTotalSemua">0</span></div>
        </div>

        <!-- Section G10 -->
        <div id="sectionSekG10" style="display: ${(window.currentSekGen || 'G10') === 'G10' ? 'block' : 'none'};">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <strong style="font-size:0.9rem; color:#0f172a;"><i class="fa-solid fa-clipboard-user" style="color:var(--accent-red); margin-right:4px;"></i> Daftar Absensi G10 (Kelas XI)</strong>
              <span class="badge" style="background:#f1f5f9; color:#475569; font-size:0.75rem; border:1px solid #cbd5e1;" id="tagCountG10">${g10Members.length} Anggota</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="setSemuaKehadiranSek('G10', 'Hadir')" title="Set semua status kehadiran G10 menjadi Hadir">
                <i class="fa-solid fa-check-double" style="margin-right:4px;"></i> Set Semua Hadir
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="bukaModalTambahBarisAbsensiSek('G10')">
                <i class="fa-solid fa-plus" style="margin-right:4px;"></i> Tambah Anggota (G10)
              </button>
            </div>
          </div>
          <div class="table-responsive" style="max-height: 420px; overflow-y: auto; border: 1px solid var(--border-medium); border-radius: 8px; margin-bottom: 14px; background:#fff;">
            <table class="report-table-compact">
              <thead>
                <tr>
                  <th style="width:45px; text-align:center;">No</th>
                  <th style="min-width:190px;">Nama Anak</th>
                  <th style="width:120px; text-align:center;">Kelas</th>
                  <th style="width:140px; text-align:center;">Status Kehadiran</th>
                  <th>Keterangan Izin</th>
                  <th style="width:90px; text-align:center;">Aksi</th>
                </tr>
              </thead>
              <tbody id="tbodySekG10"></tbody>
            </table>
          </div>
        </div>

        <!-- Section G11 -->
        <div id="sectionSekG11" style="display: ${(window.currentSekGen || 'G10') === 'G11' ? 'block' : 'none'};">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <strong style="font-size:0.9rem; color:#0f172a;"><i class="fa-solid fa-clipboard-user" style="color:var(--accent-red); margin-right:4px;"></i> Daftar Absensi G11 (Kelas X)</strong>
              <span class="badge" style="background:#f1f5f9; color:#475569; font-size:0.75rem; border:1px solid #cbd5e1;" id="tagCountG11">${g11Members.length} Anggota</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="setSemuaKehadiranSek('G11', 'Hadir')" title="Set semua status kehadiran G11 menjadi Hadir">
                <i class="fa-solid fa-check-double" style="margin-right:4px;"></i> Set Semua Hadir
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="bukaModalTambahBarisAbsensiSek('G11')">
                <i class="fa-solid fa-plus" style="margin-right:4px;"></i> Tambah Anggota (G11)
              </button>
            </div>
          </div>
          <div class="table-responsive" style="max-height: 420px; overflow-y: auto; border: 1px solid var(--border-medium); border-radius: 8px; margin-bottom: 14px; background:#fff;">
            <table class="report-table-compact">
              <thead>
                <tr>
                  <th style="width:45px; text-align:center;">No</th>
                  <th style="min-width:190px;">Nama Anak</th>
                  <th style="width:120px; text-align:center;">Kelas</th>
                  <th style="width:140px; text-align:center;">Status Kehadiran</th>
                  <th>Keterangan Izin</th>
                  <th style="width:90px; text-align:center;">Aksi</th>
                </tr>
              </thead>
              <tbody id="tbodySekG11"></tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    isiTabelAbsensiSekretaris(g10Members, g11Members);

  } else if (divisiKey === "bendahara") {
    // Ambil data anggota resmi G10 dan G11 langsung dari database state.anggota terpusat
    const { g10: g10Members, g11: g11Members } = getDaftarAnggotaAbsensi();

    // Auto set nama pelapor dari akun login
    const pelaporInput = document.getElementById("lapPelapor");
    if (pelaporInput && state.currentUser) {
      pelaporInput.value = state.currentUser.nama;
    }

    container.innerHTML = `
      <div class="template-section-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div>
            <span class="template-header-tag" style="background: #0f172a; font-size: 0.75rem; padding: 4px 10px; border-radius: 6px;">
              <i class="fa-solid fa-wallet" style="color: var(--accent-red); margin-right: 4px;"></i> Formulir Laporan Kas Mingguan Bendahara
            </span>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 6px 0 0 0;">
              Pengisian dan pengelolaan Kas Ekstrakurikuler Garatika Jayakarta.
            </p>
          </div>
          <div class="report-date-badge-box" style="margin-bottom:0; padding: 6px 12px; background: #ffffff; border: 1px solid var(--border-medium); border-radius: 8px; white-space: nowrap; display: inline-flex; align-items: center;">
            <span class="badge-minggu" style="background: var(--accent-red); color: #fff; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 0.775rem;">
              Minggu Ke-<span class="sync-report-minggu">${dateInfo.mingguKe}</span>
            </span>
            <span style="font-size: 0.825rem; font-weight: 600; color: #1e293b; margin-left: 6px;" class="sync-report-tanggal">${dateInfo.tanggalIndo}</span>
          </div>
        </div>

        <!-- Kolom Judul Laporan -->
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="lapJudulUtama" style="font-weight: 700; font-size: 0.85rem; color: #0f172a; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-heading" style="color: var(--accent-red);"></i> Judul Laporan <span class="req">*</span>
          </label>
          <input type="text" id="lapJudulUtama" class="form-control" placeholder="Masukkan Judul Laporan Kas" required style="font-weight: 600;" value="${escapeHTML(document.getElementById('lapJudul')?.value || '')}" oninput="document.getElementById('lapJudul').value = this.value;">
        </div>

        <div class="form-group" style="margin-bottom: 16px;">
          <label for="benSaldoAwal" style="font-weight: 700; font-size: 0.85rem; color: #0f172a; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-vault" style="color: var(--accent-red);"></i> Saldo Awal Kas
          </label>
          <div style="position: relative; display: flex; align-items: center; max-width: 320px;">
            <span style="position: absolute; left: 12px; font-weight: 800; color: #475569; font-size: 0.9rem; pointer-events: none; user-select: none;">Rp</span>
            <input type="text" id="benSaldoAwal" class="form-control" placeholder="0" value="0" inputmode="numeric" style="padding-left: 38px; font-weight: 700; font-size: 0.95rem; color: #0f172a;" oninput="formatInputRupiahBen(this)" onblur="if(!this.value.trim()){this.value='0'; hitungBendaharaRekap();}">
          </div>
        </div>

        <div class="ben-outer-wrapper" style="background: #f8fafc; border: 1px solid var(--border-medium); border-radius: 10px; padding: 16px; margin-bottom: 16px;">
          <div style="text-align: center; margin-bottom: 14px;">
            <h4 class="kas-header-title">
              <span class="kas-title-main"><i class="fa-solid fa-coins" style="color: #eab308; margin-right: 6px;"></i> Pembayaran Kas Anggota</span>
              <span class="kas-title-rate">(Rp 2.000 / Anak)</span>
            </h4>
            <p style="font-size: 0.775rem; color: var(--text-muted); margin: 0;">
              Status "Bayar" otomatis mengaktifkan pilihan metode pembayaran (Cash atau QRIS).
            </p>
          </div>

          <!-- Kas G10 -->
          <div id="sectionBenG10" class="ben-section-box" style="background: #ffffff; border: 1px solid var(--border-medium); border-radius: 8px; padding: 14px; margin-bottom: 22px;">
            <div class="ben-section-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
              <strong style="font-size:0.875rem; color:#1e293b; display:flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-user-group" style="color:var(--accent-red);"></i> Kas Pembayaran G10 (Kelas XI)
                <span id="badgeKasCountG10" class="badge" style="background:#eff6ff; color:#1d4ed8; font-size:0.75rem; font-weight:700;">${g10Members.length} Anak</span>
              </strong>
              <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="setSemuaKasBen('G10', 'Bayar', 'Cash')" title="Set Semua Bayar Cash" style="font-size:0.75rem; display:inline-flex; align-items:center; gap:5px; font-weight:600;">
                  <i class="fa-solid fa-money-bill-wave" style="color:#16a34a;"></i> Bayar Cash
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="setSemuaKasBen('G10', 'Bayar', 'QRIS')" title="Set Semua Bayar QRIS" style="font-size:0.75rem; display:inline-flex; align-items:center; gap:5px; font-weight:600;">
                  <i class="fa-solid fa-qrcode" style="color:#2563eb;"></i> Bayar QRIS
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="setSemuaKasBen('G10', 'Tidak Bayar')" title="Reset Pembayaran" style="font-size:0.75rem; display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; padding:0;">
                  <i class="fa-solid fa-rotate-left" style="color:#64748b;"></i>
                </button>
              </div>
            </div>
            <div class="table-responsive" style="max-height: 280px; overflow-y: auto; overflow-x: hidden; border: 1px solid var(--border-medium); border-radius: 6px;">
              <table class="report-table-compact" style="width: 100%; table-layout: auto;">
                <thead>
                  <tr>
                    <th style="width:40px; text-align:center;">No</th>
                    <th style="text-align:left;">Nama Lengkap Anggota</th>
                    <th style="width:85px; text-align:center;">Kelas</th>
                    <th style="width:130px; text-align:center;">Pembayaran</th>
                    <th style="width:110px; text-align:center;">Metode</th>
                  </tr>
                </thead>
                <tbody id="tbodyBenG10"></tbody>
              </table>
            </div>
          </div>

          <!-- Kas G11 -->
          <div id="sectionBenG11" class="ben-section-box" style="background: #ffffff; border: 1px solid var(--border-medium); border-radius: 8px; padding: 14px;">
            <div class="ben-section-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
              <strong style="font-size:0.875rem; color:#1e293b; display:flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-user-group" style="color:var(--accent-red);"></i> Kas Pembayaran G11 (Kelas X)
                <span id="badgeKasCountG11" class="badge" style="background:#eff6ff; color:#1d4ed8; font-size:0.75rem; font-weight:700;">${g11Members.length} Anak</span>
              </strong>
              <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="setSemuaKasBen('G11', 'Bayar', 'Cash')" title="Set Semua Bayar Cash" style="font-size:0.75rem; display:inline-flex; align-items:center; gap:5px; font-weight:600;">
                  <i class="fa-solid fa-money-bill-wave" style="color:#16a34a;"></i> Bayar Cash
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="setSemuaKasBen('G11', 'Bayar', 'QRIS')" title="Set Semua Bayar QRIS" style="font-size:0.75rem; display:inline-flex; align-items:center; gap:5px; font-weight:600;">
                  <i class="fa-solid fa-qrcode" style="color:#2563eb;"></i> Bayar QRIS
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="setSemuaKasBen('G11', 'Tidak Bayar')" title="Reset Pembayaran" style="font-size:0.75rem; display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; padding:0;">
                  <i class="fa-solid fa-rotate-left" style="color:#64748b;"></i>
                </button>
              </div>
            </div>
            <div class="table-responsive" style="max-height: 280px; overflow-y: auto; overflow-x: hidden; border: 1px solid var(--border-medium); border-radius: 6px;">
              <table class="report-table-compact" style="width: 100%; table-layout: auto;">
                <thead>
                  <tr>
                    <th style="width:40px; text-align:center;">No</th>
                    <th style="text-align:left;">Nama Lengkap Anggota</th>
                    <th style="width:85px; text-align:center;">Kelas</th>
                    <th style="width:130px; text-align:center;">Pembayaran</th>
                    <th style="width:110px; text-align:center;">Metode</th>
                  </tr>
                </thead>
                <tbody id="tbodyBenG11"></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Pemasukan Tambahan & Pengeluaran Opsional -->
        <div class="form-grid-2" style="margin-bottom: 22px;">
          <!-- Pemasukan Tambahan -->
          <div id="sectionBenPemasukan" class="ben-section-box" style="background: #ffffff; border: 1px solid var(--border-medium); border-radius: 8px; padding: 14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <strong style="font-size: 0.85rem; color: #1e293b;"><i class="fa-solid fa-arrow-down-long" style="color: #16a34a; margin-right: 4px;"></i> Pemasukan Tambahan</strong>
              <button type="button" class="btn btn-secondary btn-sm" onclick="tambahPemasukanTambahan()" title="Tambah Pemasukan" style="white-space: nowrap;"><i class="fa-solid fa-plus"></i> Tambah</button>
            </div>
            <div class="table-responsive" style="max-height: 220px; overflow-y: auto; border: 1px solid var(--border-light); border-radius: 6px;">
              <table class="report-table-compact">
                <thead>
                  <tr>
                    <th>Sumber Pemasukan</th>
                    <th style="width:140px; text-align:center;">Nominal (Rp)</th>
                    <th style="width:110px; text-align:center;">Metode</th>
                    <th style="width:40px; text-align:center;">Aksi</th>
                  </tr>
                </thead>
                <tbody id="tbodyPemasukanLain"></tbody>
              </table>
            </div>
          </div>

          <!-- Pengeluaran Opsional -->
          <div id="sectionBenPengeluaran" class="ben-section-box" style="background: #ffffff; border: 1px solid var(--border-medium); border-radius: 8px; padding: 14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <strong style="font-size: 0.85rem; color: #1e293b;"><i class="fa-solid fa-arrow-up-long" style="color: var(--accent-red); margin-right: 4px;"></i> Pengeluaran Opsional</strong>
              <button type="button" class="btn btn-secondary btn-sm" onclick="tambahPengeluaranOpsional()" title="Tambah Pengeluaran" style="white-space: nowrap;"><i class="fa-solid fa-plus"></i> Tambah</button>
            </div>
            <div class="table-responsive" style="max-height: 220px; overflow-y: auto; border: 1px solid var(--border-light); border-radius: 6px;">
              <table class="report-table-compact">
                <thead>
                  <tr>
                    <th>Rincian Pengeluaran</th>
                    <th style="width:140px; text-align:center;">Nominal (Rp)</th>
                    <th style="width:110px; text-align:center;">Metode</th>
                    <th style="width:40px; text-align:center;">Aksi</th>
                  </tr>
                </thead>
                <tbody id="tbodyPengeluaran"></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Metric Cards Realtime Ringkasan Kas (Termasuk Saldo Awal) -->
        <div class="metric-cards-grid" style="margin-bottom: 22px;">
          <div class="metric-card-box">
            <small>Saldo Awal</small>
            <div class="val-text" id="benDisplaySaldoAwal" style="color: #475569;">Rp 0</div>
          </div>
          <div class="metric-card-box">
            <small>Total Cash</small>
            <div class="val-text" id="benDisplayCash">Rp 0</div>
          </div>
          <div class="metric-card-box">
            <small>Total QRIS</small>
            <div class="val-text" id="benDisplayQris">Rp 0</div>
          </div>
          <div class="metric-card-box">
            <small>Pemasukan</small>
            <div class="val-text" id="benDisplayPemasukan" style="color: #16a34a;">Rp 0</div>
          </div>
          <div class="metric-card-box">
            <small>Pengeluaran</small>
            <div class="val-text" id="benDisplayPengeluaran" style="color: var(--accent-red);">Rp 0</div>
          </div>
          <div class="metric-card-box saldo-box">
            <small>Saldo Akhir</small>
            <div class="val-text" id="benDisplaySaldo">Rp 0</div>
          </div>
        </div>
      </div>
    `;

    isiTabelKasBendahara(g10Members, g11Members);

  } else if (divisiKey === "korlap") {
    container.innerHTML = `
      <div class="template-section-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
          <span class="template-header-tag" style="background: #1e293b;"><i class="fa-solid fa-flag" style="color: #ef4444; margin-right: 6px;"></i> Form Divisi Koordinator Lapangan</span>
          <div class="report-date-badge-box" style="margin-bottom:0; padding: 4px 10px;">
            <span class="badge-minggu">Minggu Ke-<span class="sync-report-minggu">${dateInfo.mingguKe}</span></span>
            <span style="font-size: 0.8rem; font-weight: 600; color: #475569;" class="sync-report-tanggal">${dateInfo.tanggalIndo}</span>
          </div>
        </div>

        <!-- Kolom Judul Laporan -->
        <div class="form-group" style="margin-bottom: 22px;">
          <label for="lapJudulUtama" style="font-weight: 700; font-size: 0.85rem; color: #0f172a; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-heading" style="color: var(--accent-red);"></i> Judul Laporan <span class="req">*</span>
          </label>
          <input type="text" id="lapJudulUtama" class="form-control" placeholder="Masukkan Judul Laporan Koordinator Lapangan" required style="font-weight: 600;" value="${escapeHTML(document.getElementById('lapJudul')?.value || '')}" oninput="document.getElementById('lapJudul').value = this.value;">
        </div>

        <!-- Materi Latihan (1 Tempat Input Panjang) -->
        <div class="form-group" style="margin-bottom: 22px;">
          <label for="korlapMateri" style="font-weight: 700; font-size: 0.85rem; color: #0f172a; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-book-bookmark" style="color: var(--accent-red);"></i> Materi Latihan <span class="req">*</span>
          </label>
          <textarea id="korlapMateri" class="form-control" rows="4" placeholder="Masukkan materi latihan / apa saja yang dilakukan di lapangan..." required style="font-weight: 500;" oninput="this.classList.remove('input-error')"></textarea>
        </div>

        <!-- Evaluasi (1 Tempat Input Panjang) -->
        <div class="form-group" style="margin-bottom: 14px;">
          <label for="korlapEvaluasi" style="font-weight: 700; font-size: 0.85rem; color: #0f172a; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-clipboard-check" style="color: #16a34a;"></i> Evaluasi <span class="req">*</span>
          </label>
          <textarea id="korlapEvaluasi" class="form-control" rows="4" placeholder="Masukkan evaluasi kegiatan / apa evaluasinya..." required style="font-weight: 500;" oninput="this.classList.remove('input-error')"></textarea>
        </div>
      </div>
    `;

  } else if (divisiKey === "sarpras") {
    const defaultItems = (typeof getMasterSarprasItems === 'function')
      ? getMasterSarprasItems()
      : ((typeof SARPRAS_INVENTORY_ITEMS !== 'undefined' && SARPRAS_INVENTORY_ITEMS.length)
        ? SARPRAS_INVENTORY_ITEMS
        : [
          "Slayer", "Slempang", "Garuda", "Kopel", "Sarung Tangan",
          "Sepatu Pantofel Cewe", "Sepatu Pantofel Tali Cowo", "Sepatu Pantofel Laki-Laki",
          "Peci Cewe Cowo", "Baju PDU Cewe", "Rok PDU Cewe", "Celana PDU Cowo",
          "Bendera", "Taplak Bendera", "Talikur", "Belt Putih", "Peci Perempuan", "Peci Laki-Laki", "Evolet"
        ]);

    container.innerHTML = `
      <div class="template-section-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <span class="template-header-tag" style="background: #1e293b;">Form Divisi Sarana & Prasarana</span>
          <div class="report-date-badge-box" style="margin-bottom:0; padding: 4px 10px;">
            <span class="badge-minggu" style="background: #2563eb; color: #ffffff;"><i class="fa-solid fa-calendar-check" style="margin-right: 4px;"></i> Rekap Bulanan</span>
            <span style="font-size: 0.8rem; font-weight: 600; color: #475569;" class="sync-report-tanggal">${dateInfo.bulanNama || dateInfo.tanggalIndo}</span>
          </div>
        </div>

        <!-- Kolom Judul Laporan -->
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="lapJudulUtama" style="font-weight: 700; font-size: 0.85rem; color: #0f172a; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-heading" style="color: var(--accent-red);"></i> Judul Laporan <span class="req">*</span>
          </label>
          <input type="text" id="lapJudulUtama" class="form-control" placeholder="Masukkan Judul Laporan Sarana & Prasarana" required style="font-weight: 600;" value="${escapeHTML(document.getElementById('lapJudul')?.value || '')}" oninput="document.getElementById('lapJudul').value = this.value;">
        </div>

        <!-- 3 Kartu Ringkasan Inventaris (Metrik) -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; text-align: center;">
          <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 10px 8px;">
            <div style="font-size: 0.72rem; color: #166534; font-weight: 700; text-transform: uppercase;">
              <i class="fa-solid fa-circle-check" style="margin-right: 4px;"></i> Total Layak Pakai
            </div>
            <div id="sarSummaryLayak" style="font-size: 1.35rem; font-weight: 800; color: #15803d; margin-top: 4px;">0</div>
          </div>
          <div style="background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 10px; padding: 10px 8px;">
            <div style="font-size: 0.72rem; color: #991b1b; font-weight: 700; text-transform: uppercase;">
              <i class="fa-solid fa-circle-xmark" style="margin-right: 4px;"></i> Total Tidak Layak
            </div>
            <div id="sarSummaryTidakLayak" style="font-size: 1.35rem; font-weight: 800; color: #dc2626; margin-top: 4px;">0</div>
          </div>
          <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 10px 8px;">
            <div style="font-size: 0.72rem; color: #334155; font-weight: 700; text-transform: uppercase;">
              <i class="fa-solid fa-boxes-stacked" style="margin-right: 4px;"></i> Total Barang
            </div>
            <div id="sarSummarySemua" style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-top: 4px;">0</div>
          </div>
        </div>

        <!-- Header Inventarisasi Perlengkapan Paskibra -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
          <strong style="font-size:0.875rem; color:#0f172a; display:inline-flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-boxes-stacked" style="color:var(--accent-red); flex-shrink: 0;"></i>
            <span class="desktop-sarpras-label">Inventarisasi Perlengkapan Paskibra</span>
            <span class="mobile-sarpras-label">Perlengkapan Paskibra</span>
          </strong>
          <div style="display:flex; align-items:center; gap:8px; flex-shrink: 0;">
            <span id="sarBadgeCount" style="background: #f1f5f9; color: #475569; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: nowrap;">${defaultItems.length} Barang</span>
            <button type="button" class="btn btn-primary btn-sm" onclick="tambahBarangSarpras()" style="background:#b91c1c; border-color:#b91c1c; color:#ffffff; font-weight:700; font-size:0.75rem; padding:4px 10px; border-radius:6px; display:inline-flex; align-items:center; gap:5px; cursor:pointer; box-shadow:0 1px 2px rgba(185,28,28,0.2); white-space: nowrap;">
              <i class="fa-solid fa-plus"></i> Tambah Barang
            </button>
          </div>
        </div>
        <div class="table-responsive sarpras-table-wrap" style="max-height: 480px; overflow-y: auto; border: 1px solid var(--border-medium); border-radius: 8px; margin-bottom: 8px;">
          <table class="report-table-compact table-sarpras-form">
            <thead>
              <tr style="position: sticky; top: 0; z-index: 2; background: #f8fafc;">
                <th style="width:45px; text-align:center;">No</th>
                <th style="min-width:220px;">Nama Barang</th>
                <th style="width:120px; text-align:center;">Layak</th>
                <th style="width:120px; text-align:center;">Tidak Layak</th>
                <th style="width:100px; text-align:center; background:#e2e8f0;">Total</th>
              </tr>
            </thead>
            <tbody id="tbodySarpras">
              ${defaultItems.map((item, idx) => {
                const itemObj = (typeof item === 'object' && item !== null) ? item : { id: `srp-${idx+1}`, nama: String(item), kategori: (typeof guessSarprasKategori === 'function' ? guessSarprasKategori(item) : 'Umum') };
                const nama = itemObj.nama || itemObj.barang || itemObj.name || String(item);
                const kategori = itemObj.kategori || (typeof guessSarprasKategori === 'function' ? guessSarprasKategori(nama) : 'Umum');
                const id = itemObj.id || `srp-${idx+1}`;
                return `
                  <tr data-id="${escapeHTML(id)}" data-kategori="${escapeHTML(kategori)}">
                    <td class="sar-cell-no" style="text-align:center; color:#64748b; font-weight:600;">${idx + 1}</td>
                    <td class="sar-cell-nama">
                      <strong class="sar-item-name" style="color:#0f172a; font-weight: 700; font-size: 0.9rem;">${escapeHTML(nama)}</strong>
                    </td>
                    <td class="sar-cell-layak"><input type="text" inputmode="numeric" value="0" class="form-control-table sar-layak text-center" onfocus="handleSarprasFocus(this)" oninput="hitungSarprasRow(this)" onblur="handleSarprasBlur(this)"></td>
                    <td class="sar-cell-tidak"><input type="text" inputmode="numeric" value="0" class="form-control-table sar-tidak text-center" onfocus="handleSarprasFocus(this)" oninput="hitungSarprasRow(this)" onblur="handleSarprasBlur(this)"></td>
                    <td class="sar-cell-total" style="text-align:center; background:#f8fafc;"><strong class="sar-total" style="color:#0f172a;">0</strong></td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    if (typeof hitungSarprasSummary === 'function') {
      setTimeout(hitungSarprasSummary, 0);
    }

  } else if (divisiKey === "media_kreatif") {
    container.innerHTML = `
      <div class="template-section-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <span class="template-header-tag" style="background: #1e293b;">Form Divisi Media Kreatif (Pubdok)</span>
          <div class="report-date-badge-box" style="margin-bottom:0; padding: 4px 10px;">
            <span class="badge-minggu" style="background: #2563eb; color: #ffffff;"><i class="fa-solid fa-calendar-check" style="margin-right: 4px;"></i> Rekap Bulanan</span>
            <span style="font-size: 0.8rem; font-weight: 600; color: #475569;" class="sync-report-tanggal">${dateInfo.bulanNama || dateInfo.tanggalIndo}</span>
          </div>
        </div>

        <!-- Kolom Judul Laporan -->
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="lapJudulUtama" style="font-weight: 700; font-size: 0.85rem; color: #0f172a; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-heading" style="color: var(--accent-red);"></i> Judul Laporan <span class="req">*</span>
          </label>
          <input type="text" id="lapJudulUtama" class="form-control" placeholder="Masukkan Judul Laporan Media Kreatif (Pubdok)" required style="font-weight: 600;" value="${escapeHTML(document.getElementById('lapJudul')?.value || '')}" oninput="document.getElementById('lapJudul').value = this.value;">
        </div>

        <!-- Tabel Postingan & Metrik Insight Resmi -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
          <strong style="font-size:0.875rem; color:#1e293b; display:inline-flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-chart-line" style="color:var(--accent-red);"></i>
            <span>Postingan & Metrik Insight Media Sosial</span>
          </strong>
          <button type="button" class="btn btn-secondary btn-sm" onclick="tambahBarisKontenMed()" style="font-weight:700;"><i class="fa-solid fa-plus"></i> Tambah Postingan</button>
        </div>
        <div class="table-responsive med-table-container" style="border: 1px solid var(--border-medium); border-radius: 8px; margin-bottom: 14px;">
          <table class="report-table-compact table-med-kreatif">
            <thead>
              <tr>
                <th rowspan="2" style="width:35px; text-align:center;">No</th>
                <th rowspan="2" style="min-width:185px; width:185px; text-align:center; white-space:nowrap;">Waktu</th>
                <th rowspan="2" style="min-width:130px; text-align:center;">Platform</th>
                <th rowspan="2" style="min-width:130px; text-align:center;">Tipe Konten</th>
                <th rowspan="2" style="min-width:220px; text-align:left;">Nama Konten</th>
                <th rowspan="2" style="min-width:90px; text-align:center;">Jangkauan</th>
                <th colspan="5" style="text-align:center; background:#f8fafc;">Interaksi</th>
                <th colspan="2" style="text-align:center; background:#f1f5f9;">Aktivitas Profil</th>
                <th colspan="3" style="text-align:center; background:#e2e8f0;">Impresi (%)</th>
                <th rowspan="2" style="width:45px; text-align:center;">Aksi</th>
              </tr>
              <tr>
                <th style="min-width:70px; text-align:center;">Like</th>
                <th style="min-width:70px; text-align:center;">Komen</th>
                <th style="min-width:70px; text-align:center;">Share</th>
                <th style="min-width:70px; text-align:center;">Repost</th>
                <th style="min-width:70px; text-align:center;">Save</th>
                <th style="min-width:85px; text-align:center;">Kunjungan</th>
                <th style="min-width:85px; text-align:center;">Followers</th>
                <th style="min-width:75px; text-align:center;">Profil%</th>
                <th style="min-width:75px; text-align:center;">Kabar%</th>
                <th style="min-width:75px; text-align:center;">Jelajah%</th>
              </tr>
            </thead>
            <tbody id="tbodyMedKonten"></tbody>
          </table>
        </div>
      </div>
    `;

    tambahBarisKontenMed();
  }
}

/* ==========================================================================
   HELPER FORM SEKRETARIS (REFERENSI RESMI WEBSITE PASKIB)
   ========================================================================== */
let currentSekGen = "G10";
window.currentSekGen = currentSekGen;

function switchSekretarisGenTab(gen) {
  currentSekGen = gen === 'G11' ? 'G11' : 'G10';
  window.currentSekGen = currentSekGen;

  const btnG10 = document.getElementById("tabBtnSekG10");
  const btnG11 = document.getElementById("tabBtnSekG11");
  const secG10 = document.getElementById("sectionSekG10");
  const secG11 = document.getElementById("sectionSekG11");
  const labelGen = document.getElementById("sekCurrentGenLabel");

  if (currentSekGen === 'G10') {
    btnG10?.classList.add("active");
    btnG11?.classList.remove("active");
    if (secG10) secG10.style.display = "block";
    if (secG11) secG11.style.display = "none";
  } else {
    btnG11?.classList.add("active");
    btnG10?.classList.remove("active");
    if (secG11) secG11.style.display = "block";
    if (secG10) secG10.style.display = "none";
  }

  if (labelGen) labelGen.textContent = currentSekGen;
  hitungRekapAbsensiSekretaris();
}

function isiTabelAbsensiSekretaris(g10Members, g11Members) {
  const tbody10 = document.getElementById("tbodySekG10");
  const tbody11 = document.getElementById("tbodySekG11");

  if (tbody10) {
    tbody10.innerHTML = g10Members.map((m, idx) => {
      return buatRowHtmlAbsensiSek(idx + 1, m, "", "");
    }).join("");
  }
  if (tbody11) {
    tbody11.innerHTML = g11Members.map((m, idx) => {
      return buatRowHtmlAbsensiSek(idx + 1, m, "", "");
    }).join("");
  }

  updateBadgesAbsensiSek();
  hitungRekapAbsensiSekretaris();
}

function buatRowHtmlAbsensiSek(no, member, status = "", ket = "") {
  const isIzin = status === "Izin";
  const namaStr = typeof member === 'string' ? member : (member?.name || member?.nama || '');
  const kelasStr = typeof member === 'string' ? '' : (member?.class || member?.kelas || '');
  const agtId = typeof member === 'object' ? (member?.id || '') : '';
  const isPlace = !status || status === "Pilih" || status === "Pilih Kehadiran";

  return `
    <tr data-agt-id="${escapeHTML(agtId)}">
      <td class="text-center row-num" style="font-weight: 600; color: #64748b;">${no}</td>
      <td class="cell-sek-nama">
        <span class="sek-nama-text" style="font-weight: 700; color: #0f172a; display: block;">${escapeHTML(namaStr)}</span>
        <input type="hidden" class="sek-nama" value="${escapeHTML(namaStr)}">
        <input type="hidden" class="sek-agt-id" value="${escapeHTML(agtId)}">
      </td>
      <td class="cell-sek-kelas text-center" style="vertical-align: middle;">
        <span class="sek-kelas-text">${escapeHTML(kelasStr || '-')}</span>
        <input type="hidden" class="sek-kelas" value="${escapeHTML(kelasStr || '')}">
      </td>
      <td class="cell-sek-status">
        <select class="form-control-table sek-status ${isPlace ? 'is-placeholder' : ''}" style="font-weight: 600; border-radius: 6px; padding: 5px 8px; font-size: 0.8rem;" onchange="onSekStatusChange(this)">
          <option value="" ${isPlace ? "selected" : ""} disabled hidden>Pilih</option>
          <option value="Hadir" ${status === "Hadir" ? "selected" : ""}>Hadir</option>
          <option value="Izin" ${isIzin ? "selected" : ""}>Izin</option>
          <option value="Alfa" ${status === "Alfa" ? "selected" : ""}>Alfa</option>
        </select>
      </td>
      <td class="cell-sek-ket ${isIzin ? 'is-active-izin' : ''}">
        <input type="text" class="form-control-table sek-ket" value="${escapeHTML(ket)}" placeholder="${isIzin ? 'Alasan izin (wajib)' : '-'}" ${isIzin ? '' : 'disabled'} oninput="hitungRekapAbsensiSekretaris()" style="border-radius: 6px; padding: 5px 8px; font-size: 0.8rem;">
      </td>
      <td class="text-center" style="white-space: nowrap;">
        <div style="display: inline-flex; gap: 6px; align-items: center; justify-content: center;">
          <button type="button" class="btn-action-icon" style="width: 28px; height: 28px;" onclick="bukaModalEditBarisAbsensiSek(this)" title="Edit Data Anggota (Halaman Anggota)">
            <i class="fa-solid fa-pen-to-square" style="font-size: 0.75rem;"></i>
          </button>
          <button type="button" class="btn-action-icon btn-delete" style="width: 28px; height: 28px;" onclick="konfirmasiHapusBarisAbsensiSek(this)" title="Hapus Anggota (Halaman Anggota)">
            <i class="fa-solid fa-trash-can" style="font-size: 0.75rem;"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

function onSekStatusChange(sel) {
  sel.classList.toggle("is-placeholder", !sel.value);
  sel.classList.remove("input-error");
  const tr = sel.closest("tr");
  const ketCell = tr.querySelector(".cell-sek-ket") || tr.querySelector("td:nth-child(5)");
  const ketInput = tr.querySelector(".sek-ket");
  if (!ketInput) return;

  const isIzin = sel.value === "Izin";
  if (ketCell) {
    ketCell.classList.toggle("is-active-izin", isIzin);
  }

  if (isIzin) {
    ketInput.disabled = false;
    ketInput.placeholder = "Alasan izin (wajib)";
    setTimeout(() => ketInput.focus(), 50);
  } else {
    ketInput.disabled = true;
    ketInput.value = "";
    ketInput.placeholder = "-";
    ketInput.classList.remove("input-error");
  }

  hitungRekapAbsensiSekretaris();
}

function updateBadgesAbsensiSek() {
  const tbody10 = document.getElementById("tbodySekG10");
  const tbody11 = document.getElementById("tbodySekG11");
  const count10 = tbody10 ? tbody10.querySelectorAll("tr").length : 0;
  const count11 = tbody11 ? tbody11.querySelectorAll("tr").length : 0;

  const badge10 = document.getElementById("badgeSekCountG10");
  const badge11 = document.getElementById("badgeSekCountG11");
  const tag10 = document.getElementById("tagCountG10");
  const tag11 = document.getElementById("tagCountG11");

  if (badge10) badge10.textContent = `${count10} Anak`;
  if (badge11) badge11.textContent = `${count11} Anak`;
  if (tag10) tag10.textContent = `${count10} Anggota`;
  if (tag11) tag11.textContent = `${count11} Anggota`;
}

function setSemuaKehadiranSek(gen, status = "Hadir") {
  const tbodyId = gen === "G11" ? "tbodySekG11" : "tbodySekG10";
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const rows = tbody.querySelectorAll("tr");
  const isIzin = status === "Izin";
  rows.forEach(tr => {
    const sel = tr.querySelector(".sek-status");
    const ketCell = tr.querySelector(".cell-sek-ket") || tr.querySelector("td:nth-child(5)");
    const ket = tr.querySelector(".sek-ket");
    if (sel) {
      sel.value = status;
      sel.classList.remove("is-placeholder", "input-error");
    }
    if (ketCell) {
      ketCell.classList.toggle("is-active-izin", isIzin);
    }
    if (ket) {
      if (isIzin) {
        ket.disabled = false;
        ket.placeholder = "Alasan izin (wajib)";
      } else {
        ket.disabled = true;
        ket.value = "";
        ket.placeholder = "-";
        ket.classList.remove("input-error");
      }
    }
  });
  hitungRekapAbsensiSekretaris();
  if (typeof showSmallToast === 'function') {
    showSmallToast({
      icon: 'success',
      title: `Semua Kehadiran ${gen} diset ${status}`
    });
  }
}

// Buka Modal Tambah Anggota Resmi (Tampilan Sama Persis dengan Halaman Anggota)
function bukaModalTambahBarisAbsensiSek(gen) {
  if (typeof bukaModalTambahAnggota === 'function') {
    bukaModalTambahAnggota();

    // Otomatis pre-select angkatan
    const angkSelect = document.getElementById("agtAngkatan");
    if (angkSelect) {
      angkSelect.value = gen;
      if (typeof handleAngkatanChange === 'function') handleAngkatanChange();
    }

    // Otomatis pre-select tingkat kelas
    const tingkatSelect = document.getElementById("agtTingkatKelas");
    if (tingkatSelect) {
      tingkatSelect.value = gen === 'G10' ? 'XI' : 'X';
      if (typeof handleTingkatKelasChange === 'function') handleTingkatKelasChange();
    }

    // Default status divisi: Non-Divisi
    const divSelect = document.getElementById("agtStatusDivisi");
    if (divSelect) {
      divSelect.value = "Non-Divisi";
      if (typeof handleStatusDivisiChange === 'function') handleStatusDivisiChange();
    }
  }
}

// Buka Modal Edit Anggota Resmi (Tampilan Sama Persis dengan Halaman Anggota)
function bukaModalEditBarisAbsensiSek(btn) {
  const tr = btn.closest("tr");
  const agtId = tr.querySelector(".sek-agt-id")?.value;
  const nama = tr.querySelector(".sek-nama")?.value;

  let targetAgt = state.anggota.find(a => a.id === agtId);
  if (!targetAgt && nama) {
    targetAgt = state.anggota.find(a => (a.nama || "").trim().toLowerCase() === nama.trim().toLowerCase());
  }

  if (targetAgt && typeof editAnggota === 'function') {
    editAnggota(targetAgt.id);
  } else {
    showSmallAlert({
      icon: 'error',
      title: 'Anggota Tidak Ditemukan',
      text: `Data anggota "${nama}" tidak ditemukan di database anggota.`
    });
  }
}

// Hapus Anggota Resmi (Tersinkron Langsung ke Halaman Ketua, Pelatih, Wakil)
function konfirmasiHapusBarisAbsensiSek(btn) {
  const tr = btn.closest("tr");
  const agtId = tr.querySelector(".sek-agt-id")?.value;
  const nama = tr.querySelector(".sek-nama")?.value;

  let targetAgt = state.anggota.find(a => a.id === agtId);
  if (!targetAgt && nama) {
    targetAgt = state.anggota.find(a => (a.nama || "").trim().toLowerCase() === nama.trim().toLowerCase());
  }

  if (targetAgt && typeof hapusAnggota === 'function') {
    hapusAnggota(targetAgt.id);
  } else {
    tr.remove();
    updateBadgesAbsensiSek();
    hitungRekapAbsensiSekretaris();
  }
}

// Sinkronisasi ulang data tabel absensi dari database state.anggota terbaru
function refreshTabelAbsensiSekretaris() {
  const tbody10 = document.getElementById("tbodySekG10");
  const tbody11 = document.getElementById("tbodySekG11");
  if (!tbody10 && !tbody11) return;

  // Pertahankan status & keterangan yang sudah dipilih user sebelum re-render
  const presenceMap = {};
  document.querySelectorAll("#tbodySekG10 tr, #tbodySekG11 tr").forEach(tr => {
    const nama = tr.querySelector(".sek-nama")?.value;
    const status = tr.querySelector(".sek-status")?.value;
    const ket = tr.querySelector(".sek-ket")?.value;
    if (nama) {
      presenceMap[nama.trim().toLowerCase()] = { status: status || "", ket: ket || "" };
    }
  });

  const { g10, g11 } = getDaftarAnggotaAbsensi();

  if (tbody10) {
    tbody10.innerHTML = g10.map((m, idx) => {
      const saved = presenceMap[m.name.toLowerCase()];
      return buatRowHtmlAbsensiSek(idx + 1, m, saved ? saved.status : "", saved ? saved.ket : "");
    }).join("");
  }
  if (tbody11) {
    tbody11.innerHTML = g11.map((m, idx) => {
      const saved = presenceMap[m.name.toLowerCase()];
      return buatRowHtmlAbsensiSek(idx + 1, m, saved ? saved.status : "", saved ? saved.ket : "");
    }).join("");
  }

  updateBadgesAbsensiSek();
  hitungRekapAbsensiSekretaris();
}

function hitungRekapAbsensiSekretaris() {
  const activeGen = window.currentSekGen || (document.getElementById("tabBtnSekG11")?.classList.contains("active") ? "G11" : "G10");
  const tbodyId = activeGen === "G11" ? "#tbodySekG11" : "#tbodySekG10";
  const selects = document.querySelectorAll(`${tbodyId} .sek-status`);
  let hadir = 0, izin = 0, alfa = 0;
  selects.forEach(sel => {
    if (sel.value === "Hadir") hadir++;
    else if (sel.value === "Izin") izin++;
    else if (sel.value === "Alfa") alfa++;
  });

  const totalHadirEl = document.getElementById("sekTotalHadir");
  const totalIzinEl = document.getElementById("sekTotalIzin");
  const totalAlfaEl = document.getElementById("sekTotalAlfa");
  const totalSemuaEl = document.getElementById("sekTotalSemua");
  const labelGen = document.getElementById("sekCurrentGenLabel");

  if (labelGen) labelGen.textContent = activeGen;
  if (totalHadirEl) totalHadirEl.textContent = hadir;
  if (totalIzinEl) totalIzinEl.textContent = izin;
  if (totalAlfaEl) totalAlfaEl.textContent = alfa;
  if (totalSemuaEl) totalSemuaEl.textContent = selects.length;
}

/* ==========================================================================
   HELPER FORM BENDAHARA
   ========================================================================== */
function isiTabelKasBendahara(g10Members, g11Members) {
  const tbody10 = document.getElementById("tbodyBenG10");
  const tbody11 = document.getElementById("tbodyBenG11");

  if (tbody10 && Array.isArray(g10Members)) {
    tbody10.innerHTML = g10Members.map((m, idx) => buatRowHtmlKasBen(idx + 1, m, "Tidak Bayar", "")).join("");
  }
  if (tbody11 && Array.isArray(g11Members)) {
    tbody11.innerHTML = g11Members.map((m, idx) => buatRowHtmlKasBen(idx + 1, m, "Tidak Bayar", "")).join("");
  }

  const badge10 = document.getElementById("badgeKasCountG10");
  const badge11 = document.getElementById("badgeKasCountG11");
  if (badge10 && tbody10) badge10.textContent = `${tbody10.querySelectorAll("tr").length} Anak`;
  if (badge11 && tbody11) badge11.textContent = `${tbody11.querySelectorAll("tr").length} Anak`;

  hitungBendaharaRekap();
}

function buatRowHtmlKasBen(no, member, bayar = "Tidak Bayar", metode = "") {
  const isBayar = bayar === "Bayar";
  const namaStr = typeof member === 'string' ? member : (member?.name || member?.nama || '');
  const kelasStr = typeof member === 'object' ? (member?.class || member?.kelas || '') : '';
  const currentMetode = isBayar ? (metode || "Cash") : "";

  return `
    <tr class="${isBayar ? 'is-bayar' : ''}">
      <td class="text-center row-num" style="font-weight: 600; color: #64748b; width: 40px;">${no}</td>
      <td class="cell-ben-nama">
        <div class="ben-nama-wrapper">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="ben-mobile-num">#${no}</span>
            <span class="ben-nama-text">${escapeHTML(namaStr)}</span>
          </div>
          ${kelasStr ? `<span class="ben-kelas-badge mobile-only-badge">${escapeHTML(kelasStr)}</span>` : ''}
        </div>
        <input type="hidden" class="ben-nama" value="${escapeHTML(namaStr)}">
        <input type="hidden" class="ben-kelas-val" value="${escapeHTML(kelasStr)}">
      </td>
      <td class="cell-ben-kelas text-center" style="text-align: center; width: 85px;">
        ${kelasStr ? `<span class="ben-kelas-badge">${escapeHTML(kelasStr)}</span>` : `<span style="color:#94a3b8; font-size:0.75rem;">-</span>`}
      </td>
      <td class="cell-ben-bayar" style="width: 130px;">
        <select class="form-control-table ben-bayar" onchange="onBenBayarChange(this)" style="font-weight: 600; color: ${isBayar ? '#15803d' : '#64748b'};">
          <option value="Tidak Bayar" ${!isBayar ? "selected" : ""}>Tidak Bayar</option>
          <option value="Bayar" ${isBayar ? "selected" : ""}>Bayar</option>
        </select>
      </td>
      <td class="cell-ben-metode" style="width: 110px;">
        <select class="form-control-table ben-metode" ${!isBayar ? "disabled" : ""} onchange="hitungBendaharaRekap()" style="font-weight: 600; color: ${isBayar ? '#0f172a' : '#94a3b8'};">
          <option value="" ${!isBayar || !currentMetode ? "selected" : ""}>-</option>
          <option value="Cash" ${isBayar && currentMetode === "Cash" ? "selected" : ""}>Cash</option>
          <option value="QRIS" ${isBayar && currentMetode === "QRIS" ? "selected" : ""}>QRIS</option>
        </select>
      </td>
    </tr>
  `;
}

function onBenBayarChange(select) {
  const tr = select.closest("tr");
  const metodeSelect = tr.querySelector(".ben-metode");
  const isBayar = select.value === "Bayar";
  if (metodeSelect) {
    metodeSelect.disabled = !isBayar;
    if (isBayar) {
      if (!metodeSelect.value || metodeSelect.value === "") {
        metodeSelect.value = "Cash";
      }
      metodeSelect.style.color = '#0f172a';
    } else {
      metodeSelect.value = "";
      metodeSelect.style.color = '#94a3b8';
    }
  }
  select.style.color = isBayar ? '#15803d' : '#64748b';
  tr.classList.toggle("is-bayar", isBayar);
  hitungBendaharaRekap();
}

function setSemuaKasBen(gen, bayar = "Bayar", metode = "Cash") {
  const tbodyId = gen === "G11" ? "tbodyBenG11" : "tbodyBenG10";
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const isBayar = bayar === "Bayar";
  tbody.querySelectorAll("tr").forEach(tr => {
    const selBayar = tr.querySelector(".ben-bayar");
    const selMetode = tr.querySelector(".ben-metode");
    if (selBayar) {
      selBayar.value = bayar;
      selBayar.style.color = isBayar ? '#15803d' : '#64748b';
    }
    if (selMetode) {
      selMetode.disabled = !isBayar;
      selMetode.value = isBayar ? metode : "";
      selMetode.style.color = isBayar ? '#0f172a' : '#94a3b8';
    }
    tr.classList.toggle("is-bayar", isBayar);
  });
  hitungBendaharaRekap();
  if (typeof showSmallToast === 'function') {
    showSmallToast({
      icon: 'success',
      title: isBayar ? `Semua Bayar (${metode})` : 'Reset Pembayaran',
      text: isBayar ? `Semua anggota ${gen} diatur Bayar (${metode}).` : `Status kas ${gen} telah direset.`
    });
  }
}

function formatInputRupiahBen(input) {
  if (!input) return;
  let raw = input.value.replace(/\D/g, "");
  if (!raw) {
    input.value = "";
    hitungBendaharaRekap();
    return;
  }
  const num = parseInt(raw, 10);
  input.value = num.toLocaleString("id-ID");
  hitungBendaharaRekap();
}

function tambahBarisKasBenLangsung(gen, nama = "") {
  const tbody = document.getElementById(gen === 'G10' ? "tbodyBenG10" : "tbodyBenG11");
  if (!tbody) return;
  const count = tbody.querySelectorAll("tr").length + 1;
  tbody.insertAdjacentHTML("beforeend", buatRowHtmlKasBen(count, nama, "Tidak Bayar", ""));

  const tableContainer = tbody.closest(".table-responsive");
  if (tableContainer) {
    tableContainer.scrollTop = tableContainer.scrollHeight;
  }

  const newRow = tbody.lastElementChild;
  if (newRow) {
    newRow.style.transition = "background-color 0.4s ease";
    newRow.style.backgroundColor = "#dcfce7";
    setTimeout(() => {
      newRow.style.backgroundColor = "";
    }, 1200);
    const inputNama = newRow.querySelector(".ben-nama");
    if (inputNama && !nama) {
      inputNama.focus();
    }
  }

  const badge = document.getElementById(gen === 'G10' ? "badgeKasCountG10" : "badgeKasCountG11");
  if (badge) badge.textContent = `${count} Anak`;
  hitungBendaharaRekap();
}

function tambahBarisKasBendahara(gen) {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: `Tambah Anggota Kas ${gen}`,
      html: `
        <div style="text-align: left; margin-top: 6px;">
          <label style="font-size: 0.825rem; font-weight: 700; color: #334155; margin-bottom: 4px; display: block;">
            Nama Lengkap Anggota:
          </label>
          <input type="text" id="swalNamaKasInput" class="swal2-input" placeholder="Masukkan nama anggota..." style="margin: 0; width: 100%; box-sizing: border-box; font-size: 0.9rem;">
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: '<i class="fa-solid fa-plus"></i> Tambahkan',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' },
      didOpen: () => {
        const inp = document.getElementById("swalNamaKasInput");
        if (inp) {
          inp.focus();
          inp.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              Swal.clickConfirm();
            }
          });
        }
      },
      preConfirm: () => {
        const inp = document.getElementById("swalNamaKasInput");
        const val = inp ? inp.value.trim() : "";
        if (!val) {
          Swal.showValidationMessage("Nama anggota tidak boleh kosong");
          return false;
        }
        return val;
      }
    }).then((res) => {
      if (res.isConfirmed && res.value) {
        tambahBarisKasBenLangsung(gen, res.value);
        if (typeof showSmallToast === 'function') {
          showSmallToast({
            icon: 'success',
            title: 'Anggota Ditambahkan',
            text: `"${res.value}" berhasil ditambahkan ke daftar kas ${gen}.`
          });
        }
      }
    });
  } else {
    const nama = prompt(`Masukkan nama anggota baru untuk Kas ${gen}:`);
    if (nama && nama.trim()) {
      tambahBarisKasBenLangsung(gen, nama.trim());
    }
  }
}

function hapusBarisKasBen(btn) {
  const tr = btn.closest("tr");
  const tbody = tr.closest("tbody");
  const isG10 = tbody?.id === "tbodyBenG10";
  const namaInput = tr.querySelector(".ben-nama");
  const nama = namaInput ? namaInput.value.trim() : "anggota ini";

  const executeDelete = () => {
    tr.remove();
    if (tbody) {
      const rows = tbody.querySelectorAll("tr");
      rows.forEach((row, i) => {
        const numEl = row.querySelector(".row-num");
        if (numEl) numEl.textContent = i + 1;
      });
      const badge = document.getElementById(isG10 ? "badgeKasCountG10" : "badgeKasCountG11");
      if (badge) badge.textContent = `${rows.length} Anak`;
    }
    hitungBendaharaRekap();
  };

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Hapus Anggota Kas?',
      html: `Apakah Anda yakin ingin menghapus <strong>"${escapeHTML(nama)}"</strong> dari daftar kas?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' }
    }).then((res) => {
      if (res.isConfirmed) {
        executeDelete();
      }
    });
  } else {
    executeDelete();
  }
}

function tambahPemasukanTambahan() {
  const tbody = document.getElementById("tbodyPemasukanLain");
  if (!tbody) return;
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" class="form-control-table ben-masuk-nama" placeholder="Masukkan Sumber Pemasukan" oninput="this.classList.remove('input-error')" required></td>
    <td>
      <div style="position: relative; display: flex; align-items: center; width: 100%;">
        <span style="position: absolute; left: 8px; font-weight: 700; color: #64748b; font-size: 0.8rem; pointer-events: none; user-select: none;">Rp</span>
        <input type="text" class="form-control-table ben-masuk-nominal" placeholder="0" inputmode="numeric" style="padding-left: 28px; text-align: right; font-weight: 600;" oninput="this.classList.remove('input-error'); formatInputRupiahBen(this)" required>
      </div>
    </td>
    <td>
      <select class="form-control-table ben-masuk-metode" onchange="hitungBendaharaRekap()" style="font-weight: 600; cursor: pointer; padding: 4px 6px; width: 100%; box-sizing: border-box;">
        <option value="Cash">Cash</option>
        <option value="QRIS">QRIS</option>
      </select>
    </td>
    <td class="text-center">
      <button type="button" class="btn-action-icon btn-delete" style="width:26px; height:26px;" onclick="this.closest('tr').remove(); hitungBendaharaRekap();" title="Hapus"><i class="fa-solid fa-trash-can" style="font-size:0.75rem;"></i></button>
    </td>
  `;
  tbody.appendChild(tr);
  const inputNama = tr.querySelector(".ben-masuk-nama");
  if (inputNama) inputNama.focus();
}

function tambahPengeluaranOpsional() {
  const tbody = document.getElementById("tbodyPengeluaran");
  if (!tbody) return;
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" class="form-control-table ben-keluar-nama" placeholder="Masukkan Rincian Pengeluaran" oninput="this.classList.remove('input-error')" required></td>
    <td>
      <div style="position: relative; display: flex; align-items: center; width: 100%;">
        <span style="position: absolute; left: 8px; font-weight: 700; color: #64748b; font-size: 0.8rem; pointer-events: none; user-select: none;">Rp</span>
        <input type="text" class="form-control-table ben-keluar-nominal" placeholder="0" inputmode="numeric" style="padding-left: 28px; text-align: right; font-weight: 600;" oninput="this.classList.remove('input-error'); formatInputRupiahBen(this)" required>
      </div>
    </td>
    <td>
      <select class="form-control-table ben-keluar-metode" onchange="hitungBendaharaRekap()" style="font-weight: 600; cursor: pointer; padding: 4px 6px; width: 100%; box-sizing: border-box;">
        <option value="Cash">Cash</option>
        <option value="QRIS">QRIS</option>
      </select>
    </td>
    <td class="text-center">
      <button type="button" class="btn-action-icon btn-delete" style="width:26px; height:26px;" onclick="this.closest('tr').remove(); hitungBendaharaRekap();" title="Hapus"><i class="fa-solid fa-trash-can" style="font-size:0.75rem;"></i></button>
    </td>
  `;
  tbody.appendChild(tr);
  const inputNama = tr.querySelector(".ben-keluar-nama");
  if (inputNama) inputNama.focus();
}

function hitungBendaharaRekap() {
  const KAS_PER_ANAK = 2000;
  let totalCash = 0;
  let totalQris = 0;

  // Saldo Awal Kas
  const rawSaldoAwal = (document.getElementById("benSaldoAwal")?.value || "0").replace(/\D/g, "");
  const saldoAwal = parseInt(rawSaldoAwal, 10) || 0;

  // Kas dari Anggota (G10 & G11)
  document.querySelectorAll("#tbodyBenG10 tr, #tbodyBenG11 tr").forEach(tr => {
    const bayar = tr.querySelector(".ben-bayar")?.value;
    const metode = tr.querySelector(".ben-metode")?.value;
    if (bayar === "Bayar") {
      if (metode === "QRIS") totalQris += KAS_PER_ANAK;
      else totalCash += KAS_PER_ANAK;
    }
  });

  // Pemasukan Tambahan
  document.querySelectorAll("#tbodyPemasukanLain tr").forEach(tr => {
    const rawNom = (tr.querySelector(".ben-masuk-nominal")?.value || "0").replace(/\D/g, "");
    const nom = parseInt(rawNom, 10) || 0;
    const met = tr.querySelector(".ben-masuk-metode")?.value;
    if (met === "QRIS") totalQris += nom;
    else totalCash += nom;
  });

  // Pengeluaran
  let totalPengeluaran = 0;
  document.querySelectorAll("#tbodyPengeluaran tr").forEach(tr => {
    const rawNom = (tr.querySelector(".ben-keluar-nominal")?.value || "0").replace(/\D/g, "");
    const nom = parseInt(rawNom, 10) || 0;
    totalPengeluaran += nom;
  });

  const totalPemasukan = totalCash + totalQris;
  const saldoAkhir = saldoAwal + totalPemasukan - totalPengeluaran;

  const saldoAwalEl = document.getElementById("benDisplaySaldoAwal");
  const cashEl = document.getElementById("benDisplayCash");
  const qrisEl = document.getElementById("benDisplayQris");
  const masukEl = document.getElementById("benDisplayPemasukan");
  const keluarEl = document.getElementById("benDisplayPengeluaran");
  const saldoEl = document.getElementById("benDisplaySaldo");

  if (saldoAwalEl) saldoAwalEl.textContent = formatRupiah(saldoAwal);
  if (cashEl) cashEl.textContent = formatRupiah(totalCash);
  if (qrisEl) qrisEl.textContent = formatRupiah(totalQris);
  if (masukEl) masukEl.textContent = formatRupiah(totalPemasukan);
  if (keluarEl) keluarEl.textContent = formatRupiah(totalPengeluaran);
  if (saldoEl) {
    saldoEl.textContent = formatRupiah(saldoAkhir);
    saldoEl.style.color = saldoAkhir >= 0 ? "#16a34a" : "#dc2626";
  }
}

/* ==========================================================================
   HELPER FORM KORLAP
   ========================================================================== */
function tambahBarisMateriKorlap(namaMateriDefault = "", tglVal = "", mingguVal = "") {
  const tbody = document.getElementById("tbodyKorlapMateri");
  if (!tbody) return;
  const count = tbody.querySelectorAll("tr").length + 1;
  const dateInfo = getReportDateInfo();

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="text-center row-num" style="font-weight: 600; color: #64748b;">${count}</td>
    <td><input type="text" class="form-control-table kor-tanggal sync-report-tanggal" value="${escapeHTML(tglVal || dateInfo.tanggalIndo)}" readonly style="text-align: center; font-weight: 600;"></td>
    <td class="text-center"><input type="text" class="form-control-table kor-minggu sync-report-minggu text-center" value="${escapeHTML(String(mingguVal || dateInfo.mingguKe))}" readonly style="font-weight: 600;"></td>
    <td><textarea class="form-control-table kor-materi" rows="2" placeholder="Masukkan materi latihan (contoh: PBB Dasar, Periksa Kerapian, Formasi Defile)" oninput="this.classList.remove('input-error')" required style="font-weight: 500;">${escapeHTML(namaMateriDefault)}</textarea></td>
    <td class="text-center">
      <button type="button" class="btn-action-icon btn-delete" style="width:26px; height:26px;" onclick="hapusBarisMateriKorlap(this)" title="Hapus"><i class="fa-solid fa-trash-can" style="font-size:0.75rem;"></i></button>
    </td>
  `;
  tbody.appendChild(tr);

  const ta = tr.querySelector(".kor-materi");
  if (ta && !namaMateriDefault) {
    ta.focus();
  }
}

function hapusBarisMateriKorlap(btn) {
  const tbody = document.getElementById("tbodyKorlapMateri");
  if (!tbody) return;
  const rows = tbody.querySelectorAll("tr");
  if (rows.length <= 1) {
    const msg = "Laporan Koordinator Lapangan harus memiliki setidaknya satu baris materi latihan.";
    if (typeof showSmallAlert === 'function') {
      showSmallAlert({ icon: 'info', title: 'Minimal 1 Materi', text: msg });
    } else if (typeof Swal !== 'undefined') {
      Swal.fire({ icon: 'info', title: 'Minimal 1 Materi', text: msg, confirmButtonColor: '#b91c1c' });
    }
    return;
  }
  btn.closest("tr").remove();
  renumberKorlapMateri();
}

function renumberKorlapMateri() {
  const tbody = document.getElementById("tbodyKorlapMateri");
  if (!tbody) return;
  tbody.querySelectorAll("tr").forEach((row, i) => {
    const numEl = row.querySelector(".row-num");
    if (numEl) numEl.textContent = i + 1;
  });
}

/* ==========================================================================
   HELPER FORM SARPRAS
   ========================================================================== */
function hitungSarprasSummary() {
  let totalLayak = 0;
  let totalTidak = 0;
  const rows = document.querySelectorAll("#tbodySarpras tr");
  rows.forEach(tr => {
    totalLayak += Number(tr.querySelector(".sar-layak")?.value || 0);
    totalTidak += Number(tr.querySelector(".sar-tidak")?.value || 0);
  });
  const totalSemua = totalLayak + totalTidak;

  const elLayak = document.getElementById("sarSummaryLayak");
  const elTidak = document.getElementById("sarSummaryTidakLayak");
  const elSemua = document.getElementById("sarSummarySemua");

  if (elLayak) elLayak.textContent = totalLayak.toLocaleString("id-ID");
  if (elTidak) elTidak.textContent = totalTidak.toLocaleString("id-ID");
  if (elSemua) elSemua.textContent = totalSemua.toLocaleString("id-ID");

  const badge = document.getElementById("sarBadgeCount");
  if (badge) badge.textContent = `${rows.length} Barang`;
}

function updateSarprasNumbers() {
  const rows = document.querySelectorAll("#tbodySarpras tr");
  rows.forEach((tr, idx) => {
    const noEl = tr.querySelector(".sar-cell-no");
    if (noEl) noEl.textContent = idx + 1;
  });
  const badge = document.getElementById("sarBadgeCount");
  if (badge) badge.textContent = `${rows.length} Barang`;
}

function tambahBarangSarpras() {
  tambahBarangMasterSarpras();
}

function tambahBarisSarprasLangsung(namaBarang, layak = 0, tidakLayak = 0, kategori = 'Umum', id = null) {
  const tbody = document.getElementById("tbodySarpras");
  if (!tbody) return;

  const realId = id || ('srp-' + Date.now());
  const realKat = kategori || (typeof guessSarprasKategori === 'function' ? guessSarprasKategori(namaBarang) : 'Umum');
  const idx = tbody.querySelectorAll("tr").length;
  const tr = document.createElement("tr");
  tr.setAttribute("data-id", realId);
  tr.setAttribute("data-kategori", realKat);
  const total = Number(layak || 0) + Number(tidakLayak || 0);

  tr.innerHTML = `
    <td class="sar-cell-no" style="text-align:center; color:#64748b; font-weight:600;">${idx + 1}</td>
    <td class="sar-cell-nama">
      <strong class="sar-item-name" style="color:#0f172a; font-weight: 700; font-size: 0.9rem;">${escapeHTML(namaBarang)}</strong>
    </td>
    <td class="sar-cell-layak"><input type="text" inputmode="numeric" value="${layak}" class="form-control-table sar-layak text-center" onfocus="handleSarprasFocus(this)" oninput="hitungSarprasRow(this)" onblur="handleSarprasBlur(this)"></td>
    <td class="sar-cell-tidak"><input type="text" inputmode="numeric" value="${tidakLayak}" class="form-control-table sar-tidak text-center" onfocus="handleSarprasFocus(this)" oninput="hitungSarprasRow(this)" onblur="handleSarprasBlur(this)"></td>
    <td class="sar-cell-total" style="text-align:center; background:#f8fafc;"><strong class="sar-total" style="color:#0f172a;">${total.toLocaleString("id-ID")}</strong></td>
  `;

  tbody.appendChild(tr);
  updateSarprasNumbers();
  hitungSarprasSummary();
  if (typeof syncCurrentSarprasToMaster === 'function') {
    syncCurrentSarprasToMaster();
  }

  try {
    tr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (e) {}
}

function hapusBarisSarpras(btn) {
  const tr = btn.closest("tr");
  if (!tr) return;
  const itemNm = tr.querySelector(".sar-item-name")?.textContent.trim() || "barang ini";

  const doRemove = () => {
    tr.remove();
    updateSarprasNumbers();
    hitungSarprasSummary();
    if (typeof syncCurrentSarprasToMaster === 'function') {
      syncCurrentSarprasToMaster();
    }
  };

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Hapus Perlengkapan?',
      text: `Hapus "${itemNm}" dari daftar inventaris?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' }
    }).then(res => {
      if (res.isConfirmed) doRemove();
    });
  } else {
    if (confirm(`Hapus "${itemNm}"?`)) doRemove();
  }
}

function handleSarprasFocus(input) {
  if (!input) return;
  if (input.value === "0" || input.value === "00") {
    input.value = "";
  } else {
    input.select();
  }
}

function handleSarprasBlur(input) {
  if (!input) return;
  if (!input.value.trim()) {
    input.value = "0";
  }
  hitungSarprasRow(input);
}

function hitungSarprasRow(input) {
  if (input) {
    let clean = input.value.replace(/\D/g, "");
    if (clean.length > 1 && clean.startsWith("0")) {
      clean = String(parseInt(clean, 10));
    }
    input.value = clean;
    const tr = input.closest("tr");
    if (tr) {
      const layak = Number(tr.querySelector(".sar-layak")?.value || 0);
      const tidak = Number(tr.querySelector(".sar-tidak")?.value || 0);
      const total = layak + tidak;
      const totalEl = tr.querySelector(".sar-total");
      if (totalEl) totalEl.textContent = total.toLocaleString("id-ID");
    }
  }
  hitungSarprasSummary();
}

/* ==========================================================================
   MASTER BARANG SARANA & PRASARANA (3-HALAMAN: KELOLA, BARANG, TERKIRIM)
   ========================================================================== */

function renderSarprasSubNav(activePage = 'kelola') {
  return '';
}

function getKategoriBadgeHTML(kategori = 'Umum') {
  const k = (kategori || 'Umum').trim();
  if (k === 'Laki - Laki') {
    return `<span class="sar-kategori-badge sar-kategori-laki"><i class="fa-solid fa-mars"></i> Laki - Laki</span>`;
  } else if (k === 'Perempuan') {
    return `<span class="sar-kategori-badge sar-kategori-perempuan"><i class="fa-solid fa-venus"></i> Perempuan</span>`;
  } else {
    return `<span class="sar-kategori-badge sar-kategori-umum"><i class="fa-solid fa-box-archive"></i> Umum</span>`;
  }
}

function renderHalamanBarangSarpras() {
  const items = (typeof getMasterSarprasItems === 'function') ? getMasterSarprasItems() : [];

  // Hitung jumlah jenis barang terdaftar (bukan kondisi fisik layak / tidak layak)
  const total = items.length;
  const countUmum = items.filter(i => (i.kategori || 'Umum') === 'Umum').length;
  const countLaki = items.filter(i => (i.kategori || '') === 'Laki - Laki').length;
  const countPerempuan = items.filter(i => (i.kategori || '') === 'Perempuan').length;

  const elTotal = document.getElementById("statMasterTotalBarang");
  const elUmum = document.getElementById("statMasterUmum");
  const elLaki = document.getElementById("statMasterLaki");
  const elPerempuan = document.getElementById("statMasterPerempuan");

  if (elTotal) elTotal.textContent = total;
  if (elUmum) elUmum.textContent = countUmum;
  if (elLaki) elLaki.textContent = countLaki;
  if (elPerempuan) elPerempuan.textContent = countPerempuan;

  const bSemua = document.getElementById("badgeFilterSemua");
  const bUmum = document.getElementById("badgeFilterUmum");
  const bLaki = document.getElementById("badgeFilterLaki");
  const bPerempuan = document.getElementById("badgeFilterPerempuan");

  if (bSemua) bSemua.textContent = total;
  if (bUmum) bUmum.textContent = countUmum;
  if (bLaki) bLaki.textContent = countLaki;
  if (bPerempuan) bPerempuan.textContent = countPerempuan;

  filterMasterSarpras();
}

// State Filter Master Barang Inventaris Sarpras
let activeFilterMasterKategori = "Semua";
let tempPopupFilterMasterKategori = "Semua";

function selectSwalMasterKategori(kat) {
  const input = document.getElementById("swalMasterKategoriVal");
  if (input) input.value = kat;

  const btnUmum = document.getElementById("btnPillKategori_Umum");
  const btnLaki = document.getElementById("btnPillKategori_Laki");
  const btnPerempuan = document.getElementById("btnPillKategori_Perempuan");

  if (btnUmum) btnUmum.classList.toggle("active", kat === "Umum");
  if (btnLaki) btnLaki.classList.toggle("active", kat === "Laki - Laki");
  if (btnPerempuan) btnPerempuan.classList.toggle("active", kat === "Perempuan");
}

function bukaModalFilterBarang() {
  tempPopupFilterMasterKategori = activeFilterMasterKategori || "Semua";
  pilihPopupFilterKategoriBarangBtn(tempPopupFilterMasterKategori);
  if (typeof openModal === 'function') openModal("modalFilterBarang");
}

function batalFilterBarang() {
  if (typeof closeModal === 'function') closeModal("modalFilterBarang");
}

function pilihPopupFilterKategoriBarangBtn(kat) {
  tempPopupFilterMasterKategori = kat;
  document.querySelectorAll("#gridFilterKategoriBarang .filter-pill-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-kat") === kat);
  });
}

function terapkanFilterBarang() {
  activeFilterMasterKategori = tempPopupFilterMasterKategori || "Semua";
  window.currentMasterSarprasFilter = activeFilterMasterKategori;
  updateBadgeFilterActiveBarang();
  if (typeof closeModal === 'function') closeModal("modalFilterBarang");
  filterMasterSarpras();
}

function resetFilterBarang() {
  const searchInput = document.getElementById("cariBarangMaster");
  const clearBtn = document.getElementById("btnClearSearchBarangMaster");
  if (searchInput) searchInput.value = "";
  if (clearBtn) {
    clearBtn.classList.remove("visible");
    clearBtn.style.setProperty("display", "none", "important");
  }

  activeFilterMasterKategori = "Semua";
  tempPopupFilterMasterKategori = "Semua";
  window.currentMasterSarprasFilter = "Semua";

  updateBadgeFilterActiveBarang();

  const btnReset = document.getElementById("btnResetFilterBarang");
  const icon = btnReset ? btnReset.querySelector("i") : null;
  if (icon) {
    icon.classList.add("fa-spin");
    setTimeout(() => icon.classList.remove("fa-spin"), 400);
  }

  filterMasterSarpras();

  if (typeof showSmallToast === "function") {
    showSmallToast({
      icon: 'success',
      title: 'Filter & Data Direset',
      text: 'Menampilkan seluruh barang inventaris.'
    });
  }
}

function updateBadgeFilterActiveBarang() {
  const badge = document.getElementById("badgeFilterActiveBarang");
  const btn = document.getElementById("btnBukaModalFilterBarang");
  const isFiltered = Boolean(activeFilterMasterKategori && activeFilterMasterKategori !== "Semua");
  if (badge) badge.style.display = isFiltered ? "block" : "none";
  if (btn) btn.classList.toggle("is-active", isFiltered);
}

function clearSearchBarangMaster() {
  const searchInput = document.getElementById("cariBarangMaster");
  const clearBtn = document.getElementById("btnClearSearchBarangMaster");
  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
  }
  if (clearBtn) {
    clearBtn.classList.remove("visible");
    clearBtn.style.setProperty("display", "none", "important");
  }
  filterMasterSarpras();
}

function filterMasterSarpras(kategori) {
  if (kategori) {
    activeFilterMasterKategori = kategori;
    window.currentMasterSarprasFilter = kategori;
  }

  const activeKat = activeFilterMasterKategori || window.currentMasterSarprasFilter || 'Semua';
  const searchInput = document.getElementById("cariBarangMaster");
  const rawQuery = searchInput?.value || "";
  const query = rawQuery.trim().toLowerCase();

  // Kontrol tampilan tombol 'X' pembersih search input
  const clearBtn = document.getElementById("btnClearSearchBarangMaster");
  if (clearBtn) {
    const hasText = rawQuery.trim().length > 0;
    clearBtn.classList.toggle("visible", hasText);
    clearBtn.style.setProperty("display", hasText ? "inline-flex" : "none", "important");
  }

  updateBadgeFilterActiveBarang();

  const allItems = (typeof getMasterSarprasItems === 'function') ? getMasterSarprasItems() : [];

  const filtered = allItems.filter(item => {
    const katMatch = (activeKat === 'Semua') || (item.kategori === activeKat);
    const searchMatch = !query || item.nama.toLowerCase().includes(query);
    return katMatch && searchMatch;
  });

  const tbody = document.getElementById("tbodyMasterSarpras");
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="cell-empty-state" style="text-align: center; padding: 40px 16px;">
          <div style="font-size: 2.2rem; color: #cbd5e1; margin-bottom: 8px;">
            <i class="fa-solid fa-box-open"></i>
          </div>
          <strong style="color: #334155; font-size: 0.95rem; display: block; margin-bottom: 4px;">Tidak Ada Barang Ditemukan</strong>
          <span style="font-size: 0.8rem; color: #64748b;">Tidak ditemukan barang inventaris pada kategori "${escapeHTML(activeKat)}" atau pencarian "${escapeHTML(query)}".</span>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((item, idx) => `
    <tr data-id="${escapeHTML(item.id)}">
      <td class="cell-no" style="text-align: center; color: #64748b; font-weight: 600;">
        ${idx + 1}
      </td>
      <td class="cell-name">
        <strong class="sar-master-name-text" style="color: #0f172a; font-size: 0.9rem; font-weight: 700;">${escapeHTML(item.nama)}</strong>
      </td>
      <td class="cell-kategori" style="text-align: center;">
        <span class="mobile-cell-label"><i class="fa-solid fa-tag"></i> Kategori:</span>
        ${getKategoriBadgeHTML(item.kategori)}
      </td>
      <td class="cell-actions" style="text-align: center;">
        <div class="action-btns" style="justify-content: center;">
          <button type="button" class="btn-action-icon btn-edit" onclick="editBarangMasterSarpras('${escapeHTML(item.id)}')" title="Edit Nama & Kategori Barang">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="btn-action-icon btn-delete" onclick="hapusBarangMasterSarpras('${escapeHTML(item.id)}')" title="Hapus Barang Master">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function tambahBarangMasterSarpras() {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Tambah Barang Inventaris',
      showCloseButton: true,
      reverseButtons: true,
      html: `
        <div style="text-align: left; margin-top: 6px;">
          <div style="margin-bottom: 22px;">
            <label style="font-size: 0.85rem; font-weight: 700; color: #1e293b; margin-bottom: 8px; display: block;">
              Nama Perlengkapan / Barang <span style="color: #dc2626;">*</span>
            </label>
            <input type="text" id="swalMasterNama" class="swal-master-input-field" placeholder="Contoh: Baju PDU Laki-Laki..." autocomplete="off">
          </div>
          <div style="margin-bottom: 6px;">
            <label style="font-size: 0.85rem; font-weight: 700; color: #1e293b; margin-bottom: 10px; display: block;">
              <i class="fa-solid fa-tags" style="color: var(--accent-red, #b91c1c); margin-right: 5px;"></i> Pembagian Kategori <span style="color: #dc2626;">*</span>
            </label>
            <input type="hidden" id="swalMasterKategoriVal" value="Umum">
            <div class="swal-kategori-pill-grid">
              <button type="button" class="filter-pill-btn active" id="btnPillKategori_Umum" onclick="selectSwalMasterKategori('Umum')">
                Umum
              </button>
              <button type="button" class="filter-pill-btn" id="btnPillKategori_Laki" onclick="selectSwalMasterKategori('Laki - Laki')">
                Laki - Laki
              </button>
              <button type="button" class="filter-pill-btn" id="btnPillKategori_Perempuan" onclick="selectSwalMasterKategori('Perempuan')">
                Perempuan
              </button>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-plus"></i> Tambahkan',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup swal-popup-master-sarpras' },
      didOpen: () => {
        document.getElementById("swalMasterNama")?.focus();
      },
      preConfirm: () => {
        const nama = document.getElementById("swalMasterNama")?.value.trim();
        const kategori = document.getElementById("swalMasterKategoriVal")?.value || 'Umum';
        if (!nama) {
          Swal.showValidationMessage("Nama perlengkapan wajib diisi!");
          return false;
        }
        return { nama, kategori };
      }
    }).then(res => {
      if (res.isConfirmed && res.value) {
        const list = (typeof getMasterSarprasItems === 'function') ? getMasterSarprasItems() : [];
        if (list.some(i => i.nama.toLowerCase() === res.value.nama.toLowerCase())) {
          if (typeof showSmallToast === 'function') {
            showSmallToast({ icon: 'warning', title: 'Barang Sudah Ada', text: `"${res.value.nama}" sudah terdaftar.` });
          } else {
            alert(`"${res.value.nama}" sudah terdaftar.`);
          }
          return;
        }
        const newItem = {
          id: 'srp-' + Date.now(),
          nama: res.value.nama,
          kategori: res.value.kategori
        };
        list.push(newItem);
        saveMasterSarprasItems(list);
        renderHalamanBarangSarpras();
        refreshSarprasFormTable();
        const tbodySar = document.getElementById("tbodySarpras");
        if (tbodySar) {
          const newRow = tbodySar.querySelector(`tr[data-id="${newItem.id}"]`);
          if (newRow) {
            try {
              newRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              newRow.querySelector(".sar-layak")?.focus();
            } catch (e) {}
          }
        }
        if (typeof showSmallToast === 'function') {
          showSmallToast({ icon: 'success', title: 'Barang Ditambahkan', text: `"${res.value.nama}" berhasil ditambahkan ke master inventaris.` });
        }
      }
    });
  } else {
    const nama = prompt("Masukkan nama perlengkapan:");
    if (nama && nama.trim()) {
      const list = getMasterSarprasItems();
      const newItem = { id: 'srp-' + Date.now(), nama: nama.trim(), kategori: 'Umum' };
      list.push(newItem);
      saveMasterSarprasItems(list);
      renderHalamanBarangSarpras();
      refreshSarprasFormTable();
    }
  }
}

function editBarangMasterSarpras(id) {
  const list = (typeof getMasterSarprasItems === 'function') ? getMasterSarprasItems() : [];
  const item = list.find(i => String(i.id) === String(id));
  if (!item) return;

  const currentKat = item.kategori || 'Umum';

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Edit Barang Inventaris',
      showCloseButton: true,
      reverseButtons: true,
      html: `
        <div style="text-align: left; margin-top: 6px;">
          <div style="margin-bottom: 22px;">
            <label style="font-size: 0.85rem; font-weight: 700; color: #1e293b; margin-bottom: 8px; display: block;">
              Nama Perlengkapan / Barang <span style="color: #dc2626;">*</span>
            </label>
            <input type="text" id="swalEditMasterNama" class="swal-master-input-field" value="${escapeHTML(item.nama)}" autocomplete="off">
          </div>
          <div style="margin-bottom: 6px;">
            <label style="font-size: 0.85rem; font-weight: 700; color: #1e293b; margin-bottom: 10px; display: block;">
              <i class="fa-solid fa-tags" style="color: var(--accent-red, #b91c1c); margin-right: 5px;"></i> Pembagian Kategori <span style="color: #dc2626;">*</span>
            </label>
            <input type="hidden" id="swalMasterKategoriVal" value="${escapeHTML(currentKat)}">
            <div class="swal-kategori-pill-grid">
              <button type="button" class="filter-pill-btn ${currentKat === 'Umum' ? 'active' : ''}" id="btnPillKategori_Umum" onclick="selectSwalMasterKategori('Umum')">
                Umum
              </button>
              <button type="button" class="filter-pill-btn ${currentKat === 'Laki - Laki' ? 'active' : ''}" id="btnPillKategori_Laki" onclick="selectSwalMasterKategori('Laki - Laki')">
                Laki - Laki
              </button>
              <button type="button" class="filter-pill-btn ${currentKat === 'Perempuan' ? 'active' : ''}" id="btnPillKategori_Perempuan" onclick="selectSwalMasterKategori('Perempuan')">
                Perempuan
              </button>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup swal-popup-master-sarpras' },
      didOpen: () => {
        document.getElementById("swalEditMasterNama")?.focus();
      },
      preConfirm: () => {
        const nama = document.getElementById("swalEditMasterNama")?.value.trim();
        const kategori = document.getElementById("swalMasterKategoriVal")?.value || 'Umum';
        if (!nama) {
          Swal.showValidationMessage("Nama perlengkapan wajib diisi!");
          return false;
        }
        return { nama, kategori };
      }
    }).then(res => {
      if (res.isConfirmed && res.value) {
        item.nama = res.value.nama;
        item.kategori = res.value.kategori;
        saveMasterSarprasItems(list);
        renderHalamanBarangSarpras();
        refreshSarprasFormTable();
        const tbodySar = document.getElementById("tbodySarpras");
        if (tbodySar) {
          const newRow = tbodySar.querySelector(`tr[data-id="${newItem.id}"]`);
          if (newRow) {
            try {
              newRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              newRow.querySelector(".sar-layak")?.focus();
            } catch (e) {}
          }
        }
        if (typeof showSmallToast === 'function') {
          showSmallToast({ icon: 'success', title: 'Barang Diperbarui', text: `Perubahan "${item.nama}" berhasil disimpan.` });
        }
      }
    });
  }
}

function hapusBarangMasterSarpras(id) {
  const list = (typeof getMasterSarprasItems === 'function') ? getMasterSarprasItems() : [];
  const idx = list.findIndex(i => String(i.id) === String(id));
  if (idx === -1) return;
  const item = list[idx];

  const doRemove = () => {
    list.splice(idx, 1);
    saveMasterSarprasItems(list);
    renderHalamanBarangSarpras();
    refreshSarprasFormTable();
    if (typeof showSmallToast === 'function') {
      showSmallToast({ icon: 'success', title: 'Barang Dihapus', text: `"${item.nama}" telah dihapus dari master inventaris.` });
    }
  };

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Hapus Barang Inventaris?',
      text: `Yakin ingin menghapus "${item.nama}" (${item.kategori}) dari master inventaris?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' }
    }).then(res => {
      if (res.isConfirmed) doRemove();
    });
  } else if (confirm(`Hapus "${item.nama}"?`)) {
    doRemove();
  }
}

function refreshSarprasFormTable() {
  const tbody = document.getElementById("tbodySarpras");
  if (!tbody) return;

  const existingValues = new Map();
  Array.from(tbody.querySelectorAll("tr")).forEach(tr => {
    const name = tr.querySelector(".sar-item-name")?.textContent.trim() || tr.cells[1]?.textContent.trim();
    if (name) {
      const layak = tr.querySelector(".sar-layak")?.value || '0';
      const tidakLayak = tr.querySelector(".sar-tidak")?.value || '0';
      existingValues.set(name.toLowerCase(), { layak, tidakLayak });
    }
  });

  const masterList = (typeof getMasterSarprasItems === 'function') ? getMasterSarprasItems() : [];
  tbody.innerHTML = masterList.map((item, idx) => {
    const nama = item.nama;
    const kategori = item.kategori || 'Umum';
    const id = item.id || `srp-${idx + 1}`;
    const prev = existingValues.get(nama.toLowerCase()) || { layak: '0', tidakLayak: '0' };
    const layakNum = Number(prev.layak) || 0;
    const tidakNum = Number(prev.tidakLayak) || 0;
    const totalNum = layakNum + tidakNum;

    return `
      <tr data-id="${escapeHTML(id)}" data-kategori="${escapeHTML(kategori)}">
        <td class="sar-cell-no" style="text-align:center; color:#64748b; font-weight:600;">${idx + 1}</td>
        <td class="sar-cell-nama">
          <strong class="sar-item-name" style="color:#0f172a; font-weight: 700; font-size: 0.9rem;">${escapeHTML(nama)}</strong>
        </td>
        <td class="sar-cell-layak"><input type="text" inputmode="numeric" value="${prev.layak}" class="form-control-table sar-layak text-center" onfocus="handleSarprasFocus(this)" oninput="hitungSarprasRow(this)" onblur="handleSarprasBlur(this)"></td>
        <td class="sar-cell-tidak"><input type="text" inputmode="numeric" value="${prev.tidakLayak}" class="form-control-table sar-tidak text-center" onfocus="handleSarprasFocus(this)" oninput="hitungSarprasRow(this)" onblur="handleSarprasBlur(this)"></td>
        <td class="sar-cell-total" style="text-align:center; background:#f8fafc;"><strong class="sar-total" style="color:#0f172a;">${totalNum.toLocaleString("id-ID")}</strong></td>
      </tr>
    `;
  }).join("");

  updateSarprasNumbers();
  hitungSarprasSummary();
}

/* ==========================================================================
   HELPER FORM MEDIA KREATIF (PUBDOK)
   ========================================================================== */
function setupCalendarDropdowns(instance) {
  if (!instance || !instance.calendarContainer) return;
  const container = instance.calendarContainer;
  container.classList.add("flatpickr-all-dates");

  // 1. Sembunyikan arrow navigasi prev & next (hanya dropdown bulan & tahun)
  const prevBtn = container.querySelector(".flatpickr-prev-month");
  const nextBtn = container.querySelector(".flatpickr-next-month");
  if (prevBtn) prevBtn.style.display = "none";
  if (nextBtn) nextBtn.style.display = "none";

  const curMonthDiv = container.querySelector(".flatpickr-current-month");
  if (!curMonthDiv) return;

  // 2. Setup Year Dropdown
  let yearSelect = curMonthDiv.querySelector(".flatpickr-year-dropdown");
  const numWrapper = curMonthDiv.querySelector(".numInputWrapper");
  const curYearInput = curMonthDiv.querySelector("input.cur-year");
  const curYear = instance.currentYear || new Date().getFullYear();

  if (!yearSelect) {
    yearSelect = document.createElement("select");
    yearSelect.className = "flatpickr-year-dropdown";
    yearSelect.setAttribute("aria-label", "Pilih Tahun");

    const minYear = 2024;
    const maxYear = new Date().getFullYear();

    for (let y = minYear; y <= maxYear; y++) {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      if (y === curYear) opt.selected = true;
      yearSelect.appendChild(opt);
    }

    yearSelect.addEventListener("change", (e) => {
      e.stopPropagation();
      const chosenYear = parseInt(yearSelect.value, 10);
      if (!isNaN(chosenYear)) {
        instance.changeYear(chosenYear);
      }
    });

    if (numWrapper) {
      numWrapper.style.display = "none";
      curMonthDiv.appendChild(yearSelect);
    } else if (curYearInput) {
      curYearInput.style.display = "none";
      curMonthDiv.appendChild(yearSelect);
    } else {
      curMonthDiv.appendChild(yearSelect);
    }
  } else {
    yearSelect.value = curYear;
  }
}

function initMedDatePicker(inputEl, initialVal) {
  if (!inputEl || typeof flatpickr === "undefined") return;

  const baseLocale = (typeof flatpickr.l10ns !== "undefined" && flatpickr.l10ns.id) 
    ? flatpickr.l10ns.id 
    : {};

  const idLocale = {
    ...baseLocale,
    firstDayOfWeek: 1,
    weekdays: {
      shorthand: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
      longhand: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
    },
    months: {
      shorthand: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
      longhand: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    }
  };

  const now = new Date();
  let defaultDateVal = null;
  if (initialVal) {
    const ymd = normalizeTanggalToYMD(initialVal);
    if (ymd) defaultDateVal = ymd;
  }

  const fpConfig = {
    locale: idLocale,
    dateFormat: "j F Y",
    disableMobile: true,
    allowInput: false,
    monthSelectorType: "dropdown",
    maxDate: now,
    minDate: "2025-01-01",
    position: "auto center",
    ...(defaultDateVal ? { defaultDate: defaultDateVal } : {}),
    onDayCreate: function (dObj, dStr, fp, dayElem) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (dayElem.dateObj && dayElem.dateObj > today) {
        dayElem.classList.add("future-day-hidden");
      }
    },
    onReady: function(selectedDates, dateStr, instance) {
      setupCalendarDropdowns(instance);
    },
    onOpen: function(selectedDates, dateStr, instance) {
      setupCalendarDropdowns(instance);

      // Tutup otomatis saat pengguna scroll halaman agar tidak melayang / terpotong
      const onScrollClose = () => {
        if (instance && instance.isOpen) {
          instance.close();
        }
        window.removeEventListener("scroll", onScrollClose, true);
      };
      window.addEventListener("scroll", onScrollClose, true);
    },
    onMonthChange: function(selectedDates, dateStr, instance) {
      setupCalendarDropdowns(instance);
    },
    onYearChange: function(selectedDates, dateStr, instance) {
      setupCalendarDropdowns(instance);
    },
    onChange: function(selectedDates, dateStr) {
      inputEl.value = dateStr;
      inputEl.classList.remove("input-error");
    }
  };

  try {
    flatpickr(inputEl, fpConfig);
  } catch (err) {
    console.warn("Gagal inisialisasi flatpickr med-waktu:", err);
  }
}

function toggleMetricCell(td, isVisible) {
  if (!td) return;
  const input = td.querySelector("input");
  let placeholder = td.querySelector(".med-metric-placeholder");

  if (!placeholder) {
    placeholder = document.createElement("span");
    placeholder.className = "med-metric-placeholder";
    placeholder.textContent = "-";
    td.appendChild(placeholder);
  }

  if (isVisible) {
    td.classList.remove("is-metric-hidden");
    if (input) {
      input.style.display = "";
      input.removeAttribute("disabled");
    }
    placeholder.style.display = "none";
  } else {
    td.classList.add("is-metric-hidden");
    if (input) {
      input.style.display = "none";
      input.setAttribute("disabled", "disabled");
      input.value = "0";
    }
    placeholder.style.display = "";
  }
}

function updateMedRowFieldsVisibility(tr) {
  if (!tr) return;

  const platformSelect = tr.querySelector(".med-platform");
  const tipeSelect = tr.querySelector(".med-tipe");

  const platform = platformSelect ? platformSelect.value : "Instagram";

  // Aturan 1: Kalau yang dipilih WhatsApp maka tipenya otomatis Chat
  if (platform === "WhatsApp") {
    if (tipeSelect && tipeSelect.value !== "Chat") {
      tipeSelect.value = "Chat";
    }
  }

  const tipe = tipeSelect ? tipeSelect.value : "Postingan";

  // Aturan 2: Kalau yang dipilih Chat (apapun platformnya) maka otomatis tidak usah ada yang diinput (metrik)
  const isChat = (tipe === "Chat" || platform === "WhatsApp");
  const isTikTok = (platform === "TikTok" && !isChat);
  const isInstagram = (platform === "Instagram" && !isChat);

  // Group 1: Jangkauan (Hanya Instagram non-chat)
  tr.querySelectorAll(".med-cell-jangkau").forEach(td => toggleMetricCell(td, isInstagram));

  // Group 2: Interaksi (Like, Komen, Share, Repost, Save) - Instagram & TikTok non-chat
  tr.querySelectorAll(".med-cell-like, .med-cell-komen, .med-cell-share, .med-cell-repost, .med-cell-save").forEach(td => toggleMetricCell(td, isInstagram || isTikTok));

  // Group 3: Profil & Followers (Kunjungan, Followers) - Instagram & TikTok non-chat
  tr.querySelectorAll(".med-cell-kunjungan, .med-cell-followers").forEach(td => toggleMetricCell(td, isInstagram || isTikTok));

  // Group 4: Impresi Insight (%) (Profil%, Kabar%, Jelajah%) - Hanya Instagram non-chat
  tr.querySelectorAll(".med-cell-profil, .med-cell-kabar, .med-cell-jelajah").forEach(td => toggleMetricCell(td, isInstagram));

  // Mobile info notice untuk mode Chat / WhatsApp
  let chatNotice = tr.querySelector(".med-chat-notice-card");
  if (isChat) {
    if (!chatNotice) {
      chatNotice = document.createElement("div");
      chatNotice.className = "med-chat-notice-card";
      chatNotice.innerHTML = '<i class="fa-solid fa-circle-info" style="color: #0284c7;"></i> <span>Tipe Chat / WhatsApp tidak memerlukan input metrik insight.</span>';
      tr.appendChild(chatNotice);
    }
    chatNotice.style.display = "";
  } else if (chatNotice) {
    chatNotice.style.display = "none";
  }

  // Set class mode pada tr
  tr.classList.toggle("is-chat-mode", isChat);
  tr.classList.toggle("is-tiktok-mode", isTikTok);
  tr.classList.toggle("is-instagram-mode", isInstagram);
}

function hapusBarisKontenMed(btn) {
  if (!btn) return;
  const tr = btn.closest("tr");
  if (tr) {
    const tbody = tr.parentElement;
    tr.remove();
    if (tbody) {
      tbody.querySelectorAll("tr").forEach((row, idx) => {
        row.querySelectorAll(".row-num").forEach(numEl => {
          numEl.textContent = idx + 1;
        });
      });
    }
  }
}

function tambahBarisKontenMed(data = {}) {
  const tbody = document.getElementById("tbodyMedKonten");
  if (!tbody) return;
  const count = tbody.querySelectorAll("tr").length + 1;

  const tr = document.createElement("tr");
  tr.className = "med-row-item";

  const currentPlatform = data.platform || "Instagram";
  const currentTipe = data.tipe || (currentPlatform === "WhatsApp" ? "Chat" : "Postingan");
  const defaultWaktu = data.waktu || "";

  tr.innerHTML = `
    <!-- 1. Nomor & Mobile Top Bar -->
    <td class="med-cell-no">
      <div class="med-card-top-bar">
        <span class="med-card-badge"><i class="fa-solid fa-photo-film"></i> Postingan #<span class="row-num">${count}</span></span>
        <button type="button" class="btn-card-delete" onclick="hapusBarisKontenMed(this)" title="Hapus Postingan">
          <i class="fa-solid fa-trash-can"></i> Hapus
        </button>
      </div>
      <span class="desktop-only-no row-num">${count}</span>
    </td>

    <!-- 2. Waktu -->
    <td class="med-cell-waktu" style="min-width: 185px; width: 185px;">
      <label class="med-cell-label"><i class="fa-regular fa-calendar"></i> Waktu / Tanggal</label>
      <div style="position: relative; display: flex; align-items: center; width: 100%;">
        <input type="text" class="form-control-table med-waktu" value="${escapeHTML(defaultWaktu)}" placeholder="Pilih Tanggal..." readonly style="cursor: pointer; text-align: left; padding-left: 10px; padding-right: 28px; font-weight: 500; font-size: 0.825rem; width: 100%; min-width: 165px;">
        <i class="fa-regular fa-calendar" style="position: absolute; right: 10px; color: #64748b; pointer-events: none; font-size: 0.85rem;"></i>
      </div>
    </td>

    <!-- 3. Platform -->
    <td class="med-cell-platform">
      <label class="med-cell-label"><i class="fa-solid fa-share-nodes"></i> Platform</label>
      <select class="form-control-table med-platform" style="cursor: pointer; font-weight: 500;" required>
        <option value="Instagram" ${currentPlatform === "Instagram" ? "selected" : ""}>Instagram</option>
        <option value="TikTok" ${currentPlatform === "TikTok" ? "selected" : ""}>TikTok</option>
        <option value="WhatsApp" ${currentPlatform === "WhatsApp" ? "selected" : ""}>WhatsApp</option>
      </select>
    </td>

    <!-- 4. Tipe Konten -->
    <td class="med-cell-tipe">
      <label class="med-cell-label"><i class="fa-solid fa-layer-group"></i> Tipe Konten</label>
      <select class="form-control-table med-tipe" style="cursor: pointer; font-weight: 500;" required>
        <option value="Postingan" ${currentTipe === "Postingan" ? "selected" : ""}>Postingan</option>
        <option value="Reels" ${currentTipe === "Reels" ? "selected" : ""}>Reels</option>
        <option value="Story" ${currentTipe === "Story" ? "selected" : ""}>Story</option>
        <option value="Chat" ${currentTipe === "Chat" ? "selected" : ""}>Chat</option>
      </select>
    </td>

    <!-- 5. Nama Konten -->
    <td class="med-cell-nama">
      <label class="med-cell-label"><i class="fa-solid fa-heading"></i> Judul / Topik Konten</label>
      <input type="text" class="form-control-table med-nama" value="${escapeHTML(data.nama || "")}" placeholder="Judul / Topik Konten" required oninput="this.classList.remove('input-error')">
    </td>

    <!-- 6. Jangkauan -->
    <td class="med-cell-jangkau">
      <label class="med-cell-label"><i class="fa-solid fa-users"></i> Jangkauan</label>
      <input type="number" min="0" value="${data.jangkau ?? 0}" class="form-control-table med-jangkau text-center" style="font-weight: 600;">
    </td>

    <!-- 7. Like -->
    <td class="med-cell-like">
      <label class="med-cell-label"><i class="fa-solid fa-heart" style="color: #e11d48;"></i> Like</label>
      <input type="number" min="0" value="${data.like ?? 0}" class="form-control-table med-like text-center">
    </td>

    <!-- 8. Komen -->
    <td class="med-cell-komen">
      <label class="med-cell-label"><i class="fa-regular fa-comment-dots" style="color: #0284c7;"></i> Komen</label>
      <input type="number" min="0" value="${data.komen ?? 0}" class="form-control-table med-komen text-center">
    </td>

    <!-- 9. Share -->
    <td class="med-cell-share">
      <label class="med-cell-label"><i class="fa-solid fa-share" style="color: #16a34a;"></i> Share</label>
      <input type="number" min="0" value="${data.share ?? 0}" class="form-control-table med-share text-center">
    </td>

    <!-- 10. Repost -->
    <td class="med-cell-repost">
      <label class="med-cell-label"><i class="fa-solid fa-repeat" style="color: #7c3aed;"></i> Repost</label>
      <input type="number" min="0" value="${data.repost ?? 0}" class="form-control-table med-repost text-center">
    </td>

    <!-- 11. Save -->
    <td class="med-cell-save">
      <label class="med-cell-label"><i class="fa-regular fa-bookmark" style="color: #d97706;"></i> Save</label>
      <input type="number" min="0" value="${data.save ?? 0}" class="form-control-table med-save text-center">
    </td>

    <!-- 12. Kunjungan -->
    <td class="med-cell-kunjungan">
      <label class="med-cell-label"><i class="fa-solid fa-id-badge"></i> Kunjungan</label>
      <input type="number" min="0" value="${data.kunjungan ?? 0}" class="form-control-table med-kunjungan text-center">
    </td>

    <!-- 13. Followers -->
    <td class="med-cell-followers">
      <label class="med-cell-label"><i class="fa-solid fa-user-plus"></i> Followers</label>
      <input type="number" min="0" value="${data.followers ?? 0}" class="form-control-table med-followers text-center">
    </td>

    <!-- 14. Profil% -->
    <td class="med-cell-profil">
      <label class="med-cell-label">Profil%</label>
      <input type="number" min="0" step="0.1" value="${data.profilPct ?? 0}" class="form-control-table med-profil text-center">
    </td>

    <!-- 15. Kabar% -->
    <td class="med-cell-kabar">
      <label class="med-cell-label">Kabar%</label>
      <input type="number" min="0" step="0.1" value="${data.kabarPct ?? 0}" class="form-control-table med-kabar text-center">
    </td>

    <!-- 16. Jelajah% -->
    <td class="med-cell-jelajah">
      <label class="med-cell-label">Jelajah%</label>
      <input type="number" min="0" step="0.1" value="${data.jelajahPct ?? 0}" class="form-control-table med-jelajah text-center">
    </td>

    <!-- 17. Aksi (Desktop) -->
    <td class="med-cell-aksi text-center">
      <button type="button" class="btn-action-icon btn-delete" style="width:28px; height:28px;" onclick="hapusBarisKontenMed(this)" title="Hapus"><i class="fa-solid fa-trash-can" style="font-size:0.75rem;"></i></button>
    </td>
  `;
  tbody.appendChild(tr);

  // Inisialisasi Flatpickr interaktif kalender untuk input waktu di baris ini
  const waktuInput = tr.querySelector(".med-waktu");
  if (waktuInput) {
    initMedDatePicker(waktuInput, defaultWaktu);
  }

  // Pasang listener perubahan platform & tipe konten
  const platformSelect = tr.querySelector(".med-platform");
  const tipeSelect = tr.querySelector(".med-tipe");

  if (platformSelect) {
    platformSelect.addEventListener("change", () => {
      if (platformSelect.value === "WhatsApp" && tipeSelect) {
        tipeSelect.value = "Chat";
      }
      updateMedRowFieldsVisibility(tr);
    });
  }

  if (tipeSelect) {
    tipeSelect.addEventListener("change", () => {
      if (tipeSelect.value !== "Chat" && platformSelect && platformSelect.value === "WhatsApp") {
        platformSelect.value = "Instagram";
      }
      updateMedRowFieldsVisibility(tr);
    });
  }

  // Terapkan visibility awal sesuai data
  updateMedRowFieldsVisibility(tr);
}


/* ==========================================================================
   8. SUBMIT & SIMPAN LAPORAN
   ========================================================================== */
function simpanLaporan(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();

  if (typeof isWakilAtauPelatih === 'function' && isWakilAtauPelatih(state.currentUser)) {
    if (typeof showSmallAlert === 'function') {
      showSmallAlert({
        icon: 'warning',
        title: 'Akses Dibatasi',
        text: 'Wakil Ketua dan Pelatih tidak memiliki izin untuk membuat atau menyimpan laporan. Anda hanya memiliki hak akses melihat laporan.'
      });
    }
    return;
  }

  const selectedDivisiRadio = document.querySelector('input[name="divisiReport"]:checked');
  let divisiKey = selectedDivisiRadio ? selectedDivisiRadio.value : "";
  if (!divisiKey) {
    if (state.currentUser && typeof normalizeUserDivisionId === 'function') {
      divisiKey = normalizeUserDivisionId(state.currentUser);
    }
  }
  if (!divisiKey) divisiKey = "sekretaris";

  const matchedDivisi = (Array.isArray(state.divisi) ? state.divisi : []).find(d => d.id === divisiKey);
  const fallbackDivisiName = divisiKey === "sekretaris" ? "Divisi Sekretaris" :
                             divisiKey === "bendahara" ? "Divisi Bendahara" :
                             divisiKey === "korlap" ? "Divisi Koordinator Lapangan" :
                             divisiKey === "sarpras" ? "Divisi Sarana & Prasarana" :
                             divisiKey === "media_kreatif" ? "Divisi Media Kreatif" : "Divisi Sekretaris";
  const divisiNama = (matchedDivisi && matchedDivisi.nama) ? matchedDivisi.nama : fallbackDivisiName;

  const tglInput = document.getElementById("lapTanggal");
  const tanggal = normalizeTanggalToYMD((tglInput?.value || "").trim());

  if (!tanggal) {
    if (tglInput) {
      tglInput.classList.add("input-error");
      tglInput.focus();
    }
    if (fpTanggalInstance && typeof fpTanggalInstance.open === 'function') {
      fpTanggalInstance.open();
    }
    const isMonthlyDiv = (divisiKey === 'sarpras' || divisiKey === 'media_kreatif');
    showSmallAlert({
      icon: 'warning',
      title: isMonthlyDiv ? 'Bulan Periode Belum Dipilih' : 'Waktu Latihan Belum Dipilih',
      text: isMonthlyDiv ? 'Silakan pilih bulan periode laporan terlebih dahulu.' : 'Silakan pilih tanggal waktu latihan (khusus hari Selasa) terlebih dahulu.'
    });
    return;
  }

  const dateInfo = getReportDateInfo();

  // Validasi apakah folder bulan Google Drive sudah dibuat
  if (!dateInfo.folderExists) {
    showSmallAlert({
      icon: 'error',
      title: 'Folder Drive Belum Dibuat',
      text: `Folder Google Drive untuk "${dateInfo.bulanNama}" belum dibuat di sistem. Laporan belum dapat disimpan sebelum folder bulan tersebut dibuat oleh Admin/Pimpinan di menu Kelola Folder Bulan.`
    });
    return;
  }

  const judulUtamaInput = document.getElementById("lapJudulUtama");
  const judul = (judulUtamaInput?.value || document.getElementById("lapJudul")?.value || "").trim();
  const pelapor = document.getElementById("lapPelapor")?.value.trim() || (state.currentUser ? state.currentUser.nama : "Sekretaris");
  const linkDriveUmum = (document.getElementById("lapLinkDriveUmum")?.value || "").trim();

  if (!judul) {
    if (judulUtamaInput) {
      judulUtamaInput.classList.add("input-error");
      judulUtamaInput.focus();
    }
    showSmallAlert({
      icon: 'warning',
      title: 'Judul Laporan Kosong',
      text: 'Silakan masukkan Judul Laporan terlebih dahulu.'
    });
    return;
  }

  let detail = {
    mingguKe: dateInfo.mingguKe,
    tanggalIndo: dateInfo.tanggalIndo,
    linkDrive: linkDriveUmum
  };

  const executeSave = () => {
    const kategoriBulan = document.getElementById("lapKategoriBulan")?.value || dateInfo.bulanNama;
    detail.kategoriBulan = kategoriBulan;

    const isEdit = Boolean(window.editingLaporanId);
    const targetId = isEdit ? window.editingLaporanId : ("lap-" + Date.now().toString().slice(-5));
    const existingLap = isEdit ? (state.laporan || []).find(l => l.id === targetId) : null;

    const newLaporan = {
      id: targetId,
      divisiId: divisiKey,
      divisiNama,
      judul,
      pelapor,
      tanggal,
      tanggalIndo: dateInfo.tanggalIndo,
      kategoriBulan,
      detail,
      statusReview: existingLap ? (existingLap.statusReview || "Terkirim") : "Terkirim",
      driveFileUrl: existingLap ? (existingLap.driveFileUrl || existingLap.driveUrl || "") : ""
    };

    const doSaveLaporan = async () => {
      // Tampilkan indikator loading agar pengguna tahu proses penyimpanan cloud sedang berjalan
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: isEdit ? 'Menyimpan Perubahan...' : 'Menyimpan Laporan...',
          html: isEdit 
            ? 'Sedang memperbarui data di Database Google Sheets & Google Drive...'
            : 'Sedang menyimpan data ke Database Google Sheets dan mengunggah dokumen ke Google Drive...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      }

      try {
        // Buat berkas PDF resmi (Base64) agar Google Drive langsung mendapatkan file PDF editan terbaru
        let pdfBase64 = "";
        if (typeof generateReportPDFDoc === 'function') {
          try {
            const doc = generateReportPDFDoc(newLaporan);
            if (doc) {
              const rawUri = doc.output('datauristring');
              const b64Marker = rawUri.indexOf(";base64,");
              pdfBase64 = (b64Marker !== -1) ? rawUri.substring(b64Marker + 8) : rawUri;
            }
          } catch (ePdf) {
            console.warn("Gagal membuat Base64 PDF saat simpan laporan:", ePdf);
          }
        }
        if (pdfBase64) {
          newLaporan.pdfBase64 = pdfBase64;
        }

        let cloudResult = null;
        if (typeof syncChangeToGAS === 'function') {
          cloudResult = await syncChangeToGAS('saveLaporan', { data: newLaporan });
        }

        if (cloudResult && cloudResult.driveFileUrl) {
          newLaporan.driveFileUrl = cloudResult.driveFileUrl;
        }

        if (isEdit) {
          const idx = state.laporan.findIndex(l => l.id === targetId);
          if (idx !== -1) {
            state.laporan[idx] = newLaporan;
          } else {
            state.laporan.unshift(newLaporan);
          }
        } else {
          state.laporan.unshift(newLaporan);
        }
        saveState();

        const angkatanInfo = (divisiKey === "sekretaris" && detail.angkatan) ? ` (${detail.angkatan})` : "";
        batalEditLaporan(false);

        if (typeof renderDashboard === 'function') renderDashboard();
        if (typeof renderTabelLaporan === 'function') renderTabelLaporan();
        if (typeof updateArsipBadges === 'function') updateArsipBadges();

        // Refresh sinkronisasi daftar berkas di Google Drive agar tab Drive langsung menampilkan berkas terbaru
        if (typeof sinkronkanSemuaDariDrive === 'function') {
          setTimeout(() => sinkronkanSemuaDariDrive(true), 1200);
        }

        if (isEdit && typeof switchTab === 'function') {
          switchTab('tab-arsip-laporan');
        }

        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'success',
            title: isEdit ? 'Perubahan Laporan Disimpan' : 'Laporan Berhasil Disimpan',
            text: isEdit 
              ? `Laporan "${judul}"${angkatanInfo} telah berhasil diperbarui di Database Google Sheets & Google Drive.`
              : `Laporan ${divisiNama}${angkatanInfo} telah berhasil disimpan ke Database Google Sheets & diarsipkan ke Google Drive.`,
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          alert(isEdit 
            ? `Perubahan laporan "${judul}"${angkatanInfo} berhasil disimpan.`
            : `Laporan ${divisiNama}${angkatanInfo} berhasil disimpan ke Database & Google Drive.`);
        }
      } catch (errSave) {
        console.error("Gagal simpan laporan ke Google Cloud:", errSave);
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menyimpan ke Cloud',
            text: 'Terjadi kendala saat menghubungkan ke database Google Apps Script: ' + (errSave.message || errSave),
            confirmButtonColor: '#b91c1c'
          });
        } else {
          alert("Gagal menyimpan ke Google Cloud: " + (errSave.message || errSave));
        }
      }
    };

    const angkatanInfo = (divisiKey === "sekretaris" && detail.angkatan) ? ` (Angkatan ${detail.angkatan})` : "";
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: isEdit ? 'Simpan Perubahan Laporan?' : 'Simpan Laporan?',
        text: isEdit 
          ? `Apakah Anda yakin ingin menyimpan perubahan pada laporan "${judul}"${angkatanInfo} dari ${divisiNama}?`
          : `Apakah Anda yakin ingin menyimpan dan mengirim laporan "${judul}"${angkatanInfo} dari ${divisiNama}?`,
        icon: 'question',
        width: '380px',
        showCancelButton: true,
        confirmButtonColor: isEdit ? '#d97706' : '#b91c1c',
        cancelButtonColor: '#64748b',
        confirmButtonText: isEdit ? '<i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan' : 'Ya, Simpan',
        cancelButtonText: 'Batal',
        customClass: { popup: 'swal-compact-popup' }
      }).then((result) => {
        if (result.isConfirmed) doSaveLaporan();
      });
    } else if (confirm(`Apakah Anda yakin ingin ${isEdit ? 'memperbarui' : 'menyimpan'} laporan "${judul}"${angkatanInfo}?`)) {
      doSaveLaporan();
    }
  };

  if (divisiKey === "sekretaris") {
    const activeGen = window.currentSekGen || (document.getElementById("tabBtnSekG11")?.classList.contains("active") ? "G11" : "G10");
    const targetTbodyId = activeGen === "G11" ? "#tbodySekG11" : "#tbodySekG10";
    const absensiAngkatan = Array.from(document.querySelectorAll(`${targetTbodyId} tr`)).map(tr => ({
      nama: tr.querySelector(".sek-nama")?.value.trim() || "-",
      kelas: tr.querySelector(".sek-kelas")?.value.trim() || "-",
      status: tr.querySelector(".sek-status")?.value || "",
      keterangan: tr.querySelector(".sek-ket")?.value.trim() || "",
      trElement: tr,
      angkatan: activeGen
    }));

    if (absensiAngkatan.length === 0) {
      showSmallAlert({
        icon: 'warning',
        title: 'Presensi Kosong',
        text: `Tambahkan setidaknya satu anggota ke daftar absensi Angkatan ${activeGen} sebelum menyimpan laporan.`
      });
      return;
    }

    for (let i = 0; i < absensiAngkatan.length; i++) {
      const a = absensiAngkatan[i];
      if (!a.nama || a.nama === "-") {
        showSmallAlert({
          icon: 'warning',
          title: 'Nama Anggota Kosong',
          text: `Nama anggota pada baris ke-${i + 1} (${activeGen}) tidak boleh kosong.`
        });
        return;
      }
      if (a.status === "Izin" && !a.keterangan) {
        const ket = a.trElement?.querySelector(".sek-ket");
        if (ket) {
          ket.classList.add("input-error");
          ket.focus();
        }
        showSmallAlert({
          icon: 'warning',
          title: 'Alasan Izin Wajib Diisi',
          text: `Keterangan alasan izin untuk "${a.nama}" (${activeGen}) wajib diisi.`
        });
        return;
      }
    }

    const unselected = absensiAngkatan.filter(a => !a.status || a.status === "Pilih" || a.status === "Pilih Kehadiran");
    const finalizeAndSaveSek = () => {
      const absClean = Array.from(document.querySelectorAll(`${targetTbodyId} tr`)).map(tr => ({
        nama: tr.querySelector(".sek-nama")?.value.trim() || "-",
        kelas: tr.querySelector(".sek-kelas")?.value.trim() || "-",
        status: tr.querySelector(".sek-status")?.value || "Hadir",
        keterangan: tr.querySelector(".sek-ket")?.value.trim() || ""
      }));
      const hitungStatus = (arr, st) => arr.filter(a => a.status === st).length;
      const rekapAngkatan = [
        {
          angkatan: activeGen,
          hadir: hitungStatus(absClean, "Hadir"),
          izin: hitungStatus(absClean, "Izin"),
          alfa: hitungStatus(absClean, "Alfa"),
          total: absClean.length
        }
      ];

      detail = {
        ...detail,
        angkatan: activeGen,
        absensi: absClean,
        absensiG10: activeGen === "G10" ? absClean : [],
        absensiG11: activeGen === "G11" ? absClean : [],
        rekapAngkatan,
        totalHadir: hitungStatus(absClean, "Hadir"),
        totalIzin: hitungStatus(absClean, "Izin"),
        totalAlfa: hitungStatus(absClean, "Alfa"),
        totalSemua: absClean.length
      };

      executeSave();
    };

    if (unselected.length > 0) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'Kehadiran Belum Lengkap',
          html: `<p style="font-size:0.875rem; color:#475569; margin-bottom:10px;">Terdapat <strong>${unselected.length} anggota</strong> (${activeGen}) yang belum dipilih status kehadirannya.</p>
                 <p style="font-size:0.8rem; color:#64748b;">Apakah Anda ingin otomatis menandai anggota ${activeGen} tersebut sebagai <strong>Hadir</strong>, atau ingin mengisinya manual?</p>`,
          icon: 'question',
          width: '390px',
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonColor: '#16a34a',
          denyButtonColor: '#b91c1c',
          cancelButtonColor: '#64748b',
          confirmButtonText: '<i class="fa-solid fa-check"></i> Jadikan Hadir & Simpan',
          denyButtonText: '<i class="fa-solid fa-pen"></i> Isi Manual',
          cancelButtonText: 'Batal',
          customClass: { popup: 'swal-compact-popup' }
        }).then((res) => {
          if (res.isConfirmed) {
            unselected.forEach(u => {
              const sel = u.trElement?.querySelector(".sek-status");
              if (sel) {
                sel.value = "Hadir";
                sel.classList.remove("is-placeholder");
              }
            });
            hitungRekapAbsensiSekretaris();
            finalizeAndSaveSek();
          } else if (res.isDenied) {
            const first = unselected[0];
            const sel = first.trElement?.querySelector(".sek-status");
            if (sel) {
              sel.classList.add("input-error");
              sel.focus();
            }
          }
        });
        return;
      } else {
        const first = unselected[0];
        const sel = first.trElement?.querySelector(".sek-status");
        if (sel) {
          sel.classList.add("input-error");
          sel.focus();
        }
        showSmallAlert({
          icon: 'warning',
          title: 'Kehadiran Belum Dipilih',
          text: `Status kehadiran untuk "${first.nama}" (${activeGen}) belum dipilih.`
        });
        return;
      }
    }

    finalizeAndSaveSek();

  } else if (divisiKey === "bendahara") {
    // Validasi Pemasukan Tambahan
    const rowsMasuk = Array.from(document.querySelectorAll("#tbodyPemasukanLain tr"));
    for (let i = 0; i < rowsMasuk.length; i++) {
      const tr = rowsMasuk[i];
      const sumberInp = tr.querySelector(".ben-masuk-nama");
      const nominalInp = tr.querySelector(".ben-masuk-nominal");
      const sumberVal = (sumberInp?.value || "").trim();
      const nominalVal = parseInt((nominalInp?.value || "0").replace(/\D/g, ""), 10) || 0;

      if (!sumberVal) {
        if (sumberInp) {
          sumberInp.classList.add("input-error");
          sumberInp.focus();
        }
        const msg = `Mohon isi sumber pemasukan tambahan pada baris ke-${i + 1}, atau hapus baris jika tidak digunakan.`;
        if (typeof showSmallAlert === 'function') {
          showSmallAlert({ icon: 'warning', title: 'Sumber Pemasukan Kosong', text: msg });
        } else if (typeof Swal !== 'undefined') {
          Swal.fire({ icon: 'warning', title: 'Sumber Pemasukan Kosong', text: msg, confirmButtonColor: '#b91c1c' });
        }
        return;
      }

      if (nominalVal <= 0) {
        if (nominalInp) {
          nominalInp.classList.add("input-error");
          nominalInp.focus();
        }
        const msg = `Nominal pemasukan tambahan pada baris ke-${i + 1} ("${sumberVal}") harus diisi dan lebih dari Rp 0, atau hapus baris jika tidak digunakan.`;
        if (typeof showSmallAlert === 'function') {
          showSmallAlert({ icon: 'warning', title: 'Nominal Pemasukan Belum Diisi', text: msg });
        } else if (typeof Swal !== 'undefined') {
          Swal.fire({ icon: 'warning', title: 'Nominal Pemasukan Belum Diisi', text: msg, confirmButtonColor: '#b91c1c' });
        }
        return;
      }
    }

    // Validasi Pengeluaran Opsional
    const rowsKeluar = Array.from(document.querySelectorAll("#tbodyPengeluaran tr"));
    for (let i = 0; i < rowsKeluar.length; i++) {
      const tr = rowsKeluar[i];
      const rincianInp = tr.querySelector(".ben-keluar-nama");
      const nominalInp = tr.querySelector(".ben-keluar-nominal");
      const rincianVal = (rincianInp?.value || "").trim();
      const nominalVal = parseInt((nominalInp?.value || "0").replace(/\D/g, ""), 10) || 0;

      if (!rincianVal) {
        if (rincianInp) {
          rincianInp.classList.add("input-error");
          rincianInp.focus();
        }
        const msg = `Mohon isi rincian pengeluaran pada baris ke-${i + 1}, atau hapus baris jika tidak digunakan.`;
        if (typeof showSmallAlert === 'function') {
          showSmallAlert({ icon: 'warning', title: 'Rincian Pengeluaran Kosong', text: msg });
        } else if (typeof Swal !== 'undefined') {
          Swal.fire({ icon: 'warning', title: 'Rincian Pengeluaran Kosong', text: msg, confirmButtonColor: '#b91c1c' });
        }
        return;
      }

      if (nominalVal <= 0) {
        if (nominalInp) {
          nominalInp.classList.add("input-error");
          nominalInp.focus();
        }
        const msg = `Nominal pengeluaran pada baris ke-${i + 1} ("${rincianVal}") harus diisi dan lebih dari Rp 0, atau hapus baris jika tidak digunakan.`;
        if (typeof showSmallAlert === 'function') {
          showSmallAlert({ icon: 'warning', title: 'Nominal Pengeluaran Belum Diisi', text: msg });
        } else if (typeof Swal !== 'undefined') {
          Swal.fire({ icon: 'warning', title: 'Nominal Pengeluaran Belum Diisi', text: msg, confirmButtonColor: '#b91c1c' });
        }
        return;
      }
    }

    const KAS_PER_ANAK = 2000;
    const kasG10 = Array.from(document.querySelectorAll("#tbodyBenG10 tr")).map(tr => {
      const bayar = tr.querySelector(".ben-bayar")?.value || "Tidak Bayar";
      return {
        nama: tr.querySelector(".ben-nama")?.value.trim() || "-",
        kelas: tr.querySelector(".ben-kelas-val")?.value.trim() || tr.querySelector(".ben-kelas-badge")?.textContent.trim() || "",
        bayar: bayar,
        metode: bayar === "Bayar" ? (tr.querySelector(".ben-metode")?.value || "Cash") : "-",
        nominal: bayar === "Bayar" ? KAS_PER_ANAK : 0
      };
    });

    const kasG11 = Array.from(document.querySelectorAll("#tbodyBenG11 tr")).map(tr => {
      const bayar = tr.querySelector(".ben-bayar")?.value || "Tidak Bayar";
      return {
        nama: tr.querySelector(".ben-nama")?.value.trim() || "-",
        kelas: tr.querySelector(".ben-kelas-val")?.value.trim() || tr.querySelector(".ben-kelas-badge")?.textContent.trim() || "",
        bayar: bayar,
        metode: bayar === "Bayar" ? (tr.querySelector(".ben-metode")?.value || "Cash") : "-",
        nominal: bayar === "Bayar" ? KAS_PER_ANAK : 0
      };
    });

    const pemasukanTambahan = rowsMasuk
      .map(tr => ({
        sumber: (tr.querySelector(".ben-masuk-nama")?.value || "").trim(),
        nominal: Number((tr.querySelector(".ben-masuk-nominal")?.value || "0").replace(/\D/g, "")) || 0,
        metode: tr.querySelector(".ben-masuk-metode")?.value || "Cash"
      }))
      .filter(p => p.sumber && p.sumber !== "-" && p.nominal > 0);

    const pengeluaran = rowsKeluar
      .map(tr => ({
        rincian: (tr.querySelector(".ben-keluar-nama")?.value || "").trim(),
        nominal: Number((tr.querySelector(".ben-keluar-nominal")?.value || "0").replace(/\D/g, "")) || 0,
        metode: tr.querySelector(".ben-keluar-metode")?.value || "Cash"
      }))
      .filter(p => p.rincian && p.rincian !== "-" && p.nominal > 0);

    let totalCash = 0, totalQris = 0;
    [...kasG10, ...kasG11].forEach(k => {
      if (k.bayar === "Bayar") {
        if (k.metode === "QRIS") totalQris += k.nominal;
        else totalCash += k.nominal;
      }
    });
    pemasukanTambahan.forEach(p => {
      if (p.metode === "QRIS") totalQris += p.nominal;
      else totalCash += p.nominal;
    });

    const totalPengeluaran = pengeluaran.reduce((sum, item) => sum + item.nominal, 0);
    const totalPemasukan = totalCash + totalQris;

    const rawSaldoAwal = (document.getElementById("benSaldoAwal")?.value || "0").replace(/\D/g, "");
    const saldoAwal = parseInt(rawSaldoAwal, 10) || 0;
    const saldoAkhir = saldoAwal + totalPemasukan - totalPengeluaran;

    detail = {
      ...detail,
      saldoAwal,
      kasG10,
      kasG11,
      pemasukanTambahan,
      pengeluaran,
      totalCash,
      totalQris,
      totalPemasukan,
      totalPengeluaran,
      saldoAkhir
    };
    executeSave();

  } else if (divisiKey === "korlap") {
    const materiInp = document.getElementById("korlapMateri");
    const materiVal = (materiInp?.value || "").trim();
    if (!materiVal) {
      if (materiInp) {
        materiInp.classList.add("input-error");
        materiInp.focus();
      }
      const msg = "Mohon isi materi latihan (apa saja yang dilakukan saat latihan).";
      if (typeof showSmallAlert === 'function') {
        showSmallAlert({ icon: 'warning', title: 'Materi Belum Diisi', text: msg });
      } else if (typeof Swal !== 'undefined') {
        Swal.fire({ icon: 'warning', title: 'Materi Belum Diisi', text: msg, confirmButtonColor: '#b91c1c' });
      }
      return;
    }

    const evaluasiInp = document.getElementById("korlapEvaluasi");
    const evaluasiVal = (evaluasiInp?.value || "").trim();
    if (!evaluasiVal) {
      if (evaluasiInp) {
        evaluasiInp.classList.add("input-error");
        evaluasiInp.focus();
      }
      const msg = "Mohon isi evaluasi latihan (catatan/evaluasi selama latihan berlangsung).";
      if (typeof showSmallAlert === 'function') {
        showSmallAlert({ icon: 'warning', title: 'Evaluasi Belum Diisi', text: msg });
      } else if (typeof Swal !== 'undefined') {
        Swal.fire({ icon: 'warning', title: 'Evaluasi Belum Diisi', text: msg, confirmButtonColor: '#b91c1c' });
      }
      return;
    }

    detail = {
      ...detail,
      materiLatihan: materiVal,
      evaluasi: evaluasiVal
    };
    executeSave();

  } else if (divisiKey === "sarpras") {
    let totalLayak = 0;
    let totalTidakLayak = 0;
    const inventaris = Array.from(document.querySelectorAll("#tbodySarpras tr")).map(tr => {
      const barang = tr.querySelector(".sar-item-name")?.textContent.trim() || tr.cells[1]?.textContent.trim() || "-";
      const layak = Math.max(0, Number(tr.querySelector(".sar-layak")?.value || 0));
      const tidakLayak = Math.max(0, Number(tr.querySelector(".sar-tidak")?.value || 0));
      const total = layak + tidakLayak;
      totalLayak += layak;
      totalTidakLayak += tidakLayak;
      return { nama: barang, barang: barang, name: barang, layak, tidakLayak, total };
    });

    const totalSemua = totalLayak + totalTidakLayak;

    detail = {
      ...detail,
      inventaris,
      totalLayak,
      totalTidakLayak,
      totalSemua
    };
    executeSave();

  } else if (divisiKey === "media_kreatif") {
    const medRows = Array.from(document.querySelectorAll("#tbodyMedKonten tr"));

    if (medRows.length === 0) {
      if (typeof showSmallAlert === 'function') {
        showSmallAlert({
          icon: 'warning',
          title: 'Belum Ada Postingan',
          text: 'Silakan tambahkan minimal 1 baris postingan konten sebelum menyimpan laporan.'
        });
      } else if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'warning',
          title: 'Belum Ada Postingan',
          text: 'Silakan tambahkan minimal 1 baris postingan konten sebelum menyimpan laporan.',
          confirmButtonColor: '#b91c1c'
        });
      }
      return;
    }

    // Validasi: Waktu & Nama Konten wajib diisi pada setiap baris postingan
    for (let i = 0; i < medRows.length; i++) {
      const tr = medRows[i];
      const waktuInp = tr.querySelector(".med-waktu");
      const waktuVal = (waktuInp?.value || "").trim();
      const namaInp = tr.querySelector(".med-nama");
      const namaVal = (namaInp?.value || "").trim();

      if (!waktuVal) {
        if (waktuInp) {
          waktuInp.classList.add("input-error");
          waktuInp.focus();
          if (waktuInp._flatpickr && typeof waktuInp._flatpickr.open === 'function') {
            waktuInp._flatpickr.open();
          }
        }
        const msg = `Mohon pilih Waktu / Tanggal pada postingan baris ke-${i + 1} sebelum menyimpan laporan.`;
        if (typeof showSmallAlert === 'function') {
          showSmallAlert({ icon: 'warning', title: 'Waktu / Tanggal Belum Diisi', text: msg });
        } else if (typeof Swal !== 'undefined') {
          Swal.fire({ icon: 'warning', title: 'Waktu / Tanggal Belum Diisi', text: msg, confirmButtonColor: '#b91c1c' });
        }
        return;
      }

      if (!namaVal) {
        if (namaInp) {
          namaInp.classList.add("input-error");
          namaInp.focus();
        }
        const msg = `Mohon isi Nama Konten / Topik pada postingan baris ke-${i + 1} sebelum menyimpan laporan.`;
        if (typeof showSmallAlert === 'function') {
          showSmallAlert({ icon: 'warning', title: 'Nama Konten Belum Diisi', text: msg });
        } else if (typeof Swal !== 'undefined') {
          Swal.fire({ icon: 'warning', title: 'Nama Konten Belum Diisi', text: msg, confirmButtonColor: '#b91c1c' });
        }
        return;
      }
    }

    const kontenList = medRows.map(tr => {
      const platform = tr.querySelector(".med-platform")?.value || "Instagram";
      let tipe = tr.querySelector(".med-tipe")?.value || "Postingan";
      if (platform === "WhatsApp") tipe = "Chat";
      const isChat = (tipe === "Chat" || platform === "WhatsApp");
      const isTikTok = (platform === "TikTok" && !isChat);

      return {
        waktu: tr.querySelector(".med-waktu")?.value || dateInfo.tanggalIndo,
        platform: platform,
        tipe: tipe,
        nama: tr.querySelector(".med-nama")?.value.trim() || "-",
        jangkau: (isChat || isTikTok) ? 0 : Number(tr.querySelector(".med-jangkau")?.value || 0),
        like: isChat ? 0 : Number(tr.querySelector(".med-like")?.value || 0),
        komen: isChat ? 0 : Number(tr.querySelector(".med-komen")?.value || 0),
        share: isChat ? 0 : Number(tr.querySelector(".med-share")?.value || 0),
        repost: isChat ? 0 : Number(tr.querySelector(".med-repost")?.value || 0),
        save: isChat ? 0 : Number(tr.querySelector(".med-save")?.value || 0),
        kunjungan: isChat ? 0 : Number(tr.querySelector(".med-kunjungan")?.value || 0),
        followers: isChat ? 0 : Number(tr.querySelector(".med-followers")?.value || 0),
        profilPct: (isChat || isTikTok) ? 0 : Number(tr.querySelector(".med-profil")?.value || 0),
        kabarPct: (isChat || isTikTok) ? 0 : Number(tr.querySelector(".med-kabar")?.value || 0),
        jelajahPct: (isChat || isTikTok) ? 0 : Number(tr.querySelector(".med-jelajah")?.value || 0)
      };
    });

    detail = {
      ...detail,
      kontenList,
      judulKonten: kontenList.map(k => k.nama).join(", ") || "-",
      linkDriveMateri: linkDriveUmum
    };
    executeSave();
  }
}


/* ==========================================================================
   9. ARSIP LAPORAN & CRUD LAPORAN
   ========================================================================== */
let activeFilterBulanLaporan = "";
let activeFilterDivisiLaporan = "";
let tempFilterBulanLaporan = "";
let tempFilterDivisiLaporan = "";

function renderFilterBulanLaporanPills() {
  const grid = document.getElementById("gridFilterBulanLaporan");
  if (!grid) return;

  let html = `
    <button type="button" class="filter-pill-btn ${!tempFilterBulanLaporan ? 'active' : ''}" onclick="pilihFilterBulanLaporanBtn('')">Semua Bulan</button>
  `;

  (state.kategoriBulan || []).forEach(kb => {
    const val = kb.folder || kb.label;
    const label = kb.label || kb.folder;
    const isAct = tempFilterBulanLaporan === val;
    html += `
      <button type="button" class="filter-pill-btn ${isAct ? 'active' : ''}" onclick="pilihFilterBulanLaporanBtn('${escapeHTML(val)}')">${escapeHTML(label)}</button>
    `;
  });

  grid.innerHTML = html;
}

function pilihFilterBulanLaporanBtn(val) {
  tempFilterBulanLaporan = val;
  const grid = document.getElementById("gridFilterBulanLaporan");
  if (grid) {
    grid.querySelectorAll(".filter-pill-btn").forEach(btn => {
      const isMatch = (!val && btn.textContent.trim() === "Semua Bulan") || (val && btn.getAttribute("onclick")?.includes(`'${val}'`));
      btn.classList.toggle("active", Boolean(isMatch));
    });
  }
}

function pilihFilterDivisiLaporanBtn(val) {
  tempFilterDivisiLaporan = val;
  const grid = document.getElementById("gridFilterDivisiLaporan");
  if (grid) {
    grid.querySelectorAll(".filter-pill-btn").forEach(btn => {
      const isMatch = (!val && btn.textContent.trim() === "Semua Divisi") || (val && btn.getAttribute("onclick")?.includes(`'${val}'`));
      btn.classList.toggle("active", Boolean(isMatch));
    });
  }
}

function bukaModalFilterLaporan() {
  const isPimpinan = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : false;

  tempFilterBulanLaporan = activeFilterBulanLaporan;
  tempFilterDivisiLaporan = activeFilterDivisiLaporan;

  renderFilterBulanLaporanPills();
  pilihFilterDivisiLaporanBtn(tempFilterDivisiLaporan);

  const groupDivisi = document.getElementById("groupPopupFilterDivisiLaporan");
  if (!isPimpinan) {
    if (groupDivisi) groupDivisi.style.display = "none";
  } else {
    if (groupDivisi) groupDivisi.style.display = "block";
  }

  if (typeof openModal === 'function') openModal("modalFilterLaporan");
}

function batalFilterLaporan() {
  if (typeof closeModal === 'function') closeModal("modalFilterLaporan");
}

function terapkanFilterLaporan() {
  activeFilterBulanLaporan = tempFilterBulanLaporan;
  const isPimpinan = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : false;
  if (isPimpinan) {
    activeFilterDivisiLaporan = tempFilterDivisiLaporan;
  }

  updateBadgeFilterActiveLaporan();
  if (typeof closeModal === 'function') closeModal("modalFilterLaporan");
  renderTabelLaporan();
}

function resetFilterLaporan() {
  const searchInput = document.getElementById("searchLaporan");
  const clearBtn = document.getElementById("btnClearSearchLaporan");
  if (searchInput) searchInput.value = "";
  if (clearBtn) {
    clearBtn.classList.remove("visible");
    clearBtn.style.setProperty("display", "none", "important");
  }

  activeFilterBulanLaporan = "";
  activeFilterDivisiLaporan = "";
  tempFilterBulanLaporan = "";
  tempFilterDivisiLaporan = "";

  updateBadgeFilterActiveLaporan();

  const btnReset = document.getElementById("btnResetFilterLaporan");
  const icon = btnReset ? btnReset.querySelector("i") : null;
  if (icon) {
    icon.classList.add("fa-spin");
    setTimeout(() => icon.classList.remove("fa-spin"), 400);
  }

  renderTabelLaporan();

  if (typeof showSmallToast === "function") {
    showSmallToast({
      icon: 'success',
      title: 'Filter & Data Direset',
      text: 'Menampilkan seluruh laporan.'
    });
  }
}

function updateBadgeFilterActiveLaporan() {
  const badge = document.getElementById("badgeFilterActiveLaporan");
  const btn = document.getElementById("btnBukaModalFilterLaporan");
  const isFiltered = Boolean(activeFilterBulanLaporan || activeFilterDivisiLaporan);
  if (badge) badge.style.display = isFiltered ? "block" : "none";
  if (btn) btn.classList.toggle("is-active", isFiltered);
}

function clearSearchLaporan() {
  const searchInput = document.getElementById("searchLaporan");
  const clearBtn = document.getElementById("btnClearSearchLaporan");
  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
  }
  if (clearBtn) {
    clearBtn.classList.remove("visible");
    clearBtn.style.setProperty("display", "none", "important");
  }
  renderTabelLaporan();
}

function renderTabelLaporan() {
  const tbody = document.getElementById("tabelLaporanBody");
  if (!tbody) return;

  const rawKeyword = document.getElementById("searchLaporan")?.value || "";
  const keyword = rawKeyword.toLowerCase().trim();

  // Kontrol tampilan tombol 'X' merah pembersih live search laporan
  const clearBtn = document.getElementById("btnClearSearchLaporan");
  if (clearBtn) {
    const hasText = rawKeyword.trim().length > 0;
    clearBtn.classList.toggle("visible", hasText);
    clearBtn.style.setProperty("display", hasText ? "inline-flex" : "none", "important");
  }

  const isPimpinan = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : false;
  const userDivId = (!isPimpinan && typeof normalizeUserDivisionId === 'function') 
    ? normalizeUserDivisionId(state.currentUser) 
    : "";
  const filterDivisi = userDivId || activeFilterDivisiLaporan || "";
  const filterBulan = activeFilterBulanLaporan || "";

  // 1. Satukan seluruh laporan: Dari formulir sistem (state.laporan) dan Google Drive (state.driveFiles)
  const combinedReports = [];
  const registeredDriveIds = new Set();
  const registeredTitles = new Set();

  (state.laporan || []).forEach(lap => {
    combinedReports.push({ ...lap, isDriveOnly: false });
    const url = String(lap.driveFileUrl || lap.driveUrl || lap.detail?.driveUrl || lap.detail?.driveFileUrl || "");
    if (lap.id) registeredDriveIds.add(lap.id);
    if (url) {
      const match = url.match(/[-\w]{25,}/);
      if (match) registeredDriveIds.add(match[0]);
    }
    if (lap.judul) {
      registeredTitles.add(lap.judul.trim().toLowerCase());
    }
  });

  (state.driveFiles || []).forEach(f => {
    const fnameClean = (f.name || "").replace(/\.[^/.]+$/, "").trim();
    const fnameLower = fnameClean.toLowerCase();
    
    // Cek apakah berkas Drive ini sudah terwakili dalam laporan sistem
    const isMatched = registeredDriveIds.has(f.id) || 
      registeredTitles.has(fnameLower) ||
      [...registeredTitles].some(t => fnameLower.includes(t) || t.includes(fnameLower));

    if (!isMatched) {
      // Parsing nama divisi dari nama file
      let divNama = "Divisi Terkait";
      let divId = "umum";
      if (fnameLower.includes("sekretar")) {
        divNama = "Divisi Sekretaris";
        divId = "sekretaris";
      } else if (fnameLower.includes("bendahar")) {
        divNama = "Divisi Bendahara";
        divId = "bendahara";
      } else if (fnameLower.includes("korlap") || fnameLower.includes("lapangan")) {
        divNama = "Divisi Lapangan (Korlap)";
        divId = "korlap";
      } else if (fnameLower.includes("sarpras") || fnameLower.includes("sarana")) {
        divNama = "Divisi Sarana Prasarana";
        divId = "sarpras";
      } else if (fnameLower.includes("media") || fnameLower.includes("kreatif") || fnameLower.includes("komunikasi")) {
        divNama = "Divisi Media & Komunikasi Kreatif";
        divId = "media";
      } else if (fnameLower.includes("pelatih")) {
        divNama = "Pelatih";
        divId = "pelatih";
      } else if (fnameLower.includes("ketua") || fnameLower.includes("wakil")) {
        divNama = "Ketua / Wakil Ketua";
        divId = "pimpinan";
      }

      // Parsing angkatan jika tertera pada nama berkas
      let angkatan = "";
      if (/\bg10\b/i.test(fnameLower)) angkatan = "G10";
      else if (/\bg11\b/i.test(fnameLower)) angkatan = "G11";
      else if (/\bg12\b/i.test(fnameLower)) angkatan = "G12";

      const tgl = f.updated ? f.updated.split("T")[0] : (f.created ? f.created.split("T")[0] : "");

      combinedReports.push({
        id: f.id,
        isDriveOnly: true,
        judul: fnameClean || "Berkas Laporan Google Drive",
        pelapor: "Google Drive (Berkas)",
        divisiNama: divNama,
        divisiId: divId,
        tanggal: tgl,
        kategoriBulan: f.folderName || "",
        statusReview: "Tersinkron Drive",
        driveFileUrl: f.url,
        downloadUrl: f.downloadUrl || f.url,
        fileSize: f.size || "",
        mimeType: f.mimeType || "application/pdf",
        angkatan: angkatan
      });
    } else {
      // Hubungkan URL Drive asli ke data laporan sistem jika belum terpasang
      const targetLap = combinedReports.find(l => {
        const url = String(l.driveFileUrl || l.driveUrl || l.detail?.driveUrl || l.detail?.driveFileUrl || "");
        return l.id === f.id || url.includes(f.id) || (l.judul && l.judul.trim().toLowerCase() === fnameLower);
      });
      if (targetLap) {
        if (!targetLap.driveFileUrl) targetLap.driveFileUrl = f.url;
        if (!targetLap.kategoriBulan && f.folderName) targetLap.kategoriBulan = f.folderName;
        if (!targetLap.fileSize && f.size) targetLap.fileSize = f.size;
      }
    }
  });

  // Urutkan laporan dari tanggal paling baru
  combinedReports.sort((a, b) => new Date(b.tanggal || 0) - new Date(a.tanggal || 0));

  // 2. Filter data laporan
  let filtered = combinedReports.filter(lap => {
    const matchKeyword = !keyword || 
      (lap.judul || "").toLowerCase().includes(keyword) || 
      (lap.pelapor || "").toLowerCase().includes(keyword) ||
      (lap.divisiNama || "").toLowerCase().includes(keyword) ||
      (lap.tanggal || "").toLowerCase().includes(keyword) ||
      (lap.kategoriBulan || "").toLowerCase().includes(keyword);

    let matchDivisi = true;
    if (filterDivisi) {
      const cleanF = filterDivisi.toLowerCase();
      const lapDivId = (lap.divisiId || "").toLowerCase();
      const lapDivNama = (lap.divisiNama || "").toLowerCase();
      matchDivisi = (lapDivId === cleanF) || 
                    (cleanF.includes("sekretar") && (lapDivId.includes("sekretar") || lapDivNama.includes("sekretar"))) ||
                    (cleanF.includes("bendahar") && (lapDivId.includes("bendahar") || lapDivNama.includes("bendahar"))) ||
                    (cleanF.includes("korlap") && (lapDivId.includes("korlap") || lapDivNama.includes("lapangan") || lapDivNama.includes("korlap"))) ||
                    (cleanF.includes("sarpras") && (lapDivId.includes("sarpras") || lapDivNama.includes("sarana") || lapDivNama.includes("sarpras"))) ||
                    (cleanF.includes("media") && (lapDivId.includes("media") || lapDivNama.includes("media") || lapDivNama.includes("kreatif")));
    }

    const matchBulan = !filterBulan || (
      (lap.kategoriBulan || "").toLowerCase() === filterBulan.toLowerCase() || 
      (lap.detail?.kategoriBulan || "").toLowerCase() === filterBulan.toLowerCase()
    );

    return matchKeyword && matchDivisi && matchBulan;
  });

  // Update badge total
  if (typeof updateArsipBadges === 'function') {
    updateArsipBadges();
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="cell-empty-state" style="text-align: center; padding: 26px 20px; color: var(--text-muted);"><i class="fa-regular fa-folder-open" style="font-size: 1.8rem; display: block; margin-bottom: 8px; color: #94a3b8;"></i>Laporan tidak ditemukan dengan kriteria filter yang dipilih.</td></tr>`;
    return;
  }

  const isReadOnly = (typeof isWakilAtauPelatih === 'function' && isWakilAtauPelatih(state.currentUser));

  tbody.innerHTML = filtered.map(lap => {
    const katBln = lap.kategoriBulan || lap.detail?.kategoriBulan || "";
    const angk = lap.angkatan || lap.detail?.angkatan || "";
    const isDriveOnly = Boolean(lap.isDriveOnly);

    return `
    <tr>
      <td class="cell-date">
        <span class="text-date-full"><strong><i class="fa-regular fa-calendar-days mobile-only-icon"></i> ${(lap.divisiId === 'sarpras' || lap.divisiId === 'media_kreatif' || (lap.divisiNama && (lap.divisiNama.toLowerCase().includes('sarpras') || lap.divisiNama.toLowerCase().includes('sarana') || lap.divisiNama.toLowerCase().includes('media') || lap.divisiNama.toLowerCase().includes('kreatif')))) ? (katBln || (typeof formatHariTanggalIndo === 'function' ? formatHariTanggalIndo(lap.tanggal) : lap.tanggal)) : (typeof formatHariTanggalIndo === 'function' ? formatHariTanggalIndo(lap.tanggal || lap.detail?.tanggalIndo) : (lap.tanggal ? formatTanggalLengkap(lap.tanggal) : '-'))}</strong></span>
      </td>
      <td class="cell-title" style="min-width: 0; word-break: break-word; overflow-wrap: anywhere;">
        <strong class="report-title-text" style="word-break: break-word; overflow-wrap: anywhere;">${escapeHTML(lap.judul)}</strong>
        <div style="display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap;">
          ${katBln ? `<span style="background: #e2e8f0; color: #334155; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 600; white-space: nowrap; display: inline-flex; align-items: center; gap: 5px;"><i class="fa-regular fa-folder" style="font-size: 0.72rem; color: var(--accent-red); flex-shrink: 0;"></i> <span style="white-space: nowrap;">${escapeHTML(katBln)}</span></span>` : ''}
          ${lap.fileSize ? `<span style="background: #f1f5f9; color: #64748b; padding: 2px 7px; border-radius: 4px; font-size: 0.72rem; font-weight: 600; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-file-pdf" style="color: #dc2626;"></i> ${escapeHTML(lap.fileSize)}</span>` : ''}
        </div>
      </td>
      <td class="cell-reporter">
        <span class="mobile-cell-label"><i class="fa-solid fa-user"></i> Pelapor:</span>
        <span class="cell-value-text">${escapeHTML(lap.pelapor || 'Pengurus')}</span>
      </td>
      <td class="cell-division">
        <span class="badge-divisi">${escapeHTML(lap.divisiNama)}</span>
        ${angk ? `
        <div style="margin-top: 4px;">
          <span class="badge" style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 4px;">
            <i class="fa-solid fa-users" style="color: var(--accent-red); margin-right: 3px;"></i>${escapeHTML(angk)}
          </span>
        </div>` : ''}
      </td>
      <td class="cell-status">
        ${isDriveOnly ? `
          <span class="badge" style="background: #eff6ff; color: #1d4ed8; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 4px;">
            <i class="fa-brands fa-google-drive"></i> Di Drive
          </span>
        ` : (lap.driveFileUrl ? `
          <span class="badge" style="background: #dcfce7; color: #15803d; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 4px;">
            <i class="fa-brands fa-google-drive"></i> Tersinkron
          </span>
        ` : `
          <span class="badge" style="background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 4px;">
            <i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Terkirim
          </span>
        `)}
      </td>
      <td class="cell-actions" style="text-align: center;">
        <div class="action-btns" style="justify-content: center; gap: 6px;">
          ${isDriveOnly ? `
            <a href="${escapeHTML(lap.driveFileUrl)}" target="_blank" class="btn-action-icon btn-view" title="Buka Berkas di Google Drive">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <a href="${escapeHTML(lap.downloadUrl || lap.driveFileUrl)}" target="_blank" class="btn-action-icon btn-drive" title="Unduh Berkas dari Google Drive">
              <i class="fa-solid fa-download"></i>
            </a>
            ${!isReadOnly ? `
            <button type="button" class="btn-action-icon btn-delete" onclick="hapusBerkasDrive('${escapeHTML(lap.id)}', '${escapeHTML(lap.judul).replace(/'/g, "\\'")}')" title="Hapus Berkas dari Google Drive">
              <i class="fa-solid fa-trash-can"></i>
            </button>
            ` : ''}
          ` : `
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
          `}
        </div>
      </td>
    </tr>
    `;
  }).join("");
}

function bukaDetailLaporan(id) {
  const lap = state.laporan.find(l => l.id === id);
  if (!lap) return;

  const isReadOnly = (typeof isWakilAtauPelatih === 'function' && isWakilAtauPelatih(state.currentUser));
  const detail = lap.detail || {};
  const angk = (detail.angkatan || "").toUpperCase();
  const absList = Array.isArray(detail.absensi) ? detail.absensi : [];
  let absG10 = (detail.absensiG10 && detail.absensiG10.length > 0) ? detail.absensiG10 : [];
  let absG11 = (detail.absensiG11 && detail.absensiG11.length > 0) ? detail.absensiG11 : [];
  if (absG10.length === 0 && absG11.length === 0 && absList.length > 0) {
    if (angk === "G11" || absList.some(a => (a.kelas || '').includes('X') && !(a.kelas || '').includes('XI'))) {
      absG11 = absList;
    } else {
      absG10 = absList;
    }
  }
  let displayAbs = (absG10.length > 0 ? absG10 : (absG11.length > 0 ? absG11 : absList));

  // SMART FALLBACK: Jika displayAbs kosong (misal karena update parsial), isi otomatis dari state.anggota sesuai angkatan
  if (displayAbs.length === 0 && (lap.divisiId === "sekretaris" || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("sekretar")))) {
    const targetAngk = (angk || "G10").toUpperCase();
    if (Array.isArray(state.anggota) && state.anggota.length > 0) {
      const matched = state.anggota.filter(a => {
        const agk = (a.angkatan || a.kategori || "").toUpperCase();
        const kls = (a.kelas || "").toUpperCase();
        if (targetAngk === "G10") return agk === "G10" || kls.includes("XI");
        if (targetAngk === "G11") return agk === "G11" || (kls.includes("X") && !kls.includes("XI"));
        return true;
      });
      if (matched.length > 0) {
        displayAbs = matched.map(m => ({
          nama: m.nama,
          kelas: m.kelas || "-",
          status: "Hadir",
          keterangan: ""
        }));
        detail.absensi = displayAbs;
        if (targetAngk === "G10") detail.absensiG10 = displayAbs;
        else detail.absensiG11 = displayAbs;
        saveState();
      }
    }
  }

  const totalHadir = detail.totalHadir !== undefined ? detail.totalHadir : displayAbs.filter(a => a.status === 'Hadir').length;
  const totalIzin = detail.totalIzin !== undefined ? detail.totalIzin : displayAbs.filter(a => a.status === 'Izin').length;
  const totalAlfa = detail.totalAlfa !== undefined ? detail.totalAlfa : (detail.totalAlpa !== undefined ? detail.totalAlpa : displayAbs.filter(a => a.status === 'Alfa' || a.status === 'Alpa').length);
  const totalAnak = displayAbs.length || (totalHadir + totalIzin + totalAlfa);
  const persenHadir = totalAnak > 0 ? Math.round((totalHadir / totalAnak) * 100) : 0;

  const tglIndo = (typeof formatHariTanggalIndo === 'function')
    ? formatHariTanggalIndo(lap.tanggal || detail.tanggalIndo || detail.tanggal)
    : (detail.tanggalIndo || (typeof formatTanggalLengkap === 'function' ? formatTanggalLengkap(lap.tanggal) : lap.tanggal));
  const rawMinggu = detail.mingguKe;
  let mingguKe = "2";
  if (rawMinggu && rawMinggu !== "-" && rawMinggu !== "--") {
    mingguKe = String(rawMinggu).replace(/[^0-9]/g, "") || String(rawMinggu);
  }
  const katBulan = lap.kategoriBulan || detail.kategoriBulan || "Oktober 2026";

  let html = "";
  if (lap.divisiId === "bendahara" || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("bendahara"))) {
    const kasG10 = Array.isArray(detail.kasG10) ? detail.kasG10 : [];
    const kasG11 = Array.isArray(detail.kasG11) ? detail.kasG11 : [];
    const pemasukanTambahan = (Array.isArray(detail.pemasukanTambahan) ? detail.pemasukanTambahan : [])
      .filter(p => (p.sumber || "").trim() && p.sumber !== "-" && Number(p.nominal) > 0);
    const pengeluaran = (Array.isArray(detail.pengeluaran) ? detail.pengeluaran : [])
      .filter(p => (p.rincian || "").trim() && p.rincian !== "-" && Number(p.nominal) > 0);

    const totalCash = detail.totalCash || 0;
    const totalQris = detail.totalQris || 0;
    const totalPemasukan = detail.totalPemasukan || 0;
    const totalPengeluaran = detail.totalPengeluaran || 0;
    const saldoAkhir = detail.saldoAkhir !== undefined ? detail.saldoAkhir : (totalPemasukan - totalPengeluaran);

    html = `
      <div style="text-align: left; font-size: 0.875rem; color: #1e293b;">
        ${!isReadOnly ? `
        <!-- Action Bar Modal (Tombol Edit Laporan) -->
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 12px;">
          <button type="button" class="btn btn-warning btn-sm" onclick="editLaporan('${lap.id}')" style="background-color: #d97706; border-color: #d97706; color: #ffffff; font-weight: 700; padding: 6px 14px; border-radius: 6px; box-shadow: 0 1px 3px rgba(217, 119, 6, 0.25); cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-pen-to-square"></i> Edit Laporan Ini
          </button>
        </div>
        ` : ''}

        <!-- Metadata -->
        <div class="report-meta-card">
          <div class="report-meta-grid">
            <div class="report-meta-item">
              <div class="report-meta-icon" style="background: #e0f2fe; color: #0284c7;">
                <i class="fa-solid fa-user"></i>
              </div>
              <div class="report-meta-text">
                <span class="report-meta-label">Nama Pelapor</span>
                <span class="report-meta-val">${escapeHTML(lap.pelapor)}</span>
              </div>
            </div>
            <div class="report-meta-item">
              <div class="report-meta-icon" style="background: #fef3c7; color: #d97706;">
                <i class="fa-solid fa-calendar-day"></i>
              </div>
              <div class="report-meta-text">
                <span class="report-meta-label">Hari / Tanggal</span>
                <span class="report-meta-val">${escapeHTML(tglIndo)}</span>
              </div>
            </div>
            <div class="report-meta-item">
              <div class="report-meta-icon" style="background: #f1f5f9; color: #475569;">
                <i class="fa-regular fa-folder-open"></i>
              </div>
              <div class="report-meta-text">
                <span class="report-meta-label">Folder di Drive</span>
                <span class="report-meta-val">${escapeHTML(katBulan)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 6 Metric Cards Ringkasan Keuangan (Termasuk Saldo Awal) -->
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-bottom: 24px; text-align: center;">
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 10px 4px;">
            <div style="font-size: 0.68rem; color: #64748b; font-weight: 700;">SALDO AWAL</div>
            <div style="font-size: 0.88rem; font-weight: 800; color: #475569; margin-top: 4px;">${formatRupiah(detail.saldoAwal || 0)}</div>
          </div>
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 10px 4px;">
            <div style="font-size: 0.68rem; color: #64748b; font-weight: 700;">TOTAL CASH</div>
            <div style="font-size: 0.88rem; font-weight: 800; color: #0f172a; margin-top: 4px;">${formatRupiah(totalCash)}</div>
          </div>
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 10px 4px;">
            <div style="font-size: 0.68rem; color: #64748b; font-weight: 700;">TOTAL QRIS</div>
            <div style="font-size: 0.88rem; font-weight: 800; color: #0f172a; margin-top: 4px;">${formatRupiah(totalQris)}</div>
          </div>
          <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 10px 4px;">
            <div style="font-size: 0.68rem; color: #166534; font-weight: 700;">PEMASUKAN</div>
            <div style="font-size: 0.88rem; font-weight: 800; color: #15803d; margin-top: 4px;">${formatRupiah(totalPemasukan)}</div>
          </div>
          <div style="background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 10px; padding: 10px 4px;">
            <div style="font-size: 0.68rem; color: #991b1b; font-weight: 700;">PENGELUARAN</div>
            <div style="font-size: 0.88rem; font-weight: 800; color: #dc2626; margin-top: 4px;">${formatRupiah(totalPengeluaran)}</div>
          </div>
          <div style="background: ${saldoAkhir >= 0 ? '#f0fdf4' : '#fef2f2'}; border: 1.5px solid ${saldoAkhir >= 0 ? '#86efac' : '#fca5a5'}; border-radius: 10px; padding: 10px 4px;">
            <div style="font-size: 0.68rem; color: ${saldoAkhir >= 0 ? '#166534' : '#991b1b'}; font-weight: 700;">SALDO AKHIR</div>
            <div style="font-size: 0.92rem; font-weight: 900; color: ${saldoAkhir >= 0 ? '#15803d' : '#dc2626'}; margin-top: 4px;">${formatRupiah(saldoAkhir)}</div>
          </div>
        </div>

        <!-- Tabel Kas G10 -->
        <div style="margin-bottom: 26px;">
          <div style="font-size: 0.9rem; font-weight: 700; color: #0f172a; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span><i class="fa-solid fa-coins" style="color: #eab308; margin-right: 6px;"></i> Pembayaran Kas G10 (Kelas XI)</span>
            <span style="font-size: 0.78rem; color: #64748b; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0; padding: 2px 8px; border-radius: 6px;">${kasG10.filter(k => k.bayar === 'Bayar').length} / ${kasG10.length} Bayar</span>
          </div>

          <!-- TAMPILAN DESKTOP: Tabel Kas G10 -->
          <div class="desktop-kas-table" style="max-height: 240px; overflow-y: auto; overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; min-width: 520px;">
              <thead style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 2;">
                <tr>
                  <th style="padding: 6px 8px; text-align: center; width: 40px; white-space: nowrap;">No</th>
                  <th style="padding: 6px 12px; text-align: left; white-space: nowrap;">Nama Anggota</th>
                  <th style="padding: 6px 8px; text-align: center; width: 85px; white-space: nowrap;">Kelas</th>
                  <th style="padding: 6px 10px; text-align: center; width: 120px; white-space: nowrap;">Pembayaran</th>
                  <th style="padding: 6px 10px; text-align: center; width: 100px; white-space: nowrap;">Metode</th>
                </tr>
              </thead>
              <tbody>
                ${kasG10.length > 0 ? kasG10.map((k, idx) => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 6px 8px; text-align: center; color: #64748b;">${idx + 1}</td>
                    <td style="padding: 6px 12px; font-weight: 600; white-space: nowrap;">${escapeHTML(k.nama || '-')}</td>
                    <td style="padding: 6px 8px; text-align: center; white-space: nowrap;">${k.kelas ? `<span style="background:#f1f5f9; color:#475569; font-weight:600; padding:2px 6px; border-radius:4px; font-size:0.72rem; border:1px solid #cbd5e1;">${escapeHTML(k.kelas)}</span>` : '<span style="color:#94a3b8; font-size:0.75rem;">-</span>'}</td>
                    <td style="padding: 6px 10px; text-align: center; white-space: nowrap;">
                      <span style="background: ${k.bayar === 'Bayar' ? '#dcfce7' : '#f1f5f9'}; color: ${k.bayar === 'Bayar' ? '#15803d' : '#64748b'}; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 0.74rem;">${escapeHTML(k.bayar || 'Tidak Bayar')}</span>
                    </td>
                    <td style="padding: 6px 10px; text-align: center; color: #475569; font-weight: 600; white-space: nowrap;">${k.bayar === 'Bayar' ? escapeHTML(k.metode || 'Cash') : '-'}</td>
                  </tr>
                `).join('') : '<tr><td colspan="5" style="padding: 14px; text-align: center; color: #94a3b8;">Tidak ada data kas G10.</td></tr>'}
              </tbody>
            </table>
          </div>

          <!-- TAMPILAN KHUSUS LAYAR KECIL / HP / MOBILE: Container per Container -->
          <div class="mobile-kas-cards">
            ${kasG10.length > 0 ? kasG10.map((k, idx) => {
              const isBayar = k.bayar === 'Bayar';
              return `
                <div class="kas-student-card ${isBayar ? 'is-bayar' : ''}">
                  <div class="kas-student-main">
                    <div class="kas-student-info">
                      <span class="kas-student-num">${idx + 1}</span>
                      <div class="kas-student-name-box">
                        <strong class="kas-student-name">${escapeHTML(k.nama || '-')}</strong>
                        ${k.kelas ? `<span class="kas-student-class">${escapeHTML(k.kelas)}</span>` : ''}
                      </div>
                    </div>
                    <div class="kas-student-badges">
                      <span class="badge ${isBayar ? 'badge-kas-bayar' : 'badge-kas-tidak'}">
                        <i class="fa-solid ${isBayar ? 'fa-check' : 'fa-xmark'}"></i> ${escapeHTML(k.bayar || 'Tidak Bayar')}
                      </span>
                      ${isBayar ? `
                        <span class="badge ${k.metode === 'QRIS' ? 'badge-kas-qris' : 'badge-kas-cash'}">
                          <i class="fa-solid ${k.metode === 'QRIS' ? 'fa-qrcode' : 'fa-money-bill-wave'}"></i> ${escapeHTML(k.metode || 'Cash')}
                        </span>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `;
            }).join('') : '<div style="padding: 16px; text-align: center; color: #94a3b8; font-size: 0.8rem; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 8px;">Tidak ada data kas G10.</div>'}
          </div>
        </div>

        <!-- Tabel Kas G11 -->
        <div style="margin-bottom: 26px;">
          <div style="font-size: 0.9rem; font-weight: 700; color: #0f172a; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span><i class="fa-solid fa-coins" style="color: #eab308; margin-right: 6px;"></i> Pembayaran Kas G11 (Kelas X)</span>
            <span style="font-size: 0.78rem; color: #64748b; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0; padding: 2px 8px; border-radius: 6px;">${kasG11.filter(k => k.bayar === 'Bayar').length} / ${kasG11.length} Bayar</span>
          </div>

          <!-- TAMPILAN DESKTOP: Tabel Kas G11 -->
          <div class="desktop-kas-table" style="max-height: 240px; overflow-y: auto; overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; min-width: 520px;">
              <thead style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 2;">
                <tr>
                  <th style="padding: 6px 8px; text-align: center; width: 40px; white-space: nowrap;">No</th>
                  <th style="padding: 6px 12px; text-align: left; white-space: nowrap;">Nama Anggota</th>
                  <th style="padding: 6px 8px; text-align: center; width: 85px; white-space: nowrap;">Kelas</th>
                  <th style="padding: 6px 10px; text-align: center; width: 120px; white-space: nowrap;">Pembayaran</th>
                  <th style="padding: 6px 10px; text-align: center; width: 100px; white-space: nowrap;">Metode</th>
                </tr>
              </thead>
              <tbody>
                ${kasG11.length > 0 ? kasG11.map((k, idx) => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 6px 8px; text-align: center; color: #64748b;">${idx + 1}</td>
                    <td style="padding: 6px 12px; font-weight: 600; white-space: nowrap;">${escapeHTML(k.nama || '-')}</td>
                    <td style="padding: 6px 8px; text-align: center; white-space: nowrap;">${k.kelas ? `<span style="background:#f1f5f9; color:#475569; font-weight:600; padding:2px 6px; border-radius:4px; font-size:0.72rem; border:1px solid #cbd5e1;">${escapeHTML(k.kelas)}</span>` : '<span style="color:#94a3b8; font-size:0.75rem;">-</span>'}</td>
                    <td style="padding: 6px 10px; text-align: center; white-space: nowrap;">
                      <span style="background: ${k.bayar === 'Bayar' ? '#dcfce7' : '#f1f5f9'}; color: ${k.bayar === 'Bayar' ? '#15803d' : '#64748b'}; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 0.74rem;">${escapeHTML(k.bayar || 'Tidak Bayar')}</span>
                    </td>
                    <td style="padding: 6px 10px; text-align: center; color: #475569; font-weight: 600; white-space: nowrap;">${k.bayar === 'Bayar' ? escapeHTML(k.metode || 'Cash') : '-'}</td>
                  </tr>
                `).join('') : '<tr><td colspan="5" style="padding: 14px; text-align: center; color: #94a3b8;">Tidak ada data kas G11.</td></tr>'}
              </tbody>
            </table>
          </div>

          <!-- TAMPILAN KHUSUS LAYAR KECIL / HP / MOBILE: Container per Container -->
          <div class="mobile-kas-cards">
            ${kasG11.length > 0 ? kasG11.map((k, idx) => {
              const isBayar = k.bayar === 'Bayar';
              return `
                <div class="kas-student-card ${isBayar ? 'is-bayar' : ''}">
                  <div class="kas-student-main">
                    <div class="kas-student-info">
                      <span class="kas-student-num">${idx + 1}</span>
                      <div class="kas-student-name-box">
                        <strong class="kas-student-name">${escapeHTML(k.nama || '-')}</strong>
                        ${k.kelas ? `<span class="kas-student-class">${escapeHTML(k.kelas)}</span>` : ''}
                      </div>
                    </div>
                    <div class="kas-student-badges">
                      <span class="badge ${isBayar ? 'badge-kas-bayar' : 'badge-kas-tidak'}">
                        <i class="fa-solid ${isBayar ? 'fa-check' : 'fa-xmark'}"></i> ${escapeHTML(k.bayar || 'Tidak Bayar')}
                      </span>
                      ${isBayar ? `
                        <span class="badge ${k.metode === 'QRIS' ? 'badge-kas-qris' : 'badge-kas-cash'}">
                          <i class="fa-solid ${k.metode === 'QRIS' ? 'fa-qrcode' : 'fa-money-bill-wave'}"></i> ${escapeHTML(k.metode || 'Cash')}
                        </span>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `;
            }).join('') : '<div style="padding: 16px; text-align: center; color: #94a3b8; font-size: 0.8rem; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 8px;">Tidak ada data kas G11.</div>'}
          </div>
        </div>

        ${pemasukanTambahan.length > 0 ? `
        <!-- Pemasukan Tambahan -->
        <div style="margin-bottom: 26px;">
          <div style="font-size: 0.9rem; font-weight: 700; color: #16a34a; margin-bottom: 10px;">
            <i class="fa-solid fa-arrow-down-long" style="margin-right: 6px;"></i> Pemasukan Tambahan
          </div>

          <!-- TAMPILAN DESKTOP: Tabel Pemasukan -->
          <div class="desktop-finance-table" style="overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 6px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; min-width: 380px;">
              <thead style="background: #f8fafc;">
                <tr>
                  <th style="padding: 6px 8px; width: 40px; text-align: center; white-space: nowrap;">No</th>
                  <th style="padding: 6px 10px; text-align: left; white-space: nowrap;">Sumber</th>
                  <th style="padding: 6px 10px; text-align: center; width: 90px; white-space: nowrap;">Metode</th>
                  <th style="padding: 6px 10px; text-align: right; width: 120px; white-space: nowrap;">Nominal</th>
                </tr>
              </thead>
              <tbody>
                ${pemasukanTambahan.map((p, idx) => `
                  <tr style="border-top: 1px solid #f1f5f9;">
                    <td style="padding: 6px 8px; text-align: center;">${idx + 1}</td>
                    <td style="padding: 6px 10px; white-space: nowrap;">${escapeHTML(p.sumber)}</td>
                    <td style="padding: 6px 10px; text-align: center; white-space: nowrap;">${p.metode}</td>
                    <td style="padding: 6px 10px; text-align: right; font-weight: 700; color: #16a34a; white-space: nowrap;">${formatRupiah(p.nominal)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- TAMPILAN KHUSUS LAYAR KECIL / HP / MOBILE: Container per Data -->
          <div class="mobile-finance-cards">
            ${pemasukanTambahan.map((p, idx) => `
              <div class="finance-item-card pemasukan-card">
                <div class="finance-item-header">
                  <span class="finance-item-num">${idx + 1}</span>
                  <strong class="finance-item-title">${escapeHTML(p.sumber)}</strong>
                </div>
                <div class="finance-item-body">
                  <span class="badge ${p.metode === 'QRIS' ? 'badge-kas-qris' : 'badge-kas-cash'}">
                    <i class="fa-solid ${p.metode === 'QRIS' ? 'fa-qrcode' : 'fa-money-bill-wave'}"></i> ${escapeHTML(p.metode || 'Cash')}
                  </span>
                  <span class="finance-item-nominal text-success">+ ${formatRupiah(p.nominal)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${pengeluaran.length > 0 ? `
        <!-- Pengeluaran Opsional -->
        <div style="margin-bottom: 26px;">
          <div style="font-size: 0.9rem; font-weight: 700; color: #dc2626; margin-bottom: 10px;">
            <i class="fa-solid fa-arrow-up-long" style="margin-right: 6px;"></i> Pengeluaran Opsional
          </div>

          <!-- TAMPILAN DESKTOP: Tabel Pengeluaran -->
          <div class="desktop-finance-table" style="overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 6px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; min-width: 380px;">
              <thead style="background: #f8fafc;">
                <tr>
                  <th style="padding: 6px 8px; width: 40px; text-align: center; white-space: nowrap;">No</th>
                  <th style="padding: 6px 10px; text-align: left; white-space: nowrap;">Rincian</th>
                  <th style="padding: 6px 10px; text-align: center; width: 110px; white-space: nowrap;">Metode</th>
                  <th style="padding: 6px 10px; text-align: right; width: 120px; white-space: nowrap;">Nominal</th>
                </tr>
              </thead>
              <tbody>
                ${pengeluaran.map((p, idx) => `
                  <tr style="border-top: 1px solid #f1f5f9;">
                    <td style="padding: 6px 8px; text-align: center;">${idx + 1}</td>
                    <td style="padding: 6px 10px; white-space: nowrap;">${escapeHTML(p.rincian)}</td>
                    <td style="padding: 6px 10px; text-align: center; color: #475569; font-weight: 600; white-space: nowrap;">${escapeHTML(p.metode || p.keterangan || 'Cash')}</td>
                    <td style="padding: 6px 10px; text-align: right; font-weight: 700; color: #dc2626; white-space: nowrap;">- ${formatRupiah(p.nominal)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- TAMPILAN KHUSUS LAYAR KECIL / HP / MOBILE: Container per Data -->
          <div class="mobile-finance-cards">
            ${pengeluaran.map((p, idx) => `
              <div class="finance-item-card pengeluaran-card">
                <div class="finance-item-header">
                  <span class="finance-item-num">${idx + 1}</span>
                  <strong class="finance-item-title">${escapeHTML(p.rincian)}</strong>
                </div>
                <div class="finance-item-body">
                  <span class="badge ${p.metode === 'QRIS' ? 'badge-kas-qris' : 'badge-kas-cash'}">
                    <i class="fa-solid ${p.metode === 'QRIS' ? 'fa-qrcode' : 'fa-money-bill-wave'}"></i> ${escapeHTML(p.metode || p.keterangan || 'Cash')}
                  </span>
                  <span class="finance-item-nominal text-danger">- ${formatRupiah(p.nominal)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${detail.linkNota ? `
        <div style="margin-top: 12px; text-align: right;">
          <a href="${escapeHTML(detail.linkNota)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-red btn-sm" style="display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-brands fa-google-drive"></i> Buka Folder Bukti Nota di Drive
          </a>
        </div>
        ` : ''}
      </div>
    `;
  } else if (lap.divisiId === "korlap" || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("korlap")) || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("lapangan"))) {
    const materiText = detail.materiLatihan || (Array.isArray(detail.rowsMateri) ? detail.rowsMateri.map((m, idx) => `${idx + 1}. ${m.materi || '-'}`).join("\n") : "-");
    const evaluasiText = detail.evaluasi || "-";

    html = `
      <div style="text-align: left; font-size: 0.875rem; color: #1e293b;">
        ${!isReadOnly ? `
        <!-- Action Bar Modal (Tombol Edit Laporan) -->
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 12px;">
          <button type="button" class="btn btn-warning btn-sm" onclick="editLaporan('${lap.id}')" style="background-color: #d97706; border-color: #d97706; color: #ffffff; font-weight: 700; padding: 6px 14px; border-radius: 6px; box-shadow: 0 1px 3px rgba(217, 119, 6, 0.25); cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-pen-to-square"></i> Edit Laporan Ini
          </button>
        </div>
        ` : ''}

        <!-- Kartu Informasi Metadata Laporan -->
        <div class="report-meta-card">
          <div class="report-meta-grid">
            <!-- Nama Pelapor -->
            <div class="report-meta-item">
              <div class="report-meta-icon" style="background: #e0f2fe; color: #0284c7;">
                <i class="fa-solid fa-user"></i>
              </div>
              <div class="report-meta-text">
                <span class="report-meta-label">Nama Pelapor</span>
                <span class="report-meta-val">${escapeHTML(lap.pelapor)}</span>
              </div>
            </div>

            <!-- Hari / Tanggal -->
            <div class="report-meta-item">
              <div class="report-meta-icon" style="background: #fef3c7; color: #d97706;">
                <i class="fa-solid fa-calendar-day"></i>
              </div>
              <div class="report-meta-text">
                <span class="report-meta-label">Hari / Tanggal</span>
                <span class="report-meta-val">${escapeHTML(tglIndo)}</span>
              </div>
            </div>

            <!-- Divisi -->
            <div class="report-meta-item">
              <div class="report-meta-icon" style="background: #fee2e2; color: #dc2626;">
                <i class="fa-solid fa-bullhorn"></i>
              </div>
              <div class="report-meta-text">
                <span class="report-meta-label">Divisi</span>
                <span class="report-meta-val">Koordinator Lapangan</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Box 1: Materi Latihan -->
        <div style="margin-bottom: 16px;">
          <div style="font-size: 0.875rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-book-bookmark" style="color: #2563eb;"></i> Materi Latihan (Apa saja yang dilakukan)
          </div>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 3px solid #2563eb; border-radius: 8px; padding: 12px 14px; font-size: 0.85rem; color: #334155; line-height: 1.6; white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box;">${escapeHTML(materiText)}</div>
        </div>

        <!-- Box 2: Evaluasi -->
        <div style="margin-bottom: 8px;">
          <div style="font-size: 0.875rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-clipboard-check" style="color: #16a34a;"></i> Evaluasi Latihan
          </div>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 3px solid #16a34a; border-radius: 8px; padding: 12px 14px; font-size: 0.85rem; color: #334155; line-height: 1.6; white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box;">${escapeHTML(evaluasiText)}</div>
        </div>
      </div>
    `;
  } else if (lap.divisiId === "sarpras" || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("sarana")) || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("sarpras"))) {
    const inventaris = Array.isArray(detail.inventaris) ? detail.inventaris : [];
    let totLayak = detail.totalLayak !== undefined ? detail.totalLayak : 0;
    let totTidak = detail.totalTidakLayak !== undefined ? detail.totalTidakLayak : 0;
    if (detail.totalLayak === undefined && inventaris.length > 0) {
      totLayak = inventaris.reduce((acc, it) => acc + Number(it.layak || 0), 0);
      totTidak = inventaris.reduce((acc, it) => acc + Number(it.tidakLayak || 0), 0);
    }
    const totSemua = totLayak + totTidak;

    html = `
      <div style="text-align: left; font-size: 0.875rem; color: #1e293b;">
        ${!isReadOnly ? `
        <!-- Action Bar Modal (Tombol Edit Laporan) -->
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 12px;">
          <button type="button" class="btn btn-warning btn-sm" onclick="editLaporan('${lap.id}')" style="background-color: #d97706; border-color: #d97706; color: #ffffff; font-weight: 700; padding: 6px 14px; border-radius: 6px; box-shadow: 0 1px 3px rgba(217, 119, 6, 0.25); cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-pen-to-square"></i> Edit Laporan Ini
          </button>
        </div>
        ` : ''}

        <!-- Kartu Informasi Metadata Laporan -->
        <div class="report-meta-card">
          <div class="report-meta-grid">
            <!-- Nama Pelapor -->
            <div class="report-meta-item">
              <div class="report-meta-icon" style="background: #e0f2fe; color: #0284c7;">
                <i class="fa-solid fa-user"></i>
              </div>
              <div class="report-meta-text">
                <span class="report-meta-label">Nama Pelapor</span>
                <span class="report-meta-val">${escapeHTML(lap.pelapor)}</span>
              </div>
            </div>

            <!-- Periode Bulan -->
            <div class="report-meta-item">
              <div class="report-meta-icon" style="background: #fef3c7; color: #d97706;">
                <i class="fa-solid fa-calendar-day"></i>
              </div>
              <div class="report-meta-text">
                <span class="report-meta-label">Periode Bulan</span>
                <span class="report-meta-val">${escapeHTML(katBulan)}</span>
              </div>
            </div>

            <!-- Divisi -->
            <div class="report-meta-item">
              <div class="report-meta-icon" style="background: #fee2e2; color: #dc2626;">
                <i class="fa-solid fa-boxes-stacked"></i>
              </div>
              <div class="report-meta-text">
                <span class="report-meta-label">Divisi</span>
                <span class="report-meta-val">Sarana & Prasarana</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3 Kartu Ringkasan Inventaris (Metrik) -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; text-align: center;">
          <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 10px 8px;">
            <div style="font-size: 0.72rem; color: #166534; font-weight: 700; text-transform: uppercase;">
              <i class="fa-solid fa-circle-check" style="margin-right: 4px;"></i> Total Layak Pakai
            </div>
            <div style="font-size: 1.35rem; font-weight: 800; color: #15803d; margin-top: 4px;">${totLayak.toLocaleString("id-ID")}</div>
          </div>
          <div style="background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 10px; padding: 10px 8px;">
            <div style="font-size: 0.72rem; color: #991b1b; font-weight: 700; text-transform: uppercase;">
              <i class="fa-solid fa-circle-xmark" style="margin-right: 4px;"></i> Total Tidak Layak
            </div>
            <div style="font-size: 1.35rem; font-weight: 800; color: #dc2626; margin-top: 4px;">${totTidak.toLocaleString("id-ID")}</div>
          </div>
          <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 10px 8px;">
            <div style="font-size: 0.72rem; color: #334155; font-weight: 700; text-transform: uppercase;">
              <i class="fa-solid fa-boxes-stacked" style="margin-right: 4px;"></i> Total Barang
            </div>
            <div style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-top: 4px;">${totSemua.toLocaleString("id-ID")}</div>
          </div>
        </div>

        <!-- Inventarisasi Perlengkapan Paskibra -->
        <div class="sarpras-detail-header-row" style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <span style="font-size: 0.9rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 6px; min-width: 0;">
            <i class="fa-solid fa-boxes-stacked" style="color: var(--accent-red); flex-shrink: 0;"></i>
            <span class="desktop-sarpras-label">Inventarisasi Perlengkapan Paskibra</span>
            <span class="mobile-sarpras-label">Perlengkapan Paskibra</span>
          </span>
          <span class="sarpras-detail-count-badge" style="background: #f1f5f9; color: #475569; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: nowrap; flex-shrink: 0;">
            ${inventaris.length} Barang
          </span>
        </div>

        <!-- Desktop Sarpras Table -->
        <div class="desktop-sarpras-table" style="max-height: 380px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 10px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.825rem;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; position: sticky; top: 0; z-index: 2;">
                <th style="width: 48px; padding: 10px 8px; text-align: center; color: #475569; font-weight: 700;">No</th>
                <th style="padding: 10px 14px; text-align: left; color: #475569; font-weight: 700;">Nama Barang / Perlengkapan</th>
                <th style="width: 110px; padding: 10px 12px; text-align: center; color: #166534; font-weight: 700;">Layak</th>
                <th style="width: 110px; padding: 10px 12px; text-align: center; color: #991b1b; font-weight: 700;">Tidak Layak</th>
                <th style="width: 100px; padding: 10px 12px; text-align: center; color: #0f172a; font-weight: 700; background: #f1f5f9;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${inventaris.length > 0 ? inventaris.map((item, idx) => `
                <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s ease;">
                  <td style="padding: 8px 6px; text-align: center; color: #64748b; font-weight: 600;">${idx + 1}</td>
                  <td style="padding: 8px 14px; font-weight: 600; color: #0f172a;">${escapeHTML(item.nama || item.barang || item.name || (window.SARPRAS_INVENTORY_ITEMS && window.SARPRAS_INVENTORY_ITEMS[idx]) || '-')}</td>
                  <td style="padding: 8px 12px; text-align: center;">
                    <span style="background: #dcfce7; color: #15803d; font-weight: 700; padding: 3px 10px; border-radius: 6px; font-size: 0.78rem;">${Number(item.layak || 0).toLocaleString("id-ID")}</span>
                  </td>
                  <td style="padding: 8px 12px; text-align: center;">
                    <span style="background: ${Number(item.tidakLayak || 0) > 0 ? '#fee2e2' : '#f8fafc'}; color: ${Number(item.tidakLayak || 0) > 0 ? '#dc2626' : '#94a3b8'}; font-weight: 700; padding: 3px 10px; border-radius: 6px; font-size: 0.78rem;">${Number(item.tidakLayak || 0).toLocaleString("id-ID")}</span>
                  </td>
                  <td style="padding: 8px 12px; text-align: center; font-weight: 800; color: #0f172a; background: #f8fafc;">
                    ${(Number(item.total !== undefined ? item.total : (Number(item.layak || 0) + Number(item.tidakLayak || 0)))).toLocaleString("id-ID")}
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="5" style="padding: 24px; text-align: center; color: #94a3b8;">Tidak ada data inventaris.</td></tr>`}
            </tbody>
          </table>
        </div>

        <!-- Mobile Sarpras Cards -->
        <div class="mobile-sarpras-cards">
          ${inventaris.length > 0 ? inventaris.map((item, idx) => {
            const namaBrg = item.nama || item.barang || item.name || (window.SARPRAS_INVENTORY_ITEMS && window.SARPRAS_INVENTORY_ITEMS[idx]) || '-';
            const layakVal = Number(item.layak || 0);
            const tidakVal = Number(item.tidakLayak || 0);
            const totalVal = Number(item.total !== undefined ? item.total : (layakVal + tidakVal));
            return `
              <div class="sarpras-detail-card">
                <div class="sarpras-detail-card-header">
                  <div class="sarpras-detail-card-name">${idx + 1}. ${escapeHTML(namaBrg)}</div>
                  <div class="sarpras-detail-card-total">Total: ${totalVal.toLocaleString("id-ID")}</div>
                </div>
                <div class="sarpras-detail-card-badges">
                  <div class="sarpras-detail-badge-box layak">
                    <span class="sarpras-detail-badge-label">Layak</span>
                    <span class="sarpras-detail-badge-value">${layakVal.toLocaleString("id-ID")}</span>
                  </div>
                  <div class="sarpras-detail-badge-box tidak-layak">
                    <span class="sarpras-detail-badge-label">Tidak Layak</span>
                    <span class="sarpras-detail-badge-value">${tidakVal.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('') : `<div style="padding: 24px; text-align: center; color: #94a3b8; font-size: 0.85rem;">Tidak ada data inventaris.</div>`}
        </div>
      </div>
    `;
  } else if (
    lap.divisiId === "media_kreatif" ||
    (lap.divisiNama && (
      lap.divisiNama.toLowerCase().includes("media") ||
      lap.divisiNama.toLowerCase().includes("kreatif") ||
      lap.divisiNama.toLowerCase().includes("pubdok")
    )) ||
    (detail && (
      (Array.isArray(detail.kontenList) && detail.kontenList.length > 0) ||
      detail.judulKonten
    ))
  ) {
    const kontenList = Array.isArray(detail.kontenList) ? detail.kontenList : [];

    const totalPost = kontenList.length;
    const totalJangkau = kontenList.reduce((acc, k) => acc + (Number(k.jangkau) || 0), 0);
    const totalLike = kontenList.reduce((acc, k) => acc + (Number(k.like) || 0), 0);
    const totalKomen = kontenList.reduce((acc, k) => acc + (Number(k.komen) || 0), 0);
    const totalShare = kontenList.reduce((acc, k) => acc + (Number(k.share) || 0), 0);
    const totalRepost = kontenList.reduce((acc, k) => acc + (Number(k.repost) || 0), 0);
    const totalSave = kontenList.reduce((acc, k) => acc + (Number(k.save) || 0), 0);
    const totalInteraksi = totalLike + totalKomen + totalShare + totalRepost + totalSave;
    const totalKunjungan = kontenList.reduce((acc, k) => acc + (Number(k.kunjungan) || 0), 0);
    const totalFollowers = kontenList.reduce((acc, k) => acc + (Number(k.followers) || 0), 0);

    html = `
      <div style="text-align: left; font-size: 0.875rem; color: #1e293b;">
        ${!isReadOnly ? `
        <!-- Action Bar Modal (Tombol Edit Laporan) -->
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 12px;">
          <button type="button" class="btn btn-warning btn-sm" onclick="editLaporan('${lap.id}')" style="background-color: #d97706; border-color: #d97706; color: #ffffff; font-weight: 700; padding: 6px 14px; border-radius: 6px; box-shadow: 0 1px 3px rgba(217, 119, 6, 0.25); cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-pen-to-square"></i> Edit Laporan Ini
          </button>
        </div>
        ` : ''}

        <!-- Kartu Informasi Metadata Laporan -->
        <div class="report-meta-card">
          <div class="report-meta-grid">
            <div class="report-meta-item">
              <div class="report-meta-icon" style="background: #e0f2fe; color: #0284c7;">
                <i class="fa-solid fa-user"></i>
              </div>
              <div class="report-meta-text">
                <span class="report-meta-label">Nama Pelapor</span>
                <span class="report-meta-val">${escapeHTML(lap.pelapor || 'Pengurus')}</span>
              </div>
            </div>
            <div class="report-meta-item">
              <div class="report-meta-icon" style="background: #eff6ff; color: #2563eb;">
                <i class="fa-solid fa-calendar-check"></i>
              </div>
              <div class="report-meta-text">
                <span class="report-meta-label">Bulan Periode</span>
                <span class="report-meta-val">${escapeHTML(katBulan || tglIndo)}</span>
              </div>
            </div>
            <div class="report-meta-item">
              <div class="report-meta-icon" style="background: #fdf2f8; color: #db2777;">
                <i class="fa-solid fa-photo-film"></i>
              </div>
              <div class="report-meta-text">
                <span class="report-meta-label">Divisi</span>
                <span class="report-meta-val" style="color: #be185d;">Media Kreatif</span>
              </div>
            </div>
            <div class="report-meta-item">
              <div class="report-meta-icon" style="background: #f1f5f9; color: #475569;">
                <i class="fa-regular fa-folder-open"></i>
              </div>
              <div class="report-meta-text">
                <span class="report-meta-label">Folder di Drive</span>
                <span class="report-meta-val">${escapeHTML(katBulan)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- KPI Ringkasan Metrik Media Kreatif -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; text-align: center;">
          <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 10px; padding: 10px 8px;">
            <div style="font-size: 0.72rem; color: #1e40af; font-weight: 700; text-transform: uppercase;"><i class="fa-solid fa-photo-film"></i> Total Konten</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: #1d4ed8; margin-top: 4px;">${totalPost}</div>
          </div>
          <div style="background: #fdf2f8; border: 1.5px solid #fbcfe8; border-radius: 10px; padding: 10px 8px;">
            <div style="font-size: 0.72rem; color: #9d174d; font-weight: 700; text-transform: uppercase;"><i class="fa-solid fa-users"></i> Jangkauan</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: #be185d; margin-top: 4px;">${totalJangkau.toLocaleString('id-ID')}</div>
          </div>
          <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 10px 8px;">
            <div style="font-size: 0.72rem; color: #166534; font-weight: 700; text-transform: uppercase;"><i class="fa-solid fa-heart"></i> Interaksi</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: #15803d; margin-top: 4px;">${totalInteraksi.toLocaleString('id-ID')}</div>
          </div>
          <div style="background: #fefce8; border: 1.5px solid #fef08a; border-radius: 10px; padding: 10px 8px;">
            <div style="font-size: 0.72rem; color: #854d0e; font-weight: 700; text-transform: uppercase;"><i class="fa-solid fa-id-badge"></i> Kunjungan</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: #a16207; margin-top: 4px;">${totalKunjungan.toLocaleString('id-ID')}</div>
          </div>
        </div>

        <!-- Tabel Rincian Postingan & Insight -->
        <div style="margin-bottom: 14px;">
          <div style="font-size: 0.875rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-chart-line" style="color: var(--accent-red);"></i> Rincian Postingan & Metrik Insight
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; background: #ffffff;">
            <table style="min-width: 1180px; width: 100%; border-collapse: collapse; font-size: 0.825rem; table-layout: auto;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 10px 8px; text-align: center; width: 45px; min-width: 45px; white-space: nowrap; font-weight: 700; color: #475569;">No</th>
                  <th style="padding: 10px 12px; text-align: center; width: 145px; min-width: 140px; white-space: nowrap; font-weight: 700; color: #475569;">Waktu</th>
                  <th style="padding: 10px 12px; text-align: center; width: 110px; min-width: 110px; white-space: nowrap; font-weight: 700; color: #475569;">Platform</th>
                  <th style="padding: 10px 12px; text-align: center; width: 105px; min-width: 100px; white-space: nowrap; font-weight: 700; color: #475569;">Tipe</th>
                  <th style="padding: 10px 14px; text-align: left; min-width: 220px; font-weight: 700; color: #475569;">Nama Konten</th>
                  <th style="padding: 10px 10px; text-align: center; width: 95px; min-width: 90px; white-space: nowrap; font-weight: 700; color: #475569;">Jangkauan</th>
                  <th style="padding: 10px 8px; text-align: center; width: 70px; min-width: 65px; white-space: nowrap; font-weight: 700; color: #475569;">Like</th>
                  <th style="padding: 10px 8px; text-align: center; width: 70px; min-width: 65px; white-space: nowrap; font-weight: 700; color: #475569;">Komen</th>
                  <th style="padding: 10px 8px; text-align: center; width: 70px; min-width: 65px; white-space: nowrap; font-weight: 700; color: #475569;">Share</th>
                  <th style="padding: 10px 8px; text-align: center; width: 70px; min-width: 65px; white-space: nowrap; font-weight: 700; color: #475569;">Repost</th>
                  <th style="padding: 10px 8px; text-align: center; width: 70px; min-width: 65px; white-space: nowrap; font-weight: 700; color: #475569;">Save</th>
                  <th style="padding: 10px 10px; text-align: center; width: 95px; min-width: 90px; white-space: nowrap; font-weight: 700; color: #475569;">Kunjungan</th>
                  <th style="padding: 10px 10px; text-align: center; width: 95px; min-width: 90px; white-space: nowrap; font-weight: 700; color: #475569;">Followers</th>
                </tr>
              </thead>
              <tbody>
                ${kontenList.length > 0 ? kontenList.map((k, idx) => {
                  const isChat = (k.tipe === "Chat" || k.platform === "WhatsApp");
                  const isTikTok = (k.platform === "TikTok" && !isChat);
                  const dash = '<span style="color:#94a3b8; font-weight:600;">-</span>';

                  const jangkauCell = (isChat || isTikTok) ? dash : Number(k.jangkau || 0).toLocaleString('id-ID');
                  const likeCell = isChat ? dash : Number(k.like || 0).toLocaleString('id-ID');
                  const komenCell = isChat ? dash : Number(k.komen || 0).toLocaleString('id-ID');
                  const shareCell = isChat ? dash : Number(k.share || 0).toLocaleString('id-ID');
                  const repostCell = isChat ? dash : Number(k.repost || 0).toLocaleString('id-ID');
                  const saveCell = isChat ? dash : Number(k.save || 0).toLocaleString('id-ID');
                  const kunjunganCell = isChat ? dash : Number(k.kunjungan || 0).toLocaleString('id-ID');
                  const followersCell = isChat ? dash : Number(k.followers || 0).toLocaleString('id-ID');

                  return `
                  <tr style="border-bottom: 1px solid #f1f5f9; text-align: center;">
                    <td style="padding: 10px 8px; color: #64748b; font-weight: 600; white-space: nowrap;">${idx + 1}</td>
                    <td style="padding: 10px 12px; font-weight: 600; color: #334155; white-space: nowrap;">${escapeHTML(k.waktu || '-')}</td>
                    <td style="padding: 10px 10px; white-space: nowrap;"><span style="background: #f1f5f9; color: #1e293b; padding: 3px 10px; border-radius: 6px; font-weight: 700; font-size: 0.75rem; white-space: nowrap; display: inline-block;">${escapeHTML(k.platform || 'Instagram')}</span></td>
                    <td style="padding: 10px 10px; white-space: nowrap;"><span style="background: #eff6ff; color: #1d4ed8; padding: 3px 10px; border-radius: 6px; font-weight: 700; font-size: 0.75rem; white-space: nowrap; display: inline-block;">${escapeHTML(k.tipe || 'Postingan')}</span></td>
                    <td style="padding: 10px 14px; text-align: left; font-weight: 600; color: #0f172a; word-break: break-word; overflow-wrap: anywhere; line-height: 1.45;">${escapeHTML(k.nama || '-')}</td>
                    <td style="padding: 10px 10px; font-weight: 800; color: #0f172a; white-space: nowrap;">${jangkauCell}</td>
                    <td style="padding: 10px 8px; color: ${isChat ? '#94a3b8' : '#dc2626'}; font-weight: 700; white-space: nowrap;">${likeCell}</td>
                    <td style="padding: 10px 8px; white-space: nowrap;">${komenCell}</td>
                    <td style="padding: 10px 8px; white-space: nowrap;">${shareCell}</td>
                    <td style="padding: 10px 8px; white-space: nowrap;">${repostCell}</td>
                    <td style="padding: 10px 8px; white-space: nowrap;">${saveCell}</td>
                    <td style="padding: 10px 10px; font-weight: 700; color: ${isChat ? '#94a3b8' : '#2563eb'}; white-space: nowrap;">${kunjunganCell}</td>
                    <td style="padding: 10px 10px; font-weight: 700; color: ${isChat ? '#94a3b8' : '#059669'}; white-space: nowrap;">${followersCell}</td>
                  </tr>
                `}).join('') : `
                  <tr><td colspan="13" style="padding: 24px; text-align: center; color: #94a3b8;">Tidak ada data postingan konten.</td></tr>
                `}
              </tbody>
              <tfoot>
                <tr style="background: #f1f5f9; font-weight: 800; border-top: 2px solid #cbd5e1; text-align: center;">
                  <td colspan="5" style="padding: 10px 14px; text-align: right; text-transform: uppercase; color: #334155; white-space: nowrap;">TOTAL</td>
                  <td style="padding: 10px 10px; color: #0f172a; white-space: nowrap;">${totalJangkau.toLocaleString('id-ID')}</td>
                  <td style="padding: 10px 8px; color: #dc2626; white-space: nowrap;">${totalLike.toLocaleString('id-ID')}</td>
                  <td style="padding: 10px 8px; color: #0f172a; white-space: nowrap;">${totalKomen.toLocaleString('id-ID')}</td>
                  <td style="padding: 10px 8px; color: #0f172a; white-space: nowrap;">${totalShare.toLocaleString('id-ID')}</td>
                  <td style="padding: 10px 8px; color: #0f172a; white-space: nowrap;">${totalRepost.toLocaleString('id-ID')}</td>
                  <td style="padding: 10px 8px; color: #0f172a; white-space: nowrap;">${totalSave.toLocaleString('id-ID')}</td>
                  <td style="padding: 10px 10px; color: #2563eb; white-space: nowrap;">${totalKunjungan.toLocaleString('id-ID')}</td>
                  <td style="padding: 10px 10px; color: #059669; white-space: nowrap;">${totalFollowers.toLocaleString('id-ID')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Link Materi / File RAW -->
        ${(detail.linkDriveMateri || lap.linkDrive) ? `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <i class="fa-brands fa-google-drive" style="color: #0f9d58; font-size: 1.1rem;"></i>
              <strong style="font-size: 0.85rem; color: #334155;">Link Folder Materi RAW:</strong>
            </div>
            <a href="${escapeHTML(detail.linkDriveMateri || lap.linkDrive)}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; font-weight: 600; font-size: 0.85rem; text-decoration: underline; word-break: break-all;">
              Buka Google Drive <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem; margin-left: 2px;"></i>
            </a>
          </div>
        ` : ''}
      </div>
    `;
  } else {
    html = `
      <div style="text-align: left; font-size: 0.875rem; color: #1e293b;">
      ${!isReadOnly ? `
      <!-- Action Bar Modal (Tombol Edit Laporan) -->
      <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 12px;">
        <button type="button" class="btn btn-warning btn-sm" onclick="editLaporan('${lap.id}')" style="background-color: #d97706; border-color: #d97706; color: #ffffff; font-weight: 700; padding: 6px 14px; border-radius: 6px; box-shadow: 0 1px 3px rgba(217, 119, 6, 0.25); cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-pen-to-square"></i> Edit Laporan Ini
        </button>
      </div>
      ` : ''}

      <!-- Kartu Informasi Metadata Laporan (Nama Pelapor, Hari / Tanggal, Angkatan, Folder di Drive) -->
      <div class="report-meta-card">
        <div class="report-meta-grid">
          <!-- Nama Pelapor -->
          <div class="report-meta-item">
            <div class="report-meta-icon" style="background: #e0f2fe; color: #0284c7;">
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="report-meta-text">
              <span class="report-meta-label">Nama Pelapor</span>
              <span class="report-meta-val">${escapeHTML(lap.pelapor)}</span>
            </div>
          </div>

          <!-- Hari / Tanggal -->
          <div class="report-meta-item">
            <div class="report-meta-icon" style="background: #fef3c7; color: #d97706;">
              <i class="fa-solid fa-calendar-day"></i>
            </div>
            <div class="report-meta-text">
              <span class="report-meta-label">Hari / Tanggal</span>
              <span class="report-meta-val">${escapeHTML(tglIndo)}</span>
            </div>
          </div>

          <!-- Angkatan -->
          <div class="report-meta-item">
            <div class="report-meta-icon" style="background: #eff6ff; color: #2563eb;">
              <i class="fa-solid fa-users"></i>
            </div>
            <div class="report-meta-text">
              <span class="report-meta-label">Angkatan</span>
              <span class="report-meta-val" style="color: #1d4ed8;">${escapeHTML(angk || 'G10')}</span>
            </div>
          </div>

          <!-- Folder di Drive -->
          <div class="report-meta-item">
            <div class="report-meta-icon" style="background: #f1f5f9; color: #475569;">
              <i class="fa-regular fa-folder-open"></i>
            </div>
            <div class="report-meta-text">
              <span class="report-meta-label">Folder di Drive</span>
              <span class="report-meta-val">${escapeHTML(katBulan)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rekap Presensi KPI Cards -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 22px; text-align: center;">
        <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 10px 8px;">
          <div style="font-size: 0.74rem; color: #166534; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;"><i class="fa-solid fa-check" style="margin-right: 3px;"></i> Hadir</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: #15803d; line-height: 1.2; margin-top: 4px;">${totalHadir}</div>
        </div>
        <div style="background: #fefce8; border: 1.5px solid #fef08a; border-radius: 10px; padding: 10px 8px;">
          <div style="font-size: 0.74rem; color: #854d0e; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;"><i class="fa-regular fa-envelope" style="margin-right: 3px;"></i> Izin</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: #a16207; line-height: 1.2; margin-top: 4px;">${totalIzin}</div>
        </div>
        <div style="background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 10px; padding: 10px 8px;">
          <div style="font-size: 0.74rem; color: #991b1b; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;"><i class="fa-solid fa-xmark" style="margin-right: 3px;"></i> Alfa</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: #dc2626; line-height: 1.2; margin-top: 4px;">${totalAlfa}</div>
        </div>
        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 10px 8px;">
          <div style="font-size: 0.74rem; color: #334155; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;"><i class="fa-solid fa-users" style="margin-right: 3px;"></i> Total</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: #0f172a; line-height: 1.2; margin-top: 4px;">${totalAnak}</div>
        </div>
      </div>

      ${detail.agenda ? `
      <!-- Agenda Pertemuan -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 3px solid var(--accent-red); border-radius: 8px; padding: 10px 14px; margin-bottom: 22px;">
        <div style="font-size: 0.78rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;"><i class="fa-solid fa-list-check" style="color: var(--accent-red); margin-right: 5px;"></i> Agenda Kegiatan Latihan:</div>
        <div style="font-size: 0.85rem; color: #334155;">${escapeHTML(detail.agenda)}</div>
      </div>
      ` : ''}

      <!-- Header Tabel Presensi -->
      <div style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.9rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-list-check" style="color: var(--accent-red);"></i>
          <span>Daftar Presensi Anggota ${angk ? `(${escapeHTML(angk)})` : ''}</span>
        </span>
        <span style="background: #f1f5f9; color: #475569; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
          ${displayAbs.length} Anggota
        </span>
      </div>

      <!-- TAMPILAN DESKTOP: Tabel Presensi Lengkap -->
      <div class="desktop-presensi-table" style="max-height: 340px; overflow-y: auto; overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 10px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.825rem; min-width: 580px;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; position: sticky; top: 0; z-index: 2;">
              <th style="width: 48px; padding: 10px 8px; text-align: center; color: #475569; font-weight: 700; white-space: nowrap;">No</th>
              <th style="padding: 10px 14px; text-align: left; color: #475569; font-weight: 700; white-space: nowrap; min-width: 190px;">Nama Lengkap Siswa</th>
              <th style="width: 110px; padding: 10px 12px; text-align: center; color: #475569; font-weight: 700; white-space: nowrap;">Kelas</th>
              <th style="width: 110px; padding: 10px 12px; text-align: center; color: #475569; font-weight: 700; white-space: nowrap;">Status</th>
              <th style="padding: 10px 14px; text-align: left; color: #475569; font-weight: 700; white-space: nowrap; min-width: 150px;">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${displayAbs.length > 0 ? displayAbs.map((m, idx) => {
              const st = m.status || 'Hadir';
              const badgeBg = st === 'Hadir' ? '#dcfce7' : (st === 'Izin' ? '#fef9c3' : '#fee2e2');
              const badgeColor = st === 'Hadir' ? '#15803d' : (st === 'Izin' ? '#a16207' : '#dc2626');
              const badgeIcon = st === 'Hadir' ? 'fa-check' : (st === 'Izin' ? 'fa-envelope' : 'fa-xmark');
              return `
                <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s ease;">
                  <td style="padding: 8px 6px; text-align: center; color: #64748b; font-weight: 600;">${idx + 1}</td>
                  <td style="padding: 8px 14px; font-weight: 600; color: #0f172a; white-space: nowrap;">${escapeHTML(m.nama || '-')}</td>
                  <td style="padding: 8px 12px; text-align: center; color: #334155; font-weight: 500; white-space: nowrap;">${escapeHTML(m.kelas || '-')}</td>
                  <td style="padding: 8px 12px; text-align: center; white-space: nowrap;">
                    <span style="background: ${badgeBg}; color: ${badgeColor}; font-weight: 700; padding: 3px 10px; border-radius: 6px; font-size: 0.76rem; display: inline-flex; align-items: center; gap: 4px;">
                      <i class="fa-solid ${badgeIcon}" style="font-size: 0.7rem;"></i>
                      ${escapeHTML(st)}
                    </span>
                  </td>
                  <td style="padding: 8px 14px; color: ${m.keterangan ? '#334155' : '#94a3b8'}; font-style: ${m.keterangan ? 'normal' : 'italic'};">
                    ${escapeHTML(m.keterangan || '-')}
                  </td>
                </tr>
              `;
            }).join('') : `<tr><td colspan="5" style="padding: 24px; text-align: center; color: #94a3b8;"><i class="fa-regular fa-folder-open" style="font-size: 1.5rem; display: block; margin-bottom: 6px;"></i>Tidak ada data presensi.</td></tr>`}
          </tbody>
        </table>
      </div>

      <!-- TAMPILAN KHUSUS LAYAR KECIL / HP / MOBILE: Container per Container (Tanpa Scroll Horizontal) -->
      <div class="mobile-presensi-cards">
        ${displayAbs.length > 0 ? displayAbs.map((m, idx) => {
          const st = m.status || 'Hadir';
          const badgeBg = st === 'Hadir' ? '#dcfce7' : (st === 'Izin' ? '#fef9c3' : '#fee2e2');
          const badgeColor = st === 'Hadir' ? '#15803d' : (st === 'Izin' ? '#a16207' : '#dc2626');
          const badgeIcon = st === 'Hadir' ? 'fa-check' : (st === 'Izin' ? 'fa-envelope' : 'fa-xmark');
          return `
            <div class="presensi-student-card">
              <div class="presensi-student-main">
                <div class="presensi-student-info">
                  <span class="presensi-student-num">${idx + 1}</span>
                  <div class="presensi-student-name-box">
                    <strong class="presensi-student-name">${escapeHTML(m.nama || '-')}</strong>
                    <span class="presensi-student-class">${escapeHTML(m.kelas || '-')}</span>
                  </div>
                </div>
                <div class="presensi-student-status">
                  <span class="badge" style="background: ${badgeBg}; color: ${badgeColor}; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;">
                    <i class="fa-solid ${badgeIcon}" style="font-size: 0.72rem;"></i>
                    ${escapeHTML(st)}
                  </span>
                </div>
              </div>
              ${m.keterangan ? `
                <div class="presensi-student-keterangan">
                  <i class="fa-regular fa-comment-dots" style="color: #64748b; font-size: 0.78rem; flex-shrink: 0; margin-top: 2px;"></i>
                  <span style="font-size: 0.78rem; color: #334155; line-height: 1.35; word-break: break-word;">${escapeHTML(m.keterangan)}</span>
                </div>
              ` : ''}
            </div>
          `;
        }).join('') : `
          <div style="padding: 24px; text-align: center; color: #94a3b8; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px;">
            <i class="fa-regular fa-folder-open" style="font-size: 1.5rem; display: block; margin-bottom: 6px;"></i>
            Tidak ada data presensi.
          </div>
        `}
      </div>
    </div>
  `;
  }

  if (typeof Swal !== 'undefined') {
    const isMed = (
      lap.divisiId === "media_kreatif" ||
      (lap.divisiNama && (
        lap.divisiNama.toLowerCase().includes("media") ||
        lap.divisiNama.toLowerCase().includes("kreatif") ||
        lap.divisiNama.toLowerCase().includes("pubdok")
      )) ||
      (detail && (
        (Array.isArray(detail.kontenList) && detail.kontenList.length > 0) ||
        detail.judulKonten
      ))
    );
    Swal.fire({
      title: `<div style="font-size: 1.15rem; font-weight: 800; color: #0f172a; text-align: left; padding-left: 2px; padding-right: 44px; word-break: break-word; line-height: 1.35;">${escapeHTML(lap.judul)}</div>`,
      html: html,
      width: (window.innerWidth <= 768 ? '95vw' : (isMed ? '920px' : '780px')),
      showCloseButton: true,
      showCancelButton: true,
      showDenyButton: !isReadOnly,
      confirmButtonColor: '#dc2626',
      denyButtonColor: '#0f172a',
      cancelButtonColor: '#64748b',
      confirmButtonText: '<i class="fa-solid fa-file-pdf"></i> Unduh PDF',
      denyButtonText: '<i class="fa-brands fa-google-drive"></i> Kirim ke Drive',
      cancelButtonText: 'Tutup',
      customClass: { popup: 'swal-report-detail-modal' }
    }).then((res) => {
      if (res.isConfirmed) {
        unduhLaporanPDF(lap.id);
      } else if (res.isDenied) {
        kirimLaporanKeGoogleDrive(lap.id);
      }
    });
  }
}

function toggleStatusReview(id) {
  if (typeof isWakilAtauPelatih === 'function' && isWakilAtauPelatih(state.currentUser)) {
    if (typeof showSmallAlert === 'function') {
      showSmallAlert({
        icon: 'warning',
        title: 'Akses Dibatasi',
        text: 'Wakil Ketua dan Pelatih tidak memiliki izin untuk mengubah status laporan.'
      });
    }
    return;
  }

  const lap = state.laporan.find(l => l.id === id);
  if (!lap) return;

  lap.statusReview = lap.statusReview === "Terverifikasi" ? "Menunggu Review" : "Terverifikasi";
  saveState();
  syncChangeToGAS('updateLaporanStatus', { id: lap.id, statusReview: lap.statusReview });
  renderTabelLaporan();
  renderDashboard();
}

function hapusLaporan(id) {
  if (typeof isWakilAtauPelatih === 'function' && isWakilAtauPelatih(state.currentUser)) {
    if (typeof showSmallAlert === 'function') {
      showSmallAlert({
        icon: 'warning',
        title: 'Akses Dibatasi',
        text: 'Wakil Ketua dan Pelatih tidak memiliki izin untuk menghapus laporan. Anda hanya memiliki hak akses melihat laporan.'
      });
    }
    return;
  }

  const lap = state.laporan.find(l => l.id === id);
  if (!lap) return;

  const prosesHapus = () => {
    const payload = {
      id: lap.id,
      judul: lap.judul,
      divisiNama: lap.divisiNama,
      kategoriBulan: lap.kategoriBulan || lap.detail?.kategoriBulan || "",
      driveUrl: lap.driveFileUrl || lap.driveUrl || lap.detail?.driveUrl || lap.detail?.driveFileUrl || ""
    };
    state.laporan = state.laporan.filter(l => l.id !== id);
    saveState();
    syncChangeToGAS('deleteLaporan', payload);
    renderTabelLaporan();
    renderDashboard();
    updateArsipBadges();
    if (typeof sinkronkanSemuaDariDrive === 'function') {
      setTimeout(() => sinkronkanSemuaDariDrive(true), 1500);
    }
    if (typeof showSmallToast === 'function') {
      showSmallToast({
        icon: 'success',
        title: 'Laporan Dihapus',
        text: `Laporan "${lap.judul}" telah berhasil dihapus.`
      });
    }
  };

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Hapus Laporan?',
      html: `Apakah Anda yakin ingin menghapus laporan <strong>"${escapeHTML(lap.judul)}"</strong>?<br><span style="font-size:0.8rem; color:#ef4444; margin-top:6px; display:inline-block;">Tindakan ini permanen dan tidak dapat dibatalkan.</span>`,
      icon: 'warning',
      width: '380px',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: '<i class="fa-solid fa-trash-can"></i> Ya, Hapus',
      cancelButtonText: 'Batal',
      focusCancel: true,
      customClass: { popup: 'swal-compact-popup' }
    }).then((result) => {
      if (result.isConfirmed) {
        prosesHapus();
      }
    });
  } else if (confirm(`Apakah Anda yakin ingin menghapus laporan "${lap.judul}"? Tindakan ini tidak dapat dibatalkan.`)) {
    prosesHapus();
  }
}

/* ==========================================================================
   10. FITUR EDIT LAPORAN (PERBAIKI LAPORAN YANG TELAH DIKIRIM)
   ========================================================================== */
function editLaporan(id) {
  if (typeof isWakilAtauPelatih === 'function' && isWakilAtauPelatih(state.currentUser)) {
    if (typeof showSmallAlert === 'function') {
      showSmallAlert({
        icon: 'warning',
        title: 'Akses Dibatasi',
        text: 'Wakil Ketua dan Pelatih tidak memiliki izin untuk mengedit laporan. Anda hanya memiliki hak akses melihat laporan.'
      });
    }
    return;
  }

  const lap = (state.laporan || []).find(l => l.id === id);
  if (!lap) {
    if (typeof showSmallAlert === 'function') {
      showSmallAlert({
        icon: 'error',
        title: 'Laporan Tidak Ditemukan',
        text: 'Data laporan yang ingin diedit tidak ditemukan di sistem.'
      });
    }
    return;
  }

  // Validasi hak akses: Divisi hanya boleh mengedit laporannya sendiri
  const isPimpinan = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : false;
  const userDivId = (!isPimpinan && typeof normalizeUserDivisionId === 'function') 
    ? normalizeUserDivisionId(state.currentUser) 
    : "";
  if (!isPimpinan && userDivId) {
    const lapDiv = (lap.divisiId || "").toLowerCase();
    if (lapDiv && lapDiv !== userDivId && !lapDiv.includes(userDivId)) {
      if (typeof showSmallAlert === 'function') {
        showSmallAlert({
          icon: 'warning',
          title: 'Akses Ditolak',
          text: 'Anda hanya memiliki izin untuk mengedit laporan dari divisi Anda sendiri.'
        });
      }
      return;
    }
  }

  // Tutup modal detail jika sedang terbuka
  if (typeof Swal !== 'undefined') {
    Swal.close();
  }

  window.editingLaporanId = id;
  const divId = lap.divisiId || 'sekretaris';

  // Pindah ke tab formulir buat/kelola laporan
  if (typeof switchTab === 'function') {
    switchTab('tab-buat-laporan');
  }

  // Sembunyikan selector box pemilihan divisi saat mode edit aktif
  const selectorBox = document.querySelector(".divisi-selector-box");
  if (selectorBox) {
    selectorBox.style.display = "none";
  }

  // Perbarui judul dan deskripsi header form untuk mode edit
  const headerTitle = document.querySelector("#tab-buat-laporan .section-title-box h2");
  const headerDesc = document.querySelector("#tab-buat-laporan .section-title-box p");
  if (headerTitle) {
    headerTitle.textContent = `Edit Laporan: ${lap.divisiNama || divId.toUpperCase()}`;
  }
  if (headerDesc) {
    headerDesc.textContent = `Mengubah data laporan mingguan: ${lap.judul || '-'}`;
  }

  // Parse detail jika tersimpan sebagai JSON string
  let detail = lap.detail || {};
  if (typeof detail === 'string') {
    try {
      detail = JSON.parse(detail);
    } catch (e) {
      detail = {};
    }
  }

  // Pilih radio button divisi yang sesuai
  const radio = document.querySelector(`input[name="divisiReport"][value="${divId}"]`);
  if (radio) {
    radio.checked = true;
  }
  if (typeof updateRadioLabelStyles === 'function') {
    updateRadioLabelStyles();
  }

  // 1. Set data dasar (Judul, Pelapor, Link Drive) sebelum render template agar terbaca di value default
  const lapJudul = document.getElementById("lapJudul");
  if (lapJudul) lapJudul.value = lap.judul || "";

  const lapPelapor = document.getElementById("lapPelapor");
  if (lapPelapor) lapPelapor.value = lap.pelapor || "";

  const lapLinkDrive = document.getElementById("lapLinkDriveUmum");
  if (lapLinkDrive) lapLinkDrive.value = detail.linkDrive || lap.linkDrive || "";

  // 2. Render template field divisi terkait terlebih dahulu agar mode kalender (bulanan/mingguan) aktif
  renderDynamicReportFields(divId);

  // 3. Set Tanggal Laporan dan Flatpickr
  const cleanTanggal = normalizeTanggalToYMD(lap.tanggal || (detail && (detail.tanggal || detail.tanggalIndo)) || "");
  const tglInput = document.getElementById("lapTanggal");
  if (tglInput) {
    tglInput.value = cleanTanggal;
  }
  if (fpTanggalInstance) {
    try {
      if (cleanTanggal) {
        fpTanggalInstance.setDate(cleanTanggal, false, "Y-m-d");
      }
    } catch (eFp) {
      console.warn("Gagal setDate flatpickr:", eFp);
    }
  }

  // 4. Pastikan judul laporan di input utama terisi
  const lapJudulUtama = document.getElementById("lapJudulUtama");
  if (lapJudulUtama) {
    lapJudulUtama.value = lap.judul || "";
  }
  if (lapJudul) {
    lapJudul.value = lap.judul || "";
  }

  // 5. Sinkronkan tampilan info tanggal dan minggu ke
  if (typeof syncReportDateInfo === 'function') {
    syncReportDateInfo();
  }
  if (detail.mingguKe) {
    document.querySelectorAll(".sync-report-minggu").forEach(el => {
      if (el.tagName === "INPUT") el.value = detail.mingguKe;
      else el.textContent = detail.mingguKe;
    });
  }
  if (detail.tanggalIndo) {
    document.querySelectorAll(".sync-report-tanggal").forEach(el => {
      if (el.tagName === "INPUT") el.value = detail.tanggalIndo;
      else el.textContent = detail.tanggalIndo;
    });
  }

  // 6. Terapkan data spesifik per divisi
  if (divId === "sekretaris") {
    const angk = (detail.angkatan || (detail.absensiG11 && detail.absensiG11.length ? "G11" : "G10")).toUpperCase();
    if (typeof switchSekretarisGenTab === 'function') {
      switchSekretarisGenTab(angk);
    }

    // Ambil data absensi awal dari berbagai kemungkinan struktur data
    let savedAbs = [];
    if (Array.isArray(detail.absensi) && detail.absensi.length > 0) {
      savedAbs = detail.absensi;
    } else if (angk === "G11" && Array.isArray(detail.absensiG11) && detail.absensiG11.length > 0) {
      savedAbs = detail.absensiG11;
    } else if (angk === "G10" && Array.isArray(detail.absensiG10) && detail.absensiG10.length > 0) {
      savedAbs = detail.absensiG10;
    } else if (Array.isArray(lap.absensi) && lap.absensi.length > 0) {
      savedAbs = lap.absensi;
    }

    if (typeof savedAbs === 'string') {
      try { savedAbs = JSON.parse(savedAbs); } catch (e) { savedAbs = []; }
    }

    const targetTbodyId = angk === "G11" ? "tbodySekG11" : "tbodySekG10";
    const tbody = document.getElementById(targetTbodyId);

    if (tbody && savedAbs.length > 0) {
      // Buat baris tabel secara presisi langsung dari data absensi awal laporan
      tbody.innerHTML = savedAbs.map((item, idx) => {
        const nm = item.nama || item.name || "-";
        const kls = item.kelas || item.class || "-";
        const st = item.status || "Hadir";
        const kt = item.keterangan || "";
        return buatRowHtmlAbsensiSek(idx + 1, { nama: nm, kelas: kls }, st, kt);
      }).join("");

      if (typeof updateBadgesAbsensiSek === 'function') updateBadgesAbsensiSek();
      if (typeof hitungRekapAbsensiSekretaris === 'function') hitungRekapAbsensiSekretaris();
    }
  } else if (divId === "bendahara") {
    const benSaldoAwal = document.getElementById("benSaldoAwal");
    if (benSaldoAwal) {
      const sAwal = detail.saldoAwal !== undefined ? detail.saldoAwal : 0;
      benSaldoAwal.value = sAwal ? Number(sAwal).toLocaleString("id-ID") : "0";
    }

    // Kas G10
    const tbG10 = document.getElementById("tbodyBenG10");
    if (tbG10 && Array.isArray(detail.kasG10) && detail.kasG10.length > 0) {
      tbG10.innerHTML = detail.kasG10.map((k, idx) => {
        return buatRowHtmlKasBen(idx + 1, k, k.bayar || "Tidak Bayar", k.bayar === 'Bayar' ? (k.metode || "Cash") : "");
      }).join("");
      const bG10 = document.getElementById("badgeKasCountG10");
      if (bG10) bG10.textContent = `${detail.kasG10.length} Anak`;
    }

    // Kas G11
    const tbG11 = document.getElementById("tbodyBenG11");
    if (tbG11 && Array.isArray(detail.kasG11) && detail.kasG11.length > 0) {
      tbG11.innerHTML = detail.kasG11.map((k, idx) => {
        return buatRowHtmlKasBen(idx + 1, k, k.bayar || "Tidak Bayar", k.bayar === 'Bayar' ? (k.metode || "Cash") : "");
      }).join("");
      const bG11 = document.getElementById("badgeKasCountG11");
      if (bG11) bG11.textContent = `${detail.kasG11.length} Anak`;
    }

    // Pemasukan tambahan
    const tbMasuk = document.getElementById("tbodyPemasukanLain");
    if (tbMasuk && Array.isArray(detail.pemasukanTambahan)) {
      tbMasuk.innerHTML = "";
      detail.pemasukanTambahan.forEach(p => {
        tambahPemasukanTambahan();
        const lastTr = tbMasuk.lastElementChild;
        if (lastTr) {
          const n = lastTr.querySelector(".ben-masuk-nama");
          const m = lastTr.querySelector(".ben-masuk-nominal");
          const met = lastTr.querySelector(".ben-masuk-metode");
          if (n) n.value = p.sumber || "";
          if (m) m.value = p.nominal ? Number(p.nominal).toLocaleString("id-ID") : "0";
          if (met) met.value = p.metode || "Cash";
        }
      });
    }

    // Pengeluaran
    const tbKeluar = document.getElementById("tbodyPengeluaran");
    if (tbKeluar && Array.isArray(detail.pengeluaran)) {
      tbKeluar.innerHTML = "";
      detail.pengeluaran.forEach(p => {
        tambahPengeluaranOpsional();
        const lastTr = tbKeluar.lastElementChild;
        if (lastTr) {
          const r = lastTr.querySelector(".ben-keluar-nama");
          const m = lastTr.querySelector(".ben-keluar-nominal");
          const met = lastTr.querySelector(".ben-keluar-metode");
          if (r) r.value = p.rincian || "";
          if (m) m.value = p.nominal ? Number(p.nominal).toLocaleString("id-ID") : "0";
          if (met) met.value = p.metode || "Cash";
        }
      });
    }

    if (typeof hitungBendaharaRekap === 'function') hitungBendaharaRekap();

  } else if (divId === "korlap") {
    const judulUtama = document.getElementById("lapJudulUtama");
    if (judulUtama) judulUtama.value = lap.judul || "";
    const korMateri = document.getElementById("korlapMateri");
    if (korMateri) {
      korMateri.value = detail.materiLatihan || (Array.isArray(detail.rowsMateri) ? detail.rowsMateri.map(m => m.materi).join("\n") : "");
    }
    const korEva = document.getElementById("korlapEvaluasi");
    if (korEva) korEva.value = detail.evaluasi || "";
  } else if (divId === "sarpras") {
    const judulUtama = document.getElementById("lapJudulUtama");
    if (judulUtama) judulUtama.value = lap.judul || "";

    const tbSar = document.getElementById("tbodySarpras");
    if (tbSar && Array.isArray(detail.inventaris)) {
      const rows = Array.from(tbSar.querySelectorAll("tr"));
      detail.inventaris.forEach((inv, invIdx) => {
        const itemNm = (inv.nama || inv.barang || inv.name || (window.SARPRAS_INVENTORY_ITEMS && window.SARPRAS_INVENTORY_ITEMS[invIdx]) || "").trim().toLowerCase();
        let tr = rows.find(r => (r.querySelector(".sar-item-name")?.textContent.trim().toLowerCase() || r.cells[1]?.textContent.trim().toLowerCase()) === itemNm);
        if (!tr && rows[invIdx]) tr = rows[invIdx];
        if (tr) {
          const l = tr.querySelector(".sar-layak");
          const tl = tr.querySelector(".sar-tidak");
          if (l) l.value = inv.layak || 0;
          if (tl) tl.value = inv.tidakLayak || 0;
          if (typeof hitungSarprasRow === 'function') hitungSarprasRow(l || tl);
        } else {
          tambahBarisSarprasLangsung(inv.nama || inv.barang || inv.name || `Barang #${invIdx + 1}`, inv.layak || 0, inv.tidakLayak || 0);
        }
      });
    }
    if (typeof hitungSarprasSummary === 'function') hitungSarprasSummary();
  } else if (divId === "media_kreatif") {
    const judulUtama = document.getElementById("lapJudulUtama");
    if (judulUtama) judulUtama.value = lap.judul || "";
    const tbMed = document.getElementById("tbodyMedKonten");
    if (tbMed && Array.isArray(detail.kontenList) && detail.kontenList.length > 0) {
      tbMed.innerHTML = "";
      detail.kontenList.forEach(k => {
        if (typeof tambahBarisKontenMed === 'function') {
          tambahBarisKontenMed(k);
        }
      });
    }
  }

  // Tampilkan Banner Mode Edit di atas form (tanpa menampilkan ID dan tanpa akhiran divisi)
  let banner = document.getElementById("bannerModeEdit");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "bannerModeEdit";
    banner.className = "banner-mode-edit";
    const form = document.getElementById("formInputLaporan");
    if (form && form.parentNode) {
      form.parentNode.insertBefore(banner, form);
    }
  }

  const angkInfo = detail.angkatan ? ` (${detail.angkatan})` : "";
  banner.innerHTML = `
    <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1.5px solid #f59e0b; border-radius: 10px; padding: 12px 18px; margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; box-shadow: 0 2px 4px rgba(245, 158, 11, 0.1);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 40px; height: 40px; border-radius: 8px; background: #d97706; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0; box-shadow: 0 2px 4px rgba(217, 119, 6, 0.25);">
          <i class="fa-solid fa-pen-to-square"></i>
        </div>
        <div>
          <div style="font-weight: 800; color: #92400e; font-size: 0.95rem;">
            Mode Edit Laporan
          </div>
          <div style="font-size: 0.82rem; color: #78350f; margin-top: 2px;">
            Mengubah laporan: <strong>${escapeHTML(lap.judul)}</strong>${angkInfo}
          </div>
        </div>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="batalEditLaporan()" style="white-space: nowrap; font-weight: 600;">
          <i class="fa-solid fa-xmark" style="margin-right: 5px;"></i> Batal Edit
        </button>
      </div>
    </div>
  `;

  // Ubah tombol submit menjadi "Simpan Perubahan Laporan"
  const btnSubmit = document.getElementById("btnSimpanLaporan");
  if (btnSubmit) {
    btnSubmit.innerHTML = `<i class="fa-solid fa-floppy-disk" style="margin-right: 6px;"></i> Simpan Perubahan Laporan`;
    btnSubmit.classList.add("btn-warning");
    btnSubmit.style.backgroundColor = "#d97706";
    btnSubmit.style.borderColor = "#d97706";
    btnSubmit.style.color = "#ffffff";
  }

  // Tambahkan tombol "Batal Edit" di sebelah tombol simpan bagian bawah agar mudah diakses di layar mobile
  let btnBatalBottom = document.getElementById("btnBatalEditBawah");
  if (!btnBatalBottom && btnSubmit && btnSubmit.parentNode) {
    btnBatalBottom = document.createElement("button");
    btnBatalBottom.type = "button";
    btnBatalBottom.id = "btnBatalEditBawah";
    btnBatalBottom.className = "btn btn-secondary";
    btnBatalBottom.style.marginRight = "10px";
    btnBatalBottom.innerHTML = `<i class="fa-solid fa-xmark" style="margin-right: 6px;"></i> Batal Edit`;
    btnBatalBottom.onclick = () => batalEditLaporan(true);
    btnSubmit.parentNode.insertBefore(btnBatalBottom, btnSubmit);
  }

  // Gulir ke atas
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (typeof showSmallToast === 'function') {
    showSmallToast({
      icon: 'info',
      title: 'Mode Edit Aktif',
      text: `Formulir siap diedit untuk laporan "${lap.judul}".`
    });
  }
}

function batalEditLaporan(shouldSwitchTab = true) {
  window.editingLaporanId = null;

  // Hapus banner mode edit
  const banner = document.getElementById("bannerModeEdit");
  if (banner) banner.remove();

  // Hapus tombol batal di samping tombol simpan bagian bawah
  const btnBatalBottom = document.getElementById("btnBatalEditBawah");
  if (btnBatalBottom) btnBatalBottom.remove();

  // Reset tombol submit
  const btnSubmit = document.getElementById("btnSimpanLaporan");
  if (btnSubmit) {
    btnSubmit.innerHTML = `<i class="fa-solid fa-cloud-arrow-up" style="margin-right: 6px;"></i> Simpan Laporan`;
    btnSubmit.classList.remove("btn-warning");
    btnSubmit.style.backgroundColor = "";
    btnSubmit.style.borderColor = "";
    btnSubmit.style.color = "";
  }

  // Reset form
  const form = document.getElementById("formInputLaporan");
  if (form) form.reset();

  const tglInput = document.getElementById("lapTanggal");
  if (tglInput) tglInput.value = "";
  if (fpTanggalInstance && typeof fpTanggalInstance.clear === 'function') {
    fpTanggalInstance.clear();
  }

  const lapJudul = document.getElementById("lapJudul");
  if (lapJudul) lapJudul.value = "";

  const isPimpinan = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : false;

  // Jika tombol Batal Edit ditekan (atau shouldSwitchTab = true), segera kembalikan ke arsip laporan
  if (shouldSwitchTab) {
    if (typeof switchTab === 'function') {
      switchTab('tab-arsip-laporan');
    }
    return;
  }

  // Jika dipanggil internal tanpa alihkan tab (misal saat inisialisasi):
  const selectorBox = document.querySelector(".divisi-selector-box");
  if (selectorBox) {
    selectorBox.style.display = isPimpinan ? "" : "none";
  }

  const selectedDivisiRadio = document.querySelector('input[name="divisiReport"]:checked');
  let divisiKey = selectedDivisiRadio ? selectedDivisiRadio.value : "sekretaris";
  if (!selectedDivisiRadio && state.currentUser && typeof normalizeUserDivisionId === 'function') {
    divisiKey = normalizeUserDivisionId(state.currentUser);
  }
  renderDynamicReportFields(divisiKey);
  syncReportDateInfo();
}


// Window Exports
window.editLaporan = editLaporan;
window.batalEditLaporan = batalEditLaporan;
window.getNearestTuesday = getNearestTuesday;
window.initFlatpickrCalendar = initFlatpickrCalendar;
window.getReportDateInfo = getReportDateInfo;
window.syncReportDateInfo = syncReportDateInfo;
window.initDynamicReportForm = initDynamicReportForm;
window.updateRadioLabelStyles = updateRadioLabelStyles;
window.renderDynamicReportFields = renderDynamicReportFields;
window.switchSekretarisGenTab = switchSekretarisGenTab;
window.isiTabelAbsensiSekretaris = isiTabelAbsensiSekretaris;
window.buatRowHtmlAbsensiSek = buatRowHtmlAbsensiSek;
window.onSekStatusChange = onSekStatusChange;
window.updateBadgesAbsensiSek = updateBadgesAbsensiSek;
window.setSemuaKehadiranSek = setSemuaKehadiranSek;
window.bukaModalTambahBarisAbsensiSek = bukaModalTambahBarisAbsensiSek;
window.bukaModalEditBarisAbsensiSek = bukaModalEditBarisAbsensiSek;
window.konfirmasiHapusBarisAbsensiSek = konfirmasiHapusBarisAbsensiSek;
window.hitungRekapAbsensiSekretaris = hitungRekapAbsensiSekretaris;
window.isiTabelKasBendahara = isiTabelKasBendahara;
window.buatRowHtmlKasBen = buatRowHtmlKasBen;
window.onBenBayarChange = onBenBayarChange;
window.setSemuaKasBen = setSemuaKasBen;
window.formatInputRupiahBen = formatInputRupiahBen;
window.tambahBarisKasBenLangsung = tambahBarisKasBenLangsung;
window.tambahBarisKasBendahara = tambahBarisKasBendahara;
window.hapusBarisKasBen = hapusBarisKasBen;
window.tambahPemasukanTambahan = tambahPemasukanTambahan;
window.tambahPengeluaranOpsional = tambahPengeluaranOpsional;
window.hitungBendaharaRekap = hitungBendaharaRekap;
window.tambahBarisMateriKorlap = tambahBarisMateriKorlap;
window.hapusBarisMateriKorlap = hapusBarisMateriKorlap;
window.renumberKorlapMateri = renumberKorlapMateri;
window.hitungSarprasRow = hitungSarprasRow;
window.handleSarprasFocus = handleSarprasFocus;
window.handleSarprasBlur = handleSarprasBlur;
window.hitungSarprasSummary = hitungSarprasSummary;
window.tambahBarangSarpras = tambahBarangSarpras;
window.tambahBarisSarprasLangsung = tambahBarisSarprasLangsung;
window.hapusBarisSarpras = hapusBarisSarpras;
window.updateSarprasNumbers = updateSarprasNumbers;
window.renderSarprasSubNav = renderSarprasSubNav;
window.getKategoriBadgeHTML = getKategoriBadgeHTML;
window.renderHalamanBarangSarpras = renderHalamanBarangSarpras;
window.filterMasterSarpras = filterMasterSarpras;
window.tambahBarangMasterSarpras = tambahBarangMasterSarpras;
window.editBarangMasterSarpras = editBarangMasterSarpras;
window.hapusBarangMasterSarpras = hapusBarangMasterSarpras;
window.refreshSarprasFormTable = refreshSarprasFormTable;
window.clearSearchBarangMaster = clearSearchBarangMaster;
window.tambahBarisKontenMed = tambahBarisKontenMed;
window.simpanLaporan = simpanLaporan;
window.renderTabelLaporan = renderTabelLaporan;
window.clearSearchLaporan = clearSearchLaporan;
window.bukaModalFilterLaporan = bukaModalFilterLaporan;
window.batalFilterLaporan = batalFilterLaporan;
window.terapkanFilterLaporan = terapkanFilterLaporan;
window.resetFilterLaporan = resetFilterLaporan;
window.updateBadgeFilterActiveLaporan = updateBadgeFilterActiveLaporan;
window.bukaModalFilterBarang = bukaModalFilterBarang;
window.batalFilterBarang = batalFilterBarang;
window.pilihPopupFilterKategoriBarangBtn = pilihPopupFilterKategoriBarangBtn;
window.terapkanFilterBarang = terapkanFilterBarang;
window.resetFilterBarang = resetFilterBarang;
window.updateBadgeFilterActiveBarang = updateBadgeFilterActiveBarang;
window.selectSwalMasterKategori = selectSwalMasterKategori;
window.bukaDetailLaporan = bukaDetailLaporan;
window.toggleStatusReview = toggleStatusReview;
window.hapusLaporan = hapusLaporan;
window.normalizeTanggalToYMD = normalizeTanggalToYMD;
window.tambahBarisKontenMed = tambahBarisKontenMed;
window.hapusBarisKontenMed = hapusBarisKontenMed;
window.initMedDatePicker = initMedDatePicker;
window.updateMedRowFieldsVisibility = updateMedRowFieldsVisibility;

// Auto-inisialisasi kalender dan render form sekretaris
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initFlatpickrCalendar();
    const activeRadio = document.querySelector('input[name="divisiReport"]:checked');
    renderDynamicReportFields(activeRadio ? activeRadio.value : "sekretaris");
  });
} else {
  initFlatpickrCalendar();
  const activeRadio = document.querySelector('input[name="divisiReport"]:checked');
  renderDynamicReportFields(activeRadio ? activeRadio.value : "sekretaris");
}

