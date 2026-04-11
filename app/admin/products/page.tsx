'use client'

import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  price: number
  stockQuantity: number
  isActive: boolean
  category: {
    name: string
  }
  images: Array<{
    imageUrl: string
    isPrimary: boolean
  }>
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('/api/products?limit=100', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('API Response:', data)
        console.log('Products:', data.products)
        setProducts(data.products || [])
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return
  
    try {
      const token = localStorage.getItem('token')  // ✅ EKLE
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`  // ✅ EKLE
        }
      })
  
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
        alert('Ürün silindi')
      } else {
        alert('Ürün silinemedi')
      }
    } catch (error) {
      alert('Hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Ürünler</h1>
        <Link
          href="/admin/products/new"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          + Yeni Ürün Ekle
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border">
          <p className="text-sm text-gray-600 mb-1">Toplam Ürün</p>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <p className="text-sm text-gray-600 mb-1">Aktif Ürün</p>
          <p className="text-3xl font-bold">
            {products.filter(p => p.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <p className="text-sm text-gray-600 mb-1">Stok Azalan</p>
          <p className="text-3xl font-bold text-orange-600">
            {products.filter(p => p.stockQuantity < 10).length}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {product.images && product.images.length > 0 && (
                        <img
                          src={product.images.find(img => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">#{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {product.category.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`${
                      product.stockQuantity < 10 ? 'text-orange-600 font-medium' : ''
                    }`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Düzenle
                      </Link>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(product.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Henüz ürün eklenmemiş. Yeni ürün eklemek için yukarıdaki butona tıklayın.
          </div>
        )}
      </div>
    </div>
  )
}
