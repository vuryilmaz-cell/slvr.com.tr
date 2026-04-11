'use client'

import MultiImageUpload from '@/components/MultiImageUpload'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: number
  name: string
}

interface ImageItem {
  imageUrl: string
  isPrimary: boolean
  displayOrder: number
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<ImageItem[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    categoryId: '',
    stock: '',
    sku: '',
    slug: '',
    material: '925 Ayar Gümüş',
    weight: '',
    displayOrder: '0', 
    isActive: true,
    isFeatured: false,
  })

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (images.length === 0) {
      alert('En az bir görsel ekleyin')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          discountPrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
          categoryId: parseInt(formData.categoryId),
          stockQuantity: parseInt(formData.stock),
          sku: formData.sku || undefined,
          slug: formData.slug || undefined,
          material: formData.material,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          displayOrder: parseInt(formData.displayOrder) || 0,
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          images: images.map((img, i) => ({
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary,
            displayOrder: i
          }))
        })
      })

      if (res.ok) {
        alert('Ürün başarıyla eklendi!')
        router.push('/admin/products')
      } else {
        const error = await res.json()
        alert(error.error?.message || 'Ürün eklenemedi')
      }
    } catch (error) {
      alert('Hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link 
            href="/admin/products"
            className="text-sm text-gray-600 hover:underline mb-2 inline-block"
          >
            ← Ürünlere Dön
          </Link>
          <h1 className="text-3xl font-bold">Yeni Ürün Ekle</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ürün Adı */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Ürün Adı *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Örn: Gümüş Kolye"
            />
          </div>

          {/* Açıklama */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Açıklama
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Ürün açıklaması..."
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Kategori *
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Kategori Seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium mb-2">
              SKU (Stok Kodu)
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Örn: SLVR-KLY-001"
            />
            <p className="text-xs text-gray-500 mt-1">Ürünün benzersiz stok takip kodu</p>
          </div>

          {/* Slug */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Slug (URL)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="gumus-kolye-925-ayar"
            />
            <p className="text-xs text-gray-500 mt-1">Boş bırakılırsa ürün adından otomatik oluşturulur</p>
          </div>

          {/* Fiyat */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Fiyat (₺) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="0.00"
            />
          </div>

          {/* İndirimli Fiyat */}
          <div>
            <label className="block text-sm font-medium mb-2">
              İndirimli Fiyat (₺)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.comparePrice}
              onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="0.00"
            />
          </div>

          {/* Stok */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Stok Miktarı *
            </label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="0"
            />
          </div>

          {/* Malzeme */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Malzeme
            </label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="925 Ayar Gümüş"
            />
          </div>

          {/* Ağırlık */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Ağırlık (gram)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="0.00"
            />
          </div>
{/* Sıralama */}
<div>
  <label className="block text-sm font-medium mb-2">
    Sıralama (Display Order)
  </label>
  <input
    type="number"
    value={formData.displayOrder}
    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
    placeholder="0"
  />
  <p className="text-xs text-gray-500 mt-1">Küçük sayı önce görünür (0 = en üstte)</p>
</div>
          {/* Resim Galerisi */}
          <div className="md:col-span-2">
            <MultiImageUpload
              images={images}
              onImagesChange={setImages}
            />
          </div>

          {/* Aktif */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Ürün Aktif</span>
            </label>
          </div>

          {/* Öne Çıkan */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Öne Çıkan Ürün</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
          </button>
          <Link
            href="/admin/products"
            className="text-gray-600 hover:underline"
          >
            İptal
          </Link>
        </div>
      </form>
    </div>
  )
}
