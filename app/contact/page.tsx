'use client'

import { useState } from 'react'
import type { Metadata } from 'next'

export default function ContactPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API entegrasyonu
    setStatus('success')
    setForm({ fullName: '', email: '', phone: '', subject: '', message: '' })
    setTimeout(() => setStatus('idle'), 5000)
  }

  const infoCards = [
    {
      icon: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />,
      title: 'Adres',
      content: <>Nişantaşı, İstanbul<br />Türkiye</>,
    },
    {
      icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.19 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
      title: 'Telefon',
      content: <><a href="tel:+908501234567" className="hover:underline">0850 123 45 67</a><br /><span className="text-sm text-gray-400">Hafta içi 09:00 – 18:00</span></>,
    },
    {
      icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
      title: 'E-posta',
      content: <><a href="mailto:info@slvr.com.tr" className="hover:underline">info@slvr.com.tr</a><br /><a href="mailto:destek@slvr.com.tr" className="hover:underline text-sm text-gray-400">destek@slvr.com.tr</a></>,
    },
    {
      icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
      title: 'Çalışma Saatleri',
      content: <>Pzt – Cum: 09:00 – 18:00<br />Cumartesi: 10:00 – 16:00<br /><span className="text-gray-400">Pazar: Kapalı</span></>,
    },
  ]

  return (
    <main>
      {/* Hero */}
      <section className="text-center pt-32 pb-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-5xl font-light italic mb-6 text-gray-900">İletişim</h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
            Sorularınız, önerileriniz ve siparişleriniz için bize ulaşın.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Sol: Bilgi kartları */}
            <div className="space-y-6">
              {infoCards.map((card) => (
                <div key={card.title} className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {card.icon}
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg mb-1 text-gray-900">{card.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{card.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sağ: Form */}
            <div className="bg-white border border-gray-100 rounded-lg p-10 shadow-sm">
              <h2 className="font-serif text-2xl mb-8 text-gray-900">Bize Mesaj Gönderin</h2>

              {status === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-gray-900 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">E-posta *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-gray-900 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-gray-900 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Konu *</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-gray-900 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mesajınız *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-gray-900 transition-colors text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3.5 font-medium tracking-wider uppercase text-sm hover:bg-gray-700 transition-colors"
                >
                  Gönder
                </button>
              </form>
            </div>
          </div>

          {/* Harita */}
          <div className="mt-16 rounded-lg overflow-hidden shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.3707682887587!2d28.987687976026824!3d41.04828197134588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8ca058b28c20b6c3!2zTmnFn2FudGHFn8SxLCDEsHN0YW5idWw!5e0!3m2!1str!2str!4v1710000000000!5m2!1str!2str"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Silvre Jewelry Konum - Nişantaşı, İstanbul"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
