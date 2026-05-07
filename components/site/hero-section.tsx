"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const HERO_IMG =
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=2000&q=80";

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
        alt="Guna Yala — mar turquesa e islas"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-[#0f172a]/55 to-[#0f172a]/85" />
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-violet-500/15" />

      <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col justify-center px-4 py-24 sm:min-h-[600px] sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300/90">
            Nixon Tours · Guna Yala
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-200 sm:text-xl">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="shadow-xl shadow-cyan-500/20">
              <Link href="/cotizar">Cotizar mi viaje</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/15">
              <Link href="/paquetes">Ver paquetes</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
