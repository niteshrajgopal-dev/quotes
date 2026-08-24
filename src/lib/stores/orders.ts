"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine, Fulfilment } from "./cart";

export type PlacedOrder = {
  reference: string;
  placedAt: string;
  readyAt: string;
  fulfilment: Fulfilment;
  locationId: string | null;
  customerName: string;
  lines: CartLine[];
  total: number;
  stampsEarned: number;
};

type OrderState = {
  orders: PlacedOrder[];
  place: (order: PlacedOrder) => void;
  latest: () => PlacedOrder | undefined;
  byReference: (reference: string) => PlacedOrder | undefined;
};

export const useOrders = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      place: (order) => set({ orders: [order, ...get().orders].slice(0, 20) }),
      latest: () => get().orders[0],
      byReference: (reference) =>
        get().orders.find((order) => order.reference === reference),
    }),
    {
      name: "quotes.orders.v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/** Human-readable reference in the brand's voice: QT-4F2A. */
export function makeReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let index = 0; index < 4; index += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `QT-${suffix}`;
}
