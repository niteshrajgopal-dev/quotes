import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BagPlate } from "@/components/ui/plate";
import { Icon } from "@/components/brand/icons";
import { formatPrice } from "@/lib/fixtures/quotes-design-reference/brand";
import type { Coffee } from "@/lib/fixtures/quotes-design-reference/catalog";
import { cn } from "@/lib/cn";

export function CoffeeCard({
  coffee,
  className,
}: {
  coffee: Coffee;
  className?: string;
}) {
  const from = coffee.sizes[0];
  const soldOut = coffee.stock === "sold-out";

  return (
    <article className={cn("group flex flex-col", className)}>
      <Link
        href={`/shop/${coffee.slug}`}
        className="flex flex-1 flex-col overflow-hidden rounded-md border border-line bg-surface transition-[transform,box-shadow,border-color] duration-std ease-brand hover:-translate-y-[3px] hover:border-[color-mix(in_oklab,var(--color-latte),var(--color-line)_30%)] hover:shadow-lift"
      >
        <div className="relative">
          <BagPlate
            tone={coffee.plate}
            label={coffee.name}
            sublabel={`${coffee.sizes[0].label} · ${coffee.roast}`}
            className="aspect-4/3 rounded-none border-0 border-b border-line"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {coffee.limited ? <Badge tone="latte">Limited</Badge> : null}
            {coffee.decaf ? <Badge tone="info">Decaf</Badge> : null}
            {coffee.stock === "low-stock" ? <Badge tone="warning">Low stock</Badge> : null}
            {soldOut ? <Badge tone="espresso">Sold out</Badge> : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="t-overline text-muted">{coffee.overline}</span>
            <span className="font-mono text-[12px] text-muted">{coffee.roast}</span>
          </div>

          <h3 className="t-h2">{coffee.name}</h3>
          <p className="text-[14px] leading-relaxed text-muted">{coffee.strapline}</p>

          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {coffee.notes.slice(0, 3).map((note) => (
              <li
                key={note}
                className="rounded-full border border-line px-2.5 py-1 font-mono text-[10.5px] tracking-[0.06em] text-mocha uppercase"
              >
                {note}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
            <span className="font-mono text-[14px] tabular-nums">
              {soldOut ? (
                <span className="text-muted">Back next harvest</span>
              ) : (
                <>
                  {formatPrice(from.price)}
                  <span className="text-muted"> · {from.label}</span>
                </>
              )}
            </span>
            <span className="inline-flex items-center gap-2 text-[13.5px] font-medium">
              {soldOut ? "Details" : "Choose"}
              <Icon
                name="arrow"
                className="h-4 w-4 text-latte transition-transform duration-std ease-brand group-hover:translate-x-1"
                strokeWidth={2}
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
