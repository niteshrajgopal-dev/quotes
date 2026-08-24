"use client";

import { Bean } from "@/components/brand/bean";
import { QuantityStepper } from "@/components/ui/field";
import { describeLine, useCart, type CartLine } from "@/lib/stores/cart";
import { formatPrice } from "@/lib/brand";
import { cn } from "@/lib/cn";

export function CartLineRow({
  line,
  compact = false,
  readOnly = false,
}: {
  line: CartLine;
  compact?: boolean;
  readOnly?: boolean;
}) {
  const setQuantity = useCart((state) => state.setQuantity);
  const remove = useCart((state) => state.remove);
  const details = describeLine(line);

  return (
    <li className={cn("flex gap-4 border-b border-line py-4 last:border-b-0", compact && "py-3.5")}>
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-sm border border-line",
          line.kind === "bean" ? "bg-espresso" : "bg-latte-50",
          compact ? "h-14 w-14" : "h-16 w-16",
        )}
      >
        <Bean onDark={line.kind === "bean"} className={compact ? "w-5" : "w-6"} />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[14.5px] font-medium leading-snug">{line.name}</p>
            <p className="t-caption mt-0.5">{details.join(" · ")}</p>
          </div>
          <p className="shrink-0 font-mono text-[13.5px] tabular-nums">
            {formatPrice(line.unitPrice * line.quantity)}
          </p>
        </div>

        {readOnly ? (
          <p className="t-caption font-mono">
            {line.quantity} × {formatPrice(line.unitPrice)}
          </p>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <QuantityStepper
              value={line.quantity}
              onChange={(quantity) => setQuantity(line.id, quantity)}
              min={1}
              label={`${line.name} quantity`}
            />
            <button
              type="button"
              onClick={() => remove(line.id)}
              className="rounded-sm px-2 py-2 text-[13px] text-muted underline decoration-line underline-offset-4 transition-colors duration-fast ease-brand hover:text-error"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
