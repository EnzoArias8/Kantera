"use client"

import { useState, useEffect } from "react"
import { ProductViewModal } from "./product-view-modal"

interface Product {
  id: string
  name: string
  price: number
  unit: string
  image: string
  category: string
  category_label: string
  stock: number
  description?: string
}

export function ProductModalProvider() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent) => {
      setSelectedProduct(event.detail)
      setIsOpen(true)
    }

    window.addEventListener('openProductModal', handleOpenModal as EventListener)
    
    return () => {
      window.removeEventListener('openProductModal', handleOpenModal as EventListener)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setSelectedProduct(null)
  }

  if (!selectedProduct) return null

  return (
    <ProductViewModal
      isOpen={isOpen}
      onClose={handleClose}
      product={selectedProduct}
    />
  )
}
