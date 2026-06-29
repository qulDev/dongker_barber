# Panduan Instalasi & Setup Lokal

Panduan ini menjelaskan cara menginstal dependensi, mengonfigurasi variabel lingkungan, mengisi database awal (seeder), dan menjalankan server pengembangan lokal Dongker Barber.

## Prasyarat System
*   **Runtime**: Bun v1.0.0 atau lebih baru (sangat direkomendasikan) atau Node.js v18.0.0 atau lebih baru.
*   **Database**: Akun Supabase dan sebuah instance database PostgreSQL aktif.
*   **API Tokens**: Akun Sandbox Midtrans, akun Fonnte, dan akun Resend.

---

## Langkah-Langkah Instalasi

### 1. Dapatkan Kode Sumber
Arahkan terminal ke folder kerja Anda lalu clone/salin kode proyek ini.

### 2. Instal Dependensi Proyek
Jalankan perintah berikut di terminal Anda:
```bash
bun install
```

### 3. Mengatur Variabel Lingkungan (`.env`)
Buat file bernama `.env` di direktori utama (root) proyek. Isi kredensial berikut:
```env
# Konfigurasi Supabase
NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Konfigurasi Midtrans Sandbox
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-...
MIDTRANS_SERVER_KEY=SB-Mid-server-...

# Token Layanan Notifikasi Otomatis
FONNTE_API_TOKEN=token_whatsapp_fonnte_anda
RESEND_API_KEY=re_kunci_api_resend_anda
```

### 4. Setup Database & Seeder Kredensial Admin
1. Buka SQL Editor di dasbor Supabase Anda.
2. Jalankan skrip kebijakan keamanan RLS di file [`rls_policies.sql`](file:///c:/DEV/JOKI/docker_mc/dongker_barber/rls_policies.sql).
3. Jalankan script seeder lokal untuk mendaftarkan akun admin pertama Anda di database:
```bash
bun run seed_users.ts
```
*Kredensial Login Admin Default:*
*   **Email**: `admin@dongkerbarber.com`
*   **Password**: `admin12345`

### 5. Jalankan Aplikasi
Jalankan perintah berikut untuk menjalankan server Next.js di komputer Anda:
```bash
bun dev
```
Buka **`http://localhost:3000`** di browser untuk melihat website pelanggan, dan akses **`http://localhost:3000/admin/login`** untuk masuk ke Panel Admin.
