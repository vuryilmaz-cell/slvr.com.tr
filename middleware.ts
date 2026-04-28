export const runtime = 'nodejs'
import { NextResponse, NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths
  const publicPaths = ['/', '/products','/videos', '/categories', '/login', '/register', '/cart', '/checkout', '/order-success', '/orders', '/profile', '/shipping', '/faq', '/returns', '/about', '/contact', '/privacy', '/faq', '/addresses', '/admin']
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

  console.log('🔍 Middleware Debug:', {
    pathname,
    hasToken: !!token,
    token: token?.substring(0, 20) + '...'
  })

  if (!token) {
    console.log('❌ No token - redirecting to login')
    // Redirect to login for protected routes
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Verify token
  const JWT_SECRET = 'silvre-jewelry-super-secret-key-2026'
  let payload = null
  try {
    payload = jwt.verify(token, JWT_SECRET) as any
  } catch (err) {
    console.log('❌ JWT Verify Error:', err instanceof Error ? err.message : err)
  }  
  console.log('🔐 Token payload:', payload)
  
  if (!payload) {
    console.log('❌ Invalid token - redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin routes - check role
  if (pathname.startsWith('/admin')) {
    console.log('🎯 Admin route - role:', payload.role)
    if (payload.role !== 'admin') {
      console.log('❌ Not admin - redirecting to /')
      return NextResponse.redirect(new URL('/', request.url))
    }
    console.log('✅ Admin access granted')
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
}
