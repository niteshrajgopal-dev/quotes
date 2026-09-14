import type { Metadata } from "next";
import Link from "next/link";

import { Bean } from "@/components/brand/bean";
import { ButtonLink, TravelArrow } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/brand/icons";
import { SOCIALS } from "@/lib/fixtures/quotes-design-reference/brand";
import { resolveStorefrontContextFromHeaders } from "@/lib/storefront/context.server";
import { isHospitalityTheme } from "@/lib/storefront/hospitality-home-copy";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const context = await resolveStorefrontContextFromHeaders();
  return {
    title: "Locations",
    description: `Branches configured for ${context.brandName}.`,
  };
}

export default async function LocationsPage() {
  const context = await resolveStorefrontContextFromHeaders();
  const isRetail = !isHospitalityTheme(context.themePreset.id);

  return (
    <>
      <section className="wrap pt-[clamp(40px,7vw,80px)] pb-[clamp(32px,5vw,56px)]">
        <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
          <Bean className="w-[0.9em]" />
          Our locations
        </span>
        <h1 className="t-display-l mt-5 max-w-[18ch]">
          {isRetail ? "Where to collect." : "One bar standard, every branch."}
        </h1>
        <p className="mt-6 max-w-[56ch] text-[clamp(17px,2.2vw,20px)] leading-[1.55] text-mocha">
          Branches are loaded from the published storefront release for {context.brandName}.
        </p>
      </section>

      <section className="wrap pb-[clamp(48px,7vw,88px)]">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {context.manifest.locations.map((location) => (
            <li key={location.locationPublicId} id={location.slug} className="scroll-mt-24">
              <Card className="flex h-full flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <Icon name="location" className="h-5 w-5 text-latte" strokeWidth={1.7} />
                  <span className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
                    {location.locationPublicId}
                  </span>
                </div>
                <h2 className="t-h1">{location.name}</h2>
                <p className="text-[14.5px] leading-relaxed text-mocha">
                  Published branch linked to the active menu release.
                </p>
                <div className="mt-auto flex flex-wrap gap-3 border-t border-line pt-4">
                  <ButtonLink href="/menu" size="md" className="group">
                    {isRetail ? "Shop" : "See the menu"}
                    <TravelArrow />
                  </ButtonLink>
                  <ButtonLink href="/order" variant="secondary" size="md">
                    Order ahead
                  </ButtonLink>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {isHospitalityTheme(context.themePreset.id) ? (
        <section className="bg-espresso text-cream">
          <div className="wrap py-[clamp(48px,7vw,88px)]">
            <div className="flex flex-col gap-6">
              <span className="t-overline text-latte">Follow &amp; connect</span>
              <h2 className="t-display-m max-w-[20ch] text-cream">
                Ask us anything. We answer quickly.
              </h2>
              <ul className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <Link
                      href={social.href}
                      rel="noreferrer noopener"
                      className="group flex min-h-16 flex-col justify-center gap-1 rounded-md border border-[var(--border-on-dark)] px-5 py-4 transition-[background-color,border-color] duration-fast ease-brand hover:border-cream/50 hover:bg-cream/8"
                    >
                      <span className="text-[14.5px] font-medium text-cream">{social.label}</span>
                      <span className="font-mono text-[11px] tracking-[0.06em] text-cream/50">
                        {social.handle}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
