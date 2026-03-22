import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Verificar si es el primer mensaje
    const isFirstMessage = messages.length === 1;

    // Si es el primer mensaje, responder con saludo
    if (isFirstMessage) {
      return Response.json({ 
        message: "¡Hola! Soy el asistente virtual de Kantera. Estoy aquí para ayudarte con información sobre nuestros productos de revestimientos, piedras naturales y terminaciones. ¿En qué puedo asistirte hoy?" 
      });
    }

    // Para mensajes posteriores, responder con mensaje limitado
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    
    // Detectar si están pidiendo información de productos específicos
    const isProductInquiry = lastUserMessage.includes('producto') || 
                            lastUserMessage.includes('precio') || 
                            lastUserMessage.includes('stock') || 
                            lastUserMessage.includes('disponible') ||
                            lastUserMessage.includes('catálogo') ||
                            lastUserMessage.includes('catalogo') ||
                            lastUserMessage.includes('venden') ||
                            lastUserMessage.includes('tienen') ||
                            lastUserMessage.includes('hay') ||
                            lastUserMessage.includes('buscar') ||
                            lastUserMessage.includes('necesito') ||
                            lastUserMessage.includes('quiero') ||
                            lastUserMessage.includes('comprar') ||
                            lastUserMessage.includes('costo') ||
                            lastUserMessage.includes('cuánto') ||
                            lastUserMessage.includes('cuanto') ||
                            lastUserMessage.includes('lista') ||
                            lastUserMessage.includes('inventario') ||
                            lastUserMessage.includes('material') ||
                            lastUserMessage.includes('revestimiento') ||
                            lastUserMessage.includes('piedra') ||
                            lastUserMessage.includes('laja') ||
                            lastUserMessage.includes('travertino') ||
                            lastUserMessage.includes('porcelanato') ||
                            lastUserMessage.includes('bacha') ||
                            lastUserMessage.includes('deck') ||
                            lastUserMessage.includes('piso') ||
                            lastUserMessage.includes('madera') ||
                            lastUserMessage.includes('cerco') ||
                            lastUserMessage.includes('ladrillo') ||
                            lastUserMessage.includes('adoquin') ||
                            lastUserMessage.includes('mecano') ||
                            lastUserMessage.includes('luminaria') ||
                            lastUserMessage.includes('asador') ||
                            lastUserMessage.includes('premoldeado');

    // Si no es una consulta de productos, responder con mensaje limitado
    if (!isProductInquiry) {
      return Response.json({ 
        message: "Entiendo tu consulta. Para obtener información específica sobre nuestros productos, precios o disponibilidad, por favor menciona directamente lo que necesitas. Estoy aquí para ayudarte con información del catálogo de Kantera." 
      });
    }

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
                text: `Eres el asistente virtual de Kantera, una empresa especializada en revestimientos, piedras naturales y terminaciones para diseño de interiores y exteriores. Tu tono debe ser amable, profesional y conciso.

Catálogo actual de productos:
${catalogContext}

Instrucciones importantes:
- Responde siempre en español
- Sé útil y específico sobre los productos disponibles
- Si te preguntan por un producto que no está en el catálogo, menciona amablemente que por el momento no cuentan con ese material
- Para precios, menciona tanto el precio base como las variantes si existen
- Para stock, indica la disponibilidad actual
- Mantén las respuestas breves pero informativas
- Siempre que menciones un producto, incluye su categoría y precio
- NO uses asteriscos (*) ni formato markdown, responde en texto plano y conversacional
- Usa párrafos cortos y separa las ideas con saltos de línea
- CUANDO LISTES VARIOS PRODUCTOS, usa emojis (🏷️, 📦, 🏗️, 🏠, 🏺, etc.) en lugar de asteriscos
- Usa un emoji diferente para cada producto para hacer la lista más visual

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
    let message = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lo siento, no pude procesar tu mensaje.';

    // Procesar el mensaje para formatear listas de productos con emojis y negritas
    message = message.replace(/\*\s*(.+?)(?=\n|$)/g, (match, productName) => {
      const emojis = ['🏷️', '📦', '🏗️', '🏠', '🏺', '🪨', '🔷', '🌿', '🔥', '💧', '⚡', '🎨', '🔧', '📐', '🏭'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      return `${randomEmoji} **${productName.trim()}**`;
    });

    return Response.json({ message });

  } catch (error) {
    console.error('Chat API Error:', error);
    return Response.json({ 
      message: 'Lo siento, tuve un problema al procesar tu mensaje. Por favor, intenta nuevamente.' 
    }, { status: 500 });
  }
}
