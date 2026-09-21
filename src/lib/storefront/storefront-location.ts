export const LOCATION_COOKIE_NAME = "qos.location";
export const LOCATION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function readClientStorefrontLocation(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${LOCATION_COOKIE_NAME.replace(".", "\\.")}=([^;]+)`),
  );

  const value = match ? decodeURIComponent(match[1]).trim() : "";
  return value || null;
}

/** Client branch selection: explicit qos.location cookie, else optional shell fallback. */
export function resolveClientStorefrontLocation(
  shellFallback?: string | null,
): string | null {
  return readClientStorefrontLocation() ?? shellFallback?.trim() ?? null;
}

export function writeClientStorefrontLocation(locationPublicId: string) {
  const trimmed = locationPublicId.trim();
  if (!trimmed) {
    return;
  }

  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCATION_COOKIE_NAME}=${encodeURIComponent(trimmed)}; Path=/; Max-Age=${LOCATION_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function resolvePublishedCollection<
  T extends { locationPublicId: string; publicMenuKey: string | null },
>(publishedCollections: readonly T[], locationPublicId: string) {
  return publishedCollections.find(
    (entry) => entry.locationPublicId === locationPublicId,
  );
}
