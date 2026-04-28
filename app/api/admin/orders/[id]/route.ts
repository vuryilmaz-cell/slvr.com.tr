import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET /api/admin/orders/[id] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: { id: true, email: true, fullName: true },
        },
        shippingAddress: true,
        billingAddress: true,
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
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

// PUT /api/admin/orders/[id] - Update order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
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
    
    if (status === 'shipped' && !updateData.shippingDate) {
      updateData.shippingDate = new Date()
    }
    
    if (status === 'delivered' && !updateData.deliveryDate) {
      updateData.deliveryDate = new Date()
    }
    
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { items: true, shippingAddress: true },
    })
    
    return NextResponse.json({ message: 'Sipariş güncellendi', order })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { error: { message: 'Sipariş güncellenirken hata oluştu' } },
      { status: 500 }
    )
  }
}
