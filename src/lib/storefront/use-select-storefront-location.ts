"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { writeClientStorefrontLocation } from "@/lib/storefront/storefront-location";
import { useCart } from "@/lib/stores/cart";

export function useSelectStorefrontLocation() {
  const router = useRouter();
  const setLocation = useCart((state) => state.setLocation);

  return useCallback(
    (locationPublicId: string, currentLocationPublicId?: string | null) => {
      const trimmed = locationPublicId.trim();
      if (!trimmed || trimmed === currentLocationPublicId) {
        return;
      }

      writeClientStorefrontLocation(trimmed);
      setLocation(trimmed);
      router.refresh();
    },
    [router, setLocation],
  );
}
