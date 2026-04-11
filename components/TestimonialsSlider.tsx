'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  product: string
  review: string
  rating: number
  avatar: string
  date: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ayşe Yılmaz',
    product: 'Zarif Gümüş Kolye',
    review: 'Muhteşem bir işçilik! Hem zarif hem de modern. Aldığım en iyi hediye oldu. Kesinlikle tavsiye ediyorum.',
    rating: 5,
    avatar: '/avatars/avatar-1.jpg',
    date: '2 gün önce'
  },
  {
    id: 2,
    name: 'Mehmet Kaya',
    product: 'Premium Gümüş Bileklik',
    review: 'Eşime aldım, çok beğendi. Kalitesi gerçekten premium, her detay düşünülmüş. Teşekkürler Silvre!',
    rating: 5,
    avatar: '/avatars/avatar-2.jpg',
    date: '1 hafta önce'
  },
  {
    id: 3,
    name: 'Zeynep Demir',
    product: 'Lüks Gümüş Küpe',
    review: 'İnanılmaz zarif! Hem günlük hem de özel günlerde kullanabiliyorum. El işçiliği çok kaliteli.',
    rating: 5,
    avatar: '/avatars/avatar-3.jpg',
    date: '2 hafta önce'
  },
  {
    id: 4,
    name: 'Ahmet Şahin',
    product: 'Minimalist Gümüş Yüzük',
    review: 'Minimalist tasarımını çok sevdim. Tam aradığım gibiydi. Kargo da çok hızlıydı.',
    rating: 5,
    avatar: '/avatars/avatar-4.jpg',
    date: '3 hafta önce'
  },
  {
    id: 5,
    name: 'Elif Arslan',
    product: 'Özel Tasarım Kolye',
    review: 'Kişiye özel tasarım hizmeti harika! İstediğim gibi bir kolye yaptılar. Çok mutluyum.',
    rating: 5,
    avatar: '/avatars/avatar-5.jpg',
    date: '1 ay önce'
  }
]

export default function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const itemsPerView = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= testimonials.length ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(testimonials.length - itemsPerView, 0) : prev - 1
    )
  }

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(nextSlide, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  return (
    <section className="testimonials-section">
      <div className="container mx-auto px-4 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-light italic text-gray-900 mb-4">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-lg text-gray-600">
            Binlerce mutlu müşterimizin görüşleri
          </p>
        </div>

        {/* Slider Container */}
        <div 
          className="slider-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="nav-button prev"
            aria-label="Önceki yorumlar"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="nav-button next"
            aria-label="Sonraki yorumlar"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Testimonials Track */}
          <div className="slider-track">
            <div
              className="slider-items"
              style={{
                transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="testimonial-card"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  {/* Quote Icon */}
                  <Quote className="quote-icon" />

                  {/* Rating Stars */}
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating ? 'star-filled' : 'star-empty'
                        }`}
                        fill={i < testimonial.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="review-text">{testimonial.review}</p>

                  {/* Author Info */}
                  <div className="author-info">
                    <div className="author-avatar">
                      <div className="avatar-placeholder">
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <p className="author-name">{testimonial.name}</p>
                      <p className="author-product">{testimonial.product}</p>
                      <p className="author-date">{testimonial.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="dots-container">
            {Array.from({ 
              length: Math.ceil(testimonials.length / itemsPerView) 
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerView)}
                className={`dot ${
                  Math.floor(currentIndex / itemsPerView) === index ? 'active' : ''
                }`}
                aria-label={`Sayfa ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonials-section {
          background: white;
        }

        .slider-container {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 60px;
        }

        .slider-track {
          overflow: hidden;
          border-radius: 12px;
        }

        .slider-items {
          display: flex;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .testimonial-card {
          padding: 0 15px;
          flex-shrink: 0;
        }

        .testimonial-card > div {
          background: linear-gradient(135deg, #faf8f5 0%, #f5f3f0 100%);
          border-radius: 12px;
          padding: 2rem;
          height: 100%;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .testimonial-card > div:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .quote-icon {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 40px;
          height: 40px;
          color: #D4AF37;
          opacity: 0.2;
        }

        .stars {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }

        .star-filled {
          color: #D4AF37;
        }

        .star-empty {
          color: #e5e5e5;
        }

        .review-text {
          font-size: 1rem;
          line-height: 1.7;
          color: #2c2c2c;
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .author-avatar {
          position: relative;
        }

        .avatar-placeholder {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C0C0C0, #D4AF37);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
        }

        .author-name {
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 0.25rem;
        }

        .author-product {
          font-size: 0.875rem;
          color: #8c8c8c;
          margin-bottom: 0.25rem;
        }

        .author-date {
          font-size: 0.75rem;
          color: #a3a3a3;
        }

        /* Navigation Buttons */
        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: white;
          border: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .nav-button:hover {
          background: #2c2c2c;
          color: white;
          border-color: #2c2c2c;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .nav-button.prev {
          left: 0;
        }

        .nav-button.next {
          right: 0;
        }

        /* Dots Indicator */
        .dots-container {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #e5e5e5;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot:hover,
        .dot.active {
          background: #D4AF37;
          transform: scale(1.2);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .slider-container {
            padding: 0 40px;
          }

          .nav-button {
            width: 40px;
            height: 40px;
          }

          .testimonial-card {
            padding: 0 10px;
          }

          .testimonial-card > div {
            padding: 1.5rem;
          }
        }
      `}</style>
    </section>
  )
}
