import type { StorefrontLocale } from "@/lib/locale/storefront-locale";

/**
 * Normalize product names for display by converting ALL-CAPS words to Title Case.
 * This is a render-time transformation only and does not modify catalogue data.
 *
 * Rules:
 * - Only applies to Latin uppercase words (A-Z)
 * - Works in both EN and AR locales (normalizes Latin text only, Arabic text unaffected)
 * - Preserves words containing digits (e.g., V60, B12)
 * - Preserves short acronyms (e.g., UK, USA, EU)
 * - Converts words like MALAYSIA → Malaysia
 * - Preserves already mixed-case words
 * - Handles punctuation and hyphens correctly
 *
 * @param name - The product display name from the catalogue
 * @param locale - The storefront locale (en or ar) - currently unused but kept for future use
 * @returns The normalized display name
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function normalizeProductName(name: string, locale: StorefrontLocale): string {
  if (!name || name.trim() === "") {
    return name;
  }

  return name.replace(/\b([A-Z]{2,})\b/g, (match) => {
    if (/\d/.test(match)) {
      return match;
    }

    if (match.length <= 3 && match.length >= 2) {
      const commonAcronyms = new Set([
        "UK",
        "US",
        "USA",
        "EU",
        "UAE",
        "UAE",
        "CEO",
        "CFO",
        "CTO",
        "API",
        "FAQ",
        "PDF",
        "URL",
        "ISO",
        "GMT",
        "UTC",
      ]);
      if (commonAcronyms.has(match)) {
        return match;
      }
    }

    return match.charAt(0) + match.slice(1).toLowerCase();
  });
}
