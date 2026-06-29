'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import styles from '../admin.module.css';
import Link from 'next/link';
import { ChevronLeft, Scissors, Calendar, Plus, RefreshCw, Trash2, Edit, ClipboardList, Users } from 'lucide-react';

export default function ServicesCRUD() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setServices(data);
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (service: any) => {
    setServiceId(service.id);
    setName(service.name);
    setDescription(service.description || '');
    setPrice(String(service.price));
    setDuration(String(service.duration_minutes));
    setImageUrl(service.image_url || '');
  };

  const handleCancel = () => {
    setServiceId(null);
    setName('');
    setDescription('');
    setPrice('');
    setDuration('');
    setImageUrl('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setServices(services.filter(s => s.id !== id));
      if (serviceId === id) handleCancel();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus layanan.');
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !duration) {
      alert('Nama, harga, dan durasi wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      const serviceData = {
        name,
        description,
        price: parseFloat(price),
        duration_minutes: parseInt(duration),
        image_url: imageUrl || null
      };

      if (serviceId) {
        // Mode Update
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', serviceId);

        if (error) throw error;
        alert('Layanan berhasil diperbarui.');
      } else {
        // Mode Insert
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);

        if (error) throw error;
        alert('Layanan baru berhasil ditambahkan.');
      }

      handleCancel();
      fetchServices();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan data.');
    } finally {
      setSubmitting(false);
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
        <Link href="/admin/services" className={`${styles.navLink} ${styles.activeNav}`}>
          <Scissors size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Kelola Layanan
        </Link>
        <Link href="/admin/barbers" className={styles.navLink}>
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
            {serviceId ? 'Edit Gaya Potongan' : 'Tambah Gaya Potongan'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nama Layanan / Gaya Rambut</label>
              <input
                type="text"
                placeholder="Contoh: Modern Undercut"
                className={styles.input}
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Deskripsi Layanan</label>
              <textarea
                placeholder="Jelaskan detail layanan..."
                className={styles.input}
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                style={{ resize: 'none' }}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Harga (IDR)</label>
              <input
                type="number"
                placeholder="Contoh: 75000"
                className={styles.input}
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Durasi (Menit)</label>
              <input
                type="number"
                placeholder="Contoh: 45"
                className={styles.input}
                value={duration}
                onChange={e => setDuration(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Gambar Layanan / Potongan</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.85rem' }}
              />
              {uploading && <div style={{ fontSize: '0.8rem', color: 'var(--color-cta)', marginBottom: '0.5rem' }}>Mengunggah gambar...</div>}
              {imageUrl && (
                <div style={{ marginBottom: '1rem', width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={imageUrl} alt="Pratinjau" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <label className={styles.label} style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>Atau Tempel URL Gambar Manual</label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className={styles.input}
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.btnSubmit} disabled={submitting}>
              {submitting ? 'Menyimpan...' : serviceId ? 'Simpan Perubahan' : 'Tambah Layanan'}
            </button>

            {serviceId && (
              <button type="button" className={styles.btnCancel} onClick={handleCancel}>
                Batal
              </button>
            )}
          </form>
        </div>

        {/* Kolom Kanan: List */}
        <div className={`${styles.listCard} styles.glassCard`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Daftar Layanan Saat Ini</h2>
            <button onClick={fetchServices} className={styles.btnEdit} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <RefreshCw size={12} /> Segarkan
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Memuat data...</div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Belum ada layanan yang ditambahkan.</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Layanan</th>
                    <th>Harga</th>
                    <th>Durasi</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.description || '-'}
                        </div>
                      </td>
                      <td style={{ color: 'var(--color-cta)', fontWeight: 600 }}>{formatRupiah(s.price)}</td>
                      <td>{s.duration_minutes} Menit</td>
                      <td>
                        <div className={styles.actionCell} style={{ justifyContent: 'center' }}>
                          <button className={styles.btnEdit} onClick={() => handleEdit(s)}>
                            <Edit size={14} />
                          </button>
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
