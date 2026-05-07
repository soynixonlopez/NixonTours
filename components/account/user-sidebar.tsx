"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Heart,
  Home,
  Map,
  Plane,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import { SignOutButton } from "@/components/account/sign-out-button";

const links = [
  { href: "/mi-cuenta", label: "Resumen", icon: Home },
  { href: "/mi-cuenta/perfil", label: "Perfil", icon: UserRound },
  { href: "/mi-cuenta/mis-viajes", label: "Mis viajes", icon: Plane },
  { href: "/mi-cuenta/pagos", label: "Pagos", icon: CreditCard },
  { href: "/mi-cuenta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/mi-cuenta/afiliado", label: "Afiliado", icon: Users },
  { href: "/mi-cuenta/premium", label: "Nixon Premium", icon: Sparkles },
  { href: "/premium", label: "Conocer Premium", icon: Map },
];

export function UserSidebar() {
  const pathname = usePathname() ?? "";
  return (
    <aside className="w-full shrink-0 md:w-56">
      <nav className="flex flex-row gap-1 overflow-x-auto pb-3 md:flex-col md:overflow-visible md:border-r md:border-brand-deep/10 md:pr-4 md:pb-0">
        {links.map((l) => {
          const active =
            pathname === l.href ||
            (l.href !== "/mi-cuenta" && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 font-display text-sm font-semibold transition",
                active
                  ? "bg-gradient-brand text-brand-pearl shadow-md shadow-brand-deep/15"
                  : "text-brand-deep/85 hover:bg-brand-soft"
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 border-t border-brand-deep/10 pt-4 md:px-0">
        <SignOutButton variant="block" />
      </div>
    </aside>
  );
}
