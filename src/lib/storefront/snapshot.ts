import type { StorefrontLocale } from "@/lib/locale/storefront-locale";
import { resolveFooterStatement } from "@/lib/storefront/content-blocks";
import type { StorefrontContext } from "@/lib/storefront/context.server";
import {
  buildManifestThemeCssVariables,
  resolveManifestThemeTokens,
} from "@/lib/storefront/theme-tokens";
import { resolveTenantAssetPack } from "@/lib/storefront/tenant-assets";
import type { StorefrontShellSnapshot } from "@/lib/stores/storefront-shell";

export function toStorefrontShellSnapshot(
  context: StorefrontContext,
  locale: StorefrontLocale,
): StorefrontShellSnapshot {
  const themeTokens = resolveManifestThemeTokens(context.manifest.theme);
  const assets = resolveTenantAssetPack(context.themePreset.id);

  return {
    brandName: context.brandName,
    hostname: context.hostname,
    themePresetId: context.themePreset.id,
    dataTheme: context.themePreset.dataTheme,
    logoSrc: assets.logoSrc,
    logoOnDarkSrc: assets.logoOnDarkSrc,
    markSrc: assets.markSrc,
    themeColor: assets.themeColor,
    logoAlt: `${context.brandName} — home`,
    headerChip: context.themePreset.headerChip,
    footerStatement: resolveFooterStatement(
      context.themePreset.id,
      context.manifest.contentBlocks,
      locale,
      context.themePreset.footerStatement,
    ),
    primaryNav: context.primaryNav,
    tabNav: context.tabNav,
    localeSelectorEnabled: context.manifest.features.localeSelector,
    supportedLocales: context.manifest.supportedLocales,
    defaultLocale: context.manifest.defaultLocale,
    locations: context.manifest.locations,
    themeCssVariables: themeTokens
      ? buildManifestThemeCssVariables(themeTokens)
      : undefined,
  };
}
