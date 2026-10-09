import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal self-contained server output -- the Docker image only needs
  // .next/standalone, not the full node_modules tree.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
