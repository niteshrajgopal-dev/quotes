import Link from "next/link";
import { Bean } from "@/components/brand/bean";
import { Badge } from "@/components/ui/badge";
import { DS_LAYERS, DsTopBar } from "@/components/system/ds-shell";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";

/**
 * Launcher / overview. The manifest marks index.html as launcher-overview,
 * so this route only navigates — every linked surface is its own route.
 */
export default function DesignSystemOverviewPage() {
  const foundations = DS_LAYERS.filter((tile) => tile.layer === "A");
  const experiences = DS_LAYERS.filter((tile) => tile.layer === "B");

  return (
    <>
      <DsTopBar current="/design-system" />

      <section className="wrap pt-[clamp(60px,10vw,124px)] pb-[clamp(40px,6vw,72px)]">
        <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
          <Bean className="w-[0.9em]" />
          Digital Ecosystem · v1.0
        </span>
        <h1 className="mt-6 font-serif text-[clamp(48px,9vw,104px)] leading-[1.04] tracking-[-0.035em]">
          A coffee brand,
          <br />
          built as a system.
        </h1>
        <p className="mt-7 max-w-[56ch] text-[clamp(17px,2.2vw,20px)] leading-[1.55] text-mocha">
          Everything <b>{BRAND.name}</b> needs to run online — foundations, components and the
          live product experience, all drawn from one warm, editorial source of truth. Built the
          way real brands are: foundations first, experiences second.
        </p>

        <dl className="mt-11 flex flex-wrap gap-x-9 gap-y-6">
          {[
            { value: "5", label: "Core colours" },
            { value: "14", label: "Type roles" },
            { value: "1", label: "Bean, many roles" },
            { value: "9", label: "Live surfaces" },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-serif text-[34px] leading-none tracking-[-0.02em]">
                  {stat.value}
                </span>
                <span className="t-overline mt-1.5 block tracking-[0.12em] text-muted">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <SystemLayer
        id="foundations"
        num="A"
        title="Foundations"
        arch="Foundations → Tokens → Primitives"
        tiles={foundations}
      />

      <SystemLayer
        id="experiences"
        num="B"
        title="Experiences"
        arch="Templates → Product · responsive web"
        tiles={experiences}
      />
    </>
  );
}

function SystemLayer({
  id,
  num,
  title,
  arch,
  tiles,
}: {
  id: string;
  num: string;
  title: string;
  arch: string;
  tiles: typeof DS_LAYERS;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-[clamp(48px,7vw,88px)]">
      <div className="wrap">
        <div className="mb-9 flex flex-wrap items-baseline gap-4">
          <span className="font-mono text-[13px] font-medium tracking-[0.1em] text-accent">
            {num}
          </span>
          <h2 className="font-serif text-[clamp(26px,4vw,38px)] leading-[1.05] tracking-[-0.02em]">
            {title}
          </h2>
          <span className="ml-auto hidden font-mono text-[12px] font-medium tracking-[0.06em] text-muted md:inline">
            {arch}
          </span>
        </div>

        <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile, index) => {
            // The first foundations tile inverts, exactly as in the export.
            const dark = tile.no === "01";
            return (
              <Link
                key={tile.no}
                href={tile.href}
                className={cn(
                  "group relative flex min-h-[220px] flex-col justify-between gap-[30px] overflow-hidden rounded-md border p-[26px]",
                  "transition-[transform,box-shadow,border-color] duration-std ease-brand",
                  "hover:-translate-y-[3px] hover:shadow-lift hover:border-[color-mix(in_oklab,var(--color-latte),var(--color-line)_30%)]",
                  dark ? "border-espresso bg-espresso" : "border-line bg-surface",
                )}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <Bean
                  onDark={dark}
                  className={cn(
                    "pointer-events-none absolute -top-2.5 -right-4 w-[70px]",
                    dark ? "opacity-[0.16]" : "opacity-[0.09]",
                  )}
                />

                <div>
                  <div
                    className={cn(
                      "font-mono text-[12px] font-medium tracking-[0.1em]",
                      dark ? "text-cream/50" : "text-muted",
                    )}
                  >
                    {tile.no}
                  </div>
                  <h3
                    className={cn(
                      "mt-3.5 mb-2 font-serif text-[26px] tracking-[-0.02em]",
                      dark ? "text-cream" : "text-fg",
                    )}
                  >
                    {tile.title}
                  </h3>
                  <p
                    className={cn(
                      "max-w-[34ch] text-[14px] leading-relaxed",
                      dark ? "text-cream/62" : "text-muted",
                    )}
                  >
                    {tile.copy}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <Badge tone={tile.tone === "ready" ? "success" : "latte"}>{tile.status}</Badge>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 text-[13.5px] font-medium",
                      dark ? "text-cream" : "text-espresso",
                    )}
                  >
                    Open
                    <span className="text-latte transition-transform duration-std ease-brand group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}