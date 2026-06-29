# Website Dongker Barber

Platform Pemesanan & Manajemen Barbershop premium yang dibangun menggunakan Next.js, Supabase, dan Midtrans Sandbox. Dilengkapi dengan penjadwalan slot secara real-time, notifikasi otomatis (Resend Email & Fonnte WhatsApp), dan alur pemesanan interaktif.

---

## Stack Teknologi
*   **Framework**: Next.js 15+ (App Router)
*   **Runtime**: Bun
*   **Database**: Supabase (PostgreSQL dengan RLS)
*   **Gerbang Pembayaran (Payment Gateway)**: Midtrans (Snap SDK)
*   **Gaya Tampilan (Styling)**: Vanilla CSS & CSS Modules (Tema premium gelap-emas)
*   **Notifikasi**: Resend (Email), Fonnte (WhatsApp)
*   **Sinkronisasi Realtime**: Supabase Realtime untuk pembaruan antrean instan

---

## Struktur Folder Proyek
```text
├── src/
│   ├── app/
│   │   ├── admin/             # Panel Admin (Layanan, Barber, Booking, Jadwal)
│   │   ├── api/               # Endpoint API (checkout, webhook, confirm)
│   │   ├── booking/           # Detail Pemesanan Pelanggan & Halaman Status Realtime
│   │   ├── components/        # Komponen global (BookingForm, Header)
│   │   └── globals.css        # CSS Global & Utility (Animasi skeleton loading)
│   ├── assets/                # Gambar portofolio
│   ├── lib/                   # Konfigurasi Client Supabase
│   └── utils/                 # Utilitas Notifikasi (Template WhatsApp & Email)
├── public/                    # Aset statis publik (foto, ikon)
├── documentation/             # Dokumentasi panduan teknis mendalam
└── package.json
```

---

## Panduan Memulai Cepat

### 1. Prasyarat
Pastikan Anda telah menginstal **Node.js** atau **Bun** di komputer Anda.

### 2. Menginstal Dependensi
Clone file proyek dan instal dependensi menggunakan Bun:
```bash
bun install
```

### 3. Konfigurasi Variabel Lingkungan (`.env`)
Buat file bernama `.env` di folder root proyek dan isi kredensial berikut:
```env
NEXT_PUBLIC_SUPABASE_URL=url_supabase_anda
NEXT_PUBLIC_SUPABASE_ANON_KEY=key_anon_supabase_anda
SUPABASE_SERVICE_ROLE_KEY=key_service_role_supabase_anda

NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=key_client_midtrans_anda
MIDTRANS_SERVER_KEY=key_server_midtrans_anda

FONNTE_API_TOKEN=token_fonnte_anda
RESEND_API_KEY=key_resend_anda
```

### 4. Seeder Database
Untuk menjalankan migrasi data awal dan mendaftarkan kredensial admin secara otomatis:
```bash
bun run seed_users.ts
```

### 5. Menjalankan Server Lokal
Jalankan server pengembangan lokal Anda:
```bash
bun dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## Dokumen Panduan Teknis Lengkap (Bahasa Indonesia)
Untuk penjelasan lebih detail mengenai subsistem proyek, silakan tinjau panduan berikut:
*   [Panduan Instalasi & Setup Lokal](file:///c:/DEV/JOKI/docker_mc/dongker_barber/documentation/id/installation.md)
*   [Skema Database & Kebijakan RLS](file:///c:/DEV/JOKI/docker_mc/dongker_barber/documentation/id/database.md)
*   [Integrasi Midtrans & Webhook Ngrok](file:///c:/DEV/JOKI/docker_mc/dongker_barber/documentation/id/payment_gateway.md)
*   [Integrasi Layanan Notifikasi (Email & WhatsApp)](file:///c:/DEV/JOKI/docker_mc/dongker_barber/documentation/id/notifications.md)
