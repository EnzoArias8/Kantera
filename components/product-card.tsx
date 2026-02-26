"use client"

import { Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  id: string
  name: string
  price: number
  unit: string
  images: string[]
  category: string
}

export function ProductCard({ id, name, price, unit, images, category }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:border-primary/30">
      {/* Product Link */}
      <Link href={`/product/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={images?.[0] || '/images/laja-natural.jpg'}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/images/laja-natural.jpg'
            }}
          />
          <span className="absolute left-3 top-3 rounded-md bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            {category}
          </span>
        </div>
      </Link>
      
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${id}`} className="block">
          <h3 className="text-sm font-semibold text-foreground leading-tight transition-colors hover:text-primary">
            {name}
          </h3>
        </Link>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">
            {"$"}{price.toLocaleString("es-AR")}
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
    </article>
  )
}
