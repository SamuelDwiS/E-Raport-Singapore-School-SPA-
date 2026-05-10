import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

  export function middleware(request: NextRequest) {
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/auth';

  // 1. Jika BELUM Login (role tidak ada di cookie)
  if (!role) {
    // JANGAN tendang jika memang sudah di halaman login, agar tidak infinite loop
    if (isLoginPage) {
      return NextResponse.next();
    }
    // Selain itu, baru tendang ke /auth
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // 2. Jika SUDAH Login (role ada)
  if (role) {
    // Jika mencoba akses /auth lagi padahal sudah login, arahkan ke dashboard masing-masing
    if (isLoginPage) {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }

    // Proteksi akses silang folder role lain
    if (pathname.startsWith('/teacher') && role !== 'teacher') {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
    if (pathname.startsWith('/parent') && role !== 'parent') {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
    if (pathname.startsWith('/mentor') && role !== 'mentor') {
        return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
  }

  return NextResponse.next();
}

// Tentukan rute mana saja yang dipantau middleware
export const config = {
  matcher: [
    '/admin/:path*', 
    '/teacher/:path*', 
    '/parent/:path*', 
    '/mentor/:path*', 
    '/auth'
  ],
}
