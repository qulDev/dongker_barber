'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import styles from '../admin.module.css';
import Link from 'next/link';
import { ChevronLeft, Scissors, Calendar, ClipboardList, RefreshCw, Check, X, Search, Phone, Mail } from 'lucide-react';

export default function BookingsMonitoring() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filter states
  const [filterDate, setFilterDate] = useState('');
  const [filterBarber, setFilterBarber] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Load initial data
  useEffect(() => {
    fetchBarbers();
    // Set default filter date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setFilterDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Fetch data on filters change
  useEffect(() => {
    fetchBookings();
  }, [filterDate, filterBarber, filterStatus]);

  async function fetchBarbers() {
    try {
      const { data } = await supabase
        .from('barbers')
        .select('*')
        .eq('status', 'active');
      if (data) setBarbers(data);
    } catch (err) {
      console.error('Error fetching barbers:', err);
    }
  }

  async function fetchBookings() {
    setLoading(true);
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          services:service_id (name, price, duration_minutes),
          barbers:barber_id (name)
        `)
        .order('booking_date', { ascending: true })
        .order('start_time', { ascending: true });

      // Terapkan filter tanggal jika diisi
      if (filterDate) {
        query = query.eq('booking_date', filterDate);
      }

      // Terapkan filter barber jika dipilih
      if (filterBarber) {
        query = query.eq('barber_id', filterBarber);
      }

      // Terapkan filter status jika dipilih
      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setBookings(data);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Update state secara lokal
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui status booking.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return { color: '#34D399', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)' };
      case 'confirmed':
        return { color: '#60A5FA', background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.2)' };
      case 'cancelled':
        return { color: '#F87171', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)' };
      default:
        return { color: '#FBBF24', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)' };
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className={styles.adminContainer}>
      <Link href="/" className={styles.homeLink}>
        <ChevronLeft size={16} /> Kembali ke Beranda
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>Panel Admin Dongker Barber</h1>
      </div>

      {/* Navigasi Sub-Admin */}
      <div className={styles.adminNav}>
        <Link href="/admin/services" className={styles.navLink}>
          <Scissors size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Kelola Layanan
        </Link>
        <Link href="/admin/schedule" className={styles.navLink}>
          <Calendar size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Kelola Jadwal Barber
        </Link>
        <Link href="/admin/bookings" className={`${styles.navLink} ${styles.activeNav}`}>
          <ClipboardList size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Daftar Booking
        </Link>
      </div>

      {/* Filter Section (Glass Card) */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
        <div>
          <label className={styles.label} style={{ marginBottom: '0.5rem' }}>Filter Tanggal</label>
          <input
            type="date"
            className={styles.input}
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
        </div>

        <div>
          <label className={styles.label} style={{ marginBottom: '0.5rem' }}>Filter Barber</label>
          <select
            className={styles.select}
            value={filterBarber}
            onChange={e => setFilterBarber(e.target.value)}
          >
            <option value="">Semua Barber</option>
            {barbers.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={styles.label} style={{ marginBottom: '0.5rem' }}>Filter Status</label>
          <select
            className={styles.select}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending (Menunggu Bayar)</option>
            <option value="paid">Paid (Lunas)</option>
            <option value="confirmed">Confirmed (Disetujui)</option>
            <option value="cancelled">Cancelled (Batal)</option>
          </select>
        </div>

        <div>
          <button 
            onClick={fetchBookings} 
            className={styles.btnSubmit} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0', height: '42px' }}
          >
            <RefreshCw size={16} /> Segarkan
          </button>
        </div>
      </div>

      {/* Bookings List Card (Glass Card) */}
      <div className={`${styles.listCard} glass-card`}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Antrean Reservasi Pelanggan</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Memuat data antrean...</div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Tidak ada data reservasi yang cocok dengan filter.</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Pelanggan</th>
                  <th>Layanan & Barber</th>
                  <th>Tanggal & Jam</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Ubah Status Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.customer_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                        <Phone size={12} /> {b.customer_phone}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                        <Mail size={12} /> {b.customer_email}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.services?.name || 'Layanan Dihapus'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-cta)', marginTop: '0.25rem' }}>
                        Barber: {b.barbers?.name || 'Barber Dihapus'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                        {formatRupiah(b.total_price)} • {b.services?.duration_minutes || 0} m
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.booking_date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Jam: {b.start_time.substring(0, 5)} - {b.end_time.substring(0, 5)} WIB
                      </div>
                    </td>
                    <td>
                      <span 
                        style={{ 
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '50px', 
                          fontSize: '0.8rem', 
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          ...getStatusStyle(b.status)
                        }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <select
                          className={styles.select}
                          value={b.status}
                          onChange={e => handleUpdateStatus(b.id, e.target.value)}
                          disabled={updatingId === b.id}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto', background: 'rgba(255,255,255,0.05)' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
