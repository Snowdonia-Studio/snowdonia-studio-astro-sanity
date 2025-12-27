// ./src/sanity/lib/url-for-image.ts
import { createClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

const sanityClient = createClient({
  projectId: 'wlkublm0',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-01-28',
});

export const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source);
}