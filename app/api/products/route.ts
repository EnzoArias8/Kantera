import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('Products API: Starting request...');
    
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

    // Query simple
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('name')
      .limit(50);

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
