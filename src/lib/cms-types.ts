export type SiteCms = {
  source: "turso";
  name: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  whatsappMessage: string;
  location: {
    label: string;
    address: string;
    lat: number;
    lng: number;
    mapsLink: string;
  };
  heroImage: string;
  aboutImage: string;
  chefImage: string;
  content: {
    heroTitle: string;
    heroSubtitle: string;
    aboutTitleLead: string;
    aboutTitleRest: string;
    aboutBody: string;
    chefTitleLead: string;
    chefTitleRest: string;
    chefBody: string;
    reviewsTitleLead: string;
    reviewsTitleRest: string;
    reviewsBody: string;
    locationTitleLead: string;
    locationTitleRest: string;
  };
  reviews: Array<{
    quote: string;
    name: string;
    place: string;
    rating: number;
    review: string;
    id?: string;
  }>;
  average: number;
  count: number;
};
