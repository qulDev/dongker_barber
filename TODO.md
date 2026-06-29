# Rencana Pengembangan Lanjutan (TODO List) - Dongker Barber

Dokumen ini mencantumkan analisis kekurangan codebase saat ini dan daftar fitur serta pengamanan yang perlu dibangun selanjutnya agar aplikasi siap produksi (Production-Ready).

---

## 1. Keamanan & Autentikasi (High Priority)
*   [ ] **Proteksi Halaman Admin (Supabase Auth)**:
    *   *Kondisi Sekarang*: Rute `/admin/services` dan `/admin/schedule` dapat diakses oleh publik tanpa proteksi login.
    *   *Solusi*: 
        *   Buat halaman login admin di `src/app/admin/login/page.tsx`.
        *   Gunakan Next.js Middleware (`src/middleware.ts`) untuk memeriksa sesi aktif Supabase. Jika sesi tidak ada, redirect otomatis ke halaman login.
*   [ ] **Row Level Security (RLS) di Supabase**:
    *   *Kondisi Sekarang*: RLS dinonaktifkan atau bersifat publik demi mempermudah pembuatan purwarupa.
    *   *Solusi*: Konfigurasi RLS di database agar operasi tulis/hapus ke tabel `services`, `barbers`, dan `schedules` hanya diizinkan bagi pengguna dengan status terautentikasi (admin).

---

## 2. Dashboard Manajemen Pemesanan (High Priority)
*   [ ] **Halaman Daftar Booking Admin (`src/app/admin/bookings/page.tsx`)**:
    *   *Kondisi Sekarang*: Booking masuk tersimpan di database Supabase, namun admin/barber tidak memiliki antarmuka untuk melihat antrean pelanggan.
    *   *Solusi*: 
        *   Buat tabel monitoring booking masuk dengan status filter (Pending, Paid, Confirmed, Cancelled).
        *   Tambahkan filter berdasarkan Tanggal Booking dan Barber untuk mempermudah pengecekan harian di barbershop.
        *   Sediakan opsi bagi admin untuk mengubah status pesanan secara manual (misal: membatalkan pesanan atau menandai selesai).

---

## 3. Penyempurnaan Logika Reservasi (Medium Priority)
*   [ ] **Pencegahan Slot Waktu Lampau (Past Time Slots)**:
    *   *Kondisi Sekarang*: Pengguna masih bisa memilih jam di waktu lampau jika memilih tanggal hari ini (misal booking jam 10:00 pagi padahal waktu lokal sekarang sudah jam 14:00 siang).
    *   *Solusi*: Perbarui logika pemetaan jam di `BookingForm.tsx` agar membandingkan waktu sekarang (`new Date()`) jika tanggal yang dipilih adalah hari ini.
*   [ ] **Validasi Durasi Layanan vs Jam Operasional**:
    *   *Kondisi Sekarang*: Jika layanan berdurasi 90 menit, pengguna masih bisa memesan slot jam 19:30 padahal toko tutup jam 20:00.
    *   *Solusi*: Modifikasi pencarian slot agar jam mulai ditambah durasi layanan tidak melebihi jam operasional tutup barber (`end_time`).

---

## 4. Fitur Unggah Gambar (Medium Priority)
*   [ ] **Supabase Storage Integration**:
    *   *Kondisi Sekarang*: URL foto model rambut (di CRUD layanan) dan foto avatar (di admin barber) diinput secara manual menggunakan string URL teks.
    *   *Solusi*:
        *   Buat bucket baru bernama `assets` di Supabase Storage.
        *   Integrasikan input drag-and-drop file gambar di form admin yang mengunggah foto langsung ke Supabase Storage, lalu mengambil public URL-nya secara otomatis.

---

## 5. Notifikasi Pelanggan (Low-Medium Priority)
*   [ ] **Integrasi Notifikasi WhatsApp (Fonnte / WABA)**:
    *   *Kondisi Sekarang*: Tidak ada pemberitahuan otomatis ke pelanggan setelah booking sukses.
    *   *Solusi*: Picu API gateway WhatsApp saat webhook Midtrans mendeteksi status transaksi berubah menjadi `settlement/success` untuk mengirimkan ringkasan jadwal booking ke nomor HP pelanggan.
*   [ ] **Notifikasi Konfirmasi Email (Resend / Nodemailer)**:
    *   *Kondisi Sekarang*: Bukti booking hanya tersimpan di browser.
    *   *Solusi*: Kirim email konfirmasi otomatis berisi e-receipt dan detail alamat barbershop kepada pelanggan setelah pembayaran terkonfirmasi.

---

## 6. Sinkronisasi Real-time (Low Priority)
*   [ ] **Supabase Realtime Subscription**:
    *   *Kondisi Sekarang*: Di halaman `/booking/[id]`, pengguna harus me-refresh halaman manual untuk melihat perubahan status dari "Menunggu Pembayaran" menjadi "Pembayaran Sukses" setelah menyelesaikan transaksi di pop-up Midtrans.
    *   *Solusi*: Berlangganan secara realtime ke tabel `bookings` untuk mendengarkan event `UPDATE`. Ketika status di database berubah karena dipicu oleh webhook Midtrans, ubah tampilan UI secara instan.
