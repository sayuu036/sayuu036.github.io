import { defineConfig } from "vite";
import { resolve } from "path";
import { glob } from "glob";
import { parse } from "marked";

// import mdtohtml from "./mdtohtml.js";

// mdtohtml("README.md", "index.html");

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

export default defineConfig({
  plugins: [
    {
      name: "markdown-html",
      async transform(code, id) {
        if (/\.(md)$/.test(id)) {
          const html = await parse(code);
          return {
            code: `
              export const html = ${JSON.stringify(html)};
              export const md = ${JSON.stringify(code)};
            `,
            map: null,
          };
        }
      },
    },
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
