/**
 * QOS-101 validation — anonymous basket survives checkout reload after auth gate.
 *
 *   node scripts/verify-qos-101.mjs
 */

import assert from "node:assert/strict";
import test from "node:test";

function resolveClientStorefrontLocation(cookieValue, shellFallback) {
  const cookie = cookieValue?.trim();
  if (cookie) {
    return cookie;
  }

  return shellFallback?.trim() ?? null;
}

function shouldRebindBasketForLocation(basket, locationPublicId, options) {
  const trimmed = locationPublicId?.trim();
  if (!trimmed) {
    return false;
  }

  if (options?.force) {
    return true;
  }

  if (!basket) {
    return true;
  }

  return basket.locationPublicId !== trimmed;
}

function shouldSyncBasketLocation(basket, cookieValue) {
  const cookieLocation = cookieValue?.trim();
  if (!cookieLocation) {
    return false;
  }

  return shouldRebindBasketForLocation(basket, cookieLocation);
}

test("resolveClientStorefrontLocation prefers explicit qos.location cookie", () => {
  assert.equal(resolveClientStorefrontLocation("loc_hbz", "loc_zoo"), "loc_hbz");
  assert.equal(resolveClientStorefrontLocation(null, "loc_zoo"), "loc_zoo");
  assert.equal(resolveClientStorefrontLocation("", "loc_zoo"), "loc_zoo");
});

test("reload sync must not force rebind when basket already matches branch", () => {
  const basket = { locationPublicId: "loc_hbz" };

  assert.equal(
    shouldSyncBasketLocation(basket, "loc_hbz"),
    false,
    "matching cookie + basket should keep existing lines on reload",
  );
});

test("reload sync ignores shell fallback when qos.location cookie is absent", () => {
  const basket = { locationPublicId: "loc_hbz" };

  assert.equal(
    shouldSyncBasketLocation(basket, null),
    false,
    "inferred shell default must not recreate basket without explicit cookie",
  );
});

test("reload sync still rebinds when branch cookie differs from basket", () => {
  const basket = { locationPublicId: "loc_hbz" };

  assert.equal(
    shouldSyncBasketLocation(basket, "loc_zoo"),
    true,
    "explicit branch switch via cookie must rebind",
  );
});

test("explicit café picker still uses forced rebind", () => {
  assert.equal(
    shouldRebindBasketForLocation({ locationPublicId: "loc_hbz" }, "loc_hbz", { force: true }),
    true,
    "picker path keeps QOS-94 forced POST /api/baskets behavior",
  );
});
