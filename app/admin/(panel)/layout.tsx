import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const { email } = await requireAdmin();

  return (
    <div className="flex min-h-dvh bg-brand-soft">
      <AdminSidebar />
      <div className="flex min-h-dvh flex-1 flex-col">
        <AdminHeader email={email ?? ""} />
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
