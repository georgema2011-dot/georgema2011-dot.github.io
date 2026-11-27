import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
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

async function renderPath(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test-project", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
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
  assert.match(html, /I design spaces, products and services around real behaviour/);
  assert.match(html, /The idea begins as a small form/);
  assert.match(html, /class="trio-grid"/);
  assert.match(html, /All .*11.* projects/);
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
  assert.match(await (await render()).text(), /aria-roledescription="carousel"/);
  assert.match(page, /Pause project carousel/);
  assert.match(page, /\),8000\)/);
  assert.match(orbit, /Pause orbit/);
  assert.match(orbit, /aria-modal="true"/);
  const projectResponse = await renderPath("/projects/japandi");
  assert.equal(projectResponse.status, 200);
  const projectHtml = await projectResponse.text();
  assert.match(projectHtml, /Japandi Retreat/);
  assert.match(projectHtml, /All projects/);
  assert.match(projectHtml, /loading=.*lazy/);
  const somepenResponse = await renderPath("/projects/somepen");
  assert.equal(somepenResponse.status, 200);
  const somepenHtml = await somepenResponse.text();
  assert.match(somepenHtml, /Four colours\. One movement\./);
  assert.match(somepenHtml, /Interactive model/);
  const hipResponse = await renderPath("/projects/hip-reduction-simulator");
  assert.equal(hipResponse.status, 200);
  const hipHtml = await hipResponse.text();
  assert.match(hipHtml, /Hip Reduction Simulator/);
  assert.match(hipHtml, /hip-reduction-simulator-presentation\.pdf/);
  assert.equal((hipHtml.match(/class="board-view"/g) ?? []).length, 6);
  const coopResponse = await renderPath("/projects/nus-coop");
  assert.equal(coopResponse.status, 200);
  const coopHtml = await coopResponse.text();
  assert.match(coopHtml, /Turning retail touchpoints into a campus service\./);
  assert.match(coopHtml, /Unimplemented concept proposal/);
  assert.match(coopHtml, /View full proposal/);
  const bridgeResponse = await renderPath("/projects/visual-bridge");
  assert.equal(bridgeResponse.status, 200);
  const bridgeHtml = await bridgeResponse.text();
  assert.match(bridgeHtml, /ACL Visualisation through the Visio Pro/);
  assert.match(bridgeHtml, /https:\/\/youtu.be\/hFE74-Hjoec/);
  assert.match(bridgeHtml, /Academic prototype/);
  assert.equal((bridgeHtml.match(/class="board-view"/g) ?? []).length, 6);
  assert.match(css, /grid-template-columns:repeat\(12/);
  assert.match(css, /@media\(max-width:620px\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /border-radius:0/);
  assert.doesNotMatch(css, /box-shadow|linear-gradient|radial-gradient/i);
});

test("ships the SOMPEN model as a lazy, locally decoded interactive asset", async () => {
  const viewer = await readFile(new URL("../app/somepen-model-viewer.tsx", import.meta.url), "utf8");
  const model = await stat(new URL("../public/projects/somepen/somepen-v2.glb", import.meta.url));
  assert.match(viewer, /IntersectionObserver/);
  assert.match(viewer, /DRACOLoader/);
  assert.match(viewer, /somepen-v2\.glb/);
  assert.match(viewer, /autoRotate/);
  assert.match(viewer, /prefers-reduced-motion/);
  assert.match(viewer, /Pause motion/);
  assert.match(viewer, /studioKey/);
  assert.match(viewer, /environmentIntensity = 0\.38/);
  assert.match(viewer, /toneMappingExposure = 0\.78/);
  assert.ok(model.size > 1_000_000);
});

test("keeps exactly eleven unique project records", async () => {
  const projectData = await readFile(new URL("../app/projects-data.ts", import.meta.url), "utf8");
  const ids = [...projectData.matchAll(/\{ id:"([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, 11);
  assert.equal(new Set(ids).size, 11);
});

test("publishes recruiter and project metadata with production URLs", async () => {
  const [layout, projectPage] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/projects/[id]/page.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(layout, /https:\/\/georgema2011-dot\.github\.io/);
  assert.match(layout, /Spatial and Industrial Designer/);
  assert.match(layout, /application\/ld\+json/);
  assert.match(projectPage, /generateMetadata/);
  assert.match(projectPage, /CreativeWork/);
});

test("reserves image space across every case study and publishes the clarified Japandi brief", async () => {
  const data = await readFile(new URL("../app/projects-data.ts", import.meta.url), "utf8");
  const ids = [...data.matchAll(/\{ id:"([^"]+)"/g)].map(match => match[1]);
  for (const id of ids) {
    const response = await renderPath(`/projects/${id}`);
    assert.equal(response.status, 200, id);
    const html = await response.text();
    const images = html.match(/<img\b[^>]*>/g) ?? [];
    assert.ok(images.length > 0, `${id} must show project boards`);
    for (const image of images) {
      assert.match(image, /\bwidth="[1-9]\d*"/, `${id} image width`);
      assert.match(image, /\bheight="[1-9]\d*"/, `${id} image height`);
    }
    if (id === "japandi") {
      assert.match(html, /one-room apartment study/);
      assert.match(html, /adjacent area for reading and studying/);
      assert.doesNotMatch(html, /resort room|Hospitality interior/);
    }
  }
});
