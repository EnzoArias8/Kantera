import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Obtener productos de la base de datos
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, description, price, category, category_label, stock, measure, variants')
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }

    // Construir contexto del catálogo para el sistema prompt
    const catalogContext = products?.map(product => {
      const variants = product.variants || [];
      const variantInfo = variants.length > 0 
        ? `\n  Variantes disponibles:\n${variants.map((v: any) => `    - ${v.measure}: $${v.price} por ${v.unit || 'unidad'} (Stock: ${v.stock})`).join('\n')}`
        : '';
      
      return `${product.name} - ${product.category_label || product.category}
  Precio base: $${(product.price || 0).toLocaleString('es-AR')} por ${product.unit || 'unidad'}
  Descripción: ${product.description || 'Sin descripción'}
  Stock: ${product.stock || 0} unidades
  Medida: ${product.measure || 'Estándar'}${variantInfo}`;
    }).join('\n\n') || 'No hay productos disponibles en el catálogo.';

    // 2. Llamada a la IA (CON await en streamText)
    const result = await streamText({
      model: google('gemini-2.5-flash'),
      messages,
      system: `Eres el asistente virtual de Kantera, una empresa especializada en revestimientos, piedras naturales y terminaciones para diseño de interiores y exteriores. Tu tono debe ser amable, profesional y conciso.

Catálogo actual de productos:
${catalogContext}

Instrucciones importantes:
- Responde siempre en español
- Sé útil y específico sobre los productos disponibles
- Si te preguntan por un producto que no está en el catálogo, menciona amablemente que por el momento no cuentan con ese material
- Para precios, menciona tanto el precio base como las variantes si existen
- Para stock, indica la disponibilidad actual
- Mantén las respuestas breves pero informativas
- Siempre que menciones un producto, incluye su categoría y precio`
    });

    // 3. Retorno del stream simple (Evita el error de stream-start)
    return result.toTextStreamResponse();

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
}