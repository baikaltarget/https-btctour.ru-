import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "./globals.css";
import { SITE } from "@/lib/content";
import Metrika from "@/components/Metrika";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { default: `Туры на Байкал — ${SITE.brand}`, template: "%s" },
  applicationName: SITE.brand,
  formatDetection: { telephone: true },
};
export const viewport: Viewport = { themeColor: "#0F3A4A", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="pb-14 md:pb-0">
        {children}
        <Metrika />
      </body>
    </html>
  );
}
