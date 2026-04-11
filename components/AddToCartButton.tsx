'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  productId: number
  stockQuantity: number
}

export default function AddToCartButton({ productId, stockQuantity }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      await addToCart(productId, 1)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (error: any) {
      if (error.message.includes('giriş')) {
        router.push('/login')
      } else {
        alert(error.message || 'Sepete eklenemedi')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <button className="w-full bg-green-600 text-white py-4 rounded-lg">
        ✓ Sepete Eklendi
      </button>
    )
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || stockQuantity === 0}
      className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {loading ? 'Ekleniyor...' : stockQuantity > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
    </button>
  )
}