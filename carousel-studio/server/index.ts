import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import { existsSync } from "node:fs";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import app from "./app.js";

const hasDist = existsSync("./dist");

if (hasDist) {
  app.use("*", async (c, next) => {
    if (c.req.path.startsWith("/api/")) return next();
    return serveStatic({ root: "./dist" })(c, next);
  });
  app.get("*", async (c, next) => {
    if (c.req.path.startsWith("/api/")) return next();
    return serveStatic({ path: "./dist/index.html" })(c, next);
  });
}

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Carousel Studio API on http://127.0.0.1:${info.port}`);
  if (hasDist) console.log("Serving the production build from ./dist");
});
