"use client";

import { useState } from "react";
import Link from "next/link";
import { Bean } from "@/components/brand/bean";
import { Icon } from "@/components/brand/icons";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink, TravelArrow } from "@/components/ui/button";
import { Card, EmptyState, Notice } from "@/components/ui/card";
import { Segmented, Stepper } from "@/components/ui/tabs";
import { StampCard } from "@/components/brand/stamp-card";
import { MenuBoard } from "@/components/menu/menu-board";
import { CartLineRow } from "@/components/cart/cart-line-row";
import { OrderSummary } from "@/components/cart/order-summary";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { computeTotals, useCart, type Fulfilment } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { LOCATIONS, getLocation } from "@/lib/locations";
import { formatPrice } from "@/lib/brand";
import { cn } from "@/lib/cn";
import type { PlacedOrder } from "@/lib/stores/orders";

const STEPS = ["Where", "Menu", "Bag", "Details", "Done"] as const;

export function OrderFlow() {
  const hydrated = useHydrated();
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);

  const lines = useCart((state) => state.lines);
  const fulfilment = useCart((state) => state.fulfilment);
  const setFulfilment = useCart((state) => state.setFulfilment);
  const locationId = useCart((state) => state.locationId);
  const setLocation = useCart((state) => state.setLocation);
  const promo = useCart((state) => state.promo);

  const totals = computeTotals({ lines, fulfilment, promo });
  const chosenLocation = locationId ? getLocation(locationId) : undefined;

  const canLeaveWhere = fulfilment === "delivery" || Boolean(chosenLocation);
  const canLeaveMenu = lines.length > 0;

  const advance = () => {
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!hydrated) {
    return (
      <div className="flex items-center gap-3 py-16 text-muted">
        <Bean className="w-5 animate-bean-spin" />
        <span className="text-[14px]">Loading your bag…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Stepper
        steps={[...STEPS]}
        current={step}
        onStepSelect={placed ? undefined : (index) => setStep(index)}
      />

      {/* ---------- STEP 0 · WHERE ---------- */}
      {step === 0 ? (
        <section aria-label="Choose how to get your order" className="flex flex-col gap-6">
          <Segmented<Fulfilment>
            label="Fulfilment"
            value={fulfilment}
            onChange={setFulfilment}
            options={[
              { value: "pickup", label: "Collect from a café", hint: "Ready in minutes" },
              { value: "delivery", label: "Post me beans", hint: "Next-day delivery" },
            ]}
          />

          {fulfilment === "pickup" ? (
            <>
              <h2 className="t-h1">Which café?</h2>
              <ul className="grid gap-4 md:grid-cols-3">
                {LOCATIONS.map((location) => {
                  const selected = locationId === location.id;
                  return (
                    <li key={location.id}>
                      <button
                        type="button"
                        onClick={() => setLocation(location.id)}
                        aria-pressed={selected}
                        className={cn(
                          "flex h-full w-full flex-col gap-3 rounded-md border p-5 text-left",
                          "transition-[border-color,background-color,box-shadow] duration-std ease-brand",
                          selected
                            ? "border-espresso bg-espresso text-cream shadow-md"
                            : "border-line bg-surface hover:border-latte",
                        )}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <Icon
                            name="location"
                            className={cn("h-5 w-5", selected ? "text-latte" : "text-latte")}
                            strokeWidth={1.7}
                          />
                          <span
                            className={cn(
                              "font-mono text-[11px] tracking-[0.08em] uppercase",
                              selected ? "text-latte" : "text-muted",
                            )}
                          >
                            ~{location.prepMinutes} min
                          </span>
                        </span>
                        <span className={cn("font-serif text-[20px]", selected && "text-cream")}>
                          {location.name.replace("quotes ", "")}
                        </span>
                        <span
                          className={cn(
                            "text-[13px] leading-relaxed",
                            selected ? "text-cream/65" : "text-muted",
                          )}
                        >
                          {location.address.join(", ")}
                        </span>
                        <span
                          className={cn(
                            "mt-auto border-t pt-3 font-mono text-[12px]",
                            selected
                              ? "border-[var(--border-on-dark)] text-cream/70"
                              : "border-line text-muted",
                          )}
                        >
                          {location.hours[0].days} · {location.hours[0].hours}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {chosenLocation ? (
                <Notice tone="success" title={`${chosenLocation.name}.`}>
                  Usually ready in about {chosenLocation.prepMinutes} minutes. Busiest from{" "}
                  {chosenLocation.busyFrom}.
                </Notice>
              ) : (
                <Notice tone="info">Pick a café to see collection times at checkout.</Notice>
              )}
            </>
          ) : (
            <>
              <h2 className="t-h1">Beans by post</h2>
              <p className="max-w-[58ch] text-[16px] leading-relaxed text-mocha">
                Delivery covers retail bags of beans only — drinks are collection from a café.
                Orders placed before 13:00 are roasted and posted the same day.
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/shop" size="md" className="group">
                  Choose your coffee
                  <TravelArrow />
                </ButtonLink>
              </div>
            </>
          )}
        </section>
      ) : null}

      {/* ---------- STEP 1 · MENU ---------- */}
      {step === 1 ? (
        <section aria-label="Choose your drinks" className="flex flex-col gap-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="t-h1">What are you having?</h2>
            {chosenLocation ? (
              <Badge tone="neutral">
                <Icon name="location" className="h-3 w-3" strokeWidth={2} />
                {chosenLocation.name.replace("quotes ", "")}
              </Badge>
            ) : null}
          </div>
          <MenuBoard />
        </section>
      ) : null}

      {/* ---------- STEP 2 · BAG ---------- */}
      {step === 2 ? (
        <section aria-label="Review your bag" className="flex flex-col gap-6">
          <h2 className="t-h1">Your bag</h2>
          {lines.length === 0 ? (
            <EmptyState
              title="Nothing in the bag"
              body="Go back a step and pick something from the menu."
              action={
                <Button variant="secondary" size="sm" onClick={goBack}>
                  Back to the menu
                </Button>
              }
            />
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
              <ul className="flex flex-col border-t border-line">
                {lines.map((line) => (
                  <CartLineRow key={line.id} line={line} />
                ))}
              </ul>
              <Card className="flex h-fit flex-col gap-5">
                <h3 className="t-label">Summary</h3>
                <OrderSummary />
              </Card>
            </div>
          )}
        </section>
      ) : null}

      {/* ---------- STEP 3 · DETAILS ---------- */}
      {step === 3 ? (
        <section aria-label="Your details" className="flex flex-col gap-6">
          <h2 className="t-h1">Nearly there</h2>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
            <CheckoutForm
              onPlaced={(order) => {
                setPlaced(order);
                setStep(4);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
            <Card className="flex h-fit flex-col gap-5">
              <h3 className="t-label">Order summary</h3>
              <ul className="flex flex-col border-t border-line">
                {lines.map((line) => (
                  <CartLineRow key={line.id} line={line} compact readOnly />
                ))}
              </ul>
              <OrderSummary showPromo={false} />
            </Card>
          </div>
        </section>
      ) : null}

      {/* ---------- STEP 4 · DONE ---------- */}
      {step === 4 && placed ? (
        <section aria-label="Order confirmed" className="flex flex-col gap-7">
          <div className="flex flex-col items-start gap-5 rounded-lg border border-line bg-surface p-7 sm:p-10">
            <Badge tone="success">Order confirmed</Badge>
            <h2 className="t-display-m max-w-[22ch]">
              Thanks, {placed.customerName.split(" ")[0]}. It&apos;s in.
            </h2>
            <dl className="grid w-full gap-5 border-y border-line py-6 sm:grid-cols-3">
              <div>
                <dt className="t-label mb-2">Reference</dt>
                <dd className="font-mono text-[18px]">{placed.reference}</dd>
              </div>
              <div>
                <dt className="t-label mb-2">
                  {placed.fulfilment === "pickup" ? "Ready at" : "Arrives"}
                </dt>
                <dd className="font-mono text-[18px]">{placed.readyAt}</dd>
              </div>
              <div>
                <dt className="t-label mb-2">Total paid</dt>
                <dd className="font-mono text-[18px]">{formatPrice(placed.total)}</dd>
              </div>
            </dl>

            {placed.locationId ? (
              <p className="text-[14.5px] leading-relaxed text-mocha">
                Collect from{" "}
                <Link
                  href={`/locations#${placed.locationId}`}
                  className="underline decoration-latte decoration-2 underline-offset-4"
                >
                  {getLocation(placed.locationId)?.name}
                </Link>
                . Give the reference at the bar.
              </p>
            ) : null}

            {placed.stampsEarned > 0 ? (
              <div className="flex w-full flex-col gap-3 rounded-md border border-line bg-bg p-5">
                <span className="t-label">
                  {placed.stampsEarned} stamp{placed.stampsEarned === 1 ? "" : "s"} added
                </span>
                <StampCard stamps={placed.stampsEarned} size="sm" />
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-1">
              <ButtonLink href="/loyalty" size="md" className="group">
                See your bean card
                <TravelArrow />
              </ButtonLink>
              <ButtonLink href="/menu" variant="secondary" size="md">
                Order something else
              </ButtonLink>
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------- STICKY FLOW BAR ---------- */}
      {step < 3 ? (
        <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+68px)] z-40 -mx-[var(--mx)] border-t border-line bg-[color-mix(in_oklab,var(--color-cream),transparent_4%)] px-[var(--mx)] py-3 backdrop-blur-[10px] md:bottom-4 md:mx-0 md:rounded-md md:border md:px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="t-label">
                {totals.itemCount > 0
                  ? `${totals.itemCount} item${totals.itemCount === 1 ? "" : "s"}`
                  : "Empty bag"}
              </p>
              <p className="font-mono text-[16px] tabular-nums">{formatPrice(totals.total)}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              {step > 0 ? (
                <Button variant="secondary" size="md" onClick={goBack}>
                  Back
                </Button>
              ) : null}
              <Button
                size="md"
                onClick={advance}
                disabled={step === 0 ? !canLeaveWhere : !canLeaveMenu}
                className="group"
              >
                {step === 0 ? "Choose drinks" : step === 1 ? "Review bag" : "Checkout"}
                <TravelArrow />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
