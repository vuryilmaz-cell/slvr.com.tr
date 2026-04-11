import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

// Server Component - SEO için kritik
export const revalidate = 3600 // 1 saat cache

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

// SEO Metadata
export const metadata: Metadata = {
  title: 'Silvre - Lüks Gümüş Mücevher | 925 Ayar El Yapımı Gümüş Takılar',
  description: 'Türkiye\'nin en prestijli lüks gümüş mücevher markası. %100 el işçiliği, kişiye özel 925 ayar gümüş takı koleksiyonu. Kolye, küpe, yüzük, bileklik modelleri.',
  keywords: [
    'lüks gümüş mücevher',
    'premium gümüş takı',
    '925 ayar gümüş',
    'el yapımı gümüş takı',
    'özel tasarım gümüş',
    'butik mücevher',
    'silvre',
    'gümüş kolye',
    'gümüş küpe',
    'gümüş yüzük',
    'gümüş bileklik'
  ],
  openGraph: {
    title: 'Silvre - Lüks Gümüş Mücevher | El Yapımı 925 Ayar Takılar',
    description: 'Kişiye özel %100 el işçiliği lüks gümüş takılar. Zarif ve prestijli tasarımlar.',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://silvre.com.tr',
    siteName: 'Silvre',
    images: [
      {
        url: '/uploads/images/anasayfa_background_3.jpg',
        width: 1200,
        height: 630,
        alt: 'Silvre Lüks Gümüş Mücevher Koleksiyonu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silvre - Lüks Gümüş Mücevher',
    description: 'Kişiye özel %100 el işçiliği lüks gümüş takılar',
    images: ['/uploads/images/anasayfa_background_3.jpg'],
  },
  alternates: {
    canonical: 'https://silvre.com.tr',
  },
}

// Server-side data fetching
async function getFeaturedProducts() {
  return await prisma.product.findMany({
    where: {
      isFeatured: true,
      isActive: true,
    },
    include: {
      category: true,
      images: {
        orderBy: [
          { isPrimary: 'desc' },
          { displayOrder: 'asc' }
        ]
      },
    },
    take: 8,
    orderBy: {
      displayOrder: 'asc'
    }
  })
}

async function getCategories() {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' }
  })
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories()
  ])

  // Structured Data - Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Silvre',
    alternateName: 'Silvre Jewelry',
    url: 'https://silvre.com.tr',
    logo: 'https://silvre.com.tr/uploads/images/silvre-logo-black.png',
    description: 'Lüks gümüş mücevher ve el yapımı 925 ayar gümüş takı koleksiyonu',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TR',
      addressLocality: 'İstanbul',
    },
    sameAs: [
      'https://instagram.com/silvre',
      'https://facebook.com/silvre',
      'https://twitter.com/silvre',
    ],
  }

  // Structured Data - WebSite
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Silvre',
    url: 'https://silvre.com.tr',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://silvre.com.tr/products?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  // Structured Data - ItemList (Products)
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: featuredProducts.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        url: `https://silvre.com.tr/products/${product.slug}`,
        image: product.images[0]?.imageUrl,
        offers: {
          '@type': 'Offer',
          price: product.discountPrice || product.price,
          priceCurrency: 'TRY',
        },
      },
    })),
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero Section - Full Screen with Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden -mt-16 sm:-mt-[68px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/uploads/images/anasayfa_background_3.jpg"
            alt="Silvre lüks gümüş mücevher koleksiyonu - El yapımı 925 ayar gümüş takılar"
            fill
            className="object-cover"
            priority
            quality={95}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-24 sm:pt-32">
          <div className="max-w-xl lg:max-w-2xl hero-content">
            {/* SEO H1 - Görsel olarak gizli ama SEO için kritik */}
            <h1 className="sr-only">
              Silvre - Lüks Gümüş Mücevher | Kişiye Özel El Yapımı 925 Ayar Gümüş Takılar
            </h1>
            
            {/* Görsel başlık */}
            <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light italic text-white mb-8 leading-tight tracking-wide" aria-hidden="true">
              Zarif & Lüks
            </div>
            
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
                aria-label="Silvre gümüş takı koleksiyonunu keşfedin"
              >
                Koleksiyonu Keşfet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-white" aria-labelledby="featured-heading">
        <div className="container mx-auto px-4">
          <h2 id="featured-heading" className="section-title">Öne Çıkan Lüks Gümüş Koleksiyon</h2>
          <p className="section-subtitle">El yapımı, 925 ayar özel tasarım gümüş takılar</p>

          <div className="products-grid">
            {featuredProducts.map((product) => {
              const primaryImage = product.images[0]?.imageUrl || '/placeholder.jpg'
              const displayPrice = product.discountPrice || product.price

              return (
                <article 
                  key={product.id}
                  itemScope
                  itemType="https://schema.org/Product"
                >
                  <Link 
                    href={`/products/${product.slug}`}
                    className="group card hover-lift block"
                    aria-label={`${product.name} - ${product.category.name} - ${formatPrice(displayPrice)}`}
                  >
                    <div className="aspect-square relative bg-gray-50 overflow-hidden">
                      <Image
                        src={primaryImage}
                        alt={`${product.name} - 925 ayar gümüş ${product.category.name.toLowerCase()} - Silvre lüks mücevher`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        itemProp="image"
                      />
                      {product.discountPrice && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 text-xs font-medium rounded uppercase tracking-wide">
                          İndirim
                        </span>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2" itemProp="category">
                        {product.category.name}
                      </p>
                      <h3 className="font-serif font-light text-lg mb-3 group-hover:text-gray-600 transition-colors" itemProp="name">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-3" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <meta itemProp="priceCurrency" content="TRY" />
                        <meta itemProp="price" content={displayPrice.toString()} />
                        {product.discountPrice ? (
                          <>
                            <span className="font-medium text-red-600">
                              {formatPrice(product.discountPrice)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section section-gray" aria-labelledby="categories-heading">
        <div className="container mx-auto px-4">
          <h2 id="categories-heading" className="section-title">Gümüş Takı Koleksiyonları</h2>
          <p className="section-subtitle">Her tarza uygun özel tasarım 925 ayar gümüş mücevherler</p>

          <nav aria-label="Ürün kategorileri">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group card hover-lift overflow-hidden"
                  aria-label={`${category.name} kategorisindeki gümüş takıları görüntüle`}
                >
                  <div className="aspect-[4/3] relative bg-gray-100">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={`${category.name} - 925 ayar gümüş ${category.name.toLowerCase()} koleksiyonu`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-4xl text-gray-400" aria-hidden="true">📿</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-serif text-xl font-light group-hover:text-gray-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-white" aria-labelledby="features-heading">
        <div className="container mx-auto px-4">
          <h2 id="features-heading" className="section-title">Neden Silvre Lüks Gümüş Mücevher?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <article className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">%100 El İşçiliği</h3>
              <p className="text-gray-600 leading-relaxed">
                Her parça, deneyimli ustalarımız tarafından özenle üretilir. Geleneksel el işçiliği teknikleriyle modern tasarımı birleştiriyoruz.
              </p>
            </article>

            <article className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">925 Ayar Gümüş</h3>
              <p className="text-gray-600 leading-relaxed">
                Sadece en kaliteli, sertifikalı 925 ayar gümüş kullanıyoruz. Her ürün kalite garantisi ile gelir.
              </p>
            </article>

            <article className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">Kişiye Özel Tasarım</h3>
              <p className="text-gray-600 leading-relaxed">
                Kişiye özel tasarım ve üretim hizmeti sunuyoruz. Hayalinizdeki mücevheri birlikte tasarlayalım.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* SEO Text Content */}
      <section className="section section-white bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="prose prose-lg mx-auto">
            <h2 className="text-3xl font-serif font-light text-center mb-6">
              Lüks Gümüş Mücevher - Silvre ile Zarafeti Keşfedin
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Silvre</strong>, Türkiye'nin en prestijli lüks gümüş mücevher markasıdır. 
              %100 el işçiliği ile üretilen <strong>925 ayar gümüş takılar</strong>ımız, modern minimalizm 
              ile klasik zarafetin mükemmel birleşimini sunar. Her bir parça, deneyimli ustalarımız 
              tarafından özenle tasarlanır ve üretilir.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Koleksi yonumuzda <strong>gümüş kolye</strong>, <strong>gümüş küpe</strong>, 
              <strong>gümüş yüzük</strong> ve <strong>gümüş bileklik</strong> modelleri bulunmaktadır. 
              Kişiye özel tasarım hizmetimiz ile hayalinizdeki mücevheri gerçeğe dönüştürüyoruz.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Premium gümüş takı</strong> arayanlar için ideal olan Silvre, butik üretim 
              anlayışı ile her müşterisine özel deneyim sunmaktadır. Sertifikalı gümüş malzeme, 
              kalite garantisi ve üstün işçilik ile lüks mücevher dünyasında fark yaratıyoruz.
            </p>
          </article>
        </div>
      </section>
    </>
  )
}
