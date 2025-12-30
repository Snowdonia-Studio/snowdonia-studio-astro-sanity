import type { SanityDocument } from '@sanity/client';

export interface HomepageSection {
  title?: string;
  content?: string;
  image?: {
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
}

export interface HomepageData extends SanityDocument {
  title?: string;
  subtitle?: string;
  description?: string;
  heroImage?: {
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
  ctaText?: string;
  ctaLink?: string;
  sections?: HomepageSection[];
}