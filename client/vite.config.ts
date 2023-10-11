import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  server: { https: true },
  plugins: [
    react(),
    basicSsl(),
    VitePWA({
      registerType: "prompt",
      // add this to cache all the imports
      workbox: {
        globPatterns: ["**/*"],
      },
      // add this to cache all the
      // static assets in the public folder
      includeAssets: ["**/*"],
      manifest: {
        orientation: "portrait",
        theme_color: "#f69435",
        background_color: "#f69435",
        display: "fullscreen",
        scope: "/",
        start_url: "/",
        short_name: "LingoCam",
        description: "LingoCam",
        name: "LingoCam",
        icons: [
          {
            src: "/icons/android-48-48.png",
            sizes: "48x48",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/android-72-72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/icons/android-96-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/icons/android-144-144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/android-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/android-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
