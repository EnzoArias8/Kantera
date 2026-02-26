import Image from "next/image"
import { MapPin, Phone, Clock, Mail, MessageCircle, Instagram, Lock } from "lucide-react"

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
      <div className="absolute inset-0 bg-foreground/60" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                <Image
                  src="/images/logo.jpg"
                  alt="Kantera"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Kantera</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Superficies & Diseño. Especialistas en darle la terminación perfecta a tu obra.
            </p>
          </div>

          {/* Ubicación */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              Ubicación
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="mt-0.5">Rafaela, Santa Fe</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span className="mt-0.5">Lun a Vie: 8:00 - 17:00</span>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="mt-0.5">contacto@kantera.com</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="mt-0.5">3492...</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              Redes Sociales
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2.5 text-sm text-white/80 transition-colors hover:text-white"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="mt-0.5">WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2.5 text-sm text-white/80 transition-colors hover:text-white"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm">
                    <Instagram className="h-4 w-4 text-primary" />
                  </div>
                  <span className="mt-0.5">Instagram</span>
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
            href="/admin"
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
