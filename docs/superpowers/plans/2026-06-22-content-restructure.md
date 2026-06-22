# 内容重组 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将单 collection `blog` 拆分为 `interview`/`health`/`events` 三个分类 collection，建立 Topic Cluster URL 结构。

**Architecture:** 3 个 Astro content collection 共用同一 schema，每个有独立的 slug 路由和列表页，再加一个 `/articles/` 聚合页。首页改为分区展示。无新依赖。

**Tech Stack:** Astro 6, TypeScript, Zod schema, @astrojs/rss, no new dependencies.

## Global Constraints

- 不改动 CSS 变量/设计系统/Header 样式/Footer/Hero 样式
- 不改动文章正文内容
- `astro.config.mjs` `site` 不动（等 ICP 批后改）
- `BaseHead.astro` 不动
- 不做 301 重定向（无公网流量）
- Node >= 22.12.0, `npm run build && npm run astro check` 验证

---

### Task 1: content.config.ts + 文件移动

**Files:**
- Modify: `src/content.config.ts`
- Move: `src/content/blog/*.md` → `src/content/{interview,health,events}/`

**Interfaces:**
- Produces: collections `{ interview, health, events }` — 三个 collection 的 schema 与原来 `blog` 相同（`title: string, description: string, pubDate: Date, updatedDate?: Date, heroImage?: image()`）

- [ ] **Step 1: 修改 content.config.ts**

将完整文件替换为：

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const interview = defineCollection({
	loader: glob({ base: './src/content/interview', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const health = defineCollection({
	loader: glob({ base: './src/content/health', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const events = defineCollection({
	loader: glob({ base: './src/content/events', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

export const collections = { interview, health, events };
```

- [ ] **Step 2: 创建目录并移动文件**

```bash
mkdir -p src/content/interview src/content/health src/content/events

# interview (14 files)
mv src/content/blog/cai-liangjun-interview.md src/content/interview/
mv src/content/blog/chen-sheng-interview.md src/content/interview/
mv src/content/blog/cui-shiran-interview.md src/content/interview/
mv src/content/blog/dai-zeyu-interview.md src/content/interview/
mv src/content/blog/guo-xiaofei-interview.md src/content/interview/
mv src/content/blog/qihuang-academy-liu-studio.md src/content/interview/
mv src/content/blog/wang-guoyin-interview.md src/content/interview/
mv src/content/blog/wang-zefeng-interview.md src/content/interview/
mv src/content/blog/why-write-young-doctors.md src/content/interview/
mv src/content/blog/yin-hu-interview.md src/content/interview/
mv src/content/blog/zhang-bingwei-interview.md src/content/interview/
mv src/content/blog/zhang-chiyu-interview.md src/content/interview/
mv src/content/blog/zhang-hanhan-interview.md src/content/interview/
mv src/content/blog/zou-qi-interview.md src/content/interview/

# health (2 files)
mv src/content/blog/fructose-sugar-killer.md src/content/health/
mv src/content/blog/growth-hormone.md src/content/health/

# events (1 file)
mv src/content/blog/tcm-radish-conference-2025.md src/content/events/

# Remove empty blog dir
rmdir src/content/blog
```

- [ ] **Step 3: 验证**

```bash
npm run astro check
```
Expected: 0 errors. 可能因为新建 collection 的 slug 路由还不存在而报 `getStaticPaths` 缺失的错误 — 这是预期的，Task 2 会解决。

- [ ] **Step 4: 提交**

```bash
git add src/content.config.ts src/content/interview/ src/content/health/ src/content/events/
git add -u src/content/blog/
git commit -m "refactor: split blog collection into interview/health/events"
```

---

### Task 2: 新建 3 个 [...slug].astro 路由文件

**Files:**
- Create: `src/pages/interview/[...slug].astro`
- Create: `src/pages/health/[...slug].astro`
- Create: `src/pages/events/[...slug].astro`

**Interfaces:**
- Consumes: collections `interview`, `health`, `events` from `astro:content`（Task 1 定义）
- Consumes: `BlogPost` layout from `../../layouts/BlogPost.astro`
- Produces: 每个 collection 的动态文章路由

- [ ] **Step 1: 创建 interview/[...slug].astro**

```astro
---
import { type CollectionEntry, getCollection, render } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
	const posts = await getCollection('interview');
	return posts.map((post) => ({
		params: { slug: post.id },
		props: post,
	}));
}
type Props = CollectionEntry<'interview'>;

const post = Astro.props;
const { Content } = await render(post);
---

<BlogPost {...post.data}>
	<Content />
</BlogPost>
```

- [ ] **Step 2: 创建 health/[...slug].astro**

```astro
---
import { type CollectionEntry, getCollection, render } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
	const posts = await getCollection('health');
	return posts.map((post) => ({
		params: { slug: post.id },
		props: post,
	}));
}
type Props = CollectionEntry<'health'>;

const post = Astro.props;
const { Content } = await render(post);
---

<BlogPost {...post.data}>
	<Content />
</BlogPost>
```

- [ ] **Step 3: 创建 events/[...slug].astro**

```astro
---
import { type CollectionEntry, getCollection, render } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
	const posts = await getCollection('events');
	return posts.map((post) => ({
		params: { slug: post.id },
		props: post,
	}));
}
type Props = CollectionEntry<'events'>;

const post = Astro.props;
const { Content } = await render(post);
---

<BlogPost {...post.data}>
	<Content />
</BlogPost>
```

- [ ] **Step 4: 验证**

```bash
npm run astro check
```
Expected: 0 errors（三个 `getStaticPaths` 都已定义）。

- [ ] **Step 5: 提交**

```bash
git add src/pages/interview/ src/pages/health/ src/pages/events/
git commit -m "feat: add [...slug].astro routes for interview/health/events collections"
```

---

### Task 3: 新建 4 个列表页（articles 聚合页 + 3 个分类 index）

**Files:**
- Create: `src/pages/articles/index.astro`
- Create: `src/pages/interview/index.astro`
- Create: `src/pages/health/index.astro`
- Create: `src/pages/events/index.astro`

**Interfaces:**
- Consumes: `getCollection('interview')`, `getCollection('health')`, `getCollection('events')`
- Consumes: `BaseHead`, `Header`, `Footer`, `FormattedDate` components
- Consumes: `SITE_DESCRIPTION` from `../consts` (or `../../consts`)

- [ ] **Step 1: 创建 articles/index.astro（聚合页，三类混排）**

```astro
---
import { getCollection } from 'astro:content';
import BaseHead from '../../components/BaseHead.astro';
import Footer from '../../components/Footer.astro';
import FormattedDate from '../../components/FormattedDate.astro';
import Header from '../../components/Header.astro';
import { SITE_DESCRIPTION } from '../../consts';

const interviews = await getCollection('interview');
const healthPosts = await getCollection('health');
const eventPosts = await getCollection('events');

const allPosts = [...interviews, ...healthPosts, ...eventPosts].sort(
	(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<!doctype html>
<html lang="zh-CN">
	<head>
		<BaseHead title="文章" description={SITE_DESCRIPTION} />
	</head>
	<body>
		<Header />

		<div class="page-header">
			<div class="page-header-inner">
				<h1>全部文章</h1>
				<p>青年中医专访 · 健康科普 · 行业动态</p>
			</div>
		</div>

		<main class="blog-main">
			<ul class="post-list">
				{allPosts.map((post) => (
					<li class="post-item">
						<a href={`/${post.collection}/${post.id}/`}>
							<div class="post-meta">
								<FormattedDate date={post.data.pubDate} />
								<span class="post-category"> · {post.collection === 'interview' ? '专访' : post.collection === 'health' ? '科普' : '动态'}</span>
							</div>
							<h2 class="post-title">{post.data.title}</h2>
							<p class="post-desc">{post.data.description}</p>
							<span class="post-read">阅读全文 →</span>
						</a>
					</li>
				))}
			</ul>
		</main>

		<Footer />
	</body>
</html>

<style>
.page-header { background: var(--green-dark); padding: 3em 1.5em 2.5em; }
.page-header-inner { max-width: var(--max-prose); margin: 0 auto; }
.page-header h1 { font-family: var(--font-serif); color: var(--gold); font-size: 2em; margin: 0 0 0.4em; }
.page-header p { color: rgba(247,243,236,0.7); font-size: 0.95em; margin: 0; line-height: 1.7; }
.blog-main { max-width: var(--max-prose); margin: 0 auto; padding: 3em 1em 4em; }
.post-list { list-style: none; margin: 0; padding: 0; }
.post-item { border-bottom: 1px solid var(--paper-dark); }
.post-item:first-child { border-top: 1px solid var(--paper-dark); }
.post-item a { display: block; padding: 1.8em 0; text-decoration: none; transition: padding-left 0.2s; }
.post-item a:hover { padding-left: 0.5em; }
.post-meta { font-size: 0.8em; color: rgb(var(--ink-light)); margin-bottom: 0.4em; letter-spacing: 0.03em; }
.post-category { color: var(--gold); }
.post-title { font-family: var(--font-serif); font-size: 1.2em; color: var(--green-dark); line-height: 1.5; margin: 0 0 0.6em; font-weight: 700; }
.post-item a:hover .post-title { color: var(--green-mid); }
.post-desc { font-size: 0.9em; color: rgb(var(--ink-mid)); line-height: 1.7; margin: 0 0 0.8em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.post-read { font-size: 0.85em; color: var(--gold); font-weight: 500; }
@media (max-width: 600px) { .page-header { padding: 2.5em 1em 2em; } }
</style>
```

- [ ] **Step 2: 创建 interview/index.astro（只显示 interview collection）**

```astro
---
import { getCollection } from 'astro:content';
import BaseHead from '../../components/BaseHead.astro';
import Footer from '../../components/Footer.astro';
import FormattedDate from '../../components/FormattedDate.astro';
import Header from '../../components/Header.astro';
import { SITE_DESCRIPTION } from '../../consts';

const posts = (await getCollection('interview')).sort(
	(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<!doctype html>
<html lang="zh-CN">
	<head>
		<BaseHead title="专访" description={SITE_DESCRIPTION} />
	</head>
	<body>
		<Header />

		<div class="page-header">
			<div class="page-header-inner">
				<h1>明医专访</h1>
				<p>采访全国青年中医，用疗效说话的人，值得被更多人看见。</p>
			</div>
		</div>

		<main class="blog-main">
			<ul class="post-list">
				{posts.map((post) => (
					<li class="post-item">
						<a href={`/interview/${post.id}/`}>
							<div class="post-meta">
								<FormattedDate date={post.data.pubDate} />
							</div>
							<h2 class="post-title">{post.data.title}</h2>
							<p class="post-desc">{post.data.description}</p>
							<span class="post-read">阅读全文 →</span>
						</a>
					</li>
				))}
			</ul>
		</main>

		<Footer />
	</body>
</html>

<style>
.page-header { background: var(--green-dark); padding: 3em 1.5em 2.5em; }
.page-header-inner { max-width: var(--max-prose); margin: 0 auto; }
.page-header h1 { font-family: var(--font-serif); color: var(--gold); font-size: 2em; margin: 0 0 0.4em; }
.page-header p { color: rgba(247,243,236,0.7); font-size: 0.95em; margin: 0; line-height: 1.7; }
.blog-main { max-width: var(--max-prose); margin: 0 auto; padding: 3em 1em 4em; }
.post-list { list-style: none; margin: 0; padding: 0; }
.post-item { border-bottom: 1px solid var(--paper-dark); }
.post-item:first-child { border-top: 1px solid var(--paper-dark); }
.post-item a { display: block; padding: 1.8em 0; text-decoration: none; transition: padding-left 0.2s; }
.post-item a:hover { padding-left: 0.5em; }
.post-meta { font-size: 0.8em; color: rgb(var(--ink-light)); margin-bottom: 0.4em; letter-spacing: 0.03em; }
.post-title { font-family: var(--font-serif); font-size: 1.2em; color: var(--green-dark); line-height: 1.5; margin: 0 0 0.6em; font-weight: 700; }
.post-item a:hover .post-title { color: var(--green-mid); }
.post-desc { font-size: 0.9em; color: rgb(var(--ink-mid)); line-height: 1.7; margin: 0 0 0.8em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.post-read { font-size: 0.85em; color: var(--gold); font-weight: 500; }
@media (max-width: 600px) { .page-header { padding: 2.5em 1em 2em; } }
</style>
```

- [ ] **Step 3: 创建 health/index.astro（只显示 health collection）**

与 interview/index.astro 相同结构，仅改动：
- `getCollection('health')` 替换 `getCollection('interview')`
- page-header：`<h1>健康科普</h1>` + `<p>基于指南与临床实践的中医育儿和健康知识。</p>`
- 链接：`/health/${post.id}/` 替换 `/interview/${post.id}/`

- [ ] **Step 4: 创建 events/index.astro（只显示 events collection）**

与 interview/index.astro 相同结构，仅改动：
- `getCollection('events')` 替换 `getCollection('interview')`
- page-header：`<h1>行业动态</h1>` + `<p>中医行业会议、活动报道与现场记录。</p>`
- 链接：`/events/${post.id}/` 替换 `/interview/${post.id}/`

- [ ] **Step 5: 验证**

```bash
npm run build && npm run astro check
```
Expected: 构建成功，生成 `/articles/`、`/interview/`、`/health/`、`/events/` 四个列表页。

- [ ] **Step 6: 提交**

```bash
git add src/pages/articles/ src/pages/interview/index.astro src/pages/health/index.astro src/pages/events/index.astro
git commit -m "feat: add list pages for articles, interview, health, events"
```

---

### Task 4: 修改首页分区展示

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `getCollection('interview')`, `getCollection('health')`, `getCollection('events')`

- [ ] **Step 1: 替换 frontmatter 中的 getCollection 调用**

将文件第 8-12 行：

```ts
const allPosts = (await getCollection('blog')).sort(
	(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
const featured = allPosts.slice(0, 3);
const rest = allPosts.slice(3);
```

替换为：

```ts
const interviews = (await getCollection('interview')).sort(
	(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
const healthPosts = (await getCollection('health')).sort(
	(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
const eventPosts = (await getCollection('events')).sort(
	(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
const featuredInterviews = interviews.slice(0, 3);
const otherFeatured = [...healthPosts, ...eventPosts]
	.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
	.slice(0, 3);
const allPosts = [...interviews, ...healthPosts, ...eventPosts].sort(
	(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
const rest = allPosts.slice(6);
```

- [ ] **Step 2: 替换精选文章 section**

将原有的单块 `featured` section（仅 interview 卡片）改为两块：

第一块保持 `featured` class，`featuredInterviews` 渲染；再新增第二块 `featured-other` 渲染 `otherFeatured`。在原有 `</section>`（精选文章 section 结束）之后，`<!-- 内容领域 -->` 之前插入：

```astro
		<!-- 精选科普 & 动态 -->
		<section class="featured-other">
			<div class="section-inner">
				<h2 class="section-title">健康科普 &amp; 行业动态</h2>
				<ul class="cards">
					{otherFeatured.map((post) => (
						<li class="card">
							<a href={`/${post.collection}/${post.id}/`}>
								<div class="card-body">
									<h3 class="card-title">{post.data.title}</h3>
									<p class="card-desc">{post.data.description}</p>
									<span class="card-read">阅读全文 →</span>
								</a>
							</li>
						))}
					</ul>
				</div>
			</section>
		)}

		<!-- 内容领域 -->
```

- [ ] **Step 3: 修改原有 featured section 的标题和链接**

将 h2 文字从"近期专访"保持即可（已正确），将卡片内链接从 `/blog/${post.id}/` 改为 `/${post.collection}/${post.id}/`。

- [ ] **Step 4: 修改全部文章列表的链接**

将 `rest.map` 中的链接从 `/blog/${post.id}/` 改为 `/${post.collection}/${post.id}/`。

- [ ] **Step 5: 修改 featured section 的 title**

将 `featured` section 的 `<h2 class="section-title">近期专访</h2>` 保持（不变）。

- [ ] **Step 6: 加 CSS**

在 `<style>` 块末尾 `</style>` 前添加：

```css
/* ── 精选科普 & 动态 ── */
.featured-other {
	padding: 0 0 4em;
	background: var(--paper);
}
```

（featured 已有 `padding: 4em 0 3em`，featured-other 跟在后面只加底部 padding）

- [ ] **Step 7: 验证**

```bash
npm run build && npm run astro check
```
Expected: 构建成功，首页展示两块卡片区。

- [ ] **Step 8: 提交**

```bash
git add src/pages/index.astro
git commit -m "feat: split homepage into interview + health&events card sections"
```

---

### Task 5: 修改 rss.xml.js, Header.astro, BlogPost.astro

**Files:**
- Modify: `src/pages/rss.xml.js`
- Modify: `src/components/Header.astro:10`
- Modify: `src/layouts/BlogPost.astro:18-30`

**Interfaces:**
- rss.xml.js: consumes all 3 collections, produce unified RSS
- Header.astro: nav link `/blog` → `/articles`
- BlogPost.astro: Article JSON-LD URL dynamic

- [ ] **Step 1: 修改 rss.xml.js**

替换为：

```js
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const interviews = await getCollection('interview');
	const healthPosts = await getCollection('health');
	const eventPosts = await getCollection('events');
	const posts = [...interviews, ...healthPosts, ...eventPosts].sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/${post.collection}/${post.id}/`,
		})),
	});
}
```

- [ ] **Step 2: 修改 Header.astro 导航链接**

`src/components/Header.astro:10`：

将：
```astro
<HeaderLink href="/blog">文章</HeaderLink>
```
改为：
```astro
<HeaderLink href="/articles">文章</HeaderLink>
```

- [ ] **Step 3: 修改 BlogPost.astro JSON-LD URL**

将 Article JSON-LD 中的作者 url 从：

```json
"url": "https://xn--doyx8g.com"
```

改为使用 Astro.url 动态生成文章完整 URL。但 JSON-LD 在 `<head>` 中，可以访问 `Astro.url`。

修改 `<script type="application/ld+json" set:html={...}>` 中的 author url 为动态值。由于 `Astro.url` 在 frontmatter 中可用，在此处添加一个变量：

在 `BlogPost.astro` 的 frontmatter（第 11 行之后）添加：

```ts
const articleUrl = new URL(Astro.url.pathname, Astro.site).href;
```

然后将 JSON-LD script 中的 author url 改为 `"url": ${JSON.stringify(articleUrl)}`。

**但在 JSON-LD 中，url 应该是文章自身 URL。当前代码只有 author url，需要同时加文章 url。** 修改 script 为：

```astro
		<script type="application/ld+json" set:html={`{
			"@context": "https://schema.org",
			"@type": "Article",
			"url": ${JSON.stringify(new URL(Astro.url.pathname, Astro.site).href)},
			"headline": ${JSON.stringify(title)},
			"description": ${JSON.stringify(description)},
			"datePublished": ${JSON.stringify(pubDate.toISOString())},
			"dateModified": ${JSON.stringify((updatedDate ?? pubDate).toISOString())},
			"author": {
				"@type": "Person",
				"name": "\u79b9\u7545",
				"url": "https://xn--doyx8g.com"
			}
		}`} />
```

- [ ] **Step 4: 验证**

```bash
npm run build && npm run astro check
```

- [ ] **Step 5: 提交**

```bash
git add src/pages/rss.xml.js src/components/Header.astro src/layouts/BlogPost.astro
git commit -m "fix: update RSS/Header/JSON-LD for new collection URLs"
```

---

### Task 6: 删除旧目录 + 全站验证

**Files:**
- Delete: `src/pages/blog/`（如果还残留）

**注意：** Task 1 已删除 `src/content/blog/`，本 task 只需清理 `src/pages/blog/`。

- [ ] **Step 1: 删除旧 blog 路由**

```bash
rm -rf src/pages/blog
```

- [ ] **Step 2: 全量构建验证**

```bash
npm run build && npm run astro check
```
Expected: 构建成功，无旧 `/blog/` 路径残留。

- [ ] **Step 3: 抽检 dist 输出**

```bash
# 确认新 URL 可访问
ls dist/interview/ | head -5
ls dist/health/ | head -5
ls dist/events/ | head -5
ls dist/articles/

# 确认 JSON-LD 存在于所有文章页
grep -c 'application/ld+json' dist/interview/*/index.html | head -5
grep -c 'application/ld+json' dist/health/*/index.html
grep -c 'application/ld+json' dist/events/*/index.html
```
Expected: 所有文章页各有 1 个 JSON-LD。

- [ ] **Step 4: 提交**

```bash
git add -u src/pages/blog/
git commit -m "chore: remove old /blog/ route, finalize collection restructure"
```
