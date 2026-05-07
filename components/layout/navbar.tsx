"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteSettingsRow } from "@/types/database";

const links = [
  { href: "/paquetes", label: "Paquetes" },
  { href: "/islas", label: "Islas" },
  { href: "/galeria", label: "Galería" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar({
  settings,
  authSummary,
}: {
  settings: SiteSettingsRow | null;
  authSummary?: { name: string | null; email: string | null } | null;
}) {
  const [open, setOpen] = useState(false);
  const logo = settings?.logo_url ?? "/img/logo.png";

  return (
    <header className="sticky top-0 z-50 border-b border-brand-deep/10 bg-brand-pearl/90 shadow-sm shadow-brand-deep/5 backdrop-blur-md supports-[backdrop-filter]:bg-brand-pearl/80">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-5 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise/40 focus-visible:ring-offset-2"
        >
          <span className="flex h-[3.5rem] w-[min(280px,58vw)] items-center overflow-hidden sm:h-[3.875rem] sm:w-[min(300px,52vw)] md:h-[4rem] md:w-[min(320px,36vw)]">
            <Image
              src={logo}
              alt="Nixon Tours"
              width={320}
              height={100}
              className="h-[4rem] w-auto max-w-none origin-left scale-[1.12] object-contain object-left sm:h-[4.25rem] sm:scale-[1.14] md:h-[4.5rem] md:scale-[1.16]"
              priority
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 font-display md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl px-2.5 py-2 text-sm font-semibold text-brand-deep/85 transition hover:bg-brand-soft hover:text-brand-deep lg:px-3"
            >
              {l.label}
            </Link>
          ))}
          {authSummary ? (
            <Link
              href="/mi-cuenta"
              className="rounded-xl px-2.5 py-2 text-sm font-semibold text-brand-turquoise transition hover:bg-brand-soft lg:px-3"
            >
              Mi cuenta
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-xl px-2.5 py-2 text-sm font-semibold text-brand-deep/80 transition hover:bg-brand-soft lg:px-3"
            >
              Entrar
            </Link>
          )}
          <Button asChild size="sm" className="ml-2">
            <Link href="/cotizar">Cotizar mi viaje</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl p-2 text-brand-deep hover:bg-brand-soft md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-brand-deep/10 bg-brand-pearl font-display md:hidden",
          open ? "block shadow-inner shadow-brand-deep/5" : "hidden"
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl px-3 py-3 text-sm font-semibold text-brand-deep/90 hover:bg-brand-soft"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {authSummary ? (
            <Link
              href="/mi-cuenta"
              className="rounded-xl px-3 py-3 text-sm font-semibold text-brand-turquoise hover:bg-brand-soft"
              onClick={() => setOpen(false)}
            >
              Mi cuenta
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-xl px-3 py-3 text-sm font-semibold text-brand-deep hover:bg-brand-soft"
              onClick={() => setOpen(false)}
            >
              Entrar
            </Link>
          )}
          <Button asChild className="mt-2 w-full">
            <Link href="/cotizar" onClick={() => setOpen(false)}>
              Cotizar mi viaje
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
