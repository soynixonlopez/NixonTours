"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl, normalizeWhatsAppDigits } from "@/lib/whatsapp";
import type { SiteSettingsRow } from "@/types/database";

export function CTASection({
  settings,
  eyebrow = "¿Listo para el Caribe?",
  title = "Cotiza tu viaje en minutos",
  subtitle = "Te respondemos por WhatsApp con disponibilidad y próximos pasos. Nixon Tours, experiencia familiar en Guna Yala.",
}: {
  settings: SiteSettingsRow | null;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  const phone = settings?.whatsapp ?? "+50768252312";
  const wa = buildWhatsAppUrl(
    normalizeWhatsAppDigits(phone),
    "Hola Nixon Tours, quiero cotizar un paquete a Guna Yala."
  );

  return (
    <section className="relative overflow-hidden bg-gradient-brand py-20 text-brand-pearl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(253,182,51,0.18),transparent_42%),radial-gradient(circle_at_85%_70%,rgba(39,211,226,0.22),transparent_38%)]" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-brand-aqua"
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mt-4 font-display text-3xl font-extrabold tracking-tight text-brand-pearl sm:text-4xl"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-brand-pearl/90"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="w-full min-w-[200px] bg-brand-pearl text-brand-deep shadow-lg shadow-brand-deep/20 hover:bg-brand-sand sm:w-auto"
          >
            <Link href="/cotizar">Cotizar mi viaje</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full min-w-[200px] border-2 border-brand-pearl/40 bg-brand-pearl/10 text-brand-pearl backdrop-blur-sm hover:bg-brand-pearl/20 sm:w-auto"
          >
            <Link href={wa} target="_blank" rel="noreferrer">
              Reservar por WhatsApp
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
