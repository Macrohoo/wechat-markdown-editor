# 微信公众号 Markdown 排版器

[![Deploy to GitHub Pages](https://github.com/Macrohoo/wechat-markdown-editor/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Macrohoo/wechat-markdown-editor/actions/workflows/deploy-pages.yml)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

一个面向微信公众号创作者的开源 Markdown 排版工具。直接在浏览器中编写 Markdown、选择排版主题并实时预览，完成后可将带有内联样式的富文本复制到微信公众号编辑器。

项目不需要后端服务，输入内容仅在当前浏览器中处理，不会上传到服务器。

## 在线体验

<https://macrohoo.github.io/wechat-markdown-editor/>

## 功能特性

- **Markdown 实时预览**：输入内容后即时生成接近公众号阅读宽度的预览。
- **双向滚动定位**：滚动 Markdown 编辑区或公众号预览时，另一侧自动居中到对应内容位置。
- **多套排版主题**：内置简洁、杂志、技术和荧光资讯四种风格。
- **快捷格式工具**：支持标题、粗体、斜体、引用、列表、链接和行内代码。
- **自定义 HTML 片段**：可在正文前后添加经过清理和样式内联的 HTML。
- **HTML 模板导入**：可将内置的顶部装饰和底部关注提示追加到自定义 HTML。
- **荧光资讯标题**：使用独立标题编辑区，按换行生成多段顶部标题。
- **一键复制富文本**：将生成结果以 HTML 和纯文本格式写入剪贴板，可直接粘贴到公众号编辑器。
- **本地安全处理**：Markdown 解析、HTML 清理和样式转换全部在浏览器内完成。
- **响应式界面**：支持桌面端和移动端浏览器使用。
- **自动部署**：推送到 `main` 分支后由 GitHub Actions 自动构建并发布到 GitHub Pages。

> [!NOTE]
> 微信公众号编辑器可能过滤复杂 CSS、外部资源或本地图片。正式发布前，请务必使用公众号后台的手机预览检查最终效果。

## 使用方法

1. 在 **Markdown 正文**区域编写或粘贴内容。
2. 根据文章类型选择合适的排版主题。
3. 如有需要，在顶部或底部 HTML 区域补充固定内容。
4. 在右侧预览区检查排版效果。
5. 点击 **复制到公众号**，然后粘贴到微信公众号编辑器。

建议使用最新版 Chrome、Edge 或其他 Chromium 内核浏览器，以获得更稳定的富文本剪贴板支持。

## 本地开发

### 环境要求

- Node.js 22.13 或更高版本
- Yarn 1.x

### 启动项目

```bash
git clone https://github.com/Macrohoo/wechat-markdown-editor.git
cd wechat-markdown-editor
yarn install --frozen-lockfile
yarn dev
```

启动后访问 <http://localhost:5173/>。开发服务器默认监听 `0.0.0.0`，同一局域网中的设备也可以通过本机 IP 访问。

### 生产构建

```bash
yarn build
yarn preview
```

构建产物位于 `dist/`，可以部署到任意静态文件托管服务。

## 技术栈

- [React](https://react.dev/)：界面与交互
- [TypeScript](https://www.typescriptlang.org/)：类型安全
- [Vite](https://vite.dev/)：开发服务器与生产构建
- [marked](https://marked.js.org/)：Markdown 解析
- [DOMPurify](https://github.com/cure53/DOMPurify)：HTML 清理
- [Juice](https://github.com/Automattic/juice)：CSS 样式内联

## 项目结构

```text
.
├── .github/workflows/       # GitHub Actions 工作流
├── app/
│   ├── globals.css          # 应用界面样式
│   ├── main.tsx             # React 入口
│   └── page.tsx             # 编辑器、主题与复制逻辑
├── public/                  # 静态资源
├── index.html               # HTML 入口
├── package.json             # 依赖与脚本
├── tsconfig.json            # TypeScript 配置
└── vite.config.ts           # Vite 配置
```

## 参与贡献

欢迎任何形式的贡献，包括问题反馈、功能建议、文档改进、主题设计和代码提交。

对于错误报告或功能建议，请先创建 [Issue](https://github.com/Macrohoo/wechat-markdown-editor/issues)，说明使用场景、期望结果和可复现步骤。涉及较大范围的功能或架构调整时，建议先在 Issue 中讨论方案，避免重复工作。

提交代码的推荐流程：

1. Fork 本仓库并克隆到本地。
2. 从最新的 `main` 创建功能分支，例如 `feature/new-theme` 或 `fix/clipboard-error`。
3. 完成修改，并确保 `yarn build` 可以通过。
4. 提交清晰、聚焦的 commit；一个 Pull Request 尽量只解决一个问题。
5. 推送分支并创建 [Pull Request](https://github.com/Macrohoo/wechat-markdown-editor/pulls)。
6. 在 Pull Request 中说明修改背景、实现方式和验证结果；涉及界面变化时请附上截图。

项目维护者会审核 Pull Request、提出必要的修改建议，并在确认代码质量和项目方向一致后合并。参与贡献即表示你愿意以开放、友善和尊重的方式与社区协作。

每个指向 `main` 的 Pull Request 都会自动运行依赖安装和生产构建检查。请确保 **PR build** 通过后再请求合并。

### 当前适合贡献的方向

- 新增高质量的公众号排版主题
- 提升不同浏览器和微信公众号编辑器的兼容性
- 改进图片、表格和代码块的处理体验
- 增加自动化测试与无障碍支持
- 完善文档、示例和国际化支持

### 维护者合并流程

贡献者提交指向 `main` 的 Pull Request 后，[PR checks](./.github/workflows/pr-checks.yml) 会自动检出代码、安装锁定依赖并执行 `yarn build`。维护者不需要手动触发构建，但仍需审核代码逻辑和实际功能；绿色的 **PR build** 只表示类型检查与生产构建成功，不代表功能一定正确。

推荐按以下顺序处理 Pull Request：

1. 查看修改内容、提交说明和界面截图。
2. 等待 **PR build** 完成；首次贡献者的工作流可能需要维护者点击 **Approve and run workflows**。
3. 对重要功能进行本地验证，确认没有安全风险或明显回归。
4. 如需调整，使用评论或 **Request changes** 反馈。
5. 代码审核通过且 **PR build** 为绿色后，合并到 `main`。
6. 合并会触发 GitHub Pages 工作流，部署完成后检查线上页面。

为了避免误合并构建失败的代码，可以在第一个 Pull Request 成功运行 **PR build** 后，为 `main` 配置一次仓库 Ruleset：

1. 进入 **Settings → Rules → Rulesets → New branch ruleset**。
2. 将 **Enforcement status** 设置为 **Active**。
3. 在 **Target branches** 中选择 **Default branch**。
4. 开启 **Require a pull request before merging**。
5. 开启 **Require status checks to pass**，添加状态检查 **PR build**。
6. 开启 **Require conversation resolution before merging**。

配置后，只要 **PR build** 未完成或执行失败，GitHub 就会阻止该 Pull Request 合并。Ruleset 只需配置一次，之后会自动应用到所有指向 `main` 的 Pull Request。

## GitHub Pages 部署

仓库通过 [deploy-pages.yml](./.github/workflows/deploy-pages.yml) 自动部署。每次代码推送到 `main` 分支时，GitHub Actions 会安装依赖、执行生产构建，并将 `dist/` 发布到 GitHub Pages。

维护者也可以在仓库的 **Actions** 页面手动触发部署。

## 许可证

本项目基于 [MIT License](./LICENSE) 开源。你可以自由使用、复制、修改、合并、发布和分发本项目，但需要保留原始版权声明和许可证文本。

## 维护者

项目由 [Macrohoo](https://github.com/Macrohoo) 发起并维护。欢迎通过 Issue 和 Pull Request 一起改进这个工具。
