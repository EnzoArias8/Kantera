import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST() {
  try {
    console.log('=== INICIANDO RESET DE CATEGORÍAS ===')
    
    // 1. Desvincular productos de categorías (eliminar referencia temporalmente)
    console.log('Desvinculando productos de categorías...')
    const { error: unlinkError } = await supabaseAdmin
      .from('products')
      .update({ category: null })
      .not('category', 'is', null)
    
    if (unlinkError) {
      console.log('No se pudieron desvincular productos (puede que no haya productos vinculados):', unlinkError.message)
    } else {
      console.log('Productos desvinculados exitosamente')
    }
    
    // 2. Eliminar todas las categorías existentes
    console.log('Eliminando categorías existentes...')
    const { error: deleteError } = await supabaseAdmin
      .from('categories')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Condición siempre verdadera para eliminar todo
    
    if (deleteError) {
      console.log('Error al eliminar categorías (puede que no existan):', deleteError.message)
    } else {
      console.log('Categorías existentes eliminadas')
    }
    
    // 3. Insertar la lista definitiva y exacta de categorías
    console.log('Insertando categorías definitivas...')
    const definitiveCategories = [
      { name: "Bachas", label: "Bachas" },
      { name: "Bañeras", label: "Bañeras" },
      { name: "Cercos y Tejidos", label: "Cercos y Tejidos" },
      { name: "Inodoros", label: "Inodoros" },
      { name: "Pedestales", label: "Pedestales" },
      { name: "Porcelanatos", label: "Porcelanatos" },
      { name: "Revestimientos para Piscinas", label: "Revestimientos para Piscinas" },
      { name: "Totem Lumínicos", label: "Totem Lumínicos" },
      { name: "Travertinos", label: "Travertinos" },
      { name: "Ventiladores", label: "Ventiladores" }
    ]
    
    const { data: insertedCategories, error: insertError } = await supabaseAdmin
      .from('categories')
      .insert(definitiveCategories)
      .select()
    
    if (insertError) {
      console.error('Error al insertar categorías definitivas:', insertError)
      return NextResponse.json(
        { error: 'Error al insertar categorías', details: insertError },
        { status: 500 }
      )
    }
    
    console.log('Categorías definitivas insertadas:', insertedCategories?.length || 0)
    
    // 4. Opcional: Re-vincular productos si tenías una lógica para ello
    // (Este paso depende de cómo estén estructurados tus productos)
    
    return NextResponse.json({
      message: 'Reset de categorías completado exitosamente',
      categoriesInserted: insertedCategories?.length || 0,
      categories: insertedCategories
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error crítico en reset de categorías:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error },
      { status: 500 }
    )
  }
}
