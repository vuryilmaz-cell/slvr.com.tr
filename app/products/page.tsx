import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import ProductsClient from '@/components/ProductsClient'

export const revalidate = 3600

interface Props {
  searchParams: Promise<{
    category?: string
    categories?: string
    gender?: string
    price?: string
    featured?: string
    discounted?: string
    sort?: string
  }>
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  })
}

function parseMultiValue(value?: string) {
  if (!value) return []
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function buildPriceFilter(priceRanges: string[]) {
  if (!priceRanges.length) return undefined

  const ranges = priceRanges
    .map((range) => {
      if (range === '0-250') {
        return { price: { gte: 0, lte: 250 } }
      }
      if (range === '250-500') {
        return { price: { gt: 250, lte: 500 } }
      }
      if (range === '500-1000') {
        return { price: { gt: 500, lte: 1000 } }
      }
      if (range === '1000-plus') {
        return { price: { gt: 1000 } }
      }
      return null
    })
    .filter(Boolean)

  return ranges.length ? ranges : undefined
}

async function getProducts(params: {
  category?: string
  categories?: string
  gender?: string
  price?: string
  featured?: string
  discounted?: string
  sort?: string
}) {
  const {
    category,
    categories,
    gender,
    price,
    featured,
    discounted,
    sort = 'display',
  } = params

  const orderBy: Record<string, string>[] = []
  if (sort === 'newest') orderBy.push({ createdAt: 'desc' })
  else if (sort === 'price-asc') orderBy.push({ price: 'asc' })
  else if (sort === 'price-desc') orderBy.push({ price: 'desc' })
  else if (sort === 'name-asc') orderBy.push({ name: 'asc' })
  else if (sort === 'name-desc') orderBy.push({ name: 'desc' })
  else orderBy.push({ displayOrder: 'asc' })

  const categoryValues = parseMultiValue(categories)
  const genderValues = parseMultiValue(gender)
  const priceValues = parseMultiValue(price)

  const andFilters: any[] = [{ isActive: true }]

  if (category) {
    andFilters.push({
      category: { slug: category },
    })
  }

  if (categoryValues.length) {
    andFilters.push({
      category: {
        slug: { in: categoryValues },
      },
    })
  }

  if (featured === 'true') {
    andFilters.push({
      isFeatured: true,
    })
  }

  if (discounted === 'true') {
    andFilters.push({
      discountPrice: {
        not: null,
      },
    })
  }

  if (genderValues.length) {
    const genderConditions = genderValues.map((value) => ({
      OR: [
        { name: { contains: value } },
        { description: { contains: value } },
      ],
    }))

    andFilters.push({
      OR: genderConditions,
    })
  }

  const priceFilter = buildPriceFilter(priceValues)
  if (priceFilter) {
    andFilters.push({
      OR: priceFilter,
    })
  }

  return prisma.product.findMany({
    where: {
      AND: andFilters,
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }] },
    },
    orderBy,
  })
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const { category } = params

  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } })

    if (cat) {
      const canonicalUrl = `https://slvr.com.tr/categories/${category}`
      const title = `${cat.name} Koleksiyonu | Silvre Lüks Gümüş Mücevher`
      const description = `Silvre'nin el yapımı 999 ayar saf gümüş ${cat.name.toLowerCase()} koleksiyonu. Özel tasarım, kalite garantili lüks mücevher modelleri.`

      return {
        title,
        description,
        keywords: [
          `gümüş ${cat.name.toLowerCase()}`,
          `999 ayar ${cat.name.toLowerCase()}`,
          'lüks gümüş mücevher',
          'el yapımı gümüş takı',
          'silvre',
        ],
        alternates: {
          canonical: canonicalUrl,
        },
        openGraph: {
          title,
          description,
          url: canonicalUrl,
          siteName: 'Silvre Jewelry',
          locale: 'tr_TR',
          type: 'website',
        },
      }
    }
  }

  return {
    title: 'Tüm Ürünler | Silvre Lüks Gümüş Mücevher',
    description:
      'Silvre lüks gümüş mücevher koleksiyonu. El yapımı 999 ayar saf gümüş kolye, küpe, yüzük, bileklik modelleri. Ücretsiz kargo, kalite garantisi.',
    keywords: [
      'lüks gümüş mücevher',
      '999 ayar gümüş takı',
      'el yapımı gümüş',
      'gümüş kolye',
      'gümüş küpe',
      'gümüş yüzük',
      'gümüş bileklik',
      'silvre mücevher',
    ],
    alternates: { canonical: 'https://slvr.com.tr/products' },
    openGraph: {
      title: 'Tüm Ürünler | Silvre Lüks Gümüş Mücevher',
      description: 'El yapımı 999 ayar saf gümüş takı koleksiyonu.',
      url: 'https://slvr.com.tr/products',
      siteName: 'Silvre Jewelry',
      locale: 'tr_TR',
      type: 'website',
    },
  }
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams

  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ])

  const activeCategory = params.category
    ? categories.find((c) => c.slug === params.category) ?? null
    : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://slvr.com.tr' },
      {
        '@type': 'ListItem',
        position: 2,
        name: activeCategory ? activeCategory.name : 'Ürünler',
        item: activeCategory
          ? `https://slvr.com.tr/categories/${activeCategory.slug}`
          : 'https://slvr.com.tr/products',
      },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: activeCategory ? `${activeCategory.name} - Silvre` : 'Silvre Gümüş Mücevher Koleksiyonu',
    url: activeCategory
      ? `https://slvr.com.tr/categories/${activeCategory.slug}`
      : 'https://slvr.com.tr/products',
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

      <section className="bg-gradient-to-br from-[#faf8f5] to-[#f5f3f0] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-hero font-serif font-light italic mb-4 text-gray-900">
            {activeCategory ? activeCategory.name : 'Koleksiyonlar'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {activeCategory
              ? `El işçiliği ile üretilmiş, özel tasarım ${activeCategory.name.toLowerCase()} modelleri`
              : 'El işçiliği ile üretilmiş, 999 ayar saf gümüş özel tasarım takılar'}
          </p>
        </div>
      </section>

      <ProductsClient
        initialProducts={products}
        categories={categories}
        initialCategory={params.category}
        initialSort={params.sort || 'display'}
      />
    </>
  )
}