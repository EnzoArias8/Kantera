import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validar que sea una imagen
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Generar nombre único
    const filename = `${Date.now()}-${file.name}`

    // Convertir archivo a buffer
    const fileBuffer = await file.arrayBuffer()

    // Subir a Supabase
    const { error: uploadError } = await supabaseAdmin.storage
      .from('products')
      .upload(filename, fileBuffer, { contentType: file.type })

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      )
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('products-images')
      .getPublicUrl(filename)
    
    return NextResponse.json({
      message: 'File uploaded successfully',
      url: publicUrl
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
