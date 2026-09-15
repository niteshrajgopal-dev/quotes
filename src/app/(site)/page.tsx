import { HospitalityLanding } from "@/components/home/hospitality-landing";
import { RetailHome } from "@/components/storefront/retail-home";
import { resolveHeroContentBlock } from "@/lib/storefront/content-blocks";
import { resolveStorefrontContextFromHeaders } from "@/lib/storefront/context.server";
import { getServerStorefrontLocale } from "@/lib/locale/locale.server";
import { loadPublishedMenu } from "@/lib/qos/menu.server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const context = await resolveStorefrontContextFromHeaders();
  const locale = await getServerStorefrontLocale();
  const hero = resolveHeroContentBlock(
    context.themePreset.id,
    context.manifest.contentBlocks,
    locale,
  );

  if (context.themePreset.id === "generic_retail_baseline") {
    return (
      <RetailHome
        brandName={context.brandName}
        hero={
          hero ?? {
            id: "hero",
            title: context.brandName,
            subtitle: context.themePreset.footerStatement,
          }
        }
        locations={context.manifest.locations}
      />
    );
  }

  const menuResult = await loadPublishedMenu(locale);
  const menuProducts =
    menuResult.status === "ok"
      ? menuResult.menu.sections.flatMap((section) => section.products)
      : [];

  return (
    <HospitalityLanding
      brandName={context.brandName}
      heroTitle={hero?.title ?? "Coffee worth quoting."}
      heroSubtitle={
        hero?.subtitle ??
        "Crafted with character. Made for moments worth remembering."
      }
      locale={locale}
      menuProducts={menuProducts}
      locations={context.manifest.locations}
    />
  );
}
