# 内容重组设计方案

**日期:** 2026-06-22
**目标:** 将平铺的单 collection `blog` 拆分为三个分类 collection，建立 Topic Cluster URL 结构，为 GEO 和历史文章迁移打地基。

---

## 分类体系

| Collection | URL 前缀 | 内容类型 | 现有文章数 |
|------------|---------|----------|-----------|
| `interview` | `/interview/` | 青年中医人物专访 | 14篇 |
| `health` | `/health/` | 健康科普 | 2篇 |
| `events` | `/events/` | 会议记录、行业动态 | 1篇 |

## 导航

`Header.astro` 中 `文章` 链接指向 `/articles/`（三类全部文章的聚合列表页）。

## 首页分区

```
Hero
近期专访卡片（interview 最新3篇）
健康科普 & 动态（health + events 合并最新3篇）
主要内容领域（Topics）
关于作者
FAQ
```

## 文章列表页

三个分类各有独立的 `/interview/`、`/health/`、`/events/` 列表页，模板与现有 `blog/index.astro` 相同。

`/articles/` 聚合页展示三类全部文章，按时间倒序。

## URL 变化

所有文章 URL 从 `/blog/slug/` 变为 `/collection/slug/`。

无公网流量，不做 301 重定向。

## Article JSON-LD URL

`BlogPost.astro` 中的 Article JSON-LD `url` 字段改为动态读取 `Astro.url.pathname`，不再硬编码 `/blog/`。

---

## 改动文件

**删除:**
- `src/content/blog/` — 整个目录（文件移走后删）
- `src/pages/blog/` — 整个目录

**修改:**
- `src/content.config.ts` — 3 个 collection 替换 blog
- `src/pages/index.astro` — 分区展示
- `src/pages/rss.xml.js` — 合并 3 个 collection
- `src/layouts/BlogPost.astro` — Article JSON-LD URL 改为 `Astro.url.pathname`
- `src/components/Header.astro` — `文章` 链接 `/blog` → `/articles`

**新建:**
- `src/pages/articles/index.astro` — 聚合列表页
- `src/pages/interview/[...slug].astro` / `index.astro`
- `src/pages/health/[...slug].astro` / `index.astro`
- `src/pages/events/[...slug].astro` / `index.astro`

## 不改动的部分

- `BaseHead.astro` — 不动
- `Footer.astro` — 不动
- CSS 变量/设计系统 — 不动
- 文章正文 — 不动
- `astro.config.mjs` `site` — 等 ICP 批后统一改

## 实现顺序

1. 修改 `content.config.ts` — 定义 3 个 collection
2. 移动 markdown 文件到新目录
3. 新建 3 个 `[...slug].astro` 路由（每个 collection 一个）
4. 新建 4 个列表页（articles + 3 个分类 index）
5. 修改 `index.astro` 首页分区
6. 修改 `rss.xml.js`
7. 修改 `Header.astro` 导航链接
8. 修改 `BlogPost.astro` JSON-LD URL
9. 删除旧 `blog/` 目录
10. 全站构建验证
