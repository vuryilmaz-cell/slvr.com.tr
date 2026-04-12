import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-12">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Brand Section */}
          <div>
            {/* Logo — navbar'daki siyah versiyon, uygun boyut */}
            <Link href="/" className="inline-block mb-5 hover:opacity-70 transition-opacity duration-300">
              <Image
                src="/uploads/images/silvre-logo-black.png"
                alt="SILVRE"
                width={120}
                height={35}
                className="h-8 w-auto"
              />
            </Link>

            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Gümüşle gelen şıklığın en yeni yorumu.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/silvre.jewelry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-800 transition-colors"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="18" cy="6" r="1.2" />
                </svg>
              </a>
              <a
                href="https://facebook.com/silvre.jewelry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-800 transition-colors"
                aria-label="Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://pinterest.com/silvre.jewelry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-800 transition-colors"
                aria-label="Pinterest"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-400 mb-4">
              Hızlı Linkler
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-gray-900 transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-400 mb-4">
              Müşteri Hizmetleri
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Sipariş Takibi
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-500 hover:text-gray-900 transition-colors">
                  İade & Değişim
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Kargo Bilgileri
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-400 mb-4">
              Bülten
            </h4>
            <p className="text-gray-500 text-sm mb-4">
              Yeni ürünler ve kampanyalardan haberdar olun
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                required
                className="px-4 py-2.5 bg-white border border-gray-200 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />
              <button
                type="submit"
                className="bg-gray-900 text-white px-4 py-2.5 rounded text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Abone Ol
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            &copy; 2026 Silvre Jewelry. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-700 transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-700 transition-colors">
              Kullanım Koşulları
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
