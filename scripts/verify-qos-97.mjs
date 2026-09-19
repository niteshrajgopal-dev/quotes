/**
 * QOS-97 validation — product media URL helper and proxy contract.
 *
 *   node scripts/verify-qos-97.mjs
 */

import assert from "node:assert/strict";
import test from "node:test";

function qosPublicMediaUrl(mediaAssetId) {
  const id = mediaAssetId?.trim();
  if (!id) {
    return null;
  }

  return `/api/media/${encodeURIComponent(id)}`;
}

test("null mediaAssetId returns null", () => {
  assert.equal(qosPublicMediaUrl(null), null);
});

test("blank mediaAssetId returns null", () => {
  assert.equal(qosPublicMediaUrl("   "), null);
});

test("mediaAssetId encodes into same-origin proxy path", () => {
  assert.equal(
    qosPublicMediaUrl("asset/with/slash"),
    "/api/media/asset%2Fwith%2Fslash",
  );
});

test("trimmed mediaAssetId builds proxy URL", () => {
  assert.equal(qosPublicMediaUrl("  media-123  "), "/api/media/media-123");
});
