/**
 * QOS-106 — shop chrome and home curated cards localize under quotes.locale=ar.
 *
 *   node scripts/verify-qos-106-locale-content.mjs
 *
 * Hits the deployed storefront (QUOTES_BASE_URL). Run after deploy to validate C2.
 */

import assert from "node:assert/strict";
import test from "node:test";

const QUOTES = process.env.QUOTES_BASE_URL ?? "https://quotes.dev.qosapp.com";

const AR_SHOP = [
  "ست قهوات، موصوفة بصدق",
  "ابحث عن المنشأ",
  "ترتيب",
  "كل درجات التحميص",
  "كيف نحمص",
];

const EN_SHOP_LEFTOVERS = [
  "Six coffees, honestly described",
  "Search origin, or a tasting note",
  "Featured first",
  "All roasts",
  "How we roast",
  "Sort",
];

const EN_CURATED_IMAGE_OVERLAY = "SPANISH LATTE";

async function fetchHtml(path) {
  const response = await fetch(`${QUOTES}${path}`, {
    headers: { Cookie: "quotes.locale=ar" },
  });
  const text = await response.text();
  return { response, text };
}

function includesAny(text, needles) {
  return needles.some((needle) => text.includes(needle));
}

function excludesAll(text, needles) {
  return needles.every((needle) => !text.includes(needle));
}

test("shop page renders Arabic browse chrome without English leftovers", async () => {
  const { response, text } = await fetchHtml("/shop");
  assert.equal(response.ok, true, `expected /shop 200, got ${response.status}`);
  assert.ok(text.includes('dir="rtl"') || text.includes("dir=rtl"), "missing dir=rtl");
  assert.ok(includesAny(text, AR_SHOP), "shop browse chrome not Arabic");
  assert.ok(excludesAll(text, EN_SHOP_LEFTOVERS), "shop page still contains English UI leftovers");
});

test("home curated cards avoid baked-in English image overlay text in SSR", async () => {
  const { response, text } = await fetchHtml("/");
  assert.equal(response.ok, true, `expected / 200, got ${response.status}`);
  assert.ok(
    !text.includes(EN_CURATED_IMAGE_OVERLAY),
    "home curated cards still expose baked-in English product image overlay text",
  );
});
