'use client';

import React, { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Calendar, Clock, Scissors, User, ArrowLeft, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: PageProps) {
  // Gunakan React.use() untuk meng-unwrap params di Next.js 15+
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;

    async function fetchBookingDetails() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            services:service_id (name, duration_minutes, price),
            barbers:barber_id (name, specialization)
          `)
          .eq('id', bookingId)
          .single();

        if (error) throw error;
        setBooking(data);
      } catch (err) {
        console.error('Error fetching booking details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookingDetails();
  }, [bookingId]);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 600 }}>
            <CheckCircle2 size={20} /> Pembayaran Sukses / Terkonfirmasi
          </div>
        );
      case 'cancelled':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 600 }}>
            <XCircle size={20} /> Pemesanan Dibatalkan
          </div>
        );
      default:
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(245, 158, 11, 0.2)', fontWeight: 600 }}>
            <AlertCircle size={20} /> Menunggu Pembayaran
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem', color: 'var(--color-text-muted)' }}>
        Memuat detail reservasi...
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1.5rem', padding: '2rem', textAlign: 'center' }}>
        <XCircle size={64} style={{ color: '#EF4444' }} />
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Pemesanan Tidak Ditemukan</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>ID pemesanan yang Anda cari tidak valid atau telah dihapus.</p>
        </div>
        <Link href="/" style={{ color: 'var(--color-cta)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '580px', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          {getStatusBadge(booking.status)}
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>Detail Reservasi Anda</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2.5rem', textAlign: 'center' }}>ID Booking: {booking.id}</p>

        {/* Detail Info Card */}
        <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Nama Pelanggan</span>
            <span style={{ fontWeight: 600 }}>{booking.customer_name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Scissors size={14} /> Layanan
            </span>
            <span style={{ fontWeight: 600 }}>{booking.services?.name || 'Layanan Dihapus'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <User size={14} /> Barber
            </span>
            <span style={{ fontWeight: 600 }}>{booking.barbers?.name || 'Barber Dihapus'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={14} /> Tanggal
            </span>
            <span style={{ fontWeight: 600 }}>{booking.booking_date}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={14} /> Jam / Waktu
            </span>
            <span style={{ fontWeight: 600 }}>{booking.start_time.substring(0, 5)} WIB</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Total Bayar</span>
            <span style={{ color: 'var(--color-cta)', fontWeight: 700, fontSize: '1.2rem' }}>{formatRupiah(booking.total_price)}</span>
          </div>
        </div>

        <Link href="/" style={{ width: '100%', textDecoration: 'none' }}>
          <button className="cursor-pointer" style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--color-text-light)', padding: '1rem', borderRadius: '50px', fontSize: '1rem', fontWeight: 600, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Kembali ke Beranda
          </button>
        </Link>
      </div>
    </div>
  );
}
