import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { z } from 'zod'

const statusSchema = z.object({
  isActive: z.boolean()
})

// PUT /api/admin/users/:id/status - Update user status (Admin only)
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

    const userId = parseInt(params.id)
    const body = await request.json()
    
    // Validate input
    const { isActive } = statusSchema.parse(body)

    // Prevent admin from deactivating themselves
    if (userId === user.id) {
      return NextResponse.json(
        { error: { message: 'Kendi hesabınızı devre dışı bırakamazsınız' } },
        { status: 400 }
      )
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      message: 'Kullanıcı durumu güncellendi',
      user: updatedUser
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Update user status error:', error)
    return NextResponse.json(
      { error: { message: 'Durum güncellenirken hata oluştu' } },
      { status: 500 }
    )
  }
}
