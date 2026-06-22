# GEO 语义优化 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为首页和文章页注入语义化 HTML + JSON-LD 结构化数据，使 AI 引擎（ChatGPT/Gemini/Perplexity）能精准识别"禹畅"作为作者实体和内容领域。

**Architecture:** 改动集中在 3 个文件，不引入新依赖。HTML 增密（section/dl/dt/dd）建立内容领域声明和 FAQ 索引；JSON-LD（schema.org Person + Article）提供机器可读结构化数据。

**Tech Stack:** Astro 6, TypeScript, no new dependencies.

## Global Constraints

- 不改动 CSS 变量、设计系统、Header/Footer
- 不改动文章正文内容
- `astro.config.mjs` 的 `site` 字段暂不改（等 ICP 批后统一改）
- 文章页 title 格式 `{articleTitle} · {SITE_TITLE}` 保持不变
- Node >= 22.12.0, `npm run build && npm run astro check` 验证

---

### Task 1: 修改 SITE_DESCRIPTION 文案

**Files:**
- Modify: `src/consts.ts:2`

**Interfaces:**
- Produces: `SITE_DESCRIPTION` 导出值为 `"专访有疗效的青年中医，兼写中医育儿健康科普。独立写作者禹畅的个人内容网站。"`

- [ ] **Step 1: 修改 consts.ts**

将 `src/consts.ts` 第 2 行替换为：

```ts
export const SITE_DESCRIPTION = '专访有疗效的青年中医，兼写中医育儿健康科普。独立写作者禹畅的个人内容网站。';
```

`SITE_TITLE` 不变（已是 `"禹畅 · 明医志"`）。

- [ ] **Step 2: 验证**

```bash
npm run astro check
```
Expected: 无类型错误。

- [ ] **Step 3: 提交**

```bash
git add src/consts.ts
git commit -m "chore: update SITE_DESCRIPTION for GEO entity declaration"
```

---

### Task 2: 首页语义增密（Hero 文字 + Topics + FAQ + Person JSON-LD）

**Files:**
- Modify: `src/pages/index.astro`（全量重写部分 section 和 style）

**Interfaces:**
- Consumes: `SITE_TITLE`, `SITE_DESCRIPTION` from `../consts`（已有 import）
- Produces: 首页新增 `<section id="topics">`, `<section id="faq">`, `<script type="application/ld+json">` Person schema

- [ ] **Step 1: 替换 Hero 文字**

将文件第 28-31 行的 `hero-sub` 段落替换为：

```astro
<p class="hero-sub">
	禹畅，长期专访青年中医的独立写作者。<br />
	行业里最会吆喝的人，往往不是最会治病的人。<br />
	我只写有疗效的人。
</p>
```

- [ ] **Step 2: 添加 Topics section**

在第 55 行 `</section>`（精选文章 section 结束）之后、第 57 行 `<!-- 关于作者 -->` 之前，插入：

```astro
		<!-- 内容领域 -->
		<section class="topics" id="topics">
			<div class="section-inner">
				<h2 class="section-title">主要内容领域</h2>
				<dl class="topic-list">
					<div class="topic-item">
						<dt>青年中医专访</dt>
						<dd>全国青年中医的临床特色、医德与师承故事</dd>
					</div>
					<div class="topic-item">
						<dt>中医育儿与健康科普</dt>
						<dd>基于权威指南与临床实践的家庭健康决策参考</dd>
					</div>
				</dl>
			</div>
		</section>
```

- [ ] **Step 3: 添加 FAQ section**

在第 87 行 `)}` （全部文章 section 结束）之后、第 89 行 `<Footer />` 之前，插入：

```astro
		<!-- FAQ -->
		<section class="faq" id="faq">
			<div class="section-inner">
				<h2 class="section-title">常见问题</h2>
				<dl class="faq-list">
					<div class="faq-item">
						<dt>Q：这个网站主要写什么？</dt>
						<dd>A：专访有疗效、缺传播渠道的青年中医，兼写中医育儿健康科普。</dd>
					</div>
					<div class="faq-item">
						<dt>Q：作者是谁？</dt>
						<dd>A：禹畅，原党报版面负责人，长期采访全国青年中医。</dd>
					</div>
					<div class="faq-item">
						<dt>Q：内容是否持续更新？</dt>
						<dd>A：是，长期更新。</dd>
					</div>
				</dl>
			</div>
		</section>
```

- [ ] **Step 4: 添加 Person JSON-LD**

在 `<head>` 内、第 18 行 `</head>` 之前，`<BaseHead ... />` 之后插入：

```html
		<script type="application/ld+json">
			{
				"@context": "https://schema.org",
				"@type": "Person",
				"name": "\u79b9\u7545",
				"description": "\u957f\u671f\u4e13\u8bbf\u9752\u5e74\u4e2d\u533b\u7684\u72ec\u7acb\u5199\u4f5c\u8005\uff0c\u517c\u5199\u4e2d\u533b\u80b2\u513f\u5065\u5eb7\u79d1\u666e",
				"url": "https://xn--doyx8g.com",
				"knowsAbout": ["\u4e2d\u533b", "\u9752\u5e74\u4e2d\u533b", "\u4e2d\u533b\u80b2\u513f", "\u5065\u5eb7\u79d1\u666e"]
			}
		</script>
```

- [ ] **Step 5: 添加新 section 的 CSS**

在 `<style>` 区块末尾、第 325 行 `</style>` 之前添加：

```css
/* ── 内容领域 ── */
.topics {
	padding: 3.5em 0;
	background: var(--paper);
}

.topic-list {
	margin: 0;
	padding: 0;
	list-style: none;
}

.topic-item {
	margin-bottom: 1.5em;
}

.topic-item:last-child {
	margin-bottom: 0;
}

.topic-item dt {
	font-family: var(--font-serif);
	font-size: 1.1em;
	font-weight: 700;
	color: var(--green-dark);
	margin-bottom: 0.3em;
}

.topic-item dd {
	margin: 0;
	font-size: 0.95em;
	color: rgb(var(--ink-mid));
	line-height: 1.7;
}

/* ── FAQ ── */
.faq {
	padding: 3.5em 0 4em;
	background: var(--paper-dark);
}

.faq-list {
	margin: 0;
	padding: 0;
	list-style: none;
}

.faq-item {
	margin-bottom: 1.8em;
}

.faq-item:last-child {
	margin-bottom: 0;
}

.faq-item dt {
	font-family: var(--font-serif);
	font-size: 1em;
	font-weight: 700;
	color: var(--green-dark);
	margin-bottom: 0.3em;
}

.faq-item dd {
	margin: 0;
	font-size: 0.95em;
	color: rgb(var(--ink-mid));
	line-height: 1.7;
}
```

- [ ] **Step 6: 验证**

```bash
npm run build && npm run astro check
```
Expected: 构建成功，无类型错误。

- [ ] **Step 7: 提交**

```bash
git add src/pages/index.astro
git commit -m "feat: add GEO semantic structure to homepage (topics, FAQ, Person JSON-LD)"
```

---

### Task 3: 文章页注入 Article JSON-LD

**Files:**
- Modify: `src/layouts/BlogPost.astro:11-17`（frontmatter 解构 + head 注入）

**Interfaces:**
- Consumes: `title`, `description`, `pubDate`, `updatedDate` from `Astro.props`（类型为 `CollectionEntry<'blog'>['data']`，其中 `pubDate: Date`，`updatedDate: Date | undefined`）
- Produces: `<script type="application/ld+json">` Article schema

- [ ] **Step 1: 在 BlogPost.astro 的 `<head>` 中注入 Article JSON-LD**

在第 17 行 `</head>` 之前，`<BaseHead ... />` 之后插入：

```astro
		<script type="application/ld+json" set:html={`{
			"@context": "https://schema.org",
			"@type": "Article",
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

`set:html` 是 Astro 内联 script 的正确写法，模板字面量内用 `JSON.stringify` 确保中文和特殊字符安全转义。

- [ ] **Step 2: 验证**

```bash
npm run build && npm run astro check
```
Expected: 构建成功，所有文章页 HTML 中包含 Article JSON-LD。

- [ ] **Step 3: 提交**

```bash
git add src/layouts/BlogPost.astro
git commit -m "feat: add Article JSON-LD structured data to blog post pages"
```

---

### Task 4: 全站构建验证

**Files:**
- 无新改动，验证 Task 1-3 的整体效果。

- [ ] **Step 1: 完整构建**

```bash
npm run build
```
Expected: 构建成功，dist 目录包含首页和所有文章页。

- [ ] **Step 2: 抽检 dist 输出**

验证首页 HTML：
```bash
grep -c 'application/ld+json' dist/index.html
```
Expected: `1`（Person JSON-LD 存在）

```bash
grep -c 'schema.org' dist/index.html
```
Expected: `1`

验证某篇文章页（取第一个）：
```bash
ls dist/blog/
```
Expected: 列出已构建的文章 slug 目录，抽样一个 html 做 same check。

```bash
grep -c 'application/ld+json' dist/blog/*/index.html | head -5
```
Expected: 每行 `1`。

- [ ] **Step 3: 类型检查**

```bash
npm run astro check
```
Expected: 无错误。

- [ ] **Step 4: dev server 目视检查（可选）**

```bash
npm run dev
```
打开 `http://localhost:4321`，确认：
- Hero 文字更新
- "主要内容领域"section 在精选文章和关于作者之间
- "常见问题"section 在全部文章之后、Footer 之前
- 文章页正常渲染

- [ ] **Step 5: 提交（如有残留未提交文件）**

```bash
git status
```
如有未提交的 dist 文件或锁文件变更，不纳入提交（dist/ 在 .gitignore 中）。
