import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSiteSettings } from "@/lib/data";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <>
      <Navbar settings={settings} />
      <main className="min-h-dvh">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
