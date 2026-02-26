import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Product data extracted from the original component
const products = [
  // Lajas y Piedras
  {
    name: "Laja San Luis Natural",
    price: 18500,
    unit: "m2",
    image: "/images/laja-natural.jpg",
    category: "lajas-piedras",
    category_label: "Lajas y Piedras",
  },
  {
    name: "Piedra Mar del Plata",
    price: 22000,
    unit: "m2",
    image: "/images/piedra-natural.jpg",
    category: "lajas-piedras",
    category_label: "Lajas y Piedras",
  },
  // Travertinos y Marmoles
  {
    name: "Travertino Turco a la Veta Taponado",
    price: 85000,
    unit: "m2",
    image: "/images/travertino.jpg",
    category: "travertinos-marmoles",
    category_label: "Travertinos y Marmoles",
  },
  {
    name: "Travertino Turco al Agua Taponado",
    price: 82000,
    unit: "m2",
    image: "/images/travertino.jpg",
    category: "travertinos-marmoles",
    category_label: "Travertinos y Marmoles",
  },
  {
    name: "Marmol Tundra Grey Interior",
    price: 95000,
    unit: "m2",
    image: "/images/marmol.jpg",
    category: "travertinos-marmoles",
    category_label: "Travertinos y Marmoles",
  },
  // Revestimientos Piscina
  {
    name: "Bali Stone Sukabumi",
    price: 120000,
    unit: "m2",
    image: "/images/bali-stone.jpg",
    category: "revestimientos-piscina",
    category_label: "Revestimientos Piscina",
  },
  {
    name: "Black Lava",
    price: 98000,
    unit: "m2",
    image: "/images/black-lava.jpg",
    category: "revestimientos-piscina",
    category_label: "Revestimientos Piscina",
  },
  {
    name: "Simil Bali Tasos",
    price: 45000,
    unit: "caja 1.80m2",
    image: "/images/bali-stone.jpg",
    category: "revestimientos-piscina",
    category_label: "Revestimientos Piscina",
  },
  {
    name: "Simil Bali Santorini",
    price: 45000,
    unit: "caja 1.80m2",
    image: "/images/bali-stone.jpg",
    category: "revestimientos-piscina",
    category_label: "Revestimientos Piscina",
  },
  {
    name: "Borde Piscina Travertino",
    price: 35000,
    unit: "ml",
    image: "/images/borde-piscina.jpg",
    category: "revestimientos-piscina",
    category_label: "Revestimientos Piscina",
  },
  // Pisos SPC
  {
    name: "Piso SPC Chalten",
    price: 38000,
    unit: "caja 2.69m2",
    image: "/images/piso-spc.jpg",
    category: "pisos-spc",
    category_label: "Pisos SPC",
  },
  {
    name: "Piso SPC Lipan",
    price: 42000,
    unit: "caja 2.25m2",
    image: "/images/piso-spc.jpg",
    category: "pisos-spc",
    category_label: "Pisos SPC",
  },
  {
    name: "Piso SPC Antofagasta",
    price: 42000,
    unit: "caja 2.25m2",
    image: "/images/piso-spc.jpg",
    category: "pisos-spc",
    category_label: "Pisos SPC",
  },
  {
    name: "Piso SPC Andes",
    price: 42000,
    unit: "caja 2.25m2",
    image: "/images/piso-spc.jpg",
    category: "pisos-spc",
    category_label: "Pisos SPC",
  },
  {
    name: "Zocalo PVC Chalten",
    price: 5200,
    unit: "unidad 2.40m",
    image: "/images/zocalo-pvc.jpg",
    category: "pisos-spc",
    category_label: "Pisos SPC",
  },
  {
    name: "Zocalo PVC Lipan",
    price: 5200,
    unit: "unidad 2.40m",
    image: "/images/zocalo-pvc.jpg",
    category: "pisos-spc",
    category_label: "Pisos SPC",
  },
  {
    name: "Zocalo PVC Antofagasta",
    price: 5200,
    unit: "unidad 2.40m",
    image: "/images/zocalo-pvc.jpg",
    category: "pisos-spc",
    category_label: "Pisos SPC",
  },
  {
    name: "Zocalo PVC Blanco Polar",
    price: 5800,
    unit: "unidad 2.40m",
    image: "/images/zocalo-pvc.jpg",
    category: "pisos-spc",
    category_label: "Pisos SPC",
  },
  // Decks y Paneles WPC
  {
    name: "Deck WPC Exterior",
    price: 55000,
    unit: "m2",
    image: "/images/deck-wpc.jpg",
    category: "decks-wpc",
    category_label: "Decks y Paneles WPC",
  },
  {
    name: "Wall Panel Exterior WPC",
    price: 48000,
    unit: "m2",
    image: "/images/wall-panel.jpg",
    category: "decks-wpc",
    category_label: "Decks y Paneles WPC",
  },
  {
    name: "Wall Panel Interior EPS",
    price: 32000,
    unit: "m2",
    image: "/images/wall-panel.jpg",
    category: "decks-wpc",
    category_label: "Decks y Paneles WPC",
  },
  {
    name: "Siding Co-Extruded WPC",
    price: 52000,
    unit: "m2",
    image: "/images/siding-wpc.jpg",
    category: "decks-wpc",
    category_label: "Decks y Paneles WPC",
  },
  // Porcelanatos
  {
    name: "Porcelanato Elizabeth 60x60",
    price: 28000,
    unit: "m2",
    image: "/images/porcelanato.jpg",
    category: "porcelanatos",
    category_label: "Porcelanatos",
  },
  // Bachas
  {
    name: "Bacha Rio Simple BRS298",
    price: 185000,
    unit: "unidad",
    image: "/images/bacha-piedra.jpg",
    category: "bachas",
    category_label: "Bachas de Piedra",
  },
  {
    name: "Bacha Rio Doble",
    price: 320000,
    unit: "unidad",
    image: "/images/bacha-piedra.jpg",
    category: "bachas",
    category_label: "Bachas de Piedra",
  },
  {
    name: "Bacha Isla Onix",
    price: 245000,
    unit: "unidad",
    image: "/images/bacha-piedra.jpg",
    category: "bachas",
    category_label: "Bachas de Piedra",
  },
  {
    name: "Bacha Volcan",
    price: 210000,
    unit: "unidad",
    image: "/images/bacha-piedra.jpg",
    category: "bachas",
    category_label: "Bachas de Piedra",
  },
  {
    name: "Bacha Arena",
    price: 195000,
    unit: "unidad",
    image: "/images/bacha-piedra.jpg",
    category: "bachas",
    category_label: "Bachas de Piedra",
  },
  {
    name: "Bacha Rocosa",
    price: 230000,
    unit: "unidad",
    image: "/images/bacha-piedra.jpg",
    category: "bachas",
    category_label: "Bachas de Piedra",
  },
  // Premoldeados
  {
    name: "Premoldeado de Hormigon",
    price: 15000,
    unit: "unidad",
    image: "/images/premoldeado.jpg",
    category: "premoldeados",
    category_label: "Premoldeados",
  },
  {
    name: "Murete Premoldeado",
    price: 22000,
    unit: "unidad",
    image: "/images/premoldeado.jpg",
    category: "premoldeados",
    category_label: "Premoldeados",
  },
  // Adoquines y Veredas
  {
    name: "Adoquin de Hormigon",
    price: 18000,
    unit: "m2",
    image: "/images/adoquines.jpg",
    category: "adoquines-veredas",
    category_label: "Adoquines y Veredas",
  },
  {
    name: "Vereda Rustica",
    price: 14000,
    unit: "m2",
    image: "/images/baldosa-vereda.jpg",
    category: "adoquines-veredas",
    category_label: "Adoquines y Veredas",
  },
  {
    name: "Mosaico de Granito para Vereda",
    price: 16500,
    unit: "m2",
    image: "/images/baldosa-vereda.jpg",
    category: "adoquines-veredas",
    category_label: "Adoquines y Veredas",
  },
  // Ladrillos Refractarios
  {
    name: "Ladrillo Refractario Comun",
    price: 2800,
    unit: "unidad",
    image: "/images/ladrillo-refractario.jpg",
    category: "ladrillos-refractarios",
    category_label: "Ladrillos Refractarios",
  },
  // Madera
  {
    name: "Poste de Madera Quebracho",
    price: 45000,
    unit: "unidad",
    image: "/images/postes-madera.jpg",
    category: "madera",
    category_label: "Madera y Postes",
  },
  {
    name: "Varilla de Madera",
    price: 12000,
    unit: "unidad",
    image: "/images/postes-madera.jpg",
    category: "madera",
    category_label: "Madera y Postes",
  },
  {
    name: "Tablon Carpinteria Rural",
    price: 35000,
    unit: "unidad",
    image: "/images/postes-madera.jpg",
    category: "madera",
    category_label: "Madera y Postes",
  },
  {
    name: "Tranquera de Madera",
    price: 180000,
    unit: "unidad",
    image: "/images/tranquera.jpg",
    category: "madera",
    category_label: "Madera y Postes",
  },
  // Cercos y Tejidos
  {
    name: "Tejido Romboidal 150cm",
    price: 28000,
    unit: "rollo 10m",
    image: "/images/tejido-cerco.jpg",
    category: "cercos-tejidos",
    category_label: "Cercos y Tejidos",
  },
  {
    name: "Aislador para Cerco Electrico",
    price: 850,
    unit: "unidad",
    image: "/images/tejido-cerco.jpg",
    category: "cercos-tejidos",
    category_label: "Cercos y Tejidos",
  },
  // Mecano Ganadero
  {
    name: "Panel Mecano Ganadero 3m",
    price: 125000,
    unit: "unidad",
    image: "/images/mecano-ganadero.jpg",
    category: "mecano-ganadero",
    category_label: "Mecano Ganadero",
  },
  // Luminarias
  {
    name: "Totem Luminico Indonesia",
    price: 350000,
    unit: "unidad",
    image: "/images/totem-luz.jpg",
    category: "luminarias",
    category_label: "Totems Luminicos",
  },
  // Mesas y Asadores
  {
    name: "Asador de Camping Grande",
    price: 85000,
    unit: "unidad",
    image: "/images/asador.jpg",
    category: "asadores",
    category_label: "Mesas y Asadores",
  },
  {
    name: "Pileta Comedero-Bebedero Rectangular",
    price: 65000,
    unit: "unidad",
    image: "/images/premoldeado.jpg",
    category: "asadores",
    category_label: "Mesas y Asadores",
  },
]

export async function POST() {
  try {
    // Check if products already exist
    const { data: existingProducts, error: checkError } = await supabaseAdmin
      .from('products')
      .select('count')
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Error checking existing products', details: checkError },
        { status: 500 }
      )
    }

    // If products already exist, return message
    if (existingProducts && existingProducts.count > 0) {
      return NextResponse.json(
        { 
          message: 'Products already exist in database',
          count: existingProducts.count 
        },
        { status: 200 }
      )
    }

    // Insert all products
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(products)
      .select()

    if (error) {
      return NextResponse.json(
        { error: 'Error inserting products', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Products seeded successfully',
        count: data?.length || 0,
        products: data 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Seed products error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('count')
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Error checking products', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Products check endpoint',
        count: data?.count || 0,
        hasProducts: (data?.count || 0) > 0
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Check products error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}
