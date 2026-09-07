import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// In dev this server is the single origin the browser sees. It serves the public
// site itself and proxies the two halves of the internal tracker:
//   /app  -> the tracker's Vite on 5177 (it builds with base "/app/")
//   /api  -> the tracker's Express API on 4300
// Same origin means the session cookie set at /app/login is sent on every /api
// call with no CORS anywhere. In production one Express process does the same job.
// See neuro_backend/server/src/index.ts.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:4300", changeOrigin: true },
      // ws: the tracker's hot reload socket is under /app too.
      "/app": { target: "http://localhost:5177", changeOrigin: true, ws: true },
    },
  },
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 900,
  },
});
