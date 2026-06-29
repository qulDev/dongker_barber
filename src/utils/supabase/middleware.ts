import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Helper sinkronisasi cookie & proteksi rute di Middleware Next.js
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Memverifikasi token user (ini memvalidasi sesi secara aman dari server Supabase)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname.startsWith('/admin/login');
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  // Proteksi 1: Pengguna belum login mencoba mengakses halaman admin -> lempar ke login
  if (isAdminPath && !isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // Proteksi 2: Pengguna sudah login mencoba mengakses halaman login -> lempar ke dashboard admin
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/services';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
