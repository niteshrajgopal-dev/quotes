import { HospitalityPageIntro } from "@/components/hospitality/page-intro";
import { resolveStorefrontContextFromHeaders } from "@/lib/storefront/context.server";
import { isHospitalityTheme } from "@/lib/storefront/hospitality-home-copy";

export default async function CheckoutCancelledLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const context = await resolveStorefrontContextFromHeaders();
  const isHospitality = isHospitalityTheme(context.themePreset.id);

  return (
    <>
      {isHospitality ? (
        <HospitalityPageIntro
          kicker="Checkout"
          title="Payment not completed."
          lead="Your bag is still saved if you want to try again."
        />
      ) : null}
      {children}
    </>
  );
}
