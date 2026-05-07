import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold font-display text-brand-deep ring-1 ring-brand-turquoise/25",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
