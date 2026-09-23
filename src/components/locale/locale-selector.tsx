"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/cn";
import { storefrontMessage } from "@/lib/locale/messages";
import type { StorefrontLocale } from "@/lib/locale/storefront-locale";
import { useStorefrontLocale } from "@/lib/stores/storefront-locale";

type LocaleSelectorProps = {
  compact?: boolean;
  /** Quiet chrome placement — smaller type and tap targets for header corner. */
  mini?: boolean;
  onDark?: boolean;
  className?: string;
  supportedLocales?: string[];
};

export function LocaleSelector({
  compact = false,
  mini = false,
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

  const isQuiet = mini || compact;

  return (
    <div
      role="group"
      data-locale-selector
      aria-label={storefrontMessage(locale, "localeLabel")}
      className={cn(
        "inline-flex rounded-full border",
        mini ? "p-px" : "p-0.5",
        onDark ? "border-cream/15 bg-cream/5" : "border-line bg-surface",
        mini ? "text-[10px]" : compact ? "text-[11px]" : "text-[12px]",
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
            "rounded-full transition-colors duration-fast ease-brand no-tap-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-latte focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
            mini
              ? "min-h-7 px-2 py-0.5"
              : isQuiet
                ? "min-h-8 px-2.5"
                : "min-h-9 px-3",
            locale === option
              ? cn(
                  "font-medium",
                  onDark ? "bg-cream text-espresso" : "bg-espresso text-cream",
                )
              : cn(
                  mini ? "font-normal" : "font-medium",
                  onDark ? "text-cream/60 hover:text-cream" : "text-muted hover:text-fg",
                ),
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
