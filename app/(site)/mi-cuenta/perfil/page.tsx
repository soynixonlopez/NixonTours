import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/session";
import { PerfilForm } from "@/components/account/perfil-form";

export const metadata: Metadata = { title: "Perfil" };

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await getProfile(user.id);
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-extrabold text-brand-deep">Perfil</h1>
      <p className="text-sm text-slate-600">
        Datos básicos sincronizados con tu cuenta Nixon Tours.
      </p>
      <PerfilForm
        initial={{
          full_name: profile?.full_name ?? "",
          phone: profile?.phone ?? "",
          nationality: profile?.nationality ?? "",
        }}
        email={profile?.email ?? user.email ?? ""}
      />
    </div>
  );
}
