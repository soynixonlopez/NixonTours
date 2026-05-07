"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function AdminHeader({ email }: { email: string }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <p className="truncate text-sm text-slate-600">
        <span className="font-medium text-slate-900">{email || "Admin"}</span>
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => void signOut()}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Salir
      </Button>
    </header>
  );
}
