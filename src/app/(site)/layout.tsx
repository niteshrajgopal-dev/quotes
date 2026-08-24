import { SiteHeader } from "@/components/shell/site-header";
import { SiteFooter } from "@/components/shell/site-footer";
import { MobileTabBar } from "@/components/shell/mobile-tab-bar";
import { CartDrawer } from "@/components/shell/cart-drawer";

/** Chrome for the product app: café, shop, ordering, loyalty and journal. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-sm focus:bg-espresso focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-cream"
      >
        Skip to content
      </a>
      <SiteHeader />
      {/* Bottom padding clears the mobile tab bar. */}
      <main id="main" className="pb-[calc(env(safe-area-inset-bottom)+72px)] md:pb-0">
        {children}
      </main>
      <SiteFooter />
      <MobileTabBar />
      <CartDrawer />
    </>
  );
}
