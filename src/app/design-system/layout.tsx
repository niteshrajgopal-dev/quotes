import type { Metadata } from "next";
import { DsFooter } from "@/components/system/ds-shell";

export const metadata: Metadata = {
  title: {
    default: "Design system",
    template: "%s · quotes design system",
  },
  description:
    "The quotes design system: foundations, tokens, components and patterns behind the coffee brand.",
  robots: { index: false },
};

/** Chrome for the system documentation. Deliberately separate from the app. */
export default function DesignSystemLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#ds-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-sm focus:bg-espresso focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-cream"
      >
        Skip to content
      </a>
      <main id="ds-main">{children}</main>
      <DsFooter />
    </>
  );
}
