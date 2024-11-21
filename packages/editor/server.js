import fs from "node:fs/promises";
import express from "express";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || "3008";
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction ? await fs.readFile("./dist/client/index.html", "utf-8") : "";
const ssrManifest = isProduction
  ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
  : undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// Local image search for testing
app.get("/api/v1/search-images", (req, res) => {
  console.log("params", req.query);
  if (req.query.orientation === "all") {
    // biome-ignore lint/performance/noDelete: <explanation>
    delete req.query.orientation;
  }
  const params = new URLSearchParams({
    per_page: "20",
    content_filter: "high",
    ...req.query,
  });
  params.set("client_id", process.env.UNSPLASH_ACCESS_KEY);
  fetch(`https://api.unsplash.com/search/photos?${params}`, {
    headers: {
      "Accept-Version": "v1",
    },
  })
    .then(async (response) => {
      const data = await response.json();
      if (data.errors) {
        return res.json({ error: data.errors[0] });
      }
      res.json(data);
    })
    .catch((error) => {
      res.json({ error });
    });
});

// Serve HTML
app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    const rendered = await render(req, ssrManifest);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "");

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.message);
  }
});

// Start http server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
