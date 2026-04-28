import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { z } from 'zod'

const categoryUpdateSchema = z.object({
  name: z.string().min(1, 'Kategori adı gerekli').optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),  // ✅ EKLE
  isActive: z.boolean().optional()
})

// PUT /api/admin/categories/:id - Update category
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = token ? await getUserFromToken(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Yetkiniz yok' } },
        { status: 403 }
      )
    }

    const categoryId = parseInt((await params).id)
    const body = await request.json()
    const validatedData = categoryUpdateSchema.parse(body)

    // Check if category exists
    const existing = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: { message: 'Kategori bulunamadı' } },
        { status: 404 }
      )
    }

    // If name is being updated, regenerate slug
    let updateData: any = { ...validatedData }
    
    if (validatedData.name && validatedData.name !== existing.name) {
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

      // Check if new slug conflicts with another category
      const slugConflict = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: categoryId }
        }
      })

      if (slugConflict) {
        return NextResponse.json(
          { error: { message: 'Bu isimde başka bir kategori var' } },
          { status: 400 }
        )
      }

      updateData.slug = slug
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: updateData
    })

    return NextResponse.json({
      message: 'Kategori güncellendi',
      category
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Update category error:', error)
    return NextResponse.json(
      { error: { message: 'Kategori güncellenirken hata oluştu' } },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/categories/:id - Delete category
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = token ? await getUserFromToken(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Yetkiniz yok' } },
        { status: 403 }
      )
    }

    const categoryId = parseInt((await params).id)

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: { message: 'Kategori bulunamadı' } },
        { status: 404 }
      )
    }

    // Check if category has products
    if (category._count.products > 0) {
      return NextResponse.json(
        { error: { message: `Bu kategoride ${category._count.products} ürün var. Önce ürünleri silin veya başka kategoriye taşıyın.` } },
        { status: 400 }
      )
    }

    // Delete category
    await prisma.category.delete({
      where: { id: categoryId }
    })

    return NextResponse.json({
      message: 'Kategori silindi'
    })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { error: { message: 'Kategori silinirken hata oluştu' } },
      { status: 500 }
    )
  }
}
