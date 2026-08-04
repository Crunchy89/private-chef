export const site = {
  name: "Private Chef Lombok",
  tagline: "A private chef service for your villa in Lombok.",
  description:
    "Private Chef Lombok brings a professional chef to your villa or holiday home. Custom menus, fresh local ingredients, and easy WhatsApp booking across Kuta, Senggigi, Mandalika, and the rest of Lombok.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://private-chef-lombok.vercel.app",
  keywords: [
    "private chef Lombok",
    "private chef Kuta Lombok",
    "villa chef Lombok",
    "hire private chef Lombok",
    "in-villa dining Lombok",
    "private dining Lombok",
    "private cook Lombok villa",
    "private chef Senggigi",
    "private chef Mandalika",
    "jasa chef privat Lombok",
    "koki privat villa Lombok",
    "WhatsApp book private chef Lombok",
    "anniversary dinner private chef Lombok",
    "seafood private chef Lombok",
  ],
  whatsapp: {
    /** International format without + or spaces */
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6287858018811",
    defaultMessage:
      "Hi! I'd like to book Private Chef Lombok for my villa. Here are my dates, guest count, and location:",
  },
  location: {
    label: "Based in Kuta Lombok — we cook island-wide",
    address: "Kuta, Central Lombok, West Nusa Tenggara, Indonesia",
    locality: "Kuta",
    region: "West Nusa Tenggara",
    country: "ID",
    postalCode: "83562",
    lat: -8.8956,
    lng: 116.2775,
    mapsLink: "https://maps.google.com/?q=Kuta,+Lombok,+Indonesia",
  },
  heroImage: "/images/hero.webp",
  images: {
    about: "/images/img1.png",
    chef: "/images/img2.png",
  },
} as const;

export function whatsappBookingUrl(
  message?: string,
  number = site.whatsapp.number,
) {
  const text = encodeURIComponent(message ?? site.whatsapp.defaultMessage);
  return `https://wa.me/${number}?text=${text}`;
}

export function absoluteUrl(path = "/") {
  const base = site.url.replace(/\/$/, "");
  if (path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
