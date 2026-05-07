import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nixontours.com"),
  title: {
    default: "Nixon Tours | Paquetes Guna Yala, San Blas y tours en Panamá",
    template: "%s | Nixon Tours",
  },
  description:
    "Tours a Guna Yala con agencia local: estadía, pasadía y camping. Isla Naranjo Chico y más. Cotiza por WhatsApp con Nixon Tours.",
  icons: {
    icon: "/img/logo.png",
    apple: "/img/logo.png",
  },
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
    images: [
      {
        url: "/img/banner.jpg",
        width: 1920,
        height: 1080,
        alt: "Nixon Tours — Guna Yala",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} min-h-dvh bg-background font-sans text-foreground antialiased`}
      >
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
