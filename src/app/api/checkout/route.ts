import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
const midtransClient = require('midtrans-client');

// Inisialisasi Midtrans Snap client
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-your-server-key',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-your-client-key'
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, barberId, name, email, phone, date, startTime, endTime, price } = body;

    // Validasi data input wajib
    if (!serviceId || !barberId || !name || !email || !phone || !date || !startTime || !endTime || !price) {
      return NextResponse.json({ success: false, error: 'Data tidak lengkap.' }, { status: 400 });
    }

    // 1. Simpan pemesanan ke Supabase bookings
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .insert([{
        service_id: serviceId,
        barber_id: barberId,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        booking_date: date,
        start_time: startTime,
        end_time: endTime,
        total_price: price,
        status: 'pending'
      }])
      .select()
      .single();

    if (bookingErr || !booking) {
      console.error('Database Booking Error:', bookingErr);
      return NextResponse.json({ success: false, error: bookingErr?.message || 'Gagal menyimpan data pemesanan.' }, { status: 500 });
    }

    // 2. Buat transaksi di Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: booking.id,
        gross_amount: Math.round(price)
      },
      customer_details: {
        first_name: name,
        email: email,
        phone: phone
      },
      // Halaman redirect opsional jika tidak menggunakan Snap modal pop-up
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking/${booking.id}`
      }
    };

    const transaction = await snap.createTransaction(parameter);

    if (!transaction || !transaction.token) {
      throw new Error('Gagal mendapatkan token transaksi dari Midtrans.');
    }

    // 3. Simpan record pembayaran awal ke payments
    const { error: paymentErr } = await supabase
      .from('payments')
      .insert([{
        booking_id: booking.id,
        transaction_id: booking.id,
        snap_token: transaction.token,
        amount: price,
        status: 'pending'
      }]);

    if (paymentErr) {
      console.error('Database Payment Error:', paymentErr);
      // Tetap lanjutkan karena snap token sudah berhasil dibuat, namun catat di log
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url
    });

  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
