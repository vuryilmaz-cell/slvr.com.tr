import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET /api/admin/orders - Get all orders (Admin only)
export async function GET(request: NextRequest) {
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

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: { message: 'Siparişler getirilirken hata oluştu' } },
      { status: 500 }
    )
  }
}
