import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// PUT /api/cart/[productId] - Update quantity
export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('token')?.value
    const user = token ? await getUserFromToken(token) : null
    
    if (!user) {
      return NextResponse.json(
        { error: { message: 'Giriş yapmanız gerekiyor' } },
        { status: 401 }
      )
    }
    
    const { quantity } = await request.json()
    const productId = parseInt(params.productId)
    
    if (quantity < 1) {
      return NextResponse.json(
        { error: { message: 'Miktar en az 1 olmalıdır' } },
        { status: 400 }
      )
    }
    
    // Check stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })
    
    if (!product) {
      return NextResponse.json(
        { error: { message: 'Ürün bulunamadı' } },
        { status: 404 }
      )
    }
    
    if (product.stockQuantity < quantity) {
      return NextResponse.json(
        { error: { message: 'Stokta yeterli ürün yok' } },
        { status: 400 }
      )
    }
    
    // Update cart item
    await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
      data: { quantity },
    })
    
    return NextResponse.json({
      message: 'Sepet güncellendi',
    })
  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { error: { message: 'Sepet güncellenirken hata oluştu' } },
      { status: 500 }
    )
  }
}

// DELETE /api/cart/[productId] - Remove item
export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('token')?.value
    const user = token ? await getUserFromToken(token) : null
    
    if (!user) {
      return NextResponse.json(
        { error: { message: 'Giriş yapmanız gerekiyor' } },
        { status: 401 }
      )
    }
    
    const productId = parseInt(params.productId)
    
    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    })
    
    return NextResponse.json({
      message: 'Ürün sepetten çıkarıldı',
    })
  } catch (error) {
    console.error('Remove from cart error:', error)
    return NextResponse.json(
      { error: { message: 'Ürün çıkarılırken hata oluştu' } },
      { status: 500 }
    )
  }
}
