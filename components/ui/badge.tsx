import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-[#0f172a] ring-1 ring-cyan-100",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
