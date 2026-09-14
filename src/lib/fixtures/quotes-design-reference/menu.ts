/**
 * The café menu: category navigation, sizes, dietary indicators and
 * customisation, per the "Café menu" experience in the design export.
 */

export type Dietary = "V" | "VG" | "GF" | "N" | "DF";

export const DIETARY_LABELS: Record<Dietary, string> = {
  V: "Vegetarian",
  VG: "Vegan",
  GF: "Gluten free",
  N: "Contains nuts",
  DF: "Dairy free",
};

export type MenuCategory = {
  id: string;
  name: string;
  blurb: string;
};

export type MenuSize = {
  id: string;
  label: string;
  volume?: string;
  priceDelta: number;
};

export type MenuItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  basePrice: number;
  sizes?: MenuSize[];
  dietary: Dietary[];
  /** Milk, shots and syrups only apply to drinks that take them. */
  customisable: boolean;
  caffeineFree?: boolean;
  signature?: boolean;
  soldOut?: boolean;
};

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: "espresso", name: "Espresso bar", blurb: "Signature Blend as standard, single origin on request." },
  { id: "filter", name: "Filter & brew", blurb: "Poured to order, or batch-brewed through the day." },
  { id: "not-coffee", name: "Not coffee", blurb: "For the half of every table that isn't drinking coffee." },
  { id: "bakery", name: "Bakery", blurb: "Baked a mile away, delivered twice daily." },
];

export const MILKS = [
  { id: "whole", label: "Whole milk", price: 0 },
  { id: "semi", label: "Semi-skimmed", price: 0 },
  { id: "oat", label: "Oat", price: 0.4 },
  { id: "almond", label: "Almond", price: 0.4 },
  { id: "soy", label: "Soy", price: 0.4 },
  { id: "none", label: "No milk", price: 0 },
] as const;

export const SYRUPS = [
  { id: "none", label: "No syrup", price: 0 },
  { id: "vanilla", label: "Vanilla", price: 0.5 },
  { id: "hazelnut", label: "Hazelnut", price: 0.5 },
  { id: "cinnamon", label: "Cinnamon", price: 0.5 },
] as const;

export const EXTRA_SHOT_PRICE = 0.6;

const cupSizes: MenuSize[] = [
  { id: "s", label: "Small", volume: "8oz", priceDelta: 0 },
  { id: "m", label: "Medium", volume: "12oz", priceDelta: 0.5 },
  { id: "l", label: "Large", volume: "16oz", priceDelta: 0.9 },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "espresso",
    category: "espresso",
    name: "Espresso",
    description: "Double shot of Signature Blend. Cocoa, hazelnut, long finish.",
    basePrice: 2.6,
    dietary: ["VG", "GF"],
    customisable: false,
  },
  {
    id: "macchiato",
    category: "espresso",
    name: "Macchiato",
    description: "Double espresso marked with a spoon of textured milk.",
    basePrice: 2.9,
    dietary: ["V", "GF"],
    customisable: true,
  },
  {
    id: "flat-white",
    category: "espresso",
    name: "Flat white",
    description: "Two shots, 6oz, milk stretched thin. The bar's benchmark.",
    basePrice: 3.4,
    dietary: ["V", "GF"],
    customisable: true,
    signature: true,
  },
  {
    id: "cortado",
    category: "espresso",
    name: "Cortado",
    description: "Equal parts espresso and warm milk in glass.",
    basePrice: 3.2,
    dietary: ["V", "GF"],
    customisable: true,
  },
  {
    id: "latte",
    category: "espresso",
    name: "Latte",
    description: "Long, mild and milky. Takes syrup well.",
    basePrice: 3.5,
    sizes: cupSizes,
    dietary: ["V", "GF"],
    customisable: true,
  },
  {
    id: "cappuccino",
    category: "espresso",
    name: "Cappuccino",
    description: "Deeper foam, dusted with cocoa if you'd like.",
    basePrice: 3.5,
    sizes: cupSizes,
    dietary: ["V", "GF"],
    customisable: true,
  },
  {
    id: "mocha",
    category: "espresso",
    name: "Mocha",
    description: "70% single-origin chocolate, melted to order, not syrup.",
    basePrice: 3.9,
    sizes: cupSizes,
    dietary: ["V", "GF"],
    customisable: true,
  },
  {
    id: "v60",
    category: "filter",
    name: "V60 pour-over",
    description: "Choose today's single origin. Brewed at the bar, served in glass.",
    basePrice: 4.2,
    dietary: ["VG", "GF"],
    customisable: false,
    signature: true,
  },
  {
    id: "batch-filter",
    category: "filter",
    name: "Batch filter",
    description: "Rotating single origin, ready now. Free refill before noon.",
    basePrice: 3.1,
    sizes: cupSizes,
    dietary: ["VG", "GF"],
    customisable: false,
  },
  {
    id: "cold-brew",
    category: "filter",
    name: "Cold brew",
    description: "Eighteen hours, coarse ground, served over one large cube.",
    basePrice: 3.8,
    dietary: ["VG", "GF"],
    customisable: true,
  },
  {
    id: "espresso-tonic",
    category: "filter",
    name: "Espresso tonic",
    description: "Yirgacheffe over tonic and citrus. Bright and unreasonably good.",
    basePrice: 4.4,
    dietary: ["VG", "GF"],
    customisable: false,
  },
  {
    id: "matcha",
    category: "not-coffee",
    name: "Ceremonial matcha",
    description: "Whisked, single-cultivar Uji matcha. Grassy and sweet.",
    basePrice: 4.0,
    sizes: cupSizes,
    dietary: ["V", "GF"],
    customisable: true,
    caffeineFree: false,
  },
  {
    id: "chai",
    category: "not-coffee",
    name: "House chai",
    description: "Steeped with cardamom, clove and black pepper. Never a powder.",
    basePrice: 3.6,
    sizes: cupSizes,
    dietary: ["V", "GF"],
    customisable: true,
  },
  {
    id: "hot-chocolate",
    category: "not-coffee",
    name: "Hot chocolate",
    description: "Same 70% chocolate as the mocha, without the coffee.",
    basePrice: 3.6,
    sizes: cupSizes,
    dietary: ["V", "GF"],
    customisable: true,
    caffeineFree: true,
  },
  {
    id: "loose-leaf",
    category: "not-coffee",
    name: "Loose-leaf tea",
    description: "Assam, jasmine green, or peppermint. Timer on the saucer.",
    basePrice: 3.0,
    dietary: ["VG", "GF"],
    customisable: false,
    caffeineFree: true,
  },
  {
    id: "cardamom-bun",
    category: "bakery",
    name: "Cardamom bun",
    description: "Laminated, twisted and glazed. Gone by eleven most days.",
    basePrice: 3.8,
    dietary: ["V", "N"],
    customisable: false,
    signature: true,
  },
  {
    id: "banana-bread",
    category: "bakery",
    name: "Banana bread",
    description: "Toasted on the plancha, salted butter on the side.",
    basePrice: 3.4,
    dietary: ["V", "N"],
    customisable: false,
  },
  {
    id: "almond-croissant",
    category: "bakery",
    name: "Almond croissant",
    description: "Yesterday's croissant, frangipane, baked again. Better for it.",
    basePrice: 3.9,
    dietary: ["V", "N"],
    customisable: false,
  },
  {
    id: "flourless-brownie",
    category: "bakery",
    name: "Flourless brownie",
    description: "Dense, fudged, made with the same chocolate as the mocha.",
    basePrice: 3.5,
    dietary: ["V", "GF"],
    customisable: false,
  },
  {
    id: "sourdough-toast",
    category: "bakery",
    name: "Sourdough & cultured butter",
    description: "Two thick slices, sea salt. Add honey or marmalade.",
    basePrice: 3.2,
    dietary: ["V"],
    customisable: false,
    soldOut: true,
  },
];

export function itemsByCategory(categoryId: string): MenuItem[] {
  return MENU_ITEMS.filter((item) => item.category === categoryId);
}

export function getMenuItem(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((item) => item.id === id);
}
