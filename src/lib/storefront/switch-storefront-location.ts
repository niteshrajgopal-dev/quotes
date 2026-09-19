"use client";

import { writeClientStorefrontLocation } from "@/lib/storefront/storefront-location";
import { useCart } from "@/lib/stores/cart";
import { useQosBasket } from "@/lib/stores/qos-basket";

/** Writes the branch cookie and rebinds the anonymous basket before menu refresh. */
export async function switchStorefrontLocation(
  locationPublicId: string,
  _currentLocationPublicId?: string | null,
): Promise<boolean> {
  const trimmed = locationPublicId.trim();
  if (!trimmed) {
    return false;
  }

  writeClientStorefrontLocation(trimmed);
  useCart.getState().setLocation(trimmed);
  await useQosBasket.getState().rebindForSelectedLocation(trimmed, { force: true });
  return true;
}
