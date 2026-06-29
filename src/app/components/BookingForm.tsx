'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './booking.module.css';
import { Calendar as CalendarIcon, Clock, User, Check, Scissors, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react';

interface BookingFormProps {
  services: any[];
  barbers: any[];
  onClose: () => void;
}

export default function BookingForm({ services, barbers, onClose }: BookingFormProps) {
  const [step, setStep] = useState(1);
  
  // Form States
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Availability States
  const [slots, setSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isTimeLoading, setIsTimeLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default date to today or tomorrow
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Ambil data jadwal & booking ketika barber & tanggal terpilih
  useEffect(() => {
    if (!selectedBarber || !selectedDate) return;

    async function checkAvailability() {
      setIsTimeLoading(true);
      try {
        const dateObj = new Date(selectedDate);
        const dayOfWeek = dateObj.getDay(); // 0 = Minggu, 1 = Senin, dst.

        // 1. Ambil jadwal barber (rutin mingguan atau override tanggal spesifik)
        const { data: schedules } = await supabase
          .from('schedules')
          .select('*')
          .eq('barber_id', selectedBarber.id);

        // 2. Ambil list booking barber di tanggal terpilih
        const { data: bookings } = await supabase
          .from('bookings')
          .select('start_time, end_time')
          .eq('barber_id', selectedBarber.id)
          .eq('booking_date', selectedDate)
          .neq('status', 'cancelled');

        // Cari override khusus tanggal ini
        const specificSchedule = schedules?.find(s => s.specific_date === selectedDate);
        // Cari jadwal mingguan rutin untuk hari ini
        const routineSchedule = schedules?.find(s => s.day_of_week === dayOfWeek && !s.specific_date);

        const activeSchedule = specificSchedule || routineSchedule;

        if (!activeSchedule || !activeSchedule.is_available) {
          // Barber libur / tidak tersedia pada hari/tanggal ini
          setSlots([]);
          setBookedSlots([]);
          return;
        }

        // 3. Generate slot waktu per 30 menit berdasarkan jam buka/tutup
        const availableSlots: string[] = [];
        const startStr = activeSchedule.start_time; // format "HH:MM:SS"
        const endStr = activeSchedule.end_time;

        const [startH, startM] = startStr.split(':').map(Number);
        const [endH, endM] = endStr.split(':').map(Number);

        let current = new Date();
        current.setHours(startH, startM, 0, 0);

        const endTimeLimit = new Date();
        endTimeLimit.setHours(endH, endM, 0, 0);

        while (current < endTimeLimit) {
          const hh = String(current.getHours()).padStart(2, '0');
          const mm = String(current.getMinutes()).padStart(2, '0');
          availableSlots.push(`${hh}:${mm}`);
          current.setMinutes(current.getMinutes() + 30);
        }

        // 4. Petakan slot yang sudah terisi (booked)
        const bookedTimes: string[] = [];
        bookings?.forEach(b => {
          // start_time dan end_time format "HH:MM:SS"
          const [sh, sm] = b.start_time.split(':').map(Number);
          const [eh, em] = b.end_time.split(':').map(Number);

          let bStart = new Date();
          bStart.setHours(sh, sm, 0, 0);
          const bEnd = new Date();
          bEnd.setHours(eh, em, 0, 0);

          let check = new Date(bStart);
          while (check < bEnd) {
            const hh = String(check.getHours()).padStart(2, '0');
            const mm = String(check.getMinutes()).padStart(2, '0');
            bookedTimes.push(`${hh}:${mm}`);
            check.setMinutes(check.getMinutes() + 30);
          }
        });

        setSlots(availableSlots);
        setBookedSlots(bookedTimes);
      } catch (err) {
        console.error('Gagal mengecek ketersediaan jadwal:', err);
      } finally {
        setIsTimeLoading(false);
      }
    }

    checkAvailability();
  }, [selectedBarber, selectedDate]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCheckout = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime || !name || !email || !phone) {
      alert('Mohon lengkapi semua data formulir.');
      return;
    }

    setIsSubmitting(true);

    // Hitung waktu selesai berdasarkan durasi layanan
    const [h, m] = selectedTime.split(':').map(Number);
    const start = new Date();
    start.setHours(h, m, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + selectedService.duration_minutes);

    const endTimeStr = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}:00`;
    const startTimeStr = `${selectedTime}:00`;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          barberId: selectedBarber.id,
          name,
          email,
          phone,
          date: selectedDate,
          startTime: startTimeStr,
          endTime: endTimeStr,
          price: selectedService.price
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Terjadi kesalahan saat membuat checkout.');
      }

      // Jalankan Midtrans Snap Popup
      if (typeof window !== 'undefined' && (window as any).snap) {
        (window as any).snap.pay(data.snapToken, {
          onSuccess: function (result: any) {
            window.location.href = `/booking/${data.bookingId}?status=success`;
          },
          onPending: function (result: any) {
            window.location.href = `/booking/${data.bookingId}?status=pending`;
          },
          onError: function (result: any) {
            window.location.href = `/booking/${data.bookingId}?status=error`;
          },
          onClose: function () {
            window.location.href = `/booking/${data.bookingId}?status=pending`;
          }
        });
      } else {
        // Fallback jika Snap SDK tidak termuat
        window.location.href = data.redirectUrl;
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem, silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
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
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Reservasi Barber</h2>
      
      {/* Step Indicators */}
      <div className={styles.steps}>
        <div className={`${styles.stepDot} ${step === 1 ? styles.activeStep : step > 1 ? styles.completedStep : ''}`}>1</div>
        <div className={`${styles.stepDot} ${step === 2 ? styles.activeStep : step > 2 ? styles.completedStep : ''}`}>2</div>
        <div className={`${styles.stepDot} ${step === 3 ? styles.activeStep : step > 3 ? styles.completedStep : ''}`}>3</div>
        <div className={`${styles.stepDot} ${step === 4 ? styles.activeStep : ''}`}>4</div>
      </div>

      {/* Step 1: Pilih Layanan */}
      {step === 1 && (
        <div className={styles.formSection}>
          <label className={styles.label}>Pilih Gaya & Layanan Pangkas</label>
          <div className={styles.list}>
            {services.map(s => (
              <div 
                key={s.id} 
                className={`${styles.selectableCard} ${selectedService?.id === s.id ? styles.selectedCard : ''}`}
                onClick={() => setSelectedService(s)}
              >
                <div className={styles.cardLeft}>
                  <Scissors size={18} style={{ color: 'var(--color-cta)' }} />
                  <div>
                    <div className={styles.cardTitle}>{s.name}</div>
                    <div className={styles.cardSub}>{s.duration_minutes} Menit</div>
                  </div>
                </div>
                <div className={styles.servicePrice}>{formatRupiah(s.price)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Pilih Barber */}
      {step === 2 && (
        <div className={styles.formSection}>
          <label className={styles.label}>Pilih Barber Master Anda</label>
          <div className={styles.list}>
            {barbers.map(b => (
              <div 
                key={b.id} 
                className={`${styles.selectableCard} ${selectedBarber?.id === b.id ? styles.selectedCard : ''}`}
                onClick={() => setSelectedBarber(b)}
              >
                <div className={styles.cardLeft}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--color-cta)' }}>
                    <img src={b.avatar_url} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div className={styles.cardTitle}>{b.name}</div>
                    <div className={styles.cardSub}>{b.specialization}</div>
                  </div>
                </div>
                {selectedBarber?.id === b.id && <Check size={20} style={{ color: 'var(--color-cta)' }} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Pilih Tanggal & Waktu */}
      {step === 3 && (
        <div className={styles.formSection}>
          <label className={styles.label}>Pilih Tanggal Booking</label>
          <input 
            type="date" 
            className={styles.input} 
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime(''); // Reset time on date change
            }}
            min={new Date().toISOString().split('T')[0]}
            style={{ marginBottom: '1.5rem' }}
          />

          <label className={styles.label}>Pilih Waktu / Slot Jam</label>
          {isTimeLoading ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)' }}>Mengecek ketersediaan slot...</div>
          ) : slots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'red', fontSize: '0.9rem' }}>Barber tidak tersedia pada tanggal ini. Silakan pilih tanggal lain atau barber lain.</div>
          ) : (
            <div className={styles.slotsGrid}>
              {slots.map(slot => {
                const isBooked = bookedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    className={`${styles.slotButton} ${selectedTime === slot ? styles.selectedSlot : ''} ${isBooked ? styles.disabledSlot : ''}`}
                    disabled={isBooked}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Konfirmasi & Kontak */}
      {step === 4 && (
        <div className={styles.formSection}>
          <div className={styles.summaryBlock}>
            <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Ringkasan Reservasi</h4>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Layanan</span>
              <span className={styles.summaryValue}>{selectedService?.name}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Barber</span>
              <span className={styles.summaryValue}>{selectedBarber?.name}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Waktu</span>
              <span className={styles.summaryValue}>{selectedDate} @ {selectedTime}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Durasi</span>
              <span className={styles.summaryValue}>{selectedService?.duration_minutes} Menit</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Total Pembayaran</span>
              <span className={styles.summaryValue}>{formatRupiah(selectedService?.price)}</span>
            </div>
          </div>

          <label className={styles.label}>Nama Lengkap</label>
          <input 
            type="text" 
            placeholder="Masukkan nama Anda" 
            className={styles.input} 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />

          <label className={styles.label}>Alamat Email</label>
          <input 
            type="email" 
            placeholder="nama@email.com" 
            className={styles.input} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />

          <label className={styles.label}>Nomor HP (WhatsApp)</label>
          <input 
            type="tel" 
            placeholder="0812xxxxxxxx" 
            className={styles.input} 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className={styles.buttonGroup}>
        {step > 1 && (
          <button className={styles.btnPrev} onClick={handlePrev}>
            <ChevronLeft size={16} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Kembali
          </button>
        )}
        
        {step < 4 ? (
          <button 
            className={styles.btnNext} 
            onClick={handleNext}
            disabled={
              (step === 1 && !selectedService) || 
              (step === 2 && !selectedBarber) || 
              (step === 3 && (!selectedDate || !selectedTime))
            }
          >
            Lanjut <ChevronRight size={16} style={{ marginLeft: '0.25rem', verticalAlign: 'middle' }} />
          </button>
        ) : (
          <button 
            className={styles.btnNext} 
            onClick={handleCheckout}
            disabled={isSubmitting || !name || !email || !phone}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <CreditCard size={18} />
            {isSubmitting ? 'Memproses...' : 'Bayar & Booking Sekarang'}
          </button>
        )}
      </div>
    </div>
  );
}
