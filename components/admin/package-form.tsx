"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";
import { ImageUploader } from "@/components/admin/image-uploader";
import { createClient } from "@/lib/supabase/client";
import type { IslandRow, PackageRow } from "@/types/database";
import { parseGallery } from "@/types/database";

function galleryToText(g: unknown): string {
  return parseGallery(g).join(", ");
}

export function PackageForm({
  islands,
  initial,
}: {
  islands: IslandRow[];
  initial?: PackageRow | null;
}) {
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
      island_id: String(fd.get("island_id")),
      name: String(fd.get("name")).trim(),
      slug: String(fd.get("slug")).trim(),
      type: String(fd.get("type")) as "estadia" | "pasadia" | "camping",
      price: Number(fd.get("price")),
      duration: String(fd.get("duration") || "").trim() || null,
      short_description: String(fd.get("short_description") || "").trim() || null,
      long_description: String(fd.get("long_description") || "").trim() || null,
      includes: String(fd.get("includes") || "").trim() || null,
      excludes: String(fd.get("excludes") || "").trim() || null,
      itinerary: String(fd.get("itinerary") || "").trim() || null,
      recommendations: String(fd.get("recommendations") || "").trim() || null,
      policies: String(fd.get("policies") || "").trim() || null,
      main_image_url: mainUrl.trim() || null,
      gallery: galleryUrls,
      is_active: fd.get("is_active") === "on",
    };

    try {
      const supabase = createClient();
      if (initial) {
        const { error } = await supabase
          .from("packages")
          .update(payload)
          .eq("id", initial.id);
        if (error) throw error;
        toast.success("Paquete actualizado");
      } else {
        const { error } = await supabase.from("packages").insert(payload);
        if (error) throw error;
        toast.success("Paquete creado");
      }
      router.push("/admin/paquetes");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo guardar. Revisa slug único y campos obligatorios.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="island_id">Isla *</Label>
          <SelectNative
            id="island_id"
            name="island_id"
            required
            defaultValue={initial?.island_id ?? ""}
          >
            <option value="">Selecciona</option>
            {islands.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </SelectNative>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Nombre del paquete *</Label>
          <Input id="name" name="name" required defaultValue={initial?.name ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug único *</Label>
          <Input id="slug" name="slug" required defaultValue={initial?.slug ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipo *</Label>
          <SelectNative id="type" name="type" required defaultValue={initial?.type ?? "pasadia"}>
            <option value="estadia">Estadía</option>
            <option value="pasadia">Pasadía</option>
            <option value="camping">Camping</option>
          </SelectNative>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Precio (USD) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={initial?.price ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duración</Label>
          <Input id="duration" name="duration" defaultValue={initial?.duration ?? ""} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="short_description">Descripción corta</Label>
          <Textarea
            id="short_description"
            name="short_description"
            defaultValue={initial?.short_description ?? ""}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="long_description">Descripción larga</Label>
          <Textarea
            id="long_description"
            name="long_description"
            rows={5}
            defaultValue={initial?.long_description ?? ""}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="includes">Incluye</Label>
          <Textarea id="includes" name="includes" defaultValue={initial?.includes ?? ""} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="excludes">No incluye</Label>
          <Textarea id="excludes" name="excludes" defaultValue={initial?.excludes ?? ""} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="itinerary">Itinerario</Label>
          <Textarea id="itinerary" name="itinerary" defaultValue={initial?.itinerary ?? ""} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="recommendations">Recomendaciones</Label>
          <Textarea
            id="recommendations"
            name="recommendations"
            defaultValue={initial?.recommendations ?? ""}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="policies">Políticas</Label>
          <Textarea id="policies" name="policies" defaultValue={initial?.policies ?? ""} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Imagen principal (URL o subir)</Label>
          <Input
            value={mainUrl}
            onChange={(e) => setMainUrl(e.target.value)}
            placeholder="https://..."
          />
          <ImageUploader folder="packages" onUploaded={setMainUrl} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="gallery_text">Galería (URLs separadas por coma o salto de línea)</Label>
          <Textarea
            id="gallery_text"
            value={galleryText}
            onChange={(e) => setGalleryText(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-slate-500">
            Opcional: sube al Storage de Supabase (<strong>bucket media</strong>) o pegá la URL pública.
          </p>
          <ImageUploader
            folder="gallery/packages"
            label="Subir a Supabase (galería)"
            onUploaded={(url) =>
              setGalleryText((t) => (t.trim() ? `${t.trim()},\n${url}` : url))
            }
          />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            defaultChecked={initial?.is_active ?? true}
            className="h-4 w-4 rounded border-slate-300"
          />
          <Label htmlFor="is_active" className="cursor-pointer">
            Paquete activo (visible en la web)
          </Label>
        </div>
      </div>
      <Button type="submit" disabled={loading} className="gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Guardar
      </Button>
    </form>
  );
}
