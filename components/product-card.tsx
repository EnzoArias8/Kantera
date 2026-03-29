"use client"

import { Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  id: string
  name: string
  price: number
  precio_anterior?: number
  unit: string
  images: string[]
  category: string
  origen?: string
}

export function ProductCard({ id, name, price, precio_anterior, unit, images, category, origen }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:border-primary/30">
      {/* Product Link */}
      <Link href={`/product/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden border border-gray-200 bg-gray-50 rounded-lg">
          <Image
            src={images?.[0] || '/images/laja-natural.jpg'}
            alt={name}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/images/laja-natural.jpg'
            }}
          />
          {origen && (
            <span className="absolute left-3 top-3 rounded-md bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm z-10">
              {origen}
            </span>
          )}
          {precio_anterior && precio_anterior > price && (
            <span className="absolute right-3 top-3 rounded-md bg-red-500 px-2.5 py-1 text-xs font-medium text-white z-10">
              OFERTA
            </span>
          )}
        </div>
      </Link>
      
      <div className="flex flex-1 flex-col p-4">
        {/* Título y % OFF en la misma línea */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <Link href={`/product/${id}`} className="flex-1">
            <h3 className="text-sm font-semibold text-foreground leading-tight transition-colors hover:text-primary">
              {name}
            </h3>
          </Link>
          {precio_anterior && precio_anterior > price && (
            <span className="text-sm font-medium text-green-600 whitespace-nowrap">
              {Math.round(((precio_anterior - price) / precio_anterior) * 100)}% OFF
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-col">
          <div className="flex items-baseline gap-2">
            {precio_anterior && precio_anterior > price && (
              <span className="text-sm text-gray-400 line-through">
                ${precio_anterior.toLocaleString("es-AR")}
              </span>
            )}
            <span className="font-bold text-lg text-primary">
              ${price.toLocaleString("es-AR")}
            </span>
            <span className="text-sm text-muted-foreground">/ {unit}</span>
          </div>

          <div className="mt-4">
            <Link
              href={`/product/${id}`}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
            >
              <Eye className="h-4 w-4" />
              Ver producto
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
