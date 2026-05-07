import { cn } from "@/lib/utils";
import type { QuoteStatus } from "@/types/database";

const styles: Record<QuoteStatus, string> = {
  nueva: "bg-amber-50 text-amber-900 ring-amber-200",
  contactado: "bg-sky-50 text-sky-900 ring-sky-200",
  reservado: "bg-emerald-50 text-emerald-900 ring-emerald-200",
  cancelado: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function StatusBadge({
  status,
  className,
}: {
  status: QuoteStatus;
  className?: string;
}) {
  const label =
    status === "nueva"
      ? "Nueva"
      : status === "contactado"
        ? "Contactado"
        : status === "reservado"
          ? "Reservado"
          : "Cancelado";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[status] ?? "bg-slate-100 text-slate-700",
        className
      )}
    >
      {label}
    </span>
  );
}
