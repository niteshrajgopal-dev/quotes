"use client";

import { useEffect } from "react";

import { StorefrontBasketLocationSync } from "@/components/qos/storefront-basket-location-sync";
import { readClientStorefrontLocation } from "@/lib/storefront/storefront-location";
import { useQosBasket } from "@/lib/stores/qos-basket";
import { useStorefrontLocale } from "@/lib/stores/storefront-locale";

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useQosBasket((state) => state.hydrate);
  const locale = useStorefrontLocale((state) => state.locale);
  const localeHydrated = useStorefrontLocale((state) => state.hydrated);

  useEffect(() => {
    if (!localeHydrated) {
      return;
    }

    void hydrate(locale, readClientStorefrontLocation());
  }, [hydrate, locale, localeHydrated]);

  return (
    <>
      <StorefrontBasketLocationSync />
      {children}
    </>
  );
}
