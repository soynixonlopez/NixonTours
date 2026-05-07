"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({ email: z.string().email("Correo inválido") });

type Values = z.infer<typeof schema>;

export function AuthRecoverForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(vals: Values) {
    setLoading(true);
    try {
      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.resetPasswordForEmail(vals.email.trim(), {
        redirectTo: origin ? `${origin}/login` : undefined,
      });
      if (error) throw error;
      toast.success("Revisa tu bandeja con el enlace de recuperación.");
      setSent(true);
    } catch {
      toast.error("No se pudo enviar el correo.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <p className="text-center text-sm text-slate-600">
        Si el correo existe, recibirás instrucciones.{" "}
        <Link href="/login" className="font-semibold text-brand-turquoise hover:underline">
          Volver al login
        </Link>
      </p>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit((v) => void onSubmit(v))}>
      <div className="space-y-2">
        <Label htmlFor="email">Correo de tu cuenta</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Enviar enlace
      </Button>
    </form>
  );
}
