import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidgetLoader";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { SITE } from "@/lib/site-config";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${SITE.domain}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${SITE.domain}/blog/${post.slug}`;

  return (
    <>
      <Header />
      <main className="pt-16">
        <article className="mx-auto max-w-2xl px-6 py-16">
          <Link
            href="/blog"
            className="font-mono text-[11px] uppercase tracking-widest text-ink-faint hover:text-navy transition-colors"
          >
            ← All posts
          </Link>

          <span className="mt-6 block font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
            {new Date(post.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {" · "}
            {post.readingTime}
          </span>

          <h1 className="mt-3 font-display font-semibold text-3xl md:text-4xl leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-ink-muted leading-relaxed">
            {post.description}
          </p>

          <div
            className="blog-content mt-10 pt-10 border-t border-line"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] uppercase tracking-widest text-ink-faint border border-line px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-14 corner-brackets border border-line bg-bg-panel p-6">
            <p className="font-display font-medium text-ink">
              Ready for a website like this business needs?
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {SITE.priceDisplay} flat, live in {SITE.deliveryDays} working
              days.
            </p>
            <Link
              href="/#intake"
              className="mt-4 inline-block font-mono text-[11px] uppercase tracking-widest bg-coral text-coral-ink px-4 py-2.5 border border-coral hover:bg-bg-invert hover:text-invert-ink hover:border-bg-invert transition-colors"
            >
              Start Your Project →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
      <ChatWidget />

      {/* BlogPosting structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            author: { "@type": "Organization", name: post.author },
            publisher: { "@type": "Organization", name: SITE.name },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          }),
        }}
      />
    </>
  );
}
