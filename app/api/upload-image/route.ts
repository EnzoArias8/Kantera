import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo.' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Formato inválido. Solo se permite JPEG, PNG y WebP.' }, { status: 400 })
    }

    // 1. Sanitizar el nombre del archivo (reemplaza espacios por guiones y quita caracteres raros)
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-')
    const filename = `${Date.now()}-${sanitizedName}` 

    // 2. Convertir a Buffer de forma segura para Node.js / Vercel
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 3. Subir a Supabase
    const { data, error } = await supabaseAdmin.storage
      .from('products')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Error detallado de Supabase:', error)
      return NextResponse.json({ error: `Fallo en Supabase: ${error.message}` }, { status: 500 })
    }

    // 4. Obtener URL pública
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('products')
      .getPublicUrl(filename)

    return NextResponse.json({
      message: 'Archivo subido con éxito',
      url: publicUrl
    })

  } catch (error: any) {
    console.error('Error general de subida:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor al procesar la imagen.' },
      { status: 500 }
    )
  }
}
