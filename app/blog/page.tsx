import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { getAllPosts } from "@/lib/blog";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical, plain-language guides on websites, pricing, and getting found online — written for small business owners in Kerala.",
  alternates: { canonical: `${SITE.domain}/blog` },
  openGraph: {
    title: "Blog",
    description:
      "Practical, plain-language guides on websites, pricing, and getting found online — written for small business owners in Kerala.",
    url: `${SITE.domain}/blog`,
    type: "website",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="border-b border-line grid-dots">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              Eclyze Blog
            </span>
            <h1 className="mt-4 font-display font-semibold text-3xl md:text-5xl max-w-2xl leading-tight">
              Straight talk on websites, pricing, and getting found online.
            </h1>
            <p className="mt-4 text-ink-muted max-w-xl leading-relaxed">
              No jargon, no fluff — just what small business owners in
              Kerala actually need to know.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          {posts.length === 0 ? (
            <p className="text-ink-muted">
              New posts are on the way — check back soon.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-px bg-line border border-line">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-bg p-6 flex flex-col hover:bg-bg-panel transition-colors"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                    {new Date(post.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {" · "}
                    {post.readingTime}
                  </span>
                  <h2 className="mt-3 font-display font-semibold text-lg leading-snug text-ink group-hover:text-navy transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed flex-1">
                    {post.description}
                  </p>
                  <span className="mt-4 font-mono text-[11px] uppercase tracking-widest text-coral">
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
