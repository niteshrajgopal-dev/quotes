# quotes — brand token architecture

**System in one sentence:** A warm, editorial specialty-coffee system — espresso-dark ink on cream paper, one handcrafted latte-toned coffee-bean accent, a soft nostalgic serif for voice and Inter for everything functional — tuned for calm, premium restraint over decoration.

Source of truth: the supplied `logo.png` (canonical wordmark — never redrawn, recolored, or re-proportioned) and the brand guide artwork. Core hex values below are taken verbatim from the brand guide; tonal scales and UI tokens are *derived* from them (via `oklch()` / `color-mix()`), never invented.

---

## Core palette (verbatim from brand guide)

| Name | Hex | OKLCH | Role |
|---|---|---|---|
| Espresso | `#2F2322` | `oklch(0.243 0.013 40)` | Primary dark — ink, nav, primary buttons, dark sections |
| Mocha | `#4A3836` | `oklch(0.336 0.018 34)` | Secondary dark — elevated dark surfaces, hovers |
| Latte | `#CBB792` | `oklch(0.771 0.043 79)` | Warm accent — highlights, bean mark, badges, active states |
| Cream | `#F5F1E9` | `oklch(0.955 0.010 82)` | Primary light background (replaces pure white) |
| Black | `#000000` | `oklch(0 0 0)` | Sparingly — max contrast, photo treatment |

## Six canonical UI tokens (OKLCH)

```
--bg:      oklch(0.955 0.010 82)   /* Cream #F5F1E9  */
--surface: oklch(0.975 0.008 82)   /* Cream-lift #FCFAF5 — cards on cream */
--fg:      oklch(0.243 0.013 40)   /* Espresso #2F2322 */
--muted:   oklch(0.520 0.016 45)   /* warm taupe — captions, meta */
--border:  oklch(0.885 0.014 80)   /* warm hairline #E7DFCE */
--accent:  oklch(0.771 0.043 79)   /* Latte #CBB792 */
```

On Espresso/Mocha dark sections the roles invert: `--bg` → Espresso, `--fg` → Cream, borders become `rgba(245,241,233,0.14)`.

## Typography stacks

- **Display / serif (voice):** `"Young Serif"` → closest freely-hostable match to the brand's **Recoleta Bold** (soft, rounded, warm, slightly nostalgic). Fallback: `"Recoleta", Georgia, "Times New Roman", serif`. Used for Display/H1/H2, hero lines, and short quotes only.
- **Body / sans (function):** `"Inter"` (brand-specified) — body, nav, labels, forms, pricing, H3–H5. Fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`.
- **Mono (data):** `"IBM Plex Mono"` — token names, prices where tabular, code. Fallback: `ui-monospace, "SFMono-Regular", Menlo, monospace`.

## Posture rules (observed from the identity)

1. **Cream is the default canvas, not white.** Espresso ink on cream; reserve pure black/white for photography and max-contrast edges only.
2. **One accent, rationed.** Latte appears at most twice per screen — usually the bean mark plus one highlight. Primary actions are Espresso solid, not Latte.
3. **The bean is the signature, not a repeated sticker.** Use it as the "o" in the wordmark (via the logo file), and sparingly as a derived motif — bullet, loyalty stamp, section divider, watermark — never beside every heading.
4. **Restraint over decoration.** Sophistication comes from whitespace, type, and photography; avoid gradients, glassmorphism, giant rounded cards, and pill-everything. Radius stays small (4–12px), shadows stay soft and rare, borders and tonal shifts do the separating.
5. **Editorial, slightly European calm.** Generous margins, a real 12/8/4-column grid, ample line-height, warm imagery in golden light — closer to a premium magazine than a SaaS landing page.

## Derivation notes

- Tonal scales (Espresso/Mocha/Latte 50–950) are produced by mixing each base toward Cream (tints) or Espresso/Black (shades) with `color-mix(in oklab, …)`, so every step traces back to a verbatim brand hex.
- Semantic colors are muted to harmonize with the warm palette: Success `#5E7355` (sage), Warning `#B98A3C` (amber), Error `#A5482E` (terracotta), Info `#5A6B73` (slate) — no bright SaaS primaries.
