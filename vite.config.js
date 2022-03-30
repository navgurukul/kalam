import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { esbuildCommonjs, viteCommonjs } from "@originjs/vite-plugin-commonjs";

// https://vitejs.dev/config/

const commonConfig = {
  server: { port: 8080 },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildCommonjs(["./src/config/index.js"])],
    },
  },
  plugins: [react(), viteCommonjs({ exclude: ["./src/*.{js,jsx}"] })],
};

export default defineConfig(({ mode }) => {
  // console.log(command, mode);
  if (mode === "development") {
    return {
      ...commonConfig,
      build: {
        outDir: "dev-dist",
      },
    };
  }
  return {
    ...commonConfig,
    build: {
      outDir: "dist",
    },
  };
});
