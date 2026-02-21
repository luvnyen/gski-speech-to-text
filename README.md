# Speech to Text — Live
### GSKI Rehobot Surabaya

Transkripsi suara pendeta secara real-time untuk jemaat gereja.
Menggunakan Web Speech API bawaan Chrome (gratis, tanpa API key).

## Cara Pakai

1. Double-click **`run.bat`**
2. Izinkan akses mikrofon (hanya sekali)
3. Tekan **▶ Mulai**

> Butuh Chrome + koneksi internet (audio diproses oleh Google Speech).

`run.bat` membuka Chrome via localhost sehingga izin mikrofon tersimpan permanen — tidak perlu izin ulang setiap sesi.

## Fitur

- **Transkripsi real-time** — teks muncul langsung saat berbicara, interim ditampilkan dengan indikator `▶`
- **Deteksi ayat Alkitab** — nama kitab, pasal, dan ayat otomatis di-highlight kuning saat disebutkan
  - Mendukung berbagai pola: `Kejadian 3:5`, `Kejadian 3 ayat 5`, `pasal ke tiga ayat lima`, `pasal yang ke satu dan ayat yang ke 5`, dll.
- **Log ayat disebutkan** — sidebar kanan mencatat semua referensi ayat lengkap dalam sesi; klik untuk copy
- **Scroll history** — riwayat transkripsi bisa di-scroll ke atas; area aktif selalu terlihat di bawah
- **Waveform mikrofon** — visualisasi gelombang suara saat rekaman berjalan
- **Dark / Light mode** — toggle tema, tersimpan otomatis di browser
- **ProPresenter integration** — kirim teks live ke ProPresenter via HTTP API

## ProPresenter

Isi kolom **Message Name** sesuai nama Message yang dibuat di ProPresenter,
lalu pastikan ProPresenter berjalan saat menekan Mulai.

Setup di ProPresenter (satu kali):
1. Di pojok kiri atas: ProPresenter → Settings → Network → Enable Network — catat port-nya
2. Messages → + → beri nama (contoh: `Live Transcript`)
3. Tambahkan Token di dalam message tersebut (Add Token → Message)
4. Styling sesuai selera

## Kontrol

| Tombol | Fungsi |
|--------|--------|
| `F11` | Fullscreen |
| `Esc` | Keluar fullscreen |
