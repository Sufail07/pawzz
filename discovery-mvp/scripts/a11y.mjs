import { chromium } from "@playwright/test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const browser = await chromium.launch();
const cases = [
  ["home-osm", "/", "osm", 375],
  ["results-osm", "/results?location=Kochi", "osm", 375],
  ["profile-osm", "/provider/osm-way-619341207", "osm", 375],
  ["home-sample", "/", "sample", 1280],
  ["results-sample", "/results?location=Bengaluru&type=hospital", "sample", 1280],
  ["profile-sample", "/provider/cochin-pet-hospital", "sample", 375],
  ["forms", "/list-business", "sample", 1280],
  ["correction", "/correction?provider=rapid-paws-ambulance", "sample", 375],
];
for (const [name, path, mode, width] of cases) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.addInitScript((m) => localStorage.setItem("pawzz.datasource.v1", m), mode);
  await page.goto("http://127.0.0.1:5173" + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(async () => window.axe.run(document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  }));
  console.log(`\n=== ${name}: ${result.violations.length} violations`);
  for (const v of result.violations) {
    console.log(`- [${v.impact}] ${v.id}: ${v.help}`);
    for (const node of v.nodes.slice(0, 3)) console.log(`    ${node.target.join(" ")} :: ${node.failureSummary?.slice(0, 160)}`);
  }
  await page.close();
}
await browser.close();
