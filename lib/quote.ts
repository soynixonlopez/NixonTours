import countries from "i18n-iso-countries";
import esLocale from "i18n-iso-countries/langs/es.json";
import type { PackageType } from "@/types/database";

countries.registerLocale(esLocale);

export type TravelerType = "nacional" | "residente" | "extranjero";
export type CabinType = "shared" | "private" | "group";

/** Nixon Tours — valores referenciales ajustables (contacto puede actualizar tasas aquí). */
export const QUOTE_PRICE_USD = {
  ESTADIA_CABINA_PRIVADA_BANYO_COMUN: 45,
  ESTADIA_CABINA_PRIVADA_2_A_3_CAMAS: 35,
  ESTADIA_CABINA_GRUPAL_6_7_CAMAS: 35,
  /** Lancha: total USD por persona, ida y vuelta (un solo cargo modelo). */
  LANCHA_POR_PERSONA: 25,
  TOUR_DOS_ISLAS_Y_PISCINA_POR_PERSONA: 25,
  PASADIA_POR_PERSONA: 100,
  /** Opcional: Van 4×4 Ciudad de Panamá — USD total por persona, ida y vuelta. */
  TRANSPORTE_4X4_CIUDAD_PANAMA_POR_PERSONA: 50,
  /** Opcional: Impuesto territorio comarcal por persona por tipo de visitante */
  IMPUESTO_COMARCAL_NACIONAL_RESIDENTE: 7,
  IMPUESTO_COMARCAL_EXTRANJERO: 22,
  /** Benchmark comercial comunicado cuando el cliente toma estadía estándar incluyendo todos los ítems base (referencia marketing; el total viene de la tabla). */
  REFERENCIA_ESTADIA_POR_PERSONA: 145,
} as const;

export const QUOTE_CONTACT = {
  company: "Nixon Tours",
  tagline: "Experience Guna Yala",
  web: "www.nixontours.com",
  whatsapp: "+507 6825-2312",
  instagram: "@nixontours",
};

export const QUOTE_DOCUMENT_NOTES_ES: string[] = [
  "Las islas a visitar pueden variar según disponibilidad, clima u operación logística del día.",
  "El tour regular incluye visita a dos islas y piscina natural.",
  "Si el cliente solicita una isla específica puede aplicar un costo adicional según la distancia y logística.",
  "El impuesto comarcal no está incluido en el total principal, salvo que se haya marcado como opcional en esta cotización.",
  "La reserva queda confirmada según disponibilidad y los términos acordados con Nixon Tours.",
];

export type QuoteLineItem = {
  id: string;
  /** principal u opcional; para tabla y orden */
  tier: "principal" | "opcional";
  label: string;
  detail?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type QuoteBreakdown = {
  travelers: number;
  nights: number;
  packageType?: PackageType;
  lines: QuoteLineItem[];
  principalSubtotal: number;
  optionalSubtotal: number;
  grandTotal: number;
  /** Textos cuando no se marca 4x4 o impuesto comarcal */
  notIncludedTexts: string[];
  /** Leyendas referenciales (145 estadía / 100 pasadía) */
  referenceFootnotes: string[];
};

type QuoteBreakdownInput = {
  packageType?: PackageType;
  adults: number;
  children: number;
  nights: number;
  cabinType?: CabinType;
  travelerType?: TravelerType;
  include4x4: boolean;
  includeComarcalTaxes: boolean;
};

const CABIN_RATE: Record<CabinType, number> = {
  shared: QUOTE_PRICE_USD.ESTADIA_CABINA_PRIVADA_2_A_3_CAMAS,
  private: QUOTE_PRICE_USD.ESTADIA_CABINA_PRIVADA_BANYO_COMUN,
  group: QUOTE_PRICE_USD.ESTADIA_CABINA_GRUPAL_6_7_CAMAS,
};

const countryNamesEs = countries.getNames("es", {
  select: "official",
}) as Record<string, string>;

export const WORLD_COUNTRIES: string[] = Object.values(countryNamesEs).sort((a, b) =>
  a.localeCompare(b, "es")
);

export const TRAVELER_TYPE_OPTIONS: Array<{ value: TravelerType; label: string }> = [
  { value: "nacional", label: "Nacional" },
  { value: "residente", label: "Residente" },
  { value: "extranjero", label: "Turista extranjero" },
];

export const CABIN_TYPE_OPTIONS: Array<{ value: CabinType; label: string }> = [
  {
    value: "private",
    label: `Cabaña privada · baño compartido (${QUOTE_PRICE_USD.ESTADIA_CABINA_PRIVADA_BANYO_COMUN} USD p.p. / noche, comidas incluidas)`,
  },
  {
    value: "shared",
    label: `Cabaña privada 2–3 camas (${QUOTE_PRICE_USD.ESTADIA_CABINA_PRIVADA_2_A_3_CAMAS} USD p.p. / noche, comidas incluidas)`,
  },
  {
    value: "group",
    label: `Cabaña grupal/compartida 6–7 camas (${QUOTE_PRICE_USD.ESTADIA_CABINA_GRUPAL_6_7_CAMAS} USD p.p. / noche, comidas incluidas)`,
  },
];

export function travelerTypeLabel(value: TravelerType): string {
  return TRAVELER_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function cabinTypeLabel(value: CabinType): string {
  switch (value) {
    case "private":
      return "Cabaña privada · baño compartido";
    case "shared":
      return "Cabaña privada 2–3 camas";
    case "group":
      return "Cabaña grupal 6–7 camas";
    default:
      return value;
  }
}

export function cabinTypeDetail(value: CabinType): string {
  switch (value) {
    case "shared":
      return `USD ${QUOTE_PRICE_USD.ESTADIA_CABINA_PRIVADA_2_A_3_CAMAS} por persona por noche`;
    case "private":
      return `USD ${QUOTE_PRICE_USD.ESTADIA_CABINA_PRIVADA_BANYO_COMUN} por persona por noche (baño compartido)`;
    case "group":
      return `USD ${QUOTE_PRICE_USD.ESTADIA_CABINA_GRUPAL_6_7_CAMAS} por persona por noche`;
    default:
      return "";
  }
}

function comarcalRate(type: TravelerType): number {
  switch (type) {
    case "extranjero":
      return QUOTE_PRICE_USD.IMPUESTO_COMARCAL_EXTRANJERO;
    default:
      return QUOTE_PRICE_USD.IMPUESTO_COMARCAL_NACIONAL_RESIDENTE;
  }
}

function buildPasadiaLines(travelers: number): QuoteLineItem[] {
  /** Desglose didáctico que suma 100 USD por persona (referencia marca). */
  const parts = [
    {
      id: "pasadia-boat",
      label: "Traslado en lancha",
      detail: "Transporte marítimo del día · ida y vuelta modelo (cargo total por persona).",
      unit: 25,
    },
    {
      id: "pasadia-tour",
      label: "Tour a dos islas + piscina natural",
      unit: 25,
    },
    {
      id: "pasadia-lunch",
      label: "Almuerzo incluido",
      unit: 25,
    },
    {
      id: "pasadia-beaches",
      label: "Acceso y disfrute de playas del área.",
      detail: "Derechos de día en zonas establecidas",
      unit: 25,
    },
  ];
  return parts.map((p) => ({
    id: p.id,
    tier: "principal" as const,
    label: p.label,
    detail: p.detail,
    unitPrice: p.unit,
    quantity: travelers,
    subtotal: p.unit * travelers,
  }));
}

function buildStayLikeLines(
  input: QuoteBreakdownInput,
  travelers: number,
  nights: number,
  pkgLabel: string
): QuoteLineItem[] {
  const lines: QuoteLineItem[] = [];
  if (!input.cabinType) return lines;

  lines.push({
    id: `lodging-${input.cabinType}`,
    tier: "principal",
    label: `Alojamiento (${pkgLabel}) — ${cabinTypeLabel(input.cabinType)}`,
    detail: `${cabinTypeDetail(input.cabinType)} · Comidas incluidas en el alojamiento.`,
    unitPrice: CABIN_RATE[input.cabinType],
    quantity: travelers * nights,
    subtotal: CABIN_RATE[input.cabinType] * travelers * nights,
  });

  lines.push({
    id: "boat",
    tier: "principal",
    label: "Transporte marítimo (lancha)",
    detail: `USD ${QUOTE_PRICE_USD.LANCHA_POR_PERSONA} total por persona, ida y vuelta (un solo cargo modelo).`,
    unitPrice: QUOTE_PRICE_USD.LANCHA_POR_PERSONA,
    quantity: travelers,
    subtotal: QUOTE_PRICE_USD.LANCHA_POR_PERSONA * travelers,
  });

  lines.push({
    id: "tour",
    tier: "principal",
    label: "Tour a dos islas + piscina natural",
    unitPrice: QUOTE_PRICE_USD.TOUR_DOS_ISLAS_Y_PISCINA_POR_PERSONA,
    quantity: travelers,
    subtotal: QUOTE_PRICE_USD.TOUR_DOS_ISLAS_Y_PISCINA_POR_PERSONA * travelers,
  });

  return lines;
}

/** Cálculo unificado Nixon Tours — principales / opcionales separados por `tier`. */
export function calculateQuoteSummary(input: QuoteBreakdownInput): QuoteBreakdown {
  const travelers = Math.max(input.adults + input.children, 1);
  const nights = Math.max(input.nights || 1, 1);
  const pkg = input.packageType;
  const lines: QuoteLineItem[] = [];
  const notIncludedTexts: string[] = [];
  const referenceFootnotes: string[] = [];

  if (pkg === "pasadia") {
    lines.push(...buildPasadiaLines(travelers));
    referenceFootnotes.push(
      `Referencia marca: pasadía Guna Yala con servicios principales — USD ${QUOTE_PRICE_USD.PASADIA_POR_PERSONA.toFixed(0)} por persona + opcionales marcados más abajo.`
    );
  } else if (pkg === "estadia" || pkg === "camping") {
    const pkgLabel = pkg === "camping" ? "Camping / estadía territorial" : "Estadía Guna Yala";
    lines.push(...buildStayLikeLines(input, travelers, nights, pkgLabel));
    referenceFootnotes.push(
      `Montos orientativos cuando se incluye cabaña (tarifa en la que ya van las comidas), lancha ida/vuelta, tour modelo — cercano a USD ${QUOTE_PRICE_USD.REFERENCIA_ESTADIA_POR_PERSONA.toFixed(
        0
      )} p.p. si no marca opcionales fuera del bloque. Impuesto comarcal aparte si no lo selecciona.`
    );
  }

  const principalLines = lines.filter((l) => l.tier === "principal");

  if (input.include4x4) {
    lines.push({
      id: "opt-4x4",
      tier: "opcional",
      label: "Transporte 4x4 (van) desde Ciudad de Panamá",
      detail: `USD ${QUOTE_PRICE_USD.TRANSPORTE_4X4_CIUDAD_PANAMA_POR_PERSONA} total por persona, ida y vuelta (terrestre modelo).`,
      unitPrice: QUOTE_PRICE_USD.TRANSPORTE_4X4_CIUDAD_PANAMA_POR_PERSONA,
      quantity: travelers,
      subtotal: QUOTE_PRICE_USD.TRANSPORTE_4X4_CIUDAD_PANAMA_POR_PERSONA * travelers,
    });
  } else {
    notIncludedTexts.push(
      "Transporte 4×4 desde Ciudad de Panamá: no incluido en esta cotización."
    );
  }

  if (input.includeComarcalTaxes && input.travelerType) {
    const tax = comarcalRate(input.travelerType);
    lines.push({
      id: "opt-comarcal",
      tier: "opcional",
      label: "Impuesto comarcal (territorio)",
      detail:
        input.travelerType === "extranjero"
          ? `Tarifa visitante (${travelerTypeLabel(input.travelerType)}).`
          : `Tarifa nacional / residente (${travelerTypeLabel(input.travelerType)}).`,
      unitPrice: tax,
      quantity: travelers,
      subtotal: tax * travelers,
    });
  } else {
    notIncludedTexts.push(
      "Pago de impuesto comarcal: no incluido en esta cotización salvo selección contraria más arriba."
    );
  }

  const optionalLines = lines.filter((l) => l.tier === "opcional");
  const principalSubtotal = principalLines.reduce((sum, item) => sum + item.subtotal, 0);
  const optionalSubtotal = optionalLines.reduce((sum, item) => sum + item.subtotal, 0);
  const grandTotal = principalSubtotal + optionalSubtotal;

  return {
    travelers,
    nights,
    packageType: pkg,
    lines,
    principalSubtotal,
    optionalSubtotal,
    grandTotal,
    notIncludedTexts,
    referenceFootnotes,
  };
}
