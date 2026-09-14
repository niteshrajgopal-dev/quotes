/**
 * The Journal: editorial stories on origins, people and conversations —
 * closer to a magazine than a blog, per the design export.
 */

import type { PlateTone } from "@/lib/ui/plate-tone";

export type Article = {
  slug: string;
  kind: "Origin" | "People" | "Conversation" | "Craft";
  title: string;
  standfirst: string;
  author: string;
  date: string;
  readingMinutes: number;
  plate: PlateTone;
  featured?: boolean;
  /** Body is authored as blocks so the editorial rhythm survives rendering. */
  body: Array<
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "quote"; text: string; attribution?: string }
    | { type: "list"; items: string[] }
  >;
};

export const ARTICLES: Article[] = [
  {
    slug: "the-two-thousand-metre-line",
    kind: "Origin",
    title: "The two thousand metre line",
    standfirst:
      "Why the best Ethiopian coffee grows exactly where it is hardest to farm — and what that costs the people who grow it.",
    author: "Yara Haddad",
    date: "2026-08-14",
    readingMinutes: 7,
    plate: "origin",
    featured: true,
    body: [
      {
        type: "p",
        text: "There is a band of land in the Gedeo Zone, somewhere between 1,900 and 2,200 metres, where coffee cherries take almost twice as long to ripen as they do on the plains. Cool nights slow the plant down. The sugars have longer to develop. Everything we taste as jasmine, as bergamot, as that tea-like clarity, is a by-product of a plant growing under mild, sustained stress.",
      },
      {
        type: "p",
        text: "It is also, inconveniently, the hardest place to farm. The slopes are steep enough that everything moves by hand or by mule. There is no mechanisation to be had at forty degrees of gradient.",
      },
      { type: "h2", text: "What altitude actually buys" },
      {
        type: "list",
        items: [
          "Slower maturation, which concentrates sugars and organic acids.",
          "Denser beans, which hold up to a lighter roast without tasting green.",
          "More aromatic compounds surviving into the cup — the florals we look for.",
        ],
      },
      {
        type: "quote",
        text: "You cannot roast altitude into a coffee. You can only fail to lose it.",
        attribution: "Tomas, head roaster",
      },
      {
        type: "p",
        text: "Which is why we buy the Konga lot every year we can get it, and why we roast it lighter than is comfortable. The cost of that decision sits with the farmers who work the slope, and it is the reason our price per kilo is not a number we negotiate hard on.",
      },
    ],
  },
  {
    slug: "the-second-cup-rule",
    kind: "Conversation",
    title: "The second cup rule",
    standfirst:
      "We designed the café around a single observation: nothing important gets said in the first ten minutes.",
    author: "Imran Doyle",
    date: "2026-07-30",
    readingMinutes: 5,
    plate: "connection",
    featured: true,
    body: [
      {
        type: "p",
        text: "Watch any two people sit down with coffee. The first cup is logistics — how was the drive, how is work, what are you having. The conversation that either of them will remember starts somewhere in the second.",
      },
      {
        type: "p",
        text: "So we stopped optimising for turnover. The tables are deep enough to put a laptop away. There are no power sockets in the window seats, deliberately. The chairs are comfortable for about ninety minutes, which is roughly how long a good conversation runs before it needs a walk.",
      },
      {
        type: "quote",
        text: "Some conversations deserve another coffee.",
      },
      {
        type: "p",
        text: "It is not a hospitality strategy so much as an admission. We are not really selling coffee. We are renting ninety quiet minutes, and the coffee is what makes them worth staying for.",
      },
    ],
  },
  {
    slug: "what-nelson-taught-us-about-consistency",
    kind: "People",
    title: "What Nelson taught us about consistency",
    standfirst:
      "Four harvests from the same two hectares in Huila, and the lesson was not about coffee at all.",
    author: "Yara Haddad",
    date: "2026-07-11",
    readingMinutes: 6,
    plate: "paper",
    body: [
      {
        type: "p",
        text: "Nelson Ramírez farms two hectares of Caturra and Castillo outside Pitalito. We have bought his coffee four years running, which in specialty terms makes us unusually boring — most roasters chase the new lot, the higher score, the more interesting story.",
      },
      { type: "h2", text: "The case for staying put" },
      {
        type: "p",
        text: "The first year we bought from Nelson, the coffee cupped at 84. The fourth year it cupped at 87, and the only variable that had changed was that he knew we would be back. Guaranteed offtake bought him a covered drying bed. The covered bed bought him three extra days of controlled drying. Those three days are the difference between 84 and 87.",
      },
      {
        type: "quote",
        text: "Nobody improves a farm for a buyer who might not come back.",
        attribution: "Nelson Ramírez, Finca La Esperanza",
      },
      {
        type: "p",
        text: "It is the least romantic sourcing story we have, and easily the most useful one.",
      },
    ],
  },
  {
    slug: "why-we-serve-decaf-after-four",
    kind: "Craft",
    title: "Why we serve decaf after four",
    standfirst:
      "A quiet default that made our afternoons better, and nobody has noticed yet.",
    author: "Imran Doyle",
    date: "2026-06-19",
    readingMinutes: 4,
    plate: "espresso",
    body: [
      {
        type: "p",
        text: "At four o'clock the grinder on the second hopper switches to the Guatemala Antigua, decaffeinated in Colombia with sugarcane-derived ethyl acetate. Unless you ask for caffeine, that is what is in your flat white.",
      },
      {
        type: "p",
        text: "We started doing it because the 4pm–6pm crowd is the one that stays longest, talks most, and sleeps worst. Sugarcane decaf keeps enough sweetness and body that the drink does not announce itself as a compromise.",
      },
      {
        type: "list",
        items: [
          "Ask for caffeine and you will get it, no questions.",
          "The single origin filter is always fully caffeinated.",
          "Nothing about the price changes either way.",
        ],
      },
      {
        type: "p",
        text: "In eight months, four people have spotted it from taste alone. Three of them worked in coffee.",
      },
    ],
  },
  {
    slug: "the-bean-is-not-a-sticker",
    kind: "Craft",
    title: "The bean is not a sticker",
    standfirst:
      "How one small mark ended up doing six different jobs across the brand — and the rule that stopped it doing seventy.",
    author: "Studio note",
    date: "2026-05-28",
    readingMinutes: 5,
    plate: "connection",
    body: [
      {
        type: "p",
        text: "The bean sits inside the wordmark as the 'o'. That is its home and its only guaranteed appearance. Everywhere else it has to earn the space: as a list bullet, as a loyalty stamp, as a loading state, as a divider, as an oversized watermark on a dark panel.",
      },
      {
        type: "quote",
        text: "One accent, rationed. The bean is the signature, not a repeated sticker.",
      },
      {
        type: "p",
        text: "The rule we hold to is that the latte accent appears at most twice on any given screen — usually the bean plus one highlight. Primary actions stay espresso-solid. It is a small piece of discipline that does most of the work in keeping the whole thing calm.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function formatArticleDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
