import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

interface RouteParams {
  params: { id: string }
}

// GET /api/admin/orders/[id] - Get single order
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('token')?.value
    
    const user = token ? await getUserFromToken(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Yetkiniz yok' } },
        { status: 403 }
      )
    }
    
    const order = await prisma.order.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
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
      },
    })
    
    if (!order) {
      return NextResponse.json(
        { error: { message: 'Sipariş bulunamadı' } },
        { status: 404 }
      )
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { error: { message: 'Sipariş alınırken hata oluştu' } },
      { status: 500 }
    )
  }
}

// PUT /api/admin/orders/[id] - Update order status
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('token')?.value
    
    const user = token ? await getUserFromToken(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Yetkiniz yok' } },
        { status: 403 }
      )
    }
    
    const { status, trackingNumber, adminNote } = await request.json()
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: { message: 'Geçersiz durum' } },
        { status: 400 }
      )
    }
    
    const updateData: any = {}
    
    if (status) updateData.status = status
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber
    if (adminNote !== undefined) updateData.adminNote = adminNote
    
    // Set shipping date when status changes to shipped
    if (status === 'shipped' && !updateData.shippingDate) {
      updateData.shippingDate = new Date()
    }
    
    // Set delivery date when status changes to delivered
    if (status === 'delivered' && !updateData.deliveryDate) {
      updateData.deliveryDate = new Date()
    }
    
    const order = await prisma.order.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      include: {
        items: true,
        shippingAddress: true,
      },
    })
    
    return NextResponse.json({
      message: 'Sipariş güncellendi',
      order,
    })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { error: { message: 'Sipariş güncellenirken hata oluştu' } },
      { status: 500 }
    )
  }
}
