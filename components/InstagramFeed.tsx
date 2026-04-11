'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Instagram, Heart, MessageCircle } from 'lucide-react'

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
            <Instagram className="w-8 h-8 text-gray-800" />
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
            <Instagram className="w-5 h-5" />
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
                      <Heart className="w-5 h-5" fill="white" />
                      <span className="font-medium">
                        {post.likes.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" fill="white" />
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
