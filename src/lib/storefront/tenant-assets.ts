import type { StorefrontThemePresetId } from "@/lib/storefront/theme-presets";

export type TenantAssetPack = {
  /** Root URL prefix for this tenant's static files. */
  basePath: string;
  logoSrc: string;
  logoOnDarkSrc: string;
  markSrc: string;
  themeColor: string;
};

const HOSPITALITY_BASE = "/tenants/hospitality";
const RETAIL_BASE = "/tenants/retail";

export const TENANT_ASSET_PACKS: Record<StorefrontThemePresetId, TenantAssetPack> = {
  hospitality_baseline: {
    basePath: HOSPITALITY_BASE,
    logoSrc: `${HOSPITALITY_BASE}/brand/quotes-logo.png`,
    logoOnDarkSrc: `${HOSPITALITY_BASE}/media/logo-cream.png`,
    markSrc: `${HOSPITALITY_BASE}/media/bean.png`,
    themeColor: "#F5F1E9",
  },
  generic_retail_baseline: {
    basePath: RETAIL_BASE,
    logoSrc: `${RETAIL_BASE}/brand/flower-mark.svg`,
    logoOnDarkSrc: `${RETAIL_BASE}/brand/flower-mark.svg`,
    markSrc: `${RETAIL_BASE}/brand/flower-mark.svg`,
    themeColor: "#FFF7ED",
  },
};

export function resolveTenantAssetPack(
  presetId: StorefrontThemePresetId,
): TenantAssetPack {
  return TENANT_ASSET_PACKS[presetId];
}

/** Hospitality-only media under `/tenants/hospitality/media/`. */
export function hospitalityMedia(filename: string): string {
  return `${HOSPITALITY_BASE}/media/${filename}`;
}

/** Floréa retail hero assets under `/tenants/retail/hero/`. */
export function retailHeroMedia(filename: string): string {
  return `${RETAIL_BASE}/hero/${filename}`;
}
