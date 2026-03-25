"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, Grid3X3, Layers, Mountain, Droplets, TreePine, Fence, Hammer, Lamp, Bath, Flame, LayoutGrid, PanelTop, Footprints, Wind } from "lucide-react"
import CategoryFilter from "./category-filter"
import { ProductCard } from "./product-card"
import { supabase, Product, Category } from "@/lib/supabase"

// Configuración para evitar caché de Next.js
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Mapeo estricto de categorías (Etiqueta -> URL)
const CATEGORIES_MAP = [
  { label: "Todos", url: "" },
  { label: "Bachas", url: "bacha" },
  { label: "Bañeras", url: "bañeras" },
  { label: "Cercos y Tejidos", url: "cercos-tejidos" },
  { label: "Inodoros", url: "inodoros" },
  { label: "Pedestales", url: "pedestales" },
  { label: "Porcelanatos", url: "porcelanatos" },
  { label: "Revestimientos para Piscinas", url: "revestimiento-piscinas" },
  { label: "Totem Lumínicos", url: "totem-luminicos" },
  { label: "Travertinos", url: "travertinos" },
  { label: "Ventiladores", url: "ventiladores" }
]

// Obtener icono para categoría
const getIconForCategory = (categoryUrl: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    '': Grid3X3, // Todos
    'bacha': Bath,
    'bañeras': Bath,
    'cercos-tejidos': Fence,
    'inodoros': Droplets,
    'pedestales': Layers,
    'porcelanatos': Footprints,
    'revestimiento-piscinas': Droplets,
    'totem-luminicos': Lamp,
    'travertinos': Mountain,
    'ventiladores': Wind
  }
  
  return iconMap[categoryUrl] || Grid3X3
}

// Mapeo de imágenes para categorías
const getImageForCategory = (categoryId: string): string => {
  const imageMap: { [key: string]: string } = {
    'bacha': '/images/bacha-piedra.jpg',
    'bañeras': '/images/bacha-piedra.jpg',
    'cercos-tejidos': '/images/cerco.jpg',
    'inodoros': '/images/ladrillo.jpg',
    'pedestales': '/images/premoldeado.jpg',
    'porcelanatos': '/images/porcelanato.jpg',
    'revestimiento-piscinas': '/images/borde-piscina.jpg',
    'totem-luminicos': '/images/totem.jpg',
    'travertinos': '/images/travertino.jpg',
    'ventiladores': '/images/ladrillo.jpg'
  }
  
  return imageMap[categoryId] || '/images/laja-natural.jpg'
}

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

export function ProductSection() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false) // Cambiado a false para evitar pantalla de carga inicial
  const [categories, setCategories] = useState<Category[]>([])

  // Inicializar categorías con el mapeo estricto
  useEffect(() => {
    // Convertir el mapeo al formato que espera el componente
    const mappedCategories = CATEGORIES_MAP.map(cat => ({
      id: cat.url,
      name: cat.label,
      icon: getIconForCategory(cat.url)
    }))
    
    setCategories(mappedCategories)
    setLoading(false)
  }, [])

  const fetchProducts = async (categoryFilter?: string) => {
    console.log('=== FETCH PRODUCTS INICIADO ===', 'Category:', categoryFilter || 'all')
    
    try {
      // Construir URL con filtro de categoría si existe
      const url = categoryFilter && categoryFilter !== '' 
        ? `/api/products?category=${categoryFilter}` 
        : '/api/products'
      
      const response = await fetch(url, {
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
        
        if (data.products && Array.isArray(data.products)) {
          console.log('Setting productos:', data.products.length, 'filtered by:', categoryFilter || 'none')
          setProducts(data.products)
          return
        } else {
          console.log('API returned products but array is empty or invalid:', data.products)
        }
      } else {
        console.log('API response not ok:', response.status)
      }
      
      console.log('No se encontraron productos, usando array vacío...')
    } catch (error) {
      console.error('Error en fetch de productos:', error)
    }
    
    // Si no hay productos, establecer array vacío
    setProducts([])
  }

  // Cargar productos iniciales y detectar categoría del URL
  useEffect(() => {
    console.log('=== COMPONENTE MONTADO - DETECTANDO CATEGORÍA URL ===')
    
    let categoryFromUrl = ""
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1])
      categoryFromUrl = urlParams.get('category') || ""
      
      if (categoryFromUrl) {
        console.log('Categoría inicial desde URL:', categoryFromUrl)
        setSelectedCategory(categoryFromUrl)
        
        // Scroll a productos después de un breve retraso
        setTimeout(() => {
          const element = document.getElementById('productos')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
    }
    
    // Cargar productos con el filtro de categoría
    fetchProducts(categoryFromUrl)
  }, [])

  // Actualizar productos cuando cambia la categoría seleccionada (sin pantalla de carga)
  useEffect(() => {
    console.log('=== CATEGORÍA CAMBIADA ===', selectedCategory)
    
    // Solo cargar productos si no es la carga inicial
    if (selectedCategory !== undefined) {
      fetchProducts(selectedCategory)
    }
  }, [selectedCategory]) // Se ejecuta al montar y cuando cambia selectedCategory

  // Manejar la selección de categoría con scroll a sección productos
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    
    // Hacer scroll a la sección de productos con retraso para móvil
    if (typeof window !== 'undefined') {
      // Pequeño retraso para asegurar que el DOM se actualice
      setTimeout(() => {
        // Scroll suave a la sección #productos
        const productosElement = document.getElementById('productos')
        if (productosElement) {
          console.log('Haciendo scroll a productos element')
          productosElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          })
        } else {
          // Fallback: scroll al principio de la página
          console.log('Fallback: scroll al principio de página')
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }
      }, 100) // 100ms de retraso
      
      // Actualizar URL
      if (categoryId === "todos" || categoryId === "all-products") {
        window.history.replaceState(null, '', '#productos')
      } else {
        window.history.replaceState(null, '', `#productos-${categoryId}`)
      }
    }
  }

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

  // Renderizado principal - sin pantalla de carga
  return (
    <section id="productos" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Desktop Category Filter */}
        <div className="hidden lg:block">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <div className="flex-1">
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
                      handleCategorySelect("all-products")
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
                    // Contar productos filtrando directamente por el campo category
                    const count = products.filter(p => p.category === category.id).length
                    
                    // Obtener productos de esta categoría para la imagen
                    const categoryProducts = products.filter(p => p.category === category.id)
                    
                    // Usar imagen del primer producto si existe, sino imagen de categoría específica
                    let backgroundImage = getImageForCategory(category.id.toLowerCase())
                    
                    // Si hay productos en esta categoría, usar la imagen del primer producto
                    if (categoryProducts.length > 0) {
                      const firstProduct = categoryProducts[0]
                      if (firstProduct.images && firstProduct.images.length > 0) {
                        backgroundImage = firstProduct.images[0]
                        console.log('Usando imagen del primer producto para', category.name, ':', backgroundImage)
                      }
                    }
                    
                    console.log('Contador para categoría:', category.name, '→', count, 'productos')
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                          selectedCategory === category.id
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
                                {category.name}
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
                  className="mb-4 flex items-center gap-2 text-primary hover:underline text-sm font-medium"
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
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      {getSortIcon(sortBy)}
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
                      origen={product.origen}
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
              <>
                {/* Desktop Sort Controls */}
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
                      origen={product.origen}
                    />
                  ))}
                </div>
              </>
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
