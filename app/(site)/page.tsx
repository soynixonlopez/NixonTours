import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Shield, Heart, Leaf, Compass } from "lucide-react";
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Islas destacadas
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0f172a]">
              Paraísos que enamoran
            </h2>
            <p className="mt-2 max-w-2xl text-[#475569]">
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

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
                Paquetes populares
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#0f172a]">
                Precios transparentes, experiencia premium
              </h2>
              <p className="mt-2 max-w-2xl text-[#475569]">
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
        <h2 className="text-center text-3xl font-extrabold text-[#0f172a]">
          ¿Por qué viajar con Nixon Tours?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[#475569]">
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
              className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm"
            >
              <item.icon className="h-8 w-8 text-cyan-500" />
              <h3 className="mt-4 text-lg font-semibold text-[#0f172a]">{item.t}</h3>
              <p className="mt-2 text-sm text-[#475569]">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold text-[#0f172a]">
            Tu viaje en 4 pasos
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {steps.map((s, idx) => (
              <div
                key={s.title}
                className="relative rounded-2xl border border-slate-200/80 p-5"
              >
                <span className="text-xs font-bold text-cyan-600">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <s.icon className="mt-3 h-7 w-7 text-[#8B5CF6]" />
                <h3 className="mt-3 font-semibold text-[#0f172a]">{s.title}</h3>
                <p className="mt-2 text-sm text-[#475569]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-extrabold text-[#0f172a]">
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

      <section className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-[#0f172a]">
                Galería visual
              </h2>
              <p className="mt-2 text-[#475569]">
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

      <CTASection settings={settings} />
    </>
  );
}
