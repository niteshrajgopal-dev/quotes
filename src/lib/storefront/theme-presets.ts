import type { IconName } from "@/components/brand/icons";
import type { StorefrontMessageKey } from "@/lib/locale/messages";
import type { StorefrontManifestResponse } from "@/lib/storefront/manifest-types";
import { TENANT_ASSET_PACKS } from "@/lib/storefront/tenant-assets";

export type StorefrontThemePresetId =
  | "hospitality_baseline"
  | "generic_retail_baseline";

export type StorefrontShellNavItem = {
  href: string;
  label: string;
  icon: IconName;
  hint?: string;
  labelKey?: StorefrontMessageKey;
  hintKey?: StorefrontMessageKey;
};

export type StorefrontThemePreset = {
  id: StorefrontThemePresetId;
  dataTheme: string;
  logoSrc: string;
  logoAlt: string;
  headerChip?: string;
  footerStatement: string;
  primaryNav: StorefrontShellNavItem[];
  tabNav: StorefrontShellNavItem[];
};

const hospitalityPreset: StorefrontThemePreset = {
  id: "hospitality_baseline",
  dataTheme: "hospitality",
  logoSrc: TENANT_ASSET_PACKS.hospitality_baseline.logoSrc,
  logoAlt: "Storefront home",
  headerChip: "Coffee Co.",
  footerStatement: "Some conversations deserve another coffee.",
  primaryNav: [
    {
      href: "/",
      label: "Home",
      icon: "coffee",
      hint: "Landing and story",
      labelKey: "navHome",
      hintKey: "navHintHome",
    },
    {
      href: "/menu",
      label: "Menu",
      icon: "cup",
      hint: "Espresso bar, filter, bakery",
      labelKey: "navMenu",
      hintKey: "navHintMenu",
    },
    {
      href: "/shop",
      label: "Shop",
      icon: "bean",
      hint: "Beans, single origin and blends",
      labelKey: "navShop",
      hintKey: "navHintShop",
    },
    {
      href: "/order",
      label: "Order",
      icon: "bag",
      hint: "Pickup or delivery in a few taps",
      labelKey: "navOrder",
      hintKey: "navHintOrder",
    },
    {
      href: "/locations",
      label: "Cafés",
      icon: "location",
      hint: "Branches and opening hours",
      labelKey: "navCafes",
      hintKey: "navHintCafes",
    },
    {
      href: "/loyalty",
      label: "Bean card",
      icon: "loyalty",
      hint: "Your bean card and rewards",
      labelKey: "navBeanCard",
      hintKey: "navHintBeanCard",
    },
  ],
  tabNav: [
    { href: "/", label: "Home", icon: "coffee", labelKey: "tabHome" },
    { href: "/menu", label: "Menu", icon: "cup", labelKey: "tabMenu" },
    { href: "/shop", label: "Shop", icon: "bean", labelKey: "tabShop" },
    { href: "/order", label: "Order", icon: "bag", labelKey: "tabOrder" },
    { href: "/loyalty", label: "Card", icon: "loyalty", labelKey: "tabCard" },
  ],
};

const retailPreset: StorefrontThemePreset = {
  id: "generic_retail_baseline",
  dataTheme: "retail",
  logoSrc: TENANT_ASSET_PACKS.generic_retail_baseline.logoSrc,
  logoAlt: "Storefront home",
  footerStatement: "Fresh stems, arranged with care.",
  primaryNav: [
    {
      href: "/menu",
      label: "Shop",
      icon: "bean",
      hint: "Seasonal bouquets and stems",
      labelKey: "navShop",
      hintKey: "navHintRetailShop",
    },
    {
      href: "/order",
      label: "Order",
      icon: "bag",
      hint: "Pickup or delivery",
      labelKey: "navOrder",
      hintKey: "navHintRetailOrder",
    },
    {
      href: "/locations",
      label: "Locations",
      icon: "location",
      hint: "Find a shop",
      labelKey: "navLocations",
      hintKey: "navHintRetailLocations",
    },
  ],
  tabNav: [
    { href: "/", label: "Home", icon: "heart", labelKey: "tabHome" },
    { href: "/menu", label: "Shop", icon: "cup", labelKey: "tabShop" },
    { href: "/order", label: "Order", icon: "bag", labelKey: "tabOrder" },
    { href: "/locations", label: "Visit", icon: "location", labelKey: "tabVisit" },
  ],
};

const PRESETS: Record<StorefrontThemePresetId, StorefrontThemePreset> = {
  hospitality_baseline: hospitalityPreset,
  generic_retail_baseline: retailPreset,
};

function readThemePresetId(manifest: StorefrontManifestResponse): StorefrontThemePresetId {
  const preset = manifest.theme?.preset;
  if (preset === "generic_retail_baseline") {
    return "generic_retail_baseline";
  }
  return "hospitality_baseline";
}

export function resolveStorefrontThemePreset(
  manifest: StorefrontManifestResponse,
): StorefrontThemePreset {
  return PRESETS[readThemePresetId(manifest)];
}

export function resolveStorefrontPrimaryNav(
  manifest: StorefrontManifestResponse,
  preset: StorefrontThemePreset,
): StorefrontShellNavItem[] {
  // Published releases still carry the one-item baseline nav until tenant-specific
  // navigation is configured in QOS admin. Keep the theme preset shell in that case.
  if (manifest.navigation.length < 2) {
    return preset.primaryNav;
  }

  return manifest.navigation.map((item, index) => {
    const presetItem =
      preset.primaryNav.find((entry) => entry.href === item.href) ??
      preset.primaryNav[index];

    return {
      href: item.href,
      label: formatNavigationLabel(item.labelKey),
      icon: presetItem?.icon ?? "bookmark",
      hint: presetItem?.hint,
      labelKey: presetItem?.labelKey,
      hintKey: presetItem?.hintKey,
    };
  });
}

function formatNavigationLabel(labelKey: string) {
  const leaf = labelKey.split(".").pop() ?? labelKey;
  return leaf.charAt(0).toUpperCase() + leaf.slice(1);
}
