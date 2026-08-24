import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Young_Serif } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { BeanSprite } from "@/components/brand/bean";
import { BRAND } from "@/lib/brand";

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
  metadataBase: new URL("https://quotes.coffee"),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  keywords: [
    "specialty coffee",
    "single origin",
    "coffee subscription",
    "café",
    "quotes coffee co.",
  ],
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
    type: "website",
    siteName: BRAND.name,
  },
  icons: {
    icon: "/brand/quotes-logo.png",
    apple: "/brand/quotes-logo.png",
  },
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
