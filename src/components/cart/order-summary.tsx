"use client";

import { Bean } from "@/components/brand/bean";
import { Notice } from "@/components/ui/card";
import { formatMoneyMinor } from "@/lib/qos/money";
import { useQosBasket } from "@/lib/stores/qos-basket";
import { cn } from "@/lib/cn";

/** Authoritative basket totals from QOS. */
export function OrderSummary({ tone = "light" }: { tone?: "light" | "dark" }) {
  const basket = useQosBasket((state) => state.basket);
  const signedIn = useQosBasket((state) => state.signedIn);
  const error = useQosBasket((state) => state.error);

  if (!basket || basket.itemCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {tone === "light" ? (
        <Notice tone="info">
          {signedIn
            ? "Totals come from your signed-in QOS basket."
            : "Totals come from your server basket. Sign in before checkout to pay."}
        </Notice>
      ) : null}

      {error ? (
        <Notice tone="error" title="Basket update issue">
          {error}
        </Notice>
      ) : null}

      <dl className="flex flex-col gap-2.5 text-[14px]">
        <Row
          label="Subtotal"
          value={formatMoneyMinor(
            basket.provisionalSubtotalMinor,
            basket.currency,
            basket.locale,
          )}
          tone={tone}
        />
        <div
          className={cn(
            "mt-1 flex items-baseline justify-between border-t pt-3.5",
            tone === "dark" ? "border-cream/14" : "border-line",
          )}
        >
          <dt className={cn("font-serif text-[19px]", tone === "dark" && "text-cream")}>
            Total
          </dt>
          <dd className="font-mono text-[19px] tabular-nums">
            {formatMoneyMinor(
              basket.provisionalSubtotalMinor,
              basket.currency,
              basket.locale,
            )}
          </dd>
        </div>
      </dl>

      {tone === "light" ? (
        <p className="t-caption flex items-center gap-2">
          <Bean className="w-3" />
          Basket version {basket.version} · {basket.ownership} · release{" "}
          {basket.menuReleaseVersion}
        </p>
      ) : null}
    </div>
  );
}

function Row({
  label,
  value,
  accent = false,
  tone = "light",
}: {
  label: string;
  value: string;
  accent?: boolean;
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={tone === "dark" ? "text-cream/60" : "text-muted"}>{label}</dt>
      <dd
        className={cn(
          "font-mono tabular-nums",
          accent ? "text-success" : tone === "dark" ? "text-cream" : "text-fg",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
