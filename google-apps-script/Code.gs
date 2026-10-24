/**
 * =========================================================================
 * GOOGLE APPS SCRIPT DATABASE & DRIVE - PASKIBRA GARATIKA JAYAKARTA
 * EKSTRAKURIKULER PASKIBRA SMKN 40 JAKARTA
 * Akun Pengelola: Garatika Jayakarta
 * =========================================================================
 * Skrip ini berfungsi sebagai REST API & Database Online (Cloud) untuk
 * Sistem Informasi & Laporan Paskibra Garatika.
 * Data disimpan di Google Sheets dan berkas arsip otomatis disimpan di Google Drive.
 */

const CONFIG = {
  APP_TITLE: "Database Paskibra Garatika Jayakarta",
  ORGANISASI: "Paskibra Garatika SMKN 40 Jakarta",
  SPREADSHEET_ID: "1X6SUTZWD7fIPRcH1_w7l8naFWZMDzBDwJGxE2zLGioQ",
  DRIVE_FOLDER_ID: "1kAejXxtmBVf1RNeJNnHd9VWluWYHQYcd",
  DRIVE_FOLDER_NAME: "Laporan Paskibra Garatika Jayakarta",
  SHEET_ANGGOTA: "anggota",
  SHEET_DIVISI: "divisi",
  SHEET_LAPORAN: "laporan",
  SHEET_KATEGORI: "kategori",
  SHEET_META: "meta",
};

/**
 * Handle HTTP GET Request
 * Digunakan frontend untuk menarik data (Fetch/Read) dan Ping Koneksi
 */
function doGet(e) {
  return handleRequest(e, "GET");
}

/**
 * Handle HTTP POST Request
 * Digunakan frontend untuk menyimpan, memperbarui, sinkronisasi & hapus data
 */
function doPost(e) {
  return handleRequest(e, "POST");
}

/**
 * Router utama untuk menangani semua request
 */
function handleRequest(e, method) {
  let hasLock = false;
  let lock = null;
  if (method === "POST") {
    try {
      lock = LockService.getScriptLock();
      hasLock = lock.tryLock(5000);
    } catch (eLock) {
      hasLock = false;
    }
  }

  try {

    let params = {};
    if (e && e.parameter) {
      params = Object.assign({}, e.parameter);
    }

    let payload = {};
    if (method === "POST") {
      if (e && e.postData && e.postData.contents) {
        try {
          payload = JSON.parse(e.postData.contents);
        } catch (err) {
          payload = params;
        }
      } else {
        payload = params;
      }
    } else {
      payload = params;
    }

    const action = payload.action || params.action || "ping";
    let responseData;

    switch (action) {
      case "ping":
        responseData = {
          status: "success",
          message: "Database Apps Script Garatika Jayakarta Aktif & Terhubung",
          akun: Session.getActiveUser().getEmail() || "garatika jayakarta",
          waktu: new Date().toISOString(),
        };
        break;

      case "initDatabase":
        responseData = initDatabase();
        break;

      case "getAll":
      case "getAllData":
        responseData = getAllData();
        break;

      case "syncAll":
        responseData = syncAllData(payload.data || payload);
        break;

      case "saveMasterSarpras":
        responseData = saveMasterSarpras(payload.items || payload.data || payload);
        break;

      // CRUD LAPORAN
      case "getLaporan":
        responseData = getLaporanList();
        break;
      case "saveLaporan":
        responseData = saveLaporan(payload.data || payload);
        break;
      case "createDriveFolder":
        responseData = createFolderOnDemand(
          payload.kategoriBulan || payload.bulan || payload.folderName,
        );
        break;
      case "deleteDriveFolder":
        responseData = deleteFolderOnDemand(
          payload.kategoriBulan || payload.bulan || payload.folderName,
        );
        break;
      case "getDriveFolders":
      case "listDriveFolders":
        responseData = listDriveFolders();
        break;
      case "getDriveFiles":
      case "listDriveFiles":
        responseData = listDriveFiles(
          payload.kategoriBulan ||
            payload.bulan ||
            params.kategoriBulan ||
            params.bulan,
        );
        break;
      case "deleteDriveFile":
        responseData = deleteDriveFile(payload.fileId || params.fileId);
        break;
      case "makeAllDriveFilesPublic":
      case "setDrivePublic":
        responseData = makeAllDriveFilesPublic();
        break;
      case "getDriveState":
      case "syncDriveState":
        responseData = getDriveState();
        break;
      case "updateLaporanStatus":
        responseData = updateLaporanStatus(payload.id, payload.statusReview);
        break;
      case "deleteLaporan":
        responseData = deleteLaporan(payload);
        break;

      // CRUD ANGGOTA
      case "getAnggota":
        responseData = getAnggotaList();
        break;
      case "saveAnggota":
        responseData = saveAnggota(payload.data || payload);
        break;
      case "deleteAnggota":
        responseData = deleteAnggota(payload.id);
        break;

      // CRUD DIVISI
      case "getDivisi":
        responseData = getDivisiList();
        break;
      case "saveDivisi":
        responseData = saveDivisi(payload.data || payload);
        break;
      case "deleteDivisi":
        responseData = deleteDivisi(payload.id);
        break;

      // CRUD KATEGORI ANGKATAN
      case "getKategoriAngkatan":
      case "getKategori":
        responseData = getKategoriList();
        break;
      case "saveKategoriAngkatan":
      case "saveKategori":
        responseData = saveKategoriAngkatan(payload.data || payload);
        break;
      case "deleteKategoriAngkatan":
      case "deleteKategori":
        responseData = deleteKategoriAngkatan(payload.id);
        break;

      default:
        responseData = {
          status: "error",
          message:
            "Action '" +
            action +
            "' tidak dikenali di Database Garatika Jayakarta.",
        };
        break;
    }

    return ContentService.createTextOutput(
      JSON.stringify(responseData),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: err.toString(),
        stack: err.stack,
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    if (hasLock && lock) {
      try {
        lock.releaseLock();
      } catch (ignore) {}
    }
  }
}

/**
 * Mendapatkan Spreadsheet aktif yang terikat ke script ini
 */
function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID && CONFIG.SPREADSHEET_ID.trim() !== "") {
    try {
      return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    } catch (errId) {
      console.warn("Gagal membuka spreadsheet via openById:", errId);
    }
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      "Spreadsheet tidak ditemukan. Pastikan SPREADSHEET_ID valid atau script dijalankan dari spreadsheet terkait.",
    );
  }
  return ss;
}

/**
 * Mendapatkan atau membuat sub-folder di dalam folder induk
 */
function getOrCreateSubFolder(parentFolder, subFolderName) {
  const folders = parentFolder.getFoldersByName(subFolderName);
  if (folders.hasNext()) {
    const f = folders.next();
    try {
      f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {}
    return f;
  }
  const newFolder = parentFolder.createFolder(subFolderName);
  try {
    newFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {}
  return newFolder;
}

/**
 * Mendapatkan folder Google Drive khusus Garatika Jayakarta
 * Routing Langsung: Root -> Folder Bulan (contoh: Oktober 2026, November 2026)
 */
function getDriveFolder(bulanLaporan) {
  let rootFolder;
  if (CONFIG.DRIVE_FOLDER_ID) {
    try {
      rootFolder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
      try {
        rootFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (eShare) {}
    } catch (eId) {
      rootFolder = null;
    }
  }

  if (!rootFolder) {
    const roots = DriveApp.getFoldersByName(CONFIG.DRIVE_FOLDER_NAME);
    if (roots.hasNext()) {
      rootFolder = roots.next();
    } else {
      rootFolder = DriveApp.createFolder(CONFIG.DRIVE_FOLDER_NAME);
    }
    try {
      rootFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (eShare) {}
  }

  // Jika tidak ada bulan yang dispesifikasikan, kembalikan root
  if (!bulanLaporan) {
    return rootFolder;
  }

  // Routing langsung: buat/ambil folder bulan di dalam folder utama
  const blnName = bulanLaporan.trim();
  const subFolder = getOrCreateSubFolder(rootFolder, blnName);
  try {
    subFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (eShare) {}
  return subFolder;
}

/**
 * Membuat folder bulan secara instan ketika ketua menambahkan bulan baru di web
 */
function createFolderOnDemand(bulanLaporan) {
  try {
    const targetFolder = getDriveFolder(bulanLaporan);
    return {
      status: "success",
      message:
        "Folder bulan berhasil dibuat di Google Drive Garatika Jayakarta.",
      folderName: targetFolder.getName(),
      folderUrl: targetFolder.getUrl(),
    };
  } catch (err) {
    return {
      status: "error",
      message: "Gagal membuat folder di Google Drive: " + err.message,
    };
  }
}

/**
 * Menghapus folder bulan dari Google Drive (memindahkan ke tempat sampah Drive)
 */
function deleteFolderOnDemand(bulanLaporan) {
  try {
    if (!bulanLaporan) {
      return {
        status: "error",
        message: "Nama folder bulan tidak boleh kosong.",
      };
    }
    const rootFolder = getDriveFolder(); // Ambil root folder Garatika Jayakarta
    const blnName = bulanLaporan.trim();
    const folders = rootFolder.getFoldersByName(blnName);
    let count = 0;
    while (folders.hasNext()) {
      const f = folders.next();
      f.setTrashed(true);
      count++;
    }
    return {
      status: "success",
      message:
        count > 0
          ? "Folder '" +
            blnName +
            "' berhasil dipindahkan ke Sampah Google Drive."
          : "Folder '" + blnName + "' tidak ditemukan di Google Drive.",
      deletedCount: count,
    };
  } catch (err) {
    return {
      status: "error",
      message: "Gagal menghapus folder di Google Drive: " + err.message,
    };
  }
}

/**
 * Mengambil daftar seluruh sub-folder bulan yang ada di Google Drive (Folder Utama Garatika)
 * Mengabaikan folder yang ada di tempat sampah (isTrashed = true)
 */
function listDriveFolders() {
  try {
    const rootFolder = getDriveFolder();
    const folders = rootFolder.getFolders();
    const list = [];
    while (folders.hasNext()) {
      const f = folders.next();
      if (!f.isTrashed()) {
        const name = f.getName().trim();
        list.push({
          id: f.getId(),
          name: name,
          folder: name,
          url: f.getUrl(),
        });
      }
    }
    // Urutkan alfabetis/kronologis
    list.sort((a, b) => a.name.localeCompare(b.name));
    return {
      status: "success",
      folders: list,
    };
  } catch (err) {
    return {
      status: "error",
      message: "Gagal mengambil folder dari Google Drive: " + err.message,
      folders: [],
    };
  }
}

/**
 * Mengambil daftar seluruh berkas/file non-trashed yang ada di Google Drive (Folder Utama Garatika)
 * Mengabaikan file yang ada di tempat sampah (isTrashed = true)
 */
function listDriveFiles(bulanLaporan) {
  try {
    const rootFolder = getDriveFolder();
    const filesList = [];

    function formatFileSize(bytes) {
      if (!bytes || bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }

    if (bulanLaporan) {
      const blnFolder = getDriveFolder(bulanLaporan);
      const files = blnFolder.getFiles();
      while (files.hasNext()) {
        const file = files.next();
        if (!file.isTrashed()) {
          filesList.push({
            id: file.getId(),
            name: file.getName(),
            mimeType: file.getMimeType(),
            url: file.getUrl(),
            downloadUrl:
              "https://drive.google.com/uc?export=download&id=" + file.getId(),
            folderName: blnFolder.getName(),
            folderId: blnFolder.getId(),
            size: formatFileSize(file.getSize()),
            sizeBytes: file.getSize(),
            updated: file.getLastUpdated().toISOString(),
            created: file.getDateCreated().toISOString(),
          });
        }
      }
    } else {
      // Ambil berkas dari setiap subfolder bulan
      const subfolders = rootFolder.getFolders();
      while (subfolders.hasNext()) {
        const sub = subfolders.next();
        if (!sub.isTrashed()) {
          const folderName = sub.getName().trim();
          const files = sub.getFiles();
          while (files.hasNext()) {
            const file = files.next();
            if (!file.isTrashed()) {
              filesList.push({
                id: file.getId(),
                name: file.getName(),
                mimeType: file.getMimeType(),
                url: file.getUrl(),
                downloadUrl:
                  "https://drive.google.com/uc?export=download&id=" +
                  file.getId(),
                folderName: folderName,
                folderId: sub.getId(),
                size: formatFileSize(file.getSize()),
                sizeBytes: file.getSize(),
                updated: file.getLastUpdated().toISOString(),
                created: file.getDateCreated().toISOString(),
              });
            }
          }
        }
      }

      // Ambil juga berkas yang ada di root utama jika ada
      const rootFiles = rootFolder.getFiles();
      while (rootFiles.hasNext()) {
        const rFile = rootFiles.next();
        if (!rFile.isTrashed()) {
          filesList.push({
            id: rFile.getId(),
            name: rFile.getName(),
            mimeType: rFile.getMimeType(),
            url: rFile.getUrl(),
            downloadUrl:
              "https://drive.google.com/uc?export=download&id=" + rFile.getId(),
            folderName: "Root (Utama)",
            folderId: rootFolder.getId(),
            size: formatFileSize(rFile.getSize()),
            sizeBytes: rFile.getSize(),
            updated: rFile.getLastUpdated().toISOString(),
            created: rFile.getDateCreated().toISOString(),
          });
        }
      }
    }

    filesList.sort((a, b) => new Date(b.updated) - new Date(a.updated));

    return {
      status: "success",
      files: filesList,
      total: filesList.length,
    };
  } catch (err) {
    return {
      status: "error",
      message: "Gagal memindai berkas di Google Drive: " + err.message,
      files: [],
    };
  }
}

/**
 * Menghapus file secara spesifik dari Google Drive (pindahkan ke sampah)
 */
function deleteDriveFile(fileId) {
  try {
    if (!fileId) {
      return { status: "error", message: "ID berkas tidak boleh kosong." };
    }
    const file = DriveApp.getFileById(fileId);
    file.setTrashed(true);

    // Sinkronisasi Dua Arah: Hapus baris di Sheet LAPORAN jika ada laporan yang menggunakan berkas ini
    try {
      const ss = getSpreadsheet();
      const s = ss.getSheetByName(CONFIG.SHEET_LAPORAN);
      if (s) {
        const rows = s.getDataRange().getValues();
        for (let i = rows.length - 1; i >= 1; i--) {
          const url = String(rows[i][8] || "");
          if (url.indexOf(fileId) !== -1) {
            s.deleteRow(i + 1);
          }
        }
      }
    } catch (eSheet) {
      console.warn("Gagal menghapus baris laporan terkait dari Sheet:", eSheet);
    }

    return {
      status: "success",
      message:
        "Berkas '" +
        file.getName() +
        "' berhasil dipindahkan ke Sampah Google Drive dan data laporan terkait dihapus dari database.",
      fileId: fileId,
    };
  } catch (err) {
    return {
      status: "error",
      message: "Gagal menghapus berkas di Google Drive: " + err.message,
    };
  }
}

/**
 * Mengambil status lengkap Google Drive: Folder dan Berkas
 */
function getDriveState() {
  const foldersRes = listDriveFolders();
  const filesRes = listDriveFiles();
  return {
    status: "success",
    folders: foldersRes && foldersRes.folders ? foldersRes.folders : [],
    files: filesRes && filesRes.files ? filesRes.files : [],
  };
}

/**
 * Inisialisasi struktur sheet bila belum ada
 */
function initDatabase() {
  const ss = getSpreadsheet();

  // 1. Sheet Anggota
  let sheetAnggota = ss.getSheetByName(CONFIG.SHEET_ANGGOTA);
  if (!sheetAnggota) {
    sheetAnggota = ss.insertSheet(CONFIG.SHEET_ANGGOTA);
    sheetAnggota.appendRow([
      "ID",
      "Nama Lengkap",
      "Kelas",
      "Angkatan",
      "Status",
      "Divisi",
      "Divisi ID",
      "Waktu Diperbarui",
    ]);
    sheetAnggota
      .getRange(1, 1, 1, 8)
      .setFontWeight("bold")
      .setBackground("#fee2e2");
  }

  // 2. Sheet Divisi (Resmi sesuai website: ID, Nama Divisi, Password, Waktu Diperbarui)
  let sheetDivisi = ss.getSheetByName(CONFIG.SHEET_DIVISI);
  if (!sheetDivisi) {
    sheetDivisi = ss.insertSheet(CONFIG.SHEET_DIVISI);
    sheetDivisi.appendRow([
      "ID",
      "Nama Divisi",
      "Password",
      "Waktu Diperbarui",
    ]);
    sheetDivisi
      .getRange(1, 1, 1, 4)
      .setFontWeight("bold")
      .setBackground("#e0e7ff");
  } else {
    // Otomatis bersihkan kolom-kolom usang (Deskripsi, Kode, Icon, Tugas JSON, Urutan) jika masih ada di sheet
    const lastCol = sheetDivisi.getLastColumn();
    if (lastCol > 0) {
      const headers = sheetDivisi
        .getRange(1, 1, 1, lastCol)
        .getValues()[0]
        .map(function (h) {
          return String(h || "").trim().toLowerCase();
        });
      const hasObsolete = headers.some(function (h) {
        return ["deskripsi", "kode", "icon", "tugas json", "tugas", "urutan"].includes(h);
      });
      const hasPassword = headers.includes("password");

      if (hasObsolete || !hasPassword || lastCol !== 4) {
        const rows = sheetDivisi.getDataRange().getValues();
        const colId = headers.indexOf("id") !== -1 ? headers.indexOf("id") : 0;
        const colNama = headers.indexOf("nama divisi") !== -1 ? headers.indexOf("nama divisi") : (headers.indexOf("nama") !== -1 ? headers.indexOf("nama") : 1);
        const colPass = headers.indexOf("password");
        const colWaktu = headers.indexOf("waktu diperbarui");

        const cleanRows = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          const id = String(r[colId] || "").trim();
          if (!id) continue;
          const nama = String(r[colNama] || "").trim();
          const pass = colPass !== -1 ? String(r[colPass] || "").trim() : "";
          const waktu = colWaktu !== -1 ? String(r[colWaktu] || "").trim() : new Date().toISOString();
          cleanRows.push([id, nama, pass, waktu]);
        }

        sheetDivisi.clear();
        sheetDivisi.appendRow(["ID", "Nama Divisi", "Password", "Waktu Diperbarui"]);
        sheetDivisi
          .getRange(1, 1, 1, 4)
          .setFontWeight("bold")
          .setBackground("#e0e7ff");
        if (cleanRows.length > 0) {
          sheetDivisi.getRange(2, 1, cleanRows.length, 4).setValues(cleanRows);
        }
      }
    }
  }

  // 3. Sheet Laporan
  let sheetLaporan = ss.getSheetByName(CONFIG.SHEET_LAPORAN);
  if (!sheetLaporan) {
    sheetLaporan = ss.insertSheet(CONFIG.SHEET_LAPORAN);
    sheetLaporan.appendRow([
      "ID",
      "Tanggal",
      "Judul Laporan",
      "Pelapor",
      "Divisi ID",
      "Nama Divisi",
      "Status Review",
      "Detail JSON",
      "URL Drive",
      "Waktu Diperbarui",
    ]);
    sheetLaporan
      .getRange(1, 1, 1, 10)
      .setFontWeight("bold")
      .setBackground("#fef3c7");
  }

  // 4. Sheet Kategori Angkatan (Resmi sesuai website: ID, Nama Angkatan, Waktu Diperbarui)
  let sheetKategori = ss.getSheetByName(CONFIG.SHEET_KATEGORI);
  if (!sheetKategori) {
    sheetKategori = ss.insertSheet(CONFIG.SHEET_KATEGORI);
    sheetKategori.appendRow(["ID", "Nama Angkatan", "Waktu Diperbarui"]);
    sheetKategori
      .getRange(1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#f1f5f9");
  } else {
    // Otomatis bersihkan kolom-kolom usang (Kode, Status) jika masih ada
    const lastColKat = sheetKategori.getLastColumn();
    if (lastColKat > 0) {
      const katHeaders = sheetKategori
        .getRange(1, 1, 1, lastColKat)
        .getValues()[0]
        .map(function (h) {
          return String(h || "").trim().toLowerCase();
        });
      const hasObsoleteKat = katHeaders.some(function (h) {
        return ["kode", "status"].includes(h);
      });

      if (hasObsoleteKat || lastColKat !== 3) {
        const rowsKat = sheetKategori.getDataRange().getValues();
        const cleanKatRows = [];
        for (let k = 1; k < rowsKat.length; k++) {
          const rk = rowsKat[k];
          const idK = String(rk[0] || "").trim();
          if (!idK) continue;
          const labelK = String(rk[1] || idK).trim();
          cleanKatRows.push([idK, labelK, new Date().toISOString()]);
        }

        sheetKategori.clear();
        sheetKategori.appendRow(["ID", "Nama Angkatan", "Waktu Diperbarui"]);
        sheetKategori
          .getRange(1, 1, 1, 3)
          .setFontWeight("bold")
          .setBackground("#f1f5f9");
        if (cleanKatRows.length > 0) {
          sheetKategori.getRange(2, 1, cleanKatRows.length, 3).setValues(cleanKatRows);
        }
      }
    }
  }

  // 5. Sheet Meta
  let sheetMeta = ss.getSheetByName(CONFIG.SHEET_META);
  if (!sheetMeta) {
    sheetMeta = ss.insertSheet(CONFIG.SHEET_META);
    sheetMeta.appendRow(["Parameter", "Nilai"]);
    sheetMeta.appendRow(["Aplikasi", CONFIG.APP_TITLE]);
    sheetMeta.appendRow(["Organisasi", CONFIG.ORGANISASI]);
    sheetMeta.appendRow(["Akun", "garatika jayakarta"]);
    sheetMeta.appendRow(["Terakhir Inisialisasi", new Date().toISOString()]);
  }

  return {
    status: "success",
    message:
      "Inisialisasi Database Paskibra Garatika Jayakarta berhasil disiapkan.",
  };
}

/**
 * Mengambil SELURUH data database sekaligus untuk frontend
 */
function getAllData() {
  const ss = getSpreadsheet();
  if (!ss.getSheetByName(CONFIG.SHEET_ANGGOTA) || !ss.getSheetByName(CONFIG.SHEET_LAPORAN)) {
    initDatabase();
  }
  const anggota = getAnggotaList().data || [];
  const divisi = getDivisiList().data || [];
  const laporan = getLaporanList().data || [];
  const kategoriAngkatan = getKategoriList().data || [];

  return {
    status: "success",
    akun: "garatika jayakarta",
    timestamp: new Date().toISOString(),
    data: {
      anggota: anggota,
      divisi: divisi,
      laporan: laporan,
      kategoriAngkatan: kategoriAngkatan,
      masterSarpras: getMasterSarprasFromGAS(),
      driveFolders: [],
      driveFiles: [],
    },
  };
}

function saveMasterSarpras(items) {
  try {
    const list = Array.isArray(items) ? items : (items && items.items ? items.items : []);
    if (Array.isArray(list) && list.length > 0) {
      PropertiesService.getScriptProperties().setProperty("GARATIKA_MASTER_SARPRAS", JSON.stringify(list));
      return { status: "success", count: list.length };
    }
  } catch (e) {
    return { status: "error", message: e.toString() };
  }
  return { status: "error", message: "Invalid items" };
}

function getMasterSarprasFromGAS() {
  try {
    const raw = PropertiesService.getScriptProperties().getProperty("GARATIKA_MASTER_SARPRAS");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return null;
}

/**
 * Sinkronisasi seluruh database dari data lokal frontend ke Google Sheets
 */
function syncAllData(data) {
  initDatabase();
  const ss = getSpreadsheet();

  if (data && Array.isArray(data.masterSarpras)) {
    saveMasterSarpras(data.masterSarpras);
  }

  // 1. Sync Anggota
  if (data && Array.isArray(data.anggota)) {
    const s = ss.getSheetByName(CONFIG.SHEET_ANGGOTA);
    clearSheetData(s);
    data.anggota.forEach((a) => {
      s.appendRow([
        a.id || "",
        a.nama || "",
        a.kelas || "",
        a.angkatan || "",
        a.status || "Aktif",
        a.divisi || "Anggota",
        a.divisiId || "anggota",
        new Date().toISOString(),
      ]);
    });
  }

  // 2. Sync Divisi (Resmi: ID, Nama Divisi, Password, Waktu Diperbarui)
  if (data && Array.isArray(data.divisi)) {
    const s = ss.getSheetByName(CONFIG.SHEET_DIVISI);
    s.clear();
    s.appendRow(["ID", "Nama Divisi", "Password", "Waktu Diperbarui"]);
    s.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#e0e7ff");

    data.divisi.forEach(function (d) {
      s.appendRow([
        d.id || "",
        d.nama || "",
        d.password || "",
        new Date().toISOString(),
      ]);
    });
  }

  // 3. Sync Laporan
  if (data && Array.isArray(data.laporan)) {
    const s = ss.getSheetByName(CONFIG.SHEET_LAPORAN);
    clearSheetData(s);
    data.laporan.forEach((l) => {
      s.appendRow([
        l.id || "",
        l.tanggal || "",
        l.judul || "",
        l.pelapor || "",
        l.divisiId || "",
        l.divisiNama || "",
        l.statusReview || "Terkirim",
        JSON.stringify(l.detail || {}),
        l.driveFileUrl || "",
        new Date().toISOString(),
      ]);
    });
  }

  // 4. Sync Kategori Angkatan (Resmi: ID, Nama Angkatan, Waktu Diperbarui)
  if (data && Array.isArray(data.kategoriAngkatan)) {
    const s = ss.getSheetByName(CONFIG.SHEET_KATEGORI);
    s.clear();
    s.appendRow(["ID", "Nama Angkatan", "Waktu Diperbarui"]);
    s.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#f1f5f9");

    data.kategoriAngkatan.forEach(function (k) {
      s.appendRow([
        k.id || "",
        k.label || k.nama || "",
        new Date().toISOString(),
      ]);
    });
  }

  return {
    status: "success",
    message:
      "Seluruh data berhasil disinkronkan ke Database Google Sheets Garatika Jayakarta.",
    timestamp: new Date().toISOString(),
  };
}

function clearSheetData(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
}

// =========================================================================
// CRUD DATA LAPORAN
// =========================================================================
function getLaporanList() {
  const ss = getSpreadsheet();
  let s = ss.getSheetByName(CONFIG.SHEET_LAPORAN);
  if (!s) {
    initDatabase();
    s = ss.getSheetByName(CONFIG.SHEET_LAPORAN);
  }
  const rows = s.getDataRange().getValues();
  const list = [];
  const rowsToDelete = [];

  // Helper untuk mengekstrak Google Drive File ID dari URL
  function extractDriveFileId(url) {
    if (!url) return "";
    const mD = String(url).match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (mD && mD[1]) return mD[1];
    const mId = String(url).match(/id=([a-zA-Z0-9_-]+)/);
    if (mId && mId[1]) return mId[1];
    return "";
  }

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[0]) continue;

    const driveUrl = String(r[8] || "").trim();
    const fileId = extractDriveFileId(driveUrl);

    // Sinkronisasi Dua Arah: Jika berkas pernah diunggah ke Google Drive,
    // pastikan berkas fisik di Google Drive masih ada dan tidak di sampah.
    if (fileId) {
      let isAlive = true;
      try {
        const file = DriveApp.getFileById(fileId);
        if (!file || file.isTrashed()) {
          isAlive = false;
        }
      } catch (errDrive) {
        // Berkas sudah dihapus permanen atau tidak ditemukan di Google Drive
        isAlive = false;
      }

      // Jika berkas di Google Drive sudah dihapus/dibuang ke sampah, hapus baris dari database Sheets
      if (!isAlive) {
        rowsToDelete.push(i + 1);
        continue; // Lewati, jangan masukkan ke daftar laporan aktif
      }
    }

    let detail = {};
    try {
      detail = r[7] ? JSON.parse(r[7]) : {};
    } catch (e) {
      detail = {};
    }
    let tglVal = "";
    if (r[1] instanceof Date) {
      const y = r[1].getFullYear();
      const m = String(r[1].getMonth() + 1).padStart(2, '0');
      const d = String(r[1].getDate()).padStart(2, '0');
      tglVal = y + "-" + m + "-" + d;
    } else {
      tglVal = String(r[1] || "").trim();
    }
    list.push({
      id: String(r[0]),
      tanggal: tglVal,
      judul: String(r[2]),
      pelapor: String(r[3]),
      divisiId: String(r[4]),
      divisiNama: String(r[5]),
      statusReview: String(r[6] || "Terkirim"),
      detail: detail,
      driveFileUrl: driveUrl,
    });
  }

  // Hapus baris yang berkas Google Drive-nya sudah terhapus (dari baris paling bawah ke atas)
  if (rowsToDelete.length > 0) {
    for (let d = rowsToDelete.length - 1; d >= 0; d--) {
      try {
        s.deleteRow(rowsToDelete[d]);
      } catch (eDel) {
        console.warn("Gagal menghapus baris " + rowsToDelete[d] + " di Sheet LAPORAN:", eDel);
      }
    }
  }

  return { status: "success", data: list };
}

function saveLaporan(lap) {
  const ss = getSpreadsheet();
  let s = ss.getSheetByName(CONFIG.SHEET_LAPORAN);
  if (!s) {
    initDatabase();
    s = ss.getSheetByName(CONFIG.SHEET_LAPORAN);
  }

  const id = lap.id || "lap-" + Date.now();
  const tanggal = lap.tanggal || new Date().toISOString().split("T")[0];
  const judul = lap.judul || "Laporan Rutin";
  const pelapor = lap.pelapor || "Petugas";
  const divisiId = lap.divisiId || "umum";
  const divisiNama = lap.divisiNama || "Divisi";
  const statusReview = lap.statusReview || "Terkirim";
  const kategoriBulan = lap.kategoriBulan || lap.detail?.kategoriBulan || "";
  const detail = lap.detail || {};
  detail.kategoriBulan = kategoriBulan;

  // 1. Simpan berkas ke Google Drive (PDF Resmi)
  let fileUrl = "";
  try {
    const targetFolder = getDriveFolder(kategoriBulan) || getMainDriveFolder();
    let driveFile = null;
    let cleanDivisi = (divisiNama || "Sekretaris").trim();
    if (cleanDivisi.toLowerCase().startsWith("divisi ")) {
      cleanDivisi = cleanDivisi.substring(7).trim();
    } else if (cleanDivisi.toLowerCase() === "divisi") {
      cleanDivisi = "Sekretaris";
    }
    cleanDivisi = cleanDivisi.replace(/[\\/:*?"<>|]/g, '').trim() || "Sekretaris";
    const cleanJudul = (judul || "Laporan Rutin").replace(/[\\/:*?"<>|]/g, '').trim() || "Laporan Rutin";
    const fileName = "Laporan Divisi " + cleanDivisi + " - " + cleanJudul + ".pdf";

    // Hapus/timpa berkas lama di Google Drive jika ada (agar saat edit laporan, berkas di Drive otomatis diperbarui ke versi baru)
    const oldFileUrl = lap.driveFileUrl || lap.driveUrl || (lap.detail && (lap.detail.driveFileUrl || lap.detail.driveUrl)) || "";
    if (oldFileUrl) {
      try {
        const idMatch = String(oldFileUrl).match(/[-\w]{25,}/);
        if (idMatch && idMatch[0]) {
          DriveApp.getFileById(idMatch[0]).setTrashed(true);
        }
      } catch (eOld) {
        console.warn("Gagal memindahkan berkas lama ke sampah:", eOld);
      }
    }
    // Cek juga jika ada berkas dengan nama yang sama di folder target agar tidak terjadi file ganda
    try {
      const existingFiles = targetFolder.getFilesByName(fileName);
      while (existingFiles.hasNext()) {
        const oldF = existingFiles.next();
        oldF.setTrashed(true);
      }
    } catch (eDup) {
      console.warn("Gagal cek duplikat nama file:", eDup);
    }

    if (lap.pdfBase64 && typeof lap.pdfBase64 === "string" && lap.pdfBase64.length > 50) {
      let rawB64 = lap.pdfBase64.trim();
      const b64Marker = rawB64.indexOf(";base64,");
      if (b64Marker !== -1) {
        rawB64 = rawB64.substring(b64Marker + 8);
      } else {
        rawB64 = rawB64.replace(/^data:[^;]+;base64,/, "");
      }
      rawB64 = rawB64.trim();
      const bytes = Utilities.base64Decode(rawB64);
      const pdfBlob = Utilities.newBlob(bytes, MimeType.PDF, fileName);
      driveFile = targetFolder.createFile(pdfBlob);
      if (driveFile) {
        try {
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (eShare) {
          console.warn("Gagal setSharing driveFile:", eShare);
        }
        fileUrl = driveFile.getUrl();
      }
    } else {
      // Fallback teks jika tidak ada Base64 PDF, simpan langsung tanpa memanggil getAs(PDF) yang macet
      const isiTeks =
        "LAPORAN RESMI EKSTRAKURIKULER PASKIBRA GARATIKA SMKN 40 JAKARTA\n" +
        "=================================================================================\n" +
        "Bulan Arsip   : " + (kategoriBulan || "-") + "\n" +
        "Divisi        : " + divisiNama + "\n" +
        "Judul Laporan : " + judul + "\n" +
        "Pelapor       : " + pelapor + "\n" +
        "Tanggal       : " + tanggal + "\n" +
        "Angkatan      : " + (detail.angkatan || "-") + "\n" +
        "Status Review : " + statusReview + "\n" +
        "Waktu Upload  : " + new Date().toLocaleString("id-ID") + "\n" +
        "=================================================================================";
      const textBlob = Utilities.newBlob(isiTeks, MimeType.PLAIN_TEXT, fileName.replace(".pdf", ".txt"));
      driveFile = targetFolder.createFile(textBlob);
      if (driveFile) {
        try {
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (eShare) {
          console.warn("Gagal setSharing driveFile:", eShare);
        }
        fileUrl = driveFile.getUrl();
      }
    }
  } catch (errDrive) {
    console.warn("Gagal simpan berkas ke Google Drive:", errDrive);
    fileUrl = "";
  }

  // 2. Simpan atau perbarui baris di Sheet LAPORAN
  const rows = s.getDataRange().getValues();
  let foundRow = -1;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > 0) {
    s.getRange(foundRow, 1, 1, 10).setValues([
      [
        id,
        tanggal,
        judul,
        pelapor,
        divisiId,
        divisiNama,
        statusReview,
        JSON.stringify(detail),
        fileUrl,
        new Date().toISOString(),
      ],
    ]);
  } else {
    s.appendRow([
      id,
      tanggal,
      judul,
      pelapor,
      divisiId,
      divisiNama,
      statusReview,
      JSON.stringify(detail),
      fileUrl,
      new Date().toISOString(),
    ]);
  }

  return {
    status: "success",
    message: "Laporan berhasil dicatat ke Google Sheets & diarsipkan ke Google Drive.",
    id: id,
    driveFileUrl: fileUrl,
  };
}

function updateLaporanStatus(id, newStatus) {
  initDatabase();
  const ss = getSpreadsheet();
  const s = ss.getSheetByName(CONFIG.SHEET_LAPORAN);
  const rows = s.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      s.getRange(i + 1, 7).setValue(newStatus);
      s.getRange(i + 1, 10).setValue(new Date().toISOString());
      return {
        status: "success",
        message: "Status review diperbarui",
        id: id,
        statusReview: newStatus,
      };
    }
  }

  return {
    status: "error",
    message: "Laporan dengan ID " + id + " tidak ditemukan.",
  };
}

function deleteLaporan(param) {
  initDatabase();
  const ss = getSpreadsheet();
  const s = ss.getSheetByName(CONFIG.SHEET_LAPORAN);
  const rows = s.getDataRange().getValues();

  let targetId = typeof param === "object" ? (param.id || "") : String(param);
  let targetJudul = typeof param === "object" ? (param.judul || "") : "";
  let targetDivisi = typeof param === "object" ? (param.divisiNama || "") : "";
  let targetBulan = typeof param === "object" ? (param.kategoriBulan || "") : "";
  let targetDriveUrl = typeof param === "object" ? (param.driveUrl || param.driveFileUrl || param.fileUrl || "") : "";

  let deletedRow = false;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(targetId)) {
      if (!targetDriveUrl) targetDriveUrl = String(rows[i][8] || "");
      if (!targetJudul) targetJudul = String(rows[i][2] || "");
      if (!targetDivisi) targetDivisi = String(rows[i][5] || "");
      if (!targetBulan) {
        try {
          const det = JSON.parse(rows[i][7] || "{}");
          targetBulan = det.kategoriBulan || "";
        } catch (e) {}
      }
      s.deleteRow(i + 1);
      deletedRow = true;
      break;
    }
  }

  // 1. Hapus berkas berdasarkan driveUrl / fileId jika ada
  let fileTrashed = false;
  if (targetDriveUrl) {
    try {
      let fileId = "";
      const matchD = targetDriveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      const matchId = targetDriveUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (matchD && matchD[1]) fileId = matchD[1];
      else if (matchId && matchId[1]) fileId = matchId[1];
      if (fileId) {
        DriveApp.getFileById(fileId).setTrashed(true);
        fileTrashed = true;
      }
    } catch (eDrive) {
      console.warn("Gagal hapus berkas via fileId:", eDrive);
    }
  }

  // 2. Fallback: Cari berkas di Google Drive berdasarkan nama berkas / judul laporan jika belum terhapus
  if (!fileTrashed && targetJudul) {
    try {
      const foldersToSearch = [];
      if (targetBulan) {
        foldersToSearch.push(getDriveFolder(targetBulan));
      }
      foldersToSearch.push(getMainDriveFolder());

      foldersToSearch.forEach(folder => {
        if (!folder) return;
        const files = folder.getFiles();
        while (files.hasNext()) {
          const file = files.next();
          const fname = file.getName().toLowerCase();
          const searchJudul = targetJudul.toLowerCase();
          if (fname.includes(searchJudul) && !file.isTrashed()) {
            file.setTrashed(true);
            fileTrashed = true;
          }
        }
      });
    } catch (eSearch) {
      console.warn("Gagal pencarian fallback berkas Drive:", eSearch);
    }
  }

  return {
    status: "success",
    message: deletedRow ? "Laporan dan berkas Google Drive berhasil dihapus" : (fileTrashed ? "Berkas di Google Drive berhasil dihapus" : "Proses selesai"),
    id: targetId,
    fileTrashed: fileTrashed
  };
}

// =========================================================================
// CRUD DATA ANGGOTA
// =========================================================================
function getAnggotaList() {
  const ss = getSpreadsheet();
  let s = ss.getSheetByName(CONFIG.SHEET_ANGGOTA);
  if (!s) {
    initDatabase();
    s = ss.getSheetByName(CONFIG.SHEET_ANGGOTA);
  }
  const rows = s.getDataRange().getValues();
  const list = [];
  if (rows.length < 2) return { status: "success", data: [] };

  const headers = rows[0].map(function (h) {
    return String(h || "").trim().toLowerCase();
  });
  let colId = headers.indexOf("id");
  let colNama = headers.findIndex(function (h) { return h.indexOf("nama") !== -1; });
  let colKelas = headers.findIndex(function (h) { return h.indexOf("kelas") !== -1; });
  let colAngkatan = headers.findIndex(function (h) { return h.indexOf("angkatan") !== -1; });
  let colStatus = headers.findIndex(function (h) { return h.indexOf("status") !== -1; });
  let colDivisi = headers.findIndex(function (h) { return h.indexOf("divisi") !== -1 && h.indexOf("id") === -1; });
  let colDivisiId = headers.findIndex(function (h) { 
    return h.indexOf("divisi id") !== -1 || h.indexOf("divisi_id") !== -1 || h.indexOf("divisiid") !== -1; 
  });

  // Fallback indeks default bila sheet tidak memiliki baris header baku
  if (colNama === -1) colNama = colId === -1 ? 0 : 1;
  if (colKelas === -1) colKelas = colNama + 1;
  if (colAngkatan === -1) colAngkatan = colKelas + 1;
  if (colStatus === -1) colStatus = colAngkatan + 1;
  if (colDivisi === -1) colDivisi = colStatus + 1;

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const nama = colNama !== -1 ? String(r[colNama] || "").trim() : "";
    if (!nama) continue;

    const id = colId !== -1 && r[colId] ? String(r[colId]).trim() : "agt-" + i;
    const kelas = colKelas !== -1 ? String(r[colKelas] || "").trim() : "-";
    const angkatan = colAngkatan !== -1 ? String(r[colAngkatan] || "").trim() : "G10";
    const status = colStatus !== -1 ? String(r[colStatus] || "Aktif").trim() : "Aktif";
    let divisi = colDivisi !== -1 ? String(r[colDivisi] || "Anggota").trim() : "Anggota";
    let divisiId = colDivisiId !== -1 ? String(r[colDivisiId] || "").trim() : "";
    const divLower = (divisi + " " + divisiId).toLowerCase();

    if (divLower.indexOf("sekretar") !== -1) {
      divisi = "Divisi Sekretaris";
      divisiId = "sekretaris";
    } else if (divLower.indexOf("bendahar") !== -1) {
      divisi = "Divisi Bendahara";
      divisiId = "bendahara";
    } else if (divLower.indexOf("korlap") !== -1 || divLower.indexOf("lapangan") !== -1) {
      divisi = "Divisi Koordinator Lapangan";
      divisiId = "korlap";
    } else if (divLower.indexOf("sarpras") !== -1 || divLower.indexOf("sarana") !== -1) {
      divisi = "Divisi Sarana dan Prasarana";
      divisiId = "sarpras";
    } else if (divLower.indexOf("media") !== -1 || divLower.indexOf("kreatif") !== -1 || divLower.indexOf("pubdok") !== -1) {
      divisi = "Divisi Media Kreatif";
      divisiId = "media_kreatif";
    } else if (divLower.indexOf("pelatih") !== -1) {
      divisi = "Pelatih";
      divisiId = "pelatih";
    } else if (divLower.indexOf("ketua") !== -1) {
      divisi = "Ketua";
      divisiId = "ketua";
    } else if (divLower.indexOf("wakil") !== -1) {
      divisi = "Wakil Ketua";
      divisiId = "wakil_ketua";
    } else if (!divisiId) {
      divisiId = "anggota";
    }

    list.push({
      id: id,
      nama: nama,
      kelas: kelas,
      angkatan: angkatan,
      status: status,
      divisi: divisi,
      divisiId: divisiId,
    });
  }

  return { status: "success", data: list };
}

function saveAnggota(agt) {
  initDatabase();
  const ss = getSpreadsheet();
  const s = ss.getSheetByName(CONFIG.SHEET_ANGGOTA);

  const id = agt.id || "agt-" + Date.now();
  const rows = s.getDataRange().getValues();
  let foundRow = -1;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      foundRow = i + 1;
      break;
    }
  }

  const values = [
    id,
    agt.nama || "",
    agt.kelas || "",
    agt.angkatan || "",
    agt.status || "Aktif",
    agt.divisi || "Anggota",
    agt.divisiId || "anggota",
    new Date().toISOString(),
  ];

  if (foundRow > 0) {
    s.getRange(foundRow, 1, 1, 8).setValues([values]);
  } else {
    s.appendRow(values);
  }

  return {
    status: "success",
    message: "Data anggota berhasil disimpan",
    id: id,
  };
}

function deleteAnggota(id) {
  initDatabase();
  const ss = getSpreadsheet();
  const s = ss.getSheetByName(CONFIG.SHEET_ANGGOTA);
  const rows = s.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      s.deleteRow(i + 1);
      return { status: "success", message: "Anggota berhasil dihapus", id: id };
    }
  }

  return { status: "error", message: "Anggota tidak ditemukan." };
}

// =========================================================================
// CRUD DATA DIVISI (Resmi sesuai Website: ID, Nama Divisi, Password)
// =========================================================================
function getDivisiList() {
  const ss = getSpreadsheet();
  let s = ss.getSheetByName(CONFIG.SHEET_DIVISI);
  if (!s) {
    initDatabase();
    s = ss.getSheetByName(CONFIG.SHEET_DIVISI);
  }
  const rows = s.getDataRange().getValues();
  const list = [];
  const seenNames = {};

  if (rows.length <= 1) return { status: "success", data: [] };

  const headers = rows[0].map(function (h) {
    return String(h || "").trim().toLowerCase();
  });
  const colId = headers.indexOf("id") !== -1 ? headers.indexOf("id") : 0;
  const colNama = headers.indexOf("nama divisi") !== -1 ? headers.indexOf("nama divisi") : (headers.indexOf("nama") !== -1 ? headers.indexOf("nama") : 1);
  const colPass = headers.indexOf("password") !== -1 ? headers.indexOf("password") : 2;

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const idVal = String(r[colId] || "").trim();
    if (!idVal) continue;

    const rawNama = String(r[colNama] || "").trim();
    const cleanNama = rawNama.toLowerCase();
    if (!cleanNama) continue;
    if (seenNames[cleanNama]) continue;
    seenNames[cleanNama] = true;

    const passVal = String(r[colPass] || "").trim();

    list.push({
      id: idVal,
      nama: rawNama,
      password: passVal,
    });
  }

  return { status: "success", data: list };
}

function saveDivisi(div) {
  initDatabase();
  const ss = getSpreadsheet();
  const s = ss.getSheetByName(CONFIG.SHEET_DIVISI);

  const id = div.id || "div-" + Date.now();
  const namaInput = String(div.nama || "").trim().toLowerCase();
  const rows = s.getDataRange().getValues();

  let foundRow = -1;
  for (let i = 1; i < rows.length; i++) {
    const rowId = String(rows[i][0] || "").trim();
    const rowNama = String(rows[i][1] || "").trim().toLowerCase();
    if (rowId === String(id) || (namaInput && rowNama === namaInput)) {
      foundRow = i + 1;
      break;
    }
  }

  let existingPass = "";
  if (foundRow > 0) {
    existingPass = String(rows[foundRow - 1][2] || "").trim();
  }

  const passwordToSave = (div.password !== undefined && div.password !== null && String(div.password).trim() !== "")
    ? String(div.password).trim()
    : existingPass;

  const rowValues = [
    id,
    div.nama || "",
    passwordToSave,
    new Date().toISOString(),
  ];

  if (foundRow > 0) {
    s.getRange(foundRow, 1, 1, 4).setValues([rowValues]);
  } else {
    s.appendRow(rowValues);
  }

  return {
    status: "success",
    message: "Data divisi berhasil disimpan",
    id: id,
  };
}

function deleteDivisi(id) {
  initDatabase();
  const ss = getSpreadsheet();
  const s = ss.getSheetByName(CONFIG.SHEET_DIVISI);
  const rows = s.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      s.deleteRow(i + 1);
      return { status: "success", message: "Divisi berhasil dihapus", id: id };
    }
  }

  return { status: "error", message: "Divisi tidak ditemukan." };
}

// =========================================================================
// KATEGORI ANGKATAN (Resmi sesuai Website: ID, Nama Angkatan)
// =========================================================================
function getKategoriList() {
  const ss = getSpreadsheet();
  let s = ss.getSheetByName(CONFIG.SHEET_KATEGORI);
  if (!s) {
    initDatabase();
    s = ss.getSheetByName(CONFIG.SHEET_KATEGORI);
  }
  const rows = s.getDataRange().getValues();
  const list = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[0]) continue;
    const label = String(r[1] || r[0]).trim();
    list.push({
      id: String(r[0]).trim(),
      label: label,
      nama: label,
    });
  }

  return { status: "success", data: list };
}

function saveKategoriAngkatan(kat) {
  initDatabase();
  const ss = getSpreadsheet();
  const s = ss.getSheetByName(CONFIG.SHEET_KATEGORI);

  const id = kat.id || ("G" + Date.now());
  const label = kat.label || kat.nama || id;
  const rows = s.getDataRange().getValues();
  let foundRow = -1;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).toLowerCase() === String(id).toLowerCase() ||
        String(rows[i][1]).toLowerCase() === String(label).toLowerCase()) {
      foundRow = i + 1;
      break;
    }
  }

  const values = [
    id,
    label,
    new Date().toISOString(),
  ];

  if (foundRow > 0) {
    s.getRange(foundRow, 1, 1, 3).setValues([values]);
  } else {
    s.appendRow(values);
  }

  return {
    status: "success",
    message: "Kategori angkatan berhasil disimpan",
    id: id,
    label: label,
  };
}

function deleteKategoriAngkatan(id) {
  initDatabase();
  const ss = getSpreadsheet();
  const s = ss.getSheetByName(CONFIG.SHEET_KATEGORI);
  const rows = s.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id) || String(rows[i][1]) === String(id)) {
      s.deleteRow(i + 1);
      return { status: "success", message: "Kategori angkatan berhasil dihapus", id: id };
    }
  }

  return { status: "error", message: "Kategori angkatan tidak ditemukan." };
}

/**
 * Mengatur semua folder dan berkas laporan di Google Drive menjadi Publik (Pelihat)
 * Agar semua anggota/user dapat melihat dan mengunduh berkas tanpa perlu minta akses.
 */
function makeAllDriveFilesPublic() {
  try {
    const root = getDriveFolder();
    if (!root) return { status: "error", message: "Folder root Google Drive tidak ditemukan" };
    try { root.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}

    let countFiles = 0;
    let countFolders = 0;

    // Set sharing untuk semua file di folder utama
    const rootFiles = root.getFiles();
    while (rootFiles.hasNext()) {
      const f = rootFiles.next();
      try {
        f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        countFiles++;
      } catch (e) {}
    }

    // Set sharing untuk semua subfolder dan file di dalamnya
    const subFolders = root.getFolders();
    while (subFolders.hasNext()) {
      const sf = subFolders.next();
      try {
        sf.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        countFolders++;
      } catch (e) {}
      const sfFiles = sf.getFiles();
      while (sfFiles.hasNext()) {
        const sff = sfFiles.next();
        try {
          sff.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          countFiles++;
        } catch (e) {}
      }
    }

    return {
      status: "success",
      message: `Akses Google Drive berhasil disetel ke Publik. (${countFolders} folder, ${countFiles} berkas dapat dilihat oleh siapa saja dengan link tanpa minta akses).`,
      countFiles: countFiles,
      countFolders: countFolders
    };
  } catch (err) {
    return { status: "error", message: "Gagal mengatur izin berkas: " + err.message };
  }
}
