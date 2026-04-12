'use client'

import { useMemo, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  discountPrice: number | null
  category: { id: number; name: string; slug?: string }
  images: { imageUrl: string; isPrimary?: boolean }[]
  isFeatured?: boolean
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

const GENDER_OPTIONS = [
  { label: 'Kadın', value: 'kadin' },
  { label: 'Erkek', value: 'erkek' },
  { label: 'Unisex', value: 'unisex' },
  { label: 'Çocuk', value: 'cocuk' },
]

const PRICE_OPTIONS = [
  { label: '0 - 250 ₺', value: '0-250' },
  { label: '250 - 500 ₺', value: '250-500' },
  { label: '500 - 1000 ₺', value: '500-1000' },
  { label: '1000 ₺ +', value: '1000-plus' },
]

const FEATURE_OPTIONS = [
  { label: 'Öne Çıkanlar', value: 'featured' },
  { label: 'İndirimli Ürünler', value: 'discounted' },
]

export default function ProductsClient({
  initialProducts,
  categories,
  initialCategory,
  initialSort = 'display',
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState(initialProducts)
  const [currentSort, setCurrentSort] = useState(initialSort)
  const [activeCategory, setActiveCategory] = useState(initialCategory || '')
  const [isPending, startTransition] = useTransition()

  const initialGenders = useMemo(
    () => (searchParams.get('gender') || '').split(',').filter(Boolean),
    [searchParams]
  )
  const initialPrices = useMemo(
    () => (searchParams.get('price') || '').split(',').filter(Boolean),
    [searchParams]
  )
  const initialCategories = useMemo(
    () => (searchParams.get('categories') || '').split(',').filter(Boolean),
    [searchParams]
  )
  const initialFeatured = useMemo(
    () => searchParams.get('featured') === 'true',
    [searchParams]
  )
  const initialDiscounted = useMemo(
    () => searchParams.get('discounted') === 'true',
    [searchParams]
  )

  const [selectedGenders, setSelectedGenders] = useState<string[]>(initialGenders)
  const [selectedPrices, setSelectedPrices] = useState<string[]>(initialPrices)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : initialCategories
  )
  const [selectedFeatured, setSelectedFeatured] = useState(initialFeatured)
  const [selectedDiscounted, setSelectedDiscounted] = useState(initialDiscounted)

  const buildUrl = (
    category: string,
    sort: string,
    genders: string[],
    prices: string[],
    categoriesValue: string[],
    featured: boolean,
    discounted: boolean
  ) => {
    const qs = new URLSearchParams()

    if (sort && sort !== 'display') {
      qs.set('sort', sort)
    }

    if (genders.length) {
      qs.set('gender', genders.join(','))
    }

    if (prices.length) {
      qs.set('price', prices.join(','))
    }

    const categoriesForQuery = category
      ? categoriesValue.filter((item) => item !== category)
      : categoriesValue

    if (categoriesForQuery.length) {
      qs.set('categories', categoriesForQuery.join(','))
    }

    if (featured) {
      qs.set('featured', 'true')
    }

    if (discounted) {
      qs.set('discounted', 'true')
    }

    if (category) {
      return `/categories/${category}${qs.toString() ? `?${qs.toString()}` : ''}`
    }

    return `/products${qs.toString() ? `?${qs.toString()}` : ''}`
  }

  const fetchProducts = (
    category: string,
    sort: string,
    genders: string[],
    prices: string[],
    categoriesValue: string[],
    featured: boolean,
    discounted: boolean
  ) => {
    startTransition(async () => {
      try {
        const qs = new URLSearchParams()

        if (category) {
          qs.set('category', category)
        }

        const categoriesForQuery = category
          ? categoriesValue.filter((item) => item !== category)
          : categoriesValue

        if (categoriesForQuery.length) {
          qs.set('categories', categoriesForQuery.join(','))
        }

        if (sort) {
          qs.set('sort', sort)
        }

        if (genders.length) {
          qs.set('gender', genders.join(','))
        }

        if (prices.length) {
          qs.set('price', prices.join(','))
        }

        if (featured) {
          qs.set('featured', 'true')
        }

        if (discounted) {
          qs.set('discounted', 'true')
        }

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

  const syncUrlAndData = (
    nextCategory: string,
    nextSort: string,
    nextGenders: string[],
    nextPrices: string[],
    nextCategories: string[],
    nextFeatured: boolean,
    nextDiscounted: boolean
  ) => {
    const nextUrl = buildUrl(
      nextCategory,
      nextSort,
      nextGenders,
      nextPrices,
      nextCategories,
      nextFeatured,
      nextDiscounted
    )

    router.push(nextUrl, { scroll: false })

    fetchProducts(
      nextCategory,
      nextSort,
      nextGenders,
      nextPrices,
      nextCategories,
      nextFeatured,
      nextDiscounted
    )
  }

  const toggleArrayValue = (values: string[], value: string) => {
    return values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values, value]
  }

  const handleMainCategoryChange = (slug: string) => {
    setActiveCategory(slug)

    const nextCategories = slug
      ? selectedCategories.filter((item) => item !== slug)
      : selectedCategories

    syncUrlAndData(
      slug,
      currentSort,
      selectedGenders,
      selectedPrices,
      nextCategories,
      selectedFeatured,
      selectedDiscounted
    )
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value
    setCurrentSort(sort)

    syncUrlAndData(
      activeCategory,
      sort,
      selectedGenders,
      selectedPrices,
      selectedCategories,
      selectedFeatured,
      selectedDiscounted
    )
  }

  const handleGenderToggle = (value: string) => {
    const nextValues = toggleArrayValue(selectedGenders, value)
    setSelectedGenders(nextValues)

    syncUrlAndData(
      activeCategory,
      currentSort,
      nextValues,
      selectedPrices,
      selectedCategories,
      selectedFeatured,
      selectedDiscounted
    )
  }

  const handlePriceToggle = (value: string) => {
    const nextValues = toggleArrayValue(selectedPrices, value)
    setSelectedPrices(nextValues)

    syncUrlAndData(
      activeCategory,
      currentSort,
      selectedGenders,
      nextValues,
      selectedCategories,
      selectedFeatured,
      selectedDiscounted
    )
  }

  const handleCategoryToggle = (value: string) => {
    const nextValues = toggleArrayValue(
      selectedCategories.filter((item) => item !== activeCategory),
      value
    )
    setSelectedCategories(nextValues)

    syncUrlAndData(
      activeCategory,
      currentSort,
      selectedGenders,
      selectedPrices,
      nextValues,
      selectedFeatured,
      selectedDiscounted
    )
  }

  const handleFeatureToggle = (value: 'featured' | 'discounted') => {
    const nextFeatured = value === 'featured' ? !selectedFeatured : selectedFeatured
    const nextDiscounted = value === 'discounted' ? !selectedDiscounted : selectedDiscounted

    setSelectedFeatured(nextFeatured)
    setSelectedDiscounted(nextDiscounted)

    syncUrlAndData(
      activeCategory,
      currentSort,
      selectedGenders,
      selectedPrices,
      selectedCategories,
      nextFeatured,
      nextDiscounted
    )
  }

  const clearFilters = () => {
    setCurrentSort('display')
    setSelectedGenders([])
    setSelectedPrices([])
    setSelectedCategories([])
    setSelectedFeatured(false)
    setSelectedDiscounted(false)
    setActiveCategory('')

    router.push('/products', { scroll: false })
    fetchProducts('', 'display', [], [], [], false, false)
  }

  const FilterSection = ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <div className="pb-7 mb-7 border-b border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  )

  return (
    <section className="section section-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-10">
          <aside className="lg:sticky lg:top-24 self-start">
            
          <FilterSection title="Kategoriler">
              <div className="space-y-3">
                {categories.map((category) => {
                  const checked =
                    activeCategory === category.slug || selectedCategories.includes(category.slug)

                  return (
                    <label key={category.id} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCategoryToggle(category.slug)}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span>{category.name}</span>
                    </label>
                  )
                })}
              </div>
            </FilterSection>

            
            <FilterSection title="Cinsiyet">
              <div className="space-y-3">
                {GENDER_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGenders.includes(option.value)}
                      onChange={() => handleGenderToggle(option.value)}
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>



            <FilterSection title="Fiyat Aralığı">
              <div className="space-y-3">
                {PRICE_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes(option.value)}
                      onChange={() => handlePriceToggle(option.value)}
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Özellikler">
              <div className="space-y-3">
                {FEATURE_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={option.value === 'featured' ? selectedFeatured : selectedDiscounted}
                      onChange={() => handleFeatureToggle(option.value as 'featured' | 'discounted')}
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <button
              onClick={clearFilters}
              className="w-full border border-gray-300 text-gray-700 text-sm font-medium px-4 py-3 rounded hover:bg-gray-50 transition-colors"
            >
              Filtreleri Temizle
            </button>
          </aside>

          <div>
            

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{products.length}</span> ürün bulundu
              </p>

              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-sm text-gray-700">
                  Sırala:
                </label>
                <select
                  id="sort"
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
                  <option value="name-asc">İsim: A-Z</option>
                  <option value="name-desc">İsim: Z-A</option>
                </select>
              </div>
            </div>

            {products.length > 0 ? (
              <div className={`products-grid transition-opacity ${isPending ? 'opacity-60' : 'opacity-100'}`}>
                {products.map((product) => {
                  const primaryImage =
                    product.images.find((img) => img.isPrimary)?.imageUrl ||
                    product.images[0]?.imageUrl ||
                    '/placeholder.jpg'

                  const displayPrice = product.discountPrice || product.price
                  const hasDiscount = product.discountPrice && product.discountPrice < product.price
                  const discountRate = hasDiscount
                    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
                    : 0

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

                        {product.isFeatured && (
                          <span className="absolute top-3 right-3 bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded font-medium">
                            Öne Çıkan
                          </span>
                        )}

                        {hasDiscount && (
                          <span className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded font-medium">
                            -%{discountRate}
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

                        <div className="flex items-center gap-2 mb-4">
                          {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(product.price)}
                            </span>
                          )}
                          <span className="font-medium text-gray-900">
                            {formatPrice(displayPrice)}
                          </span>
                        </div>

                        <div className="inline-flex items-center justify-center w-full bg-black text-white text-xs font-semibold tracking-wider uppercase px-4 py-3 rounded">
                          Sepete Ekle
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-6">Bu filtrelere uygun ürün bulunamadı.</p>
                <button onClick={clearFilters} className="btn btn-secondary">
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}