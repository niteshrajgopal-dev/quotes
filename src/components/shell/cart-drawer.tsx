"use client";

import { useRouter } from "next/navigation";
import { Sheet } from "@/components/ui/sheet";
import { Button, ButtonLink } from "@/components/ui/button";
import { Segmented } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/card";
import { CartLineRow } from "@/components/cart/cart-line-row";
import { OrderSummary } from "@/components/cart/order-summary";
import { computeTotals, useCart, type Fulfilment } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/use-hydrated";

export function CartDrawer() {
  const router = useRouter();
  const hydrated = useHydrated();

  const open = useCart((state) => state.drawerOpen);
  const setDrawerOpen = useCart((state) => state.setDrawerOpen);
  const lines = useCart((state) => state.lines);
  const fulfilment = useCart((state) => state.fulfilment);
  const setFulfilment = useCart((state) => state.setFulfilment);
  const promo = useCart((state) => state.promo);

  const totals = computeTotals({ lines, fulfilment, promo });
  const close = () => setDrawerOpen(false);

  if (!hydrated) return null;

  return (
    <Sheet
      open={open}
      onClose={close}
      title="Your bag"
      description={
        totals.itemCount > 0
          ? `${totals.itemCount} item${totals.itemCount === 1 ? "" : "s"} · ${
              fulfilment === "delivery" ? "delivery" : "collection"
            }`
          : undefined
      }
      footer={
        lines.length > 0 ? (
          <div className="flex flex-col gap-3">
            <OrderSummary />
            <Button
              block
              size="lg"
              onClick={() => {
                close();
                router.push("/checkout");
              }}
            >
              Checkout
            </Button>
            <button
              type="button"
              onClick={close}
              className="min-h-11 rounded-sm text-[13.5px] text-muted transition-colors duration-fast hover:text-fg"
            >
              Keep browsing
            </button>
          </div>
        ) : null
      }
    >
      {lines.length === 0 ? (
        <EmptyState
          title="Nothing in the bag yet"
          body="Start with the Signature Blend, or pick something from the café menu."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <ButtonLink href="/shop" onClick={close} size="sm">
                Shop coffee
              </ButtonLink>
              <ButtonLink href="/menu" variant="secondary" size="sm" onClick={close}>
                Café menu
              </ButtonLink>
            </div>
          }
          className="border-none bg-transparent px-0 py-6"
        />
      ) : (
        <div className="flex flex-col gap-5">
          <Segmented<Fulfilment>
            label="Fulfilment"
            value={fulfilment}
            onChange={setFulfilment}
            options={[
              { value: "pickup", label: "Collect", hint: "From a café" },
              { value: "delivery", label: "Deliver", hint: "Next-day post" },
            ]}
          />
          <ul className="flex flex-col">
            {lines.map((line) => (
              <CartLineRow key={line.id} line={line} compact />
            ))}
          </ul>
        </div>
      )}
    </Sheet>
  );
}
