import type { MetadataRoute } from "next";
import { getDeadlines, getSubjects } from "@/lib/data";
import { siteUrl } from "@/lib/format";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/deadlines`, changeFrequency: "hourly", priority: 0.9 },
    ...subjects.map((s) => ({ url: `${siteUrl}/subjects/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...deadlines.map((d) => ({ url: `${siteUrl}/deadlines/${d.id}`, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
