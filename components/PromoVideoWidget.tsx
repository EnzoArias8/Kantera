"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface PromoVideoWidgetProps {
  showSplash?: boolean
}

export function PromoVideoWidget({ showSplash = true }: PromoVideoWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Esperar a que termine la pantalla de carga (5 segundos) antes de mostrar el video
    const delay = showSplash ? 5000 : 0
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [showSplash])

  if (!isOpen) return null

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[90] w-full max-w-[480px] shadow-2xl overflow-hidden border border-gray-200 bg-white">
      {/* Botón de cierre */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-2 right-2 z-10 text-white bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
        aria-label="Cerrar video promocional"
      >
        <X className="h-4 w-4" />
      </button>
      
      {/* Video promocional */}
      <video 
        src="/images/add.mp4" 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="w-full h-full object-cover" 
      />
    </div>
  )
}
