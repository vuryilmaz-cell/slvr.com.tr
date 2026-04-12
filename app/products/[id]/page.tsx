import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AddToCartButton from '@/components/AddToCartButton'

export const revalidate = 3600

interface Props {
  params: Promise<{ id: string }>
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getProduct(slugOrId: string) {
  let product = await prisma.product.findUnique({
    where: { slug: slugOrId },
    include: {
      category: true,
      images: { orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }] },
      reviews: {
        where: { isApproved: true },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!product && !isNaN(Number(slugOrId))) {
    product = await prisma.product.findUnique({
      where: { id: parseInt(slugOrId) },
      include: {
        category: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }] },
        reviews: {
          where: { isApproved: true },
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  if (!product) return null

  // Views fire-and-forget — sayfayı bloklamaz, performansı etkilemez
  prisma.product.update({
    where: { id: product.id },
    data: { views: { increment: 1 } },
  }).catch(() => {})

  return product
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  let product = await prisma.product.findUnique({
    where: { slug: id },
    include: { category: true, images: true },
  })

  if (!product && !isNaN(Number(id))) {
    product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true, images: true },
    })
  }

  if (!product) return { title: 'Ürün Bulunamadı' }

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.imageUrl ||
    product.images[0]?.imageUrl

  const title = `${product.name} - 999 Ayar Gümüş ${product.category.name} | Silvre`
  const description =
    product.description ||
    `${product.name} — Silvre el yapımı 999 ayar saf gümüş ${product.category.name.toLowerCase()}. Özel tasarım, kalite garantili, ücretsiz kargo.`

  return {
    title,
    description,
    keywords: [
      product.name,
      `999 ayar gümüş ${product.category.name.toLowerCase()}`,
      `el yapımı ${product.category.name.toLowerCase()}`,
      `silvre ${product.category.name.toLowerCase()}`,
      'lüks gümüş mücevher',
      '999 ayar saf gümüş',
    ],
    alternates: {
      canonical: `https://slvr.com.tr/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://slvr.com.tr/products/${product.slug}`,
      siteName: 'Silvre Jewelry',
      locale: 'tr_TR',
      type: 'website',
      images: primaryImage
        ? [{ url: primaryImage, width: 1200, height: 630, alt: title }]
        : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Silvre Lüks Gümüş Mücevher' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: primaryImage ? [primaryImage] : ['/og-image.jpg'],
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  const displayPrice = product.discountPrice || product.price
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.imageUrl ||
    product.images[0]?.imageUrl ||
    '/placeholder.jpg'
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0

  // ── Structured Data ──────────────────────────────────────────────────────────

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://slvr.com.tr' },
      { '@type': 'ListItem', position: 2, name: 'Ürünler',   item: 'https://slvr.com.tr/products' },
      { '@type': 'ListItem', position: 3, name: product.category.name, item: `https://slvr.com.tr/categories/${product.category.slug}` },
      { '@type': 'ListItem', position: 4, name: product.name, item: `https://slvr.com.tr/products/${product.slug}` },
    ],
  }

  const productSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description:
      product.description ||
      `${product.name} - 999 ayar saf gümüş, el yapımı ${product.category.name.toLowerCase()}`,
    url: `https://slvr.com.tr/products/${product.slug}`,
    image: product.images.map((img) => img.imageUrl),
    brand: {
      '@type': 'Brand',
      name: 'Silvre',
    },
    category: product.category.name,
    material: '999 Ayar Saf Gümüş',
    offers: {
      '@type': 'Offer',
      url: `https://slvr.com.tr/products/${product.slug}`,
      priceCurrency: 'TRY',
      price: displayPrice,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability:
        product.stockQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Silvre Jewelry',
      },
    },
    ...(product.reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: product.reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
      review: product.reviews.slice(0, 3).map((review) => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
        },
        author: {
          '@type': 'Person',
          name: review.user?.fullName || 'Müşteri',
        },
        reviewBody: review.comment,
        datePublished: review.createdAt,
      })),
    }),
  }

  return (
    <>
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* ── Breadcrumb ── */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">Ana Sayfa</Link>
            <span aria-hidden="true">/</span>
            <Link href="/products" className="hover:text-gray-900 transition-colors">Ürünler</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-gray-900 transition-colors">
              {product.category.name}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-gray-900" aria-current="page">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Product Detail ── */}
      <section className="section section-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">

            {/* Images */}
            <div>
              <div className="aspect-square relative bg-gray-50 rounded-lg overflow-hidden mb-4 border">
                <Image
                  src={primaryImage}
                  alt={`${product.name} - Silvre 999 ayar saf gümüş ${product.category.name.toLowerCase()}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, idx) => (
                    <div
                      key={image.id}
                      className={`aspect-square relative bg-gray-50 rounded-lg overflow-hidden border-2 cursor-pointer ${
                        image.isPrimary ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <Image
                        src={image.imageUrl}
                        alt={`${product.name} görsel ${idx + 1} - Silvre gümüş ${product.category.name.toLowerCase()}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                {product.category.name}
              </p>
              <h1 className="text-3xl md:text-4xl font-serif font-light italic mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.reviews.length > 0 && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                  <div className="flex" aria-label={`${avgRating.toFixed(1)} üzerinden 5 yıldız`}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className={`w-5 h-5 ${s <= avgRating ? 'text-yellow-400' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {avgRating.toFixed(1)} ({product.reviews.length} değerlendirme)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-light text-gray-900">
                  {formatPrice(displayPrice)}
                </span>
                {product.discountPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8 pb-8 border-b">
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Details */}
              <dl className="mb-8 space-y-3">
                <div className="flex gap-3 text-sm">
                  <dt className="text-gray-500 w-28 flex-shrink-0">Malzeme</dt>
                  <dd className="text-gray-900 font-medium">999 Ayar Saf Gümüş</dd>
                </div>
                <div className="flex gap-3 text-sm">
                  <dt className="text-gray-500 w-28 flex-shrink-0">Kategori</dt>
                  <dd>
                    <Link
                      href={`/categories/${product.category.slug}`}
                      className="text-gray-900 hover:underline"
                    >
                      {product.category.name}
                    </Link>
                  </dd>
                </div>
                <div className="flex gap-3 text-sm">
                  <dt className="text-gray-500 w-28 flex-shrink-0">Stok</dt>
                  <dd className={product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stockQuantity > 0
                      ? `${product.stockQuantity} adet stokta`
                      : 'Stokta yok'}
                  </dd>
                </div>
              </dl>

              <AddToCartButton productId={product.id} stockQuantity={product.stockQuantity} />

              {/* Trust badges */}
              <div className="mt-8 pt-8 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <p className="text-xs text-gray-600">Ücretsiz Kargo</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p className="text-xs text-gray-600">Güvenli Ödeme</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <p className="text-xs text-gray-600">14 Gün İade</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      {product.reviews.length > 0 && (
        <section className="section section-light" aria-labelledby="reviews-heading">
          <div className="container mx-auto px-4">
            <h2 id="reviews-heading" className="section-title">Müşteri Yorumları</h2>
            <p className="section-subtitle">{product.reviews.length} değerlendirme</p>
            <div className="max-w-4xl mx-auto space-y-6">
              {product.reviews.map((review) => (
                <article key={review.id} className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex mb-1" aria-label={`${review.rating} yıldız`}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg
                            key={s}
                            className={`w-4 h-4 ${s <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="font-medium text-sm">{review.user?.fullName || 'Müşteri'}</p>
                    </div>
                    <time className="text-xs text-gray-400" dateTime={new Date(review.createdAt).toISOString()}>
                      {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                    </time>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
