import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === '/login'

  if (!token) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Parse session token (Base64 JSON)
  let user: any = null;
  try {
    const jsonString = Buffer.from(token, 'base64').toString('utf-8');
    user = JSON.parse(jsonString);
  } catch (error) {
    // Invalid token, clear and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('admin_session');
    return response;
  }

  const role = user?.role;

  // Prevent logged in users from visiting login page
  if (isLoginPage) {
    if (role === 'ADMIN') return NextResponse.redirect(new URL('/', request.url))
    if (role === 'EDITOR') return NextResponse.redirect(new URL('/dashboard/editor', request.url))
    if (role === 'REVIEWER') return NextResponse.redirect(new URL('/dashboard/reviewer', request.url))
    if (role === 'KAPRODI') return NextResponse.redirect(new URL('/dashboard/kaprodi', request.url))
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Enforce Editor routes
  if (pathname.startsWith('/dashboard/editor')) {
    if (role !== 'EDITOR') return NextResponse.redirect(new URL('/login', request.url))
    return NextResponse.next()
  }

  // Enforce Reviewer routes
  if (pathname.startsWith('/dashboard/reviewer')) {
    if (role !== 'REVIEWER') return NextResponse.redirect(new URL('/login', request.url))
    return NextResponse.next()
  }

  // Enforce Kaprodi routes
  if (pathname.startsWith('/dashboard/kaprodi')) {
    if (role !== 'KAPRODI') return NextResponse.redirect(new URL('/login', request.url))
    return NextResponse.next()
  }

  // Admin routes (everything else not explicitly editor/reviewer/kaprodi)
  if (role !== 'ADMIN') {
    if (role === 'EDITOR') return NextResponse.redirect(new URL('/dashboard/editor', request.url))
    if (role === 'REVIEWER') return NextResponse.redirect(new URL('/dashboard/reviewer', request.url))
    if (role === 'KAPRODI') return NextResponse.redirect(new URL('/dashboard/kaprodi', request.url))
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
