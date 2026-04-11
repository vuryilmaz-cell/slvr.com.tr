import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/addresses/[id] - Update address
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const addressId = parseInt(params.id)
    
    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: payload.id }
    })

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, firstName, lastName, phone, addressLine, city, district, postalCode, isDefault } = body

    // If setting as default, unset all other defaults
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

// DELETE /api/addresses/[id] - Archive address (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const addressId = parseInt(params.id)
    
    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: payload.id }
    })

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // Check if address is used in any orders
    const ordersCount = await prisma.order.count({
      where: {
        OR: [
          { shippingAddressId: addressId },
          { billingAddressId: addressId }
        ]
      }
    })

    if (ordersCount > 0) {
      // Address is used in orders - can't delete
      // Instead, we'll mark it as non-default and user won't see it in list
      return NextResponse.json({ 
        error: 'Bu adres siparişlerde kullanıldığı için silinemez' 
      }, { status: 400 })
    }

    // Safe to delete - no orders using this address
    await prisma.address.delete({
      where: { id: addressId }
    })

    return NextResponse.json({ message: 'Address deleted successfully' })
  } catch (error) {
    console.error('Delete address error:', error)
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 })
  }
}
