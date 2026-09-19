import { NextResponse } from "next/server";

import { resolveStorefrontContextFromRequest } from "@/lib/storefront/context.server";
import { storefrontApiErrorResponse } from "@/lib/storefront/api-response.server";
import { proxyQosRequest } from "@/lib/qos/proxy.server";

export const dynamic = "force-dynamic";

function resolveBasketLocationPublicId(
  context: Awaited<ReturnType<typeof resolveStorefrontContextFromRequest>>,
  requestedLocationPublicId?: string,
): string | null {
  const trimmed = requestedLocationPublicId?.trim();
  if (!trimmed) {
    return context.locationPublicId;
  }

  const matched = context.manifest.locations.some(
    (location) => location.locationPublicId === trimmed,
  );
  if (!matched) {
    return null;
  }

  return trimmed;
}

export async function POST(request: Request) {
  try {
    const context = await resolveStorefrontContextFromRequest(request);
    const body = (await request.json().catch(() => ({}))) as {
      locale?: string;
      locationPublicId?: string;
    };
    const locationPublicId = resolveBasketLocationPublicId(context, body.locationPublicId);
    if (!locationPublicId) {
      return NextResponse.json(
        { error: "Unknown branch for this storefront.", field: "locationPublicId" },
        { status: 400 },
      );
    }

    const upstreamBody = JSON.stringify({
      storefrontPublicId: context.storefrontPublicId,
      locationPublicId,
      locale: body.locale ?? context.manifest.defaultLocale ?? "en",
    });

    const upstreamRequest = new Request(new URL("/api/baskets?contractVersion=1", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: request.headers.get("cookie") ?? "",
      },
      body: upstreamBody,
    });

    return proxyQosRequest({
      upstreamPath: "/api/public/baskets",
      request: upstreamRequest,
      forwardSearchParams: true,
      storefrontContext: context,
    });
  } catch (error) {
    return storefrontApiErrorResponse(error, "QOS basket integration failed.");
  }
}
