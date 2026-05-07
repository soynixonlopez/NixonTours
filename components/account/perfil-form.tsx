"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  full_name: z.string().min(2, "Nombre requerido"),
  phone: z.string().optional(),
  nationality: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function PerfilForm({
  initial,
  email,
}: {
  initial: Values;
  email: string;
}) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial,
  });

  async function onSubmit(vals: Values) {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sin sesión");
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: vals.full_name.trim(),
          phone: vals.phone?.trim() || null,
          nationality: vals.nationality?.trim() || null,
        })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Perfil actualizado");
    } catch (e: unknown) {
      console.error(e);
      toast.error("No se pudo guardar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="max-w-xl space-y-4" onSubmit={handleSubmit((v) => void onSubmit(v))}>
      <div className="space-y-2">
        <Label>Correo</Label>
        <Input readOnly disabled value={email} className="bg-brand-soft text-slate-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="full_name">Nombre completo</Label>
        <Input id="full_name" {...register("full_name")} />
        {errors.full_name && <p className="text-sm text-red-600">{errors.full_name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono / WhatsApp</Label>
        <Input id="phone" {...register("phone")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nationality">Nacionalidad</Label>
        <Input id="nationality" {...register("nationality")} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Guardar
      </Button>
    </form>
  );
}
