import type { NextConfig } from "next";
import { MAX_PHOTO_MB } from "./lib/photos";

const nextConfig: NextConfig = {
  experimental: {
    // Photo uploads go through server actions, which default to a 1 MB body.
    serverActions: { bodySizeLimit: `${MAX_PHOTO_MB + 1}mb` },
  },
};

export default nextConfig;
