import { localizeShellNav } from "@/lib/locale/localize-nav";
import type { StorefrontLocale } from "@/lib/locale/storefront-locale";
import { resolveFooterStatement } from "@/lib/storefront/content-blocks";
import type { StorefrontContext } from "@/lib/storefront/context.server";
import type { StorefrontManifestResponse } from "@/lib/storefront/manifest-types";
import {
  buildManifestThemeCssVariables,
  resolveManifestThemeTokens,
} from "@/lib/storefront/theme-tokens";
import { resolveTenantAssetPack } from "@/lib/storefront/tenant-assets";
import type { StorefrontShellSnapshot } from "@/lib/stores/storefront-shell";

export function resolveLocaleSelectorEnabled(manifest: StorefrontManifestResponse) {
  if (manifest.features.localeSelector) {
    return true;
  }

  const supported = manifest.supportedLocales ?? [];
  return supported.includes("en") && supported.includes("ar");
}

export function toStorefrontShellSnapshot(
  context: StorefrontContext,
  locale: StorefrontLocale,
): StorefrontShellSnapshot {
  const themeTokens = resolveManifestThemeTokens(context.manifest.theme);
  const assets = resolveTenantAssetPack(context.themePreset.id);

  return {
    locale,
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
    primaryNav: localizeShellNav(context.primaryNav, locale),
    tabNav: localizeShellNav(context.tabNav, locale),
    localeSelectorEnabled: resolveLocaleSelectorEnabled(context.manifest),
    supportedLocales: context.manifest.supportedLocales,
    defaultLocale: context.manifest.defaultLocale,
    selectedLocationPublicId: context.locationPublicId,
    locations: context.manifest.locations,
    themeCssVariables: themeTokens
      ? buildManifestThemeCssVariables(themeTokens)
      : undefined,
  };
}
