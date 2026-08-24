import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bean, BeanDivider } from "@/components/brand/bean";
import { Badge } from "@/components/ui/badge";
import { Card, SectionHead } from "@/components/ui/card";
import { BagPlate, Plate } from "@/components/ui/plate";
import { TravelArrow } from "@/components/ui/button";
import { AddToBag } from "@/components/product/add-to-bag";
import { CoffeeCard } from "@/components/product/coffee-card";
import { COFFEES, getCoffee } from "@/lib/catalog";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return COFFEES.map((coffee) => ({ slug: coffee.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const coffee = getCoffee(slug);
  if (!coffee) return { title: "Coffee not found" };

  return {
    title: coffee.name,
    description: coffee.strapline,
    openGraph: { title: `${coffee.name} · quotes`, description: coffee.strapline },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const coffee = getCoffee(slug);
  if (!coffee) notFound();

  const related = COFFEES.filter((candidate) => candidate.slug !== coffee.slug).slice(0, 3);

  const specs = [
    { label: "Origin", value: coffee.origin },
    { label: "Region", value: coffee.region },
    { label: "Producer", value: coffee.producer },
    { label: "Altitude", value: coffee.altitude },
    { label: "Varietal", value: coffee.varietal },
    { label: "Process", value: coffee.process },
    { label: "Roast", value: coffee.roast },
  ];

  return (
    <>
      <nav aria-label="Breadcrumb" className="wrap pt-6">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
          <li>
            <Link href="/shop" className="transition-colors duration-fast hover:text-fg">
              Coffee
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-fg">{coffee.name}</li>
        </ol>
      </nav>

      <section className="wrap pt-8 pb-[clamp(48px,7vw,88px)]">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* --- imagery --- */}
          <div className="flex flex-col gap-4">
            <BagPlate
              tone={coffee.plate}
              label={coffee.name}
              sublabel={`${coffee.process} · ${coffee.roast} roast`}
              className="aspect-4/5 lg:sticky lg:top-24"
            />
          </div>

          {/* --- buy column --- */}
          <div className="flex flex-col gap-7">
            <header className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="t-overline text-accent">{coffee.overline}</span>
                {coffee.limited ? <Badge tone="latte">Limited lot</Badge> : null}
                {coffee.decaf ? <Badge tone="info">Decaf</Badge> : null}
                {coffee.stock === "low-stock" ? <Badge tone="warning">Low stock</Badge> : null}
                {coffee.stock === "sold-out" ? <Badge tone="espresso">Sold out</Badge> : null}
              </div>

              <h1 className="t-display-m">{coffee.name}</h1>
              <p className="max-w-[46ch] text-[clamp(16px,2vw,18px)] leading-relaxed text-mocha">
                {coffee.strapline}
              </p>

              <ul className="flex flex-wrap gap-2 pt-1">
                {coffee.notes.map((note) => (
                  <li
                    key={note}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px]"
                  >
                    <Bean className="w-2.5" />
                    {note}
                  </li>
                ))}
              </ul>
            </header>

            <AddToBag coffee={coffee} />
          </div>
        </div>
      </section>

      {/* --- detail: story, specs, profile --- */}
      <section className="border-t border-line">
        <div className="wrap py-[clamp(48px,7vw,88px)]">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
            <div className="flex flex-col gap-6">
              <h2 className="t-h1">The lot</h2>
              <p className="max-w-[62ch] text-[17px] leading-[1.7] text-mocha">{coffee.story}</p>

              <BeanDivider className="my-2 max-w-60" />

              <div>
                <h3 className="t-label mb-4">Brews well as</h3>
                <ul className="flex flex-wrap gap-2">
                  {coffee.brewMethods.map((method) => (
                    <li
                      key={method}
                      className="rounded-sm border border-line bg-surface px-3.5 py-2 text-[13.5px]"
                    >
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <Card>
                <h3 className="t-label mb-4">Cupping profile</h3>
                <dl className="flex flex-col gap-3.5">
                  {(
                    [
                      ["Acidity", coffee.profile.acidity],
                      ["Body", coffee.profile.body],
                      ["Sweetness", coffee.profile.sweetness],
                      ["Bitterness", coffee.profile.bitterness],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="flex items-center gap-4">
                      <dt className="w-24 shrink-0 text-[13.5px] text-muted">{label}</dt>
                      <dd
                        className="flex gap-1.5"
                        aria-label={`${label} ${value} out of 5`}
                      >
                        {Array.from({ length: 5 }, (_, index) => (
                          <span
                            key={index}
                            aria-hidden="true"
                            className={cn(
                              "h-2.5 w-6 rounded-full",
                              index < value ? "bg-espresso" : "bg-latte-100",
                            )}
                          />
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Card>

              <Card className="p-0">
                <h3 className="t-label border-b border-line px-6 py-4">Origin detail</h3>
                <dl className="divide-y divide-line">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex gap-4 px-6 py-3.5">
                      <dt className="w-24 shrink-0 font-mono text-[11.5px] tracking-[0.08em] text-muted uppercase">
                        {spec.label}
                      </dt>
                      <dd className="text-[14px]">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* --- subscription pitch --- */}
      <section className="bg-espresso text-cream">
        <div className="wrap py-[clamp(48px,7vw,88px)]">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div className="flex flex-col gap-5">
              <span className="t-overline text-latte">Subscription</span>
              <h2 className="t-display-m max-w-[20ch] text-cream">
                Never run out, never pay full price.
              </h2>
              <p className="max-w-[46ch] text-[15px] leading-relaxed text-cream/65">
                Pick a frequency, save up to 15%, and skip or pause whenever you like. Each bag
                is roasted the day before it ships and ground to your method on the way out.
              </p>
              <ul className="mt-1 flex flex-col gap-2.5">
                {[
                  "Roasted to order, never from stock",
                  "Free delivery on every subscription bag",
                  "Swap the coffee any time before roast day",
                ].map((line) => (
                  <li key={line} className="flex items-center gap-3 text-[14px] text-cream/80">
                    <Bean onDark className="w-3 shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <Plate
              tone="paper"
              kicker="Recycled paper"
              caption="Kraft bag, one-way valve, printed in one colour."
              className="min-h-[280px]"
            />
          </div>
        </div>
      </section>

      {/* --- related --- */}
      <section className="wrap py-[clamp(48px,7vw,88px)]">
        <SectionHead index="—" title="Also on the shelf" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((candidate) => (
            <CoffeeCard key={candidate.slug} coffee={candidate} />
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/shop"
            className="group inline-flex min-h-11 items-center gap-2.5 text-[14.5px] font-medium"
          >
            Back to all coffee
            <TravelArrow className="text-latte" />
          </Link>
        </div>
      </section>
    </>
  );
}
