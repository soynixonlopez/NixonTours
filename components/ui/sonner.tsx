"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      richColors
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "rounded-xl border border-slate-200 shadow-lg",
        },
      }}
    />
  );
}
