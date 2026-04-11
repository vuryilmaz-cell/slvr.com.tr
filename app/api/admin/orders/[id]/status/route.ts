import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { z } from 'zod'

const statusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
})

// PUT /api/admin/orders/:id/status - Update order status (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
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

    const orderId = parseInt(params.id)
    const body = await request.json()
    
    // Validate input
    const { status } = statusSchema.parse(body)

    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })

    return NextResponse.json({
      message: 'Sipariş durumu güncellendi',
      order
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Update order status error:', error)
    return NextResponse.json(
      { error: { message: 'Durum güncellenirken hata oluştu' } },
      { status: 500 }
    )
  }
}
