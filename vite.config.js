import { defineConfig } from "vite";
import { resolve } from "path";
import { glob } from "glob";
import { parse } from "marked";
import fs from "fs";

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
  console.log(input);

  return input;
};

const mdtohtml = (mdpath) => {
  const md = fs.readFileSync(resolve(__dirname, mdpath), "utf-8");
  const html = parse(md);
  return html;
};

const htmlPlugin = () => {
  return {
    name: "html-transform",
    enforce: "pre",
    transformIndexHtml(html) {
      const h = html.replace(
        /<!--import markdown (.*?)-->/g,
        (match, ...args) => {
          console.log(args[0]);
          const md = mdtohtml(args[0]);
          console.log(md);
          return md;
          // return "hello";
        },
      );
      return h;
    },
  };
};

export default defineConfig({
  plugins: [
    htmlPlugin(),
    // {
    //   name: "markdown-html",
    //   async transform(code, id) {
    //     if (/\.(md)$/.test(id)) {
    //       const html = await parse(code);
    //       return {
    //         code: `
    //           export const html = ${JSON.stringify(html)};
    //           export const md = ${JSON.stringify(code)};
    //         `,
    //         map: null,
    //       };
    //     }
    //   },
    // },
  ],
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      input: getInputFiles(),
    },
  },
});
