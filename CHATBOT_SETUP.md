# 🤖 Chatbot Kantera - Guía de Instalación

## 📦 Dependencias Requeridas

Instala las siguientes dependencias:

```bash
npm install ai @ai-sdk/google
```

## 🔧 Configuración del Environment

Asegúrate de tener estas variables en tu `.env.local`:

```env
# Google Gemini API Key (ya debería existir como GOOGLE_GEMINI_API_KEY)
GOOGLE_GEMINI_API_KEY=AIzaSyA3ptDQNdKCRTBI3Ottqn9hpZZL8YUwVQs

# Supabase (ya deberían existir)
NEXT_PUBLIC_SUPABASE_URL=https://liefxuboljstoorwmqxq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🏗️ Estructura de Archivos Creados

```
app/api/chat/route.ts                    # Backend del chatbot
components/chat-widget.tsx               # UI del chat flotante (requiere dependencias)
components/chat-widget-placeholder.tsx    # UI temporal sin dependencias
app/layout.tsx                           # Integración global (usando placeholder)
CHATBOT_SETUP.md                         # Esta guía
```

## ✅ Estado Actual

### 🟡 Funcionando Ahora (Placeholder)
- **UI completa** - Botón flotante y chat modal funcionando
- **Diseño Kantera** - Colores celeste y blanco
- **Interacciones** - Quick actions, loading states
- **Sin dependencias** - No requiere `ai` ni `@ai-sdk/google`

### 🟢 Después de Instalar Dependencias
- **IA real** - Conexión con Gemini
- **Catálogo dinámico** - Consultas a Supabase
- **Respuestas inteligentes** - Contexto de productos

## 🚀 Cómo Activar el Chatbot Completo

### Paso 1: Instalar Dependencias
```bash
npm install ai @ai-sdk/google
```

### Paso 2: Cambiar al Widget Real
Edita `app/layout.tsx`:

```typescript
// Cambia esto:
import ChatWidgetPlaceholder from '@/components/chat-widget-placeholder'
<ChatWidgetPlaceholder />

// Por esto:
import ChatWidget from '@/components/chat-widget'
<ChatWidget />
```

### Paso 3: Probar
```bash
npm run dev
```

## 🎯 Características del Placeholder

### ✅ Funciona Ahora
- **Botón flotante** - Esquina inferior derecha
- **Chat modal** - Ventana de conversación
- **Quick actions** - Botones rápidos
- **Loading states** - Indicadores visuales
- **Auto-scroll** - Desplazamiento automático
- **Diseño responsive** - Adaptado a móviles

### 🔄 Respuesta Temporal
El placeholder responde con instrucciones para instalar las dependencias:

> "¡Hola! Soy tu asistente de Kantera. Para poder ayudarte con consultas sobre productos, precios y disponibilidad, primero necesito que instales las dependencias del chatbot..."

## 🐛 Troubleshooting

### Error: "Module not found: Can't resolve 'ai/react'"
**Estado**: ✅ **Resuelto con placeholder**
- El widget placeholder funciona sin dependencias
- Instala `ai @ai-sdk/google` cuando quieras activar la IA

### Error: "GOOGLE_GEMINI_API_KEY not found"
**Estado**: ✅ **Configurado**
- Ya tienes la API key en tu `.env.local.example`
- El código usa `GOOGLE_GEMINI_API_KEY` correctamente

### El chatbot no responde con IA
**Solución**: Instala dependencias y cambia al widget real
```bash
npm install ai @ai-sdk/google
# Luego edita layout.tsx para usar ChatWidget en lugar de ChatWidgetPlaceholder
```

## 🎨 Personalización

### Cambiar colores (ahora mismo)
Edita `components/chat-widget-placeholder.tsx`:
```typescript
// Cambiar color principal
className="bg-sky-500 hover:bg-sky-600"
```

### Modificar respuesta del placeholder
Edita el contenido del mensaje en `handleSubmit()`.

## 📈 Próximos Pasos

1. **Instalar dependencias** cuando quieras IA real
2. **Cambiar al widget real** para activar Gemini
3. **Probar consultas** con catálogo real
4. **Monitorear rendimiento** en consola

---

**🎉 ¡El placeholder está funcionando ahora! El botón celeste flotante aparece y puedes interactuar con la UI. Cuando quieras activar la IA real, solo instala las dependencias y cambia al widget completo.**
