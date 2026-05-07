import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nixontours.com"),
  title: {
    default: "Nixon Tours | Paquetes Guna Yala, San Blas y tours en Panamá",
    template: "%s | Nixon Tours",
  },
  description:
    "Tours a Guna Yala con agencia local: estadía, pasadía y camping. Isla Naranjo Chico y más. Cotiza por WhatsApp con Nixon Tours.",
  keywords: [
    "Tours a Guna Yala",
    "Paquetes Guna Yala",
    "Pasadía Guna Yala",
    "Camping Guna Yala",
    "Islas de San Blas",
    "Isla Naranjo Chico",
    "Turismo en Panamá",
  ],
  openGraph: {
    title: "Nixon Tours — Vive Guna Yala",
    description:
      "Paquetes premium de estadía, pasadía y camping hacia las mejores islas.",
    locale: "es_PA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-dvh font-sans antialiased`}>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
