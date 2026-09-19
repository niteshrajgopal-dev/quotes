import assert from "node:assert/strict";

function resolvePublishedCollection(collections, locationPublicId) {
  return collections.find((entry) => entry.locationPublicId === locationPublicId);
}

const collections = [
  {
    locationPublicId: "loc_hbz",
    publicMenuKey: "mqr_hbz",
    menuPublicId: "men_finedine",
  },
  {
    locationPublicId: "loc_zoo",
    publicMenuKey: "mqr_zoo",
    menuPublicId: "men_demo",
  },
];

assert.equal(
  resolvePublishedCollection(collections, "loc_hbz")?.publicMenuKey,
  "mqr_hbz",
  "HBZ resolves to HBZ published menu key",
);

assert.equal(
  resolvePublishedCollection(collections, "loc_zoo")?.publicMenuKey,
  "mqr_zoo",
  "Zoo resolves to Zoo published menu key",
);

assert.equal(
  resolvePublishedCollection(collections, "loc_missing"),
  undefined,
  "Unknown location returns undefined",
);

console.log("storefront-location checks passed");
