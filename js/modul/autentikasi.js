/**
 * =========================================================================
 * MODUL 3: AUTENTIKASI & PENGELOLA LOGIN (autentikasi.js)
 * SISTEM INFORMASI & LAPORAN PASKIBRA GARATIKA SMKN 40 JAKARTA
 * =========================================================================
 */

// Kredensial Resmi Ketua
window.KREDENSIAL_KETUA = {
  nama: "Fiko Naufal Nur Rohman",
  password: "Ketua Ekstrakurikuler Paskibra SMK Negeri 40 Jakarta",
  jabatan: "Ketua Umum",
  role: "ketua",
  angkatan: "G10",
  kelas: "XII RPL 1",
  divisiId: "ketua",
  canManagePasswords: true,
  bisaBuatLaporan: false
};
var KREDENSIAL_KETUA = window.KREDENSIAL_KETUA;

// Helper global penentu hak akses pimpinan (Pelatih, Ketua, Wakil)
function isUserPimpinan(user = state.currentUser) {
  if (!user) return false;
  if (user.canManagePasswords === true) return true;
  
  const role = String(user.role || "").toLowerCase();
  const jabatan = String(user.jabatan || "").toLowerCase();
  const divisi = String(user.divisi || "").toLowerCase();
  const divisiId = String(user.divisiId || "").toLowerCase();
  const angkatan = String(user.angkatan || "").toLowerCase();
  
  if (role === "ketua" || role === "pelatih" || role === "wakil_ketua" || role === "pimpinan") return true;
  if (divisiId === "ketua" || divisiId === "pelatih" || divisiId === "wakil_ketua") return true;
  if (jabatan.includes("ketua") || jabatan.includes("pelatih") || jabatan.includes("wakil")) return true;
  if (divisi.includes("ketua") || divisi.includes("pelatih") || divisi.includes("wakil")) return true;
  if (angkatan.includes("pelatih")) return true;
  
  return false;
}
window.isUserPimpinan = isUserPimpinan;

// Helper global penentu hak akses Wakil Ketua & Pelatih
// Aturan resmi: Wakil Ketua dan Pelatih TIDAK BISA membuat, mengedit, mempublikasikan, dan menghapus laporan (HANYA BISA MELIHAT)
function isWakilAtauPelatih(user = state.currentUser) {
  if (!user) return false;
  const role = String(user.role || "").toLowerCase();
  const jabatan = String(user.jabatan || "").toLowerCase();
  const divisi = String(user.divisi || "").toLowerCase();
  const divisiId = String(user.divisiId || "").toLowerCase();
  const angkatan = String(user.angkatan || "").toLowerCase();

  const isPelatih = (
    role === "pelatih" ||
    divisiId === "pelatih" ||
    jabatan.includes("pelatih") ||
    divisi.includes("pelatih") ||
    angkatan.includes("pelatih")
  );

  const isWakil = (
    role === "wakil_ketua" ||
    divisiId === "wakil_ketua" ||
    jabatan.includes("wakil") ||
    divisi.includes("wakil")
  );

  return isPelatih || isWakil;
}
window.isWakilAtauPelatih = isWakilAtauPelatih;

/* ==========================================================================
   1. AUTHENTICATION & LOGIN MANAGEMENT
   ========================================================================== */
function checkAuthSession() {
  const savedUser = localStorage.getItem("garatika_auth_user");
  const authScreen = document.getElementById("authScreen");
  const appScreen = document.getElementById("appScreen");

  // Pastikan KREDENSIAL_KETUA selalu sinkron dengan password terkini
  if (typeof getDivisiPassword === 'function') {
    const ketuaPass = getDivisiPassword('ketua');
    if (ketuaPass && typeof KREDENSIAL_KETUA !== 'undefined') {
      KREDENSIAL_KETUA.password = ketuaPass;
    }
  }

  if (savedUser) {
    try {
      state.currentUser = JSON.parse(savedUser);
      if (state.currentUser && (state.currentUser.divisiId === "anggota" || !state.currentUser.divisiId)) {
        if (typeof normalizeUserDivisionId === 'function') {
          state.currentUser.divisiId = normalizeUserDivisionId(state.currentUser);
        }
      }
      // Selalu perbarui flag canManagePasswords agar akun Fiko / Ketua / Wakil / Pelatih otomatis terotorisasi
      state.currentUser.canManagePasswords = isUserPimpinan(state.currentUser);
      state.currentUser.isReadOnlyLaporan = isWakilAtauPelatih(state.currentUser);
      localStorage.setItem("garatika_auth_user", JSON.stringify(state.currentUser));
      showAppScreen();
    } catch (e) {
      showAuthScreen();
    }
  } else {
    showAuthScreen();
  }
}

function showAuthScreen() {
  const authScreen = document.getElementById("authScreen");
  const appScreen = document.getElementById("appScreen");
  const btnToggle = document.getElementById("btnToggleSidebar");
  
  document.body.classList.remove("user-logged-in");
  document.body.classList.add("user-not-logged-in");

  if (authScreen) authScreen.classList.add("active");
  if (appScreen) appScreen.classList.remove("active");
  if (btnToggle) {
    btnToggle.style.setProperty("display", "none", "important");
  }

  // Reset status input password & ikon mata
  const passInput = document.getElementById("loginPassword");
  const eyeIcon = document.getElementById("eyeIcon");
  const btnPassToggle = document.getElementById("btnTogglePassword");
  if (passInput) {
    passInput.type = "password";
    passInput.setAttribute("type", "password");
  }
  if (eyeIcon) {
    eyeIcon.className = "fa-solid fa-eye-slash";
  }
  if (btnPassToggle) {
    btnPassToggle.setAttribute("title", "Lihat kata sandi");
  }
}

function showAppScreen() {
  const authScreen = document.getElementById("authScreen");
  const appScreen = document.getElementById("appScreen");
  const btnToggle = document.getElementById("btnToggleSidebar");
  
  document.body.classList.remove("user-not-logged-in");
  document.body.classList.add("user-logged-in");

  if (authScreen) authScreen.classList.remove("active");
  if (appScreen) appScreen.classList.add("active");
  if (btnToggle) {
    btnToggle.style.removeProperty("display");
  }

  updateUserHeaderDisplay();
  if (typeof applyRoleBasedNavigation === 'function') {
    applyRoleBasedNavigation();
  }
  renderAll();

  // Arahkan tab awal sesuai role pengguna: Pimpinan ke Dashboard, Divisi langsung ke Formulir Laporan
  const isPimpinan = typeof isUserPimpinan === 'function' ? isUserPimpinan(state.currentUser) : false;
  if (isPimpinan) {
    if (typeof switchTab === 'function') switchTab("tab-dashboard");
  } else {
    if (typeof switchTab === 'function') switchTab("tab-buat-laporan");
  }
}

function updateUserHeaderDisplay() {
  const userText = document.getElementById("currentLoggedUserText");
  const userRole = document.getElementById("currentLoggedUserRole");
  if (state.currentUser) {
    if (userText) userText.textContent = state.currentUser.nama;
    if (userRole) userRole.textContent = state.currentUser.jabatan;
  }
}

// Fitur Hide and Show Password
function toggleLoginPassword(e) {
  if (e) {
    if (typeof e.preventDefault === "function") e.preventDefault();
    if (typeof e.stopPropagation === "function") e.stopPropagation();
  }
  const passInput = document.getElementById("loginPassword");
  const eyeIcon = document.getElementById("eyeIcon");
  const btnToggle = document.getElementById("btnTogglePassword");

  if (!passInput) return;

  const isPassword = passInput.type === "password" || passInput.getAttribute("type") === "password";
  if (isPassword) {
    passInput.type = "text";
    passInput.setAttribute("type", "text");
    if (eyeIcon) {
      eyeIcon.className = "fa-solid fa-eye";
    }
    if (btnToggle) {
      btnToggle.setAttribute("title", "Sembunyikan kata sandi");
    }
  } else {
    passInput.type = "password";
    passInput.setAttribute("type", "password");
    if (eyeIcon) {
      eyeIcon.className = "fa-solid fa-eye-slash";
    }
    if (btnToggle) {
      btnToggle.setAttribute("title", "Lihat kata sandi");
    }
  }
}

function initPasswordToggle() {
  const btnToggle = document.getElementById("btnTogglePassword");
  if (!btnToggle) return;
  btnToggle.onclick = toggleLoginPassword;
}


/* ==========================================================================
   PERINGATAN INLINE KECIL DI ATAS KOLOM INPUT LOGIN
   ========================================================================== */
function showLoginAlert(pesan, targetInputId = "") {
  const alertBox = document.getElementById("loginAlertBox");
  const alertMsg = document.getElementById("loginAlertMsg");
  const inputNama = document.getElementById("loginNama");
  const inputPass = document.getElementById("loginPassword");

  inputNama?.classList?.remove("input-error");
  inputPass?.classList?.remove("input-error");

  if (targetInputId) {
    const target = document.getElementById(targetInputId);
    if (target) {
      target.classList?.add("input-error");
      target.focus?.();
    }
  }

  if (alertBox && alertMsg) {
    alertMsg.textContent = pesan;
    alertBox.style.display = "flex";
  }
}

function clearLoginAlert() {
  const alertBox = document.getElementById("loginAlertBox");
  const inputNama = document.getElementById("loginNama");
  const inputPass = document.getElementById("loginPassword");

  if (alertBox) {
    alertBox.style.display = "none";
  }
  inputNama?.classList?.remove("input-error");
  inputPass?.classList?.remove("input-error");
}

async function handleLogin(e) {
  e.preventDefault();
  const inputNamaElem = document.getElementById("loginNama");
  const inputPassElem = document.getElementById("loginPassword");
  const btnSubmit = document.getElementById("btnLoginSubmit") || document.querySelector("#formLogin button[type='submit']");

  const inputNama = inputNamaElem ? inputNamaElem.value.trim() : "";
  const inputPass = inputPassElem ? inputPassElem.value : "";

  // 1. Cek jika nama belum diisi
  if (!inputNama) {
    showLoginAlert("Silakan Masukkan Nama Lengkap.", "loginNama");
    return;
  }

  // 2. Cek jika password belum diisi
  if (!inputPass) {
    showLoginAlert("Silakan Masukkan Kata Sandi.", "loginPassword");
    return;
  }

  const originalBtnHtml = btnSubmit ? btnSubmit.innerHTML : "";
  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memeriksa Database...`;
  }

  try {
    // 3. Tarik data live langsung dari Database Cloud (Google Sheets via Apps Script)
    if (state.gasWebhookUrl) {
      try {
        const fetchUrl = state.gasWebhookUrl + (state.gasWebhookUrl.includes('?') ? '&' : '?') + `action=getAll&t=${Date.now()}`;
        const controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        const timeoutId = controller ? setTimeout(() => controller.abort(), 8000) : null;
        const fetchOptions = { method: "GET", redirect: "follow" };
        if (controller) fetchOptions.signal = controller.signal;
        const resp = await fetch(fetchUrl, fetchOptions);
        if (timeoutId) clearTimeout(timeoutId);

        if (resp.ok) {
          const resJson = await resp.json();
          if (resJson && resJson.status === "success" && resJson.data) {
            if (Array.isArray(resJson.data.anggota) && resJson.data.anggota.length > 0) {
              if (typeof normalizeAnggotaObject === "function") {
                resJson.data.anggota.forEach(a => normalizeAnggotaObject(a));
              }
              state.anggota = resJson.data.anggota;
              localStorage.setItem("garatika_anggota", JSON.stringify(state.anggota));
            }
            if (Array.isArray(resJson.data.divisi) && resJson.data.divisi.length > 0) {
              state.divisi = resJson.data.divisi;
              localStorage.setItem("garatika_divisi", JSON.stringify(state.divisi));
            }
            if (Array.isArray(resJson.data.laporan)) {
              state.laporan = resJson.data.laporan;
              localStorage.setItem("garatika_laporan", JSON.stringify(state.laporan));
            }
          }
        }
      } catch (errSync) {
        console.warn("Koneksi live database timeout/offline, menggunakan data lokal:", errSync);
      }
    }

    const divisionList = Array.isArray(state.divisi) ? state.divisi : [];
    const inputNamaTrim = inputNama.trim();
    const inputLower = inputNamaTrim.toLowerCase();

    // 4. Cari user di data anggota database
    let user = (Array.isArray(state.anggota) ? state.anggota : []).find(a => 
      (a.nama || "").trim().toLowerCase() === inputLower
    );

    // Jika belum ditemukan di state.anggota, coba cari di DEFAULT_ANGGOTA
    if (!user && typeof DEFAULT_ANGGOTA !== 'undefined' && Array.isArray(DEFAULT_ANGGOTA)) {
      const defFound = DEFAULT_ANGGOTA.find(a => (a.nama || "").trim().toLowerCase() === inputLower);
      if (defFound) {
        user = { ...defFound };
        if (Array.isArray(state.anggota)) {
          state.anggota.push(user);
          localStorage.setItem("garatika_anggota", JSON.stringify(state.anggota));
        }
      }
    }

    // Jika yang diinput adalah Akun Resmi / Nama Divisi (misal "Divisi Sekretaris", "Sekretaris", dsb.)
    if (!user) {
      const matchedDiv = divisionList.find(d => {
        const dName = (d.nama || "").trim().toLowerCase();
        const dId = (d.id || "").trim().toLowerCase();
        const cleanName = dName.replace(/^divisi\s+/i, '').trim();
        return dName === inputLower ||
          cleanName === inputLower ||
          `${dName} garatika` === inputLower ||
          `${cleanName} garatika` === inputLower ||
          `${dId} garatika` === inputLower ||
          dId === inputLower;
      });

      if (matchedDiv) {
        user = {
          id: "usr-" + matchedDiv.id,
          nama: matchedDiv.nama + " Garatika",
          jabatan: matchedDiv.nama,
          divisi: matchedDiv.nama,
          divisiId: matchedDiv.id,
          angkatan: "-",
          kelas: "-"
        };
      }
    }

    if (!user) {
      showLoginAlert(`User Bernama "${inputNama}" Tidak Terdaftar di Database.`, "loginNama");
      return;
    }

    // 5. Normalisasi & Tentukan Divisi Pengurus
    if (typeof normalizeAnggotaObject === "function") {
      normalizeAnggotaObject(user);
    }

    const userDiv = (user.divisi || "").trim().toLowerCase();
    const userDivId = (user.divisiId || "").trim().toLowerCase();
    const userJabatan = (user.jabatan || "").trim().toLowerCase();
    const userAngkatan = (user.angkatan || "").trim().toLowerCase();

    const isPelatih = (userAngkatan.includes("pelatih") || userDiv.includes("pelatih") || userDivId === "pelatih" || userJabatan.includes("pelatih") || inputLower === "pelatih");
    const isKetua = (userDivId === "ketua" || userDiv === "ketua" || userJabatan.includes("ketua umum") || (userJabatan.includes("ketua") && !userJabatan.includes("wakil")) || inputLower === "ketua" || inputLower === "ketua garatika");
    const isWakil = (userDivId === "wakil_ketua" || userDiv.includes("wakil") || userJabatan.includes("wakil") || inputLower === "wakil ketua");

    // Cari divisi resmi yang ditempati user di daftar divisi database
    let divisionObj = divisionList.find(d => {
      const dId = (d.id || "").trim().toLowerCase();
      const dNama = (d.nama || "").trim().toLowerCase();
      const cleanNama = dNama.replace(/^divisi\s+/i, '').trim();
      if (dId && (dId === userDivId || dId === userDiv)) return true;
      if (dNama && (dNama === userDiv || cleanNama === userDiv)) return true;
      if (dId !== "anggota" && dId !== "pelatih" && dId !== "ketua" && dId !== "wakil_ketua") {
        if (cleanNama && (userDiv.includes(cleanNama) || userJabatan.includes(cleanNama))) return true;
        if (dId === "sekretaris" && (userDiv.includes("sekretar") || userJabatan.includes("sekretar"))) return true;
        if (dId === "bendahara" && (userDiv.includes("bendahar") || userJabatan.includes("bendahar"))) return true;
        if (dId === "korlap" && (userDiv.includes("korlap") || userDiv.includes("lapangan") || userJabatan.includes("korlap"))) return true;
        if (dId === "sarpras" && (userDiv.includes("sarpras") || userDiv.includes("sarana") || userJabatan.includes("sarpras"))) return true;
        if (dId === "media_kreatif" && (userDiv.includes("media") || userDiv.includes("kreatif") || userJabatan.includes("media") || userJabatan.includes("kreatif"))) return true;
      }
      return false;
    });

    if (divisionObj) {
      user.divisi = divisionObj.nama;
      user.divisiId = divisionObj.id;
      if (!user.jabatan || user.jabatan === "-" || user.jabatan === "Anggota") {
        user.jabatan = divisionObj.nama.replace(/^Divisi\s+/i, '').trim();
      }
    }

    const isDivisi = Boolean(divisionObj && user.divisi !== "Anggota" && user.divisi !== "-" && user.divisi !== "");

    if (!isPelatih && !isKetua && !isWakil && !isDivisi) {
      showLoginAlert(`Akun "${user.nama}" tidak memiliki hak akses login (Hanya untuk Pelatih & Pengurus Divisi).`, "loginNama");
      return;
    }

    // 6. Ambil Kata Sandi Resmi dari Database Divisi Tempat Pengurus Bertugas
    let expectedPassword = "";

    if (isPelatih) {
      const divPelatih = divisionList.find(d => d.id === 'pelatih' || (d.nama || "").toLowerCase() === 'pelatih');
      expectedPassword = (typeof getDivisiPassword === 'function') 
        ? getDivisiPassword(divPelatih || 'pelatih') 
        : (divPelatih?.password || "PelatihGaratika40");
    } else if (isKetua) {
      const divKetua = divisionList.find(d => d.id === 'ketua' || (d.nama || "").toLowerCase() === 'ketua');
      expectedPassword = (typeof getDivisiPassword === 'function') 
        ? getDivisiPassword(divKetua || 'ketua') 
        : (divKetua?.password || (typeof KREDENSIAL_KETUA !== 'undefined' ? KREDENSIAL_KETUA.password : ""));
    } else if (isWakil) {
      const divWakil = divisionList.find(d => d.id === 'wakil_ketua' || (d.nama || "").toLowerCase().includes('wakil'));
      expectedPassword = (typeof getDivisiPassword === 'function') 
        ? getDivisiPassword(divWakil || 'wakil_ketua') 
        : (divWakil?.password || "WakilGaratika40");
    } else if (isDivisi && divisionObj) {
      // Password pengurus diambil langsung dari password divisi yang ada di database
      expectedPassword = (typeof getDivisiPassword === 'function') 
        ? getDivisiPassword(divisionObj) 
        : (divisionObj.password || "");
    }

    // 7. Validasi kesesuaian password input dengan password divisi
    const inputPassTrim = inputPass.trim();
    let passwordMatched = Boolean(expectedPassword && inputPassTrim === expectedPassword.trim());

    // Toleransi variasi format resmi bawaan divisi jika password belum diganti
    if (!passwordMatched && isDivisi && divisionObj) {
      const rawPass = (divisionObj.password || "").trim();
      const cleanNamaDiv = divisionObj.nama.replace(/^Divisi\s+/i, '').trim();
      const formatResmi = `${cleanNamaDiv} Ekstrakurikuler Paskibra SMK Negeri 40 Jakarta`;
      const formatGaratika = `${cleanNamaDiv}Garatika40`;
      const formatIdGaratika = `${divisionObj.id}Garatika40`;

      if (inputPassTrim === rawPass || inputPassTrim === formatResmi || inputPassTrim === formatGaratika || inputPassTrim === formatIdGaratika || inputPassTrim.startsWith(formatResmi.slice(0, 30))) {
        passwordMatched = true;
        if (typeof saveCustomPassword === 'function') {
          saveCustomPassword(divisionObj.id, inputPassTrim);
          saveCustomPassword(divisionObj.nama, inputPassTrim);
          divisionObj.password = inputPassTrim;
        }
      }
    }

    if (!passwordMatched) {
      showLoginAlert("Password Salah, Silahkan Coba Lagi.", "loginPassword");
      return;
    }

    // Bersihkan alert error jika valid
    clearLoginAlert();

    // 8. Login Berhasil: Tetapkan sesi currentUser
    const canManagePasswords = (isPelatih || isKetua || isWakil);
    const role = isPelatih ? "pelatih" : isKetua ? "ketua" : isWakil ? "wakil_ketua" : "divisi";
    const jabatan = isPelatih ? "Pelatih" : isKetua ? "Ketua Umum" : isWakil ? "Wakil Ketua" : user.jabatan || user.divisi;

    const resolvedDivisiId = divisionObj ? divisionObj.id : (user.divisiId && user.divisiId !== "anggota" ? user.divisiId : "sekretaris");

    state.currentUser = {
      id: user.id,
      nama: user.nama,
      jabatan: jabatan,
      role: role,
      angkatan: user.angkatan,
      kelas: user.kelas,
      divisi: user.divisi,
      divisiId: resolvedDivisiId,
      canManagePasswords: canManagePasswords,
      bisaBuatLaporan: !isPelatih && !isKetua && !isWakil,
      isReadOnlyLaporan: (isPelatih || isWakil)
    };

    localStorage.setItem("garatika_auth_user", JSON.stringify(state.currentUser));

    // Pastikan data pengurus tersinkron di state.anggota dan localStorage
    if (Array.isArray(state.anggota)) {
      const idx = state.anggota.findIndex(a => (a.nama || "").trim().toLowerCase() === (user.nama || "").trim().toLowerCase());
      if (idx !== -1) {
        state.anggota[idx] = { ...state.anggota[idx], ...user };
      } else {
        state.anggota.push(user);
      }
      localStorage.setItem("garatika_anggota", JSON.stringify(state.anggota));
    }

    showAppScreen();

    if (typeof showSmallToast === 'function') {
      showSmallToast({
        icon: 'success',
        title: `Selamat Datang ${state.currentUser.nama || ''}`.trim(),
        text: ''
      });
    }
  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = originalBtnHtml;
    }
  }
}


function handleLogout() {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Keluar Sistem',
      text: 'Apakah Anda yakin ingin keluar?',
      icon: 'question',
      width: '320px',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      scrollbarPadding: false,
      heightAuto: false,
      customClass: { popup: 'swal-compact-popup' }
    }).then((result) => {
      if (result.isConfirmed) {
        state.currentUser = null;
        localStorage.removeItem("garatika_auth_user");
        showAuthScreen();
      }
    });
  } else {
    if (confirm("Apakah Anda ingin keluar dari sistem?")) {
      state.currentUser = null;
      localStorage.removeItem("garatika_auth_user");
      showAuthScreen();
    }
  }
}


// Window Exports
window.checkAuthSession = checkAuthSession;
window.showAuthScreen = showAuthScreen;
window.showAppScreen = showAppScreen;
window.updateUserHeaderDisplay = updateUserHeaderDisplay;
window.initPasswordToggle = initPasswordToggle;
window.toggleLoginPassword = toggleLoginPassword;
window.showLoginAlert = showLoginAlert;
window.clearLoginAlert = clearLoginAlert;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
