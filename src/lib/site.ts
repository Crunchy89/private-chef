export const site = {
  name: "Private Chef Lombok",
  tagline: "Intimate dining, cooked where you stay.",
  description:
    "A private chef experience across Lombok villas and beach houses — menus crafted for your table, booked simply on WhatsApp.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://private-chef-lombok.vercel.app",
  whatsapp: {
    /** International format without + or spaces */
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890",
    defaultMessage:
      "Hi! I'd like to book a private chef experience in Lombok. Here are my dates and guest count:",
  },
  location: {
    label: "Based in Kuta Lombok, serving all of Lombok",
    address: "Kuta, Central Lombok, West Nusa Tenggara, Indonesia",
    lat: -8.8956,
    lng: 116.2775,
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15785!2d116.2775!3d-8.8956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcda1e85de0c2e7%3A0x0!2sKuta%2C%20Central%20Lombok!5e0!3m2!1sen!2sid!4v1700000000000",
    mapsLink: "https://maps.google.com/?q=Kuta,+Lombok,+Indonesia",
  },
  heroImage:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2400&q=80",
} as const;

export function whatsappBookingUrl(message?: string) {
  const text = encodeURIComponent(message ?? site.whatsapp.defaultMessage);
  return `https://wa.me/${site.whatsapp.number}?text=${text}`;
}
