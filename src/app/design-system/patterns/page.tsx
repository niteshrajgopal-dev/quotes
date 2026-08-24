import type { Metadata } from "next";
import Link from "next/link";
import { Bean } from "@/components/brand/bean";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/brand/icons";
import { TravelArrow } from "@/components/ui/button";
import { DsBlock, DsCover, DsLabel, DsTopBar } from "@/components/system/ds-shell";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Patterns",
  description:
    "Reusable compositions: navigation, product browsing, ordering, checkout, loyalty and location discovery.",
};

type Pattern = {
  no: string;
  name: string;
  icon: IconName;
  purpose: string;
  where: Array<{ label: string; href: string }>;
  steps: string[];
  rules: string[];
  states: string[];
};

const PATTERNS: Pattern[] = [
  {
    no: "01",
    name: "Navigation",
    icon: "menu",
    purpose:
      "One adaptive navigation system across every breakpoint, rather than a desktop menu with a phone afterthought.",
    where: [
      { label: "Every product route", href: "/" },
      { label: "Design system chrome", href: "/design-system" },
    ],
    steps: [
      "Sticky translucent header with the wordmark, primary links and the bag.",
      "Below 1024px the links collapse into a focus-trapped drawer with icon, label and hint.",
      "Below 768px a four-tab bar pins Home, Menu, Order and Card within thumb reach.",
      "The bag opens as a sheet from anywhere, so no flow loses its place.",
    ],
    rules: [
      "The wordmark never renders below its 96px minimum — the build fails if it does.",
      "Active state is a latte-tinted fill, never an underline or a colour change alone.",
      "The tab bar sits above the safe-area inset and every route reserves space for it.",
    ],
    states: ["Default", "Active route", "Drawer open", "Bag count zero and non-zero"],
  },
  {
    no: "02",
    name: "Product browsing",
    icon: "bean",
    purpose:
      "Let someone find a coffee by how it tastes, not by SKU — search, roast filter and sort over one card component.",
    where: [
      { label: "Coffee listing", href: "/shop" },
      { label: "Product page", href: "/shop/ethiopia-yirgacheffe" },
    ],
    steps: [
      "Search matches name, origin and individual tasting notes.",
      "A scrolling roast rail filters, with live counts per roast level.",
      "Results announce their count to assistive tech as filters change.",
      "Cards carry overline, roast, serif name, notes, price and stock state.",
    ],
    rules: [
      "Sold-out lots stay browsable — they change the badge and CTA, never the layout.",
      "Tasting notes are capped at three on a card and shown in full on the product page.",
      "Empty results always offer a way back out, never a dead end.",
    ],
    states: ["Default", "Filtered", "No results", "Low stock", "Sold out"],
  },
  {
    no: "03",
    name: "Ordering & customisation",
    icon: "cup",
    purpose:
      "Turn a café round into about a minute on a phone: location, menu, customise, bag, checkout, confirmation.",
    where: [
      { label: "Order flow", href: "/order" },
      { label: "Café menu", href: "/menu" },
    ],
    steps: [
      "Choose collection from a café or delivery of beans by post.",
      "Build the round from the menu, quick-adding or customising in a bottom sheet.",
      "Size, milk, syrup and extra shots reprice live in the sheet footer.",
      "A sticky flow bar always shows item count, total and the next action.",
    ],
    rules: [
      "Identical configurations collapse into one line, so quantity does the counting.",
      "Steps already completed stay reachable; steps ahead do not.",
      "Nothing advances on an invalid step — the next action disables instead of failing later.",
    ],
    states: ["Empty bag", "Item added", "Customising", "Step blocked", "Confirmed"],
  },
  {
    no: "04",
    name: "Checkout",
    icon: "bag",
    purpose:
      "One validated form that adapts to collection or delivery without becoming two separate checkouts.",
    where: [
      { label: "Shop checkout", href: "/checkout" },
      { label: "In-flow checkout", href: "/order" },
    ],
    steps: [
      "Fulfilment choice reshapes the form: collection slots, or address and postcode.",
      "Validation runs on submit, listing the count of fields needing attention in a toast.",
      "Promo codes and the free-delivery threshold resolve in the summary in real time.",
      "Placing the order awards bean stamps and issues a readable reference.",
    ],
    rules: [
      "Errors replace hints in place and are announced, never shown only as a red border.",
      "Every field keeps a visible label; placeholders are examples, not labels.",
      "Collection offers paying in café; delivery does not.",
    ],
    states: ["Default", "Validation error", "Submitting", "Success", "Empty bag"],
  },
  {
    no: "05",
    name: "Loyalty",
    icon: "loyalty",
    purpose:
      "Make the reward legible at a glance, using the bean as the stamp rather than a points balance.",
    where: [
      { label: "Bean card", href: "/loyalty" },
      { label: "Homepage module", href: "/" },
    ],
    steps: [
      "Eight bean outlines fill as stamps are earned, one per drink or bag.",
      "A completed card converts to a reward held in the wallet until it is wanted.",
      "Rewards state plainly how many cards they cost and how many are still needed.",
      "Activity lists what earned or spent each stamp.",
    ],
    rules: [
      "Stamps never expire and rewards are never forced at the till.",
      "The card reads as one image to assistive tech: “5 of 8 stamps collected”.",
      "Latte fills the stamp; espresso outlines it. No third colour enters.",
    ],
    states: ["Not a member", "Fresh card", "In progress", "Complete", "Reward redeemed"],
  },
  {
    no: "06",
    name: "Location discovery",
    icon: "location",
    purpose:
      "Answer the three questions people actually have: where, when is it open, and how long will it take.",
    where: [
      { label: "Locations", href: "/locations" },
      { label: "Order step one", href: "/order" },
    ],
    steps: [
      "Each café leads with its room through an art-directed plate, then the practical detail.",
      "Hours, services, phone and what3words sit in a consistent order across all three.",
      "Prep time is shown as a badge so it can be compared at a glance.",
      "Deep links from the footer and confirmations scroll to the right café.",
    ],
    rules: [
      "Closed days are shown, not hidden, and are muted rather than removed.",
      "Every café ends with the same two actions: order for collection, or see the menu.",
      "Addresses use real address semantics, and phone numbers are dialable links.",
    ],
    states: ["Default", "Deep-linked", "Closed today", "Selected in the order flow"],
  },
];

export default function PatternsPage() {
  return (
    <>
      <DsTopBar current="/design-system/patterns" />

      <DsCover
        eyebrow="Patterns · v1.0"
        title={
          <>
            How the parts
            <br />
            behave together.
          </>
        }
        lede={
          <>
            Components answer &ldquo;what does this look like&rdquo;. Patterns answer &ldquo;what
            happens next&rdquo;. Each one below is a composition that already ships in the product,
            with its purpose, its flow, the rules that keep it calm, and the states it has to
            handle.
          </>
        }
        chips={[
          "Navigation",
          "Browsing",
          "Ordering",
          "Checkout",
          "Loyalty",
          "Locations",
        ]}
      />

      {PATTERNS.map((pattern) => (
        <DsBlock
          key={pattern.no}
          id={pattern.name.toLowerCase().replace(/[^a-z]+/g, "-")}
          no={pattern.no}
          title={pattern.name}
          sub={pattern.purpose}
        >
          <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
            <Card className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-espresso text-cream">
                  <Icon name={pattern.icon} className="h-5.5 w-5.5" strokeWidth={1.7} />
                </span>
                <div className="flex flex-wrap gap-2">
                  {pattern.where.map((link) => (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      className="group inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 font-mono text-[10.5px] font-medium tracking-[0.08em] text-muted uppercase transition-colors duration-fast ease-brand hover:border-latte hover:text-fg"
                    >
                      {link.label}
                      <TravelArrow className="h-3 w-3 text-latte" />
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <DsLabel>The flow</DsLabel>
                <ol className="flex flex-col gap-3">
                  {pattern.steps.map((stepCopy, index) => (
                    <li key={stepCopy} className="flex gap-3.5">
                      <span className="mt-0.5 grid h-5.5 w-5.5 shrink-0 place-items-center rounded-full bg-latte-100 font-mono text-[10px] text-espresso">
                        {index + 1}
                      </span>
                      <span className="text-[14.5px] leading-relaxed text-mocha">{stepCopy}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Card>

            <div className="flex flex-col gap-5">
              <Card className="flex flex-col gap-4">
                <DsLabel className="mb-0">Rules that keep it calm</DsLabel>
                <ul className="flex flex-col gap-3">
                  {pattern.rules.map((rule) => (
                    <li key={rule} className="flex gap-3.5">
                      <Bean className="mt-1 w-3 shrink-0" />
                      <span className="text-[14px] leading-relaxed text-mocha">{rule}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="flex flex-col gap-4">
                <DsLabel className="mb-0">States handled</DsLabel>
                <div className="flex flex-wrap gap-2">
                  {pattern.states.map((state, index) => (
                    <Badge
                      key={state}
                      tone={index === 0 ? "espresso" : index === pattern.states.length - 1 ? "success" : "outline"}
                    >
                      {state}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </DsBlock>
      ))}

      {/* ============ RESPONSIVE CONTRACT ============ */}
      <DsBlock
        id="responsive"
        no="07"
        title="Responsive contract"
        sub="One adaptive experience across the 2025–2026 viewport matrix, not three fixed screenshots."
      >
        <div className="overflow-x-auto rounded-md border border-line bg-surface">
          <table className="w-full border-collapse text-[13.5px]">
            <caption className="sr-only">
              Viewport matrix and the layout behaviour at each threshold
            </caption>
            <thead>
              <tr>
                {["Viewport", "Size", "Navigation", "Grid", "Sheets"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="t-label border-b border-line px-3.5 py-3 text-left"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Mobile compact", "360 × 800", "Tab bar + drawer", "1 column", "Bottom"],
                ["Mobile standard", "390 × 844", "Tab bar + drawer", "1 column", "Bottom"],
                ["Mobile large", "430 × 932", "Tab bar + drawer", "1 column", "Bottom"],
                ["Foldable", "600 × 960", "Tab bar + drawer", "2 columns", "Bottom"],
                ["Tablet portrait", "820 × 1180", "Drawer", "2 columns", "Bottom"],
                ["Tablet landscape", "1024 × 768", "Full header", "3 columns", "Side"],
                ["Laptop", "1366 × 768", "Full header", "3 columns", "Side"],
                ["Desktop", "1440 × 900", "Full header", "3 columns", "Side"],
                ["Wide", "1920 × 1080", "Full header", "3 columns · capped 1160px", "Side"],
              ].map(([name, size, nav, grid, sheet]) => (
                <tr key={name}>
                  <td className="border-b border-line px-3.5 py-3">{name}</td>
                  <td className="border-b border-line px-3.5 py-3 font-mono text-[12px] text-muted">
                    {size}
                  </td>
                  <td className="border-b border-line px-3.5 py-3 text-muted">{nav}</td>
                  <td className="border-b border-line px-3.5 py-3 text-muted">{grid}</td>
                  <td className="border-b border-line px-3.5 py-3 text-muted">{sheet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Fluid, not stepped",
              copy: "Page gutters and every display size use clamp(), so type and spacing scale continuously between the fixed breakpoints.",
            },
            {
              title: "No horizontal overflow",
              copy: "Horizontal rails are the only scrolling axis, and they are opt-in per component rather than a page-level accident.",
            },
            {
              title: "Reduced motion honoured",
              copy: "Every transition and the bean loader collapse to near-zero duration under prefers-reduced-motion.",
            },
          ].map((note) => (
            <Card key={note.title} className={cn("flex flex-col gap-2.5")}>
              <h3 className="t-h4">{note.title}</h3>
              <p className="text-[14px] leading-relaxed text-muted">{note.copy}</p>
            </Card>
          ))}
        </div>
      </DsBlock>
    </>
  );
}
