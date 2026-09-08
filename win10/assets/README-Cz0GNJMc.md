# @file-viewer/ppt

> Professional, browser-native preview for PowerPoint 97–2003 (`.ppt`).

[![npm version](https://img.shields.io/npm/v/%40file-viewer%2Fppt.svg)](https://www.npmjs.com/package/@file-viewer/ppt)
[![format](https://img.shields.io/badge/format-PowerPoint%2097--2003-c43e1c.svg)](#format-scope)
[![license](https://img.shields.io/badge/license-proprietary-334155.svg)](./LICENSE)

[English](#english) · [简体中文](#简体中文)

## English

### A professional viewer for traditional PowerPoint files

`@file-viewer/ppt` is Flyfish's independently developed preview engine for the
PowerPoint 97–2003 binary (`.ppt`) format. It reconstructs slides directly in a
modern browser without Microsoft Office, LibreOffice, browser plug-ins, or a
server-side document conversion service.

The product is designed for document platforms, archives, knowledge systems,
intranets, SaaS applications, and web products that still need dependable
access to traditional PowerPoint files. Its viewport-first runtime is equally
suitable for ordinary presentations and very large decks.

### Product highlights

- **Native `.ppt` understanding** — Reads the classic PowerPoint compound-file,
  persist-record, text, drawing, and picture structures directly.
- **Professional slide reconstruction** — Handles slide size, masters,
  backgrounds, color schemes, text formatting, adjustable OfficeArt shapes,
  fills, gradients, grouped objects, pictures, transforms, layer order, and a
  compatible subset of traditional 3-D effects.
- **Responsive worker pipeline** — Uses a module Worker, WebAssembly, and
  OffscreenCanvas by default in capable browsers, keeping document parsing and
  slide rasterization away from the main UI thread.
- **Large-deck virtualization** — Keeps only the viewport and an overscan window
  actively rendered. Hidden Canvas backing stores are released after a short
  delay instead of accumulating for the entire presentation.
- **Bounded frame cache** — Optionally stores only final, native-watermarked PNG
  frames in an IndexedDB LRU. It has explicit byte, entry, and per-frame limits;
  slide frames are never stored in `localStorage`.
- **Independent CJK font asset** — Loads the CJK fallback font as a separate,
  integrity-verified resource that can use a long-lived browser or CDN cache.
- **Local document processing** — The public runtime does not require documents
  to be uploaded to a conversion service.
- **Straightforward integration** — ESM, TypeScript declarations, no JavaScript
  runtime dependencies, and APIs for both complete-viewer mounting and
  individual-slide rendering.

### Format scope

This package previews PowerPoint 97–2003 binary `.ppt` files. For XML-based
`.pptx` files, use a dedicated PPTX viewer.

### Installation

```bash
npm install @file-viewer/ppt
```

### Quick start: virtualized full presentation

```js
import { createPptViewer } from '@file-viewer/ppt';

const viewer = await createPptViewer({
  worker: 'auto',
  cache: {
    enabled: true,
    maxBytes: 256 * 1024 * 1024,
    maxEntries: 200,
    maxEntryBytes: 32 * 1024 * 1024
  }
});

const response = await fetch('/documents/presentation.ppt');
const mounted = await viewer.mount(
  '#ppt-viewer',
  await response.arrayBuffer(),
  {
    scale: 1,
    pixelRatio: window.devicePixelRatio,
    virtualize: true,
    rootMargin: '150% 0px',
    releaseDelayMs: 1200
  }
);

console.log(viewer.mode); // "worker" or "direct"
console.log(await mounted.cacheStats());

// When this mounted preview is no longer needed:
await mounted.close();
await viewer.close();
```

`worker: 'auto'` is the default. It selects the module Worker path when Worker,
OffscreenCanvas, and URL-based assets are available, and otherwise uses the
compatible direct renderer. Set `worker: true` when worker rendering is a hard
deployment requirement, or `worker: false` for explicit direct mode.

`virtualize: true` is also the default. The viewer creates stable page shells,
renders pages near the viewport, and releases hidden raster backing stores.
In worker mode, when IndexedDB is available, revisiting a released page can
restore its final watermarked PNG before a native rerender is needed. Cache
failure or browser quota eviction never prevents the document from rendering;
direct mode simply rerenders a released page.

For very large files, set `transferInputOwnership: true` when constructing the
viewer to transfer a full input `ArrayBuffer` without an additional main-thread
copy. The supplied buffer is detached, so enable this only when the application
will not read it again.

### Render one slide

```js
import { createPptViewer } from '@file-viewer/ppt';

const viewer = await createPptViewer();
const response = await fetch('/documents/presentation.ppt');
const pptDocument = await viewer.open(await response.arrayBuffer());

const canvas = document.querySelector('canvas');
const result = await pptDocument.renderSlide(0, canvas, { scale: 1.25 });

console.log(pptDocument.slideCount, pptDocument.width, pptDocument.height);
console.log(result.source); // "native" or "indexeddb" in worker mode

await pptDocument.releaseSlide(0);
console.log(await pptDocument.cacheStats());
await pptDocument.close();
await viewer.close();
```

The API is asynchronous in both worker and direct modes, so application code
does not need separate lifecycle branches. Close a mounted viewer, document,
or runtime when it is no longer needed so associated native and graphics
resources can be released promptly.

### Core API

| API | Purpose |
| --- | --- |
| `createPptViewer(options)` / `loadPptViewer(options)` | Loads and verifies the runtime assets; returns worker or direct mode |
| `viewer.mount(target, input, options)` | Mounts a complete, virtualized Canvas presentation |
| `viewer.open(input)` | Asynchronously opens a `.ppt` and returns an opaque document handle |
| `document.renderSlide(index, canvas, options)` | Asynchronously renders or restores one final slide frame |
| `document.releaseSlide(index)` | Releases a slide's active raster resources |
| `document.cacheStats()` / `mounted.cacheStats()` / `viewer.cacheStats()` | Returns current bounded-cache counters |
| `document.close()` / `mounted.close()` / `viewer.close()` | Releases resources at the corresponding lifecycle boundary |
| `getPptPackageManifest()` | Returns package, asset, edition, and capability metadata |

All public APIs include TypeScript declarations. Parsed document models,
records, HTML, SVG, drawing command streams, and unwatermarked frames are not
part of the public API.

### Virtualization and worker frame-cache options

The relevant defaults are:

| Option | Default | Meaning |
| --- | --- | --- |
| `virtualize` | `true` | Render the viewport and overscan window instead of retaining every page |
| `rootMargin` | `150% 0px` | IntersectionObserver overscan around the scroll viewport |
| `releaseDelayMs` | `1200` | Grace period before a hidden page is persisted and released |
| `cache.enabled` | `true` | Use IndexedDB when available |
| `cache.maxBytes` | `256 MiB` | Total final-frame cache budget |
| `cache.maxEntries` | `200` | Maximum cached slide frames |
| `cache.maxEntryBytes` | `32 MiB` | Maximum encoded PNG size for one frame |

The IndexedDB cache operates in worker mode and is a performance layer, not
document storage: it contains only final
watermarked PNG frames, does not retain source `.ppt` bytes, and degrades safely
when private browsing, storage policy, or quota makes IndexedDB unavailable.
Synchronous string-based `localStorage` is intentionally not used for frame
data.

### Runtime assets

Static deployments must preserve the following package assets:

```text
index.mjs
worker.mjs
frame-cache.mjs
ppt-native.wasm
ppt-font-cjk.otf
manifest.json
```

The default locations are resolved relative to `index.mjs`. If a bundler or CDN
moves assets, configure them explicitly:

```js
const viewer = await createPptViewer({
  workerUrl: new URL('/vendor/file-viewer/ppt/0.3.3/worker.mjs', location.origin),
  wasmUrl: new URL('/vendor/file-viewer/ppt/0.3.3/ppt-native.wasm', location.origin),
  fontUrl: new URL('/vendor/file-viewer/ppt/0.3.3/ppt-font-cjk.otf', location.origin)
});
```

For the widest browser compatibility, serve `worker.mjs` and
`frame-cache.mjs` from the application origin. A separate asset origin for the
WASM or font must provide CORS permission and be allowed by `connect-src`.

`ppt-font-cjk.otf` is a renderer resource, not a CSS `@font-face` dependency.
It is fetched and verified independently from the smaller WASM engine, so a
browser or CDN can reuse the font response across presentations and application
visits.

### MIME, cache, and CSP configuration

Use these response types:

| Extension | `Content-Type` |
| --- | --- |
| `.mjs` | `text/javascript; charset=utf-8` |
| `.wasm` | `application/wasm` |
| `.otf` | `font/otf` |
| `.ppt` | `application/vnd.ms-powerpoint` |

Place assets under a versioned or content-addressed path before serving them
with a long immutable cache lifetime:

```http
Cache-Control: public, max-age=31536000, immutable
```

Do not apply `immutable` to an unversioned path that may later serve different
bytes. The runtime verifies the declared size and SHA-256 of both
`ppt-native.wasm` and `ppt-font-cjk.otf` before use.

A same-origin baseline CSP is:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  worker-src 'self';
  connect-src 'self';
  font-src 'self';
  img-src 'self' blob:;
  style-src 'self' 'unsafe-inline';
```

Extend `connect-src` for approved WASM/font CDNs. Some browsers require
`'wasm-unsafe-eval'` to compile WebAssembly. The default worker architecture
does not require `SharedArrayBuffer`, cross-origin isolation, or a blob Worker.

### Browser compatibility

- A current browser with ES modules, WebAssembly, Web Crypto, `fetch`, and
  Canvas 2D is required.
- Worker mode additionally requires module Workers and OffscreenCanvas canvas
  transfer. `worker: 'auto'` falls back to direct mode when these capabilities
  are unavailable.
- Virtual scrolling uses IntersectionObserver. When it is unavailable, the
  viewer remains functional and renders through its compatibility path.
- IndexedDB is optional. A disabled or unavailable cache affects revisit speed,
  not rendering correctness.

Traditional PowerPoint files may contain macros, ActiveX controls, OLE objects,
linked media, or host-specific behaviors that browsers cannot execute. These
features are treated as non-executable preview content. Font substitution may
be used when a document font is not available to the viewer.

### Editions and licensing

| Edition | Permitted use | Watermark | Origin |
| --- | --- | --- | --- |
| Public npm edition | Any lawful personal, organizational, commercial, production, SaaS, hosted, or customer-facing use | Mandatory `Flyfish Viewer` on every slide | Any normal HTTP/HTTPS origin |
| Watermark-free edition | Uses covered by a separate written authorization | Watermark-free build according to the purchased agreement | According to the commercial agreement |

The unmodified public runtime can be bundled, self-hosted, and redistributed as
an integrated dependency, including File Viewer Full, CDN/IIFE, Docker, offline,
copy-assets, and GitHub Release distributions. A paid authorization is required
only to remove, replace, hide, or weaken the required watermark, or to receive a
separate watermark-free build or source delivery.

The public npm edition is proprietary software and is **not licensed under
Apache-2.0**. Removing, hiding, covering, replacing, or bypassing the required
watermark is prohibited. See [LICENSE](./LICENSE) for the binding terms.

Purchase watermark-free commercial authorization from the
[Flyfish Shop](https://dev.flyfish.group/shop).

### Product links

- [Documentation](https://officejs-doc.pages.dev)
- [Commercial licensing](https://dev.flyfish.group/shop)
- [Issue tracker](https://github.com/flyfish-dev/office-preview-js/issues)

## 简体中文

### 专业传统 PPT 浏览器预览引擎

`@file-viewer/ppt` 是 Flyfish 纯自研的 PowerPoint 97–2003 二进制 `.ppt`
专业预览引擎。它直接理解传统 PPT 文件结构，并在现代浏览器中重建幻灯片，无需
安装 Microsoft Office、LibreOffice、浏览器插件，也不依赖服务端格式转换。

产品适用于文件预览平台、档案与知识管理系统、企业内网、SaaS 产品，以及仍需
稳定支持传统 PowerPoint 文档的 Web 应用。面向视口的运行架构既适合普通文档，
也适合包含大量页面的演示文稿。

### 产品特点

- **原生理解 `.ppt`**：直接读取复合文件、持久化记录、文字、绘图和图片结构。
- **专业幻灯片还原**：支持页面尺寸、母版、背景、配色、文字格式、可调节
  OfficeArt 形状、填充、渐变、组合对象、图片、旋转变换、图层顺序，以及兼容的
  传统 3D 效果子集。
- **响应式 Worker 链路**：浏览器能力允许时，默认通过 Module Worker、
  WebAssembly 与 OffscreenCanvas 完成解析和光栅化，避免占用主 UI 线程。
- **大文档虚拟滚动**：仅主动渲染视口和预加载区页面；不可见页面延迟释放 Canvas
  图形缓冲，不随总页数持续堆积。
- **有界页面缓存**：可将最终、带原生强制水印的 PNG 页面保存到 IndexedDB LRU，
  并设置总容量、条目数和单页容量上限；页面数据明确不使用 `localStorage`。
- **独立 CJK 字体资源**：CJK 回退字体与 WASM 引擎分开加载和完整性校验，可使用
  浏览器或 CDN 长期缓存，减少重复下载和引擎体积。
- **文档本地处理**：公网运行时不要求将文档上传到第三方转换服务。
- **易于集成**：提供 ESM、TypeScript 类型且无 JavaScript 运行时依赖，既可挂载
  完整预览器，也可按需渲染指定页。

### 格式范围

本包专门预览 PowerPoint 97–2003 二进制 `.ppt` 文件。XML 格式的 `.pptx`
应使用专用 PPTX 预览器。

### 安装

```bash
npm install @file-viewer/ppt
```

### 快速开始：虚拟化完整预览

```js
import { createPptViewer } from '@file-viewer/ppt';

const viewer = await createPptViewer({
  worker: 'auto',
  cache: {
    enabled: true,
    maxBytes: 256 * 1024 * 1024,
    maxEntries: 200,
    maxEntryBytes: 32 * 1024 * 1024
  }
});

const response = await fetch('/documents/presentation.ppt');
const mounted = await viewer.mount(
  '#ppt-viewer',
  await response.arrayBuffer(),
  {
    scale: 1,
    pixelRatio: window.devicePixelRatio,
    virtualize: true,
    rootMargin: '150% 0px',
    releaseDelayMs: 1200
  }
);

console.log(viewer.mode); // "worker" 或 "direct"
console.log(await mounted.cacheStats());

// 预览不再使用时：
await mounted.close();
await viewer.close();
```

`worker: 'auto'` 和 `virtualize: true` 均为默认值。支持 Module Worker 与
OffscreenCanvas 的浏览器会把解析与渲染放到 Worker；否则自动使用兼容的直接
渲染模式。完整预览会创建稳定的页面容器，仅渲染视口附近内容，并在页面离开
预加载区后释放其光栅资源。

IndexedDB 可用时，再次浏览已释放页面可优先恢复最终水印 PNG。浏览器禁用
IndexedDB、隐私模式限制存储或缓存被配额机制清理时，不影响原生重新渲染。该
IndexedDB 缓存用于 Worker 模式；直接模式会在页面再次进入视口时重新渲染。

超大文件可在创建 viewer 时设置 `transferInputOwnership: true`，把完整
`ArrayBuffer` 的所有权直接转移给 Worker，避免主线程额外复制。该缓冲区随后会
被 detach，仅应在业务不再读取原缓冲区时启用。

### 单页渲染与异步生命周期

```js
const pptDocument = await viewer.open(await response.arrayBuffer());
const canvas = document.querySelector('canvas');

const result = await pptDocument.renderSlide(0, canvas, { scale: 1.25 });
console.log(result.source); // Worker 模式为 "native" 或 "indexeddb"

await pptDocument.releaseSlide(0);
console.log(await pptDocument.cacheStats());
await pptDocument.close();
await viewer.close();
```

Worker 与直接模式采用相同的异步 API。文档、完整挂载预览或运行时不再使用时，
请 `await close()`，以便及时释放原生内存、Worker 和图形资源。

### 核心 API

| API | 用途 |
| --- | --- |
| `createPptViewer(options)` / `loadPptViewer(options)` | 加载并校验运行资源，返回 Worker 或直接模式 |
| `viewer.mount(target, input, options)` | 挂载完整、支持虚拟滚动的 Canvas 预览 |
| `viewer.open(input)` | 异步打开 `.ppt` 并返回不透明文档句柄 |
| `document.renderSlide(index, canvas, options)` | 异步渲染或恢复指定页最终画面 |
| `document.releaseSlide(index)` | 释放指定页当前光栅资源 |
| `cacheStats()` | 在文档、挂载对象或运行时级别读取缓存统计 |
| `close()` | 在对应生命周期边界释放资源 |
| `getPptPackageManifest()` | 返回包、资源、版本和能力信息 |

所有公开 API 均提供 TypeScript 类型。解析后的文档模型、记录、HTML、SVG、
绘图指令流和无水印画面均不属于公开 API。

### 虚拟滚动与页面缓存

默认仅保留视口及 `150% 0px` 预加载区；页面离开该区域 1200ms 后会被缓存并
释放。IndexedDB LRU 默认总容量上限为 256MiB、最多 200 页、单页编码 PNG
最多 32MiB，均可通过 `cache` 选项调整。

IndexedDB 缓存用于 Worker 模式，并且只是性能加速层；它只保存最终水印 PNG，
不保存源 `.ppt` 文件或中间文档
数据；不可用或被浏览器清理时会安全退化为重新渲染。同步、字符串化且容量有限的
`localStorage` 不用于页面缓存。

### 静态资源与部署

静态部署需完整保留以下资源：

```text
index.mjs
worker.mjs
frame-cache.mjs
ppt-native.wasm
ppt-font-cjk.otf
manifest.json
```

默认地址相对 `index.mjs` 解析。使用打包工具或 CDN 改变目录时，请通过
`workerUrl`、`wasmUrl`、`fontUrl` 指定实际地址。为获得最广泛的浏览器兼容性，
建议 `worker.mjs` 与 `frame-cache.mjs` 保持同源；WASM 或字体使用独立 CDN
时，需要正确配置 CORS 和 `connect-src`。

推荐 MIME：`.mjs` 使用 `text/javascript; charset=utf-8`，`.wasm` 使用
`application/wasm`，`.otf` 使用 `font/otf`，`.ppt` 使用
`application/vnd.ms-powerpoint`。

将资源发布在版本化或内容寻址目录（如 `/vendor/file-viewer/ppt/0.3.3/`）后，
可配置：

```http
Cache-Control: public, max-age=31536000, immutable
```

不要为可能替换内容的非版本化地址设置 `immutable`。`ppt-font-cjk.otf` 是渲染器
资源而不是 CSS `@font-face` 字体；它会独立加载和校验，因此可在不同 PPT 文档及
多次访问之间复用浏览器/CDN 缓存。

同源部署的基础 CSP 需要允许包模块、Module Worker、资源请求和 WebAssembly；
部分浏览器要求在 `script-src` 中加入 `'wasm-unsafe-eval'`。若字体或 WASM 使用
独立 CDN，还需将该域名加入 `connect-src`。默认 Worker 架构不要求
`SharedArrayBuffer`、跨域隔离或 Blob Worker。

### 浏览器兼容性

- 基础要求：ES Modules、WebAssembly、Web Crypto、`fetch` 和 Canvas 2D。
- Worker 模式还需要 Module Worker 与 OffscreenCanvas Canvas 转移能力；
  `worker: 'auto'` 会在不支持时回退到直接模式。
- 虚拟滚动使用 IntersectionObserver；不可用时预览器仍会通过兼容路径工作。
- IndexedDB 是可选加速能力，不可用只影响页面再次访问速度，不影响渲染正确性。

传统 PPT 可能包含宏、ActiveX、OLE、链接媒体或依赖桌面宿主的行为，浏览器无法
执行这些能力；预览器会把它们作为不可执行内容处理。原始字体不可用时可能使用
兼容字体替代。

### 版本与授权

| 版本 | 允许用途 | 水印 | Origin |
| --- | --- | --- | --- |
| 公网 npm 版 | 任何合法的个人、组织、商业、生产、SaaS、内网或客户项目用途 | 每页强制显示 `Flyfish Viewer` | 任意正常 HTTP/HTTPS origin |
| 无水印版 | 书面商业授权覆盖的用途 | 按协议提供无水印构建 | 按商业协议执行 |

未修改的公网运行时可以作为应用依赖打包、自托管和再分发，包括 File Viewer Full、
CDN/IIFE、Docker、离线包、copy-assets 和 GitHub Release。只有移除、替换、隐藏或
弱化强制水印，或取得单独的无水印构建/源码交付时，才需要书面商业授权。

公网 npm 版是专有软件，**不适用 Apache-2.0**。禁止删除、隐藏、遮挡、替换或
绕过强制水印。具有法律约束力的完整条款见 [LICENSE](./LICENSE)。

无水印商业授权请前往 [Flyfish 商店](https://dev.flyfish.group/shop)购买。

### 产品链接

- [产品文档](https://officejs-doc.pages.dev)
- [无水印商业授权](https://dev.flyfish.group/shop)
- [问题反馈](https://github.com/flyfish-dev/office-preview-js/issues)
