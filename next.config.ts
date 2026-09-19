import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Standalone is for container/self-host builds only. On Vercel it breaks the
  // post-build NFT step (missing .next/next-server.js.nft.json) after compile.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
};

export default nextConfig;