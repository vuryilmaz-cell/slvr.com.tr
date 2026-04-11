'use client'

import { useEffect, useState } from 'react'
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
  images: { imageUrl: string }[]
}

interface Category {
  id: number
  name: string
  slug: string
  imageUrl: string | null
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?featured=true'),
          fetch('/api/categories')
        ])

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        setFeaturedProducts(productsData.products || [])
        setCategories(categoriesData.categories || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section - Full Screen with Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden -mt-16 sm:-mt-[68px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/uploads/images/anasayfa_background_3.jpg"
            alt="Silvre Jewelry"
            fill
            className="object-cover"
            priority
            quality={95}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 relative z-10 pt-24 sm:pt-32">
          <div className="max-w-xl lg:max-w-2xl hero-content">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light italic text-white mb-8 leading-tight tracking-wide">
              Zarif & Lüks
            </h1>
            
            <div className="space-y-3 mb-10">
              <p className="text-base sm:text-lg md:text-xl text-white/95 font-light leading-relaxed">
                Gümüşle gelen şıklığın en yeni yorumu.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-white/95 font-light leading-relaxed">
                Kişiye özel %100 el işçiliği lüks gümüş takılar.
              </p>
            </div>

            <div>
              <Link 
                href="/products" 
                className="inline-block bg-white/10 backdrop-blur-sm border border-white/30 text-white px-10 py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500 shadow-lg hover:shadow-2xl hover:border-white"
              >
                Koleksiyonu Keşfet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Öne Çıkan Koleksiyon</h2>
          <p className="section-subtitle">El yapımı, özel tasarım parçalar</p>

          <div className="products-grid">
            {featuredProducts.map((product) => {
              const primaryImage = product.images[0]?.imageUrl || '/placeholder.jpg'
              const displayPrice = product.discountPrice || product.price

              return (
                <Link 
                  key={product.id} 
                  href={`/products/${product.slug}`}
                  className="group card hover-lift"
                >
                  <div className="aspect-square relative bg-gray-50 overflow-hidden">
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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

          {featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Henüz öne çıkan ürün eklenmemiş.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="section section-light">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Kategoriler</h2>
          <p className="section-subtitle">Size özel tasarlanmış koleksiyonlar</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group card hover-lift"
              >
                {category.imageUrl && (
                  <div className="aspect-square relative bg-gray-100 overflow-hidden">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </div>
                )}
                <div className="p-4 text-center">
                  <h3 className="font-medium text-base text-gray-900">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Henüz kategori eklenmemiş.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="section section-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-light italic mb-4 text-gray-900">
              Yeni Koleksiyonlardan Haberdar Olun
            </h2>
            <p className="text-gray-600 mb-8">
              Özel kampanyalar ve yeni ürünler için bültene abone olun
            </p>

            <form className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                required
                className="flex-1 form-input"
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Abone Ol
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
