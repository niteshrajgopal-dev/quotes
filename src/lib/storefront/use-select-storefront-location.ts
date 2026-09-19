"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { switchStorefrontLocation } from "@/lib/storefront/switch-storefront-location";

export function useSelectStorefrontLocation() {
  const router = useRouter();

  return useCallback(
    async (locationPublicId: string, currentLocationPublicId?: string | null) => {
      const switched = await switchStorefrontLocation(
        locationPublicId,
        currentLocationPublicId,
      );
      if (switched) {
        router.refresh();
      }
    },
    [router],
  );
}
