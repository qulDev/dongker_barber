'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './home.module.css';
import { Scissors, Calendar, Clock, Star, MapPin, Phone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import BookingForm from './components/BookingForm';
import Link from 'next/link';

export default function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch services
        const { data: servicesData } = await supabase
          .from('services')
          .select('*')
          .order('price', { ascending: true });

        // Fetch barbers
        const { data: barbersData } = await supabase
          .from('barbers')
          .select('*')
          .eq('status', 'active');

        if (servicesData) setServices(servicesData);
        if (barbersData) setBarbers(barbersData);
      } catch (err) {
        console.error('Error fetching landing data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  return (
    <main className={styles.container}>
      {/* Floating Navbar */}
      <nav className={`${styles.navbar} ${styles.glassCard}`}>
        <div className={styles.logo}>
          <Scissors size={20} /> DONGKER<span>BARBER</span>
        </div>
        <ul className={styles.navLinks}>
          <li><a href="#services">Layanan</a></li>
          <li><a href="#barbers">Barber</a></li>
          <li>
            <button 
              className={`${styles.ctaButton} cursor-pointer`}
              onClick={() => setIsBookingOpen(true)}
              style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
            >
              Pesan Sekarang
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <Sparkles size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Pangkas Rambut Kelas Dunia
        </div>
        <h1 className={styles.heroTitle}>
          Tingkatkan Penampilan Anda ke Level Maksimal
        </h1>
        <p className={styles.heroSubtitle}>
          Sentuhan barber master profesional berpadu dengan atmosfer premium yang santai. Nikmati potongan rambut berkualitas tinggi dengan pendaftaran instan.
        </p>
        <button 
          className={`${styles.ctaButton} cursor-pointer`}
          onClick={() => setIsBookingOpen(true)}
        >
          Pesan Jadwal Pangkas <ArrowRight size={18} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
        </button>
      </section>

      {/* Services Section */}
      <section id="services" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Gaya Potongan & Layanan</h2>
          <p className={styles.sectionSubtitle}>
            Pilih dari rangkaian layanan premium kami, mulai dari potong rambut fade klasik hingga perawatan kulit kepala dan jenggot.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Memuat layanan...</div>
        ) : (
          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <div key={service.id} className={`${styles.serviceCard} ${styles.glassCard}`}>
                <div className={styles.iconWrapper}>
                  <Scissors size={32} />
                </div>
                <h3 className={styles.serviceName}>{service.name}</h3>
                <p className={styles.serviceDesc}>{service.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.servicePrice}>{formatRupiah(service.price)}</span>
                  <span className={styles.serviceDuration}>
                    <Clock size={14} /> {service.duration_minutes} Menit
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Barbers Section */}
      <section id="barbers" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Para Barber Master Kami</h2>
          <p className={styles.sectionSubtitle}>
            Temui profesional berpengalaman kami yang siap memberikan potongan rambut terbaik sesuai karakter Anda.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Memuat barber...</div>
        ) : (
          <div className={styles.barbersGrid}>
            {barbers.map((barber) => (
              <div key={barber.id} className={`${styles.barberCard} ${styles.glassCard}`}>
                <div className={styles.avatarWrapper}>
                  <img 
                    src={barber.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop'} 
                    alt={barber.name} 
                    className={styles.avatar} 
                  />
                </div>
                <h3 className={styles.barberName}>{barber.name}</h3>
                <p className={styles.barberSpec}>{barber.specialization || 'Professional Barber'}</p>
                <div className={styles.rating}>
                  <Star size={16} fill="var(--color-cta)" /> {Number(barber.rating).toFixed(1)} / 5.0
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Info Bar */}
      <section className={styles.section} style={{ paddingTop: '2rem' }}>
        <div className={`${styles.glassCard}`} style={{ padding: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <MapPin size={24} style={{ color: 'var(--color-cta)', marginBottom: '1rem' }} />
            <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Lokasi Barber</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Jl. Premium No. 45, Jakarta Selatan</p>
          </div>
          <div>
            <Clock size={24} style={{ color: 'var(--color-cta)', marginBottom: '1rem' }} />
            <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Jam Operasional</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Senin - Sabtu: 10:00 - 20:00 WIB</p>
          </div>
          <div>
            <Phone size={24} style={{ color: 'var(--color-cta)', marginBottom: '1rem' }} />
            <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Kontak Layanan</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>+62 812-3456-7890</p>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {isBookingOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.glassCard}`}>
            <button 
              className={styles.closeButton} 
              onClick={() => setIsBookingOpen(false)}
              aria-label="Tutup"
            >
              X
            </button>
            <BookingForm 
              services={services} 
              barbers={barbers} 
              onClose={() => setIsBookingOpen(false)} 
            />
          </div>
        </div>
      )}

      {/* Quick Link to Admin Panel */}
      <div className={styles.adminLink}>
        <Link href="/admin/services" className={styles.adminLinkBtn}>
          <ShieldCheck size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Panel Admin / Barber
        </Link>
      </div>
    </main>
  );
}