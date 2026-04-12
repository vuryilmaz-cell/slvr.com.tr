'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  discountPrice: number | null
  category: { id: number; name: string }
  images: { imageUrl: string; isPrimary?: boolean }[]
}

interface Props {
  initialProducts: Product[]
  categorySlug: string
  categoryName: string
}

export default function CategoryProductsClient({
  initialProducts,
  categorySlug,
  categoryName,
}: Props) {
  const [products, setProducts] = useState(initialProducts)
  const [currentSort, setCurrentSort] = useState('display')
  const [isPending, startTransition] = useTransition()

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value
    setCurrentSort(sort)

    startTransition(async () => {
      try {
        const res = await fetch(`/api/products?category=${categorySlug}&sort=${sort}`)
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch {
        // sessiz hata — mevcut liste kalır
      }
    })
  }

  return (
    <section className="section section-white">
      <div className="container mx-auto px-4">

        {/* Sort & Count */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{products.length}</span> ürün bulundu
          </p>
          <select
            className="form-input max-w-xs text-sm"
            value={currentSort}
            onChange={handleSortChange}
            disabled={isPending}
            aria-label="Sıralama"
          >
            <option value="display">Önerilen</option>
            <option value="newest">En Yeni</option>
            <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
          </select>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className={`products-grid transition-opacity ${isPending ? 'opacity-60' : 'opacity-100'}`}>
            {products.map((product) => {
              const primaryImage =
                product.images.find((img) => img.isPrimary)?.imageUrl ||
                product.images[0]?.imageUrl ||
                '/placeholder.jpg'
              const displayPrice = product.discountPrice || product.price

              return (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className="group card hover-lift"
                >
                  <div className="aspect-square relative bg-gray-50 overflow-hidden">
                    <Image
                      src={primaryImage}
                      alt={`Silvre ${product.name} - 999 ayar gümüş ${categoryName.toLowerCase()} - el yapımı`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {product.discountPrice && (
                      <span className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded">
                        İndirim
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {product.category.name}
                    </p>
                    <h2 className="font-serif font-light text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                      {product.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {formatPrice(displayPrice)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-6">Bu kategoride henüz ürün bulunmuyor.</p>
            <Link href="/products" className="btn btn-secondary">
              Tüm Ürünlere Dön
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
