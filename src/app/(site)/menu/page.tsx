import type { Metadata } from "next";
import { Bean } from "@/components/brand/bean";
import { ButtonLink, TravelArrow } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MenuBoard } from "@/components/menu/menu-board";
import { DIETARY_LABELS } from "@/lib/menu";
import { LOCATIONS } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Café menu",
  description:
    "Espresso bar, filter and brew, not-coffee and bakery — with sizes, milks and customisation.",
};

export default function MenuPage() {
  return (
    <>
      <section className="wrap pt-[clamp(40px,7vw,80px)] pb-[clamp(28px,4vw,48px)]">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-14">
          <div>
            <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
              <Bean className="w-[0.9em]" />
              Café menu
            </span>
            <h1 className="t-display-l mt-5 max-w-[20ch]">Everything on the bar today.</h1>
            <p className="mt-6 max-w-[56ch] text-[clamp(17px,2.2vw,20px)] leading-[1.55] text-mocha">
              Espresso runs on Signature Blend as standard, with a rotating single origin on
              filter. Prices are the same whether you sit in or take it away.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/order" size="lg" className="group">
                Order ahead
                <TravelArrow />
              </ButtonLink>
              <ButtonLink href="/locations" variant="secondary" size="lg">
                Find a café
              </ButtonLink>
            </div>
          </div>

          <Card className="flex flex-col gap-4">
            <h2 className="t-label">Dietary key</h2>
            <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {Object.entries(DIETARY_LABELS).map(([code, label]) => (
                <div key={code} className="flex items-center gap-3 text-[13.5px]">
                  <dt className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line font-mono text-[10px] tracking-[0.06em] text-muted">
                    {code}
                  </dt>
                  <dd>{label}</dd>
                </div>
              ))}
            </dl>
            <p className="t-caption border-t border-line pt-3">
              Oat, almond and soy are {"\u00A0"}+40p. Tell the bar about allergies and we will
              check every component.
            </p>
          </Card>
        </div>
      </section>

      <section className="wrap pb-[clamp(48px,7vw,88px)]">
        <MenuBoard />
      </section>

      <section className="border-t border-line">
        <div className="wrap py-[clamp(40px,6vw,72px)]">
          <h2 className="t-h1 mb-8">Where it&apos;s served</h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {LOCATIONS.map((location) => (
              <li key={location.id}>
                <Card className="flex h-full flex-col gap-3">
                  <h3 className="t-h2">{location.name.replace("quotes ", "")}</h3>
                  <p className="t-caption">{location.address.join(", ")}</p>
                  <dl className="mt-auto flex flex-col gap-1.5 border-t border-line pt-4 font-mono text-[12px]">
                    {location.hours.map((entry) => (
                      <div key={entry.days} className="flex justify-between gap-3">
                        <dt className="text-muted">{entry.days}</dt>
                        <dd>{entry.hours}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
