"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { ChoiceGroup, QuantityStepper } from "@/components/ui/field";
import { EmptyState, Notice } from "@/components/ui/card";
import { FilterRail } from "@/components/ui/tabs";
import { Bean } from "@/components/brand/bean";
import { Icon } from "@/components/brand/icons";
import { useToast } from "@/components/ui/toast";
import { useCart } from "@/lib/stores/cart";
import { formatPrice } from "@/lib/brand";
import { cn } from "@/lib/cn";
import {
  DIETARY_LABELS,
  EXTRA_SHOT_PRICE,
  MENU_CATEGORIES,
  MENU_ITEMS,
  MILKS,
  SYRUPS,
  type MenuItem,
} from "@/lib/menu";

type CategoryFilter = "all" | string;

export function MenuBoard({
  /** The order flow opens the bag automatically; the menu page just confirms. */
  openBagOnAdd = false,
}: {
  openBagOnAdd?: boolean;
}) {
  const { toast } = useToast();
  const add = useCart((state) => state.add);
  const setDrawerOpen = useCart((state) => state.setDrawerOpen);

  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [customising, setCustomising] = useState<MenuItem | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const inCategory = category === "all" || item.category === category;
      const matches =
        !needle ||
        item.name.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle);
      return inCategory && matches;
    });
  }, [category, query]);

  const grouped = MENU_CATEGORIES.map((group) => ({
    group,
    items: visible.filter((item) => item.category === group.id),
  })).filter((entry) => entry.items.length > 0);

  const quickAdd = (item: MenuItem) => {
    if (item.soldOut) return;
    add({
      kind: "cafe",
      itemId: item.id,
      name: item.name,
      sizeId: item.sizes?.[0]?.id ?? null,
      sizeLabel: item.sizes?.[0]?.label ?? null,
      milk: null,
      milkLabel: null,
      syrup: null,
      syrupLabel: null,
      extraShots: 0,
      unitPrice: item.basePrice + (item.sizes?.[0]?.priceDelta ?? 0),
    });
    toast({ title: `${item.name} added`, body: "As it comes." });
    if (openBagOnAdd) setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4">
        <label className="relative block">
          <span className="sr-only">Search the menu</span>
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-muted"
            strokeWidth={1.7}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search flat white, matcha, bun…"
            className="min-h-12 w-full rounded-sm border border-line bg-surface pr-4 pl-11 text-[15px] transition-colors duration-fast ease-brand hover:border-latte placeholder:text-muted/70"
          />
        </label>

        <FilterRail<CategoryFilter>
          label="Menu categories"
          value={category}
          onChange={setCategory}
          options={[
            { value: "all", label: "Everything", count: MENU_ITEMS.length },
            ...MENU_CATEGORIES.map((group) => ({
              value: group.id,
              label: group.name,
              count: MENU_ITEMS.filter((item) => item.category === group.id).length,
            })),
          ]}
        />
      </div>

      {grouped.length === 0 ? (
        <EmptyState
          title="Nothing matches that"
          body={`No menu item matches “${query}”. Try “filter”, “oat” or clear the search.`}
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
        grouped.map(({ group, items }) => (
          <section key={group.id} aria-labelledby={`menu-${group.id}`} className="flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-3">
              <h3 id={`menu-${group.id}`} className="t-h2">
                {group.name}
              </h3>
              <p className="t-caption sm:ml-auto">{group.blurb}</p>
            </div>

            <ul className="grid gap-3 md:grid-cols-2">
              {items.map((item) => (
                <MenuRow
                  key={item.id}
                  item={item}
                  onQuickAdd={() => quickAdd(item)}
                  onCustomise={() => setCustomising(item)}
                />
              ))}
            </ul>
          </section>
        ))
      )}

      <CustomiseSheet
        item={customising}
        onClose={() => setCustomising(null)}
        openBagOnAdd={openBagOnAdd}
      />
    </div>
  );
}

function MenuRow({
  item,
  onQuickAdd,
  onCustomise,
}: {
  item: MenuItem;
  onQuickAdd: () => void;
  onCustomise: () => void;
}) {
  const hasOptions = item.customisable || Boolean(item.sizes);

  return (
    <li
      className={cn(
        "flex flex-col gap-3 rounded-md border border-line bg-surface p-4 transition-colors duration-fast ease-brand",
        item.soldOut ? "opacity-60" : "hover:border-latte",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="flex flex-wrap items-center gap-2 text-[16px] font-semibold">
            {item.name}
            {item.signature ? <Bean className="w-3" title="Bar favourite" /> : null}
          </h4>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{item.description}</p>
        </div>
        <span className="shrink-0 font-mono text-[14px] tabular-nums">
          {formatPrice(item.basePrice)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {item.dietary.map((code) => (
          <abbr
            key={code}
            title={DIETARY_LABELS[code]}
            className="rounded-full border border-line px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-muted no-underline"
          >
            {code}
          </abbr>
        ))}
        {item.caffeineFree ? <Badge tone="outline">Caffeine free</Badge> : null}
        {item.soldOut ? <Badge tone="warning">Sold out today</Badge> : null}
      </div>

      <div className="mt-auto flex gap-2 pt-1">
        {hasOptions ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={onCustomise}
            disabled={item.soldOut}
            className="flex-1"
          >
            Customise
          </Button>
        ) : null}
        <Button
          size="sm"
          onClick={onQuickAdd}
          disabled={item.soldOut}
          className={hasOptions ? "" : "flex-1"}
        >
          {item.soldOut ? "Unavailable" : "Add"}
        </Button>
      </div>
    </li>
  );
}

function CustomiseSheet({
  item,
  onClose,
  openBagOnAdd,
}: {
  item: MenuItem | null;
  onClose: () => void;
  openBagOnAdd: boolean;
}) {
  const { toast } = useToast();
  const add = useCart((state) => state.add);
  const setDrawerOpen = useCart((state) => state.setDrawerOpen);

  const [sizeId, setSizeId] = useState<string>("");
  const [milk, setMilk] = useState<string>("whole");
  const [syrup, setSyrup] = useState<string>("none");
  const [extraShots, setExtraShots] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Reset the form each time a different item opens the sheet.
  const [lastItemId, setLastItemId] = useState<string | null>(null);
  if (item && item.id !== lastItemId) {
    setLastItemId(item.id);
    setSizeId(item.sizes?.[0]?.id ?? "");
    setMilk(item.customisable ? "whole" : "none");
    setSyrup("none");
    setExtraShots(0);
    setQuantity(1);
  }

  if (!item) return null;

  const size = item.sizes?.find((candidate) => candidate.id === sizeId) ?? item.sizes?.[0] ?? null;
  const milkOption = MILKS.find((candidate) => candidate.id === milk) ?? MILKS[0];
  const syrupOption = SYRUPS.find((candidate) => candidate.id === syrup) ?? SYRUPS[0];

  const unitPrice =
    Math.round(
      (item.basePrice +
        (size?.priceDelta ?? 0) +
        (item.customisable ? milkOption.price + syrupOption.price : 0) +
        extraShots * EXTRA_SHOT_PRICE) *
        100,
    ) / 100;

  const onAdd = () => {
    add(
      {
        kind: "cafe",
        itemId: item.id,
        name: item.name,
        sizeId: size?.id ?? null,
        sizeLabel: size ? `${size.label}${size.volume ? ` · ${size.volume}` : ""}` : null,
        milk: item.customisable ? milkOption.id : null,
        milkLabel: item.customisable ? milkOption.label : null,
        syrup: item.customisable ? syrupOption.id : null,
        syrupLabel: item.customisable ? syrupOption.label : null,
        extraShots,
        unitPrice,
      },
      quantity,
    );
    toast({
      title: `${item.name} added`,
      body: [size?.label, item.customisable ? milkOption.label : null]
        .filter(Boolean)
        .join(" · "),
    });
    onClose();
    if (openBagOnAdd) setDrawerOpen(true);
  };

  return (
    <Sheet
      open
      onClose={onClose}
      side="bottom"
      title={item.name}
      description={item.description}
      footer={
        <div className="flex flex-wrap items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} label="Drink quantity" />
          <Button size="lg" onClick={onAdd} className="min-w-0 flex-1">
            Add · {formatPrice(unitPrice * quantity)}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {item.sizes ? (
          <ChoiceGroup
            legend="Size"
            value={sizeId}
            onChange={setSizeId}
            columns={3}
            options={item.sizes.map((option) => ({
              value: option.id,
              label: option.label,
              hint: option.volume,
              meta: option.priceDelta > 0 ? `+${formatPrice(option.priceDelta)}` : undefined,
            }))}
          />
        ) : null}

        {item.customisable ? (
          <>
            <ChoiceGroup
              legend="Milk"
              value={milk}
              onChange={setMilk}
              columns={2}
              options={MILKS.map((option) => ({
                value: option.id,
                label: option.label,
                meta: option.price > 0 ? `+${formatPrice(option.price)}` : undefined,
              }))}
            />
            <ChoiceGroup
              legend="Syrup"
              value={syrup}
              onChange={setSyrup}
              columns={2}
              options={SYRUPS.map((option) => ({
                value: option.id,
                label: option.label,
                meta: option.price > 0 ? `+${formatPrice(option.price)}` : undefined,
              }))}
            />
            <div className="flex flex-col gap-3">
              <span className="t-label">Extra shots</span>
              <div className="flex items-center gap-4">
                <QuantityStepper
                  value={extraShots}
                  onChange={setExtraShots}
                  min={0}
                  max={4}
                  label="Extra shots"
                />
                <span className="t-caption">
                  {formatPrice(EXTRA_SHOT_PRICE)} each · Signature Blend
                </span>
              </div>
            </div>
          </>
        ) : (
          <Notice tone="info">
            {item.name} is served as it comes — no milk or syrup options on this one.
          </Notice>
        )}
      </div>
    </Sheet>
  );
}
