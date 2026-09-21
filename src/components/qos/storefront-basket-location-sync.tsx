"use client";

import { useEffect, useRef } from "react";

import { shouldRebindBasketForLocation } from "@/lib/qos/basket-client";
import { readClientStorefrontLocation } from "@/lib/storefront/storefront-location";
import { useQosBasket } from "@/lib/stores/qos-basket";
import { useStorefrontShell } from "@/lib/stores/storefront-shell";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * Keeps the anonymous basket aligned with qos.location after RSC refresh or
 * any path that updates the branch cookie/menu without going through the picker.
 *
 * Uses a non-forced rebind so a full reload does not POST a fresh empty basket
 * when the cookie and current basket already share the same branch. Only the
 * explicit qos.location cookie triggers sync — shell defaults must not wipe bags.
 */
export function StorefrontBasketLocationSync() {
  const shell = useStorefrontShell();
  const hydrated = useHydrated();
  const basket = useQosBasket((state) => state.basket);
  const signedIn = useQosBasket((state) => state.signedIn);
  const status = useQosBasket((state) => state.status);
  const rebindForSelectedLocation = useQosBasket((state) => state.rebindForSelectedLocation);
  const rebindingRef = useRef(false);

  useEffect(() => {
    if (!hydrated || signedIn || status === "loading" || status === "mutating") {
      return;
    }

    const cookieLocation = readClientStorefrontLocation();
    if (!cookieLocation || !shouldRebindBasketForLocation(basket, cookieLocation)) {
      return;
    }

    if (rebindingRef.current) {
      return;
    }

    rebindingRef.current = true;
    void rebindForSelectedLocation(cookieLocation).finally(() => {
      rebindingRef.current = false;
    });
  }, [
    hydrated,
    signedIn,
    status,
    basket?.locationPublicId,
    basket?.basketPublicId,
    shell.selectedLocationPublicId,
    rebindForSelectedLocation,
  ]);

  return null;
}
