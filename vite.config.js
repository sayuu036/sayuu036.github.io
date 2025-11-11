import { defineConfig } from "vite";
import {resolve} from "path";

export default defineConfig({
    server: {
        port: 3000,
        open: true
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                sub: resolve(__dirname, "test/index.html"),
                sub2: resolve(__dirname, "page_test/index.html")
            }
        }
    }
})