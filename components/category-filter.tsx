"use client"

import {
  Grid3X3,
  Layers,
  Mountain,
  Droplets,
  TreePine,
  Fence,
  Hammer,
  Lamp,
  Bath,
  Flame,
  LayoutGrid,
  PanelTop,
  Footprints,
} from "lucide-react"

const categories = [
  { id: "todos", label: "Todos", icon: Grid3X3 },
  { id: "lajas-piedras", label: "Lajas y Piedras", icon: Layers },
  { id: "travertinos-marmoles", label: "Travertinos y Marmoles", icon: Mountain },
  { id: "revestimientos-piscina", label: "Revestimientos Piscina", icon: Droplets },
  { id: "pisos-spc", label: "Pisos SPC", icon: LayoutGrid },
  { id: "decks-wpc", label: "Decks y Paneles WPC", icon: PanelTop },
  { id: "porcelanatos", label: "Porcelanatos", icon: Footprints },
  { id: "bachas", label: "Bachas de Piedra", icon: Bath },
  { id: "premoldeados", label: "Premoldeados", icon: Layers },
  { id: "adoquines-veredas", label: "Adoquines y Veredas", icon: LayoutGrid },
  { id: "ladrillos-refractarios", label: "Ladrillos Refractarios", icon: Flame },
  { id: "madera", label: "Madera y Postes", icon: TreePine },
  { id: "cercos-tejidos", label: "Cercos y Tejidos", icon: Fence },
  { id: "mecano-ganadero", label: "Mecano Ganadero", icon: Hammer },
  { id: "luminarias", label: "Totems Luminicos", icon: Lamp },
  { id: "asadores", label: "Mesas y Asadores", icon: Flame },
]

interface CategoryFilterProps {
  selected: string
  onSelect: (id: string) => void
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <aside className="w-full shrink-0 lg:w-60">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Categorias
      </h2>
      <nav className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = selected === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
