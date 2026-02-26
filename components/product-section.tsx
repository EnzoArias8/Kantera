"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { CategoryFilter } from "./category-filter"
import { ProductCard } from "./product-card"
import { supabase, Product } from "@/lib/supabase"

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

export function ProductSection() {
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...')
      const response = await fetch('/api/admin/categories')
      console.log('Categories response status:', response.status)
      
      if (!response.ok) {
        console.error('Categories API error:', response.status)
        // Extraer categorías de los productos como fallback
        const uniqueCategories = [...new Set(products.map(p => p.category))].map(cat => {
          const product = products.find(p => p.category === cat)
          return {
            name: cat,
            label: product?.category_label || cat
          }
        })
        
        console.log('Fallback categories from products:', uniqueCategories)
        setCategories(uniqueCategories)
        return
      }
      
      const data = await response.json()
      console.log('Categories data:', data)
      
      if (data.categories && data.categories.length > 0) {
        console.log('Setting categories from API:', data.categories.length)
        setCategories(data.categories)
      } else {
        console.log('No categories from API, checking products for unique categories...')
        
        // Extraer categorías únicas de los productos
        const uniqueCategories = [...new Set(products.map(p => p.category))].map(cat => {
          const product = products.find(p => p.category === cat)
          return {
            name: cat,
            label: product?.category_label || cat
          }
        })
        
        console.log('Categories from products:', uniqueCategories)
        setCategories(uniqueCategories)
      }
      
    } catch (error) {
      console.error('Error fetching categories:', error)
      
      // Extraer categorías de los productos como fallback
      const uniqueCategories = [...new Set(products.map(p => p.category))].map(cat => {
        const filtered = products.filter(product => {
          if (selectedCategory === "todos" || selectedCategory === "all-products") {
            return true // Show all products
          }
          return product.category === selectedCategory
        })
        const product = filtered.find(p => p.category === cat)
        return {
          name: cat,
          label: product?.category_label || cat
        }
      })
      
      console.log('Fallback categories from products:', uniqueCategories)
      setCategories(uniqueCategories)
    }
  }

  const fetchProducts = async () => {
    console.log('=== FETCH PRODUCTS INICIADO ===')
    
    try {
      // Intentar cargar productos reales primero
      const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
      
      console.log('Products response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Products data received:', data)
        
        if (data.products && data.products.length > 0) {
          console.log('Setting productos reales:', data.products.length)
          setProducts(data.products)
          setLoading(false)
          return
        }
      }
      
      console.log('No se encontraron productos reales, usando fallback...')
    } catch (error) {
      console.error('Error en fetch de productos reales:', error)
      console.log('Usando fallback debido a error...')
    }
    
    // Fallback solo si no hay productos reales
    console.log('Mostrando productos de ejemplo...')
    setProducts([
      {
        id: '1',
        name: 'Producto de ejemplo 1',
        price: 1000,
        unit: 'unidad',
        images: ['/images/logo.jpg'],
        category: 'ejemplo',
        category_label: 'Ejemplo',
        stock: 10,
        description: 'Producto de ejemplo para testing'
      },
      {
        id: '2',
        name: 'Producto de ejemplo 2',
        price: 2000,
        unit: 'caja',
        images: ['/images/logo.jpg'],
        category: 'ejemplo-2',
        category_label: 'Ejemplo 2',
        stock: 5,
        description: 'Otro producto de ejemplo'
      }
    ])
    
    setLoading(false)
    console.log('=== FETCH PRODUCTS COMPLETADO ===')
  }

  // Llamar a fetchProducts cuando el componente se monta
  useEffect(() => {
    console.log('=== COMPONENTE MONTADO - LLAMANDO FETCH PRODUCTS ===')
    fetchProducts()
  }, [])

  // Detectar categoría del URL solo al montar el componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1])
      const categoryFromUrl = urlParams.get('category')
      
      if (categoryFromUrl) {
        console.log('Categoría inicial desde URL:', categoryFromUrl)
        setSelectedCategory(categoryFromUrl)
        
        // Scroll a productos después de un breve retraso
        setTimeout(() => {
          const element = document.getElementById('productos')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 300)
      }
    }
  }, []) // Solo se ejecuta al montar

  // Actualizar el hash cuando cambia la categoría seleccionada
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let hash
      
      if (selectedCategory === "todos" || selectedCategory === "all-products") {
        hash = '#productos'
      } else {
        hash = `#productos?category=${selectedCategory}`
      }
      
      // Actualizar URL sin recargar página
      if (window.location.hash !== hash) {
        console.log('Actualizando URL a:', hash, 'desde categoría:', selectedCategory)
        window.history.replaceState(null, '', hash)
      }
    }
  }, [selectedCategory])

  const filtered = products
    .map(product => ({
      ...product,
      images: product.images?.filter(img => 
        img && 
        img.trim() !== '' && 
        !img.startsWith('blob:') &&
        img !== '/images/placeholder-product.jpg'
      ) || []
    }))
    .filter((p) => (selectedCategory === "todos" || selectedCategory === "all-products") || p.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        default:
          return 0
      }
    })

  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case 'name-asc':
        return <ArrowUp className="h-4 w-4" />
      case 'name-desc':
        return <ArrowDown className="h-4 w-4" />
      case 'price-asc':
        return <ArrowUp className="h-4 w-4" />
      case 'price-desc':
        return <ArrowDown className="h-4 w-4" />
      default:
        return <ArrowUpDown className="h-4 w-4" />
    }
  }

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'name-asc':
        return 'Nombre (A-Z)'
      case 'name-desc':
        return 'Nombre (Z-A)'
      case 'price-asc':
        return 'Precio (menor a mayor)'
      case 'price-desc':
        return 'Precio (mayor a menor)'
      default:
        return 'Ordenar'
    }
  }

  if (loading) {
    console.log('=== AUN EN LOADING ===')
    console.log('Loading state:', loading)
    console.log('Products length:', products.length)
    return (
      <section id="productos" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando productos...</p>
            <p className="text-xs text-muted-foreground mt-2">Debug: loading={loading.toString()}, products={products.length}</p>
          </div>
        </div>
      </section>
    )
  }

  console.log('ProductSection render:', { 
    selectedCategory, 
    categoriesLength: categories.length, 
    productsLength: products.length,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 1024 : 'unknown'
  })

  return (
    <section id="productos" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Desktop Category Filter */}
        <div className="hidden lg:block">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <div className="flex-1">
          {/* Sort Controls - Mostrar siempre que haya productos */}
          {(selectedCategory !== "todos" || filtered.length > 0) && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-background border border-border rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="name-asc">Nombre (A-Z)</option>
                  <option value="name-desc">Nombre (Z-A)</option>
                  <option value="price-asc">Precio (menor a mayor)</option>
                  <option value="price-desc">Precio (mayor a menor)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  {getSortIcon(sortBy)}
                </div>
              </div>
            </div>
          )}

          {/* Mobile: Show categories list, Desktop: Show products */}
          <div className="lg:hidden">
            {selectedCategory === "todos" ? (
              <div className="space-y-4">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Explora nuestras categorías
                  </h3>
                  <p className="text-muted-foreground">
                    Descubre la variedad de materiales para tu proyecto
                  </p>
                </div>
                
                {/* Categories Grid */}
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => {
                      setSelectedCategory("all-products")
                      // Update URL to show "todos" state
                      if (typeof window !== 'undefined') {
                        window.history.replaceState(null, '', '#productos')
                      }
                    }}
                    className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                      selectedCategory === "all-products"
                        ? "border-primary bg-primary/10 shadow-lg scale-105"
                        : "border-border bg-card hover:border-primary/50 hover:shadow-md hover:scale-102"
                    }`}
                  >
                    <div className="relative h-32 bg-cover bg-center" 
                         style={{ backgroundImage: 'url(/images/laja-natural.jpg)' }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                      <div className="absolute inset-0 flex items-end p-4">
                        <div className="text-left">
                          <h4 className="text-lg font-semibold text-white">
                            Todos los productos
                          </h4>
                          <p className="text-sm text-white/90">
                            Explora nuestro catálogo completo
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  {categories.map((category) => {
                    const count = products.filter(p => p.category === category.name).length
                    const sampleProduct = products.find(p => p.category === category.name)
                    const backgroundImage = sampleProduct?.images?.[0] || '/images/laja-natural.jpg'
                    
                    return (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                          selectedCategory === category.name
                            ? "border-primary bg-primary/10 shadow-lg scale-105"
                            : "border-border bg-card hover:border-primary/50 hover:shadow-md hover:scale-102"
                        }`}
                      >
                        <div className="relative h-32 bg-cover bg-center" 
                             style={{ backgroundImage: `url(${backgroundImage})` }}>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                          <div className="absolute inset-0 flex items-end p-4">
                            <div className="text-left">
                              <h4 className="text-lg font-semibold text-white">
                                {category.label}
                              </h4>
                              <p className="text-sm text-white/90">
                                {count} productos disponibles
                              </p>
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : filtered.length > 0 ? (
              <div>
                {/* Back button */}
                <button
                  onClick={() => setSelectedCategory("todos")}
                  className="mb-6 flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Volver a categorías
                </button>

                {/* Mobile Sort Controls */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                  </p>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none bg-background border border-border rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="name-asc">Nombre (A-Z)</option>
                      <option value="name-desc">Nombre (Z-A)</option>
                      <option value="price-asc">Precio (menor a mayor)</option>
                      <option value="price-desc">Precio (mayor a menor)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      unit={product.unit}
                      images={product.images}
                      category={product.category_label}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  No se encontraron productos en esta categoría.
                </p>
                <button
                  onClick={() => setSelectedCategory("todos")}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Ver todas las categorías
                </button>
              </div>
            )}
          </div>

          {/* Desktop: Always show products */}
          <div className="hidden lg:block">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    unit={product.unit}
                    images={product.images}
                    category={product.category_label}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
                <p className="text-sm text-muted-foreground">
                  No se encontraron productos en esta categoria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
