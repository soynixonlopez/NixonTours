"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";
import { createClient } from "@/lib/supabase/client";
import { buildWhatsAppUrl, normalizeWhatsAppDigits } from "@/lib/whatsapp";
import Link from "next/link";
import type { QuoteStatus } from "@/types/database";
import type { QuoteWithRelations } from "@/lib/admin-data";

export function QuoteDetailActions({
  quote,
  settingsPhone,
}: {
  quote: QuoteWithRelations;
  settingsPhone: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<QuoteStatus>(quote.status);
  const [busy, setBusy] = useState(false);

  const wa = buildWhatsAppUrl(
    normalizeWhatsAppDigits(quote.whatsapp),
    `Hola ${quote.full_name}, te escribimos desde Nixon Tours sobre tu cotización.`
  );

  async function updateStatus(next: QuoteStatus) {
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("quotes").update({ status: next }).eq("id", quote.id);
      if (error) throw error;
      setStatus(next);
      toast.success("Estado actualizado");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("No se pudo actualizar");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("¿Eliminar esta cotización?")) return;
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("quotes").delete().eq("id", quote.id);
      if (error) throw error;
      toast.success("Eliminada");
      router.push("/admin/cotizaciones");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("No se pudo eliminar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <div className="flex items-center gap-2">
        <SelectNative
          value={status}
          disabled={busy}
          onChange={(e) => void updateStatus(e.target.value as QuoteStatus)}
        >
          <option value="nueva">Nueva</option>
          <option value="contactado">Contactado</option>
          <option value="reservado">Reservado</option>
          <option value="cancelado">Cancelado</option>
        </SelectNative>
      </div>
      <Button type="button" variant="secondary" disabled={busy} asChild>
        <Link href={wa} target="_blank" rel="noreferrer">
          Abrir WhatsApp cliente
        </Link>
      </Button>
      <Button type="button" variant="outline" disabled={busy} asChild>
        <Link
          href={buildWhatsAppUrl(
            normalizeWhatsAppDigits(settingsPhone),
            "Hola equipo Nixon Tours"
          )}
          target="_blank"
        >
          WhatsApp Nixon
        </Link>
      </Button>
      <Button type="button" variant="destructive" disabled={busy} onClick={() => void remove()}>
        Eliminar
      </Button>
    </div>
  );
}
