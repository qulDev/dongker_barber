-- =========================================================================
-- Dongker Barber - Row Level Security (RLS) & Policies Setup
-- Jalankan kode SQL ini di Dashboard Supabase -> SQL Editor
-- =========================================================================

-- 1. AKTIFKAN RLS PADA TABEL UTAMA
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- 2. POLICIES UNTUK TABEL SERVICES
-- Semua orang (publik) dapat melihat daftar layanan
CREATE POLICY "Allow public read on services" 
ON services FOR SELECT 
USING (true);

-- Hanya pengguna terautentikasi (admin) yang dapat memodifikasi data layanan
CREATE POLICY "Allow admin write on services" 
ON services FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 3. POLICIES UNTUK TABEL BARBERS
-- Semua orang (publik) dapat melihat daftar barber
CREATE POLICY "Allow public read on barbers" 
ON barbers FOR SELECT 
USING (true);

-- Hanya pengguna terautentikasi (admin) yang dapat memodifikasi data barber
CREATE POLICY "Allow admin write on barbers" 
ON barbers FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 4. POLICIES UNTUK TABEL SCHEDULES
-- Semua orang (publik) dapat melihat jadwal barber
CREATE POLICY "Allow public read on schedules" 
ON schedules FOR SELECT 
USING (true);

-- Hanya pengguna terautentikasi (admin) yang dapat memodifikasi jadwal
CREATE POLICY "Allow admin write on schedules" 
ON schedules FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);
