"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareQuote,
  MapPin,
  Package,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cotizaciones", label: "Cotizaciones", icon: MessageSquareQuote },
  { href: "/admin/paquetes", label: "Paquetes", icon: Package },
  { href: "/admin/islas", label: "Islas", icon: MapPin },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white md:block">
      <div className="flex h-16 items-center border-b border-slate-200 px-4">
        <Link href="/admin/dashboard" className="font-extrabold text-[#0f172a]">
          Nixon Admin
        </Link>
      </div>
      <nav className="space-y-1 p-3">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-gradient-to-r from-cyan-500/15 to-violet-500/15 text-[#0f172a]"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <Link
          href="/"
          className="block rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
        >
          ← Ver sitio público
        </Link>
      </div>
    </aside>
  );
}
