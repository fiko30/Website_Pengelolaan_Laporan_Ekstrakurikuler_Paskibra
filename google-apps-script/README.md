# Panduan Menghubungkan Google Apps Script (Akun: Garatika Jayakarta)

Panduan ini digunakan untuk menghubungkan sistem website ke Database Cloud Google Sheets dan Google Drive menggunakan akun Google **Garatika Jayakarta**.

---

## Langkah 1: Buat Google Spreadsheet di Akun Garatika Jayakarta
1. Buka browser dan pastikan Anda login dengan akun Google **Garatika Jayakarta**.
2. Buat spreadsheet baru melalui link: [sheets.new](https://sheets.new).
3. Beri nama file Spreadsheet, misalnya:
   `Database Paskibra Garatika Jayakarta`

---

## Langkah 2: Pasang Kode Apps Script
1. Pada menu Google Spreadsheet tersebut, klik **Ekstensi** (*Extensions*) &rarr; **Apps Script**.
2. Hapus semua baris kode yang ada di editor.
3. Salin seluruh isi berkas [`google-apps-script/Code.gs`](file:///d:/website%20Laporan%20Paskibra/google-apps-script/Code.gs) dan tempelkan ke editor Apps Script.
4. Klik tombol **Simpan (Save)** (ikon disket) atau tekan `Ctrl + S`.
5. Beri nama proyek, misalnya: `Backend Garatika Jayakarta`.

---

## Langkah 3: Deploy sebagai Web App (Aplikasi Web)
1. Di pojok kanan atas, klik tombol biru **Deploy** &rarr; **Penerapan baru** (*New deployment*).
2. Klik ikon gerigi di sebelah kiri (*Select type*) &rarr; pilih **Aplikasi web** (*Web app*).
3. Isi konfigurasi form:
   - **Deskripsi**: `Produksi Database Garatika Jayakarta`
   - **Jalankan sebagai** (*Execute as*): `Saya (akun Garatika Jayakarta)`
   - **Siapa yang memiliki akses** (*Who has access*): **`Siapa saja` (*Anyone*)** &larr; *(Sangat penting agar website dapat membaca dan menyimpan data)*
4. Klik tombol **Deploy** (*Terapkan*).
5. Klik **Izinkan akses** (*Authorize access*) jika muncul jendela izin:
   - Pilih akun Garatika Jayakarta.
   - Klik **Advanced** (Lanjutan).
   - Klik **Go to Backend Garatika Jayakarta (unsafe)**.
   - Klik **Allow** (Izinkan).
6. Salin **URL Aplikasi Web** yang berakhiran `/exec`, contoh:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

---

## Langkah 4: Hubungkan ke Website
1. Buka website Sistem Informasi Paskibra Garatika.
2. Masuk ke menu **Database & Drive** pada sidebar.
3. Tempelkan URL yang sudah disalin ke dalam kolom **URL Web App Google Apps Script**.
4. Klik tombol **Simpan & Hubungkan**.
5. Klik tombol **Tes Koneksi** untuk memastikan status berubah menjadi hijau (Terhubung).
6. Klik **Kirim / Sinkronkan Semua Data ke Cloud** untuk mengunggah seluruh data awal anggota, divisi, dan laporan ke spreadsheet.

Setelah itu, seluruh data akan tersimpan di cloud Google Sheets akun Garatika Jayakarta secara otomatis setiap kali ada penambahan, pengeditan, atau penghapusan data!
