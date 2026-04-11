'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Order {
  id: number
  orderNumber: string
  status: string
  total: number
  createdAt: string
  items: any[]
  shippingAddress: any
}

export default function OrdersPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    console.log('🔍 Orders - authLoading:', authLoading)
    console.log('🔍 Orders - user:', user)
    console.log('🔍 Orders - token:', token ? 'VAR' : 'YOK')
    if (authLoading) return // Still loading
    
    if (!user || !token) {
      router.push('/login')
      return
    }
    
    fetchOrders()
  }, [user, token, authLoading])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Fetch orders error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Onay Bekliyor',
      confirmed: 'Onaylandı',
      processing: 'Hazırlanıyor',
      shipped: 'Kargoya Verildi',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi',
    }
    return texts[status] || status
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Yükleniyor...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Siparişlerim</h1>
        <p className="text-gray-600 mb-8">Henüz siparişiniz bulunmuyor.</p>
        <Link href="/products" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 inline-block">
          Alışverişe Başla
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Siparişlerim</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border rounded-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <div className="text-sm text-gray-600">Sipariş No</div>
                    <div className="font-medium">#{order.orderNumber || order.id}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Tarih</div>
                    <div className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Toplam</div>
                    <div className="font-medium">{formatPrice(order.total)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-sm text-black hover:underline font-medium"
                  >
                    Detaylar →
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="px-6 py-4">
              <div className="space-y-3">
                {order.items && order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center gap-4 text-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium">{item.product?.name || 'Ürün'}</div>
                      <div className="text-gray-600">
                        Adet: {item.quantity} × {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {order.items && order.items.length > 3 && (
                  <div className="text-sm text-gray-600">
                    +{order.items.length - 3} ürün daha
                  </div>
                )}
              </div>

              {order.shippingAddress && (
                <div className="mt-4 pt-4 border-t text-sm">
                  <div className="text-gray-600 mb-1">Teslimat Adresi:</div>
                  <div className="text-gray-900">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    {' • '}
                    {order.shippingAddress.district} / {order.shippingAddress.city}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
