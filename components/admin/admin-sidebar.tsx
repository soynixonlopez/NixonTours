"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareQuote,
  MapPin,
  Package,
  Settings,
  Users,
  ClipboardList,
  CreditCard,
  Crown,
  UserPlus,
  Coins,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cotizaciones", label: "Cotizaciones", icon: MessageSquareQuote },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/reservas", label: "Reservas", icon: ClipboardList },
  { href: "/admin/pagos", label: "Pagos", icon: CreditCard },
  { href: "/admin/membresias", label: "Membresías", icon: Crown },
  { href: "/admin/afiliados", label: "Afiliados", icon: UserPlus },
  { href: "/admin/comisiones", label: "Comisiones", icon: Coins },
  { href: "/admin/codigos-promocionales", label: "Códigos promo", icon: Tag },
  { href: "/admin/paquetes", label: "Paquetes", icon: Package },
  { href: "/admin/islas", label: "Islas", icon: MapPin },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-56 shrink-0 border-r border-brand-deep/10 bg-brand-pearl md:block">
      <div className="flex h-16 items-center gap-1 border-b border-brand-deep/10 px-2">
        <span className="flex h-14 w-full max-w-[11rem] items-center overflow-hidden">
          <Image
            src="/img/logo.png"
            alt="Nixon Tours"
            width={220}
            height={72}
            className="h-[3.5rem] w-auto max-w-none origin-left scale-[1.14] object-contain object-left"
          />
        </span>
      </div>
      <nav className="space-y-1 p-3 font-display">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
                active
                  ? "bg-gradient-brand text-brand-pearl shadow-md shadow-brand-deep/15"
                  : "text-brand-deep/85 hover:bg-brand-soft hover:text-brand-deep"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <Link
          href="/"
          className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-brand-soft hover:text-brand-deep"
        >
          ← Ver sitio público
        </Link>
      </div>
    </aside>
  );
}
