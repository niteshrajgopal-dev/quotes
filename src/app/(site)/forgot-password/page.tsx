import { Suspense } from "react";

import { TenantMark } from "@/components/brand/tenant-brand";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Card } from "@/components/ui/card";
import { resolveStorefrontContextFromHeaders } from "@/lib/storefront/context.server";
import { isHospitalityTheme } from "@/lib/storefront/hospitality-home-copy";

export default async function ForgotPasswordPage() {
  const context = await resolveStorefrontContextFromHeaders();
  const isHospitality = isHospitalityTheme(context.themePreset.id);

  return (
    <section className="wrap pb-[clamp(48px,7vw,88px)]">
      {!isHospitality ? (
        <header className="mb-8 flex flex-col gap-4">
          <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
            <TenantMark className="w-[0.9em]" />
            Password recovery
          </span>
          <h1 className="t-display-m">Reset your password.</h1>
        </header>
      ) : null}
      <Card className="max-w-lg">
        <Suspense fallback={<p className="text-muted">Loading…</p>}>
          <ForgotPasswordForm />
        </Suspense>
      </Card>
    </section>
  );
}
