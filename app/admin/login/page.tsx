import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const nextPath = sp.next && sp.next.startsWith("/admin") ? sp.next : "/admin/dashboard";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] px-4">
      <AdminLoginForm nextPath={nextPath} />
    </div>
  );
}
