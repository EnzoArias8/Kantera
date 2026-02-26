import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// GET all products
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
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
        products: data || []
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

// CREATE new product
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Error creating product', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Product created successfully',
        product: data
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

// UPDATE product
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    console.log('PUT request body:', JSON.stringify(body, null, 2))
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { error: 'Error updating product', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Product updated successfully',
        product: data
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

// DELETE product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Error deleting product', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Product deleted successfully',
        id
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}
