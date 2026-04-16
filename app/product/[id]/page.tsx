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
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: string
  unit: string
  images: string[]
  category: string
  category_label: string
  category_id?: string
  stock: number
  description?: string
  measure?: string
  origen?: string
  caracteristicas?: string
  precio_anterior?: string
  variants?: Array<{
    id: string
    measure: string
    price: string
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

        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (productError) {
          throw productError
        }

        // Try to get category info separately if we have a category field
        let categoryData = null
        if (productData.category) {
          const { data: catData } = await supabase
            .from('categories')
            .select('id, name')
            .eq('name', productData.category)
            .single()
          categoryData = catData
        }

        const data = {
          ...productData,
          categories: categoryData
        }

        if (!data) {
          console.log('No product found with ID:', id)
          return
        }

        // Limpiar URLs temporales de las imágenes y extraer category_id
        const cleanedProduct = {
          ...data,
          category_id: data.categories?.id,
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
  const router = useRouter()
  
  // Función para validar si un valor es numérico
  const isNumeric = (val: string | undefined) => {
    return val !== undefined && val !== null && val !== '' && !isNaN(Number(val));
  };

  // Función para formatear precio
  const formatPrice = (priceValue: string | undefined) => {
    if (!priceValue || priceValue === '') return '';
    if (!isNumeric(priceValue)) return priceValue;
    
    // Formateo manual para asegurar separadores de miles en todos los dispositivos
    const number = Number(priceValue);
    const formatted = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    return `$${formatted}`;
  };

  // Calcular el precio más bajo (solo si son numéricos)
  const getLowestNumericPrice = () => {
    const basePrice = isNumeric(product.price) ? Number(product.price) : Infinity;
    const variantPrices = product.variants 
      ? product.variants
          .filter(v => isNumeric(v.price))
          .map(v => Number(v.price))
      : [];
    
    const allPrices = [basePrice, ...variantPrices].filter(p => p !== Infinity);
    return allPrices.length > 0 ? Math.min(...allPrices) : null;
  };

  // Determinar precio actual según selección
  const currentPrice = selectedVariant 
    ? product.variants?.find(v => v.id === selectedVariant)?.price || product.price
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

  // Validar si hay oferta
  const isOferta = isNumeric(currentPrice) && isNumeric(product.precio_anterior) && Number(product.precio_anterior) > Number(currentPrice);
  const discountPercentage = isOferta ? Math.round(((Number(product.precio_anterior) - Number(currentPrice)) / Number(product.precio_anterior)) * 100) : 0;

  // URL directa para volver - al catálogo de productos
  const getBackUrl = () => {
    // Siempre volver al catálogo de productos
    return '/#productos'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <Link
            href={getBackUrl()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-2">
          
          {/* ENCABEZADO MÓVIL (Solo visible en celulares) */}
          <div className="block md:hidden space-y-4">
            {/* Origen */}
            <div className="mb-2">
              <span className="inline-block rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                {product.origen || 'Sin origen'}
              </span>
            </div>
            
            {/* Nombre del producto */}
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {product.name}
            </h1>
            
            {/* Precio y Stock */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-2 flex-wrap">
                {isOferta && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.precio_anterior)}
                  </span>
                )}
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(currentPrice)}
                </span>
                {isNumeric(currentPrice) && (
                  <span className="text-lg text-muted-foreground">
                    / {currentUnit}
                  </span>
                )}
                {currentMeasure && (
                  <span className="text-sm text-muted-foreground ml-2">
                    ({currentMeasure})
                  </span>
                )}
              </div>
              {isOferta && (
                <div className="mt-1">
                  <span className="text-lg font-medium text-green-600">
                    {discountPercentage}% OFF
                  </span>
                </div>
              )}
              
              {/* Show product measure if available and no variant is selected */}
              {!selectedVariant && product.measure && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Medidas:</span> {product.measure}
                </div>
              )}
              
              {/* Stock Status - Badge Style */}
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  totalStock > 0 ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-muted-foreground">
                  {totalStock > 0 ? 'En stock' : 'Sin stock'}
                </span>
              </div>
            </div>
          </div>

          {/* COLUMNA IZQUIERDA: Imágenes */}
          <div className="order-2 md:order-1">
            <ProductImageGallery product={product} />
          </div>

          {/* COLUMNA DERECHA: Info completa (Desktop) */}
          <div className="order-3 md:order-2 space-y-6">
            {/* ENCABEZADO ESCRITORIO (Solo visible en PC) */}
            <div className="hidden md:block">
              {/* Header */}
              <div>
                <div className="mb-2">
                  <span className="inline-block rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                    {product.origen || 'Sin origen'}
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                  {product.name}
                </h1>
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {isOferta && (
                        <span className="text-lg text-gray-400 line-through">
                          {formatPrice(product.precio_anterior)}
                        </span>
                      )}
                      <span className="text-4xl font-bold text-primary">
                        {formatPrice(currentPrice)}
                      </span>
                      {isNumeric(currentPrice) && (
                        <span className="text-lg text-muted-foreground">
                          / {currentUnit}
                        </span>
                      )}
                      {currentMeasure && (
                        <span className="text-sm text-muted-foreground ml-2">
                          ({currentMeasure})
                        </span>
                      )}
                    </div>
                    {isOferta && (
                      <div className="mt-1">
                        <span className="text-lg font-medium text-green-600">
                          {discountPercentage}% OFF
                        </span>
                      </div>
                    )}
                    {/* Show product measure if available and no variant is selected */}
                    {!selectedVariant && product.measure && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Medidas:</span> {product.measure}
                      </div>
                    )}
                  </div>
                  
                  {/* Stock Status - Badge Style */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`h-2 w-2 rounded-full ${
                      totalStock > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm text-muted-foreground">
                      {totalStock > 0 ? 'En stock' : 'Sin stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Variantes (visibles en ambas vistas) */}
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
                    <div className="text-xs">{formatPrice(product.price)}</div>
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
                      <div className="text-xs">{formatPrice(variant.price)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Button */}
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

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">Descripción</h2>
                <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Características */}
            {product.caracteristicas && (
              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">Características</h2>
                <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {product.caracteristicas}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
