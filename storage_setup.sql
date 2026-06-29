-- =========================================================================
-- Dongker Barber - Supabase Storage Bucket & RLS Policies Setup
-- Jalankan kode SQL ini di Dashboard Supabase -> SQL Editor
-- =========================================================================

-- 1. BUAT BUCKET 'assets' JIKA BELUM ADA
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'assets', 
  'assets', 
  true, 
  5242880, -- Batas ukuran file 5MB (dalam bytes)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'] -- Jenis file yang diperbolehkan
)
ON CONFLICT (id) DO NOTHING;

-- 2. HAPUS POLICY LAMA JIKA ADA (Mencegah error duplikasi)
DROP POLICY IF EXISTS "Allow public read on assets bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated write on assets bucket" ON storage.objects;

-- 3. BUAT POLICY BUCKET 'assets'
-- Semua orang (publik) dapat melihat/membaca file gambar
CREATE POLICY "Allow public read on assets bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'assets');

-- Hanya admin terautentikasi yang dapat mengunggah & mengedit file
CREATE POLICY "Allow authenticated write on assets bucket" 
ON storage.objects FOR ALL 
TO authenticated 
USING (bucket_id = 'assets')
WITH CHECK (bucket_id = 'assets');
