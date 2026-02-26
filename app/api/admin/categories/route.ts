import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// GET all categories
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      return NextResponse.json(
        { error: 'Error fetching categories', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Categories fetched successfully',
        categories: data || []
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

// CREATE new category
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Error creating category', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Category created successfully',
        category: data
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

// UPDATE category
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Error updating category', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Category updated successfully',
        category: data
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Category update error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

// DELETE category
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Error deleting category', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Category deleted successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Category deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}
