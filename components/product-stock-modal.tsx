"use client"

import { MessageCircle } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  unit: string
  images: string[]
  category: string
  category_label: string
  stock: number
  description?: string
  measure?: string
}

interface ProductStockModalProps {
  product: Product
  selectedMeasure?: string
  selectedPrice?: number
  selectedUnit?: string
}

export function ProductStockModal({ 
  product, 
  selectedMeasure, 
  selectedPrice, 
  selectedUnit 
}: ProductStockModalProps) {
  const whatsappMessage = encodeURIComponent(
    `Hola! Quiero consultar stock y disponibilidad de: ${product.name} - ${selectedMeasure || product.measure || 'Unidad básica'} ($${selectedPrice?.toLocaleString("es-AR") || product.price?.toLocaleString("es-AR") || "0"} / ${selectedUnit || product.unit || "unidad"})`
  )
  const whatsappUrl = `https://wa.me/5491100000000?text=${whatsappMessage}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#128C7E] w-full"
    >
      <MessageCircle className="h-4 w-4" />
      Consultar por WhatsApp
    </a>
  )
}
