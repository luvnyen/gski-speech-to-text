# Speech to Text — Live

Transkripsi suara pendeta secara real-time untuk jemaat gereja.
Menggunakan Web Speech API bawaan Chrome (gratis, tanpa API key).

## Cara Pakai

1. Double-click **`run.bat`**
2. Izinkan akses mikrofon (hanya sekali)
3. Tekan **Mulai**

> Butuh Chrome + koneksi internet (audio diproses oleh Google Speech).

`run.bat` membuka Chrome via localhost sehingga izin mikrofon tersimpan permanen — tidak perlu izin ulang setiap sesi.

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
