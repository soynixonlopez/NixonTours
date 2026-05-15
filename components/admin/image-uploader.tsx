"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function ImageUploader({
  label = "Subir imagen",
  folder = "uploads",
  onUploaded,
}: {
  label?: string;
  folder?: string;
  onUploaded: (publicUrl: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona un archivo de imagen");
      e.target.value = "";
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const path = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("media").upload(path, file, {
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      if (!data.publicUrl) throw new Error("URL no disponible");
      onUploaded(data.publicUrl);
      toast.success("Imagen subida a Supabase");
    } catch (err) {
      console.error(err);
      toast.error(
        "Error al subir. ¿Sesión de admin iniciada y bucket público configurado?"
      );
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" size="sm" disabled={loading} asChild>
        <label className="cursor-pointer">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Upload className="h-4 w-4" aria-hidden />
          )}
          {loading ? "Subiendo…" : label}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => void onFile(e)} />
        </label>
      </Button>
    </div>
  );
}
