import { createBrowserClient } from '@supabase/ssr';

// Helper inisialisasi Supabase Client untuk Client Components di Browser
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
