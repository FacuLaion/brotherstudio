import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/agendar", "/precios"];
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const lang of locales) {
    for (const route of routes) {
      entries.push({
        url: `${siteConfig.url}/${lang}${route}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: route === "" ? 1 : 0.7,
      });
    }
  }
  return entries;
}
