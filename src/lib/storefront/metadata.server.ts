import type { Metadata } from "next";

import type { StorefrontContext } from "@/lib/storefront/context.server";
import { resolveHeroContentBlock } from "@/lib/storefront/content-blocks";
import { resolveTenantAssetPack } from "@/lib/storefront/tenant-assets";

export function buildStorefrontMetadata(context: StorefrontContext): Metadata {
  const defaultLocale = context.manifest.defaultLocale === "ar" ? "ar" : "en";
  const hero = resolveHeroContentBlock(
    context.themePreset.id,
    context.manifest.contentBlocks,
    defaultLocale,
  );
  const description =
    hero?.subtitle ??
    `${context.brandName} storefront served from ${context.hostname}.`;
  const icon = context.themePreset.logoSrc;

  return {
    metadataBase: new URL(`https://${context.hostname}`),
    title: {
      default: context.brandName,
      template: `%s · ${context.brandName}`,
    },
    description,
    applicationName: context.brandName,
    openGraph: {
      title: context.brandName,
      description,
      type: "website",
      siteName: context.brandName,
    },
    icons: {
      icon,
      apple: icon,
    },
    themeColor: resolveTenantAssetPack(context.themePreset.id).themeColor,
  };
}
