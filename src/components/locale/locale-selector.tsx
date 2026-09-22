"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/cn";
import { storefrontMessage } from "@/lib/locale/messages";
import type { StorefrontLocale } from "@/lib/locale/storefront-locale";
import { useStorefrontLocale } from "@/lib/stores/storefront-locale";

type LocaleSelectorProps = {
  compact?: boolean;
  onDark?: boolean;
  className?: string;
  supportedLocales?: string[];
};

export function LocaleSelector({
  compact = false,
  onDark = false,
  className,
  supportedLocales,
}: LocaleSelectorProps) {
  const router = useRouter();
  const locale = useStorefrontLocale((state) => state.locale);
  const setLocale = useStorefrontLocale((state) => state.setLocale);

  const options = (["en", "ar"] as const).filter((option) =>
    supportedLocales ? supportedLocales.includes(option) : true,
  );

  if (options.length < 2) {
    return null;
  }

  function choose(nextLocale: StorefrontLocale) {
    if (nextLocale === locale) {
      return;
    }

    setLocale(nextLocale);
    router.refresh();
  }

  return (
    <div
      role="group"
      aria-label={storefrontMessage(locale, "localeLabel")}
      className={cn(
        "inline-flex rounded-full border p-0.5",
        onDark ? "border-cream/20 bg-cream/8" : "border-line bg-surface",
        compact ? "text-[11px]" : "text-[12px]",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={locale === option}
          onClick={() => choose(option)}
          className={cn(
            "min-h-9 rounded-full px-3 font-medium transition-colors duration-fast ease-brand no-tap-highlight",
            locale === option
              ? onDark
                ? "bg-cream text-espresso"
                : "bg-espresso text-cream"
              : onDark
                ? "text-cream/75 hover:text-cream"
                : "text-muted hover:text-fg",
          )}
        >
          {option === "en"
            ? storefrontMessage(locale, "localeEnglish")
            : storefrontMessage(locale, "localeArabic")}
        </button>
      ))}
    </div>
  );
}
