import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), visualizer({ open: true })],
  build: {
    rollupOptions: {
      output: {
        // manualChunks: {
        //   contract: ["@shared/contract/src"],
        // },
        manualChunks(id) {
          if (id.includes("zod")) {
            return "zod";
          }
        },
      },
    },
  },
});
