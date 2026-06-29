import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppNotification, sendEmailNotification } from '@/utils/notifications';
const midtransClient = require('midtrans-client');

// Inisialisasi API client Midtrans untuk verifikasi notifikasi
const apiClient = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-your-server-key',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-your-client-key'
});

export async function POST(request: Request) {
  try {
    const notificationJson = await request.json();

    // Verifikasi validitas notifikasi melalui SDK Midtrans
    const statusResponse = await apiClient.transaction().notification(notificationJson);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;

    console.log(`Webhook received: Order ID: ${orderId}, Status: ${transactionStatus}`);

    let paymentStatus = 'pending';
    let bookingStatus = 'pending';

    // Logika penentuan status berdasarkan spesifikasi Midtrans
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        paymentStatus = 'challenge';
        bookingStatus = 'pending';
      } else if (fraudStatus === 'accept') {
        paymentStatus = 'success';
        bookingStatus = 'paid';
      }
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'success';
      bookingStatus = 'paid';
    } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
      paymentStatus = 'failure';
      bookingStatus = 'cancelled';
    } else if (transactionStatus === 'pending') {
      paymentStatus = 'pending';
      bookingStatus = 'pending';
    }

    // 1. Update status pembayaran di tabel payments
    const { error: payUpdateErr } = await supabase
      .from('payments')
      .update({ 
        status: paymentStatus, 
        payment_method: paymentType,
        updated_at: new Date().toISOString() 
      })
      .eq('booking_id', orderId);

    if (payUpdateErr) {
      console.error('Failed to update payment status:', payUpdateErr);
    }

    // 2. Ambil status booking saat ini untuk mencegah pengiriman notifikasi ganda
    const { data: currentBooking } = await supabase
      .from('bookings')
      .select('status')
      .eq('id', orderId)
      .single();

    const isAlreadyPaid = currentBooking?.status === 'paid';

    // 3. Update status booking di tabel bookings
    const { error: bookingUpdateErr } = await supabase
      .from('bookings')
      .update({ status: bookingStatus })
      .eq('id', orderId);

    if (bookingUpdateErr) {
      console.error('Failed to update booking status:', bookingUpdateErr);
    }

    // 4. Kirim notifikasi otomatis jika status booking lunas (paid) dan belum pernah dibayar sebelumnya
    if (bookingStatus === 'paid' && !isAlreadyPaid) {
      try {
        const { data: bookingDetails, error: fetchErr } = await supabase
          .from('bookings')
          .select(`
            *,
            services:service_id (name, duration_minutes),
            barbers:barber_id (name)
          `)
          .eq('id', orderId)
          .single();

        if (fetchErr) {
          console.error('Failed to fetch booking details for notifications:', fetchErr);
        } else if (bookingDetails) {
          // Trigger notifikasi secara paralel (asinkronus)
          Promise.all([
            sendWhatsAppNotification(bookingDetails),
            sendEmailNotification(bookingDetails)
          ]).catch(err => console.error('Notification promise error:', err));
        }
      } catch (notifyErr) {
        console.error('Notification dispatch error:', notifyErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Status updated successfully' });
  } catch (error: any) {
    console.error('Midtrans Webhook Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
