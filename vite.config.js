import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function spaFallback() {
  return {
    name: "spa-fallback",
    closeBundle() {
      const dist = path.resolve("dist");
      const index = path.join(dist, "index.html");
      if (!fs.existsSync(index)) return;
      fs.copyFileSync(index, path.join(dist, "404.html"));
      fs.writeFileSync(path.join(dist, "_redirects"), "/*    /index.html   200\n");
    },
  };
}

export default defineConfig({
  plugins: [react(), spaFallback()],
  appType: "spa",
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
      "/uploads": "http://localhost:4000",
      "/images": "http://localhost:4000",
    },
  },
});
