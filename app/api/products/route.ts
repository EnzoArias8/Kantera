import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    console.log('Products API: Starting request...');
    
    // Extraer parámetros de consulta
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    console.log('Category filter:', category);
    
    // Verificar variables de entorno
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Crear cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client created successfully');

    // Construir query con filtro de categoría si existe
    let query = supabase
      .from('products')
      .select('*')
      .order('name')
      .limit(50);

    // Aplicar filtro de categoría si se proporciona
    if (category && category !== '') {
      console.log('Applying category filter:', category);
      query = query.eq('category', category);
    }

    const { data: products, error } = await query;

    console.log('Query result:', { 
      productsCount: products?.length || 0, 
      hasError: !!error,
      errorMessage: error?.message 
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Products fetched successfully',
      products: products || [],
      count: products?.length || 0
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
