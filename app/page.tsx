"use client"

import { useCallback, useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ProductSection } from "@/components/product-section"
import { Footer } from "@/components/footer"
import { SplashScreen } from "@/components/splash-screen"
import { PromoVideoWidget } from "@/components/PromoVideoWidget"

export default function Page() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Verificar si es la primera visita o navegación interna
    const hasVisited = sessionStorage.getItem('has-visited-kantera')
    
    if (hasVisited) {
      // Si ya visitó, no mostrar splash screen
      setShowSplash(false)
    } else {
      // Primera visita, marcar como visitado
      sessionStorage.setItem('has-visited-kantera', 'true')
    }
  }, [])

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false)
  }, [])

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      <div
        className={`flex min-h-screen flex-col transition-opacity duration-500 ${
          showSplash ? "opacity-0" : "opacity-100"
        }`}
      >
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <ProductSection />
        </main>
        <Footer />
      </div>

      {/* Widget de video promocional flotante */}
      <PromoVideoWidget showSplash={showSplash} />
    </>
  )
}
