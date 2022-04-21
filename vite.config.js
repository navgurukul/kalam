import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { esbuildCommonjs, viteCommonjs } from "@originjs/vite-plugin-commonjs";
import vitePluginRequire from "vite-plugin-require";
import requireTransform from "vite-plugin-require-transform";

// https://vitejs.dev/config/

const commonConfig = {
  server: { port: 8080 },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildCommonjs(["./src/config/index.js"])],
    },
  },
  plugins: [
    react(),
    viteCommonjs({ exclude: ["./*.{js,jsx}", "./src/*.{js,jsx}"] }),
    requireTransform({ fileRegex: /\src\.js$|.jsx$/ }),
    // vitePluginRequire(),
    // { exclude: ["./*.{js,jsx}", "./src/*.{js,jsx}"] }
  ],
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // if (id.includes("node_modules"))
          //   return id
          //     .toString()
          //     .split("node_modules/")[1]
          //     .split("/")[0]
          //     .toString();
          if (id.includes("node_modules")) {
            // if (id.includes("@mui") || id.includes("@emotion")) {
            //   return "vendor_mui";
            // }
            if (id.includes("mui-datatables")) {
              return "vendor_mui_datatables";
            }
            if (id.includes("react-json-view")) {
              return "vendor_react_json_view";
            }
            // if (id.includes("react-dom")) {
            //   return "vendor_react_dom";
            // }
            if (id.includes("react-player")) {
              return "vendor_react_player";
            }
            if (id.includes("lodash")) {
              return "vendor_lodash";
            }
            if (id.includes("react-easy-edit")) {
              return "vendor_react_easy_edit";
            }
            if (id.includes("axios")) {
              return "vendor_axios";
            }
            if (id.includes("react-hook-form")) {
              return "vendor_react_hook_form";
            }
            if (id.includes("devextreme")) {
              return "vendor_devextreme";
            }
            if (id.includes("devextreme-react")) {
              return "vendor_devextreme_react";
            }
            if (id.includes("react-epic-spinners")) {
              return "vendor_react_epic_spinners";
            }
            // if (id.includes("react-dnd")) {
            //   return "vendor_react_dnd";
            // }
            if (id.includes("react-slick")) {
              return "vendor_react_slick";
            }
            if (id.includes("core-js-pure")) {
              return "vendor_core_js_pure";
            }
            if (id.includes("mui-datatables")) {
              return "vendor_mui_datatables"; //devextreme-react react-epic-spinners react-dnd react-slick core-js-pure
            }
            return "vendor"; // all other package goes here
          }
        },
      },
    },
  },
};

export default defineConfig(({ mode }) => {
  // console.log(command, mode);
  if (mode === "development") {
    return {
      ...commonConfig,
      build: {
        ...commonConfig.build,
        outDir: "dev-dist",
      },
    };
  }
  return {
    resolve: {
      alias: [
        {
          find: /^@mui\/icons-material\/(.*)/,
          replacement: "@mui/icons-material/$1",
        },
        {
          find: /^@mui\/material\/(.+)/,
          replacement: "@mui/material/$1",
        },
        // {
        //   find: /^@mui\/styles\/(.*)/,
        //   replacement: "@mui/styles/es/",
        // },
      ],
    },
    // define: {
    //   global: "window",
    // },
    optimizeDeps: {
      ...commonConfig.optimizeDeps,
    },
    plugins: [...commonConfig.plugins],
    build: {
      // commonjsOptions: {
      //   include: ["./src/config/index.js"],
      //   // exclude: ["./node_modules/"],
      //   // transformMixedEsModules: true,
      //   // esmExternals: true,
      //   requireReturnsDefault: false,
      // },
      ...commonConfig.build,
      outDir: "dist",
    },
  };
});
