import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const landingPages = [
    "website-cost-kerala",
    "small-business-website",
    "website-design-kochi",
    "ai-chatbot-website",
  ];

  return [
    {
      url: SITE.domain,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...landingPages.map((slug) => ({
      url: `${SITE.domain}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${SITE.domain}/blog`,
      lastModified: posts[0] ? new Date(posts[0].date) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE.domain}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
