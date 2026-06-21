# AGENTS.md

Astro 6 static blog，个人IP站「禹畅 · 明医志」。ESM-only, TypeScript `strict`.

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
- Shared layout/components in `src/layouts/` and `src/components/`; global styles in `src/styles/global.css`.

## Design system
- Brand: 深墨绿 `#1a3a2a` (primary) · 暖米 `#f7f3ec` (background) · 赤金 `#c9a84c` (accent)
- Fonts: Noto Serif SC (headlines) + Noto Sans SC (body), loaded via Google Fonts in `global.css`
- CSS variables defined in `:root` in `global.css` — always use variables, never hardcode colors
- Key classes: `.btn`, `.btn-outline`, `.contact-block`, `.pullquote`, `.patient-quote`
- Header: sticky, dark green background, gold site title; nav links: 文章 / 关于 / 联系
- Footer: dark green, minimal — brand tagline + nav links + copyright

## Deployment
- Chain: GitHub private repo (`chncaesar/yc-site`) → push to `main` → EdgeOne Makers auto-build → deploy to global edge → domain `禹畅.com`.
- Makers project name: `yc-site`, preview URL: `yc-site-ba9gnexi.edgeone.cool`.
- Static-only output; no SSR/server runtime.
- Build command: `npm run build`, output directory: `dist` (configured in Makers project settings).
- Node version specified via `.nvmrc` in repo root (`22`) — Makers reads this to select the correct Node runtime.
- **Free tier limits:** KV storage 1GB, Blob storage 1GB, 500 builds/month.

## Pending after ICP approval
- Set `astro.config.mjs` `site` to `https://xn--doyx8g.com` (Punycode for 禹畅.com) — canonical URLs, sitemap, and RSS all derive from this; currently still `https://example.com`.
- Bind custom domain in Makers console → CNAME → auto HTTPS.
- ICP filing: materials submitted, server 1.14.70.145 (Tencent Cloud, 2-core 2GB) purchased to satisfy ICP requirement; site itself is hosted on Makers, not this server.

## Content & author voice
The blog is a collection of 中文 long-form profiles of "青年中医" (young TCM doctors), written by one media author (禹畅). When writing/editing posts, match this established voice:
- **Stance-driven, not neutral reporting.** Recurring thesis: 明医 over 名医, 疗效 over 流量, 青年医生 over 体制内老专家. `why-write-young-doctors.md` is the author's manifesto — every interview argues this case.
- **Slogan/aphorism style.** Short, parallel, often rhymed lines, frequently bolded on their own line (e.g. "降价能买来流量，买不来信任"; "方不大，效实在；针不多，见效快").
- **Case-bombardment opening.** Lead with a rapid list of cure results (X付药治好…), then pivot to the doctor's backstory.
- **Heavy direct quotes** from patients and the doctor; the doctor's self-deprecating/witty lines build a "有人情味" persona.
- **Fixed profile arc:** 童年/师承 → 出走体制 → 临床特色（用药精简、针到病除）→ 不追流量的医德 → 升华到行业意义.
- **Classical allusions** sprinkled in (扁鹊见蔡桓公, 习得性无助, 巴别塔) to add cultural weight.
- Formatting convention for these posts: title lives in frontmatter `title` (rendered as h1 by the layout — do not repeat it in the body); section headers use `##`/`###`; pinyin slug filenames; `description` distilled from the first paragraph.
- **Editorial compliance (中国大陆发布):**
  - Efficacy claims must be attributed to doctor/patient self-report, never stated as fact by the author. Use "据张医生说""患者反馈" framing, not "张医生治好了XX病".
  - Concrete "几付药治好某病" phrasing carries 医疗广告合规 risk — flag, don't silently amplify.
  - Never promote a specific clinic, hospital, or health platform by name. If the source article contains such placement (e.g. "base上海的某高管帮他推荐了某医馆"), remove it entirely — the patient's path to the doctor is their own business.
  - Keep promotional tone weak. Avoid marketing-style superlatives ("奇迹""神仙""一手治愈"), celebrity-endorsement framing, and clickbait titles. Write as journalism, not advertorial.
  - When adapting content from other platforms, strip their branding and promotional language; retain only the doctor's story, clinical thinking, and verifiable facts.

## Repo-specific gotchas
- `astro.config.mjs` `site` is still the placeholder `https://example.com` — see Pending section above.
- `.astro/` (generated types) and `dist/` are git-ignored; the `astro:content` virtual module types come from there, so run a build/sync if type imports look broken.
- No GitHub Actions workflows — CD is handled entirely by Makers git integration.
- OG/Twitter meta intentionally absent — domestic Chinese site, those tags have no effect.
