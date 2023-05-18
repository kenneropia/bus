/// <reference types="vite/client" />

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  build: {
    rollupOptions: {
      input: {
        app: fileURLToPath(new URL("./index.html", import.meta.url)),
        landing: fileURLToPath(new URL("./landing.html", import.meta.url)),
      },
    },
  },
  server: {
    port: Number(process.env.PORT) || 3030,
  },
  preview: {
    port: Number(process.env.PORT) || 8080,
  },
});
