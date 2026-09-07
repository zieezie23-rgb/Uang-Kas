# Kas Kelas 3B — Versi Lokal (tanpa database/cloud)

Ini adalah kloningan dari aplikasi Kas & TIK, dengan SATU perbedaan:
seluruh kode sinkronisasi ke Google Sheets (Google Apps Script) sudah
dihapus. Aplikasi ini murni menyimpan data di **localStorage browser**,
persis seperti dijelaskan di README asli, tanpa memanggil server/database
eksternal apa pun.

## Cara Pakai
1. Buka `index.html` di browser (Chrome/Safari, desktop maupun HP).
2. Semua data otomatis tersimpan di localStorage browser tersebut setiap
   ada perubahan.
3. Karena tidak ada cloud, buka dari **perangkat/browser yang sama** setiap
   kali, dan rutin gunakan **Export ke Excel** sebagai cadangan.

## Apa yang diubah dari aslinya
- Dihapus: `CLOUD_URL`, `cloudPull()`, `cloudPush()`, dan polling
  auto-sync tiap 5 detik yang menarik data dari Google Sheets.
- Badge status "Tersimpan ke cloud" / "Menyinkron..." dinonaktifkan
  (fungsinya jadi no-op) karena tidak relevan lagi.
- Semua fitur lain (Rekap, Data Siswa, Input Pemasukan/Pengeluaran,
  Cetak, Export Excel, mode Kas & TIK) tetap sama persis seperti aslinya.

Kalau nanti butuh sinkron ke database/cloud sendiri, tinggal ganti
fungsi `saveState()` / `saveTik()` / `loadState()` / `loadTik()`
untuk memanggil backend pilihanmu.
