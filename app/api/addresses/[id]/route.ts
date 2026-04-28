import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/addresses/[id] - Update address
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { id } = await params
    const addressId = parseInt(id)
    
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: payload.id }
    })

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, firstName, lastName, phone, addressLine, city, district, postalCode, isDefault } = body

    if (isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: { userId: payload.id, isDefault: true },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data: {
        title,
        firstName,
        lastName,
        phone,
        addressLine,
        city,
        district,
        postalCode: postalCode || null,
        isDefault: isDefault || false,
      }
    })

    return NextResponse.json({ address })
  } catch (error) {
    console.error('Update address error:', error)
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 })
  }
}

// DELETE /api/addresses/[id] - Delete address
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { id } = await params
    const addressId = parseInt(id)
    
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: payload.id }
    })

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    const ordersCount = await prisma.order.count({
      where: {
        OR: [
          { shippingAddressId: addressId },
          { billingAddressId: addressId }
        ]
      }
    })

    if (ordersCount > 0) {
      return NextResponse.json({ 
        error: 'Bu adres siparişlerde kullanıldığı için silinemez' 
      }, { status: 400 })
    }

    await prisma.address.delete({
      where: { id: addressId }
    })

    return NextResponse.json({ message: 'Address deleted successfully' })
  } catch (error) {
    console.error('Delete address error:', error)
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 })
  }
}