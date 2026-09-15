"use client";

import { useEffect, type ReactNode } from "react";

import { TenantMarkSpinner } from "@/components/brand/tenant-brand";
import { PageLoadState } from "@/components/ui/page-load-state";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, Notice } from "@/components/ui/card";
import { formatMoneyMinor } from "@/lib/qos/money";
import type { CheckoutPaymentOutcomeResponse } from "@/lib/qos/types";
import { useCart } from "@/lib/stores/cart";
import { useStorefrontLocale } from "@/lib/stores/storefront-locale";

function badgeToneForStatus(
  status: CheckoutPaymentOutcomeResponse["status"],
): BadgeTone {
  switch (status) {
    case "succeeded":
      return "success";
    case "failed":
      return "error";
    case "cancelled":
    case "expired":
      return "warning";
    default:
      return "info";
  }
}

function statusLabel(status: CheckoutPaymentOutcomeResponse["status"]) {
  switch (status) {
    case "succeeded":
      return "Payment confirmed";
    case "failed":
      return "Payment declined";
    case "cancelled":
      return "Checkout cancelled";
    case "expired":
      return "Session expired";
    case "unknown":
      return "Confirmation pending";
    default:
      return "Payment in progress";
  }
}

export function CheckoutOutcomePanel({
  outcome,
  polling,
  onRefresh,
}: {
  outcome: CheckoutPaymentOutcomeResponse;
  polling: boolean;
  onRefresh: () => void;
}) {
  const clearCart = useCart((state) => state.clear);
  const locale = useStorefrontLocale((state) => state.locale);

  useEffect(() => {
    if (outcome.status === "succeeded") {
      clearCart();
    }
  }, [clearCart, outcome.status]);

  const showRetry =
    outcome.status === "failed" ||
    outcome.status === "cancelled" ||
    outcome.status === "expired";

  const succeeded = outcome.status === "succeeded";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Badge tone={badgeToneForStatus(outcome.status)}>
          {statusLabel(outcome.status)}
        </Badge>

        <h1 className="t-display-m max-w-[28ch]">
          {locale === "ar" ? outcome.messaging.titleAr : outcome.messaging.titleEn}
        </h1>
        <p className="max-w-[52ch] text-[16px] leading-relaxed text-mocha">
          {locale === "ar" ? outcome.messaging.bodyAr : outcome.messaging.bodyEn}
        </p>
      </div>

      {outcome.diagnostics?.isLabelledFixture ? (
        <Notice tone="info" title="Fixture mode.">
          This outcome came from a labelled development fixture, not a live Stripe sandbox
          charge.
        </Notice>
      ) : null}

      {polling ? (
        <Notice tone="info">
          <span className="inline-flex items-center gap-2">
            <TenantMarkSpinner className="w-4" />
            Confirming your payment…
          </span>
        </Notice>
      ) : null}

      {!polling &&
      (outcome.status === "unknown" ||
        outcome.status === "pending" ||
        outcome.status === "provider_handoff") ? (
        <Notice tone="info" title="Still pending.">
          We have not received a final payment outcome yet. Refresh to check again without
          starting a new payment.
          <button
            type="button"
            onClick={onRefresh}
            className="ml-2 font-medium underline underline-offset-2"
          >
            Refresh status
          </button>
        </Notice>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
        <div className="flex flex-col gap-6">
          <div
            className={
              succeeded
                ? "rounded-md border border-cream/8 bg-espresso p-6 text-cream sm:p-8"
                : "rounded-md border border-line bg-surface p-6 sm:p-8"
            }
          >
            <dl className="grid gap-5 sm:grid-cols-2">
              <div>
                <dt
                  className={
                    succeeded
                      ? "mb-2 text-xs uppercase tracking-[0.18em] text-latte"
                      : "t-label mb-2"
                  }
                >
                  Order total
                </dt>
                <dd className="ltr-isolate font-mono text-[22px] tabular-nums">
                  {formatMoneyMinor(outcome.totalMinor, outcome.currency, locale)}
                </dd>
              </div>
              <div>
                <dt
                  className={
                    succeeded
                      ? "mb-2 text-xs uppercase tracking-[0.18em] text-latte"
                      : "t-label mb-2"
                  }
                >
                  Reference
                </dt>
                <dd className="ltr-isolate font-mono text-[14px] break-all opacity-80">
                  {outcome.paymentAttemptPublicId}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="t-label mb-3">What you ordered</h2>
            <ul className="flex flex-col border-t border-line">
              {outcome.lines.map((line) => (
                <li
                  key={line.linePublicId}
                  className="flex items-start justify-between gap-4 border-b border-line py-4 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-medium leading-snug">
                      {line.displayNameEn}
                    </p>
                    <p className="t-caption ltr-isolate mt-0.5 font-mono">
                      {line.quantity} ×{" "}
                      {formatMoneyMinor(
                        line.unitPrice.amountMinor,
                        outcome.currency,
                        locale,
                      )}
                    </p>
                  </div>
                  <p className="ltr-isolate shrink-0 font-mono text-[13.5px] tabular-nums">
                    {formatMoneyMinor(line.lineTotalMinor, outcome.currency, locale)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border border-line bg-surface p-6">
          {succeeded ? (
            <>
              <h2 className="font-serif text-[22px] tracking-[-0.02em]">You are all set.</h2>
              <p className="text-[14.5px] leading-relaxed text-mocha">
                We will have your order ready at the counter. Show your reference if asked.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <ButtonLink href="/order" size="sm">
                  Order again
                </ButtonLink>
                <ButtonLink href="/loyalty" variant="secondary" size="sm">
                  Bean card
                </ButtonLink>
              </div>
            </>
          ) : (
            <>
              <h2 className="t-label">Need to try again?</h2>
              <p className="text-[14.5px] leading-relaxed text-mocha">
                Your bag is still saved. Return to checkout when you are ready.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {showRetry ? (
                  <ButtonLink href="/checkout" size="sm">
                    Return to checkout
                  </ButtonLink>
                ) : null}
                <ButtonLink href="/menu" variant="secondary" size="sm">
                  Back to menu
                </ButtonLink>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function CheckoutOutcomeLoading({ label }: { label: string }) {
  return (
    <section className="wrap">
      <PageLoadState label={label} className="py-24" />
    </section>
  );
}

export function CheckoutOutcomeEmpty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <section className="wrap py-[clamp(48px,8vw,96px)]">
      <EmptyState title={title} body={body} action={action} />
    </section>
  );
}
