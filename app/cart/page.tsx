'use client'

import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, loading: cartLoading, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Wait for auth to load
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Yükleniyor...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Sepetiniz Boş</h1>
        <p className="text-gray-600 mb-8">Sepeti görüntülemek için giriş yapmalısınız.</p>
        <Link href="/login" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
          Giriş Yap
        </Link>
      </div>
    )
  }

  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Yükleniyor...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Sepetiniz Boş</h1>
        <p className="text-gray-600 mb-8">Henüz ürün eklemediniz.</p>
        <Link href="/products" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 inline-block">
          Alışverişe Başla
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Sepetim ({cartCount} Ürün)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              const price = item.discount_price || item.price
              const subtotal = price * item.quantity

              return (
                <div key={item.product_id} className="bg-white border rounded-lg p-4 flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 relative bg-gray-100 rounded flex-shrink-0">
                    <Image
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                      sizes="96px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <Link href={`/products/${item.product_id}`} className="font-semibold hover:underline">
                      {item.name}
                    </Link>
                    <div className="text-sm text-gray-600 mt-1">
                      Birim Fiyat: {formatPrice(price)}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 border rounded hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="w-8 h-8 border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="text-right">
                    <div className="font-bold text-lg">{formatPrice(subtotal)}</div>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-red-600 text-sm hover:underline mt-2"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Sipariş Özeti</h2>
            
            <div className="space-y-2 mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Ara Toplam</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kargo</span>
                <span className="text-green-600">Ücretsiz</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Toplam</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 mb-3"
            >
              Sipariş Ver
            </button>

            <Link
              href="/products"
              className="block text-center text-sm text-gray-600 hover:underline"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
