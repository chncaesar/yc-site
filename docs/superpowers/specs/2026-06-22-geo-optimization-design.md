# GEO 优化设计方案

**日期：** 2026-06-22
**目标：** 让 AI（ChatGPT / Gemini / Perplexity）能精准识别"禹畅"作为作者实体和其内容领域，提升被 AI 引用概率。

---

## 定位

禹畅.com 核心定位为"青年中医推介人/医疗内容作者"，实体定义围绕：

- 青年中医专访（明医志）
- 中医育儿与健康科普

不扩展到家庭教育、女性成长、AI 等领域。懒妈熊娃公众号为独立品牌。

---

## 改动文件

| 文件 | 改动性质 |
|------|----------|
| `src/consts.ts` | SITE_TITLE / SITE_DESCRIPTION 文案调整 |
| `src/pages/index.astro` | 语义增密：Hero 文字调整 + Topic Hub section + FAQ section + Person JSON-LD |
| `src/layouts/BlogPost.astro` | 注入 Article JSON-LD（动态读 frontmatter） |
| `src/components/BaseHead.astro` | 不动（现有 author meta、canonical、sitemap link 已够用） |

CSS/样式不动。Header/Footer 不动。文章内容不动。

---

## 首页改动详情

### 1. Hero 文字调整

将 `hero-sub` 改为先声明实体，再说立场。

### 2. 新增「内容领域」section（Topic Hub）

位置：精选文章之后，"关于作者"之前。用 `<section id="topics">` 包裹。

### 3. 新增 FAQ section

位置：全部文章列表之后，Footer 之前。用 `<section id="faq">` + `<dl>/<dt>/<dd>` 包裹。

### 4. Person JSON-LD

在 `<head>` 中注入 schema.org Person 结构化数据。

## 文章页改动详情

### Article JSON-LD（动态生成）

在 `BlogPost.astro` 的 `<head>` 中注入，读取 Astro.props 动态生成 schema.org Article 结构化数据。

---

## consts.ts 文案

```
SITE_TITLE       = "禹畅 · 明医志"
SITE_DESCRIPTION = "专访有疗效的青年中医，兼写中医育儿健康科普。独立写作者禹畅的个人内容网站。"
```

文章页 title 格式保持不变：`{articleTitle} · {SITE_TITLE}`（BaseHead 已有此逻辑）。

---

## 不改动的部分

- `Header.astro` / `Footer.astro` — 不动
- 文章正文内容 — 不动
- CSS 变量和设计系统 — 不动
- `astro.config.mjs` 的 `site` 字段 — 等 ICP 批下来后统一改（AGENTS.md 已有说明）
- `BaseHead.astro` — 现有 `author` meta、canonical、sitemap link 已满足需求

---

## 实现顺序

1. `src/consts.ts` — 改文案
2. `src/pages/index.astro` — 加 section + JSON-LD + Hero 文字
3. `src/layouts/BlogPost.astro` — 加 Article JSON-LD
4. `npm run build && npm run astro check` — 验证
