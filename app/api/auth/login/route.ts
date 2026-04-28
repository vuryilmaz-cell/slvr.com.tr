import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, signToken } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Geçerli bir email adresi girin'),
  password: z.string().min(1, 'Şifre gerekli'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    
    if (!user) {
      return NextResponse.json(
        { error: { message: 'Email veya şifre hatalı' } },
        { status: 401 }
      )
    }
    
    if (!user.isActive) {
      return NextResponse.json(
        { error: { message: 'Hesabınız devre dışı' } },
        { status: 403 }
      )
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(validatedData.password, user.passwordHash)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: { message: 'Email veya şifre hatalı' } },
        { status: 401 }
      )
    }
    
    // Generate token
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })
    
    const response = NextResponse.json({
      message: 'Giriş başarılı',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    })
    
    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })
    
    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Login error:', error)
    return NextResponse.json(
      { error: { message: 'Giriş sırasında hata oluştu' } },
      { status: 500 }
    )
  }
}
