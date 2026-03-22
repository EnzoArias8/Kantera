"use client"

import { usePathname } from 'next/navigation'
import ChatWidget from '@/components/chat-widget'

export default function ChatWrapper() {
  const pathname = usePathname()
  
  // No mostrar el chatbot en rutas de administración
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')
  
  if (isAdminRoute) {
    return null
  }
  
  return <ChatWidget />
}
