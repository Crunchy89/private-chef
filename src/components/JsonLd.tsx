import { absoluteUrl, site } from "@/lib/site";

export function JsonLd() {
  const business = {
    "@context": "https://schema.org",
    "@type": ["FoodService", "LocalBusiness"],
    "@id": `${absoluteUrl()}/#business`,
    name: site.name,
    alternateName: "Private Chef in Lombok",
    description: site.description,
    url: absoluteUrl(),
    image: [
      absoluteUrl(site.heroImage),
      absoluteUrl(site.images.about),
      absoluteUrl(site.images.chef),
    ],
    telephone: `+${site.whatsapp.number}`,
    priceRange: "$$",
    servesCuisine: ["Indonesian", "Seafood", "Contemporary"],
    areaServed: [
      {
        "@type": "Place",
        name: "Lombok, Indonesia",
      },
      {
        "@type": "Place",
        name: "Kuta Lombok",
      },
      {
        "@type": "Place",
        name: "Senggigi",
      },
      {
        "@type": "Place",
        name: "Mandalika",
      },
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
      telephone: `+${site.whatsapp.number}`,
      availableLanguage: ["English", "Indonesian"],
      url: whatsappSchemaUrl(),
    },
    sameAs: [whatsappSchemaUrl()],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "6",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl()}/#website`,
    name: site.name,
    url: absoluteUrl(),
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": `${absoluteUrl()}/#business` },
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl()}/#webpage`,
    url: absoluteUrl(),
    name: `${site.name} — Private Chef & Villa Dining in Lombok`,
    description: site.description,
    isPartOf: { "@id": `${absoluteUrl()}/#website` },
    about: { "@id": `${absoluteUrl()}/#business` },
    primaryImageOfPage: absoluteUrl(site.heroImage),
    inLanguage: "en",
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Private Chef Villa Dining in Lombok",
    serviceType: "Private chef / in-villa dining",
    provider: { "@id": `${absoluteUrl()}/#business` },
    areaServed: "Lombok, Indonesia",
    description: site.description,
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

function whatsappSchemaUrl() {
  return `https://wa.me/${site.whatsapp.number}`;
}
