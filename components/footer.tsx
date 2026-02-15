import Image from "next/image"
import { MapPin, Phone, Clock, Lock } from "lucide-react"

export function Footer() {
  return (
    <footer id="contacto" className="relative overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/footer-bg.jpg"
        alt=""
        fill
        className="object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/80" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">K</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Kantera</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Tu corralon de confianza. Mas de 20 anos brindando materiales de calidad para tu obra.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-sm text-white/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Av. San Martin 1234, Buenos Aires
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/80">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                (011) 4567-8901
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/80">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Lun a Sab: 7:00 - 18:00
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              Enlaces
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#productos" className="text-sm text-white/60 transition-colors hover:text-white">
                  Productos
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-sm text-white/60 transition-colors hover:text-white">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-white/40">
            {"© 2026 Kantera. Todos los derechos reservados."}
          </p>
        </div>

        {/* Admin link - barely visible */}
        <div className="mt-6 text-center">
          <a
            href="#admin"
            className="inline-flex items-center gap-1 text-[10px] text-white/20 transition-colors hover:text-white/40"
          >
            <Lock className="h-2.5 w-2.5" />
            Administracion
          </a>
        </div>
      </div>
    </footer>
  )
}
