"use client";

import type { CabinType, QuoteBreakdown, TravelerType } from "@/lib/quote";
import {
  QUOTE_CONTACT,
  QUOTE_DOCUMENT_NOTES_ES,
  cabinTypeLabel,
  travelerTypeLabel,
} from "@/lib/quote";
import { formatPricePAB, packageTypeLabel } from "@/lib/whatsapp";
import type { PackageType } from "@/types/database";

function LineTable({
  title,
  lines,
}: {
  title: string;
  lines: QuoteBreakdown["lines"];
}) {
  const filtered = lines.filter((x) =>
    title.startsWith("Servicios opcionales")
      ? x.tier === "opcional"
      : x.tier === "principal"
  );
  if (filtered.length === 0 && title.startsWith("Servicios opcionales")) return null;

  const subtotal = filtered.reduce((s, i) => s + i.subtotal, 0);

  return (
    <section className="quote-doc-section mb-8 break-inside-avoid">
      <h3 className="quote-doc-heading mb-3 border-b pb-2 text-sm font-semibold uppercase tracking-wide text-brand-deep">
        {title}
      </h3>
      <table className="quote-doc-table w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-brand-soft/70 text-left text-xs uppercase text-slate-600">
            <th className="py-2 pr-2 font-medium">Concepto</th>
            <th className="hidden w-24 py-2 pr-2 text-right font-medium sm:table-cell">P. unitario</th>
            <th className="w-14 py-2 pr-2 text-right font-medium">Cant.</th>
            <th className="w-28 py-2 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 align-top">
              <td className="py-2 pr-3">
                <p className="font-medium text-brand-deep">{row.label}</p>
                {row.detail ? <p className="mt-0.5 text-xs text-slate-600">{row.detail}</p> : null}
              </td>
              <td className="hidden py-2 pr-2 text-right tabular-nums text-slate-700 sm:table-cell">
                {formatPricePAB(row.unitPrice)}
              </td>
              <td className="py-2 pr-2 text-right tabular-nums text-slate-700">{row.quantity}</td>
              <td className="py-2 text-right text-sm font-semibold tabular-nums text-brand-deep">
                {formatPricePAB(row.subtotal)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan={3}
              className="pt-3 text-right text-xs font-semibold uppercase text-slate-600"
            >
              Subtotal
            </td>
            <td className="pt-3 text-right text-base font-bold text-brand-deep">{formatPricePAB(subtotal)}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}

export function QuotePrintDocument({
  logoSrc,
  full_name,
  whatsapp,
  email,
  nationality,
  travelerType,
  islandName,
  packageName,
  packageType,
  travel_date,
  nights,
  adults,
  children,
  cabinType,
  comments,
  breakdown,
}: {
  logoSrc: string;
  full_name: string;
  whatsapp: string;
  email?: string | null;
  nationality?: string | null;
  travelerType?: TravelerType | null;
  islandName?: string | null;
  packageName?: string | null;
  packageType?: PackageType | null;
  travel_date?: string | null;
  nights?: number | null;
  adults: number;
  children: number;
  cabinType?: CabinType | null;
  comments?: string | null;
  breakdown: QuoteBreakdown;
}) {
  const optionals = breakdown.lines.filter((l) => l.tier === "opcional");

  return (
    <div className="quote-print-document rounded-3xl border border-brand-deep/10 bg-brand-pearl px-8 py-10 shadow-sm print:border-none print:bg-white print:shadow-none">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-6 border-b border-brand-deep/10 pb-6 print:mb-6">
        <div className="flex min-w-[200px] items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- impresión / PDF estable sin optimizer */}
          <img
            src={logoSrc}
            alt="Nixon Tours"
            className="h-14 max-w-[200px] object-contain object-left"
          />
          <div>
            <p className="font-display text-2xl font-extrabold text-brand-deep">{QUOTE_CONTACT.company}</p>
            <p className="text-sm font-medium text-brand-turquoise">{QUOTE_CONTACT.tagline}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Documento cotización</p>
          </div>
        </div>
        <div className="text-right text-sm text-brand-deep">
          <p>{QUOTE_CONTACT.web}</p>
          <p>WA {QUOTE_CONTACT.whatsapp}</p>
          <p>IG {QUOTE_CONTACT.instagram}</p>
        </div>
      </header>

      <section className="mb-10 break-inside-avoid">
        <h2 className="quote-doc-heading mb-4 text-lg font-semibold text-brand-deep">Datos del cliente</h2>
        <div className="grid gap-x-10 gap-y-3 text-sm sm:grid-cols-2">
          <p>
            <span className="text-slate-500">Nombre: </span>
            <span className="font-medium text-brand-deep">{full_name}</span>
          </p>
          <p>
            <span className="text-slate-500">Viajeros (adultos / niños): </span>
            <span className="font-medium">
              {adults} adulto(s), {children} niño(s) — {breakdown.travelers} persona(s)
            </span>
          </p>
          <p>
            <span className="text-slate-500">Fecha tentativa viaje: </span>
            <span className="font-medium">{travel_date || "Por coordinar"}</span>
          </p>
          <p>
            <span className="text-slate-500">Tipo de viaje / servicio: </span>
            <span className="font-medium">
              {packageType ? packageTypeLabel(packageType) : "Por definir"}
            </span>
          </p>
          {packageType === "estadia" || packageType === "camping" ? (
            <>
              <p>
                <span className="text-slate-500">Noches: </span>
                <span className="font-medium">{nights ?? "—"}</span>
              </p>
              {cabinType ? (
                <p>
                  <span className="text-slate-500">Alojamiento: </span>
                  <span className="font-medium">{cabinTypeLabel(cabinType)}</span>
                </p>
              ) : null}
            </>
          ) : packageType === "pasadia" ? (
            <p className="sm:col-span-2">
              <span className="text-slate-500">Duración noches terrestres: </span>
              <span className="font-medium">No aplica (pasadía)</span>
            </p>
          ) : null}
          <p>
            <span className="text-slate-500">WhatsApp: </span>
            <span className="font-medium">{whatsapp}</span>
          </p>
          <p>
            <span className="text-slate-500">Email: </span>
            <span className="font-medium">{email?.trim() || "—"}</span>
          </p>
          <p>
            <span className="text-slate-500">Nacionalidad: </span>
            <span className="font-medium">{nationality?.trim() || "—"}</span>
          </p>
          <p>
            <span className="text-slate-500">Clasificación comarcal ref.: </span>
            <span className="font-medium">
              {travelerType ? travelerTypeLabel(travelerType) : "No indicada"}
            </span>
          </p>
          {islandName ? (
            <p className="sm:col-span-2">
              <span className="text-slate-500">Isla de referencia: </span>
              <span className="font-medium">{islandName}</span>
            </p>
          ) : null}
          {packageName ? (
            <p className="sm:col-span-2">
              <span className="text-slate-500">Paquete web: </span>
              <span className="font-medium">{packageName}</span>
            </p>
          ) : null}
          {comments?.trim() ? (
            <p className="sm:col-span-2">
              <span className="text-slate-500">Observaciones adicionales: </span>
              <span className="font-medium whitespace-pre-wrap">{comments.trim()}</span>
            </p>
          ) : null}
        </div>
      </section>

      <LineTable title="Servicios principales" lines={breakdown.lines} />

      <LineTable title="Servicios opcionales seleccionados" lines={breakdown.lines} />

      {optionals.length === 0 ? (
        <p className="mb-6 rounded-lg border border-dashed border-brand-deep/20 bg-brand-soft/50 px-4 py-3 text-sm text-brand-deep">
          No se seleccionaron ítems opcionales remunerados fuera del bloque principal.
        </p>
      ) : null}

      <div className="mb-8 rounded-2xl bg-brand-deep px-6 py-5 text-brand-pearl print-break-inside-avoid">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm">
            <p className="font-semibold">Total cotización ({breakdown.travelers} personas)</p>
            <p className="opacity-85">
              {breakdown.optionalSubtotal > 0 ? (
                <>
                  Principales + opcionales en USD ({formatPricePAB(breakdown.principalSubtotal)} +{" "}
                  {formatPricePAB(breakdown.optionalSubtotal)})
                </>
              ) : (
                <>Subtotal principal: {formatPricePAB(breakdown.principalSubtotal)} USD</>
              )}
            </p>
          </div>
          <p className="font-display text-3xl font-extrabold tabular-nums">
            {formatPricePAB(breakdown.grandTotal)}
          </p>
        </div>
      </div>

      {breakdown.notIncludedTexts.length > 0 ? (
        <section className="mb-8 rounded-xl bg-amber-50/80 px-4 py-3 text-sm text-brand-deep ring-1 ring-amber-200/60">
          <h3 className="mb-2 font-semibold">No incluido en esta cotización</h3>
          <ul className="list-disc space-y-1 pl-5">
            {breakdown.notIncludedTexts.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {breakdown.referenceFootnotes.map((note, idx) => (
        <p key={idx} className="mb-2 text-xs text-slate-600">
          {note}
        </p>
      ))}

      <section className="mt-10 border-t border-brand-deep/10 pt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-deep">
          Notas importantes
        </h3>
        <ul className="list-disc space-y-2 pl-5 text-xs leading-relaxed text-slate-600">
          {QUOTE_DOCUMENT_NOTES_ES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
