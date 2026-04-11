'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  discountPrice: number | null
  category: { id: number; name: string }
  images: { imageUrl: string }[]
}

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSort, setCurrentSort] = useState('display')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [categoryRes, productsRes] = await Promise.all([
          fetch(`/api/categories/${slug}`),
          fetch(`/api/products?category=${slug}&sort=${currentSort}`)
        ])

        if (categoryRes.ok) {
          const categoryData = await categoryRes.json()
          setCategory(categoryData.category)
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json()
          setProducts(productsData.products || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, currentSort])

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSort(e.target.value)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif italic mb-4">Kategori Bulunamadı</h1>
          <Link href="/products" className="btn btn-secondary">
            Tüm Ürünlere Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#faf8f5] to-[#f5f3f0] py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-gray-900 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-900 transition-colors">Ürünler</Link>
            <span>/</span>
            <span className="text-gray-900">{category.name}</span>
          </nav>

          <div className="text-center">
            <h1 className="text-hero font-serif font-light italic mb-4 text-gray-900">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
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
            >
              <option value="display">Önerilen</option>
              <option value="newest">En Yeni</option>
              <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
            </select>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => {
                const primaryImage = product.images[0]?.imageUrl || '/placeholder.jpg'
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
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      {product.discountPrice && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 text-xs font-medium rounded uppercase tracking-wide">
                          İndirim
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        {product.category.name}
                      </p>
                      <h3 className="font-medium text-base mb-3 line-clamp-2 text-gray-900">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-gray-900">
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
              <div className="mb-4">
                <svg 
                  className="mx-auto h-16 w-16 text-gray-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ürün Bulunamadı
              </h3>
              <p className="text-gray-500 mb-6">
                Bu kategoride henüz ürün bulunmuyor.
              </p>
              <Link 
                href="/products" 
                className="btn btn-secondary inline-block"
              >
                Tüm Ürünleri Gör
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
