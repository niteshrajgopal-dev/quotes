# quotes coffee co.

A production web app built from the **quotes Digital Design System** export in
`design/Quotes-Coffee-Design-System.zip`. Warm editorial specialty-coffee system:
espresso ink on cream paper, one rationed latte accent, a soft serif for voice and
Inter for everything functional.

Built with Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4 (CSS-first
`@theme`), TypeScript in strict mode, and Zustand for client state.

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (25 prerendered routes) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint, flat config, `eslint-config-next` 16 |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run verify:shots` | Screenshots every route across the viewport matrix, fails on horizontal overflow or console errors |
| `npm run verify:smoke` | Drives the real purchase path end to end in a browser |
| `npm run verify:sticky` | Asserts the sticky header and mobile tab bar stay pinned |

The three `verify:*` scripts drive a real browser via `playwright-core` and expect
the app running on `http://localhost:3100` (or pass a base URL as the first
argument). Start it with `npx next start -p 3100` first.

---

## What's in the app

Two surface families, kept deliberately separate as the handoff requires — the
product app must not carry design-system chrome.

**Product app** — `src/app/(site)/`, wrapped in the shell layout (sticky header,
cart drawer, footer, phone tab bar):

| Route | Surface |
|---|---|
| `/` | Home: hero, brand statement, featured coffee, menu highlights, quote moment, loyalty teaser, journal, locations |
| `/shop`, `/shop/[slug]` | Bag catalogue with roast filter, sort and search; product page with tasting notes, brew methods and the bag configurator |
| `/menu` | Café menu by category with dietary key |
| `/order` | Five-step mobile-first ordering flow: where → menu → bag → details → done |
| `/checkout` | Full-page checkout with order summary |
| `/orders/[reference]` | Order confirmation with stamps earned |
| `/loyalty` | Bean card: join, progress, rewards, history |
| `/journal`, `/journal/[slug]` | Editorial articles |
| `/locations` | Cafés with hours, services, contact |

**Design-system documentation** — `src/app/design-system/`, its own layout so none
of the product shell leaks in: `/design-system` (launcher, mirroring `index.html`),
`/foundations`, `/components`, `/patterns`.

Ordering, cart, loyalty and order history are genuinely functional against local
domain data in `src/lib/`, persisted to `localStorage` through Zustand. There is no
payment backend: card details are validated in the browser and never leave the
device, which the checkout copy states plainly.

---

## Token mapping

Every token traces back to the export. `foundations.html` `:root` is the
authoritative token source; `brand-spec.md` supplies the palette rationale.
Tailwind 4 consumes them through `@theme` in `src/app/globals.css`, so
`--color-espresso` automatically yields `bg-espresso`, `text-espresso`, and so on.

### Colour

| Export | This app | Value |
|---|---|---|
| Espresso | `--color-espresso` | `#2F2322` |
| Mocha | `--color-mocha` | `#4A3836` |
| Latte | `--color-latte` | `#CBB792` |
| Cream | `--color-cream` | `#F5F1E9` |
| `--bg` | `--color-bg` | `#F5F1E9` |
| `--surface` | `--color-surface` | `#FCFAF5` |
| `--fg` | `--color-fg` | `#2F2322` |
| `--muted` | `--color-muted` | `#7C6E62` |
| `--border` | `--color-line` | `#E7DFCE` |
| `--accent` | `--color-accent` | `#CBB792` |

The six canonical UI tokens are specified in OKLCH in `brand-spec.md` and as hex in
`foundations.html`. They are the same colours; the hex form is used here so the
values are identical to the exported stylesheet.

`--border` is named `--color-line` because Tailwind reserves the `border-*`
namespace for border-width utilities — `--color-border` would collide with
`border-2`. `border-line` is the resulting utility.

Semantic colours are the export's muted set, not bright SaaS primaries: success
`#5E7355` sage, warning `#B98A3C` amber, error `#A5482E` terracotta, info `#5A6B73`
slate.

Tonal scales (`espresso-50…900`, `latte-50…900`) are generated with
`color-mix(in oklab, …)` toward Cream for tints and Espresso/Black for shades,
exactly as the derivation notes prescribe, so **no step is a hand-invented hex** —
every one resolves back to a verbatim brand colour at runtime.

### Type, radius, shadow, motion, layout

Radius (`4/6/10/16/20`), shadows (all three), motion (`150/260/400ms` on
`cubic-bezier(.22,.61,.36,1)`), and layout (`--mx: clamp(20px,5vw,72px)`,
`--maxw: 1160px`) are copied verbatim from `foundations.html`.

Typefaces are loaded with `next/font`: Young Serif for display and short quotes,
Inter for body and UI, IBM Plex Mono for prices and token names. Young Serif is the
export's own stated substitute for the brand's Recoleta Bold, and Recoleta is kept
ahead of Georgia in the fallback stack so a licensed install is picked up
automatically.

`--mx` and `--maxw` live in `:root` rather than `@theme` because they are consumed
as raw `var()` values in arbitrary properties, not as generated utilities.

### One resolved conflict

`brand-spec.md` prose says radius "stays small (4–12px)", while
`foundations.html` defines `--r-lg: 16px` and `--r-xl: 20px` and uses `--r-lg` for
photography plates. The handoff says to keep exported behaviour when a detail is
ambiguous, so the exported scale wins; the larger two steps are reserved for
full-bleed imagery and hero plates, as in the export.

---

## Design fidelity

- **The wordmark is never redrawn.** `public/brand/quotes-logo.png` is the supplied
  `logo.png`, used as-is. `src/components/brand/logo.tsx` throws if it is rendered
  below its 96px minimum legible width, so a misuse fails the build instead of
  shipping. Below that size the bean mark is used instead.
- **The bean is signature, not sticker.** SVG path data in
  `src/components/brand/bean.tsx` is verbatim from `foundations.html`. It appears as
  the loyalty stamp, list bullet, section divider, spinner and watermark — never
  next to every heading.
- **One accent, rationed.** Primary actions are solid Espresso, never Latte. Latte
  is held back for the bean mark plus roughly one highlight per screen.
- **Cream, not white.** `#F5F1E9` is the canvas. The colour contract in the handoff
  warns against introducing warm cream washes *unless they are already explicit
  brand colours* — here Cream is a verbatim core palette entry, so it is the
  intended background rather than an invented wash.
- **Restraint.** No gradients or glassmorphism; separation comes from hairline
  borders and tonal shifts, with shadows soft and rare.
- **Real copy.** Product names, tasting notes, article text, café hours and menu
  items come from the export's own content, not marketing filler.

---

## Responsive behaviour

One adaptive experience across the handoff's nine-viewport matrix, from 360×800 to
1920×1080, using fluid `clamp()` type and spacing plus semantic breakpoints rather
than fixed screens.

`npm run verify:shots` renders each route, screenshots it into
`design/verification/`, and **fails the run** if `documentElement.scrollWidth`
exceeds `clientWidth` or if anything logs a console error. Horizontal rails are
excluded from offender reporting since they scroll by design. Current status: no
overflow and no console errors across the matrix.

One subtlety worth knowing if you extend the layouts: horizontally scrollable
rails inside grid or flex items will widen the page unless the item can shrink. A
scroll container's `overflow-x: auto` only zeroes its *automatic minimum size*, so
the ancestor still has `min-width: auto` and gets sized by content. Both `Card` and
`.rail` therefore set `min-width: 0`. `FilterRail` and `Stepper` also take a
`bleed` prop to switch off the full-width negative margins when nested inside a
padded container.

---

## Accessibility

Semantic headings, real `button`/`a`/`input` elements, visible focus rings
(3px Latte outline with offset), WCAG AA contrast on the documented pairs, and tap
targets of at least 44px. Radios and checkboxes are visually hidden inputs wrapped
in their labels, so they stay keyboard- and screen-reader-navigable while rendering
as custom cards. Sheets trap focus, restore it on close, and close on Escape.
`prefers-reduced-motion` collapses animation to near-zero.

---

## Project structure

```
design/                       supplied design system + extracted source
scripts/                      browser-driven verification
src/app/
  layout.tsx                  root: fonts, toasts, bean sprite
  globals.css                 @theme tokens + pattern utilities
  (site)/                     product app (shell layout)
  design-system/              documentation (own layout)
src/components/
  brand/                      bean, wordmark, stamp card, icons
  ui/                         button, badge, field, card, sheet, toast, tabs, plate
  shell/                      header, footer, tab bar, cart drawer
  cart/ checkout/ menu/ order/ product/ loyalty/
src/lib/
  brand.ts catalog.ts menu.ts journal.ts locations.ts
  stores/                     cart, loyalty, orders (persisted)
```

## Verification status

`npm run lint`, `npm run typecheck` and `npm run build` all pass clean. The three
`verify:*` scripts pass: no overflow or console errors across nine viewports,
sticky chrome holds on scroll, and the purchase path works end to end — configure a
bag, add to cart, survive a reload, get blocked by empty-field validation, place
the order, land on a referenced confirmation, and find the bag emptied.
