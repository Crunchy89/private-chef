export type CmsReview = {
  id: string;
  quote: string;
  name: string;
  place?: string;
  rating: number;
  review?: string;
  photo_url?: string;
  created_at?: string;
  /** show | hide — empty treated as show */
  status?: string;
};

export type CmsImages = {
  hero: string;
  about: string;
  chef: string;
};

export type CmsContent = {
  ok: boolean;
  updatedAt?: string;
  settings: Record<string, string>;
  images: CmsImages;
  reviews: CmsReview[];
  meta: {
    average: number;
    count: number;
  };
};

export type SiteCms = {
  source: "drive" | "default";
  name: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  whatsappMessage: string;
  heroImage: string;
  aboutImage: string;
  chefImage: string;
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
