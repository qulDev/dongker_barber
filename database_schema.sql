-- =========================================================================
-- Dongker Barber - Database Schema & Initial Seed Data
-- Jalankan kode SQL ini di Dashboard Supabase -> SQL Editor
-- =========================================================================

-- 1. Tabel Services (Daftar Gaya Potongan Rambut)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Barbers (Profil Pemotong Rambut)
CREATE TABLE IF NOT EXISTS barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  specialization VARCHAR(255),
  rating DECIMAL(3, 2) DEFAULT 5.00,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Schedules (Jadwal Operasional Barber - Mingguan & Tanggal Spesifik)
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER, -- 0 (Minggu) s/d 6 (Sabtu) (NULL jika tanggal spesifik)
  specific_date DATE,  -- Tanggal spesifik (NULL jika jadwal mingguan rutin)
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true, -- false jika barber menetapkan hari libur pada tanggal itu
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel Bookings (Data Pemesanan Layanan)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  barber_id UUID REFERENCES barbers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, paid, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabel Payments (Transaksi Pembayaran Midtrans)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
  transaction_id VARCHAR(255),
  snap_token VARCHAR(255),
  payment_method VARCHAR(50),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, success, settlement, failure, expire, cancel
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- INITIAL SEED DATA (Jalankan ini untuk mengisi data awal demo)
-- =========================================================================

-- Insert Services
INSERT INTO services (name, description, price, duration_minutes) VALUES
('Classic Haircut', 'Gaya rambut klasik pria dengan cuci rambut, pijat kepala santai, dan handuk hangat.', 75000.00, 45),
('Beard Grooming & Shave', 'Cukur jenggot klimis atau rapikan kumis dengan hot towel & premium beard oil.', 50000.00, 30),
('Hair Coloring', 'Pewarnaan rambut profesional menggunakan cat rambut premium aman untuk kulit kepala.', 150000.00, 90),
('Premium Hair Spa', 'Perawatan kulit kepala mendalam, masker rambut anti-ketombe, dan pijat punggung relaksasi.', 90000.00, 60),
('Kid Haircut', 'Potong rambut anak-anak di bawah 10 tahun dengan sabar dan menyenangkan.', 60000.00, 30);

-- Insert Barbers
INSERT INTO barbers (name, specialization, rating, avatar_url) VALUES
('Ahmad Fadillah', 'Classic Haircut & Fade Specialist', 4.90, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'),
('Budi Hartono', 'Beard & Razor Shave Master', 4.80, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop'),
('Reza Pahlevi', 'Modern Hair Design & Coloring Specialist', 4.95, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop');

-- Insert Barber Routine Schedules (Senin - Sabtu, Jam 10:00 - 20:00)
-- 1 = Senin, 2 = Selasa, 3 = Rabu, 4 = Kamis, 5 = Jumat, 6 = Sabtu
INSERT INTO schedules (barber_id, day_of_week, start_time, end_time)
SELECT id, d, '10:00:00', '20:00:00'
FROM barbers, generate_series(1, 6) AS d;
