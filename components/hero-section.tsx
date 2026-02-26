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
          <p className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-primary bg-white/90 px-4 py-2 rounded-lg backdrop-blur-sm">
            SUPERFICIES & DISEÑO
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Texturas que transforman espacios
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-white/70">
            Somos especialistas en darle la terminación perfecta a tu obra. Ofrecemos el catálogo más completo de la región en piedras naturales, revestimientos para piscinas y soluciones para exterior. Asesoramiento técnico, stock permanente y la calidad garantizada que tu proyecto necesita para pasar de los planos a la realidad.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <a
              href="#productos"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              Ver Catalogo
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
