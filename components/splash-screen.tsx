"use client"

import { useEffect, useState } from "react"
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
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-foreground/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo mark */}
        <div
          className={`flex h-24 w-24 items-center justify-center rounded-2xl bg-primary shadow-2xl shadow-primary/30 transition-all duration-1000 ease-out sm:h-28 sm:w-28 ${
            phase === "enter"
              ? "scale-50 opacity-0"
              : "scale-100 opacity-100"
          }`}
        >
          <span className="text-5xl font-black tracking-tight text-primary-foreground sm:text-6xl">
            K
          </span>
        </div>

        {/* Name */}
        <h1
          className={`text-4xl font-black tracking-widest text-primary-foreground sm:text-5xl transition-all duration-1000 delay-500 ease-out ${
            phase === "enter"
              ? "translate-y-4 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          KANTERA
        </h1>

        {/* Tagline */}
        <p
          className={`text-sm font-medium tracking-wider text-primary-foreground/60 uppercase transition-all duration-1000 delay-700 ease-out sm:text-base ${
            phase === "enter"
              ? "translate-y-4 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          Materiales de Construccion
        </p>

        {/* Animated loading bar */}
        <div
          className={`mt-4 h-0.5 overflow-hidden rounded-full bg-primary-foreground/20 transition-all duration-1000 delay-1000 ease-out ${
            phase === "enter" ? "w-0 opacity-0" : "w-48 opacity-100"
          }`}
        >
          <div className="splash-loader h-full rounded-full bg-primary" />
        </div>
      </div>
    </div>
  )
}
