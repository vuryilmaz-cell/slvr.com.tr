'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface LuxuryProductCardProps {
  product: {
    id: number
    name: string
    slug: string
    category: string
    price: number
    discountPrice?: number | null
    image: string
    rating?: number
    reviewCount?: number
    isPremium?: boolean
  }
}

export default function LuxuryProductCard({ product }: LuxuryProductCardProps) {
  const [hovered, setHovered] = useState(false)

  const displayPrice = product.discountPrice || product.price
  const hasDiscount = !!product.discountPrice
  const discountPercent = hasDiscount
    ? Math.round(((product.price - displayPrice) / product.price) * 100)
    : 0

  return (
    <article
      className="flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Görsel */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={`${product.name} - 999 ayar gümüş ${product.category.toLowerCase()} - Silvre`}
          fill
          className={`object-cover transition-transform duration-700 ease-out ${hovered ? 'scale-105' : 'scale-100'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Hover karartma */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none ${hovered ? 'opacity-10' : 'opacity-0'}`}
        />

        {/* İndirim etiketi */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-[#1A1A1A] text-white text-[10px] font-medium tracking-widest px-2.5 py-1 z-10">
            −{discountPercent}%
          </span>
        )}
      </Link>

      {/* Bilgi alanı */}
      <div className="pt-4 flex flex-col gap-1">
        <span className="text-[10px] text-gray-400 uppercase tracking-[0.16em]">
          {product.category}
        </span>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-[1.0625rem] font-normal italic text-gray-900 leading-snug transition-colors duration-200 hover:text-[#B8A67A]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-sm font-medium tracking-wide text-gray-900">
            {displayPrice.toLocaleString('tr-TR')} ₺
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {product.price.toLocaleString('tr-TR')} ₺
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
