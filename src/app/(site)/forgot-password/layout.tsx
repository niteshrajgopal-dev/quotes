import { HospitalityPageIntro } from "@/components/hospitality/page-intro";
import { resolveStorefrontContextFromHeaders } from "@/lib/storefront/context.server";
import { isHospitalityTheme } from "@/lib/storefront/hospitality-home-copy";

export default async function ForgotPasswordLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const context = await resolveStorefrontContextFromHeaders();
  const isHospitality = isHospitalityTheme(context.themePreset.id);

  return (
    <>
      {isHospitality ? (
        <HospitalityPageIntro
          kicker="Account"
          title="Reset your password."
          lead="We will email a link to choose a new password."
        />
      ) : null}
      {children}
    </>
  );
}
