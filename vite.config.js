import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(command, mode);
  if (command === "serve") {
    return {
      plugins: [react()],
      build: {
        outDir: "dev-dist",
      },
    };
  } else {
    return {
      plugins: [react()],
      build: {
        outDir: "dist",
      },
    };
  }
});
