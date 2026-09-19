import { proxyWithStorefrontContext } from "@/lib/storefront/proxy-route.server";
import { storefrontApiErrorResponse } from "@/lib/storefront/api-response.server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ mediaAssetId: string }> },
) {
  try {
    const { mediaAssetId } = await context.params;

    // mediaAssetId is decoded from the route param; encode once for upstream.
    const upstreamPath = `/api/public/media/${encodeURIComponent(mediaAssetId)}`;

    return proxyWithStorefrontContext(request, upstreamPath, {
      forwardSearchParams: true,
      binaryResponse: true,
    });
  } catch (error) {
    return storefrontApiErrorResponse(error, "QOS media integration failed.");
  }
}
