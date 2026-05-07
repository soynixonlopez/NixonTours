import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/database";

export async function requireUser(): Promise<{ id: string; email?: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=%2Fmi-cuenta");
  }
  return user;
}

export async function requireAdmin(): Promise<{
  id: string;
  email?: string | null;
  profile: ProfileRow;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login?next=%2Fadmin%2Fdashboard");
  }
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    redirect("/?error=solo_admin");
  }
  return { id: user.id, email: user.email, profile };
}

export async function getOptionalUser(): Promise<{
  id: string;
  email?: string | null;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return data as ProfileRow;
}
