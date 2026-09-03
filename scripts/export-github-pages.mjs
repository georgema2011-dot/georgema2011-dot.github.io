import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";

const projectIds = ["japandi", "masks", "union", "watergrounds", "asda", "sca-lab", "eye-accessories"];

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("static-export", Date.now().toString());
const { default: worker } = await import(workerUrl.href);

async function render(pathname) {
 const response = await worker.fetch(
  new Request(`https://georgema2011-dot.github.io${pathname}`, {
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

 if (!response.ok) throw new Error(`Static render failed for ${pathname} with HTTP ${response.status}`);
 return response.text();
}

const html = await render("/");
if (!html.includes("Ma Shun Ngai George")) {
  throw new Error("Static render did not contain the portfolio content");
}

await writeFile(new URL("../dist/client/index.html", import.meta.url), html);
await writeFile(new URL("../dist/client/.nojekyll", import.meta.url), "");
await rm(new URL("../dist/client/.DS_Store", import.meta.url), { force: true });
await copyFile(
  new URL("../dist/client/index.html", import.meta.url),
  new URL("../dist/client/404.html", import.meta.url),
);

for (const id of projectIds) {
  const projectHtml = await render(`/projects/${id}`);
  if (!projectHtml.includes("Project") || !projectHtml.includes("All projects")) {
    throw new Error(`Project render was incomplete: ${id}`);
  }
  const output = new URL(`../dist/client/projects/${id}/`, import.meta.url);
  await mkdir(output, { recursive: true });
  await writeFile(new URL("index.html", output), projectHtml);
}

console.log("Static GitHub Pages export created in dist/client");
