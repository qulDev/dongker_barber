-- =========================================================================
-- Dongker Barber - Update Barber Master Profiles (Names & Avatars)
-- Jalankan kode SQL ini di Dashboard Supabase -> SQL Editor
-- =========================================================================

-- 1. UPDATE BARBER AHMAD FADILLAH -> DONGKER
UPDATE barbers 
SET name = 'Dongker', 
    avatar_url = '/assets/barber/dongker.png' 
WHERE name = 'Ahmad Fadillah' OR name = 'Dongker';

-- 2. UPDATE BUDI HARTONO -> JEK
UPDATE barbers 
SET name = 'Jek', 
    avatar_url = '/assets/barber/jek.png' 
WHERE name = 'Budi Hartono' OR name = 'Jek';

-- 3. UPDATE REZA PAHLEVI -> REJAL
UPDATE barbers 
SET name = 'Rejal', 
    avatar_url = '/assets/barber/rejal.png' 
WHERE name = 'Reza Pahlevi' OR name = 'Rejal';
