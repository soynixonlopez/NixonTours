import { cn } from "@/lib/utils";
import type { QuoteStatus } from "@/types/database";

const styles: Record<QuoteStatus, string> = {
  nueva:
    "bg-brand-sunset/15 text-brand-deep ring-brand-sunset/40 font-display font-semibold",
  contactado:
    "bg-brand-soft text-brand-deep ring-brand-turquoise/40 font-medium",
  reservado:
    "bg-brand-turquoise/12 text-brand-deep ring-brand-turquoise/35 font-semibold",
  cancelado:
    "bg-slate-100 text-slate-700 ring-slate-200",
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ring-1 ring-inset",
        styles[status] ?? "bg-slate-100 text-slate-700",
        className
      )}
    >
      {label}
    </span>
  );
}
