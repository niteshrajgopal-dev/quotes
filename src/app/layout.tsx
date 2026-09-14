import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Young_Serif } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { BeanSprite } from "@/components/brand/bean";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-young-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "QOS Storefront",
    template: "%s · QOS Storefront",
  },
  description: "Multi-tenant QOS storefront renderer.",
};

export const viewport: Viewport = {
  themeColor: "#F5F1E9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${youngSerif.variable} ${plexMono.variable}`}
    >
      <body className="min-h-dvh">
        <ToastProvider>
          <BeanSprite />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
