# Skema Database & Kebijakan Keamanan RLS

Dokumen ini menjelaskan struktur tabel database, relasi antar-tabel, serta konfigurasi Row-Level Security (RLS) di Supabase.

---

## 1. Skema Tabel Database

Aplikasi Dongker Barber menggunakan 4 tabel utama untuk operasional transaksi data.

### Tabel `services` (Layanan)
Menyimpan daftar layanan pangkas rambut, cukur jenggot, dan perawatan rambut.
*   `id`: `uuid` (Primary Key, otomatis: `gen_random_uuid()`)
*   `name`: `text` (Nama layanan)
*   `description`: `text` (Deskripsi detail layanan)
*   `price`: `numeric` (Harga layanan dalam mata uang Rupiah)
*   `duration_minutes`: `integer` (Durasi pengerjaan dalam menit)
*   `image_url`: `text` (Tautan opsional ke contoh gambar/gaya rambut)
*   `status`: `text` (Status aktif layanan, default: `'active'`)

### Tabel `barbers` (Barber Master)
Menyimpan daftar barber dan rating mereka.
*   `id`: `uuid` (Primary Key)
*   `name`: `text` (Nama barber)
*   `specialization`: `text` (Spesialisasi potongan rambut)
*   `rating`: `numeric` (Rata-rata rating bintang barber, default: `5.0`)
*   `avatar_url`: `text` (Tautan ke file foto barber)
*   `status`: `text` (Status aktif barber, default: `'active'`)

### Tabel `schedules` (Jadwal Barber)
Menyimpan jam kerja harian barber dan pengecualian hari libur khusus.
*   `id`: `uuid` (Primary Key)
*   `barber_id`: `uuid` (Foreign Key mengarah ke `barbers.id` ON DELETE CASCADE)
*   `day_of_week`: `integer` (0-6 untuk menandakan hari Minggu-Sabtu rutin)
*   `specific_date`: `date` (Tanggal spesifik jika ada libur/jadwal lembur khusus)
*   `start_time`: `time` (Jam mulai giliran kerja, e.g., "10:00:00")
*   `end_time`: `time` (Jam selesai giliran kerja, e.g., "20:00:00")
*   `is_available`: `boolean` (Apakah barber masuk kerja, default: `true`)

### Tabel `bookings` (Data Reservasi)
Menyimpan semua reservasi dari pelanggan dan status pelunasannya.
*   `id`: `uuid` (Primary Key)
*   `service_id`: `uuid` (Foreign Key mengarah ke `services.id`)
*   `barber_id`: `uuid` (Foreign Key mengarah ke `barbers.id`)
*   `customer_name`: `text` (Nama lengkap pelanggan)
*   `customer_email`: `text` (Alamat email pelanggan)
*   `customer_phone`: `text` (Nomor telepon/WhatsApp aktif pelanggan)
*   `booking_date`: `date` (Tanggal kunjungan)
*   `start_time`: `time` (Waktu mulai pemesanan)
*   `end_time`: `time` (Waktu selesai pemesanan)
*   `status`: `text` (Default: `'pending'`. Nilai: `'pending'`, `'paid'`, `'cancelled'`)
*   `price`: `numeric` (Total nominal yang harus dibayar)

---

## 2. Row-Level Security (RLS)
Supabase RLS diaktifkan di seluruh tabel untuk mengamankan data transaksi:
*   **Akses Publik (Anonim)**: Pelanggan umum dapat membaca (`SELECT`) daftar layanan, daftar barber master, jam kerja/jadwal yang tersedia, serta membuat data pemesanan baru (`INSERT`).
*   **Akses Admin (Terkonfirmasi)**: Tindakan mengubah data, menghapus, atau memperbarui detail layanan, barber, dan jadwal kerja dibatasi hanya untuk user admin yang login ke sistem (`authenticated`). Kebijakan lengkap dapat ditinjau pada file migrasi [`rls_policies.sql`](file:///c:/DEV/JOKI/docker_mc/dongker_barber/rls_policies.sql).
