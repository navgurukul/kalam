import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

const commonConfig = {
  server: { port: 8080 },
};

export default defineConfig(({ command, mode }) => {
  console.log(command, mode);
  if (command === "serve") {
    return {
      ...commonConfig,
      plugins: [react()],
      build: {
        outDir: "dev-dist",
      },
    };
  }
  return {
    ...commonConfig,
    plugins: [react()],
    build: {
      outDir: "dist",
    },
  };
});
