"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function DeletePackageButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("¿Eliminar este paquete?")) return;
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("packages").delete().eq("id", id);
      if (error) throw error;
      toast.success("Paquete eliminado");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("No se pudo eliminar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button type="button" variant="destructive" size="sm" disabled={busy} onClick={() => void onDelete()}>
      Eliminar
    </Button>
  );
}
