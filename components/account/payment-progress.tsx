import { cn } from "@/lib/utils";

export function PaymentProgress({
  paid,
  total,
  label = "Avance del pago",
}: {
  paid: number;
  total: number;
  label?: string;
}) {
  const pct =
    total > 0 ? Math.min(100, Math.round((paid / Math.max(total, 0.01)) * 100)) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-semibold font-display text-brand-deep">
        <span>{label}</span>
        <span className="text-brand-turquoise">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-brand-soft">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-brand transition-[width]",
            pct >= 100 && "bg-brand-sunset"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-600">
        Abonado: ${paid.toFixed(2)} · Total: ${total.toFixed(2)}
      </p>
    </div>
  );
}
