import { cn } from "@/lib/utils";

export function SelectNative({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "flex h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-10 text-sm text-slate-900 outline-none transition",
        "focus-visible:border-[#00D4FF] focus-visible:ring-2 focus-visible:ring-cyan-400/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat",
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23334155' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
      }}
      {...props}
    >
      {children}
    </select>
  );
}
