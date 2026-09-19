/**
 * QOS-94 validation — café switch rebinds anonymous basket to the new location/menu.
 *
 *   node scripts/verify-qos-94.mjs [storefrontBaseUrl]
 */

import assert from "node:assert/strict";
import test from "node:test";

const BASE = process.argv[2] ?? "https://quotes-isolated.dev.qosapp.com";
const API_BASE =
  process.env.QOS_API_BASE_URL ??
  "https://ca-qos-dev-api.gentleplant-cc8574e8.uaenorth.azurecontainerapps.io";

class QosRequestError extends Error {
  constructor(message, statusCode, field) {
    super(message);
    this.name = "QosRequestError";
    this.statusCode = statusCode;
    this.field = field;
  }
}

function basketMatchesSelectedLocation(basket, locationPublicId) {
  if (!locationPublicId) {
    return true;
  }

  return basket.locationPublicId === locationPublicId;
}

function isRecoverableAnonymousBasketError(error) {
  return (
    error instanceof QosRequestError &&
    (error.statusCode === 401 || error.statusCode === 404 || error.statusCode === 410)
  );
}

async function ensureActiveBasket({
  locale = "en",
  locationPublicId,
  fetchCurrent,
  createBasket,
}) {
  try {
    const response = await fetchCurrent();
    if (!basketMatchesSelectedLocation(response.basket, locationPublicId)) {
      const created = await createBasket(locale);
      return { basket: created.basket, signedIn: false };
    }

    return { basket: response.basket, signedIn: false };
  } catch (error) {
    if (isRecoverableAnonymousBasketError(error)) {
      const created = await createBasket(locale);
      return { basket: created.basket, signedIn: false };
    }
    throw error;
  }
}

test("basketMatchesSelectedLocation returns true when location is unset", () => {
  assert.equal(
    basketMatchesSelectedLocation({ locationPublicId: "loc_a" }, null),
    true,
  );
});

test("basketMatchesSelectedLocation detects location mismatch", () => {
  assert.equal(
    basketMatchesSelectedLocation({ locationPublicId: "loc_hbz" }, "loc_zoo"),
    false,
  );
  assert.equal(
    basketMatchesSelectedLocation({ locationPublicId: "loc_hbz" }, "loc_hbz"),
    true,
  );
});

test("ensureActiveBasket rebinds when current basket location differs", async () => {
  const result = await ensureActiveBasket({
    locationPublicId: "loc_zoo",
    fetchCurrent: async () => ({ basket: { locationPublicId: "loc_hbz" } }),
    createBasket: async () => ({ basket: { locationPublicId: "loc_zoo" } }),
  });

  assert.equal(result.basket.locationPublicId, "loc_zoo");
});

test("ensureActiveBasket keeps matching basket without rebind", async () => {
  let created = false;
  const result = await ensureActiveBasket({
    locationPublicId: "loc_hbz",
    fetchCurrent: async () => ({ basket: { locationPublicId: "loc_hbz" } }),
    createBasket: async () => {
      created = true;
      return { basket: { locationPublicId: "loc_hbz" } };
    },
  });

  assert.equal(result.basket.locationPublicId, "loc_hbz");
  assert.equal(created, false);
});

async function fetchJson(url, init = {}) {
  const response = await fetch(url, init);
  const json = await response.json().catch(() => null);
  return { response, json };
}

async function runLiveChecks() {
  const failures = [];

  function check(condition, message) {
    if (!condition) failures.push(message);
  }

  const manifestUrl = new URL("/api/public/storefronts/manifest", `${API_BASE}/`);
  manifestUrl.searchParams.set("host", new URL(BASE).hostname);
  manifestUrl.searchParams.set("contractVersion", "1");

  const { response: manifestResponse, json: manifestPayload } = await fetchJson(manifestUrl);
  check(manifestResponse.ok, `manifest expected 200, got ${manifestResponse.status}`);

  const locations = manifestPayload?.manifest?.locations ?? [];
  const collections = manifestPayload?.manifest?.publishedCollections ?? [];
  const hbz = locations.find((location) => /hbz/i.test(location.name));
  const zoo = locations.find((location) => /zoo/i.test(location.name));
  check(Boolean(hbz), "HBZ branch missing from manifest");
  check(Boolean(zoo), "Zoo branch missing from manifest");

  if (!hbz || !zoo) {
    if (failures.length > 0) {
      console.error("\nFailures:");
      for (const failure of failures) console.error(`  - ${failure}`);
      process.exit(1);
    }
    return;
  }

  const hbzMenuKey = collections.find(
    (entry) => entry.locationPublicId === hbz.locationPublicId,
  )?.publicMenuKey;
  const zooMenuKey = collections.find(
    (entry) => entry.locationPublicId === zoo.locationPublicId,
  )?.publicMenuKey;

  const hbzMenu = await fetch(
    `${API_BASE}/api/public/menus/${hbzMenuKey}?contractVersion=1&locale=en`,
  ).then((response) => response.json());
  const zooMenu = await fetch(
    `${API_BASE}/api/public/menus/${zooMenuKey}?contractVersion=1&locale=en`,
  ).then((response) => response.json());

  const flatwhite = hbzMenu.menu.sections
    .flatMap((section) => section.products)
    .find((product) => /flat/i.test(product.displayName));
  const latte = zooMenu.menu.sections
    .flatMap((section) => section.products)
    .find((product) => /latte/i.test(product.displayName));

  check(Boolean(flatwhite), "HBZ Flatwhite product missing");
  check(Boolean(latte), "Zoo Demo Latte product missing");

  let { response: createResponse, json: createPayload } = await fetchJson(
    `${BASE}/api/baskets?contractVersion=1`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `qos.location=${encodeURIComponent(hbz.locationPublicId)}`,
      },
      body: JSON.stringify({ locale: "en" }),
    },
  );

  check(createResponse.ok, `create HBZ basket expected 2xx, got ${createResponse.status}`);
  const createCookies = createResponse.headers.getSetCookie?.() ?? [];
  let cookieHeader = createCookies.map((cookie) => cookie.split(";")[0]).join("; ");
  let csrf = createCookies
    .find((cookie) => cookie.includes("qos_anon_csrf"))
    ?.split(";")[0]
    .split("=")[1];

  let basket = createPayload?.basket;
  check(basket?.locationPublicId === hbz.locationPublicId, "initial basket not bound to HBZ");

  const addHbz = await fetchJson(`${BASE}/api/baskets/current/lines?contractVersion=1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${cookieHeader}; qos.location=${encodeURIComponent(hbz.locationPublicId)}`,
      "X-QOS-CSRF-Token": csrf,
    },
    body: JSON.stringify({
      productPublicId: flatwhite.productPublicId,
      quantity: 1,
      expectedVersion: basket.version,
    }),
  });
  check(addHbz.response.ok, `add HBZ item expected 2xx, got ${addHbz.response.status}`);
  basket = addHbz.json?.basket;
  check((basket?.lines?.length ?? 0) === 1, "HBZ basket should contain one line before switch");

  const rebind = await fetchJson(`${BASE}/api/baskets?contractVersion=1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${cookieHeader}; qos.location=${encodeURIComponent(zoo.locationPublicId)}`,
    },
    body: JSON.stringify({ locale: "en" }),
  });
  check(rebind.response.ok, `rebind basket expected 2xx, got ${rebind.response.status}`);

  const rebindCookies = rebind.response.headers.getSetCookie?.() ?? [];
  if (rebindCookies.length > 0) {
    cookieHeader = rebindCookies.map((cookie) => cookie.split(";")[0]).join("; ");
    csrf =
      rebindCookies
        .find((cookie) => cookie.includes("qos_anon_csrf"))
        ?.split(";")[0]
        .split("=")[1] ?? csrf;
  }

  basket = rebind.json?.basket;
  check(
    basket?.locationPublicId === zoo.locationPublicId,
    `rebind response location expected ${zoo.locationPublicId}, got ${basket?.locationPublicId}`,
  );
  check((basket?.lines?.length ?? 0) === 0, "rebound basket should start empty");

  const current = await fetchJson(`${BASE}/api/baskets/current?contractVersion=1`, {
    headers: {
      Cookie: `${cookieHeader}; qos.location=${encodeURIComponent(zoo.locationPublicId)}`,
    },
  });
  basket = current.json?.basket;
  check(
    basket?.locationPublicId === zoo.locationPublicId,
    `current basket after rebind expected ${zoo.locationPublicId}, got ${basket?.locationPublicId}`,
  );

  const addZoo = await fetchJson(`${BASE}/api/baskets/current/lines?contractVersion=1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${cookieHeader}; qos.location=${encodeURIComponent(zoo.locationPublicId)}`,
      "X-QOS-CSRF-Token": csrf,
    },
    body: JSON.stringify({
      productPublicId: latte.productPublicId,
      quantity: 1,
      expectedVersion: basket.version,
    }),
  });
  check(addZoo.response.ok, `add Zoo item expected 2xx, got ${addZoo.response.status}`);

  if (failures.length > 0) {
    console.error(`\nQOS-94 live checks failed (${BASE}):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }

  console.log(`QOS-94 live checks passed (${BASE})`);
}

await runLiveChecks();
