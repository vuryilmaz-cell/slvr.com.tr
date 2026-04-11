'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react'

interface LuxuryProductCardProps {
  product: {
    id: number
    name: string
    slug: string
    category: string
    price: number
    discountPrice?: number
    image: string
    rating: number
    reviewCount: number
    isPremium?: boolean
  }
}

export default function LuxuryProductCard({ product }: LuxuryProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)

  const displayPrice = product.discountPrice || product.price
  const hasDiscount = !!product.discountPrice

  return (
    <article 
      className="luxury-product-card group"
      onMouseEnter={() => setShowQuickView(true)}
      onMouseLeave={() => setShowQuickView(false)}
    >
      {/* Image Container */}
      <div className="product-image-container">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.image}
            alt={`${product.name} - 925 ayar gümüş ${product.category.toLowerCase()}`}
            fill
            className="product-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>

        {/* Shimmer Effect */}
        <div className="shimmer-effect" />

        {/* Quick View Overlay */}
        <div className={`quick-view-overlay ${showQuickView ? 'active' : ''}`}>
          <button className="quick-view-btn">
            <Eye className="w-5 h-5" />
            Hızlı Görüntüle
          </button>
        </div>

        {/* Premium Badge */}
        {product.isPremium && (
          <span className="premium-badge">
            ✨ Premium
          </span>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="discount-badge">
            -%{Math.round(((product.price - displayPrice) / product.price) * 100)}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          aria-label="Favorilere ekle"
        >
          <Heart
            className="w-5 h-5"
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="product-info">
        {/* Category */}
        <span className="product-category">{product.category}</span>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>

        {/* Rating */}
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'star-filled'
                    : 'star-empty'
                }`}
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="review-count">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="product-price">
          {hasDiscount && (
            <span className="price-original">
              {product.price.toLocaleString('tr-TR')} ₺
            </span>
          )}
          <span className="price-current">
            {displayPrice.toLocaleString('tr-TR')} ₺
          </span>
        </div>

        {/* Add to Cart Button */}
        <button className="add-to-cart-btn">
          <ShoppingBag className="w-5 h-5" />
          Sepete Ekle
        </button>
      </div>

      <style jsx>{`
        .luxury-product-card {
          position: relative;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .luxury-product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        /* Image Container */
        .product-image-container {
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #FAF8F5;
        }

        .product-image {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .group:hover .product-image {
          transform: scale(1.08);
        }

        /* Shimmer Effect */
        .shimmer-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          opacity: 0;
          pointer-events: none;
        }

        .group:hover .shimmer-effect {
          opacity: 1;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }

        /* Quick View Overlay */
        .quick-view-overlay {
          position: absolute;
          inset: 0;
          background: rgba(26, 26, 26, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .quick-view-overlay.active {
          opacity: 1;
          pointer-events: all;
        }

        .quick-view-btn {
          background: white;
          color: #2C2C2C;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 500;
          font-size: 0.9375rem;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transform: translateY(20px);
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .quick-view-overlay.active .quick-view-btn {
          transform: translateY(0);
        }

        .quick-view-btn:hover {
          background: #D4AF37;
          color: white;
        }

        /* Premium Badge */
        .premium-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(135deg, #C0C0C0 0%, #D4AF37 50%, #C0C0C0 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
          z-index: 10;
        }

        /* Discount Badge */
        .discount-badge {
          position: absolute;
          top: 1rem;
          right: 4rem;
          background: #EF4444;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          z-index: 10;
        }

        /* Wishlist Button */
        .wishlist-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 40px;
          height: 40px;
          background: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2C2C2C;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          z-index: 10;
        }

        .wishlist-btn:hover,
        .wishlist-btn.active {
          background: #B76E79;
          color: white;
          transform: scale(1.1);
        }

        /* Product Info */
        .product-info {
          padding: 1.5rem;
        }

        .product-category {
          font-size: 0.75rem;
          color: #8C8C8C;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
          display: block;
          margin-bottom: 0.5rem;
        }

        .product-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem;
          font-weight: 400;
          font-style: italic;
          color: #2C2C2C;
          margin: 0.5rem 0 0.75rem;
          line-height: 1.3;
          transition: color 0.3s ease;
        }

        .product-name:hover {
          color: #D4AF37;
        }

        /* Rating */
        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .stars {
          display: flex;
          gap: 0.25rem;
        }

        .star-filled {
          color: #D4AF37;
        }

        .star-empty {
          color: #E5E5E5;
        }

        .review-count {
          font-size: 0.875rem;
          color: #8C8C8C;
        }

        /* Price */
        .product-price {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .price-original {
          font-size: 0.9375rem;
          color: #8C8C8C;
          text-decoration: line-through;
        }

        .price-current {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2C2C2C;
          font-family: 'Montserrat', sans-serif;
        }

        /* Add to Cart Button */
        .add-to-cart-btn {
          width: 100%;
          background: #2C2C2C;
          color: white;
          padding: 1rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.9375rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .add-to-cart-btn:hover {
          background: #D4AF37;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
        }
      `}</style>
    </article>
  )
}
