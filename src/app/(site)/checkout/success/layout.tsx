import { HospitalityPageIntro } from "@/components/hospitality/page-intro";
import { resolveStorefrontContextFromHeaders } from "@/lib/storefront/context.server";
import { isHospitalityTheme } from "@/lib/storefront/hospitality-home-copy";

export default async function CheckoutSuccessLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const context = await resolveStorefrontContextFromHeaders();
  const isHospitality = isHospitalityTheme(context.themePreset.id);

  return (
    <>
      {isHospitality ? (
        <HospitalityPageIntro
          kicker="Confirmation"
          title="Order confirmed."
          lead="We will start preparing your drinks as soon as payment clears."
        />
      ) : null}
      {children}
    </>
  );
}
