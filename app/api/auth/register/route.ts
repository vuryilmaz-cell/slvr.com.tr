import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Geçerli bir email adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  fullName: z.string().min(2, 'Ad soyad en az 2 karakter olmalıdır'),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: { message: 'Bu email adresi zaten kayıtlı' } },
        { status: 400 }
      )
    }
    
    // Hash password
    const passwordHash = await hashPassword(validatedData.password)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        fullName: validatedData.fullName,
        phone: validatedData.phone,
        role: 'customer',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    })
    
    // Generate token
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })
    
    const response = NextResponse.json(
      {
        message: 'Kayıt başarılı',
        user,
        token,
      },
      { status: 201 }
    )
    
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
    
    console.error('Register error:', error)
    return NextResponse.json(
      { error: { message: 'Kayıt sırasında hata oluştu' } },
      { status: 500 }
    )
  }
}
