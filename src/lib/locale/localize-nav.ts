import { storefrontMessage } from "@/lib/locale/messages";
import type { StorefrontLocale } from "@/lib/locale/storefront-locale";
import type { StorefrontShellNavItem } from "@/lib/storefront/theme-presets";

export function localizeShellNav(
  items: StorefrontShellNavItem[],
  locale: StorefrontLocale,
): StorefrontShellNavItem[] {
  return items.map((item) => ({
    ...item,
    label: item.labelKey
      ? storefrontMessage(locale, item.labelKey)
      : item.label,
    hint: item.hintKey ? storefrontMessage(locale, item.hintKey) : item.hint,
  }));
}
