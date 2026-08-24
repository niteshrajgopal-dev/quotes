import Link from "next/link";
import { Bean, BeanDivider } from "@/components/brand/bean";
import { Icon } from "@/components/brand/icons";
import { ButtonLink, TravelArrow } from "@/components/ui/button";
import { SectionHead } from "@/components/ui/card";
import { Plate } from "@/components/ui/plate";
import { CoffeeCard } from "@/components/product/coffee-card";
import { LoyaltyTeaser } from "@/components/loyalty/loyalty-teaser";
import { BRAND, PRINCIPLES } from "@/lib/brand";
import { getFeatured } from "@/lib/catalog";
import { ARTICLES, formatArticleDate } from "@/lib/journal";
import { LOCATIONS } from "@/lib/locations";
import { MENU_ITEMS } from "@/lib/menu";
import { formatPrice } from "@/lib/brand";

export default function HomePage() {
  const featured = getFeatured();
  const stories = ARTICLES.filter((article) => article.featured);
  const barFavourites = MENU_ITEMS.filter((item) => item.signature);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="wrap pt-[clamp(48px,9vw,104px)] pb-[clamp(40px,6vw,72px)]">
        <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div>
            <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
              <Bean className="w-[0.9em]" />
              {BRAND.tagline}
            </span>

            <h1 className="t-display-xl mt-6">
              Coffee worth
              <br />
              slowing down for.
            </h1>

            <p className="mt-7 max-w-[54ch] text-[clamp(17px,2.2vw,20px)] leading-[1.55] text-mocha">
              {BRAND.description} We roast in small batches a mile from the bar, pour it in
              three cafés across Manchester, and post it anywhere in the country the next
              morning.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/order" size="lg" className="group">
                Order coffee
                <TravelArrow />
              </ButtonLink>
              <ButtonLink href="/shop" variant="secondary" size="lg">
                Shop the beans
              </ButtonLink>
            </div>

            <dl className="mt-11 flex flex-wrap gap-x-9 gap-y-6">
              {[
                { value: "3", label: "Manchester cafés" },
                { value: "6", label: "Coffees on the shelf" },
                { value: "8", label: "Cups to a free one" },
                { value: "1mi", label: "Bar to roastery" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-serif text-[34px] leading-none tracking-[-0.02em]">
                      {stat.value}
                    </span>
                    <span className="t-overline mt-2 block tracking-[0.12em] text-muted">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <Plate
            tone="espresso"
            kicker="Espresso · craft"
            caption="Honey crema from a matte portafilter, steam, golden window light."
            watermark
            className="min-h-[320px] lg:min-h-[440px]"
          />
        </div>
      </section>

      {/* ============ BRAND STATEMENT ============ */}
      <section className="bg-espresso text-cream">
        <div className="wrap py-[clamp(56px,8vw,104px)]">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <figure>
              <blockquote>
                <p className="max-w-[24ch] font-serif text-[clamp(30px,5.5vw,58px)] leading-[1.08] tracking-[-0.03em]">
                  {BRAND.statements.hero}
                </p>
              </blockquote>
              <figcaption className="t-overline mt-8 text-latte">
                {BRAND.legalName} — brand essence
              </figcaption>
            </figure>

            <p className="max-w-[40ch] text-[15px] leading-relaxed text-cream/65">
              {BRAND.essence}
            </p>
          </div>

          <ul className="mt-14 grid gap-x-10 gap-y-8 border-t border-[var(--border-on-dark)] pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <li key={principle.name}>
                <h3 className="flex items-center gap-2.5 font-serif text-[20px] text-cream">
                  <Bean onDark className="w-[0.8em]" />
                  {principle.name}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-cream/60">{principle.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ FEATURED COFFEE ============ */}
      <section className="wrap py-[clamp(52px,7vw,92px)]">
        <SectionHead
          index="01"
          title="On the shelf"
          sub="Roasted Tuesdays and Fridays. Whatever you order was roasted this week."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((coffee) => (
            <CoffeeCard key={coffee.slug} coffee={coffee} />
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/shop"
            className="group inline-flex min-h-11 items-center gap-2.5 text-[14.5px] font-medium"
          >
            All six coffees
            <TravelArrow className="text-latte" />
          </Link>
        </div>
      </section>

      {/* ============ AT THE BAR ============ */}
      <section className="border-t border-line">
        <div className="wrap py-[clamp(52px,7vw,92px)]">
          <SectionHead
            index="02"
            title="At the bar"
            sub="The espresso bar runs on Signature Blend, with a rotating single origin on filter."
          />

          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div className="flex flex-col gap-5">
              <ul className="flex flex-col divide-y divide-line border-y border-line">
                {barFavourites.map((item) => (
                  <li key={item.id} className="flex items-baseline gap-4 py-4">
                    <Bean className="mt-1 w-3 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[16px] font-semibold">{item.name}</h3>
                      <p className="t-caption mt-0.5">{item.description}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[14px] tabular-nums">
                      {formatPrice(item.basePrice)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/menu" size="md" className="group">
                  Full café menu
                  <TravelArrow />
                </ButtonLink>
                <ButtonLink href="/order" variant="secondary" size="md">
                  Order ahead
                </ButtonLink>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Plate
                tone="connection"
                kicker="Connection · people"
                caption="Two hands around ceramic cups on worn wood."
                className="min-h-[240px] sm:min-h-[300px]"
              />
              <Plate
                tone="origin"
                kicker="Origin · material"
                caption="Roasted beans spilling from kraft paper on stone."
                className="min-h-[240px] sm:min-h-[300px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE QUOTE MOMENT ============ */}
      <section className="border-t border-line">
        <div className="wrap py-[clamp(52px,7vw,92px)]">
          <div className="pat-bean-repeat relative overflow-hidden rounded-lg border border-line">
            <div className="relative bg-[color-mix(in_oklab,var(--color-cream),transparent_8%)] px-6 py-[clamp(48px,8vw,88px)] text-center backdrop-blur-[2px] sm:px-12">
              <BeanDivider className="mx-auto max-w-40" />
              <p className="mx-auto mt-8 max-w-[22ch] font-serif text-[clamp(26px,4.6vw,46px)] leading-[1.1] tracking-[-0.025em]">
                {BRAND.statements.footer}
              </p>
              <p className="t-overline mx-auto mt-7 max-w-[44ch] leading-relaxed text-muted">
                {BRAND.statements.ritual}
              </p>
              <BeanDivider className="mx-auto mt-8 max-w-40" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ LOYALTY ============ */}
      <section className="bg-espresso text-cream">
        <div className="wrap py-[clamp(52px,7vw,92px)]">
          <SectionHead
            index="03"
            title="Rewards"
            sub="One mark, doing quiet work: the bean is the stamp."
            tone="dark"
          />
          <LoyaltyTeaser />
        </div>
      </section>

      {/* ============ JOURNAL ============ */}
      <section className="wrap py-[clamp(52px,7vw,92px)]">
        <SectionHead
          index="04"
          title="From the journal"
          sub="Origins, people and conversations — closer to a magazine than a blog."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {stories.map((article) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-md border border-line bg-surface transition-[transform,box-shadow,border-color] duration-std ease-brand hover:-translate-y-[3px] hover:border-[color-mix(in_oklab,var(--color-latte),var(--color-line)_30%)] hover:shadow-lift"
            >
              <Plate
                tone={article.plate}
                badge={article.kind}
                rounded="none"
                className="min-h-[180px] border-0 border-b border-line"
              />
              <div className="flex flex-1 flex-col gap-3 p-6">
                <span className="t-overline text-muted">
                  {formatArticleDate(article.date)} · {article.readingMinutes} min
                </span>
                <h3 className="t-h1">{article.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-muted">{article.standfirst}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-2 text-[13.5px] font-medium">
                  Read it
                  <TravelArrow className="text-latte" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ LOCATIONS ============ */}
      <section className="border-t border-line">
        <div className="wrap py-[clamp(52px,7vw,92px)]">
          <SectionHead
            index="05"
            title="Three cafés"
            sub="Northern Quarter for the window bench, Ancoats for the roaster, Chorlton for the neighbourhood."
          />
          <ul className="grid gap-5 md:grid-cols-3">
            {LOCATIONS.map((location) => (
              <li key={location.id}>
                <Link
                  href={`/locations#${location.id}`}
                  className="group flex h-full flex-col gap-4 rounded-md border border-line bg-surface p-6 transition-[border-color,box-shadow] duration-std ease-brand hover:border-latte hover:shadow-md"
                >
                  <Icon name="location" className="h-5 w-5 text-latte" strokeWidth={1.7} />
                  <h3 className="t-h2">{location.name.replace("quotes ", "")}</h3>
                  <p className="t-caption">{location.address.join(", ")}</p>
                  <p className="text-[13.5px] leading-relaxed text-mocha">{location.note}</p>
                  <span className="mt-auto flex items-baseline justify-between gap-3 border-t border-line pt-4 font-mono text-[12px] text-muted">
                    {location.hours[0].hours}
                    <TravelArrow className="text-latte" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
