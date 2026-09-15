import { hospitalityMedia } from "@/lib/storefront/tenant-assets";

/** Venue photography and tags aligned with the design handoff asset set. */
export const HOSPITALITY_VENUE_PHOTOS = [
  hospitalityMedia("venue-soho.png"),
  hospitalityMedia("venue-shoreditch.png"),
  hospitalityMedia("venue-marylebone.png"),
] as const;

export const HOSPITALITY_VENUE_TAGS = ["Flagship", "Roastery", "New"] as const;

export function hospitalityVenuePhoto(index: number): string {
  return HOSPITALITY_VENUE_PHOTOS[index % HOSPITALITY_VENUE_PHOTOS.length];
}

export function hospitalityVenueTag(index: number): string {
  return HOSPITALITY_VENUE_TAGS[index % HOSPITALITY_VENUE_TAGS.length];
}

const SHOP_COFFEE_IMAGES: Record<string, string> = {
  "ethiopia-yirgacheffe": hospitalityMedia("craft-cherries.png"),
  "signature-blend": hospitalityMedia("craft-roaster.png"),
  "kenya-nyeri-aa": hospitalityMedia("craft-pour.png"),
  "colombia-huila": hospitalityMedia("craft-barista.png"),
  "guatemala-antigua-decaf": hospitalityMedia("photo-story.png"),
  "sumatra-mandheling": hospitalityMedia("photo-beans-fall.png"),
};

const SHOP_IMAGE_FALLBACKS = [
  hospitalityMedia("craft-cherries.png"),
  hospitalityMedia("craft-roaster.png"),
  hospitalityMedia("craft-pour.png"),
  hospitalityMedia("craft-barista.png"),
  hospitalityMedia("photo-story.png"),
  hospitalityMedia("photo-beans-fall.png"),
] as const;

export function shopCoffeeImage(slug: string, index = 0): string {
  return SHOP_COFFEE_IMAGES[slug] ?? SHOP_IMAGE_FALLBACKS[index % SHOP_IMAGE_FALLBACKS.length];
}
