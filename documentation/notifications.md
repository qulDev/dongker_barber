# Notification Services (WhatsApp & Email)

This guide documents the notification services configured in the platform: **Resend** for email receipts and **Fonnte** for WhatsApp alert messages.

---

## 1. Flow of Notification Dispatch
Whenever a booking status is updated to `paid` (either through the secure client-side callback `onSuccess` or the server-side Midtrans webhook), the system triggers the notification dispatcher asynchronously:

```text
Status Updated to 'paid'
      │
      ├──> Send WhatsApp Alert (Fonnte API)
      └──> Send Email Receipt (Resend API)
```

---

## 2. WhatsApp Notification (Fonnte)

Fonnte API sends text alerts to the customer's phone number.

*   **API Endpoint**: `https://api.fonnte.com/send`
*   **Method**: `POST`
*   **Headers**: `Authorization: ${FONNTE_API_TOKEN}`
*   **Payload structure**:
    *   `target`: Customer phone number (must start with country code or `08...`)
    *   `message`: Custom templated text detailing booking ID, service name, barber, date, and reservation hours.

### Example Fonnte WhatsApp Template:
```text
Halo Rizqullah,

Pembayaran Anda untuk booking di Dongker Barber telah SUKSES dikonfirmasi!

Rincian Reservasi:
- ID Booking: 85dca4eb-38cf-4152-b0b5-e90898b79c3c
- Layanan: Classic Haircut (Rp 75.000)
- Barber: Dongker
- Jadwal: 2026-06-30 pukul 10:00 WIB

Silakan datang 10 menit sebelum waktu reservasi. Terima kasih!
```

---

## 3. Email Notification (Resend)

Resend API sends rich HTML email receipts to the customer's email inbox.

*   **API Endpoint**: `https://api.resend.com/emails`
*   **Method**: `POST`
*   **Headers**: `Authorization: Bearer ${RESEND_API_KEY}`
*   **Sender Address**: `Dongker Barber <noreply@dongkerbarber.com>` (or verified Sandbox sender in Resend dev accounts).
*   **Body Content**: Generates an elegant, styled HTML table receipt confirming booking status, price, and schedule.
