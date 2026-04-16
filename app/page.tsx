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
    // DEBUG: Limpiar sessionStorage para pruebas (comentar en producción)
    sessionStorage.removeItem('has-visited-kantera')
    
    // Verificar si es la primera visita o navegación interna
    const hasVisited = sessionStorage.getItem('has-visited-kantera')
    
    console.log('=== DEBUG: hasVisited ===', hasVisited)
    
    if (hasVisited) {
      // Si ya visitó, no mostrar splash screen
      console.log('=== DEBUG: Omitiendo splash screen ===')
      setShowSplash(false)
    } else {
      // Primera visita, mostrar splash screen
      console.log('=== DEBUG: Mostrando splash screen ===')
      setShowSplash(true)
    }
  }, [])

  const handleSplashFinish = useCallback(() => {
    console.log('=== DEBUG: Splash screen terminado ===')
    // Configurar sessionStorage solo después de que el splash screen termine
    sessionStorage.setItem('has-visited-kantera', 'true')
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
