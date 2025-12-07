import { defineConfig } from "vite";
import { resolve } from "path";
import { glob } from "glob";
import { parse } from "marked";
import fs from "fs";
import path from "path/posix";

// HTMLファイルを自動検出する関数
const getInputFiles = () => {
  const files = glob.sync("page/**/*.html", {
    ignore: ["node_modules/**", "dist/**"],
  });

  const input = { index: resolve(__dirname, "index.html") };
  files.forEach((file) => {
    const name = file.replace(/\.html$/, "").replace(/\//g, "-");
    input[name] = resolve(__dirname, file);
  });

  return input;
};

const mdtohtml = (mdpath, path) => {
  const md = fs.readFileSync(resolve(__dirname, path, mdpath), "utf-8");
  const html = parse(md);
  return html;
};

const htmlPlugin = () => {
  return {
    name: "html-transform",
    enforce: "pre",
    transformIndexHtml(html, ctx) {
      console.log(path.dirname(ctx.path));
      const p = path.dirname(ctx.path.slice(1));
      console.log(resolve(__dirname, p));
      const h = html.replace(
        /<!--import markdown (.*?)-->/,
        (match, ...args) => {
          const md = mdtohtml(args[0], p);
          return md;
        },
      );
      return h;
    },
  };
};

export default defineConfig({
  plugins: [htmlPlugin()],
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      input: getInputFiles(),
    },
  },
});
