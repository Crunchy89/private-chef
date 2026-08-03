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
    "in-villa dining Lombok",
    "private dining Lombok",
    "personal chef Indonesia",
    "Lombok catering villa",
    "chef at home Lombok",
    "WhatsApp book private chef",
    "Mandalika private chef",
  ],
  whatsapp: {
    /** International format without + or spaces */
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890",
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
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15785!2d116.2775!3d-8.8956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcda1e85de0c2e7%3A0x0!2sKuta%2C%20Central%20Lombok!5e0!3m2!1sen!2sid!4v1700000000000",
    mapsLink: "https://maps.google.com/?q=Kuta,+Lombok,+Indonesia",
  },
  heroImage: "/images/hero.webp",
  images: {
    about: "/images/img1.png",
    chef: "/images/img2.png",
  },
} as const;

export function whatsappBookingUrl(message?: string) {
  const text = encodeURIComponent(message ?? site.whatsapp.defaultMessage);
  return `https://wa.me/${site.whatsapp.number}?text=${text}`;
}

export function absoluteUrl(path = "/") {
  const base = site.url.replace(/\/$/, "");
  if (path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
