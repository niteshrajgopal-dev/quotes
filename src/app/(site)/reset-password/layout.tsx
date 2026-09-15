import { HospitalityPageIntro } from "@/components/hospitality/page-intro";
import { resolveStorefrontContextFromHeaders } from "@/lib/storefront/context.server";
import { isHospitalityTheme } from "@/lib/storefront/hospitality-home-copy";

export default async function ResetPasswordLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const context = await resolveStorefrontContextFromHeaders();
  const isHospitality = isHospitalityTheme(context.themePreset.id);

  return (
    <>
      {isHospitality ? (
        <HospitalityPageIntro
          kicker="Account"
          title="Choose a new password."
          lead="Pick something you have not used here before."
        />
      ) : null}
      {children}
    </>
  );
}
