import type { Metadata } from "next";
import { HospitalityPageIntro } from "@/components/hospitality/page-intro";
import { ShopGrid } from "@/components/product/shop-grid";
import { Plate } from "@/components/ui/plate";
import { SectionHead } from "@/components/ui/card";
import { storefrontMessage } from "@/lib/locale/messages";
import { getServerStorefrontLocale } from "@/lib/locale/locale.server";

export const metadata: Metadata = {
  title: "Coffee",
  description:
    "Single origins and blends, roasted in small batches in Ancoats and posted the next morning.",
};

export default async function ShopPage() {
  const locale = await getServerStorefrontLocale();

  return (
    <>
      <HospitalityPageIntro
        kicker={storefrontMessage(locale, "shopKicker")}
        title={storefrontMessage(locale, "shopTitle")}
        lead={storefrontMessage(locale, "shopLead")}
      />

      <section className="wrap pb-[clamp(48px,7vw,88px)]">
        <ShopGrid />
      </section>

      <section className="border-t border-line">
        <div className="wrap py-[clamp(52px,7vw,92px)]">
          <SectionHead
            index="—"
            title={storefrontMessage(locale, "shopHowRoastTitle")}
            sub={storefrontMessage(locale, "shopHowRoastSub")}
          />
          <div className="grid gap-5 md:grid-cols-3">
            <Plate
              tone="origin"
              kicker={storefrontMessage(locale, "shopPlateTuesdayKicker")}
              caption={storefrontMessage(locale, "shopPlateTuesdayCaption")}
              className="min-h-[240px]"
            />
            <Plate
              tone="espresso"
              kicker={storefrontMessage(locale, "shopPlateFridayKicker")}
              caption={storefrontMessage(locale, "shopPlateFridayCaption")}
              className="min-h-[240px]"
            />
            <Plate
              tone="paper"
              kicker={storefrontMessage(locale, "shopPlatePostedKicker")}
              caption={storefrontMessage(locale, "shopPlatePostedCaption")}
              className="min-h-[240px]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
