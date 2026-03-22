"use client"

import { useState, useEffect } from "react"
import { Grid3X3, Layers, Mountain, Droplets, TreePine, Fence, Hammer, Lamp, Bath, Flame, LayoutGrid, PanelTop, Footprints, Wind } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase, Category } from "@/lib/supabase"

interface CategoryFilterProps {
  selected: string
  onSelect: (id: string) => void
}

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

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([])

  // Manejar la selección de categoría con scroll a sección productos
  const handleCategorySelect = (categoryId: string) => {
    onSelect(categoryId)
    
    // Hacer scroll a la sección de productos con retraso para móvil
    if (typeof window !== 'undefined') {
      // Pequeño retraso para asegurar que el DOM se actualice
      setTimeout(() => {
        // Scroll suave a la sección #productos
        const productosElement = document.getElementById('productos')
        if (productosElement) {
          console.log('CategoryFilter: Haciendo scroll a productos element')
          productosElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          })
        } else {
          // Fallback: scroll al principio de la página
          console.log('CategoryFilter: Fallback: scroll al principio de página')
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }
      }, 100) // 100ms de retraso
    }
  }

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
        
        if (error) {
          console.error('Error fetching categories:', error)
          console.log('CategoryFilter: Usando fallback categories')
          setCategories(fallbackCategories)
        } else if (data && data.length > 0) {
          console.log('CategoryFilter: Categorías desde Supabase:', data)
          
          // Mapear categorías de Supabase con iconos automáticos
          const mappedCategories = data.map((category: any) => {
            console.log('CategoryFilter: Procesando categoría:', category)
            
            // Formatear el nombre: convertir guiones a espacios y capitalizar
            const formattedName = (category.name || 'Sin nombre')
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' y ')
            
            console.log('CategoryFilter: Nombre formateado:', formattedName)
            
            return {
              id: category.id,
              name: formattedName,
              icon: getIconForCategory(formattedName)
            }
          })
          
          // Usar solo categorías de Supabase (sin fallback para evitar duplicados)
          console.log('CategoryFilter: Categorías desde Supabase (solo dinámicas):', mappedCategories)
          setCategories(mappedCategories)
        } else {
          console.log('CategoryFilter: No hay categorías en Supabase, usando fallback')
          setCategories(fallbackCategories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories(fallbackCategories)
      }
    }

    fetchCategories()
  }, [])

  // Agregar "Todos" al inicio
  const allCategories = [
    { id: "todos", name: "Todos", icon: Grid3X3 },
    ...categories
  ]

  return (
    <aside className="w-full shrink-0 lg:w-60">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Categorias
      </h2>
      <nav className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {allCategories.map((cat) => {
          const Icon = cat.icon
          const isActive = selected === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.name}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
