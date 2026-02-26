import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Add description column to products table
export async function POST() {
  try {
    // First, add the description column if it doesn't exist
    const { error: alterError } = await supabaseAdmin.rpc('add_column_if_not_exists', {
      table_name: 'products',
      column_name: 'description',
      column_type: 'text',
      default_value: null
    })

    if (alterError) {
      console.warn('Column might already exist:', alterError)
    }

    // Update all existing products with default descriptions
    const { data: products, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('id, name, category, category_label')

    if (fetchError) {
      return NextResponse.json(
        { error: 'Error fetching products', details: fetchError },
        { status: 500 }
      )
    }

    // Generate default descriptions based on category
    const descriptions = {
      'lajas-piedras': 'Lajas y piedras naturales de alta calidad para revestimientos y decoración. Ideales para dar un toque elegante y duradero a cualquier espacio.',
      'travertinos-marmoles': 'Travertinos y mármoles premium seleccionados de las mejores canteras. Perfectos para pisos, paredes y aplicaciones de lujo.',
      'revestimientos-piscina': 'Revestimientos especializados para piscinas. Resistentes al cloro y al agua salada, con acabados antideslizantes y larga durabilidad.',
      'pisos-spc': 'Pisos SPC de última generación. 100% impermeables, resistentes a rayaduras y fáciles de instalar. Ideales para cualquier ambiente.',
      'decks-wpc': 'Decks y paneles WPC de madera plástica. Mantenimiento mínimo, alta resistencia climática y aspecto natural moderno.',
      'porcelanatos': 'Porcelanatos de alta calidad con gran variedad de diseños. Perfectos para áreas de alto tráfico y uso comercial.',
      'bachas': 'Bachas de piedra sintética y mármol. Diseños elegantes y funcionales para baños modernos y clásicos.',
      'premoldeados': 'Premoldeados de hormigón armado. Soluciones estructurales rápidas y económicas para construcción.',
      'adoquines-veredas': 'Adoquines y baldosas para veredas. Alta resistencia al tránsito vehicular y condiciones climáticas adversas.',
      'ladrillos-refractarios': 'Ladrillos refractarios de alta calidad. Ideales para hornos, chimeneas y aplicaciones industriales de alta temperatura.',
      'madera': 'Madera tratada de alta durabilidad. Postes, vigas y elementos estructurales para construcción rural e industrial.',
      'cercos-tejidos': 'Cercos y tejidos perimetrales. Soluciones seguras y duraderas para delimitar propiedades.',
      'mecano-ganadero': 'Estructuras metálicas modulares para ganadería. Fácil montaje, resistentes y adaptables a diferentes necesidades.',
      'luminarias': 'Luminarias decorativas y funcionales. Iluminación LED de bajo consumo y alta eficiencia energética.',
      'asadores': 'Asadores y parrillas de alta calidad. Construcción robusta y distribución uniforme del calor para asados perfectos.'
    }

    // Update products with descriptions
    const updates = products?.map(product => ({
      id: product.id,
      description: descriptions[product.category as keyof typeof descriptions] || 'Producto de alta calidad para construcción y reformas.'
    })) || []

    const { error: updateError } = await supabaseAdmin
      .from('products')
      .upsert(updates)
      .select()

    if (updateError) {
      return NextResponse.json(
        { error: 'Error updating products', details: updateError },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Descriptions added successfully',
        updatedCount: updates.length
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Add description error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}
