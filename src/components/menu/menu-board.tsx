"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/card";
import { FilterRail } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { useCart } from "@/lib/stores/cart";
import { useQosBasket } from "@/lib/stores/qos-basket";
import { formatMoneyMinor } from "@/lib/qos/money";
import type { PublicMenuProduct, PublicMenuResponse } from "@/lib/qos/menu-types";
import { MenuProductImage } from "@/components/menu/menu-product-image";
import { cn } from "@/lib/cn";

type CategoryFilter = "all" | string;

function countMenuProducts(menu: PublicMenuResponse) {
  return menu.sections.reduce((total, section) => total + section.products.length, 0);
}

export function MenuBoard({
  menu,
  openBagOnAdd = false,
}: {
  menu: PublicMenuResponse;
  openBagOnAdd?: boolean;
}) {
  const { toast } = useToast();
  const upsertProduct = useQosBasket((state) => state.upsertProduct);
  const setDrawerOpen = useCart((state) => state.setDrawerOpen);

  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");

  const productTotal = countMenuProducts(menu);

  const visibleSections = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return menu.sections
      .map((section) => ({
        section,
        products: section.products.filter((product) => {
          const inCategory = category === "all" || section.publicId === category;
          const matches =
            !needle ||
            product.displayName.toLowerCase().includes(needle) ||
            (product.description ?? "").toLowerCase().includes(needle);
          return inCategory && matches;
        }),
      }))
      .filter((entry) => entry.products.length > 0);
  }, [category, menu.sections, query]);

  const [addingId, setAddingId] = useState<string | null>(null);

  const quickAdd = (product: PublicMenuProduct) => {
    if (!product.eligibility.available || addingId) {
      return;
    }

    setAddingId(product.productPublicId);
    void upsertProduct({
      productPublicId: product.productPublicId,
      displayName: product.displayName,
    })
      .then((added) => {
        if (added) {
          toast({
            title: `${product.displayName} added`,
            body: "Saved to your QOS basket.",
          });
          if (openBagOnAdd) {
            setDrawerOpen(true);
          }
          return;
        }

        toast({
          title: `Couldn't add ${product.displayName}`,
          body:
            useQosBasket.getState().error ??
            "This item may not be on the menu for your selected café.",
          tone: "error",
        });
      })
      .finally(() => setAddingId(null));
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4">
        <label className="relative block">
          <span className="sr-only">Search the menu</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the published menu…"
            className="min-h-12 w-full rounded-sm border border-line bg-surface pr-4 pl-4 text-[15px] transition-colors duration-fast ease-brand hover:border-latte placeholder:text-muted/70"
          />
        </label>

        <FilterRail<CategoryFilter>
          label="Menu categories"
          value={category}
          onChange={setCategory}
          options={[
            { value: "all", label: "Everything", count: productTotal },
            ...menu.sections.map((section) => ({
              value: section.publicId,
              label: section.displayName,
              count: section.products.length,
            })),
          ]}
        />
      </div>

      {visibleSections.length === 0 ? (
        <EmptyState
          title="Nothing matches that"
          body={`No menu item matches “${query}”. Try another search or clear the filters.`}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-md bg-espresso px-2 text-cream md:px-6">
          {visibleSections.map(({ section, products }, sectionIndex) => (
            <section key={section.publicId} aria-labelledby={`menu-${section.publicId}`}>
              <div className="border-b border-cream/14 px-2 py-5 md:px-2">
                <div className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-4">
                  <span className="font-serif text-base text-latte">
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 id={`menu-${section.publicId}`} className="font-serif text-[clamp(28px,3.2vw,44px)] leading-none tracking-[-0.02em]">
                      {section.displayName}
                    </h3>
                    {section.description ? (
                      <p className="mt-1 text-sm text-cream/60">{section.description}</p>
                    ) : null}
                  </div>
                  <span className="hidden text-sm text-cream/60 sm:inline">
                    {products.length} items
                  </span>
                </div>
              </div>
              <ul className="flex flex-col border-b border-cream/14 last:border-b-0">
                {products.map((product) => (
                  <MenuRow
                    key={product.productPublicId}
                    product={product}
                    currency={menu.currency}
                    locale={menu.locale}
                    adding={addingId === product.productPublicId}
                    onQuickAdd={() => quickAdd(product)}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function MenuRow({
  product,
  currency,
  locale,
  adding,
  onQuickAdd,
}: {
  product: PublicMenuProduct;
  currency: string;
  locale: PublicMenuResponse["locale"];
  adding: boolean;
  onQuickAdd: () => void;
}) {
  const unavailable = !product.eligibility.available;

  return (
    <li
      className={cn(
        "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-cream/14 px-2 py-5 transition-[padding,background] duration-350 ease-[cubic-bezier(.2,.7,.2,1)] last:border-b-0 hover:bg-cream/3 hover:ps-5 md:px-2",
        unavailable && "opacity-60",
      )}
    >
      <MenuProductImage
        mediaAssetId={product.mediaAssetId}
        alt={product.displayName}
        size="thumb"
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h4 className="font-serif text-xl tracking-[-0.02em]">{product.displayName}</h4>
          <span className="ltr-isolate font-mono text-sm tabular-nums text-cream/80">
            {formatMoneyMinor(product.price.amountMinor, currency, locale)}
          </span>
        </div>
        {product.description ? (
          <p className="mt-1 text-sm leading-relaxed text-cream/60">{product.description}</p>
        ) : null}
        {unavailable ? (
          <div className="mt-2">
            <Badge tone="warning">Unavailable</Badge>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="inverse"
          onClick={onQuickAdd}
          disabled={unavailable || adding}
          loading={adding}
          loadingLabel="Adding"
        >
          Add
        </Button>
        <Link
          href={`/order?product=${product.productPublicId}`}
          aria-label={`Customise ${product.displayName}`}
          className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 text-cream transition-colors group-hover:border-cream group-hover:bg-cream group-hover:text-espresso"
        >
          →
        </Link>
      </div>
    </li>
  );
}
