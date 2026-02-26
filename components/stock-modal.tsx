"use client"

import { useEffect, useRef } from "react"
import { X, MessageCircle, Phone } from "lucide-react"

interface StockModalProps {
  isOpen: boolean
  onClose: () => void
  product?: {
    id: string
    name: string
    price: number
    unit: string
    image: string
    category: string
    category_label: string
    stock: number
    description?: string
    measure?: string
  }
}

export function StockModal({
  isOpen,
  onClose,
  product,
}: StockModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  if (!isOpen || !product) return null

  const whatsappMessage = encodeURIComponent(
    `Hola! Quiero consultar stock y disponibilidad de: ${product.name} - ${product.measure || 'Unidad básica'} ($${product.price?.toLocaleString("es-AR") || "0"} / ${product.unit || "unidad"})`
  )
  const whatsappUrl = `https://wa.me/5491100000000?text=${whatsappMessage}`

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Consultar stock de ${product.name}`}
    >
      <div className="relative w-full max-w-md animate-in fade-in-0 zoom-in-95 rounded-2xl bg-card shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground z-10"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col p-6">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>

            <h3 className="mt-3 text-lg font-bold text-foreground">
              Consultar Stock
            </h3>

            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {"Contactanos para conocer la disponibilidad y precio actualizado de:"}
            </p>
          </div>

          <div className="w-full rounded-xl bg-secondary p-3 mb-4">
            <p className="text-sm font-semibold text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              ${product.price?.toLocaleString("es-AR") || "0"} / {product.unit || "unidad"} {product.measure && `- ${product.measure}`}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-lg"
            >
              <div className="relative h-5 w-5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.42 5.82c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.18-.31.08-1.26.33.33-1.22.09-.34-.2-.32a8.188 8.188 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm-3.96 3.16c-.2 0-.52.08-.67.23-.15.15-.58.58-.58 1.4 0 .83.58 1.62.66 1.73.08.11 1.13 1.73 2.75 2.42 1.62.7 1.62.23 1.91.23.29 0 1.02-.41 1.16-.8.14-.39.14-.73.1-.8-.04-.07-.15-.11-.31-.2-.16-.09-1.02-.5-1.18-.56-.16-.06-.27-.09-.38.09-.11.18-.43.56-.53.68-.1.11-.2.13-.36.04-.16-.09-.67-.25-1.28-.79-.6-.54-1.01-1.21-1.13-1.37-.12-.16-.01-.25.05-.35.05-.06.12-.15.18-.23.06-.08.08-.15.12-.23.04-.08.02-.15.04-.23.02-.08-.04-.67-.31-1.02-.91-.35-.6-.35-1.11-.31-1.2.04-.09.17-.14.35-.23.18-.09.67-.31.67-.31z"/>
                  </svg>
                </div>
              </div>
              Consultar por WhatsApp
            </a>

            <a
              href="tel:+5491100000000"
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <Phone className="h-4 w-4" />
              Llamar al Corralon
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground text-center">
            Respondemos en minutos durante nuestro horario comercial.
          </p>
        </div>
      </div>
    </div>
  )
}
