'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface Category {
  id: number
  name: string
  slug: string
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-primary-950 ${
          isHomePage 
            ? (scrolled 
                ? 'bg-white shadow-sm' 
                : 'bg-black/30'
              )
            : (scrolled 
                ? 'bg-white/98 backdrop-blur-md shadow-sm' 
                : 'bg-white/95 backdrop-blur-sm'
                
              )
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-start">
              <Link href="/" className="block hover:opacity-70 transition-opacity duration-300">
                <Image 
                  src="/uploads/images/silvre-logo-black.png" 
                  alt="SILVRE" 
                  width={130} 
                  height={38}
                  className={`h-8 sm:h-9 w-auto transition-all duration-300 ${
                    isHomePage && !scrolled ? 'brightness-0 invert' : ''
                  }`}
                  priority
                />
              </Link>
            </div>

            <div className={`flex items-center gap-4 sm:gap-5 ${
              isHomePage && !scrolled ? 'text-white' : 'text-gray-900'
            }`}>
              {user ? (
                <div className="hidden sm:block relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                    className="p-1.5 hover:opacity-60 transition-opacity"
                    aria-label="Hesap"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded shadow-xl py-2">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link href="/orders" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Siparişlerim</Link>
                      <Link href="/addresses" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Adreslerim</Link>
                      <Link href="/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Profil</Link>
                      {user.role === 'admin' && (
                        <Link href="/admin" className="block px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors">Admin Panel</Link>
                      )}
                      <div className="border-t border-gray-50 my-2"></div>
                      <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">Çıkış Yap</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="hidden sm:flex items-center gap-2 text-xs font-medium tracking-wide uppercase px-4 py-2 border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  Giriş
                </Link>
              )}

              <Link 
                href="/cart" 
                className="relative p-1.5 hover:opacity-60 transition-opacity group"
                aria-label="Sepet"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5.6M17 13l1.4 5.6M9 21a1 1 0 100-2 1 1 0 000 2zM19 21a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 hover:opacity-60 transition-opacity"
                aria-label="Menü"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {mobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 transform transition-transform duration-500 ease-out shadow-2xl ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <Image 
              src="/uploads/images/silvre-logo-black.png" 
              alt="SILVRE" 
              width={120} 
              height={35}
              className="h-7 w-auto"
            />
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              aria-label="Kapat"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="py-6">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-3.5 text-sm font-medium tracking-wide hover:bg-gray-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
                Ana Sayfa
              </Link>
              
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-3.5 text-sm font-medium tracking-wide hover:bg-gray-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Tüm Ürünler
              </Link>
            </div>

            {categories.length > 0 && (
              <>
                <div className="px-6 pb-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Koleksiyon
                  </div>
                </div>
                <div className="pb-6">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="h-16 sm:h-[68px]"></div>
    </>
  )
}
