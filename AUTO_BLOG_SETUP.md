# Auto-Blog Setup

This project auto-generates and auto-publishes a new SEO-optimized blog
post twice a week, with no manual review step. Here's what's already
built and what YOU need to do once to switch it on.

## What's already built

- `content/blog/*.md` — the blog posts (one seed post included)
- `content/blog-topics.json` — the topic queue the AI works through;
  it refills itself with fresh AI-suggested topics when it runs out
- `lib/blog.ts` / `lib/blog-config.ts` — reading + niche/tone config
- `app/blog/page.tsx` + `app/blog/[slug]/page.tsx` — the actual pages,
  matching the site's design system, with full SEO metadata + schema
- `app/sitemap.ts` — automatically includes every blog post
- `scripts/generate-blog-post.mjs` — the generator (calls Groq)
- `.github/workflows/auto-blog.yml` — the scheduler (Mon & Thu)

## What you need to do (one-time)

1. **Add a GitHub secret** so the workflow can call the AI:
   Repo → Settings → Secrets and variables → Actions → New repository
   secret → name it `GROQ_API_KEY`, paste the same key used by
   `app/api/chat/route.ts`.

2. **Make sure Vercel deploys on push to `main`** (this is Vercel's
   default git integration — nothing to change if it's already
   connected that way). When the workflow commits a new post, Vercel
   will pick it up and deploy automatically. No manual deploy step.

3. **Enable GitHub Actions** on the repo if it's a fresh push (Actions
   tab → enable workflows) — needed once for new repos.

That's it — from here it runs itself. You can also trigger a run
manually any time from the Actions tab ("Run workflow") instead of
waiting for the schedule.

## Full-auto, by design — what that means

Posts publish directly with no human approval gate, per your
instruction. The script has some built-in guardrails (word count
check, a re-roll if it detects obviously AI-templated phrasing,
duplicate-slug protection), but nothing replaces an occasional skim
of what's actually being published — especially early on, spot-check
a few posts to make sure the tone and claims match how you'd actually
want the business represented.

## About ranking #1

Auto-publishing gets pages indexed fast (sitemap auto-updates, plus an
IndexNow ping to Bing/Yandex on every new post). Google itself doesn't
support instant-ping — it crawls based on the sitemap and normal
scheduling, typically picking up a small, actively-updated site within
a few days once Search Console has the sitemap submitted (one-time
manual step in Google Search Console, not automatable). Getting to
position #1 for anything competitive also depends on backlinks, domain
age, and real user engagement — content alone won't do it, especially
in the first few months.

## Reusing this on a client's site

Everything here is parameterized through `lib/site-config.ts` and
`lib/blog-config.ts`. To reuse this whole feature on a different
project: copy `scripts/`, `.github/workflows/auto-blog.yml`,
`content/blog-topics.json` (replace with that client's topics),
`app/blog/*`, `lib/blog.ts`, `lib/blog-config.ts`, and the
`.blog-content` CSS block in `app/globals.css` — then edit
`lib/blog-config.ts` and `lib/site-config.ts` to match the client's
business. No other code changes needed.
