// Utility Pengiriman Notifikasi WhatsApp (Fonnte) & Email (Resend)
// Dibuat secara fail-safe: jika token/key kosong, program tetap berjalan normal.

export async function sendWhatsAppNotification(booking: any) {
  const token = process.env.FONNTE_API_TOKEN;
  if (!token || token === 'your-fonnte-token-here') {
    console.warn('FONNTE_API_TOKEN belum disetel di variabel lingkungan. Lewati pengiriman WhatsApp.');
    return;
  }

  const message = `Halo ${booking.customer_name},\n\n` +
    `Pembayaran Anda telah kami terima! Berikut adalah detail reservasi Anda di DONGKER BARBER:\n\n` +
    `✂️ Layanan: ${booking.services?.name || 'Potong Rambut'}\n` +
    `💈 Barber: ${booking.barbers?.name || 'Barber Master'}\n` +
    `📅 Tanggal: ${booking.booking_date}\n` +
    `⏰ Waktu: ${booking.start_time.substring(0, 5)} - ${booking.end_time.substring(0, 5)} WIB\n\n` +
    `📍 Alamat: 93XP+RM4, Jl. Sultan Kaharudin, Tj. Karang, Kec. Sekarbela, Kota Mataram, Nusa Tenggara Bar. 83115\n` +
    `📞 Hubungi Kami: +62 853-3751-6126\n\n` +
    `Sampai jumpa di barbershop!`;

  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: booking.customer_phone,
        message: message,
      }),
    });
    
    const result = await res.json();
    console.log('Fonnte API Response:', result);
  } catch (err) {
    console.error('Error sending WhatsApp notification via Fonnte:', err);
  }
}

export async function sendEmailNotification(booking: any) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 're_your_resend_api_key_here') {
    console.warn('RESEND_API_KEY belum disetel di variabel lingkungan. Lewati pengiriman Email.');
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;">
      <div style="text-align: center; border-bottom: 2px solid #FF5500; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="color: #FF5500; margin: 0; font-size: 24px; letter-spacing: 0.1em;">DONGKER BARBER</h1>
        <p style="color: #718096; margin: 5px 0 0; font-size: 14px; text-transform: uppercase;">E-Receipt & Konfirmasi Reservasi</p>
      </div>
      
      <p>Halo <strong>${booking.customer_name}</strong>,</p>
      <p>Pembayaran Anda telah sukses kami terima. Berikut adalah rincian detail jadwal reservasi pangkas rambut Anda:</p>
      
      <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #edf2f7;">
        <h3 style="margin-top: 0; color: #2d3748; border-bottom: 1px solid #edf2f7; padding-bottom: 8px; font-size: 16px;">Detail Reservasi</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #718096; width: 40%;">ID Transaksi</td>
            <td style="padding: 6px 0; font-weight: bold; color: #2d3748;">#${booking.id.substring(0, 8).toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #718096;">Gaya & Layanan</td>
            <td style="padding: 6px 0; font-weight: bold; color: #2d3748;">${booking.services?.name || 'Potong Rambut'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #718096;">Barber Master</td>
            <td style="padding: 6px 0; color: #FF5500; font-weight: bold;">${booking.barbers?.name || 'Barber Master'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #718096;">Tanggal Booking</td>
            <td style="padding: 6px 0; color: #2d3748;">${booking.booking_date}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #718096;">Waktu Pangkas</td>
            <td style="padding: 6px 0; color: #2d3748; font-weight: bold;">${booking.start_time.substring(0, 5)} - ${booking.end_time.substring(0, 5)} WIB</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #718096;">Total Biaya (Lunas)</td>
            <td style="padding: 6px 0; color: #2b6cb0; font-weight: bold;">Rp ${new Intl.NumberFormat('id-ID').format(booking.total_price)}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #fffaf0; padding: 15px; border-radius: 8px; border-left: 4px solid #FF5500; margin: 25px 0;">
        <h4 style="margin: 0 0 5px 0; color: #dd6b20; font-size: 14px;">📍 Lokasi Barbershop</h4>
        <p style="margin: 0; font-size: 13px; line-height: 1.4; color: #4a5568;">
          93XP+RM4, Jl. Sultan Kaharudin, Tj. Karang, Kec. Sekarbela, Kota Mataram, Nusa Tenggara Bar. 83115
        </p>
      </div>

      <p style="font-size: 13px; color: #718096; text-align: center; margin-top: 35px; border-top: 1px solid #edf2f7; padding-top: 15px;">
        Harap tiba 5-10 menit sebelum waktu reservasi Anda. Hubungi kami via Telepon/WA jika ada kendala kedatangan di <strong>+62 853-3751-6126</strong>.
      </p>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Dongker Barber <onboarding@resend.dev>', // Menggunakan domain sandbox bawaan Resend
        to: [booking.customer_email],
        subject: 'Konfirmasi Pembayaran & E-Receipt - Dongker Barber',
        html: html,
      }),
    });
    
    const result = await res.json();
    console.log('Resend API Response:', result);
  } catch (err) {
    console.error('Error sending Email notification via Resend:', err);
  }
}
