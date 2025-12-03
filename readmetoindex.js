import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Source - https://stackoverflow.com/a
// Posted by AMS777, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-03, License - CC BY-SA 4.0

import { markdownToSimpleHtml } from "zenn-markdown-html";
import lib from "zenn-markdown-html";
import fs from "fs";
import { resolve } from "path";
const text = fs.readFileSync(resolve(__dirname, "./README.md"), "utf-8");
// console.log(text);
let html = markdownToSimpleHtml(text);
html = lib.default(text);

console.log(html);

fs.writeFile("./index.html", html, (err) => {
  if (err) {
    cosole.error(err);
  } else {
    console.log("file writing successfully");
  }
});
