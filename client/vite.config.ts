import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // add this to cache all the imports
      workbox: {
        globPatterns: ["**/*"],
      },
      // add this to cache all the
      // static assets in the public folder
      includeAssets: ["**/*"],
      manifest: {
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
            src: "./public/android-48-48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "./public/android-72-72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "./public/android-96-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "./public/android-144-144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "./public/android-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./public/android-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
