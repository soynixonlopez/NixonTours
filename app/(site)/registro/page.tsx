import type { Metadata } from "next";
import Link from "next/link";
import { AuthRegisterForm } from "@/components/auth/auth-register-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

export default function RegistroPage() {
  return (
    <div className="bg-brand-soft py-14">
      <div className="mx-auto max-w-md px-4">
        <Card className="border-brand-deep/10 shadow-lg shadow-brand-deep/10">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-xl text-brand-deep">
              Únete a Nixon Tours
            </CardTitle>
            <p className="mt-2 text-sm text-slate-600">
              Historial de viajes, Nixon Premium Club y Nixon Partner Program.
            </p>
          </CardHeader>
          <CardContent>
            <AuthRegisterForm />
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
