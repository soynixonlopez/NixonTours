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
import type { SiteSettingsRow } from "@/types/database";

export function SettingsForm({ initial }: { initial: SiteSettingsRow }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(initial.logo_url ?? "");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      whatsapp: String(fd.get("whatsapp") || "").trim(),
      email: String(fd.get("email") || "").trim() || null,
      instagram: String(fd.get("instagram") || "").trim() || null,
      facebook: String(fd.get("facebook") || "").trim() || null,
      address: String(fd.get("address") || "").trim() || null,
      logo_url: logoUrl.trim() || null,
      hero_title: String(fd.get("hero_title") || "").trim() || null,
      hero_subtitle: String(fd.get("hero_subtitle") || "").trim() || null,
    };

    try {
      const supabase = createClient();
      const { error } = await supabase.from("site_settings").update(payload).eq("id", initial.id);
      if (error) throw error;
      toast.success("Configuración guardada");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="hero_title">Título hero (home)</Label>
        <Textarea id="hero_title" name="hero_title" rows={2} defaultValue={initial.hero_title ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hero_subtitle">Subtítulo hero</Label>
        <Textarea id="hero_subtitle" name="hero_subtitle" rows={2} defaultValue={initial.hero_subtitle ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp *</Label>
        <Input id="whatsapp" name="whatsapp" required defaultValue={initial.whatsapp ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={initial.email ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="instagram">Instagram URL</Label>
        <Input id="instagram" name="instagram" defaultValue={initial.instagram ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="facebook">Facebook URL</Label>
        <Input id="facebook" name="facebook" defaultValue={initial.facebook ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" name="address" defaultValue={initial.address ?? ""} />
      </div>
      <div className="space-y-2">
        <Label>Logo (URL o subir)</Label>
        <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
        <ImageUploader folder="brand" onUploaded={setLogoUrl} />
      </div>
      <Button type="submit" disabled={loading} className="gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Guardar configuración
      </Button>
    </form>
  );
}
