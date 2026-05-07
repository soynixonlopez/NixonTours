"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import { buildWhatsAppUrl, normalizeWhatsAppDigits, packageTypeLabel } from "@/lib/whatsapp";
import type { IslandRow, PackageType } from "@/types/database";
import type { SiteSettingsRow } from "@/types/database";

const schema = z.object({
  full_name: z.string().min(2, "Indica tu nombre"),
  whatsapp: z.string().min(6, "WhatsApp inválido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  nationality: z.string().optional(),
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
  travel_date: z.string().optional(),
  adults: z.coerce.number().min(1, "Mínimo 1 adulto"),
  children: z.coerce.number().min(0),
  needs_transport: z.boolean(),
  comments: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof schema>;

function buildWaMessage(
  data: QuoteFormValues,
  islandName?: string,
  packageName?: string
) {
  const lines = [
    `Hola Nixon Tours,`,
    `Soy ${data.full_name}.`,
    islandName ? `Isla: ${islandName}.` : null,
    data.package_type
      ? `Tipo: ${packageTypeLabel(data.package_type)}.`
      : null,
    packageName ? `Paquete: ${packageName}.` : null,
    data.travel_date ? `Fecha deseada: ${data.travel_date}.` : null,
    `Adultos: ${data.adults}, Niños: ${data.children}.`,
    `Transporte: ${data.needs_transport ? "Sí" : "No"}.`,
    data.comments ? `Comentarios: ${data.comments}` : null,
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
}: {
  islands: IslandRow[];
  settings: SiteSettingsRow | null;
  requireTripDetails?: boolean;
  defaultIslandId?: string;
  defaultPackageId?: string;
  defaultPackageType?: PackageType;
  packageName?: string;
}) {
  const [done, setDone] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const phone = settings?.whatsapp ?? "+50768252312";

  const resolver = useMemo(() => {
    return zodResolver(
      schema.superRefine((data, ctx) => {
        if (!requireTripDetails) return;
        if (!data.island_id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecciona una isla",
            path: ["island_id"],
          });
        }
        if (!data.package_type) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecciona el tipo de paquete",
            path: ["package_type"],
          });
        }
      })
    );
  }, [requireTripDetails]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver,
    defaultValues: {
      full_name: "",
      whatsapp: "",
      email: "",
      nationality: "",
      island_id: defaultIslandId ?? "",
      package_id: defaultPackageId ?? "",
      package_type: defaultPackageType,
      travel_date: "",
      adults: 2,
      children: 0,
      needs_transport: false,
      comments: "",
    },
  });

  const islandId = watch("island_id");
  const selectedIsland = islands.find((i) => i.id === islandId);

  async function onSubmit(values: QuoteFormValues) {
    try {
      const supabase = createClient();
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
        comments: values.comments?.trim() || null,
        status: "nueva" as const,
      };

      const { error } = await supabase.from("quotes").insert(payload);
      if (error) throw error;

      const url = buildWhatsAppUrl(
        normalizeWhatsAppDigits(phone),
        buildWaMessage(values, selectedIsland?.name, packageName)
      );
      setWaUrl(url);
      setDone(true);
      toast.success("Cotización enviada. Te contactamos pronto.");
    } catch (e) {
      console.error(e);
      toast.error(
        "No se pudo enviar. Verifica tu conexión o la configuración de Supabase."
      );
    }
  }

  if (done && waUrl) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/40">
        <CardHeader>
          <CardTitle className="text-emerald-900">¡Listo!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-emerald-950/90">
          <p>Tu solicitud fue registrada. Puedes continuar la conversación por WhatsApp.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="bg-[#10B981] hover:bg-[#0ea271]">
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

  return (
    <form
      onSubmit={handleSubmit((vals) =>
        void onSubmit(vals as QuoteFormValues)
      )}
      className="space-y-6"
    >
      {defaultPackageId ? (
        <input type="hidden" {...register("package_id")} />
      ) : null}
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
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="nationality">Nacionalidad</Label>
          <Input id="nationality" {...register("nationality")} />
        </div>

        {requireTripDetails && (
          <>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="island_id">Isla de interés *</Label>
              <SelectNative id="island_id" {...register("island_id")}>
                <option value="">Selecciona una isla</option>
                {islands.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </SelectNative>
              {errors.island_id && (
                <p className="text-sm text-red-600">{errors.island_id.message}</p>
              )}
            </div>
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
          </>
        )}

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

        <div className="flex items-center gap-3 sm:col-span-2">
          <Checkbox
            id="needs_transport"
            checked={watch("needs_transport")}
            onCheckedChange={(v) => setValue("needs_transport", Boolean(v))}
          />
          <Label htmlFor="needs_transport" className="cursor-pointer">
            ¿Necesitas transporte terrestre/marítimo coordinado?
          </Label>
        </div>

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
