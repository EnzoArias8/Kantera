"use client"

import React from 'react'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, MessageCircle, Bot } from 'lucide-react'
import Link from 'next/link'
import { StockModal } from '@/components/stock-modal'
import { ProductStockModal } from '@/components/product-stock-modal'
import { ProductImageGallery } from '@/components/product-image-gallery'
import { Suspense, useEffect, useState } from 'react'

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
  variants?: Array<{
    id: string
    measure: string
    price: number
    unit: string
    stock: number
  }>
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { id } = React.use(params)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          console.error('Product ID is missing')
          return
        }

        console.log('Fetching product with ID:', id)

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        // Verificar si hay un error real
        if (error && typeof error === 'object' && Object.keys(error).length > 0) {
          console.error('Supabase error details:', error)
          console.error('Error message:', error?.message || 'Unknown error')
          console.error('Error details:', error?.details || 'No details')
          console.error('Error hint:', error?.hint || 'No hint')
          console.error('Error code:', error?.code || 'No code')
          return
        }

        if (!data) {
          console.log('No product found with ID:', id)
          return
        }

        // Limpiar URLs temporales de las imágenes
        const cleanedProduct = {
          ...data,
          images: data.images?.filter(img => 
            img && 
            img.trim() !== '' && 
            !img.startsWith('blob:') &&
            img !== '/images/placeholder-product.jpg'
          ) || []
        }

        console.log('Product found:', cleanedProduct)
        setProduct(cleanedProduct)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  return <ProductPageContent product={product} />
}

function ProductPageContent({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  
  // Calcular el precio más bajo (base o variantes)
  const lowestPrice = product.variants && product.variants.length > 0 
    ? Math.min(product.price, ...product.variants.map(v => v.price))
    : product.price

  // Determinar precio actual según selección
  const currentPrice = selectedVariant 
    ? product.variants?.find(v => v.id === selectedVariant)?.price
    : product.price

  // Determinar unidad actual según selección
  const currentUnit = selectedVariant
    ? product.variants?.find(v => v.id === selectedVariant)?.unit || product.unit
    : product.unit

  // Determinar medida actual para mostrar
  const currentMeasure = selectedVariant
    ? product.variants?.find(v => v.id === selectedVariant)?.measure || ''
    : (product.variants && product.variants.length > 0 ? product.measure || 'Presentación estándar' : '')

  // Calcular stock total considerando producto base y variantes
  const totalStock = selectedVariant 
    ? product.variants?.find(v => v.id === selectedVariant)?.stock || 0
    : product.variants && product.variants.length > 0 
      ? product.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0) + (product.stock || 0)
      : product.stock || 0

  // Volver a la categoría correcta (todos o la del producto)
  const handleBackClick = () => {
    if (typeof window !== 'undefined') {
      // Detectar si venimos de "todos" o "all-products"
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1])
      const fromCategory = urlParams.get('category')
      
      let targetUrl
      
      if (fromCategory === 'todos' || fromCategory === 'all-products') {
        // Veníamos de "todos", volver a todos
        targetUrl = '/#productos'
        console.log('Volviendo a TODOS desde:', fromCategory)
      } else {
        // Veníamos de una categoría específica, volver a esa categoría
        targetUrl = `/#productos?category=${product.category}`
        console.log('Volviendo a categoría del producto:', product.category)
      }
      
      // Navegar sin recargar página
      window.location.href = targetUrl
      
      // Scroll automático a la sección de productos
      setTimeout(() => {
        const element = document.getElementById('productos')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a {product.category_label}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image Section */}
          <ProductImageGallery product={product} />

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="mb-2">
                <span className="inline-block rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                  {product.category_label}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                {product.name}
              </h1>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  ${currentPrice.toLocaleString('es-AR')}
                </span>
                <span className="text-lg text-muted-foreground">
                  / {currentUnit}
                </span>
                {currentMeasure && (
                  <span className="text-sm text-muted-foreground ml-2">
                    ({currentMeasure})
                  </span>
                )}
              </div>
            </div>

            {/* Variantes */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">Seleccionar Medida</h2>
                <div className="flex flex-wrap gap-2">
                  {/* Opción base */}
                  <button
                    onClick={() => setSelectedVariant(null)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      !selectedVariant
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium">{product.measure || 'Unidad básica'}</div>
                    <div className="text-xs">${product.price.toLocaleString('es-AR')}</div>
                  </button>
                  
                  {/* Variantes */}
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedVariant === variant.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-medium">{variant.measure}</div>
                      <div className="text-xs">${variant.price.toLocaleString('es-AR')}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">Descripción</h2>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-foreground">Disponibilidad</h2>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  totalStock > 0 ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-muted-foreground">
                  {totalStock > 0 ? 'En stock' : 'Sin stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">¿Necesitas ayuda?</h2>
              <div className="w-full">
                <ProductStockModal 
                  product={product} 
                  selectedMeasure={currentMeasure}
                  selectedPrice={currentPrice}
                  selectedUnit={currentUnit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
