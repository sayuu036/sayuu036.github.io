import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { markdownToSimpleHtml } from "zenn-markdown-html";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default (mdpath, htmlpath) => {
  const md = fs.readFileSync(resolve(__dirname, mdpath), "utf-8");
  const parsedmd = markdownToSimpleHtml(md);

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>index</title>
</head>
<body>
${parsedmd}
</body>
</html>
`;
  fs.writeFile(htmlpath, html, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`generate complete: ${mdpath} to ${htmlpath}`);
    }
  });
};
