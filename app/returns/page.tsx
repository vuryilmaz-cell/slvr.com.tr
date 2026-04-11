import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'İade & Değişim',
  description: '14 gün içinde koşulsuz iade. Gümüş takılarınızı güvenle satın alın.',
}

export default function ReturnsPage() {
  return (
    <main>
      <div className="container mx-auto px-4 max-w-3xl py-32">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-light italic mb-3 text-gray-900">İade & Değişim Politikası</h1>
          <p className="text-gray-500 text-lg">Memnuniyetiniz bizim önceliğimizdir</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg p-10 shadow-sm space-y-8 leading-relaxed">

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4 text-gray-900">İade Hakkı</h2>
            <p className="text-gray-500 mb-4">
              Silvre Jewelry olarak müşteri memnuniyetini ön planda tutuyoruz. Satın aldığınız
              ürünleri, teslim aldığınız tarihten itibaren <strong className="text-gray-800">14 gün içerisinde</strong> iade edebilirsiniz.
            </p>
            <div className="bg-gray-50 border-l-4 border-gray-800 rounded-r-lg p-4 text-sm text-gray-600">
              <strong className="text-gray-800">Önemli:</strong> İade edilecek ürünlerin kullanılmamış, etiketleri
              sökülmemiş ve orijinal ambalajında olması gerekmektedir.
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4 text-gray-900">İade Koşulları</h2>
            <h3 className="font-medium text-gray-900 mb-2">İade Edilebilir Ürünler:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-500 mb-4">
              <li>Orijinal ambalajında ve etiketleri ile birlikte olan ürünler</li>
              <li>Kullanılmamış, hasar görmemiş ürünler</li>
              <li>Tüm aksesuarları ve belgeleri ile birlikte olan ürünler</li>
            </ul>
            <h3 className="font-medium text-gray-900 mb-2">İade Edilemeyen Ürünler:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>Kişiye özel üretilmiş veya kişiselleştirilmiş ürünler</li>
              <li>Hijyen koşulları nedeniyle kullanılmış küpe ürünleri</li>
              <li>Ambalajı açılmış veya hasarlı ürünler</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4 text-gray-900">İade Süreci</h2>
            <ol className="space-y-5">
              {[
                {
                  step: '1. İade Talebi Oluşturma',
                  items: ['Hesabınıza giriş yapın', '"Siparişlerim" bölümünden ilgili siparişi seçin', '"İade Talebi Oluştur" butonuna tıklayın', 'İade nedeninizi belirtin'],
                },
                {
                  step: '2. Ürünü Gönderme',
                  items: ['Ürünü orijinal ambalajı ile paketleyin', 'İade formunu paketin içine koyun', 'Anlaşmalı kargo firması ile gönderin'],
                },
                {
                  step: '3. İnceleme & Onay',
                  items: ['Ürün depomuzda incelenir (1-2 iş günü)', 'İade uygunsa onaylanır', 'E-posta ile bilgilendirilirsiniz'],
                },
                {
                  step: '4. İade Ödemesi',
                  items: ['Kredi kartı ödemeleri: 2-7 iş günü', 'Havale/EFT ödemeleri: 1-3 iş günü'],
                },
              ].map(({ step, items }) => (
                <li key={step}>
                  <strong className="text-gray-800 block mb-1">{step}</strong>
                  <ul className="list-disc list-inside space-y-1 text-gray-500 ml-2">
                    {items.map(i => <li key={i}>{i}</li>)}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4 text-gray-900">İade Kargo Ücreti</h2>
            <ul className="space-y-2 text-gray-500">
              <li><strong className="text-gray-800">Cayma hakkı kullanımı:</strong> Kargo ücreti müşteriye aittir</li>
              <li><strong className="text-gray-800">Hatalı/Hasarlı ürün:</strong> Kargo ücreti tarafımızca karşılanır</li>
              <li><strong className="text-gray-800">Yanlış ürün gönderimi:</strong> Kargo ücreti tarafımızca karşılanır</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4 text-gray-900">Değişim İşlemleri</h2>
            <p className="text-gray-500 mb-3">
              Ürün değişimi yapmak için öncelikle iade işlemi başlatmanız gerekmektedir.
              İade onaylandıktan sonra yeni ürün siparişinizi verebilirsiniz.
            </p>
            <div className="bg-gray-50 border-l-4 border-gray-800 rounded-r-lg p-4 text-sm text-gray-600">
              <strong className="text-gray-800">Not:</strong> Stok durumuna göre değişim süreci 3-7 iş günü sürebilir.
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4 text-gray-900">İletişim</h2>
            <ul className="space-y-1 text-gray-500">
              <li><strong className="text-gray-800">E-posta:</strong> <a href="mailto:info@slvr.com.tr" className="underline">info@slvr.com.tr</a></li>
              <li><strong className="text-gray-800">Telefon:</strong> <a href="tel:+908501234567" className="underline">0850 123 45 67</a></li>
              <li><strong className="text-gray-800">Çalışma Saatleri:</strong> Hafta içi 09:00 – 18:00</li>
            </ul>
          </section>

          <p className="pt-6 border-t border-gray-100 text-xs text-gray-400">
            Bu politika en son 31 Mart 2026 tarihinde güncellenmiştir.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/faq" className="text-sm text-gray-500 underline hover:text-gray-900">
            Sıkça Sorulan Sorular
          </Link>
          <span className="mx-3 text-gray-300">|</span>
          <Link href="/contact" className="text-sm text-gray-500 underline hover:text-gray-900">
            Bize Ulaşın
          </Link>
        </div>
      </div>
    </main>
  )
}
