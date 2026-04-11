{/* Hero Section - VIDEO BACKGROUND VERSION */}
<section className="relative min-h-screen flex items-center overflow-hidden -mt-16 sm:-mt-[68px]">
  {/* Background Container */}
  <div className="absolute inset-0 z-0">
    {/* Video Background - Desktop */}
    <video
      autoPlay
      loop
      muted
      playsInline
      poster="/uploads/images/anasayfa_background_3.jpg"
      className="hidden md:block absolute w-full h-full object-cover"
    >
      <source src="/videos/jewelry.mp4" type="video/mp4" />
      {/* Fallback to image if video fails */}
    </video>
    
    {/* Image Background - Mobile (performans için) */}
    <Image
      src="/uploads/images/anasayfa_background_3.jpg"
      alt="Silvre lüks gümüş mücevher koleksiyonu - El yapımı 999 ayar saf gümüş takılar"
      fill
      className="md:hidden object-cover"
      priority
      quality={85}
    />
    
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
  </div>

  {/* Hero Content */}
  <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-24 sm:pt-32">
    <div className="max-w-xl lg:max-w-2xl hero-content">
      {/* SEO H1 - Görsel olarak gizli ama SEO için kritik */}
      <h1 className="sr-only">
        Silvre - Lüks Gümüş Mücevher | Kişiye Özel El Yapımı 999 Ayar Saf Gümüş Takılar
      </h1>
      
      {/* Görsel başlık */}
      <div 
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light italic text-white mb-8 leading-tight tracking-wide" 
        aria-hidden="true"
      >
        Zarif & Lüks
      </div>
      
      <div className="space-y-3 mb-10">
        <p className="text-base sm:text-lg md:text-xl text-white/95 font-light leading-relaxed">
          %99.9 saflıkta gümüşle gelen şıklığın en yeni yorumu.
        </p>
        <p className="text-base sm:text-lg md:text-xl text-white/95 font-light leading-relaxed">
          Kişiye özel %100 el işçiliği 999 ayar saf gümüş takılar.
        </p>
        <p className="text-sm sm:text-base text-white/80 font-light italic mt-4">
          ✨ Sterling gümüşten daha saf, daha değerli
        </p>
      </div>

      <div>
        <Link 
          href="/products" 
          className="inline-block bg-white/10 backdrop-blur-sm border border-white/30 text-white px-10 py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500 shadow-lg hover:shadow-2xl hover:border-white"
          aria-label="Silvre 999 ayar saf gümüş takı koleksiyonunu keşfedin"
        >
          Koleksiyonu Keşfet
        </Link>
      </div>
    </div>
  </div>
</section>
