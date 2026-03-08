import { createServerSupabase } from "@/lib/supabase-server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fitted.replit.app";
  const supabase = createServerSupabase();

  const { data: looks } = await supabase
    .from("looks")
    .select("slug, created_at")
    .order("created_at", { ascending: false });

  const lookEntries: MetadataRoute.Sitemap = (looks || []).map((look) => ({
    url: `${baseUrl}/looks/${look.slug}`,
    lastModified: look.created_at ? new Date(look.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/build`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...lookEntries,
  ];
}
