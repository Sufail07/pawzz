import { chromium } from "@playwright/test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const browser = await chromium.launch();
const cases = [
  ["home-375", "/", 375, false],
  ["home-1280", "/", 1280, false],
  ["styleguide", "/styleguide", 1280, false],
  ["privacy", "/privacy", 375, false],
  ["intro-dialog-375", "/", 375, "intro"],
  ["intro-dialog-errors-375", "/", 375, "intro-errors"],
  ["syllabus-dialog-1280", "/", 1280, "syllabus"],
  ["syllabus-success-375", "/", 375, "syllabus-success"],
];

let total = 0;
for (const [name, path, width, mode] of cases) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://127.0.0.1:5173" + path, { waitUntil: "networkidle" });

  const dialog = page.getByRole("dialog");

  if (mode === "intro" || mode === "intro-errors") {
    await page
      .getByRole("banner")
      .getByRole("button", { name: "Book a free intro", exact: true })
      .click();
    await dialog.waitFor();
    if (mode === "intro-errors") {
      await dialog.getByRole("button", { name: /book my free intro/i }).click();
    }
  }

  if (mode === "syllabus" || mode === "syllabus-success") {
    await page.getByRole("button", { name: "Download the syllabus" }).click();
    await dialog.waitFor();
    if (mode === "syllabus-success") {
      await dialog.getByLabel("Full name").fill("Asha");
      await dialog.getByLabel("Email address").fill("asha@example.com");
      await dialog.getByRole("checkbox").check();
      await dialog
        .getByRole("button", { name: /download the syllabus/i })
        .click();
      await dialog
        .getByRole("heading", { name: "Your syllabus is ready" })
        .waitFor();
    }
  }

  await page.waitForTimeout(400);
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(async () =>
    window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    }),
  );
  total += result.violations.length;
  console.log(`\n=== ${name}: ${result.violations.length} violations`);
  for (const violation of result.violations) {
    console.log(`- [${violation.impact}] ${violation.id}: ${violation.help}`);
    for (const node of violation.nodes.slice(0, 3)) {
      console.log(`    ${node.target.join(" ")} :: ${node.failureSummary?.slice(0, 200)}`);
    }
  }
  await page.close();
}

console.log(`\nTotal violations: ${total}`);
if (total > 0) process.exitCode = 1;
await browser.close();
