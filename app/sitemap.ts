import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { articles } from "@/lib/articles";

function getRequestOrigin() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getRequestOrigin();

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/disclaimer",
    "/dmca",
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${origin}${route || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const articleEntries = articles.map((article) => ({
    url: `${origin}/articles/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...articleEntries];
}
