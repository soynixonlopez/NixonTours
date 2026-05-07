import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatsCard({
  title,
  value,
  hint,
  className,
}: {
  title: string;
  value: string | number;
  hint?: string;
  className?: string;
}) {
  return (
    <Card className={cn("border-brand-deep/10 shadow-md shadow-brand-deep/5", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-display text-3xl font-extrabold text-brand-deep">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      </CardContent>
    </Card>
  );
}
