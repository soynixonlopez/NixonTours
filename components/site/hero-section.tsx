"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const HERO_IMG = "/img/banner.jpg";

export function HeroSection({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative min-h-[520px] overflow-hidden sm:min-h-[600px]">
      <Image
        src={HERO_IMG}
        alt="Nixon Tours — Guna Yala"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/85 via-brand-deep/55 to-brand-deep/90" />
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-turquoise/20 via-transparent to-brand-aqua/10" />

      <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col justify-center px-4 py-24 sm:min-h-[600px] sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-aqua">
            Nixon Tours · Guna Yala
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-brand-pearl sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-brand-pearl/85 sm:text-xl">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="shadow-xl shadow-brand-turquoise/30"
            >
              <Link href="/cotizar">Cotizar mi viaje</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-brand-pearl/35 bg-brand-pearl/10 text-brand-pearl backdrop-blur-sm hover:bg-brand-pearl/20"
            >
              <Link href="/paquetes">Ver paquetes</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
