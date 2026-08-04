export type FaqItem = {
  question: string;
  answer: string;
};

export type AreaPage = {
  slug: string;
  name: string;
  shortName: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  body: string[];
  highlights: string[];
  keywords: string[];
};

/** Homepage FAQ — targets hire / villa / WhatsApp / price intent */
export const homeFaqs: FaqItem[] = [
  {
    question: "How do I hire a private chef in Lombok?",
    answer:
      "Message us on WhatsApp with your villa location, dates, guest count, and any dietary needs. We reply with menu ideas and a clear quote. Once you confirm, we shop, cook in your kitchen, plate, and clean up.",
  },
  {
    question: "Do you cook at villas in Kuta Lombok?",
    answer:
      "Yes. We are based in Kuta Lombok and cook regularly for villas and holiday homes there, plus Senggigi, Mandalika, and other areas across the island. Send your villa pin when you book.",
  },
  {
    question: "What does a villa chef / in-villa dining experience include?",
    answer:
      "Menu planning, fresh market ingredients, cooking in your villa kitchen, plating, and clean-up. You host the dinner — we handle the work. Ideal for couples, families, anniversary dinners, and friend groups.",
  },
  {
    question: "How much does a private chef in Lombok cost?",
    answer:
      "Pricing depends on guest count, menu style, and travel distance. Share your details on WhatsApp and we send a transparent quote before you book — no surprise fees for shopping or clean-up when those are included in the plan.",
  },
  {
    question: "Can you cook seafood or Indonesian menus?",
    answer:
      "Yes. We build menus around fresh local seafood, Indonesian flavours, and contemporary dishes. Tell us allergies, spice level, and preferences and we tailor the night for your guests.",
  },
  {
    question: "Apakah tersedia jasa chef privat / koki privat villa di Lombok?",
    answer:
      "Ya. Private Chef Lombok melayani villa di Kuta, Senggigi, Mandalika, dan wilayah lain di Lombok. Hubungi kami via WhatsApp untuk tanggal, jumlah tamu, dan lokasi villa Anda.",
  },
];

export const areas: AreaPage[] = [
  {
    slug: "kuta-lombok",
    name: "Kuta Lombok",
    shortName: "Kuta",
    title: "Private Chef Kuta Lombok | In-Villa Chef & Dining",
    description:
      "Hire a private chef in Kuta Lombok for your villa. Custom menus, fresh ingredients, and WhatsApp booking for in-villa dining near the south coast beaches.",
    h1: "Private chef for villas in Kuta Lombok",
    lead: "Based in Kuta — we cook in your holiday home so you can host dinner without leaving the property.",
    body: [
      "Kuta Lombok is our home base. Whether you are staying near the beach, in a hillside villa, or a holiday home inland, we bring a full private chef service to your kitchen: shopping, cooking, plating, and clean-up.",
      "Guests book us for quiet couple dinners, family nights, and celebrations after a day on the south coast. Tell us your dates and guest count on WhatsApp and we confirm availability with a clear quote.",
    ],
    highlights: [
      "Based in Kuta Lombok — short travel to most south-coast villas",
      "Custom menus: seafood, Indonesian, and flexible dietary options",
      "Book by WhatsApp with dates, guest count, and your villa pin",
    ],
    keywords: [
      "private chef Kuta Lombok",
      "private chef for villa in Kuta Lombok",
      "villa chef Kuta Lombok",
      "in-villa dining Kuta Lombok",
    ],
  },
  {
    slug: "senggigi",
    name: "Senggigi",
    shortName: "Senggigi",
    title: "Private Chef Senggigi | Villa Cook & In-Villa Dining",
    description:
      "Book a private chef in Senggigi, Lombok. In-villa dining for holiday homes and villas along the west coast — custom menus and easy WhatsApp booking.",
    h1: "Private chef for villas in Senggigi",
    lead: "A private cook for your Senggigi villa — we travel from Kuta Lombok to your west-coast kitchen.",
    body: [
      "Senggigi remains one of Lombok’s classic villa and hotel strips. We provide private chef and villa cook service for guests who want restaurant-quality food at home after sunset on the west coast.",
      "Share your villa address or pin, preferred dinner time, and any allergies. We plan the menu, bring fresh ingredients, cook on site, and leave the kitchen tidy.",
    ],
    highlights: [
      "In-villa dining for Senggigi holiday homes and villas",
      "Travel from our Kuta base — we confirm timing when you book",
      "Ideal for families, couples, and small group dinners",
    ],
    keywords: [
      "private chef Senggigi",
      "villa chef Senggigi",
      "private cook Senggigi Lombok",
      "in-villa dining Senggigi",
    ],
  },
  {
    slug: "mandalika",
    name: "Mandalika",
    shortName: "Mandalika",
    title: "Private Chef Mandalika | Villa Dining Near the Circuit",
    description:
      "Private chef for Mandalika villas and holiday homes. In-villa dining for event stays, families, and groups — book on WhatsApp with Private Chef Lombok.",
    h1: "Private chef for villas in Mandalika",
    lead: "In-villa dining for Mandalika stays — race weekends, beach holidays, and group trips.",
    body: [
      "Mandalika draws guests for the circuit, beaches, and new villa developments. We cook in your kitchen so your group can eat well without hunting for a table every night.",
      "Whether you need a relaxed seafood dinner or a fuller set menu for friends and family, message us with dates, headcount, and your villa location. We reply with options and pricing before you commit.",
    ],
    highlights: [
      "Private chef for Mandalika villa and holiday-home stays",
      "Flexible menus for couples, families, and larger groups",
      "WhatsApp booking with clear quotes before you confirm",
    ],
    keywords: [
      "private chef Mandalika",
      "private chef Mandalika villa",
      "villa chef Mandalika",
      "in-villa dining Mandalika",
    ],
  },
];

export function getAreaBySlug(slug: string): AreaPage | undefined {
  return areas.find((area) => area.slug === slug);
}

export const howToBook = {
  title: "How to Hire a Private Chef in Lombok | WhatsApp Booking",
  description:
    "Step-by-step guide to hiring a private chef for your Lombok villa. Book Private Chef Lombok on WhatsApp with dates, guest count, and location.",
  h1: "How to hire a private chef in Lombok",
  lead: "Booking takes a few WhatsApp messages. Here is exactly what we need and what happens next.",
  steps: [
    {
      title: "Send your details on WhatsApp",
      body: "Share villa location (pin or address), dates, guest count, meal time, and any allergies or preferences. Mention if it is an anniversary, family dinner, or group stay.",
    },
    {
      title: "Receive menu ideas and a quote",
      body: "We reply with menu options and transparent pricing for your private chef night — including shopping and clean-up when those are part of the plan.",
    },
    {
      title: "Confirm and relax",
      body: "Once you confirm, we shop for fresh ingredients, arrive at your villa, cook, plate, and tidy the kitchen so you can host without the work.",
    },
  ],
};
