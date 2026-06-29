-- =========================================================================
-- Dongker Barber - Supabase Realtime Replication Setup
-- Jalankan kode SQL ini di Dashboard Supabase -> SQL Editor
-- =========================================================================

-- Aktifkan Realtime Replication untuk tabel bookings agar perubahan status
-- dapat ditransmisikan secara instan ke browser pelanggan.
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
