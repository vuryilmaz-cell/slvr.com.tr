import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import CategoryProductsClient from '@/components/CategoryProductsClient'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string }>
}

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug, isActive: true },
  })
}

async function getProducts(slug: string, sort = 'display') {
  const orderBy: Record<string, string>[] = []

  if (sort === 'newest') orderBy.push({ createdAt: 'desc' })
  else if (sort === 'price-asc') orderBy.push({ price: 'asc' })
  else if (sort === 'price-desc') orderBy.push({ price: 'desc' })
  else if (sort === 'name-asc') orderBy.push({ name: 'asc' })
  else if (sort === 'name-desc') orderBy.push({ name: 'desc' })
  else orderBy.push({ displayOrder: 'asc' })

  return prisma.product.findMany({
    where: { category: { slug }, isActive: true },
    include: {
      category: { select: { id: true, name: true } },
      images: { orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }] },
    },
    orderBy,
  })
}

function getCategoryBannerPath(slug: string) {
  return `/uploads/categories/${slug}.jpeg`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) return { title: 'Kategori Bulunamadı' }

  const title = `${category.name} | Silvre Lüks Gümüş Mücevher`
  const description =
    category.description ||
    `Silvre'nin el yapımı ${category.name.toLowerCase()} koleksiyonu. 999 ayar saf gümüş, özel tasarım ${category.name.toLowerCase()} modelleri. Ücretsiz kargo ve kalite garantisi.`

  const bannerImage = getCategoryBannerPath(slug)

  return {
    title,
    description,
    keywords: [
      `gümüş ${category.name.toLowerCase()}`,
      `999 ayar ${category.name.toLowerCase()}`,
      `el yapımı ${category.name.toLowerCase()}`,
      `lüks ${category.name.toLowerCase()}`,
      `silvre ${category.name.toLowerCase()}`,
      'gümüş mücevher',
      'lüks gümüş takı',
    ],
    alternates: {
      canonical: `https://slvr.com.tr/categories/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://slvr.com.tr/categories/${slug}`,
      siteName: 'Silvre Jewelry',
      locale: 'tr_TR',
      type: 'website',
      images: [
        {
          url: bannerImage,
          width: 1600,
          height: 800,
          alt: `${category.name} kategori görseli`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [bannerImage],
    },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { sort = 'display' } = await searchParams

  const [category, products] = await Promise.all([
    getCategory(slug),
    getProducts(slug, sort),
  ])

  if (!category) notFound()

  const bannerImage = getCategoryBannerPath(slug)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://slvr.com.tr' },
      { '@type': 'ListItem', position: 2, name: 'Ürünler', item: 'https://slvr.com.tr/products' },
      { '@type': 'ListItem', position: 3, name: category.name, item: `https://slvr.com.tr/categories/${slug}` },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} - Silvre Gümüş Mücevher`,
    description: category.description || `Silvre ${category.name} koleksiyonu`,
    url: `https://slvr.com.tr/categories/${slug}`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://slvr.com.tr/products/${product.slug}`,
      name: product.name,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="relative overflow-hidden">
        <div className="relative h-[320px] md:h-[380px] lg:h-[420px]">
          <Image
            src={bannerImage}
            alt={`${category.name} kategori banner görseli`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-sm text-white/80 mb-6"
              >
                <Link href="/" className="hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
                <span aria-hidden="true">/</span>
                <Link href="/products" className="hover:text-white transition-colors">
                  Ürünler
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-white" aria-current="page">
                  {category.name}
                </span>
              </nav>

              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light italic text-white mb-4">
                  {category.name}
                </h1>

                <p className="text-base md:text-lg text-white/90 max-w-xl leading-relaxed">
                  {category.description ||
                    `Silvre ${category.name.toLowerCase()} koleksiyonunu keşfedin. El işçiliği, premium tasarım ve zamansız şıklık.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryProductsClient
        initialProducts={products}
        categorySlug={slug}
        categoryName={category.name}
        initialSort={sort}
      />
    </>
  )
}