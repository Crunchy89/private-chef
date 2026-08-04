import { absoluteMediaUrl, getSiteCms } from "@/lib/site-cms";
import { absoluteUrl, site } from "@/lib/site";

export async function JsonLd() {
  const content = await getSiteCms();
  const hero = absoluteMediaUrl(content.heroImage);
  const about = absoluteMediaUrl(content.aboutImage);
  const chef = absoluteMediaUrl(content.chefImage);

  const business = {
    "@context": "https://schema.org",
    "@type": ["FoodService", "LocalBusiness"],
    "@id": `${absoluteUrl()}/#business`,
    name: content.name,
    alternateName: "Private Chef in Lombok",
    description: content.description,
    url: absoluteUrl(),
    image: [hero, about, chef],
    telephone: `+${content.whatsappNumber}`,
    priceRange: "$$",
    servesCuisine: ["Indonesian", "Seafood", "Contemporary"],
    areaServed: [
      { "@type": "Place", name: "Lombok, Indonesia" },
      { "@type": "Place", name: "Kuta Lombok" },
      { "@type": "Place", name: "Senggigi" },
      { "@type": "Place", name: "Mandalika" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kuta",
      addressLocality: site.location.locality,
      addressRegion: site.location.region,
      postalCode: site.location.postalCode,
      addressCountry: site.location.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.location.lat,
      longitude: site.location.lng,
    },
    hasMap: site.location.mapsLink,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "22:00",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "reservations",
      telephone: `+${content.whatsappNumber}`,
      availableLanguage: ["English", "Indonesian"],
      url: `https://wa.me/${content.whatsappNumber}`,
    },
    sameAs: [`https://wa.me/${content.whatsappNumber}`],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: content.average.toFixed(1),
      reviewCount: String(content.count || 1),
      bestRating: "5",
      worstRating: "1",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl()}/#website`,
    name: content.name,
    url: absoluteUrl(),
    description: content.description,
    inLanguage: "en",
    publisher: { "@id": `${absoluteUrl()}/#business` },
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl()}/#webpage`,
    url: absoluteUrl(),
    name: `${content.name} — Private Chef & Villa Dining in Lombok`,
    description: content.description,
    isPartOf: { "@id": `${absoluteUrl()}/#website` },
    about: { "@id": `${absoluteUrl()}/#business` },
    primaryImageOfPage: hero,
    inLanguage: "en",
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Private Chef Villa Dining in Lombok",
    serviceType: "Private chef / in-villa dining",
    provider: { "@id": `${absoluteUrl()}/#business` },
    areaServed: "Lombok, Indonesia",
    description: content.description,
    url: absoluteUrl(),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [business, website, webpage, service],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
