import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bean, BeanDivider } from "@/components/brand/bean";
import { TravelArrow } from "@/components/ui/button";
import { Plate } from "@/components/ui/plate";
import { ARTICLES, formatArticleDate, getArticle } from "@/lib/journal";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Story not found" };

  return {
    title: article.title,
    description: article.standfirst,
    openGraph: {
      title: article.title,
      description: article.standfirst,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const more = ARTICLES.filter((candidate) => candidate.slug !== article.slug).slice(0, 2);

  return (
    <article>
      <header className="wrap pt-8 pb-[clamp(32px,5vw,56px)]">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
            <li>
              <Link href="/journal" className="transition-colors duration-fast hover:text-fg">
                Journal
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-fg">{article.kind}</li>
          </ol>
        </nav>

        <div className="max-w-[24ch]">
          <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-accent">
            <Bean className="w-[0.9em]" />
            {article.kind}
          </span>
          <h1 className="t-display-l mt-5">{article.title}</h1>
        </div>

        <p className="mt-7 max-w-[54ch] text-[clamp(17px,2.2vw,21px)] leading-[1.5] text-mocha">
          {article.standfirst}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-6 font-mono text-[11.5px] tracking-[0.08em] text-muted uppercase">
          <span>{article.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readingMinutes} min read</span>
        </div>
      </header>

      <div className="wrap pb-[clamp(40px,6vw,72px)]">
        <Plate
          tone={article.plate}
          kicker="Art direction"
          caption={article.standfirst}
          watermark
          className="min-h-[280px] sm:min-h-[380px]"
        />
      </div>

      {/* --- body: measure-constrained editorial column --- */}
      <div className="wrap pb-[clamp(48px,7vw,88px)]">
        <div className="flex max-w-[68ch] flex-col gap-6">
          {article.body.map((block, index) => {
            if (block.type === "h2") {
              return (
                <h2 key={index} className="t-h1 mt-6">
                  {block.text}
                </h2>
              );
            }

            if (block.type === "quote") {
              return (
                <figure key={index} className="my-4 flex flex-col gap-4">
                  <BeanDivider className="max-w-40" />
                  <blockquote className="font-serif text-[clamp(22px,3.4vw,32px)] leading-[1.2] tracking-[-0.02em]">
                    {block.text}
                  </blockquote>
                  {block.attribution ? (
                    <figcaption className="t-overline text-muted">
                      {block.attribution}
                    </figcaption>
                  ) : null}
                  <BeanDivider className="max-w-40" />
                </figure>
              );
            }

            if (block.type === "list") {
              return (
                <ul key={index} className="flex flex-col gap-3">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3.5 text-[17px] leading-[1.7] text-mocha">
                      <Bean className="mt-1.5 w-3 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={index} className="text-[17px] leading-[1.75] text-mocha">
                {block.text}
              </p>
            );
          })}
        </div>
      </div>

      {/* --- more stories --- */}
      <section className="border-t border-line">
        <div className="wrap py-[clamp(40px,6vw,72px)]">
          <h2 className="t-h1 mb-8">Keep reading</h2>
          <ul className="grid gap-5 md:grid-cols-2">
            {more.map((candidate) => (
              <li key={candidate.slug}>
                <Link
                  href={`/journal/${candidate.slug}`}
                  className="group flex h-full items-start gap-5 rounded-md border border-line bg-surface p-5 transition-[border-color,box-shadow] duration-std ease-brand hover:border-latte hover:shadow-md"
                >
                  <Plate
                    tone={candidate.plate}
                    rounded="md"
                    className="h-24 w-20 shrink-0 min-h-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="t-overline text-muted">{candidate.kind}</span>
                    <h3 className="t-h2 mt-2">{candidate.title}</h3>
                    <span className="mt-3 inline-flex items-center gap-2 text-[13.5px] font-medium">
                      Read it
                      <TravelArrow className="text-latte" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
