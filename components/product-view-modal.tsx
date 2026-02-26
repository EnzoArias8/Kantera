"use client"

import { useState } from "react"
import { X, Package, Truck, ChevronLeft, ChevronRight } from "lucide-react"
import NextImage from "next/image"

interface ProductViewModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
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
}

export function ProductViewModal({ isOpen, onClose, product }: ProductViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!isOpen || !product) return null

  // Generar múltiples imágenes basadas en el producto
  const images = product.images || (product.image ? [product.image] : [])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-88px)] overflow-y-auto">
          {/* Image Gallery */}
          <div className="lg:w-1/2 p-6 bg-gray-50">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <NextImage
                src={images[currentImageIndex] || '/images/laja-natural.jpg'}
                alt={product.name || 'Producto'}
                width={400}
                height={400}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/laja-natural.jpg'
                }}
              />
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <button
                    onClick={prevImage}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    <NextImage
                      src={img}
                      alt={`${product.name || 'Producto'} ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/laja-natural.jpg'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-6">
            <div className="space-y-6">
              {/* Price and Stock */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    ${product.price?.toLocaleString("es-AR") || '0'}
                  </p>
                  <p className="text-lg text-gray-600">/ {product.unit || ''}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Stock disponible</p>
                  <p className="text-lg font-semibold text-green-600">{product.stock || 0} unidades</p>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {product.category_label}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Características</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span>Categoría: {product.category_label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span>Unidad: {product.unit}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    // Abrir modal de stock
                    const event = new CustomEvent('openStockModal', { 
                      detail: {
                        productName: product.name,
                        productPrice: product.price,
                        productUnit: product.unit
                      }
                    })
                    window.dispatchEvent(event)
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Consultar
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
