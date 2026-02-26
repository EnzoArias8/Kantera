import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { ProductModalProvider } from '@/components/product-modal-provider'
import { StockModalProvider } from '@/components/stock-modal-provider'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Kantera - Superficies & Diseño',
  description: 'Somos especialistas en darle la terminación perfecta a tu obra. Ofrecemos el catálogo más completo de la región en piedras naturales, revestimientos para piscinas y soluciones para exterior. Asesoramiento técnico, stock permanente y la calidad garantizada que tu proyecto necesita para pasar de los planos a la realidad.',
  icons: {
    icon: '/images/logo.jpg',
    shortcut: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
}

export const viewport: Viewport = {
  themeColor: '#9e7c5f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
        <ProductModalProvider />
        <StockModalProvider />
      </body>
    </html>
  )
}
