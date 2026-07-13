import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // 使用相对路径生成静态资源 URL，兼容 GitHub Pages 的仓库子路径。
  base: "./",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
  },
  preview: {
    host: "0.0.0.0",
  },
});
