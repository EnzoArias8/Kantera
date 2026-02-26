"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter")

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase("visible"), 100)
    const exitTimer = setTimeout(() => setPhase("exit"), 4200)
    const doneTimer = setTimeout(() => onFinish(), 5000)
    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background image */}
      <Image
        src="/images/splash-bg.jpg"
        alt=""
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 text-center">
        <div className={`mb-8 flex justify-center transition-all duration-1000 delay-300 ease-out ${
          phase === "enter" ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100"
        }`}>
          <Image
            src="/images/logo.jpg"
            alt="Kantera"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
        <div className="space-y-2">
          <h1 
            className={`text-4xl font-black tracking-widest text-white sm:text-5xl transition-all duration-1000 delay-500 ease-out ${
              phase === "enter"
                ? "translate-y-4 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            KANTERA
          </h1>
          <p 
            className={`text-lg text-white max-w-md bg-amber-900/90 px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-1000 delay-700 ease-out ${
              phase === "enter" ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            Superficies & Diseño
          </p>
        </div>

        {/* Animated loading bar */}
        <div className="flex justify-center">
          <div
            className={`mt-4 h-0.5 overflow-hidden rounded-full bg-white/20 transition-all duration-1000 delay-1000 ease-out ${
              phase === "enter" ? "w-0 opacity-0" : "w-48 opacity-100"
            }`}
          >
            <div className="splash-loader h-full rounded-full bg-amber-700" />
          </div>
        </div>
      </div>
    </div>
  )
}
