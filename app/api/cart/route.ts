import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET /api/cart - Get user's cart
export async function GET(request: Request) {
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
    
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    })
    
    // Format items
    const items = cartItems.map(item => ({
      id: item.id,
      product_id: item.productId,
      productId: item.productId,
      quantity: item.quantity,
      name: item.product.name,
      price: item.product.price,
      discount_price: item.product.discountPrice,
      slug: item.product.slug,
      image: item.product.images[0]?.imageUrl || '',
    }))
    
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: { message: 'Sepet alınırken hata oluştu' } },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: Request) {
  try {
    console.log('🔥 POST /api/cart çağrıldı')
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('token')?.value
    
    console.log('🔥 Token:', token ? 'VAR' : 'YOK')
    
    const user = token ? await getUserFromToken(token) : null
    
    console.log('🔥 User:', user ? user.id : 'YOK')
    
    if (!user) {
      return NextResponse.json(
        { error: { message: 'Giriş yapmanız gerekiyor' } },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    console.log('🔥 Request body:', JSON.stringify(body))
    console.log('🔥 body.productId:', body.productId)
    console.log('🔥 typeof body.productId:', typeof body.productId)
    
    const productId = body.productId
    const quantity = body.quantity || 1
    
    console.log('🔥 Final productId:', productId)
    console.log('🔥 Final quantity:', quantity)
    
    // Check product exists
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
    
    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    })
    
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity
      
      if (product.stockQuantity < newQuantity) {
        return NextResponse.json(
          { error: { message: 'Stokta yeterli ürün yok' } },
          { status: 400 }
        )
      }
      
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      })
      
      return NextResponse.json({
        message: 'Sepet güncellendi',
        itemId: existingItem.id,
      })
    } else {
      // Add new item
      const cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId,
          quantity,
        },
      })
      
      return NextResponse.json(
        {
          message: 'Sepete eklendi',
          itemId: cartItem.id,
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('❌ Add to cart error:', error)
    return NextResponse.json(
      { error: { message: 'Sepete eklenirken hata oluştu' } },
      { status: 500 }
    )
  }
}
