import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 백엔드 스프링부트 로컬 포트 번호
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
