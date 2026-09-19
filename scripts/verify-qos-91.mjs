/**
 * QOS-91 validation — location switch scopes the published menu per branch.
 *
 *   node scripts/verify-qos-91.mjs [storefrontBaseUrl]
 */

const BASE = process.argv[2] ?? "https://quotes-isolated.dev.qosapp.com";
const API_BASE =
  process.env.QOS_API_BASE_URL ??
  "https://ca-qos-dev-api.gentleplant-cc8574e8.uaenorth.azurecontainerapps.io";

const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function fetchText(url, init = {}) {
  const response = await fetch(url, init);
  const text = await response.text();
  return { response, text };
}

async function fetchJson(url, init = {}) {
  const { response, text } = await fetchText(url, init);
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { response, json, text };
}

console.log(`QOS-91 validation (${BASE})`);

const manifestUrl = new URL("/api/public/storefronts/manifest", `${API_BASE}/`);
manifestUrl.searchParams.set("host", new URL(BASE).hostname);
manifestUrl.searchParams.set("contractVersion", "1");

const { response: manifestResponse, json: manifestPayload } = await fetchJson(manifestUrl);
check(manifestResponse.ok, `manifest expected 200, got ${manifestResponse.status}`);

const manifest = manifestPayload?.manifest;
const locations = manifest?.locations ?? [];
const collections = manifest?.publishedCollections ?? [];

check(locations.length >= 3, "expected at least 3 storefront branches");

const menuByLocation = new Map();

for (const location of locations) {
  const collection = collections.find(
    (entry) => entry.locationPublicId === location.locationPublicId,
  );
  check(Boolean(collection?.publicMenuKey), `missing publicMenuKey for ${location.name}`);

  const { response, text } = await fetchText(`${BASE}/menu`, {
    headers: {
      Cookie: `qos.location=${encodeURIComponent(location.locationPublicId)}`,
    },
  });

  check(response.ok, `/menu for ${location.name} expected 200, got ${response.status}`);
  menuByLocation.set(location.locationPublicId, {
    name: location.name,
    menuPublicId: collection?.menuPublicId ?? null,
    text,
  });
}

const hbz = locations.find((location) => /hbz/i.test(location.name));
const zoo = locations.find((location) => /zoo/i.test(location.name));
const hct = locations.find((location) => /hct/i.test(location.name));

check(Boolean(hbz), "HBZ Stadium branch missing from manifest");
check(Boolean(zoo), "Al Ain Zoo branch missing from manifest");
check(Boolean(hct), "HCT Academic City branch missing from manifest");

if (hbz && zoo && hct) {
  const hbzMenu = menuByLocation.get(hbz.locationPublicId);
  const zooMenu = menuByLocation.get(zoo.locationPublicId);
  const hctMenu = menuByLocation.get(hct.locationPublicId);

  check(Boolean(hbzMenu?.text), "HBZ menu HTML missing");
  check(Boolean(zooMenu?.text), "Zoo menu HTML missing");
  check(Boolean(hctMenu?.text), "HCT menu HTML missing");

  check(
    hbzMenu.text !== zooMenu.text,
    "HBZ and Zoo rendered the same menu HTML after location cookie scoping",
  );
  check(
    hbzMenu.text !== hctMenu.text,
    "HBZ and HCT rendered the same menu HTML after location cookie scoping",
  );

  check(
    zooMenu.text.includes("Demo Latte") || /demo menu/i.test(zooMenu.text),
    "Zoo menu missing Demo Menu marker",
  );
  check(
    hctMenu.text.includes("Demo Latte") || /demo menu/i.test(hctMenu.text),
    "HCT menu missing Demo Menu marker",
  );

  console.log("  · HBZ, Zoo, and HCT menus resolve to distinct published catalogues");
}

{
  const { response, text } = await fetchText("https://flowers.dev.qosapp.com/menu");
  check(response.ok, `flowers menu expected 200, got ${response.status}`);
  check(text.includes("Classic Rose Bouquet"), "flowers tenant catalogue changed unexpectedly");
  console.log("  · flowers tenant menu unchanged");
}

if (failures.length > 0) {
  console.error("\nFailures:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log("\nAll QOS-91 checks passed.");
