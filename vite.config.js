import { defineConfig } from "vite";
// import { resolve } from "path";
import path from "node:path";
import { glob } from "glob";
import { parse } from "marked";
import fs from "fs";

// HTMLファイルを自動検出する関数
const getInputFiles = () => {
  const files = glob.sync("*.html", {
    ignore: ["node_modules/**", "dist/**"],
  });

  const input = { index: path.resolve(__dirname, "index.html") };
  files.forEach((file) => {
    const name = file.replace(/\.html$/, "").replace(/\//g, "-");
    input[name] = path.resolve(__dirname, file);
  });

  console.log(input);
  return input;
};

const mdtohtml = (p) => {
  let text = fs.readFileSync(p, "utf-8");
  if (path.extname(p) == ".js") {
    text = "```javascript\n" + text + "\n```";
  }
  // console.log(path.extname(p));
  // console.log("```javascript\n" + text + "```");
  const html = parse(text);
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
        const t = mdtohtml(path.resolve(__dirname, p, r[1]));
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
