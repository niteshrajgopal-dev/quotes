/**
 * Same-origin proxy path for QOS public media assets.
 * Browser and RSC code use `/api/media/{id}`; the route proxies to
 * `{QOS_API_BASE_URL}/api/public/media/{id}`.
 */
export function qosPublicMediaUrl(mediaAssetId: string | null | undefined): string | null {
  const id = mediaAssetId?.trim();
  if (!id) {
    return null;
  }

  // Encode once for the path segment; the route param is decoded by Next.js
  // before we forward a single-encoded id to upstream.
  return `/api/media/${encodeURIComponent(id)}`;
}
