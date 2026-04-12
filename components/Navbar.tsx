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

  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
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
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Ana sayfada scroll olmadan: %20 siyah arka plan, beyaz logo + ikonlar
  const isTransparent = isHomePage && !scrolled && !menuOpen

  return (
    <>
      {/* ── Header ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: menuOpen
            ? '#ffffff'
            : isTransparent
              ? 'rgba(0, 0, 0, 0.20)'
              : '#ffffff',
          borderBottom: menuOpen
            ? '0.5px solid #f0f0f0'
            : isTransparent
              ? '0.5px solid rgba(255,255,255,0.12)'
              : '0.5px solid #ebebeb',
          boxShadow: !isTransparent && !menuOpen
            ? '0 1px 12px rgba(0,0,0,0.06)'
            : 'none',
        }}
      >
        <nav className="container mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[68px] sm:h-[76px]">

            {/* Sol — logo */}
            <Link
              href="/"
              className="hover:opacity-70 transition-opacity duration-300 flex-shrink-0"
              onClick={() => setMenuOpen(false)}
            >
              <Image
                src="/uploads/images/silvre-logo-black.png"
                alt="SILVRE"
                width={160}
                height={46}
                className={`h-9 sm:h-11 w-auto transition-all duration-300 ${
                  isTransparent ? 'brightness-0 invert' : ''
                }`}
                priority
              />
            </Link>

            {/* Sağ — ikonlar + hamburger */}
            <div
              className="flex items-center gap-4 sm:gap-5 transition-colors duration-300"
              style={{ color: isTransparent ? '#ffffff' : '#111111' }}
            >

              {/* Kullanıcı */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    onBlur={() => setTimeout(() => setAccountOpen(false), 200)}
                    className="p-1.5 hover:opacity-50 transition-opacity"
                    aria-label="Hesap"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 rounded shadow-xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link href="/orders" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Siparişlerim</Link>
                      <Link href="/addresses" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Adreslerim</Link>
                      <Link href="/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Profil</Link>
                      {user.role === 'admin' && (
                        <Link href="/admin" className="block px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors">Admin Panel</Link>
                      )}
                      <div className="border-t border-gray-50 my-1" />
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-1.5 hover:opacity-50 transition-opacity"
                  aria-label="Giriş Yap"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </Link>
              )}

              {/* Sepet */}
              <Link
                href="/cart"
                className="relative p-1.5 hover:opacity-50 transition-opacity"
                aria-label="Sepet"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M9 21a1 1 0 100-2 1 1 0 000 2zM19 21a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gray-900 text-white text-[9px] font-medium min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 hover:opacity-50 transition-opacity"
                aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {menuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="7" x2="21" y2="7" />
                      <line x1="3" y1="14" x2="21" y2="14" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Spacer — ana sayfada yok (video/hero tam ekran kayar) ── */}
      {!isHomePage && <div className="h-[68px] sm:h-[76px]" />}

      {/* ── Full-screen overlay menü ── */}
      <div
        className={`fixed inset-0 z-40 bg-white flex flex-col transition-all duration-500 ease-in-out ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col justify-between h-full px-8 pt-[68px] sm:pt-[76px]">

          {/* Kategoriler */}
          <div className="flex-1 flex flex-col justify-center px-16 sm:px-16">
            <nav aria-label="Ana menü">

              <div className="mb-10">
                {categories.map((cat, i) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-baseline justify-between py-4 border-b border-gray-100 transition-all duration-300"
                    style={{
                      transitionDelay: menuOpen ? `${i * 50}ms` : '0ms',
                      opacity: menuOpen ? 1 : 0,
                      transform: menuOpen ? 'translateY(0)' : 'translateY(8px)',
                    }}
                  >
                    <span className="font-serif text-xl sm:text-2xl font-light text-gray-900 group-hover:text-gray-400 transition-colors duration-200">
                      {cat.name}
                    </span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}

                {/* Tüm ürünler */}
                <Link
                  href="/products"
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-baseline justify-between py-4 border-b border-gray-100 transition-all duration-300"
                  style={{
                    transitionDelay: menuOpen ? `${categories.length * 50}ms` : '0ms',
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'translateY(0)' : 'translateY(8px)',
                  }}
                >
                  <span className="font-serif text-xl sm:text-2xl font-light text-gray-900 group-hover:text-gray-400 transition-colors duration-200">
                    Tüm Ürünler
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* İkincil linkler */}
              <div className="flex flex-col gap-1">
                {[
                  { href: '/about', label: 'Hakkımızda' },
                  { href: '/contact', label: 'İletişim' },
                ].map(({ href, label }, i) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm tracking-widest uppercase text-gray-400 hover:text-gray-700 transition-all duration-300 py-1 w-fit"
                    style={{
                      transitionDelay: menuOpen ? `${(categories.length + 1 + i) * 50}ms` : '0ms',
                      opacity: menuOpen ? 1 : 0,
                      transform: menuOpen ? 'translateY(0)' : 'translateY(8px)',
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Alt — marka notu + sosyal */}
          <div
            className="px-8 sm:px-16 py-8 border-t border-gray-100 flex items-center justify-between transition-all duration-500"
            style={{
              transitionDelay: menuOpen ? '350ms' : '0ms',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(8px)',
            }}
          >
            <p className="text-xs tracking-widest uppercase text-gray-400">
              El yapımı · 925 Ayar Gümüş
            </p>
            <a
              href="https://instagram.com/silvre"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-widest uppercase text-gray-400 hover:text-gray-700 transition-colors"
            >
              Instagram
            </a>
          </div>

        </div>
      </div>
    </>
  )
}
