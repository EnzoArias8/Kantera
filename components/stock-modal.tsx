"use client"

import { useEffect, useRef } from "react"
import { X, MessageCircle, Phone } from "lucide-react"

interface StockModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productPrice: number
  productUnit: string
}

export function StockModal({
  isOpen,
  onClose,
  productName,
  productPrice,
  productUnit,
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

  if (!isOpen) return null

  const whatsappMessage = encodeURIComponent(
    `Hola! Quiero consultar stock y disponibilidad de: ${productName} ($${productPrice.toLocaleString("es-AR")} / ${productUnit})`
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
      aria-label={`Consultar stock de ${productName}`}
    >
      <div className="relative w-full max-w-md animate-in fade-in-0 zoom-in-95 rounded-2xl bg-card p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <MessageCircle className="h-7 w-7 text-primary" />
          </div>

          <h3 className="mt-4 text-xl font-bold text-foreground">
            Consultar Stock
          </h3>

          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {"Contactanos para conocer la disponibilidad y precio actualizado de:"}
          </p>

          <div className="mt-4 w-full rounded-xl bg-secondary p-4">
            <p className="text-base font-semibold text-foreground">{productName}</p>
            <p className="mt-1 text-lg font-bold text-primary">
              {"$"}{productPrice.toLocaleString("es-AR")}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / {productUnit}
              </span>
            </p>
          </div>

          <div className="mt-6 flex w-full flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
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

          <p className="mt-4 text-xs text-muted-foreground">
            Respondemos en minutos durante nuestro horario comercial.
          </p>
        </div>
      </div>
    </div>
  )
}
