import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'
import { z } from 'zod'

const productSchema = z.object({
  categoryId: z.number(),
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  stockQuantity: z.number().int().min(0).default(0),
  sku: z.string().optional(),
  material: z.string().default('925 Ayar Gümüş'),
  weight: z.number().positive().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  images: z.array(z.object({
    imageUrl: z.string(),
    isPrimary: z.boolean().default(false),
    displayOrder: z.number().int().default(0),
  })).optional(),
})

// GET /api/products - List products with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'displayOrder'
    const order = searchParams.get('order') || 'asc'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Check if user is admin
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = token ? await getUserFromToken(token) : null
    const isAdmin = user?.role === 'admin'
    
    const where: any = {}
    
    // Non-admin users only see active products
    if (!isAdmin) {
      where.isActive = true
    }
    
    if (category) {
      where.category = { slug: category }
    }
    
    if (featured === 'true') {
      where.isFeatured = true
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }
    
    const orderBy: any = {}
    const allowedSorts = ['createdAt', 'price', 'name', 'views', 'displayOrder']
    const sortField = allowedSorts.includes(sort) ? sort : 'displayOrder'
    orderBy[sortField] = order === 'desc' ? 'desc' : 'asc'
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.product.count({ where }),
    ])
    
    return NextResponse.json({
      products,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + products.length < total,
      },
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: { message: 'Ürünler alınırken hata oluştu' } },
      { status: 500 }
    )
  }
}

// POST /api/products - Create product (Admin only)
export async function POST(request: Request) {
  try {
    // Check authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = token ? await getUserFromToken(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Yetkiniz yok' } },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    // Validate input
    const validatedData = productSchema.parse(body)
    
    // Generate slug if not provided
    let slug = validatedData.slug || generateSlug(validatedData.name)
    
    // Ensure slug is unique
    const existingSlug = await prisma.product.findUnique({
      where: { slug },
    })
    
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }
    
    // Get next display order if not provided
    let displayOrder = validatedData.displayOrder
    if (!displayOrder) {
      const maxOrder = await prisma.product.findFirst({
        orderBy: { displayOrder: 'desc' },
        select: { displayOrder: true },
      })
      displayOrder = (maxOrder?.displayOrder || 0) + 1
    }
    
    // Create product
    const { images, ...productData } = validatedData
    
    const product = await prisma.product.create({
      data: {
        ...productData,
        slug,
        displayOrder,
        images: images && images.length > 0 ? {
          create: images.map((img, index) => ({
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary || index === 0,
            displayOrder: img.displayOrder || index,
          }))
        } : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    })
    
    return NextResponse.json(
      {
        message: 'Ürün başarıyla eklendi',
        product,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: { message: 'Ürün eklenirken hata oluştu' } },
      { status: 500 }
    )
  }
}
