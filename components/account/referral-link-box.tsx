"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReferralLinkBox({ code }: { code: string }) {
  const [ok, setOk] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = `${origin}/paquetes?ref=${encodeURIComponent(code)}`;

  async function copy() {
    await navigator.clipboard.writeText(link);
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-brand-turquoise/30 bg-gradient-to-br from-brand-soft to-brand-pearl p-6 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-turquoise">
        Tu enlace de referido
      </p>
      <p className="mt-2 break-all font-mono text-sm text-brand-deep">{link}</p>
      <Button type="button" variant="secondary" className="mt-4 gap-2" onClick={() => void copy()}>
        {ok ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {ok ? "Copiado" : "Copiar enlace"}
      </Button>
    </div>
  );
}
