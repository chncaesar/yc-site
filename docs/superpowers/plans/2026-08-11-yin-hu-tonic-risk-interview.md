# 印虎医生谈盲目进补文章发布 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 2026 年 7 月 31 日公众号原文合规改写为印虎医生观点型专访，并完整接入禹畅.com 的文章列表、RSS 与 sitemap。

**Architecture:** 新增一篇 interview collection Markdown 作为唯一内容源，不修改 collection schema 或列表组件。原文舌象图先转存现有阿里云 OSS，再由文章正文通过稳定 HTTPS 地址引用；现有 Astro 内容聚合自动完成首页、专访页、全部文章、RSS 和 sitemap 集成。

**Tech Stack:** Astro 6、TypeScript strict、Markdown content collection、阿里云 OSS、ossutil 2.3.0。

## Global Constraints

- Node.js 必须满足 `>=22.12.0`。
- 文章发布日期必须为 `2026-07-31`。
- 文章只能归入 interview collection，不在 health collection 建立副本。
- 文件名和路由使用清晰拼音 `yin-hu-mangmu-jinbu`。
- 不添加 `doctor` frontmatter，避免“找医生”页面出现重复的印虎条目。
- 医生观点必须明确归属，不把辨证判断或疗效结论写成作者确认的普遍事实。
- 不保留鼓励患者自行判断“好转反应”或自行继续服药的措辞。
- 不出现具体医院、医馆、平台或挂号引导。
- 舌象图只作示意，不能用于自行诊断或选药。
- 不新增依赖，不修改现有设计系统、Article JSON-LD、联系模块或跨账号推广模块。
- 用户没有要求 Git 提交或推送，本计划不执行 commit、push 或部署。

---

### Task 1: 转存舌象示意图

**Files:**
- Temporary: `/var/folders/y3/jr36mnj57pb6vpn_5bk225hh0000gn/T/opencode/yin-hu-tongue-signs.png`
- Upload: `oss://zjc-public/yc-site/interview/yin-hu-mangmu-jinbu/tongue-signs.png`

**Interfaces:**
- Consumes: 公众号原图 HTTPS 地址。
- Produces: 正文使用的稳定公开地址 `https://zjc-public.oss-cn-hangzhou.aliyuncs.com/yc-site/interview/yin-hu-mangmu-jinbu/tongue-signs.png`。

- [ ] **Step 1: 确认临时目录和 OSS 工具可用**

Run: `ls "/var/folders/y3/jr36mnj57pb6vpn_5bk225hh0000gn/T/opencode" && ossutil version`

Expected: 临时目录可访问，ossutil 输出 `2.3.0`。

- [ ] **Step 2: 下载公众号原图**

Run: `curl -L "https://mmbiz.qpic.cn/mmbiz_png/ezMGqkKJgciafT3icEfPyfZTJdYh4ITuvxk2t0eDzqSu0Qtsm3uGT7oOdGibjoEyvPIHkJJub5kEsNDAjnoBZfSWpZoVBqKJ717SLd2xf5IPf0/0?wx_fmt=png&watermark=1" -o "/var/folders/y3/jr36mnj57pb6vpn_5bk225hh0000gn/T/opencode/yin-hu-tongue-signs.png"`

Expected: 命令成功并生成非空 PNG 文件。

- [ ] **Step 3: 检查图片格式和尺寸**

Run: `file "/var/folders/y3/jr36mnj57pb6vpn_5bk225hh0000gn/T/opencode/yin-hu-tongue-signs.png" && sips -g pixelWidth -g pixelHeight "/var/folders/y3/jr36mnj57pb6vpn_5bk225hh0000gn/T/opencode/yin-hu-tongue-signs.png"`

Expected: 文件类型为 PNG，宽高均大于 0。

- [ ] **Step 4: 上传至 OSS**

Run: `ossutil cp "/var/folders/y3/jr36mnj57pb6vpn_5bk225hh0000gn/T/opencode/yin-hu-tongue-signs.png" "oss://zjc-public/yc-site/interview/yin-hu-mangmu-jinbu/tongue-signs.png" --force`

Expected: ossutil 报告一个对象上传成功。

- [ ] **Step 5: 验证公开图片**

Run: `curl -I "https://zjc-public.oss-cn-hangzhou.aliyuncs.com/yc-site/interview/yin-hu-mangmu-jinbu/tongue-signs.png"`

Expected: HTTP 200，Content-Type 为 `image/png`。

---

### Task 2: 新增印虎医生观点型专访

**Files:**
- Create: `src/content/interview/yin-hu-mangmu-jinbu.md`
- Reference: `docs/superpowers/specs/2026-08-11-yin-hu-tonic-risk-interview-design.md`

**Interfaces:**
- Consumes: interview collection 既有字段 `title`、`description`、`pubDate`，以及 Task 1 生成的图片地址。
- Produces: collection id `yin-hu-mangmu-jinbu` 和页面 `/interview/yin-hu-mangmu-jinbu/`。

- [ ] **Step 1: 确认路由尚不存在**

Run: `test ! -e "src/content/interview/yin-hu-mangmu-jinbu.md"`

Expected: 退出码为 0，避免覆盖已有文章。

- [ ] **Step 2: 新建文章 frontmatter**

使用以下唯一元数据：

- `title`: `印虎医生谈盲目进补：看似“虚”，也要先辨清用药风险`
- `description`: `盗汗、腹泻、疲惫就一定是“虚”吗？印虎医生从山阳医派的湿热辨证谈起，提醒读者不要自行进补；服药后出现腹泻、尿色加深等变化，也应及时联系医生评估。`
- `pubDate`: `2026-07-31`
- 不声明 `heroImage` 或 `doctor`

Expected: frontmatter 满足 interview collection schema，description 与现有页面不重复。

- [ ] **Step 3: 按设计规格完成正文**

正文依次覆盖以下内容，具体措辞只在文章文件中维护，避免与计划文档形成第二份内容源：

1. 采访印虎医生时听到的“看似虚，也可能是湿热郁阻”观点。
2. 将盗汗、口苦、睡眠不安、腹痛泄泻等辨证解释明确归属于印虎医生，并反复提醒相似症状可能有不同原因。
3. 插入 Task 1 的舌象图，替代文本为“厚腻、暗红等舌象与正常舌象示意”，图后明确不能看图自诊或自行选药。
4. 将所谓“排邪反应”改写为用药安全提醒：腹泻、尿色加深、出汗或痰液变化不能自动视为好转，应联系开方医生；黄疸、明显乏力、持续恶心呕吐或肝功能异常时及时就医。
5. 依据《中国药物性肝损伤诊治指南（2023年版）》说明中药及其他药物均可能导致药物性肝损伤，风险并非只有“辨证不对”一个原因。
6. 保留山阳医派形成于江南富庶地区、强调“浊邪未除，不忙进补”的历史和临床观点，但不用“为现代人量身定制”“疗效确切”等营销措辞。
7. 结尾强调不自行买补药、不仅凭舌照判断、用药异常及时反馈和就医。
8. 参考资料列出中华医学会肝病学分会药物性肝病学组《中国药物性肝损伤诊治指南（2023年版）》及《中国居民膳食指南（2022）》中关于合理膳食的相关原则；不添加无法核实的研究数字。

Expected: 文章保留原文核心观点和作者声音，同时满足大陆医疗内容合规要求。

- [ ] **Step 4: 对文章执行工程规则检查**

Run: 对 `src/content/interview/yin-hu-mangmu-jinbu.md` 调用 `check-rules`。

Expected: 全部合规；如有违规，修复后重新检查直至通过。

---

### Task 3: 全站内容与 SEO 验证

**Files:**
- Verify: `src/content/interview/yin-hu-mangmu-jinbu.md`
- Generated: `dist/interview/yin-hu-mangmu-jinbu/index.html`
- Generated: `dist/index.html`
- Generated: `dist/interview/index.html`
- Generated: `dist/articles/index.html`
- Generated: `dist/rss.xml`
- Generated: `dist/sitemap.xml`

**Interfaces:**
- Consumes: Task 2 生成的 interview collection entry。
- Produces: 可部署且通过类型、构建、路由、RSS 和 sitemap 验证的静态站点。

- [ ] **Step 1: 运行 Astro 类型与内容校验**

Run: `npm run astro check`

Expected: 0 errors、0 warnings。

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: 构建成功，生成新文章页面并刷新 sitemap。

- [ ] **Step 3: 检查文章及所有自动聚合入口**

Run: `rg -l "yin-hu-mangmu-jinbu" "dist/index.html" "dist/interview/index.html" "dist/articles/index.html" "dist/rss.xml" "dist/sitemap.xml" "dist/interview/yin-hu-mangmu-jinbu/index.html"`

Expected: 六个文件全部匹配新路由。

- [ ] **Step 4: 检查标题、description、图片和合规关键词**

Run: `rg -n "印虎医生谈盲目进补|盗汗、腹泻、疲惫|tongue-signs.png|图片仅作舌象示意|中国药物性肝损伤诊治指南" "dist/interview/yin-hu-mangmu-jinbu/index.html"`

Expected: 五项关键信息均存在，页面只有一个正文标题。

- [ ] **Step 5: 检查医生名录没有重复印虎**

Run: `rg -o "印虎" "dist/doctors/index.html" | wc -l`

Expected: 数量与改动前一致，不因新文章增加医生条目。

- [ ] **Step 6: 启动本地预览并抽检桌面与移动端**

Run: `npm run preview -- --host 127.0.0.1`

Expected: `/interview/yin-hu-mangmu-jinbu/` 返回 200；桌面和 390px 宽移动视口中正文、长图、联系模块与跨账号推广模块无横向溢出。

- [ ] **Step 7: 检查工作区差异**

Run: `git diff --check && git status --short`

Expected: 无空白错误，只出现设计文档、计划文档和新文章等本任务文件；不提交、不推送。
