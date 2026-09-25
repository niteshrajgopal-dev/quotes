"use client";

import { Bean } from "@/components/brand/bean";
import { QuantityStepper } from "@/components/ui/field";
import { storefrontMessage } from "@/lib/locale/messages";
import { formatMoneyMinor } from "@/lib/qos/money";
import { useStorefrontLocale } from "@/lib/stores/storefront-locale";
import type { BasketLineResponse } from "@/lib/qos/types";
import { useQosBasket } from "@/lib/stores/qos-basket";
import { cn } from "@/lib/cn";
import { normalizeProductName } from "@/lib/storefront/normalize-product-name";

export function QosCartLineRow({
  line,
  currency,
  locale,
  compact = false,
  readOnly = false,
  tone = "light",
}: {
  line: BasketLineResponse;
  currency: string;
  locale: "en" | "ar";
  compact?: boolean;
  readOnly?: boolean;
  tone?: "light" | "dark";
}) {
  const uiLocale = useStorefrontLocale((state) => state.locale);
  const productLabels = useQosBasket((state) => state.productLabels);
  const setLineQuantity = useQosBasket((state) => state.setLineQuantity);
  const removeLine = useQosBasket((state) => state.removeLine);
  const status = useQosBasket((state) => state.status);

  const displayName = productLabels[line.productPublicId] ?? line.productPublicId;
  const lineTotalMinor = line.unitPrice.amountMinor * line.quantity;
  const busy = status === "mutating";

  return (
    <li
      className={cn(
        "flex gap-4 border-b py-4 last:border-b-0",
        tone === "dark" ? "border-cream/14" : "border-line",
        compact && "py-3.5",
      )}
    >
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-sm border",
          tone === "dark" ? "border-cream/15 bg-mocha/55" : "border-line bg-latte-50",
          compact ? "h-14 w-14" : "h-16 w-16",
        )}
      >
        <Bean onDark={tone === "dark"} className={compact ? "w-5" : "w-6"} />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={cn(
                "text-[14.5px] font-medium leading-snug",
                tone === "dark" && "text-cream",
              )}
            >
              {normalizeProductName(displayName, uiLocale)}
            </p>
            {tone === "light" ? (
              <p className="ltr-isolate t-caption mt-0.5 font-mono">{line.productPublicId}</p>
            ) : null}
          </div>
          <p className="ltr-isolate shrink-0 font-mono text-[13.5px] tabular-nums">
            {formatMoneyMinor(lineTotalMinor, currency, locale)}
          </p>
        </div>

        {readOnly ? (
          <p className="t-caption font-mono">
            {line.quantity} × {formatMoneyMinor(line.unitPrice.amountMinor, currency, locale)}
          </p>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <QuantityStepper
              value={line.quantity}
              onChange={(quantity) => {
                if (busy) {
                  return;
                }
                if (quantity <= 0) {
                  void removeLine(line.linePublicId);
                  return;
                }
                void setLineQuantity(line.linePublicId, quantity);
              }}
              min={0}
              label={`${displayName} quantity`}
            />
            <button
              type="button"
              onClick={() => {
                if (!busy) {
                  void removeLine(line.linePublicId);
                }
              }}
              disabled={busy}
              className="rounded-sm px-2 py-2 text-[13px] text-muted underline decoration-line underline-offset-4 transition-colors duration-fast ease-brand hover:text-error disabled:opacity-50"
            >
              {storefrontMessage(uiLocale, "remove")}
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
