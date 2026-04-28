import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1, 'Kategori adı gerekli'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),  // ✅ EKLE
  isActive: z.boolean().optional()
})

// GET /api/admin/categories - Get all categories with product count
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = token ? await getUserFromToken(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Yetkiniz yok' } },
        { status: 403 }
      )
    }

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: { message: 'Kategoriler getirilirken hata oluştu' } },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = token ? await getUserFromToken(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Yetkiniz yok' } },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: { message: 'Bu isimde bir kategori zaten var' } },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description || null,
        imageUrl: validatedData.imageUrl || null,  // ✅ EKLE
        isActive: validatedData.isActive ?? true
      }
    })

    return NextResponse.json({
      message: 'Kategori oluşturuldu',
      category
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: { message: 'Kategori oluşturulurken hata oluştu' } },
      { status: 500 }
    )
  }
}
