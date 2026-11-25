import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: { formats: ["image/avif", "image/webp"] }, // AVIF first: the photos weigh 20–50% less
  experimental: {
    // The 7 KB of Tailwind CSS arrive inside the HTML: no render-blocking stylesheet request before the first paint.
    inlineCss: true,
    // The cached build reused stale Tailwind CSS after class names changed (seen with Next 16.4.2); builds are fast without it.
    turbopackFileSystemCacheForBuild: false,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Concept site: keep its *.vercel.app addresses out of search results.
        source: "/:path*",
        has: [{ type: "host", value: "(?<sub>.*)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  turbopack: {
    root: __dirname, // a stray package-lock.json in the home folder otherwise confuses root detection
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
