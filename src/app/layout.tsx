import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();
const titleDefault = "Marefat Pilgrimage – Premium Umrah, Hajj & Ziyarat Tours";
const description =
  "Marefat Pilgrimage offers premium, small-group Umrah, Hajj, and Ziyarat tours with handpicked hotels, guided rituals, and end-to-end support.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: titleDefault,
    template: "%s | Marefat Pilgrimage",
  },
  description,
  keywords: [
    "Umrah",
    "Hajj",
    "Ziyarat",
    "pilgrimage",
    "Marefat Pilgrimage",
    "religious travel",
    "Saudi Arabia",
  ],
  authors: [{ name: "Marefat Pilgrimage" }],
  creator: "Marefat Pilgrimage",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Marefat Pilgrimage",
    title: titleDefault,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: titleDefault,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f4ed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-ivory text-charcoal antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteChrome>{children}</SiteChrome>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
