import { defineConfig } from "vite";
import { resolve } from "path";
import { glob } from "glob";

// HTMLファイルを自動検出する関数
const getInputFiles = () => {
  const files = glob.sync("page/**/*.html", {
    ignore: ["node_modules/**", "dist/**"],
  });

  const input = {};
  files.forEach((file) => {
    const name = file.replace(/\.html$/, "").replace(/\//g, "-");
    input[name] = resolve(__dirname, file);
  });
  console.log(input);

  return input;
};

export default defineConfig({
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      input: getInputFiles(),
    },
  },
});
