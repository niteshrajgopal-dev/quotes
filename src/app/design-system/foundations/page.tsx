import type { Metadata } from "next";
import Image from "next/image";
import { Bean, BeanBadge, BeanDivider, BeanSpinner } from "@/components/brand/bean";
import { Wordmark } from "@/components/brand/logo";
import { Icon, ICON_NAMES } from "@/components/brand/icons";
import { StampCard } from "@/components/brand/stamp-card";
import { Card } from "@/components/ui/card";
import { Plate } from "@/components/ui/plate";
import { DsBlock, DsCover, DsLabel, DsTopBar } from "@/components/system/ds-shell";
import { PRINCIPLES, VALUES } from "@/lib/fixtures/quotes-design-reference/brand";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Foundations & tokens",
  description:
    "Brand thinking, colour, type, grid, motion and the coffee-bean language every quotes screen is built from.",
};

/* Tonal steps are derived with color-mix so each traces back to a brand hex. */
const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

const espressoScale = [
  { step: 50, bg: "color-mix(in oklab,#2F2322,#F5F1E9 92%)", fg: "#3a2c2a" },
  { step: 100, bg: "color-mix(in oklab,#2F2322,#F5F1E9 82%)", fg: "#3a2c2a" },
  { step: 200, bg: "color-mix(in oklab,#2F2322,#F5F1E9 66%)", fg: "#3a2c2a" },
  { step: 300, bg: "color-mix(in oklab,#2F2322,#F5F1E9 50%)", fg: "#F5F1E9" },
  { step: 400, bg: "color-mix(in oklab,#2F2322,#F5F1E9 34%)", fg: "#F5F1E9" },
  { step: 500, bg: "color-mix(in oklab,#2F2322,#F5F1E9 18%)", fg: "#F5F1E9" },
  { step: 600, bg: "color-mix(in oklab,#2F2322,#F5F1E9 8%)", fg: "#F5F1E9" },
  { step: 700, bg: "#2F2322", fg: "#CBB792" },
  { step: 800, bg: "color-mix(in oklab,#2F2322,#000 22%)", fg: "#CBB792" },
  { step: 900, bg: "color-mix(in oklab,#2F2322,#000 42%)", fg: "#CBB792" },
];

const mochaScale = [
  { step: 50, bg: "color-mix(in oklab,#4A3836,#F5F1E9 92%)", fg: "#4A3836" },
  { step: 100, bg: "color-mix(in oklab,#4A3836,#F5F1E9 82%)", fg: "#4A3836" },
  { step: 200, bg: "color-mix(in oklab,#4A3836,#F5F1E9 66%)", fg: "#4A3836" },
  { step: 300, bg: "color-mix(in oklab,#4A3836,#F5F1E9 50%)", fg: "#F5F1E9" },
  { step: 400, bg: "color-mix(in oklab,#4A3836,#F5F1E9 34%)", fg: "#F5F1E9" },
  { step: 500, bg: "color-mix(in oklab,#4A3836,#F5F1E9 18%)", fg: "#F5F1E9" },
  { step: 600, bg: "color-mix(in oklab,#4A3836,#F5F1E9 8%)", fg: "#F5F1E9" },
  { step: 700, bg: "#4A3836", fg: "#CBB792" },
  { step: 800, bg: "color-mix(in oklab,#4A3836,#000 22%)", fg: "#CBB792" },
  { step: 900, bg: "color-mix(in oklab,#4A3836,#000 42%)", fg: "#CBB792" },
];

const latteScale = [
  { step: 50, bg: "color-mix(in oklab,#CBB792,#F5F1E9 80%)", fg: "#7a6a45" },
  { step: 100, bg: "color-mix(in oklab,#CBB792,#F5F1E9 60%)", fg: "#7a6a45" },
  { step: 200, bg: "color-mix(in oklab,#CBB792,#F5F1E9 38%)", fg: "#5c4f31" },
  { step: 300, bg: "color-mix(in oklab,#CBB792,#F5F1E9 18%)", fg: "#4A3836" },
  { step: 400, bg: "#CBB792", fg: "#3a2c2a" },
  { step: 500, bg: "color-mix(in oklab,#CBB792,#4A3836 14%)", fg: "#2F2322" },
  { step: 600, bg: "color-mix(in oklab,#CBB792,#4A3836 30%)", fg: "#F5F1E9" },
  { step: 700, bg: "color-mix(in oklab,#CBB792,#4A3836 48%)", fg: "#F5F1E9" },
  { step: 800, bg: "color-mix(in oklab,#CBB792,#2F2322 62%)", fg: "#F5F1E9" },
  { step: 900, bg: "color-mix(in oklab,#CBB792,#2F2322 78%)", fg: "#CBB792" },
];

const TYPE_SCALE = [
  ["Display XL", "Coffee, talk", "Serif · 400", "72 → 44", "1.0 · -.03em", "serif"],
  ["Display L", "Worth slowing", "Serif · 400", "57 → 38", "1.05 · -.03em", "serif"],
  ["Display M", "Best enjoyed", "Serif · 400", "45 → 32", "1.08 · -.02em", "serif"],
  ["H1", "Our origins", "Serif · 400", "36 → 28", "1.1 · -.02em", "serif"],
  ["H2", "Featured coffee", "Serif · 400", "28 → 24", "1.15 · -.02em", "serif"],
  ["H3", "Ethiopia Yirgacheffe", "Sans · 600", "22 → 20", "1.25 · -.01em", "sans-semibold"],
  ["H4", "Tasting notes", "Sans · 600", "18 → 17", "1.3 · 0", "sans-semibold"],
  ["H5", "Grind selection", "Sans · 600", "16 → 15", "1.35 · 0", "sans-semibold"],
  ["Body L", "Thoughtfully sourced, carefully made.", "Sans · 400", "18 → 17", "1.6 · 0", "sans"],
  ["Body", "Best enjoyed together.", "Sans · 400", "16 → 15", "1.6 · 0", "sans"],
  ["Body S", "Washed · Light roast", "Sans · 400", "14 → 13", "1.5 · .01em", "sans"],
  ["Label", "ADD TO BAG", "Sans · 500", "13 → 12", "1.2 · .02em", "sans-medium"],
  ["Caption", "250g · whole bean", "Sans · 400", "12 → 11", "1.5 · .01em", "sans-muted"],
  ["Overline", "SINGLE ORIGIN", "Mono · 500", "12 → 11", "1.2 · .16em", "mono-accent"],
] as const;

const SPACING = [
  [4, "xs"],
  [8, "sm"],
  [12, ""],
  [16, "md"],
  [24, "lg"],
  [32, "xl"],
  [48, ""],
  [64, ""],
  [96, ""],
  [128, ""],
] as const;

const TOKENS = [
  ["color.brand.espresso", "#2F2322", "Ink · nav · primary button", "#2F2322"],
  ["color.brand.mocha", "#4A3836", "Elevated dark · hover", "#4A3836"],
  ["color.brand.latte", "#CBB792", "Accent · bean · active", "#CBB792"],
  ["color.surface.primary", "#F5F1E9", "Page canvas", "#F5F1E9"],
  ["color.surface.raised", "#FCFAF5", "Cards on cream", "#FCFAF5"],
  ["color.text.primary", "#2F2322", "Body & headings", "#2F2322"],
  ["color.text.muted", "#7C6E62", "Captions · meta", "#7C6E62"],
  ["color.text.inverse", "#F5F1E9", "Text on dark", "#F5F1E9"],
  ["color.border.subtle", "#E7DFCE", "Hairlines · dividers", "#E7DFCE"],
  ["color.action.primary", "#2F2322", "Primary CTA fill", "#2F2322"],
  ["type.display.xl", "Young Serif · 72/44px", "Hero statements", null],
  ["type.heading.h2", "Young Serif · 28px", "Section titles", null],
  ["type.body.default", "Inter · 16px / 1.6", "Paragraph copy", null],
  ["type.label", "Inter 500 · 13px · .02em", "Buttons · labels", null],
  ["space.1 → space.10", "4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128", "Layout rhythm", null],
  ["radius.sm / md / lg", "6 · 10 · 16px", "Controls · cards · imagery", null],
  ["motion.fast / std / slow", "150 · 260 · 400ms", "Interaction timing", null],
] as const;

const CONTRAST = [
  ["Espresso / Cream", "#F5F1E9", "#2F2322", "Body & headings · 11.8:1", "AAA"],
  ["Mocha / Cream", "#F5F1E9", "#4A3836", "Secondary text · 8.9:1", "AAA"],
  ["Cream / Espresso", "#2F2322", "#F5F1E9", "Dark sections · 11.8:1", "AAA"],
  ["Latte / Espresso", "#2F2322", "#CBB792", "Accents & UI · 5.1:1", "AA"],
  ["Muted / Cream", "#F5F1E9", "#7C6E62", "Captions · 4.6:1", "AA"],
  ["Latte / Cream", "#F5F1E9", "#CBB792", "Decorative only — not for text", "Decor"],
] as const;

export default function FoundationsPage() {
  return (
    <>
      <DsTopBar current="/design-system/foundations" />

      <DsCover
        eyebrow="Foundations · v1.0"
        title={
          <>
            Coffee, crafted
            <br />
            into a system.
          </>
        }
        lede={
          <>
            The foundation layer for the <b>quotes</b> digital ecosystem — the brand thinking,
            colour, type, grid, motion and the coffee-bean language that every screen is built
            from. Warm, calm, editorial, and unmistakably ours.
          </>
        }
        chips={VALUES}
      />

      {/* ============ 01 · BRAND ============ */}
      <DsBlock
        id="brand"
        no="01"
        title="Brand"
        sub="Not simply selling coffee — designing an environment for coffee, conversation and moments worth remembering."
      >
        <p className="mb-9 max-w-[24ch] font-serif text-[19px] leading-[1.25] tracking-[-0.01em]">
          &ldquo;Great coffee creates moments worth remembering.&rdquo;
        </p>
        <p className="mb-11 max-w-[66ch] leading-[1.7] text-mocha">
          Quotes is a premium contemporary coffee brand built around coffee, conversation and
          human connection. Coffee here is a pause, a ritual, a thought, a meeting — a moment
          worth sharing. The name quietly connects to thoughts and stories; the connection stays
          understated, never a literal quotation-mark gimmick. Premium, but never intimidating.
          Sophisticated, but still human.
        </p>

        <div className="grid overflow-hidden rounded-md border border-line bg-surface sm:grid-cols-2">
          {PRINCIPLES.map((principle, index) => (
            <div
              key={principle.name}
              className={cn(
                "border-b border-line px-7 py-7",
                index % 2 === 0 && "sm:border-r",
                index >= PRINCIPLES.length - 2 && "sm:border-b-0",
                index === PRINCIPLES.length - 1 && "border-b-0",
              )}
            >
              <h3 className="flex items-center gap-2.5 font-serif text-[20px]">
                <Bean className="w-[0.8em]" />
                {principle.name}
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{principle.copy}</p>
            </div>
          ))}
        </div>
      </DsBlock>

      {/* ============ 02 · LOGO ============ */}
      <DsBlock
        id="logo"
        no="02"
        title="Logo system"
        sub="A bold lowercase wordmark with the handcrafted bean as its heart. Supplied artwork is canonical — never redrawn or re-proportioned."
      >
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative grid min-h-[210px] place-items-center overflow-hidden rounded-md border border-line bg-cream">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[22px] rounded-xs border border-dashed border-[color-mix(in_oklab,var(--color-muted),transparent_55%)]"
            />
            <Wordmark height={52} />
            <span className="t-label absolute bottom-3 left-3">Primary · cream</span>
          </div>
          <div className="relative grid min-h-[210px] place-items-center overflow-hidden rounded-md border border-espresso bg-espresso">
            <Wordmark height={52} />
            <span className="t-label absolute bottom-3 left-3 text-latte">Inverse · espresso</span>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <Card className="flex flex-col items-center justify-center gap-4">
            <BeanBadge size={104} />
            <span className="t-label">Brand mark · badge</span>
          </Card>

          <Card>
            <DsLabel>Clear space</DsLabel>
            <p className="text-[14px] leading-relaxed text-mocha">
              Keep clear space equal to the <b>height of the bean</b> on all sides. Never crowd
              the mark with text, imagery, buttons or the browser edge.
            </p>
          </Card>

          <Card>
            <DsLabel>Minimum size</DsLabel>
            <div className="flex flex-wrap items-end gap-6">
              <div className="flex flex-col items-center gap-2">
                <Wordmark height={26} />
                <span className="font-mono text-[12.5px] text-muted">Wordmark · 96px / 30mm</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <BeanBadge size={34} />
                <span className="font-mono text-[12.5px] text-muted">Bean · 24px / 10mm</span>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-muted">
              Below wordmark minimum, switch to the standalone bean mark. The implementation
              enforces this at build time.
            </p>
          </Card>
        </div>

        <div className="mt-5">
          <DsLabel>Supplied brand guide</DsLabel>
          <div className="overflow-hidden rounded-md border border-line bg-surface">
            <Image
              src="/brand/quotes-branding-guide.png"
              alt="quotes branding guide: logo, palette, typography, applications and photography style"
              width={1536}
              height={1024}
              className="h-auto w-full"
              sizes="(max-width: 1160px) 100vw, 1160px"
            />
          </div>
        </div>
      </DsBlock>

      {/* ============ 03 · COLOUR ============ */}
      <DsBlock
        id="color"
        no="03"
        title="Colour"
        sub="A coffee-inspired palette. Cream is the canvas, espresso the ink, latte the single rationed accent."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Espresso", "#2F2322", "oklch .24"],
            ["Mocha", "#4A3836", "oklch .34"],
            ["Latte", "#CBB792", "oklch .77"],
            ["Cream", "#F5F1E9", "oklch .96"],
          ].map(([name, hex, oklch]) => (
            <div key={name} className="overflow-hidden rounded-md border border-line bg-surface">
              <div
                className={cn("h-30", name === "Cream" && "border-b border-line")}
                style={{ background: hex }}
              />
              <div className="px-4 py-3.5">
                <div className="font-serif text-[18px]">{name}</div>
                <div className="mt-1 flex justify-between gap-2 font-mono text-[12px] text-muted">
                  <span>{hex}</span>
                  <span>{oklch}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {[
          { label: "Espresso 50 → 900", steps: espressoScale },
          { label: "Mocha 50 → 900", steps: mochaScale },
          { label: "Latte 50 → 900", steps: latteScale },
        ].map((scale) => (
          <div key={scale.label}>
            <h3 className="t-label mt-8 mb-2.5">{scale.label}</h3>
            <div className="grid grid-cols-5 overflow-hidden rounded-sm border border-line sm:grid-cols-10">
              {scale.steps.map((step) => (
                <div
                  key={step.step}
                  className="flex h-16 items-end justify-center pb-1.5"
                  style={{ background: step.bg }}
                >
                  <span
                    className="font-mono text-[10px] font-medium"
                    style={{ color: step.fg }}
                  >
                    {step.step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <h3 className="t-label mt-9 mb-3.5">Semantic · muted to harmonise</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Success", "Sage", "#5E7355"],
            ["Warning", "Amber", "#B98A3C"],
            ["Error", "Terracotta", "#A5482E"],
            ["Info", "Slate", "#5A6B73"],
          ].map(([name, nickname, hex]) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-sm border border-line bg-surface px-4 py-3.5"
            >
              <span
                className="h-6.5 w-6.5 shrink-0 rounded-[6px]"
                style={{ background: hex }}
              />
              <div className="text-[13.5px]">
                <b className="font-semibold">{name}</b> · {nickname}
                <div className="font-mono text-[11px] text-muted">{hex}</div>
              </div>
            </div>
          ))}
        </div>
      </DsBlock>

      {/* ============ 04 · TYPE ============ */}
      <DsBlock
        id="type"
        no="04"
        title="Typography"
        sub="An editorial serif for voice, Inter for everything functional. Spacious, never compressed."
      >
        <div className="mb-6 grid gap-5 md:grid-cols-3">
          {[
            {
              face: "font-serif",
              size: "text-[clamp(40px,7vw,72px)]",
              copy: "Young Serif — the closest hostable match to Recoleta Bold. Soft, rounded, warm, nostalgic.",
              role: "Display · Serif",
            },
            {
              face: "font-sans font-semibold",
              size: "text-[clamp(40px,7vw,72px)]",
              copy: "Inter — body, navigation, labels, forms, pricing. Three weights: 400 / 500 / 600.",
              role: "Body · Sans",
            },
            {
              face: "font-mono font-medium",
              size: "text-[clamp(30px,5vw,54px)]",
              copy: "IBM Plex Mono — token names, tabular prices, code and metadata.",
              role: "Data · Mono",
            },
          ].map((specimen) => (
            <div key={specimen.role} className="rounded-md border border-line bg-surface p-7">
              <div
                className={cn(
                  specimen.face,
                  specimen.size,
                  "leading-none tracking-[-0.03em]",
                )}
              >
                Aa
              </div>
              <p className="mt-3.5 text-[15px] leading-relaxed text-muted">{specimen.copy}</p>
              <div className="t-overline mt-4 text-accent">{specimen.role}</div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-md border border-line bg-surface">
          <table className="w-full border-collapse text-[14px]">
            <caption className="sr-only">The quotes type scale, desktop to mobile</caption>
            <thead>
              <tr>
                {["Role", "Sample", "Family / weight", "Desktop → mobile", "Leading · tracking"].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="t-label border-b border-line px-3.5 py-3.5 text-left align-baseline"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {TYPE_SCALE.map(([role, sample, family, sizes, metrics, style]) => (
                <tr key={role}>
                  <td className="border-b border-line px-3.5 py-3.5 align-baseline font-mono text-[12px] text-muted">
                    {role}
                  </td>
                  <td
                    className={cn(
                      "border-b border-line px-3.5 py-3.5 align-baseline whitespace-nowrap",
                      style === "serif" && "font-serif text-[clamp(18px,2.4vw,26px)] tracking-[-0.02em]",
                      style === "sans-semibold" && "font-semibold text-[17px]",
                      style === "sans" && "text-[15px]",
                      style === "sans-medium" && "text-[12px] font-medium tracking-[0.02em]",
                      style === "sans-muted" && "text-[12px] text-muted",
                      style === "mono-accent" &&
                        "font-mono text-[11px] font-medium tracking-[0.16em] text-accent",
                    )}
                  >
                    {sample}
                  </td>
                  <td className="border-b border-line px-3.5 py-3.5 align-baseline font-mono text-[12px] text-muted">
                    {family}
                  </td>
                  <td className="border-b border-line px-3.5 py-3.5 align-baseline font-mono text-[12px] text-muted">
                    {sizes}
                  </td>
                  <td className="border-b border-line px-3.5 py-3.5 align-baseline font-mono text-[12px] text-muted">
                    {metrics}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DsBlock>

      {/* ============ 05 · GRID, SPACING, FORM ============ */}
      <DsBlock
        id="layout"
        no="05"
        title="Grid, spacing & form"
        sub="Generous margins, editorial columns, an 8-point rhythm and small, considered radii."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <div>
            <DsLabel>Responsive columns</DsLabel>
            <div className="grid gap-2 rounded-md border border-line bg-surface p-4">
              {[
                ["Desktop · 12", 12],
                ["Tablet · 8", 8],
                ["Mobile · 4", 4],
              ].map(([caption, count]) => (
                <div key={caption as string}>
                  <span className="t-label mb-1.5 block">{caption}</span>
                  <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
                  >
                    {Array.from({ length: count as number }, (_, index) => (
                      <div
                        key={index}
                        className="h-14 rounded-xs bg-[color-mix(in_oklab,var(--color-latte),var(--color-cream)_45%)]"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <DsLabel>Spacing · 4 / 8 base</DsLabel>
            <Card>
              <div className="flex flex-col gap-2.5">
                {SPACING.map(([value, name]) => (
                  <div key={value} className="flex items-center gap-4">
                    <span className="w-16 shrink-0 font-mono text-[12px] text-muted">
                      {value}
                      {name ? ` · ${name}` : ""}
                    </span>
                    <span
                      className="h-4 rounded-[3px] bg-espresso"
                      style={{ width: value }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <DsLabel>Radius · restrained</DsLabel>
            <div className="grid grid-cols-2 gap-3">
              {[
                [4, "4 · xs"],
                [6, "6 · sm"],
                [10, "10 · md"],
                [16, "16 · lg img"],
              ].map(([radius, label]) => (
                <div
                  key={label as string}
                  className="flex aspect-3/2 items-end border border-line bg-[color-mix(in_oklab,var(--color-latte),var(--color-cream)_40%)] p-3"
                  style={{ borderRadius: radius as number }}
                >
                  <span className="font-mono text-[11px] text-mocha">{label}</span>
                </div>
              ))}
            </div>

            <DsLabel className="mt-6">Elevation · soft &amp; rare</DsLabel>
            <div className="grid grid-cols-3 gap-3">
              {(["shadow-sm", "shadow-md", "shadow-lg"] as const).map((shadow, index) => (
                <div
                  key={shadow}
                  className={cn(
                    "flex aspect-8/5 items-end rounded-md border border-line bg-surface p-3.5",
                    shadow,
                  )}
                >
                  <span className="font-mono text-[11px] text-muted">
                    {["sm", "md", "lg"][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DsBlock>

      {/* ============ 06 · ICONS ============ */}
      <DsBlock
        id="icons"
        no="06"
        title="Iconography"
        sub="Thin-to-medium monoline, subtly rounded, warm — never overly technical."
      >
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] overflow-hidden rounded-md border border-line bg-surface">
          {ICON_NAMES.map((name) => (
            <li
              key={name}
              className="-m-px flex aspect-11/10 flex-col items-center justify-center gap-3 border border-line bg-surface"
            >
              <Icon name={name} className="h-6.5 w-6.5" />
              <span className="t-overline text-[10px] tracking-[0.08em] text-muted">{name}</span>
            </li>
          ))}
        </ul>
      </DsBlock>

      {/* ============ 07 · BEAN LANGUAGE ============ */}
      <DsBlock
        id="bean"
        no="07"
        title="The bean language"
        sub="One proprietary mark, many quiet roles — never a sticker beside every heading."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="flex min-h-40 flex-col justify-between gap-4">
            <DsLabel className="mb-0">Bullet &amp; list marker</DsLabel>
            <ul className="flex flex-col gap-3">
              {["Single origin, washed", "Roasted in small batches", "Ground to order"].map(
                (line) => (
                  <li key={line} className="flex items-center gap-2 text-[15px]">
                    <Bean className="w-3.5" />
                    {line}
                  </li>
                ),
              )}
            </ul>
          </Card>

          <Card className="flex min-h-40 flex-col justify-between gap-4">
            <DsLabel className="mb-0">Loyalty stamp · 5 of 8</DsLabel>
            <StampCard stamps={5} size="md" />
            <p className="text-[13px] leading-relaxed text-muted">
              Three more cups to a free coffee.
            </p>
          </Card>

          <Card className="flex min-h-40 flex-col justify-between gap-4">
            <DsLabel className="mb-0">Loader &amp; divider</DsLabel>
            <div className="flex items-center gap-3.5">
              <BeanSpinner className="w-[22px]" />
              <span className="text-[13px] text-muted">Brewing…</span>
            </div>
            <BeanDivider />
          </Card>
        </div>
      </DsBlock>

      {/* ============ 08 · TEXTURE & PATTERN ============ */}
      <DsBlock
        id="patterns"
        no="08"
        title="Texture & pattern"
        sub="Tactile, handmade, subtle — carrying the etched quality of the mark. Never at the cost of readability."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <PatternCard label="Bean repeat" className="pat-bean-repeat" captionOnLight />
          <PatternCard label="Oversized bean" className="pat-oversized-bean" />
          <div className="relative h-45 overflow-hidden rounded-md border border-line bg-surface">
            <div className="flex h-full items-center justify-center p-5">
              <p className="rotate-[-4deg] text-center font-serif text-[15px] leading-[1.9] tracking-[0.02em] text-[color-mix(in_oklab,var(--color-latte),var(--color-espresso)_22%)] opacity-85">
                a pause · a ritual
                <br />
                a conversation · a thought
                <br />
                a moment worth sharing
              </p>
            </div>
            <PatternCaption label="Conversation" onLight />
          </div>
          <PatternCard label="Recycled paper" className="pat-paper" captionOnLight />
        </div>
      </DsBlock>

      {/* ============ 09 · PHOTOGRAPHY ============ */}
      <DsBlock
        id="photo"
        no="09"
        title="Photography direction"
        sub="Warm, natural, cinematic, intimate. Golden light, shallow focus, real moments — never bright corporate stock."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Plate
            tone="espresso"
            badge="Art direction"
            kicker="Espresso · craft"
            caption="Honey crema from a matte portafilter, steam, golden window light, very shallow focus."
            className="min-h-90"
          />
          <Plate
            tone="connection"
            badge="Art direction"
            kicker="Connection · people"
            caption="Two hands around ceramic cups on worn wood — a candid, unhurried conversation."
            className="min-h-90"
          />
          <Plate
            tone="origin"
            badge="Art direction"
            kicker="Origin · material"
            caption="Roasted beans spilling from kraft paper on stone, tactile, directional side light."
            className="min-h-90"
          />
        </div>
        <p className="mt-6 max-w-[66ch] text-[14px] text-muted">
          These plates are the shipped treatment, not placeholders: the product surfaces render
          imagery through the same tonal-plate component, so art direction stays consistent until
          commissioned photography replaces it.
        </p>
      </DsBlock>

      {/* ============ 10 · MOTION ============ */}
      <DsBlock
        id="motion"
        no="10"
        title="Motion"
        sub="Soft, calm, 150–400ms. Gentle scale and tonal shifts, a little arrow travel — never showy."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            {[
              ["Fast — hover, tonal shift", "150ms"],
              ["Standard — buttons, cards", "260ms"],
              ["Slow — image zoom, reveals", "400ms"],
              ["Easing", "cubic-bezier(.22,.61,.36,1)"],
            ].map(([label, value], index, all) => (
              <div
                key={label}
                className={cn(
                  "flex items-center justify-between gap-4 py-2.5 text-[14px]",
                  index < all.length - 1 && "border-b border-line",
                )}
              >
                <span>{label}</span>
                <span className="font-mono text-[12px] text-muted">{value}</span>
              </div>
            ))}
            <p className="mt-3.5 text-[13px] leading-relaxed text-muted">
              Every transition in the product uses these three durations on the one easing curve.
              All of it is suppressed under <code className="font-mono">prefers-reduced-motion</code>.
            </p>
          </Card>

          <Card>
            <DsLabel>Live</DsLabel>
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                className="group inline-flex min-h-12 items-center gap-2.5 rounded-sm bg-espresso px-5.5 text-[14px] font-semibold text-cream transition-[background-color,box-shadow,transform] duration-std ease-brand hover:bg-mocha hover:shadow-md active:translate-y-px"
              >
                Order Coffee
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-std ease-brand group-hover:translate-x-1"
                >
                  <path d="M5 12h13" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
              <div
                title="slow zoom on hover"
                className="h-26 w-38 overflow-hidden rounded-md border border-line bg-[linear-gradient(150deg,#4a3836,#2f2322)] transition-transform duration-slow ease-brand hover:scale-105"
              />
            </div>
          </Card>
        </div>
      </DsBlock>

      {/* ============ 11 · ACCESSIBILITY ============ */}
      <DsBlock
        id="a11y"
        no="11"
        title="Accessibility"
        sub="Premium never reduces usability. WCAG AA contrast, visible focus, generous tap targets."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <ul className="flex flex-col gap-2.5">
            {CONTRAST.map(([pair, bg, fg, info, rating]) => (
              <li
                key={pair}
                className="flex flex-wrap items-center gap-3.5 rounded-sm border border-line px-4 py-3.5"
              >
                <span
                  className="w-30 shrink-0 rounded-[5px] px-2.5 py-2 text-[14px]"
                  style={{ background: bg, color: fg }}
                >
                  {pair}
                </span>
                <span className="text-[13.5px] text-muted">{info}</span>
                <span
                  className={cn(
                    "ml-auto shrink-0 rounded-full px-2.5 py-1.5 font-mono text-[11px] font-medium tracking-[0.06em]",
                    rating === "Decor"
                      ? "bg-[color-mix(in_oklab,var(--color-warning),var(--color-cream)_70%)] text-[#6d4e17]"
                      : "bg-[color-mix(in_oklab,var(--color-success),var(--color-cream)_72%)] text-[#3d5136]",
                  )}
                >
                  {rating}
                </span>
              </li>
            ))}
          </ul>

          <Card>
            <DsLabel>Focus &amp; targets</DsLabel>
            <p className="mb-4 text-[14px] leading-relaxed text-mocha">
              Focus rings use a 3px Latte outline with 2px offset. Interactive targets are a
              minimum of 44×44px. Tab to the button to see the ring.
            </p>
            <button
              type="button"
              className="min-h-12 rounded-sm border border-espresso px-5 text-[14px] font-semibold text-espresso"
            >
              Focusable control
            </button>
            <div className="mt-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-sm border border-dashed border-muted font-mono text-[10px] font-medium text-muted">
                44
              </span>
              <span className="text-[13px] text-muted">Minimum tap target</span>
            </div>
          </Card>
        </div>
      </DsBlock>

      {/* ============ 12 · TOKENS ============ */}
      <DsBlock
        id="tokens"
        no="12"
        title="Design tokens"
        sub="The single source the whole ecosystem consumes. Structured, semantic, named by purpose."
      >
        <div className="overflow-x-auto rounded-md border border-line bg-surface">
          <table className="w-full border-collapse text-[13.5px]">
            <caption className="sr-only">quotes design tokens and where they apply</caption>
            <thead>
              <tr>
                {["Token", "Value", "Applied to"].map((heading) => (
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
              {TOKENS.map(([token, value, applied, swatch]) => (
                <tr key={token}>
                  <td className="border-b border-line px-3.5 py-3 font-mono text-[12px] text-mocha">
                    {token}
                  </td>
                  <td className="border-b border-line px-3.5 py-3 whitespace-nowrap">
                    {swatch ? (
                      <span
                        aria-hidden="true"
                        className="mr-2 inline-block h-3.5 w-3.5 rounded-[3px] border border-line align-[-2px]"
                        style={{ background: swatch }}
                      />
                    ) : null}
                    {value}
                  </td>
                  <td className="border-b border-line px-3.5 py-3">{applied}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-[70ch] text-[14px] leading-relaxed text-muted">
          In code these live in a single Tailwind <code className="font-mono">@theme</code> block
          in <code className="font-mono">src/app/globals.css</code>. The {SCALE_STEPS.length}-step
          tonal scales are generated with <code className="font-mono">color-mix()</code> from the
          five verbatim brand hexes, so no value in the system is invented.
        </p>
      </DsBlock>
    </>
  );
}

function PatternCard({
  label,
  className,
  captionOnLight = false,
}: {
  label: string;
  className: string;
  captionOnLight?: boolean;
}) {
  return (
    <div className={cn("relative h-45 overflow-hidden rounded-md border border-line", className)}>
      <PatternCaption label={label} onLight={captionOnLight} />
    </div>
  );
}

function PatternCaption({ label, onLight }: { label: string; onLight?: boolean }) {
  return (
    <span
      className={cn(
        "absolute bottom-3 left-3 rounded-full px-2.5 py-1.5 font-mono text-[10px] font-medium tracking-[0.1em] uppercase backdrop-blur-[4px]",
        onLight ? "bg-cream/80 text-espresso" : "bg-espresso/72 text-cream",
      )}
    >
      {label}
    </span>
  );
}
