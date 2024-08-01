import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { nodePolyfills } from "vite-plugin-node-polyfills";


export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin(), nodePolyfills()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        widget: "./src/widget.tsx",
      },
      output: {
        entryFileNames: (assetInfo) => {
          return assetInfo.name === "widget"
            ? "assets/js/[name].js"
            : "assets/[name].js";
        },
      },
    },
  },
  experimental: {
    renderBuiltUrl(filename: string) {
      return "http://localhost:4173/" + filename;
    },
  },
});
