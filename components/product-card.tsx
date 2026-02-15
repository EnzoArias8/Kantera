"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import Image from "next/image"
import { StockModal } from "./stock-modal"

interface ProductCardProps {
  name: string
  price: number
  unit: string
  image: string
  category: string
}

export function ProductCard({ name, price, unit, image, category }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:border-primary/30">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className="absolute left-3 top-3 rounded-md bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            {category}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-sm font-semibold text-foreground leading-tight">{name}</h3>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">
              {"$"}{price.toLocaleString("es-AR")}
            </span>
            <span className="text-sm text-muted-foreground">/ {unit}</span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary/5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            Consultar Stock
          </button>
        </div>
      </article>

      <StockModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={name}
        productPrice={price}
        productUnit={unit}
      />
    </>
  )
}
