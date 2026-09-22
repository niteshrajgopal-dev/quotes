/**
 * QOS-103 — home/header/menu/order chrome is Arabic under quotes.locale=ar.
 *
 *   node scripts/verify-qos-103-locale-chrome.mjs
 *
 * Hits the deployed storefront (QUOTES_BASE_URL). Run after deploy to validate C2.
 */

import assert from "node:assert/strict";
import test from "node:test";

const QUOTES = process.env.QUOTES_BASE_URL ?? "https://quotes.dev.qosapp.com";

const AR_NAV = ["القائمة", "الطلب"];
const AR_MENU = ["ابحث في القائمة", "كل شيء", "أضف"];
const AR_ORDER = ["أين", "ماذا ستطلب", "اختر المشروبات"];
const AR_HOME_MARKETING = ["حبوب تستحق", "لكل فنجان", "من المنشأ"];
const AR_ORDER_FOOTER = ["استكشف", "المواقع", "عارض متجر"];

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

test("menu page renders Arabic browse chrome without Customise", async () => {
  const { response, text } = await fetchHtml("/menu");
  assert.equal(response.ok, true, `expected /menu 200, got ${response.status}`);
  assert.ok(text.includes('dir="rtl"') || text.includes("dir=rtl"), "missing dir=rtl");
  assert.ok(includesAny(text, AR_MENU), "menu browse chrome not Arabic");
  assert.ok(!text.includes("Customise"), 'menu page still contains English "Customise" aria-labels');
});

test("order page renders Arabic order flow chrome and footer", async () => {
  const { response, text } = await fetchHtml("/order");
  assert.equal(response.ok, true, `expected /order 200, got ${response.status}`);
  assert.ok(includesAny(text, AR_ORDER), "order chrome not Arabic");
  assert.ok(includesAny(text, AR_ORDER_FOOTER), "order footer chrome not Arabic");
  assert.ok(!text.includes(">Explore<"), 'order footer still contains English "Explore"');
});

test("home page renders Arabic marketing copy and nav chrome", async () => {
  const { response, text } = await fetchHtml("/");
  assert.equal(response.ok, true, `expected / 200, got ${response.status}`);
  assert.ok(
    text.includes("استكشف القائمة") || text.includes("اطلب الآن"),
    "home hero chrome not Arabic",
  );
  assert.ok(includesAny(text, AR_NAV), "nav chrome not Arabic on home");
  assert.ok(includesAny(text, AR_HOME_MARKETING), "home marketing copy not Arabic");
  assert.ok(!text.includes("Beans worth the wait"), 'home still contains English marketing copy');
});
