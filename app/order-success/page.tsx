'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { token } = useAuth()
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId && token) {
      fetchOrder()
    } else {
      setLoading(false)
    }
  }, [orderId, token])

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
      }
    } catch (error) {
      console.error('Fetch order error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold mb-4">Siparişiniz Alındı!</h1>
        <p className="text-gray-600 mb-8">
          Siparişiniz başarıyla oluşturuldu. Sipariş detaylarını e-posta adresinize gönderdik.
        </p>

        {/* Order Details */}
        {order ? (
          <div className="bg-white border rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-bold mb-4">Sipariş Detayları</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sipariş Numarası:</span>
                <span className="font-medium">#{order.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Sipariş Tarihi:</span>
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Tutar:</span>
                <span className="font-medium text-lg">{formatPrice(order.total)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Ödeme Yöntemi:</span>
                <span className="font-medium">
                  {order.paymentMethod === 'credit_card' && 'Kredi Kartı'}
                  {order.paymentMethod === 'bank_transfer' && 'Havale/EFT'}
                  {order.paymentMethod === 'cash_on_delivery' && 'Kapıda Ödeme'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Durum:</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {order.status === 'pending' && 'Onay Bekliyor'}
                  {order.status === 'confirmed' && 'Onaylandı'}
                  {order.status === 'processing' && 'Hazırlanıyor'}
                  {order.status === 'shipped' && 'Kargoya Verildi'}
                  {order.status === 'delivered' && 'Teslim Edildi'}
                  {order.status === 'cancelled' && 'İptal Edildi'}
                </span>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600 mb-1">Teslimat Adresi:</div>
                <div className="text-sm">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                  {order.shippingAddress.addressLine}<br />
                  {order.shippingAddress.district} / {order.shippingAddress.city}<br />
                  {order.shippingAddress.phone}
                </div>
              </div>
            )}
          </div>
        ) : orderId ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <p className="text-yellow-800">Sipariş bilgileri yüklenirken bir sorun oluştu.</p>
            <p className="text-sm text-yellow-600 mt-2">Sipariş ID: {orderId}</p>
          </div>
        ) : (
          <div className="bg-gray-50 border rounded-lg p-6 mb-8">
            <p className="text-gray-600">Sipariş numarası bulunamadı.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/orders"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Siparişlerim
          </Link>
          <Link
            href="/products"
            className="border border-black text-black px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Alışverişe Devam Et
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-sm text-gray-600">
          <p>Siparişinizle ilgili güncellemeler e-posta ve SMS ile tarafınıza iletilecektir.</p>
          <p className="mt-2">Sorularınız için: <a href="mailto:destek@silvre.com" className="text-black hover:underline">destek@silvre.com</a></p>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Yükleniyor...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
