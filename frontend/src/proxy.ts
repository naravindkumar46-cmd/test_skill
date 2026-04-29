import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('sel_access_token');
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api') || request.url.includes(':4000')) {
    return NextResponse.next();
  }

  // 1. EXEMPTIONS: Don't redirect if we are already going to /login 
  // or fetching static assets/api
  if (
    pathname.startsWith('/login') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.') // for images/favicons
  ) { 
    return NextResponse.next();
  }

  // 2. THE GUARD: If no token and not on an exempt page, kick to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}