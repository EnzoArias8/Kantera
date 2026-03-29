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
      .select('id, name, description, price, precio_anterior, caracteristicas, category, category_label, stock, measure, variants')
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }

    // Construir contexto del catálogo para el sistema prompt
    const catalogContext = products?.map(product => {
      const variants = product.variants || [];
      const variantInfo = variants.length > 0 
        ? `\n  Variantes: ${variants.map((v: any) => `- ${v.measure}: $${v.price} (Stock: ${v.stock})`).join(', ')}` 
        : '';
      
      // Lógica para detectar si está en oferta
      const isOferta = product.precio_anterior && product.precio_anterior > product.price;
      const ofertaText = isOferta ? `\n  ¡ESTADO: EN OFERTA! (Precio anterior: $${product.precio_anterior})` : '';
      const caracteristicasText = product.caracteristicas ? `\n  Características: ${product.caracteristicas}` : '';
      
      return `${product.name} - ${product.category_label || product.category}
  Precio actual: $${(product.price || 0).toLocaleString('es-AR')} por ${product.unit || 'unidad'}${ofertaText}
  Descripción: ${product.description || 'Sin descripción'}${caracteristicasText}
  Stock: ${product.stock || 0} unidades
  Medida: ${product.measure || 'Estándar'}${variantInfo}`;
    }).join('\n\n') || 'No hay productos en el catálogo.';

    // 2. Llamar a Google AI API directamente
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Eres el asistente virtual experto y amigable de Kantera.

Catálogo actual:
${catalogContext}

REGLAS ESTRICTAS DE COMPORTAMIENTO:
1. FORMATO TEXTO PLANO (CERO ASTERISCOS): Tienes ABSOLUTAMENTE PROHIBIDO usar el símbolo de asterisco (*) en tus respuestas. No uses formato markdown para negritas ni cursivas. Escribe solo en texto plano. Si quieres resaltar un producto, escríbelo en MAYÚSCULAS.
2. LONGITUD ADAPTABLE Y COMPLETA: Por defecto, sé breve, conversacional y directo. SIN EMBARGO, si el usuario te pide listar "todos" los productos o detalles de varios ítems, TIENES PERMISO para dar una respuesta más larga. NUNCA dejes una oración a la mitad ni cortes la información. Termina siempre tus ideas completas.
3. LISTAS LIMPIAS: Cuando listes productos, usa un guion normal (-) o un emoji como viñeta, seguido del NOMBRE EN MAYÚSCULAS, el precio, y una breve descripción.
4. CERO SALUDOS REPETIDOS: Si ya hay un historial de conversación, no digas "Hola" ni "Claro". Ve directo a la respuesta.
5. CROSS-SELLING DIRECTO: Si piden algo que no vendemos, responde rápido que no lo trabajamos y ofrece una alternativa de Kantera (ej: "No trabajamos cemento, pero te sugiero mirar nuestras bachas de piedra natural...").
6. OFERTAS: Si un producto dice "¡ESTADO: EN OFERTA!", resáltalo con entusiasmo. Si el usuario pregunta por ofertas, busca EXCLUSIVAMENTE los que tengan esta etiqueta.

Historial de conversación:
${messages.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

Último mensaje del usuario: ${messages[messages.length - 1]?.content || ''}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google AI API Error:', errorData);
      throw new Error('Error al llamar a Google AI API');
    }

    const data = await response.json();
    const message = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lo siento, no pude procesar tu mensaje.';

    return Response.json({ message });

  } catch (error) {
    console.error('Chat API Error:', error);
    return Response.json({ 
      message: 'Lo siento, tuve un problema al procesar tu mensaje. Por favor, intenta nuevamente.' 
    }, { status: 500 });
  }
}
