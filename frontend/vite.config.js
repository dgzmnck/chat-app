import fs from "fs";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync("./etc/sslcert/site.key"),
      cert: fs.readFileSync("./etc/sslcert/site.pem.crt"),
    },
    host: "localhost",
    port: 5173,
  },
});

// vite.config.js
