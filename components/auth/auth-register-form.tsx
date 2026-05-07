"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z
  .object({
    full_name: z.string().min(2, "Nombre requerido"),
    email: z.string().email("Correo inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Las contraseñas no coinciden", path: ["confirm"] });

type Values = z.infer<typeof schema>;

export function AuthRegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", email: "", password: "", confirm: "" },
  });

  async function onSubmit(vals: Values) {
    setLoading(true);
    try {
      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signUp({
        email: vals.email.trim(),
        password: vals.password,
        options: {
          emailRedirectTo: origin ? `${origin}/login` : undefined,
          data: { full_name: vals.full_name.trim() },
        },
      });
      if (error) throw error;
      toast.success("Revisa tu correo para confirmar la cuenta.");
      router.push("/login");
    } catch (e: unknown) {
      const msg =
        typeof e === "object" &&
        e !== null &&
        "message" in e &&
        typeof (e as { message: unknown }).message === "string"
          ? (e as { message: string }).message
          : "No se pudo registrar";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit((v) => void onSubmit(v))}>
      <div className="space-y-2">
        <Label htmlFor="full_name">Nombre completo</Label>
        <Input id="full_name" autoComplete="name" {...register("full_name")} />
        {errors.full_name && <p className="text-sm text-red-600">{errors.full_name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input id="email" autoComplete="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" autoComplete="new-password" type="password" {...register("password")} />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirmar contraseña</Label>
        <Input id="confirm" autoComplete="new-password" type="password" {...register("confirm")} />
        {errors.confirm && <p className="text-sm text-red-600">{errors.confirm.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Crear cuenta
      </Button>
      <p className="text-center text-xs text-slate-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-brand-turquoise hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
