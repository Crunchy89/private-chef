import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { absoluteMediaUrl, getSiteCms } from "@/lib/site-cms";
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

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteCms();
  const hero = absoluteMediaUrl(content.heroImage);
  const chef = absoluteMediaUrl(content.chefImage);

  const title = {
    default: "Private Chef Lombok | In-Villa Chef Service in Kuta & Island-Wide",
    template: `%s · ${content.name}`,
  } as const;

  return {
    metadataBase: new URL(site.url),
    title,
    description: content.description,
    applicationName: content.name,
    authors: [{ name: content.name, url: absoluteUrl() }],
    creator: content.name,
    publisher: content.name,
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
      siteName: content.name,
      title: title.default,
      description: content.description,
      images: [
        {
          url: hero,
          width: 1200,
          height: 630,
          alt: "Private chef dining experience in a Lombok villa",
        },
        {
          url: chef,
          width: 1200,
          height: 1600,
          alt: "Private chef plating a gourmet dish in Lombok",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title.default,
      description: content.description,
      images: [hero],
    },
    other: {
      "geo.region": "ID-NB",
      "geo.placename": "Kuta, Lombok",
      "geo.position": `${site.location.lat};${site.location.lng}`,
      ICBM: `${site.location.lat}, ${site.location.lng}`,
    },
  };
}

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
