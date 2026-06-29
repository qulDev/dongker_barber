# Panduan Layanan Notifikasi (WhatsApp & Email)

Dokumen ini menjelaskan konfigurasi dan cara kerja sistem notifikasi otomatis di platform Dongker Barber menggunakan **Resend** (untuk tanda terima email) dan **Fonnte** (untuk pesan konfirmasi WhatsApp).

---

## 1. Alur Pengiriman Notifikasi
Notifikasi dikirimkan secara otomatis dan asinkron begitu sistem mendeteksi status pembayaran booking berubah menjadi `paid` (lunas):

```text
Status Booking menjadi 'paid'
      │
      ├──> Mengirim Pesan WhatsApp (Fonnte API)
      └──> Mengirim Tanda Terima Email (Resend API)
```

---

## 2. Layanan WhatsApp (Fonnte)

Fonnte API digunakan untuk mengirim pesan teks peringatan langsung ke nomor handphone pelanggan.

*   **Endpoint API**: `https://api.fonnte.com/send`
*   **Metode**: `POST`
*   **Header**: `Authorization: ${FONNTE_API_TOKEN}`
*   **Struktur Parameter**:
    *   `target`: Nomor HP pelanggan (bisa menggunakan format internasional atau lokal `08...`)
    *   `message`: Teks konfirmasi berisi detail ID pemesanan, jenis layanan, barber master, tanggal, dan jam kunjungan.

---

## 3. Layanan Email (Resend)

Resend API digunakan untuk mengirimkan tanda terima pembayaran dengan format tampilan HTML yang mewah langsung ke inbox email pelanggan.

*   **Endpoint API**: `https://api.resend.com/emails`
*   **Metode**: `POST`
*   **Header**: `Authorization: Bearer ${RESEND_API_KEY}`
*   **Alamat Pengirim (Sender)**: `Dongker Barber <noreply@dongkerbarber.com>` (atau pengirim sandbox terverifikasi pada akun pengembangan Resend).
*   **Konten Pesan**: Menyusun baris tabel HTML dinamis berisi rincian pembayaran lunas dan status pemesanan.
