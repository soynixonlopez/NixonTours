"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function ToggleIslandActiveButton({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("islands")
        .update({ is_active: !isActive })
        .eq("id", id);
      if (error) throw error;
      toast.success(isActive ? "Isla desactivada" : "Isla activada");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error al actualizar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => void toggle()}>
      {isActive ? "Desactivar" : "Activar"}
    </Button>
  );
}
