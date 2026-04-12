import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: {
    default: "Silvre Jewelry - 999 ayar Saf Gümüş Takılar",
    template: "%s | Silvre Jewelry"
  },
  description: "Türkiye'nin en kaliteli 999 ayar saf gümüş takı markası. El yapımı kolye, küpe, yüzük ve bileklik modelleri.",
  keywords: ["gümüş takı", "999 ayar saf gümüş", "kolye", "küpe", "yüzük", "bileklik", "el yapımı takı", "silvre jewelry"],
  authors: [{ name: "Silvre Jewelry" }],
  creator: "Silvre Jewelry",
  publisher: "Silvre Jewelry",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://slvr.com.tr",
    siteName: "Silvre Jewelry",
    title: "Silvre Jewelry - 999 Ayar Saf Gümüş Takılar",
    description: "El yapımı 999 ayar saf gümüş takı koleksiyonu. Zarif ve lüks tasarımlar.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Silvre Jewelry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Silvre Jewelry - 999 Ayar Saf Gümüş Takılar",
    description: "El yapımı gümüş takı koleksiyonu",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
