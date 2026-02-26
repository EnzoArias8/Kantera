import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Image mappings from .jpg to .svg
const imageMappings: { [key: string]: string } = {
  "/images/laja-natural.jpg": "/images/laja-natural.svg",
  "/images/piedra-natural.jpg": "/images/piedra-natural.svg",
  "/images/travertino.jpg": "/images/travertino.svg",
  "/images/marmol.jpg": "/images/marmol.svg",
  "/images/bali-stone.jpg": "/images/bali-stone.svg",
  "/images/black-lava.jpg": "/images/black-lava.svg",
  "/images/borde-piscina.jpg": "/images/borde-piscina.svg",
  "/images/piso-spc.jpg": "/images/piso-spc.svg",
  "/images/zocalo-pvc.jpg": "/images/zocalo-pvc.svg",
  "/images/deck-wpc.jpg": "/images/deck-wpc.svg",
  "/images/wall-panel.jpg": "/images/wall-panel.svg",
  "/images/siding-wpc.jpg": "/images/siding-wpc.svg",
  "/images/porcelanato.jpg": "/images/porcelanato.svg",
  "/images/bacha-piedra.jpg": "/images/bacha-piedra.svg",
  "/images/premoldeado.jpg": "/images/premoldeado.svg",
  "/images/adoquines.jpg": "/images/adoquines.svg",
  "/images/baldosa-vereda.jpg": "/images/baldosa-vereda.svg",
  "/images/ladrillo-refractario.jpg": "/images/ladrillo-refractario.svg",
  "/images/postes-madera.jpg": "/images/postes-madera.svg",
  "/images/tranquera.jpg": "/images/tranquera.svg",
  "/images/tejido-cerco.jpg": "/images/tejido-cerco.svg",
  "/images/mecano-ganadero.jpg": "/images/mecano-ganadero.svg",
  "/images/totem-luz.jpg": "/images/totem-luz.svg",
  "/images/asador.jpg": "/images/asador.svg",
  "/images/hero-bg.jpg": "/images/hero-bg.svg",
  "/images/footer-bg.jpg": "/images/footer-bg.svg",
  "/images/splash-bg.jpg": "/images/splash-bg.svg"
}

// Create SVG files function
function createSVGContent(text: string, color: string = "#666666") {
  return `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="${color}"/>
  <text x="200" y="150" font-family="Arial" font-size="16" fill="white" text-anchor="middle">${text}</text>
</svg>`
}

export async function POST() {
  try {
    // First, create all SVG files
    const fs = require('fs')
    const path = require('path')
    
    const publicDir = path.join(process.cwd(), 'public', 'images')
    
    // Create SVG files
    for (const [jpgPath, svgPath] of Object.entries(imageMappings)) {
      const filename = path.basename(svgPath, '.svg')
      const svgContent = createSVGContent(filename.replace(/-/g, ' ').toUpperCase())
      
      try {
        await fs.promises.writeFile(path.join(publicDir, `${filename}.svg`), svgContent)
        console.log(`Created ${filename}.svg`)
      } catch (error) {
        console.error(`Error creating ${filename}.svg:`, error)
      }
    }

    // Update database records
    const { data: products, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('id, image')

    if (fetchError) {
      return NextResponse.json(
        { error: 'Error fetching products', details: fetchError },
        { status: 500 }
      )
    }

    // Update each product image path
    const updates = products?.map(product => {
      const newImagePath = imageMappings[product.image]
      if (newImagePath) {
        return supabaseAdmin
          .from('products')
          .update({ image: newImagePath })
          .eq('id', product.id)
      }
      return null
    }).filter(Boolean)

    if (updates.length > 0) {
      const { error: updateError } = await Promise.all(updates)
      if (updateError) {
        return NextResponse.json(
          { error: 'Error updating images', details: updateError },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { 
        message: 'Images updated successfully',
        updatedCount: updates.length,
        imageMappings: Object.keys(imageMappings).length
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
