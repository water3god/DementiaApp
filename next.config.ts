import type { NextConfig } from "next";
import { MAX_PHOTO_MB } from "./lib/photos";

const nextConfig: NextConfig = {
  // Pin the root so a stray lockfile in a parent directory isn't picked up.
  turbopack: { root: import.meta.dirname },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
  experimental: {
    // Photo uploads go through server actions, which default to a 1 MB body.
    serverActions: { bodySizeLimit: `${MAX_PHOTO_MB + 1}mb` },
  },
};

export default nextConfig;
