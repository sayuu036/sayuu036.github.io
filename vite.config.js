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

const mdtohtml = (path) => {
  const md = fs.readFileSync(path, "utf-8");
  const html = parse(md);
  return html;
};

const htmlPlugin = () => {
  return {
    name: "html-transform",
    enforce: "pre",
    transformIndexHtml(html, ctx) {
      const p = path.dirname(ctx.path.slice(1));
      const reg = /<!--import markdown (.*?)-->/dg;
      let r;
      let html2 = "";
      let i = 0;
      while ((r = reg.exec(html))) {
        // console.log(r);
        // console.log(resolve(__dirname, p, r[1]));
        const t = mdtohtml(resolve(__dirname, p, r[1]));
        html2 = html2 + html.substring(i, r.indices[0][0]) + t;
        i = r.indices[0][1];
      }
      html2 = html2 + html.substring(i);
      return html2;
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
