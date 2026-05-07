import type { Metadata } from "next";
import { UserSidebar } from "@/components/account/user-sidebar";

export const metadata: Metadata = {
  title: {
    template: "%s · Mi cuenta",
    default: "Mi cuenta",
  },
};

export default function MiCuentaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-brand-deep/10 bg-brand-soft py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:px-6 lg:px-8">
        <UserSidebar />
        <section className="min-h-[280px] min-w-0 flex-1 rounded-3xl border border-brand-deep/10 bg-brand-pearl p-6 shadow-md shadow-brand-deep/5 md:p-8">
          {children}
        </section>
      </div>
    </div>
  );
}
