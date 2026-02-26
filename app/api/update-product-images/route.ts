import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Update products to support multiple images
export async function POST() {
  try {
    // First, add images column if it doesn't exist
    const { error: alterError } = await supabaseAdmin.rpc('add_column_if_not_exists', {
      table_name: 'products',
      column_name: 'images',
      column_type: 'jsonb',
      default_value: null
    })

    if (alterError) {
      console.warn('Column might already exist:', alterError)
    }

    // Get all products
    const { data: products, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('id, image')

    if (fetchError) {
      return NextResponse.json(
        { error: 'Error fetching products', details: fetchError },
        { status: 500 }
      )
    }

    // Update products with images array
    const updates = products?.map(product => ({
      id: product.id,
      images: [
        product.image,
        // Generar imágenes adicionales basadas en la principal
        product.image?.replace('.jpg', '_2.jpg'),
        product.image?.replace('.jpg', '_3.jpg'),
        product.image?.replace('.jpg', '_4.jpg')
      ].filter(Boolean)
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
        message: 'Products updated with multiple images',
        updatedCount: updates.length
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Update images error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}
