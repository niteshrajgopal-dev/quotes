"use client";

import { shouldRebindBasketForLocation } from "@/lib/qos/basket-client";
import { writeClientStorefrontLocation } from "@/lib/storefront/storefront-location";
import { useCart } from "@/lib/stores/cart";
import { useQosBasket } from "@/lib/stores/qos-basket";

export function shouldSwitchStorefrontLocation(
  locationPublicId: string,
  currentLocationPublicId?: string | null,
) {
  const trimmed = locationPublicId.trim();
  if (!trimmed) {
    return false;
  }

  const basket = useQosBasket.getState().basket;
  const uiAlreadySelected = trimmed === currentLocationPublicId?.trim();

  if (uiAlreadySelected && !shouldRebindBasketForLocation(basket, trimmed)) {
    return false;
  }

  return true;
}

/** Writes the branch cookie and rebinds the anonymous basket before menu refresh. */
export async function switchStorefrontLocation(
  locationPublicId: string,
  currentLocationPublicId?: string | null,
): Promise<boolean> {
  const trimmed = locationPublicId.trim();
  if (!shouldSwitchStorefrontLocation(trimmed, currentLocationPublicId)) {
    return false;
  }

  writeClientStorefrontLocation(trimmed);
  useCart.getState().setLocation(trimmed);
  await useQosBasket.getState().rebindForSelectedLocation(trimmed, { force: true });
  return true;
}
