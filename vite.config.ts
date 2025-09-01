import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr"

export default defineConfig({
  plugins: [tailwindcss(), react(), svgr({
    svgrOptions: {
      replaceAttrValues: {
        '#000000': "{props.color}", // In my project, all icons are black by default so I just stick to replacing black colors
      },
    },
    include: "**/*.svg?react"
  })],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
