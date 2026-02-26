import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Generic placeholder image that will work for all products
const PLACEHOLDER_IMAGE = "https://picsum.photos/seed/kantera/400/300.jpg"

export async function POST() {
  try {
    // Update all products to use placeholder image
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ image: PLACEHOLDER_IMAGE })
      .neq('image', PLACEHOLDER_IMAGE) // Only update those that don't already have the placeholder

    if (error) {
      return NextResponse.json(
        { error: 'Error updating images', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'All product images updated to placeholder',
        updatedCount: data?.length || 0,
        placeholderImage: PLACEHOLDER_IMAGE
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Fix images error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, image')
      .limit(5)

    if (error) {
      return NextResponse.json(
        { error: 'Error fetching products', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Current product images sample',
        products: products,
        totalPlaceholder: PLACEHOLDER_IMAGE
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Check images error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}
