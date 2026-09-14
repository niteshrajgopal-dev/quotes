import type { Metadata } from "next";

import { SiteHeader } from "@/components/shell/site-header";
import { SiteFooter } from "@/components/shell/site-footer";
import { MobileTabBar } from "@/components/shell/mobile-tab-bar";
import { CartDrawer } from "@/components/shell/cart-drawer";
import { BasketProvider } from "@/components/qos/basket-provider";
import { CustomerSessionProvider } from "@/components/auth/customer-session-provider";
import { BasketMergeReconciliation } from "@/components/basket/basket-merge-reconciliation";
import { StorefrontLocaleProvider } from "@/components/locale/storefront-locale-provider";
import { StorefrontUnavailable } from "@/components/storefront/storefront-unavailable";
import { StorefrontThemeEffect } from "@/components/storefront/storefront-theme-effect";
import { StorefrontResolutionError } from "@/lib/storefront/errors";
import { resolveStorefrontContextFromHeaders } from "@/lib/storefront/context.server";
import { toStorefrontShellSnapshot } from "@/lib/storefront/snapshot";
import { StorefrontShellProvider } from "@/lib/stores/storefront-shell";
import { buildStorefrontMetadata } from "@/lib/storefront/metadata.server";
import { getServerStorefrontLocale } from "@/lib/locale/locale.server";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const context = await resolveStorefrontContextFromHeaders();
    return buildStorefrontMetadata(context);
  } catch {
    return {
      title: "Storefront unavailable",
      description: "This storefront hostname is not configured.",
    };
  }
}

/** Chrome for the product app: café, shop, ordering, loyalty and journal. */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  try {
    const context = await resolveStorefrontContextFromHeaders();
    const locale = await getServerStorefrontLocale();
    const shell = toStorefrontShellSnapshot(context, locale);

    return (
      <StorefrontShellProvider value={shell}>
        <StorefrontThemeEffect />
        <StorefrontLocaleProvider>
          <CustomerSessionProvider>
            <BasketProvider>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-sm focus:bg-espresso focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-cream"
              >
                Skip to content
              </a>
              <SiteHeader />
              <main
                id="main"
                className="pb-[calc(env(safe-area-inset-bottom)+72px)] md:pb-0"
              >
                {children}
              </main>
              <SiteFooter />
              <MobileTabBar />
              <CartDrawer />
              <BasketMergeReconciliation />
            </BasketProvider>
          </CustomerSessionProvider>
        </StorefrontLocaleProvider>
      </StorefrontShellProvider>
    );
  } catch (error) {
    if (error instanceof StorefrontResolutionError) {
      return <StorefrontUnavailable message={error.message} />;
    }

    throw error;
  }
}
