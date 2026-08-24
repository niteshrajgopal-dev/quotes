"use client";

import { useState } from "react";
import { Bean } from "@/components/brand/bean";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/card";
import { computeTotals, useCart, FREE_DELIVERY_THRESHOLD } from "@/lib/stores/cart";
import { formatPrice } from "@/lib/brand";
import { cn } from "@/lib/cn";

/** Totals block with the promo form. Shared by the cart drawer and checkout. */
export function OrderSummary({ showPromo = true }: { showPromo?: boolean }) {
  const lines = useCart((state) => state.lines);
  const fulfilment = useCart((state) => state.fulfilment);
  const promo = useCart((state) => state.promo);
  const applyPromo = useCart((state) => state.applyPromo);
  const clearPromo = useCart((state) => state.clearPromo);

  const totals = computeTotals({ lines, fulfilment, promo });

  const [code, setCode] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);

  const onApply = () => {
    const result = applyPromo(code);
    setPromoError(result.ok ? null : result.message);
    if (result.ok) setCode("");
  };

  return (
    <div className="flex flex-col gap-4">
      {showPromo ? (
        promo ? (
          <div className="flex items-center justify-between gap-3 rounded-sm border border-latte bg-latte-50 px-3.5 py-3">
            <span className="flex items-center gap-2.5 text-[13.5px]">
              <Bean className="w-3.5" />
              <span>
                <span className="font-mono text-[12px] tracking-[0.06em]">{promo.code}</span>
                <span className="t-caption block">{promo.label}</span>
              </span>
            </span>
            <button
              type="button"
              onClick={clearPromo}
              className="rounded-sm px-2 py-1.5 text-[13px] text-muted underline decoration-line underline-offset-4 transition-colors duration-fast hover:text-fg"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setPromoError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onApply();
                  }
                }}
                placeholder="Promo code"
                aria-label="Promo code"
                aria-invalid={promoError ? true : undefined}
                className={cn(
                  "min-h-12 min-w-0 flex-1 rounded-sm border bg-surface px-3.5 font-mono text-[13px] tracking-[0.06em] uppercase",
                  "placeholder:normal-case placeholder:tracking-normal placeholder:text-muted/70",
                  "transition-colors duration-fast ease-brand hover:border-latte",
                  promoError ? "border-error" : "border-line",
                )}
              />
              <Button variant="secondary" size="md" onClick={onApply} disabled={!code.trim()}>
                Apply
              </Button>
            </div>
            {promoError ? (
              <p role="alert" className="text-[13px] text-error">
                {promoError}
              </p>
            ) : null}
          </div>
        )
      ) : null}

      {fulfilment === "delivery" && totals.freeDeliveryShortfall > 0 && totals.itemCount > 0 ? (
        <Notice tone="info">
          {formatPrice(totals.freeDeliveryShortfall)} more for free delivery — the threshold is{" "}
          {formatPrice(FREE_DELIVERY_THRESHOLD)}.
        </Notice>
      ) : null}

      <dl className="flex flex-col gap-2.5 text-[14px]">
        <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
        {totals.discount > 0 ? (
          <Row label={`Discount · ${promo?.code}`} value={`−${formatPrice(totals.discount)}`} accent />
        ) : null}
        <Row
          label={fulfilment === "delivery" ? "Delivery" : "Pickup"}
          value={
            fulfilment === "delivery"
              ? totals.delivery > 0
                ? formatPrice(totals.delivery)
                : "Free"
              : "Free"
          }
        />
        <div className="mt-1 flex items-baseline justify-between border-t border-line pt-3.5">
          <dt className="font-serif text-[19px]">Total</dt>
          <dd className="font-mono text-[19px] tabular-nums">{formatPrice(totals.total)}</dd>
        </div>
      </dl>

      {totals.stampsEarned > 0 ? (
        <p className="t-caption flex items-center gap-2">
          <Bean className="w-3" />
          Earns {totals.stampsEarned} bean stamp{totals.stampsEarned === 1 ? "" : "s"}.
        </p>
      ) : null}
    </div>
  );
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className={cn("font-mono tabular-nums", accent ? "text-success" : "text-fg")}>{value}</dd>
    </div>
  );
}
