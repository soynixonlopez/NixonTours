"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectNative } from "@/components/ui/select-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CABIN_TYPE_OPTIONS,
  TRAVELER_TYPE_OPTIONS,
  WORLD_COUNTRIES,
  calculateQuoteSummary,
  cabinTypeLabel,
  travelerTypeLabel,
  type QuoteSummary,
} from "@/lib/quote";
import {
  buildWhatsAppUrl,
  formatPricePAB,
  normalizeWhatsAppDigits,
  packageTypeLabel,
} from "@/lib/whatsapp";
import type { IslandRow, PackageType, SiteSettingsRow } from "@/types/database";

const schema = z.object({
  full_name: z.string().min(2, "Indica tu nombre"),
  whatsapp: z.string().min(6, "WhatsApp inválido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  nationality: z.string().optional(),
  traveler_type: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    z.enum(["nacional", "residente", "extranjero"]).optional()
  ),
  island_id: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    z.string().optional()
  ),
  package_id: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    z.string().optional()
  ),
  package_type: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    z.enum(["estadia", "pasadia", "camping"]).optional()
  ),
  cabin_type: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    z.enum(["shared", "private", "group"]).optional()
  ),
  travel_date: z.string().optional(),
  nights: z.coerce.number().int().min(1, "Mínimo 1 noche"),
  adults: z.coerce.number().min(1, "Mínimo 1 adulto"),
  children: z.coerce.number().min(0),
  include_tour: z.boolean(),
  include_boat: z.boolean(),
  needs_transport: z.boolean(),
  include_comarcal_taxes: z.boolean(),
  comments: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof schema>;

type SubmittedQuote = {
  values: QuoteFormValues;
  islandName?: string;
  packageName?: string;
  summary: QuoteSummary;
};

function buildStoredComments(
  data: QuoteFormValues,
  summary: QuoteSummary,
  includeBreakdown: boolean
): string | null {
  const clientComment = data.comments?.trim();
  if (!includeBreakdown) return clientComment || null;
  const showNights = data.package_type === "estadia" && Boolean(data.cabin_type);

  const lines = [
    clientComment ? `Comentario cliente: ${clientComment}` : null,
    summary.items.length > 0 ? "Detalle de cotización:" : null,
    data.traveler_type ? `Tipo de cliente: ${travelerTypeLabel(data.traveler_type)}` : null,
    data.cabin_type ? `Tipo de cabaña: ${cabinTypeLabel(data.cabin_type)}` : null,
    data.package_type ? `Tipo base: ${packageTypeLabel(data.package_type)}` : null,
    data.travel_date ? `Fecha deseada: ${data.travel_date}` : null,
    showNights ? `Noches: ${data.nights}` : null,
    `Adultos: ${data.adults}`,
    `Niños: ${data.children}`,
    `Tour incluido: ${data.include_tour ? "Sí" : "No"}`,
    `Lancha incluida: ${data.include_boat ? "Sí" : "No"}`,
    `Carro incluido: ${data.needs_transport ? "Sí" : "No"}`,
    `Impuestos comarcales: ${data.include_comarcal_taxes ? "Sí" : "No"}`,
    ...summary.items.map(
      (item) => `${item.label}: ${formatPricePAB(item.unitPrice)} x ${item.quantity} = ${formatPricePAB(item.subtotal)}`
    ),
    summary.items.length > 0 ? `Total estimado: ${formatPricePAB(summary.total)}` : null,
  ].filter(Boolean);

  return lines.length > 0 ? lines.join("\n") : null;
}

function buildWaMessage(
  data: QuoteFormValues,
  summary: QuoteSummary,
  includeBreakdown: boolean,
  islandName?: string,
  packageName?: string
) {
  if (!includeBreakdown) {
    return [
      "Hola Nixon Tours,",
      `Soy ${data.full_name}.`,
      data.travel_date ? `Fecha deseada: ${data.travel_date}.` : null,
      `Adultos: ${data.adults}, Niños: ${data.children}.`,
      data.comments?.trim() ? `Comentarios: ${data.comments.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }

  const showNights = data.package_type === "estadia" && Boolean(data.cabin_type);
  const lines = [
    "Hola Nixon Tours,",
    `Soy ${data.full_name}.`,
    islandName ? `Isla: ${islandName}.` : null,
    packageName ? `Paquete: ${packageName}.` : null,
    data.package_type ? `Tipo base: ${packageTypeLabel(data.package_type)}.` : null,
    data.nationality ? `Nacionalidad: ${data.nationality}.` : null,
    data.traveler_type ? `Cliente: ${travelerTypeLabel(data.traveler_type)}.` : null,
    data.cabin_type ? `Cabaña: ${cabinTypeLabel(data.cabin_type)}.` : null,
    data.travel_date ? `Fecha deseada: ${data.travel_date}.` : null,
    showNights ? `Noches: ${data.nights}.` : null,
    `Adultos: ${data.adults}, Niños: ${data.children}.`,
    `Tour: ${data.include_tour ? "Sí" : "No"}.`,
    `Lancha: ${data.include_boat ? "Sí" : "No"}.`,
    `Carro: ${data.needs_transport ? "Sí" : "No"}.`,
    `Impuestos comarcales: ${data.include_comarcal_taxes ? "Sí" : "No"}.`,
    summary.items.length > 0 ? "Detalle estimado:" : null,
    ...summary.items.map(
      (item) =>
        `- ${item.label}: ${formatPricePAB(item.unitPrice)} x ${item.quantity} = ${formatPricePAB(item.subtotal)}`
    ),
    summary.items.length > 0 ? `Total estimado: ${formatPricePAB(summary.total)}.` : null,
    data.comments?.trim() ? `Comentarios: ${data.comments.trim()}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export function QuoteForm({
  islands,
  settings,
  requireTripDetails = true,
  defaultIslandId,
  defaultPackageId,
  defaultPackageType,
  packageName,
  affiliateCode = null,
}: {
  islands: IslandRow[];
  settings: SiteSettingsRow | null;
  requireTripDetails?: boolean;
  defaultIslandId?: string;
  defaultPackageId?: string;
  defaultPackageType?: PackageType;
  packageName?: string;
  affiliateCode?: string | null;
}) {
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [submittedQuote, setSubmittedQuote] = useState<SubmittedQuote | null>(null);
  const [submittedBasic, setSubmittedBasic] = useState(false);
  const phone = settings?.whatsapp ?? "+50768252312";
  const logo = settings?.logo_url ?? "/img/logo.png";

  const resolver = useMemo(() => {
    return zodResolver(
      schema.superRefine((data, ctx) => {
        if (!requireTripDetails) return;

        const effectivePackageType = data.package_type ?? defaultPackageType;

        if (!data.nationality) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecciona la nacionalidad",
            path: ["nationality"],
          });
        }

        if (!data.traveler_type) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecciona si es nacional, residente o turista extranjero",
            path: ["traveler_type"],
          });
        }

        if (!data.island_id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecciona una isla",
            path: ["island_id"],
          });
        }

        if (!effectivePackageType) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecciona el tipo de paquete",
            path: ["package_type"],
          });
        }

        if (effectivePackageType === "estadia" && !data.cabin_type) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecciona el tipo de cabaña",
            path: ["cabin_type"],
          });
        }
      })
    );
  }, [defaultPackageType, requireTripDetails]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver,
    defaultValues: {
      full_name: "",
      whatsapp: "",
      email: "",
      nationality: "",
      traveler_type: undefined,
      island_id: defaultIslandId ?? "",
      package_id: defaultPackageId ?? "",
      package_type: defaultPackageType,
      cabin_type: undefined,
      travel_date: "",
      nights: 1,
      adults: 2,
      children: 0,
      include_tour: requireTripDetails,
      include_boat: requireTripDetails,
      needs_transport: false,
      include_comarcal_taxes: false,
      comments: "",
    },
  });

  const islandId = watch("island_id");
  const packageType = watch("package_type") ?? defaultPackageType;
  const showStayFields = requireTripDetails && packageType === "estadia";
  const orderedIslands = useMemo(() => {
    return [...islands].sort((a, b) => {
      if (a.name === "Isla Naranjo Chico") return -1;
      if (b.name === "Isla Naranjo Chico") return 1;
      return a.name.localeCompare(b.name, "es");
    });
  }, [islands]);
  const selectedIsland = orderedIslands.find((island) => island.id === islandId);

  async function onSubmit(values: QuoteFormValues) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const rawRef = affiliateCode?.trim().toUpperCase() ?? "";
      const ref =
        rawRef.length > 0 && /^[A-Z0-9_-]{4,24}$/.test(rawRef) ? rawRef : null;
      const includeBreakdown = requireTripDetails;
      const summary = calculateQuoteSummary({
        packageType: includeBreakdown ? values.package_type : undefined,
        adults: values.adults,
        children: values.children,
        nights: values.nights,
        cabinType: includeBreakdown ? values.cabin_type : undefined,
        travelerType: includeBreakdown ? values.traveler_type : undefined,
        includeTour: includeBreakdown ? values.include_tour : false,
        includeBoat: includeBreakdown ? values.include_boat : false,
        includeCar: includeBreakdown ? values.needs_transport : false,
        includeTaxes: includeBreakdown ? values.include_comarcal_taxes : false,
      });
      const payload = {
        full_name: values.full_name.trim(),
        whatsapp: values.whatsapp.trim(),
        email: values.email?.trim() || null,
        nationality: values.nationality?.trim() || null,
        island_id: values.island_id?.trim() || null,
        package_id: values.package_id?.trim() || null,
        package_type: values.package_type ?? null,
        travel_date: values.travel_date?.trim() || null,
        adults: values.adults,
        children: values.children,
        needs_transport: values.needs_transport,
        comments: buildStoredComments(values, summary, includeBreakdown),
        status: "nueva" as const,
        user_id: user?.id ?? null,
        affiliate_code: ref,
      };

      const { error } = await supabase.from("quotes").insert(payload);
      if (error) throw error;

      const url = buildWhatsAppUrl(
        normalizeWhatsAppDigits(phone),
        buildWaMessage(values, summary, includeBreakdown, selectedIsland?.name, packageName)
      );
      setWaUrl(url);
      setSubmittedBasic(!includeBreakdown);
      setSubmittedQuote(
        includeBreakdown
          ? {
              values,
              islandName: selectedIsland?.name,
              packageName,
              summary,
            }
          : null
      );
      toast.success("Cotización generada y enviada.");
    } catch (e) {
      console.error(e);
      toast.error(
        "No se pudo enviar. Verifica tu conexión o la configuración de Supabase."
      );
    }
  }

  if (submittedBasic && waUrl) {
    return (
      <Card className="border-brand-turquoise/25 bg-gradient-to-br from-brand-soft via-brand-pearl to-brand-sand/30">
        <CardHeader>
          <CardTitle className="text-brand-deep">¡Listo!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-brand-deep/90">
          <p>Tu solicitud fue registrada. Puedes continuar la conversación por WhatsApp.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              asChild
              className="bg-brand-turquoise text-brand-pearl hover:bg-brand-deep"
            >
              <Link href={waUrl} target="_blank" rel="noreferrer">
                Abrir WhatsApp con mi mensaje
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/paquetes">Ver más paquetes</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (submittedQuote && waUrl) {
    const { summary, values } = submittedQuote;

    return (
      <Card className="border-brand-turquoise/25 bg-gradient-to-br from-brand-soft via-brand-pearl to-brand-sand/30">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-brand-deep">Cotización generada</CardTitle>
              <p className="mt-2 text-sm text-brand-deep/75">
                Estimado referencial sujeto a disponibilidad y confirmación final de Nixon Tours.
              </p>
            </div>
            <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm">
              <Image
                src={logo}
                alt="Nixon Tours"
                width={180}
                height={56}
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-brand-deep/90">
          <div className="grid gap-3 rounded-3xl border border-brand-deep/10 bg-white/80 p-4 sm:grid-cols-2">
            <p>
              <span className="text-slate-500">Cliente:</span> {values.full_name}
            </p>
            <p>
              <span className="text-slate-500">WhatsApp:</span> {values.whatsapp}
            </p>
            <p>
              <span className="text-slate-500">Isla:</span> {submittedQuote.islandName ?? "—"}
            </p>
            <p>
              <span className="text-slate-500">Fecha:</span> {values.travel_date || "Por definir"}
            </p>
            <p>
              <span className="text-slate-500">Nacionalidad:</span>{" "}
              {values.nationality || "No indicada"}
            </p>
            <p>
              <span className="text-slate-500">Tipo de cliente:</span>{" "}
              {values.traveler_type ? travelerTypeLabel(values.traveler_type) : "—"}
            </p>
            {values.cabin_type ? (
              <p>
                <span className="text-slate-500">Cabaña:</span>{" "}
                {cabinTypeLabel(values.cabin_type)}
              </p>
            ) : null}
            <p>
              <span className="text-slate-500">Viajeros:</span> {summary.travelers} persona(s)
            </p>
            {submittedQuote.packageName ? (
              <p className="sm:col-span-2">
                <span className="text-slate-500">Paquete:</span> {submittedQuote.packageName}
              </p>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-3xl border border-brand-deep/10 bg-white/90">
            <div className="grid grid-cols-[1.5fr,0.7fr,0.7fr,0.8fr] gap-3 border-b border-brand-deep/10 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Concepto</span>
              <span>Precio</span>
              <span>Cantidad</span>
              <span>Subtotal</span>
            </div>
            <div className="space-y-0">
              {summary.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1.5fr,0.7fr,0.7fr,0.8fr] gap-3 border-b border-brand-deep/5 px-4 py-4 last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-brand-deep">{item.label}</p>
                    {item.detail ? (
                      <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                    ) : null}
                  </div>
                  <span>{formatPricePAB(item.unitPrice)}</span>
                  <span>{item.quantity}</span>
                  <span className="font-semibold">{formatPricePAB(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between bg-brand-deep px-4 py-4 text-brand-pearl">
              <span className="text-sm font-semibold">Total estimado</span>
              <span className="text-lg font-extrabold">{formatPricePAB(summary.total)}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-brand-deep/10 bg-white/80 p-4 text-sm text-slate-600">
            <p>Tarifas usadas en esta cotización:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Cabaña compartida 2 a 3 camas: $35 por persona por noche, incluye 3 platos.</li>
              <li>Cabaña privada 1 cama: $45 por persona por noche, baño compartido.</li>
              <li>Grupal 7 camas: $35 por persona por noche.</li>
              <li>Tour: $25 por persona.</li>
              <li>Lancha: $25 por persona.</li>
              <li>Carro: $50 por persona.</li>
              <li>Impuestos comarcales: $7 nacionales/residentes, $22 turistas extranjeros.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              asChild
              className="bg-brand-turquoise text-brand-pearl hover:bg-brand-deep"
            >
              <Link href={waUrl} target="_blank" rel="noreferrer">
                Abrir WhatsApp con mi cotización
              </Link>
            </Button>
            <Button type="button" variant="outline" onClick={() => window.print()}>
              Imprimir cotización
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSubmittedQuote(null);
                setSubmittedBasic(false);
                setWaUrl(null);
                reset();
              }}
            >
              Nueva cotización
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((vals) => void onSubmit(vals))}
      className="space-y-6"
    >
      {defaultPackageId ? <input type="hidden" {...register("package_id")} /> : null}
      {defaultPackageType ? <input type="hidden" {...register("package_type")} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="full_name">Nombre completo *</Label>
          <Input id="full_name" {...register("full_name")} />
          {errors.full_name && (
            <p className="text-sm text-red-600">{errors.full_name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp *</Label>
          <Input id="whatsapp" placeholder="+507 6000-0000" {...register("whatsapp")} />
          {errors.whatsapp && (
            <p className="text-sm text-red-600">{errors.whatsapp.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        {requireTripDetails ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nacionalidad *</Label>
              <SelectNative id="nationality" {...register("nationality")}>
                <option value="">Selecciona tu país</option>
                {WORLD_COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </SelectNative>
              {errors.nationality && (
                <p className="text-sm text-red-600">{errors.nationality.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="traveler_type">Tipo de cliente *</Label>
              <SelectNative id="traveler_type" {...register("traveler_type")}>
                <option value="">Selecciona</option>
                {TRAVELER_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectNative>
              {errors.traveler_type && (
                <p className="text-sm text-red-600">{errors.traveler_type.message}</p>
              )}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="island_id">Isla de interés *</Label>
              <SelectNative id="island_id" {...register("island_id")}>
                <option value="">Selecciona una isla</option>
                {orderedIslands.map((island) => (
                  <option key={island.id} value={island.id}>
                    {island.name}
                  </option>
                ))}
              </SelectNative>
              {errors.island_id && (
                <p className="text-sm text-red-600">{errors.island_id.message}</p>
              )}
            </div>

            {!defaultPackageType ? (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="package_type">Tipo de paquete *</Label>
                <SelectNative id="package_type" {...register("package_type")}>
                  <option value="">Selecciona</option>
                  <option value="estadia">Estadía</option>
                  <option value="pasadia">Pasadía</option>
                  <option value="camping">Camping</option>
                </SelectNative>
                {errors.package_type && (
                  <p className="text-sm text-red-600">{errors.package_type.message}</p>
                )}
              </div>
            ) : null}

            {showStayFields ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cabin_type">Tipo de cabaña *</Label>
                  <SelectNative id="cabin_type" {...register("cabin_type")}>
                    <option value="">Selecciona</option>
                    {CABIN_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </SelectNative>
                  {errors.cabin_type && (
                    <p className="text-sm text-red-600">{errors.cabin_type.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nights">Noches *</Label>
                  <Input id="nights" type="number" min={1} {...register("nights")} />
                  {errors.nights && (
                    <p className="text-sm text-red-600">{errors.nights.message}</p>
                  )}
                </div>
              </>
            ) : null}
          </>
        ) : null}

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="travel_date">Fecha deseada del viaje</Label>
          <Input id="travel_date" type="date" {...register("travel_date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="adults">Adultos *</Label>
          <Input id="adults" type="number" min={1} {...register("adults")} />
          {errors.adults && (
            <p className="text-sm text-red-600">{errors.adults.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="children">Niños</Label>
          <Input id="children" type="number" min={0} {...register("children")} />
        </div>

        {requireTripDetails ? (
          <div className="space-y-3 rounded-3xl border border-brand-deep/10 bg-brand-soft/50 p-4 sm:col-span-2">
            <p className="text-sm font-semibold text-brand-deep">Extras para la cotización</p>
            <div className="flex items-center gap-3">
              <Checkbox
                id="include_tour"
                checked={watch("include_tour")}
                onCheckedChange={(v) => setValue("include_tour", Boolean(v))}
              />
              <Label htmlFor="include_tour" className="cursor-pointer">
                Incluir tour ($25 por persona)
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="include_boat"
                checked={watch("include_boat")}
                onCheckedChange={(v) => setValue("include_boat", Boolean(v))}
              />
              <Label htmlFor="include_boat" className="cursor-pointer">
                Incluir lancha ($25 por persona)
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="needs_transport"
                checked={watch("needs_transport")}
                onCheckedChange={(v) => setValue("needs_transport", Boolean(v))}
              />
              <Label htmlFor="needs_transport" className="cursor-pointer">
                Incluir carro ($50 por persona)
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="include_comarcal_taxes"
                checked={watch("include_comarcal_taxes")}
                onCheckedChange={(v) =>
                  setValue("include_comarcal_taxes", Boolean(v))
                }
              />
              <Label htmlFor="include_comarcal_taxes" className="cursor-pointer">
                Incluir pago de impuestos comarcales
              </Label>
            </div>
          </div>
        ) : null}

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="comments">Comentarios adicionales</Label>
          <Textarea id="comments" {...register("comments")} />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando…
          </>
        ) : (
          "Enviar cotización"
        )}
      </Button>
    </form>
  );
}
