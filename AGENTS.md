# AGENTS.md

Astro 6 static blog (based on the official `blog` starter). ESM-only, TypeScript `strict`.

## Commands
- `npm run dev` — dev server at localhost:4321
- `npm run build` — production build to `./dist/`
- `npm run preview` — serve the built site
- `npm run astro check` — typecheck `.astro`/`.ts` (no `lint`/`test` scripts exist; this is the only verification step)

Requires Node >= 22.12.0 (see `package.json` engines).

## Architecture
- Pages/routes: `src/pages/` — file-based routing. `blog/[...slug].astro` renders posts; `rss.xml.js` builds the feed; `index.astro` and `about.astro` are static pages.
- Content: blog posts live in `src/content/blog/` as `.md`/`.mdx`. Frontmatter is schema-validated in `src/content.config.ts` (required `title`, `description`, `pubDate`; optional `updatedDate`, `heroImage`). Add/edit posts here, not in `src/pages`.
- Read posts via `getCollection('blog')` (see `src/pages/blog/index.astro`, `rss.xml.js`).
- Shared layout/components in `src/layouts/` and `src/components/`; global font (Atkinson, local provider) configured in `astro.config.mjs`.

## Deployment
- Chain: GitHub private repo (`chncaesar/yc-site`) → GitHub Actions `npm run build` → upload `dist/` to Tencent Cloud COS static hosting → domain `禹畅.com`.
- Static-only output; no SSR/server runtime.
- Before deploy, set `astro.config.mjs` `site` to the real `禹畅.com` URL (it still reads `https://example.com`) so canonical URLs, sitemap, and RSS are correct.
- **COS credentials must live in GitHub Secrets** (Settings → Secrets and variables → Actions), never committed to `.yml`. Use a least-privilege CAM sub-account key scoped to the target COS bucket only — not the master account key.

## Content & author voice
The blog is a collection of 中文 long-form profiles of "青年中医" (young TCM doctors), written by one media author. When writing/editing posts, match this established voice:
- **Stance-driven, not neutral reporting.** Recurring thesis: 明医 over 名医, 疗效 over 流量, 青年医生 over 体制内老专家. `why-write-young-doctors.md` is the author's manifesto — every interview argues this case.
- **Slogan/aphorism style.** Short, parallel, often rhymed lines, frequently bolded on their own line (e.g. "降价能买来流量，买不来信任"; "方不大，效实在；针不多，见效快").
- **Case-bombardment opening.** Lead with a rapid list of cure results (X付药治好…), then pivot to the doctor's backstory.
- **Heavy direct quotes** from patients and the doctor; the doctor's self-deprecating/witty lines build a "有人情味" persona.
- **Fixed profile arc:** 童年/师承 → 出走体制 → 临床特色（用药精简、针到病除）→ 不追流量的医德 → 升华到行业意义.
- **Classical allusions** sprinkled in (扁鹊见蔡桓公, 习得性无助, 巴别塔) to add cultural weight.
- Formatting convention for these posts: title lives in frontmatter `title` (rendered as h1 by the layout — do not repeat it in the body); section headers use `##`/`###`; pinyin slug filenames; `description` distilled from the first paragraph.
- **Caveat:** efficacy claims come from doctor/patient self-report, not third-party verification. Concrete "几付药治好某病" phrasing carries 医疗广告合规 risk for a public site — flag, don't silently amplify.

## Repo-specific gotchas
- `astro.config.mjs` `site` is still the placeholder `https://example.com`. Canonical URLs, sitemap, and RSS all derive from it — update before any real deploy.
- `src/consts.ts` `SITE_TITLE`/`SITE_DESCRIPTION` are still starter defaults ("Astro Blog").
- `.astro/` (generated types) and `dist/` are git-ignored; the `astro:content` virtual module types come from there, so run a build/sync if type imports look broken.
