-- =========================================================================
-- Dongker Barber - Row Level Security (RLS) & Idempotent Policies Setup
-- Jalankan kode SQL ini di Dashboard Supabase -> SQL Editor
-- =========================================================================

-- 1. AKTIFKAN RLS PADA TABEL UTAMA
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 2. POLICIES UNTUK TABEL SERVICES
DROP POLICY IF EXISTS "Allow public read on services" ON services;
CREATE POLICY "Allow public read on services" 
ON services FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow admin write on services" ON services;
CREATE POLICY "Allow admin write on services" 
ON services FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 3. POLICIES UNTUK TABEL BARBERS
DROP POLICY IF EXISTS "Allow public read on barbers" ON barbers;
CREATE POLICY "Allow public read on barbers" 
ON barbers FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow admin write on barbers" ON barbers;
CREATE POLICY "Allow admin write on barbers" 
ON barbers FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 4. POLICIES UNTUK TABEL SCHEDULES
DROP POLICY IF EXISTS "Allow public read on schedules" ON schedules;
CREATE POLICY "Allow public read on schedules" 
ON schedules FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow admin write on schedules" ON schedules;
CREATE POLICY "Allow admin write on schedules" 
ON schedules FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 5. POLICIES UNTUK TABEL BOOKINGS
DROP POLICY IF EXISTS "Allow public read on bookings" ON bookings;
CREATE POLICY "Allow public read on bookings" 
ON bookings FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow public insert on bookings" ON bookings;
CREATE POLICY "Allow public insert on bookings" 
ON bookings FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin write on bookings" ON bookings;
CREATE POLICY "Allow admin write on bookings" 
ON bookings FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 6. POLICIES UNTUK TABEL PAYMENTS
DROP POLICY IF EXISTS "Allow public read on payments" ON payments;
CREATE POLICY "Allow public read on payments" 
ON payments FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow public insert on payments" ON payments;
CREATE POLICY "Allow public insert on payments" 
ON payments FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on payments" ON payments;
CREATE POLICY "Allow public update on payments" 
ON payments FOR UPDATE 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin write on payments" ON payments;
CREATE POLICY "Allow admin write on payments" 
ON payments FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);
