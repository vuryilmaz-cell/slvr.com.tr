'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface CartItem {
  id: number
  product_id: number
  quantity: number
  name: string
  price: number
  discount_price: number | null
  slug: string
  image: string
}

interface CartContextType {
  items: CartItem[]
  loading: boolean
  addToCart: (productId: number, quantity?: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  clearCart: () => void
  cartTotal: number
  cartCount: number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { token, user } = useAuth()

  // Fetch cart on mount and when user changes
  useEffect(() => {
    if (user && token) {
      fetchCart()
    } else {
      setItems([])
      setLoading(false)
    }
  }, [user, token])

  const fetchCart = async () => {
    if (!token) return

    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Fetch cart error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!token) {
      throw new Error('Sepete eklemek için giriş yapmalısınız')
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Sepete eklenemedi')
      }

      await fetchCart()
    } catch (error) {
      throw error
    }
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!token) return

    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      })

      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error('Update quantity error:', error)
    }
  }

  const removeFromCart = async (productId: number) => {
    if (!token) return

    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error('Remove from cart error:', error)
    }
  }

  const clearCart = async () => {
    if (!token) return
    
    try {
      // Delete all items from backend
      for (const item of items) {
        await fetch(`/api/cart/${item.product_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      }
      
      // Clear local state
      setItems([])
    } catch (error) {
      console.error('Clear cart error:', error)
      // Clear local state anyway
      setItems([])
    }
  }

  const refreshCart = async () => {
    await fetchCart()
  }

  const cartTotal = items.reduce((total, item) => {
    const price = item.discount_price || item.price
    return total + (price * item.quantity)
  }, 0)

  const cartCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
