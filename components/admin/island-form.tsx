"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/image-uploader";
import { createClient } from "@/lib/supabase/client";
import type { IslandRow } from "@/types/database";
import { parseGallery } from "@/types/database";

function galleryToText(g: unknown): string {
  return parseGallery(g).join(", ");
}

export function IslandForm({ initial }: { initial?: IslandRow | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mainUrl, setMainUrl] = useState(initial?.main_image_url ?? "");
  const [galleryText, setGalleryText] = useState(galleryToText(initial?.gallery));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const galleryUrls = galleryText
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: String(fd.get("name")).trim(),
      slug: String(fd.get("slug")).trim(),
      description: String(fd.get("description") || "").trim() || null,
      main_image_url: mainUrl.trim() || null,
      gallery: galleryUrls,
      is_active: fd.get("is_active") === "on",
    };

    try {
      const supabase = createClient();
      if (initial) {
        const { error } = await supabase.from("islands").update(payload).eq("id", initial.id);
        if (error) throw error;
        toast.success("Isla actualizada");
      } else {
        const { error } = await supabase.from("islands").insert(payload);
        if (error) throw error;
        toast.success("Isla creada");
      }
      router.push("/admin/islas");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo guardar. El slug debe ser único.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input id="name" name="name" required defaultValue={initial?.name ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input id="slug" name="slug" required defaultValue={initial?.slug ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={initial?.description ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label>Imagen principal</Label>
        <Input value={mainUrl} onChange={(e) => setMainUrl(e.target.value)} placeholder="https://..." />
        <ImageUploader folder="islands" onUploaded={setMainUrl} />
      </div>
      <div className="space-y-2">
        <Label>Galería (URLs separadas por coma)</Label>
        <Textarea
          value={galleryText}
          onChange={(e) => setGalleryText(e.target.value)}
          rows={3}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          defaultChecked={initial?.is_active ?? true}
          className="h-4 w-4 rounded border-slate-300"
        />
        <Label htmlFor="is_active" className="cursor-pointer">
          Isla activa
        </Label>
      </div>
      <Button type="submit" disabled={loading} className="gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Guardar
      </Button>
    </form>
  );
}
