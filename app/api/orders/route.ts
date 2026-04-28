import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { z } from 'zod'

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().positive(),
    price: z.number().positive(),
  })).min(1),
  shippingAddress: z.object({
    title: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    addressLine: z.string(),
    city: z.string(),
    district: z.string(),
    postalCode: z.string().optional(),
  }),
  paymentMethod: z.string(),
  subtotal: z.number().positive(),
  shippingCost: z.number().min(0).default(0),
  total: z.number().positive(),
  notes: z.string().optional(),
})

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
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
    
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
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
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: { message: 'Siparişler alınırken hata oluştu' } },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
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
    
    const body = await request.json()
    const validatedData = orderSchema.parse(body)
    
    // Create order in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create shipping address
      const address = await tx.address.create({
        data: {
          userId: user.id,
          title: validatedData.shippingAddress.title,
          firstName: validatedData.shippingAddress.firstName,
          lastName: validatedData.shippingAddress.lastName,
          phone: validatedData.shippingAddress.phone,
          addressLine: validatedData.shippingAddress.addressLine,
          city: validatedData.shippingAddress.city,
          district: validatedData.shippingAddress.district,
          postalCode: validatedData.shippingAddress.postalCode,
        },
      })
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      
      // Create order
      const order = await tx.order.create({
        data: {
          userId: user.id,
          orderNumber,
          status: 'pending',
          subtotal: validatedData.subtotal,
          shippingCost: validatedData.shippingCost,
          total: validatedData.total,
          paymentMethod: validatedData.paymentMethod,
          shippingAddressId: address.id,
          billingAddressId: address.id,
          notes: validatedData.notes,
        },
      })
      
      // Create order items and update stock
      for (const item of validatedData.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          },
        })
        
        // Decrease stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        })
      }
      
      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: user.id },
      })
      
      return { orderId: order.id, orderNumber }
    })
    
    return NextResponse.json(
      {
        message: 'Sipariş oluşturuldu',
        orderId: result.orderId,
        orderNumber: result.orderNumber,
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
    
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: { message: 'Sipariş oluşturulurken hata oluştu' } },
      { status: 500 }
    )
  }
}
