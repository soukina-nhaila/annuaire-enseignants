import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En développement, les appels /api sont redirigés vers l'API Flask.
// 127.0.0.1 (et non localhost) évite un problème IPv6 avec Node.
const cibleApi = process.env.VITE_PROXY_TARGET || "http://127.0.0.1:5000";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            "/api": { target: cibleApi, changeOrigin: true },
        },
    },
});