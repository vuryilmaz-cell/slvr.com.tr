import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
    
    const { id } = await params
    const orderId = parseInt(id)
    
    const order = await prisma.order.findUnique({
      where: { 
        id: orderId,
        ...(user.role !== 'admin' && { userId: user.id }),
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true
          }
        },
        items: true
      },
    })
    
    if (!order) {
      return NextResponse.json(
        { error: { message: 'Sipariş bulunamadı' } },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ order })
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { error: { message: 'Sipariş alınırken hata oluştu' } },
      { status: 500 }
    )
  }
}
