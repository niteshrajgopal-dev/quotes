"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bean } from "@/components/brand/bean";
import { ButtonLink } from "@/components/ui/button";
import { Card, EmptyState } from "@/components/ui/card";
import { CartLineRow } from "@/components/cart/cart-line-row";
import { OrderSummary } from "@/components/cart/order-summary";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { useCart } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/use-hydrated";

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const lines = useCart((state) => state.lines);

  return (
    <section className="wrap pt-[clamp(32px,5vw,64px)] pb-[clamp(48px,7vw,88px)]">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
          <li>
            <Link href="/shop" className="transition-colors duration-fast hover:text-fg">
              Coffee
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-fg">Checkout</li>
        </ol>
      </nav>

      <header className="mb-9 flex flex-col gap-4">
        <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
          <Bean className="w-[0.9em]" />
          Checkout
        </span>
        <h1 className="t-display-m">One last look.</h1>
      </header>

      {!hydrated ? (
        <div className="flex items-center gap-3 py-16 text-muted">
          <Bean className="w-5 animate-bean-spin" />
          <span className="text-[14px]">Loading your bag…</span>
        </div>
      ) : lines.length === 0 ? (
        <EmptyState
          title="Your bag is empty"
          body="Add a bag of beans or something from the café menu, then come back here."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <ButtonLink href="/shop" size="sm">
                Shop coffee
              </ButtonLink>
              <ButtonLink href="/menu" variant="secondary" size="sm">
                Café menu
              </ButtonLink>
            </div>
          }
        />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <CheckoutForm onPlaced={(order) => router.push(`/orders/${order.reference}`)} />

          <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:h-fit">
            <Card className="flex flex-col gap-5">
              <h2 className="t-label">Your bag</h2>
              <ul className="flex flex-col border-t border-line">
                {lines.map((line) => (
                  <CartLineRow key={line.id} line={line} compact />
                ))}
              </ul>
              <OrderSummary />
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}
