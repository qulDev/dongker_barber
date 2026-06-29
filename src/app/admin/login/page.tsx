'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './login.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ChevronLeft } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan Password wajib diisi.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr) {
        throw authErr;
      }

      // Login sukses, force reload/redirect ke dashboard agar Next.js middleware mendeteksi cookie baru
      router.push('/admin/services');
      router.refresh();
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(err.message || 'Gagal login. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={`${styles.loginCard} glass-card`}>
        <div className={styles.logo}>DONGKER</div>
        <div className={styles.title}>
          <ShieldCheck size={16} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Panel Admin
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Alamat Email</label>
            <input
              type="email"
              placeholder="admin@email.com"
              className={styles.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Mengecek Sesi...' : 'Masuk Panel Admin'}
          </button>
        </form>

        <Link href="/" className={styles.backLink}>
          <ChevronLeft size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
