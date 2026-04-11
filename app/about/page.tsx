import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: '999 ayar gümüş takı üretiminde uzman. El yapımı, özel tasarım parçalar. Kalite ve zarafet bir arada.',
}

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="text-center pt-32 pb-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-5xl font-light italic mb-6 text-gray-900">
            Hakkımızda
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            El işçiliği ve modern tasarımın buluştuğu, her bir detayın özenle işlendiği
            gümüş takı dünyamıza hoş geldiniz.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Hikayemiz */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="font-serif text-4xl font-normal mb-6 text-gray-900">Hikayemiz</h2>
              <p className="text-gray-500 leading-relaxed mb-5">
                Silvre Jewelry, 999 ayar saf gümüş takı tutkunlarının buluşma noktası olarak
                yola çıktı. Her bir ürünümüz, ustalarımızın yılların deneyimiyle şekillendirdiği,
                zamansız ve zarif tasarımların bir yansımasıdır.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Geleneksel el işçiliğini modern tasarım anlayışıyla birleştirerek, her anınıza
                değer katan özel parçalar yaratıyoruz. Kalite, zarafet ve özgünlük bizim için
                sadece kelimeler değil, her ürünümüzün temel prensipleridir.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg aspect-[4/3] relative bg-gray-100">
              <Image
                src="/images/about-story.jpg"
                alt="Silvre Jewelry hikayesi - El yapımı 999 ayar gümüş takı atölyesi"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Misyonumuz */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg aspect-[4/3] relative bg-gray-100">
              <Image
                src="/images/about-mission.jpg"
                alt="Silvre Jewelry misyonu - Kaliteli gümüş mücevher tasarımı"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-serif text-4xl font-normal mb-6 text-gray-900">Misyonumuz</h2>
              <p className="text-gray-500 leading-relaxed mb-5">
                Her kadının ve erkeğin kendini özel hissetmesini sağlayacak, kaliteli ve
                erişilebilir 999 ayar saf gümüş takılar sunmak. Sadece bir aksesuar değil,
                kişiliğinizi yansıtan ve hikayenizin bir parçası olan parçalar yaratmak.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Müşteri memnuniyetini her zaman ön planda tutarak, güvenilir alışveriş
                deneyimi sunmak ve her detayda mükemmelliği hedeflemek temel misyonumuzdur.
              </p>
            </div>
          </div>

          {/* Değerlerimiz */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-normal mb-4 text-gray-900">Değerlerimiz</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Her adımımızda bizi yönlendiren temel prensipler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                ),
                title: 'Kalite',
                desc: '999 ayar saf gümüş ve titiz el işçiliğiyle üretilmiş, uzun ömürlü takılar.',
              },
              {
                icon: (
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                ),
                title: 'Özen',
                desc: 'Her bir ürün, sevgiyle ve özenle tasarlanıp üretilir.',
              },
              {
                icon: (
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                ),
                title: 'Güven',
                desc: 'Şeffaf ve güvenilir bir alışveriş deneyimi sunuyoruz.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-8 bg-gray-50 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="font-serif text-2xl mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
