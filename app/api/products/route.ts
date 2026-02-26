import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('name')

    if (error) {
      return NextResponse.json(
        { error: 'Error fetching products', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Products fetched successfully',
        products: products || []
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}
