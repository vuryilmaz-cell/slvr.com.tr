'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

interface Category {
  id: number
  name: string
  slug: string
}

interface Props {
  initialProducts: Product[]
  categories: Category[]
  initialCategory?: string
  initialSort?: string
}

export default function ProductsClient({
  initialProducts,
  categories,
  initialCategory,
  initialSort = 'display',
}: Props) {
  const router = useRouter()

  const [products, setProducts] = useState(initialProducts)
  const [currentSort, setCurrentSort] = useState(initialSort)
  const [activeCategory, setActiveCategory] = useState(initialCategory || '')
  const [isPending, startTransition] = useTransition()

  const buildUrl = (category: string, sort: string) => {
    const qs = new URLSearchParams()

    if (sort && sort !== 'display') {
      qs.set('sort', sort)
    }

    if (category) {
      return `/categories/${category}${qs.toString() ? `?${qs.toString()}` : ''}`
    }

    return `/products${qs.toString() ? `?${qs.toString()}` : ''}`
  }

  const fetchProducts = (category: string, sort: string) => {
    startTransition(async () => {
      try {
        const qs = new URLSearchParams()
        if (category) qs.set('category', category)
        if (sort) qs.set('sort', sort)

        const res = await fetch(`/api/products?${qs.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch {
        // sessiz hata
      }
    })
  }

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug)

    const nextUrl = buildUrl(slug, currentSort)
    router.push(nextUrl, { scroll: false })

    fetchProducts(slug, currentSort)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value
    setCurrentSort(sort)

    const nextUrl = buildUrl(activeCategory, sort)
    router.push(nextUrl, { scroll: false })

    fetchProducts(activeCategory, sort)
  }

  return (
    <section className="section section-white">
      <div className="container mx-auto px-4">
        <nav aria-label="Kategori filtreleri" className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-5 py-2.5 rounded border text-sm font-medium uppercase tracking-wide transition-all ${
              !activeCategory
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-300 hover:border-black hover:bg-gray-50'
            }`}
          >
            Tümü
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`px-5 py-2.5 rounded border text-sm font-medium uppercase tracking-wide transition-all ${
                activeCategory === category.slug
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-black hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>

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
                      alt={`Silvre ${product.name} - 999 ayar gümüş ${product.category.name.toLowerCase()} - el yapımı lüks mücevher`}
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
            <p className="text-gray-500 mb-6">Ürün bulunamadı.</p>
            <button
              onClick={() => handleCategoryChange('')}
              className="btn btn-secondary"
            >
              Tüm Ürünleri Göster
            </button>
          </div>
        )}
      </div>
    </section>
  )
}