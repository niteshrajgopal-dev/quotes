import type { Metadata } from "next";
import { TenantMark } from "@/components/brand/tenant-brand";
import { HospitalityPageIntro } from "@/components/hospitality/page-intro";
import { OrderFlow } from "@/components/order/order-flow";
import { resolveStorefrontContextFromHeaders } from "@/lib/storefront/context.server";
import { isHospitalityTheme } from "@/lib/storefront/hospitality-home-copy";
import { storefrontMessage } from "@/lib/locale/messages";
import { getServerStorefrontLocale } from "@/lib/locale/locale.server";
import { loadPublishedMenu } from "@/lib/qos/menu.server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order",
  description: "Order ahead from the published branch menu.",
};

export default async function OrderPage() {
  const context = await resolveStorefrontContextFromHeaders();
  const locale = await getServerStorefrontLocale();
  const menuResult = await loadPublishedMenu(locale);
  const isHospitality = isHospitalityTheme(context.themePreset.id);

  return (
    <>
      {isHospitality ? (
        <HospitalityPageIntro
          kicker={storefrontMessage(locale, "orderKicker")}
          title={storefrontMessage(locale, "orderTitle")}
          lead={storefrontMessage(locale, "orderLead")}
        />
      ) : (
        <section className="wrap pt-[clamp(32px,5vw,64px)] pb-0">
          <header className="mb-8 flex flex-col gap-4">
            <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
              <TenantMark className="w-[0.9em]" />
              Order ahead
            </span>
            <h1 className="t-display-l max-w-[20ch]">Five steps, about a minute.</h1>
            <p className="max-w-[54ch] text-[clamp(16px,2vw,18px)] leading-[1.55] text-mocha">
              Choose a café, build the round, and it will be on the counter when you get there.
            </p>
          </header>
        </section>
      )}

      <section className="wrap pb-[clamp(48px,7vw,88px)]">
        <OrderFlow menuResult={menuResult} />
      </section>
    </>
  );
}
