# Integrasi Gerbang Pembayaran (Midtrans Sandbox)

Dokumen ini menjelaskan alur integrasi pembayaran Midtrans Snap SDK di website Dongker Barber serta cara melakukan simulasi pembayaran sukses di localhost menggunakan Ngrok.

---

## 1. Alur Transaksi Pembayaran

Platform Dongker Barber menggunakan **Midtrans Snap SDK** berupa popup pembayaran interaktif di sisi klien.

1.  **Pembuatan Token**: Ketika pelanggan menekan tombol "Bayar & Booking Sekarang", data dikirim ke API `/api/checkout`. Backend membuat baris pemesanan berstatus `pending` di Supabase, lalu meminta token pembayaran unik ke server Midtrans Sandbox.
2.  **Pemanggilan Snap**: Klien memuat Snap modal di browser menggunakan token tersebut.
3.  **Sukses Klien (onSuccess)**: Begitu pelanggan sukses membayar di layar popup, browser memicu callback `onSuccess()` dan mengirim HTTP POST ke API `/api/booking/confirm` untuk memperbarui status database lokal secara instan menjadi `paid`.
4.  **Sukses Server (Webhook)**: Server Midtrans juga mengirim notifikasi asinkron ke API webhook `/api/webhook/midtrans` sebagai cadangan (failsafe) untuk mengamankan integritas data status pembayaran di Supabase.

---

## 2. Cara Menguji Alur Pembayaran Otomatis di Localhost

Karena server berjalan di komputer lokal Anda (`localhost:3000`), server Midtrans tidak bisa mengirim notifikasi webhook secara langsung. Anda membutuhkan alat bantu **Ngrok** untuk membuat terowongan internet (tunnel):

### Langkah 1: Jalankan Ngrok
Buka terminal baru di komputer Anda dan jalankan perintah:
```bash
ngrok http 3000
```
Salin tautan publik yang disediakan oleh Ngrok (contoh: `https://abcd-123.ngrok-free.app`).

### Langkah 2: Konfigurasi Webhook di Dasbor Midtrans
1. Masuk ke **[Dasbor Sandbox Midtrans](https://dashboard.sandbox.midtrans.com/)**.
2. Buka menu **Settings** -> **Configuration** di sidebar kiri.
3. Pada input **Payment Notification URL**, masukkan tautan publik Ngrok Anda diikuti dengan rute webhook:
   `https://abcd-123.ngrok-free.app/api/webhook/midtrans`
4. Di bagian **Finish Redirect URL**, Anda dapat mengisinya dengan:
   `https://abcd-123.ngrok-free.app/booking/[order_id]`
5. Tekan tombol **Update** di bagian bawah halaman untuk menyimpan perubahan.

### Langkah 3: Lakukan Pengujian Pembayaran
1. Buka website lokal Anda dan lakukan proses booking.
2. Saat pop-up pembayaran muncul, pilih metode pembayaran **Virtual Account** (misal BNI) dan salin nomor rekening VA yang tampil.
3. Buka halaman **[Simulator Sandbox Midtrans](https://simulator.sandbox.midtrans.com/)**.
4. Pilih tab **Virtual Account**, masukkan nomor VA Anda, lalu selesaikan pembayaran.
5. Perhatikan log di terminal Ngrok Anda! Jika muncul status `POST /api/webhook/midtrans 200 OK`, berarti data webhook berhasil diterima dan status booking Anda di panel admin maupun di halaman detail pelanggan telah otomatis berganti menjadi **PAID (Lunas)**!
