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
  affiliate_code: z
    .string()
    .min(4, "Mínimo 4 caracteres")
    .max(20, "Máximo 20")
    .regex(/^[A-Za-z0-9_-]+$/, "Solo letras, números, guion y guion bajo"),
});

type Values = z.infer<typeof schema>;

export function AffiliateRequestForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { affiliate_code: "" },
  });

  async function onSubmit(vals: Values) {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Inicia sesión");
      const code = vals.affiliate_code.trim().toUpperCase();
      const { error } = await supabase.from("affiliates").insert({
        user_id: user.id,
        affiliate_code: code,
        commission_rate: 10,
        status: "pending",
      });
      if (error) throw error;
      toast.success("Solicitud enviada. Nixon Tours revisará tu código.");
      window.location.reload();
    } catch (e: unknown) {
      const msg =
        typeof e === "object" && e !== null && "message" in e
          ? String((e as { message: unknown }).message)
          : "No se pudo enviar (¿código duplicado?)";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="max-w-md space-y-4 rounded-2xl border border-brand-deep/10 bg-brand-soft/40 p-6"
      onSubmit={handleSubmit((v) => void onSubmit(v))}
    >
      <p className="text-sm text-slate-600">
        Elige un código único (ej. <strong>NIXONMARIA</strong>). No uses espacios.
      </p>
      <div className="space-y-2">
        <Label htmlFor="affiliate_code">Tu código de socio</Label>
        <Input id="affiliate_code" autoComplete="off" {...register("affiliate_code")} />
        {errors.affiliate_code && (
          <p className="text-sm text-red-600">{errors.affiliate_code.message}</p>
        )}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Solicitar afiliación
      </Button>
    </form>
  );
}
