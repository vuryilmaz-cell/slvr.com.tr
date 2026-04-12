'use client'

import Image from 'next/image'

// ─────────────────────────────────────────────
//  Görselleri buraya ekle:
//  public/uploads/instagram/post-1.jpg  ...  post-6.jpg
//
//  Gerçek Instagram API'ye geçmek istediğinde
//  sadece bu diziyi API response ile değiştir.
// ─────────────────────────────────────────────
const posts = [
  { id: 1, src: '/uploads/instagram/post-1.jpeg', alt: 'Silvre gümüş kolye detay' },
  { id: 2, src: '/uploads/instagram/post-2.jpeg', alt: 'Silvre gümüş küpe koleksiyon' },
  { id: 3, src: '/uploads/instagram/post-3.jpeg', alt: 'Silvre el yapımı yüzük' },
  { id: 4, src: '/uploads/instagram/post-4.jpeg', alt: 'Silvre gümüş bileklik' },
  { id: 5, src: '/uploads/instagram/post-5.jpeg', alt: 'Silvre özel tasarım mücevher' },
  { id: 6, src: '/uploads/instagram/post-6.jpeg', alt: 'Silvre 925 ayar gümüş takı' },
]

const INSTAGRAM_URL = 'https://instagram.com/silvre.jewelry'

export default function InstagramFeed() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Başlık */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {/* Instagram ikonu */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-gray-400"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span className="text-xs font-medium tracking-[0.18em] uppercase text-gray-500">
              @silvre.jewelry
            </span>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium tracking-[0.14em] uppercase text-gray-400 hover:text-gray-900 transition-colors duration-200 border-b border-gray-200 hover:border-gray-900 pb-0.5"
          >
            Takip Et
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-1.5">
          {posts.map((post) => (
            <a
              key={post.id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-gray-100 block"
              aria-label={post.alt}
            >
              <Image
                src={post.src}
                alt={post.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 33vw, 16.66vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
