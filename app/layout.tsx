import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Kantera - Corralon de Materiales',
  description: 'Tu proveedor de confianza para materiales de construccion. Cemento, arena, herramientas y mas al mejor precio.',
}

export const viewport: Viewport = {
  themeColor: '#0EA5E9',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
