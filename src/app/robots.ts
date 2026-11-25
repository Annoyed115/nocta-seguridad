import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Crawling stays open everywhere; the vercel.app copies are kept out of results by the noindex header in next.config.ts.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
