import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    // Disable advanced CSS optimization
    lightningcss: false,
    // Use a different processor or none at all
    preprocessorOptions: {
      // Your preprocessor options
    }
  }
})