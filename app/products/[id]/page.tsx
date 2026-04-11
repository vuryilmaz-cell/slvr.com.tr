import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AddToCartButton from '@/components/AddToCartButton'

export const revalidate = 3600

interface Props {
  params: Promise<{ id: string }>
}

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

  await prisma.product.update({
    where: { id: product.id },
    data: { views: { increment: 1 } },
  })

  return product
}

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

  const primaryImage = product.images.find(img => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl

  return {
    title: product.name,
    description: product.description || `${product.name} - ${product.category.name} - 925 Ayar Gümüş`,
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  const displayPrice = product.discountPrice || product.price
  const primaryImage = product.images.find(img => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl || '/placeholder.jpg'
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-gray-900">Ana Sayfa</a>
            <span>/</span>
            <a href="/products" className="hover:text-gray-900">Ürünler</a>
            <span>/</span>
            <a href={`/categories/${product.category.slug}`} className="hover:text-gray-900">
              {product.category.name}
            </a>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="section section-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Images */}
            <div>
              <div className="aspect-square relative bg-gray-50 rounded-lg overflow-hidden mb-4 border">
                <Image src={primaryImage} alt={product.name} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, idx) => (
                    <div key={image.id} className={`aspect-square relative bg-gray-50 rounded-lg overflow-hidden border-2 cursor-pointer ${image.isPrimary ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}>
                      <Image src={image.imageUrl} alt={`${product.name} - ${idx + 1}`} fill className="object-cover" sizes="100px" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{product.category.name}</p>
              <h1 className="text-3xl md:text-4xl font-serif font-light italic mb-4">{product.name}</h1>
              
              {product.reviews.length > 0 && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-5 h-5 ${s <= avgRating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{avgRating.toFixed(1)} ({product.reviews.length} değerlendirme)</span>
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-semibold">{formatPrice(displayPrice)}</span>
                  {product.discountPrice && (
                    <>
                      <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                      <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded uppercase">
                        {Math.round((1 - product.discountPrice / product.price) * 100)}% İndirim
                      </span>
                    </>
                  )}
                </div>
              </div>

              {product.description && (
                <div className="mb-8 pb-8 border-b">
                  <h2 className="text-sm font-semibold uppercase tracking-wider mb-3">Ürün Açıklaması</h2>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="mb-8 pb-8 border-b">
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Ürün Özellikleri</h2>
                <dl className="space-y-3">
                  {product.material && (
                    <div className="flex"><dt className="text-sm text-gray-600 w-32">Malzeme:</dt><dd className="text-sm font-medium">{product.material}</dd></div>
                  )}
                  {product.weight && (
                    <div className="flex"><dt className="text-sm text-gray-600 w-32">Ağırlık:</dt><dd className="text-sm font-medium">{product.weight}g</dd></div>
                  )}
                  {product.sku && (
                    <div className="flex"><dt className="text-sm text-gray-600 w-32">Ürün Kodu:</dt><dd className="text-sm font-medium">{product.sku}</dd></div>
                  )}
                  <div className="flex">
                    <dt className="text-sm text-gray-600 w-32">Stok:</dt>
                    <dd className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} adet stokta` : 'Stokta yok'}
                    </dd>
                  </div>
                </dl>
              </div>

              <AddToCartButton productId={product.id} stockQuantity={product.stockQuantity} />

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

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="section section-light">
          <div className="container mx-auto px-4">
            <h2 className="section-title">Müşteri Yorumları</h2>
            <p className="section-subtitle">{product.reviews.length} değerlendirme</p>
            <div className="max-w-4xl mx-auto space-y-6">
              {product.reviews.map(review => (
                <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex mb-1">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="font-medium">{review.user.fullName}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('tr-TR', {year: 'numeric', month: 'long', day: 'numeric'})}
                    </span>
                  </div>
                  {review.comment && <p className="text-gray-700">{review.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: primaryImage,
        sku: product.sku,
        brand: {'@type': 'Brand', name: 'Silvre Jewelry'},
        offers: {
          '@type': 'Offer',
          price: displayPrice,
          priceCurrency: 'TRY',
          availability: product.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
        aggregateRating: product.reviews.length > 0 ? {
          '@type': 'AggregateRating',
          ratingValue: avgRating.toFixed(1),
          reviewCount: product.reviews.length,
        } : undefined,
      })}} />
    </>
  )
}
