"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoLink } from "@/components/brand/logo";
import { Bean } from "@/components/brand/bean";
import { Icon } from "@/components/brand/icons";
import { Sheet } from "@/components/ui/sheet";
import { StampProgress } from "@/components/brand/stamp-card";
import { SECONDARY_NAV } from "./nav";
import { cn } from "@/lib/cn";
import { useCart } from "@/lib/stores/cart";
import { useQosBasket, selectBasketItemCount } from "@/lib/stores/qos-basket";
import { useLoyalty } from "@/lib/stores/loyalty";
import { useHydrated } from "@/lib/use-hydrated";
import { CustomerAccountMenu } from "@/components/auth/customer-account-menu";
import { LocaleSelector } from "@/components/locale/locale-selector";
import { useStorefrontShell } from "@/lib/stores/storefront-shell";

export function SiteHeader() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const hydrated = useHydrated();
  const shell = useStorefrontShell();
  const showLoyalty = shell.themePresetId === "hospitality_baseline";

  const setDrawerOpen = useCart((state) => state.setDrawerOpen);
  const itemCount = useQosBasket(selectBasketItemCount);
  const member = useLoyalty((state) => state.member);
  const stamps = useLoyalty((state) => state.stamps);

  /** Navigating is what dismisses the drawer, so the links close it directly. */
  const closeNav = () => setNavOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-[color-mix(in_oklab,var(--color-cream),transparent_8%)] backdrop-blur-[10px] backdrop-saturate-110">
        <div className="flex items-center justify-between gap-6 px-[var(--mx)] py-3.5">
          <div className="flex items-center gap-3">
            {/* 26px is the smallest height that clears the 96px wordmark minimum. */}
            <LogoLink height={26} priority />
            {shell.headerChip ? (
              <span className="t-overline hidden rounded-full border border-line px-2.5 py-1.5 text-[10px] text-muted lg:inline-flex">
                {shell.headerChip}
              </span>
            ) : null}
          </div>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {shell.primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-sm px-3 py-2 text-[13.5px] transition-colors duration-fast ease-brand",
                  isActive(item.href)
                    ? "bg-latte-50 font-medium text-fg"
                    : "text-muted hover:bg-latte-50 hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            {shell.localeSelectorEnabled ? (
              <div className="hidden sm:block">
                <LocaleSelector compact />
              </div>
            ) : null}

            <div className="hidden md:block">
              <CustomerAccountMenu returnTo="/checkout" />
            </div>

            {showLoyalty ? (
              <Link
                href="/loyalty"
                className="hidden min-h-11 items-center gap-2 rounded-sm px-3 text-[13px] text-muted transition-colors duration-fast ease-brand hover:bg-latte-50 hover:text-fg md:inline-flex"
              >
                <Bean className="w-3" />
                {hydrated && member ? (
                  <span className="font-mono text-[12px] text-fg">{stamps}/8</span>
                ) : (
                  <span>Bean card</span>
                )}
              </Link>
            ) : null}

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative inline-flex min-h-11 items-center gap-2 rounded-sm bg-espresso px-4 text-[13px] font-medium text-cream transition-colors duration-std ease-brand hover:bg-mocha no-tap-highlight"
            >
              <Icon name="bag" className="h-4 w-4" strokeWidth={1.8} />
              <span className="hidden sm:inline">Bag</span>
              <span
                aria-label={`${itemCount} item${itemCount === 1 ? "" : "s"} in bag`}
                className={cn(
                  "grid h-5 min-w-5 place-items-center rounded-full px-1 font-mono text-[10px] tabular-nums",
                  hydrated && itemCount > 0 ? "bg-latte text-espresso" : "bg-cream/15 text-cream/70",
                )}
              >
                {hydrated ? itemCount : 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              aria-expanded={navOpen}
              className="grid h-11 w-11 place-items-center rounded-sm text-espresso transition-colors duration-fast ease-brand hover:bg-latte-50 lg:hidden no-tap-highlight"
            >
              <Icon name="menu" className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      <Sheet
        open={navOpen}
        onClose={() => setNavOpen(false)}
        title={shell.brandName}
        description={shell.footerStatement}
        footer={
          <div className="flex flex-col gap-3">
            {shell.localeSelectorEnabled ? <LocaleSelector /> : null}
            <CustomerAccountMenu compact returnTo="/checkout" onNavigate={closeNav} />
            {hydrated && member ? (
              <StampProgress stamps={stamps} />
            ) : (
              <p className="t-caption">Join the bean card — eight cups, one free coffee.</p>
            )}
            <div className="flex flex-wrap gap-2">
              {SECONDARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeNav}
                  className="t-overline rounded-full border border-line px-3 py-2 text-[10px] text-muted transition-colors duration-fast hover:border-latte hover:text-fg"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        }
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {shell.primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeNav}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-4 border-b border-line py-4 transition-colors duration-fast ease-brand last:border-b-0",
                isActive(item.href) ? "text-fg" : "text-mocha hover:text-fg",
              )}
            >
              <span
                className={cn(
                  "grid h-11 w-11 shrink-0 place-items-center rounded-sm border",
                  isActive(item.href)
                    ? "border-espresso bg-espresso text-cream"
                    : "border-line bg-surface",
                )}
              >
                <Icon name={item.icon} className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <span className="min-w-0">
                <span className="block text-[16px] font-medium">{item.label}</span>
                {item.hint ? <span className="t-caption block">{item.hint}</span> : null}
              </span>
              <Icon name="arrow" className="ml-auto h-4 w-4 shrink-0 text-latte" strokeWidth={2} />
            </Link>
          ))}
        </nav>
      </Sheet>
    </>
  );
}
