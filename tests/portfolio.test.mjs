import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the redesigned portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Ma Shun Ngai George/i);
  assert.match(html, /The idea begins as a small form/);
  assert.match(html, /Work Index/);
  assert.match(html, /Photography/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/i);
});

test("keeps the portfolio semantic, responsive and image-led", async () => {
  const [page, orbit, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/photo-orbit.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(page, /<main id="top">/);
  assert.match(page, /aria-label="Primary navigation"/);
  assert.match(orbit, /aria-roledescription="carousel"/);
  assert.match(orbit, /Pause orbit/);
  assert.match(orbit, /aria-modal="true"/);
  assert.match(page, /loading=.*lazy/);
  assert.match(css, /grid-template-columns:repeat\(12/);
  assert.match(css, /@media\(max-width:620px\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /border-radius:0/);
  assert.doesNotMatch(css, /box-shadow|linear-gradient|radial-gradient/i);
});
