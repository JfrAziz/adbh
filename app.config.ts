import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "@tanstack/react-start/config";

const app = defineConfig({
  server: {
    preset: "bun",
  },
  vite: {
    plugins: [tsconfigPaths(), tailwindcss()],
  },
  tsr: {
    generatedRouteTree: "./app/route-tree.gen.ts",
  },
  routers: {
    public: {
      dir: "./app/public",
    },
    ssr: {
      entry: "./app/entry-server.ts",
    },
    client: {
      entry: "./app/entry-client.tsx",
    },
  },
});

export default app;
