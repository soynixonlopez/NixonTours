import type { Metadata } from "next";
import Link from "next/link";
import { AuthRecoverForm } from "@/components/auth/auth-recover-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
};

export default function RecuperarPage() {
  return (
    <div className="bg-brand-soft py-14">
      <div className="mx-auto max-w-md px-4">
        <Card className="border-brand-deep/10 shadow-lg shadow-brand-deep/10">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-xl text-brand-deep">
              Recuperar acceso
            </CardTitle>
            <p className="mt-2 text-sm text-slate-600">
              Te enviamos un enlace para crear una nueva contraseña.
            </p>
          </CardHeader>
          <CardContent>
            <AuthRecoverForm />
            <p className="mt-6 text-center text-xs text-slate-500">
              <Link href="/login" className="font-semibold text-brand-turquoise hover:underline">
                Volver al login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
