import Link from "next/link";
import { Suspense } from "react";

import { TenantMark } from "@/components/brand/tenant-brand";
import { CustomerSignInForm } from "@/components/auth/customer-sign-in-form";
import { Card } from "@/components/ui/card";
import { readOAuthProvidersFromEnv } from "@/lib/auth/customer-auth-client";
import { resolveStorefrontContextFromHeaders } from "@/lib/storefront/context.server";
import { isHospitalityTheme } from "@/lib/storefront/hospitality-home-copy";

export default async function SignInPage() {
  const oauthProviders = readOAuthProvidersFromEnv(process.env.QOS_CUSTOMER_OAUTH_PROVIDERS);
  const context = await resolveStorefrontContextFromHeaders();
  const isHospitality = isHospitalityTheme(context.themePreset.id);

  return (
    <section className="wrap pb-[clamp(48px,7vw,88px)]">
      {!isHospitality ? (
        <header className="mb-8 flex flex-col gap-4">
          <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
            <TenantMark className="w-[0.9em]" />
            Customer account
          </span>
          <h1 className="t-display-m">Sign in for checkout.</h1>
          <p className="max-w-xl text-muted">
            Checkout requires a verified customer session on this storefront domain.
          </p>
        </header>
      ) : null}
      <Card className="max-w-lg">
        <Suspense fallback={<p className="text-muted">Loading sign-in…</p>}>
          <CustomerSignInForm oauthProviders={oauthProviders} />
        </Suspense>
      </Card>

      <p className="mt-6 t-caption">
        <Link href="/checkout" className="underline underline-offset-4">
          Back to checkout
        </Link>
      </p>
    </section>
  );
}
