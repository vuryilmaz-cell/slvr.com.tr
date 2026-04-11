'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string
  const { token, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && orderId && token) {
      fetchOrder()
    } else if (!authLoading && !token) {
      router.push('/login')
    }
  }, [orderId, token, authLoading])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else {
        router.push('/orders')
      }
    } catch (error) {
      console.error('Fetch order error:', error)
      router.push('/orders')
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

  if (loading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Yükleniyor...</p>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Link */}
      <Link href="/orders" className="text-sm text-gray-600 hover:underline mb-6 inline-block">
        ← Siparişlerime Dön
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Sipariş Detayları</h1>
                <p className="text-gray-600">Sipariş No: #{order.orderNumber || order.id}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>

            {/* Status Timeline */}
            <div className="mt-6 pt-6 border-t">
              <div className="space-y-3">
                <div className={`flex items-center gap-3 ${['pending', 'confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${['pending', 'confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-600' : 'bg-gray-300'}`}>
                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">Sipariş Alındı</span>
                </div>

                <div className={`flex items-center gap-3 ${['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-600' : 'bg-gray-300'}`}>
                    {['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">Onaylandı</span>
                </div>

                <div className={`flex items-center gap-3 ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-600' : 'bg-gray-300'}`}>
                    {['processing', 'shipped', 'delivered'].includes(order.status) ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">Hazırlanıyor</span>
                </div>

                <div className={`flex items-center gap-3 ${['shipped', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${['shipped', 'delivered'].includes(order.status) ? 'bg-green-600' : 'bg-gray-300'}`}>
                    {['shipped', 'delivered'].includes(order.status) ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">Kargoya Verildi</span>
                </div>

                <div className={`flex items-center gap-3 ${order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'}`}>
                    {order.status === 'delivered' ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">Teslim Edildi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Ürünler</h2>
            
            <div className="space-y-4">
              {order.items && order.items.map((item: any) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                    {item.product?.images?.[0]?.imageUrl && (
                      <Image
                        src={item.product.images[0].imageUrl}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product?.name || 'Ürün'}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Adet: {item.quantity}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                    <div className="text-sm text-gray-600">{formatPrice(item.price)} / adet</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary & Address */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Sipariş Özeti</h2>
            
            <div className="space-y-2 mb-4 pb-4 border-b">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ara Toplam</span>
                <span>{formatPrice(order.subtotal || order.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Kargo</span>
                <span className="text-green-600">Ücretsiz</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Toplam</span>
              <span>{formatPrice(order.total)}</span>
            </div>

            <div className="mt-4 pt-4 border-t text-sm">
              <div className="text-gray-600 mb-1">Ödeme Yöntemi:</div>
              <div className="font-medium">
                {order.paymentMethod === 'credit_card' && 'Kredi Kartı'}
                {order.paymentMethod === 'bank_transfer' && 'Havale/EFT'}
                {order.paymentMethod === 'cash_on_delivery' && 'Kapıda Ödeme'}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Teslimat Adresi</h2>
              
              <div className="text-sm space-y-1">
                <div className="font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </div>
                <div className="text-gray-600">{order.shippingAddress.addressLine}</div>
                <div className="text-gray-600">
                  {order.shippingAddress.district} / {order.shippingAddress.city}
                </div>
                {order.shippingAddress.postalCode && (
                  <div className="text-gray-600">{order.shippingAddress.postalCode}</div>
                )}
                <div className="text-gray-600 pt-2">{order.shippingAddress.phone}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
