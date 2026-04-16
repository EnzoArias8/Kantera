'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  weight: ['400', '600', '700'] 
})

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll al final cuando hay nuevos mensajes
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Bloquear scroll del fondo cuando el chat está abierto en móvil
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      // Bloquear scroll del body
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = '0'
      
      // Guardar posición actual del scroll
      const scrollY = window.scrollY
      document.body.style.top = `-${scrollY}px`
    } else {
      // Restaurar scroll del body
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      
      // Restaurar posición del scroll
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    return () => {
      // Cleanup: restaurar scroll
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
    }
  }, [isOpen])

  // Detectar cuando la página terminó de cargar
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 5000) // 5 segundos después de montar (aumentado)
    
    return () => clearTimeout(timer)
  }, [])

  // Mostrar mensaje de bienvenida temporal (sin sonido)
  useEffect(() => {
    if (!isPageLoading && showWelcome) {
      // Esperar 5 segundos después de que cargue la página
      const delayTimer = setTimeout(() => {
        // Ocultar mensaje después de 5 segundos
        const hideTimer = setTimeout(() => {
          setShowWelcome(false)
        }, 5000)
        
        return () => clearTimeout(hideTimer)
      }, 5000) // 5 segundos de espera

      return () => clearTimeout(delayTimer)
    }
  }, [isPageLoading, showWelcome])

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (messageContent: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, tuve un problema al procesar tu mensaje. Por favor, intenta nuevamente.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      sendMessage(input.trim())
    }
  }

  const handleQuickAction = (question: string) => {
    if (!isLoading) {
      sendMessage(question)
    }
  }

  if (!isOpen || isPageLoading) {
    // No mostrar nada durante la carga
    if (isPageLoading) {
      return null
    }
    
    // Mostrar imagen flotante y mensaje de bienvenida después de cargar
    return (
      <>
        {/* Mensaje de bienvenida temporal */}
        {showWelcome && (
          <div className="fixed bottom-28 right-4 z-50 animate-fade-in md:bottom-32 md:right-6">
            <div className="bg-amber-900 text-white px-4 py-2 rounded-lg shadow-lg max-w-xs">
              <p className={`${playfair.className} text-sm font-medium`}>
                ¡Hola! Soy el chatbot de <span className={playfair.className}>Kantera</span>
              </p>
              <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-amber-900"></div>
            </div>
          </div>
        )}
        
        <div className="fixed bottom-4 right-4 z-50 transition-opacity duration-300 md:bottom-6 md:right-6">
          <img
            src="/images/chatbot.png"
            alt="Kantera Bot"
            onClick={() => setIsOpen(true)}
            className="w-20 h-20 rounded-full object-cover cursor-pointer shadow-lg hover:scale-105 transition-transform"
          />
        </div>
      </>
    )
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full h-full md:bottom-17 md:right-6 md:w-[450px] md:h-[575px] md:max-h-[80vh]">
      <Card className="h-full flex flex-col shadow-2xl border-amber-200 md:rounded-lg">
        {/* Header */}
        <CardHeader className="bg-amber-900 text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className={`${playfair.className} text-lg font-semibold flex items-center gap-3`}>
              <img 
                src="/images/chatbot.png" 
                alt="Kantera Bot" 
                className="w-10 h-10 rounded-full object-cover"
              />
              Kantera Bot
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-amber-950 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 p-0 relative">
          <div 
            className="absolute inset-0 overflow-y-auto overflow-x-hidden"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              height: '100%'
            }}
          >
            <div className="p-3 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  <img 
                    src="/images/chatbot.png" 
                    alt="Kantera Bot" 
                    className="w-20 h-20 mx-auto mb-3 rounded-full object-cover"
                  />
                  <p className={`${playfair.className} text-base font-semibold text-amber-700 mb-2`}>
                    ¡Hola! soy el chatbot de <span className={playfair.className}>Kantera</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ¿En qué puedo ayudarte hoy?
                  </p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 max-w-[85%] mb-4",
                    message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden",
                      message.role === 'user' ? 'bg-amber-100' : 'bg-amber-100'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-amber-700" />
                    ) : (
                      <img 
                        src="/images/chatbot.png" 
                        alt="Kantera Bot" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-lg px-4 py-3 max-w-full break-words",
                      message.role === 'user'
                        ? "bg-amber-900 text-white"
                        : "bg-gray-100 text-gray-900"
                    )}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 mr-auto max-w-[85%] mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-100 overflow-hidden flex-shrink-0">
                    <img 
                      src="/images/chatbot.png" 
                      alt="Kantera Bot" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
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
          </div>
        </CardContent>

        {/* Input Area */}
        <div className="p-3 border-t bg-gray-50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={() => sendMessage(input.trim())}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="bg-amber-900 hover:bg-amber-950 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default ChatWidget
