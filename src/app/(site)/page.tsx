import Link from "next/link";
import { Bean, BeanDivider } from "@/components/brand/bean";
import { Icon } from "@/components/brand/icons";
import { ButtonLink, TravelArrow } from "@/components/ui/button";
import { SectionHead } from "@/components/ui/card";
import { Plate } from "@/components/ui/plate";
import { LoyaltyTeaser } from "@/components/loyalty/loyalty-teaser";
import { RetailHome } from "@/components/storefront/retail-home";
import { ARTICLES, formatArticleDate } from "@/lib/journal";
import { resolveHeroContentBlock } from "@/lib/storefront/content-blocks";
import { resolveStorefrontContextFromHeaders } from "@/lib/storefront/context.server";
import {
  HOSPITALITY_HOME_PRINCIPLES,
  HOSPITALITY_HOME_STATEMENTS,
} from "@/lib/storefront/hospitality-home-copy";
import { getServerStorefrontLocale } from "@/lib/locale/locale.server";
import { loadPublishedMenu } from "@/lib/qos/menu.server";
import { formatMoneyMinor } from "@/lib/qos/money";

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
  const stories = ARTICLES.filter((article) => article.featured);
  const menuResult = await loadPublishedMenu(locale);
  const menuProducts =
    menuResult.status === "ok"
      ? menuResult.menu.sections.flatMap((section) => section.products)
      : [];
  const barFavourites = menuProducts.slice(0, 4);
  const shelfHighlights = menuProducts.slice(0, 3);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="wrap pt-[clamp(48px,9vw,104px)] pb-[clamp(40px,6vw,72px)]">
        <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div>
            <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
              <Bean className="w-[0.9em]" />
              {context.themePreset.headerChip ?? context.brandName}
            </span>

            <h1 className="t-display-xl mt-6">
              {hero?.title ?? "Coffee worth slowing down for."}
            </h1>

            <p className="mt-7 max-w-[54ch] text-[clamp(17px,2.2vw,20px)] leading-[1.55] text-mocha">
              {hero?.subtitle ?? context.themePreset.footerStatement}
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
                { value: String(context.manifest.locations.length), label: "Branches" },
                { value: String(menuProducts.length), label: "Published items" },
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
                  {HOSPITALITY_HOME_STATEMENTS.hero}
                </p>
              </blockquote>
              <figcaption className="t-overline mt-8 text-latte">
                {context.brandName} — brand essence
              </figcaption>
            </figure>

            <p className="max-w-[40ch] text-[15px] leading-relaxed text-cream/65">
              {hero?.subtitle ?? context.themePreset.footerStatement}
            </p>
          </div>

          <ul className="mt-14 grid gap-x-10 gap-y-8 border-t border-[var(--border-on-dark)] pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {HOSPITALITY_HOME_PRINCIPLES.map((principle) => (
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

      {/* ============ PUBLISHED MENU HIGHLIGHTS ============ */}
      <section className="wrap py-[clamp(52px,7vw,92px)]">
        <SectionHead
          index="01"
          title="From the published menu"
          sub="Highlights from the current QOS release for this branch."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shelfHighlights.length > 0 ? (
            shelfHighlights.map((product) => (
              <li
                key={product.productPublicId}
                className="flex flex-col gap-3 rounded-md border border-line bg-surface p-6"
              >
                <h3 className="t-h2">{product.displayName}</h3>
                {product.description ? (
                  <p className="text-[14.5px] leading-relaxed text-muted">{product.description}</p>
                ) : null}
                <p className="mt-auto font-mono text-[14px] tabular-nums">
                  {formatMoneyMinor(
                    product.price.amountMinor,
                    product.price.currency,
                    menuResult.status === "ok" ? menuResult.menu.locale : locale,
                  )}
                </p>
              </li>
            ))
          ) : (
            <li className="text-[14px] text-muted">Published menu items will appear here.</li>
          )}
        </ul>
        <div className="mt-8">
          <Link
            href="/menu"
            className="group inline-flex min-h-11 items-center gap-2.5 text-[14.5px] font-medium"
          >
            Full café menu
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
                {barFavourites.length > 0 ? (
                  barFavourites.map((item) => (
                    <li key={item.productPublicId} className="flex items-baseline gap-4 py-4">
                      <Bean className="mt-1 w-3 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[16px] font-semibold">{item.displayName}</h3>
                        {item.description ? (
                          <p className="t-caption mt-0.5">{item.description}</p>
                        ) : null}
                      </div>
                      <span className="ltr-isolate shrink-0 font-mono text-[14px] tabular-nums">
                        {formatMoneyMinor(
                          item.price.amountMinor,
                          item.price.currency,
                          menuResult.status === "ok" ? menuResult.menu.locale : locale,
                        )}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="py-4 text-[14px] text-muted">
                    Published menu items will appear here once the branch menu is available.
                  </li>
                )}
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
                {HOSPITALITY_HOME_STATEMENTS.footer}
              </p>
              <p className="t-overline mx-auto mt-7 max-w-[44ch] leading-relaxed text-muted">
                {HOSPITALITY_HOME_STATEMENTS.ritual}
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
            {context.manifest.locations.map((location) => (
              <li key={location.locationPublicId}>
                <Link
                  href={`/locations#${location.slug}`}
                  className="group flex h-full flex-col gap-4 rounded-md border border-line bg-surface p-6 transition-[border-color,box-shadow] duration-std ease-brand hover:border-latte hover:shadow-md"
                >
                  <Icon name="location" className="h-5 w-5 text-latte" strokeWidth={1.7} />
                  <h3 className="t-h2">{location.name}</h3>
                  <p className="t-caption">Published branch from the storefront release.</p>
                  <span className="mt-auto flex items-baseline justify-between gap-3 border-t border-line pt-4 font-mono text-[12px] text-muted">
                    View branch
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
