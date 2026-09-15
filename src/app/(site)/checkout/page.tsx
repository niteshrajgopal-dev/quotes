"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/card";
import { PageLoadState } from "@/components/ui/page-load-state";
import { QosCartLineRow } from "@/components/cart/qos-cart-line-row";
import { OrderSummary } from "@/components/cart/order-summary";
import { QosCheckoutHandoff } from "@/components/checkout/qos-checkout-handoff";
import { useQosBasket, selectBasketItemCount } from "@/lib/stores/qos-basket";
import { useHydrated } from "@/lib/use-hydrated";

export default function CheckoutPage() {
  const hydrated = useHydrated();
  const basket = useQosBasket((state) => state.basket);
  const itemCount = useQosBasket(selectBasketItemCount);

  return (
    <section className="wrap pb-[clamp(48px,7vw,88px)]">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
          <li>
            <Link href="/order" className="transition-colors duration-fast hover:text-fg">
              Order
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/menu" className="transition-colors duration-fast hover:text-fg">
              Menu
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-fg">Checkout</li>
        </ol>
      </nav>

      {!hydrated ? (
        <PageLoadState label="Loading your bag…" />
      ) : itemCount === 0 || !basket ? (
        <EmptyState
          title="Your bag is empty"
          body="Add something from the published café menu, then come back here."
          action={
            <ButtonLink href="/menu" size="sm">
              Café menu
            </ButtonLink>
          }
        />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <div className="flex flex-col gap-8">
            <QosCheckoutHandoff />
          </div>

          <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:h-fit">
            <div className="flex flex-col gap-5 rounded-md border border-cream/8 bg-espresso p-6 text-cream">
              <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-latte">
                Your bag
              </h2>
              <ul className="flex flex-col border-t border-cream/14">
                {basket.lines.map((line) => (
                  <QosCartLineRow
                    key={line.linePublicId}
                    line={line}
                    currency={basket.currency}
                    locale={basket.locale}
                    compact
                    tone="dark"
                  />
                ))}
              </ul>
              <OrderSummary tone="dark" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
