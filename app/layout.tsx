import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { ProductModalProvider } from '@/components/product-modal-provider'
import { StockModalProvider } from '@/components/stock-modal-provider'
import ChatWrapper from './chat-wrapper'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Kantera - Superficies & Diseño',
  description: 'Somos especialistas en darle la terminación perfecta a tu obra.            Natural, funcional y atemporal.',
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
      <body className={`${_inter.variable} font-sans antialiased`}>
        {children}
        <ProductModalProvider />
        <StockModalProvider />
        <ChatWrapper />
      </body>
    </html>
  )
}
