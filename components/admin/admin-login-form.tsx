"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Sesión iniciada");
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Credenciales inválidas o usuario no creado en Supabase Auth.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-brand-deep/10 bg-brand-pearl/95 p-8 shadow-2xl shadow-brand-deep/20 backdrop-blur">
      <h1 className="text-center font-display text-xl font-extrabold text-brand-deep">
        Nixon Admin
      </h1>
      <p className="mt-2 text-center text-xs text-slate-600">Acceso protegido con Supabase Auth</p>
      <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" className="w-full gap-2" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Entrar
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-500">
        <Link href="/" className="font-semibold text-brand-turquoise hover:text-brand-deep hover:underline">
          Volver al sitio
        </Link>
      </p>
    </div>
  );
}
