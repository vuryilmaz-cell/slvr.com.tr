import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
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
    
    const [
      totalProducts,
      pendingOrders,
      totalCustomers,
      monthlySales,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count({
        where: {
          status: {
            in: ['pending', 'confirmed', 'processing', 'shipped'],
          },
        },
      }),
      prisma.user.count({
        where: { role: 'customer' },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
          status: {
            not: 'cancelled',
          },
        },
        _sum: {
          total: true,
        },
      }),
    ])
    
    return NextResponse.json({
      totalProducts,
      pendingOrders,
      totalCustomers,
      monthlySales: monthlySales._sum.total || 0,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: { message: 'İstatistikler alınırken hata oluştu' } },
      { status: 500 }
    )
  }
}
