# 医生名录 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新建 `/doctors/` 医生名录页，展示平铺表格（医生 / 城市 / 擅长方向 / 专访链接），同时嵌入多条 Person JSON-LD 提升 GEO 可发现性。

**Architecture:** 在 interview collection schema 中增加可选 `doctor` 字段，12 篇专访文章在 frontmatter 中声明医生数据；`/doctors/index.astro` 用 `getCollection('interview')` 过滤有 `doctor` 字段的文章自动生成表格；导航精简为 文章 / 专访 / 找医生 / 关于 / 联系。

**Tech Stack:** Astro 6, TypeScript, Zod schema, no new dependencies.

## Global Constraints

- 不改动 CSS 变量/设计系统
- 不改动文章正文内容
- 不在 `doctor.city` 或 `doctor.specialties` 中提及具体医馆/医院名称
- 城市不详一律填 `需询问`
- `astro.config.mjs` `site` 不动（等 ICP）
- Node >= 22.12.0，`npm run build && npm run astro check` 验证

---

### Task 1: 扩展 interview schema + 12 篇文章补 frontmatter

**Files:**
- Modify: `src/content.config.ts`
- Modify: 12 篇 `src/content/interview/*.md`

**Interfaces:**
- Produces: interview collection entries 新增可选字段 `data.doctor?: { name: string, city: string, specialties: string[] }`

- [ ] **Step 1: 修改 content.config.ts**

将 interview schema 中 `z.object({...})` 内增加：

```ts
doctor: z.object({
	name: z.string(),
	city: z.string(),
	specialties: z.array(z.string()),
}).optional(),
```

- [ ] **Step 2: 为 12 篇文章补 frontmatter**

每篇文章在 `pubDate` 行后加 `doctor` 字段：

**cai-liangjun-interview.md:**
```yaml
doctor:
  name: '蔡良俊'
  city: '杭州'
  specialties: ['小儿咳嗽', '儿科发烧积食', '皮肤病', '妇科肌瘤']
```

**dai-zeyu-interview.md:**
```yaml
doctor:
  name: '代泽宇'
  city: '杭州'
  specialties: ['针灸', '痛风', '强直性脊柱炎', '腰痛', '脾胃调理']
```

**wang-guoyin-interview.md:**
```yaml
doctor:
  name: '王国印'
  city: '上海'
  specialties: ['青少年抑郁焦虑', '情志病', '失眠', '慢性心力衰竭']
```

**wang-zefeng-interview.md:**
```yaml
doctor:
  name: '王泽峰'
  city: '杭州'
  specialties: ['失眠', '慢病综合调理', '新冠后遗症', '全科中医']
```

**zhang-hanhan-interview.md:**
```yaml
doctor:
  name: '张航瀚'
  city: '杭州'
  specialties: ['柔性整骨', '颈腰椎病', '脊柱相关杂症', '运动损伤']
```

**zhang-bingwei-interview.md:**
```yaml
doctor:
  name: '章炳炜 · 章航'
  city: '杭州'
  specialties: ['中风偏瘫', '脑梗康复', '颈腰椎病', '雷火针']
```

**chen-sheng-interview.md:**
```yaml
doctor:
  name: '陈胜'
  city: '需询问'
  specialties: ['结节肿瘤调理', '慢性病', '失眠焦虑抑郁', '中西医结合']
```

**guo-xiaofei-interview.md:**
```yaml
doctor:
  name: '郭小飞'
  city: '需询问'
  specialties: ['痛症针灸', '不孕调理', '内科杂症']
```

**zhang-chiyu-interview.md:**
```yaml
doctor:
  name: '张驰宇'
  city: '需询问'
  specialties: ['小儿流感咳嗽', '鼻炎腺样体', '推拿正骨', '皮肤病']
```

**cui-shiran-interview.md:**
```yaml
doctor:
  name: '崔诗然'
  city: '需询问'
  specialties: ['鼻炎耳鸣', '失眠郁证', '皮肤病湿疹', '胆结石']
```

**yin-hu-interview.md:**
```yaml
doctor:
  name: '印虎'
  city: '上海'
  specialties: ['痛经子宫腺肌症', '子宫内膜异位症', '甲状腺', '温病']
```

**zou-qi-interview.md:**
```yaml
doctor:
  name: '邹琦'
  city: '杭州'
  specialties: ['感冒发烧腹泻', '皮肤病湿疹', '脾胃调理']
```

注意：`why-write-young-doctors.md` 和 `qihuang-academy-liu-studio.md` 不加 `doctor`。

- [ ] **Step 3: 验证**

```bash
npm run astro check
```
Expected: 0 errors

- [ ] **Step 4: 提交**

```bash
git add src/content.config.ts src/content/interview/
git commit -m "feat: add doctor frontmatter to interview collection schema and 12 articles"
```

---

### Task 2: 新建 `/doctors/index.astro` 表格页

**Files:**
- Create: `src/pages/doctors/index.astro`

**Interfaces:**
- Consumes: `getCollection('interview')` → 过滤 `post.data.doctor` 存在的 entries
- Produces: `/doctors/` 页面

- [ ] **Step 1: 创建页面文件**

完整文件内容见下方代码块。

- [ ] **Step 2: 验证**

```bash
npm run build && npm run astro check
```

- [ ] **Step 3: 提交**

```bash
git add src/pages/doctors/
git commit -m "feat: add /doctors/ directory page with Person JSON-LD array"
```

---

### Task 3: 精简导航 + AGENTS.md

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `AGENTS.md`

- [ ] **Step 1: Header 改为 文章 / 专访 / 找医生 / 关于 / 联系**

移除「科普」「动态」链接。

- [ ] **Step 2: AGENTS.md 补 doctor 字段规范**

- [ ] **Step 3: 验证、提交**

```bash
npm run build && npm run astro check
git add src/components/Header.astro AGENTS.md
git commit -m "feat: simplify nav (remove 科普/动态), add 找医生 entry"
```

---

### Task 4: 全站验证

- [ ] **Step 1:** `npm run build && npm run astro check` — 24 pages, 0 errors
- [ ] **Step 2:** 抽检 dist `/doctors/index.html` 含 ≥12 条 Person JSON-LD
- [ ] **Step 3:** 抽检 dist 含 ≥12 个 `/interview/slug/` 链接
- [ ] **Step 4:** `git push origin main`
