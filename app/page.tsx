import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

// YENİ COMPONENTS
import LuxuryProductCard from '@/components/LuxuryProductCard'
import InstagramFeed from '@/components/InstagramFeed'
import TestimonialsSlider from '@/components/TestimonialsSlider'

// Server Component - SEO için kritik
export const revalidate = 3600 // 1 saat cache

// SEO Metadata - 999 AYAR
export const metadata: Metadata = {
  title: 'Silvre - Lüks Gümüş Mücevher | 999 Ayar Saf Gümüş El Yapımı Takılar',
  description: 'Türkiye\'nin en prestijli lüks gümüş mücevher markası. %100 el işçiliği, kişiye özel 999 ayar saf gümüş takı koleksiyonu. %99.9 saflıkta fine silver kolye, küpe, yüzük, bileklik modelleri.',
  keywords: [
    'lüks gümüş mücevher',
    'premium gümüş takı',
    '999 ayar gümüş',
    '999 ayar saf gümüş',
    'fine silver',
    'el yapımı gümüş takı',
    'özel tasarım gümüş',
    'butik mücevher',
    'silvre',
    'saf gümüş kolye',
    'saf gümüş küpe',
    'saf gümüş yüzük',
    'saf gümüş bileklik',
    '999 ayar kolye',
    '999 ayar küpe',
    'sterling gümüş'
  ],
  openGraph: {
    title: 'Silvre - Lüks Gümüş Mücevher | El Yapımı 999 Ayar Saf Gümüş Takılar',
    description: 'Kişiye özel %100 el işçiliği lüks gümüş takılar. 999 ayar (%99.9 saf) fine silver ile üretilen zarif ve prestijli tasarımlar.',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://slvr.com.tr',
    siteName: 'Silvre',
    images: [
      {
        url: '/uploads/images/anasayfa_background_3.jpg',
        width: 1200,
        height: 630,
        alt: 'Silvre Lüks Gümüş Mücevher Koleksiyonu - 999 Ayar Saf Gümüş',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silvre - 999 Ayar Saf Gümüş Mücevher',
    description: 'Kişiye özel %100 el işçiliği lüks 999 ayar saf gümüş takılar',
    images: ['/uploads/images/anasayfa_background_3.jpg'],
  },
  alternates: {
    canonical: 'https://slvr.com.tr',
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
    url: 'https://slvr.com.tr',
    logo: 'https://slvr.com.tr/uploads/images/silvre.jewelry-logo-black.png',
    description: 'Lüks gümüş mücevher ve el yapımı 999 ayar saf gümüş takı koleksiyonu. %99.9 saflıkta fine silver.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TR',
      addressLocality: 'İstanbul',
    },
    sameAs: [
      'https://instagram.com/silvre.jewelry',
      'https://facebook.com/silvre.jewelry',
      'https://twitter.com/silvre.jewelry',
    ],
  }

  // Structured Data - WebSite
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Silvre',
    url: 'https://slvr.com.tr',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://slvr.com.tr/products?search={search_term_string}',
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
        url: `https://slvr.com.tr/products/${product.slug}`,
        image: product.images[0]?.imageUrl,
        material: '999 Ayar Saf Gümüş',
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

{/* Hero Section */}
<section className="relative min-h-screen flex items-center overflow-hidden -mt-[85px]">
  {/* Background Container */}
  <div className="absolute inset-0">
    {/* Desktop: Video */}
    <video
  autoPlay
  muted
  playsInline
  poster="/uploads/images/anasayfa_background_3.jpg"
  className="hidden md:block absolute top-0 left-0 w-full h-full"
  style={{
    objectFit: 'cover',
    objectPosition: 'center',
    transform: 'scale(1.2) scaleX(-1)' ,  /* %20 büyüt, siyah bandları gizle */
    minWidth: '100%',
    minHeight: '100%',
    filter: 'brightness(0.7)'  /* %80 parlaklık = daha koyu */
  }}
>
  <source src="/videos/jewelry.mp4" type="video/mp4" />
</video>
    
    {/* Mobile: Image */}
    <Image
      src="/uploads/images/anasayfa_background_3.jpg"
      alt="Silvre lüks gümüş mücevher koleksiyonu - El yapımı 999 ayar saf gümüş takılar"
      fill
      className="md:hidden object-cover"
      priority
      quality={85}
      sizes="100vw"
    />
    
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
  </div>

  {/* Hero Content */}
  <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-24 sm:pt-32">
    <div className="max-w-xl lg:max-w-2xl hero-content">
      <h1 className="sr-only">
        Silvre - Lüks Gümüş Mücevher | Kişiye Özel El Yapımı 999 Ayar Saf Gümüş Takılar
      </h1>
      
      <div 
        className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-serif font-light italic text-white mb-8 leading-tight tracking-wide" 
        aria-hidden="true"
      >
        Zarif & Lüks
      </div>
      
      <div className="space-y-3 mb-10">
        <p className="text-base sm:text-lg md:text-xl text-white/95 font-light leading-relaxed">
          Gümüşle gelen şıklığın en yeni yorumu.
          <br/>Kişiye özel %100 el işçiliği gümüş takılar.
        </p>
      </div>

      <div>
        <Link 
          href="/products" 
          className="inline-block bg-white/10 backdrop-blur-sm border border-white/30 text-white px-10 py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500 shadow-lg hover:shadow-2xl hover:border-white"
          aria-label="Silvre 999 ayar saf gümüş takı koleksiyonunu keşfedin"
        >
          KOLEKSİYONU KEŞFET
        </Link>
      </div>
    </div>
  </div>
</section>


      {/* Featured Products */}
      <section className="section section-white" aria-labelledby="featured-heading">
        <div className="container mx-auto px-4">
          <h2 id="featured-heading" className="section-title">Öne Çıkan Lüks Gümüş Koleksiyon</h2>
          <p className="section-subtitle">El yapımı, 999 ayar saf gümüş özel tasarım takılar</p>

          <div className="products-grid">
            {featuredProducts.map((product) => {
              const primaryImage = product.images[0]?.imageUrl || '/placeholder.jpg'
              const displayPrice = product.discountPrice || product.price

              return (
                <LuxuryProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    category: product.category.name,
                    price: product.price,
                    discountPrice: product.discountPrice,
                    image: primaryImage,
                    rating: 4.8,
                    reviewCount: 124,
                    isPremium: product.isFeatured || false
                  }}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section section-gray" aria-labelledby="categories-heading">
        <div className="container mx-auto px-4">
          <h2 id="categories-heading" className="section-title">Saf Gümüş Takı Koleksiyonları</h2>
          <p className="section-subtitle">Her tarza uygun özel tasarım 999 ayar saf gümüş mücevherler</p>

          <nav aria-label="Ürün kategorileri">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group card hover-lift overflow-hidden"
                  aria-label={`${category.name} kategorisindeki 999 ayar saf gümüş takıları görüntüle`}
                >
                  <div className="aspect-[4/3] relative bg-gray-100">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={`${category.name} - 999 ayar saf gümüş ${category.name.toLowerCase()} koleksiyonu`}
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

      {/* 999 Ayar Farkı - YENİ BÖLÜM */}
      <section className="section section-white bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-light italic mb-6 text-gray-900">
              999 Ayar Saf Gümüş Farkı
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              %99.9 saflıkta gümüş ile en yüksek kalite standardı
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="p-8 bg-white rounded-lg shadow-md border-2 border-gold-accent">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                  999 Ayar (Fine Silver)
                </h3>
                <div className="text-3xl font-bold text-gold-accent mb-3">%99.9</div>
                <p className="text-gray-600 mb-4 font-medium">Saf Gümüş - Silvre Standardı</p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li>✓ En yüksek saflık</li>
                  <li>✓ Hipoalerjenik</li>
                  <li>✓ Doğal parlak görünüm</li>
                  <li>✓ Prestijli ve nadir</li>
                  <li>✓ Daha yüksek değer</li>
                </ul>
              </div>
              
              <div className="p-8 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-4xl mb-4 opacity-50">⭐</div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-600">
                  925 Ayar (Sterling Silver)
                </h3>
                <div className="text-3xl font-bold text-gray-500 mb-3">%92.5</div>
                <p className="text-gray-500 mb-4">Gümüş + %7.5 Alaşım</p>
                <ul className="text-left text-sm text-gray-400 space-y-2">
                  <li>• Standart kalite</li>
                  <li>• Diğer metallerle karışık</li>
                  <li>• Daha mat görünüm</li>
                  <li>• Yaygın kullanım</li>
                  <li>• Düşük değer</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YENİ: Müşteri Yorumları */}
      <TestimonialsSlider />

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
              <h3 className="font-serif text-xl mb-3">999 Ayar Saf Gümüş</h3>
              <p className="text-gray-600 leading-relaxed">
                %99.9 saflıkta, sertifikalı 999 ayar saf gümüş (fine silver) kullanıyoruz. 
                En yüksek kalite standardı ile her ürün kalite garantisi ile gelir.
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
                Kişiye özel tasarım ve üretim hizmeti sunuyoruz. 999 ayar saf gümüş ile 
                hayalinizdeki mücevheri birlikte tasarlayalım.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* YENİ: Instagram Feed */}
      <InstagramFeed />

      {/* SEO Text Content - 999 AYAR VURGUSU */}
      <section className="section section-white bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="prose prose-lg mx-auto">
            <h2 className="text-3xl font-serif font-light text-center mb-6">
              Lüks Gümüş Mücevher - Silvre ile Zarafeti Keşfedin
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Silvre</strong>, Türkiye'nin en prestijli lüks gümüş mücevher markasıdır. 
              %100 el işçiliği ile üretilen <strong>999 ayar saf gümüş takılar</strong>ımız, 
              modern minimalizm ile klasik zarafetin mükemmel birleşimini sunar. 
              <strong>%99.9 saflıkta gümüş</strong> (fine silver) kullanarak, her bir parçayı 
              deneyimli ustalarımız tarafından özenle tasarlıyor ve üretiyoruz.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Koleksiyonumuzda <strong>999 ayar saf gümüş kolye</strong>, 
              <strong>999 ayar saf gümüş küpe</strong>, <strong>999 ayar saf gümüş yüzük</strong> 
              ve <strong>999 ayar saf gümüş bileklik</strong> modelleri bulunmaktadır. 
              Kişiye özel tasarım hizmetimiz ile hayalinizdeki mücevheri gerçeğe dönüştürüyoruz.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>999 ayar saf gümüş takı</strong> arayanlar için ideal olan Silvre, 
              butik üretim anlayışı ile her müşterisine özel deneyim sunmaktadır. 
              Sertifikalı <strong>fine silver (999 ayar)</strong> malzeme, kalite garantisi 
              ve üstün işçilik ile lüks mücevher dünyasında fark yaratıyoruz. Sterling silver 
              (%92.5) yerine %99.9 saflıkta gümüş kullanarak, size en yüksek kalite ve 
              değeri sunuyoruz.
            </p>
          </article>
        </div>
      </section>
    </>
  )
}
