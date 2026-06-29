import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Konfigurasi pencocokan rute (matcher) agar middleware hanya berjalan pada rute /admin/*
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
