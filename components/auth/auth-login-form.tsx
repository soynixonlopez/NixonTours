"use client";

import { useMemo, useState } from "react";
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

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type Values = z.infer<typeof schema>;

export function AuthLoginForm({
  nextPath,
  registerHref = "/registro",
}: {
  nextPath?: string | null;
  registerHref?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const safeNext = useMemo(() => {
    if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
      return "/mi-cuenta";
    }
    return nextPath;
  }, [nextPath]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  async function onSubmit(vals: Values) {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: vals.email.trim(),
        password: vals.password,
      });
      if (error) throw error;
      toast.success("Bienvenido de vuelta");
      router.push(safeNext);
      router.refresh();
    } catch (e: unknown) {
      const msg =
        typeof e === "object" &&
        e !== null &&
        "message" in e &&
        typeof (e as { message: unknown }).message === "string"
          ? (e as { message: string }).message
          : "No se pudo iniciar sesión";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit((v) => void onSubmit(v))}>
      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input id="email" autoComplete="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" autoComplete="current-password" type="password" {...register("password")} />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Entrar
      </Button>
      <p className="text-center text-xs text-slate-600">
        ¿No tienes cuenta?{" "}
        <Link href={registerHref} className="font-semibold text-brand-turquoise hover:underline">
          Registrarse
        </Link>
        {" · "}
        <Link href="/recuperar" className="hover:underline">
          Olvidé mi contraseña
        </Link>
      </p>
    </form>
  );
}
