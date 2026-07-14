import { marked } from "marked";
import { useCallback, useEffect, useRef, useState } from "react";

const SAMPLE_MARKDOWN = `# 把复杂的事，说清楚

真正好的内容，不需要堆砌术语。它应该让读者在三分钟内明白：**发生了什么、为什么重要，以及下一步做什么。**

> 写作不是把知道的都写下来，而是替读者安排好理解的顺序。

## 一个简单的方法

1. 先给结论，不让读者猜。
2. 再给证据，说明判断从哪里来。
3. 最后给行动，让文章产生结果。

### 写作检查清单

- 每一段只表达一个意思
- 标题能够独立传达信息
- 删除没有提供新信息的句子

\`\`\`js
const clearWriting = idea => explain(idea, { simple: true })
\`\`\`

---

愿每一次表达，都能抵达真正需要它的人。`;

type ThemeName = "clean" | "editorial" | "tech" | "lime";

type MarkdownAction = "heading" | "bold" | "italic" | "quote" | "unordered-list" | "ordered-list" | "link" | "code";

const MARKDOWN_TOOLS: { action: MarkdownAction; label: string; title: string }[] = [
  { action: "heading", label: "H2", title: "二级标题" },
  { action: "bold", label: "B", title: "粗体" },
  { action: "italic", label: "I", title: "斜体" },
  { action: "quote", label: "❝", title: "引用" },
  { action: "unordered-list", label: "• 列表", title: "无序列表" },
  { action: "ordered-list", label: "1. 列表", title: "有序列表" },
  { action: "link", label: "链接", title: "插入链接" },
  { action: "code", label: "</>", title: "行内代码" },
];

const THEMES: Record<ThemeName, { label: string; color: string; css: string }> = {
  clean: {
    label: "简洁",
    color: "#22a06b",
    css: `
      #wechat-content { color:#2f3437; font-size:16px; line-height:1.85; letter-spacing:.02em; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif; }
      #wechat-content h1 { margin:0 0 28px; color:#17221c; font-size:30px; line-height:1.35; font-weight:750; letter-spacing:-.02em; }
      #wechat-content h2 { margin:36px 0 16px; padding-left:12px; border-left:4px solid #22a06b; color:#17221c; font-size:22px; line-height:1.4; font-weight:700; }
      #wechat-content h3 { margin:28px 0 12px; color:#1d6f4d; font-size:18px; line-height:1.5; font-weight:700; }
      #wechat-content p { margin:16px 0; }
      #wechat-content strong { color:#16734d; font-weight:700; }
      #wechat-content blockquote { margin:24px 0; padding:16px 18px; border-left:3px solid #22a06b; background:#f2f8f5; color:#4d5c54; }
      #wechat-content blockquote p { margin:0; }
      #wechat-content ul, #wechat-content ol { margin:16px 0; padding-left:26px; }
      #wechat-content ul { list-style-type:disc; }
      #wechat-content ol { list-style-type:decimal; }
      #wechat-content li { margin:8px 0; }
      #wechat-content code { padding:2px 6px; border-radius:4px; background:#eef3f0; color:#16734d; font-family:Menlo,Consolas,monospace; font-size:14px; }
      #wechat-content pre { margin:22px 0; padding:18px; overflow:auto; border-radius:8px; background:#17221c; color:#eaf5ef; line-height:1.65; }
      #wechat-content pre code { padding:0; background:transparent; color:inherit; }
      #wechat-content hr { margin:36px auto; width:48px; border:0; border-top:3px solid #22a06b; }
      #wechat-content a { color:#1d7f58; text-decoration:none; border-bottom:1px solid #9bd2bb; }
      #wechat-content img { display:block; max-width:100%; height:auto; margin:24px auto; }
    `,
  },
  editorial: {
    label: "杂志",
    color: "#c75b39",
    css: `
      #wechat-content { color:#352f2b; font-size:17px; line-height:1.95; letter-spacing:.04em; font-family:Georgia,"Songti SC","SimSun",serif; }
      #wechat-content h1 { margin:0 0 30px; color:#201b18; font-size:32px; line-height:1.35; font-weight:700; text-align:center; }
      #wechat-content h1:after { content:""; display:block; width:36px; margin:18px auto 0; border-top:2px solid #c75b39; }
      #wechat-content h2 { margin:40px 0 18px; color:#9c4026; font-size:23px; line-height:1.45; font-weight:700; }
      #wechat-content h3 { margin:30px 0 14px; color:#9c4026; font-size:19px; font-weight:700; }
      #wechat-content p { margin:18px 0; }
      #wechat-content strong { color:#9c4026; font-weight:700; }
      #wechat-content blockquote { margin:28px 0; padding:18px 22px; border:0; background:#f8f1eb; color:#6e5548; font-style:italic; }
      #wechat-content blockquote p { margin:0; }
      #wechat-content ul, #wechat-content ol { margin:18px 0; padding-left:28px; }
      #wechat-content ul { list-style-type:disc; }
      #wechat-content ol { list-style-type:decimal; }
      #wechat-content li { margin:9px 0; }
      #wechat-content code { padding:2px 6px; background:#f4ebe5; color:#9c4026; font-family:Menlo,Consolas,monospace; font-size:14px; }
      #wechat-content pre { margin:24px 0; padding:19px; overflow:auto; background:#2c2521; color:#f6ece5; line-height:1.65; }
      #wechat-content pre code { padding:0; background:transparent; color:inherit; }
      #wechat-content hr { margin:40px auto; width:70%; border:0; border-top:1px solid #d9c4b8; }
      #wechat-content a { color:#a9472a; text-decoration:none; border-bottom:1px solid #d9a28f; }
      #wechat-content img { display:block; max-width:100%; height:auto; margin:28px auto; }
    `,
  },
  tech: {
    label: "技术",
    color: "#4f67d8",
    css: `
      #wechat-content { color:#273043; font-size:16px; line-height:1.8; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif; }
      #wechat-content h1 { margin:0 0 28px; color:#17203a; font-size:30px; line-height:1.35; font-weight:800; }
      #wechat-content h2 { margin:36px 0 16px; padding:8px 14px; border-radius:6px; background:#eef1ff; color:#3049ba; font-size:21px; line-height:1.4; font-weight:750; }
      #wechat-content h3 { margin:28px 0 12px; color:#4057c7; font-size:18px; font-weight:700; }
      #wechat-content p { margin:16px 0; }
      #wechat-content strong { color:#3049ba; font-weight:750; }
      #wechat-content blockquote { margin:24px 0; padding:16px 18px; border-left:4px solid #7184df; background:#f4f6ff; color:#4e5874; }
      #wechat-content blockquote p { margin:0; }
      #wechat-content ul, #wechat-content ol { margin:16px 0; padding-left:26px; }
      #wechat-content ul { list-style-type:disc; }
      #wechat-content ol { list-style-type:decimal; }
      #wechat-content li { margin:8px 0; }
      #wechat-content code { padding:2px 6px; border-radius:4px; background:#edf0fa; color:#3049ba; font-family:Menlo,Consolas,monospace; font-size:14px; }
      #wechat-content pre { margin:22px 0; padding:18px; overflow:auto; border-radius:8px; background:#182036; color:#edf1ff; line-height:1.65; }
      #wechat-content pre code { padding:0; background:transparent; color:inherit; }
      #wechat-content hr { margin:36px 0; border:0; border-top:1px dashed #aeb8e8; }
      #wechat-content a { color:#4057c7; text-decoration:none; border-bottom:1px solid #aeb8e8; }
      #wechat-content img { display:block; max-width:100%; height:auto; margin:24px auto; }
    `,
  },
  lime: {
    label: "荧光资讯",
    color: "#C2F54A",
    css: `
      #wechat-content .lime-body { color:#111111; font-size:16px; line-height:1.82; letter-spacing:.035em; font-family:Optima-Regular,Optima,PingFangSC-light,PingFangTC-light,"PingFang SC",Cambria,Cochin,Georgia,Times,"Times New Roman",serif; }
      #wechat-content .lime-body h1 { margin:0 0 30px; padding-bottom:24px; border-bottom:1px dashed #3f3f3f; color:#050505; font-size:29px; line-height:1.38; font-weight:800; letter-spacing:-.025em; }
      #wechat-content .lime-body h2 { margin:34px 0 14px; padding:0 0 7px; display:flex; align-items:center; gap:12px; border-bottom:1px dashed #C2F54A; color:#111111; font-size:19px; line-height:1.45; font-weight:760; }
      #wechat-content .lime-body h2 .section-number { flex:0 0 auto; padding:5px 8px; background:#C2F54A; color:#111111; font-size:19px; line-height:1.15; font-weight:600; letter-spacing:.02em; }
      #wechat-content .lime-body h2 .section-title { padding-right:10px; background:#ffffff; }
      #wechat-content .lime-body h3 { margin:26px 0 13px; padding:7px 12px; border-left:4px solid #C2F54A; background:linear-gradient(90deg,#f0ffd0 0%,rgba(240,255,208,0) 88%); color:#252c20; font-size:17px; line-height:1.55; font-weight:650; letter-spacing:.04em; }
      #wechat-content .lime-body p { margin:13px 0; text-align:justify; }
      #wechat-content .lime-body strong { padding:0 2px; background:linear-gradient(transparent 62%, #C2F54A 62%); color:#080808; font-weight:750; }
      #wechat-content .lime-body blockquote { margin:28px 0 20px; padding:36px 18px 17px; position:relative; border:1px dashed #C2F54A; background:#f8ffe9; color:#66705d; font-size:14px; line-height:1.8; }
      #wechat-content .lime-body blockquote:before { content:"★"; position:absolute; top:-1px; left:-1px; padding:5px 12px; background:#C2F54A; color:#111111; font-size:15px; line-height:1.4; font-style:normal; font-weight:750; }
      #wechat-content .lime-body blockquote p { margin:0; }
      #wechat-content .lime-body ul, #wechat-content .lime-body ol { margin:15px 0; padding-left:27px; }
      #wechat-content .lime-body ul { list-style-type:disc; }
      #wechat-content .lime-body ol { list-style-type:decimal; }
      #wechat-content .lime-body li { margin:7px 0; }
      #wechat-content .lime-body li::marker { color:#88b51f; font-weight:700; }
      #wechat-content .lime-body code { padding:2px 6px; border:1px solid #d7efb4; background:#f5ffe7; color:#355d00; font-family:Menlo,Consolas,monospace; font-size:14px; }
      #wechat-content .lime-body pre { margin:22px 0; padding:18px; overflow:auto; border-left:5px solid #C2F54A; background:#10130d; color:#efffd7; line-height:1.65; }
      #wechat-content .lime-body pre code { padding:0; border:0; background:transparent; color:inherit; }
      #wechat-content .lime-body hr { margin:34px 0; height:12px; border:0; border-top:1px dashed #3f3f3f; }
      #wechat-content .lime-body a { color:#587a08; text-decoration:none; border-bottom:1px solid #C2F54A; font-weight:650; }
      #wechat-content .lime-body img { display:block; max-width:100%; height:auto; margin:22px auto 8px; }
      #wechat-content .lime-body img + em { display:block; margin:0 0 22px; color:#555555; font-size:12px; font-style:normal; }
    `,
  },
};

marked.setOptions({ gfm: true, breaks: true });

async function renderMarkdown(markdown: string) {
  return sanitizeHtmlFragment(marked.parse(markdown) as string);
}

async function sanitizeHtmlFragment(html: string) {
  const { default: DOMPurify } = await import("dompurify");
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["style"],
  });
}

async function renderHtmlFragment(html: string) {
  if (!html.trim()) return "";

  const { default: DOMPurify } = await import("dompurify");
  const { default: juice } = await import("juice");
  const sanitizedWithStyles = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["style"],
  });
  const inlined = juice(`<section data-html-fragment-root>${sanitizedWithStyles}</section>`, {
    inlinePseudoElements: true,
    preserveImportant: true,
    resolveCSSVariables: false,
    removeStyleTags: true,
  });
  const document = new DOMParser().parseFromString(inlined, "text/html");
  const root = document.body.querySelector("[data-html-fragment-root]");
  return sanitizeHtmlFragment(root?.innerHTML || "");
}

function decorateThemeHtml(html: string, theme: ThemeName) {
  if (theme !== "lime") return html;

  const document = new DOMParser().parseFromString(html, "text/html");
  document.querySelectorAll("h2").forEach((heading, index) => {
    const number = document.createElement("span");
    number.className = "section-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const title = document.createElement("span");
    title.className = "section-title";
    while (heading.firstChild) title.appendChild(heading.firstChild);

    heading.append(number, title);
  });
  return document.body.innerHTML;
}

function wrapLimeTheme(body: string) {
  return `<section style="position: static; will-change: transform; box-sizing: border-box;"><section style="margin: 50px 0% 10px; text-align: left; justify-content: flex-start; display: flex; flex-flow: row; will-change: transform; position: static; box-sizing: border-box;"><section style="display: inline-block; width: 100%; vertical-align: top; border-style: solid; border-width: 1px;  border-color: rgba(220, 220, 220, 0.5); padding: 10px; align-self: flex-start; flex: 0 0 auto; box-sizing: border-box;"><section style="position: static; transform: rotateZ(342.56deg); -webkit-transform: rotateZ(342.56deg); -moz-transform: rotateZ(342.56deg); -o-transform: rotateZ(342.56deg); box-sizing: border-box;"><section style="margin: -87px 0% 0px; font-size: 13px; transform: translate3d(-5px, 0px, 0px); -webkit-transform: translate3d(-5px, 0px, 0px); -moz-transform: translate3d(-5px, 0px, 0px); -o-transform: translate3d(-5px, 0px, 0px); position: static; box-sizing: border-box;"><section style="width: 5em; height: 5em; margin: auto; display: inline-block; vertical-align: bottom; text-align: center; border-radius: 100%; box-shadow: rgb(170, 170, 170) 0px 0px 10px; background-color: #C2F54A; box-sizing: border-box;"><section style="display: table; width: 100%; height: 5em; box-sizing: border-box;"><section style="display: table-cell; vertical-align: middle; width: 100%; line-height: 1.1; color: rgb(0, 0, 0); font-size: 32px; padding: 10px; box-sizing: border-box;"><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><b style="box-sizing: border-box;"><span leaf="">事</span></b></p></section></section></section></section></section><section style="margin: 35px 0% 10px; position: static; box-sizing: border-box;"><section style="text-align: center; font-size: 18px; box-sizing: border-box;"><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">暗黑料理界又出新品!</span></strong></p><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><b style="box-sizing: border-box;"><span leaf="">来自日本的“带电”乌冬面(图)</span></b></p></section></section>${body}</section></section></section>`;
}

function removeUnsafeWechatAttributes(root: HTMLElement) {
  root.querySelectorAll("script, style, iframe, form, input, button").forEach((node) => node.remove());
  root.querySelectorAll("div").forEach((node) => {
    const section = node.ownerDocument.createElement("section");
    [...node.attributes].forEach((attribute) => section.setAttribute(attribute.name, attribute.value));
    while (node.firstChild) section.appendChild(node.firstChild);
    node.replaceWith(section);
  });
  root.querySelectorAll("img[src], a[href]").forEach((node) => {
    const urlAttribute = node.tagName === "IMG" ? "src" : "href";
    const value = node.getAttribute(urlAttribute);
    if (value?.startsWith("//")) node.setAttribute(urlAttribute, `https:${value}`);
  });
  root.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const safeAttributes = new Set([
        "style", "href", "src", "srcset", "alt", "title",
        "width", "height", "target", "rel", "colspan", "rowspan",
      ]);
      if (!safeAttributes.has(attribute.name.toLowerCase())) node.removeAttribute(attribute.name);
      if (attribute.name.toLowerCase() === "style") {
        node.setAttribute("style", attribute.value.replace(/url\((["']?)\/\//gi, "url($1https://"));
      }
    });
  });
  root.querySelectorAll('a[href^="#"]').forEach((link) => link.removeAttribute("href"));
}

async function composeContent(markdown: string, topHtml: string, bottomHtml: string, theme: ThemeName) {
  const [safeTopHtml, markdownHtml, safeBottomHtml] = await Promise.all([
    renderHtmlFragment(topHtml),
    renderMarkdown(markdown),
    renderHtmlFragment(bottomHtml),
  ]);
  const decoratedHtml = decorateThemeHtml(markdownHtml, theme);
  const themedMarkdown = theme === "lime"
    ? wrapLimeTheme(`<section class="lime-body">${decoratedHtml}</section>`)
    : decoratedHtml;
  return `<section data-content-block="top">${safeTopHtml}</section>${themedMarkdown}<section data-content-block="bottom">${safeBottomHtml}</section>`;
}

async function buildWechatHtml(markdown: string, topHtml: string, bottomHtml: string, theme: ThemeName) {
  const safeHtml = await composeContent(markdown, topHtml, bottomHtml, theme);
  const { default: juice } = await import("juice");
  const inlined = juice(`<style>${THEMES[theme].css}</style><section id="wechat-content">${safeHtml}</section>`, {
    inlinePseudoElements: true,
    preserveImportant: true,
    resolveCSSVariables: false,
    removeStyleTags: true,
  });
  const document = new DOMParser().parseFromString(inlined, "text/html");
  const themedRoot = theme === "lime" ? document.body.querySelector(".lime-body") : null;
  removeUnsafeWechatAttributes(document.body);
  const processedHtml = document.body.innerHTML;
  if (theme === "lime" && themedRoot) {
    const heading = themedRoot.querySelector("h1, h2, h3");
    const paragraph = themedRoot.querySelector("p");
    if ((heading && !heading.hasAttribute("style")) || (paragraph && !paragraph.hasAttribute("style"))) {
      throw new Error("荧光资讯主题未完成样式内联");
    }
  }
  return {
    html: processedHtml,
    text: document.body.textContent || "",
  };
}

function fallbackRichCopy(html: string, plainText: string) {
  let wroteRichHtml = false;
  const handleCopy = (event: ClipboardEvent) => {
    if (!event.clipboardData) return;
    event.clipboardData.setData("text/html", html);
    event.clipboardData.setData("text/plain", plainText);
    event.preventDefault();
    wroteRichHtml = true;
  };

  const container = document.createElement("div");
  container.innerHTML = html;
  container.contentEditable = "true";
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#000000";
  document.body.appendChild(container);

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(container);
  selection?.removeAllRanges();
  selection?.addRange(range);
  container.focus();
  document.addEventListener("copy", handleCopy, { once: true });
  const succeeded = document.execCommand("copy");
  document.removeEventListener("copy", handleCopy);
  selection?.removeAllRanges();
  container.remove();
  return succeeded && wroteRichHtml;
}

export default function Home() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [topHtml, setTopHtml] = useState("");
  const [bottomHtml, setBottomHtml] = useState("");
  const [theme, setTheme] = useState<ThemeName>("clean");
  const [status, setStatus] = useState("复制到公众号");
  const [busy, setBusy] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const characters = markdown.replace(/\s/g, "").length;

  const applyMarkdown = useCallback((action: MarkdownAction) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.slice(start, end);
    let replaceStart = start;
    let replaceEnd = end;
    let replacement = selectedText;
    let nextSelectionStart = start;
    let nextSelectionEnd = end;

    const wrapSelection = (before: string, after: string, placeholder: string) => {
      const content = selectedText || placeholder;
      replacement = `${before}${content}${after}`;
      nextSelectionStart = start + before.length;
      nextSelectionEnd = nextSelectionStart + content.length;
    };

    if (["heading", "quote", "unordered-list", "ordered-list"].includes(action)) {
      replaceStart = markdown.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
      const followingBreak = markdown.indexOf("\n", end);
      replaceEnd = followingBreak === -1 ? markdown.length : followingBreak;
      const block = markdown.slice(replaceStart, replaceEnd);
      const placeholder = action.includes("list") ? "列表项" : action === "heading" ? "小标题" : "引用内容";
      const lines = (block || placeholder).split("\n");

      if (action === "unordered-list") {
        const isList = lines.every((line) => !line.trim() || /^\s*[-*+]\s+/.test(line));
        replacement = lines.map((line) => isList ? line.replace(/^(\s*)[-*+]\s+/, "$1") : `- ${line}`).join("\n");
      } else if (action === "ordered-list") {
        const isList = lines.every((line) => !line.trim() || /^\s*\d+[.)]\s+/.test(line));
        replacement = lines.map((line, index) => isList ? line.replace(/^(\s*)\d+[.)]\s+/, "$1") : `${index + 1}. ${line}`).join("\n");
      } else {
        const prefix = action === "heading" ? "## " : "> ";
        const prefixPattern = action === "heading" ? /^(\s*)#{1,6}\s+/ : /^(\s*)>\s+/;
        const hasPrefix = lines.every((line) => !line.trim() || prefixPattern.test(line));
        replacement = lines.map((line) => hasPrefix ? line.replace(prefixPattern, "$1") : `${prefix}${line}`).join("\n");
      }

      nextSelectionStart = replaceStart;
      nextSelectionEnd = replaceStart + replacement.length;
    } else if (action === "bold") {
      wrapSelection("**", "**", "粗体文字");
    } else if (action === "italic") {
      wrapSelection("*", "*", "斜体文字");
    } else if (action === "code") {
      wrapSelection("`", "`", "代码");
    } else if (action === "link") {
      const text = selectedText || "链接文字";
      replacement = `[${text}](https://)`;
      nextSelectionStart = start + text.length + 3;
      nextSelectionEnd = nextSelectionStart + 8;
    }

    setMarkdown(`${markdown.slice(0, replaceStart)}${replacement}${markdown.slice(replaceEnd)}`);
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextSelectionStart, nextSelectionEnd);
    });
  }, [markdown]);

  useEffect(() => {
    let active = true;
    composeContent(markdown, topHtml, bottomHtml, theme).then((html) => {
      if (active) {
        setPreviewHtml(html);
      }
    });
    return () => {
      active = false;
    };
  }, [markdown, topHtml, bottomHtml, theme]);

  const copyToWechat = useCallback(async () => {
    setBusy(true);
    setStatus("正在整理样式…");
    const contentPromise = buildWechatHtml(markdown, topHtml, bottomHtml, theme);

    try {
      if (window.isSecureContext && navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
        const clipboardItem = new ClipboardItem({
          "text/html": contentPromise.then(
            (content) => new Blob([content.html], { type: "text/html" }),
          ),
          "text/plain": contentPromise.then(
            (content) => new Blob([content.text], { type: "text/plain" }),
          ),
        });
        await navigator.clipboard.write([clipboardItem]);
      } else {
        const content = await contentPromise;
        if (!fallbackRichCopy(content.html, content.text)) {
          throw new Error("浏览器未写入富文本剪贴板");
        }
      }
      const copiedContent = await contentPromise;
      if (!copiedContent.html.includes("style=")) {
        throw new Error("浏览器不允许访问剪贴板");
      }
      setStatus("已复制，去公众号粘贴");
    } catch (error) {
      console.error(error);
      try {
        const content = await contentPromise;
        if (!fallbackRichCopy(content.html, content.text)) throw error;
        setStatus("已复制，去公众号粘贴");
      } catch {
        setStatus("富文本复制失败，请使用 Chrome 重试");
      }
    } finally {
      setBusy(false);
      window.setTimeout(() => setStatus("复制到公众号"), 3200);
    }
  }, [markdown, topHtml, bottomHtml, theme]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">M</span>
          <div>
            <h1>公众号排版器</h1>
            <p>Markdown 写作，微信富文本粘贴</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="local-note">内容仅在当前浏览器处理</span>
          <button className="copy-button" disabled={busy || !markdown.trim() && !topHtml.trim() && !bottomHtml.trim()} onClick={copyToWechat}>
            <span className="copy-icon">{busy ? "···" : "⌘"}</span>
            {status}
          </button>
        </div>
      </header>

      <section className="toolbar" aria-label="排版设置">
        <div className="theme-picker">
          <span className="toolbar-label">排版主题</span>
          {(Object.keys(THEMES) as ThemeName[]).map((name) => (
            <button
              key={name}
              className={`theme-chip ${theme === name ? "active" : ""}`}
              onClick={() => setTheme(name)}
              aria-pressed={theme === name}
            >
              <span className="theme-dot" style={{ background: THEMES[name].color }} />
              {THEMES[name].label}
            </button>
          ))}
        </div>
        <div className="stats"><strong>{characters}</strong> 字 · 约 {Math.max(1, Math.ceil(characters / 500))} 分钟阅读</div>
      </section>

      <section className="workspace">
        <div className="editor-column">
          <article className="pane html-pane">
            <div className="html-pane-heading">
              <div><span className="eyebrow">BEFORE</span><h2>顶部 HTML</h2></div>
              <span>展示在正文之前</span>
            </div>
            <textarea
              id="top-html"
              aria-label="顶部 HTML 编辑区"
              value={topHtml}
              onChange={(event) => setTopHtml(event.target.value)}
              placeholder={'<section style="text-align:center">顶部内容</section>'}
              spellCheck={false}
            />
          </article>

          <article className="pane editor-pane">
            <div className="pane-heading">
              <div><span className="eyebrow">WRITE</span><h2>Markdown 正文</h2></div>
              <button className="quiet-button" onClick={() => { setTopHtml(""); setMarkdown(""); setBottomHtml(""); }}>全部清空</button>
            </div>
            <div className="markdown-toolbar" role="toolbar" aria-label="Markdown 快捷格式">
              {MARKDOWN_TOOLS.map((tool) => (
                <button
                  key={tool.action}
                  type="button"
                  className={`markdown-tool markdown-tool-${tool.action}`}
                  title={tool.title}
                  aria-label={tool.title}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applyMarkdown(tool.action)}
                >
                  {tool.label}
                </button>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              className="markdown-input"
              aria-label="Markdown 编辑区"
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              spellCheck={false}
            />
          </article>

          <article className="pane html-pane">
            <div className="html-pane-heading">
              <div><span className="eyebrow">AFTER</span><h2>底部 HTML</h2></div>
              <span>展示在正文之后</span>
            </div>
            <textarea
              id="bottom-html"
              aria-label="底部 HTML 编辑区"
              value={bottomHtml}
              onChange={(event) => setBottomHtml(event.target.value)}
              placeholder={'<section style="text-align:center">底部内容</section>'}
              spellCheck={false}
            />
          </article>
        </div>

        <article className="pane preview-pane">
          <div className="pane-heading">
            <div><span className="eyebrow">PREVIEW</span><h2>公众号预览</h2></div>
            <span className="phone-width">375 px</span>
          </div>
          <div className="preview-scroll">
            <div className="phone-paper">
              <style>{THEMES[theme].css}</style>
              <section id="wechat-content" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </div>
        </article>
      </section>

      <footer className="footer-note">
        <span className="status-dot" /> 粘贴后请在公众号后台使用手机预览；复杂 CSS、外链和本地图片可能被微信过滤。
      </footer>
    </main>
  );
}
