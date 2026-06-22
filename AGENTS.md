# AGENTS.md

Astro 6 static blog，个人IP站「禹畅 · 明医志」。ESM-only, TypeScript `strict`.

## Commands
- `npm run dev` — dev server at localhost:4321
- `npm run build` — production build to `./dist/`
- `npm run preview` — serve the built site
- `npm run astro check` — typecheck `.astro`/`.ts` (no `lint`/`test` scripts exist; this is the only verification step)

Requires Node >= 22.12.0 (see `package.json` engines).

## Architecture
- Pages/routes: `src/pages/` — file-based routing. `interview/[...slug].astro`, `health/[...slug].astro`, `events/[...slug].astro` 渲染三类文章；`rss.xml.js` 生成 feed；`index.astro` 首页；`about.astro` 关于页；`doctors/index.astro` 医生名录；`articles/index.astro` 全部文章聚合页。
- Content: 三个 collection — `src/content/interview/`（青年中医专访）、`src/content/health/`（健康科普）、`src/content/events/`（行业动态）。Frontmatter schema 在 `src/content.config.ts` 定义（required `title`, `description`, `pubDate`；optional `updatedDate`, `heroImage`, `doctor`）。interview 独有可选字段 `doctor: { name, city, specialties[] }`。
- Read posts via `getCollection('interview')` / `getCollection('health')` / `getCollection('events')`。
- Shared layout/components in `src/layouts/` and `src/components/`; global styles in `src/styles/global.css`.

## Design system
- Brand: 深墨绿 `#1a3a2a` (primary) · 暖米 `#f7f3ec` (background) · 赤金 `#c9a84c` (accent)
- Fonts: Noto Serif SC (headlines) + Noto Sans SC (body), loaded via Google Fonts in `global.css`
- CSS variables defined in `:root` in `global.css` — always use variables, never hardcode colors
- Key classes: `.btn`, `.btn-outline`, `.contact-block`, `.pullquote`, `.patient-quote`
- Header: sticky, dark green background, gold site title; nav links: 文章 / 专访 / 找医生 / 关于 / 联系
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
The blog has three content categories, all written by one media author (禹畅):

1. **青年中医采访** — long-form profiles of young TCM doctors. These follow the established style below.
2. **中医育儿/健康科普** — health science articles on TCM parenting, pediatric health, medical risk analysis. These explain concepts in plain Chinese, often debunking popular misconceptions with evidence (cited studies, guidelines from authoritative bodies like 中华医学会). They do NOT follow the interview profile arc but share the same brand voice (stance-driven, no neutral reporting, slogan lines).
3. **行业动态** — conference reports and TCM industry event coverage. Factual, journalistic tone.

When writing/editing posts, match this established voice:
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
  - When adapting content from other platforms, strip their branding and promotional language; retain only the doctor's story, clinical thinking, and verifiable facts. This applies even when the author is republishing their own content from another platform.
- **科普文章特别合规：**
  - 引用权威来源（《柳叶刀》、中华医学会指南等）增强可信度，避免"据专家说"等模糊引用。
  - 批评某种疗法/产品时，基于公开文献和指南，不点名攻击具体品牌或机构。
  - 口语化表达（"哦""呢""呀"）允许在科普中使用，以拉近和读者距离；但不能滑向贩卖焦虑或制造对立。"选XX还是选健康"这类人为制造二分法的写法需避免。
- **Cross-promotion:** every article bottom must include a "禹畅也写亲子教育" section (below `.contact-block` in `BlogPost.astro`) with the WeChat QR code at `/lazy_mom_qrcode.jpg` and text linking to the author's other public account 懒妈熊娃的科普笔记. The About page also mentions this account.

## Repo-specific gotchas
- `astro.config.mjs` `site` is still the placeholder `https://example.com` — see Pending section above.
- `.astro/` (generated types) and `dist/` are git-ignored; the `astro:content` virtual module types come from there, so run a build/sync if type imports look broken.
- No GitHub Actions workflows — CD is handled entirely by Makers git integration.
- OG/Twitter meta intentionally absent — domestic Chinese site, those tags have no effect.
- **After adding or editing any post:** review the full site for SEO — check that `<title>` format is correct (no duplication), all pages have unique `description` meta, sitemap regenerated, no broken internal links, and article slugs are clean pinyin. If adding an interview post about a new doctor, include the `doctor` frontmatter block to appear on `/doctors/`.
- **GEO 语义结构：** 首页的 Topics/FAQ section 和 JSON-LD（Person），文章页的 Article JSON-LD，均由 `docs/superpowers/specs/2026-06-22-geo-optimization-design.md` 定义。编辑 `index.astro` 或 `BlogPost.astro` 时勿移除这些语义区块。
- **医生名录字段规范：** interview 文章的 `doctor` 字段（name / city / specialties）不得包含具体医馆/医院名称。city 不详填 `需询问`。specialties 用自由文本标签（3–5 个），无需遵循枚举。编辑 `/doctors/` 页面时勿移除 contact-cta。
- **从公众号抓取文章：** `pubDate` 必须使用公众号原文的发布日期（在浏览器中打开文章页面查找日期），而非抓取当天的日期。标题需重写以符合 Journalism tone（去掉感叹号、夸张词）。疗效描述全部套用"据XX医生说""患者自述/反馈"框架。
