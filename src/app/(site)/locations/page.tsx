import type { Metadata } from "next";
import { Bean } from "@/components/brand/bean";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, TravelArrow } from "@/components/ui/button";
import { Icon } from "@/components/brand/icons";
import { Plate } from "@/components/ui/plate";
import { LOCATIONS } from "@/lib/locations";
import { SOCIALS } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Three quotes cafés across Manchester — Northern Quarter, Ancoats and Chorlton. Hours, services and directions.",
};

export default function LocationsPage() {
  return (
    <>
      <section className="wrap pt-[clamp(40px,7vw,80px)] pb-[clamp(32px,5vw,56px)]">
        <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
          <Bean className="w-[0.9em]" />
          Our locations
        </span>
        <h1 className="t-display-l mt-5 max-w-[18ch]">Three rooms, one bar standard.</h1>
        <p className="mt-6 max-w-[56ch] text-[clamp(17px,2.2vw,20px)] leading-[1.55] text-mocha">
          Same coffee, same grinders, same recipes. What changes is the room, the light and who
          you end up sitting next to.
        </p>
      </section>

      <section className="wrap pb-[clamp(48px,7vw,88px)]">
        <ul className="flex flex-col gap-6">
          {LOCATIONS.map((location, index) => (
            <li
              key={location.id}
              id={location.id}
              className="scroll-mt-24 overflow-hidden rounded-lg border border-line bg-surface"
            >
              <div className="grid lg:grid-cols-[1fr_1.25fr]">
                <Plate
                  tone={index === 0 ? "espresso" : index === 1 ? "origin" : "connection"}
                  kicker={location.neighbourhood}
                  caption={location.note}
                  watermark
                  rounded="none"
                  className="min-h-[240px] border-0 lg:min-h-[340px]"
                />

                <div className="flex flex-col gap-6 p-7 sm:p-9">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="t-h1">{location.name.replace("quotes ", "")}</h2>
                      <address className="t-caption mt-2 not-italic">
                        {location.address.join(", ")}
                      </address>
                    </div>
                    <Badge tone="neutral">
                      <Icon name="cup" className="h-3 w-3" strokeWidth={2} />~
                      {location.prepMinutes} min
                    </Badge>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="t-label mb-3">Opening hours</h3>
                      <dl className="flex flex-col gap-2 font-mono text-[12.5px]">
                        {location.hours.map((entry) => (
                          <div key={entry.days} className="flex justify-between gap-3">
                            <dt className="text-muted">{entry.days}</dt>
                            <dd className={entry.hours === "Closed" ? "text-muted" : ""}>
                              {entry.hours}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      <p className="t-caption mt-3">Busiest from {location.busyFrom}.</p>
                    </div>

                    <div>
                      <h3 className="t-label mb-3">In this café</h3>
                      <ul className="flex flex-wrap gap-1.5">
                        {location.services.map((service) => (
                          <li
                            key={service}
                            className="rounded-full border border-line px-2.5 py-1 font-mono text-[10.5px] tracking-[0.06em] text-mocha uppercase"
                          >
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <dl className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                    <div>
                      <dt className="t-label mb-2">Phone</dt>
                      <dd>
                        <a
                          href={`tel:${location.phone.replace(/\s/g, "")}`}
                          className="text-[14px] underline decoration-line underline-offset-4 transition-colors duration-fast hover:decoration-latte"
                        >
                          {location.phone}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="t-label mb-2">what3words</dt>
                      <dd className="font-mono text-[13px] text-mocha">{location.what3words}</dd>
                    </div>
                  </dl>

                  <div className="flex flex-wrap gap-3">
                    <ButtonLink href="/order" size="md" className="group">
                      Order for collection
                      <TravelArrow />
                    </ButtonLink>
                    <ButtonLink href="/menu" variant="secondary" size="md">
                      See the menu
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

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
                  <a
                    href={social.href}
                    rel="noreferrer noopener"
                    className="group flex min-h-16 flex-col justify-center gap-1 rounded-md border border-[var(--border-on-dark)] px-5 py-4 transition-[background-color,border-color] duration-fast ease-brand hover:border-cream/50 hover:bg-cream/8"
                  >
                    <span className="text-[14.5px] font-medium text-cream">{social.label}</span>
                    <span className="font-mono text-[11px] tracking-[0.06em] text-cream/50">
                      {social.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
