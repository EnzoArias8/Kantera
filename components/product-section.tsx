"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, Grid3X3, Layers, Mountain, Droplets, TreePine, Fence, Hammer, Lamp, Bath, Flame, LayoutGrid, PanelTop, Footprints, Wind } from "lucide-react"
import CategoryFilter from "./category-filter"
import { ProductCard } from "./product-card"
import { supabase, Product, Category } from "@/lib/supabase"

// Configuración para evitar caché de Next.js
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Mapeo de imágenes para categorías
const getImageForCategory = (categoryId: string): string => {
  const imageMap: { [key: string]: string } = {
    'lajas-piedras': '/images/laja-natural.jpg',
    'travertinos-marmoles': '/images/travertino.jpg',
    'revestimientos-piscina': '/images/borde-piscina.jpg',
    'pisos-spc': '/images/piso-spc.jpg',
    'decks-wpc': '/images/deck-wpc.jpg',
    'porcelanatos': '/images/porcelanato.jpg',
    'bachas': '/images/bacha-piedra.jpg',
    'premoldeados': '/images/premoldeado.jpg',
    'adoquines-veredas': '/images/adoquines.jpg',
    'ladrillos-refractarios': '/images/ladrillo-refractario.jpg',
    'madera': '/images/postes-madera.jpg',
    'cercos-tejidos': '/images/tejido-cerco.jpg',
    'mecano-ganadero': '/images/mecano-ganadero.jpg',
    'luminarias': '/images/totem-luz.jpg',
    'asadores': '/images/asador.jpg',
  }
  
  return imageMap[categoryId] || '/images/laja-natural.jpg'
}

// Mapeo de iconos para categorías
const getIconForCategory = (categoryName: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'Lajas': Layers,
    'Piedras': Mountain,
    'Travertinos': Mountain,
    'Marmoles': Mountain,
    'Revestimientos': Droplets,
    'Piscina': Droplets,
    'Pisos': LayoutGrid,
    'SPC': LayoutGrid,
    'Decks': PanelTop,
    'Paneles': PanelTop,
    'WPC': PanelTop,
    'Porcelanatos': Footprints,
    'Bachas': Bath,
    'Premoldeados': Layers,
    'Adoquines': LayoutGrid,
    'Veredas': LayoutGrid,
    'Ladrillos': Flame,
    'Refractarios': Flame,
    'Madera': TreePine,
    'Postes': TreePine,
    'Cercos': Fence,
    'Tejidos': Fence,
    'Mecano': Hammer,
    'Ganadero': Hammer,
    'Luminarias': Lamp,
    'Totems': Lamp,
    'Luminicos': Lamp,
    'Mesas': Flame,
    'Asadores': Flame,
    'Ventiladores': Wind,
  }
  
  // Buscar coincidencia exacta primero
  if (iconMap[categoryName]) {
    return iconMap[categoryName]
  }
  
  // Si no encuentra, buscar por palabras clave
  const keywords = Object.keys(iconMap)
  for (const keyword of keywords) {
    if (categoryName.toLowerCase().includes(keyword.toLowerCase())) {
      return iconMap[keyword]
    }
  }
  
  return Grid3X3 // Icono por defecto
}

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

export function ProductSection() {
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar categorías desde Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      // Categorías de fallback para consistencia con productos existentes
      const fallbackCategories = [
        { id: "lajas-piedras", name: "Lajas y Piedras", icon: Layers },
        { id: "travertinos-marmoles", name: "Travertinos y Marmoles", icon: Mountain },
        { id: "revestimientos-piscina", name: "Revestimientos Piscina", icon: Droplets },
        { id: "pisos-spc", name: "Pisos SPC", icon: LayoutGrid },
        { id: "decks-wpc", name: "Decks y Paneles WPC", icon: PanelTop },
        { id: "porcelanatos", name: "Porcelanatos", icon: Footprints },
        { id: "bachas", name: "Bachas de Piedra", icon: Bath },
        { id: "premoldeados", name: "Premoldeados", icon: Layers },
        { id: "adoquines-veredas", name: "Adoquines y Veredas", icon: LayoutGrid },
        { id: "ladrillos-refractarios", name: "Ladrillos Refractarios", icon: Flame },
        { id: "madera", name: "Madera y Postes", icon: TreePine },
        { id: "cercos-tejidos", name: "Cercos y Tejidos", icon: Fence },
        { id: "mecano-ganadero", name: "Mecano Ganadero", icon: Hammer },
        { id: "luminarias", name: "Totems Luminicos", icon: Lamp },
        { id: "asadores", name: "Mesas y Asadores", icon: Flame },
      ]
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name')
          // Evitar caché de Next.js para obtener siempre datos actualizados
          .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
          .setHeader('Pragma', 'no-cache')
          .setHeader('Expires', '0')
        
        if (error) {
          console.error('Error fetching categories:', error)
          console.log('Usando fallback categories')
          setCategories(fallbackCategories)
        } else if (data && data.length > 0) {
          console.log('Categorías desde Supabase:', data)
          
          // Mapear categorías de Supabase con iconos automáticos
          const mappedCategories = data.map((category: any) => {
            console.log('Procesando categoría:', category)
            
            // Usar el campo label para mostrar, y el campo name para el ID/filtro
            const displayName = category.label || category.name || 'Sin nombre'
            const categoryId = category.name || category.id || 'sin-categoria'
            
            console.log('Nombre para mostrar:', displayName)
            console.log('ID para filtro:', categoryId)
            
            return {
              id: categoryId,
              name: displayName,
              icon: getIconForCategory(displayName)
            }
          })
          
          // Usar solo categorías de Supabase (sin fallback para evitar duplicados)
          console.log('Categorías desde Supabase (solo dinámicas):', mappedCategories)
          setCategories(mappedCategories)
        } else {
          console.log('No hay categorías en Supabase, usando fallback')
          setCategories(fallbackCategories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories(fallbackCategories)
      }
    }

    fetchCategories()
  }, [])

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
        
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          console.log('Setting productos reales:', data.products.length)
          setProducts(data.products)
          setLoading(false)
          return
        } else {
          console.log('API returned products but array is empty or invalid:', data.products)
        }
      } else {
        console.log('API response not ok:', response.status)
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
    .filter((p) => {
      // Si es "todos" o "all-products", mostrar todos
      if (selectedCategory === "todos" || selectedCategory === "all-products") {
        return true
      }
      
      // Filtrar por categoría usando el campo category del producto
      return p.category === selectedCategory
    })
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
                    let backgroundImage = getImageForCategory(category.name.toLowerCase())
                    
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
