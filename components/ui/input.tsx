import * as React from "react";
import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-slate-200 bg-brand-pearl px-3 py-2 text-sm text-slate-800 outline-none transition",
        "placeholder:text-slate-400 focus-visible:border-brand-turquoise focus-visible:ring-2 focus-visible:ring-brand-turquoise/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
