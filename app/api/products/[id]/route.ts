import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { z } from 'zod'

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  discountPrice: z.number().positive().optional().nullable(),
  categoryId: z.number().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  sku: z.string().optional().nullable(),  
  material: z.string().optional().nullable(),
  weight: z.number().positive().optional().nullable(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  images: z.array(z.object({
    id: z.number().optional(),
    imageUrl: z.string(),
    isPrimary: z.boolean().default(false),
    displayOrder: z.number().int().default(0),
  })).optional(),
})

// GET /api/products/:id - Get product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          orderBy: {
            displayOrder: 'asc'
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: { message: 'Ürün bulunamadı' } },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: { message: 'Ürün getirilirken hata oluştu' } },
      { status: 500 }
    )
  }
}

// PUT /api/products/:id - Update product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const productId = parseInt(id)
    const body = await request.json()
    
    // Validate input
    const validatedData = productUpdateSchema.parse(body)

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: { message: 'Ürün bulunamadı' } },
        { status: 404 }
      )
    }

    // Update product
    const { images, ...productData } = validatedData
    
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...productData,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: true,
      }
    })

    // Update images if provided
    if (images && images.length > 0) {
       // Ensure only one primary
      const hasPrimary = images.some(img => img.isPrimary)
      // Delete old images
      await prisma.productImage.deleteMany({
        where: { productId }
      })

      // Create new images
      await prisma.productImage.createMany({
        data: images.map((img, index) => ({
          productId,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary || index === 0,
          displayOrder: img.displayOrder || index,
        }))
      })
    }

    return NextResponse.json({
      message: 'Ürün güncellendi',
      product
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: { message: 'Ürün güncellenirken hata oluştu' } },
      { status: 500 }
    )
  }
}

// DELETE /api/products/:id - Delete product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const productId = parseInt(id)

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: { message: 'Ürün bulunamadı' } },
        { status: 404 }
      )
    }

    // Delete product (cascade will delete related records)
    await prisma.product.delete({
      where: { id: productId }
    })

    return NextResponse.json({
      message: 'Ürün silindi'
    })
  } catch (error: any) {
    console.error('Delete product error:', error)
    
    // Foreign key constraint error
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: { message: 'Bu ürün siparişlerde kullanılıyor, silinemez. Önce ilgili siparişleri silmelisiniz.' } },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: { message: 'Ürün silinirken hata oluştu' } },
      { status: 500 }
    )
  }
}
