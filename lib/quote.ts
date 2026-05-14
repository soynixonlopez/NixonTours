import countries from "i18n-iso-countries";
import esLocale from "i18n-iso-countries/langs/es.json";
import type { PackageType } from "@/types/database";

countries.registerLocale(esLocale);

export type TravelerType = "nacional" | "residente" | "extranjero";
export type CabinType = "shared" | "private" | "group";

export type QuoteLineItem = {
  id: string;
  label: string;
  detail?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type QuoteSummary = {
  travelers: number;
  nights: number;
  cabinRate: number;
  taxPerPerson: number;
  items: QuoteLineItem[];
  total: number;
};

type QuoteSummaryInput = {
  packageType?: PackageType;
  adults: number;
  children: number;
  nights: number;
  cabinType?: CabinType;
  travelerType?: TravelerType;
  includeTour: boolean;
  includeBoat: boolean;
  includeCar: boolean;
  includeTaxes: boolean;
};

const CABIN_RATE: Record<CabinType, number> = {
  shared: 35,
  private: 45,
  group: 35,
};

const TAX_RATE: Record<TravelerType, number> = {
  nacional: 7,
  residente: 7,
  extranjero: 22,
};

export const WORLD_COUNTRIES = Object.values(
  countries.getNames("es", { select: "official" })
).sort((a, b) => a.localeCompare(b, "es"));

export const TRAVELER_TYPE_OPTIONS: Array<{ value: TravelerType; label: string }> = [
  { value: "nacional", label: "Nacional" },
  { value: "residente", label: "Residente" },
  { value: "extranjero", label: "Turista extranjero" },
];

export const CABIN_TYPE_OPTIONS: Array<{ value: CabinType; label: string }> = [
  { value: "shared", label: "Compartida 2 a 3 camas" },
  { value: "private", label: "Privada 1 cama" },
  { value: "group", label: "Grupal 7 camas" },
];

export function travelerTypeLabel(value: TravelerType): string {
  return TRAVELER_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function cabinTypeLabel(value: CabinType): string {
  return CABIN_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function cabinTypeDetail(value: CabinType): string {
  switch (value) {
    case "shared":
      return "Incluye comida: 3 platos.";
    case "private":
      return "Baño compartido.";
    case "group":
      return "Alojamiento grupal de 7 camas.";
    default:
      return "";
  }
}

export function calculateQuoteSummary(input: QuoteSummaryInput): QuoteSummary {
  const travelers = input.adults + input.children;
  const nights = Math.max(input.nights || 1, 1);
  const shouldIncludeStay =
    input.packageType === undefined || input.packageType === "estadia";
  const cabinRate = shouldIncludeStay && input.cabinType ? CABIN_RATE[input.cabinType] : 0;
  const taxPerPerson =
    input.includeTaxes && input.travelerType ? TAX_RATE[input.travelerType] : 0;

  const items: QuoteLineItem[] = [];

  if (cabinRate > 0 && input.cabinType) {
    items.push({
      id: "stay",
      label: `Hospedaje - ${cabinTypeLabel(input.cabinType)}`,
      detail: cabinTypeDetail(input.cabinType),
      unitPrice: cabinRate,
      quantity: travelers * nights,
      subtotal: cabinRate * travelers * nights,
    });
  }

  if (input.includeTour) {
    items.push({
      id: "tour",
      label: "Tour",
      unitPrice: 25,
      quantity: travelers,
      subtotal: 25 * travelers,
    });
  }

  if (input.includeBoat) {
    items.push({
      id: "boat",
      label: "Lancha",
      unitPrice: 25,
      quantity: travelers,
      subtotal: 25 * travelers,
    });
  }

  if (input.includeCar) {
    items.push({
      id: "car",
      label: "Carro",
      unitPrice: 50,
      quantity: travelers,
      subtotal: 50 * travelers,
    });
  }

  if (taxPerPerson > 0) {
    items.push({
      id: "taxes",
      label: "Impuestos comarcales",
      detail:
        input.travelerType === "extranjero"
          ? "Tarifa para turista extranjero."
          : "Tarifa para nacionales y residentes.",
      unitPrice: taxPerPerson,
      quantity: travelers,
      subtotal: taxPerPerson * travelers,
    });
  }

  return {
    travelers,
    nights,
    cabinRate,
    taxPerPerson,
    items,
    total: items.reduce((sum, item) => sum + item.subtotal, 0),
  };
}
