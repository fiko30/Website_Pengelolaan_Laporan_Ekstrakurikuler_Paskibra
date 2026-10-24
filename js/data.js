/**
 * DATA DEFAULT SISTEM INFORMASI PASKIBRA GARATIKA SMKN 40 JAKARTA
 * Angkatan: G9, G10, G11, G12, dst.
 */

const DEFAULT_DIVISI = [
  {
    id: "pelatih",
    nama: "Pelatih",
    kategori: "pimpinan",
    password: "PelatihGaratika40",
    bisaBuatLaporan: false
  },
  {
    id: "ketua",
    nama: "Ketua",
    kategori: "pimpinan",
    password: "Ketua Ekstrakurikuler Paskibra SMK Negeri 40 Jakarta",
    bisaBuatLaporan: false
  },
  {
    id: "wakil_ketua",
    nama: "Wakil Ketua",
    kategori: "pimpinan",
    password: "WakilGaratika40",
    bisaBuatLaporan: false
  },
  {
    id: "sekretaris",
    nama: "Divisi Sekretaris",
    kategori: "divisi",
    password: "Sekretaris Ekstrakurikuler Paskibra SMK Negeri 40 Jakarta",
    bisaBuatLaporan: true
  },
  {
    id: "bendahara",
    nama: "Divisi Bendahara",
    kategori: "divisi",
    password: "BendaharaGaratika40",
    bisaBuatLaporan: true
  },
  {
    id: "korlap",
    nama: "Divisi Koordinator Lapangan",
    kategori: "divisi",
    password: "KorlapGaratika40",
    bisaBuatLaporan: true
  },
  {
    id: "sarpras",
    nama: "Divisi Sarana dan Prasarana",
    kategori: "divisi",
    password: "SarprasGaratika40",
    bisaBuatLaporan: true
  },
  {
    id: "media_kreatif",
    nama: "Divisi Media Kreatif",
    kategori: "divisi",
    password: "MedkrafGaratika40",
    bisaBuatLaporan: true
  }
];

const DEFAULT_KATEGORI_ANGKATAN = [
  { id: "Pelatih", label: "Pelatih" },
  { id: "G9", label: "G9" },
  { id: "G10", label: "G10" },
  { id: "G11", label: "G11" }
];

const DEFAULT_KATEGORI_BULAN = [
  {
    id: "2026-10",
    label: "Oktober 2026",
    folder: "Oktober 2026",
    driveFolderId: "1Hd-En7FO1BCN0HzzGvKQ-KUXm3uvbRPT",
    url: "https://drive.google.com/drive/folders/1Hd-En7FO1BCN0HzzGvKQ-KUXm3uvbRPT"
  }
];

const DEFAULT_ANGGOTA = [
  {
    "id": "agt-1",
    "nama": "Kak Dimas Prasetyo, S.Pd",
    "nis": "PEMBINA-01",
    "kelas": "-",
    "angkatan": "Pelatih",
    "divisi": "Pelatih",
    "divisiId": "pelatih",
    "kontak": "081298765432",
    "status": "Aktif"
  },
  {
    "id": "agt-2",
    "nama": "Fiko Naufal Nur Rohman",
    "nis": "20241001",
    "kelas": "XI - RPL",
    "angkatan": "G10",
    "divisi": "Ketua",
    "divisiId": "ketua",
    "kontak": "085811223344",
    "status": "Aktif"
  },
  {
    "id": "agt-3",
    "nama": "Akhsan Zain Saifuddin",
    "nis": "20241001",
    "kelas": "XI - DKV 1",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-4",
    "nama": "Alifah Annisa Rahman",
    "nis": "20241002",
    "kelas": "XI - MP",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-5",
    "nama": "Alvina Julia Irfany",
    "nis": "20241003",
    "kelas": "XI - AK",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-6",
    "nama": "Amalia Putri",
    "nis": "20241004",
    "kelas": "XI - AK",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-7",
    "nama": "Anggun Amelia",
    "nis": "20241005",
    "kelas": "XI - BR",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-8",
    "nama": "Annisa Dwi Yulistiani",
    "nis": "20241006",
    "kelas": "XI - DKV 2",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-9",
    "nama": "April Riana",
    "nis": "20241007",
    "kelas": "XI - MP",
    "angkatan": "G10",
    "divisi": "Divisi Sekretaris",
    "divisiId": "sekretaris",
    "jabatan": "Sekretaris",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-10",
    "nama": "Eistry Zahwa Aqila",
    "nis": "20241008",
    "kelas": "XI - DKV 1",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-11",
    "nama": "Gladis Amanda Putri",
    "nis": "20241009",
    "kelas": "XI - DKV 2",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-12",
    "nama": "Mifta Aulia",
    "nis": "20241010",
    "kelas": "XI - DKV 2",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-13",
    "nama": "Muhammad Salman Diyaaz",
    "nis": "20241011",
    "kelas": "XI - BR",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-14",
    "nama": "Nadya Rheva Aulia Putri",
    "nis": "20241012",
    "kelas": "XI - MP",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-15",
    "nama": "Nur Khansa Maulida",
    "nis": "20241013",
    "kelas": "XI - MP",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-16",
    "nama": "Nurul Assyifa",
    "nis": "20241014",
    "kelas": "XI - DKV 2",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-17",
    "nama": "Ratna Ayu Lestari",
    "nis": "20241015",
    "kelas": "XI - AK",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-18",
    "nama": "Ratu Veranda",
    "nis": "20241016",
    "kelas": "XI - DKV 1",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-19",
    "nama": "Rayya Oktaviana",
    "nis": "20241017",
    "kelas": "XI - MP",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-20",
    "nama": "Rianti Aryanda Vai",
    "nis": "20241018",
    "kelas": "XI - DKV 1",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-21",
    "nama": "Ridho Afrel Setiawan",
    "nis": "20241019",
    "kelas": "XI - DKV 2",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-22",
    "nama": "Safira Azizah",
    "nis": "20241020",
    "kelas": "XI - DKV 2",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-23",
    "nama": "Sherly Ramadhani",
    "nis": "20241021",
    "kelas": "XI - AK",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-24",
    "nama": "Zihan Amelia Handani",
    "nis": "20241022",
    "kelas": "XI - DKV 1",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-25",
    "nama": "Zubair Muhammad Yamani",
    "nis": "20241023",
    "kelas": "XI - DKV 2",
    "angkatan": "G10",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-26",
    "nama": "Afifa Regina Putri",
    "nis": "20251024",
    "kelas": "X - BR",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-27",
    "nama": "Amirah Fitria",
    "nis": "20251025",
    "kelas": "X - DKV 1",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-28",
    "nama": "Andi Fachri Nasir",
    "nis": "20251026",
    "kelas": "X - MP",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-29",
    "nama": "Anisa Pitri Yani",
    "nis": "20251027",
    "kelas": "X - AK",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-30",
    "nama": "Assabiqunal Arimireshwari",
    "nis": "20251028",
    "kelas": "X - DKV 1",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-31",
    "nama": "Ayudya Haningtyas Prameswari",
    "nis": "20251029",
    "kelas": "X - DKV 2",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-32",
    "nama": "Dea Aqilah Marsella",
    "nis": "20251030",
    "kelas": "X - DKV 1",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-33",
    "nama": "Fakhri Fathurrahman",
    "nis": "20251031",
    "kelas": "X - MP",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-34",
    "nama": "Farah Auralia Putri",
    "nis": "20251032",
    "kelas": "X - DKV 2",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-35",
    "nama": "Filza Safa Wongsorejo",
    "nis": "20251033",
    "kelas": "X - RPL",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-36",
    "nama": "Firyaal Labibah",
    "nis": "20251034",
    "kelas": "X - MP",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-37",
    "nama": "Fitriyani",
    "nis": "20251035",
    "kelas": "X - BR",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-38",
    "nama": "Gestiara Ferfira",
    "nis": "20251036",
    "kelas": "X - MP",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-39",
    "nama": "Haruno Syahira Hakim",
    "nis": "20251037",
    "kelas": "X - DKV 1",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-40",
    "nama": "Keyla Febriana",
    "nis": "20251038",
    "kelas": "X - BR",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-41",
    "nama": "Lutfi Hibatul 'Azies",
    "nis": "20251039",
    "kelas": "X - MP",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-42",
    "nama": "Mavi Marhamah",
    "nis": "20251040",
    "kelas": "X - DKV 1",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-43",
    "nama": "Nandiva Qurrata'aini Dzulhujjah",
    "nis": "20251041",
    "kelas": "X - DKV 1",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-44",
    "nama": "Qotrunnada Cantika",
    "nis": "20251042",
    "kelas": "X - AK",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-45",
    "nama": "Raditya Ramadhan",
    "nis": "20251043",
    "kelas": "X - RPL",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-46",
    "nama": "Ratu Nirmala Dewi",
    "nis": "20251044",
    "kelas": "X - DKV 2",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-47",
    "nama": "Rayyan Fahreza Rafaf",
    "nis": "20251045",
    "kelas": "X - RPL",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-48",
    "nama": "Salwa Zhillal",
    "nis": "20251046",
    "kelas": "X - AK",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-49",
    "nama": "Shaffa Safitriani",
    "nis": "20251047",
    "kelas": "X - DKV 2",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-50",
    "nama": "Siti Humairah",
    "nis": "20251048",
    "kelas": "X - DKV 2",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-51",
    "nama": "Sunni Marom",
    "nis": "20251049",
    "kelas": "X - DKV 2",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  },
  {
    "id": "agt-52",
    "nama": "Zaskia Nuraliza",
    "nis": "20251050",
    "kelas": "X - AK",
    "angkatan": "G11",
    "divisi": "Anggota",
    "divisiId": "anggota",
    "kontak": "",
    "status": "Aktif"
  }
];

const DEFAULT_LAPORAN = [];

const GARATIKA_OFFICIAL_MEMBERS = [
  // Angkatan G10 (Kelas XI)
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
  { name: "Rianti Aryanda Vai", class: "XI DKV 1", generation: "G10" },
  { name: "Ridho Afrel Setiawan", class: "XI DKV 2", generation: "G10" },
  { name: "Safira Azizah", class: "XI DKV 2", generation: "G10" },
  { name: "Sherly Ramadhani", class: "XI AKL", generation: "G10" },
  { name: "Zihan Amelia Handani", class: "XI DKV 1", generation: "G10" },
  { name: "Zubair Muhammad Yamani", class: "XI DKV 2", generation: "G10" },
  // Angkatan G11 (Kelas X)
  { name: "Afifa Regina Putri", class: "X BR", generation: "G11" },
  { name: "Amirah Fitria", class: "X DKV 1", generation: "G11" },
  { name: "Andi Fachri Nasir", class: "X MP", generation: "G11" },
  { name: "Anisa Pitri Yani", class: "X AKL", generation: "G11" },
  { name: "Assabiqunal Arimireshwari", class: "X DKV 1", generation: "G11" },
  { name: "Ayudya Haningtyas Prameswari", class: "X DKV 2", generation: "G11" },
  { name: "Dea Aqilah Marsella", class: "X DKV 1", generation: "G11" },
  { name: "Fakhri Fathurrahman", class: "X MP", generation: "G11" },
  { name: "Farah Auralia Putri", class: "X DKV 2", generation: "G11" },
  { name: "Filza Safa Wongsorejo", class: "X RPL", generation: "G11" },
  { name: "Firyaal Labibah", class: "X MP", generation: "G11" },
  { name: "Fitriyani", class: "X BR", generation: "G11" },
  { name: "Gestiara Ferfira", class: "X MP", generation: "G11" },
  { name: "Haruno Syahira Hakim", class: "X DKV 1", generation: "G11" },
  { name: "Keyla Febriana", class: "X BR", generation: "G11" },
  { name: "Lutfi Hibatul 'Azies", class: "X MP", generation: "G11" },
  { name: "Mavi Marhamah", class: "X DKV 1", generation: "G11" },
  { name: "Nandiva Qurrata'aini Dzulhujjah", class: "X DKV 1", generation: "G11" },
  { name: "Qotrunnada Cantika", class: "X AKL", generation: "G11" },
  { name: "Raditya Ramadhan", class: "X RPL", generation: "G11" },
  { name: "Ratu Nirmala Dewi", class: "X DKV 2", generation: "G11" },
  { name: "Rayyan Fahreza Rafaf", class: "X RPL", generation: "G11" },
  { name: "Salwa Zhillal", class: "X AKL", generation: "G11" },
  { name: "Shaffa Safitriani", class: "X DKV 2", generation: "G11" },
  { name: "Siti Humairah", class: "X DKV 2", generation: "G11" },
  { name: "Sunni Marom", class: "X DKV 2", generation: "G11" },
  { name: "Zaskia Nuraliza", class: "X AKL", generation: "G11" }
];

const SARPRAS_INVENTORY_ITEMS = [
  "Slayer",
  "Slempang",
  "Garuda",
  "Kopel",
  "Sarung Tangan",
  "Sepatu Pantofel Cewe",
  "Sepatu Pantofel Tali Cowo",
  "Sepatu Pantofel Laki-Laki",
  "Peci Cewe Cowo",
  "Baju PDU Cewe",
  "Rok PDU Cewe",
  "Celana PDU Cowo",
  "Bendera",
  "Taplak Bendera",
  "Talikur",
  "Belt Putih",
  "Peci Perempuan",
  "Peci Laki-Laki",
  "Evolet"
];

if (typeof window !== "undefined") {
  window.GARATIKA_OFFICIAL_MEMBERS = GARATIKA_OFFICIAL_MEMBERS;
  window.DEFAULT_KATEGORI_BULAN = DEFAULT_KATEGORI_BULAN;
  window.SARPRAS_INVENTORY_ITEMS = SARPRAS_INVENTORY_ITEMS;
}

