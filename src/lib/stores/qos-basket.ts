"use client";

import { create } from "zustand";

import { QosRequestError } from "@/lib/qos/api-client";
import { readClientStorefrontLocation } from "@/lib/storefront/storefront-location";
import { useStorefrontLocale } from "@/lib/stores/storefront-locale";
import {
  basketMatchesSelectedLocation,
  ensureActiveBasket,
  shouldRebindBasketForLocation,
  fetchCurrentCustomerSignedIn,
  rebindAnonymousBasketForLocation,
  removeAccountBasketLine,
  removeAnonymousBasketLine,
  upsertAccountBasketLine,
  upsertAnonymousBasketLine,
  updateAnonymousBasketLine,
} from "@/lib/qos/basket-client";
import type { BasketContextResponse } from "@/lib/qos/types";

type BasketStatus = "idle" | "loading" | "ready" | "mutating" | "error";

type QosBasketState = {
  basket: BasketContextResponse | null;
  signedIn: boolean;
  status: BasketStatus;
  error: string | null;
  productLabels: Record<string, string>;
  hydrate: (locale?: "en" | "ar", locationPublicId?: string | null) => Promise<void>;
  rebindForSelectedLocation: (
    locationPublicId: string,
    options?: { force?: boolean },
  ) => Promise<void>;
  upsertProduct: (input: {
    productPublicId: string;
    displayName: string;
    quantity?: number;
  }) => Promise<boolean>;
  setLineQuantity: (linePublicId: string, quantity: number) => Promise<void>;
  removeLine: (linePublicId: string) => Promise<void>;
  rememberProductLabel: (productPublicId: string, displayName: string) => void;
  clearError: () => void;
};

function applyBasket(
  set: (partial: Partial<QosBasketState>) => void,
  basket: BasketContextResponse,
  signedIn: boolean,
) {
  set({
    basket,
    signedIn,
    status: "ready",
    error: null,
  });
}

function formatBasketMutationError(error: unknown) {
  if (error instanceof QosRequestError) {
    if (error.statusCode === 400 && error.field === "productPublicId") {
      return "This item isn't on the menu for your selected café. Switch branch or refresh your bag.";
    }

    return error.message;
  }

  return error instanceof Error ? error.message : "Basket update failed.";
}

async function mutateBasket(
  get: () => QosBasketState,
  set: (partial: Partial<QosBasketState>) => void,
  mutation: () => Promise<BasketContextResponse>,
): Promise<boolean> {
  set({ status: "mutating", error: null });

  try {
    const basket = await mutation();
    applyBasket(set, basket, get().signedIn);
    return true;
  } catch (error) {
    if (error instanceof QosRequestError && error.statusCode === 409) {
      await get().hydrate();
      set({
        status: "error",
        error: "Basket changed elsewhere. Review the updated bag and try again.",
      });
      return false;
    }

    set({
      status: get().basket ? "ready" : "error",
      error: formatBasketMutationError(error),
    });
    return false;
  }
}

export const useQosBasket = create<QosBasketState>((set, get) => ({
  basket: null,
  signedIn: false,
  status: "idle",
  error: null,
  productLabels: {},

  hydrate: async (locale, locationPublicId) => {
    set({ status: "loading", error: null });

    const activeLocale = locale ?? useStorefrontLocale.getState().locale ?? "en";
    const activeLocation =
      locationPublicId ?? readClientStorefrontLocation();

    try {
      const signedIn = await fetchCurrentCustomerSignedIn();
      const result = await ensureActiveBasket(activeLocale, activeLocation);
      applyBasket(set, result.basket, signedIn);
    } catch (error) {
      set({
        basket: null,
        signedIn: false,
        status: "error",
        error: error instanceof Error ? error.message : "Unable to load basket.",
      });
    }
  },

  rebindForSelectedLocation: async (locationPublicId, options) => {
    const trimmed = locationPublicId.trim();
    if (!trimmed) {
      return;
    }

    const current = get().basket;
    if (!shouldRebindBasketForLocation(current, trimmed, options)) {
      if (current) {
        applyBasket(set, current, get().signedIn);
      }
      return;
    }

    set({ status: "loading", error: null, productLabels: {} });

    const activeLocale = useStorefrontLocale.getState().locale ?? "en";

    try {
      const signedIn = await fetchCurrentCustomerSignedIn();
      if (signedIn) {
        await get().hydrate(activeLocale, trimmed);
        return;
      }

      const result = await rebindAnonymousBasketForLocation(activeLocale);
      applyBasket(set, result.basket, false);
    } catch (error) {
      set({
        basket: null,
        signedIn: false,
        status: "error",
        error: error instanceof Error ? error.message : "Unable to rebind basket.",
      });
    }
  },

  rememberProductLabel: (productPublicId, displayName) => {
    set({
      productLabels: {
        ...get().productLabels,
        [productPublicId]: displayName,
      },
    });
  },

  upsertProduct: async ({ productPublicId, displayName, quantity = 1 }) => {
    get().rememberProductLabel(productPublicId, displayName);

    let basket = get().basket;
    if (!basket) {
      await get().hydrate();
      basket = get().basket;
    }
    if (!basket) {
      return false;
    }

    const selectedLocation = readClientStorefrontLocation();
    if (!get().signedIn && !basketMatchesSelectedLocation(basket, selectedLocation)) {
      await get().rebindForSelectedLocation(selectedLocation ?? basket.locationPublicId, {
        force: true,
      });
      basket = get().basket;
      if (!basket) {
        return false;
      }
    }

    const existingLine = basket.lines.find((line) => line.productPublicId === productPublicId);
    const nextQuantity = existingLine ? existingLine.quantity + quantity : quantity;

    const succeeded = await mutateBasket(get, set, async () => {
      const signedIn = get().signedIn;
      const current = get().basket!;
      const mutationId = crypto.randomUUID();

      if (signedIn) {
        const response = await upsertAccountBasketLine({
          productPublicId,
          quantity: nextQuantity,
          expectedVersion: current.version,
          mutationId,
        });
        return response.basket;
      }

      const response = await upsertAnonymousBasketLine({
        productPublicId,
        quantity: nextQuantity,
        expectedVersion: current.version,
        mutationId,
      });
      return response.basket;
    });

    if (!succeeded && !get().signedIn && selectedLocation) {
      const current = get().basket;
      if (current && !basketMatchesSelectedLocation(current, selectedLocation)) {
        await get().rebindForSelectedLocation(selectedLocation, { force: true });
        const rebound = get().basket;
        if (!rebound) {
          return false;
        }

        const reboundLine = rebound.lines.find((line) => line.productPublicId === productPublicId);
        const reboundQuantity = reboundLine ? reboundLine.quantity + quantity : quantity;

        return mutateBasket(get, set, async () => {
          const response = await upsertAnonymousBasketLine({
            productPublicId,
            quantity: reboundQuantity,
            expectedVersion: rebound.version,
            mutationId: crypto.randomUUID(),
          });
          return response.basket;
        });
      }
    }

    return succeeded;
  },

  setLineQuantity: async (linePublicId, quantity) => {
    const basket = get().basket;
    if (!basket) {
      return;
    }

    await mutateBasket(get, set, async () => {
      const signedIn = get().signedIn;
      const current = get().basket!;
      const mutationId = crypto.randomUUID();

      if (signedIn) {
        const response = await upsertAccountBasketLine({
          productPublicId:
            current.lines.find((line) => line.linePublicId === linePublicId)?.productPublicId ??
            "",
          quantity,
          expectedVersion: current.version,
          mutationId,
        });
        return response.basket;
      }

      const response = await updateAnonymousBasketLine(linePublicId, {
        quantity,
        expectedVersion: current.version,
        mutationId,
      });
      return response.basket;
    });
  },

  removeLine: async (linePublicId) => {
    const basket = get().basket;
    if (!basket) {
      return;
    }

    await mutateBasket(get, set, async () => {
      const signedIn = get().signedIn;
      const current = get().basket!;
      const mutationId = crypto.randomUUID();

      if (signedIn) {
        const response = await removeAccountBasketLine(linePublicId, {
          expectedVersion: current.version,
          mutationId,
        });
        return response.basket;
      }

      const response = await removeAnonymousBasketLine(linePublicId, {
        expectedVersion: current.version,
        mutationId,
      });
      return response.basket;
    });
  },

  clearError: () => set({ error: null }),
}));

export function selectBasketItemCount(state: QosBasketState) {
  return state.basket?.itemCount ?? 0;
}
