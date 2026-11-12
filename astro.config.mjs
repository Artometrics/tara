import { defineConfig } from "astro/config";

// Static prototype. No adapter, no server, no remote form endpoint.
export default defineConfig({
  trailingSlash: "ignore",
  build: {
    format: "directory",
  },
});
