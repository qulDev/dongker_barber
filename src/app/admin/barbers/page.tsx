'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import styles from '../admin.module.css';
import Link from 'next/link';
import { ChevronLeft, Scissors, Calendar, ClipboardList, Plus, RefreshCw, Trash2, Edit, Users, Star, LogOut } from 'lucide-react';

export default function BarbersCRUD() {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    if (!confirm('Apakah Anda yakin ingin keluar?')) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Gagal logout: ' + error.message);
    } else {
      window.location.href = '/admin/login';
    }
  };
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [barberId, setBarberId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [rating, setRating] = useState('5.0');
  const [status, setStatus] = useState('active');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    fetchBarbers();
  }, []);

  async function fetchBarbers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      if (data) setBarbers(data);
    } catch (err: any) {
      console.error('Error fetching barbers:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `barbers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah avatar.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialization) {
      alert('Nama dan Spesialisasi wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      const barberData = {
        name,
        specialization,
        rating: parseFloat(rating),
        status,
        avatar_url: avatarUrl || null
      };

      if (barberId) {
        // Mode Update
        const { error } = await supabase
          .from('barbers')
          .update(barberData)
          .eq('id', barberId);

        if (error) throw error;
        alert('Data barber berhasil diperbarui.');
      } else {
        // Mode Insert
        const { error } = await supabase
          .from('barbers')
          .insert([barberData]);

        if (error) throw error;
        alert('Barber baru berhasil ditambahkan.');
      }

      handleCancel();
      fetchBarbers();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (barber: any) => {
    setBarberId(barber.id);
    setName(barber.name);
    setSpecialization(barber.specialization || '');
    setRating(String(barber.rating || 5.0));
    setStatus(barber.status || 'active');
    setAvatarUrl(barber.avatar_url || '');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus profile barber ini?')) return;

    try {
      const { error } = await supabase
        .from('barbers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBarbers(barbers.filter(b => b.id !== id));
      alert('Barber berhasil dihapus.');
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus data.');
    }
  };

  const handleCancel = () => {
    setBarberId(null);
    setName('');
    setSpecialization('');
    setRating('5.0');
    setStatus('active');
    setAvatarUrl('');
  };

  return (
    <div className={styles.adminContainer}>
      <Link href="/" className={styles.homeLink}>
        <ChevronLeft size={16} /> Kembali ke Beranda
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>Panel Admin Dongker Barber</h1>
        <button 
          onClick={handleLogout} 
          className={styles.btnLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <LogOut size={16} /> Keluar
        </button>
      </div>

      {/* Navigasi Sub-Admin */}
      <div className={styles.adminNav}>
        <Link href="/admin/services" className={styles.navLink}>
          <Scissors size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Kelola Layanan
        </Link>
        <Link href="/admin/barbers" className={`${styles.navLink} ${styles.activeNav}`}>
          <Users size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Kelola Barber
        </Link>
        <Link href="/admin/schedule" className={styles.navLink}>
          <Calendar size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Kelola Jadwal Barber
        </Link>
        <Link href="/admin/bookings" className={styles.navLink}>
          <ClipboardList size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Daftar Booking
        </Link>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Kolom Kiri: Form */}
        <div className={`${styles.formCard} styles.glassCard`}>
          <h2 className={styles.formTitle}>
            {barberId ? 'Edit Profil Barber' : 'Tambah Barber Master'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nama Barber</label>
              <input
                type="text"
                placeholder="Contoh: Budi Haircut"
                className={styles.input}
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Spesialisasi</label>
              <input
                type="text"
                placeholder="Contoh: Fade Cut Master / Beard Specialist"
                className={styles.input}
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Rating Master (1.00 - 5.00)</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                className={styles.input}
                value={rating}
                onChange={e => setRating(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status Kerja</label>
              <select
                className={styles.select}
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="active">Active (Tersedia)</option>
                <option value="inactive">Inactive (Cuti/Libur)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Foto Profil Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.85rem' }}
              />
              {uploading && <div style={{ fontSize: '0.8rem', color: 'var(--color-cta)', marginBottom: '0.5rem' }}>Mengunggah foto...</div>}
              {avatarUrl && (
                <div style={{ marginBottom: '1rem', width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-cta)', margin: '0 auto' }}>
                  <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <label className={styles.label} style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>Atau Tempel URL Gambar Manual</label>
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                className={styles.input}
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.btnSubmit} disabled={submitting}>
              {submitting ? 'Menyimpan...' : barberId ? 'Simpan Perubahan' : 'Tambah Barber'}
            </button>

            {barberId && (
              <button type="button" className={styles.btnCancel} onClick={handleCancel}>
                Batal
              </button>
            )}
          </form>
        </div>

        {/* Kolom Kanan: List */}
        <div className={`${styles.listCard} styles.glassCard`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Daftar Barber Master</h2>
            <button onClick={fetchBarbers} className={styles.btnEdit} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {loading ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nama & Spesialisasi</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th style={{ width: '100px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td>
                        <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                      </td>
                      <td>
                        <div className="skeleton" style={{ width: '110px', height: '1rem', marginBottom: '0.4rem' }} />
                        <div className="skeleton" style={{ width: '160px', height: '0.8rem' }} />
                      </td>
                      <td>
                        <div className="skeleton" style={{ width: '45px', height: '1rem' }} />
                      </td>
                      <td>
                        <div className="skeleton" style={{ width: '55px', height: '1rem', borderRadius: '4px' }} />
                      </td>
                      <td>
                        <div className={styles.actionCell} style={{ gap: '0.5rem' }}>
                          <div className="skeleton" style={{ width: '32px', height: '28px', borderRadius: '6px' }} />
                          <div className="skeleton" style={{ width: '32px', height: '28px', borderRadius: '6px' }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : barbers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Belum ada data barber.</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nama & Spesialisasi</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th style={{ width: '100px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {barbers.map(b => (
                    <tr key={b.id}>
                      <td>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--color-cta)' }}>
                          <img src={b.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250'} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{b.specialization}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', color: 'var(--color-cta)', fontWeight: 600 }}>
                          <Star size={12} fill="var(--color-cta)" /> {Number(b.rating).toFixed(1)}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', textTransform: 'capitalize', color: b.status === 'active' ? '#34D399' : '#F87171' }}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEdit(b)} className={styles.btnEdit} title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDelete(b.id)} className={styles.btnDelete} title="Hapus">
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
