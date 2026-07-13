# 公众号 Markdown 排版器

一个完全在浏览器本地运行的 Markdown 排版工具，可将顶部 HTML、Markdown 正文和底部 HTML 组合预览并复制到微信公众号编辑器。

## 环境要求

- Node.js 22.13 或更高版本

## 本地开发

```powershell
npm install
npm run dev
```

启动后访问 `http://localhost:5173/`。开发服务器默认监听 `0.0.0.0`，同一局域网中的设备也可以通过本机 IP 访问。

## 生产构建

```powershell
npm run build
npm run preview
```

构建产物位于 `dist/`，可以交给任意静态文件服务器运行。

## 项目结构

```text
app/
  main.tsx       浏览器入口
  page.tsx       编辑器功能
  globals.css    页面样式
public/          静态资源
index.html       HTML 入口
vite.config.ts   Vite 配置
```
