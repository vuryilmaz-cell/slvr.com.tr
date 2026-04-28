export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

import LuxuryProductCard from '@/components/LuxuryProductCard'
import InstagramFeed from '@/components/InstagramFeed'
import TestimonialsSlider from '@/components/TestimonialsSlider'

export const revalidate = 3600

const SITE_URL = 'https://slvr.com.tr'
const HERO_IMAGE = `${SITE_URL}/uploads/images/anasayfa_background_3.jpg`

export const metadata: Metadata = {
  title: 'Silvre - Lüks Gümüş Mücevher | 999 Ayar Saf Gümüş El Yapımı Takılar',
  description:
    'Silvre, 999 ayar saf gümüşten üretilen el yapımı ve kişiye özel takılar sunan lüks gümüş mücevher markasıdır.',
  keywords: [
    'Silvre',
    'lüks gümüş mücevher',
    '999 ayar saf gümüş',
    'el yapımı gümüş takı',
    'kişiye özel gümüş takı',
    'fine silver',
  ],
  openGraph: {
    title: 'Silvre - Lüks Gümüş Mücevher | El Yapımı 999 Ayar Saf Gümüş Takılar',
    description:
      'Kişiye özel, el yapımı ve 999 ayar saf gümüşten üretilen zarif takıları keşfedin.',
    type: 'website',
    locale: 'tr_TR',
    url: SITE_URL,
    siteName: 'Silvre',
    images: [
      {
        url: HERO_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Silvre lüks gümüş mücevher koleksiyonu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silvre - 999 Ayar Saf Gümüş Mücevher',
    description: 'El yapımı ve kişiye özel 999 ayar saf gümüş takılar.',
    images: [HERO_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
  },
}

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: {
      isFeatured: true,
      isActive: true,
    },
    include: {
      category: true,
      images: {
        orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
      },
    },
    take: 8,
    orderBy: {
      displayOrder: 'asc',
    },
  })
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  })
}

function toAbsoluteUrl(path?: string | null) {
  if (!path) return undefined
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export default async function HomePage() {
  let featuredProducts = [] as Awaited<ReturnType<typeof getFeaturedProducts>>
  let categories = [] as Awaited<ReturnType<typeof getCategories>>

  try {
    ;[featuredProducts, categories] = await Promise.all([
      getFeaturedProducts(),
      getCategories(),
    ])
  } catch (error) {
    console.error('Homepage data fetch failed:', error)
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Silvre',
    alternateName: 'Silvre Jewelry',
    url: SITE_URL,
    logo: `${SITE_URL}/uploads/images/silvre.jewelry-logo-black.png`,
    description:
      'El yapımı ve kişiye özel 999 ayar saf gümüş takılar sunan lüks gümüş mücevher markası.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TR',
      addressLocality: 'İstanbul',
    },
    sameAs: ['https://instagram.com/silvre.jewelry'],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Silvre',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: featuredProducts.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        url: `${SITE_URL}/products/${product.slug}`,
        image: toAbsoluteUrl(product.images[0]?.imageUrl),
        material: '999 Ayar Saf Gümüş',
        brand: {
          '@type': 'Brand',
          name: 'Silvre',
        },
        offers: {
          '@type': 'Offer',
          url: `${SITE_URL}/products/${product.slug}`,
          price: product.discountPrice || product.price,
          priceCurrency: 'TRY',
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
      },
    })),
  }

  return (
    <>
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

<section className="relative min-h-screen flex items-center overflow-hidden">
  <div className="absolute inset-0">
    {/* Desktop Video */}
    <video
      autoPlay
      muted
      playsInline
      preload="metadata"
      poster="/uploads/images/anasayfa_background.jpg"
      className="hidden md:block absolute top-0 left-0 w-full h-full"
      style={{
        objectFit: 'cover',
        objectPosition: 'center',
        transform: 'scale(1.2) scaleX(-1)',
        minWidth: '100%',
        minHeight: '100%',
        filter: 'brightness(0.9)',
      }}
      aria-hidden="true"
    >
      <source src="/videos/jewelry.webm" type="video/webm" />
      <source src="/videos/hero-bg.mp4" type="video/mp4" />
    </video>

    {/* Mobile Video */}
    <video
      autoPlay
      muted
      playsInline
      preload="metadata"
      poster="/uploads/images/anasayfa_background_3.jpg"
      className="block md:hidden absolute top-0 left-0 w-full h-full"
      style={{
        objectFit: 'cover',
        objectPosition: 'center',
        minWidth: '100%',
        minHeight: '100%',
        filter: 'brightness(0.5)',
      }}
      aria-hidden="true"
    >
      <source src="/videos/jewelry-mobile.mp4" type="video/mp4" />
    </video>


    {/* Video Etiketi Buraya Gelecek */}



    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
  </div>

  <div className="container mx-auto px-10 sm:px-6 relative z-10 pt-24 sm:pt-32">
  <div className="max-w-xl lg:max-w-2xl hero-content text-center md:text-left mx-auto md:mx-0">
  <h1 className="text-6xl sm:text-6xl md:text-6xl lg:text-6xl font-serif font-light italic text-white mb-8 leading-tight tracking-wide text-center md:text-left">
    Zarif ve Şık
      </h1>

      <div className="space-y-3 mb-10">
      <p className="text-xl sm:text-lg md:text-xl text-white/95 font-light leading-relaxed text-center md:text-left">
          Size özel ve el işçiliğiyle hazırlanan özel tasarımlar.
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

      <section className="section section-gray" aria-labelledby="categories-heading">
        <div className="container mx-auto px-4">
          <h2 id="categories-heading" className="section-title">
            Saf Gümüş Takı Koleksiyonları
          </h2>
          <p className="section-subtitle">
            Her tarza uygun özel tasarım 999 ayar saf gümüş mücevherler
          </p>

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
                        alt={`${category.name} - 999 ayar saf gümüş koleksiyonu`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-4xl text-gray-400" aria-hidden="true">
                          📿
                        </span>
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

      <section className="section section-white" aria-labelledby="featured-heading">
        <div className="container mx-auto px-4">
          <h2 id="featured-heading" className="section-title">
            Öne Çıkan Lüks Gümüş Koleksiyon
          </h2>
          <p className="section-subtitle">El yapımı, 999 ayar saf gümüş özel tasarım takılar</p>

          <div className="products-grid">
            {featuredProducts.map((product) => {
              const primaryImage = product.images[0]?.imageUrl || '/placeholder.jpg'

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
                    isPremium: product.isFeatured || false,
                  }}
                />
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section-white bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-light italic mb-6 text-gray-900">
              999 Ayar Saf Gümüş Farkı
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              %99.9 saflık oranına sahip gümüş ile özenli işçilik ve seçkin tasarım anlayışı.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="p-8 bg-white rounded-lg shadow-md border-2 border-gold-accent">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">999 Ayar (Fine Silver)</h3>
                <div className="text-3xl font-bold text-gold-accent mb-3">%99.9</div>
                <p className="text-gray-600 mb-4 font-medium">Saf Gümüş - Silvre Standardı</p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li>✓ Yüksek saflık oranı</li>
                  <li>✓ Hassas ciltler için uygun kullanım</li>
                  <li>✓ Parlak ve zarif görünüm</li>
                  <li>✓ Seçkin koleksiyon anlayışı</li>
                  <li>✓ Özel üretim yaklaşımı</li>
                </ul>
              </div>

              <div className="p-8 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-4xl mb-4 opacity-50">⭐</div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-600">925 Ayar (Sterling Silver)</h3>
                <div className="text-3xl font-bold text-gray-500 mb-3">%92.5</div>
                <p className="text-gray-500 mb-4">Gümüş ve alaşım içeren yaygın kullanım standardı</p>
                <ul className="text-left text-sm text-gray-400 space-y-2">
                  <li>• Yaygın kullanılan gümüş standardı</li>
                  <li>• Alaşım içeren yapı</li>
                  <li>• Farklı tasarım ve üretim tercihleri</li>
                  <li>• Geniş ürün çeşitliliği</li>
                  <li>• Kullanım amacına göre farklı avantajlar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSlider />

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
                Her parça, deneyimli ustalarımız tarafından özenle üretilir. Geleneksel el işçiliği teknikleriyle modern tasarımı bir araya getiriyoruz.
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
                %99.9 saflıkta, sertifikalı 999 ayar saf gümüş kullanıyoruz. Her ürün, özenli üretim ve kalite yaklaşımıyla hazırlanır.
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
                Kişiye özel tasarım ve üretim hizmeti sunuyoruz. Hayalinizdeki mücevheri birlikte tasarlayıp sizin için özel hale getiriyoruz.
              </p>
            </article>
          </div>
        </div>
      </section>

      <InstagramFeed />

      <section className="section section-white bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="prose prose-lg mx-auto">
            <h2 className="text-3xl font-serif font-light text-center mb-6">
              Silvre ile Zarafeti Keşfedin
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Silvre</strong>, el işçiliğiyle üretilen ve seçkin tasarım anlayışını yansıtan gümüş mücevher koleksiyonları sunar. 999 ayar saf gümüş kullanılarak hazırlanan parçalar, sade çizgilerle güçlü bir zarafet anlayışını bir araya getirir.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Koleksiyonumuzda kolye, küpe, yüzük ve bileklik gibi farklı takı grupları yer alır. Her parça, günlük kullanımdan özel anlara kadar farklı stillere eşlik edecek şekilde özenle hazırlanır.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Kişiye özel üretim yaklaşımımız sayesinde, yalnızca estetik değil anlam taşıyan tasarımlar da sunuyoruz. Silvre, saf gümüşün zarafetini modern ve zamansız bir yorumla buluşturur.
            </p>
          </article>
        </div>
      </section>
    </>
  )
}