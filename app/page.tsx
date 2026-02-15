"use client"

import { useCallback, useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ProductSection } from "@/components/product-section"
import { Footer } from "@/components/footer"
import { SplashScreen } from "@/components/splash-screen"

export default function Page() {
  const [showSplash, setShowSplash] = useState(true)

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
    </>
  )
}
