"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Product {
  images: string[]
  name: string
}

interface ProductImageGalleryProps {
  product: Product
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  // Filtrar imágenes válidas y no vacías
  const validImages = product.images?.filter(img => 
    img && 
    img.trim() !== '' && 
    !img.startsWith('blob:') &&
    img !== '/images/placeholder-product.jpg'
  ) || []
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    if (validImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % validImages.length)
    }
  }

  const prevImage = () => {
    if (validImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
    }
  }

  // Resetear índice si cambia el array de imágenes
  useEffect(() => {
    if (currentImageIndex >= validImages.length && validImages.length > 0) {
      setCurrentImageIndex(0)
    }
  }, [validImages.length, currentImageIndex])

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
        {validImages.length > 0 ? (
          <>
            <Image
              src={validImages[currentImageIndex]}
              alt={product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover"
              priority
            />
            
            {/* Navigation arrows */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 hover:bg-black/70 transition-colors"
                  aria-label="Imagen anterior"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 hover:bg-black/70 transition-colors"
                  aria-label="Siguiente imagen"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Image counter */}
            {validImages.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-white text-sm">
                {currentImageIndex + 1} / {validImages.length}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-2xl font-bold text-muted-foreground">K</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Imagen no disponible</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Thumbnail gallery */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                index === currentImageIndex 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-transparent hover:border-muted-foreground/30'
              }`}
            >
              <Image
                src={image}
                alt={`${product.name} ${index + 1}`}
                width={150}
                height={150}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
