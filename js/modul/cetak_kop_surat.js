/**
 * =========================================================================
 * MODUL 9: FORMAT KOP SURAT RESMI & CETAK PDF (cetak_kop_surat.js)
 * SISTEM INFORMASI & LAPORAN PASKIBRA GARATIKA SMKN 40 JAKARTA
 * =========================================================================
 */

/* ==========================================================================
   10. FORMAT KOP SURAT RESMI GARATIKA (PRINT VIEW)
   ========================================================================== */
function pratinjauKopSurat(id) {
  const lap = state.laporan.find(l => l.id === id);
  if (!lap) return;

  const contentBox = document.getElementById("isiLembarLaporan");
  const ttdKotaTanggal = document.getElementById("kopTtdKotaTanggal");
  const ttdNamaPelapor = document.getElementById("kopTtdNamaPelapor");
  const ttdDivisiPelapor = document.getElementById("kopTtdDivisiPelapor");

  ttdKotaTanggal.textContent = `Jakarta, ${formatTanggalLengkap(lap.tanggal)}`;
  ttdNamaPelapor.textContent = lap.pelapor;
  ttdDivisiPelapor.textContent = lap.divisiNama;

  let rincianHTML = "";

  if (lap.divisiId === "sekretaris" || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("sekretar"))) {
    const angk = (lap.detail?.angkatan || "").toUpperCase();
    const absList = Array.isArray(lap.detail?.absensi) ? lap.detail.absensi : [];
    let absG10 = (lap.detail?.absensiG10 && lap.detail.absensiG10.length > 0) ? lap.detail.absensiG10 : [];
    let absG11 = (lap.detail?.absensiG11 && lap.detail.absensiG11.length > 0) ? lap.detail.absensiG11 : [];
    if (absG10.length === 0 && absG11.length === 0 && absList.length > 0) {
      if (angk === "G11" || absList.some(a => (a.kelas || '').includes('X') && !(a.kelas || '').includes('XI'))) {
        absG11 = absList;
      } else {
        absG10 = absList;
      }
    }
    const allAbs = [...absG10.map(a => ({ ...a, gen: 'G10' })), ...absG11.map(a => ({ ...a, gen: 'G11' }))];
    const displayAbs = allAbs.length > 0 ? allAbs : absList.map(a => ({ ...a, gen: angk || 'Garatika' }));

    const totalHadir = lap.detail?.totalHadir !== undefined ? lap.detail.totalHadir : displayAbs.filter(a => a.status === 'Hadir').length;
    const totalIzin = lap.detail?.totalIzin !== undefined ? lap.detail.totalIzin : displayAbs.filter(a => a.status === 'Izin').length;
    const totalAlfa = lap.detail?.totalAlfa !== undefined ? lap.detail.totalAlfa : (lap.detail?.totalAlpa !== undefined ? lap.detail.totalAlpa : displayAbs.filter(a => a.status === 'Alfa' || a.status === 'Alpa').length);
    const totalSemua = lap.detail?.totalSemua || displayAbs.length || (totalHadir + totalIzin + totalAlfa);
    const persenHadir = totalSemua > 0 ? Math.round((totalHadir / totalSemua) * 100) : 0;

    const rekap = (lap.detail?.rekapAngkatan && lap.detail.rekapAngkatan.length > 0)
      ? lap.detail.rekapAngkatan
      : (angk ? [{ angkatan: angk, hadir: totalHadir, izin: totalIzin, alfa: totalAlfa, total: totalSemua }] : []);

    rincianHTML = `
      <div class="kop-detail-box">
        <strong>1. Agenda Kegiatan / Pertemuan Latihan:</strong>
        <p style="margin: 4px 0 10px 0; font-size: 10pt;">${escapeHTML(lap.detail?.agenda || '-')}</p>

        <strong>2. Rekapitulasi Presensi Kehadiran ${angk ? `Angkatan ${escapeHTML(angk)}` : 'per Angkatan'}:</strong>
        <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 9.5pt;" border="1">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 5px; text-align: center;">Angkatan</th>
              <th style="padding: 5px; text-align: center;">Hadir</th>
              <th style="padding: 5px; text-align: center;">Izin</th>
              <th style="padding: 5px; text-align: center;">Alfa</th>
              <th style="padding: 5px; text-align: center;">Total Siswa</th>
            </tr>
          </thead>
          <tbody>
            ${rekap.map(r => {
              const subTotal = r.total || (r.hadir + (r.izin || 0) + (r.alfa || r.alpa || 0)) || 0;
              return `
                <tr style="text-align: center;">
                  <td style="padding: 5px; font-weight: bold;">${r.angkatan}</td>
                  <td style="padding: 5px; color: #166534; font-weight: 600;">${r.hadir || 0}</td>
                  <td style="padding: 5px; color: #854d0e;">${r.izin || 0}</td>
                  <td style="padding: 5px; color: #991b1b; font-weight: 600;">${r.alfa !== undefined ? r.alfa : (r.alpa || 0)}</td>
                  <td style="padding: 5px; font-weight: bold;">${subTotal}</td>
                </tr>
              `;
            }).join("")}
            <tr style="text-align: center; font-weight: bold; background: #fafafa;">
              <td style="padding: 5px;">TOTAL KESELURUHAN</td>
              <td style="padding: 5px; color: #166534;">${totalHadir}</td>
              <td style="padding: 5px; color: #854d0e;">${totalIzin}</td>
              <td style="padding: 5px; color: #991b1b;">${totalAlfa}</td>
              <td style="padding: 5px;">${totalSemua}</td>
            </tr>
          </tbody>
        </table>

        ${allAbs.length > 0 ? `
          <div style="margin-top: 12px;">
            <strong>3. Catatan Ketidakhadiran (Izin & Alfa):</strong>
            <ul style="margin: 4px 0 8px 18px; font-size: 9pt;">
              ${allAbs.filter(a => a.status !== "Hadir").length > 0 ?
                allAbs.filter(a => a.status !== "Hadir").map(a => `
                  <li><strong>${escapeHTML(a.nama)}</strong> (${a.gen} - ${escapeHTML(a.kelas)}): <span style="font-weight: 600; text-decoration: underline;">${a.status}</span> ${a.keterangan ? ` - <em>"${escapeHTML(a.keterangan)}"</em>` : ''}</li>
                `).join("") : '<li>Seluruh anggota hadir lengkap (Nihil ketidakhadiran).</li>'
              }
            </ul>
          </div>
        ` : ''}

        ${absG10.length > 0 || absG11.length > 0 ? `
          <div style="margin-top: 12px;">
            <strong>${allAbs.length > 0 ? '4' : '3'}. Lampiran Daftar Hadir Peserta Latihan:</strong>
            ${absG10.length > 0 ? `
              <div style="margin: 6px 0 4px 0; font-size: 8.5pt; font-weight: 700; color: #334155;">Daftar Anggota G10 (Kelas XI):</div>
              <table style="width: 100%; border-collapse: collapse; font-size: 8pt; margin-bottom: 8px;" border="1">
                <thead>
                  <tr style="background: #f8fafc;">
                    <th style="width: 25px; padding: 3px; text-align: center;">No</th>
                    <th style="padding: 3px; text-align: left;">Nama Siswa</th>
                    <th style="width: 80px; padding: 3px; text-align: center;">Kelas</th>
                    <th style="width: 60px; padding: 3px; text-align: center;">Status</th>
                    <th style="padding: 3px; text-align: left;">Keterangan Izin</th>
                  </tr>
                </thead>
                <tbody>
                  ${absG10.map((a, idx) => `
                    <tr>
                      <td style="text-align: center; padding: 3px;">${idx + 1}</td>
                      <td style="padding: 3px;">${escapeHTML(a.nama)}</td>
                      <td style="text-align: center; padding: 3px;">${escapeHTML(a.kelas || '-')}</td>
                      <td style="text-align: center; padding: 3px; font-weight: 600; color: ${a.status === 'Hadir' ? '#166534' : (a.status === 'Izin' ? '#854d0e' : '#991b1b')};">${a.status}</td>
                      <td style="padding: 3px;">${escapeHTML(a.keterangan || '-')}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            ` : ''}

            ${absG11.length > 0 ? `
              <div style="margin: 6px 0 4px 0; font-size: 8.5pt; font-weight: 700; color: #334155;">Daftar Anggota G11 (Kelas X):</div>
              <table style="width: 100%; border-collapse: collapse; font-size: 8pt; margin-bottom: 8px;" border="1">
                <thead>
                  <tr style="background: #f8fafc;">
                    <th style="width: 25px; padding: 3px; text-align: center;">No</th>
                    <th style="padding: 3px; text-align: left;">Nama Siswa</th>
                    <th style="width: 80px; padding: 3px; text-align: center;">Kelas</th>
                    <th style="width: 60px; padding: 3px; text-align: center;">Status</th>
                    <th style="padding: 3px; text-align: left;">Keterangan Izin</th>
                  </tr>
                </thead>
                <tbody>
                  ${absG11.map((a, idx) => `
                    <tr>
                      <td style="text-align: center; padding: 3px;">${idx + 1}</td>
                      <td style="padding: 3px;">${escapeHTML(a.nama)}</td>
                      <td style="text-align: center; padding: 3px;">${escapeHTML(a.kelas || '-')}</td>
                      <td style="text-align: center; padding: 3px; font-weight: 600; color: ${a.status === 'Hadir' ? '#166534' : (a.status === 'Izin' ? '#854d0e' : '#991b1b')};">${a.status}</td>
                      <td style="padding: 3px;">${escapeHTML(a.keterangan || '-')}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            ` : ''}
          </div>
        ` : ''}

        <div style="margin-top: 10px;">
          <strong>${(absG10.length > 0 || absG11.length > 0) ? '5' : (allAbs.length > 0 ? '4' : '3')}. Notulensi & Hasil Keputusan Rapat / Latihan:</strong>
          <p style="margin: 4px 0; font-size: 9.5pt; line-height: 1.4;">${escapeHTML(lap.detail?.notulensi || '-')}</p>
        </div>

        ${lap.detail?.surat ? `
          <div style="margin-top: 8px;">
            <strong>${(absG10.length > 0 || absG11.length > 0) ? '6' : (allAbs.length > 0 ? '5' : '4')}. Surat Terkait:</strong> ${escapeHTML(lap.detail.surat)}
          </div>
        ` : ''}
      </div>
    `;
  } else if (lap.divisiId === "bendahara") {
    const kasG10 = lap.detail?.kasG10 || [];
    const kasG11 = lap.detail?.kasG11 || [];
    const pemasukanTambahan = lap.detail?.pemasukanTambahan || [];
    const pengeluaran = lap.detail?.pengeluaran || [];

    const totalBayarG10 = kasG10.filter(k => k.bayar === "Bayar").length;
    const totalBayarG11 = kasG11.filter(k => k.bayar === "Bayar").length;

    rincianHTML = `
      <div class="kop-detail-box">
        <p><strong>1. Periode Pembukuan:</strong> ${escapeHTML(lap.detail?.periode || '-')}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 9.5pt;" border="1">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 4px; text-align: left;">Pos Kas / Sumber Keuangan</th>
              <th style="padding: 4px; text-align: center; width: 140px;">Keterangan</th>
              <th style="padding: 4px; text-align: right; width: 140px;">Nominal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 4px;">Uang Kas G10 (Kelas XI)</td>
              <td style="padding: 4px; text-align: center;">${totalBayarG10} Anak Membayar</td>
              <td style="padding: 4px; text-align: right;">${formatRupiah(totalBayarG10 * 2000)}</td>
            </tr>
            <tr>
              <td style="padding: 4px;">Uang Kas G11 (Kelas X)</td>
              <td style="padding: 4px; text-align: center;">${totalBayarG11} Anak Membayar</td>
              <td style="padding: 4px; text-align: right;">${formatRupiah(totalBayarG11 * 2000)}</td>
            </tr>
            ${pemasukanTambahan.map(p => `
              <tr>
                <td style="padding: 4px;">Pemasukan: ${escapeHTML(p.sumber)}</td>
                <td style="padding: 4px; text-align: center;">Metode: ${p.metode}</td>
                <td style="padding: 4px; text-align: right;">${formatRupiah(p.nominal)}</td>
              </tr>
            `).join("")}
            <tr style="font-weight: bold; background: #f0fdf4;">
              <td style="padding: 4px;" colspan="2">TOTAL PENERIMAAN KAS (Cash: ${formatRupiah(lap.detail?.totalCash || 0)} | QRIS: ${formatRupiah(lap.detail?.totalQris || 0)})</td>
              <td style="padding: 4px; text-align: right; color: #16a34a;">${formatRupiah(lap.detail?.totalPemasukan || 0)}</td>
            </tr>
            ${pengeluaran.map(k => `
              <tr>
                <td style="padding: 4px;">Pengeluaran: ${escapeHTML(k.rincian)}</td>
                <td style="padding: 4px; text-align: center;">${escapeHTML(k.keterangan || '-')}</td>
                <td style="padding: 4px; text-align: right; color: #dc2626;">- ${formatRupiah(k.nominal)}</td>
              </tr>
            `).join("")}
            <tr style="font-weight: bold; background: #fef2f2;">
              <td style="padding: 4px;" colspan="2">TOTAL PENGELUARAN</td>
              <td style="padding: 4px; text-align: right; color: #dc2626;">- ${formatRupiah(lap.detail?.totalPengeluaran || 0)}</td>
            </tr>
            <tr style="font-weight: bold; background: #f1f5f9; font-size: 10pt;">
              <td style="padding: 6px;" colspan="2">SALDO BERSIH TERSISA</td>
              <td style="padding: 6px; text-align: right; color: ${(lap.detail?.saldoAkhir || 0) >= 0 ? '#16a34a' : '#dc2626'};">${formatRupiah(lap.detail?.saldoAkhir || 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  } else if (lap.divisiId === "korlap") {
    const listMateri = lap.detail?.rowsMateri || [];
    rincianHTML = `
      <div class="kop-detail-box">
        <p><strong>1. Jenis Kegiatan:</strong> ${escapeHTML(lap.detail?.jenisKegiatan || '-')}</p>
        <p><strong>2. Kondisi Lapangan & Cuaca:</strong> ${escapeHTML(lap.detail?.kondisiLapangan || '-')}</p>
        
        <div style="margin-top: 8px;">
          <strong>3. Daftar Materi Latihan PBB & Formasi:</strong>
          <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 9.5pt;" border="1">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 4px; width: 40px; text-align: center;">No</th>
                <th style="padding: 4px; width: 140px;">Tanggal</th>
                <th style="padding: 4px; width: 90px; text-align: center;">Minggu Ke-</th>
                <th style="padding: 4px; text-align: left;">Nama Materi Latihan</th>
              </tr>
            </thead>
            <tbody>
              ${listMateri.length > 0 ? listMateri.map((m, idx) => `
                <tr>
                  <td style="padding: 4px; text-align: center;">${idx + 1}</td>
                  <td style="padding: 4px;">${escapeHTML(m.tanggal)}</td>
                  <td style="padding: 4px; text-align: center;">${m.minggu}</td>
                  <td style="padding: 4px;">${escapeHTML(m.materi)}</td>
                </tr>
              `).join("") : `
                <tr><td colspan="4" style="padding: 6px; text-align: center;">${escapeHTML(lap.detail?.materiLatihan || '-')}</td></tr>
              `}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 8px;">
          <strong>4. Catatan Kedisiplinan & Pelanggaran:</strong>
          <p style="margin: 4px 0;">${escapeHTML(lap.detail?.pelanggaran || 'Tertib dan lengkap.')}</p>
        </div>
        <div style="margin-top: 8px;">
          <strong>5. Hasil Evaluasi & Tindak Lanjut:</strong>
          <p style="margin: 4px 0;">${escapeHTML(lap.detail?.evaluasi || '-')}</p>
        </div>
      </div>
    `;
  } else if (lap.divisiId === "sarpras") {
    const inventaris = lap.detail?.inventaris || [];
    rincianHTML = `
      <div class="kop-detail-box">
        <strong>1. Inventaris & Kondisi 19 Atribut Resmi Paskibra:</strong>
        <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 9pt;" border="1">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 4px; width: 35px; text-align: center;">No</th>
              <th style="padding: 4px; text-align: left;">Nama Barang</th>
              <th style="padding: 4px; width: 80px; text-align: center;">Layak</th>
              <th style="padding: 4px; width: 90px; text-align: center;">Tidak Layak</th>
              <th style="padding: 4px; width: 70px; text-align: center;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${inventaris.length > 0 ? inventaris.map((b, idx) => `
              <tr>
                <td style="padding: 4px; text-align: center;">${idx + 1}</td>
                <td style="padding: 4px;">${escapeHTML(b.barang)}</td>
                <td style="padding: 4px; text-align: center; color: #166534; font-weight: 600;">${b.layak}</td>
                <td style="padding: 4px; text-align: center; color: #dc2626; font-weight: 600;">${b.tidakLayak}</td>
                <td style="padding: 4px; text-align: center; font-weight: bold;">${b.total}</td>
              </tr>
            `).join("") : (lap.detail?.kondisiBarang || []).map((b, idx) => `
              <tr>
                <td style="padding: 4px; text-align: center;">${idx + 1}</td>
                <td style="padding: 4px;">${escapeHTML(b.barang)}</td>
                <td colspan="3" style="padding: 4px; text-align: center;">${escapeHTML(b.kondisi)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        
        <div style="margin-top: 10px;">
          <strong>2. Tindakan Perawatan & Log Peminjaman:</strong>
          <p style="margin: 4px 0;">${escapeHTML(lap.detail?.tindakan || '-')}</p>
        </div>
        ${lap.detail?.usulan ? `
          <div style="margin-top: 6px;">
            <strong>3. Usulan Pengadaan Alat Baru:</strong>
            <p style="margin: 4px 0;">${escapeHTML(lap.detail.usulan)}</p>
          </div>
        ` : ''}
      </div>
    `;
  } else if (
    lap.divisiId === "media_kreatif" ||
    (lap.divisiNama && (
      lap.divisiNama.toLowerCase().includes("media") ||
      lap.divisiNama.toLowerCase().includes("kreatif") ||
      lap.divisiNama.toLowerCase().includes("pubdok")
    )) ||
    (lap.detail && (
      (Array.isArray(lap.detail.kontenList) && lap.detail.kontenList.length > 0) ||
      lap.detail.judulKonten
    ))
  ) {
    const listKonten = lap.detail?.kontenList || [];
    rincianHTML = `
      <div class="kop-detail-box">
        <div style="margin-top: 4px;">
          <strong>Metrik Insight & Kinerja Konten:</strong>
          <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 8pt;" border="1">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 4px; width: 28px;">No</th>
                <th style="padding: 4px; width: 85px;">Waktu</th>
                <th style="padding: 4px; width: 70px;">Platform</th>
                <th style="padding: 4px; width: 70px;">Tipe</th>
                <th style="padding: 4px; text-align: left;">Nama Konten</th>
                <th style="padding: 4px; width: 60px;">Jangkauan</th>
                <th style="padding: 4px; width: 40px;">Like</th>
                <th style="padding: 4px; width: 40px;">Komen</th>
                <th style="padding: 4px; width: 40px;">Share</th>
                <th style="padding: 4px; width: 40px;">Repost</th>
                <th style="padding: 4px; width: 40px;">Save</th>
                <th style="padding: 4px; width: 55px;">Kunjungan</th>
                <th style="padding: 4px; width: 55px;">Followers</th>
              </tr>
            </thead>
            <tbody>
              ${listKonten.length > 0 ? listKonten.map((k, idx) => {
                const isChat = (k.tipe === "Chat" || k.platform === "WhatsApp");
                const isTikTok = (k.platform === "TikTok" && !isChat);
                return `
                <tr style="text-align: center;">
                  <td style="padding: 4px;">${idx + 1}</td>
                  <td style="padding: 4px; white-space: nowrap;">${escapeHTML(k.waktu || '-')}</td>
                  <td style="padding: 4px; font-weight: 600;">${escapeHTML(k.platform || 'Instagram')}</td>
                  <td style="padding: 4px;">${escapeHTML(k.tipe || '-')}</td>
                  <td style="padding: 4px; text-align: left; font-weight: 600;">${escapeHTML(k.nama || '-')}</td>
                  <td style="padding: 4px; font-weight: bold;">${(isChat || isTikTok) ? '-' : (k.jangkau || 0)}</td>
                  <td style="padding: 4px; color: ${isChat ? '#94a3b8' : '#dc2626'};">${isChat ? '-' : (k.like || 0)}</td>
                  <td style="padding: 4px;">${isChat ? '-' : (k.komen || 0)}</td>
                  <td style="padding: 4px;">${isChat ? '-' : (k.share || 0)}</td>
                  <td style="padding: 4px;">${isChat ? '-' : (k.repost || 0)}</td>
                  <td style="padding: 4px;">${isChat ? '-' : (k.save || 0)}</td>
                  <td style="padding: 4px; font-weight: 600; color: #2563eb;">${isChat ? '-' : (k.kunjungan || 0)}</td>
                  <td style="padding: 4px; font-weight: 600; color: #059669;">${isChat ? '-' : (k.followers || 0)}</td>
                </tr>
              `;}).join("") : `
                <tr><td colspan="13" style="padding: 8px; text-align: center; color: #94a3b8;">${escapeHTML(lap.detail?.judulKonten || 'Tidak ada data postingan konten.')}</td></tr>
              `}
            </tbody>
          </table>
        </div>

        ${lap.detail?.linkKonten && lap.detail.linkKonten !== '-' ? `<p style="margin-top: 8px;"><strong>Link Postingan:</strong> ${escapeHTML(lap.detail.linkKonten)}</p>` : ''}
        ${lap.detail?.linkDriveMateri && lap.detail.linkDriveMateri !== '-' ? `<p><strong>Link Master File RAW:</strong> ${escapeHTML(lap.detail.linkDriveMateri)}</p>` : ''}
        ${lap.detail?.catatan && lap.detail.catatan !== '-' ? `
        <div style="margin-top: 6px;">
          <strong>Catatan Tambahan:</strong>
          <p style="margin: 4px 0;">${escapeHTML(lap.detail.catatan)}</p>
        </div>` : ''}
      </div>
    `;
  }

  contentBox.innerHTML = `
    <div class="kop-judul-laporan">
      LAPORAN PERTANGGUNGJAWABAN KEGIATAN ${lap.divisiNama.toUpperCase()}
    </div>
    
    <table class="kop-meta-table">
      <tr>
        <td style="width: 140px;"><strong>Nomor Laporan</strong></td>
        <td style="width: 10px;">:</td>
        <td>${lap.id}/GARATIKA/SMKN40/${new Date(lap.tanggal).getFullYear()}</td>
      </tr>
      <tr>
        <td><strong>Nama Kegiatan</strong></td>
        <td>:</td>
        <td>${escapeHTML(lap.judul)}</td>
      </tr>
      <tr>
        <td><strong>Tanggal</strong></td>
        <td>:</td>
        <td>${formatTanggalLengkap(lap.tanggal)}</td>
      </tr>
      <tr>
        <td><strong>Divisi</strong></td>
        <td>:</td>
        <td>${escapeHTML(lap.divisiNama)}</td>
      </tr>
      <tr>
        <td><strong>Penanggung Jawab</strong></td>
        <td>:</td>
        <td>${escapeHTML(lap.pelapor)}</td>
      </tr>
    </table>

    ${rincianHTML}
  `;

  openModal("modalCetakLaporan");
}

function generateReportHTMLDocument(lap) {
  if (!lap) return "";
  const isBendahara = (lap.divisiId === "bendahara" || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("bendahara")));
  const isKorlap = (lap.divisiId === "korlap" || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("korlap")) || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("lapangan")));
  const isSarpras = (lap.divisiId === "sarpras" || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("sarpras")) || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("sarana")));
  const detail = lap.detail || {};
  const isMedia = (
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
  const displayAbs = (absG10.length > 0 ? absG10 : (absG11.length > 0 ? absG11 : absList));

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

  const defaultSarprasNames = [
    "Slayer", "Slempang", "Garuda", "Kopel", "Sarung Tangan",
    "Sepatu Pantofel Cewe", "Sepatu Pantofel Tali Cowo", "Sepatu Pantofel Laki-Laki",
    "Peci Cewe Cowo", "Baju PDU Cewe", "Rok PDU Cewe", "Celana PDU Cowo",
    "Bendera", "Taplak Bendera", "Talikur", "Belt Putih",
    "Peci Perempuan", "Peci Laki-Laki", "Evolet"
  ];
  const sarprasItems = Array.isArray(detail.inventaris) && detail.inventaris.length > 0
    ? detail.inventaris
    : defaultSarprasNames.map(nama => ({ nama, layak: 0, tidakLayak: 0, total: 0 }));
  const sarLayak = detail.totalLayak !== undefined ? Number(detail.totalLayak) : sarprasItems.reduce((acc, it) => acc + (Number(it.layak) || 0), 0);
  const sarTidak = detail.totalTidakLayak !== undefined ? Number(detail.totalTidakLayak) : sarprasItems.reduce((acc, it) => acc + (Number(it.tidakLayak) || 0), 0);
  const sarSemua = detail.totalSemua !== undefined ? Number(detail.totalSemua) : (sarLayak + sarTidak);

  const totalHadir = detail.totalHadir !== undefined ? detail.totalHadir : displayAbs.filter(a => a.status === 'Hadir').length;
  const totalIzin = detail.totalIzin !== undefined ? detail.totalIzin : displayAbs.filter(a => a.status === 'Izin').length;
  const totalAlfa = detail.totalAlfa !== undefined ? detail.totalAlfa : (detail.totalAlpa !== undefined ? detail.totalAlpa : displayAbs.filter(a => a.status === 'Alfa' || a.status === 'Alpa').length);
  const totalAnak = displayAbs.length || (totalHadir + totalIzin + totalAlfa);
  const persenHadir = totalAnak > 0 ? Math.round((totalHadir / totalAnak) * 100) : 0;
  const tglIndo = (typeof formatHariTanggalIndo === 'function')
    ? formatHariTanggalIndo(lap.tanggal || detail.tanggalIndo || detail.tanggal)
    : (detail.tanggalIndo || (typeof formatTanggalLengkap === 'function' ? formatTanggalLengkap(lap.tanggal) : lap.tanggal));
  const mingguKe = detail.mingguKe || '-';
  const katBulan = lap.kategoriBulan || detail.kategoriBulan || '-';

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laporan ${escapeHTML(lap.divisiNama)} - ${escapeHTML(lap.judul)}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; }
    body {
      font-family: Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 24px;
      line-height: 1.45;
    }
    .report-paper {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px 38px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .report-paper { border: none; box-shadow: none; padding: 0; width: 100%; max-width: 100%; }
      .no-print { display: none !important; }
    }
    .kop-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 3px double #0f172a;
      padding-bottom: 12px;
      margin-bottom: 20px;
      text-align: center;
    }
    .kop-logo { width: 62px; height: 62px; object-fit: contain; }
    .kop-text { flex: 1; }
    .kop-text h4 { margin: 0; font-size: 10.5pt; font-weight: 700; color: #0f172a; letter-spacing: 0.5px; }
    .kop-text p.sub { margin: 2px 0; font-size: 8.5pt; color: #334155; }
    .kop-text h3 { margin: 3px 0; font-size: 13pt; font-weight: 900; color: #b91c1c; letter-spacing: 0.5px; }
    .kop-text p.addr { margin: 2px 0 0 0; font-size: 7.5pt; color: #64748b; font-style: italic; }
    .report-title-section { text-align: center; margin-bottom: 18px; }
    .report-title-section h2 { margin: 0; font-size: 12.5pt; font-weight: 800; color: #0f172a; text-transform: uppercase; }
    .report-title-section p { margin: 4px 0 0 0; font-size: 9pt; color: #475569; }
    .identitas-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #b91c1c;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 18px;
      font-size: 8.5pt;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px 16px;
    }
    .identitas-item { display: flex; }
    .identitas-label { width: 130px; font-weight: 700; color: #475569; }
    .identitas-value { flex: 1; font-weight: 600; color: #0f172a; }
    .rekap-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 18px;
      text-align: center;
    }
    .rekap-card {
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
    }
    .rekap-card.hadir { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
    .rekap-card.izin { background: #fefce8; border-color: #fef08a; color: #a16207; }
    .rekap-card.alfa { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
    .rekap-card.total { background: #f1f5f9; border-color: #cbd5e1; color: #0f172a; }
    .rekap-card .title { font-size: 8pt; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
    .rekap-card .num { font-size: 13pt; font-weight: 800; }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      margin-bottom: 24px;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
    }
    table.data-table th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      text-align: center;
    }
    .status-badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 7.5pt;
    }
    .status-hadir { background: #dcfce7; color: #15803d; }
    .status-izin { background: #fef9c3; color: #a16207; }
    .status-alfa { background: #fee2e2; color: #dc2626; }
    .ttd-section {
      display: flex;
      justify-content: space-between;
      margin-top: 28px;
      padding-top: 10px;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    .ttd-box { width: 220px; text-align: center; }
    .ttd-space { height: 60px; }
    .doc-footer {
      margin-top: 26px;
      padding-top: 10px;
      border-top: 1px dashed #cbd5e1;
      font-size: 7.5pt;
      color: #94a3b8;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="report-paper">
    <div class="kop-header" style="border-bottom: 2.5px solid #000000;">
      <img src="logo-smk40.png" alt="Logo SMKN 40" class="kop-logo" onerror="this.src='https://via.placeholder.com/64?text=SMK40'">
      <div class="kop-text" style="font-family: 'Times New Roman', Times, serif;">
        <h3 style="margin: 0; font-size: 13.5pt; font-weight: 900; color: #000000; letter-spacing: 0.5px;">PASUKAN PENGIBAR BENDERA</h3>
        <h3 style="margin: 2px 0 3px 0; font-size: 13.5pt; font-weight: 900; color: #000000; letter-spacing: 0.5px;">SMK NEGERI 40 JAKARTA</h3>
        <p class="addr" style="margin: 0; font-size: 9pt; color: #000000; font-style: normal;">Jl. Nanas II Utan Kayu Utara, Jakarta Timur 13120 Telp (021) 8563329</p>
      </div>
      <img src="logo-paskibra.png" alt="Logo Garatika" class="kop-logo" onerror="this.src='https://via.placeholder.com/64?text=Garatika'">
    </div>

    ${isBendahara ? `
      <div class="report-title-section" style="margin-top: 18px; margin-bottom: 14px;">
        <h2 style="font-family: 'Times New Roman', Times, serif; font-size: 13pt; font-weight: 900; color: #000000; margin: 0;">LAPORAN KAS EKSTRAKURIKULER PASKIBRA</h2>
        <p style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; color: #334155; margin-top: 4px;">
          Bulan ${(katBulan || '-').replace(/^bulan\s+/i, '')} - Minggu Ke - ${mingguKe}
        </p>
      </div>

      <div class="identitas-box" style="border-left: 4px solid #0f172a; padding: 10px 14px; margin-bottom: 16px;">
        <div class="identitas-item">
          <span class="identitas-label">Judul Laporan:</span>
          <span class="identitas-value">${escapeHTML(lap.judul || 'Laporan Kas')}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Nama Pelapor:</span>
          <span class="identitas-value">${escapeHTML(lap.pelapor || 'Bendahara')}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Hari / Tanggal:</span>
          <span class="identitas-value">${escapeHTML(tglIndo)}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Angkatan:</span>
          <span class="identitas-value">Kas G10 & G11</span>
        </div>
      </div>

      <div class="rekap-grid" style="grid-template-columns: repeat(6, 1fr); margin-bottom: 18px;">
        <div class="rekap-card" style="background:#f8fafc; border-color:#cbd5e1;">
          <div class="title" style="color:#475569;">Saldo Awal</div>
          <div class="num" style="font-size:9.5pt; color:#475569;">${formatRupiah(detail.saldoAwal || 0)}</div>
        </div>
        <div class="rekap-card" style="background:#f8fafc; border-color:#cbd5e1;">
          <div class="title" style="color:#475569;">Total Cash</div>
          <div class="num" style="font-size:9.5pt; color:#0f172a;">${formatRupiah(detail.totalCash || 0)}</div>
        </div>
        <div class="rekap-card" style="background:#eef2ff; border-color:#c7d2fe;">
          <div class="title" style="color:#4338ca;">Total QRIS</div>
          <div class="num" style="font-size:9.5pt; color:#3730a3;">${formatRupiah(detail.totalQris || 0)}</div>
        </div>
        <div class="rekap-card" style="background:#f0fdf4; border-color:#bbf7d0;">
          <div class="title" style="color:#15803d;">Pemasukan</div>
          <div class="num" style="font-size:9.5pt; color:#166534;">${formatRupiah(detail.totalPemasukan || 0)}</div>
        </div>
        <div class="rekap-card" style="background:#fef2f2; border-color:#fecaca;">
          <div class="title" style="color:#dc2626;">Pengeluaran</div>
          <div class="num" style="font-size:9.5pt; color:#991b1b;">${formatRupiah(detail.totalPengeluaran || 0)}</div>
        </div>
        <div class="rekap-card" style="background:${(detail.saldoAkhir || 0) >= 0 ? '#f0fdf4' : '#fef2f2'}; border-color:${(detail.saldoAkhir || 0) >= 0 ? '#86efac' : '#fca5a5'};">
          <div class="title" style="color:${(detail.saldoAkhir || 0) >= 0 ? '#15803d' : '#dc2626'};">Saldo Akhir</div>
          <div class="num" style="font-size:9.5pt; color:${(detail.saldoAkhir || 0) >= 0 ? '#166534' : '#991b1b'};">${formatRupiah(detail.saldoAkhir || 0)}</div>
        </div>
      </div>

      <h4 style="margin: 0 0 8px 0; font-size: 9.5pt; color: #0f172a; text-transform: uppercase;">
        Pembayaran Kas Anggota G10 (Kelas XI) - Rp 2.000 / Anak
      </h4>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 38px; text-align: center;">No</th>
            <th style="text-align: center;">Nama Lengkap</th>
            <th style="width: 140px; text-align: center;">Status Pembayaran</th>
            <th style="width: 120px; text-align: center;">Metode Pembayaran</th>
          </tr>
        </thead>
        <tbody>
          ${(detail.kasG10 || []).length > 0 ? (detail.kasG10 || []).map((m, idx) => `
            <tr>
              <td style="text-align: center; padding: 7px 6px;">${idx + 1}</td>
              <td style="font-weight: 600; text-align: left; padding: 7px 10px;">${escapeHTML(m.nama || '-')}</td>
              <td style="text-align: center; padding: 7px 6px;">
                <span class="status-badge ${m.bayar === 'Bayar' ? 'status-hadir' : 'status-alfa'}">${escapeHTML(m.bayar || 'Tidak Bayar')}</span>
              </td>
              <td style="text-align: center; padding: 7px 6px; font-weight: 600; color: #475569;">${m.bayar === 'Bayar' ? escapeHTML(m.metode || 'Cash') : '-'}</td>
            </tr>
          `).join('') : `<tr><td colspan="4" style="text-align: center; color: #94a3b8; padding: 12px;">Tidak ada data kas G10.</td></tr>`}
        </tbody>
      </table>

      <h4 style="margin: 16px 0 8px 0; font-size: 9.5pt; color: #0f172a; text-transform: uppercase;">
        Pembayaran Kas Anggota G11 (Kelas X) - Rp 2.000 / Anak
      </h4>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 38px; text-align: center;">No</th>
            <th style="text-align: center;">Nama Lengkap</th>
            <th style="width: 140px; text-align: center;">Status Pembayaran</th>
            <th style="width: 120px; text-align: center;">Metode Pembayaran</th>
          </tr>
        </thead>
        <tbody>
          ${(detail.kasG11 || []).length > 0 ? (detail.kasG11 || []).map((m, idx) => `
            <tr>
              <td style="text-align: center; padding: 7px 6px;">${idx + 1}</td>
              <td style="font-weight: 600; text-align: left; padding: 7px 10px;">${escapeHTML(m.nama || '-')}</td>
              <td style="text-align: center; padding: 7px 6px;">
                <span class="status-badge ${m.bayar === 'Bayar' ? 'status-hadir' : 'status-alfa'}">${escapeHTML(m.bayar || 'Tidak Bayar')}</span>
              </td>
              <td style="text-align: center; padding: 7px 6px; font-weight: 600; color: #475569;">${m.bayar === 'Bayar' ? escapeHTML(m.metode || 'Cash') : '-'}</td>
            </tr>
          `).join('') : `<tr><td colspan="4" style="text-align: center; color: #94a3b8; padding: 12px;">Tidak ada data kas G11.</td></tr>`}
        </tbody>
      </table>

      ${(((detail.pemasukanTambahan || []).filter(p => (p.sumber || '').trim() && p.sumber !== '-' && Number(p.nominal) > 0)).length > 0 || ((detail.pengeluaran || []).filter(p => (p.rincian || '').trim() && p.rincian !== '-' && Number(p.nominal) > 0)).length > 0) ? `
        <div style="page-break-before: always; break-before: page; margin-top: 24px;">
          ${((detail.pemasukanTambahan || []).filter(p => (p.sumber || '').trim() && p.sumber !== '-' && Number(p.nominal) > 0)).length > 0 ? `
            <h4 style="margin: 0 0 8px 0; font-size: 9.5pt; color: #0f172a; text-transform: uppercase;">
              Pemasukan Tambahan
            </h4>
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 38px; text-align: center;">No</th>
                  <th style="text-align: center;">Sumber Pemasukan</th>
                  <th style="width: 140px; text-align: center;">Nominal</th>
                  <th style="width: 100px; text-align: center;">Metode</th>
                </tr>
              </thead>
              <tbody>
                ${(detail.pemasukanTambahan || []).filter(p => (p.sumber || '').trim() && p.sumber !== '-' && Number(p.nominal) > 0).map((p, idx) => `
                  <tr>
                    <td style="text-align: center; padding: 7px 6px;">${idx + 1}</td>
                    <td style="text-align: left; padding: 7px 10px; font-weight: 600;">${escapeHTML(p.sumber || '-')}</td>
                    <td style="text-align: right; padding: 7px 10px; font-weight: 700; color: #16a34a;">${formatRupiah(p.nominal || 0)}</td>
                    <td style="text-align: center; padding: 7px 6px;">${escapeHTML(p.metode || 'Cash')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${((detail.pengeluaran || []).filter(p => (p.rincian || '').trim() && p.rincian !== '-' && Number(p.nominal) > 0)).length > 0 ? `
            <h4 style="margin: 22px 0 8px 0; font-size: 9.5pt; color: #0f172a; text-transform: uppercase;">
              Pengeluaran Opsional
            </h4>
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 38px; text-align: center;">No</th>
                  <th style="text-align: center;">Rincian Pengeluaran</th>
                  <th style="width: 140px; text-align: center;">Nominal</th>
                  <th style="width: 110px; text-align: center;">Metode</th>
                </tr>
              </thead>
              <tbody>
                ${(detail.pengeluaran || []).filter(p => (p.rincian || '').trim() && p.rincian !== '-' && Number(p.nominal) > 0).map((p, idx) => `
                  <tr>
                    <td style="text-align: center; padding: 7px 6px;">${idx + 1}</td>
                    <td style="text-align: left; padding: 7px 10px; font-weight: 600;">${escapeHTML(p.rincian || '-')}</td>
                    <td style="text-align: right; padding: 7px 10px; font-weight: 700; color: #dc2626;">- ${formatRupiah(p.nominal || 0)}</td>
                    <td style="text-align: center; padding: 7px 10px; font-weight: 600; color: #475569;">${escapeHTML(p.metode || p.keterangan || 'Cash')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}
        </div>
      ` : ''}
    ` : isKorlap ? `
      <div class="report-title-section" style="margin-top: 18px; margin-bottom: 14px;">
        <h2 style="font-family: 'Times New Roman', Times, serif; font-size: 13pt; font-weight: 900; color: #000000; margin: 0;">LAPORAN KOORDINATOR LAPANGAN EKSTRAKURIKULER PASKIBRA</h2>
        <p style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; color: #334155; margin-top: 4px;">
          Bulan ${(katBulan || '-').replace(/^bulan\s+/i, '')} - Minggu Ke - ${mingguKe}
        </p>
      </div>

      <div class="identitas-box" style="border-left: 4px solid #0f172a; padding: 10px 14px; margin-bottom: 20px;">
        <div class="identitas-item">
          <span class="identitas-label">Judul Laporan:</span>
          <span class="identitas-value">${escapeHTML(lap.judul || 'Laporan Kegiatan Lapangan')}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Nama Pelapor:</span>
          <span class="identitas-value">${escapeHTML(lap.pelapor || 'Koordinator Lapangan')}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Hari / Tanggal:</span>
          <span class="identitas-value">${escapeHTML(tglIndo)}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Divisi:</span>
          <span class="identitas-value">Koordinator Lapangan</span>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 8px 0; font-size: 9.5pt; color: #0f172a; text-transform: uppercase;">
          1. Materi Latihan (Apa Saja yang Dilakukan)
        </h4>
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-left: 4px solid #2563eb; padding: 12px 16px; font-size: 9pt; color: #1e293b; border-radius: 6px; line-height: 1.6; white-space: pre-wrap;">${escapeHTML(detail.materiLatihan || (Array.isArray(detail.rowsMateri) ? detail.rowsMateri.map((m, idx) => `${idx + 1}. ${m.materi || '-'}`).join('\n') : '-'))}</div>
      </div>

      <div style="margin-bottom: 16px;">
        <h4 style="margin: 0 0 8px 0; font-size: 9.5pt; color: #0f172a; text-transform: uppercase;">
          2. Evaluasi Latihan
        </h4>
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-left: 4px solid #16a34a; padding: 12px 16px; font-size: 9pt; color: #1e293b; border-radius: 6px; line-height: 1.6; white-space: pre-wrap;">${escapeHTML(detail.evaluasi || '-')}</div>
      </div>
    ` : isSarpras ? `
      <div class="report-title-section" style="margin-top: 18px; margin-bottom: 14px;">
        <h2 style="font-family: 'Times New Roman', Times, serif; font-size: 13pt; font-weight: 900; color: #000000; margin: 0;">LAPORAN INVENTARISASI SARANA & PRASARANA EKSTRAKURIKULER PASKIBRA</h2>
        <p style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; color: #334155; margin-top: 4px;">
          Periode: Bulan ${(katBulan || '-').replace(/^bulan\s+/i, '')}
        </p>
      </div>

      <div class="identitas-box" style="border-left: 4px solid #0f172a; padding: 10px 14px; margin-bottom: 20px;">
        <div class="identitas-item">
          <span class="identitas-label">Judul Laporan:</span>
          <span class="identitas-value">${escapeHTML(lap.judul || 'Laporan Inventarisasi Sarpras')}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Nama Pelapor:</span>
          <span class="identitas-value">${escapeHTML(lap.pelapor || 'Sarana & Prasarana')}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Periode Bulan:</span>
          <span class="identitas-value">${escapeHTML((katBulan || '-').replace(/^bulan\s+/i, 'Bulan '))}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Divisi:</span>
          <span class="identitas-value">Sarana & Prasarana</span>
        </div>
      </div>

      <div class="rekap-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 20px;">
        <div class="rekap-card hadir">
          <div class="title" style="font-size: 8.5pt;">Total Layak Pakai</div>
          <div class="num" style="font-size: 14pt; margin-top: 3px;">${sarLayak}</div>
        </div>
        <div class="rekap-card alfa">
          <div class="title" style="font-size: 8.5pt;">Total Tidak Layak</div>
          <div class="num" style="font-size: 14pt; margin-top: 3px;">${sarTidak}</div>
        </div>
        <div class="rekap-card total">
          <div class="title" style="font-size: 8.5pt;">Total Barang</div>
          <div class="num" style="font-size: 14pt; margin-top: 3px;">${sarSemua}</div>
        </div>
      </div>

      <h4 style="margin: 0 0 10px 0; font-size: 9.5pt; color: #0f172a; text-transform: uppercase;">
        Daftar Inventarisasi Perlengkapan Paskibra
      </h4>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 38px; text-align: center;">No</th>
            <th style="text-align: left; padding-left: 10px;">Nama Barang / Perlengkapan</th>
            <th style="width: 110px; text-align: center;">Layak Pakai</th>
            <th style="width: 110px; text-align: center;">Tidak Layak</th>
            <th style="width: 100px; text-align: center;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${sarprasItems.map((it, idx) => `
            <tr>
              <td style="text-align: center; padding: 7px 6px;">${idx + 1}</td>
              <td style="text-align: left; padding: 7px 10px; font-weight: 600;">${escapeHTML(it.nama || it.barang || it.name || defaultSarprasNames[idx] || '-')}</td>
              <td style="text-align: center; padding: 7px 6px; font-weight: 700; color: #16a34a;">${Number(it.layak || 0)}</td>
              <td style="text-align: center; padding: 7px 6px; font-weight: 700; color: ${Number(it.tidakLayak || 0) > 0 ? '#dc2626' : '#64748b'};">${Number(it.tidakLayak || 0)}</td>
              <td style="text-align: center; padding: 7px 6px; font-weight: 800; color: #0f172a;">${Number(it.total || 0)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr style="background: #f1f5f9; font-weight: 800;">
            <td colspan="2" style="text-align: center; padding: 8px 10px; text-transform: uppercase;">Total Keseluruhan Barang</td>
            <td style="text-align: center; padding: 8px 6px; color: #16a34a;">${sarLayak}</td>
            <td style="text-align: center; padding: 8px 6px; color: ${sarTidak > 0 ? '#dc2626' : '#64748b'};">${sarTidak}</td>
            <td style="text-align: center; padding: 8px 6px; color: #0f172a;">${sarSemua}</td>
          </tr>
        </tfoot>
      </table>
    ` : isMedia ? `
      <div class="report-title-section" style="margin-top: 18px; margin-bottom: 14px;">
        <h2 style="font-family: 'Times New Roman', Times, serif; font-size: 13pt; font-weight: 900; color: #000000; margin: 0;">LAPORAN PUBLIKASI & MEDIA KREATIF EKSTRAKURIKULER PASKIBRA</h2>
        <p style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; color: #334155; margin-top: 4px;">
          Periode: Bulan ${(katBulan || '-').replace(/^bulan\s+/i, '')}
        </p>
      </div>

      <div class="identitas-box" style="border-left: 4px solid #0f172a; padding: 10px 14px; margin-bottom: 20px;">
        <div class="identitas-item">
          <span class="identitas-label">Judul Laporan:</span>
          <span class="identitas-value">${escapeHTML(lap.judul || 'Laporan Publikasi & Media Kreatif')}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Nama Pelapor:</span>
          <span class="identitas-value">${escapeHTML(lap.pelapor || 'Media Kreatif')}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Periode Bulan:</span>
          <span class="identitas-value">${escapeHTML((katBulan || '-').replace(/^bulan\s+/i, 'Bulan '))}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Divisi:</span>
          <span class="identitas-value">Media Kreatif</span>
        </div>
      </div>

      <div class="rekap-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 20px;">
        <div class="rekap-card hadir" style="background: #eff6ff; border-color: #bfdbfe;">
          <div class="title" style="font-size: 8pt; color: #1e40af;">Total Konten</div>
          <div class="num" style="font-size: 14pt; margin-top: 3px; color: #1d4ed8;">${totalPost}</div>
        </div>
        <div class="rekap-card alfa" style="background: #fdf2f8; border-color: #fbcfe8;">
          <div class="title" style="font-size: 8pt; color: #9d174d;">Jangkauan</div>
          <div class="num" style="font-size: 14pt; margin-top: 3px; color: #be185d;">${totalJangkau.toLocaleString('id-ID')}</div>
        </div>
        <div class="rekap-card izin" style="background: #f0fdf4; border-color: #bbf7d0;">
          <div class="title" style="font-size: 8pt; color: #166534;">Interaksi</div>
          <div class="num" style="font-size: 14pt; margin-top: 3px; color: #15803d;">${totalInteraksi.toLocaleString('id-ID')}</div>
        </div>
        <div class="rekap-card total" style="background: #fefce8; border-color: #fef08a;">
          <div class="title" style="font-size: 8pt; color: #854d0e;">Kunjungan</div>
          <div class="num" style="font-size: 14pt; margin-top: 3px; color: #a16207;">${totalKunjungan.toLocaleString('id-ID')}</div>
        </div>
      </div>

      <h4 style="margin: 0 0 10px 0; font-size: 9.5pt; color: #0f172a; text-transform: uppercase;">
        Rincian Postingan & Metrik Insight Konten
      </h4>

      <table class="data-table" style="font-size: 8pt; width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #0f172a; color: #ffffff;">
            <th style="width: 28px; text-align: center; padding: 6px 3px; white-space: nowrap !important;">No</th>
            <th style="width: 85px; text-align: center; padding: 6px 4px; white-space: nowrap !important;">Waktu</th>
            <th style="width: 65px; text-align: center; padding: 6px 4px; white-space: nowrap !important;">Platform</th>
            <th style="width: 65px; text-align: center; padding: 6px 4px; white-space: nowrap !important;">Tipe</th>
            <th style="text-align: left; padding: 6px 6px;">Nama Konten</th>
            <th style="width: 55px; text-align: center; padding: 6px 3px; white-space: nowrap !important;">Jangkauan</th>
            <th style="width: 40px; text-align: center; padding: 6px 2px; white-space: nowrap !important;">Like</th>
            <th style="width: 40px; text-align: center; padding: 6px 2px; white-space: nowrap !important;">Komen</th>
            <th style="width: 40px; text-align: center; padding: 6px 2px; white-space: nowrap !important;">Share</th>
            <th style="width: 40px; text-align: center; padding: 6px 2px; white-space: nowrap !important;">Repost</th>
            <th style="width: 40px; text-align: center; padding: 6px 2px; white-space: nowrap !important;">Save</th>
            <th style="width: 55px; text-align: center; padding: 6px 3px; white-space: nowrap !important;">Kunjungan</th>
            <th style="width: 55px; text-align: center; padding: 6px 3px; white-space: nowrap !important;">Followers</th>
          </tr>
        </thead>
        <tbody>
          ${kontenList.length > 0 ? kontenList.map((k, idx) => {
            const isChat = (k.tipe === "Chat" || k.platform === "WhatsApp");
            const isTikTok = (k.platform === "TikTok" && !isChat);
            const dash = '<span style="color:#94a3b8;">-</span>';
            return `
              <tr style="text-align: center;">
                <td style="padding: 6px 3px; white-space: nowrap;">${idx + 1}</td>
                <td style="padding: 6px 4px; white-space: nowrap;">${escapeHTML(k.waktu || '-')}</td>
                <td style="padding: 6px 4px; font-weight: 600; white-space: nowrap;">${escapeHTML(k.platform || 'Instagram')}</td>
                <td style="padding: 6px 4px; white-space: nowrap;">${escapeHTML(k.tipe || 'Postingan')}</td>
                <td style="padding: 6px 6px; text-align: left; font-weight: 600;">${escapeHTML(k.nama || '-')}</td>
                <td style="padding: 6px 3px; font-weight: 700; white-space: nowrap;">${(isChat || isTikTok) ? dash : Number(k.jangkau || 0).toLocaleString('id-ID')}</td>
                <td style="padding: 6px 2px; color: ${isChat ? '#94a3b8' : '#dc2626'}; white-space: nowrap;">${isChat ? dash : Number(k.like || 0).toLocaleString('id-ID')}</td>
                <td style="padding: 6px 2px; white-space: nowrap;">${isChat ? dash : Number(k.komen || 0).toLocaleString('id-ID')}</td>
                <td style="padding: 6px 2px; white-space: nowrap;">${isChat ? dash : Number(k.share || 0).toLocaleString('id-ID')}</td>
                <td style="padding: 6px 2px; white-space: nowrap;">${isChat ? dash : Number(k.repost || 0).toLocaleString('id-ID')}</td>
                <td style="padding: 6px 2px; white-space: nowrap;">${isChat ? dash : Number(k.save || 0).toLocaleString('id-ID')}</td>
                <td style="padding: 6px 3px; font-weight: 600; color: #2563eb; white-space: nowrap;">${isChat ? dash : Number(k.kunjungan || 0).toLocaleString('id-ID')}</td>
                <td style="padding: 6px 3px; font-weight: 600; color: #059669; white-space: nowrap;">${isChat ? dash : Number(k.followers || 0).toLocaleString('id-ID')}</td>
              </tr>
            `;
          }).join('') : `
            <tr><td colspan="13" style="text-align: center; color: #94a3b8; padding: 14px;">Tidak ada data postingan konten.</td></tr>
          `}
        </tbody>
        <tfoot>
          <tr style="background: #f1f5f9; font-weight: 800; border-top: 2px solid #cbd5e1; text-align: center;">
            <td colspan="5" style="padding: 7px 10px; text-align: right; text-transform: uppercase; color: #334155;">TOTAL</td>
            <td style="padding: 7px 4px; color: #0f172a; white-space: nowrap;">${totalJangkau.toLocaleString('id-ID')}</td>
            <td style="padding: 7px 3px; color: #dc2626; white-space: nowrap;">${totalLike.toLocaleString('id-ID')}</td>
            <td style="padding: 7px 3px; color: #0f172a; white-space: nowrap;">${totalKomen.toLocaleString('id-ID')}</td>
            <td style="padding: 7px 3px; color: #0f172a; white-space: nowrap;">${totalShare.toLocaleString('id-ID')}</td>
            <td style="padding: 7px 3px; color: #0f172a; white-space: nowrap;">${totalRepost.toLocaleString('id-ID')}</td>
            <td style="padding: 7px 3px; color: #0f172a; white-space: nowrap;">${totalSave.toLocaleString('id-ID')}</td>
            <td style="padding: 7px 4px; color: #2563eb; white-space: nowrap;">${totalKunjungan.toLocaleString('id-ID')}</td>
            <td style="padding: 7px 4px; color: #059669; white-space: nowrap;">${totalFollowers.toLocaleString('id-ID')}</td>
          </tr>
        </tfoot>
      </table>

      ${(detail.linkDriveMateri || lap.linkDrive) ? `
        <div style="margin-top: 16px; font-size: 8.5pt; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px;">
          <strong>Link Folder Master RAW / Materi:</strong>
          <a href="${escapeHTML(detail.linkDriveMateri || lap.linkDrive)}" target="_blank" style="color: #2563eb; text-decoration: underline; margin-left: 6px;">${escapeHTML(detail.linkDriveMateri || lap.linkDrive)}</a>
        </div>
      ` : ''}
    ` : `
      <div class="report-title-section" style="margin-top: 18px; margin-bottom: 14px;">
        <h2 style="font-family: 'Times New Roman', Times, serif; font-size: 13pt; font-weight: 900; color: #000000; margin: 0;">LAPORAN KEHADIRAN EKSTRAKURIKULER PASKIBRA</h2>
        <p style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; color: #334155; margin-top: 4px;">
          Bulan ${(katBulan || '-').replace(/^bulan\s+/i, '')} - Minggu Ke - ${mingguKe}
        </p>
      </div>

      <div class="identitas-box" style="border-left: 4px solid #0f172a; padding: 10px 14px; margin-bottom: 16px;">
        <div class="identitas-item">
          <span class="identitas-label">Judul Laporan:</span>
          <span class="identitas-value">${escapeHTML(lap.judul || 'Laporan Rutin')}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Nama Pelapor:</span>
          <span class="identitas-value">${escapeHTML(lap.pelapor || 'Sekretaris')}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Hari / Tanggal:</span>
          <span class="identitas-value">${escapeHTML(tglIndo)}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Angkatan:</span>
          <span class="identitas-value">${escapeHTML(angk || 'G10 / G11')}</span>
        </div>
      </div>

      <div class="rekap-grid">
        <div class="rekap-card hadir">
          <div class="title">Hadir</div>
          <div class="num">${totalHadir}</div>
        </div>
        <div class="rekap-card izin">
          <div class="title">Izin</div>
          <div class="num">${totalIzin}</div>
        </div>
        <div class="rekap-card alfa">
          <div class="title">Alfa</div>
          <div class="num">${totalAlfa}</div>
        </div>
        <div class="rekap-card total">
          <div class="title">Total Siswa</div>
          <div class="num">${totalAnak}</div>
        </div>
      </div>

      <h4 style="margin: 0 0 8px 0; font-size: 9.5pt; color: #0f172a; text-transform: uppercase;">
        Daftar Presensi Anggota ${angk ? `(${angk})` : ''}
      </h4>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 38px; text-align: center;">No</th>
            <th style="text-align: center;">Nama Lengkap</th>
            <th style="width: 100px; text-align: center;">Kelas</th>
            <th style="width: 95px; text-align: center;">Status</th>
            <th style="text-align: center;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          ${displayAbs.length > 0 ? displayAbs.map((m, idx) => {
            const st = m.status || 'Hadir';
            const badgeClass = st === 'Hadir' ? 'status-hadir' : (st === 'Izin' ? 'status-izin' : 'status-alfa');
            return `<tr>
              <td style="text-align: center; padding: 8px 6px;">${idx + 1}</td>
              <td style="font-weight: 600; text-align: left; padding: 8px 10px;">${escapeHTML(m.nama || '-')}</td>
              <td style="text-align: center; padding: 8px 6px;">${escapeHTML(m.kelas || '-')}</td>
              <td style="text-align: center; padding: 8px 6px;"><span class="status-badge ${badgeClass}">${escapeHTML(st)}</span></td>
              <td style="text-align: left; padding: 8px 10px;">${escapeHTML(m.keterangan || '-')}</td>
            </tr>`;
          }).join('') : `<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 14px;">Tidak ada data presensi.</td></tr>`}
        </tbody>
      </table>
    `}
  </div>
</body>
</html>`;
}

// Cache Base64 Logo untuk disematkan ke PDF
let _cachedLogoSmk = null;
let _cachedLogoPaskib = null;

function getLogoDataUrl(type) {
  if (type === "smk" && _cachedLogoSmk) return _cachedLogoSmk;
  if (type === "paskib" && _cachedLogoPaskib) return _cachedLogoPaskib;

  try {
    const selector = (type === "smk") ? 'img[src*="logo-smk40"], .kop-logo' : 'img[src*="logo-paskibra"], .kop-header img:last-child';
    const imgEl = document.querySelector(selector);
    if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
      const c = document.createElement("canvas");
      c.width = imgEl.naturalWidth;
      c.height = imgEl.naturalHeight;
      const ctx = c.getContext("2d");
      ctx.drawImage(imgEl, 0, 0);
      const url = c.toDataURL("image/png");
      if (type === "smk") _cachedLogoSmk = url;
      else _cachedLogoPaskib = url;
      return url;
    }
  } catch (e) {}
  return null;
}

// Preload asynchronous fallback
(function preloadLogos() {
  const loadImg = (src, type) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth || 64;
        c.height = img.naturalHeight || 64;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const url = c.toDataURL("image/png");
        if (type === "smk") _cachedLogoSmk = url;
        else _cachedLogoPaskib = url;
      } catch (e) {}
    };
    img.src = src;
  };
  loadImg("logo-smk40.png", "smk");
  loadImg("logo-paskibra.png", "paskib");
})();

function generateReportPDFDoc(lap) {
  if (!lap) return null;
  if (!window.jspdf || !window.jspdf.jsPDF) {
    console.warn("jsPDF belum termuat di browser.");
    return null;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  const darkColor = [15, 23, 42];
  const primaryColor = [185, 28, 28]; // Garatika red
  const lightGray = [248, 250, 252];
  const borderColor = [226, 232, 240];

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
  const displayAbs = (absG10.length > 0 ? absG10 : (absG11.length > 0 ? absG11 : absList));

  const totalHadir = detail.totalHadir !== undefined ? detail.totalHadir : displayAbs.filter(a => a.status === 'Hadir').length;
  const totalIzin = detail.totalIzin !== undefined ? detail.totalIzin : displayAbs.filter(a => a.status === 'Izin').length;
  const totalAlfa = detail.totalAlfa !== undefined ? detail.totalAlfa : (detail.totalAlpa !== undefined ? detail.totalAlpa : displayAbs.filter(a => a.status === 'Alfa' || a.status === 'Alpa').length);
  const totalAnak = displayAbs.length || (totalHadir + totalIzin + totalAlfa);
  const tglIndo = (typeof formatHariTanggalIndo === 'function')
    ? formatHariTanggalIndo(lap.tanggal || detail.tanggalIndo || detail.tanggal)
    : (detail.tanggalIndo || (typeof formatTanggalLengkap === 'function' ? formatTanggalLengkap(lap.tanggal) : lap.tanggal));
  const mingguKe = detail.mingguKe || '1';
  const katBulan = lap.kategoriBulan || detail.kategoriBulan || '-';
  const bulanText = (katBulan || '-').replace(/^bulan\s+/i, '');

  // 1. KOP SURAT RESMI (Sama persis seperti pada berkas 'Kop Surat Paskibra SMKN 40.docx')
  const smkLogo = getLogoDataUrl("smk");
  const paskibLogo = getLogoDataUrl("paskib");
  const logoSize = 48;
  const logoY = 22;

  if (smkLogo) {
    try {
      doc.addImage(smkLogo, "PNG", margin, logoY, logoSize, logoSize);
    } catch (e) {
      console.warn("Logo SMKN 40 tidak dapat disematkan ke PDF:", e);
    }
  }

  if (paskibLogo) {
    try {
      doc.addImage(paskibLogo, "PNG", pageWidth - margin - logoSize, logoY, logoSize, logoSize);
    } catch (e) {
      console.warn("Logo Garatika tidak dapat disematkan ke PDF:", e);
    }
  }

  doc.setFont("times", "bold");
  doc.setFontSize(13.5);
  doc.setTextColor(0, 0, 0);
  doc.text("PASUKAN PENGIBAR BENDERA", pageWidth / 2, 34, { align: "center" });

  doc.setFontSize(13.5);
  doc.text("SMK NEGERI 40 JAKARTA", pageWidth / 2, 49, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text("Jl. Nanas II Utan Kayu Utara, Jakarta Timur 13120 Telp (021) 8563329", pageWidth / 2, 63, { align: "center" });

  // Garis Pemisah Kop: Garis hitam solid tunggal tebal (sesuai Kop Surat Paskibra SMKN 40)
  const lineY = 74;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2.2);
  doc.line(margin, lineY, pageWidth - margin, lineY);

  const isBendahara = (lap.divisiId === "bendahara" || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("bendahara")));

  if (isBendahara) {
    const kasG10 = Array.isArray(detail.kasG10) ? detail.kasG10 : [];
    const kasG11 = Array.isArray(detail.kasG11) ? detail.kasG11 : [];
    const pemasukanTambahan = (Array.isArray(detail.pemasukanTambahan) ? detail.pemasukanTambahan : [])
      .filter(p => (p.sumber || "").trim() && p.sumber !== "-" && Number(p.nominal) > 0);
    const pengeluaran = (Array.isArray(detail.pengeluaran) ? detail.pengeluaran : [])
      .filter(p => (p.rincian || "").trim() && p.rincian !== "-" && Number(p.nominal) > 0);

    const saldoAwal = detail.saldoAwal !== undefined ? detail.saldoAwal : 0;
    const totalCash = detail.totalCash !== undefined ? detail.totalCash : 0;
    const totalQris = detail.totalQris !== undefined ? detail.totalQris : 0;
    const totalPemasukan = detail.totalPemasukan !== undefined ? detail.totalPemasukan : (totalCash + totalQris);
    const totalPengeluaran = detail.totalPengeluaran !== undefined ? detail.totalPengeluaran : 0;
    const saldoAkhir = detail.saldoAkhir !== undefined ? detail.saldoAkhir : (saldoAwal + totalPemasukan - totalPengeluaran);

    // 2. JUDUL DOKUMEN LAPORAN & SUBJUDUL
    let y = lineY + 22;
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("LAPORAN KAS EKSTRAKURIKULER PASKIBRA", pageWidth / 2, y, { align: "center" });

    y += 15;
    doc.setFont("times", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Bulan ${bulanText} - Minggu Ke - ${mingguKe}`, pageWidth / 2, y, { align: "center" });

    // 3. CONTAINER IDENTITAS LAPORAN (4 Data Sesuai Format Standar)
    y += 14;
    const panelH = 46;
    doc.setFillColor(...lightGray);
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, contentWidth, panelH, 5, 5, "FD");

    doc.setFontSize(8.5);
    const col1Label = margin + 14;
    const col1Colon = col1Label + 72;
    const col1Val = col1Label + 80;

    const col2Label = margin + (contentWidth / 2) + 12;
    const col2Colon = col2Label + 72;
    const col2Val = col2Label + 80;

    // Baris 1: Judul Laporan & Nama Pelapor
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Judul Laporan", col1Label, y + 17);
    doc.text(":", col1Colon, y + 17);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    const rawJudul = lap.judul || "Laporan Rutin";
    if (rawJudul.length > 35) doc.setFontSize(7.5);
    const splitJudul = doc.splitTextToSize(rawJudul, (contentWidth / 2) - 86);
    doc.text(splitJudul[0] || rawJudul, col1Val, y + 17);
    doc.setFontSize(8.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Nama Pelapor", col2Label, y + 17);
    doc.text(":", col2Colon, y + 17);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text(lap.pelapor || "Bendahara", col2Val, y + 17);

    // Baris 2: Hari / Tanggal & Angkatan
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Hari / Tanggal", col1Label, y + 33);
    doc.text(":", col1Colon, y + 33);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text(tglIndo, col1Val, y + 33);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Angkatan", col2Label, y + 33);
    doc.text(":", col2Colon, y + 33);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text("Kas G10 & G11", col2Val, y + 33);

    // 4. KARTU REKAPITULASI KEUANGAN (6 Cards: Saldo Awal, Cash, QRIS, Pemasukan, Pengeluaran, Saldo Akhir)
    y += panelH + 12;
    const rekapGap = 5;
    const rekapBoxW = (contentWidth - (rekapGap * 5)) / 6;
    const rekapBoxH = 34;

    const drawFinCard = (x, title, amountStr, bgColor, titleColor, valColor) => {
      doc.setFillColor(...bgColor);
      doc.setDrawColor(...borderColor);
      doc.roundedRect(x, y, rekapBoxW, rekapBoxH, 4, 4, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.2);
      doc.setTextColor(...titleColor);
      doc.text(title, x + rekapBoxW / 2, y + 12, { align: "center" });
      doc.setFontSize(7.8);
      doc.setTextColor(...valColor);
      doc.text(amountStr, x + rekapBoxW / 2, y + 26, { align: "center" });
    };

    drawFinCard(margin, "SALDO AWAL", formatRupiah(saldoAwal), [248, 250, 252], [71, 85, 105], [71, 85, 105]);
    drawFinCard(margin + (rekapBoxW + rekapGap), "TOTAL CASH", formatRupiah(totalCash), [248, 250, 252], [71, 85, 105], [15, 23, 42]);
    drawFinCard(margin + (rekapBoxW + rekapGap) * 2, "TOTAL QRIS", formatRupiah(totalQris), [238, 242, 255], [67, 56, 202], [49, 46, 129]);
    drawFinCard(margin + (rekapBoxW + rekapGap) * 3, "PEMASUKAN", formatRupiah(totalPemasukan), [240, 253, 244], [22, 101, 52], [22, 101, 52]);
    drawFinCard(margin + (rekapBoxW + rekapGap) * 4, "PENGELUARAN", formatRupiah(totalPengeluaran), [254, 242, 242], [185, 28, 28], [185, 28, 28]);
    const saldoBg = saldoAkhir >= 0 ? [240, 253, 244] : [254, 242, 242];
    const saldoClr = saldoAkhir >= 0 ? [22, 101, 52] : [185, 28, 28];
    drawFinCard(margin + (rekapBoxW + rekapGap) * 5, "SALDO AKHIR", formatRupiah(saldoAkhir), saldoBg, saldoClr, saldoClr);

    y += rekapBoxH + 28;

    // Helper AutoTable Kas
    const renderTableKas = (title, list) => {
      if (y > pageHeight - margin - 65) {
        doc.addPage();
        y = margin + 14;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...darkColor);
      doc.text(title, margin, y);
      y += 8;

      const head = [["No", "Nama Anggota", "Status Pembayaran", "Metode Pembayaran"]];
      const body = list.map((m, i) => [
        i + 1,
        m.nama || "-",
        m.bayar || "Tidak Bayar",
        m.bayar === "Bayar" ? (m.metode || "Cash") : "-"
      ]);

      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          startY: y,
          head: head,
          body: body,
          showHead: "firstPage",
          margin: { left: margin, right: margin, bottom: 25 },
          theme: "grid",
          headStyles: {
            fillColor: [15, 23, 42],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
            valign: "middle",
            cellPadding: 5.5
          },
          bodyStyles: {
            fontSize: 8.5,
            textColor: darkColor,
            cellPadding: 5.5,
            lineColor: [226, 232, 240],
            lineWidth: 0.4,
            valign: "middle"
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          },
          columnStyles: {
            0: { halign: "center", cellWidth: 32 },
            1: { halign: "left", fontStyle: "bold" },
            2: { halign: "center", cellWidth: 120 },
            3: { halign: "center", cellWidth: 110 }
          },
          didParseCell: function(data) {
            if (data.section === 'head') {
              data.cell.styles.halign = 'center';
            }
            if (data.section === 'body') {
              if (data.column.index === 0 || data.column.index === 2 || data.column.index === 3) {
                data.cell.styles.halign = 'center';
              }
              if (data.column.index === 1) {
                data.cell.styles.halign = 'left';
              }
              if (data.column.index === 2) {
                const val = String(data.cell.raw || '').toLowerCase();
                if (val.includes('bayar') && !val.includes('tidak')) {
                  data.cell.styles.textColor = [22, 101, 52];
                  data.cell.styles.fontStyle = 'bold';
                } else {
                  data.cell.styles.textColor = [100, 116, 139];
                }
              }
            }
          }
        });
        y = doc.lastAutoTable.finalY + 24;
      }
    };

    // Tabel Kas G10
    renderTableKas("Pembayaran Kas Anggota G10 (Kelas XI) - Rp 2.000 / Anak", kasG10);

    // Tabel Kas G11
    renderTableKas("Pembayaran Kas Anggota G11 (Kelas X) - Rp 2.000 / Anak", kasG11);

    const hasPemasukan = pemasukanTambahan.length > 0;
    const hasPengeluaran = pengeluaran.length > 0;

    // Pisah kertas: Pemasukan dan Pengeluaran Tambahan/Opsional dipisahkan ke halaman baru dari tabel anggota
    if (hasPemasukan || hasPengeluaran) {
      doc.addPage();
      y = margin + 14;
    }

    // Pemasukan Tambahan (jika ada)
    if (hasPemasukan) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...darkColor);
      doc.text("Pemasukan Tambahan", margin, y);
      y += 8;

      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          startY: y,
          head: [["No", "Sumber Pemasukan", "Nominal", "Metode"]],
          body: pemasukanTambahan.map((p, i) => [
            i + 1,
            p.sumber || "-",
            formatRupiah(p.nominal || 0),
            p.metode || "Cash"
          ]),
          showHead: "firstPage",
          margin: { left: margin, right: margin, bottom: 25 },
          theme: "grid",
          headStyles: {
            fillColor: [15, 23, 42],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
            cellPadding: 5.5
          },
          bodyStyles: {
            fontSize: 8.5,
            textColor: darkColor,
            cellPadding: 5.5,
            lineColor: [226, 232, 240]
          },
          columnStyles: {
            0: { halign: "center", cellWidth: 32 },
            1: { halign: "left" },
            2: { halign: "right", cellWidth: 120, textColor: [22, 101, 52], fontStyle: "bold" },
            3: { halign: "center", cellWidth: 90 }
          }
        });
        y = doc.lastAutoTable.finalY + 24;
      }
    }

    // Pengeluaran Opsional (jika ada)
    if (hasPengeluaran) {
      if (y > pageHeight - margin - 65) {
        doc.addPage();
        y = margin + 14;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...darkColor);
      doc.text("Pengeluaran Opsional", margin, y);
      y += 8;

      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          startY: y,
          head: [["No", "Rincian Pengeluaran", "Nominal", "Metode"]],
          body: pengeluaran.map((p, i) => [
            i + 1,
            p.rincian || "-",
            "- " + formatRupiah(p.nominal || 0),
            p.metode || p.keterangan || "Cash"
          ]),
          showHead: "firstPage",
          margin: { left: margin, right: margin, bottom: 25 },
          theme: "grid",
          headStyles: {
            fillColor: [15, 23, 42],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
            cellPadding: 5.5
          },
          bodyStyles: {
            fontSize: 8.5,
            textColor: darkColor,
            cellPadding: 5.5,
            lineColor: [226, 232, 240]
          },
          columnStyles: {
            0: { halign: "center", cellWidth: 32 },
            1: { halign: "left" },
            2: { halign: "right", cellWidth: 120, textColor: [185, 28, 28], fontStyle: "bold" },
            3: { halign: "center", cellWidth: 90 }
          }
        });
      }
    }

    return doc;
  }

  // ==========================================
  // FORMAT DIVISI KOORDINATOR LAPANGAN
  // ==========================================
  const isKorlap = (lap.divisiId === "korlap" || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("korlap")) || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("lapangan")));

  if (isKorlap) {
    const listMateri = Array.isArray(detail.rowsMateri) ? detail.rowsMateri : [];

    // 2. JUDUL DOKUMEN LAPORAN & SUBJUDUL
    let y = lineY + 22;
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("LAPORAN KOORDINATOR LAPANGAN EKSTRAKURIKULER PASKIBRA", pageWidth / 2, y, { align: "center" });

    y += 15;
    doc.setFont("times", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Bulan ${bulanText} - Minggu Ke - ${mingguKe}`, pageWidth / 2, y, { align: "center" });

    // 3. CONTAINER IDENTITAS LAPORAN (4 Data)
    y += 14;
    const panelH = 46;
    doc.setFillColor(...lightGray);
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, contentWidth, panelH, 5, 5, "FD");

    doc.setFontSize(8.5);
    const col1Label = margin + 14;
    const col1Colon = col1Label + 72;
    const col1Val = col1Label + 80;

    const col2Label = margin + (contentWidth / 2) + 12;
    const col2Colon = col2Label + 72;
    const col2Val = col2Label + 80;

    // Baris 1: Judul Laporan & Nama Pelapor
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Judul Laporan", col1Label, y + 17);
    doc.text(":", col1Colon, y + 17);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    const rawJudul = lap.judul || "Laporan Kegiatan Lapangan";
    if (rawJudul.length > 35) doc.setFontSize(7.5);
    const splitJudul = doc.splitTextToSize(rawJudul, (contentWidth / 2) - 86);
    doc.text(splitJudul[0] || rawJudul, col1Val, y + 17);
    doc.setFontSize(8.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Nama Pelapor", col2Label, y + 17);
    doc.text(":", col2Colon, y + 17);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text(lap.pelapor || "Koordinator Lapangan", col2Val, y + 17);

    // Baris 2: Hari / Tanggal & Divisi
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Hari / Tanggal", col1Label, y + 33);
    doc.text(":", col1Colon, y + 33);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text(tglIndo, col1Val, y + 33);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Divisi", col2Label, y + 33);
    doc.text(":", col2Colon, y + 33);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text("Koordinator Lapangan", col2Val, y + 33);

    // 4. BAGIAN 1: MATERI LATIHAN
    y += panelH + 18;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...darkColor);
    doc.text("1. MATERI LATIHAN (APA SAJA YANG DILAKUKAN)", margin, y);
    y += 8;

    const materiLatihanText = detail.materiLatihan || (Array.isArray(detail.rowsMateri) ? detail.rowsMateri.map((m, idx) => `${idx + 1}. ${m.materi || '-'}`).join("\n") : "-");
    const splitMateri = doc.splitTextToSize(materiLatihanText, contentWidth - 24);
    const boxMateriH = Math.max(34, (splitMateri.length * 11) + 16);

    if (boxMateriH <= (pageHeight - margin - y - 20)) {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(...borderColor);
      doc.roundedRect(margin, y, contentWidth, boxMateriH, 4, 4, "FD");
      doc.setFillColor(37, 99, 235);
      doc.rect(margin, y, 3, boxMateriH, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(splitMateri, margin + 12, y + 14);
      y += boxMateriH + 18;
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      for (let i = 0; i < splitMateri.length; i++) {
        if (y > pageHeight - margin - 20) {
          doc.addPage();
          y = margin + 14;
        }
        doc.text(splitMateri[i], margin + 6, y);
        y += 11;
      }
      y += 16;
    }

    // 5. BAGIAN 2: EVALUASI
    if (y > pageHeight - margin - 50) {
      doc.addPage();
      y = margin + 14;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...darkColor);
    doc.text("2. EVALUASI LATIHAN", margin, y);
    y += 8;

    const evaluasiText = detail.evaluasi || "-";
    const splitEva = doc.splitTextToSize(evaluasiText, contentWidth - 24);
    const boxEvaH = Math.max(34, (splitEva.length * 11) + 16);

    if (boxEvaH <= (pageHeight - margin - y - 20)) {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(...borderColor);
      doc.roundedRect(margin, y, contentWidth, boxEvaH, 4, 4, "FD");
      doc.setFillColor(22, 163, 74);
      doc.rect(margin, y, 3, boxEvaH, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(splitEva, margin + 12, y + 14);
      y += boxEvaH + 18;
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      for (let i = 0; i < splitEva.length; i++) {
        if (y > pageHeight - margin - 20) {
          doc.addPage();
          y = margin + 14;
        }
        doc.text(splitEva[i], margin + 6, y);
        y += 11;
      }
      y += 16;
    }

    return doc;
  }

  // ==========================================
  // FORMAT DIVISI SARANA & PRASARANA
  // ==========================================
  const isSarpras = (lap.divisiId === "sarpras" || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("sarpras")) || (lap.divisiNama && lap.divisiNama.toLowerCase().includes("sarana")));

  if (isSarpras) {
    const defaultSarprasNames = [
      "Slayer", "Slempang", "Garuda", "Kopel", "Sarung Tangan",
      "Sepatu Pantofel Cewe", "Sepatu Pantofel Tali Cowo", "Sepatu Pantofel Laki-Laki",
      "Peci Cewe Cowo", "Baju PDU Cewe", "Rok PDU Cewe", "Celana PDU Cowo",
      "Bendera", "Taplak Bendera", "Talikur", "Belt Putih",
      "Peci Perempuan", "Peci Laki-Laki", "Evolet"
    ];
    const sarItems = Array.isArray(detail.inventaris) && detail.inventaris.length > 0
      ? detail.inventaris
      : defaultSarprasNames.map(nama => ({ nama, layak: 0, tidakLayak: 0, total: 0 }));

    let totLayak = detail.totalLayak !== undefined ? Number(detail.totalLayak) : sarItems.reduce((acc, it) => acc + (Number(it.layak) || 0), 0);
    let totTidak = detail.totalTidakLayak !== undefined ? Number(detail.totalTidakLayak) : sarItems.reduce((acc, it) => acc + (Number(it.tidakLayak) || 0), 0);
    let totSemua = detail.totalSemua !== undefined ? Number(detail.totalSemua) : (totLayak + totTidak);

    // 2. JUDUL DOKUMEN LAPORAN & SUBJUDUL
    let y = lineY + 22;
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("LAPORAN INVENTARISASI SARANA & PRASARANA EKSTRAKURIKULER PASKIBRA", pageWidth / 2, y, { align: "center" });

    y += 15;
    doc.setFont("times", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Periode Laporan Bulanan: ${bulanText}`, pageWidth / 2, y, { align: "center" });

    // 3. CONTAINER IDENTITAS LAPORAN (4 Data)
    y += 14;
    const panelH = 46;
    doc.setFillColor(...lightGray);
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, contentWidth, panelH, 5, 5, "FD");

    doc.setFontSize(8.5);
    const col1Label = margin + 14;
    const col1Colon = col1Label + 72;
    const col1Val = col1Label + 80;

    const col2Label = margin + (contentWidth / 2) + 12;
    const col2Colon = col2Label + 72;
    const col2Val = col2Label + 80;

    // Baris 1: Judul Laporan & Nama Pelapor
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Judul Laporan", col1Label, y + 17);
    doc.text(":", col1Colon, y + 17);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    const rawJudul = lap.judul || "Laporan Inventarisasi Sarpras";
    if (rawJudul.length > 35) doc.setFontSize(7.5);
    const splitJudul = doc.splitTextToSize(rawJudul, (contentWidth / 2) - 86);
    doc.text(splitJudul[0] || rawJudul, col1Val, y + 17);
    doc.setFontSize(8.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Nama Pelapor", col2Label, y + 17);
    doc.text(":", col2Colon, y + 17);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text(lap.pelapor || "Sarana & Prasarana", col2Val, y + 17);

    // Baris 2: Periode Bulan & Divisi
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Periode Bulan", col1Label, y + 33);
    doc.text(":", col1Colon, y + 33);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text(bulanText, col1Val, y + 33);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Divisi", col2Label, y + 33);
    doc.text(":", col2Colon, y + 33);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text("Sarana & Prasarana", col2Val, y + 33);

    // 4. KARTU REKAP METRIK (3 Kartu: Layak Pakai, Tidak Layak, Total Fisik)
    y += panelH + 12;
    const rekapBoxW = (contentWidth - 16) / 3;
    const rekapBoxH = 34;

    const drawRekapSarpras = (x, title, num, bgColor, textColor) => {
      doc.setFillColor(...bgColor);
      doc.setDrawColor(...borderColor);
      doc.roundedRect(x, y, rekapBoxW, rekapBoxH, 4, 4, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...textColor);
      doc.text(title, x + rekapBoxW / 2, y + 12, { align: "center" });
      doc.setFontSize(11);
      doc.text(String(num), x + rekapBoxW / 2, y + 27, { align: "center" });
    };

    drawRekapSarpras(margin, "TOTAL LAYAK PAKAI", totLayak, [240, 253, 244], [22, 101, 52]);
    drawRekapSarpras(margin + rekapBoxW + 8, "TOTAL TIDAK LAYAK", totTidak, [254, 242, 242], [153, 27, 27]);
    drawRekapSarpras(margin + (rekapBoxW + 8) * 2, "TOTAL BARANG", totSemua, [241, 245, 249], [15, 23, 42]);

    // 5. TABEL DAFTAR INVENTARIS
    y += rekapBoxH + 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...darkColor);
    doc.text("DAFTAR INVENTARISASI BARANG / PERLENGKAPAN", margin, y);
    y += 6;

    const bodyTable = sarItems.map((it, idx) => [
      idx + 1,
      it.nama || it.barang || it.name || defaultSarprasNames[idx] || "-",
      Number(it.layak || 0),
      Number(it.tidakLayak || 0),
      Number(it.total || 0)
    ]);

    const footTable = [
      ["", "TOTAL KESELURUHAN BARANG", totLayak, totTidak, totSemua]
    ];

    if (typeof doc.autoTable === 'function') {
      doc.autoTable({
        startY: y,
        head: [["No", "Nama Barang / Perlengkapan", "Layak Pakai", "Tidak Layak", "Total"]],
        body: bodyTable,
        foot: footTable,
        showHead: "firstPage",
        theme: "grid",
        margin: { left: margin, right: margin, bottom: 25 },
        tableWidth: contentWidth,
        styles: {
          fontSize: 8,
          cellPadding: 4,
          textColor: [...darkColor],
          lineColor: [226, 232, 240],
          lineWidth: 0.5,
          valign: "middle"
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8,
          halign: "center",
          cellPadding: 5
        },
        footStyles: {
          fillColor: [241, 245, 249],
          textColor: [15, 23, 42],
          fontStyle: "bold",
          fontSize: 8,
          halign: "center",
          cellPadding: 5
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 26 },
          1: { halign: "left" },
          2: { halign: "center", cellWidth: 65, fontStyle: "bold", textColor: [22, 163, 74] },
          3: { halign: "center", cellWidth: 65, fontStyle: "bold", textColor: [220, 38, 38] },
          4: { halign: "center", cellWidth: 55, fontStyle: "bold" }
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        }
      });
    }

    return doc;
  }

  // ==========================================
  // FORMAT DIVISI MEDIA KREATIF
  // ==========================================
  const isMedia = (
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

  if (isMedia) {
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

    // 2. JUDUL DOKUMEN LAPORAN & SUBJUDUL
    let y = lineY + 22;
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("LAPORAN PUBLIKASI & MEDIA KREATIF EKSTRAKURIKULER PASKIBRA", pageWidth / 2, y, { align: "center" });

    y += 15;
    doc.setFont("times", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Periode Laporan Bulanan: ${bulanText}`, pageWidth / 2, y, { align: "center" });

    // 3. CONTAINER IDENTITAS LAPORAN (4 Data)
    y += 14;
    const panelH = 46;
    doc.setFillColor(...lightGray);
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, contentWidth, panelH, 5, 5, "FD");

    doc.setFontSize(8.5);
    const col1Label = margin + 14;
    const col1Colon = col1Label + 72;
    const col1Val = col1Label + 80;

    const col2Label = margin + (contentWidth / 2) + 12;
    const col2Colon = col2Label + 72;
    const col2Val = col2Label + 80;

    // Baris 1: Judul Laporan & Nama Pelapor
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Judul Laporan", col1Label, y + 17);
    doc.text(":", col1Colon, y + 17);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    const rawJudul = lap.judul || "Laporan Publikasi & Media Kreatif";
    if (rawJudul.length > 35) doc.setFontSize(7.5);
    const splitJudul = doc.splitTextToSize(rawJudul, (contentWidth / 2) - 86);
    doc.text(splitJudul[0] || rawJudul, col1Val, y + 17);
    doc.setFontSize(8.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Nama Pelapor", col2Label, y + 17);
    doc.text(":", col2Colon, y + 17);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text(lap.pelapor || "Media Kreatif", col2Val, y + 17);

    // Baris 2: Periode Bulan & Divisi
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Periode Bulan", col1Label, y + 33);
    doc.text(":", col1Colon, y + 33);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text(bulanText, col1Val, y + 33);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Divisi", col2Label, y + 33);
    doc.text(":", col2Colon, y + 33);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text("Media Kreatif", col2Val, y + 33);

    // 4. KARTU REKAP METRIK (4 Kartu)
    y += panelH + 12;
    const rekapBoxW = (contentWidth - 24) / 4;
    const rekapBoxH = 34;

    const drawRekapMedia = (x, title, num, bgColor, textColor) => {
      doc.setFillColor(...bgColor);
      doc.setDrawColor(...borderColor);
      doc.roundedRect(x, y, rekapBoxW, rekapBoxH, 4, 4, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...textColor);
      doc.text(title, x + rekapBoxW / 2, y + 12, { align: "center" });
      doc.setFontSize(11);
      doc.text(String(num), x + rekapBoxW / 2, y + 27, { align: "center" });
    };

    drawRekapMedia(margin, "TOTAL KONTEN", totalPost, [239, 246, 255], [30, 64, 175]);
    drawRekapMedia(margin + (rekapBoxW + 8), "JANGKAUAN", totalJangkau.toLocaleString('id-ID'), [253, 242, 248], [190, 24, 93]);
    drawRekapMedia(margin + (rekapBoxW + 8) * 2, "INTERAKSI", totalInteraksi.toLocaleString('id-ID'), [240, 253, 244], [22, 101, 52]);
    drawRekapMedia(margin + (rekapBoxW + 8) * 3, "KUNJUNGAN", totalKunjungan.toLocaleString('id-ID'), [254, 252, 232], [161, 98, 7]);

    // 5. TABEL RINCIAN POSTINGAN & METRIK INSIGHT
    y += rekapBoxH + 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...darkColor);
    doc.text("RINCIAN POSTINGAN & METRIK INSIGHT KONTEN", margin, y);
    y += 6;

    const bodyTable = kontenList.map((k, idx) => {
      const isChat = (k.tipe === "Chat" || k.platform === "WhatsApp");
      const isTikTok = (k.platform === "TikTok" && !isChat);
      const dash = "-";
      return [
        idx + 1,
        k.waktu || "-",
        k.platform || "Instagram",
        k.tipe || "Postingan",
        k.nama || "-",
        (isChat || isTikTok) ? dash : Number(k.jangkau || 0).toLocaleString('id-ID'),
        isChat ? dash : Number(k.like || 0).toLocaleString('id-ID'),
        isChat ? dash : Number(k.komen || 0).toLocaleString('id-ID'),
        isChat ? dash : Number(k.share || 0).toLocaleString('id-ID'),
        isChat ? dash : Number(k.repost || 0).toLocaleString('id-ID'),
        isChat ? dash : Number(k.save || 0).toLocaleString('id-ID'),
        isChat ? dash : Number(k.kunjungan || 0).toLocaleString('id-ID'),
        isChat ? dash : Number(k.followers || 0).toLocaleString('id-ID')
      ];
    });

    const footTable = [
      [
        "",
        "",
        "",
        "",
        "TOTAL",
        totalJangkau.toLocaleString('id-ID'),
        totalLike.toLocaleString('id-ID'),
        totalKomen.toLocaleString('id-ID'),
        totalShare.toLocaleString('id-ID'),
        totalRepost.toLocaleString('id-ID'),
        totalSave.toLocaleString('id-ID'),
        totalKunjungan.toLocaleString('id-ID'),
        totalFollowers.toLocaleString('id-ID')
      ]
    ];

    if (typeof doc.autoTable === 'function') {
      doc.autoTable({
        startY: y,
        head: [["No", "Waktu", "Platform", "Tipe", "Nama Konten", "Jangkauan", "Like", "Komen", "Share", "Repost", "Save", "Kunjungan", "Followers"]],
        body: bodyTable.length > 0 ? bodyTable : [["-", "-", "-", "-", "Tidak ada data postingan konten", "-", "-", "-", "-", "-", "-", "-", "-"]],
        foot: footTable,
        showHead: "firstPage",
        theme: "grid",
        margin: { left: margin, right: margin, bottom: 25 },
        tableWidth: contentWidth,
        styles: {
          fontSize: 5.8,
          cellPadding: { vertical: 2.5, horizontal: 1.5 },
          textColor: [...darkColor],
          lineColor: [226, 232, 240],
          lineWidth: 0.5,
          valign: "middle"
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 5.8,
          halign: "center",
          valign: "middle",
          cellPadding: { vertical: 3.5, horizontal: 1.5 }
        },
        footStyles: {
          fillColor: [241, 245, 249],
          textColor: [15, 23, 42],
          fontStyle: "bold",
          fontSize: 5.8,
          halign: "center",
          valign: "middle",
          cellPadding: { vertical: 3.5, horizontal: 1.5 }
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 16 },
          1: { halign: "center", cellWidth: 58 },
          2: { halign: "center", cellWidth: 38 },
          3: { halign: "center", cellWidth: 36 },
          4: { halign: "left" },
          5: { halign: "center", cellWidth: 42 },
          6: { halign: "center", cellWidth: 26 },
          7: { halign: "center", cellWidth: 30 },
          8: { halign: "center", cellWidth: 28 },
          9: { halign: "center", cellWidth: 30 },
          10: { halign: "center", cellWidth: 26 },
          11: { halign: "center", cellWidth: 42 },
          12: { halign: "center", cellWidth: 40 }
        },
        didParseCell: function(data) {
          if (data.section === "head" || data.section === "foot" || data.column.index !== 4) {
            data.cell.styles.overflow = "visible";
          }
          if (data.section === "foot" && data.column.index === 4) {
            data.cell.styles.halign = "center";
          }
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        }
      });

      if (detail.linkDriveMateri || lap.linkDrive) {
        const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : y) + 14;
        if (finalY < pageHeight - 40) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          doc.text("Folder Materi RAW / Master:", margin, finalY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(37, 99, 235);
          doc.text(String(detail.linkDriveMateri || lap.linkDrive), margin + 120, finalY);
        }
      }
    }

    return doc;
  }

  // ==========================================
  // FORMAT DIVISI SEKRETARIS (DEFAULT)
  // ==========================================
  // 2. JUDUL DOKUMEN LAPORAN & SUBJUDUL
  let y = lineY + 22;
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("LAPORAN KEHADIRAN EKSTRAKURIKULER PASKIBRA", pageWidth / 2, y, { align: "center" });

  y += 15;
  doc.setFont("times", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Bulan ${bulanText} - Minggu Ke - ${mingguKe}`, pageWidth / 2, y, { align: "center" });

  // 3. CONTAINER IDENTITAS LAPORAN (4 Data Sesuai Permintaan)
  y += 14;
  const panelH = 46;
  doc.setFillColor(...lightGray);
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y, contentWidth, panelH, 5, 5, "FD");

  doc.setFontSize(8.5);
  const col1Label = margin + 14;
  const col1Colon = col1Label + 72;
  const col1Val = col1Label + 80;

  const col2Label = margin + (contentWidth / 2) + 12;
  const col2Colon = col2Label + 72;
  const col2Val = col2Label + 80;

  // Baris 1: Judul Laporan & Nama Pelapor
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Judul Laporan", col1Label, y + 17);
  doc.text(":", col1Colon, y + 17);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  const rawJudul = lap.judul || "Laporan Rutin";
  if (rawJudul.length > 35) doc.setFontSize(7.5);
  const splitJudul = doc.splitTextToSize(rawJudul, (contentWidth / 2) - 86);
  doc.text(splitJudul[0] || rawJudul, col1Val, y + 17);
  doc.setFontSize(8.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Nama Pelapor", col2Label, y + 17);
  doc.text(":", col2Colon, y + 17);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  doc.text(lap.pelapor || "Sekretaris", col2Val, y + 17);

  // Baris 2: Hari / Tanggal & Angkatan
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Hari / Tanggal", col1Label, y + 33);
  doc.text(":", col1Colon, y + 33);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  doc.text(tglIndo, col1Val, y + 33);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Angkatan", col2Label, y + 33);
  doc.text(":", col2Colon, y + 33);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  doc.text(angk || "G10 / G11", col2Val, y + 33);

  // 4. KARTU REKAPITULASI PRESENSI (Tanpa Persentase %)
  y += panelH + 12;
  const rekapBoxW = (contentWidth - 24) / 4;
  const rekapBoxH = 34;

  const drawRekap = (x, title, num, bgColor, textColor) => {
    doc.setFillColor(...bgColor);
    doc.setDrawColor(...borderColor);
    doc.roundedRect(x, y, rekapBoxW, rekapBoxH, 4, 4, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...textColor);
    doc.text(title, x + rekapBoxW / 2, y + 12, { align: "center" });
    doc.setFontSize(11);
    doc.text(String(num), x + rekapBoxW / 2, y + 27, { align: "center" });
  };

  drawRekap(margin, "HADIR", totalHadir, [240, 253, 244], [22, 101, 52]);
  drawRekap(margin + rekapBoxW + 8, "IZIN", totalIzin, [254, 252, 232], [133, 77, 14]);
  drawRekap(margin + (rekapBoxW + 8) * 2, "ALFA", totalAlfa, [254, 242, 242], [153, 27, 27]);
  drawRekap(margin + (rekapBoxW + 8) * 3, "TOTAL SISWA", totalAnak, [241, 245, 249], [15, 23, 42]);

  // 5. TABEL DAFTAR PRESENSI SISWA (AutoTable dengan perataan tengah judul & kolom keterangan/kelas, jarak baris lebih lega)
  y += rekapBoxH + 15;

  const tableHead = [["No", "Nama Lengkap", "Kelas", "Status", "Keterangan"]];
  const tableBody = displayAbs.map((m, i) => [
    i + 1,
    m.nama || "-",
    m.kelas || "-",
    m.status || "Hadir",
    m.keterangan || "-"
  ]);

  if (typeof doc.autoTable === 'function') {
    doc.autoTable({
      startY: y,
      head: tableHead,
      body: tableBody,
      showHead: "firstPage", // Hanya tampilkan judul kolom di halaman pertama
      margin: { left: margin, right: margin, bottom: 25 },
      theme: "grid",
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "center", // Semua judul kolom diletakkan di tengah
        valign: "middle",
        cellPadding: 6.5
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: darkColor,
        cellPadding: 6.5, // Jarak antar baris per baris lebih lega
        lineColor: [226, 232, 240],
        lineWidth: 0.4,
        valign: "middle"
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 32 },
        1: { halign: "left", cellWidth: 175, fontStyle: "bold" },
        2: { halign: "center", cellWidth: 70 }, // Kolom Kelas rata tengah
        3: { halign: "center", cellWidth: 75 }, // Kolom Status rata tengah
        4: { halign: "left" }                   // Kolom Keterangan rata kiri (sesuai permintaan)
      },
      didParseCell: function(data) {
        if (data.section === 'head') {
          data.cell.styles.halign = 'center'; // Pastikan semua judul kolom di tengah
        }
        if (data.section === 'body') {
          if (data.column.index === 0 || data.column.index === 2 || data.column.index === 3) {
            data.cell.styles.halign = 'center'; // No, Kelas, Status rata tengah
          }
          if (data.column.index === 1 || data.column.index === 4) {
            data.cell.styles.halign = 'left'; // Nama Lengkap & Keterangan rata kiri
          }
          if (data.column.index === 3) {
            data.cell.styles.halign = 'center';
            const val = String(data.cell.raw || '').toLowerCase();
            if (val.includes('hadir')) {
              data.cell.styles.textColor = [22, 101, 52];
              data.cell.styles.fontStyle = 'bold';
            } else if (val.includes('izin')) {
              data.cell.styles.textColor = [161, 98, 7];
              data.cell.styles.fontStyle = 'bold';
            } else if (val.includes('alfa') || val.includes('alpa')) {
              data.cell.styles.textColor = [185, 28, 28];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      }
    });
  }

  // Tanda tangan & footer halaman dihilangkan sesuai instruksi
  return doc;
}

function unduhLaporanPDF(id) {
  const lap = state.laporan.find(l => l.id === id);
  if (!lap) return;

  const prosesUnduh = () => {
    const doc = generateReportPDFDoc(lap);
    if (!doc) {
      if (typeof showAlert === 'function') showAlert("Gagal memproses dokumen PDF.");
      return;
    }
    let namaDivisi = (lap.divisiNama || "Sekretaris").trim();
    if (namaDivisi.toLowerCase().startsWith("divisi ")) {
      namaDivisi = namaDivisi.substring(7).trim();
    } else if (namaDivisi.toLowerCase() === "divisi") {
      namaDivisi = "Sekretaris";
    }
    const safeDivisi = namaDivisi.replace(/[\\/:*?"<>|]/g, '').trim() || "Sekretaris";
    const rawJudul = (lap.judul || "Laporan Rutin").trim();
    const safeJudul = rawJudul.replace(/[\\/:*?"<>|]/g, '').trim() || "Laporan Rutin";
    const fileName = `Laporan Divisi ${safeDivisi} - ${safeJudul}.pdf`;
    doc.save(fileName);
    if (typeof showSmallToast === 'function') {
      showSmallToast({ icon: 'success', title: 'PDF Diunduh', text: `Berkas "${fileName}" berhasil diunduh.` });
    }
  };

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Unduh Berkas PDF?',
      html: `Apakah Anda yakin ingin mengunduh berkas PDF untuk laporan <strong>"${escapeHTML(lap.judul)}"</strong>?`,
      icon: 'question',
      width: '380px',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: '<i class="fa-solid fa-file-pdf"></i> Ya, Unduh PDF',
      cancelButtonText: 'Batal',
      customClass: { popup: 'swal-compact-popup' }
    }).then((result) => {
      if (result.isConfirmed) {
        prosesUnduh();
      }
    });
  } else if (confirm(`Apakah Anda yakin ingin mengunduh berkas PDF laporan "${lap.judul}"?`)) {
    prosesUnduh();
  }
}


// Window Exports
window.pratinjauKopSurat = pratinjauKopSurat;
window.generateReportHTMLDocument = generateReportHTMLDocument;
window.generateReportPDFDoc = generateReportPDFDoc;
window.unduhLaporanPDF = unduhLaporanPDF;


