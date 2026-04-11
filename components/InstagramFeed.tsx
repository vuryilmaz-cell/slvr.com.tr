'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface InstagramPost {
  id: string
  image: string
  likes: number
  comments: number
  link: string
  caption?: string
}

// Mock data - gerçek Instagram API ile değiştirilecek
const mockInstagramPosts: InstagramPost[] = [
  {
    id: '1',
    image: '/instagram/post-1.jpg',
    likes: 1240,
    comments: 45,
    link: 'https://instagram.com/silvre',
    caption: 'Yeni koleksiyon ✨'
  },
  {
    id: '2',
    image: '/instagram/post-2.jpg',
    likes: 980,
    comments: 32,
    link: 'https://instagram.com/silvre',
    caption: 'El yapımı zarafet'
  },
  {
    id: '3',
    image: '/instagram/post-3.jpg',
    likes: 1560,
    comments: 67,
    link: 'https://instagram.com/silvre',
    caption: '925 ayar kalitesi'
  },
  {
    id: '4',
    image: '/instagram/post-4.jpg',
    likes: 2100,
    comments: 89,
    link: 'https://instagram.com/silvre',
    caption: 'Zarif tasarımlar 💎'
  },
  {
    id: '5',
    image: '/instagram/post-5.jpg',
    likes: 1890,
    comments: 54,
    link: 'https://instagram.com/silvre',
    caption: 'Premium koleksiyon'
  },
  {
    id: '6',
    image: '/instagram/post-6.jpg',
    likes: 1670,
    comments: 41,
    link: 'https://instagram.com/silvre',
    caption: 'Lüks detaylar ✨'
  }
]

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulated API call - gerçek Instagram API entegrasyonu için
    setTimeout(() => {
      setPosts(mockInstagramPosts)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <section className="instagram-section">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="loading-spinner mx-auto" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="instagram-section">
      <div className="container mx-auto px-4 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* Instagram Icon */}
            <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <h2 className="text-3xl md:text-4xl font-serif font-light italic text-gray-900">
              #SilvreMoments
            </h2>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Instagram'da bizi takip edin ve ilhamınızı bulun
          </p>
          <a
            href="https://instagram.com/silvre"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {/* Instagram Icon */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @silvre
          </a>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post, index) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-item group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                {/* Image */}
                <Image
                  src={post.image}
                  alt={post.caption || 'Instagram post'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16.66vw"
                />

                {/* Overlay on Hover */}
                <div className="instagram-overlay">
                  <div className="flex flex-col items-center justify-center gap-4 text-white">
                    <div className="flex items-center gap-2">
                      {/* Heart Icon */}
                      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span className="font-medium">
                        {post.likes.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Message Icon */}
                      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                      <span className="font-medium">
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .instagram-section {
          background: linear-gradient(135deg, #faf8f5 0%, #f5f3f0 100%);
        }

        .instagram-item {
          position: relative;
          display: block;
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .instagram-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .instagram-item:hover .instagram-overlay {
          opacity: 1;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e5e5;
          border-top-color: #2c2c2c;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .instagram-overlay {
            opacity: 0.9;
          }
        }
      `}</style>
    </section>
  )
}
