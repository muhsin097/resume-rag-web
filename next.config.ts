import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

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
  experimental: {
    // Opts into Next's own agent-driven upgrade flow for future security
    // advisories -- set as part of the 16.4.0 -> 16.4.2 security upgrade.
    agentUpgrade: "security",
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // No auth token set yet -- source map upload silently no-ops rather
  // than failing the build, so this is safe to ship before that's wired
  // up. Errors still report fine, just with minified stack traces until
  // then.
  silent: true,
  widenClientFileUpload: true,
});
