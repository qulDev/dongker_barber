'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import styles from '../admin.module.css';
import Link from 'next/link';
import { ChevronLeft, Scissors, Calendar, Plus, RefreshCw, Trash2, ShieldAlert, ClipboardList } from 'lucide-react';

export default function BarberSchedule() {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<string>('');
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [isSpecificDate, setIsSpecificDate] = useState(true); // default override tanggal spesifik
  const [dayOfWeek, setDayOfWeek] = useState('1'); // 1 = Senin
  const [specificDate, setSpecificDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('20:00');
  const [isAvailable, setIsAvailable] = useState(true); // true = buka/masuk, false = tutup/libur

  // Load barbers on mount
  useEffect(() => {
    async function fetchBarbers() {
      const { data } = await supabase.from('barbers').select('*').eq('status', 'active');
      if (data && data.length > 0) {
        setBarbers(data);
        setSelectedBarberId(data[0].id);
      }
    }
    fetchBarbers();
  }, []);

  // Fetch schedules when selected barber changes
  useEffect(() => {
    if (selectedBarberId) {
      fetchSchedules(selectedBarberId);
    }
  }, [selectedBarberId]);

  async function fetchSchedules(barberId: string) {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('schedules')
        .select('*')
        .eq('barber_id', barberId)
        .order('specific_date', { ascending: true })
        .order('day_of_week', { ascending: true });

      if (data) setSchedules(data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) return;

    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSchedules(schedules.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus jadwal.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarberId) {
      alert('Pilih barber terlebih dahulu.');
      return;
    }

    if (isSpecificDate && !specificDate) {
      alert('Pilih tanggal spesifik.');
      return;
    }

    setSubmitting(true);
    try {
      const scheduleData = {
        barber_id: selectedBarberId,
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
        is_available: isAvailable,
        day_of_week: isSpecificDate ? null : parseInt(dayOfWeek),
        specific_date: isSpecificDate ? specificDate : null
      };

      const { error } = await supabase
        .from('schedules')
        .insert([scheduleData]);

      if (error) throw error;

      alert('Jadwal berhasil ditambahkan.');
      
      // Reset form
      setSpecificDate('');
      setIsAvailable(true);
      setStartTime('10:00');
      setEndTime('20:00');

      fetchSchedules(selectedBarberId);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan jadwal.');
    } finally {
      setSubmitting(false);
    }
  };

  const getDayName = (dayNum: number) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dayNum];
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
        <Link href="/admin/schedule" className={`${styles.navLink} ${styles.activeNav}`}>
          <Calendar size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Kelola Jadwal Barber
        </Link>
        <Link href="/admin/bookings" className={styles.navLink}>
          <ClipboardList size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Daftar Booking
        </Link>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label className={styles.label} style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Pilih Barber:</label>
        <select
          className={styles.select}
          value={selectedBarberId}
          onChange={e => setSelectedBarberId(e.target.value)}
          style={{ maxWidth: '400px' }}
        >
          {barbers.map(b => (
            <option key={b.id} value={b.id}>{b.name} ({b.specialization})</option>
          ))}
        </select>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Kolom Kiri: Form Jadwal Baru */}
        <div className={`${styles.formCard} styles.glassCard`}>
          <h2 className={styles.formTitle}>Atur Jadwal Kerja Baru</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tipe Jadwal</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    checked={isSpecificDate}
                    onChange={() => setIsSpecificDate(true)}
                  />
                  Tanggal Spesifik (Kustom)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    checked={!isSpecificDate}
                    onChange={() => setIsSpecificDate(false)}
                  />
                  Rutin Mingguan
                </label>
              </div>
            </div>

            {isSpecificDate ? (
              <div className={styles.formGroup}>
                <label className={styles.label}>Tanggal Khusus</label>
                <input
                  type="date"
                  className={styles.input}
                  value={specificDate}
                  onChange={e => setSpecificDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required={isSpecificDate}
                />
              </div>
            ) : (
              <div className={styles.formGroup}>
                <label className={styles.label}>Hari Kerja Rutin</label>
                <select
                  className={styles.select}
                  value={dayOfWeek}
                  onChange={e => setDayOfWeek(e.target.value)}
                >
                  <option value="1">Senin</option>
                  <option value="2">Selasa</option>
                  <option value="3">Rabu</option>
                  <option value="4">Kamis</option>
                  <option value="5">Jumat</option>
                  <option value="6">Sabtu</option>
                  <option value="0">Minggu</option>
                </select>
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Status Ketersediaan</label>
              <select
                className={styles.select}
                value={isAvailable ? 'true' : 'false'}
                onChange={e => setIsAvailable(e.target.value === 'true')}
              >
                <option value="true">Masuk / Buka Layanan</option>
                <option value="false">Libur / Tutup</option>
              </select>
            </div>

            {isAvailable && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Jam Mulai Kerja</label>
                  <input
                    type="time"
                    className={styles.input}
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    required={isAvailable}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Jam Selesai Kerja</label>
                  <input
                    type="time"
                    className={styles.input}
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    required={isAvailable}
                  />
                </div>
              </>
            )}

            <button type="submit" className={styles.btnSubmit} disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan Jadwal'}
            </button>
          </form>
        </div>

        {/* Kolom Kanan: List Jadwal */}
        <div className={`${styles.listCard} styles.glassCard`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Jadwal Aktif Barber</h2>
            <button onClick={() => fetchSchedules(selectedBarberId)} className={styles.btnEdit} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <RefreshCw size={12} /> Segarkan
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Memuat jadwal...</div>
          ) : schedules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Jadwal belum disetel. Barber akan menggunakan pengaturan default.</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tipe Jadwal</th>
                    <th>Detail Waktu / Hari</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(s => (
                    <tr key={s.id} style={{ opacity: s.is_available ? 1 : 0.65 }}>
                      <td>
                        {s.specific_date ? (
                          <span style={{ color: 'var(--color-cta)', fontWeight: 600 }}>Tanggal Spesifik</span>
                        ) : (
                          <span>Rutin Mingguan</span>
                        )}
                      </td>
                      <td>
                        {s.specific_date ? (
                          <strong>{s.specific_date}</strong>
                        ) : (
                          <strong>Hari {getDayName(s.day_of_week)}</strong>
                        )}
                        {s.is_available && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            Jam: {s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)} WIB
                          </div>
                        )}
                      </td>
                      <td>
                        {s.is_available ? (
                          <span style={{ color: '#34D399', fontWeight: 600, fontSize: '0.85rem' }}>Buka</span>
                        ) : (
                          <span style={{ color: '#F87171', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                            <ShieldAlert size={12} /> Libur
                          </span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actionCell} style={{ justifyContent: 'center' }}>
                          <button className={styles.btnDelete} onClick={() => handleDelete(s.id)}>
                            <Trash2 size={14} />
                          </button>
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
    </div>
  );
}
