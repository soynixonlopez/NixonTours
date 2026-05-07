"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({
  variant = "nav",
}: {
  variant?: "nav" | "block";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const cls =
    variant === "block"
      ? "w-full rounded-xl bg-brand-soft px-3 py-2 text-left font-display text-sm font-semibold text-brand-deep hover:bg-brand-pearl border border-brand-deep/10"
      : "text-sm font-semibold text-brand-deep/70 hover:text-brand-deep underline-offset-4 hover:underline";

  return (
    <button type="button" className={cls} disabled={busy} onClick={() => void logout()}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cerrar sesión"}
    </button>
  );
}
