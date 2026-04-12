'use client'

import { useState, useEffect, useCallback } from 'react'

interface Testimonial {
  id: number
  name: string
  product: string
  review: string
  rating: number
  date: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ayşe Yılmaz',
    product: 'Zarif Gümüş Kolye',
    review: 'Muhteşem bir işçilik! Hem zarif hem de modern. Aldığım en iyi hediye oldu. Kesinlikle tavsiye ediyorum.',
    rating: 5,
    date: '2 gün önce',
  },
  {
    id: 2,
    name: 'Mehmet Kaya',
    product: 'Premium Gümüş Bileklik',
    review: 'Eşime aldım, çok beğendi. Kalitesi gerçekten premium, her detay düşünülmüş. Teşekkürler Silvre!',
    rating: 5,
    date: '1 hafta önce',
  },
  {
    id: 3,
    name: 'Zeynep Demir',
    product: 'Lüks Gümüş Küpe',
    review: 'İnanılmaz zarif! Hem günlük hem de özel günlerde kullanabiliyorum. El işçiliği çok kaliteli.',
    rating: 5,
    date: '2 hafta önce',
  },
  {
    id: 4,
    name: 'Ahmet Şahin',
    product: 'Minimalist Gümüş Yüzük',
    review: 'Minimalist tasarımını çok sevdim. Tam aradığım gibiydi. Kargo da çok hızlıydı.',
    rating: 5,
    date: '3 hafta önce',
  },
  {
    id: 5,
    name: 'Elif Arslan',
    product: 'Özel Tasarım Kolye',
    review: 'Kişiye özel tasarım hizmeti harika! İstediğim gibi bir kolye yaptılar. Çok mutluyum.',
    rating: 5,
    date: '1 ay önce',
  },
  {
    id: 6,
    name: 'Selin Öztürk',
    product: 'Gümüş Zincir Bileklik',
    review: 'Ürün fotoğraflardaki gibi, hatta daha güzel. Ambalajı da çok özenli. Tekrar alacağım.',
    rating: 5,
    date: '1 ay önce',
  },
]

const ITEMS_PER_PAGE = 3

export default function TestimonialsSlider() {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE)

  const next = useCallback(() => setPage(p => (p + 1) % totalPages), [totalPages])
  const prev = () => setPage(p => (p - 1 + totalPages) % totalPages)

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const visible = testimonials.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  )

  return (
    <section className="py-16 sm:py-20 bg-[#faf9f7]">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Başlık */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-light italic text-gray-900 mb-3">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-sm text-gray-400 tracking-wide">
            Binlerce mutlu müşterimizin görüşleri
          </p>
        </div>

        {/* Kartlar */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {visible.map((t, i) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-7 flex flex-col gap-5 border border-gray-100"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Yıldızlar */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg
                      key={s}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={s < t.rating ? '#C9A96E' : 'none'}
                      stroke={s < t.rating ? '#C9A96E' : '#d1d5db'}
                      strokeWidth="1.5"
                    >
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>

                {/* Yorum metni */}
                <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">
                  &ldquo;{t.review}&rdquo;
                </p>

                {/* Kullanıcı */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  {/* Avatar baş harfi */}
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-500">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{t.name}</p>
                    <p className="text-xs text-gray-400 truncate">{t.product} · {t.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ok butonları */}
          <button
            onClick={prev}
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors shadow-sm"
            aria-label="Önceki"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors shadow-sm"
            aria-label="Sonraki"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Sayfa noktaları */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`rounded-full transition-all duration-300 ${
                i === page
                  ? 'w-5 h-2 bg-gray-700'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Sayfa ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
