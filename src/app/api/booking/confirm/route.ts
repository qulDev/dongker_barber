import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppNotification, sendEmailNotification } from '@/utils/notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ success: false, error: 'Data bookingId tidak ditemukan.' }, { status: 400 });
    }

    // 1. Ambil status booking saat ini untuk mencegah notifikasi ganda
    const { data: currentBooking, error: fetchErr } = await supabase
      .from('bookings')
      .select('status')
      .eq('id', bookingId)
      .single();

    if (fetchErr) {
      console.error('Confirm API: Error fetching booking status:', fetchErr);
    }

    if (currentBooking?.status === 'paid') {
      return NextResponse.json({ success: true, message: 'Booking sudah terkonfirmasi lunas.' });
    }

    // 2. Update status booking ke 'paid'
    const { data: bookingDetails, error: updateErr } = await supabase
      .from('bookings')
      .update({ status: 'paid' })
      .eq('id', bookingId)
      .select(`
        *,
        services:service_id (name, duration_minutes),
        barbers:barber_id (name)
      `)
      .single();

    if (updateErr || !bookingDetails) {
      console.error('Confirm API: Error updating booking status:', updateErr);
      return NextResponse.json({ success: false, error: updateErr?.message || 'Gagal memperbarui status booking.' }, { status: 500 });
    }

    // 3. Kirim notifikasi WhatsApp & Email secara asinkronus (fail-safe)
    Promise.all([
      sendWhatsAppNotification(bookingDetails),
      sendEmailNotification(bookingDetails)
    ]).catch(err => console.error('Confirm API: Error sending notifications:', err));

    return NextResponse.json({ success: true, message: 'Status updated successfully and notifications triggered.' });
  } catch (error: any) {
    console.error('Confirm API Catch Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
