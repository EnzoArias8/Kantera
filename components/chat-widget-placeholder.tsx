'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidgetPlaceholder() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simular respuesta del bot (reemplazar con API real después de instalar dependencias)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `¡Hola! Soy tu asistente de Kantera. 

Para poder ayudarte con consultas sobre productos, precios y disponibilidad, primero necesito que instales las dependencias del chatbot:

\`\`\`bash
npm install ai @ai-sdk/google
\`\`\`

Una vez instaladas, podré responder preguntas como:
- ¿Qué productos tienen para baños?
- ¿Cuál es el precio de [producto]?
- ¿Tienen stock de [variante]?
- ¿Qué piedras naturales tienen disponibles?

Mientras tanto, puedes navegar por nuestro catálogo directamente en la web. ¡Gracias por tu paciencia!`
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  if (!isOpen) {
    // Botón flotante
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-14 h-14 bg-sky-500 hover:bg-sky-600 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] max-h-[80vh]">
      <Card className="h-full flex flex-col shadow-2xl border-sky-200">
        {/* Header */}
        <CardHeader className="bg-sky-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Asistente Kantera
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-sky-600 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sky-100 text-sm">
            ¿Necesitas ayuda con revestimientos?
          </p>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[400px] p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-2 text-sky-500" />
                  <p className="text-sm">
                    ¡Hola! Soy tu asistente de Kantera. 
                    <br />
                    ¿En qué puedo ayudarte hoy?
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === 'user' 
                        ? 'bg-sky-500 text-white' 
                        : 'bg-sky-100 text-sky-600'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm",
                      message.role === 'user'
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3 mr-auto max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        {/* Input Area */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading || !input.trim()}
              className="bg-sky-500 hover:bg-sky-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          {/* Quick Actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('¿Qué productos tienen para baños?')}
              className="text-xs"
            >
              🚿 Baños
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Necesito revestimientos para paredes exteriores')}
              className="text-xs"
            >
              🏠 Exteriores
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('¿Qué piedras naturales tienen disponibles?')}
              className="text-xs"
            >
              🪨 Piedras
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
