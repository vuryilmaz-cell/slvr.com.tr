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

function parseMultiValue(value: string | null): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function buildPriceFilter(priceRanges: string[]) {
  if (!priceRanges.length) return undefined

  const ranges = priceRanges
    .map((range) => {
      if (range === '0-250') {
        return { price: { gte: 0, lte: 250 } }
      }
      if (range === '250-500') {
        return { price: { gt: 250, lte: 500 } }
      }
      if (range === '500-1000') {
        return { price: { gt: 500, lte: 1000 } }
      }
      if (range === '1000-plus') {
        return { price: { gt: 1000 } }
      }
      return null
    })
    .filter(Boolean)

  return ranges.length ? ranges : undefined
}

// GET /api/products - List products with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const discounted = searchParams.get('discounted')
    const search = searchParams.get('search')

    const genderValues = parseMultiValue(searchParams.get('gender'))
    const categoryValues = parseMultiValue(searchParams.get('categories'))
    const priceValues = parseMultiValue(searchParams.get('price'))

    const sortParam = searchParams.get('sort') || 'display'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = token ? await getUserFromToken(token) : null
    const isAdmin = user?.role === 'admin'

    const where: any = {}

    if (!isAdmin) {
      where.isActive = true
    }

    const andFilters: any[] = []

    if (category) {
      andFilters.push({
        category: { slug: category },
      })
    }

    if (categoryValues.length) {
      andFilters.push({
        category: {
          slug: { in: categoryValues },
        },
      })
    }

    if (featured === 'true') {
      andFilters.push({
        isFeatured: true,
      })
    }

    if (discounted === 'true') {
      andFilters.push({
        discountPrice: {
          not: null,
        },
      })
    }

    if (genderValues.length) {
      const genderConditions = genderValues.map((gender) => ({
        OR: [
          {
            name: {
              contains: gender,
            },
          },
          {
            description: {
              contains: gender,
            },
          },
        ],
      }))

      andFilters.push({
        OR: genderConditions,
      })
    }

    const priceFilter = buildPriceFilter(priceValues)
    if (priceFilter) {
      andFilters.push({
        OR: priceFilter,
      })
    }

    if (search) {
      andFilters.push({
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      })
    }

    if (andFilters.length) {
      where.AND = andFilters
    }

    let orderBy: any = { displayOrder: 'asc' }

    if (sortParam === 'newest') {
      orderBy = { createdAt: 'desc' }
    } else if (sortParam === 'price-asc') {
      orderBy = { price: 'asc' }
    } else if (sortParam === 'price-desc') {
      orderBy = { price: 'desc' }
    } else if (sortParam === 'name-asc') {
      orderBy = { name: 'asc' }
    } else if (sortParam === 'name-desc') {
      orderBy = { name: 'desc' }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
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
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = token ? await getUserFromToken(token) : null

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Yetkiniz yok' } },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = productSchema.parse(body)

    let slug = validatedData.slug || generateSlug(validatedData.name)

    const existingSlug = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    let displayOrder = validatedData.displayOrder
    if (!displayOrder) {
      const maxOrder = await prisma.product.findFirst({
        orderBy: { displayOrder: 'desc' },
        select: { displayOrder: true },
      })
      displayOrder = (maxOrder?.displayOrder || 0) + 1
    }

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
          })),
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