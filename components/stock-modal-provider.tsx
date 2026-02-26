"use client"

import { useState, useEffect } from "react"
import { StockModal } from "./stock-modal"

export function StockModalProvider() {
  const [modalData, setModalData] = useState<{
    productName: string
    productPrice: number
    productUnit: string
  } | null>(null)

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent) => {
      setModalData(event.detail)
    }

    window.addEventListener('openStockModal', handleOpenModal as EventListener)
    
    return () => {
      window.removeEventListener('openStockModal', handleOpenModal as EventListener)
    }
  }, [])

  const handleClose = () => {
    setModalData(null)
  }

  if (!modalData) return null

  return (
    <StockModal
      isOpen={true}
      onClose={handleClose}
      productName={modalData.productName}
      productPrice={modalData.productPrice}
      productUnit={modalData.productUnit}
    />
  )
}
