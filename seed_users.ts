import { createClient } from '@supabase/supabase-js';

// Bun secara otomatis memuat variabel dari file .env ke process.env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus disetel di file .env Anda.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seed() {
  console.log('Mulai seeding akun admin credentials...');
  
  const email = 'admin@dongkerbarber.com';
  const password = 'admin12345'; // Sandi bawaan untuk login pertama kali

  // Ambil daftar user saat ini untuk memeriksa duplikasi
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Gagal mengambil daftar pengguna:', listError.message);
    return;
  }

  const existingUser = usersData.users.find(u => u.email === email);

  if (existingUser) {
    console.log(`[INFO] Akun dengan email ${email} sudah ada.`);
  } else {
    // Buat akun baru dengan konfirmasi email otomatis (email_confirm: true)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (createError) {
      console.error('Gagal membuat akun admin:', createError.message);
    } else {
      console.log(`[SUKSES] Akun admin berhasil dibuat!`);
      console.log(`Email   : ${newUser.user?.email}`);
      console.log(`Password: ${password}`);
    }
  }
}

seed().catch(err => {
  console.error('Terjadi kesalahan tak terduga:', err);
});
