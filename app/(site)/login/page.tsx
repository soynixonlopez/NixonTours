import type { Metadata } from "next";
import Link from "next/link";
import { AuthLoginForm } from "@/components/auth/auth-login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next ?? null;
  const reg = next
    ? `/registro?next=${encodeURIComponent(next)}`
    : "/registro";

  return (
    <div className="bg-brand-soft py-14">
      <div className="mx-auto max-w-md px-4">
        <Card className="border-brand-deep/10 shadow-lg shadow-brand-deep/10">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-xl text-brand-deep">
              Entrar a Nixon Tours
            </CardTitle>
            <p className="mt-2 text-sm text-slate-600">
              Gestiona tus reservas y beneficios en un solo lugar.
            </p>
          </CardHeader>
          <CardContent>
            <AuthLoginForm nextPath={next} registerHref={reg} />
            <p className="mt-6 text-center text-xs text-slate-500">
              <Link href="/" className="text-brand-turquoise hover:underline">
                ← Volver al inicio
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
