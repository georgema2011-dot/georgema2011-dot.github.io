import { copyFile, writeFile } from "node:fs/promises";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("static-export", Date.now().toString());
const { default: worker } = await import(workerUrl.href);

const response = await worker.fetch(
  new Request("https://georgema2011-dot.github.io/", {
    headers: { accept: "text/html" },
  }),
  {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  },
  {
    waitUntil() {},
    passThroughOnException() {},
  },
);

if (!response.ok) {
  throw new Error(`Static render failed with HTTP ${response.status}`);
}

const html = await response.text();
if (!html.includes("Ma Shun Ngai George")) {
  throw new Error("Static render did not contain the portfolio content");
}

await writeFile(new URL("../dist/client/index.html", import.meta.url), html);
await writeFile(new URL("../dist/client/.nojekyll", import.meta.url), "");
await copyFile(
  new URL("../dist/client/index.html", import.meta.url),
  new URL("../dist/client/404.html", import.meta.url),
);

console.log("Static GitHub Pages export created in dist/client");
