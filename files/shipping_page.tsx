import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kargo Bilgileri',
  description: '999 ayar gümüş takı teslimat bilgileri. 500 TL üzeri ücretsiz kargo, hızlı teslimat.',
}

export default function ShippingPage() {
  return (
    <main>
      <div className="container mx-auto px-4 max-w-3xl py-32">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-light italic mb-3 text-gray-900">Kargo Bilgileri</h1>
          <p className="text-gray-500 text-lg">Teslimat süreci ve kargo ücreti hakkında bilgiler</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg p-10 shadow-sm space-y-8 leading-relaxed">

          {/* Ücretsiz kargo banner */}
          <div className="bg-gray-900 text-white rounded-lg p-5 text-center">
            <p className="font-medium tracking-wide">🎁 500 TL ve üzeri alışverişlerde kargo ÜCRETSİZ!</p>
          </div>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-5 text-gray-900">Kargo Süreleri</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-700 border-b border-gray-100">Sipariş Günü</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700 border-b border-gray-100">Kargoya Teslim</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700 border-b border-gray-100">Tahmini Teslimat</th>
                  </tr>
                </thead>
                <tbody className="text-gray-500">
                  <tr className="border-b border-gray-50">
                    <td className="px-4 py-3">Pzt – Cum (17:00&apos;ye kadar)</td>
                    <td className="px-4 py-3">Aynı gün</td>
                    <td className="px-4 py-3">1-3 iş günü</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="px-4 py-3">Pzt – Cum (17:00&apos;den sonra)</td>
                    <td className="px-4 py-3">Ertesi gün</td>
                    <td className="px-4 py-3">2-4 iş günü</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Cumartesi – Pazar</td>
                    <td className="px-4 py-3">Pazartesi</td>
                    <td className="px-4 py-3">2-4 iş günü</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4 text-gray-900">Kargo Ücretleri</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-700 border-b border-gray-100">Sipariş Tutarı</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700 border-b border-gray-100">Kargo Ücreti</th>
                  </tr>
                </thead>
                <tbody className="text-gray-500">
                  <tr className="border-b border-gray-50">
                    <td className="px-4 py-3">500 TL ve üzeri</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">ÜCRETSİZ</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">500 TL altı</td>
                    <td className="px-4 py-3">29,90 TL</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4 text-gray-900">Kargo Firmaları</h2>
            <p className="text-gray-500 mb-3">Güvenilir teslimat için aşağıdaki firmalarla çalışmaktayız:</p>
            <ul className="space-y-1 text-gray-500 list-disc list-inside">
              <li><strong className="text-gray-800">Aras Kargo</strong> – Türkiye geneli</li>
              <li><strong className="text-gray-800">Yurtiçi Kargo</strong> – Türkiye geneli</li>
              <li><strong className="text-gray-800">MNG Kargo</strong> – Türkiye geneli</li>
            </ul>
            <p className="text-gray-400 text-sm mt-3">Kargo firması bölgenize ve stok durumuna göre otomatik belirlenir.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4 text-gray-900">Sipariş Takibi</h2>
            <ul className="space-y-2 text-gray-500 list-disc list-inside">
              <li>E-posta adresinize kargo takip numarası gönderilir</li>
              <li>"Siparişlerim" sayfasından takip edebilirsiniz</li>
              <li>Kargo firmasının web sitesinden anlık konum bilgisi alabilirsiniz</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4 text-gray-900">Teslimat Sırasında Dikkat Edilecekler</h2>
            <ul className="space-y-2 text-gray-500">
              <li><strong className="text-gray-800">Paket Kontrolü:</strong> Hasarlı görünüyorsa teslim almayın veya tutanak tutturun.</li>
              <li><strong className="text-gray-800">Ürün Kontrolü:</strong> Paketi kargo görevlisinin huzurunda açıp kontrol edebilirsiniz.</li>
              <li><strong className="text-gray-800">Kimlik Kontrolü:</strong> Teslimat sırasında kimlik göstermeniz istenebilir.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4 text-gray-900">Teslimat Bölgeleri</h2>
            <h3 className="font-medium text-gray-800 mb-2">Standart (1-3 İş Günü):</h3>
            <p className="text-gray-500 mb-3">İstanbul, Ankara, İzmir, Bursa, Antalya ve tüm il merkezleri</p>
            <h3 className="font-medium text-gray-800 mb-2">Uzak Bölge (3-5 İş Günü):</h3>
            <p className="text-gray-500">İlçeler, dağlık ve kırsal kesimler</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4 text-gray-900">Sıkça Sorulan Sorular</h2>
            <div className="space-y-5 text-gray-500">
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Kargo takip numaramı nasıl öğrenebilirim?</h3>
                <p>Siparişiniz kargoya verildikten sonra e-posta adresinize takip numarası gönderilir. "Siparişlerim" sayfasından da görebilirsiniz.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Kargom gecikmeli ise ne yapmalıyım?</h3>
                <p>Tahmini teslimat süresini geçtiyse önce kargo firmasıyla iletişime geçin. Çözüm bulunamazsa bizimle iletişime geçebilirsiniz.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Adresimi değiştirebilir miyim?</h3>
                <p>Sipariş kargoya verilmeden önce adres değişikliği yapılabilir. Kargoya verildikten sonra değişiklik mümkün değildir.</p>
              </div>
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

        </div>

        <div className="mt-8 text-center">
          <Link href="/returns" className="text-sm text-gray-500 underline hover:text-gray-900">
            İade & Değişim
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
