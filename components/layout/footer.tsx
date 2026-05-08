import Image from "next/image";
import Link from "next/link";
import { Share2, Mail, MapPin, Globe } from "lucide-react";
import { buildWhatsAppUrl, normalizeWhatsAppDigits } from "@/lib/whatsapp";
import type { SiteSettingsRow } from "@/types/database";

export function Footer({ settings }: { settings: SiteSettingsRow | null }) {
  const phone = settings?.whatsapp ?? "+50768252312";
  const wa = buildWhatsAppUrl(
    normalizeWhatsAppDigits(phone) || "50768252312",
    "Hola Nixon Tours, quiero información sobre Guna Yala."
  );

  return (
    <footer className="border-t border-white/10 bg-brand-deep text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <span className="relative inline-flex h-11 w-[min(190px,88%)] items-center justify-center overflow-hidden sm:h-12 sm:w-[min(220px,92%)]">
            <Image
              src="/img/logoblanco.png"
              alt="Nixon Tours"
              width={400}
              height={120}
              sizes="(max-width: 640px) 88vw, 220px"
              className="h-[118%] w-auto max-w-none scale-[1.18] object-contain object-center sm:scale-[1.2]"
            />
          </span>
          <p className="text-sm leading-relaxed text-brand-pearl/70">
            Agencia familiar especializada en Guna Yala. Seguridad, cultura y
            playas que enamoran.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-pearl font-display">
            Explorar
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/paquetes", "Paquetes"],
              ["/islas", "Islas"],
              ["/galeria", "Galería"],
              ["/nosotros", "Nosotros"],
              ["/contacto", "Contacto"],
              ["/cotizar", "Cotizar"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href as string}
                  className="text-brand-pearl/70 transition hover:text-brand-aqua"
                >
                  {label as string}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-pearl font-display">
            Contacto
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={wa}
                className="inline-flex items-center gap-2 text-brand-pearl/70 transition hover:text-brand-aqua"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp: {phone}
              </a>
            </li>
            {settings?.email && (
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 text-brand-pearl/70 transition hover:text-brand-aqua"
                >
                  <Mail className="h-4 w-4 text-brand-aqua" />
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.address && (
              <li className="inline-flex gap-2 text-brand-pearl/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-sunset" />
                <span>{settings.address}</span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-pearl font-display">
            Redes
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 transition hover:bg-white/15"
                aria-label="Instagram"
              >
                <Share2 className="h-5 w-5 text-brand-aqua" />
              </a>
            )}
            {settings?.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 transition hover:bg-white/15"
                aria-label="Facebook"
              >
                <Globe className="h-5 w-5 text-brand-aqua" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-4 py-6 text-xs text-brand-pearl/55 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2 sm:px-6 lg:px-8">
          <span>
            © {new Date().getFullYear()} Nixon Tours. Todos los derechos
            reservados.
          </span>
          <span className="hidden h-3 w-px bg-white/20 sm:inline" aria-hidden />
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-display">
            <Link
              href="/privacidad"
              className="text-brand-pearl/70 transition hover:text-brand-aqua"
            >
              Política de privacidad
            </Link>
            <Link
              href="/aviso-legal"
              className="text-brand-pearl/70 transition hover:text-brand-aqua"
            >
              Aviso legal
            </Link>
            <Link
              href="/afiliados"
              className="font-semibold text-brand-aqua transition hover:text-brand-pearl"
            >
              Afiliados
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
