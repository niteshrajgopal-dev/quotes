import Link from "next/link";
import type { ReactNode } from "react";
import { Bean } from "@/components/brand/bean";
import { Wordmark } from "@/components/brand/logo";
import { TravelArrow } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Chrome for the design-system surfaces. Kept separate from the product shell
 * so system documentation never leaks into the café/shop experience.
 */

export const DS_LAYERS = [
  {
    href: "/design-system/foundations",
    no: "01",
    title: "Foundations & Tokens",
    copy: "Brand, colour scales, type system, grid, spacing, radius, motion, iconography and the bean language.",
    status: "Ready",
    tone: "ready" as const,
    layer: "A",
  },
  {
    href: "/design-system/components",
    no: "02",
    title: "Components",
    copy: "Buttons, forms, cards, navigation, badges, toasts, loyalty and states — the full library with variants.",
    status: "Ready",
    tone: "ready" as const,
    layer: "A",
  },
  {
    href: "/design-system/patterns",
    no: "03",
    title: "Patterns",
    copy: "Navigation, product browsing, ordering, checkout, loyalty and location discovery — reusable compositions.",
    status: "Ready",
    tone: "ready" as const,
    layer: "A",
  },
  {
    href: "/",
    no: "04",
    title: "Homepage",
    copy: "The flagship. Editorial hero, brand statement, featured coffee, story, quote moment and rewards.",
    status: "Live · Flagship",
    tone: "live" as const,
    layer: "B",
  },
  {
    href: "/shop/ethiopia-yirgacheffe",
    no: "05",
    title: "Product page",
    copy: "Ethiopia Yirgacheffe — origin, roast, tasting notes, grind and bag selectors, subscription, add to bag.",
    status: "Live",
    tone: "live" as const,
    layer: "B",
  },
  {
    href: "/menu",
    no: "06",
    title: "Café menu",
    copy: "Category navigation, calm product cards, dietary indicators, sizes and customisation.",
    status: "Live",
    tone: "live" as const,
    layer: "B",
  },
  {
    href: "/loyalty",
    no: "07",
    title: "Loyalty",
    copy: "The bean-stamp reward system — progress, wallet, next reward and member profile.",
    status: "Live",
    tone: "live" as const,
    layer: "B",
  },
  {
    href: "/order",
    no: "08",
    title: "Mobile ordering",
    copy: "Location → menu → customise → cart → checkout → confirmation, redesigned for small screens.",
    status: "Live",
    tone: "live" as const,
    layer: "B",
  },
  {
    href: "/journal",
    no: "09",
    title: "Journal",
    copy: "Editorial stories on origins, people and conversations — closer to a magazine than a blog.",
    status: "Live",
    tone: "live" as const,
    layer: "B",
  },
];

const DS_NAV = [
  { href: "/design-system", label: "Overview" },
  { href: "/design-system/foundations", label: "Foundations" },
  { href: "/design-system/components", label: "Components" },
  { href: "/design-system/patterns", label: "Patterns" },
];

export function DsTopBar({ current }: { current: string }) {
  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b border-line bg-[color-mix(in_oklab,var(--color-cream),transparent_8%)] px-[var(--mx)] py-3.5 backdrop-blur-[10px] backdrop-saturate-110">
      <div className="flex items-center gap-3">
        <Link href="/design-system" aria-label="Design system overview">
          <Wordmark height={26} />
        </Link>
        <span className="t-overline hidden rounded-full border border-line px-2.5 py-1.5 text-[10px] text-muted sm:inline-flex">
          Design System
        </span>
      </div>

      <nav aria-label="Design system" className="flex flex-wrap gap-1">
        {DS_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.href === current ? "page" : undefined}
            className={cn(
              "rounded-sm px-3 py-2 text-[13.5px] transition-colors duration-fast ease-brand",
              item.href === current
                ? "bg-latte-50 font-medium text-fg"
                : "text-muted hover:bg-latte-50 hover:text-fg",
            )}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/"
          className="group ml-2 inline-flex min-h-11 items-center gap-2 rounded-sm bg-espresso px-4 text-[13px] font-medium text-cream transition-colors duration-std ease-brand hover:bg-mocha"
        >
          Open the app
          <TravelArrow />
        </Link>
      </nav>
    </header>
  );
}

export function DsCover({
  eyebrow,
  title,
  lede,
  chips,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  chips?: readonly string[];
}) {
  return (
    <div className="wrap pt-[clamp(56px,10vw,132px)] pb-[clamp(44px,7vw,88px)]">
      <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
        <Bean className="w-[0.9em]" />
        {eyebrow}
      </span>
      <h1 className="mt-6 font-serif text-[clamp(48px,10vw,116px)] leading-[1.02] tracking-[-0.035em]">
        {title}
      </h1>
      <p className="mt-7 max-w-[60ch] text-[clamp(17px,2.2vw,21px)] leading-[1.55] text-mocha">
        {lede}
      </p>
      {chips ? (
        <div className="mt-10 flex flex-wrap gap-2.5">
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-line bg-surface px-3.5 py-2.5 font-mono text-[12px] font-medium tracking-[0.08em] text-muted uppercase"
            >
              {chip}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Numbered documentation block, matching the foundations section rhythm. */
export function DsBlock({
  id,
  no,
  title,
  sub,
  children,
}: {
  id: string;
  no: string;
  title: string;
  sub?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-[clamp(52px,7vw,92px)]">
      <div className="wrap">
        <div className="mb-10 flex flex-wrap items-baseline gap-x-4 gap-y-3">
          <span className="pt-1.5 font-mono text-[13px] font-medium tracking-[0.1em] text-accent">
            {no}
          </span>
          <h2 className="font-serif text-[clamp(30px,4.4vw,46px)] leading-[1.05] tracking-[-0.02em]">
            {title}
          </h2>
          {sub ? (
            <p className="order-3 w-full max-w-[34ch] text-[14.5px] leading-relaxed text-muted sm:order-none sm:ml-auto sm:w-auto sm:text-right">
              {sub}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Label above a specimen, so every example is named. */
export function DsLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("t-label mb-3", className)}>{children}</div>;
}

export function DsFooter() {
  return (
    <footer className="mt-2 bg-espresso text-cream">
      <div className="wrap flex flex-col gap-9 py-[clamp(56px,8vw,96px)] pb-12">
        <div className="flex items-center gap-3.5">
          <Bean onDark className="w-6" />
          <span className="font-serif text-[26px] text-cream">quotes</span>
        </div>
        <h2 className="max-w-[18ch] font-serif text-[clamp(26px,4vw,40px)] leading-tight text-cream">
          The foundation is set. The system is live.
        </h2>
        <div className="flex flex-wrap gap-3.5">
          {[
            { href: "/design-system", label: "System overview" },
            { href: "/design-system/components", label: "Components" },
            { href: "/", label: "Homepage" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-2.5 rounded-sm border border-[var(--border-on-dark)] px-5 py-3.5 text-[14px] transition-[background-color,border-color] duration-fast ease-brand hover:border-cream/50 hover:bg-cream/8"
            >
              {item.label}
              <TravelArrow className="text-latte" />
            </Link>
          ))}
        </div>
        <p className="font-mono text-[11px] leading-relaxed tracking-[0.08em] text-cream/50 uppercase">
          quotes coffee co. · design system v1.0 · warm · calm · crafted · distinctive · human ·
          premium
        </p>
      </div>
    </footer>
  );
}
