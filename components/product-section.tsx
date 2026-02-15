"use client"

import { useState } from "react"
import { CategoryFilter } from "./category-filter"
import { ProductCard } from "./product-card"

const products = [
  // Lajas y Piedras
  {
    id: 1,
    name: "Laja San Luis Natural",
    price: 18500,
    unit: "m2",
    image: "/images/laja-natural.jpg",
    category: "lajas-piedras",
    categoryLabel: "Lajas y Piedras",
  },
  {
    id: 2,
    name: "Piedra Mar del Plata",
    price: 22000,
    unit: "m2",
    image: "/images/piedra-natural.jpg",
    category: "lajas-piedras",
    categoryLabel: "Lajas y Piedras",
  },
  // Travertinos y Marmoles
  {
    id: 3,
    name: "Travertino Turco a la Veta Taponado",
    price: 85000,
    unit: "m2",
    image: "/images/travertino.jpg",
    category: "travertinos-marmoles",
    categoryLabel: "Travertinos y Marmoles",
  },
  {
    id: 4,
    name: "Travertino Turco al Agua Taponado",
    price: 82000,
    unit: "m2",
    image: "/images/travertino.jpg",
    category: "travertinos-marmoles",
    categoryLabel: "Travertinos y Marmoles",
  },
  {
    id: 5,
    name: "Marmol Tundra Grey Interior",
    price: 95000,
    unit: "m2",
    image: "/images/marmol.jpg",
    category: "travertinos-marmoles",
    categoryLabel: "Travertinos y Marmoles",
  },
  // Revestimientos Piscina
  {
    id: 6,
    name: "Bali Stone Sukabumi",
    price: 120000,
    unit: "m2",
    image: "/images/bali-stone.jpg",
    category: "revestimientos-piscina",
    categoryLabel: "Revestimientos Piscina",
  },
  {
    id: 7,
    name: "Black Lava",
    price: 98000,
    unit: "m2",
    image: "/images/black-lava.jpg",
    category: "revestimientos-piscina",
    categoryLabel: "Revestimientos Piscina",
  },
  {
    id: 8,
    name: "Simil Bali Tasos",
    price: 45000,
    unit: "caja 1.80m2",
    image: "/images/bali-stone.jpg",
    category: "revestimientos-piscina",
    categoryLabel: "Revestimientos Piscina",
  },
  {
    id: 9,
    name: "Simil Bali Santorini",
    price: 45000,
    unit: "caja 1.80m2",
    image: "/images/bali-stone.jpg",
    category: "revestimientos-piscina",
    categoryLabel: "Revestimientos Piscina",
  },
  {
    id: 10,
    name: "Borde Piscina Travertino",
    price: 35000,
    unit: "ml",
    image: "/images/borde-piscina.jpg",
    category: "revestimientos-piscina",
    categoryLabel: "Revestimientos Piscina",
  },
  // Pisos SPC
  {
    id: 11,
    name: "Piso SPC Chalten",
    price: 38000,
    unit: "caja 2.69m2",
    image: "/images/piso-spc.jpg",
    category: "pisos-spc",
    categoryLabel: "Pisos SPC",
  },
  {
    id: 12,
    name: "Piso SPC Lipan",
    price: 42000,
    unit: "caja 2.25m2",
    image: "/images/piso-spc.jpg",
    category: "pisos-spc",
    categoryLabel: "Pisos SPC",
  },
  {
    id: 13,
    name: "Piso SPC Antofagasta",
    price: 42000,
    unit: "caja 2.25m2",
    image: "/images/piso-spc.jpg",
    category: "pisos-spc",
    categoryLabel: "Pisos SPC",
  },
  {
    id: 14,
    name: "Piso SPC Andes",
    price: 42000,
    unit: "caja 2.25m2",
    image: "/images/piso-spc.jpg",
    category: "pisos-spc",
    categoryLabel: "Pisos SPC",
  },
  {
    id: 15,
    name: "Zocalo PVC Chalten",
    price: 5200,
    unit: "unidad 2.40m",
    image: "/images/zocalo-pvc.jpg",
    category: "pisos-spc",
    categoryLabel: "Pisos SPC",
  },
  {
    id: 16,
    name: "Zocalo PVC Lipan",
    price: 5200,
    unit: "unidad 2.40m",
    image: "/images/zocalo-pvc.jpg",
    category: "pisos-spc",
    categoryLabel: "Pisos SPC",
  },
  {
    id: 17,
    name: "Zocalo PVC Antofagasta",
    price: 5200,
    unit: "unidad 2.40m",
    image: "/images/zocalo-pvc.jpg",
    category: "pisos-spc",
    categoryLabel: "Pisos SPC",
  },
  {
    id: 18,
    name: "Zocalo PVC Blanco Polar",
    price: 5800,
    unit: "unidad 2.40m",
    image: "/images/zocalo-pvc.jpg",
    category: "pisos-spc",
    categoryLabel: "Pisos SPC",
  },
  // Decks y Paneles WPC
  {
    id: 19,
    name: "Deck WPC Exterior",
    price: 55000,
    unit: "m2",
    image: "/images/deck-wpc.jpg",
    category: "decks-wpc",
    categoryLabel: "Decks y Paneles WPC",
  },
  {
    id: 20,
    name: "Wall Panel Exterior WPC",
    price: 48000,
    unit: "m2",
    image: "/images/wall-panel.jpg",
    category: "decks-wpc",
    categoryLabel: "Decks y Paneles WPC",
  },
  {
    id: 21,
    name: "Wall Panel Interior EPS",
    price: 32000,
    unit: "m2",
    image: "/images/wall-panel.jpg",
    category: "decks-wpc",
    categoryLabel: "Decks y Paneles WPC",
  },
  {
    id: 22,
    name: "Siding Co-Extruded WPC",
    price: 52000,
    unit: "m2",
    image: "/images/siding-wpc.jpg",
    category: "decks-wpc",
    categoryLabel: "Decks y Paneles WPC",
  },
  // Porcelanatos
  {
    id: 23,
    name: "Porcelanato Elizabeth 60x60",
    price: 28000,
    unit: "m2",
    image: "/images/porcelanato.jpg",
    category: "porcelanatos",
    categoryLabel: "Porcelanatos",
  },
  // Bachas
  {
    id: 24,
    name: "Bacha Rio Simple BRS298",
    price: 185000,
    unit: "unidad",
    image: "/images/bacha-piedra.jpg",
    category: "bachas",
    categoryLabel: "Bachas de Piedra",
  },
  {
    id: 25,
    name: "Bacha Rio Doble",
    price: 320000,
    unit: "unidad",
    image: "/images/bacha-piedra.jpg",
    category: "bachas",
    categoryLabel: "Bachas de Piedra",
  },
  {
    id: 26,
    name: "Bacha Isla Onix",
    price: 245000,
    unit: "unidad",
    image: "/images/bacha-piedra.jpg",
    category: "bachas",
    categoryLabel: "Bachas de Piedra",
  },
  {
    id: 27,
    name: "Bacha Volcan",
    price: 210000,
    unit: "unidad",
    image: "/images/bacha-piedra.jpg",
    category: "bachas",
    categoryLabel: "Bachas de Piedra",
  },
  {
    id: 28,
    name: "Bacha Arena",
    price: 195000,
    unit: "unidad",
    image: "/images/bacha-piedra.jpg",
    category: "bachas",
    categoryLabel: "Bachas de Piedra",
  },
  {
    id: 29,
    name: "Bacha Rocosa",
    price: 230000,
    unit: "unidad",
    image: "/images/bacha-piedra.jpg",
    category: "bachas",
    categoryLabel: "Bachas de Piedra",
  },
  // Premoldeados
  {
    id: 30,
    name: "Premoldeado de Hormigon",
    price: 15000,
    unit: "unidad",
    image: "/images/premoldeado.jpg",
    category: "premoldeados",
    categoryLabel: "Premoldeados",
  },
  {
    id: 31,
    name: "Murete Premoldeado",
    price: 22000,
    unit: "unidad",
    image: "/images/premoldeado.jpg",
    category: "premoldeados",
    categoryLabel: "Premoldeados",
  },
  // Adoquines y Veredas
  {
    id: 32,
    name: "Adoquin de Hormigon",
    price: 18000,
    unit: "m2",
    image: "/images/adoquines.jpg",
    category: "adoquines-veredas",
    categoryLabel: "Adoquines y Veredas",
  },
  {
    id: 33,
    name: "Vereda Rustica",
    price: 14000,
    unit: "m2",
    image: "/images/baldosa-vereda.jpg",
    category: "adoquines-veredas",
    categoryLabel: "Adoquines y Veredas",
  },
  {
    id: 34,
    name: "Mosaico de Granito para Vereda",
    price: 16500,
    unit: "m2",
    image: "/images/baldosa-vereda.jpg",
    category: "adoquines-veredas",
    categoryLabel: "Adoquines y Veredas",
  },
  // Ladrillos Refractarios
  {
    id: 35,
    name: "Ladrillo Refractario Comun",
    price: 2800,
    unit: "unidad",
    image: "/images/ladrillo-refractario.jpg",
    category: "ladrillos-refractarios",
    categoryLabel: "Ladrillos Refractarios",
  },
  // Madera
  {
    id: 36,
    name: "Poste de Madera Quebracho",
    price: 45000,
    unit: "unidad",
    image: "/images/postes-madera.jpg",
    category: "madera",
    categoryLabel: "Madera y Postes",
  },
  {
    id: 37,
    name: "Varilla de Madera",
    price: 12000,
    unit: "unidad",
    image: "/images/postes-madera.jpg",
    category: "madera",
    categoryLabel: "Madera y Postes",
  },
  {
    id: 38,
    name: "Tablon Carpinteria Rural",
    price: 35000,
    unit: "unidad",
    image: "/images/postes-madera.jpg",
    category: "madera",
    categoryLabel: "Madera y Postes",
  },
  {
    id: 39,
    name: "Tranquera de Madera",
    price: 180000,
    unit: "unidad",
    image: "/images/tranquera.jpg",
    category: "madera",
    categoryLabel: "Madera y Postes",
  },
  // Cercos y Tejidos
  {
    id: 40,
    name: "Tejido Romboidal 150cm",
    price: 28000,
    unit: "rollo 10m",
    image: "/images/tejido-cerco.jpg",
    category: "cercos-tejidos",
    categoryLabel: "Cercos y Tejidos",
  },
  {
    id: 41,
    name: "Aislador para Cerco Electrico",
    price: 850,
    unit: "unidad",
    image: "/images/tejido-cerco.jpg",
    category: "cercos-tejidos",
    categoryLabel: "Cercos y Tejidos",
  },
  // Mecano Ganadero
  {
    id: 42,
    name: "Panel Mecano Ganadero 3m",
    price: 125000,
    unit: "unidad",
    image: "/images/mecano-ganadero.jpg",
    category: "mecano-ganadero",
    categoryLabel: "Mecano Ganadero",
  },
  // Luminarias
  {
    id: 43,
    name: "Totem Luminico Indonesia",
    price: 350000,
    unit: "unidad",
    image: "/images/totem-luz.jpg",
    category: "luminarias",
    categoryLabel: "Totems Luminicos",
  },
  // Mesas y Asadores
  {
    id: 44,
    name: "Asador de Camping Grande",
    price: 85000,
    unit: "unidad",
    image: "/images/asador.jpg",
    category: "asadores",
    categoryLabel: "Mesas y Asadores",
  },
  {
    id: 45,
    name: "Pileta Comedero-Bebedero Rectangular",
    price: 65000,
    unit: "unidad",
    image: "/images/premoldeado.jpg",
    category: "asadores",
    categoryLabel: "Mesas y Asadores",
  },
]

export function ProductSection() {
  const [selectedCategory, setSelectedCategory] = useState("todos")

  const filtered =
    selectedCategory === "todos"
      ? products
      : products.filter((p) => p.category === selectedCategory)

  return (
    <section id="productos" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Nuestros Productos
        </h2>
        <p className="mt-2 text-muted-foreground">
          Explora nuestro catalogo completo de materiales para tu obra.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        <div className="flex-1">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  unit={product.unit}
                  image={product.image}
                  category={product.categoryLabel}
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
    </section>
  )
}
