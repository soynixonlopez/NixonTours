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

  const logo = settings?.logo_url;

  return (
    <footer className="border-t border-slate-200 bg-[#0f172a] text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          {logo ? (
            <Image
              src={logo}
              alt="Nixon Tours"
              width={160}
              height={48}
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          ) : (
            <div className="text-lg font-extrabold tracking-tight text-white">
              NIXON TOURS
            </div>
          )}
          <p className="text-sm leading-relaxed text-slate-400">
            Agencia familiar especializada en Guna Yala. Seguridad, cultura y
            playas que enamoran.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
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
                  className="text-slate-400 transition hover:text-cyan-300"
                >
                  {label as string}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Contacto
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={wa}
                className="inline-flex items-center gap-2 text-slate-400 transition hover:text-cyan-300"
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
                  className="inline-flex items-center gap-2 text-slate-400 transition hover:text-cyan-300"
                >
                  <Mail className="h-4 w-4" />
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.address && (
              <li className="inline-flex gap-2 text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                <span>{settings.address}</span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Redes
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10"
                aria-label="Instagram"
              >
                <Share2 className="h-5 w-5" />
              </a>
            )}
            {settings?.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10"
                aria-label="Facebook"
              >
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>
          <p className="mt-6 text-xs text-slate-500">
            © {new Date().getFullYear()} Nixon Tours. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
