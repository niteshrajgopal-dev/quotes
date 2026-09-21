"use client";

import { useEffect, useState } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { Notice } from "@/components/ui/card";
import { buildSignInHref } from "@/lib/auth/customer-auth-client";
import { startCheckoutFromBasket } from "@/lib/qos/checkout-handoff-client";
import { QosRequestError } from "@/lib/qos/api-client";
import {
  selectCustomerDisplayName,
  selectCustomerSignedIn,
  useCustomerSession,
} from "@/lib/stores/customer-session";
import { useQosBasket } from "@/lib/stores/qos-basket";

export function QosCheckoutHandoff() {
  const basket = useQosBasket((state) => state.basket);
  const signedIn = useCustomerSession(selectCustomerSignedIn);
  const displayName = useCustomerSession(selectCustomerDisplayName);
  const sessionStatus = useCustomerSession((state) => state.status);
  const refreshCustomer = useCustomerSession((state) => state.refresh);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        await refreshCustomer();
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [refreshCustomer]);

  async function onStartCheckout() {
    if (!basket || basket.lines.length === 0) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const paymentAttempt = await startCheckoutFromBasket(basket.version);

      if (!paymentAttempt.handoff.url) {
        throw new Error("QOS did not return a checkout handoff URL.");
      }

      window.location.assign(paymentAttempt.handoff.url);
    } catch (handoffError) {
      if (
        handoffError instanceof QosRequestError &&
        (handoffError.statusCode === 401 || handoffError.field === "emailVerified")
      ) {
        await refreshCustomer();
        setError(
          handoffError.field === "emailVerified"
            ? "Verify your email before paying."
            : "Sign in with your customer account to continue.",
        );
      } else {
        setError(
          handoffError instanceof Error
            ? handoffError.message
            : "Unable to start checkout.",
        );
      }
      setBusy(false);
    }
  }

  const canCheckout = signedIn && basket && basket.lines.length > 0;
  const checking = loading || sessionStatus === "loading";

  return (
    <div className="flex flex-col gap-6 rounded-md border border-line bg-surface p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-[clamp(24px,2.4vw,32px)] tracking-[-0.02em]">
          Payment
        </h2>
        <p className="max-w-[46ch] text-[15px] leading-relaxed text-mocha">
          Pay securely and we will confirm your order. You will return here once payment
          completes.
        </p>
      </div>

      {checking ? (
        <p className="text-[14px] text-muted">Checking your account…</p>
      ) : null}

      {!checking && !signedIn ? (
        <Notice tone="info" title="Sign in to pay">
          Checkout is tied to your customer account.
          <div className="mt-3">
            <ButtonLink href={buildSignInHref("/checkout")} size="sm">
              Sign in to continue
            </ButtonLink>
          </div>
        </Notice>
      ) : null}

      {!checking && signedIn ? (
        <p className="text-[14px] text-mocha">
          Signed in as <span className="font-medium text-fg">{displayName}</span>.
        </p>
      ) : null}

      {error ? (
        <Notice tone="error" title="Checkout unavailable">
          {error}
        </Notice>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          size="lg"
          loading={busy}
          loadingLabel="Redirecting to payment…"
          disabled={checking || !canCheckout || Boolean(error)}
          onClick={() => void onStartCheckout()}
        >
          Pay now
        </Button>
        <ButtonLink href="/order" variant="secondary" size="lg">
          Edit order
        </ButtonLink>
      </div>
    </div>
  );
}
