"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Bean } from "@/components/brand/bean";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, TravelArrow } from "@/components/ui/button";
import { Card, EmptyState } from "@/components/ui/card";
import { CartLineRow } from "@/components/cart/cart-line-row";
import { StampCard } from "@/components/brand/stamp-card";
import { useOrders } from "@/lib/stores/orders";
import { getLocation } from "@/lib/fixtures/quotes-design-reference/locations";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice } from "@/lib/fixtures/quotes-design-reference/brand";

export default function OrderConfirmationPage() {
  const params = useParams<{ reference: string }>();
  const hydrated = useHydrated();
  const orders = useOrders((state) => state.orders);

  const reference = decodeURIComponent(params.reference ?? "");
  const order = orders.find((candidate) => candidate.reference === reference);

  if (!hydrated) {
    return (
      <section className="wrap flex items-center gap-3 py-24 text-muted">
        <Bean className="w-5 animate-bean-spin" />
        <span className="text-[14px]">Looking up {reference}…</span>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="wrap py-[clamp(48px,8vw,96px)]">
        <EmptyState
          title={`No order under ${reference}`}
          body="Order references are stored on the device that placed them. If you ordered on another phone, check the receipt email."
          action={
            <ButtonLink href="/shop" size="sm">
              Back to the shop
            </ButtonLink>
          }
        />
      </section>
    );
  }

  const location = order.locationId ? getLocation(order.locationId) : undefined;

  return (
    <section className="wrap pt-[clamp(32px,5vw,64px)] pb-[clamp(48px,7vw,88px)]">
      <div className="flex flex-col gap-5">
        <Badge tone="success">Order confirmed</Badge>
        <h1 className="t-display-m max-w-[24ch]">
          Thanks, {order.customerName.split(" ")[0]}. It&apos;s roasting.
        </h1>
        <p className="max-w-[52ch] text-[16px] leading-relaxed text-mocha">
          A receipt is on its way. Keep the reference handy —{" "}
          {order.fulfilment === "pickup"
            ? "the bar will ask for it."
            : "it tracks the parcel."}
        </p>
      </div>

      <div className="mt-9 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
        <div className="flex flex-col gap-6">
          <Card className="p-0">
            <dl className="grid gap-5 p-6 sm:grid-cols-3">
              <div>
                <dt className="t-label mb-2">Reference</dt>
                <dd className="font-mono text-[18px]">{order.reference}</dd>
              </div>
              <div>
                <dt className="t-label mb-2">
                  {order.fulfilment === "pickup" ? "Ready at" : "Arrives"}
                </dt>
                <dd className="font-mono text-[18px]">{order.readyAt}</dd>
              </div>
              <div>
                <dt className="t-label mb-2">Total</dt>
                <dd className="font-mono text-[18px]">{formatPrice(order.total)}</dd>
              </div>
            </dl>

            {location ? (
              <div className="border-t border-line p-6">
                <h2 className="t-label mb-3">Collect from</h2>
                <p className="text-[15px] font-medium">{location.name}</p>
                <p className="t-caption mt-1">{location.address.join(", ")}</p>
                <Link
                  href={`/locations#${location.id}`}
                  className="group mt-4 inline-flex items-center gap-2 text-[13.5px] font-medium"
                >
                  Opening hours and directions
                  <TravelArrow className="text-latte" />
                </Link>
              </div>
            ) : null}
          </Card>

          <div>
            <h2 className="t-label mb-3">What you ordered</h2>
            <ul className="flex flex-col border-t border-line">
              {order.lines.map((line) => (
                <CartLineRow key={line.id} line={line} readOnly compact />
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {order.stampsEarned > 0 ? (
            <Card className="flex flex-col gap-4">
              <h2 className="t-label">
                {order.stampsEarned} stamp{order.stampsEarned === 1 ? "" : "s"} earned
              </h2>
              <StampCard stamps={order.stampsEarned} size="md" />
              <p className="t-caption">
                Added to your bean card. Eight stamps make a free coffee.
              </p>
              <ButtonLink href="/loyalty" variant="secondary" size="sm">
                Open your card
              </ButtonLink>
            </Card>
          ) : null}

          <Card dark className="flex flex-col gap-4">
            <Bean onDark className="w-5" />
            <p className="font-serif text-[22px] leading-tight text-cream">
              Some conversations deserve another coffee.
            </p>
            <ButtonLink href="/journal" variant="inverse" size="sm" className="group self-start">
              Read the journal
              <TravelArrow className="text-latte" />
            </ButtonLink>
          </Card>
        </div>
      </div>
    </section>
  );
}
