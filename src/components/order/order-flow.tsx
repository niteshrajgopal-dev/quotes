"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/brand/icons";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, EmptyState, Notice } from "@/components/ui/card";
import { Stepper } from "@/components/ui/tabs";
import { MenuBoard } from "@/components/menu/menu-board";
import { MenuLocationPanel } from "@/components/menu/menu-location-panel";
import { MenuUnavailable } from "@/components/menu/menu-status";
import type { MenuLoadResult } from "@/lib/qos/menu-types";
import { QosCartLineRow } from "@/components/cart/qos-cart-line-row";
import { OrderSummary } from "@/components/cart/order-summary";
import { useCart, type Fulfilment } from "@/lib/stores/cart";
import { useSelectStorefrontLocation } from "@/lib/storefront/use-select-storefront-location";
import { useQosBasket, selectBasketItemCount } from "@/lib/stores/qos-basket";
import { formatMoneyMinor } from "@/lib/qos/money";
import { useHydrated } from "@/lib/use-hydrated";
import {
  useStorefrontChromeLocale,
  useStorefrontShell,
} from "@/lib/stores/storefront-shell";
import { storefrontMessage, storefrontMessageWithValues } from "@/lib/locale/messages";
import type { StorefrontLocale } from "@/lib/locale/storefront-locale";
import { cn } from "@/lib/cn";

export function OrderFlow({ menuResult }: { menuResult: MenuLoadResult }) {
  const router = useRouter();
  const shell = useStorefrontShell();
  const locale = useStorefrontChromeLocale();
  const isRetail = shell.themePresetId === "generic_retail_baseline";
  const isHospitality = shell.themePresetId === "hospitality_baseline";
  const hydrated = useHydrated();
  const [step, setStep] = useState(0);

  const steps = useMemo(
    () => [
      storefrontMessage(locale, "orderStepWhere"),
      storefrontMessage(locale, "orderStepMenu"),
      storefrontMessage(locale, "orderStepBag"),
    ],
    [locale],
  );

  const basket = useQosBasket((state) => state.basket);
  const itemCount = useQosBasket(selectBasketItemCount);
  const fulfilment = useCart((state) => state.fulfilment);
  const setFulfilment = useCart((state) => state.setFulfilment);
  const locationId = useCart((state) => state.locationId);
  const setLocation = useCart((state) => state.setLocation);
  const selectLocation = useSelectStorefrontLocation();

  useEffect(() => {
    if (menuResult.status !== "ok") {
      return;
    }

    if (locationId !== menuResult.branchPublicId) {
      setLocation(menuResult.branchPublicId);
    }
  }, [locationId, menuResult, setLocation]);

  const activeLocationPublicId =
    menuResult.status === "ok" ? menuResult.branchPublicId : locationId;

  const chosenLocation = shell.locations.find(
    (location) => location.locationPublicId === activeLocationPublicId,
  );

  const canLeaveWhere = fulfilment === "delivery" || Boolean(chosenLocation);
  const canLeaveMenu = itemCount > 0;

  const advance = () => {
    if (step === steps.length - 1) {
      router.push("/checkout");
      return;
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-8">
      <Stepper steps={steps} current={step} onStepSelect={(index) => setStep(index)} />

      {step === 0 ? (
        <section
          aria-label={storefrontMessage(locale, "chooseHowToGetOrder")}
          className="flex flex-col gap-6"
        >
          {!isRetail ? (
            <SegmentedFulfilment value={fulfilment} onChange={setFulfilment} locale={locale} />
          ) : null}

          {fulfilment === "pickup" || isRetail ? (
            <>
              <h2 className="t-h1">
                {isRetail
                  ? storefrontMessage(locale, "whichShop")
                  : storefrontMessage(locale, "whichCafe")}
              </h2>
              <ul className="grid gap-4 md:grid-cols-3">
                {shell.locations.map((location) => {
                  const selected = activeLocationPublicId === location.locationPublicId;
                  return (
                    <li key={location.locationPublicId}>
                      <button
                        type="button"
                        onClick={() => {
                          void selectLocation(location.locationPublicId, activeLocationPublicId);
                        }}
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
                            {storefrontMessage(locale, "branch")}
                          </span>
                        </span>
                        <span className={cn("font-serif text-[20px]", selected && "text-cream")}>
                          {location.name}
                        </span>
                        <span
                          className={cn(
                            "text-[13px] leading-relaxed",
                            selected ? "text-cream/65" : "text-muted",
                          )}
                        >
                          {storefrontMessage(locale, "branchPublished")}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {chosenLocation ? (
                <Notice
                  tone="success"
                  title={storefrontMessageWithValues(locale, "branchSelectedTitle", {
                    name: chosenLocation.name,
                  })}
                >
                  {storefrontMessage(locale, "branchSelectedBody")}
                </Notice>
              ) : (
                <Notice tone="info">{storefrontMessage(locale, "pickBranchNotice")}</Notice>
              )}
            </>
          ) : (
            <>
              <h2 className="t-h1">{storefrontMessage(locale, "beansByPost")}</h2>
              <p className="max-w-[58ch] text-[16px] leading-relaxed text-mocha">
                {storefrontMessage(locale, "beansByPostBody")}
              </p>
              <ButtonLink href="/shop" size="md">
                {storefrontMessage(locale, "designReferenceShop")}
              </ButtonLink>
            </>
          )}
        </section>
      ) : null}

      {step === 1 ? (
        <section
          aria-label={storefrontMessage(locale, "chooseDrinksSection")}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="t-h1">{storefrontMessage(locale, "whatAreYouHaving")}</h2>
            {chosenLocation ? (
              <Badge tone="neutral">
                <Icon name="location" className="h-3 w-3" strokeWidth={2} />
                {chosenLocation.name}
              </Badge>
            ) : null}
          </div>
          {menuResult.status === "ok" ? (
            <>
              <MenuLocationPanel
                selectedLocationPublicId={menuResult.branchPublicId}
                branchName={menuResult.branchName}
                menuDisplayName={menuResult.menu.displayName}
              />
              <MenuBoard menu={menuResult.menu} openBagOnAdd />
            </>
          ) : (
            <MenuUnavailable result={menuResult} />
          )}
        </section>
      ) : null}

      {step === 2 ? (
        <section
          aria-label={storefrontMessage(locale, "reviewBagSection")}
          className="flex flex-col gap-6"
        >
          <h2 className="t-h1">{storefrontMessage(locale, "yourBag")}</h2>
          {!basket || basket.lines.length === 0 ? (
            <EmptyState
              title={storefrontMessage(locale, "nothingInBagOrder")}
              body={storefrontMessage(locale, "nothingInBagBody")}
              action={
                <Button variant="secondary" size="sm" onClick={goBack}>
                  {storefrontMessage(locale, "backToMenu")}
                </Button>
              }
            />
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
              <ul className="flex flex-col border-t border-line">
                {basket.lines.map((line) => (
                  <QosCartLineRow
                    key={line.linePublicId}
                    line={line}
                    currency={basket.currency}
                    locale={basket.locale}
                  />
                ))}
              </ul>
              <Card className="flex h-fit flex-col gap-5">
                <h3 className="t-label">{storefrontMessage(locale, "summary")}</h3>
                <OrderSummary />
                <Button size="md" onClick={() => router.push("/checkout")}>
                  {storefrontMessage(locale, "continueToCheckout")}
                </Button>
              </Card>
            </div>
          )}
        </section>
      ) : null}

      {hydrated && step < steps.length - 1 ? (
        <div
          className={cn(
            "sticky bottom-[calc(env(safe-area-inset-bottom)+68px)] z-40 -mx-[var(--mx)] border-t px-[var(--mx)] py-3 backdrop-blur-[10px] md:bottom-4 md:mx-0 md:rounded-md md:border md:px-4",
            isHospitality
              ? "border-cream/12 bg-[rgba(47,35,34,0.92)] text-cream"
              : "border-line bg-[color-mix(in_oklab,var(--color-cream),transparent_4%)]",
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="t-label">
                {itemCount > 0
                  ? `${itemCount} ${storefrontMessage(locale, itemCount === 1 ? "item" : "items")}`
                  : storefrontMessage(locale, "emptyBasket")}
              </p>
              <p className="ltr-isolate font-mono text-[16px] tabular-nums">
                {hydrated && basket
                  ? formatMoneyMinor(
                      basket.provisionalSubtotalMinor,
                      basket.currency,
                      basket.locale,
                    )
                  : formatMoneyMinor(0, "AED", locale)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              {step > 0 ? (
                <Button variant="secondary" size="md" onClick={goBack}>
                  {storefrontMessage(locale, "back")}
                </Button>
              ) : null}
              <Button
                size="md"
                onClick={advance}
                disabled={step === 0 ? !canLeaveWhere : !canLeaveMenu}
              >
                {step === 0
                  ? storefrontMessage(locale, "chooseDrinks")
                  : step === 1
                    ? storefrontMessage(locale, "reviewBag")
                    : storefrontMessage(locale, "checkout")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SegmentedFulfilment({
  value,
  onChange,
  locale,
}: {
  value: Fulfilment;
  onChange: (value: Fulfilment) => void;
  locale: StorefrontLocale;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="t-label">{storefrontMessage(locale, "fulfilment")}</span>
      <div className="flex flex-wrap gap-2">
        {(
          [
            { value: "pickup", label: storefrontMessage(locale, "fulfilmentPickup") },
            { value: "delivery", label: storefrontMessage(locale, "fulfilmentDelivery") },
          ] as const
        ).map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              "rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors duration-fast ease-brand",
              value === option.value
                ? "border-espresso bg-espresso text-cream"
                : "border-line bg-surface text-mocha hover:border-latte",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
