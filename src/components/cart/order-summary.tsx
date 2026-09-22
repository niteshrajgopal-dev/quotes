"use client";

import { Bean } from "@/components/brand/bean";
import { Notice } from "@/components/ui/card";
import { storefrontMessage } from "@/lib/locale/messages";
import { formatMoneyMinor } from "@/lib/qos/money";
import { useQosBasket } from "@/lib/stores/qos-basket";
import { useStorefrontLocale } from "@/lib/stores/storefront-locale";
import { cn } from "@/lib/cn";

/** Authoritative basket totals from QOS. */
export function OrderSummary({ tone = "light" }: { tone?: "light" | "dark" }) {
  const basket = useQosBasket((state) => state.basket);
  const signedIn = useQosBasket((state) => state.signedIn);
  const error = useQosBasket((state) => state.error);
  const locale = useStorefrontLocale((state) => state.locale);

  if (!basket || basket.itemCount === 0) {
    return null;
  }

  const moneyLocale = basket.locale ?? locale;

  return (
    <div className="flex flex-col gap-4">
      {tone === "light" ? (
        <Notice tone="info">
          {signedIn
            ? storefrontMessage(locale, "totalsSignedIn")
            : storefrontMessage(locale, "totalsAnonymous")}
        </Notice>
      ) : null}

      {error ? (
        <Notice tone="error" title={storefrontMessage(locale, "basketUpdateIssue")}>
          {error}
        </Notice>
      ) : null}

      <dl className="flex flex-col gap-2.5 text-[14px]">
        <Row
          label={storefrontMessage(locale, "subtotal")}
          value={formatMoneyMinor(
            basket.provisionalSubtotalMinor,
            basket.currency,
            moneyLocale,
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
            {storefrontMessage(locale, "total")}
          </dt>
          <dd className="ltr-isolate font-mono text-[19px] tabular-nums">
            {formatMoneyMinor(
              basket.provisionalSubtotalMinor,
              basket.currency,
              moneyLocale,
            )}
          </dd>
        </div>
      </dl>

      {tone === "light" ? (
        <p className="t-caption flex items-center gap-2">
          <Bean className="w-3" />
          {storefrontMessage(locale, "basketMeta")
            .replace("{version}", String(basket.version))
            .replace("{ownership}", basket.ownership)
            .replace("{release}", String(basket.menuReleaseVersion))}
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
          "ltr-isolate font-mono tabular-nums",
          accent ? "text-success" : tone === "dark" ? "text-cream" : "text-fg",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
