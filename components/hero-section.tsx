import Image from "next/image"
import { ArrowDown } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        className="object-cover"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/70" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            Materiales de construccion
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tu proveedor de confianza para materiales de construccion
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-white/70">
            Encontra todo lo que necesitas para tu obra. Cemento, arena, hierro, herramientas y mucho mas, con los mejores precios y atencion personalizada.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="#productos"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              Ver Catalogo
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur transition-all hover:bg-white/20"
            >
              Contactanos
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
