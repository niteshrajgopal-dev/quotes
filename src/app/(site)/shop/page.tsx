import type { Metadata } from "next";
import { Bean } from "@/components/brand/bean";
import { ShopGrid } from "@/components/product/shop-grid";
import { Plate } from "@/components/ui/plate";
import { SectionHead } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Coffee",
  description:
    "Single origins and blends, roasted in small batches in Ancoats and posted the next morning.",
};

export default function ShopPage() {
  return (
    <>
      <section className="wrap pt-[clamp(40px,7vw,80px)] pb-[clamp(32px,5vw,56px)]">
        <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
          <Bean className="w-[0.9em]" />
          Retail beans
        </span>
        <h1 className="t-display-l mt-5 max-w-[18ch]">Six coffees, honestly described.</h1>
        <p className="mt-6 max-w-[58ch] text-[clamp(17px,2.2vw,20px)] leading-[1.55] text-mocha">
          Everything here was roasted this week in Ancoats. Tasting notes are what we actually
          taste on the cupping table, not what reads well on a bag.
        </p>
      </section>

      <section className="wrap pb-[clamp(48px,7vw,88px)]">
        <ShopGrid />
      </section>

      <section className="border-t border-line">
        <div className="wrap py-[clamp(52px,7vw,92px)]">
          <SectionHead
            index="—"
            title="How we roast"
            sub="Two roast days a week, on a 15kg drum, profiled per lot rather than per bag size."
          />
          <div className="grid gap-5 md:grid-cols-3">
            <Plate
              tone="origin"
              kicker="Tuesday · light"
              caption="Single origins profiled to keep acidity and florals intact."
              className="min-h-[240px]"
            />
            <Plate
              tone="espresso"
              kicker="Friday · dark"
              caption="Blends developed longer for body under milk."
              className="min-h-[240px]"
            />
            <Plate
              tone="paper"
              kicker="Same week · posted"
              caption="Bagged with a one-way valve, tracked 24-hour, degassed on arrival."
              className="min-h-[240px]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
