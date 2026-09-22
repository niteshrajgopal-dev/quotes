"use client";

import { useEffect } from "react";

import { localeDirection, type StorefrontLocale } from "@/lib/locale/storefront-locale";
import { useStorefrontLocale } from "@/lib/stores/storefront-locale";

export function StorefrontLocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: StorefrontLocale;
  children: React.ReactNode;
}) {
  const locale = useStorefrontLocale((state) => state.locale);
  const hydrated = useStorefrontLocale((state) => state.hydrated);
  const hydrate = useStorefrontLocale((state) => state.hydrate);

  useEffect(() => {
    hydrate(initialLocale);
  }, [hydrate, initialLocale]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    document.documentElement.lang = locale;
    document.documentElement.dir = localeDirection(locale);
  }, [hydrated, locale]);

  return children;
}
