# 搭建微信公众号文章下载代理节点（Cloudflare Worker）

## 背景

[wechat-article-exporter](https://github.com/wechat-article/wechat-article-exporter) 是一款微信公众号文章批量下载工具，支持导出 HTML/Markdown/PDF 等格式，100% 还原原文排版。在线版可直接使用：[down.mptext.top](https://down.mptext.top)。

但公共代理节点有每日额度限制且速度不稳定。搭建私有代理节点可以加速批量下载。

## 前置条件

- Cloudflare 账号（免费即可）：[dash.cloudflare.com](https://dash.cloudflare.com)

## 步骤一：创建 Worker

1. 打开 Cloudflare 控制台 → 左侧「Workers 和 Pages」→ 点击「创建应用程序」

2. 选择「创建 Worker」→ 取个名字（如 `wx-proxy`）→ 点击「部署」

3. 部署后会进入代码编辑页，默认是 `Hello World` 代码。**全部删除，替换为以下代码：**

```js
export default {
  async fetch(request) {
    const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36";

    const PRESETS = {
      mp: { Referer: "https://mp.weixin.qq.com" },
    };

    try {
      const origin = request.headers.get("origin") || "*";
      let targetURL = "";
      let targetMethod = "GET";
      let targetBody = "";
      let targetHeaders = {};

      const method = request.method.toLowerCase();

      if (method === "get") {
        const { searchParams } = new URL(request.url);
        targetURL = decodeURIComponent(searchParams.get("url") || "");
        if (searchParams.has("method")) targetMethod = searchParams.get("method");
        if (searchParams.has("headers")) {
          try {
            targetHeaders = JSON.parse(decodeURIComponent(searchParams.get("headers")));
          } catch (_) {}
        }
        if (searchParams.has("preset")) {
          const preset = decodeURIComponent(searchParams.get("preset"));
          if (preset in PRESETS) Object.assign(targetHeaders, PRESETS[preset]);
        }
      } else if (method === "post") {
        const payload = await request.json();
        targetURL = payload.url || "";
        if (payload.method) targetMethod = payload.method;
        if (payload.body) targetBody = payload.body;
        if (payload.headers) targetHeaders = payload.headers;
        if (payload.preset && payload.preset in PRESETS) {
          Object.assign(targetHeaders, PRESETS[payload.preset]);
        }
      }

      if (!targetURL || !/^https?:\/\//.test(targetURL)) {
        return new Response("URL not found", { status: 400 });
      }

      if (!targetHeaders["User-Agent"]) {
        targetHeaders["User-Agent"] = UA;
      }

      const response = await fetch(targetURL, {
        method: targetMethod,
        body: targetBody || undefined,
        headers: targetHeaders,
      });

      return new Response(response.body, {
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Max-Age": "86400",
          "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
        },
      });
    } catch (err) {
      return new Response(err.message, { status: 400 });
    }
  },
};
```

4. 点击右上角「部署」。访问 Workers 分配的域名（如 `https://wx-proxy.你的用户名.workers.dev`），页面显示 **「URL not found」** 即表示部署成功。

## 步骤二（可选）：绑定自定义域名

Worker 默认的 `*.workers.dev` 域名在国内可能被墙，绑定自定义域名后可直接访问。

### 2.1 准备域名

若没有域名，推荐从 [SpaceShip](https://www.spaceship.com/zh/domain-search) 购买（支持支付宝），选 `.site` 或 `.online` 后缀，首年几块钱。

### 2.2 将域名托管到 Cloudflare

1. Cloudflare 控制台 → 点击「添加域」
2. 输入你购买的域名 → 继续 → 选择 Free 计划
3. Cloudflare 会给出两组 DNS 服务器地址（如 `xxx.ns.cloudflare.com`）
4. 去域名注册商（如 SpaceShip）的 DNS 设置，把 DNS 服务器改为 Cloudflare 提供的地址
5. 等待生效（通常 5-30 分钟）

### 2.3 绑定自定义域

1. Cloudflare 控制台 → Workers 和 Pages → 点击你创建的 Worker
2. 进入「设置」→「触发器」→「自定义域」→ 点击「添加自定义域」
3. 输入一个二级域名，如 `proxy.你的域名.com`
4. Cloudflare 会自动配置 DNS 和 SSL 证书

绑定后即可通过 `https://proxy.你的域名.com` 访问节点。

## 步骤三：安全设置（推荐）

防止你的私有节点被他人滥用。

1. Cloudflare 控制台 → 点击你的域名 → 左侧「安全性」→「WAF」→「自定义规则」
2. 创建规则：
   - **字段**：`Referer`
   - **运算符**：`不包含`
   - **值**：你的网站域名（如 `docs.mptext.top`）
   - **操作**：阻止
3. 部署规则。这样只有你的授权域名发起的请求才会被允许。

## 步骤四：在 wechat-article-exporter 中使用

1. 打开 [down.mptext.top](https://down.mptext.top)
2. 点击右下角「设置」图标
3. 在「代理节点」处填入你的 Worker 地址：`https://proxy.你的域名.com`
4. 保存。此后所有下载请求都会走你的私有节点。

## 注意事项

- Worker 免费版每日 10 万次请求，个人使用绰绰有余
- 不要将节点地址公开分享，避免被滥用
- 若发现流量异常，在 Cloudflare 删除 Worker 重建即可（换地址）
- 代理节点不会收集你的公众号数据，代码完全开源透明
