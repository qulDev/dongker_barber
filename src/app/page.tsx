'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './home.module.css';
import { Scissors, Calendar, Clock, Star, MapPin, Phone, ArrowUpRight, ShieldCheck, Sparkles, X } from 'lucide-react';
import BookingForm from './components/BookingForm';
import Link from 'next/link';

export default function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

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

  // Fungsi pengelompokan kategori layanan secara dinamis
  const getCategory = (serviceName: string): string => {
    const name = serviceName.toLowerCase();
    if (name.includes('haircut') || name.includes('potong') || name.includes('kid')) {
      return 'HAIRCUTS';
    }
    if (name.includes('beard') || name.includes('shave') || name.includes('cukur') || name.includes('jenggot')) {
      return 'SHAVING';
    }
    return 'TREATMENTS';
  };

  const filteredServices = services.filter(s => {
    if (activeTab === 'ALL') return true;
    return getCategory(s.name) === activeTab;
  });

  return (
    <main className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <ul className={`${styles.navGroup} ${styles.navGroupLeft}`}>
          <li><a href="#portfolio" className={styles.navLink}>Galeri</a></li>
          <li><a href="#prices" className={styles.navLink}>Daftar Harga</a></li>
        </ul>
        
        <div className={styles.logo}>
          DONGKER
        </div>

        <ul className={`${styles.navGroup} ${styles.navGroupRight}`}>
          <li><a href="#barbers" className={styles.navLink}>Barber</a></li>
          <li>
            <button 
              className={`${styles.navLink} cursor-pointer`}
              onClick={() => setIsBookingOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--color-cta)' }}
            >
              Pesan Jadwal
            </button>
          </li>
        </ul>
      </nav>

      {/* Giant Slogan Header */}
      <header className={styles.giantHeader}>
        <h1 className={styles.giantTitle}>
          DONGKER <Scissors size={80} style={{ color: 'var(--color-cta)', transform: 'rotate(-30deg)' }} /> BARBER
        </h1>
      </header>

      {/* Hero Section (3-Column Layout) */}
      <section className={styles.heroGrid}>
        
        {/* Kolom Kiri: Tumpukan Foto Aksi Barber */}
        <div className={styles.heroLeft}>
          <div className={styles.heroImgCard}>
            <img 
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600" 
              alt="Barber Haircut Detail" 
              className={styles.heroImg}
            />
          </div>
          <div className={styles.heroImgCard}>
            <img 
              src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600" 
              alt="Barber Razor Shaving" 
              className={styles.heroImg}
            />
          </div>
        </div>

        {/* Kolom Tengah: Deskripsi & Kartu Promo */}
        <div className={styles.heroMiddle}>
          <div className={`${styles.descCard} glass-card`}>
            <p className={styles.descText}>
              <span>DONGKER BARBER</span> adalah salon rambut pria premium yang menyajikan perpaduan seni cukuran klasik dengan nuansa modern yang mewah. Kami mengutamakan detail, kenyamanan kulit kepala Anda, serta kepuasan hasil akhir yang disesuaikan dengan kontur wajah unik Anda.
            </p>
          </div>
          
          <a href="#" className={`${styles.discountCard} glass-card`} onClick={(e) => { e.preventDefault(); setIsBookingOpen(true); }}>
            <div>
              <h3 className={styles.discountTitle}>Diskon 20%</h3>
              <p className={styles.discountSub}>Khusus untuk pemesanan pertama Anda melalui website.</p>
            </div>
            <ArrowUpRight size={24} className={styles.discountArrow} />
          </a>
        </div>

        {/* Kolom Kanan: Tombol CTA Booking Raksasa */}
        <div className={styles.heroRight}>
          <button className={styles.bookingCtaCard} onClick={() => setIsBookingOpen(true)}>
            <span className={styles.bookingCtaText}>Pesan<br />Jadwal<br />Sekarang</span>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1rem', opacity: 0.8, color: '#000' }}>
              Buka 10:00 - 20:00 WIB
            </span>
          </button>
        </div>
      </section>

      {/* Bento Grid Portfolio ("GALERI KAMI") */}
      <section id="portfolio" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>PORTFOLIO KARYA KAMI</h2>
          <p className={styles.sectionSubtitle} style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
            Portofolio hasil karya dan potongan rambut terbaik dari para barber master kami.
          </p>
        </div>

        <div className={styles.bentoGrid}>
          {/* Bento 1: Classic Fade */}
          <div className={styles.bentoCard}>
            <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400" alt="Classic Fade Cut" className={styles.bentoImg} />
            <span className={styles.bentoOverlayText}>Classic Fade</span>
          </div>

          {/* Bento 2: Textured Crop */}
          <div className={styles.bentoCard}>
            <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400" alt="Textured Crop" className={styles.bentoImg} />
            <span className={styles.bentoOverlayText}>Textured Crop</span>
          </div>

          {/* Bento 3: Modern Pompadour */}
          <div className={styles.bentoCard}>
            <img src="https://images.unsplash.com/photo-1605497746444-ac9dbd324ce8?q=80&w=400" alt="Pompadour Styling" className={styles.bentoImg} />
            <span className={styles.bentoOverlayText}>Pompadour</span>
          </div>

          {/* Bento 4: Beard Grooming */}
          <div className={styles.bentoCard}>
            <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400" alt="Beard Grooming" className={styles.bentoImg} />
            <span className={styles.bentoOverlayText}>Beard Grooming</span>
          </div>

          {/* Bento 5: Solid Orange Booking Block */}
          <div className={`${styles.bentoCard} ${styles.bentoCta}`} onClick={() => setIsBookingOpen(true)}>
            Mulai<br />Tampil<br />Keren
          </div>

          {/* Bento 6: Side Part Classic */}
          <div className={styles.bentoCard}>
            <img src="https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=400" alt="Side Part Classic" className={styles.bentoImg} />
            <span className={styles.bentoOverlayText}>Side Part</span>
          </div>
        </div>
      </section>

      {/* Services & Prices Section */}
      <section id="prices" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Layanan & Harga</h2>
        </div>

        <div className={`${styles.priceCard} glass-card`}>
          {/* Watermark Gunting di belakang */}
          <Scissors size={280} className={styles.scissorsIconWatermark} />

          {/* Kategori Tabs */}
          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'ALL' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('ALL')}
            >
              Semua Layanan
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'HAIRCUTS' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('HAIRCUTS')}
            >
              Potong Rambut
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'SHAVING' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('SHAVING')}
            >
              Cukur Jenggot
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'TREATMENTS' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('TREATMENTS')}
            >
              Perawatan & Spa
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>Memuat daftar harga...</div>
          ) : (
            <div className={styles.servicesList}>
              {filteredServices.map(s => (
                <div key={s.id} className={styles.serviceItem}>
                  <div className={styles.serviceDetails}>
                    <h3 className={styles.serviceName}>{s.name}</h3>
                    <p className={styles.serviceDesc}>{s.description}</p>
                    <span className={styles.serviceDuration}>
                      <Clock size={12} /> {s.duration_minutes} Menit Durasi
                    </span>
                  </div>
                  <span className={styles.servicePrice}>{formatRupiah(s.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Barbers Section */}
      <section id="barbers" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Barber Master</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Memuat data barber...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {barbers.map((barber) => (
              <div key={barber.id} className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
                <div style={{ width: '130px', height: '130px', borderRadius: '50%', margin: '0 auto 1.5rem', overflow: 'hidden', border: '2px solid var(--color-cta)', background: '#121212' }}>
                  <img 
                    src={barber.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop'} 
                    alt={barber.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>{barber.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{barber.specialization || 'Professional Barber'}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: 'var(--color-cta)', fontWeight: 700 }}>
                  <Star size={16} fill="var(--color-cta)" /> {Number(barber.rating).toFixed(1)} / 5.0
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>DONGKER</div>
        <p className={styles.footerText}>
          93XP+RM4, Jl. Sultan Kaharudin, Tj. Karang, Kec. Sekarbela, Kota Mataram, Nusa Tenggara Bar. 83115<br />
          Layanan Telepon: +62 853-3751-6126 | Buka: 10:00 - 20:00 WIB
        </p>
        <Link href="/admin/services" className={styles.adminLinkBtn}>
          <ShieldCheck size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Panel Admin & Barber
        </Link>
      </footer>

      {/* Booking Form Modal */}
      {isBookingOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass-card`}>
            <button 
              className={styles.closeButton} 
              onClick={() => setIsBookingOpen(false)}
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
            <BookingForm 
              services={services} 
              barbers={barbers} 
              onClose={() => setIsBookingOpen(false)} 
            />
          </div>
        </div>
      )}
    </main>
  );
}