import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, site } from "@/lib/site";

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const body = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

const title = {
  default: "Private Chef Lombok | In-Villa Chef Service in Kuta & Island-Wide",
  template: `%s · ${site.name}`,
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: absoluteUrl() }],
  creator: site.name,
  publisher: site.name,
  category: "Food & Dining",
  keywords: [...site.keywords],
  alternates: {
    canonical: absoluteUrl(),
    languages: {
      en: absoluteUrl(),
      "x-default": absoluteUrl(),
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    url: absoluteUrl(),
    siteName: site.name,
    title: title.default,
    description: site.description,
    images: [
      {
        url: absoluteUrl(site.heroImage),
        width: 1200,
        height: 630,
        alt: "Private chef dining experience in a Lombok villa",
      },
      {
        url: absoluteUrl(site.images.chef),
        width: 1200,
        height: 1600,
        alt: "Private chef plating a gourmet dish in Lombok",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: title.default,
    description: site.description,
    images: [absoluteUrl(site.heroImage)],
  },
  other: {
    "geo.region": "ID-NB",
    "geo.placename": "Kuta, Lombok",
    "geo.position": `${site.location.lat};${site.location.lng}`,
    ICBM: `${site.location.lat}, ${site.location.lng}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
