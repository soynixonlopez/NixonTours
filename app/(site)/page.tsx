import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Shield, Heart, Leaf, Compass, Crown, ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/site/hero-section";
import { IslandCard } from "@/components/site/island-card";
import { PackageCard } from "@/components/site/package-card";
import { CTASection } from "@/components/site/cta-section";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { Button } from "@/components/ui/button";
import {
  getActiveIslands,
  getActivePackages,
  getSiteSettings,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Descubre las mejores islas de Guna Yala con Nixon Tours. Estadía, pasadía y camping con enfoque familiar y seguro.",
};

export default async function HomePage() {
  const [settings, islands, packages] = await Promise.all([
    getSiteSettings(),
    getActiveIslands(),
    getActivePackages(),
  ]);

  const heroTitle =
    settings?.hero_title ??
    "Vive Guna Yala con una experiencia auténtica, segura y familiar";
  const heroSubtitle =
    settings?.hero_subtitle ??
    "Paquetes de estadía, pasadía y camping hacia las mejores islas de Guna Yala.";

  const featuredIslands = islands.slice(0, 4);
  const popular = [...packages]
    .sort((a, b) => Number(a.price) - Number(b.price))
    .slice(0, 3);

  const steps = [
    { title: "Elige tu isla", desc: "Te guiamos según tu estilo de viaje.", icon: Compass },
    { title: "Selecciona tu paquete", desc: "Estadía, pasadía o camping.", icon: Sparkles },
    { title: "Cotiza tu viaje", desc: "Respuesta rápida por WhatsApp.", icon: Heart },
    { title: "Vive la experiencia", desc: "Naturaleza y cultura Guna.", icon: Leaf },
  ];

  return (
    <>
      <HeroSection title={heroTitle} subtitle={heroSubtitle} />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-turquoise">
              Islas destacadas
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-brand-deep">
              Paraísos que enamoran
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Isla Naranjo Chico es nuestra insignia. También llevamos a Senidub,
              Pelícano, Pugsub, Diablo y las islas Perro.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/islas">Ver todas las islas</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredIslands.length === 0 ? (
            <p className="col-span-full text-sm text-slate-600">
              Configura Supabase y ejecuta el SQL inicial para ver islas.
            </p>
          ) : (
            featuredIslands.map((i) => <IslandCard key={i.id} island={i} />)
          )}
        </div>
      </section>

      <section className="bg-brand-pearl py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-turquoise">
                Paquetes populares
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-brand-deep">
                Precios transparentes, experiencia premium
              </h2>
              <p className="mt-2 max-w-2xl text-slate-600">
                Cotiza en minutos y recibe asistencia real de nuestro equipo.
              </p>
            </div>
            <Button asChild>
              <Link href="/paquetes">Explorar paquetes</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {popular.length === 0 ? (
              <p className="text-sm text-slate-600">Sin paquetes activos aún.</p>
            ) : (
              popular.map((p) => (
                <PackageCard key={p.id} pkg={p} settings={settings} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-extrabold text-brand-deep">
          ¿Por qué viajar con Nixon Tours?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Descubre las mejores islas de Guna Yala con una agencia local y
          familiar. Seguridad, cultura y atención personalizada en cada salida.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Shield,
              t: "Confianza y seguridad",
              d: "Operación cuidadosa, coordinación clara y respaldo local.",
            },
            {
              icon: Heart,
              t: "Atención familiar",
              d: "Te escuchamos y armamos tu salida con calidez profesional.",
            },
            {
              icon: Sparkles,
              t: "Experiencia auténtica",
              d: "Naturaleza, cultura Guna y playas de postal.",
            },
          ].map((item) => (
            <div
              key={item.t}
              className="rounded-2xl border border-brand-deep/10 bg-brand-soft/80 p-6 shadow-md shadow-brand-deep/5"
            >
              <item.icon className="h-8 w-8 text-brand-turquoise" />
              <h3 className="mt-4 font-display text-lg font-semibold text-brand-deep">
                {item.t}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-brand-deep/10 bg-brand-pearl py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-extrabold text-brand-deep">
            Tu viaje en 4 pasos
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {steps.map((s, idx) => (
              <div
                key={s.title}
                className="relative rounded-2xl border border-brand-deep/10 bg-brand-pearl p-5 shadow-sm"
              >
                <span className="font-display text-xs font-bold text-brand-sunset">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <s.icon className="mt-3 h-7 w-7 text-brand-aqua" />
                <h3 className="mt-3 font-display font-semibold text-brand-deep">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-extrabold text-brand-deep">
          Testimonios
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <TestimonialCard
            quote="Servicio impecable y playas increíbles. Nixon Tours cuidó cada detalle."
            author="María G."
            location="Ciudad de Panamá"
            delay={0}
          />
          <TestimonialCard
            quote="Llevamos a los niños sin estrés: coordinación clara y gente de confianza."
            author="Carlos & Ana"
            location="Colombia"
            delay={0.05}
          />
          <TestimonialCard
            quote="La estadía en Naranjo Chico superó expectativas. Volveremos seguro."
            author="Laura P."
            location="España"
            delay={0.1}
          />
        </div>
      </section>

      <section className="bg-brand-soft py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-brand-deep">
                Galería visual
              </h2>
              <p className="mt-2 text-slate-600">
                Un adelanto del color del Caribe panameño.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/galeria">Ver galería completa</Link>
            </Button>
          </div>
          <div className="mt-10">
            {islands.length === 0 ? (
              <p className="text-sm text-slate-600">Añade imágenes desde el admin.</p>
            ) : (
              <GalleryGrid islands={islands.slice(0, 3)} />
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-brand-deep/10 bg-gradient-to-br from-brand-deep via-[#173356] to-brand-deep py-20 text-brand-pearl">
        <div
          className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-brand-turquoise/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-brand-aqua/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr,auto] lg:items-center lg:gap-12">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-aqua">
                Nixon Premium Club
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Tu portal exclusivo para Guna Yala
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-pearl/80">
                Crea tu cuenta y accede a promociones anticipadas, prioridad en
                reservas, seguimiento de pagos y beneficios pensados para quienes
                vuelven al paraíso.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-brand-pearl/75">
                {[
                  "Historial de viajes y próximas salidas en un solo lugar",
                  "Abonos y comprobantes con seguimiento claro del saldo",
                  "Promociones y prioridad cuando confirmes Nixon Premium Club",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <Crown className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row xl:justify-end">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-brand-turquoise font-display font-bold text-brand-deep shadow-lg shadow-brand-deep/25 hover:bg-brand-pearl"
              >
                <Link href="/registro" className="inline-flex items-center gap-2">
                  Crear mi cuenta gratuita
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-2xl border-brand-pearl/40 bg-transparent font-display font-semibold text-brand-pearl hover:bg-white/10 hover:text-brand-pearl"
              >
                <Link href="/premium">Conocer planes Premium</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CTASection settings={settings} />
    </>
  );
}
