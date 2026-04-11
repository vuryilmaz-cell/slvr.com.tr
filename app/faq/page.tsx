'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

const faqData = [
  {
    category: 'urun',
    label: 'Ürünler',
    items: [
      {
        q: '999 ayar gümüş nedir?',
        a: '999 ayar gümüş, %99.9 saflıkta gümüştür. En saf gümüş türü olup "fine silver" olarak da bilinir. Silvre Jewelry, tüm koleksiyonunda bu yüksek saflıktaki gümüşü kullanmaktadır.',
      },
      {
        q: 'Ürünleriniz gerçekten el yapımı mı?',
        a: 'Evet, tüm takılarımız uzman ustalarımız tarafından el işçiliğiyle üretilmektedir. Her parça, özenle tasarlanmış ve titizlikle işlenmiştir.',
      },
      {
        q: 'Gümüş takı nasıl bakılır?',
        a: (
          <span>
            Gümüş takılarınızın parlaklığını korumak için:
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Kullanmadığınızda hava almayan bir kutuda saklayın</li>
              <li>Parfüm, losyon ve kimyasallardan uzak tutun</li>
              <li>Özel gümüş bezi ile hafifçe silin</li>
              <li>Islak elle takmamaları önerilir</li>
            </ul>
          </span>
        ),
      },
      {
        q: 'Takılar kararır mı?',
        a: '999 ayar gümüş, düşük alaşım oranı nedeniyle standart 925 ayar gümüşe kıyasla daha az kararır. Düzenli bakım ile takılarınız uzun süre parlak kalır.',
      },
      {
        q: 'Kişiye özel tasarım yaptırabilir miyim?',
        a: 'Evet! Özel tasarım siparişleri için bizimle iletişime geçebilirsiniz. İsim, tarih veya özel bir motif ile kişiselleştirilmiş takılar hazırlıyoruz.',
      },
    ],
  },
  {
    category: 'siparis',
    label: 'Sipariş',
    items: [
      {
        q: 'Sipariş vermek için üye olmam gerekiyor mu?',
        a: 'Evet, sipariş verebilmek için üyelik gerekmektedir. Üyelik tamamen ücretsizdir. Üye olarak sipariş geçmişi, adres defteri ve hızlı ödeme gibi avantajlardan yararlanabilirsiniz.',
      },
      {
        q: 'Siparişimi iptal edebilir miyim?',
        a: 'Siparişiniz kargoya verilmeden önce iptal edebilirsiniz. "Siparişlerim" sayfasından ilgili siparişi bulup iptal talebinde bulunun. Kargoya verilen siparişler için iade sürecini başlatmanız gerekir.',
      },
      {
        q: 'Stokta olmayan ürünü sipariş edebilir miyim?',
        a: 'Stokta olmayan ürünler için bildirim sistemimize kaydolabilirsiniz. Ürün tekrar stoğa girdiğinde e-posta ile bilgilendirilirsiniz.',
      },
    ],
  },
  {
    category: 'kargo',
    label: 'Kargo',
    items: [
      {
        q: 'Kargo süresi ne kadar?',
        a: 'Siparişleriniz 1-3 iş günü içinde teslim edilir. Hafta içi saat 17:00\'ye kadar verilen siparişler aynı gün kargoya verilir.',
      },
      {
        q: 'Ücretsiz kargo var mı?',
        a: '500 TL ve üzeri alışverişlerde kargo tamamen ücretsizdir. 500 TL altı siparişlerde kargo ücreti 29,90 TL\'dir.',
      },
      {
        q: 'Siparişimi nasıl takip ederim?',
        a: 'Siparişiniz kargoya verildikten sonra e-posta ile takip numarası gönderilir. Ayrıca "Siparişlerim" sayfasından da anlık takip yapabilirsiniz.',
      },
    ],
  },
  {
    category: 'odeme',
    label: 'Ödeme',
    items: [
      {
        q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        a: (
          <span>
            Aşağıdaki ödeme yöntemlerini kabul ediyoruz:
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Kredi kartı (Visa, Mastercard, American Express)</li>
              <li>Banka / Havale EFT</li>
              <li>Kapıda ödeme</li>
            </ul>
          </span>
        ),
      },
      {
        q: 'Taksit seçenekleri var mı?',
        a: 'Kredi kartı ile 2, 3, 6, 9 ve 12 taksit seçenekleri sunmaktayız. Taksit oranları kartınızın bankasına göre değişiklik gösterebilir.',
      },
      {
        q: 'Ödeme bilgilerim güvende mi?',
        a: 'Evet, tüm ödeme işlemleriniz SSL sertifikası ile şifrelenmektedir. Kredi kartı bilgileriniz sunucularımızda saklanmaz. Ödeme altyapımız PCI-DSS standartlarına uygundur.',
      },
    ],
  },
  {
    category: 'iade',
    label: 'İade',
    items: [
      {
        q: 'İade sürem ne kadar?',
        a: 'Ürünü teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz. İade edilecek ürünün kullanılmamış, etiketleri sökülmemiş ve orijinal ambalajında olması gerekmektedir.',
      },
      {
        q: 'İade işlemini nasıl başlatabilirim?',
        a: (
          <span>
            İade işlemi için:
            <ol className="mt-2 space-y-1 list-decimal list-inside">
              <li>Hesabınıza giriş yapın</li>
              <li>"Siparişlerim" bölümüne gidin</li>
              <li>İlgili siparişi seçin</li>
              <li>"İade Talebi Oluştur" butonuna tıklayın</li>
            </ol>
            <span className="block mt-2">Ya da <a href="mailto:info@slvr.com.tr" className="underline">info@slvr.com.tr</a> adresine e-posta gönderebilirsiniz.</span>
          </span>
        ),
      },
      {
        q: 'İade kargo ücreti kime ait?',
        a: 'Cayma hakkı kullanımı durumunda iade kargo ücreti müşteriye aittir. Ürün hatalı veya hasarlı geldiği durumda kargo ücreti tarafımızca karşılanır.',
      },
      {
        q: 'İade paramı ne zaman alırım?',
        a: (
          <span>
            İade ürününüz incelendikten sonra:
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Kredi Kartı:</strong> 2-7 iş günü içinde kartınıza iade edilir</li>
              <li><strong>Havale/EFT:</strong> Belirttiğiniz IBAN&apos;a 1-3 iş günü içinde iade edilir</li>
            </ul>
          </span>
        ),
      },
    ],
  },
  {
    category: 'uyelik',
    label: 'Üyelik',
    items: [
      {
        q: 'Şifremi unuttum, ne yapmalıyım?',
        a: 'Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayın. E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderilecektir.',
      },
      {
        q: 'Hesabımı nasıl silebilirim?',
        a: (
          <span>
            Hesabınızı silmek için <a href="mailto:info@slvr.com.tr" className="underline">info@slvr.com.tr</a> adresine e-posta göndererek talepte bulunabilirsiniz. Hesap silme işlemi geri alınamaz.
          </span>
        ),
      },
    ],
  },
]

function AccordionItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-gray-900 text-[0.9375rem]">{q}</span>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-500 leading-relaxed text-sm border-t border-gray-50">
          <div className="pt-4">{a}</div>
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? faqData
    : faqData.filter(s => s.category === activeCategory)

  return (
    <main>
      {/* Hero */}
      <section className="text-center pt-32 pb-16 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-5xl font-light italic mb-4 text-gray-900">Sıkça Sorulan Sorular</h1>
          <p className="text-gray-500 text-lg">999 ayar gümüş takılar hakkında merak edilenler</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">

          {/* Kategori filtre */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2 rounded-full border text-sm transition-all ${activeCategory === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-900 hover:text-gray-900'}`}
            >
              Tümü
            </button>
            {faqData.map(s => (
              <button
                key={s.category}
                onClick={() => setActiveCategory(s.category)}
                className={`px-5 py-2 rounded-full border text-sm transition-all ${activeCategory === s.category ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-900 hover:text-gray-900'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Sorular */}
          <div className="space-y-12">
            {filtered.map(section => (
              <div key={section.category}>
                <h2 className="font-serif text-2xl font-normal mb-6 pb-3 border-b border-gray-200 text-gray-900">
                  {section.label}
                </h2>
                <div className="space-y-3">
                  {section.items.map(item => (
                    <AccordionItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-gray-50 rounded-lg p-10">
            <h3 className="font-serif text-2xl mb-3 text-gray-900">Aradığınız cevabı bulamadınız mı?</h3>
            <p className="text-gray-500 mb-6">Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyar</p>
            <Link
              href="/contact"
              className="inline-block bg-gray-900 text-white px-8 py-3 text-sm font-medium tracking-wider uppercase hover:bg-gray-700 transition-colors"
            >
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
