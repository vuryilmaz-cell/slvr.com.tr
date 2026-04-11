'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface OrderItem {
  id: number
  productId: number
  quantity: number
  price: number
  product?: {
    name: string
  }
}

interface Order {
  id: number
  orderNumber: string | null
  status: string
  subtotal: number
  shippingCost: number
  total: number
  paymentMethod: string
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  shippingCity: string
  shippingDistrict: string
  shippingZipCode: string | null
  notes: string | null
  createdAt: string
  user: {
    fullName: string
    email: string
  }
  items : OrderItem[]
}

const statusOptions = [
  { value: 'pending', label: 'Onay Bekliyor', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Onaylandı', color: 'bg-blue-100 text-blue-800' },
  { value: 'processing', label: 'Hazırlanıyor', color: 'bg-purple-100 text-purple-800' },
  { value: 'shipped', label: 'Kargoya Verildi', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', label: 'Teslim Edildi', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'İptal Edildi', color: 'bg-red-100 text-red-800' },
]

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (res.ok) {
        const data = await res.json()
        setOrder(data.order || data)  // ✅ Doğru - hem {order} hem direkt obje destekler
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        setOrder({ ...order!, status: newStatus })
        alert('Sipariş durumu güncellendi')
      } else {
        alert('Güncelleme başarısız')
      }
    } catch (error) {
      alert('Hata oluştu')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Sipariş bulunamadı</p>
        <Link href="/admin/orders" className="text-blue-600 hover:underline">
          ← Siparişlere Dön
        </Link>
      </div>
    )
  }

  const currentStatus = statusOptions.find(s => s.value === order.status)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/admin/orders"
          className="text-sm text-gray-600 hover:underline mb-2 inline-block"
        >
          ← Siparişlere Dön
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Sipariş #{order.orderNumber || order.id}
          </h1>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${currentStatus?.color}`}>
            {currentStatus?.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Ürünler</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
              {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.product?.name || `Ürün #${item.productId}`}
                      </p>
                      <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-sm text-gray-600">{formatPrice(item.price)} x {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ara Toplam:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Kargo:</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Toplam:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Teslimat Adresi</h2>
            </div>
            <div className="p-6">
              <p className="font-medium">{order.shippingName}</p>
              <p className="text-sm text-gray-600 mt-1">{order.shippingPhone}</p>
              <p className="text-sm text-gray-600 mt-2">{order.shippingAddress}</p>
              <p className="text-sm text-gray-600">
                {order.shippingDistrict} / {order.shippingCity}
                {order.shippingZipCode && ` - ${order.shippingZipCode}`}
              </p>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-lg border">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-bold">Sipariş Notu</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Müşteri Bilgileri</h2>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Ad Soyad</p>
                <p className="font-medium">{order.user.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{order.user.email}</p>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-lg border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Sipariş Bilgileri</h2>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Sipariş Tarihi</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ödeme Yöntemi</p>
                <p className="font-medium">
                  {order.paymentMethod === 'credit_card' ? 'Kredi Kartı' : 
                   order.paymentMethod === 'bank_transfer' ? 'Havale/EFT' : 
                   order.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-white rounded-lg border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Durum Güncelle</h2>
            </div>
            <div className="p-6">
              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={updating}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
