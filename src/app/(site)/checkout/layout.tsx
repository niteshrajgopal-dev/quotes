import { HospitalityPageIntro } from "@/components/hospitality/page-intro";
import { resolveStorefrontContextFromHeaders } from "@/lib/storefront/context.server";
import { isHospitalityTheme } from "@/lib/storefront/hospitality-home-copy";

export default async function CheckoutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const context = await resolveStorefrontContextFromHeaders();
  const isHospitality = isHospitalityTheme(context.themePreset.id);

  return (
    <>
      {isHospitality ? (
        <HospitalityPageIntro
          kicker="Checkout"
          title="One last look."
          lead="Review your bag and pay. Pickup details come from the café you chose."
        />
      ) : null}
      {children}
    </>
  );
}
