# Quotes — design handoff

This zip is the source of truth for the Quotes storefront redesign. Files marked **primary** define what to build; everything else is reference.

## Primary
- `Quotes Landing.dc.html` — the new homepage. GSAP ScrollTrigger choreography (loader, hero parallax, curated marquee row, pinned "Quotes is" product story, beans CTA band, editorial statement, origins, menu preview, pinned Spanish Latte feature, locations, rewards, footer). The template and inline styles are the spec; the logic class holds the exact timelines, distances, easings, pin lengths and breakpoints.
- `Quotes App.dc.html` — every functional page in the new design: Café menu (search, categories, customise sheet), Shop + product configurator (one-off/subscription, size, grind), 5-step Order flow (where → menu → bag → details/payment → confirmation), Bean card (join, stamps, wallet, activity), Cafés, bag drawer, hamburger sheet, mobile tab bar, toasts, bean spinner.
- `app-data.js` — domain data and store logic ported from the repo (`src/lib/*`). Prices, totals, promo rules, stamps, persistence keys.

## Design system (reference)
- `readme.md` — content voice, visual foundations, iconography, motion rules.
- `tokens/*.css` — colour, type, spacing, shape, motion tokens (CSS variables).
- `components/**` — React reference implementations + `.d.ts` + prompts.
- `guidelines/*.html` — specimen cards.
- `Quotes Design System.dc.html` — motion storyboard and per-section scroll spec (trigger, start/end, scrub, pin, props, easing, responsive rules).
- `ui_kits/website/` — static composition of the homepage from components.

## Assets
- `assets/` — 20 PNGs, all referenced by relative path from the primary files: `logo.png`, `logo-cream.png`, `bean.png`, `photo-splash-cup.png` (hero object, transparent), `product-*.png` (5 drinks, 3:4), `craft-*.png` (4), `venue-*.png` (3), `photo-beans-fall.png`, `photo-story.png`, `photo-iced.png`, `photo-croissant.png`. Copy the folder to `public/assets/`.

## Fonts
Young Serif (display), Inter (body), IBM Plex Mono (numerals, references, kickers) — already in `src/app/layout.tsx`.

## Not in scope / unchanged
Admin, reservations, journal, order-tracking pages, auth and backend integrations keep their current implementation; only apply the new tokens and shell to them.

## Architecture guardrail (QOS-52)

Quotes is tenant #1 of the shared QOS Storefront renderer. Visuals live in theme/content/assets; shared renderer logic stays tenant-driven. No Quotes hostname/branch/pricing conditionals in reusable code.
