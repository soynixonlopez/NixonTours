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

export function Navbar({ settings }: { settings: SiteSettingsRow | null }) {
  const [open, setOpen] = useState(false);
  const logo = settings?.logo_url;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          {logo ? (
            <Image
              src={logo}
              alt="Nixon Tours"
              width={140}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          ) : (
            <span className="bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
              NIXON TOURS
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link href="/cotizar">Cotizar mi viaje</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-slate-100 bg-white md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
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
