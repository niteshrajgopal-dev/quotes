"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sheet } from "@/components/ui/sheet";
import { buildSignInHref } from "@/lib/auth/customer-auth-client";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, Notice } from "@/components/ui/card";
import { QosCartLineRow } from "@/components/cart/qos-cart-line-row";
import { OrderSummary } from "@/components/cart/order-summary";
import { storefrontMessage } from "@/lib/locale/messages";
import { useCart } from "@/lib/stores/cart";
import { useQosBasket, selectBasketItemCount } from "@/lib/stores/qos-basket";
import { useStorefrontLocale } from "@/lib/stores/storefront-locale";
import { useHydrated } from "@/lib/use-hydrated";

export function CartDrawer() {
  const router = useRouter();
  const hydrated = useHydrated();
  const locale = useStorefrontLocale((state) => state.locale);

  const open = useCart((state) => state.drawerOpen);
  const setDrawerOpen = useCart((state) => state.setDrawerOpen);
  const basket = useQosBasket((state) => state.basket);
  const status = useQosBasket((state) => state.status);
  const error = useQosBasket((state) => state.error);
  const signedIn = useQosBasket((state) => state.signedIn);
  const itemCount = useQosBasket(selectBasketItemCount);
  const hydrate = useQosBasket((state) => state.hydrate);

  useEffect(() => {
    if (open) {
      void hydrate();
    }
  }, [open, hydrate]);

  const close = () => setDrawerOpen(false);

  if (!hydrated) return null;

  const itemLabel =
    itemCount === 1
      ? storefrontMessage(locale, "item")
      : storefrontMessage(locale, "items");

  return (
    <Sheet
      open={open}
      onClose={close}
      title={storefrontMessage(locale, "yourBag")}
      description={
        itemCount > 0 ? `${itemCount} ${itemLabel} · QOS basket` : undefined
      }
      footer={
        basket && basket.lines.length > 0 ? (
          <div className="flex flex-col gap-3">
            <OrderSummary />
            <Button
              block
              size="lg"
              onClick={() => {
                close();
                router.push("/checkout");
              }}
            >
              {storefrontMessage(locale, "checkout")}
            </Button>
            <button
              type="button"
              onClick={close}
              className="min-h-11 rounded-sm text-[13.5px] text-muted transition-colors duration-fast hover:text-fg"
            >
              {storefrontMessage(locale, "keepBrowsing")}
            </button>
          </div>
        ) : null
      }
    >
      {status === "loading" ? (
        <p className="text-[14px] text-muted">{storefrontMessage(locale, "loadingBasket")}</p>
      ) : null}

      {error ? (
        <Notice
          tone="error"
          title={
            basket
              ? storefrontMessage(locale, "basketUpdateIssue")
              : storefrontMessage(locale, "basketUnavailable")
          }
        >
          {error}
        </Notice>
      ) : null}

      {!basket || basket.lines.length === 0 ? (
        <EmptyState
          title={storefrontMessage(locale, "nothingInBagTitle")}
          body={storefrontMessage(locale, "nothingInBagBody")}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <ButtonLink href="/menu" variant="secondary" size="sm" onClick={close}>
                {storefrontMessage(locale, "cafeMenu")}
              </ButtonLink>
            </div>
          }
          className="border-none bg-transparent px-0 py-6"
        />
      ) : (
        <div className="flex flex-col gap-5">
          {!signedIn ? (
            <Notice tone="info" title={storefrontMessage(locale, "signInBeforeCheckoutTitle")}>
              {storefrontMessage(locale, "signInBeforeCheckoutBody")}
              <div className="mt-3">
                <ButtonLink href={buildSignInHref("/checkout")} size="sm" onClick={close}>
                  {storefrontMessage(locale, "signIn")}
                </ButtonLink>
              </div>
            </Notice>
          ) : null}
          <ul className="flex flex-col">
            {basket.lines.map((line) => (
              <QosCartLineRow
                key={line.linePublicId}
                line={line}
                currency={basket.currency}
                locale={basket.locale}
                compact
              />
            ))}
          </ul>
        </div>
      )}
    </Sheet>
  );
}
