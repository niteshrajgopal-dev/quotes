import type { Metadata } from "next";
import Link from "next/link";
import { HospitalityPageIntro } from "@/components/hospitality/page-intro";
import { TravelArrow } from "@/components/ui/button";
import { Plate } from "@/components/ui/plate";
import { ARTICLES, formatArticleDate } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Editorial stories on origins, people and conversations — closer to a magazine than a blog.",
};

export default function JournalPage() {
  const [lead, ...rest] = ARTICLES;

  return (
    <>
      <HospitalityPageIntro
        kicker="Journal"
        title="Origins, people, conversations."
        lead="What we learn on the farm, at the roaster and across the table — written the way we would say it, not the way it sells."
      />

      {/* --- lead story --- */}
      <section className="wrap pb-[clamp(40px,6vw,72px)]">
        <Link
          href={`/journal/${lead.slug}`}
          className="group grid gap-8 overflow-hidden rounded-lg border border-line bg-surface transition-[border-color,box-shadow] duration-std ease-brand hover:border-latte hover:shadow-md lg:grid-cols-2 lg:gap-0"
        >
          <Plate
            tone={lead.plate}
            badge={lead.kind}
            watermark
            rounded="none"
            className="min-h-[260px] border-0 lg:min-h-[420px]"
          />
          <div className="flex flex-col justify-center gap-5 p-7 sm:p-10">
            <span className="t-overline text-muted">
              {formatArticleDate(lead.date)} · {lead.readingMinutes} min read
            </span>
            <h2 className="t-display-m">{lead.title}</h2>
            <p className="max-w-[48ch] text-[16px] leading-relaxed text-mocha">{lead.standfirst}</p>
            <span className="t-caption">By {lead.author}</span>
            <span className="mt-2 inline-flex items-center gap-2.5 text-[14px] font-medium">
              Read the story
              <TravelArrow className="text-latte" />
            </span>
          </div>
        </Link>
      </section>

      {/* --- the rest --- */}
      <section className="wrap pb-[clamp(48px,7vw,88px)]">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/journal/${article.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-surface transition-[transform,box-shadow,border-color] duration-std ease-brand hover:-translate-y-[3px] hover:border-[color-mix(in_oklab,var(--color-latte),var(--color-line)_30%)] hover:shadow-lift"
              >
                <Plate
                  tone={article.plate}
                  badge={article.kind}
                  rounded="none"
                  className="min-h-[170px] border-0 border-b border-line"
                />
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <span className="t-overline text-muted">
                    {formatArticleDate(article.date)} · {article.readingMinutes} min
                  </span>
                  <h2 className="t-h1">{article.title}</h2>
                  <p className="text-[14px] leading-relaxed text-muted">{article.standfirst}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[13.5px] font-medium">
                    Read it
                    <TravelArrow className="text-latte" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
