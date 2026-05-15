"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
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
  QUOTE_PRICE_USD,
  calculateQuoteSummary,
  cabinTypeLabel,
  travelerTypeLabel,
  type QuoteBreakdown,
} from "@/lib/quote";
import {
  buildWhatsAppUrl,
  formatPricePAB,
  normalizeWhatsAppDigits,
  packageTypeLabel,
} from "@/lib/whatsapp";
import { QuotePrintDocument } from "@/components/quote/quote-print-document";
import type { IslandRow, PackageType, SiteSettingsRow } from "@/types/database";

/** RHF submits strings from inputs; coerce to number. Zod 4 `preprocess` confuses Resolver inference; use union + transform + pipe. */
function numericField(inner: z.ZodNumber) {
  return z
    .union([z.string(), z.number()])
    .transform((val): number =>
      typeof val === "number" && Number.isFinite(val) ? val : Number(String(val))
    )
    .pipe(inner);
}

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
  nights: numericField(z.number().int().min(1, "Mínimo 1 noche")),
  adults: numericField(z.number().min(1, "Mínimo 1 adulto")),
  children: numericField(z.number().min(0)),
  needs_transport: z.boolean(),
  include_comarcal_taxes: z.boolean(),
  comments: z.string().optional(),
});

type QuoteFormValues = z.output<typeof schema>;

type SubmittedQuote = {
  values: QuoteFormValues;
  islandName?: string;
  packageName?: string;
  breakdown: QuoteBreakdown;
};

function buildStoredComments(
  data: QuoteFormValues,
  breakdown: QuoteBreakdown,
  includeBreakdown: boolean
): string | null {
  const clientComment = data.comments?.trim();
  if (!includeBreakdown) return clientComment || null;
  const showNights =
    (data.package_type === "estadia" || data.package_type === "camping") && Boolean(data.cabin_type);

  const lines = [
    clientComment ? `Comentario cliente: ${clientComment}` : null,
    breakdown.lines.length > 0 ? "Detalle de cotización (USD):" : null,
    data.traveler_type ? `Tipo de cliente: ${travelerTypeLabel(data.traveler_type)}` : null,
    data.cabin_type ? `Tipo de cabaña: ${cabinTypeLabel(data.cabin_type)}` : null,
    data.package_type ? `Tipo base: ${packageTypeLabel(data.package_type)}` : null,
    data.travel_date ? `Fecha deseada: ${data.travel_date}` : null,
    showNights ? `Noches: ${data.nights}` : null,
    `Adultos: ${data.adults}`,
    `Niños: ${data.children}`,
    `Transporte 4x4 Cd. Panamá: ${data.needs_transport ? "Sí" : "No"}`,
    `Impuestos comarcales: ${data.include_comarcal_taxes ? "Sí (en total)" : "No incluidos"}`,
    ...breakdown.lines.map(
      (item) =>
        `[${item.tier === "principal" ? "P" : "O"}] ${item.label}: ${formatPricePAB(item.unitPrice)} × ${item.quantity} → ${formatPricePAB(item.subtotal)}`
    ),
    breakdown.lines.length > 0 ? `TOTAL: ${formatPricePAB(breakdown.grandTotal)} (principales + opcionales)` : null,
  ].filter(Boolean);

  return lines.length > 0 ? lines.join("\n") : null;
}

function buildWaMessage(
  data: QuoteFormValues,
  breakdown: QuoteBreakdown,
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

  const showNights =
    (data.package_type === "estadia" || data.package_type === "camping") && Boolean(data.cabin_type);
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
    `Transporte 4x4 Cd. Panamá: ${
      data.needs_transport
        ? `Incluido (${formatPricePAB(QUOTE_PRICE_USD.TRANSPORTE_4X4_CIUDAD_PANAMA_POR_PERSONA)} c/u)`
        : "No"
    }.`,
    data.include_comarcal_taxes
      ? `Impuestos comarcales: sí (según clasificación cliente).`
      : `Impuestos comarcales: no solicitados.`,
    breakdown.lines.length > 0 ? "Detalle cotización (referencial):" : null,
    ...breakdown.lines.map(
      (item) =>
        `- [${item.tier === "principal" ? "Incluye" : "Opcional"}] ${item.label}: ${formatPricePAB(item.unitPrice)} × ${item.quantity} → ${formatPricePAB(item.subtotal)}`
    ),
    breakdown.lines.length > 0 ? `TOTAL: ${formatPricePAB(breakdown.grandTotal)} USD.` : null,
    ...breakdown.notIncludedTexts.map((t) => `— ${t}`),
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

  const resolver = useMemo((): Resolver<QuoteFormValues> => {
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

        if (data.include_comarcal_taxes && !data.traveler_type) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Indica si sos nacional, residente o turista extranjero para cotizar impuestos comarcales.",
            path: ["traveler_type"],
          });
        }

        const needsCabin =
          effectivePackageType === "estadia" || effectivePackageType === "camping";

        if (needsCabin && !data.cabin_type) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecciona el tipo de cabaña",
            path: ["cabin_type"],
          });
        }
      })
    ) as Resolver<QuoteFormValues>;
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
      needs_transport: false,
      include_comarcal_taxes: false,
      comments: "",
    },
  });

  const islandId = watch("island_id");
  const packageType = watch("package_type") ?? defaultPackageType;
  const showStayFields =
    requireTripDetails && (packageType === "estadia" || packageType === "camping");
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
      const breakdown = calculateQuoteSummary({
        packageType: includeBreakdown ? values.package_type : undefined,
        adults: values.adults,
        children: values.children,
        nights: values.nights,
        cabinType: includeBreakdown ? values.cabin_type : undefined,
        travelerType: includeBreakdown ? values.traveler_type : undefined,
        include4x4: includeBreakdown ? values.needs_transport : false,
        includeComarcalTaxes: includeBreakdown ? values.include_comarcal_taxes : false,
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
        comments: buildStoredComments(values, breakdown, includeBreakdown),
        status: "nueva" as const,
        user_id: user?.id ?? null,
        affiliate_code: ref,
      };

      const { error } = await supabase.from("quotes").insert(payload);
      if (error) throw error;

      const url = buildWhatsAppUrl(
        normalizeWhatsAppDigits(phone),
        buildWaMessage(values, breakdown, includeBreakdown, selectedIsland?.name, packageName)
      );
      setWaUrl(url);
      setSubmittedBasic(!includeBreakdown);
      setSubmittedQuote(
        includeBreakdown
          ? {
              values,
              islandName: selectedIsland?.name,
              packageName,
              breakdown,
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
    const { breakdown, values } = submittedQuote;

    const absoluteLogoUrl =
      typeof window !== "undefined" && logo.startsWith("/") ? `${window.location.origin}${logo}` : logo;

    return (
      <div className="space-y-6">
        <p className="no-print rounded-2xl bg-brand-soft/80 px-4 py-3 text-sm text-brand-deep">
          Cotización registrada en Nixon Tours / Supabase.
          <span className="text-slate-600">
            {" "}
            Valores USD referenciales. Confirmación final contra disponibilidad operativa del día y logística marítima.
          </span>
        </p>
        <div className="quote-print-scope mx-auto max-w-4xl">
          <QuotePrintDocument
            logoSrc={absoluteLogoUrl}
            full_name={values.full_name}
            whatsapp={values.whatsapp}
            email={values.email}
            nationality={values.nationality ?? null}
            travelerType={values.traveler_type ?? null}
            islandName={submittedQuote.islandName ?? null}
            packageName={submittedQuote.packageName ?? null}
            packageType={values.package_type ?? null}
            travel_date={values.travel_date || null}
            nights={
              values.package_type === "estadia" || values.package_type === "camping"
                ? values.nights
                : null
            }
            adults={values.adults}
            children={values.children}
            cabinType={values.cabin_type ?? null}
            comments={values.comments ?? null}
            breakdown={breakdown}
          />
        </div>

        <div className="no-print mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-brand-deep/10 bg-brand-pearl/90 p-4 sm:flex-row">
          <Button asChild className="bg-brand-turquoise text-brand-pearl hover:bg-brand-deep">
            <Link href={waUrl} target="_blank" rel="noreferrer">
              Abrir WhatsApp con esta cotización
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-brand-deep text-brand-deep"
            onClick={() => window.print()}
          >
            Imprimir / guardar como PDF
          </Button>
          <Button
            type="button"
            variant="ghost"
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

        <div className="no-print mx-auto max-w-4xl rounded-xl border border-dashed border-brand-deep/20 bg-white/70 p-4 text-xs leading-relaxed text-slate-600">
          <p className="font-semibold text-brand-deep">Tarifas modelo (ajústalas en código si Nixon las actualiza)</p>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            <li>Estadía — cabaña privada baño común: {formatPricePAB(QUOTE_PRICE_USD.ESTADIA_CABINA_PRIVADA_BANYO_COMUN)} p.p. / noche</li>
            <li>Estadía — privada 2–3 camas / grupal: {formatPricePAB(QUOTE_PRICE_USD.ESTADIA_CABINA_PRIVADA_2_A_3_CAMAS)} p.p. / noche</li>
            <li>
              Lancha (estadía/camping): {formatPricePAB(QUOTE_PRICE_USD.LANCHA_POR_PERSONA)} total p.p. ida y
              vuelta
            </li>
            <li>
              Lancha y tour en estadía (referencia): +{formatPricePAB(QUOTE_PRICE_USD.LANCHA_POR_PERSONA + QUOTE_PRICE_USD.TOUR_DOS_ISLAS_Y_PISCINA_POR_PERSONA)} p.p.
              combinados modelo
            </li>
            <li>Pasadía modelo (suma tabla): desde {formatPricePAB(QUOTE_PRICE_USD.PASADIA_POR_PERSONA)} por persona</li>
            <li>Van 4×4 Cd. Panamá (opcional): {formatPricePAB(QUOTE_PRICE_USD.TRANSPORTE_4X4_CIUDAD_PANAMA_POR_PERSONA)} total p.p. ida y vuelta</li>
            <li>Impuesto comarcal modelo: nacional/residente {formatPricePAB(QUOTE_PRICE_USD.IMPUESTO_COMARCAL_NACIONAL_RESIDENTE)} • extranjero {formatPricePAB(QUOTE_PRICE_USD.IMPUESTO_COMARCAL_EXTRANJERO)} por persona cuando se marca opcional</li>
          </ul>
        </div>
      </div>
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
            <div>
              <p className="text-sm font-semibold text-brand-deep">Opcionales adicionales</p>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                En estadía y camping las comidas van incluidas en el tarifario del alojamiento. La lancha se cotiza como{" "}
                <span className="font-medium text-brand-deep">
                  USD {QUOTE_PRICE_USD.LANCHA_POR_PERSONA} total por persona (ida y vuelta)
                </span>
                ; el tour a dos islas + piscina natural es aparte por persona. En pasadía, el conjunto modelo suma{" "}
                <span className="font-medium text-brand-deep">
                  USD {QUOTE_PRICE_USD.PASADIA_POR_PERSONA} por persona
                </span>
                .
                Solo los ítems de abajo modifican totales cuando los marques.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="needs_transport"
                checked={watch("needs_transport")}
                onCheckedChange={(v) => setValue("needs_transport", Boolean(v))}
                className="mt-1"
              />
              <Label htmlFor="needs_transport" className="cursor-pointer leading-snug">
                Incluir transporte 4×4 desde Ciudad de Panamá al punto de encuentro/acuerdo Nixon Tours{" "}
                <span className="text-brand-deep font-semibold">
                  (+{formatPricePAB(QUOTE_PRICE_USD.TRANSPORTE_4X4_CIUDAD_PANAMA_POR_PERSONA)} por persona
                  ida y vuelta, modelo)
                </span>
              </Label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="include_comarcal_taxes"
                checked={watch("include_comarcal_taxes")}
                onCheckedChange={(v) =>
                  setValue("include_comarcal_taxes", Boolean(v))
                }
                className="mt-1"
              />
              <Label htmlFor="include_comarcal_taxes" className="cursor-pointer leading-snug">
                Sumar estimado de{" "}
                <span className="font-semibold text-brand-deep">
                  impuesto comarcal
                </span>{" "}
                según tu clasificación nacional / residente / extranjero (no incluido por defecto)
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
