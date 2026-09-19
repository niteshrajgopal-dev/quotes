import { proxyWithStorefrontContext } from "@/lib/storefront/proxy-route.server";
import { storefrontApiErrorResponse } from "@/lib/storefront/api-response.server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ mediaAssetId: string }> },
) {
  try {
    const { mediaAssetId } = await context.params;

    return proxyWithStorefrontContext(
      request,
      `/api/public/media/${encodeURIComponent(mediaAssetId)}`,
      { forwardSearchParams: true, binaryResponse: true },
    );
  } catch (error) {
    return storefrontApiErrorResponse(error, "QOS media integration failed.");
  }
}
