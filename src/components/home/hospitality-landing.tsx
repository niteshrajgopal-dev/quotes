"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useHospitalityLandingMotion } from "@/components/home/use-hospitality-landing-motion";
import { MotionButtonLink } from "@/components/ui/motion-button";
import { MenuProductImage } from "@/components/menu/menu-product-image";
import {
  hospitalityVenuePhoto,
  hospitalityVenueTag,
} from "@/lib/storefront/hospitality-assets";
import type { StorefrontManifestLocation } from "@/lib/storefront/manifest-types";
import { formatMoneyMinor } from "@/lib/qos/money";
import { storefrontMessage, storefrontMessageWithValues } from "@/lib/locale/messages";
import {
  hospitalityDrinkStatements,
  hospitalityFeatureIngredients,
  hospitalityOriginSteps,
} from "@/lib/locale/hospitality-marketing";
import type { PublicMenuLocale, PublicMenuProduct, PublicMenuSection } from "@/lib/qos/menu-types";
import { normalizeProductName } from "@/lib/storefront/normalize-product-name";
import type { StorefrontLocale } from "@/lib/locale/storefront-locale";

type HospitalityLandingProps = {
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  locale: PublicMenuLocale;
  menuProducts: PublicMenuProduct[];
  menuSections: PublicMenuSection[];
  locations: StorefrontManifestLocation[];
};

export function HospitalityLanding({
  brandName,
  heroTitle,
  heroSubtitle,
  locale,
  menuProducts,
  menuSections,
  locations,
}: HospitalityLandingProps) {
  const rootRef = useRef<HTMLElement>(null);
  useHospitalityLandingMotion(rootRef);
  const drinkStatements = hospitalityDrinkStatements(locale);
  const originSteps = hospitalityOriginSteps(locale);
  const featureIngredients = hospitalityFeatureIngredients(locale);

  const titleLineOne = heroTitle.includes(" ")
    ? heroTitle.slice(0, heroTitle.lastIndexOf(" "))
    : heroTitle;
  const titleLineTwo = heroTitle.includes(" ")
    ? heroTitle.slice(heroTitle.lastIndexOf(" ") + 1)
    : "";

  const curated = menuProducts.slice(0, 3);
  const featured = menuProducts.find((p) =>
    (p.displayName ?? "").toLowerCase().includes("latte"),
  ) ?? menuProducts[0];
  const featuredDescription = featured?.description ?? "";
  const featuredDescriptionParts = featuredDescription
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const featureTitles = [
    featured?.displayName ?? "",
    featuredDescriptionParts[0] ?? "",
    featuredDescriptionParts[1] ?? "",
  ].filter(Boolean);
  const homeMenuCategories = menuSections.map((section, index) => ({
    n: String(index + 1).padStart(2, "0"),
    name: section.displayName,
    blurb: section.description ?? "",
    count: section.products.length,
  }));

  return (
    <article ref={rootRef} className="bg-espresso text-cream">
      <div aria-hidden="true" className="grain-overlay" />

      <div
        data-loader
        className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-[18px] bg-espresso"
      >
        <Image
          data-loader-bean
          src="/tenants/hospitality/media/bean.png"
          alt=""
          width={64}
          height={64}
          className="opacity-0"
          style={{ transform: "scale(0.7) rotate(-20deg)" }}
          priority
        />
        <div className="h-[52px] overflow-hidden">
          <Image
            data-loader-word
            src="/tenants/hospitality/media/logo-cream.png"
            alt={brandName}
            width={180}
            height={48}
            className="block h-12 w-auto"
            style={{ transform: "translateY(110%)" }}
            priority
          />
        </div>
      </div>

      <section
        id="top"
        data-hero
        className="relative grid min-h-screen items-center overflow-hidden px-[var(--mx)] pb-[clamp(120px,18vh,220px)] pt-[clamp(110px,15vh,170px)]"
      >
        <div
          data-hero-grid
          className="relative mx-auto grid w-full max-w-[1400px] items-center gap-[clamp(24px,4vw,64px)] max-md:grid-cols-1 max-md:gap-2 md:grid-cols-2"
        >
          <div data-hero-copy className="flex max-w-[600px] flex-col gap-[26px] max-md:order-2">
            <div
              data-hero-kicker
              className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-latte"
            >
              <span className="block h-px w-7 bg-latte" />
              {storefrontMessage(locale, "homeHeroKicker")}
            </div>
            <h1 className="t-display-hero text-balance">
              <span data-hero-line className="block overflow-hidden">
                <span data-hero-word className="block">
                  {titleLineOne}
                </span>
              </span>
              {titleLineTwo ? (
                <span data-hero-line className="block overflow-hidden">
                  <span data-hero-word className="block text-latte">
                    {titleLineTwo}
                  </span>
                </span>
              ) : null}
            </h1>
            <p
              data-hero-sub
              className="max-w-[420px] text-pretty text-[clamp(16px,1.3vw,19px)] leading-[1.55] text-cream/78"
            >
              {heroSubtitle}
            </p>
            <div data-hero-ctas className="flex flex-wrap gap-3">
              <MotionButtonLink href="/menu" variant="inverse-fill">
                {storefrontMessage(locale, "exploreMenu")}
              </MotionButtonLink>
              <MotionButtonLink href="/locations" variant="inverse-outline">
                {storefrontMessage(locale, "findLocation")}
              </MotionButtonLink>
            </div>
          </div>

          <div
            data-hero-cupwrap
            className="relative flex min-h-[clamp(320px,48vh,600px)] items-end justify-center max-md:order-1 max-md:min-h-[34vh]"
          >
            <div
              data-hero-halo
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 aspect-square w-[min(70vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(203,183,146,.2),rgba(203,183,146,0)_65%)]"
            />
            <Image
              data-hero-cup="b"
              src="/tenants/hospitality/media/photo-splash-cup.png"
              alt="Quotes cup with coffee splash"
              width={460}
              height={580}
              priority
              className="relative z-2 w-[clamp(260px,30vw,460px)] drop-shadow-[0_60px_50px_rgba(0,0,0,.5)] max-md:w-[62vw]"
            />
            <Image
              data-hero-bean="1"
              src="/tenants/hospitality/media/bean.png"
              alt=""
              width={48}
              height={48}
              aria-hidden
              className="absolute bottom-[12%] left-[2%] w-[clamp(30px,3.4vw,48px)] rotate-[30deg] opacity-90"
            />
            <Image
              data-hero-bean="2"
              src="/tenants/hospitality/media/bean.png"
              alt=""
              width={36}
              height={36}
              aria-hidden
              className="absolute right-[4%] top-[8%] w-[clamp(22px,2.6vw,36px)] rotate-[-40deg] opacity-70"
            />
          </div>
        </div>
      </section>

      <section
        data-curated
        className="relative -mt-[14vh] overflow-hidden bg-espresso px-[var(--mx)] pb-[clamp(120px,18vh,220px)] pt-[clamp(80px,14vh,160px)]"
      >
        <div
          data-curated-marquee
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 select-none whitespace-nowrap font-serif text-[clamp(84px,15vw,250px)] leading-none tracking-[-0.02em] text-latte opacity-55"
        >
          {storefrontMessage(locale, "homeCuratedMarquee")}
        </div>
        <div className="relative mx-auto mt-[clamp(60px,10vw,160px)] flex max-w-[1100px] flex-col items-center gap-10">
          <div
            data-curated-grid
            className="grid w-full grid-cols-1 gap-[clamp(14px,2vw,28px)] sm:grid-cols-3"
          >
            {curated.length > 0
              ? curated.map((product) => (
                  <motion.div
                    key={product.productPublicId}
                    data-curated-item
                    whileHover={{ y: -4 }}
                    className="relative flex flex-col items-center pt-[clamp(90px,10vw,140px)]"
                  >
                    <div
                      data-curated-cup
                      className="absolute top-0 left-1/2 z-2 aspect-[3/4] w-[clamp(130px,13vw,200px)] -translate-x-1/2 overflow-hidden rounded-md drop-shadow-[0_40px_50px_-20px_rgba(0,0,0,.6)]"
                    >
                      <MenuProductImage
                        mediaAssetId={product.mediaAssetId}
                        alt={product.displayName}
                        size="detail"
                        className="h-full w-full border-0"
                      />
                    </div>
                    <div
                      data-curated-card
                      className="relative flex w-full flex-col items-center gap-2.5 rounded-md border border-cream/8 bg-mocha/55 px-[22px] pb-[22px] pt-[clamp(100px,9vw,130px)] text-center"
                    >
                      <h3 className="font-serif text-[clamp(22px,2vw,28px)] tracking-[-0.02em]">
                        {normalizeProductName(product.displayName, locale as StorefrontLocale)}
                      </h3>
                      {product.description ? (
                        <p className="max-w-[240px] text-[13px] leading-normal text-cream/65">
                          {product.description}
                        </p>
                      ) : null}
                      <div className="mt-1.5 flex items-center gap-3">
                        <span className="ltr-isolate font-mono text-base tabular-nums">
                          {formatMoneyMinor(
                            product.price.amountMinor,
                            product.price.currency,
                            locale,
                          )}
                        </span>
                        <Link
                          href={`/order?product=${product.productPublicId}`}
                          aria-label={storefrontMessageWithValues(locale, "addProduct", {
                            name: product.displayName,
                          })}
                          className="grid h-[30px] w-[30px] place-items-center rounded-full bg-latte text-lg leading-none text-espresso"
                        >
                          +
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              : null}
          </div>
          <MotionButtonLink data-curated-cta href="/menu" variant="inverse-outline" size="sm">
            {storefrontMessage(locale, "exploreFullMenu")}
          </MotionButtonLink>
        </div>
      </section>

      <section
        id="story-pin"
        data-drinks
        className="relative h-screen overflow-hidden bg-espresso px-[var(--mx)]"
      >
        <div data-drinks-title className="absolute left-1/2 top-[clamp(88px,13vh,130px] flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap">
          <Image src="/tenants/hospitality/media/logo-cream.png" alt={brandName} width={112} height={28} className="h-[clamp(20px,2vw,28px)] w-auto" />
          <span className="text-[clamp(14px,1.3vw,18px)] uppercase tracking-[0.14em] text-cream/60">
            {storefrontMessage(locale, "homeBrandIs")}
          </span>
        </div>
        <div className="absolute left-1/2 top-1/2 h-[min(70vh,760px)] w-[min(100%,1200px)] -translate-x-1/2 -translate-y-1/2">
          <div
            data-drinks-sleeve
            aria-hidden
            className="absolute left-[8%] right-[8%] top-[34%] flex h-[32%] items-center justify-center bg-mocha"
            style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg,rgba(0,0,0,.15),rgba(0,0,0,0) 30%,rgba(0,0,0,0) 65%,rgba(0,0,0,.25))",
              }}
            />
            <Image
              src="/tenants/hospitality/media/logo-cream.png"
              alt=""
              width={220}
              height={56}
              className="relative w-[62%]"
            />
          </div>
          <div
            data-drinks-cupwrap
            className="absolute left-1/2 top-1/2 w-[min(clamp(220px,24vw,360px),40vh)] -translate-x-1/2 will-change-transform drop-shadow-[0_80px_60px_rgba(0,0,0,.55)] max-md:w-[54vw] max-md:-translate-x-1/2"
          >
            <Image
              data-drinks-cup
              src="/tenants/hospitality/media/photo-splash-cup.png"
              alt=""
              width={360}
              height={450}
              className="block w-full"
            />
          </div>
          {drinkStatements.map((statement) => (
            <div
              key={statement.n}
              data-drinks-stmt
              className={`absolute w-[min(34%,320px)] opacity-0 ${statement.className}`}
            >
              <span
                className={`pointer-events-none absolute top-[-0.4em] font-serif text-[clamp(80px,9vw,140px)] leading-none text-latte/10 ${statement.numClass}`}
              >
                {statement.n}
              </span>
              <h3 className="relative text-balance font-serif text-[clamp(20px,1.8vw,26px)] leading-tight tracking-[-0.02em]">
                {statement.title}
              </h3>
              <p className="relative mt-2.5 text-pretty text-[13px] leading-normal text-cream/62">
                {statement.body}
              </p>
            </div>
          ))}
          <MotionButtonLink
            data-drinks-cta
            href="/order"
            variant="inverse-outline"
            size="sm"
            className="absolute left-1/2 top-[64%] -translate-x-1/2 opacity-0"
          >
            {storefrontMessage(locale, "orderNow")}
          </MotionButtonLink>
        </div>
        {[1, 2, 3].map((n) => (
          <Image
            key={n}
            data-drinks-bean
            src="/tenants/hospitality/media/bean.png"
            alt=""
            width={64}
            height={64}
            aria-hidden
            className="absolute opacity-0"
            style={{
              width: `clamp(${28 + n * 6}px, ${3 + n * 0.5}vw, ${44 + n * 6}px)`,
              right: `${8 + n * 10}%`,
              bottom: `-${8 + n * 4}%`,
            }}
          />
        ))}
      </section>

      <section
        data-band
        className="relative z-3 -mt-[22vh] bg-espresso px-[var(--mx)] pb-[clamp(100px,16vh,180px)]"
      >
        <div className="relative mx-auto max-w-[1400px]">
          {[1, 2, 3, 4].map((n) => (
            <Image
              key={n}
              data-band-bean={n}
              src="/tenants/hospitality/media/bean.png"
              alt=""
              width={110}
              height={110}
              aria-hidden
              className="absolute z-2"
              style={{
                width: n === 1 ? "clamp(60px,7vw,110px)" : n === 2 ? "clamp(40px,4.5vw,70px)" : n === 3 ? "clamp(34px,3.6vw,56px)" : "clamp(26px,2.8vw,44px)",
                right: n === 1 ? "12%" : n === 2 ? "28%" : n === 3 ? "4%" : "20%",
                top: n === 1 ? "-140px" : n === 2 ? "-60px" : n === 3 ? "-30px" : "40px",
              }}
            />
          ))}
          <div
            data-band-panel
            className="relative grid items-center gap-8 overflow-hidden rounded-lg border border-cream/8 bg-espresso bg-[url('/tenants/hospitality/media/photo-beans-fall.png')] bg-cover bg-right bg-no-repeat p-[clamp(32px,4vw,56px)] md:grid-cols-[1fr_auto]"
          >
            <div className="flex flex-col gap-[18px]">
              <h2 className="text-balance font-serif text-[clamp(28px,3.4vw,52px)] leading-none tracking-[-0.02em]">
                {storefrontMessage(locale, "homeBandTitle")}
              </h2>
              <MotionButtonLink href="/shop" variant="inverse-fill">
                {storefrontMessage(locale, "homeShopBeans")}
              </MotionButtonLink>
            </div>
            <div
              data-band-heap
              aria-hidden
              className="relative h-[clamp(90px,12vw,180px)] w-[clamp(160px,22vw,340px)]"
            >
              {[
                { w: "26%", l: "6%", t: "40%", r: 15 },
                { w: "24%", l: "26%", t: "52%", r: -35 },
                { w: "28%", l: "44%", t: "36%", r: 60 },
                { w: "22%", l: "66%", t: "50%", r: -10 },
              ].map((bean, i) => (
                <Image
                  key={i}
                  src="/tenants/hospitality/media/bean.png"
                  alt=""
                  width={80}
                  height={80}
                  className="absolute"
                  style={{
                    width: bean.w,
                    left: bean.l,
                    top: bean.t,
                    transform: `rotate(${bean.r}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        data-statement
        className="seam-top relative z-2 overflow-hidden bg-cream px-0 py-[clamp(120px,20vh,220px)] text-espresso"
      >
        <div
          data-statement-line="1"
          className="whitespace-nowrap pl-[6vw] font-serif text-[clamp(72px,13vw,220px)] leading-[0.95] tracking-[-0.03em]"
        >
          {storefrontMessage(locale, "homeEveryCupLine1")}
        </div>
        <div
          data-statement-line="2"
          className="whitespace-nowrap pl-[26vw] font-serif text-[clamp(72px,13vw,220px)] leading-[0.95] tracking-[-0.03em] text-mocha"
        >
          {storefrontMessage(locale, "homeEveryCupLine2")}
          <span className="text-latte">.</span>
        </div>
        <div
          data-statement-cup
          className="absolute right-[clamp(8%,14vw,20%)] top-1/2 aspect-[3/4] w-[clamp(140px,15vw,220px)] -translate-y-1/2 overflow-hidden rounded-md drop-shadow-[0_40px_40px_-10px_rgba(47,35,34,.35)] max-md:right-[6%] max-md:w-[22vw]"
        >
          <Image
            src="/tenants/hospitality/media/product-espresso.png"
            alt=""
            fill
            className="object-cover"
            sizes="220px"
          />
        </div>
        <p
          data-statement-copy
          className="mx-[6vw] mt-16 max-w-[460px] text-pretty text-[clamp(16px,1.2vw,18px)] leading-normal text-mocha"
        >
          {storefrontMessage(locale, "homeEveryCupBody")}
        </p>
      </section>

      <section
        id="story"
        data-origins
        className="relative overflow-hidden bg-cream px-[var(--mx)] pb-[clamp(100px,16vh,200px)] pt-[clamp(60px,10vh,140px)] text-espresso"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 items-start gap-[clamp(16px,2vw,32px)]">
          <div className="col-span-12 flex flex-col gap-6 md:sticky md:top-[20vh] lg:col-span-5">
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-mocha">
              <span className="block h-px w-6 bg-mocha" />
              {storefrontMessage(locale, "homeCraftKicker")}
            </div>
            <h2 className="t-section-title">
              <span data-reveal-line className="mb-[-0.08em] block overflow-hidden pb-[0.08em]">
                <span data-reveal-word className="block">
                  {storefrontMessage(locale, "homeOriginLine1")}
                </span>
              </span>
              <span data-reveal-line className="mb-[-0.08em] block overflow-hidden pb-[0.08em]">
                <span data-reveal-word className="block">
                  {storefrontMessage(locale, "homeOriginLine2")}
                  <span className="text-latte">.</span>
                </span>
              </span>
            </h2>
            <div data-origins-steps className="mt-2 grid max-w-[400px] gap-[22px]">
              {originSteps.map(([n, title, copy]) => (
                <div
                  key={n}
                  data-origin-step
                  className="grid grid-cols-[40px_1fr] gap-3 border-t border-espresso/15 pt-4"
                >
                  <span className="font-serif text-lg text-latte">{n}</span>
                  <div>
                    <div className="text-[15px] font-semibold">{title}</div>
                    <p className="mt-1.5 text-sm leading-normal text-mocha">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-12 grid grid-cols-2 gap-[clamp(16px,2vw,32px)] pt-[6vh] lg:col-span-6 lg:col-start-7">
            <div data-origin-img="1" className="relative col-span-2 aspect-[4/3] overflow-hidden rounded-sm">
              <Image src="/tenants/hospitality/media/craft-cherries.png" alt="" fill className="object-cover" sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div data-origin-img="2" className="relative -mt-[12vh] aspect-[3/4] overflow-hidden rounded-sm max-md:mt-0">
              <Image src="/tenants/hospitality/media/craft-roaster.png" alt="" fill className="object-cover" sizes="(max-width: 900px) 50vw, 25vw" />
            </div>
            <div data-origin-img="3" className="relative mt-[8vh] aspect-[3/4] overflow-hidden rounded-sm max-md:mt-0">
              <Image src="/tenants/hospitality/media/craft-pour.png" alt="" fill className="object-cover" sizes="(max-width: 900px) 50vw, 25vw" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="menu"
        data-menu
        className="seam-top relative z-2 bg-espresso px-[var(--mx)] py-[clamp(100px,16vh,200px)] text-cream"
      >
        <div className="mx-auto grid max-w-[1400px] items-start gap-[clamp(32px,5vw,96px)] md:grid-cols-[5fr_7fr]">
          <div className="flex flex-col gap-6 md:sticky md:top-[20vh]">
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-latte">
              <span className="block h-px w-6 bg-latte" />
              {storefrontMessage(locale, "homeMenuSectionKicker")}
            </div>
            <h2 className="t-section-title">
              <span data-reveal-line className="mb-[-0.08em] block overflow-hidden pb-[0.08em]">
                <span data-reveal-word className="block">
                  {storefrontMessage(locale, "homeMenuLine1")}
                </span>
              </span>
              <span data-reveal-line className="mb-[-0.08em] block overflow-hidden pb-[0.08em]">
                <span data-reveal-word className="block text-latte">
                  {storefrontMessage(locale, "homeMenuLine2")}.
                </span>
              </span>
            </h2>
            <p className="max-w-[380px] text-base leading-normal text-cream/72">
              {storefrontMessage(locale, "homeMenuSectionBlurb")}
            </p>
            <MotionButtonLink href="/menu" variant="inverse-outline">
              {storefrontMessage(locale, "homeSeeFullMenu")}
            </MotionButtonLink>
          </div>
          <div data-menu-list className="flex flex-col border-t border-cream/14">
            {homeMenuCategories.map((category) => (
              <Link
                key={category.n}
                href="/menu"
                data-menu-row
                className="group grid grid-cols-[56px_1fr_auto] items-center gap-5 border-b border-cream/14 px-2 py-[26px] transition-[padding,background] duration-350 ease-[cubic-bezier(.2,.7,.2,1)] hover:bg-cream/3 hover:pl-5"
              >
                <span className="font-serif text-base text-latte">{category.n}</span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="font-serif text-[clamp(28px,3.2vw,44px)] leading-none tracking-[-0.02em]">
                    {category.name}
                  </span>
                  <span className="text-sm text-cream/60">{category.blurb}</span>
                </span>
                <span className="flex items-center gap-3.5 whitespace-nowrap text-[13px] text-cream/60">
                  <span>
                    {storefrontMessageWithValues(locale, "sectionItems", {
                      count: category.count,
                    })}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 text-base transition-colors group-hover:border-cream group-hover:bg-cream group-hover:text-espresso">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        data-feature
        className="relative grid h-screen items-center overflow-hidden px-[var(--mx)] text-cream"
      >
        <div data-feature-bg className="absolute inset-0 bg-[var(--q-mocha)]" />
        <div
          data-feature-halo
          aria-hidden
          className="absolute left-1/2 top-1/2 aspect-square w-[min(90vw,820px)] -translate-x-1/2 -translate-y-1/2 scale-[0.6] rounded-full bg-[radial-gradient(circle,rgba(203,183,146,.28),rgba(203,183,146,0)_65%)] opacity-0"
        />
        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-[clamp(16px,3vw,48px)] md:grid-cols-[1fr_auto_1fr]">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-latte">
              <span className="block h-px w-6 bg-latte" />
              {storefrontMessage(locale, "homeFeaturedKicker")}
            </div>
            <div className="relative h-[1em] overflow-hidden text-[clamp(30px,3.6vw,60px)]">
              {featureTitles.map((title, i) => (
                <h2
                  key={`${title}-${i}`}
                  data-feature-title={i}
                  className="absolute left-0 top-0 m-0 whitespace-nowrap font-serif leading-none tracking-[-0.025em]"
                >
                  {title}
                </h2>
              ))}
            </div>
            <div className="relative min-h-[90px]">
              {featuredDescriptionParts.map((copy, i) => (
                <p
                  key={i}
                  data-feature-copy={i}
                  className="absolute left-0 top-0 m-0 max-w-[380px] text-base leading-normal text-cream/78"
                >
                  {copy}
                </p>
              ))}
            </div>
            <div data-feature-cta className="mt-2 flex items-center gap-3">
              <MotionButtonLink href="/order" variant="inverse-fill">
                {storefrontMessageWithValues(locale, "homeOrderThe", {
                  name: featured?.displayName ?? "",
                })}
              </MotionButtonLink>
              {featured ? (
                <span
                  data-feature-price
                  className="ltr-isolate font-mono text-[15px] tabular-nums text-cream/80"
                >
                  {formatMoneyMinor(featured.price.amountMinor, featured.price.currency, locale)}
                </span>
              ) : null}
            </div>
          </div>
          <div
            data-feature-cupwrap
            className="relative flex justify-center drop-shadow-[0_70px_60px_rgba(0,0,0,.45)]"
          >
            <div data-feature-cup className="relative aspect-[3/4] w-[clamp(200px,22vw,320px)] overflow-hidden rounded-md max-md:w-[38vw]">
              <MenuProductImage
                mediaAssetId={featured?.mediaAssetId ?? null}
                alt={featured?.displayName ?? ""}
                size="detail"
                className="h-full w-full max-w-none border-0"
              />
            </div>
            {[1, 2, 3].map((n) => (
              <Image
                key={n}
                data-feature-bean={n}
                src="/tenants/hospitality/media/bean.png"
                alt=""
                width={44}
                height={44}
                aria-hidden
                className="absolute opacity-0"
              />
            ))}
          </div>
          <div className="flex min-w-0 flex-col gap-3 justify-self-end">
            {featureIngredients.map((label) => (
              <div
                key={label}
                data-feature-ing
                className="flex items-center justify-end gap-3.5 text-sm opacity-0"
              >
                <span className="text-cream/60">{label}</span>
                <span className="h-2 w-2 rounded-full border border-latte bg-espresso" />
              </div>
            ))}
            <div
              data-feature-detail
              className="mt-5 grid grid-cols-[auto_auto] justify-end gap-x-6 gap-y-1.5 text-right text-[13px] opacity-0"
            >
              <span className="text-cream/55">
                {storefrontMessage(locale, "homeFeatureRoast")}
              </span>
              <span>{storefrontMessage(locale, "homeFeatureRoastValue")}</span>
              <span className="text-cream/55">
                {storefrontMessage(locale, "homeFeatureOrigin")}
              </span>
              <span>{storefrontMessage(locale, "homeFeatureOriginValue")}</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="locations"
        data-locations
        className="seam-top relative z-2 bg-cream px-[var(--mx)] py-[clamp(100px,16vh,200px)] text-espresso"
      >
        <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(40px,6vh,72px)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="t-section-title">
              <span data-reveal-line className="mb-[-0.08em] block overflow-hidden pb-[0.08em]">
                <span data-reveal-word className="block">
                  {storefrontMessageWithValues(locale, "homeFindYourBrand", {
                    name: brandName.split(" ")[0],
                  })}
                  <span className="text-latte">.</span>
                </span>
              </span>
            </h2>
            <p className="max-w-[340px] text-[15px] leading-normal text-mocha">
              {storefrontMessage(locale, "homeLocationsBlurb")}
            </p>
          </div>
          <div
            data-loc-grid
            className="grid grid-cols-1 gap-[clamp(16px,2vw,28px)] sm:grid-cols-2 lg:grid-cols-3"
          >
            {locations.map((location, index) => (
              <motion.article
                key={location.locationPublicId}
                data-loc-card
                whileHover={{ y: -6 }}
                className="flex flex-col gap-[18px] overflow-hidden rounded-md border border-espresso/10 bg-white"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-espresso">
                  <Image
                    src={hospitalityVenuePhoto(index)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-col gap-3.5 px-[22px] pb-[22px]">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-[26px] tracking-[-0.02em]">{location.name}</h3>
                    <span className="rounded-xs bg-latte/35 px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-mocha">
                      {hospitalityVenueTag(index)}
                    </span>
                  </div>
                  <p className="text-sm leading-normal text-mocha">
                    {storefrontMessage(locale, "homePublishedBranch")}
                  </p>
                  <Link
                    href={`/locations#${location.slug}`}
                    className="inline-flex items-center gap-2.5 self-start border-b border-espresso pb-0.5 text-sm font-semibold transition-colors hover:border-latte hover:text-mocha"
                  >
                    {storefrontMessage(locale, "homeGetDirections")}{" "}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="rewards"
        data-rewards
        className="bg-cream px-[var(--mx)] pb-[clamp(100px,16vh,200px)] text-espresso"
      >
        <div
          data-rewards-panel
          className="relative mx-auto grid max-w-[1400px] items-center gap-8 overflow-hidden rounded-lg bg-espresso p-[clamp(40px,6vw,80px)] text-cream md:grid-cols-[1fr_auto]"
        >
          <Image
            src="/tenants/hospitality/media/bean.png"
            alt=""
            width={420}
            height={420}
            aria-hidden
            className="pointer-events-none absolute right-[-4%] top-[-30%] w-[clamp(200px,28vw,420px)] rotate-[25deg] opacity-12"
          />
          <div className="relative flex flex-col gap-4">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-latte">
              {storefrontMessageWithValues(locale, "homeRewardsKicker", {
                brand: brandName,
              })}
            </div>
            <h2 className="text-balance font-serif text-[clamp(32px,3.6vw,56px)] leading-none tracking-[-0.02em]">
              {storefrontMessage(locale, "homeRewardsTitle")}
            </h2>
            <p className="max-w-[440px] text-pretty text-[15px] leading-normal text-cream/72">
              {storefrontMessage(locale, "homeRewardsBody")}
            </p>
          </div>
          <MotionButtonLink href="/loyalty" variant="inverse-outline" className="relative whitespace-nowrap">
            {storefrontMessage(locale, "homeJoinRewards")}
          </MotionButtonLink>
        </div>
      </section>

      <footer data-footer className="relative overflow-hidden bg-black px-[var(--mx)] pb-10 pt-[clamp(80px,12vh,140px)] text-cream">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(60px,10vh,120px)]">
          <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
            <div className="flex flex-col gap-5">
              <Image src="/tenants/hospitality/media/logo-cream.png" alt={brandName} width={140} height={36} className="h-9 w-auto self-start" />
              <p className="max-w-[320px] text-sm leading-normal text-cream/60">
                {storefrontMessage(locale, "homeFooterTagline")}
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <span className="mb-1.5 text-[11px] uppercase tracking-[0.18em] text-latte">
                {storefrontMessage(locale, "footerExplore")}
              </span>
              <Link href="/menu">{storefrontMessage(locale, "navMenu")}</Link>
              <Link href="/locations">{storefrontMessage(locale, "navLocations")}</Link>
              <Link href="/journal">{storefrontMessage(locale, "navJournal")}</Link>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <span className="mb-1.5 text-[11px] uppercase tracking-[0.18em] text-latte">
                {storefrontMessage(locale, "footerFollow")}
              </span>
              <a href="https://instagram.com" rel="noreferrer noopener">
                Instagram
              </a>
              <a href="https://tiktok.com" rel="noreferrer noopener">
                TikTok
              </a>
            </div>
          </div>
          <div
            data-footer-word
            className="mb-[-0.12em] select-none whitespace-nowrap font-serif text-[clamp(90px,19vw,340px)] leading-[0.8] tracking-[-0.04em] text-espresso"
          >
            quotes
          </div>
          <div className="flex flex-wrap justify-between gap-5 border-t border-cream/12 pt-5 text-xs text-cream/50">
            <span>© 2026 {brandName}</span>
            <div className="flex gap-5">
              <Link href="/journal">{storefrontMessage(locale, "privacy")}</Link>
              <Link href="/journal">{storefrontMessage(locale, "terms")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
