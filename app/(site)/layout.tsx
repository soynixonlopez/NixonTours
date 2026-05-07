import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSiteSettings } from "@/lib/data";
import { getOptionalUser, getProfile } from "@/lib/auth/session";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const user = await getOptionalUser();
  const profile = user ? await getProfile(user.id) : null;
  const authSummary = user
    ? { name: profile?.full_name ?? null, email: profile?.email ?? user.email ?? null }
    : null;

  return (
    <>
      <Navbar settings={settings} authSummary={authSummary} />
      <main className="min-h-dvh">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
